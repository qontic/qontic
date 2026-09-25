import assert from 'node:assert/strict';
import {gaussian,histogramLayout} from '../js/packet-model.js';
import {aperture,sourceCoefficients,sourceComponents,sourceDensity,sourceTransverse,sourceEnvelope,sampleSource,sampleTransmittedSource,stepSource,sourceProfile,transmittedCoreFraction,maximumCoreSafeSeparation} from '../js/source-packet-model.js';
import {detectorLaw} from '../js/packet-outcomes.js';
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
// An ideal which-slit record makes the two transmitted detector states
// orthogonal. The reduced screen density is therefore the incoherent sum of
// the two analytically propagated aperture components, with no cross term.
const which={...p,whichPath:true},whichCoeff=sourceCoefficients(which);
for(const x of [which.wall,which.wall+.7,which.screen])for(let y=-8;y<=8;y+=.031){
 const components=sourceComponents(y,x,which,whichCoeff);
 const expected=components.reduce((sum,component)=>sum+component.rho,0);
 assert(Math.abs(sourceDensity(y,x,which,whichCoeff)-expected)<1e-13,'which-slit density is an incoherent component sum');
}
const coherentProfile=sourceProfile(p,-6,6),whichProfile=sourceProfile(which,-6,6);
assert(whichProfile.values.some((value,i)=>Math.abs(value-coherentProfile.values[i])>1e-5),'which-slit detector removes the interference pattern');
const upperFavored={...p,apertureWeights:[1,.35]},upperProfile=sourceProfile(upperFavored,-6,6);
assert(upperProfile.values.some((value,i)=>Math.abs(value-coherentProfile.values[i])>1e-5),'unequal slit amplitudes change the interference pattern');
for(let y=-10;y<=10;y+=.01)assert(aperture(y,upperFavored)<=1+1e-12,'weighted aperture remains absorptive');
const upperOnly={...p,apertureWeights:[1,0]},upperSingle={...p,centers:[p.centers[0]]};
const upperOnlyProfile=sourceProfile(upperOnly,-6,6),upperSingleProfile=sourceProfile(upperSingle,-6,6);
assert(upperOnlyProfile.values.every((value,i)=>Math.abs(value-upperSingleProfile.values[i])<1e-12),'balance endpoint is the analytical one-slit field');
let seed=1729;const random=()=>((seed=(1664525*seed+1013904223)>>>0)+.5)/4294967296;
const coeff=sourceCoefficients(p),results=[];let absorbed=0;
for(let i=0;i<12000;i++){
 const a=sampleSource(p,random);
 for(let n=0;n<3000&&!a.done;n++){const outcome=stepSource(a,.0008,p,coeff,random);if(outcome==='absorbed')absorbed++;}
 assert(a.done);if(!a.absorbed){assert(['upper','lower'].includes(a.slitSide),'transmitted particle keeps slit-region metadata');results.push(a.y);}else assert.equal(a.slitSide,undefined,'absorbed particle is not labeled as transmitted');
}
const directedResults=[];
const slitCoreResults=[];
const whichResults=[];
for(let i=0;i<4000;i++){
 const a=sampleTransmittedSource(p,random);
 for(let n=0;n<3000&&!a.done;n++){const outcome=stepSource(a,.0008,p,coeff,random);assert.notEqual(outcome,'absorbed');}
 assert(a.done&&!a.absorbed,'conditioned source always transmits');assert(['upper','lower'].includes(a.slitSide),'conditioned particle keeps slit-region metadata');assert(Number.isFinite(a.wallY),'conditioned particle retains its exact wall-crossing coordinate');directedResults.push(a.y);
 const core=sampleTransmittedSource(p,random,null,3),sampledWallY=core.wallY;
 for(let n=0;n<3000&&!core.done;n++){const outcome=stepSource(core,.0008,p,coeff,random);assert.notEqual(outcome,'absorbed');}
 assert(core.done&&!core.absorbed,'slit-core conditioned source always transmits');
 assert(Math.min(...p.centers.map(center=>Math.abs(core.wallY-center)))<=3*p.sy+1e-10,'Direct PW crossing stays inside displayed slit core');assert(Math.abs(core.wallY-sampledWallY)<1e-12,'wall-crossing color coordinate matches the analytical sample after propagation');
 slitCoreResults.push(core.y);
 const tagged=sampleSource(which,random);
 for(let n=0;n<3000&&!tagged.done;n++)stepSource(tagged,.0008,which,whichCoeff,random);
 if(!tagged.absorbed){assert(['upper','lower'].includes(tagged.slitSide),'which-slit particle carries a detector record');whichResults.push(tagged.y);}
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
 const a=sampleTransmittedSource(stressed,random,-3,3);let wallY;
 for(let n=0;n<6000&&!a.done;n++){const wasPassed=a.passed;stepSource(a,.0008,stressed,stressedCoeff,random);if(!wasPassed&&a.passed)wallY=a.y;}
 assert(a.done&&!a.absorbed&&Number.isFinite(a.y),'low-transmission conditional sample');
 assert(Math.min(...stressed.centers.map(center=>Math.abs(wallY-center)))<=3*stressed.sy+1e-10,'low-transmission slit-core sample stays bounded');
}
const defaultGeometry={...p,k:2*Math.PI*100/50,wall:2.25,sourceSigma:2,sy:.3,centers:[-1.5,1.5]};
const tailGeometry={...defaultGeometry,sourceSigma:.5,centers:[-5,5]};
assert(Math.abs(transmittedCoreFraction(defaultGeometry,3)-.997427)<2e-6,'default ±3σ cores contain the analytical transmitted density');
assert(transmittedCoreFraction(tailGeometry,3)<.12,'remote slits expose the off-core Gaussian-tail regime');
assert(transmittedCoreFraction(defaultGeometry,4)>transmittedCoreFraction(defaultGeometry,3),'expert slit extent changes the represented core analytically');
assert.equal(Math.floor(100*maximumCoreSafeSeparation({...defaultGeometry,centers:undefined},3,10.2)+1e-9),1020,'default source is wall-limited rather than tail-limited');
assert.equal(Math.floor(100*maximumCoreSafeSeparation({...tailGeometry,centers:undefined},3,10.2)+1e-9),255,'narrow-source separation stops before the off-core tail regime');
const profile=sourceProfile(p,-6,6),nInside=results.filter(y=>Math.abs(y)<6).length;
assert(Math.abs(nInside/12000-profile.integral)<.012,'transmission probability');
const ordered=results.filter(y=>Math.abs(y)<6).sort((a,b)=>a-b),dy=12/(profile.values.length-1);let cdf=0,maxError=0,j=0;
for(let i=1;i<profile.values.length;i++){cdf+=(profile.values[i-1]+profile.values[i])*.5*dy/profile.integral;const y=-6+i*dy;while(j<ordered.length&&ordered[j]<=y)j++;maxError=Math.max(maxError,Math.abs(j/ordered.length-cdf));}
assert(maxError<.045,'screen CDF agreement');
const directedOrdered=directedResults.filter(y=>Math.abs(y)<6).sort((a,b)=>a-b);cdf=0;maxError=0;j=0;
for(let i=1;i<profile.values.length;i++){cdf+=(profile.values[i-1]+profile.values[i])*.5*dy/profile.integral;const y=-6+i*dy;while(j<directedOrdered.length&&directedOrdered[j]<=y)j++;maxError=Math.max(maxError,Math.abs(j/directedOrdered.length-cdf));}
assert(maxError<.065,'conditioned screen CDF agreement');
const coreOrdered=slitCoreResults.filter(y=>Math.abs(y)<6).sort((a,b)=>a-b);cdf=0;maxError=0;j=0;
for(let i=1;i<profile.values.length;i++){cdf+=(profile.values[i-1]+profile.values[i])*.5*dy/profile.integral;const y=-6+i*dy;while(j<coreOrdered.length&&coreOrdered[j]<=y)j++;maxError=Math.max(maxError,Math.abs(j/coreOrdered.length-cdf));}
assert(maxError<.07,'three-sigma slit-core screen CDF remains close to the Gaussian prediction');
const whichOrdered=whichResults.filter(y=>Math.abs(y)<6).sort((a,b)=>a-b),whichDy=12/(whichProfile.values.length-1);cdf=0;maxError=0;j=0;
for(let i=1;i<whichProfile.values.length;i++){cdf+=(whichProfile.values[i-1]+whichProfile.values[i])*.5*whichDy/whichProfile.integral;const y=-6+i*whichDy;while(j<whichOrdered.length&&whichOrdered[j]<=y)j++;maxError=Math.max(maxError,Math.abs(j/whichOrdered.length-cdf));}
assert(maxError<.075,'which-slit PW trajectories reproduce the incoherent screen density');
const record=Array(100).fill(0);record[0]=1;const h=histogramLayout(record,profile,12,150);assert(h.scale*2<=142+1e-12);assert.equal(h.total,1);
const t0=0,t1=.2;assert.equal(sourceEnvelope(0,t0,p).rho,sourceEnvelope(p.k*t1,t1,p).rho);
console.log(JSON.stringify({passed:true,particles:12000,absorbed,screenHits:nInside,predictedFraction:profile.integral,CDFError:maxError}));
