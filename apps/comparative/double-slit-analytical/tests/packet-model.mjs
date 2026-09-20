import assert from 'node:assert/strict';
import {gaussian,histogramLayout} from '../js/packet-model.js';

for(const t of [0,3,8]){
 let norm=0,moment=0;
 for(let x=-100;x<100;x+=.01){const r=gaussian(x,t,1.2).rho;norm+=r*.01;moment+=x*x*r*.01;}
 assert(Math.abs(norm-1)<1e-8,'Gaussian normalization');
 assert(Math.abs(moment-(1.2**2+t*t/(4*1.2**2)))<1e-7,'Gaussian spreading');
}
for(const [x,t,s] of [[-2,1,.8],[.3,4,1.2],[3,2,2]]){
 const h=1e-5,g=gaussian(x,t,s),left=gaussian(x-h,t,s),right=gaussian(x+h,t,s);
 assert(Math.abs(g.dr-(right.re-left.re)/(2*h))<1e-7,'real derivative');
 assert(Math.abs(g.di-(right.im-left.im)/(2*h))<1e-7,'imaginary derivative');
}
const profile={values:[0,1,2,1,0],integral:4};
const zero=histogramLayout([0,0,0,0],profile,4,108);
assert.equal(zero.total,0);assert.equal(Math.max(...zero.curve),.5);
const populated=histogramLayout([1,4,1,0],profile,4,108);
assert.equal(populated.total,6);assert(Math.max(...populated.curve)>Math.max(...zero.curve));
assert(Math.max(...populated.curve)*populated.scale<=100+1e-12,'histogram fits canvas');
console.log(JSON.stringify({normalization:'pass',spreading:'pass',gradients:'pass',histogramScale:'pass'}));
