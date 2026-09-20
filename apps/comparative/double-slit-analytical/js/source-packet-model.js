// Gaussian-aperture, forward (paraxial) packet model, hbar = mass = 1.
// i (partial_t + k partial_x) u = -partial_y^2 u / 2.
// The longitudinal envelope translates; longitudinal dispersion and reflection
// are outside this approximation. No numerical wave-equation solver is used.
import {gaussian} from './packet-model.js?v=2.87';

export function aperture(y,p){
 const sum=p.centers.reduce((n,c)=>n+Math.exp(-((y-c)**2)/(4*p.sy*p.sy)),0);
 // Conservative bound ensures an absorptive amplitude mask 0 <= T <= 1,
 // including nearly overlapping apertures.
 const bound=p.centers.length===2?1+Math.exp(-((p.centers[1]-p.centers[0])**2)/(16*p.sy*p.sy)):1;
 return sum/bound;
}
export function sourceCoefficients(p){
 const s=p.sourceSigma,t=p.wall/p.k,b=t/(2*s*s),den=1+b*b;
 const incidentReal=1/(4*s*s*den),ar=incidentReal+1/(4*p.sy*p.sy),ai=-b/(4*s*s*den);
 const g=gaussian(0,t,s);
 const bound=p.centers.length===2?1+Math.exp(-((p.centers[1]-p.centers[0])**2)/(16*p.sy*p.sy)):1;
 return p.centers.map(c=>{
  // Expand about each aperture center, avoiding exp(-c²/4sy²) times
  // exp(+c²/4sy²) overflow for narrow, widely separated apertures.
  const amp=Math.exp(-incidentReal*c*c)/bound,phase=-ai*c*c;
  const r=amp*Math.cos(phase),i=amp*Math.sin(phase);
  return {ar,ai,center:c,br:-2*incidentReal*c,bi:-2*ai*c,cr:g.re*r-g.im*i,ci:g.re*i+g.im*r};
 });
}
export function sourceTransverse(y,x,p,coeff=sourceCoefficients(p)){
 if(x<p.wall){const g=gaussian(y,x/p.k,p.sourceSigma);return {...g,v:(g.re*g.di-g.im*g.dr)/Math.max(1e-300,g.rho)};}
 const u=(x-p.wall)/p.k;let re=0,im=0,dr=0,di=0;
 for(const a of coeff){
  const rr=1-2*a.ai*u,ii=2*a.ar*u,dd=rr*rr+ii*ii;
  const q=y-a.center,nr=-a.ar*q*q+a.br*q-u*a.br*a.bi,ni=-a.ai*q*q+a.bi*q+u*(a.br*a.br-a.bi*a.bi)/2;
  const er=(nr*rr+ni*ii)/dd,ei=(ni*rr-nr*ii)/dd;
  const amp=Math.exp(er)/Math.pow(dd,.25),phase=ei-Math.atan2(ii,rr)/2;
  const fr=amp*Math.cos(phase),fi=amp*Math.sin(phase);
  const r=a.cr*fr-a.ci*fi,i=a.cr*fi+a.ci*fr;
  const lr=((-2*a.ar*q+a.br)*rr+(-2*a.ai*q+a.bi)*ii)/dd;
  const li=((-2*a.ai*q+a.bi)*rr-(-2*a.ar*q+a.br)*ii)/dd;
  re+=r;im+=i;dr+=lr*r-li*i;di+=lr*i+li*r;
 }
 const rho=re*re+im*im;
 return {re,im,dr,di,rho,v:rho>1e-26?(re*di-im*dr)/rho:0};
}
export function sourceEnvelope(x,t,p){
 const u=x-(p.initialCenter??0)-p.k*t,rho=Math.exp(-u*u/(2*p.sx*p.sx))/(Math.sqrt(2*Math.PI)*p.sx);
 return {rho,phase:p.k*x-p.k*p.k*t/2};
}
function normal(random){return Math.sqrt(-2*Math.log(Math.max(1e-15,random())))*Math.cos(2*Math.PI*random());}
function sourceWidth(x,p){return p.sourceSigma*Math.sqrt(1+(x/(2*p.k*p.sourceSigma**2))**2);}
function sampleLongitudinalX(p,random){
 // Optional upstream preparation keeps every sampled particle outside the canvas.
 // A boundary six sigma ahead of the center excludes less than 1e-9 probability.
 let x;do{x=(p.initialCenter??0)+p.sx*normal(random);}while(x>=Math.min(p.wall,p.initialRight??p.wall));
 return x;
}
export function sampleSource(p,random=Math.random,fixedX=null){
 const x=fixedX===null?sampleLongitudinalX(p,random):fixedX;
 return {x0:x,x,y:sourceWidth(x,p)*normal(random),done:false,passed:false,absorbed:false,path:[]};
}
export function sampleTransmittedSource(p,random=Math.random,fixedX=null){
 // At the wall, the conditional density is exactly
 // |phi(y,L)|^2 T(y)^2.  Expanding the squared sum of Gaussian apertures
 // makes this a finite Gaussian mixture (one component per ordered slit pair).
 // Sampling that mixture avoids rejection, so even vanishingly small total
 // transmission remains fast and cannot exhaust an attempt limit.
 const incidentVariance=sourceWidth(p.wall,p)**2;
 const apertureVariance=p.sy*p.sy;
 const denominator=incidentVariance+apertureVariance;
 const variance=incidentVariance*apertureVariance/denominator;
 const components=[];
 let maxLogWeight=-Infinity;
 for(const left of p.centers)for(const right of p.centers){
  const sum=left+right;
  const logWeight=-(left*left+right*right)/(4*apertureVariance)
   +incidentVariance*sum*sum/(8*apertureVariance*denominator);
  const component={mean:incidentVariance*sum/(2*denominator),logWeight};
  components.push(component);maxLogWeight=Math.max(maxLogWeight,logWeight);
 }
 let totalWeight=0;
 for(const component of components){
  component.weight=Math.exp(component.logWeight-maxLogWeight);
  totalWeight+=component.weight;
 }
 let pick=random()*totalWeight,selected=components[components.length-1];
 for(const component of components){pick-=component.weight;if(pick<=0){selected=component;break;}}
 const yWall=selected.mean+Math.sqrt(variance)*normal(random);
 const x=fixedX===null?sampleLongitudinalX(p,random):fixedX;
 // Incident Gaussian Bohmian trajectories scale with the packet width.
 // Map the wall sample back analytically to the requested preparation plane.
 const y=yWall*sourceWidth(x,p)/Math.sqrt(incidentVariance);
 return {x0:x,x,y,done:false,passed:false,absorbed:false,path:[],conditionedTransmission:true};
}
export function advanceSourceY(y,x,dx,p,coeff){
 // Incident Gaussian trajectories have a closed expression; transmitted
 // guidance is integrated along x. Split exactly at the aperture plane.
 if(dx<=0)return y;
 if(x<p.wall){const end=Math.min(x+dx,p.wall),s=2*p.k*p.sourceSigma**2;
  y*=Math.sqrt((1+(end/s)**2)/(1+(x/s)**2));
  if(end===x+dx)return y;dx=x+dx-end;x=end;
 }
 const v=(q,z)=>sourceTransverse(q,z,p,coeff).v/p.k;
 const a=v(y,x),b=v(y+dx*a/2,x+dx/2),c=v(y+dx*b/2,x+dx/2),d=v(y+dx*c,x+dx);
 return y+dx*(a+2*b+2*c+d)/6;
}
export function stepSource(a,dt,p,coeff,random=Math.random){
 if(a.done)return null;
 const end=a.x+p.k*dt;
 if(!a.passed&&end>=p.wall){
  a.y=advanceSourceY(a.y,a.x,p.wall-a.x,p,coeff);a.x=p.wall;a.passed=true;
  if(!a.conditionedTransmission&&random()>aperture(a.y,p)**2){a.done=a.absorbed=true;return 'absorbed';}
 }
 const target=Math.min(end,p.screen);
 a.y=advanceSourceY(a.y,a.x,target-a.x,p,coeff);a.x=target;
 if(a.x>=p.screen){a.done=true;return 'hit';}
 return null;
}
export function sourceProfile(p,ymin,ymax,samples=2049){
 const coeff=sourceCoefficients(p),dy=(ymax-ymin)/(samples-1);
 const values=Array.from({length:samples},(_,i)=>sourceTransverse(ymin+i*dy,p.screen,p,coeff).rho);
 const integral=values.reduce((s,v,i)=>s+v*((i===0||i===samples-1)?.5:1),0)*dy;
 return {values,integral};
}
