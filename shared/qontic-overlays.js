// Optional model-independent canvas tools. All geometry and units come from adapters.
function styles() {
  if (document.querySelector('link[data-qontic-overlays]')) return;
  const link=document.createElement('link');link.rel='stylesheet';
  link.href=new URL('./qontic-overlays.css?v=5',import.meta.url);
  link.dataset.qonticOverlays='';document.head.append(link);
}
export function mountDistanceScale({host,getUnitsPerPixel,format=v=>String(v),storageKey,onVisibilityChange=()=>{}}) {
  styles();
  const element=document.createElement('div');element.className='qontic-distance-scale';
  element.tabIndex=0;element.setAttribute('role','button');
  element.setAttribute('aria-label','Move distance scale');
  element.title='Drag to move scale · arrow keys to move · Home to reset';
  const canvas=document.createElement('canvas');canvas.style.zIndex='30';element.append(canvas);host.append(element);
  let position={x:8,y:8},visible=true,opacity=1,drag;
  if(storageKey)try{const saved=JSON.parse(localStorage.getItem(storageKey));if(Number.isFinite(saved?.x)&&Number.isFinite(saved?.y))position=saved;}catch(_){}
  const place=()=>{position.x=Math.max(0,Math.min(position.x,host.clientWidth-element.offsetWidth));position.y=Math.max(0,Math.min(position.y,host.clientHeight-element.offsetHeight));element.style.left=position.x+'px';element.style.top=position.y+'px';};
  const save=()=>{if(storageKey)try{localStorage.setItem(storageKey,JSON.stringify(position));}catch(_){}};
  const nice=v=>{const p=10**Math.floor(Math.log10(v));return ([5,2,1].find(n=>n*p<=v)||1)*p;};
  const update=()=>{
    element.hidden=!visible || opacity<=0;if(element.hidden)return;
    place();
    const dpr=devicePixelRatio||1,w=154,h=126;
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.globalAlpha=opacity;
    ctx.fillStyle='rgba(8,20,32,.1)';ctx.fillRect(0,0,w,h);
    const metrics=getUnitsPerPixel(),ux=metrics.x,uy=metrics.y;
    if(!(ux>0&&uy>0))return;
    const x=nice(90*ux),y=nice(72*uy),dx=x/ux,dy=y/uy;
    ctx.strokeStyle='#f1f8fc';ctx.fillStyle='#f1f8fc';ctx.lineWidth=1.5;ctx.font='12px Inter,Arial,sans-serif';
    ctx.beginPath();ctx.moveTo(12,14);ctx.lineTo(12+dx,14);ctx.moveTo(12,10);ctx.lineTo(12,18);ctx.moveTo(12+dx,10);ctx.lineTo(12+dx,18);
    ctx.moveTo(12,40);ctx.lineTo(12,40+dy);ctx.moveTo(8,40);ctx.lineTo(16,40);ctx.moveTo(8,40+dy);ctx.lineTo(16,40+dy);ctx.stroke();
    ctx.textAlign='center';ctx.fillText(format(x),12+dx/2,31);ctx.textAlign='left';ctx.fillText(format(y),21,44+dy/2);
    ctx.globalAlpha=1;
  };
  element.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();element.focus();drag={x:event.clientX,y:event.clientY,px:position.x,py:position.y};element.setPointerCapture(event.pointerId);});
  element.addEventListener('pointermove',event=>{if(!drag)return;position={x:drag.px+event.clientX-drag.x,y:drag.py+event.clientY-drag.y};place();});
  element.addEventListener('pointerup',()=>{drag=null;save();});
  element.addEventListener('pointercancel',()=>{drag=null;});
  element.addEventListener('keydown',event=>{const delta={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[event.key];if(!delta&&event.key!=='Home')return;event.preventDefault();event.stopPropagation();position=delta?{x:position.x+delta[0],y:position.y+delta[1]}:{x:8,y:8};place();save();});
  const observer=new ResizeObserver(update);observer.observe(host);update();
  return {canvas,update,getVisible:()=>visible&&opacity>0,setVisible(value){visible=!!value;update();onVisibilityChange(visible);},setOpacity(value){opacity=Math.max(0,Math.min(1,value));update();},destroy(){observer.disconnect();element.remove();}};
}

// Shared linear-coordinate overlay. Models provide only their current bounds
// and formatting; the template owns grid drawing and pointer interactions.
export function mountCoordinateTools({host,getBounds,formatValue=value=>Number(value.toPrecision(4)).toString(),storageKey}) {
  styles();
  const canvas=document.createElement('canvas');canvas.className='qontic-coordinate-overlay';canvas.hidden=true;host.append(canvas);
  const readout=document.createElement('output');readout.className='qontic-coordinate-readout';readout.hidden=true;readout.setAttribute('aria-live','polite');host.append(readout);
  let gridVisible=false,measureActive=false,cursor=null,points=[];
  if(storageKey)try{gridVisible=localStorage.getItem(storageKey)==='true';}catch(_){}
  const validBounds=()=>{const b=getBounds?.();return b&&[b.xMin,b.xMax,b.yMin,b.yMax].every(Number.isFinite)&&b.xMax>b.xMin&&b.yMax>b.yMin?b:null;};
  const niceStep=(span,pixels)=>{const raw=Math.abs(span)*90/Math.max(1,pixels),power=10**Math.floor(Math.log10(Math.max(raw,1e-300)));return ([1,2,5,10].find(factor=>factor*power>=raw)||10)*power;};
  const worldPoint=(clientX,clientY)=>{
    const rect=host.getBoundingClientRect(),bounds=validBounds();if(!bounds||!(rect.width>0&&rect.height>0))return null;
    const px=Math.max(0,Math.min(rect.width,clientX-rect.left)),py=Math.max(0,Math.min(rect.height,clientY-rect.top));
    return {px,py,x:bounds.xMin+px/rect.width*(bounds.xMax-bounds.xMin),y:bounds.yMin+py/rect.height*(bounds.yMax-bounds.yMin)};
  };
  const label=(ctx,text,x,y)=>{
    ctx.font='11px Inter,Arial,sans-serif';const padding=5,width=ctx.measureText(text).width+2*padding,height=20;
    x=Math.max(4,Math.min(x-width/2,host.clientWidth-width-4));y=Math.max(4,Math.min(y-height-8,host.clientHeight-height-4));
    ctx.fillStyle='rgba(8,24,36,.9)';ctx.strokeStyle='rgba(126,233,251,.75)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(x,y,width,height,4);ctx.fill();ctx.stroke();
    ctx.fillStyle='#eefaff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(text,x+padding,y+height/2);
  };
  const draw=()=>{
    const width=host.clientWidth,height=host.clientHeight,bounds=validBounds(),dpr=devicePixelRatio||1;
    canvas.hidden=!gridVisible&&!measureActive;if(canvas.hidden||!bounds||width<1||height<1)return;
    if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
    const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    const toPixel=point=>({x:(point.x-bounds.xMin)/(bounds.xMax-bounds.xMin)*width,y:(point.y-bounds.yMin)/(bounds.yMax-bounds.yMin)*height});
    if(gridVisible){
      const xStep=niceStep(bounds.xMax-bounds.xMin,width),yStep=niceStep(bounds.yMax-bounds.yMin,height);
      ctx.lineWidth=1;
      for(let x=Math.ceil(bounds.xMin/xStep)*xStep;x<=bounds.xMax+xStep*1e-9;x+=xStep){const px=(x-bounds.xMin)/(bounds.xMax-bounds.xMin)*width;ctx.strokeStyle=Math.abs(x)<xStep*1e-8?'rgba(208,247,255,.52)':'rgba(190,234,244,.22)';ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,height);ctx.stroke();}
      for(let y=Math.ceil(bounds.yMin/yStep)*yStep;y<=bounds.yMax+yStep*1e-9;y+=yStep){const py=(y-bounds.yMin)/(bounds.yMax-bounds.yMin)*height;ctx.strokeStyle=Math.abs(y)<yStep*1e-8?'rgba(208,247,255,.52)':'rgba(190,234,244,.22)';ctx.beginPath();ctx.moveTo(0,py);ctx.lineTo(width,py);ctx.stroke();}
    }
    if(measureActive&&cursor){ctx.strokeStyle='rgba(126,233,251,.72)';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(cursor.px,0);ctx.lineTo(cursor.px,height);ctx.moveTo(0,cursor.py);ctx.lineTo(width,cursor.py);ctx.stroke();ctx.setLineDash([]);}
    const pixels=points.map(toPixel);
    if(pixels.length){ctx.fillStyle='#ffd54a';ctx.strokeStyle='#3b2d00';ctx.lineWidth=1.5;for(let i=0;i<pixels.length;i++){ctx.beginPath();ctx.arc(pixels[i].x,pixels[i].y,5,0,2*Math.PI);ctx.fill();ctx.stroke();ctx.fillStyle='#fff4a3';ctx.font='600 12px Inter,Arial,sans-serif';ctx.textAlign='left';ctx.fillText(i?'B':'A',pixels[i].x+8,pixels[i].y-8);ctx.fillStyle='#ffd54a';}}
    if(pixels.length===2){const [a,b]=points,[ap,bp]=pixels,dx=b.x-a.x,dy=b.y-a.y,distance=Math.hypot(dx,dy);ctx.strokeStyle='#ffd54a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ap.x,ap.y);ctx.lineTo(bp.x,bp.y);ctx.stroke();label(ctx,`\u0394x ${formatValue(dx)}  \u00b7  \u0394y ${formatValue(dy)}  \u00b7  d ${formatValue(distance)}`,(ap.x+bp.x)/2,(ap.y+bp.y)/2);}
  };
  const syncReadout=()=>{
    readout.hidden=!measureActive||!cursor;if(readout.hidden)return;
    if(points.length===2){const [a,b]=points;readout.textContent=`\u0394x ${formatValue(b.x-a.x)}  \u00b7  \u0394y ${formatValue(b.y-a.y)}  \u00b7  d ${formatValue(Math.hypot(b.x-a.x,b.y-a.y))}`;}
    else readout.textContent=`x ${formatValue(cursor.x)}  \u00b7  y ${formatValue(cursor.y)}${points.length?'  \u00b7  A set; click B':''}`;
  };
  const ignored=target=>target instanceof Element&&!!target.closest('button,input,select,textarea,a,[contenteditable],.qontic-distance-scale,.qontic-range-panel,.qontic-expanded-resize');
  host.addEventListener('pointermove',event=>{if(!measureActive||ignored(event.target))return;cursor=worldPoint(event.clientX,event.clientY);syncReadout();draw();},{capture:true});
  host.addEventListener('pointerleave',()=>{if(!measureActive)return;cursor=null;syncReadout();draw();});
  host.addEventListener('click',event=>{if(!measureActive||event.button!==0||ignored(event.target))return;const point=worldPoint(event.clientX,event.clientY);if(!point)return;event.preventDefault();event.stopPropagation();points=points.length>=2?[point]:[...points,point];cursor=point;syncReadout();draw();},{capture:true});
  const escape=event=>{if(event.key!=='Escape'||!measureActive||!points.length)return;event.preventDefault();event.stopPropagation();points=[];syncReadout();draw();};
  document.addEventListener('keydown',escape,true);
  const observer=new ResizeObserver(draw);observer.observe(host);
  const setGridVisible=value=>{gridVisible=!!value;if(storageKey)try{localStorage.setItem(storageKey,String(gridVisible));}catch(_){}draw();};
  const setMeasureActive=value=>{measureActive=!!value;host.classList.toggle('qontic-measuring',measureActive);if(!measureActive){cursor=null;points=[];}syncReadout();draw();};
  draw();
  return {canvas,update:draw,getGridVisible:()=>gridVisible,setGridVisible,getMeasureActive:()=>measureActive,setMeasureActive,clearMeasurement(){points=[];syncReadout();draw();},destroy(){observer.disconnect();document.removeEventListener('keydown',escape,true);canvas.remove();readout.remove();host.classList.remove('qontic-measuring');}};
}

export function mountValueRange({host,label='Display range',onChange=()=>{},format=v=>Number(v).toPrecision(3),movableContainer=null,storageKey}) {
  styles();host.classList.add('qontic-value-range');host.replaceChildren();host.setAttribute('role','group');host.setAttribute('aria-label',label);
  const target=movableContainer||host, boundary=target.parentElement;
  const originalAttributes=Object.fromEntries(['tabindex','role','aria-label','title'].map(name=>[name,target.getAttribute(name)]));
  target.tabIndex=0;target.setAttribute('role','group');target.setAttribute('aria-label','Move '+label);
  target.title='Drag palette, values, or background · arrow keys to move · Home to reset';
  target.classList.add('qontic-range-draggable');
  const dragEvents=new AbortController();
  let position=null,drag=null,visible=true;
  if(storageKey)try{const saved=JSON.parse(localStorage.getItem(storageKey));if(Number.isFinite(saved?.x)&&Number.isFinite(saved?.y))position=saved;}catch(_){}
  const origin={left:target.style.left,top:target.style.top,bottom:target.style.bottom};
  const place=()=>{if(!position||!visible||!boundary.clientWidth||!boundary.clientHeight)return;position.x=Math.max(0,Math.min(position.x,boundary.clientWidth-target.offsetWidth));position.y=Math.max(0,Math.min(position.y,boundary.clientHeight-target.offsetHeight));target.style.left=position.x+'px';target.style.top=position.y+'px';target.style.bottom='auto';};
  const save=()=>{if(storageKey)try{localStorage.setItem(storageKey,JSON.stringify(position));}catch(_){}};
  // Leave a protected gutter around both native sliders for range adjustment.
  const nearSlider=event=>[...host.querySelectorAll('input[type=range]')].some(input=>{
    const r=input.getBoundingClientRect(),margin=4;
    return event.clientX>=r.left-margin&&event.clientX<=r.right+margin&&event.clientY>=r.top-margin&&event.clientY<=r.bottom+margin;
  });
  target.addEventListener('pointerdown',event=>{
    if(event.button!==0||event.target.closest('input,select,textarea')||nearSlider(event))return;
    if(event.target.closest('button'))return;
    event.preventDefault();event.stopPropagation();target.focus({preventScroll:true});
    position={x:target.offsetLeft,y:target.offsetTop};drag={x:event.clientX,y:event.clientY,px:position.x,py:position.y};
    target.setPointerCapture(event.pointerId);
  },{signal:dragEvents.signal});
  target.addEventListener('pointermove',event=>{if(!drag)return;position={x:drag.px+event.clientX-drag.x,y:drag.py+event.clientY-drag.y};place();},{signal:dragEvents.signal});
  target.addEventListener('pointerup',()=>{if(drag){drag=null;save();}},{signal:dragEvents.signal});
  target.addEventListener('pointercancel',()=>{drag=null;},{signal:dragEvents.signal});
  target.addEventListener('lostpointercapture',()=>{drag=null;},{signal:dragEvents.signal});
  target.addEventListener('keydown',event=>{if(event.target!==target)return;event.stopPropagation();const d={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[event.key];if(event.key==='Home'){event.preventDefault();position=null;Object.assign(target.style,origin);if(storageKey)try{localStorage.removeItem(storageKey);}catch(_){}return;}if(!d)return;event.preventDefault();position={x:target.offsetLeft+d[0],y:target.offsetTop+d[1]};place();save();},{signal:dragEvents.signal});
  const observer=new ResizeObserver(place);observer.observe(boundary);requestAnimationFrame(place);
  let state={min:0,max:1,lower:0,upper:1};
  const low=document.createElement('input'),high=document.createElement('input');
  for(const [input,name] of [[low,'Lower'],[high,'Upper']]){input.type='range';input.min='0';input.max='1000';input.step='1';input.setAttribute('aria-label',name+' '+label);host.append(input);input.addEventListener('keydown',e=>e.stopPropagation());}
  const upper=document.createElement('output'),lower=document.createElement('output');upper.className='qontic-range-upper';lower.className='qontic-range-lower';host.append(upper,lower);
  const sync=()=>{const span=state.max-state.min;if(!(span>0))return;low.value=Math.round((state.lower-state.min)/span*1000);high.value=Math.round((state.upper-state.min)/span*1000);upper.textContent=format(state.upper);lower.textContent=format(state.lower);low.setAttribute('aria-valuetext',format(state.lower));high.setAttribute('aria-valuetext',format(state.upper));};
  const change=input=>{if(input===low)low.value=Math.min(+low.value,+high.value-1);else high.value=Math.max(+high.value,+low.value+1);const span=state.max-state.min;state.lower=state.min+(+low.value/1000)*span;state.upper=state.min+(+high.value/1000)*span;sync();onChange({lower:state.lower,upper:state.upper});};
  low.addEventListener('input',()=>change(low));high.addEventListener('input',()=>change(high));sync();
  return {getVisible:()=>visible,setVisible(value){visible=!!value;target.hidden=!visible;if(visible)place();},setState(next){if(![next.min,next.max,next.lower,next.upper].every(Number.isFinite)||next.max<=next.min)return;state={...next,lower:Math.max(next.min,Math.min(next.lower,next.max)),upper:Math.max(next.min,Math.min(next.upper,next.max))};if(state.upper<=state.lower){state.lower=state.min;state.upper=state.max;}sync();},destroy(){dragEvents.abort();observer.disconnect();target.classList.remove('qontic-range-draggable');for(const [name,value] of Object.entries(originalAttributes)){if(value===null)target.removeAttribute(name);else target.setAttribute(name,value);}host.replaceChildren();host.classList.remove('qontic-value-range');}};
}
