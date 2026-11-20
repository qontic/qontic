import assert from 'node:assert/strict';
import {build,synthesize,detectorProfile,sourceSchedule,stepParticles} from '../js/spherical-field.js';
const p={sx:.5,sy:.3,wall:2.25,screen:6.25,k:2*Math.PI,centers:[-2.5,2.5],emission:2/Math.PI,duration:2.5,radius:.08};
let seed=1729;const random=()=>((seed=(1664525*seed+1013904223)>>>0)+.5)/4294967296;
console.time('build');const table=build(p);console.timeEnd('build');
console.time('transport');const particles=sourceSchedule(table,random,30000);const record=[];const counts={absorbed:0,missed:0,hit:0};
let first=synthesize(table,0);
for(let i=1;i<=400;i++){
 const last=synthesize(table,i*p.duration/400);
 for(const event of stepParticles(table,first,last,particles,random)){counts[event.type]++;if(event.type==='hit')record.push(event.particle.y);}
 first=last;
 if(i%100===0)console.log(i,counts);
}
console.timeEnd('transport');const profile=detectorProfile(table);record.sort((a,b)=>a-b);let total=0,j=0,error=0;
const dy=(table.ymax-table.ymin)/(table.ny-1);
for(let i=1;i<table.ny;i++){total+=(profile.values[i]+profile.values[i-1])*.5*dy/profile.integral;const y=table.ys[i];while(j<record.length&&record[j]<=y)j++;error=Math.max(error,Math.abs(j/record.length-total));}
console.log({counts,error,alive:particles.filter(a=>!a.done).length,negative:profile.negativeFraction});

assert(record.length>1000,'adequate detected sample');
assert(error<.04,'screen CDF must agree with propagated current');
assert(profile.negativeFraction<.001,'negligible detector backflow');
