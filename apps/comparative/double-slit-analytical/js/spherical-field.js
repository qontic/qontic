import {aimedAngle} from './packet-cache.js?v=45';
import {spectrum,hankel0,hankel1,angularModes,screenFrame,evaluate} from './spherical-packet-model.js?v=45';
const COMPONENTS=['re','im','dr','di','yr','yi'];
export function build(p,{nx=144,ny=161,xmin=-.5,xmax=p.screen,ymin=-6,ymax=6,frequencies=96,order=96}={}){
 const freq=spectrum(p,frequencies),xs=Float64Array.from({length:nx},(_,i)=>xmin+(xmax-xmin)*i/(nx-1)),ys=Float64Array.from({length:ny},(_,j)=>ymin+(ymax-ymin)*j/(ny-1));
 const size=nx*ny,components=COMPONENTS.map(()=>new Float32Array(size*frequencies));
 const edge=COMPONENTS.map(()=>new Float64Array(ny*frequencies)),screen=COMPONENTS.map(()=>new Float64Array(ny*frequencies));
 for(let f=0;f<freq.length;f++){
  const k=freq[f].k,modes=angularModes(p,k,order);
  const basis=modes.map(m=>({m,r:Float64Array.from(ys,y=>Math.cos(m.q*y)),i:Float64Array.from(ys,y=>Math.sin(m.q*y))}));
  function column(x,arrays,offset,stride){
   for(const {m,r:cy,i:sy} of basis){
    const d=x-p.wall,a=Math.exp(-m.decay*d),c=a*Math.cos(m.kx*d),s=a*Math.sin(m.kx*d),ar=m.re*c-m.im*s,ai=m.re*s+m.im*c;
    if(a<1e-14)continue;
    for(let j=0;j<ny;j++){
     const r=ar*cy[j]-ai*sy[j],i=ar*sy[j]+ai*cy[j],z=offset+j*stride;
     arrays[0][z]+=r;arrays[1][z]+=i;arrays[2][z]+=-m.decay*r-m.kx*i;arrays[3][z]+=-m.decay*i+m.kx*r;arrays[4][z]-=m.q*i;arrays[5][z]+=m.q*r;
    }
   }
  }
  column(p.wall,edge,f*ny,1);column(p.screen,screen,f*ny,1);
  for(let i=0;i<nx;i++){
   const x=xs[i];
   if(x>=p.wall)column(x,components,f*size+i,nx);
   else for(let j=0;j<ny;j++){
    const y=ys[j],radius=Math.max(.08,Math.hypot(x,y)),[r,q]=hankel0(k*radius),a=hankel1(k*radius),dr=-k*a[0],di=-k*a[1],z=f*size+j*nx+i;
    const v=[r,q,dr*x/radius,di*x/radius,dr*y/radius,di*y/radius];for(let n=0;n<6;n++)components[n][z]=v[n];
   }
  }
 }
 const radialN=1024,rmin=p.radius||.08,rmax=Math.hypot(p.screen,Math.max(Math.abs(ymin),Math.abs(ymax)))+1,radial=COMPONENTS.map(()=>new Float32Array(radialN*freq.length));
 for(let f=0;f<freq.length;f++)for(let j=0;j<radialN;j++){
  const r=rmin+(rmax-rmin)*j/(radialN-1),k=freq[f].k,a=hankel0(k*r),b=hankel1(k*r),z=f*radialN+j;
  radial[0][z]=a[0];radial[1][z]=a[1];radial[2][z]=-k*b[0];radial[3][z]=-k*b[1];
 }
 return {p,freq,xs,ys,nx,ny,size,components,edge,screen,radial,radialN,rmin,rmax,xmin,xmax,ymin,ymax,screenReal:screen[0],screenImag:screen[1],screenDr:screen[2],screenDi:screen[3]};
}
export function synthesize(table,t){
 const {freq,components,size,edge,screen,ny,p}=table,phase=freq.map(f=>{const a=-f.omega*(t-p.emission);return [f.weight*Math.cos(a),f.weight*Math.sin(a)];});
 function combine(input,n){const out=COMPONENTS.map(()=>new Float32Array(n));
 const [r,q,dr,di,yr,yi]=input,[a,b,d,e,g,h]=out;
  for(let f=0;f<freq.length;f++){const [c,s]=phase[f],offset=f*n;
   for(let j=0;j<n;j++){const z=offset+j;a[j]+=r[z]*c-q[z]*s;b[j]+=r[z]*s+q[z]*c;d[j]+=dr[z]*c-di[z]*s;e[j]+=dr[z]*s+di[z]*c;g[j]+=yr[z]*c-yi[z]*s;h[j]+=yr[z]*s+yi[z]*c;}
  }return out;
 }
 return {t,radial:combine(table.radial,table.radialN),values:combine(components,size),edge:combine(edge,ny),screen:combine(screen,ny)};
}
export function sampleField(table,frame,x,y){
 const {nx,ny,xmin,xmax,ymin,ymax,p}=table;
 if(y<ymin||y>ymax||x<xmin||x>xmax)return null;
 const fx=(x-xmin)/(xmax-xmin)*(nx-1),fy=(y-ymin)/(ymax-ymin)*(ny-1);let i=Math.min(nx-2,Math.floor(fx));const j=Math.min(ny-2,Math.floor(fy));
 // Never interpolate across the amplitude discontinuity at the thin mask.
 const ix=(p.wall-xmin)/(xmax-xmin)*(nx-1);
 if(x<p.wall&&i+1>=ix)i=Math.max(0,Math.floor(ix)-1);
 if(x>=p.wall&&i<ix)i=Math.min(nx-2,Math.ceil(ix));
 const u=fx-i,v=fy-j,z=j*nx+i;
 const vals=frame.values.map(a=>(1-v)*((1-u)*a[z]+u*a[z+1])+v*((1-u)*a[z+nx]+u*a[z+nx+1]));
 return state(vals);
}
function state([re,im,dr,di,yr,yi]){const rho=re*re+im*im;return {rho,jx:re*di-im*dr,jy:re*yi-im*yr};}
export function edgeField(table,frame,y){
 const u=(y-table.ymin)/(table.ymax-table.ymin)*(table.ny-1),i=Math.max(0,Math.min(table.ny-2,Math.floor(u))),f=u-i;
 return state(frame.edge.map(a=>a[i]*(1-f)+a[i+1]*f));
}
export function detectorProfile(table,steps=600){
 const {p,ny,ys}=table,values=new Float64Array(ny),dt=p.duration/steps;let negative=0,positive=0;
 const timeFlux=[];
 for(let i=0;i<=steps;i++){
  const flux=screenFrame(table,i*dt,p.emission),w=(i===0||i===steps)?.5:1;
  for(let j=0;j<ny;j++){positive+=Math.max(0,flux[j])*w;negative+=Math.max(0,-flux[j])*w;values[j]+=flux[j]*w*dt;}
  timeFlux.push(Array.from(flux));
 }
 const dy=ys[1]-ys[0],integral=values.reduce((a,b,j)=>a+b*dy*((j===0||j===ny-1)?.5:1),0);
 return {values:Array.from(values),integral,negativeFraction:negative/positive,timeFlux,dt};
}

export function radialField(table,frame,r){
 const u=(r-table.rmin)/(table.rmax-table.rmin)*(table.radialN-1),i=Math.max(0,Math.min(table.radialN-2,Math.floor(u))),f=u-i;
 return state(frame.radial.map(a=>a[i]*(1-f)+a[i+1]*f));
}
export function sourceSchedule(table,random=Math.random,count=100){
 const coeff=table.freq.map((f,n)=>({...f,re:table.radial[0][n*table.radialN],im:table.radial[1][n*table.radialN],dr:table.radial[2][n*table.radialN],di:table.radial[3][n*table.radialN]}));
 const n=800,dt=table.p.duration/n,cdf=[0];
 for(let i=0;i<n;i++)cdf.push(cdf[i]+Math.max(0,evaluate(coeff,(i+.5)*dt,table.p.emission).jx)*dt);
 return Array.from({length:count},()=>{
  const u=random()*cdf[n];let lo=0,hi=n;while(hi-lo>1){const mid=(lo+hi)>>1;if(cdf[mid]>u)hi=mid;else lo=mid;}
  const birth=(lo+(u-cdf[lo])/Math.max(1e-30,cdf[lo+1]-cdf[lo]))*dt,angle=table.p.focused?aimedAngle(table.p,random):(random()-.5)*Math.PI;
  return {birth,angle,x:table.rmin*Math.cos(angle),y:table.rmin*Math.sin(angle),passed:false,done:false,path:[]};
 });
}
function lerpState(a,b,f){return {rho:a.rho*(1-f)+b.rho*f,jx:a.jx*(1-f)+b.jx*f,jy:a.jy*(1-f)+b.jy*f};}
export function stepParticles(table,first,last,particles,random=Math.random){
 const duration=last.t-first.t,p=table.p,events=[];
 if(duration<=0)return events;
 const stateAt=(x,y,t)=>{const f=Math.max(0,Math.min(1,(t-first.t)/duration));const a=sampleField(table,first,x,y),b=sampleField(table,last,x,y);return a&&b?lerpState(a,b,f):null;};
 const radialAt=(r,t)=>lerpState(radialField(table,first,r),radialField(table,last,r),Math.max(0,Math.min(1,(t-first.t)/duration)));
 for(const a of particles){
  if(a.done||a.birth>=last.t)continue;
  let time=Math.max(a.birth,first.t);
  while(time<last.t-1e-12&&!a.done){
   let dt=Math.min(last.t-time,.01/p.k);
   if(!a.passed){
    const r=Math.hypot(a.x,a.y),s=radialAt(r,time+dt/2),v=s.jx/Math.max(1e-24,s.rho),next=Math.max(table.rmin,r+dt*v),xx=next*Math.cos(a.angle),yy=next*Math.sin(a.angle);
    if(xx>=p.wall){
     const fraction=(p.wall-a.x)/Math.max(1e-30,xx-a.x);a.y+=(yy-a.y)*fraction;a.x=p.wall;time+=dt*fraction;
     if(a.y<table.ymin||a.y>table.ymax){a.done=true;events.push({type:'missed',particle:a});continue;}
     const rwall=Math.hypot(p.wall,a.y),inc=radialAt(rwall,time).jx*p.wall/rwall,f=(time-first.t)/duration,out=lerpState(edgeField(table,first,a.y),edgeField(table,last,a.y),f).jx;
     const transmission=Math.max(0,Math.min(1,out/Math.max(1e-24,inc)));
     if(random()>transmission){a.done=true;a.absorbed=true;events.push({type:'absorbed',particle:a});}
     else {a.passed=true;a.x=p.wall+1e-7;}
     continue;
    }
    a.x=xx;a.y=yy;
   }else{
    const v=(x,y,t)=>{const q=stateAt(Math.min(p.screen,Math.max(p.wall+1e-7,x)),y,t);return q&&q.rho>1e-24?[q.jx/q.rho,q.jy/q.rho]:[0,0];};
    const [vx,vy]=v(a.x,a.y,time),speed=Math.hypot(vx,vy);
    dt=Math.min(dt,.015/Math.max(1,speed));
    const [mx,my]=v(a.x+vx*dt/2,a.y+vy*dt/2,time+dt/2),nx=a.x+mx*dt,ny=a.y+my*dt;
    if(nx>=p.screen){a.y+=(ny-a.y)*(p.screen-a.x)/Math.max(1e-30,nx-a.x);a.x=p.screen;a.done=true;events.push({type:'hit',particle:a});}
    else if(nx<p.wall||ny<table.ymin||ny>table.ymax){a.done=true;events.push({type:'missed',particle:a});}
    else {a.x=nx;a.y=ny;}
   }
   time+=dt;
  }
 }
 return events;
}
