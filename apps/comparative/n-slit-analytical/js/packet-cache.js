// Cache the spectral solution, not a time-stepped approximation to the PDE.
// Demodulation removes the rapid carrier phase before cubic interpolation.
export function createPacketCache(table,synthesize){
 const p=table.p,n=Math.max(128,Math.ceil(p.duration*(p.k/p.sx+1/(p.sx*p.sx))*2)),dt=p.duration/n;
 const bytes=(n+3)*6*(table.size+table.radialN+2*table.ny)*4;
 if(bytes>192*1024*1024)throw new Error('Packet cache exceeds the interactive memory limit; increase wavelength or packet length, or reduce the view.');
 const frames=[];const carrier=p.k*p.k/2;
 for(let j=-1;j<=n+1;j++){
  const t=j*dt,f=synthesize(table,t),a=carrier*(t-p.emission),c=Math.cos(a),s=Math.sin(a);
  for(const key of ['values','radial','edge','screen'])for(let v=0;v<6;v+=2){const r=f[key][v],q=f[key][v+1];for(let z=0;z<r.length;z++){const x=r[z];r[z]=x*c-q[z]*s;q[z]=x*s+q[z]*c;}}
  frames.push(f);
 }
 return {frames,n,dt,carrier,bytes};
}
export function cachedPacketFrame(table,t){
 const cache=table.cache,u=Math.max(0,Math.min(cache.n,t/cache.dt)),j=Math.min(cache.n-1,Math.floor(u)),f=u-j;
 const w=[-.5*f+f*f-.5*f*f*f,1-2.5*f*f+1.5*f*f*f,.5*f+2*f*f-1.5*f*f*f,-.5*f*f+.5*f*f*f];
 const frames=cache.frames.slice(j,j+4),a=-cache.carrier*(t-table.p.emission),c=Math.cos(a),s=Math.sin(a),out={t};
 for(const key of ['values','radial','edge','screen']){
  out[key]=[];
  for(let v=0;v<6;v+=2){
   const [r0,r1,r2,r3]=frames.map(x=>x[key][v]),[i0,i1,i2,i3]=frames.map(x=>x[key][v+1]),n=r0.length,r=new Float32Array(n),i=new Float32Array(n);
   for(let z=0;z<n;z++){const re=w[0]*r0[z]+w[1]*r1[z]+w[2]*r2[z]+w[3]*r3[z],im=w[0]*i0[z]+w[1]*i1[z]+w[2]*i2[z]+w[3]*i3[z];r[z]=re*c-im*s;i[z]=re*s+im*c;}
   out[key].push(r,i);
  }
 }
 return out;
}
export function emissionCone(p){
 return [Math.atan2(Math.min(...p.centers)-2*p.sy,p.wall),Math.atan2(Math.max(...p.centers)+2*p.sy,p.wall)];
}
export function aimedAngle(p,random=Math.random){
 const [a,b]=emissionCone(p);return a+(b-a)*random();
}
export class LaunchClock{
 constructor(){this.elapsed=0;}
 reset(){this.elapsed=0;}
 advance(seconds,interval,enabled,slots){
  if(!enabled){this.elapsed=0;return 0;}
  this.elapsed+=seconds;const n=Math.min(slots,Math.floor((this.elapsed+1e-10)/interval));this.elapsed-=n*interval;
  if(slots===0)this.elapsed=Math.min(this.elapsed,interval);return n;
 }
}
