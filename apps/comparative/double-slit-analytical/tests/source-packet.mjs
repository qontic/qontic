import assert from 'node:assert/strict';
import {gaussian,histogramLayout} from '../js/packet-model.js';
import {aperture,sourceCoefficients,sourceTransverse,sourceEnvelope,sampleSource,sampleTransmittedSource,stepSource,sourceProfile} from '../js/source-packet-model.js';
const p={sx:.5,sy:.3,sourceSigma:2,wall:2.25,screen:6.25,k:2*Math.PI,centers:[-2.5,2.5]};
function integral(f,lo=-30,hi=30,steps=24000){let v=0;const dx=(hi-lo)/steps;for(let i=0;i<steps;i++)v+=f(lo+(i+.5)*dx)*dx;return v;}
for(const centers of [[-2.5,2.5],[-2.5],[2.5],[-.15,.15]]){
 const q={...p,centers},c=sourceCoefficients(q);
 for(let y=-8;y<=8;y+=.017){
  const a=gaussian(y,q.wall/q.k,q.sourceSigma),b=sourceTransverse(y,q.wall,q,c),mask=aperture(y,q);
  assert(mask>=0&&mask<=1+1e-12);
  assert(Math.hypot(b.re-a.re*mask,b.im-a.im*mask)<1e-12,'complex aperture matching');
 }
 const norm0=integral(y=>sourceTransverse(y,q.wall,q,c).rho);
 for(const x of [q.wall+1e-7,q.wall+.7,q.screen]){
  const norm=integral(y=>sourceTransverse(y,x,q,c).rho);assert(Math.abs(norm-norm0)<1e-8,'transmitted flux conserved');
 }
 // i k d_x phi = -d_yy phi/2 away from the aperture.
 for(const [x,y] of [[3,.2],[5,1.1],[6,-2]]){
  const h=1e-4,g=sourceTransverse(y,x,q,c),xp=sourceTransverse(y,x+h,q,c),xm=sourceTransverse(y,x-h,q,c),yp=sourceTransverse(y+h,x,q,c),ym=sourceTransverse(y-h,x,q,c);
  const rr=-q.k*(xp.im-xm.im)/(2*h)+(yp.re-2*g.re+ym.re)/(2*h*h);
  const ii=q.k*(xp.re-xm.re)/(2*h)+(yp.im-2*g.im+ym.im)/(2*h*h);
  assert(Math.hypot(rr,ii)<2e-6,'paraxial PDE');
 }
}
let seed=1729;const random=()=>((seed=(1664525*seed+1013904223)>>>0)+.5)/4294967296;
const coeff=sourceCoefficients(p),results=[];let absorbed=0;
for(let i=0;i<12000;i++){
 const a=sampleSource(p,random);
 for(let n=0;n<3000&&!a.done;n++){const outcome=stepSource(a,.0008,p,coeff,random);if(outcome==='absorbed')absorbed++;}
 assert(a.done);if(!a.absorbed){assert(['upper','lower'].includes(a.slitSide),'transmitted particle keeps slit-region metadata');results.push(a.y);}else assert.equal(a.slitSide,undefined,'absorbed particle is not labeled as transmitted');
}
const directedResults=[];
for(let i=0;i<4000;i++){
 const a=sampleTransmittedSource(p,random);
 for(let n=0;n<3000&&!a.done;n++){const outcome=stepSource(a,.0008,p,coeff,random);assert.notEqual(outcome,'absorbed');}
 assert(a.done&&!a.absorbed,'conditioned source always transmits');assert(['upper','lower'].includes(a.slitSide),'conditioned particle keeps slit-region metadata');directedResults.push(a.y);
}
// A fixed longitudinal coordinate is used when an unresolved Orthodox/MW
// preparation is re-expressed as a Pilot-Wave ensemble.
for(const x of [-4,-1,1.5]){
 const samples=Array.from({length:2000},()=>sampleSource(p,random,x));
 assert(samples.every(a=>a.x===x&&a.x0===x),'fixed source plane');
 const expectedVariance=p.sourceSigma**2*(1+(x/(2*p.k*p.sourceSigma**2))**2);
 const observedVariance=samples.reduce((sum,a)=>sum+a.y*a.y,0)/samples.length;
 assert(Math.abs(observedVariance/expectedVariance-1)<.09,'fixed-plane Born width');
}
// The analytical conditional sampler must remain finite and rejection-free
// when the selectable geometry makes transmission extremely small.
const stressed={...p,sourceSigma:.5,centers:[-10,10]};
const stressedCoeff=sourceCoefficients(stressed);
for(let i=0;i<200;i++){
 const a=sampleTransmittedSource(stressed,random,-3);
 for(let n=0;n<6000&&!a.done;n++)stepSource(a,.0008,stressed,stressedCoeff,random);
 assert(a.done&&!a.absorbed&&Number.isFinite(a.y),'low-transmission conditional sample');
}
const profile=sourceProfile(p,-6,6),nInside=results.filter(y=>Math.abs(y)<6).length;
assert(Math.abs(nInside/12000-profile.integral)<.012,'transmission probability');
const ordered=results.filter(y=>Math.abs(y)<6).sort((a,b)=>a-b),dy=12/(profile.values.length-1);let cdf=0,maxError=0,j=0;
for(let i=1;i<profile.values.length;i++){cdf+=(profile.values[i-1]+profile.values[i])*.5*dy/profile.integral;const y=-6+i*dy;while(j<ordered.length&&ordered[j]<=y)j++;maxError=Math.max(maxError,Math.abs(j/ordered.length-cdf));}
assert(maxError<.045,'screen CDF agreement');
const directedOrdered=directedResults.filter(y=>Math.abs(y)<6).sort((a,b)=>a-b);cdf=0;maxError=0;j=0;
for(let i=1;i<profile.values.length;i++){cdf+=(profile.values[i-1]+profile.values[i])*.5*dy/profile.integral;const y=-6+i*dy;while(j<directedOrdered.length&&directedOrdered[j]<=y)j++;maxError=Math.max(maxError,Math.abs(j/directedOrdered.length-cdf));}
assert(maxError<.065,'conditioned screen CDF agreement');
const record=Array(100).fill(0);record[0]=1;const h=histogramLayout(record,profile,12,150);assert(h.scale*2<=142+1e-12);assert.equal(h.total,1);
const t0=0,t1=.2;assert.equal(sourceEnvelope(0,t0,p).rho,sourceEnvelope(p.k*t1,t1,p).rho);
console.log(JSON.stringify({passed:true,particles:12000,absorbed,screenHits:nInside,predictedFraction:profile.integral,CDFError:maxError}));
