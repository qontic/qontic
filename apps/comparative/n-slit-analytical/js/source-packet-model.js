// Gaussian-aperture, forward (paraxial) packet model, hbar = mass = 1.
// i (partial_t + k partial_x) u = -partial_y^2 u / 2.
// The longitudinal envelope translates; longitudinal dispersion and reflection
// are outside this approximation. No numerical wave-equation solver is used.
import {gaussian} from './packet-model.js?cache=nslit30';

function apertureWeights(p){
 return p.apertureWeights?.length===p.centers.length?p.apertureWeights:p.centers.map(()=>1);
}
// The bound depends only on the geometry, so it is computed once per
// configuration object (the grid search for N > 2 costs ~0.1 ms).
const boundCache=new WeakMap();
function apertureBound(p){
 const key=p.centers.join(',')+'|'+p.sy+'|'+(p.apertureWeights||[]).join(',');
 const hit=boundCache.get(p);if(hit&&hit.key===key)return hit.value;
 const value=computeApertureBound(p);boundCache.set(p,{key,value});return value;
}
function computeApertureBound(p){
 const weights=apertureWeights(p);
 if(weights.length<2)return weights[0]||1;
 if(weights.length===2){
  const high=Math.max(...weights),low=Math.min(...weights);
  return high+low*Math.exp(-((p.centers[1]-p.centers[0])**2)/(16*p.sy*p.sy));
 }
 // More than two apertures: the largest value of the summed Gaussian mask, so
 // that T ≤ 1. Coarse scan in steps of σ/4, then golden-section refinement
 // around the best point (the sum is smooth on that scale).
 const mask=y=>{let sum=0;for(let j=0;j<p.centers.length;j++)sum+=weights[j]*Math.exp(-((y-p.centers[j])**2)/(4*p.sy*p.sy));return sum;};
 const lo=Math.min(...p.centers)-2*p.sy,hi=Math.max(...p.centers)+2*p.sy,step=p.sy/4;
 let bestY=lo,best=-1;
 for(let y=lo;y<=hi+1e-12;y+=step){const v=mask(y);if(v>best){best=v;bestY=y;}}
 let a=bestY-step,b=bestY+step;const g=(Math.sqrt(5)-1)/2;
 let c=b-g*(b-a),d=a+g*(b-a),fc=mask(c),fd=mask(d);
 for(let i=0;i<40;i++){if(fc>fd){b=d;d=c;fd=fc;c=b-g*(b-a);fc=mask(c);}else{a=c;c=d;fc=fd;d=a+g*(b-a);fd=mask(d);}}
 best=Math.max(best,fc,fd);
 return best*(1+1e-4);
}

// Which-path branches. A detector at one slit records "this slit" or "another
// slit": two branches, {detector slit} and {all other open slits}. Within a
// branch the slits stay coherent. p.branchOf gives the branch of each aperture
// (0 or 1); without it every aperture is its own branch, which for two slits is
// the same partition.
export function branchOf(p){
 return p.branchOf?.length===p.centers.length?p.branchOf:p.centers.map((_,index)=>index);
}
// Which-slit branches for detectors on some open slits: one branch per detected
// slit and one for all undetected open slits together; ids in slit order (for
// two slits, branch i is aperture i).
export function detectorBranches(slitIds,detectorSlits){
 let next=0,undetected=-1;
 return slitIds.map(k=>{if(detectorSlits.includes(k))return next++;if(undetected<0)undetected=next++;return undetected;});
}
export function branchCount(p){return p.whichPath?Math.max(...branchOf(p))+1:1;}
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
// Factors shared by all apertures at one x (ar and ai are the same for every
// aperture): computed once per x instead of once per aperture.
function sharedFactors(x,p,a){
 const u=(x-p.wall)/p.k,rr=1-2*a.ai*u,ii=2*a.ar*u,dd=rr*rr+ii*ii;
 return {u,rr,ii,dd,root:Math.pow(dd,.25),angle:Math.atan2(ii,rr)/2};
}
function propagatedComponent(y,x,p,a,f=sharedFactors(x,p,a)){
 const {u,rr,ii,dd}=f;
  const q=y-a.center,nr=-a.ar*q*q+a.br*q-u*a.br*a.bi,ni=-a.ai*q*q+a.bi*q+u*(a.br*a.br-a.bi*a.bi)/2;
  const er=(nr*rr+ni*ii)/dd,ei=(ni*rr-nr*ii)/dd;
  const amp=Math.exp(er)/f.root,phase=ei-f.angle;
  const fr=amp*Math.cos(phase),fi=amp*Math.sin(phase);
  const r=a.cr*fr-a.ci*fi,i=a.cr*fi+a.ci*fr;
  const lr=((-2*a.ar*q+a.br)*rr+(-2*a.ai*q+a.bi)*ii)/dd;
  const li=((-2*a.ai*q+a.bi)*rr-(-2*a.ar*q+a.br)*ii)/dd;
 const dr=lr*r-li*i,di=lr*i+li*r,rho=r*r+i*i;
 return {re:r,im:i,dr,di,rho,v:rho>1e-26?(r*di-i*dr)/rho:0};
}
export function sourceComponents(y,x,p,coeff=sourceCoefficients(p)){
 if(x<p.wall){const g=gaussian(y,x/p.k,p.sourceSigma);return [{...g,v:(g.re*g.di-g.im*g.dr)/Math.max(1e-300,g.rho)}];}
 const f=sharedFactors(x,p,coeff[0]);
 return coeff.map(a=>propagatedComponent(y,x,p,a,f));
}
export function sourceTransverse(y,x,p,coeff=sourceCoefficients(p)){
 if(x<p.wall)return sourceComponents(y,x,p,coeff)[0];
 // Same arithmetic as propagatedComponent, summed without allocating one object
 // per aperture. Apertures whose Gaussian factor underflows (exp → 0 exactly)
 // contribute nothing and are skipped, so the result is unchanged.
 const f=sharedFactors(x,p,coeff[0]),{u,rr,ii,dd}=f;
 let re=0,im=0,dr=0,di=0;
 for(let n=0;n<coeff.length;n++){
  const a=coeff[n],q=y-a.center,nr=-a.ar*q*q+a.br*q-u*a.br*a.bi,ni=-a.ai*q*q+a.bi*q+u*(a.br*a.br-a.bi*a.bi)/2;
  const er=(nr*rr+ni*ii)/dd;if(er<-746)continue;
  const ei=(ni*rr-nr*ii)/dd,amp=Math.exp(er)/f.root,phase=ei-f.angle;
  const fr=amp*Math.cos(phase),fi=amp*Math.sin(phase);
  const r=a.cr*fr-a.ci*fi,i=a.cr*fi+a.ci*fr;
  const lr=((-2*a.ar*q+a.br)*rr+(-2*a.ai*q+a.bi)*ii)/dd;
  const li=((-2*a.ai*q+a.bi)*rr-(-2*a.ar*q+a.br)*ii)/dd;
  re+=r;im+=i;dr+=lr*r-li*i;di+=lr*i+li*r;
 }
 const rho=re*re+im*im;
 return {re,im,dr,di,rho,v:rho>1e-26?(re*di-im*dr)/rho:0};
}
// Density and phase on a whole column of y values at one x (display grid). Same
// arithmetic as sourceTransverse, with the x-dependent factors computed once per
// column instead of once per cell, and without the derivative.
export function sourceColumn(x,ys,p,coeff,rhoOut,phaseOut){
 if(x<p.wall){for(let j=0;j<ys.length;j++){const g=sourceTransverse(ys[j],x,p,coeff);rhoOut[j]=g.rho;phaseOut[j]=Math.atan2(g.im,g.re);}return;}
 const f=sharedFactors(x,p,coeff[0]),{u,rr,ii,dd}=f,root=f.root,angle=f.angle;
 for(let j=0;j<ys.length;j++){
  const y=ys[j];let re=0,im=0;
  for(let n=0;n<coeff.length;n++){
   const a=coeff[n],q=y-a.center,nr=-a.ar*q*q+a.br*q-u*a.br*a.bi,ni=-a.ai*q*q+a.bi*q+u*(a.br*a.br-a.bi*a.bi)/2;
   const er=(nr*rr+ni*ii)/dd;if(er<-746)continue;
   const ei=(ni*rr-nr*ii)/dd,amp=Math.exp(er)/root,phase=ei-angle,fr=amp*Math.cos(phase),fi=amp*Math.sin(phase);
   re+=a.cr*fr-a.ci*fi;im+=a.cr*fi+a.ci*fr;
  }
  rhoOut[j]=re*re+im*im;phaseOut[j]=Math.atan2(im,re);
 }
}
// Coherent sum of the apertures in each which-path branch (one entry per branch).
export function sourceBranches(y,x,p,coeff=sourceCoefficients(p)){
 const branches=branchOf(p),out=Array.from({length:branchCount(p)},()=>({re:0,im:0,dr:0,di:0}));
 sourceComponents(y,x,p,coeff).forEach((component,index)=>{const b=out[branches[index]];b.re+=component.re;b.im+=component.im;b.dr+=component.dr;b.di+=component.di;});
 for(const b of out){b.rho=b.re*b.re+b.im*b.im;b.v=b.rho>1e-26?(b.re*b.di-b.im*b.dr)/b.rho:0;}
 return out;
}
export function sourceDensity(y,x,p,coeff=sourceCoefficients(p)){
 if(!p.whichPath||x<p.wall)return sourceTransverse(y,x,p,coeff).rho;
 return sourceBranches(y,x,p,coeff).reduce((sum,branch)=>sum+branch.rho,0);
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
 const weights=apertureWeights(p),branches=branchOf(p);
 let maxLogWeight=-Infinity;
 for(let leftIndex=0;leftIndex<p.centers.length;leftIndex++)for(let rightIndex=0;rightIndex<p.centers.length;rightIndex++){
 if(p.whichPath&&branches[leftIndex]!==branches[rightIndex])continue;
  if(!(weights[leftIndex]>0&&weights[rightIndex]>0))continue;
  const left=p.centers[leftIndex],right=p.centers[rightIndex];
  const sum=left+right;
  const logWeight=Math.log(weights[leftIndex])+Math.log(weights[rightIndex])-(left*left+right*right)/(4*apertureVariance)
   +incidentVariance*sum*sum/(8*apertureVariance*denominator);
  const component={mean:incidentVariance*sum/(2*denominator),logWeight,slitIndex:p.whichPath?branches[leftIndex]:null};
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
// Display group of a particle: the nearest open aperture at the wall, named by
// its slit number (k0 = top slit) so colours follow the slit, not its rank.
export function classifySlitSide(wallY,p){
 if(!p.centers?.length)return undefined;
 let nearest=0;
 for(let i=1;i<p.centers.length;i++)if(Math.abs(wallY-p.centers[i])<Math.abs(wallY-p.centers[nearest]))nearest=i;
 return 'k'+(p.slitIds?.[nearest]??nearest);
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
// Transverse guidance velocity behind the wall, v = Im(∂_yψ/ψ), without
// allocating. Same terms as sourceTransverse, except that an aperture whose
// Gaussian factor is below e^-40 (4e-18) of the largest one is skipped: its
// share of ψ and ∂_yψ is below double-precision rounding of the dominant term.
const exponentScratch=new Float64Array(64);
export function sourceVelocity(y,p,coeff,f){
 const {u,rr,ii,dd}=f;let top=-Infinity;
 for(let n=0;n<coeff.length;n++){
  const a=coeff[n],q=y-a.center,nr=-a.ar*q*q+a.br*q-u*a.br*a.bi,ni=-a.ai*q*q+a.bi*q+u*(a.br*a.br-a.bi*a.bi)/2,er=(nr*rr+ni*ii)/dd;
  exponentScratch[n]=er;if(er>top)top=er;
 }
 const cut=Math.max(-746,top-40);let re=0,im=0,dr=0,di=0;
 for(let n=0;n<coeff.length;n++){
  const er=exponentScratch[n];if(er<cut)continue;
  const a=coeff[n],q=y-a.center,nr=-a.ar*q*q+a.br*q-u*a.br*a.bi,ni=-a.ai*q*q+a.bi*q+u*(a.br*a.br-a.bi*a.bi)/2;
  const ei=(ni*rr-nr*ii)/dd,amp=Math.exp(er)/f.root,phase=ei-f.angle,fr=amp*Math.cos(phase),fi=amp*Math.sin(phase);
  const r=a.cr*fr-a.ci*fi,i=a.cr*fi+a.ci*fr;
  const lr=((-2*a.ar*q+a.br)*rr+(-2*a.ai*q+a.bi)*ii)/dd,li=((-2*a.ai*q+a.bi)*rr-(-2*a.ar*q+a.br)*ii)/dd;
  re+=r;im+=i;dr+=lr*r-li*i;di+=lr*i+li*r;
 }
 const rho=re*re+im*im;
 return rho>1e-26?(re*di-im*dr)/rho:0;
}
// Dormand–Prince 5(4) step with error control for dy/dx = v(y, x)/k behind the
// wall. Tolerance 1e-6 (units of 100 nm, i.e. 1e-4 nm) per step. Against a fine
// fixed-step RK4 reference (h0/8), final screen positions agree to ≤ 0.02 nm for
// 2, 4 and 8 slits (screens 1000–3000 nm) with 3.5–5× fewer field evaluations than
// the fixed RK4 step used before.
const DP_A=[[],[1/5],[3/40,9/40],[44/45,-56/15,32/9],[19372/6561,-25360/2187,64448/6561,-212/729],[9017/3168,-355/33,46732/5247,49/176,-5103/18656],[35/384,0,500/1113,125/192,-2187/6784,11/84]];
const DP_C=[0,1/5,3/10,4/5,8/9,1,1],DP_E=[71/57600,0,-71/16695,71/1920,-17253/339200,22/525,-1/40],DP_TOL=1e-6;
const dpK=new Float64Array(7);
function guidedSegment(g,p){
 const coeff=g.guidance;
 for(let attempt=0;attempt<60;attempt++){
  const x=g.x1,y=g.y1,h=Math.min(g.h,p.screen-x);dpK[0]=g.s1;
  for(let st=1;st<7;st++){let yy=y;for(let j=0;j<st;j++)yy+=h*DP_A[st][j]*dpK[j];const z=x+DP_C[st]*h;dpK[st]=sourceVelocity(yy,p,coeff,sharedFactors(z,p,coeff[0]))/p.k;}
  let y5=y,err=0;for(let j=0;j<7;j++){if(j<6)y5+=h*DP_A[6][j]*dpK[j];err+=h*DP_E[j]*dpK[j];}
  err=Math.abs(err);
  const grow=Math.min(5,Math.max(.2,.9*Math.pow(DP_TOL/Math.max(err,1e-300),.2)));
  if(err<=DP_TOL||h<1e-6){g.x0=x;g.y0=y;g.s0=g.s1;g.x1=x+h;g.y1=y5;g.s1=dpK[6];g.h=h*grow;return;}
  g.h=h*grow;
 }
}
function hermite(g,x){
 const h=g.x1-g.x0,t=(x-g.x0)/h,t2=t*t,t3=t2*t;
 return (2*t3-3*t2+1)*g.y0+(t3-2*t2+t)*h*g.s0+(-2*t3+3*t2)*g.y1+(t3-t2)*h*g.s1;
}
export function advanceSourceY(y,x,dx,p,coeff){
 // Incident Gaussian trajectories have a closed expression; transmitted
 // guidance is integrated along x. Split exactly at the aperture plane.
 if(dx<=0)return y;
 if(x<p.wall){const end=Math.min(x+dx,p.wall),s=2*p.k*p.sourceSigma**2;
  y*=Math.sqrt((1+(end/s)**2)/(1+(x/s)**2));
  if(end===x+dx)return y;dx=x+dx-end;x=end;
 }
 // The x-dependent factors are shared by the two midpoint evaluations.
 const f0=sharedFactors(x,p,coeff[0]),fm=sharedFactors(x+dx/2,p,coeff[0]),f1=sharedFactors(x+dx,p,coeff[0]);
 const a=sourceVelocity(y,p,coeff,f0)/p.k,b=sourceVelocity(y+dx*a/2,p,coeff,fm)/p.k,c=sourceVelocity(y+dx*b/2,p,coeff,fm)/p.k,d=sourceVelocity(y+dx*c,p,coeff,f1)/p.k;
 return y+dx*(a+2*b+2*c+d)/6;
}
export function stepSource(a,dt,p,coeff,random=Math.random){
 if(a.done)return null;
 const end=a.x+p.k*dt;
 if(!a.passed&&end>=p.wall){
  a.y=advanceSourceY(a.y,a.x,p.wall-a.x,p,coeff);a.x=p.wall;a.passed=true;
  if(p.whichPath){
   const components=sourceBranches(a.y,p.wall,p,coeff),incident=gaussian(a.y,p.wall/p.k,p.sourceSigma).rho;
   const transmitted=components.reduce((sum,component)=>sum+component.rho,0);
   if(!a.conditionedTransmission&&random()>transmitted/Math.max(1e-300,incident)){a.done=a.absorbed=true;return 'absorbed';}
   if(a.slitIndex===undefined||a.slitIndex===null){
    let pick=random()*transmitted;a.slitIndex=components.length-1;
    for(let i=0;i<components.length;i++){pick-=components[i].rho;if(pick<=0){a.slitIndex=i;break;}}
   }
  }else if(!a.conditionedTransmission&&random()>aperture(a.y,p)**2){a.done=a.absorbed=true;return 'absorbed';}
  // Display metadata only. Retain the exact transverse coordinate where this
  // transmitted trajectory crossed the aperture plane so color views can
  // encode more than a binary upper/lower classification.
  a.wallY=a.y;
  // Display metadata only: associate a transmitted particle's actual
  // wall-crossing position with the nearest open aperture. This never enters
  // the guidance dynamics or the transmission decision above.
  a.slitSide=classifySlitSide(a.y,p);
 }
 const target=Math.min(end,p.screen);
 if(!a.passed){a.y=advanceSourceY(a.y,a.x,target-a.x,p,coeff);a.x=target;}
 else{
  // Behind the wall: each trajectory is integrated with its own error-controlled
  // step (see guidedSegment); positions between its accepted points are drawn by
  // cubic Hermite interpolation. The screen is always an accepted point.
  if(!a.guide||a.guide.coeff!==coeff){
   const guidanceCoefficients=p.whichPath&&a.slitIndex!==undefined&&a.slitIndex!==null?coeff.filter((_,index)=>branchOf(p)[index]===a.slitIndex):coeff;
   const v=sourceVelocity(a.y,p,guidanceCoefficients,sharedFactors(a.x,p,guidanceCoefficients[0]))/p.k;
   a.guide={coeff,guidance:guidanceCoefficients,x0:a.x,y0:a.y,s0:v,x1:a.x,y1:a.y,s1:v,h:p.k*Math.min(.005,.02*p.sy*p.sy,p.sx/p.k/30)};
  }
  const g=a.guide;
  while(g.x1<target-1e-12)guidedSegment(g,p);
  a.y=target>=g.x1-1e-12?g.y1:hermite(g,target);a.x=target;
 }
 if(a.x>=p.screen){a.done=true;return 'hit';}
 return null;
}
export function sourceProfile(p,ymin,ymax,samples=2049){
 const coeff=sourceCoefficients(p),dy=(ymax-ymin)/(samples-1);
 const values=Array.from({length:samples},(_,i)=>sourceDensity(ymin+i*dy,p.screen,p,coeff));
 const integral=values.reduce((s,v,i)=>s+v*((i===0||i===samples-1)?.5:1),0)*dy;
 return {values,integral};
}

// Pilot-wave screen bands. Coherent trajectories in this paraxial model cannot
// cross (the transverse velocity at a point is single-valued), so each keeps the
// fraction of the probability above it. Slit k, with weight p_k and cumulative
// weight P_k counted from the top, lands where the screen density has between
// P_(k-1) and P_k of its probability above. The weight of a slit is the
// transmitted probability between the midpoints to its open neighbours.
// Not defined with the which-slit detector (a mixture, not one guiding wave).
export function slitBands(p,coeff=sourceCoefficients(p),screenSpan=12,n=8193){
 if(!p||p.whichPath||!p.centers||p.centers.length<2)return null;
 const top=Math.min(...p.centers)-12*p.sy-1,bottom=Math.max(...p.centers)+12*p.sy+1;
 const R=Math.max(screenSpan,bottom-top)*3,lo=Math.min(top,-R),hi=Math.max(bottom,R),dy=(hi-lo)/(n-1);
 const cumulative=x=>{const c=new Float64Array(n);let prev=sourceTransverse(lo,x,p,coeff).rho;for(let i=1;i<n;i++){const v=sourceTransverse(lo+i*dy,x,p,coeff).rho;c[i]=c[i-1]+.5*(v+prev)*dy;prev=v;}const t=c[n-1]||1;for(let i=0;i<n;i++)c[i]/=t;return c;};
 const wall=cumulative(p.wall+1e-9),screen=cumulative(p.screen);
 const at=(c,y)=>{const f=(y-lo)/dy;if(f<=0)return 0;if(f>=n-1)return 1;const i=Math.floor(f);return c[i]+(c[i+1]-c[i])*(f-i);};
 const inv=(c,q)=>{let a=0,b=n-1;while(b-a>1){const m=(a+b)>>1;if(c[m]<q)a=m;else b=m;}const f=c[b]>c[a]?(q-c[a])/(c[b]-c[a]):.5;return lo+(a+f)*dy;};
 const P=[0];for(let i=0;i<p.centers.length-1;i++)P.push(at(wall,.5*(p.centers[i]+p.centers[i+1])));P.push(1);
 return p.centers.map((_,i)=>({group:'k'+(p.slitIds?.[i]??i),weight:P[i+1]-P[i],top:i===0?-Infinity:inv(screen,P[i]),bottom:i===p.centers.length-1?Infinity:inv(screen,P[i+1])}));
}
