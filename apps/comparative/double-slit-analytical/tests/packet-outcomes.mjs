import assert from 'node:assert/strict';
import {detectorLaw,quantumSchedule,recordWithHit} from '../js/packet-outcomes.js';
import {sourceProfile,sampleSource} from '../js/source-packet-model.js';
let seed=1729;const random=()=>((seed=(1664525*seed+1013904223)>>>0)+.5)/4294967296;
for(const centers of [[-2.5,2.5],[2.5],[0]]){
 const p={sx:.5,sy:.3,k:2*Math.PI,wall:2.25,screen:6.25,sourceSigma:2,centers,bins:25},profile=sourceProfile(p,-6,6),law=detectorLaw(p,profile,-6,6);
 assert(Math.abs(law.weights.reduce((a,b)=>a+b,0)-1)<1e-12);
 assert(Math.abs(law.visible-profile.integral)<1e-10);
 assert(law.visible<=law.transmission&&law.transmission<=1);
 const counts={hit:0,missed:0,absorbed:0},bins=Array(25).fill(0),N=100000;
 for(let i=0;i<N;i++){const a=sampleSource(p,random),e=quantumSchedule(a,p,law,0,random);counts[e.type]++;assert(e.at>0);if(e.type==='hit')bins[e.index]++;}
 for(const [key,prob] of [['hit',law.visible],['missed',law.transmission-law.visible],['absorbed',1-law.transmission]])assert(Math.abs(counts[key]/N-prob)<.005);
 let D=0,a=0,b=0;for(let i=0;i<25;i++){a+=bins[i]/counts.hit;b+=law.weights[i];D=Math.max(D,Math.abs(a-b));}assert(D<.025);
 for(let i=0;i<1000;i++)assert.notEqual(quantumSchedule({x0:0},p,law,p.wall/p.k+.01,random).type,'absorbed');
 const base=Array(25).fill(0),branch=recordWithHit(base,0);assert.equal(branch.reduce((a,b)=>a+b),1);assert.equal(base[0],0);
 console.log({centers,transmission:law.transmission,visible:law.visible,counts,CDFError:D});
}
