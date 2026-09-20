import assert from 'node:assert/strict';
import {build,synthesize,sourceSchedule,stepParticles,detectorProfile} from '../js/spherical-field.js';
import {createPacketCache,cachedPacketFrame,aimedAngle,LaunchClock} from '../js/packet-cache.js';
const p={sx:.5,sy:.3,wall:2.25,screen:6.25,k:2*Math.PI,centers:[-2.5,2.5],emission:2/Math.PI,duration:2.5,radius:.08};
console.time('build');const table=build(p);console.timeEnd('build');console.time('cache');table.cache=createPacketCache(table,synthesize);console.timeEnd('cache');
let error=0;for(const t of [.031,.278,.743,1.153,1.987,2.479]){
 const a=synthesize(table,t),b=cachedPacketFrame(table,t);let peak=0,diff=0;
 for(let i=0;i<table.size;i++){peak=Math.max(peak,Math.hypot(a.values[0][i],a.values[1][i]));diff=Math.max(diff,Math.hypot(a.values[0][i]-b.values[0][i],a.values[1][i]-b.values[1][i]));}
 error=Math.max(error,diff/Math.max(1e-8,peak));
}
assert(error<.003,'cached wave convergence');
let t=performance.now();for(let j=0;j<20;j++)synthesize(table,.7+j*.001);const spectral=(performance.now()-t)/20;
t=performance.now();for(let j=0;j<20;j++)cachedPacketFrame(table,.7+j*.001);const cached=(performance.now()-t)/20;
assert(cached<spectral/3,'material playback speedup');
for(let i=0;i<1000;i++){const y=p.wall*Math.tan(aimedAngle(p));assert(y>=Math.min(...p.centers)-2*p.sy-1e-12&&y<=Math.max(...p.centers)+2*p.sy+1e-12);}
for(const fps of [30,60]){const clock=new LaunchClock();let launches=0;for(let i=0;i<fps*12;i++)launches+=clock.advance(1/fps,3,true,12);assert.equal(launches,4);assert.equal(clock.advance(10,3,false,12),0);}
console.log(JSON.stringify({passed:true,maxRelativeAmplitudeError:error,spectralMs:spectral,cachedMs:cached,speedup:spectral/cached,cacheMB:table.cache.bytes/1048576}));
// Validate that the cached field plus enlarged guidance steps preserves transport.
let seed=1729;const random=()=>((seed=(1664525*seed+1013904223)>>>0)+.5)/4294967296;
const particles=sourceSchedule(table,random,30000),record=[];let first=cachedPacketFrame(table,0);
for(let i=1;i<=400;i++){const last=cachedPacketFrame(table,i*p.duration/400);for(const e of stepParticles(table,first,last,particles,random))if(e.type==='hit')record.push(e.particle.y);first=last;}
const profile=detectorProfile(table);record.sort((a,b)=>a-b);let cdf=0,j=0,D=0;const dy=table.ys[1]-table.ys[0];
for(let i=1;i<table.ny;i++){cdf+=(profile.values[i-1]+profile.values[i])*.5*dy/profile.integral;while(j<record.length&&record[j]<=table.ys[i])j++;D=Math.max(D,Math.abs(j/record.length-cdf));}
assert(record.length>1000);assert(D<.04);console.log({transportPassed:true,hits:record.length,CDFError:D});
