// Circular (2-D point-source) packets, hbar=m=1.
// Exact outgoing Helmholtz kernels and Schrodinger frequency evolution.
// A prescribed thin aperture boundary is an approximation to wall scattering.
// The spectral integrals are quadrature, not time stepping of the wave PDE.
import {aperture} from './source-packet-model.js?v=42';

export function hankel0(z) {
  if (!(z>0)) throw new RangeError('The ideal point source is singular at r=0');
  if(z<12){
    const q=-z*z/4;let term=1,j=1,s=0,h=0;
    for(let n=1;n<100;n++) {term*=q/(n*n);h+=1/n;j+=term;s-=h*term;if(Math.abs(term)<1e-16)break;}
    return [j,2/Math.PI*((Math.log(z/2)+0.5772156649015329)*j+s)];
  }
  let re=1,im=0,term=1,previous=Infinity;
  for(let n=1;n<50;n++){
    term*=-((2*n-1)**2)/(8*n*z);
    if(Math.abs(term)>previous)break;previous=Math.abs(term);
    const phase=n%4;if(phase===0)re+=term;else if(phase===1)im+=term;else if(phase===2)re-=term;else im-=term;
    if(Math.abs(term)<1e-16)break;
  }
  const a=Math.sqrt(2/(Math.PI*z)),c=Math.cos(z-Math.PI/4),s=Math.sin(z-Math.PI/4);
  return [a*(re*c-im*s),a*(re*s+im*c)];
}

// Analytic radial derivative: d H0(z)/dz = -H1(z).
export function hankel1(z){
 if(!(z>0))throw new RangeError('Positive radius required');
 if(z<12){
  const q=-z*z/4;let term=1,j=1,dj=0,ds=0,h=0;
  for(let n=1;n<100;n++){term*=q/(n*n);h+=1/n;j+=term;dj+=2*n*term/z;ds-=2*n*h*term/z;if(Math.abs(term)<1e-16)break;}
  return [-dj,-2/Math.PI*(j/z+(Math.log(z/2)+.5772156649015329)*dj+ds)];
 }
 let re=1,im=0,term=1,previous=Infinity;
 for(let n=1;n<50;n++){
  term*=(4-(2*n-1)**2)/(8*n*z);if(Math.abs(term)>previous)break;previous=Math.abs(term);
  const phase=n%4;if(phase===0)re+=term;else if(phase===1)im+=term;else if(phase===2)re-=term;else im-=term;
  if(Math.abs(term)<1e-16)break;
 }
 const a=Math.sqrt(2/(Math.PI*z)),c=Math.cos(z-3*Math.PI/4),s=Math.sin(z-3*Math.PI/4);
 return [a*(re*c-im*s),a*(re*s+im*c)];
}

export function spectrum(p,n=96){
  const low=Math.max(.02,p.k-4/p.sx),high=p.k+4/p.sx,dk=(high-low)/(n-1);
  return Array.from({length:n},(_,i)=>{const k=low+dk*i;return {k,omega:k*k/2,weight:Math.exp(-((p.sx*(k-p.k))**2))*dk*((i===0||i===n-1)?.5:1)};});
}

export function gaussLegendre(n,lo,hi){
  const out=[];
  for(let j=1;j<=n;j++){
    let z=Math.cos(Math.PI*(j-.25)/(n+.5)),dp=0;
    for(let it=0;it<30;it++){
      let a=1,b=z;for(let m=2;m<=n;m++){const c=((2*m-1)*z*b-(m-1)*a)/m;a=b;b=c;}
      dp=n*(z*b-a)/(z*z-1);const dz=b/dp;z-=dz;if(Math.abs(dz)<1e-14)break;
    }
    out.push({x:(lo+hi)/2+(hi-lo)*z/2,w:(hi-lo)/((1-z*z)*dp*dp)});
  }
  return out;
}

// q=k sin(theta) and |q|=k cosh(u) remove the grazing-angle
// square-root singularity. Include evanescent components to match the mask.
export function angularModes(p,k,order=96){
  const samples=[];
  const bound=p.centers.length===2?1+Math.exp(-((p.centers[1]-p.centers[0])**2)/(16*p.sy*p.sy)):1;
  for(const center of p.centers)for(const a of gaussLegendre(Math.max(192,Math.ceil((k*p.sy+8)*18/Math.PI)+40),center-9*p.sy,center+9*p.sy)){
    const [re,im]=hankel0(k*Math.hypot(p.wall,a.x)),w=a.w*Math.exp(-((a.x-center)**2)/(4*p.sy*p.sy))/bound;
    samples.push({y:a.x,re:re*w,im:im*w});
  }
  const modes=gaussLegendre(order,-Math.PI/2,Math.PI/2).map(a=>({q:k*Math.sin(a.x),kx:k*Math.cos(a.x),decay:0,w:a.w*k*Math.cos(a.x)/(2*Math.PI)}));
  const umax=Math.acosh(1+8/(p.sy*k));
  for(const sign of [-1,1])for(const a of gaussLegendre(Math.max(128,order),0,umax))modes.push({q:sign*k*Math.cosh(a.x),kx:0,decay:k*Math.sinh(a.x),w:a.w*k*Math.sinh(a.x)/(2*Math.PI)});
  for(const m of modes){let re=0,im=0;for(const a of samples){const c=Math.cos(m.q*a.y),s=-Math.sin(m.q*a.y);re+=a.re*c-a.im*s;im+=a.re*s+a.im*c;}m.re=re*m.w;m.im=im*m.w;}
  return modes;
}

export function angularPoint(modes,d,y){
  let re=0,im=0,dr=0,di=0,yr=0,yi=0;
  for(const m of modes){const phase=m.kx*d+m.q*y,amp=Math.exp(-m.decay*d),c=amp*Math.cos(phase),s=amp*Math.sin(phase),r=m.re*c-m.im*s,i=m.re*s+m.im*c;
    re+=r;im+=i;dr+=-m.decay*r-m.kx*i;di+=-m.decay*i+m.kx*r;yr-=m.q*i;yi+=m.q*r;
  }
  return {re,im,dr,di,yr,yi};
}

export function angularCoefficients(p,x,y,{frequencies=96,order=96}={}){
  return spectrum(p,frequencies).map(f=>({...f,...angularPoint(angularModes(p,f.k,order),x-p.wall,y)}));
}

export function evaluate(coeff,t,emission){
  let re=0,im=0,dr=0,di=0;
  for(const f of coeff){const a=-f.omega*(t-emission),c=f.weight*Math.cos(a),s=f.weight*Math.sin(a);
    re+=f.re*c-f.im*s;im+=f.re*s+f.im*c;dr+=f.dr*c-f.di*s;di+=f.dr*s+f.di*c;
  }
  return {re,im,rho:re*re+im*im,jx:re*di-im*dr};
}

export function screenFrame(table,t,emission){
  const {ny,freq,screenReal:r,screenImag:i,screenDr:dr,screenDi:di}=table;
  const out=new Float64Array(ny);
  for(let j=0;j<ny;j++){
    let re=0,im=0,dxr=0,dxi=0;
    for(let f=0;f<freq.length;f++){
      const a=-freq[f].omega*(t-emission),c=freq[f].weight*Math.cos(a),s=freq[f].weight*Math.sin(a),z=f*ny+j;
      re+=r[z]*c-i[z]*s;im+=r[z]*s+i[z]*c;dxr+=dr[z]*c-di[z]*s;dxi+=dr[z]*s+di[z]*c;
    }
    out[j]=re*dxi-im*dxr;
  }
  return out;
}
