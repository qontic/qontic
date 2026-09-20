import {physicsHTML,viewsHTML,physicsEquations} from './physics-content.js?v=2.87-truth';
import {drawBinPulse,DETECTOR_PULSE_SECONDS} from './detector-pulse.js?v=59';
import {mountPacketGeometry,mountSlitWidth,mountSlitSeparation,trimTail,tailOpacity} from './packet-interaction.js?v=2.87';
import {histogramLayout} from './packet-model.js?v=2.87';
import {aperture,sourceCoefficients,sourceTransverse,sourceEnvelope,sampleSource,sampleTransmittedSource,stepSource,sourceProfile} from './source-packet-model.js?v=2.87-truth';
import {detectorLaw,quantumSchedule,recordWithHit,samplePixel} from './packet-outcomes.js?v=2.87';
export function mountPacketEngine({core,advanced}){
 const panel=document.createElement('div');panel.className='packet-settings';
 panel.innerHTML="<div class=\"input-group packet-inline\"><label for=\"packet-source-width\">Source width σ</label><input id=\"packet-source-width\" aria-label=\"Packet source width\" type=\"range\" min=\"50\" max=\"400\" step=\"5\" value=\"200\"><input aria-label=\"Packet source width value\" type=\"number\" min=\"50\" max=\"400\" step=\"5\" value=\"200\"><output>nm</output></div><div class=\"input-group packet-inline\"><label for=\"packet-length\">Packet length σ</label><input id=\"packet-length\" aria-label=\"Packet length\" type=\"range\" min=\"50\" max=\"200\" step=\"5\" value=\"50\"><input aria-label=\"Packet length value\" type=\"number\" min=\"50\" max=\"200\" step=\"5\" value=\"50\"><output>nm</output></div><div class=\"input-group packet-inline\"><label for=\"packet-slit-width\">Slit width σ</label><input id=\"packet-slit-width\" aria-label=\"Packet slit width\" type=\"range\" min=\"30\" max=\"200\" step=\"5\" value=\"30\"><input aria-label=\"Packet slit width value\" type=\"number\" min=\"30\" max=\"200\" step=\"5\" value=\"30\"><output>nm</output></div>";advanced.prepend(panel);
 const [sourceWidth,length,width]=panel.querySelectorAll('input[type=range],input[type=checkbox]');
 function slitWidthHelp(){const fwhm=2*Math.sqrt(2*Math.log(2))*Number(width.value);width.title='Gaussian transmission σ = '+width.value+' nm. The clear opening and cyan ticks mark the full width at half maximum: '+fwhm.toFixed(1)+' nm (2.355 σ). Openings are schematic; the wave model retains Gaussian transmission.';width.parentElement.querySelector('label').title=width.title;width.parentElement.querySelector('input[type=number]').title=width.title;}slitWidthHelp();
 length.title='Packet length is limited to at least 50 nm so kσₓ remains in the narrow-band working range for λ ≤ 50 nm.';length.parentElement.querySelector('input[type=number]').title=length.title;
 const tailRow=document.createElement('div');tailRow.innerHTML="<div class=\"input-group packet-inline\"><label for=\"packet-tail-length\">Tail length</label><input id=\"packet-tail-length\" aria-label=\"Trajectory tail length\" type=\"range\" min=\"0\" max=\"2000\" step=\"25\" value=\"250\"><input aria-label=\"Trajectory tail length value\" type=\"number\" min=\"0\" max=\"2000\" step=\"25\" value=\"250\"><output>nm</output></div>";panel.append(tailRow);const tailLength=tailRow.querySelector('input[type=range]');
 const intervalRow=document.createElement('div');intervalRow.innerHTML='<div class="input-group packet-inline"><label for="packet-interval">Packet interval</label><input id="packet-interval" aria-label="Packet interval" title="Time between source launches, in picoseconds of simulation time. Independent of packet speed and width." type="range" min="0" max="300" step="5" value="0"><input aria-label="Packet interval value" type="number" min="0" max="300" step="5" value="0"><output>ps</output></div>';panel.append(intervalRow);const interval=intervalRow.querySelector('input[type=range]');
 const directedRow=document.createElement('label');directedRow.className='bohmian-only packet-directed-inline';directedRow.title='PW postselection: shows only source configurations that transmit; it does not add a steering force.';directedRow.innerHTML='<input id="packet-directed-slits" type="checkbox"> Direct PW';const directed=directedRow.querySelector('input');directed.checked=localStorage.getItem('qontic-pw-directed-slits')==='true';
 function syncPacketInput(control){const number=control.parentElement.querySelector('input[type=number]');number.value=control.value;number.max=control.max;number.min=control.min;control.parentElement.querySelector('output').textContent=control===interval?(+interval.value===0?'Auto':particleType==='neutron'?'ns':'ps'):'nm';if(control===interval)interval.title='0 = wait until the previous packet has completed all outcomes. Positive values set time between source launches in '+(particleType==='neutron'?'nanoseconds':'picoseconds')+' of simulation time; independent of packet speed and width.';}
 for(const number of panel.querySelectorAll('input[type=number]')){const commitNumber=()=>{const range=number.parentElement.querySelector('input[type=range]'),value=Number(number.value);if(Number.isFinite(value))range.value=Math.max(+range.min,Math.min(+range.max,value));range.dispatchEvent(new Event('input',{bubbles:true}));};number.addEventListener('change',commitNumber);number.addEventListener('blur',commitNumber);number.addEventListener('keydown',event=>{if(event.key==='Enter'){commitNumber();number.blur();}});}
 tailLength.addEventListener('input',()=>{syncPacketInput(tailLength);for(const a of particles)trimTail(a.path,+tailLength.value/100);draw();});
 let geometryEditing=false,resumeAfterEditing=false;
 let slitPreviewWidth=null,slitPreviewSeparation=null;
 const displayCenters=()=>slitPreviewSeparation===null?p.centers:[...(slit1Open?[-slitPreviewSeparation/200]:[]),...(slit2Open?[slitPreviewSeparation/200]:[])];
 const detectorFlashes=new Map();
 const style=document.createElement('style');style.textContent='.packet-settings label{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:5px;margin:6px 0}.packet-settings input[type=range]{grid-column:1/-1;width:100%;min-width:0}.packet-settings label:has(input[type=checkbox]){display:flex;gap:8px}.packet-settings .packet-directed-row{display:block!important;width:100%;grid-column:1/-1;margin:6px 0}.packet-settings .packet-directed-row[hidden]{display:none!important}.packet-settings .packet-directed-row>label{display:flex!important;align-items:center;gap:8px;width:100%;margin:0 0 5px;white-space:nowrap}.packet-settings .packet-directed-row input{flex:0 0 auto}.packet-settings .packet-directed-row .packet-note{display:block;width:100%}.packet-note{font-size:.85em;line-height:1.4;opacity:.85}.physics-notation{width:100%;border-collapse:collapse;margin:16px 0}.physics-notation th,.physics-notation td{padding:8px 12px;border-bottom:1px solid #476477;text-align:left;vertical-align:top}.physics-notation td:first-child{min-width:100px}.packet-equation{overflow-x:auto;padding:8px 0}.packet-equation .katex{font-size:1.1em} .packet-settings,.packet-settings label,.packet-note{color:#dcecf4!important}[data-theme=light] .packet-settings,[data-theme=light] .packet-settings label,[data-theme=light] .packet-note{color:#183343!important}#particleRate-group,#toggleWhichPath,#sourceOption,label[for=Source]{display:none!important}.packet-settings .packet-inline{display:grid;grid-template-columns:90px minmax(40px,1fr) 58px 24px;gap:6px;align-items:center;margin:5px 0}.packet-settings .packet-inline label{display:block;margin:0;font-size:12px}.packet-settings .packet-inline input[type=range]{grid-column:auto;width:100%}.packet-species{display:flex!important;align-items:center;gap:6px;margin:0 0 4px;padding-bottom:4px;border-bottom:1px solid var(--border-color,#476477)}.packet-species>label:first-child{width:90px;min-width:90px;margin:0;font-size:12px}.packet-species select{min-width:82px}.packet-species .packet-directed-inline{display:flex;align-items:center;gap:4px;width:auto;min-width:0;margin:0 0 0 auto;font-size:12px;white-space:nowrap;cursor:help}.packet-species .packet-directed-inline input{margin:0;flex:0 0 auto}.packet-inline input[type=number]{width:100%;box-sizing:border-box;background:transparent;color:inherit;border:1px solid #476477;border-radius:3px;padding:3px}.packet-inline output{font-size:12px}#source-position-group,#detector-distance-group,#screen-height-group{display:grid!important;grid-template-columns:90px minmax(40px,1fr) 58px 24px;gap:6px;align-items:center;margin:5px 0}#source-position-group label,#detector-distance-group label,#screen-height-group label{margin:0;font-size:12px}#source-position-group input[type=range],#detector-distance-group input[type=range],#screen-height-group input[type=range]{grid-column:auto;width:100%;min-width:0}#source-position-group input[type=number],#detector-distance-group input[type=number],#screen-height-group input[type=number]{width:100%;box-sizing:border-box}#analytical-advanced .input-group{margin-bottom:4px}#analytical-advanced h3{margin:6px 0}.packet-geometry{position:absolute;inset:0;pointer-events:none;z-index:6}.packet-geometry[hidden],#canvas-container:not(.editing-geometry) .packet-geometry{display:none}.qontic-media-toolbar button[aria-label="Edit geometry"][aria-pressed="true"]{background:#286078;outline:2px solid #7ee9fb}.packet-geometry button{position:absolute;pointer-events:auto;touch-action:none;color:#d9f8ff;background:rgba(25,76,90,.2);border:1px solid rgba(110,222,239,.45)}.packet-detector-drag{bottom:3px;width:30px;height:28px;transform:translateX(-100%);cursor:ew-resize;border-radius:5px}.packet-slit-separation-drag{width:56px;height:24px;transform:translate(-50%,-50%);cursor:ns-resize;border-radius:12px!important;font-size:10px!important;background:#24394d!important}.packet-slit-separation-drag[hidden]{display:none!important}.packet-slit-width-drag{font-size:10px!important;width:56px;height:24px;transform:translate(-50%,-50%);cursor:ns-resize;border-radius:5px}.packet-slit-width-drag[hidden]{display:none!important}.packet-wall-drag{bottom:3px;width:30px;height:28px;transform:translateX(-50%);cursor:ew-resize;border-radius:5px}.packet-detector-drag:hover,.packet-geometry button:focus-visible{background:rgba(50,170,195,.5);outline:2px solid #7ee9fb}.packet-height-drag{bottom:3px;transform:translateX(0);width:30px;height:28px;cursor:ns-resize;border-radius:5px}.packet-geometry-guide{position:absolute;top:0;bottom:0;border-left:2px dashed #8fecff}.packet-geometry-value{position:absolute;bottom:35px;right:10px;background:#122e40;color:white;padding:5px;border-radius:4px}.packet-unused-row{display:none!important}#waveCanvas,#partCanvas,#setupCanvas{background:transparent!important}#canvas-container{background:#344f63!important}';document.head.append(style);
 const math=document.getElementById('math-container'),packetMath=document.createElement('section');packetMath.className='math-section';math.replaceChildren(packetMath);
 let slowPacketMode=false,savedPacketCount=null;
 let enabled=true,p=null,coeff=null,profile=null,law=null,sourceGrid=null,fingerprint='',particles=[],pending=[],pulses=[],nextEmission=0,t=0,totalTime=0,pulse=0,absorbed=0,pulseAbsorbed=0,missed=0,last=null,realElapsed=0,timeUnit=1,yOffset=0,finished=false,packetAnimationId=null,visualPhase=0,flash=null,hold=0,lastMode=interpretation,viewWidth=905;
 const field=document.createElement('canvas'),gridW=640,gridH=480;field.width=gridW;field.height=gridH;const fc=field.getContext('2d');let data=fc.createImageData(gridW,gridH),paletteKey='',paletteColors=null;
 const shown=id=>document.getElementById(id)?.checked;
 const X=x=>(wallXWorld+(p.launch+x)*100)*toCanvasX,Y=y=>(y+yOffset)*100*toCanvasY;
 function config(){
  length.max=Math.max(50,Math.min(200,Math.floor(Math.min(sourcePos,detectorDistance)/4)));if(+length.value>+length.max)length.value=length.max;
  syncPacketInput(length);syncPacketInput(interval);
  const next={source:true,spherical:false,focused:false,sx:+length.value/100,sy:+width.value/100,k:2*Math.PI*100/wavelength,launch:-sourcePos/100,wall:sourcePos/100,screen:(sourcePos+detectorDistance)/100,sourceSigma:+sourceWidth.value/100,bins:Math.max(1,Math.floor(nDetectorPixels)),particles:Math.max(1,Math.min(5000,Math.floor(+document.getElementById('MaxPart-input').value||100))),slits:slit1Open&&slit2Open?2:1};
  // Use physical inputs directly: a canvas/world round trip introduces tiny
  // resize-dependent rounding differences that would reset the experiment.
  next.centers=[...(slit1Open?[-slitSeparation/200]:[]),...(slit2Open?[slitSeparation/200]:[])].sort((a,b)=>a-b);next.initialRight=-worldCanvasDx/1000-.03;next.initialCenter=next.initialRight-6*next.sx;next.duration=(next.screen-next.initialCenter+8*next.sx)/next.k;return next;
 }
 function emissionPeriod(){return slowPacketMode||+interval.value===0?Infinity:(+interval.value)*(particleType==='neutron'?1:.001)/timeUnit;}
 function prepare(){
  pulse++;const cohort={born:t,count:p.particles,active:p.particles,pending:0,absorbed:0};pulses.push(cohort);
  for(let i=0;i<p.particles;i++){const a=interpretation==='bohmian'&&directed.checked?sampleTransmittedSource(p):sampleSource(p);if(slowPacketMode)a.x0=a.x=p.initialCenter;a.cohort=cohort;a.schedule=interpretation==='bohmian'?quantumSchedule(a,p,law):{at:(p.screen-a.x0)/p.k,type:'hit',index:samplePixel(law.weights)};particles.push(a);}
  nParticles+=p.particles;nextEmission=t+emissionPeriod();
 }
 function resetEngine(){
  window.qonticMWBranches?.cancel();detectorFlashes.clear();pending=[];particles=[];pulses=[];nextEmission=0;visualPhase=0;flash=null;hold=0;lastMode=interpretation;p=config();fingerprint=configFingerprint(p);yOffset=screenHeight/200;
  coeff=sourceCoefficients(p);sourceGrid=null;profile=sourceProfile(p,-yOffset,screenHeight/100-yOffset,2049);law=detectorLaw(p,profile,-yOffset,screenHeight/100-yOffset);
  timeUnit=(particleType==='neutron'?mNeutron:mElectron)*10000/hbar;
  hits=Array(p.bins).fill(0);nHits=0;hitMax=0;logNBranches=0;nParticles=0;trajectories.length=0;absorbed=0;missed=0;t=0;totalTime=0;pulse=0;nSteps=0;last=null;realElapsed=0;prepare();updateBranchCountDisplay();setWaveRangeAuto(0,1);updateMath();stats();
 }
 function configFingerprint(value){const {particles:count,...preparation}=value;return JSON.stringify([preparation,screenHeight,particleType]);}
 function syncSlowPacketMode(){
  const next=!!window.qonticMWBranches?.enabled;if(next===slowPacketMode)return;
  const group=document.getElementById('MaxPart-group');
  if(next){savedPacketCount=+document.getElementById('MaxPart-input').value;group.setValueInFirstUnit(1);}else if(savedPacketCount!==null){group.setValueInFirstUnit(savedPacketCount);savedPacketCount=null;}
  slowPacketMode=next;
  for(const id of ['MaxPart','MaxPart-input','MaxPart-units'])document.getElementById(id).disabled=next;
  interval.disabled=next;interval.parentElement.querySelector('input[type=number]').disabled=next;
  window.qonticMWBranches?.cancel();pending=[];particles=[];pulses=[];detectorFlashes.clear();flash=null;last=null;lastMode=interpretation;
  if(p){p.particles=next?1:+document.getElementById('MaxPart-input').value;prepare();}
 }
 function ensure(){syncSlowPacketMode();const next=config();if(configFingerprint(next)!==fingerprint)resetEngine();else p.particles=next.particles;}
 function updateMath(){
  packetMath.innerHTML=physicsHTML;
  math.removeAttribute('aria-busy');
  const views=document.getElementById('rationale');views.innerHTML=viewsHTML;
  views.removeAttribute('aria-busy');
  for(const node of [...packetMath.querySelectorAll('[data-equation]'),...views.querySelectorAll('[data-equation]')]){
   const formula=physicsEquations[node.dataset.equation];
   if(typeof katex!=='undefined')katex.render(formula,node,{displayMode:true,throwOnError:false});
   else node.textContent=formula;
  }
 }
 function syncMode(){
  for(const id of ['waveFunctionOption','basicsWaveFunctionOption']){const select=document.getElementById(id);if(!select)continue;const phase=select.querySelector('option[value=Phase]');if(phase&&phase.textContent!=='Phase (cos θ)')phase.textContent='Phase (cos θ)';if(!select.value)select.value='Phase';}

  directedRow.hidden=interpretation!=='bohmian';
  const countLabel=document.querySelector('#MaxPart-group label');if(countLabel)countLabel.textContent=interpretation==='bohmian'?'Part./packet:':'Hits / packet:';
  const countInput=document.getElementById('MaxPart-input');countInput.title=interpretation==='bohmian'?(directed.checked?'Particles per packet, conditioned on transmission through an open slit.':'Incident particles per packet; some are absorbed.'):'Screen registrations per new packet, conditioned on reaching the screen.';
  if(lastMode===interpretation)return;
  window.qonticMWBranches?.cancel();detectorFlashes.clear();flash=null;hold=0;
  const wasPW=lastMode==='bohmian',isPW=interpretation==='bohmian';
  if(wasPW!==isPW)for(let i=0;i<particles.length;i++){
   const a=particles[i];if(a.done)continue;
   if(!isPW){a.schedule={at:(p.screen-a.x0)/p.k,type:'hit',index:samplePixel(law.weights)};a.path=[];}
   else{
    // Reconstruct the PW ensemble conditioned on still being unresolved at the
    // current packet age. Before the wall this is the incident Born ensemble.
    // After the wall, survival is exactly the transmitted ensemble, which the
    // analytical conditional sampler draws without rejection or an attempt cap.
    const packetAge=t-a.cohort.born;
    const crossedWall=packetAge>=(p.wall-a.x0)/p.k;
    const b=crossedWall||directed.checked
     ?sampleTransmittedSource(p,Math.random,a.x0)
     :sampleSource(p,Math.random,a.x0);
    let age=0;while(age<packetAge&&!b.done){const dt=Math.min(.002,packetAge-age);stepSource(b,dt,p,coeff);age+=dt;}
    if(b.done)throw new Error('Active-packet reconstruction reached a completed outcome.');
    b.cohort=a.cohort;particles[i]=b;
   }
  }
  lastMode=interpretation;
 }
 function stats(){
  const mass=particleType==='neutron'?mNeutron:mElectron,speed=hbar/mass*p.k/100;
  $('#waveSpeed').text(speed>=1000?(speed/1000).toFixed(2)+' km/s':speed.toFixed(2)+' m/s');
  $('#particleEnergy').text((.5*mass*(hbar*p.k/(mass*100))**2/1.602176634e-19).toExponential(2)+' eV');
  time=totalTime*timeUnit;$('#systemTime').text(time.toFixed(3)+' ns');$('#realTime').text(realElapsed.toFixed(1)+' s');$('#nhits').text(nHits);$('#shownParticles').text(particles.filter(a=>!a.done).length);$('#maxParticlesDisplay').text(p.particles);$('#nSteps').text(nSteps);
  const sampleButton=document.getElementById('resampleHitsButton');
  sampleButton.disabled=nHits===0||!!window.qonticMWBranches?.busy;
  sampleButton.title=nHits===0?'Collect screen hits before sampling another branch.':window.qonticMWBranches?.busy?'Finish choosing the current branch first.':'Sample another detector history with the same number of hits, using the packet outcome probabilities.';
 }
 function addHit(index){hits[index]++;nHits++;hitMax=Math.max(hitMax,hits[index]);logNBranches+=Math.log10(p.bins);}
 function processPending(){
  if(!pending.length||window.qonticMWBranches?.busy)return;
  const event=pending.shift(),index=event.index;event.cohort.pending--;
  if(interpretation==='manyworlds'&&window.qonticMWBranches?.enabled){
   event.cohort.branching=true;
   const previous=hits.slice();
   const setRecord=i=>{hits=recordWithHit(previous,i);hitMax=Math.max(...hits);};
   const started=window.qonticMWBranches.begin({selected:index,weights:law.weights,detectorFraction:detectorX/canvas.width,sensorFraction:sensorWidth/canvas.width,sensorColor:colorSensor,
    createRecord(i){const strip=document.createElement('canvas'),scale=Math.min(1,256/canvas.height);strip.width=Math.ceil((canvas.width-detectorX)*scale);strip.height=Math.ceil(canvas.height*scale);const context=strip.getContext('2d');context.scale(scale,scale);context.translate(-detectorX,0);histogram({context,hits:recordWithHit(previous,i)});return strip;},
    onSplit(){detectorFlashes.clear();nHits++;logNBranches+=Math.log10(p.bins);setRecord(index);updateBranchCountDisplay();stats();},
    onSelect(i){event.cohort.branching=false;setRecord(i);detectorFlashes.clear();flash=null;last=null;draw();}
   });if(started)return;event.cohort.branching=false;
  }
  addHit(index);detectorFlashes.set(index,DETECTOR_PULSE_SECONDS);flash={index,remaining:DETECTOR_PULSE_SECONDS};
 }
 function integrate(dt){
  const end=t+dt,recordTails=interpretation==='bohmian'&&shown('plot_trajectories')&&+tailLength.value>0;
  for(const a of particles){
   if(a.done)continue;
   if(interpretation==='bohmian'){
    const event=stepSource(a,dt,p,coeff);
    if(event==='absorbed'){absorbed++;pulseAbsorbed++;a.cohort.absorbed++;}
    if(event==='hit'){const index=Math.floor((a.y+yOffset)/(screenHeight/100)*p.bins);if(index>=0&&index<p.bins){a.screenDetected=true;pending.push({index,cohort:a.cohort});a.cohort.pending++;}else missed++;}
    if(a.done){a.finishedAt=realElapsed;a.cohort.active--;}if(recordTails){const prev=a.path.at(-1);if(!prev||a.done||Math.hypot(a.x-prev[0],a.y-prev[1])>=.02)a.path.push([a.x,a.y]);}
    if(a.screenDetected)a.path.length=0;
   }else if(a.schedule.at<=end-a.cohort.born+1e-10){
    a.done=true;a.cohort.active--;if(a.schedule.type==='absorbed'){absorbed++;pulseAbsorbed++;a.cohort.absorbed++;}else if(a.schedule.type==='missed')missed++;else{pending.push({index:a.schedule.index,cohort:a.cohort});a.cohort.pending++;}
   }
  }
  t=end;totalTime+=dt;nSteps++;
 }
 function frame(){
  packetAnimationId=null;if(!isAnimating)return;ensure();syncMode();
  const now=performance.now(),wallDt=Math.min(.1,last===null?0:(now-last)/1000);last=now;realElapsed+=wallDt;
  if(flash){flash.remaining-=wallDt;if(flash.remaining<=0)flash=null;}
  for(const [index,remaining] of detectorFlashes){if(remaining<=wallDt)detectorFlashes.delete(index);else detectorFlashes.set(index,remaining-wallDt);}
  const speed=+$('#animationStep-group')[0].getValueInFirstUnit()||1;
  const branch=window.qonticMWBranches,slow=branch?.enabled,busy=branch?.busy,waiting=false;
  // Only explicit MW branch inspection holds transport. Ordinary registrations
  // are batched within the frame and never stop an Orthodox/PW packet.
  if(busy||(slow&&pending.length)){
   visualPhase+=wallDt*speed*p.k*p.screen/12;if(!busy&&!waiting)processPending();
  }else{
   if((slowPacketMode||+interval.value===0)&&particles.every(a=>a.done)&&!pending.length)prepare();
   let remaining=wallDt*speed*p.screen/p.k/6,limit=0;
   const step=interpretation==='bohmian'?Math.min(.005,.02*p.sy*p.sy,p.screen/p.k/300,p.sx/p.k/30):Infinity;
   while(remaining>1e-10&&isAnimating&&!(slow&&pending.length)&&limit++<4000){
    if(t>=nextEmission-1e-10)prepare();
    const arrival=slowPacketMode?Math.min(...particles.filter(a=>!a.done).map(a=>a.cohort.born+a.schedule.at)):Infinity;
    const dt=Math.min(step,remaining,nextEmission-t,Math.max(0,arrival-t));integrate(dt);remaining-=dt;
    // Yield between complete physics steps: no particle or hit is dropped.
    // Under load, advance simulation time more slowly instead of blocking input.
    if(performance.now()-now>=12)break;
   }
   if(!waiting){if(slow)processPending();else while(pending.length)processPending();}
  }
  particles=particles.filter(a=>!a.done||(interpretation==='bohmian'&&!a.screenDetected&&realElapsed-(a.finishedAt??realElapsed)<.8));
  pulses=pulses.filter(c=>c.active||c.pending||t-c.born<p.duration);
  updateBranchCountDisplay();draw();branch?.refreshFrame();$('#stepTime').text((performance.now()-now).toFixed(1));if(isAnimating)packetAnimationId=requestAnimationFrame(evolveSystem);
 }
 function drawWave(){ensure();drawSourceWave();}
 function drawSourceWave(){
  waveCtx.clearRect(0,0,canvas.width,canvas.height);waveCtx.fillStyle='#344f63';waveCtx.fillRect(0,0,canvas.width,canvas.height);if(!shown('plot_wave'))return;
  const key=[worldCanvasDx,screenHeight,wallXWorld,p.launch].join(',');
  if(!sourceGrid||sourceGrid.key!==key){
   const values=new Float64Array(gridW*gridH*2),xs=Array.from({length:gridW},(_,i)=>((i+.5)/gridW*worldCanvasDx-wallXWorld)/100-p.launch);let maxRho=0;
   for(let j=0;j<gridH;j++)for(let i=0;i<gridW;i++){
    const g=sourceTransverse((j+.5)/gridH*screenHeight/100-yOffset,xs[i],p,coeff),n=2*(j*gridW+i);
    values[n]=g.rho;values[n+1]=Math.atan2(g.im,g.re);maxRho=Math.max(maxRho,g.rho);
   }
   const visibility=new Float32Array(gridW*gridH),phaseCos=new Float32Array(gridW*gridH),phaseSin=new Float32Array(gridW*gridH);
   for(let j=0;j<gridH;j++)for(let i=0;i<gridW;i++){
    phaseCos[j*gridW+i]=Math.cos(values[2*(j*gridW+i)+1]);phaseSin[j*gridW+i]=Math.sin(values[2*(j*gridW+i)+1]);
    const gain=2+6*(1-Math.exp(-Math.max(0,xs[i]-p.wall)/.35));
    visibility[j*gridW+i]=1-Math.exp(-4*Math.sqrt(values[2*(j*gridW+i)]*gain/Math.max(1e-30,maxRho)));
   }
   sourceGrid={key,values,xs,maxRho,visibility,phaseCos,phaseSin};
  }
  setWaveRangeAuto(0,1);const range=getWaveRangeEffective(),span=Math.max(1e-9,range.max-range.min),mode=$('#waveFunctionOption').val();
  // Pulses are independent preparations: add densities, not coherent amplitudes.
  // Blend phase colors by density where independent pulses overlap.
  const env=sourceGrid.xs.map(x=>{
   let density=0,cos=0,sin=0;
   for(const c of pulses){
    const e=sourceEnvelope(x,t-c.born,p),fraction=c.branching?1:(c.active+c.pending)/Math.max(1,c.count-c.absorbed),q=e.rho*fraction;
    density+=q;cos+=q*Math.cos(e.phase-visualPhase);sin+=q*Math.sin(e.phase-visualPhase);
   }return {rho:density,cos:cos/Math.max(1e-300,density),sin:sin/Math.max(1e-300,density),envelope:Math.min(1,Math.sqrt(density*Math.sqrt(2*Math.PI)*p.sx))};
  });
  const peak=sourceGrid.maxRho/(Math.sqrt(2*Math.PI)*p.sx),envPeak=1/(Math.sqrt(2*Math.PI)*p.sx);
  if(paletteKey!==graphPalette||!paletteColors){paletteKey=graphPalette;paletteColors=Array.from({length:1024},(_,i)=>window.paletteModule.getColorForValue(i/1023,graphPalette));}
  const alpha=255*elementOpacity('plot_wave');
  for(let j=0;j<gridH;j++)for(let i=0;i<gridW;i++){
   const n=j*gridW+i,rho=sourceGrid.values[2*n]*env[i].rho;
   // Preserve a localized Gaussian envelope; do not amplify its remote tails.
   const rawWeight=sourceGrid.visibility[n]*env[i].envelope;
   // Display-only contrast boost; zero density stays transparent.
   const weight=-Math.expm1(-3*rawWeight)/-Math.expm1(-3);let value;
   if(mode==='Phase'){
    // Display cos(theta), a smooth scalar representation of the local phase.
    value=.5+.5*(sourceGrid.phaseCos[n]*env[i].cos-sourceGrid.phaseSin[n]*env[i].sin);
   }else if(mode==='LogPsi2')value=Math.max(0,Math.min(1,(Math.log(Math.max(1e-15,rho/peak))+15)/15));
   else value=Math.sqrt(Math.min(1,rho/peak*8));
   const rgb=paletteColors[Math.round(Math.max(0,Math.min(1,(value-range.min)/span))*1023)];
   data.data[4*n]=.88*rgb[0]+.12*255;data.data[4*n+1]=.88*rgb[1]+.12*255;data.data[4*n+2]=.88*rgb[2]+.12*255;data.data[4*n+3]=alpha*weight;
  }
  fc.putImageData(data,0,0);waveCtx.save();waveCtx.imageSmoothingEnabled=true;waveCtx.imageSmoothingQuality="high";waveCtx.beginPath();waveCtx.rect(0,0,detectorX,canvas.height);waveCtx.clip();waveCtx.drawImage(field,0,0,canvas.width,canvas.height);waveCtx.restore();
  drawPaletteScale(graphPalette,mode==='Phase'?2*range.min-1:range.min,mode==='Phase'?2*range.max-1:range.max);
 }

 function drawParticles(){
  partCtx.clearRect(0,0,canvas.width,canvas.height);if(interpretation!=='bohmian')return;
  const tails=shown('plot_trajectories'),dots=shown('plot_particles'),maxTail=+tailLength.value/100,buckets=Array.from({length:9},()=>[]);
  for(const a of particles){
   trimTail(a.path,a.screenDetected?0:maxTail);
   const opacity=tailOpacity(a.done,a.finishedAt??realElapsed,realElapsed);
   if(!opacity)a.path=[];
   if(tails&&a.path.length)buckets[Math.min(8,Math.ceil(opacity*8))].push(a);
  }
  partCtx.save();partCtx.beginPath();partCtx.rect(0,0,detectorX,canvas.height);partCtx.clip();
  partCtx.strokeStyle=colorTraj;
  for(let i=1;i<=8;i++){
   if(!buckets[i].length)continue;partCtx.globalAlpha=elementOpacity('plot_trajectories')*i/8;partCtx.beginPath();
   for(const a of buckets[i]){let first=true;for(const [x,y] of a.path){if(first){partCtx.moveTo(X(x),Y(y));first=false;}else partCtx.lineTo(X(x),Y(y));}}
   partCtx.stroke();
  }
  if(dots){partCtx.globalAlpha=elementOpacity('plot_particles');partCtx.fillStyle=colorPart;partCtx.beginPath();for(const a of particles)if(!a.done){const x=X(a.x),y=Y(a.y);partCtx.moveTo(x+3,y);partCtx.arc(x,y,3,0,2*Math.PI);}partCtx.fill();}
  partCtx.restore();
 }
 function drawDetection(){
  if(!detectorFlashes.size)return;
  setupCtx.save();setupCtx.beginPath();setupCtx.rect(0,0,canvas.width,canvas.height);setupCtx.clip();
  for(const [index,remaining] of detectorFlashes)drawBinPulse(setupCtx,{x:detectorX,y:index*canvas.height/p.bins,width:Math.max(1,sensorWidth),height:canvas.height/p.bins,color:colorSensor,strength:remaining/DETECTOR_PULSE_SECONDS});
  setupCtx.restore();
 }
 function histogram(options={}){
  const context=options.context||setupCtx,record=options.hits||hits,maxRecord=Math.max(1,...record),histo=detectorX+sensorWidth,widthPx=canvas.width-histo;
  const {curve:predictionCounts,scale}=histogramLayout(record,options.profile||profile,options.screenHeight??screenHeight/100,widthPx);
  context.save();context.globalAlpha=1;context.fillStyle='#fff';context.fillRect(histo,0,widthPx,canvas.height);context.fillStyle='#000';context.fillRect(detectorX,0,sensorWidth,canvas.height);
  if((geometryEditing||shown('hit_prob'))&&!p.focused){context.globalAlpha=geometryEditing?1:elementOpacity('hit_prob');context.strokeStyle=colorProb;context.beginPath();predictionCounts.forEach((q,i)=>{const x=histo+q*scale,y=i*canvas.height/(predictionCounts.length-1);i?context.lineTo(x,y):context.moveTo(x,y);});context.stroke();}
  const rgb=getRGBComponents(colorSensor);
  record.forEach((n,i)=>{if(!n)return;const y=(i+.5)*canvas.height/p.bins,x=histo+n*scale,error=Math.sqrt(n)*scale;
   if(shown('plot_sensor')){context.globalAlpha=elementOpacity('plot_sensor');const intensity=n/maxRecord;context.fillStyle=`rgb(${rgb.red*intensity},${rgb.green*intensity},${rgb.blue*intensity})`;context.fillRect(detectorX,i*canvas.height/p.bins,sensorWidth,canvas.height/p.bins);}
   if(shown('plot_hits')){context.globalAlpha=elementOpacity('plot_hits');context.strokeStyle=context.fillStyle=colorHit;context.beginPath();context.moveTo(x-error,y);context.lineTo(x+error,y);context.stroke();context.beginPath();context.arc(x,y,3,0,2*Math.PI);context.fill();}
  });context.restore();
 }
 function draw(){if(!enabled)return;ensure();syncMode();setupCtx.clearRect(0,0,canvas.width,canvas.height);
  setupCtx.save();if(shown('plot_screen')){setupCtx.globalAlpha=elementOpacity('plot_screen');setupCtx.strokeStyle=colorScreen;if(p.source){
   // Draw clear openings at the displayed intensity FWHM. This is a
   // geometric illustration of the Gaussian aperture, not a hard-wall solver.
   const half=Math.sqrt(2*Math.log(2))*(slitPreviewWidth??p.sy*100)*toCanvasY;
   const openings=displayCenters().map(center=>[Math.max(0,Y(center)-half),Math.min(canvas.height,Y(center)+half)]).filter(([a,b])=>b>a).sort((a,b)=>a[0]-b[0]);
   setupCtx.strokeStyle='#d4e6ef';setupCtx.lineWidth=6;setupCtx.lineCap='butt';setupCtx.beginPath();let cursor=0;
   for(const [top,bottom] of openings){if(top>cursor){setupCtx.moveTo(wallX,cursor);setupCtx.lineTo(wallX,top);}cursor=Math.max(cursor,bottom);}
   if(cursor<canvas.height){setupCtx.moveTo(wallX,cursor);setupCtx.lineTo(wallX,canvas.height);}setupCtx.stroke();
   setupCtx.strokeStyle='#81e7f5';setupCtx.lineWidth=1.5;
   for(const [top,bottom] of openings){setupCtx.beginPath();setupCtx.moveTo(wallX-9,top);setupCtx.lineTo(wallX+9,top);setupCtx.moveTo(wallX-9,bottom);setupCtx.lineTo(wallX+9,bottom);setupCtx.stroke();}
  }}
  setupCtx.setLineDash([]);if(shown('plot_detector')){setupCtx.globalAlpha=elementOpacity('plot_detector');setupCtx.strokeStyle=colorDetector;setupCtx.beginPath();setupCtx.moveTo(detectorX,0);setupCtx.lineTo(detectorX,canvas.height);setupCtx.stroke();}setupCtx.restore();
  drawWave();drawParticles();histogram();drawDetection();window.qonticScaleOverlay?.update();geometryControls?.update();slitControls?.update();separationControls?.update();stats();
 }

 function hash(){return '&engine=packet&packetOrigin=source&sourceWidth='+sourceWidth.value+'&packetLength='+length.value+'&packetWidth='+width.value+'&packetCount='+p.particles+'&tailLength='+tailLength.value+'&packetInterval='+interval.value;}
 const params=new URLSearchParams(location.hash.slice(1));
 for(const [key,el] of [['packetLength',length],['packetWidth',width],['sourceWidth',sourceWidth],['tailLength',tailLength],['packetInterval',interval]]){const n=Number(params.get(key));if(params.has(key)&&n>=+el.min&&n<=+el.max){el.value=n;syncPacketInput(el);}}
 const count=+params.get('packetCount');if(count>=1&&count<=5000)$('#MaxPart-group')[0]?.setValueInFirstUnit(count);
 interval.addEventListener('input',()=>{syncPacketInput(interval);nextEmission=Math.max(t,(pulses.at(-1)?.born??t)+emissionPeriod());});
 directed.addEventListener('change',()=>{localStorage.setItem('qontic-pw-directed-slits',String(directed.checked));syncMode();});
 for(const control of [length,width,sourceWidth])control.addEventListener('input',()=>{syncPacketInput(control);slitWidthHelp();resetEngine();draw();});

 for(const id of ['MaxPart','MaxPart-input'])document.getElementById(id).addEventListener(id==='MaxPart'?'input':'change',()=>queueMicrotask(()=>{ensure();draw();}));
 const syncGeometryReadouts=next=>{
  document.getElementById('source-position-group')?.setValueInFirstUnit(next?.wall??sourcePos);
  document.getElementById('detector-distance-group')?.setValueInFirstUnit(next?.distance??detectorDistance);
  document.getElementById('screen-height-group')?.setValueInFirstUnit(next?.height??screenHeight);
 };
 const geometryControls=mountPacketGeometry({
  host:document.getElementById('canvas-container'),
  getGeometry(){if(!p)return null;const host=document.getElementById('canvas-container');return {wall:sourcePos,wallFraction:wallX/canvas.width,distance:detectorDistance,height:screenHeight,detectorFraction:detectorX/canvas.width,scaleX:toCanvasX*host.clientWidth/canvas.width,scaleY:toCanvasY*host.clientHeight/canvas.height,busy:window.qonticMWBranches?.busy};},
  onPreview(next){syncGeometryReadouts(next);window.qonticScaleOverlay?.previewHeight(next?.height??null);if(!next){histogram();drawDetection();return;}const preview={...p,wall:next.wall/100,screen:(next.wall+next.distance)/100};const predicted=sourceProfile(preview,-next.height/200,next.height/200,2049);histogram({profile:predicted,screenHeight:next.height/100});},
  onCommit(next){if(next.distance===detectorDistance&&next.height===screenHeight&&next.wall===sourcePos)return;document.getElementById('source-position-group').setValueInFirstUnit(next.wall);document.getElementById('detector-distance-group').setValueInFirstUnit(next.distance);document.getElementById('screen-height-group').setValueInFirstUnit(next.height);setupGeo(false);reset=0;resetEngine();draw();},
  pause(){const running=isAnimating;if(running)document.getElementById('startButton').click();return running;},
  resume(running){if(running&&!isAnimating)document.getElementById('startButton').click();}
 });

 const slitControls=mountSlitWidth({
  host:document.getElementById('canvas-container'),
  getState(){const host=document.getElementById('canvas-container');return {width:+width.value,centers:p?displayCenters().map(center=>Y(center)/canvas.height):[],wallFraction:wallX/canvas.width,scaleY:toCanvasY*host.clientHeight/canvas.height,busy:window.qonticMWBranches?.busy,visible:shown('plot_screen')};},
  onPreview(value){slitPreviewWidth=value;const shownWidth=value===null?(p?.sy??(+width.value/100))*100:value;width.value=shownWidth;syncPacketInput(width);draw();if(value!==null){const preview={...p,sy:value/100},predicted=sourceProfile(preview,-yOffset,screenHeight/100-yOffset,2049);histogram({profile:predicted});drawDetection();}},
  onCommit(value){width.value=value;width.dispatchEvent(new Event('input',{bubbles:true}));},
  pause(){const running=isAnimating;if(running)document.getElementById('startButton').click();return running;},
  resume(running){if(running&&!isAnimating)document.getElementById('startButton').click();}
 });
 const separationControls=mountSlitSeparation({
  host:document.getElementById('canvas-container'),
  getState(){const host=document.getElementById('canvas-container');return {separation:slitSeparation,open:[slit1Open,slit2Open],wallFraction:wallX/canvas.width,scaleY:toCanvasY*host.clientHeight/canvas.height,busy:window.qonticMWBranches?.busy,visible:shown('plot_screen')};},
  onPreview(value){slitPreviewSeparation=value;document.getElementById('slit-separation-group')?.setValueInFirstUnit(value===null?slitSeparation:value);draw();if(value!==null){const preview={...p,centers:displayCenters()},predicted=sourceProfile(preview,-yOffset,screenHeight/100-yOffset,2049);histogram({profile:predicted});drawDetection();}},
  onCommit(value){document.getElementById('slit-separation-group').setValueInFirstUnit(value);setupGeo(false);reset=0;resetEngine();draw();},
  pause(){const running=isAnimating;if(running)document.getElementById('startButton').click();return running;},
  resume(running){if(running&&!isAnimating)document.getElementById('startButton').click();}
 });
 const geometryHost=document.getElementById('canvas-container');
 const toolbar=document.querySelector('#canvas-wrapper .qontic-media-toolbar');
 const editButton=document.createElement('button');editButton.type='button';editButton.className=toolbar.querySelector('button').className;
 editButton.setAttribute('aria-label','Edit geometry');editButton.setAttribute('aria-pressed','false');
 editButton.title='Edit geometry · right-click canvas. Drag handles to preview the predicted histogram; Escape exits.';
 editButton.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M15 5l4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15z"/></svg>';
 toolbar.insertBefore(editButton,toolbar.querySelector('[role=status]'));
 function setGeometryEditing(next,restorePlayback=true){
  if(next===geometryEditing)return;
  if(next){if(window.qonticMWBranches?.busy)return;resumeAfterEditing=isAnimating;if(isAnimating)document.getElementById('startButton').click();geometryEditing=true;}
  else{geometryControls.cancel();slitControls.cancel();separationControls.cancel();geometryEditing=false;}
  geometryHost.classList.toggle('editing-geometry',geometryEditing);editButton.setAttribute('aria-pressed',String(geometryEditing));draw();
  if(!next){const running=resumeAfterEditing;resumeAfterEditing=false;if(restorePlayback&&running&&!isAnimating)document.getElementById('startButton').click();}
 }
 editButton.addEventListener('click',()=>setGeometryEditing(!geometryEditing));
 geometryHost.addEventListener('contextmenu',event=>{if(window.qonticMWBranches?.busy)return;event.preventDefault();setGeometryEditing(!geometryEditing);});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&geometryEditing){event.preventDefault();setGeometryEditing(false);}},true);
 // An explicit Start action leaves editing before transport resumes.
 document.getElementById('startButton').addEventListener('click',()=>{if(geometryEditing&&!isAnimating)setGeometryEditing(false,false);},true);
 new MutationObserver(()=>{if(geometryEditing&&isAnimating)setGeometryEditing(false,false);}).observe(document.getElementById('startButton'),{childList:true,subtree:true,characterData:true});
 queueMicrotask(()=>{
  for(const id of ['toggleWhichPath','sourceOption','particleRate','particleRate-input']){const el=document.getElementById(id);if(el){el.disabled=true;el.title='Not available for the Gaussian source-packet model';}}
  const origin=document.getElementById('sourceOption');origin.parentElement.classList.remove('bohmian-only');origin.parentElement.classList.add('packet-unused-row');origin.value='isotropic';origin.querySelector('option[value=isotropic]').textContent='Gaussian source';
  const label=document.querySelector('#MaxPart-group label');if(label)label.textContent='Particles / packet:';
  for(const value of ['photon']){const el=document.querySelector('#particleType option[value='+value+']');if(el)el.remove();}
  syncSlowPacketMode();
  if(particleType==='photon'){particleType='electron';$('#particleType').val('electron');}
  document.querySelector('#waveFunctionOption option[value=Phase]').textContent='Phase (cos θ)';if(!$('#waveFunctionOption').val())$('#waveFunctionOption').val('Psi2');
  const species=document.createElement('div');species.className='input-group packet-species';const speciesLabel=document.createElement('label');speciesLabel.htmlFor='particleType';speciesLabel.textContent='Particle:';species.append(speciesLabel,document.getElementById('particleType'),directedRow);advanced.prepend(species);
  whichPathDetector='none';updateWhichPathButton();setupGeo(false);reset=0;resetEngine();draw();
 });
 function sampleBranch(){
  ensure();if(nHits===0||window.qonticMWBranches?.busy)return;
  const cdf=[];let sum=0;for(const weight of law.weights){sum+=weight;cdf.push(sum);}
  if(!(sum>0))return;
  const record=Array(p.bins).fill(0);
  for(let hit=0;hit<nHits;hit++){
   const u=Math.random()*sum;let lo=0,hi=cdf.length-1;
   while(lo<hi){const mid=(lo+hi)>>1;if(u<cdf[mid])hi=mid;else lo=mid+1;}
   record[lo]++;
  }
  hits=record;hitMax=Math.max(...hits);detectorFlashes.clear();flash=null;draw();
 }
 return {sampleBranch,syncBranching(){ensure();draw();},get viewportWidth(){viewWidth=Math.max(viewWidth,(sourcePos+detectorDistance)/.7);return viewWidth;},get enabled(){return true;},reset:resetEngine,draw,drawWave,drawParticles,histogram,frame,updateMath,hash,pause(){last=null;if(packetAnimationId!==null)cancelAnimationFrame(packetAnimationId);packetAnimationId=null;}};
}
