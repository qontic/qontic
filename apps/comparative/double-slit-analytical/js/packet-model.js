// Dimensionless units: hbar = mass = 1. Exact free Gaussian propagation.
export const defaults={sx:1.2,sy:0.8,separation:6,k:4,screen:24,bins:40,particles:300,slits:2,duration:12};
export function gaussian(q,t,s,center=0,k=0){
 const b=t/(2*s*s),u=q-center-k*t,D=1+b*b;
 const amplitude=Math.exp(-u*u/(4*s*s*D))/Math.pow(2*Math.PI*s*s*D,.25);
 const phase=k*(q-center)-k*k*t/2+u*u*b/(4*s*s*D)-Math.atan(b)/2;
 const re=amplitude*Math.cos(phase),im=amplitude*Math.sin(phase);
 const lr=-u/(2*s*s*D),li=u*b/(2*s*s*D)+k;
 return {re,im,dr:lr*re-li*im,di:lr*im+li*re,rho:amplitude*amplitude};
}
export function transverse(y,t,p){
 const a=gaussian(y,t,p.sy,p.slits===1?0:-p.separation/2);
 if(p.slits===1)return {...a,v:(a.re*a.di-a.im*a.dr)/Math.max(a.rho,1e-300)};
 const b=gaussian(y,t,p.sy,p.separation/2),norm=Math.sqrt(2*(1+Math.exp(-(p.separation**2)/(8*p.sy*p.sy))));
 const re=(a.re+b.re)/norm,im=(a.im+b.im)/norm,dr=(a.dr+b.dr)/norm,di=(a.di+b.di)/norm,rho=re*re+im*im;
 return {re,im,dr,di,rho,v:rho>1e-24?(re*di-im*dr)/rho:0};
}
export function longitudinal(x,t,p){const g=gaussian(x,t,p.sx,0,p.k);return {...g,v:p.k+(x-p.k*t)*t/(4*p.sx**4+t*t)};}
export function positionX(x0,t,p){return p.k*t+x0*Math.sqrt(1+(t/(2*p.sx*p.sx))**2);}
export function advanceY(y,t,dt,p){
 const v=(q,s)=>transverse(q,s,p).v;
 const a=v(y,t),b=v(y+dt*a/2,t+dt/2),c=v(y+dt*b/2,t+dt/2),d=v(y+dt*c,t+dt);
 return y+dt*(a+2*b+2*c+d)/6;
}
// Smooth time-integrated screen current, independent of detector pixel count.
export function screenProfile(p,ymin,ymax,samples=1025,steps=1000){
 const values=Array(samples).fill(0),dy=(ymax-ymin)/(samples-1),dt=p.duration/steps;
 for(let j=0;j<steps;j++){
  const t=(j+.5)*dt,g=longitudinal(p.screen,t,p),weight=g.rho*g.v*dt;
  if(weight<1e-15)continue;
  for(let i=0;i<samples;i++)values[i]+=weight*transverse(ymin+i*dy,t,p).rho;
 }
 const integral=values.reduce((sum,v,i)=>sum+v*((i===0||i===samples-1)?.5:1),0)*dy;
 return {values,integral};
}
// Both the smooth curve and observed counts use the same count-to-pixel scale.
// Packet number, launched particles and animation time intentionally play no role.
export function histogramLayout(record,profile,screenHeight,width){
 const total=record.reduce((a,b)=>a+b,0),binHeight=screenHeight/record.length;
 const curve=profile.values.map(v=>v/Math.max(1e-30,profile.integral)*binHeight*(total||1));
 const max=Math.max(1e-30,...curve,...record.map(n=>n+Math.sqrt(n)));
 return {curve,scale:Math.max(0,width-8)/max,total};
}
// Display mapping for the optional height graph. Signed quantities use 1/2 as
// zero so the WebGL surface remains above its plotting plane.
export function surfaceHeightValue(mode,densityRatio,cosTheta,sinTheta){
 const density=Math.max(0,Math.min(1,densityRatio)),amplitude=Math.sqrt(density);
 if(mode==='phase')return .5+.5*cosTheta;
 if(mode==='real')return .5+.5*amplitude*cosTheta;
 if(mode==='imag')return .5+.5*amplitude*sinTheta;
 return density;
}
export function surfaceDisplayDensity(densityRatio,gain=3){
 const density=Math.max(0,Math.min(1,densityRatio));
 return gain>0?-Math.expm1(-gain*density)/-Math.expm1(-gain):density;
}
export function surfaceZeroLevel(mode,height=.72){
 return ['phase','real','imag'].includes(mode)?height/2:0;
}
export function surfacePhaseRate(physicalRate,cap=2){
 return Math.min(Math.max(0,physicalRate),cap);
}
