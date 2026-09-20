import assert from 'node:assert/strict';
import {hankel0,angularModes,angularPoint,angularCoefficients,evaluate} from '../js/spherical-packet-model.js';
import {aperture} from '../js/source-packet-model.js';
const p={sx:.5,sy:.3,wall:2.25,screen:6.25,k:2*Math.PI,centers:[-2.5,2.5]};
// Reference values of J0 and Y0 at one; catches normalization and phase errors.
const h=hankel0(1);assert(Math.abs(h[0]-.7651976865579666)<1e-12);assert(Math.abs(h[1]-.08825696421567696)<1e-12);
for(const centers of [[-2.5,2.5],[2.5],[-.15,.15]]){
 const q={...p,centers},m=angularModes(q,q.k);
 for(const y of [-2.5,-.2,0,1,2.5]){
  const a=angularPoint(m,0,y),b=hankel0(q.k*Math.hypot(q.wall,y));
  assert(Math.hypot(a.re-aperture(y,q)*b[0],a.im-aperture(y,q)*b[1])<1e-7,'complex aperture matching');
 }
 const x=1.3,y=.8,d=1e-4,a=angularPoint(m,x,y),xp=angularPoint(m,x+d,y),xm=angularPoint(m,x-d,y),yp=angularPoint(m,x,y+d),ym=angularPoint(m,x,y-d);
 assert(Math.hypot((xp.re+xm.re+yp.re+ym.re-4*a.re)/(d*d)+q.k*q.k*a.re,(xp.im+xm.im+yp.im+ym.im-4*a.im)/(d*d)+q.k*q.k*a.im)<1e-5,'Helmholtz equation');
}
const a=angularCoefficients(p,p.screen,2.5),b=angularCoefficients(p,p.screen,2.5,{frequencies:192,order:192});let error=0,peak=0;
for(let t=0;t<=2.5;t+=.02){const x=evaluate(a,t,.32),y=evaluate(b,t,.32);error=Math.max(error,Math.hypot(x.re-y.re,x.im-y.im));peak=Math.max(peak,Math.hypot(y.re,y.im));}
assert(error/peak<.001,'spectral quadrature convergence');
console.log(JSON.stringify({passed:true,relativeAmplitudeError:error/peak}));
