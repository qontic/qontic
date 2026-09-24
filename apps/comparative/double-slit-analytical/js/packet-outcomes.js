import {sourceCoefficients,sourceDensity,sampleSource} from './source-packet-model.js?v=2.93';
// Integral of the piecewise-linear, unnormalised detector density over pixels.
export function detectorLaw(p,profile,ymin,ymax){
 const bins=Array(p.bins).fill(0),dy=(ymax-ymin)/(profile.values.length-1),bw=(ymax-ymin)/p.bins;
 for(let j=0;j<profile.values.length-1;j++){
  const a=ymin+j*dy,b=a+dy,r=profile.values[j],s=(profile.values[j+1]-r)/dy;
  for(let i=Math.max(0,Math.floor((a-ymin)/bw));i<p.bins&&ymin+i*bw<b;i++){
   const lo=Math.max(a,ymin+i*bw),hi=Math.min(b,ymin+(i+1)*bw);
   bins[i]+=r*(hi-lo)+s*((hi-a)**2-(lo-a)**2)/2;
  }
 }
 const coeff=sourceCoefficients(p),spread=p.sourceSigma*Math.sqrt(1+(p.wall/(2*p.k*p.sourceSigma**2))**2);
 const bound=Math.max(10*spread,...p.centers.map(c=>Math.abs(c)+10*p.sy));
 const n=8192,dx=2*bound/n;
 let transmission=0;
 for(let j=0;j<=n;j++)transmission+=sourceDensity(-bound+j*dx,p.wall,p,coeff)*(j===0||j===n?1:j%2?4:2)*dx/3;
 const visible=bins.reduce((a,b)=>a+b,0);transmission=Math.max(visible,Math.min(1,transmission));
 return {bins,weights:bins.map(x=>x/Math.max(1e-300,visible)),visible,transmission};
}
export function samplePixel(weights,random=Math.random){let u=random();for(let i=0;i<weights.length;i++){u-=weights[i];if(u<=0)return i;}return weights.length-1;}
export function quantumSchedule(a,p,law,time=0,random=Math.random){
 const wallTime=(p.wall-a.x0)/p.k,screenTime=(p.screen-a.x0)/p.k;
 // Condition on no registration yet when the interpretation is changed.
 const survival=time>=wallTime?law.transmission:1;
 const u=random()*survival;
 if(time<wallTime&&u>=law.transmission)return {at:wallTime,type:'absorbed'};
 if(u>=law.visible)return {at:screenTime,type:'missed'};
 return {at:screenTime,type:'hit',index:samplePixel(law.weights,random)};
}
export function recordWithHit(record,index){const next=record.slice();next[index]++;return next;}
