import assert from 'node:assert/strict';
import {dragGeometry,dragSurfaceGeometry,slitWidthFromDrag,trimTail,tailOpacity} from '../js/packet-interaction.js';
const start={distance:400,height:1200,scaleX:2,scaleY:.5};
assert.equal(dragGeometry(start,'distance',100,0).distance,450);
assert.equal(dragGeometry(start,'height',0,50).height,1400);
assert.equal(dragGeometry(start,'distance',-1e6,0).distance,50);
assert.equal(dragGeometry(start,'height',0,1e6).height,5000);
assert.equal(slitWidthFromDrag(30,30,1),40,'30 px moves a ±3σ edge by 10 nm');
assert.equal(slitWidthFromDrag(30,40,1,4,30,100),40,'dragging follows the selected sigma extent');
assert.equal(slitWidthFromDrag(95,100,1,4,30,100),100,'dynamic half-wall width bound is enforced');
const surface={wall:225,distance:1000,height:1200,wallMin:50,wallMax:1000,distanceMin:50,distanceMax:3000,heightMin:100,heightMax:5000,width:30,minWidth:30,maxWidth:200,extentSigma:1.5,separation:300,maxSeparation:738};
assert.deepEqual(dragSurfaceGeometry(surface,'wall',.4),{wall:348,distance:877,height:1200},'3D wall drag keeps detector position fixed');
assert.equal(dragSurfaceGeometry(surface,'distance',4).distance,2225,'one plane width changes distance by the current total span');
assert.equal(dragSurfaceGeometry(surface,'height',.5).height,1600,'3D height drag changes both screen edges');
assert.equal(dragSurfaceGeometry(surface,'separation',.5),700,'symmetric slit centers change separation twice as fast');
assert.equal(dragSurfaceGeometry(surface,'width',.15),70,'slit-edge motion is converted through the displayed sigma extent');
for(const n of [0,.1,1,10]){
 const path=Array.from({length:100},(_,i)=>[i/10,Math.sin(i/10)]);trimTail(path,n);
 let length=0;for(let i=1;i<path.length;i++)length+=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);assert(length<=n+1e-10);if(!n)assert.equal(path.length,0);
}
assert.equal(tailOpacity(true,1,1),1);assert(Math.abs(tailOpacity(true,1,1.4)-.5)<1e-10);assert.equal(tailOpacity(true,1,1.9),0);
console.log('Geometry scaling, bounds, tail arc length and fade checks passed.');
