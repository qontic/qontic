const GEOMETRY_LIMITS=Object.freeze({wallMin:50,wallMax:1000,distanceMin:50,distanceMax:3000,heightMin:100,heightMax:5000});
export function dragGeometry(start,kind,dx,dy){
 const total=(start.wall??225)+start.distance,L=GEOMETRY_LIMITS;
 const wall=kind==='wall'?Math.max(Math.max(L.wallMin,total-L.distanceMax),Math.min(L.wallMax,total-L.distanceMin,Math.round((start.wall??225)+dx/start.scaleX))):(start.wall??225);
 const distance=kind==='distance'?Math.round(start.distance+dx/start.scaleX):start.distance;
 const height=kind==='height'?Math.round((start.height+2*dy/start.scaleY)/10)*10:start.height;
 return {wall,distance:kind==='wall'?total-wall:Math.max(L.distanceMin,Math.min(L.distanceMax,distance)),height:Math.max(L.heightMin,Math.min(L.heightMax,height))};
}
export function dragSurfaceGeometry(start,kind,worldDelta){
 const total=start.wall+start.distance,clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 if(kind==='wall'){
  const wall=clamp(Math.round(start.wall+worldDelta*total/4),Math.max(start.wallMin,total-start.distanceMax),Math.min(start.wallMax,total-start.distanceMin));
  return {wall,distance:total-wall,height:start.height};
 }
 if(kind==='distance')return {wall:start.wall,distance:clamp(Math.round(start.distance+worldDelta*total/4),start.distanceMin,start.distanceMax),height:start.height};
 if(kind==='height')return {wall:start.wall,distance:start.distance,height:clamp(Math.round((start.height+2*worldDelta*start.height/3)/10)*10,start.heightMin,start.heightMax)};
 if(kind==='separation')return clamp(Math.round(start.separation+2*worldDelta*start.height/3),0,start.maxSeparation);
 return clamp(Math.round((start.width+worldDelta*start.height/(3*start.extentSigma))/5)*5,start.minWidth,start.maxWidth);
}
export function trimTail(path,length){
 // Keeps the last `length` of arc. The running arc length is cached on the path
 // (only segments added since the last call are measured), so a long tail is not
 // re-measured every frame. Same result as walking back from the end.
 if(length<=0){path.length=0;path._sum=0;path._done=0;return;}
 const m=path.length;if(m<2){path._sum=0;path._done=m;path._first=path[0];return;}
 if(path._first!==path[0]||!(path._done<=m)){path._sum=0;path._done=1;}
 let sum=path._sum;
 for(let i=Math.max(1,path._done);i<m;i++){const a=path[i],b=path[i-1];sum+=Math.hypot(a[0]-b[0],a[1]-b[1]);}
 if(sum>length){
  let excess=sum-length,k=0,d=0;
  for(;k+1<m;k++){const a=path[k],b=path[k+1];d=Math.hypot(b[0]-a[0],b[1]-a[1]);if(excess<d)break;excess-=d;}
  const a=path[k],b=path[k+1],f=d>0?excess/d:0;
  path.splice(0,k+1,[a[0]+f*(b[0]-a[0]),a[1]+f*(b[1]-a[1])]);sum=length;
 }
 path._sum=sum;path._done=path.length;path._first=path[0];
}
export function tailOpacity(done,at,now){return done?Math.max(0,1-(now-at)/.8):1;}
export function mountPacketGeometry({host,getGeometry,onCommit,onPreview=()=>{},pause,resume}){
 const layer=document.createElement('div');layer.className='packet-geometry';
 layer.innerHTML='<button type="button" class="packet-detector-drag" aria-label="Move detector screen" title="Drag left or right to move the detector from 50 to 3000 nm beyond the wall; arrow keys also work; changing geometry starts a new record">↔</button><button type="button" class="packet-height-drag" aria-label="Resize screen length" title="Drag up or down to change screen length; arrow keys also work">↕ Length</button><button type="button" class="packet-wall-drag" aria-label="Move slit wall" title="Drag left or right to move the slit wall. The detector stays in place; changing geometry starts a new record. Arrow keys also work.">↔</button><div class="packet-geometry-guide" hidden></div><output class="packet-geometry-value" hidden></output>';
 host.append(layer);const [detector,height,wall]=layer.querySelectorAll('button'),guide=layer.querySelector('div'),value=layer.querySelector('output');let drag=null,previewFrame=null;
 function preview(){if(previewFrame===null)previewFrame=requestAnimationFrame(()=>{previewFrame=null;if(drag)onPreview(drag.next);});}
 function update(){
  const g=getGeometry();if(!g)return;
  layer.hidden=!!g.busy;wall.style.left=(100*g.wallFraction)+'%';
  detector.style.left=(100*g.detectorFraction)+'%';height.style.left=(100*g.detectorFraction)+'%';
  detector.setAttribute('aria-description','Detector distance '+g.distance+' nm. Moving the detector starts a new record.');
  height.setAttribute('aria-description','Screen length '+g.height+' nm. Resizing starts a new record.');
 }
 function finish(commit){
  if(!drag)return;const d=drag;drag=null;guide.hidden=value.hidden=true;
  if(previewFrame!==null){cancelAnimationFrame(previewFrame);previewFrame=null;}
  try{if(commit)onCommit(d.next);}finally{onPreview(null);resume(d.running);update();}
 }
 for(const [button,kind] of [[detector,'distance'],[height,'height'],[wall,'wall']]){
  button.addEventListener('pointerdown',e=>{
   if(e.button!==0||drag)return;e.preventDefault();e.stopPropagation();
   const g=getGeometry();drag={kind,start:g,x:e.clientX,y:e.clientY,next:{wall:g.wall,distance:g.distance,height:g.height},running:pause()};
   button.setPointerCapture(e.pointerId);value.hidden=false;value.textContent=(kind==='wall'?g.wall:kind==='distance'?g.distance:g.height)+' nm';guide.hidden=false;
   guide.style.left=kind==='wall'?wall.style.left:detector.style.left;
  });
  button.addEventListener('pointermove',e=>{
   if(!drag||drag.kind!==kind)return;
   const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.next=dragGeometry(drag.start,kind,dx,dy);preview();
   value.textContent=(kind==='wall'?'Slit wall: '+drag.next.wall:kind==='distance'?'Detector distance: '+drag.next.distance:'Screen length: '+drag.next.height)+' nm';
   if(kind!=='height'){const deltaNm=kind==='wall'?drag.next.wall-drag.start.wall:drag.next.distance-drag.start.distance;guide.style.left=Math.max(0,Math.min(host.clientWidth,(kind==='wall'?drag.start.wallFraction:drag.start.detectorFraction)*host.clientWidth+deltaNm*drag.start.scaleX))+'px';}
  });
  button.addEventListener('pointerup',()=>finish(true));
  button.addEventListener('pointercancel',()=>finish(false));
  button.addEventListener('lostpointercapture',()=>finish(false));
  button.addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.preventDefault();finish(false);return;}
   if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
   e.preventDefault();const g=getGeometry(),step=e.shiftKey?50:10;
   const sign=['ArrowRight','ArrowUp'].includes(e.key)?1:-1;onCommit(dragGeometry(g,kind,sign*step*g.scaleX,(e.key==='ArrowDown'||e.key==='ArrowRight'?1:-1)*step*g.scaleY/2));update();
  });
 }
 return {update,cancel:()=>finish(false)};
}
export function slitWidthFromDrag(width,dy,pixelsPerNm,extentSigma=3,min=30,max=200){
 return Math.max(min,Math.min(max,Math.round((width+dy/(extentSigma*pixelsPerNm))/5)*5));
}
export function mountSlitWidth({host,getState,onPreview,onCommit,pause,resume}){
 const layer=document.createElement('div');layer.className='packet-geometry packet-slit-handles';
 host.append(layer);let drag=null,frame=null;
 const edgeSide=(state,index)=>state.centers[index]*host.clientHeight+state.extentSigma*state.width*state.scaleY>host.clientHeight-30?-1:1;
 const buttons=[0,1].map(index=>{
  const button=document.createElement('button');button.type='button';button.className='packet-slit-width-drag';
  button.textContent='↕ Width';button.setAttribute('aria-label','Resize slit '+(index+1)+' width');
  button.title='Drag vertically to resize the displayed slit cores together. Arrow keys adjust σ; Escape cancels. Changing width starts a new record.';
  layer.append(button);
  const finish=commit=>{if(!drag||drag.index!==index)return;const d=drag;drag=null;if(frame!==null){cancelAnimationFrame(frame);frame=null;}try{onPreview(null);if(commit&&d.next!==d.start.width)onCommit(d.next);}finally{resume(d.running);update();}};
  button.addEventListener('pointerdown',e=>{if(e.button!==0||drag)return;e.preventDefault();e.stopPropagation();const state=getState();if(state.busy)return;drag={index,side:edgeSide(state,index),start:state,y:e.clientY,next:state.width,running:pause()};button.setPointerCapture(e.pointerId);});
  button.addEventListener('pointermove',e=>{if(!drag||drag.index!==index)return;drag.next=slitWidthFromDrag(drag.start.width,(e.clientY-drag.y)*drag.side,drag.start.scaleY,drag.start.extentSigma,drag.start.minWidth,drag.start.maxWidth);if(frame===null)frame=requestAnimationFrame(()=>{frame=null;if(drag){onPreview(drag.next);update();}});});
  button.addEventListener('pointerup',()=>finish(true));button.addEventListener('pointercancel',()=>finish(false));button.addEventListener('lostpointercapture',()=>finish(false));
  button.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finish(false);return;}if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const state=getState(),sign=['ArrowDown','ArrowRight'].includes(e.key)?1:-1;onCommit(Math.max(state.minWidth,Math.min(state.maxWidth,state.width+sign*(e.shiftKey?25:5))));update();});
  return button;
 });
 function update(){
  const state=getState();if(!state)return;layer.hidden=!!state.busy||!state.visible;
  buttons.forEach((button,index)=>{const center=state.centers[index];button.hidden=center===undefined;if(button.hidden)return;const sigma=drag?drag.next:state.width;button.style.left=Math.max(30,state.wallFraction*host.clientWidth-34)+'px';button.style.top=Math.max(14,Math.min(host.clientHeight-14,center*host.clientHeight+(drag&&drag.index===index?drag.side:edgeSide(state,index))*state.extentSigma*sigma*state.scaleY))+'px';button.setAttribute('aria-description','Slit width sigma '+sigma+' nm. Displayed slit cores extend '+state.extentSigma+' sigma from each center.');});
 }
 return {update,cancel:()=>buttons.forEach(button=>button.dispatchEvent(new Event('pointercancel')))};
}


export function slitSeparationFromDrag(start,dy,pixelsPerNm,side,max=2000){
 return Math.max(0,Math.min(max,Math.round(start+2*side*dy/pixelsPerNm)));
}
// Handles sit on the outermost open slits. Slit centres are at sign·separation/2;
// state.signs lists the signs of the open slits (for two slits [-1, 1]). For a
// handle on a slit with |sign| = m, a drag of Δy moves its centre by Δy and the
// separation by 2Δy/m. Older callers pass state.open for two slits.
function signsOf(state){return state.signs??[...(state.open?.[0]?[-1]:[]),...(state.open?.[1]?[1]:[])];}
function outerSign(state,side){const signs=signsOf(state);const v=side<0?Math.min(...signs):Math.max(...signs);return Math.max(1,Math.abs(v));}
export function mountSlitSeparation({host,getState,onPreview,onCommit,pause,resume}){
 const layer=document.createElement('div');layer.className='packet-geometry';host.append(layer);
 let drag=null,frame=null;
 const buttons=[-1,1].map((side,index)=>{
  const button=document.createElement('button');button.type='button';button.className='packet-slit-separation-drag';button.textContent='↕ Sep';
  button.setAttribute('aria-label','Move slit '+(index+1)+' center to change separation');
  button.title='Drag the slit center up or down to change separation. Both centers move symmetrically; slit width stays fixed. Arrow keys adjust separation; Escape cancels. Changing separation starts a new record.';
  layer.append(button);
  function finish(commit){if(!drag||drag.side!==side)return;const d=drag;drag=null;if(frame!==null){cancelAnimationFrame(frame);frame=null;}try{onPreview(null);if(commit&&d.next!==d.start.separation)onCommit(d.next);}finally{resume(d.running);update();}}
  button.addEventListener('pointerdown',e=>{if(e.button!==0||drag)return;const state=getState();if(state.busy)return;e.preventDefault();e.stopPropagation();drag={side,start:state,y:e.clientY,next:state.separation,running:pause()};button.setPointerCapture(e.pointerId);});
  button.addEventListener('pointermove',e=>{if(!drag||drag.side!==side)return;drag.next=slitSeparationFromDrag(drag.start.separation,e.clientY-drag.y,drag.start.scaleY*outerSign(drag.start,side),side,drag.start.maxSeparation);if(frame===null)frame=requestAnimationFrame(()=>{frame=null;if(drag){onPreview(drag.next);update();}});});
  button.addEventListener('pointerup',()=>finish(true));button.addEventListener('pointercancel',()=>finish(false));button.addEventListener('lostpointercapture',()=>finish(false));
  button.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finish(false);return;}if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const state=getState(),sign=['ArrowDown','ArrowRight'].includes(e.key)?1:-1;onCommit(Math.max(0,Math.min(state.maxSeparation,state.separation+side*sign*(e.shiftKey?50:10))));update();});
  return button;
 });
 function update(){const state=getState();layer.hidden=!!state.busy||!state.visible;const sep=drag?drag.next:state.separation;const signs=signsOf(state);buttons.forEach((button,index)=>{const side=index?1:-1,edge=signs.length?(side<0?Math.min(...signs):Math.max(...signs)):0;button.hidden=!signs.length||edge*side<=0;button.style.left=Math.min(host.clientWidth-30,Math.max(30,state.wallFraction*host.clientWidth+44))+'px';button.style.top=Math.max(14,Math.min(host.clientHeight-45,host.clientHeight/2+side*Math.max(14,Math.abs(edge)*sep*state.scaleY/2)))+'px';button.setAttribute('aria-description','Slit separation '+sep+' nm; width unchanged.');});}
 return {update,cancel:()=>buttons.forEach(button=>button.dispatchEvent(new Event('pointercancel')))};
}


// Remaining visible path behind a detected particle; elapsed is simulation time.
export function screenTailLength(length,speed,elapsed,limit){
 return Math.max(0,Math.min(limit,length-speed*Math.max(0,elapsed)));
}
