const GEOMETRY_LIMITS=Object.freeze({wallMin:50,wallMax:1000,distanceMin:50,distanceMax:3000,heightMin:100,heightMax:5000});
export function dragGeometry(start,kind,dx,dy){
 const total=(start.wall??225)+start.distance,L=GEOMETRY_LIMITS;
 const wall=kind==='wall'?Math.max(Math.max(L.wallMin,total-L.distanceMax),Math.min(L.wallMax,total-L.distanceMin,Math.round((start.wall??225)+dx/start.scaleX))):(start.wall??225);
 const distance=kind==='distance'?Math.round(start.distance+dx/start.scaleX):start.distance;
 const height=kind==='height'?Math.round((start.height+2*dy/start.scaleY)/10)*10:start.height;
 return {wall,distance:kind==='wall'?total-wall:Math.max(L.distanceMin,Math.min(L.distanceMax,distance)),height:Math.max(L.heightMin,Math.min(L.heightMax,height))};
}
export function trimTail(path,length){
 if(length<=0){path.length=0;return;}
 let travelled=0;
 for(let i=path.length-1;i>0;i--){
  const a=path[i],b=path[i-1],d=Math.hypot(a[0]-b[0],a[1]-b[1]);
  if(travelled+d>length){const f=(length-travelled)/d;path.splice(0,i,[a[0]+f*(b[0]-a[0]),a[1]+f*(b[1]-a[1])]);return;}
  travelled+=d;
 }
}
export function tailOpacity(done,at,now){return done?Math.max(0,1-(now-at)/.8):1;}
export function mountPacketGeometry({host,getGeometry,onCommit,onPreview=()=>{},pause,resume}){
 const layer=document.createElement('div');layer.className='packet-geometry';
 layer.innerHTML='<button type="button" class="packet-detector-drag" aria-label="Move detector screen" title="Drag left or right to move the detector from 50 to 3000 nm beyond the wall; arrow keys also work; changing geometry starts a new record">↔</button><button type="button" class="packet-height-drag" aria-label="Resize screen height" title="Drag up or down to change screen height; arrow keys also work">↕</button><button type="button" class="packet-wall-drag" aria-label="Move slit wall" title="Drag left or right to move the slit wall. The detector stays in place; changing geometry starts a new record. Arrow keys also work.">↔</button><div class="packet-geometry-guide" hidden></div><output class="packet-geometry-value" hidden></output>';
 host.append(layer);const [detector,height,wall]=layer.querySelectorAll('button'),guide=layer.querySelector('div'),value=layer.querySelector('output');let drag=null,previewFrame=null;
 function preview(){if(previewFrame===null)previewFrame=requestAnimationFrame(()=>{previewFrame=null;if(drag)onPreview(drag.next);});}
 function update(){
  const g=getGeometry();if(!g)return;
  layer.hidden=!!g.busy;wall.style.left=(100*g.wallFraction)+'%';
  detector.style.left=(100*g.detectorFraction)+'%';height.style.left=(100*g.detectorFraction)+'%';
  detector.setAttribute('aria-description','Detector distance '+g.distance+' nm. Moving the detector starts a new record.');
  height.setAttribute('aria-description','Screen height '+g.height+' nm. Resizing starts a new record.');
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
   value.textContent=(kind==='wall'?'Slit wall: '+drag.next.wall:kind==='distance'?'Detector distance: '+drag.next.distance:'Screen height: '+drag.next.height)+' nm';
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
export function slitWidthFromDrag(width,dy,pixelsPerNm){
 return Math.max(30,Math.min(200,Math.round((width+dy/(Math.sqrt(2*Math.log(2))*pixelsPerNm))/5)*5));
}
export function mountSlitWidth({host,getState,onPreview,onCommit,pause,resume}){
 const layer=document.createElement('div');layer.className='packet-geometry packet-slit-handles';
 host.append(layer);let drag=null,frame=null;
 const edgeSide=(state,index)=>state.centers[index]*host.clientHeight+Math.sqrt(2*Math.log(2))*state.width*state.scaleY>host.clientHeight-30?-1:1;
 const buttons=[0,1].map(index=>{
  const button=document.createElement('button');button.type='button';button.className='packet-slit-width-drag';
  button.textContent='↕ Width';button.setAttribute('aria-label','Resize slit '+(index+1)+' width');
  button.title='Drag vertically to resize the slit openings together. Arrow keys adjust width; Escape cancels. Changing width starts a new record.';
  layer.append(button);
  const finish=commit=>{if(!drag||drag.index!==index)return;const d=drag;drag=null;if(frame!==null){cancelAnimationFrame(frame);frame=null;}try{onPreview(null);if(commit&&d.next!==d.start.width)onCommit(d.next);}finally{resume(d.running);update();}};
  button.addEventListener('pointerdown',e=>{if(e.button!==0||drag)return;e.preventDefault();e.stopPropagation();const state=getState();if(state.busy)return;drag={index,side:edgeSide(state,index),start:state,y:e.clientY,next:state.width,running:pause()};button.setPointerCapture(e.pointerId);});
  button.addEventListener('pointermove',e=>{if(!drag||drag.index!==index)return;drag.next=slitWidthFromDrag(drag.start.width,(e.clientY-drag.y)*drag.side,drag.start.scaleY);if(frame===null)frame=requestAnimationFrame(()=>{frame=null;if(drag){onPreview(drag.next);update();}});});
  button.addEventListener('pointerup',()=>finish(true));button.addEventListener('pointercancel',()=>finish(false));button.addEventListener('lostpointercapture',()=>finish(false));
  button.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finish(false);return;}if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const state=getState(),sign=['ArrowDown','ArrowRight'].includes(e.key)?1:-1;onCommit(Math.max(30,Math.min(200,state.width+sign*(e.shiftKey?25:5))));update();});
  return button;
 });
 function update(){
  const state=getState();if(!state)return;layer.hidden=!!state.busy||!state.visible;
  buttons.forEach((button,index)=>{const center=state.centers[index];button.hidden=center===undefined;if(button.hidden)return;const sigma=drag?drag.next:state.width;button.style.left=Math.max(30,state.wallFraction*host.clientWidth-34)+'px';button.style.top=Math.max(14,Math.min(host.clientHeight-14,center*host.clientHeight+(drag&&drag.index===index?drag.side:edgeSide(state,index))*Math.sqrt(2*Math.log(2))*sigma*state.scaleY))+'px';button.setAttribute('aria-description','Slit width sigma '+sigma+' nm. Both openings change together.');});
 }
 return {update,cancel:()=>buttons.forEach(button=>button.dispatchEvent(new Event('pointercancel')))};
}


export function slitSeparationFromDrag(start,dy,pixelsPerNm,side){
 return Math.max(0,Math.min(2000,Math.round(start+2*side*dy/pixelsPerNm)));
}
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
  button.addEventListener('pointermove',e=>{if(!drag||drag.side!==side)return;drag.next=slitSeparationFromDrag(drag.start.separation,e.clientY-drag.y,drag.start.scaleY,side);if(frame===null)frame=requestAnimationFrame(()=>{frame=null;if(drag){onPreview(drag.next);update();}});});
  button.addEventListener('pointerup',()=>finish(true));button.addEventListener('pointercancel',()=>finish(false));button.addEventListener('lostpointercapture',()=>finish(false));
  button.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finish(false);return;}if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const state=getState(),sign=['ArrowDown','ArrowRight'].includes(e.key)?1:-1;onCommit(Math.max(0,Math.min(2000,state.separation+side*sign*(e.shiftKey?50:10))));update();});
  return button;
 });
 function update(){const state=getState();layer.hidden=!!state.busy||!state.visible;const sep=drag?drag.next:state.separation;buttons.forEach((button,index)=>{button.hidden=!state.open[index];button.style.left=Math.min(host.clientWidth-30,Math.max(30,state.wallFraction*host.clientWidth+44))+'px';button.style.top=Math.max(14,Math.min(host.clientHeight-45,host.clientHeight/2+(index?1:-1)*Math.max(14,sep*state.scaleY/2)))+'px';button.setAttribute('aria-description','Slit separation '+sep+' nm; width unchanged.');});}
 return {update,cancel:()=>buttons.forEach(button=>button.dispatchEvent(new Event('pointercancel')))};
}


// Remaining visible path behind a detected particle; elapsed is simulation time.
export function screenTailLength(length,speed,elapsed,limit){
 return Math.max(0,Math.min(limit,length-speed*Math.max(0,elapsed)));
}
