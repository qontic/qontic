import {defaults,transverse,longitudinal,positionX,advanceY,sample,prediction} from './packet-model.js?v=39';
const $=id=>document.getElementById(id),p={...defaults},canvas=$('canvas'),ctx=canvas.getContext('2d');
let running=false,t=0,pulse=1,launched=0,hitCount=0,missed=0,particles=[],counts=[],expected=[],last=0,accumulator=0;
const controls=[['sx','Packet length σₓ',.8,2,.1],['sy','Exit width σᵧ',.5,1.2,.1],['separation','Slit separation',3,10,.5],['particles','Particles per pulse',1,500,1],['bins','Detector pixels',10,100,1]];
for(const [key,name,min,max,step] of controls){const label=document.createElement('label');label.innerHTML=`<span>${name}</span><output>${p[key]}</output><input aria-label="${name}" type="range" min="${min}" max="${max}" step="${step}" value="${p[key]}">`;label.querySelector('input').oninput=e=>{p[key]=Number(e.target.value);label.querySelector('output').value=p[key];reset();};$('parameters').append(label);}
$('slits').onchange=e=>{p.slits=Number(e.target.value);reset();};$('display').onchange=draw;$('paths').onchange=draw;
$('run').onclick=()=>{if(!running&&t>=p.duration){pulse++;prepare();}running=!running;$('run').textContent=running?'Pause':'Start';last=0;};$('reset').onclick=reset;
function prepare(){t=0;particles=Array.from({length:p.particles},()=>sample(p));launched+=particles.length;}
function reset(){running=false;$('run').textContent='Start';t=0;pulse=1;launched=0;hitCount=0;missed=0;accumulator=0;counts=Array(p.bins).fill(0);expected=prediction(p);prepare();draw();}
const xmin=-7,xmax=28,ymin=-14,ymax=14,plotW=790;
const X=x=>(x-xmin)/(xmax-xmin)*plotW,Y=y=>(y-ymin)/(ymax-ymin)*canvas.height;
function step(dt){for(const a of particles){if(a.done)continue;const oldX=a.x,oldY=a.y;a.y=advanceY(a.y,t,dt,p);a.x=positionX(a.x0,t+dt,p);if(a.x>=p.screen&&oldX<p.screen){const f=(p.screen-oldX)/(a.x-oldX),y=oldY+f*(a.y-oldY);const bin=Math.floor((y-ymin)/(ymax-ymin)*p.bins);if(bin>=0&&bin<p.bins){counts[bin]++;hitCount++;}else missed++;a.done=true;}if($('paths').checked){a.path.push([a.x,a.y]);if(a.path.length>500)a.path.shift();}}
 t+=dt;if(t>=p.duration){missed+=particles.filter(a=>!a.done).length;particles.forEach(a=>a.done=true);if($('repeat').checked){pulse++;prepare();}else{running=false;$('run').textContent='Start';}}}
const field=document.createElement('canvas');field.width=320;field.height=240;const fc=field.getContext('2d'),img=fc.createImageData(field.width,field.height);
function draw(){const phaseMode=$('display').value==='phase';const ys=Array.from({length:field.height},(_,j)=>transverse(ymin+(j+.5)/field.height*(ymax-ymin),t,p));const xs=Array.from({length:field.width},(_,i)=>longitudinal(xmin+(i+.5)/field.width*(xmax-xmin),t,p));
 for(let j=0;j<field.height;j++)for(let i=0;i<field.width;i++){const a=xs[i],b=ys[j],rho=a.rho*b.rho,v=Math.min(1,Math.sqrt(rho)*4),n=4*(j*field.width+i);let r=70,g=195,blue=245;if(phaseMode){const phase=Math.atan2(a.im,a.re)+Math.atan2(b.im,b.re);r=128+127*Math.cos(phase);g=128+127*Math.cos(phase-2.094);blue=128+127*Math.cos(phase+2.094);}img.data[n]=9+(r-9)*v;img.data[n+1]=19+(g-19)*v;img.data[n+2]=30+(blue-30)*v;img.data[n+3]=255;}
 fc.putImageData(img,0,0);ctx.fillStyle='#09131e';ctx.fillRect(0,0,960,720);ctx.drawImage(field,0,0,plotW,720);
 ctx.strokeStyle='#91afc0';ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(X(0),0);ctx.lineTo(X(0),720);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#d9edf6';ctx.font='14px system-ui';ctx.fillText('Exit plane',X(0)+6,20);ctx.fillText('Screen',X(p.screen)-50,20);
 ctx.strokeStyle='#6ce4f4';ctx.beginPath();ctx.moveTo(X(p.screen),0);ctx.lineTo(X(p.screen),720);ctx.stroke();
 for(const a of particles){if($('paths').checked&&a.path.length){ctx.strokeStyle='#ffd89966';ctx.beginPath();a.path.forEach(([x,y],i)=>i?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)));ctx.stroke();}if(!a.done){ctx.fillStyle='#ffe39b';ctx.beginPath();ctx.arc(X(a.x),Y(a.y),2.1,0,Math.PI*2);ctx.fill();}}
 const completed=pulse-1; // Expected exposure includes the full duration of the active pulse.
 const exposure=(completed+1)*p.particles;
 const maximum=Math.max(1,...counts.map(n=>n+Math.sqrt(n)),...expected.map(v=>v*exposure));const scale=145/maximum,base=802;
 ctx.strokeStyle='#60dcea';ctx.beginPath();expected.forEach((q,i)=>{const x=base+q*exposure*scale,y=(i+.5)*720/p.bins;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
 ctx.strokeStyle=ctx.fillStyle='#eef5fa';counts.forEach((n,i)=>{if(!n)return;const x=base+n*scale,y=(i+.5)*720/p.bins,e=Math.sqrt(n)*scale;ctx.beginPath();ctx.moveTo(x-e,y);ctx.lineTo(x+e,y);ctx.stroke();ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();});
 $('pulse').textContent=pulse;$('clock').textContent=t.toFixed(2);$('launched').textContent=launched;$('hits').textContent=hitCount;$('missed').textContent=missed;
}
function frame(now){if(running){if(last)accumulator+=Math.min(.05,(now-last)/1000);let n=0;while(accumulator>=.005&&n++<12&&running){step(.005);accumulator-=.005;}draw();}last=now;requestAnimationFrame(frame);}reset();requestAnimationFrame(frame);
