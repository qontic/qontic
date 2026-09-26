// Gaussian-aperture, forward (paraxial) packet model, hbar = mass = 1.
// i (partial_t + k partial_x) u = -partial_y^2 u / 2.
// The longitudinal envelope translates; longitudinal dispersion and reflection
// are outside this approximation. No numerical wave-equation solver is used.
import {gaussian} from './packet-model.js?v=2.91';

function apertureWeights(p){
 return p.apertureWeights?.length===p.centers.length?p.apertureWeights:p.centers.map(()=>1);
}
function apertureBound(p){
 const weights=apertureWeights(p);
 if(weights.length<2)return weights[0]||1;
 const high=Math.max(...weights),low=Math.min(...weights);
 return high+low*Math.exp(-((p.centers[1]-p.centers[0])**2)/(16*p.sy*p.sy));
}

export function aperture(y,p){
 const weights=apertureWeights(p);
 const sum=p.centers.reduce((n,c,index)=>n+weights[index]*Math.exp(-((y-c)**2)/(4*p.sy*p.sy)),0);
 // Conservative bound ensures an absorptive amplitude mask 0 <= T <= 1,
 // including nearly overlapping apertures.
 return sum/apertureBound(p);
}
export function sourceCoefficients(p){
 const s=p.sourceSigma,t=p.wall/p.k,b=t/(2*s*s),den=1+b*b;
 const incidentReal=1/(4*s*s*den),ar=incidentReal+1/(4*p.sy*p.sy),ai=-b/(4*s*s*den);
 const g=gaussian(0,t,s);
 const bound=apertureBound(p),weights=apertureWeights(p);
 return p.centers.map((c,index)=>{
  // Expand about each aperture center, avoiding exp(-c²/4sy²) times
  // exp(+c²/4sy²) overflow for narrow, widely separated apertures.
  const amp=weights[index]*Math.exp(-incidentReal*c*c)/bound,phase=-ai*c*c;
  const r=amp*Math.cos(phase),i=amp*Math.sin(phase);
  return {ar,ai,center:c,br:-2*incidentReal*c,bi:-2*ai*c,cr:g.re*r-g.im*i,ci:g.re*i+g.im*r};
 });
}
function propagatedComponent(y,x,p,a){
 const u=(x-p.wall)/p.k;
  const rr=1-2*a.ai*u,ii=2*a.ar*u,dd=rr*rr+ii*ii;
  const q=y-a.center,nr=-a.ar*q*q+a.br*q-u*a.br*a.bi,ni=-a.ai*q*q+a.bi*q+u*(a.br*a.br-a.bi*a.bi)/2;
  const er=(nr*rr+ni*ii)/dd,ei=(ni*rr-nr*ii)/dd;
  const amp=Math.exp(er)/Math.pow(dd,.25),phase=ei-Math.atan2(ii,rr)/2;
  const fr=amp*Math.cos(phase),fi=amp*Math.sin(phase);
  const r=a.cr*fr-a.ci*fi,i=a.cr*fi+a.ci*fr;
  const lr=((-2*a.ar*q+a.br)*rr+(-2*a.ai*q+a.bi)*ii)/dd;
  const li=((-2*a.ai*q+a.bi)*rr-(-2*a.ar*q+a.br)*ii)/dd;
 const dr=lr*r-li*i,di=lr*i+li*r,rho=r*r+i*i;
 return {re:r,im:i,dr,di,rho,v:rho>1e-26?(r*di-i*dr)/rho:0};
}
export function sourceComponents(y,x,p,coeff=sourceCoefficients(p)){
 if(x<p.wall){const g=gaussian(y,x/p.k,p.sourceSigma);return [{...g,v:(g.re*g.di-g.im*g.dr)/Math.max(1e-300,g.rho)}];}
 return coeff.map(a=>propagatedComponent(y,x,p,a));
}
export function sourceTransverse(y,x,p,coeff=sourceCoefficients(p)){
 if(x<p.wall)return sourceComponents(y,x,p,coeff)[0];
 let re=0,im=0,dr=0,di=0;
 for(const component of sourceComponents(y,x,p,coeff)){
  re+=component.re;im+=component.im;dr+=component.dr;di+=component.di;
 }
 const rho=re*re+im*im;
 return {re,im,dr,di,rho,v:rho>1e-26?(re*di-im*dr)/rho:0};
}
export function sourceDensity(y,x,p,coeff=sourceCoefficients(p)){
 if(!p.whichPath||x<p.wall)return sourceTransverse(y,x,p,coeff).rho;
 return sourceComponents(y,x,p,coeff).reduce((sum,component)=>sum+component.rho,0);
}
export function sourceEnvelope(x,t,p){
 const u=x-(p.initialCenter??0)-p.k*t,rho=Math.exp(-u*u/(2*p.sx*p.sx))/(Math.sqrt(2*Math.PI)*p.sx);
 return {rho,phase:p.k*x-p.k*p.k*t/2};
}
function normal(random){return Math.sqrt(-2*Math.log(Math.max(1e-15,random())))*Math.cos(2*Math.PI*random());}
function erfcPositive(x){
 const t=1/(1+.5*x);
 let polynomial=.17087277;
 for(const coefficient of [-.82215223,1.48851587,-1.13520398,.27886807,-.18628806,.09678418,.37409196,1.00002368])polynomial=coefficient+t*polynomial;
 return t*Math.exp(-x*x-1.26551223+t*polynomial);
}
function lowerNormalCdf(z){return z<=0?.5*erfcPositive(-z/Math.SQRT2):1-.5*erfcPositive(z/Math.SQRT2);}
function inverseNormalCdf(p){
 p=Math.max(1e-300,Math.min(1-1e-16,p));
 const a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.357751867269,-30.66479806614716,2.506628277459239];
 const b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572];
 const c=[-.007784894002430293,-.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783];
 const d=[.007784695709041462,.3224671290700398,2.445134137142996,3.754408661907416],cut=.02425;
 if(p<cut){const q=Math.sqrt(-2*Math.log(p));return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
 if(p>1-cut){const q=Math.sqrt(-2*Math.log(1-p));return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
 const q=p-.5,r=q*q;return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
}
function normalIntervalMass(lo,hi){
 if(lo>=0)return lowerNormalCdf(-lo)-lowerNormalCdf(-hi);
 return lowerNormalCdf(hi)-lowerNormalCdf(lo);
}
function sampleTruncatedNormal(lo,hi,random){
 let p;
 if(lo>=0){const a=lowerNormalCdf(-hi),b=lowerNormalCdf(-lo);p=a+random()*(b-a);return -inverseNormalCdf(p);}
 const a=lowerNormalCdf(lo),b=lowerNormalCdf(hi);p=a+random()*(b-a);return inverseNormalCdf(p);
}
function mergedSlitIntervals(p,extentSigma){
 const half=extentSigma*p.sy,raw=p.centers.map(c=>[c-half,c+half]).sort((a,b)=>a[0]-b[0]),merged=[];
 for(const interval of raw){const last=merged.at(-1);if(last&&interval[0]<=last[1])last[1]=Math.max(last[1],interval[1]);else merged.push([...interval]);}
 return merged;
}
function sourceWidth(x,p){return p.sourceSigma*Math.sqrt(1+(x/(2*p.k*p.sourceSigma**2))**2);}
function transmittedMixture(p){
 const incidentVariance=sourceWidth(p.wall,p)**2;
 const apertureVariance=p.sy*p.sy;
 const denominator=incidentVariance+apertureVariance;
 const variance=incidentVariance*apertureVariance/denominator;
 const components=[];
 const weights=apertureWeights(p);
 let maxLogWeight=-Infinity;
 for(let leftIndex=0;leftIndex<p.centers.length;leftIndex++)for(let rightIndex=0;rightIndex<p.centers.length;rightIndex++){
 if(p.whichPath&&leftIndex!==rightIndex)continue;
  if(!(weights[leftIndex]>0&&weights[rightIndex]>0))continue;
  const left=p.centers[leftIndex],right=p.centers[rightIndex];
  const sum=left+right;
  const logWeight=Math.log(weights[leftIndex])+Math.log(weights[rightIndex])-(left*left+right*right)/(4*apertureVariance)
   +incidentVariance*sum*sum/(8*apertureVariance*denominator);
  const component={mean:incidentVariance*sum/(2*denominator),logWeight,slitIndex:p.whichPath?leftIndex:null};
  components.push(component);maxLogWeight=Math.max(maxLogWeight,logWeight);
 }
 let totalWeight=0;
 for(const component of components){component.weight=Math.exp(component.logWeight-maxLogWeight);totalWeight+=component.weight;}
 return {variance,components,totalWeight};
}
export function transmittedCoreFraction(p,extentSigma){
 if(!(extentSigma>0)||!p.centers.length)return 0;
 const {variance,components,totalWeight}=transmittedMixture({...p,whichPath:false});
 const sigma=Math.sqrt(variance),intervals=mergedSlitIntervals(p,extentSigma);
 let inside=0;
 for(const component of components){
  let mass=0;
  for(const interval of intervals)mass+=normalIntervalMass((interval[0]-component.mean)/sigma,(interval[1]-component.mean)/sigma);
  inside+=component.weight*Math.min(1,mass);
 }
 return Math.max(0,Math.min(1,inside/totalWeight));
}
export function normalCoreCoverage(extentSigma){return Math.max(0,Math.min(1,1-2*lowerNormalCdf(-extentSigma)));}
export function maximumCoreSafeSeparation(p,extentSigma,limit,centerSigns=[-1,1],tolerance=.01){
 if(!(limit>0)||!centerSigns.length)return 0;
 const target=Math.max(0,normalCoreCoverage(extentSigma)-tolerance);
 const acceptable=separation=>transmittedCoreFraction({...p,centers:centerSigns.map(sign=>sign*separation/2)},extentSigma)>=target;
 if(acceptable(limit))return limit;
 let lo=0,hi=limit;
 for(let i=0;i<30;i++){const mid=(lo+hi)/2;if(acceptable(mid))lo=mid;else hi=mid;}
 return lo;
}
function sampleLongitudinalX(p,random){
 // Optional upstream preparation keeps every sampled particle outside the canvas.
 // A boundary six sigma ahead of the center excludes less than 1e-9 probability.
 let x;do{x=(p.initialCenter??0)+p.sx*normal(random);}while(x>=Math.min(p.wall,p.initialRight??p.wall));
 return x;
}
function classifySlitSide(wallY,p){
 if(!p.centers?.length)return undefined;
 let nearest=0;
 for(let i=1;i<p.centers.length;i++)if(Math.abs(wallY-p.centers[i])<Math.abs(wallY-p.centers[nearest]))nearest=i;
 const center=p.centers[nearest];
 return center<0?'upper':center>0?'lower':(wallY<=0?'upper':'lower');
}
export function sampleSource(p,random=Math.random,fixedX=null){
 const x=fixedX===null?sampleLongitudinalX(p,random):fixedX;
 const y=sourceWidth(x,p)*normal(random);
 // Before the wall, every incident Bohmian trajectory follows the exact
 // Gaussian width scaling. Its future aperture-plane coordinate is therefore
 // known analytically at injection; keeping it as display metadata avoids a
 // color jump when the particle reaches the wall.
 const wallY=y*sourceWidth(p.wall,p)/sourceWidth(x,p);
 const slitSide=classifySlitSide(wallY,p);
 return {x0:x,x,y,done:false,passed:false,absorbed:false,path:[],wallY,slitSide};
}
export function sampleTransmittedSource(p,random=Math.random,fixedX=null,slitExtentSigma=null){
 // At the wall, the conditional density is exactly
 // |phi(y,L)|^2 T(y)^2.  Expanding the squared sum of Gaussian apertures
 // makes this a finite Gaussian mixture (one component per ordered slit pair).
 // Sampling that mixture avoids rejection, so even vanishingly small total
 // transmission remains fast and cannot exhaust an attempt limit.
 const incidentVariance=sourceWidth(p.wall,p)**2;
 const {variance,components,totalWeight}=transmittedMixture(p);
 let selected,yWall;
 if(slitExtentSigma===null){
  let pick=random()*totalWeight;selected=components[components.length-1];
  for(const component of components){pick-=component.weight;if(pick<=0){selected=component;break;}}
  yWall=selected.mean+Math.sqrt(variance)*normal(random);
 }else{
  // Direct PW adds a finite, explicitly documented slit-core condition.
  // Sample the analytically expanded Gaussian mixture after truncation to the
  // union of the displayed intervals. This remains fast even in remote tails.
  const sigma=Math.sqrt(variance),choices=[];let maxLogChoice=-Infinity;
  for(const component of components)for(const interval of mergedSlitIntervals(p,slitExtentSigma)){
   const lo=(interval[0]-component.mean)/sigma,hi=(interval[1]-component.mean)/sigma,mass=normalIntervalMass(lo,hi);
   if(mass>0){const logWeight=component.logWeight+Math.log(mass);choices.push({component,lo,hi,logWeight});maxLogChoice=Math.max(maxLogChoice,logWeight);}
  }
  let sum=0;for(const choice of choices){choice.weight=Math.exp(choice.logWeight-maxLogChoice);sum+=choice.weight;}
  if(!(sum>0))throw new Error('No probability mass lies inside the displayed slit cores.');
  let pick=random()*sum;selected=choices[choices.length-1];for(const choice of choices){pick-=choice.weight;if(pick<=0){selected=choice;break;}}
  yWall=selected.component.mean+sigma*sampleTruncatedNormal(selected.lo,selected.hi,random);
 }
 const x=fixedX===null?sampleLongitudinalX(p,random):fixedX;
 // Incident Gaussian Bohmian trajectories scale with the packet width.
 // Map the wall sample back analytically to the requested preparation plane.
 const y=yWall*sourceWidth(x,p)/Math.sqrt(incidentVariance);
 const slitIndex=selected.component?.slitIndex??selected.slitIndex;
 const slitSide=classifySlitSide(yWall,p);
 return {x0:x,x,y,done:false,passed:false,absorbed:false,path:[],conditionedTransmission:true,slitIndex,slitSide,wallY:yWall};
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
  if(p.whichPath){
   const components=sourceComponents(a.y,p.wall,p,coeff),incident=gaussian(a.y,p.wall/p.k,p.sourceSigma).rho;
   const transmitted=components.reduce((sum,component)=>sum+component.rho,0);
   if(!a.conditionedTransmission&&random()>transmitted/Math.max(1e-300,incident)){a.done=a.absorbed=true;return 'absorbed';}
   if(a.slitIndex===undefined||a.slitIndex===null){
    let pick=random()*transmitted;a.slitIndex=components.length-1;
    for(let i=0;i<components.length;i++){pick-=components[i].rho;if(pick<=0){a.slitIndex=i;break;}}
   }
   a.slitSide=p.centers[a.slitIndex]<0?'upper':'lower';
  }else if(!a.conditionedTransmission&&random()>aperture(a.y,p)**2){a.done=a.absorbed=true;return 'absorbed';}
  // Display metadata only. Retain the exact transverse coordinate where this
  // transmitted trajectory crossed the aperture plane so color views can
  // encode more than a binary upper/lower classification.
  a.wallY=a.y;
  // Display metadata only: associate a transmitted particle's actual
  // wall-crossing position with the nearest open aperture. This never enters
  // the guidance dynamics or the transmission decision above.
  if(!p.whichPath)a.slitSide=classifySlitSide(a.y,p);
 }
 const target=Math.min(end,p.screen);
 const guidanceCoefficients=p.whichPath&&a.slitIndex!==undefined?[coeff[a.slitIndex]]:coeff;
 a.y=advanceSourceY(a.y,a.x,target-a.x,p,guidanceCoefficients);a.x=target;
 if(a.x>=p.screen){a.done=true;return 'hit';}
 return null;
}
export function sourceProfile(p,ymin,ymax,samples=2049){
 const coeff=sourceCoefficients(p),dy=(ymax-ymin)/(samples-1);
 const values=Array.from({length:samples},(_,i)=>sourceDensity(ymin+i*dy,p.screen,p,coeff));
 const integral=values.reduce((s,v,i)=>s+v*((i===0||i===samples-1)?.5:1),0)*dy;
 return {values,integral};
}
