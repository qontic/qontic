import assert from 'node:assert/strict';
import {dragGeometry,trimTail,tailOpacity} from '../js/packet-interaction.js';
const start={distance:400,height:1200,scaleX:2,scaleY:.5};
assert.equal(dragGeometry(start,'distance',100,0).distance,450);
assert.equal(dragGeometry(start,'height',0,50).height,1400);
assert.equal(dragGeometry(start,'distance',-1e6,0).distance,50);
assert.equal(dragGeometry(start,'height',0,1e6).height,5000);
for(const n of [0,.1,1,10]){
 const path=Array.from({length:100},(_,i)=>[i/10,Math.sin(i/10)]);trimTail(path,n);
 let length=0;for(let i=1;i<path.length;i++)length+=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);assert(length<=n+1e-10);if(!n)assert.equal(path.length,0);
}
assert.equal(tailOpacity(true,1,1),1);assert(Math.abs(tailOpacity(true,1,1.4)-.5)<1e-10);assert.equal(tailOpacity(true,1,1.9),0);
console.log('Geometry scaling, bounds, tail arc length and fade checks passed.');
