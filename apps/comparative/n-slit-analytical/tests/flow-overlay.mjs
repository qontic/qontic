import assert from 'node:assert/strict';
import {flowSlope,traceFlow,flowMarkerStep,flowOpacity,flowPathY,extendIncidentFlow,flowArrowBody} from '../js/flow-overlay.js';
import {sourceTransverse,sourceCoefficients} from '../js/source-packet-model.js';
const p={sx:.5,sy:.3,sourceSigma:2,wall:2.25,screen:12.25,k:2*Math.PI,centers:[-1.5,1.5]};
for(const centers of [[-1.5,1.5],[-1.5],[1.5]]){
 const q={...p,centers},coeff=sourceCoefficients(q);
 for(const [x,y] of [[1,.4],[3,.6],[7,1.2]]){
  const g=sourceTransverse(y,x,q,coeff),h=1e-5,a=sourceTransverse(y-h,x,q,coeff),b=sourceTransverse(y+h,x,q,coeff);
  const phaseDifference=Math.atan2(b.im*a.re-b.re*a.im,b.re*a.re+b.im*a.im);
  assert(Math.abs(flowSlope(x,y,q,coeff)-phaseDifference/(2*h*q.k))<1e-7,'slope agrees with independent phase derivative');
 }
 for(const seed of centers){
  const coarse=traceFlow(seed,q,coeff,180),fine=traceFlow(seed,q,coeff,720);
  assert(coarse.every(point=>point.every(Number.isFinite)));
  assert(Math.abs(coarse.at(-1)[0]-q.screen)<1e-6);
  assert(Math.abs(coarse.at(-1)[1]-fine.at(-1)[1])<1e-5,'streamline converges with step refinement');
 }
}
console.log('Flow field and streamline convergence checks passed.');

const k=6,scale=80,spacing=44;
let travel=0;
for(const dt of [0,1e-5,1/60,.1,1,10,0,-1,1/60]){
 const step=flowMarkerStep(dt,k,scale,spacing);
 assert(step>=0&&step<=spacing/8,'display displacement stays forward and below aliasing range');
 const before=travel%spacing;travel+=step;const after=travel%spacing;
 const apparentStep=((after-before+spacing)%spacing);
 assert(Math.abs(apparentStep-step)<1e-10,'nearest visible successor is forward, including lattice wrap');
}
assert.equal(flowMarkerStep(1e-5,k,scale,spacing),1e-5*k*scale,'low-speed animation tracks physical transport');
assert.equal(flowMarkerStep(.1,k,scale,spacing),spacing/8,'long frames are bounded without changing model time');
assert.equal(flowOpacity(0),0);
assert(Math.abs(flowOpacity(.002+1e-8)-flowOpacity(.002-1e-8))<1e-5,'opacity has no jump at the former density threshold');
assert.equal(flowPathY([[0,0],[1,2],[2,3]],.5),1);
assert.equal(flowPathY([[0,0],[1,2],[2,3]],1.5),2.5);
assert.equal(flowPathY([[0,0],[1,2]],2),null);
console.log('Continuous marker motion, path interpolation and fade checks passed.');

// Track the same arrowhead through the wall and up to the detector, rather
// than testing only the wrapped phase of interchangeable columns.
for(const seed of p.centers){
 const path=extendIncidentFlow(traceFlow(seed,p),-3,p);
 assert(Math.abs(flowPathY(path,p.wall-1e-7)-flowPathY(path,p.wall+1e-7))<1e-6,'slit-plane position is continuous');
 let previous=-Infinity;
 for(const x of [p.wall-.05,p.wall-1e-6,p.wall,p.wall+1e-6,p.wall+.05,p.screen-.05,p.screen-1e-6]){
  const body=flowArrowBody(path,x,20),head=body.at(-1);
  assert.equal(head[0],x,'head stays at its transported position during direction changes');
  assert(head[0]>previous,'head never goes backward near wall or screen');previous=head[0];
  const arc=body.slice(1).reduce((sum,b,i)=>sum+Math.hypot(b[0]-body[i][0],b[1]-body[i][1]),0);
  assert(Math.abs(arc*100-20)<1e-9,'shaft arc length is 20 nm in physical coordinates');
 }
 assert.equal(flowArrowBody(path,p.screen+.01,20).length,0,'exited marker is removed rather than recycled at screen');
}
assert.equal(flowPathY([[0,0],[.1,1],[2,3]],1.05),2,'nonuniform incident/transmitted mesh interpolates correctly');
console.log('Boundary continuity, forward arrowheads and physical length checks passed.');
