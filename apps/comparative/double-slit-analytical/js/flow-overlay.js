import {sourceTransverse, sourceCoefficients, sourceEnvelope} from './source-packet-model.js?v=2.128';

// Spatial streamlines of the reduced forward model: dy/dx = v_y/k.
// These are calculated field curves, not measured paths or particle histories.
export function flowSlope(x,y,p,coeff=sourceCoefficients(p)) {
 const g=sourceTransverse(y,x,p,coeff);
 return g.rho>1e-20 && Number.isFinite(g.v) ? g.v/p.k : NaN;
}
export function traceFlow(seed,p,coeff=sourceCoefficients(p),steps=360) {
 const points=[],dx=(p.screen-p.wall)/steps;
 let x=p.wall+1e-8,y=seed;
 for(let i=0;i<=steps;i++) {
  points.push([x,y]);
  const a=flowSlope(x,y,p,coeff),b=flowSlope(x+dx/2,y+dx*a/2,p,coeff),c=flowSlope(x+dx/2,y+dx*b/2,p,coeff),d=flowSlope(x+dx,y+dx*c,p,coeff);
  if(![a,b,c,d].every(Number.isFinite))break;
  y+=dx*(a+2*b+2*c+d)/6;x+=dx;
 }
 return points;
}
export function mountFlowOverlay({host,redraw}) {
 const panel=document.createElement('fieldset');panel.className='packet-settings flow-settings';
 panel.innerHTML='<legend>Flow visualization · 2D <span class="flow-help" tabindex="0" aria-label="About the flow visualization" title="Calculated current velocity in all three views. Yellow arrows move along the calculated flow; they are sampling markers, not individual particles. Orange streamlines are field curves; PW particle trails show individual histories. Length is the physical shaft length along the flow curve, in nm. Marker animation uses small forward steps to stay readable at high speeds; simulation timing is unchanged. Separation sets the spacing between streamlines.">ⓘ</span></legend><div class="flow-control-row"><label class="flow-toggle"><input id="flow-arrows" aria-label="Flow arrows" type="checkbox"> Arrows</label><div class="flow-spacing"><label for="flow-length">Length</label><input id="flow-length" aria-label="Arrow length" type="range" min="5" max="100" step="5" value="20"><output>20 nm</output></div></div><div class="flow-control-row"><label class="flow-toggle"><input id="flow-lines" type="checkbox"> Streamlines</label><div class="flow-spacing"><label for="flow-spacing">Separation</label><input id="flow-spacing" aria-label="Streamline separation" type="range" min="5" max="50" step="5" value="10"><output>10 nm</output></div></div><p id="flow-status" role="status" style="font-size:12px" hidden></p>';
 host.append(panel);
 const arrows=panel.querySelector('#flow-arrows'),lines=panel.querySelector('#flow-lines'),spacing=panel.querySelector('#flow-spacing'),length=panel.querySelector('#flow-length'),status=panel.querySelector('#flow-status');
 for(const input of panel.querySelectorAll('input'))input.addEventListener('input',()=>{if(input.type==='range')input.nextElementSibling.textContent=input.value+' nm';redraw();});
 let cachedKey='',paths=[],arrowPaths=[],markerTime=null,markerTravel=0;
 return {draw({ctx,p,coeff,pulses,t,X,Y,width,height,yOffset,surfaceView}) {
  const message=surfaceView?'Switch to 2D to see the flow overlay.':p.whichPath?'Flow overlay paused during which-slit detection.':'';
  if(status.textContent!==message)status.textContent=message;status.hidden=!message;
  if(surfaceView||p.whichPath||(!arrows.checked&&!lines.checked))return;
  const density=(x,y)=>{
   let envelope=0;
   for(const c of pulses)envelope+=sourceEnvelope(x,t-c.born,p).rho*(c.branching?1:(c.active+c.pending)/Math.max(1,c.count-c.absorbed));
   return sourceTransverse(y,x,p,coeff).rho*envelope;
  };
  const scaleY=Y(1)-Y(0),scaleX=X(1)-X(0),separation=+spacing.value/100;
  const left=Math.max(0,X(p.initialCenter-6*p.sx)),right=Math.min(width,X(p.screen)),wall=X(p.wall);
  const leftWorld=p.wall+(left-wall)/scaleX;
  const key=JSON.stringify([p,+spacing.value,scaleY,leftWorld,height,yOffset]);
  if(key!==cachedKey){
   cachedKey=key;paths=[];arrowPaths=[];
   for(const center of p.centers){
    const count=Math.max(2,Math.min(32,Math.ceil(3*p.sy/separation)));
    for(let i=0;i<=count;i++){
     const path=traceFlow(center+(i/count-.5)*3*p.sy,p,coeff);
     paths.push(path);arrowPaths.push({points:extendIncidentFlow(path,leftWorld,p),absorbed:false});
    }
   }
   for(let y=-yOffset;y<=height/scaleY-yOffset;y+=44/Math.abs(scaleY)){
    // Field markers outside the transmitted seed bands terminate at the wall.
    if(p.centers.some(center=>Math.abs(y-center)<=1.5*p.sy))continue;
    arrowPaths.push({points:extendIncidentFlow([[p.wall,y]],leftWorld,p),absorbed:true});
   }
  }
  const markerSpacing=44;
  if(markerTime!==null&&t<markerTime)markerTravel=0; // Explicit simulation reset.
  markerTravel+=flowMarkerStep(markerTime===null?0:t-markerTime,p.k,scaleX,markerSpacing);
  markerTime=t;
  const offset=markerTravel%markerSpacing,samples=[];
  // Repeated markers alias as backward motion if a frame advances too far.
  // Bound display travel to one eighth of their spacing, independently of physics.
  // Transverse positions still follow the calculated field curves.
  for(let px=left+offset;px<right;px+=markerSpacing){
   const x=p.wall+(px-wall)/scaleX;
   for(const path of arrowPaths){
    const y=flowPathY(path.points,x);if(y===null)continue;
    const end=path.absorbed?wall:right;
    const fade=Math.min(1,Math.max(0,(end-px)/22));
    samples.push({px,py:Y(y),x,y,path:path.points,rho:density(x,y),fade});
   }
  }
  // A fixed field/envelope reference does not brighten earlier markers when
  // a leading column disappears at the wall or detector.
  const peak=sourceTransverse(0,0,p,coeff).rho*sourceEnvelope(p.initialCenter,0,p).rho;
  ctx.save();ctx.beginPath();ctx.rect(0,0,right,height);ctx.clip();
  if(lines.checked){
   ctx.strokeStyle='#ffad4a';ctx.lineWidth=1.25;
   for(const path of paths)for(let i=1;i<path.length;i++){
    const [x,y]=path[i],rho=density(x,y);ctx.globalAlpha=flowOpacity(rho/peak);
    if(ctx.globalAlpha<.001)continue;ctx.beginPath();ctx.moveTo(X(path[i-1][0]),Y(path[i-1][1]));ctx.lineTo(X(x),Y(y));ctx.stroke();
   }
  }
  if(arrows.checked){ctx.strokeStyle='#ffe14a';ctx.lineWidth=1.6;ctx.shadowColor='#17252f';ctx.shadowBlur=2;for(const s of samples){
   const opacity=flowOpacity(s.rho/peak)*s.fade;if(opacity<.001)continue;
   const body=flowArrowBody(s.path,s.x,+length.value);if(body.length<2)continue;
   // The advancing head is the marker. Its shaft follows the same continuous
   // path upstream, so a direction change cannot move the head backward.
   const head=body.at(-1),previous=body.at(-2),ex=X(head[0]),ey=Y(head[1]);
   const angle=Math.atan2(ey-Y(previous[1]),ex-X(previous[0])),dx=Math.cos(angle),dy=Math.sin(angle);
   ctx.globalAlpha=opacity;ctx.beginPath();ctx.moveTo(X(body[0][0]),Y(body[0][1]));
   for(const point of body.slice(1))ctx.lineTo(X(point[0]),Y(point[1]));
   ctx.moveTo(ex-4*dx+3*dy,ey-4*dy-3*dx);ctx.lineTo(ex,ey);ctx.lineTo(ex-4*dx-3*dy,ey-4*dy+3*dx);ctx.stroke();
  }}ctx.restore();
 }};
}

export function flowMarkerStep(dt,k,scale,spacing){
 return Math.min(spacing/8,Math.max(0,dt*k*Math.abs(scale)));
}
export function flowOpacity(ratio){
 // A soft density gate avoids visible pop-in at a hard threshold.
 const q=Math.max(0,ratio),fade=q/(q+.002);
 return .9*fade;
}
export function flowPathY(path,x){
 const i=flowPathIndex(path,x);if(i===null)return null;
 const a=path[i],b=path[i+1],fraction=(x-a[0])/(b[0]-a[0]);return a[1]+fraction*(b[1]-a[1]);
}
function flowPathIndex(path,x){
 if(path.length<2||x<path[0][0]||x>path.at(-1)[0])return null;
 let lo=0,hi=path.length-1;
 while(hi-lo>1){const mid=(lo+hi)>>1;if(path[mid][0]<=x)lo=mid;else hi=mid;}
 return lo;
}
export function extendIncidentFlow(path,left,p){
 const seed=path[0][1],spread=x=>Math.sqrt(1+(x/(2*p.k*p.sourceSigma**2))**2),points=[];
 for(let i=0;i<360;i++){const x=left+(p.wall-left)*i/360;points.push([x,seed*spread(x)/spread(p.wall)]);}
 // Join at exactly the slit-plane seed, with no change of marker identity.
 return [...points,[p.wall,seed],...path.filter(point=>point[0]>p.wall+1e-7)];
}
export function flowArrowBody(path,x,lengthNm){
 const i=flowPathIndex(path,x);if(i===null)return [];
 const head=[x,flowPathY(path,x)],points=[head];let remaining=lengthNm/100,current=head;
 for(let j=i;j>=0&&remaining>0;j--){
  const next=path[j],distance=Math.hypot(current[0]-next[0],current[1]-next[1]);
  if(distance===0)continue;
  if(distance>=remaining){const f=remaining/distance;points.push([current[0]+f*(next[0]-current[0]),current[1]+f*(next[1]-current[1])]);remaining=0;}
  else{points.push(next);remaining-=distance;current=next;}
 }
 return points.reverse();
}
