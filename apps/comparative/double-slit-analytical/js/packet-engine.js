import {physicsHTML,viewsHTML,physicsEquations,whichPathPhysicsHTML,whichPathViewsHTML,whichPathEquations} from './physics-content.js?v=2.106';
import {drawBinPulse,DETECTOR_PULSE_SECONDS} from './detector-pulse.js?v=59';
import {mountPacketGeometry,mountSlitWidth,mountSlitSeparation,trimTail,tailOpacity} from './packet-interaction.js?v=2.106';
import {histogramLayout,surfaceHeightValue,surfaceDisplayDensity,surfacePhaseRate} from './packet-model.js?v=2.106';
import {aperture,sourceCoefficients,sourceComponents,sourceTransverse,sourceEnvelope,sampleSource,sampleTransmittedSource,stepSource,sourceProfile,maximumCoreSafeSeparation} from './source-packet-model.js?v=2.106';
import {detectorLaw,quantumSchedule,recordWithHit,samplePixel} from './packet-outcomes.js?v=2.106';
export function mountPacketEngine({core,advanced}){
 physicsEquations.mask='\\phi(y,L^+)=T(y)\\phi(y,L^-),\\qquad T(y)=\\frac1C\\sum_{j\\,\\mathrm{open}}a_j e^{-(y-y_j)^2/(4\\sigma_a^2)},\\quad 0\\le a_j\\le1';
 const panel=document.createElement('div');panel.className='packet-settings';
 panel.innerHTML="<div class=\"input-group packet-inline\"><label for=\"packet-source-width\">Source width σ</label><input id=\"packet-source-width\" aria-label=\"Packet source width\" type=\"range\" min=\"50\" max=\"400\" step=\"5\" value=\"200\"><input aria-label=\"Packet source width value\" type=\"number\" min=\"50\" max=\"400\" step=\"5\" value=\"200\"><output>nm</output></div><div class=\"input-group packet-inline\"><label for=\"packet-length\">Packet length σ</label><input id=\"packet-length\" aria-label=\"Packet length\" type=\"range\" min=\"50\" max=\"200\" step=\"5\" value=\"50\"><input aria-label=\"Packet length value\" type=\"number\" min=\"50\" max=\"200\" step=\"5\" value=\"50\"><output>nm</output></div><div class=\"input-group packet-inline\"><label for=\"packet-slit-width\">Slit width σ</label><input id=\"packet-slit-width\" aria-label=\"Packet slit width\" type=\"range\" min=\"30\" max=\"200\" step=\"5\" value=\"30\"><input aria-label=\"Packet slit width value\" type=\"number\" min=\"30\" max=\"200\" step=\"5\" value=\"30\"><output>nm</output></div><div class=\"input-group packet-inline packet-expert\"><label for=\"packet-slit-extent\" title=\"Expert control: half-width of each drawn slit core, measured in aperture standard deviations.\">Slit extent</label><input id=\"packet-slit-extent\" aria-label=\"Displayed slit core extent in sigma\" type=\"range\" min=\"1\" max=\"5\" step=\"0.5\" value=\"1.5\"><input aria-label=\"Displayed slit core extent value\" type=\"number\" min=\"1\" max=\"5\" step=\"0.5\" value=\"1.5\"><output>σ</output></div>";advanced.prepend(panel);
 const [sourceWidth,length,width]=panel.querySelectorAll('input[type=range],input[type=checkbox]');
 const extent=panel.querySelector('#packet-slit-extent');
 const extentRow=extent.closest('.packet-inline');
 const balanceRow=document.createElement('div');balanceRow.className='input-group packet-inline packet-balance';balanceRow.innerHTML='<label for="packet-slit-balance" title="Expert control: attenuate either slit while leaving the other at full field amplitude.">Slit balance</label><input id="packet-slit-balance" aria-label="Relative slit transmission" type="range" min="-100" max="100" step="5" value="0"><button type="button" class="packet-balance-equal" aria-label="Set equal slit transmission" title="Set equal slit transmission">=</button><output>Equal</output>';
 extentRow.after(balanceRow);
 const balance=balanceRow.querySelector('input'),balanceEqual=balanceRow.querySelector('button'),balanceOutput=balanceRow.querySelector('output');
 const syncBalance=()=>{const value=+balance.value;balanceOutput.textContent=value===0?'Equal':value===100?'Upper only':value===-100?'Lower only':`${value>0?'Upper':'Lower'} ${Math.round(100/(1+(1-Math.abs(value)/100)**2))}%`;};
 function slitWidthHelp(directActive=false){const selected=Number(extent.value),n=directActive?3:selected,span=2*n*Number(width.value);width.title='Gaussian transmission σ = '+width.value+' nm. The displayed opening and cyan ticks currently span ±'+n+'σ: '+span.toFixed(0)+' nm total.'+(directActive?' Direct PW displays its fixed ±3σ preparation window.':' The common wave model retains its Gaussian tails.');width.parentElement.querySelector('label').title=width.title;width.parentElement.querySelector('input[type=number]').title=width.title;extent.title=directActive?'Direct PW overrides the wall drawing with its fixed ±3σ preparation window. This selected ±'+selected+'σ extent is retained for ordinary PW, Orthodox and Many-Worlds.':'Expert display control: each drawn opening extends ±'+selected+' aperture σ from its center. The full opening is '+(2*selected*Number(width.value)).toFixed(0)+' nm.';extent.parentElement.querySelector('input[type=number]').title=extent.title;}
 length.title='Packet length is limited to at least 50 nm so kσₓ remains in the narrow-band working range for λ ≤ 50 nm.';length.parentElement.querySelector('input[type=number]').title=length.title;
 const tailRow=document.createElement('div');tailRow.innerHTML="<div class=\"input-group packet-inline\"><label for=\"packet-tail-length\">Tail length</label><input id=\"packet-tail-length\" aria-label=\"Trajectory tail length\" type=\"range\" min=\"0\" max=\"2000\" step=\"25\" value=\"250\"><input aria-label=\"Trajectory tail length value\" type=\"number\" min=\"0\" max=\"2000\" step=\"25\" value=\"250\"><output>nm</output></div>";panel.append(tailRow);const tailLength=tailRow.querySelector('input[type=range]');
 const intervalRow=document.createElement('div');intervalRow.innerHTML='<div class="input-group packet-inline"><label for="packet-interval">Packet interval</label><input id="packet-interval" aria-label="Packet interval" title="Time between source launches, in picoseconds of simulation time. Independent of packet speed and width." type="range" min="0" max="300" step="5" value="0"><input aria-label="Packet interval value" type="number" min="0" max="300" step="5" value="0"><output>ps</output></div>';panel.append(intervalRow);const interval=intervalRow.querySelector('input[type=range]');
 function maxTailSafeSeparation(limit,n){
  const base={sy:+width.value/100,k:2*Math.PI*100/Math.max(1,+document.getElementById('wavelength').value),wall:+document.getElementById('source-position').value/100,sourceSigma:+sourceWidth.value/100};
  const signs=[...(slit1Open?[-1]:[]),...(slit2Open?[1]:[])];
  return Math.max(0,Math.floor(100*maximumCoreSafeSeparation(base,n,limit/100,signs)+1e-9));
 }
 let dynamicWidthMax=200,dynamicSeparationMax=2000;
 function applyPacketLimits(){
  const screenRange=document.getElementById('screen-height'),screenNumber=document.getElementById('screen-height-input');
  const separationRange=document.getElementById('slit-separation'),separationNumber=document.getElementById('slit-separation-input');
  const height=Math.max(120,+screenRange.value||1200);
  screenRange.min=screenNumber.min='120';
  if(+screenRange.value<120){screenRange.value=screenNumber.value='120';}
  const extentMax=Math.max(1,Math.min(5,Math.floor(height/(4*30)*2)/2));
  extent.max=extentMax;extent.parentElement.querySelector('input[type=number]').max=extentMax;
  if(+extent.value>extentMax)extent.value=extentMax;
  const n=+extent.value;
  dynamicWidthMax=Math.max(30,Math.floor(height/(4*n)/5)*5);
  width.max=width.parentElement.querySelector('input[type=number]').max=dynamicWidthMax;
  if(+width.value>dynamicWidthMax)width.value=dynamicWidthMax;
  const wallLimit=Math.max(0,Math.floor(height-2*n*(+width.value)));
  dynamicSeparationMax=maxTailSafeSeparation(Math.min(2000,wallLimit),n);
  separationRange.max=separationNumber.max=dynamicSeparationMax;
  if(+separationRange.value>dynamicSeparationMax)separationRange.value=separationNumber.value=dynamicSeparationMax;
  slitSeparation=+separationRange.value;
  screenHeight=+screenRange.value;
  syncPacketInput(width);syncPacketInput(extent);slitWidthHelp();
  directedRow.title='PW postselection uses a fixed ±3σ window around each Gaussian slit, independently of the displayed ±'+n+'σ Slit extent. It does not add a steering force.';
  separationRange.title='Maximum '+dynamicSeparationMax+' nm: slit cores stay on the wall and the analytical transmitted probability remains concentrated in the drawn openings.';
  separationNumber.title=separationRange.title;
 }
 const directedRow=document.createElement('label');directedRow.className='bohmian-only packet-directed-inline';directedRow.title='PW postselection uses a fixed ±3σ window around each Gaussian slit, independently of the displayed Slit extent. It does not add a steering force.';directedRow.innerHTML='Direct PW <input id="packet-directed-slits" type="checkbox">';const directed=directedRow.querySelector('input');directed.checked=localStorage.getItem('qontic-pw-directed-slits')==='true';
 const slitColorRow=document.createElement('label');slitColorRow.className='bohmian-only packet-slit-colors';slitColorRow.title='Pilot-Wave particle and hit color. Uniform uses the selected particle color. By slit uses cyan/orange and separates the hit markers. Spectrum maps each exact wall-crossing position continuously from violet (top) to red (bottom), with each histogram bin using the mean hue of its particles. This changes only the display.';slitColorRow.innerHTML='<span>Color</span><select id="packet-particle-color" aria-label="Pilot-Wave particle color"><option value="uniform">Uniform</option><option value="slit">By slit</option><option value="spectrum">Spectrum</option></select>';const particleColorMode=slitColorRow.querySelector('select');particleColorMode.value=localStorage.getItem('qontic-pw-particle-color')||(localStorage.getItem('qontic-pw-color-by-slit')==='true'?'slit':'uniform');
 function syncPacketInput(control){const number=control.parentElement.querySelector('input[type=number]');number.value=control.value;number.max=control.max;number.min=control.min;control.parentElement.querySelector('output').textContent=control===interval?(+interval.value===0?'Auto':particleType==='neutron'?'ns':'ps'):control===extent?'σ':'nm';if(control===interval)interval.title='0 = wait until the previous packet has completed all outcomes. Positive values set time between source launches in '+(particleType==='neutron'?'nanoseconds':'picoseconds')+' of simulation time; independent of packet speed and width.';}
 for(const number of panel.querySelectorAll('input[type=number]')){const commitNumber=()=>{const range=number.parentElement.querySelector('input[type=range]'),value=Number(number.value);if(Number.isFinite(value))range.value=Math.max(+range.min,Math.min(+range.max,value));range.dispatchEvent(new Event('input',{bubbles:true}));};number.addEventListener('change',commitNumber);number.addEventListener('blur',commitNumber);number.addEventListener('keydown',event=>{if(event.key==='Enter'){commitNumber();number.blur();}});}
 tailLength.addEventListener('input',()=>{syncPacketInput(tailLength);for(const a of particles)trimTail(a.path,+tailLength.value/100);draw();});
 let geometryEditing=false,resumeAfterEditing=false;
 let slitPreviewWidth=null,slitPreviewSeparation=null;
 const displayCenters=()=>slitPreviewSeparation===null?p.centers:[...(slit1Open?[-slitPreviewSeparation/200]:[]),...(slit2Open?[slitPreviewSeparation/200]:[])];
 const displayExtentSigma=()=>interpretation==='bohmian'&&directed.checked?3:(p?.slitExtentSigma??Number(extent.value));
 const detectorFlashes=new Map();
 const style=document.createElement('style');style.textContent='.packet-settings label{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:5px;margin:6px 0}.packet-settings input[type=range]{grid-column:1/-1;width:100%;min-width:0}.packet-settings label:has(input[type=checkbox]){display:flex;gap:8px}.packet-settings .packet-directed-row{display:block!important;width:100%;grid-column:1/-1;margin:6px 0}.packet-settings .packet-directed-row[hidden]{display:none!important}.packet-settings .packet-directed-row>label{display:flex!important;align-items:center;gap:8px;width:100%;margin:0 0 5px;white-space:nowrap}.packet-settings .packet-directed-row input{flex:0 0 auto}.packet-settings .packet-directed-row .packet-note{display:block;width:100%}.packet-note{font-size:.85em;line-height:1.4;opacity:.85}.physics-notation{width:100%;border-collapse:collapse;margin:16px 0}.physics-notation th,.physics-notation td{padding:8px 12px;border-bottom:1px solid #476477;text-align:left;vertical-align:top}.physics-notation td:first-child{min-width:100px}.packet-equation{overflow-x:auto;padding:8px 0}.packet-equation .katex{font-size:1.1em} .packet-settings,.packet-settings label,.packet-note{color:#dcecf4!important}[data-theme=light] .packet-settings,[data-theme=light] .packet-settings label,[data-theme=light] .packet-note{color:#183343!important}#particleRate-group,#sourceOption,label[for=Source]{display:none!important}.packet-settings .packet-inline{display:grid;grid-template-columns:90px minmax(40px,1fr) 58px 24px;gap:6px;align-items:center;margin:5px 0}.packet-settings .packet-inline label{display:block;margin:0;font-size:12px}.packet-settings .packet-inline input[type=range]{grid-column:auto;width:100%}.packet-species{display:flex!important;align-items:center;gap:6px;margin:0 0 4px;padding-bottom:4px;border-bottom:1px solid var(--border-color,#476477)}.packet-species>label:first-child{width:90px;min-width:90px;margin:0;font-size:12px}.packet-species select{min-width:82px}.packet-species .packet-directed-inline{display:flex;align-items:center;gap:4px;width:auto;min-width:0;margin:0 0 0 auto;font-size:12px;white-space:nowrap;cursor:help}.packet-species .packet-directed-inline[hidden]{display:none!important}.packet-species .packet-directed-inline input{margin:0;flex:0 0 auto}.packet-slit-colors{display:flex!important;align-items:center;gap:6px!important;margin:2px 0 4px 96px!important;font-size:12px;white-space:nowrap;cursor:help}.packet-slit-colors[hidden]{display:none!important}.packet-slit-colors input{margin:0}.packet-slit-key{display:inline-flex;gap:3px}.packet-slit-key i{display:block;width:10px;height:10px;border-radius:50%;background:#22d3ee}.packet-slit-key i+ i{background:#ff9f43}.packet-inline input[type=number]{width:100%;box-sizing:border-box;background:transparent;color:inherit;border:1px solid #476477;border-radius:3px;padding:3px}.packet-inline output{font-size:12px}#source-position-group,#detector-distance-group,#screen-height-group{display:grid!important;grid-template-columns:90px minmax(40px,1fr) 58px 24px;gap:6px;align-items:center;margin:5px 0}#source-position-group label,#detector-distance-group label,#screen-height-group label{margin:0;font-size:12px}#source-position-group input[type=range],#detector-distance-group input[type=range],#screen-height-group input[type=range]{grid-column:auto;width:100%;min-width:0}#source-position-group input[type=number],#detector-distance-group input[type=number],#screen-height-group input[type=number]{width:100%;box-sizing:border-box}#analytical-advanced .input-group{margin-bottom:4px}#analytical-advanced h3{margin:6px 0}.packet-geometry{position:absolute;inset:0;pointer-events:none;z-index:6}.packet-geometry[hidden],#canvas-container:not(.editing-geometry) .packet-geometry{display:none}.qontic-media-toolbar button[aria-label="Edit geometry"][aria-pressed="true"]{background:#286078;outline:2px solid #7ee9fb}.packet-geometry button{position:absolute;pointer-events:auto;touch-action:none;color:#d9f8ff;background:rgba(25,76,90,.2);border:1px solid rgba(110,222,239,.45)}.packet-detector-drag{bottom:3px;width:30px;height:28px;transform:translateX(-100%);cursor:ew-resize;border-radius:5px}.packet-slit-separation-drag{width:56px;height:24px;transform:translate(-50%,-50%);cursor:ns-resize;border-radius:12px!important;font-size:10px!important;background:#24394d!important}.packet-slit-separation-drag[hidden]{display:none!important}.packet-slit-width-drag{font-size:10px!important;width:56px;height:24px;transform:translate(-50%,-50%);cursor:ns-resize;border-radius:5px}.packet-slit-width-drag[hidden]{display:none!important}.packet-wall-drag{bottom:3px;width:30px;height:28px;transform:translateX(-50%);cursor:ew-resize;border-radius:5px}.packet-detector-drag:hover,.packet-geometry button:focus-visible{background:rgba(50,170,195,.5);outline:2px solid #7ee9fb}.packet-height-drag{bottom:3px;transform:translateX(0);width:58px;height:28px;cursor:ns-resize;border-radius:5px;font-size:10px!important}.packet-geometry-guide{position:absolute;top:0;bottom:0;border-left:2px dashed #8fecff}.packet-geometry-value{position:absolute;bottom:35px;right:10px;background:#122e40;color:white;padding:5px;border-radius:4px}.packet-unused-row{display:none!important}#waveCanvas,#partCanvas,#setupCanvas{background:transparent!important}#canvas-container{background:#344f63!important}';document.head.append(style);
 const layoutStyle=document.createElement('style');layoutStyle.textContent='.packet-core-options{display:flex!important;align-items:center;gap:8px;margin:0 0 8px;padding:0 0 8px;border-bottom:1px solid var(--border-color,#476477)}.packet-core-options>select{flex:1 1 78px;min-width:68px}.packet-core-options .packet-directed-inline,.packet-core-options .packet-slit-colors{display:flex!important;align-items:center;gap:4px!important;width:auto;min-width:0;margin:0!important;font-size:12px;white-space:nowrap}.packet-core-options .packet-directed-inline[hidden],.packet-core-options .packet-slit-colors[hidden]{display:none!important}.packet-core-options input{margin:0;flex:0 0 auto}.packet-core-options .packet-slit-colors select{width:86px;min-width:86px;padding:3px 2px;font-size:11px}.packet-settings .packet-balance{grid-template-columns:90px minmax(40px,1fr) 28px 58px}.packet-settings .packet-balance button{width:26px;height:25px;padding:0;border:1px solid #476477;border-radius:4px;background:#153447;color:inherit;font-weight:700;cursor:pointer}.packet-settings .packet-balance button:hover,.packet-settings .packet-balance button:focus-visible{border-color:#62d8e7;background:#1d465c}.packet-settings .packet-balance output{grid-column:auto;text-align:right;min-width:58px}';document.head.append(layoutStyle);
 const math=document.getElementById('math-container'),packetMath=document.createElement('section');packetMath.className='math-section';math.replaceChildren(packetMath);
 let slowPacketMode=false,savedPacketCount=null;
 let enabled=true,p=null,coeff=null,profile=null,law=null,sourceGrid=null,fingerprint='',particles=[],pending=[],pulses=[],slitHits={upper:[],lower:[]},spectrumHitCounts=[],spectrumHitSums=[],nextEmission=0,t=0,totalTime=0,pulse=0,absorbed=0,pulseAbsorbed=0,missed=0,last=null,realElapsed=0,timeUnit=1,yOffset=0,finished=false,packetAnimationId=null,visualPhase=0,flash=null,hold=0,lastMode=interpretation;
 let surfaceView=localStorage.getItem('qontic-double-slit-surface-view')==='true',surfaceHeightMode=localStorage.getItem('qontic-double-slit-surface-height')||'psi2',surfaceHeights=null,surface3D=null,surface3DLoad=null,pwWaveVisible=localStorage.getItem('qontic-pw-wave-visible')!=='false',pwWaveButton=null;
 if(!['psi2','phase','real','imag'].includes(surfaceHeightMode))surfaceHeightMode='psi2';
 const slitColors={upper:'#22d3ee',lower:'#ff9f43'};
 const spectrumSteps=48;
 const field=document.createElement('canvas'),gridW=640,gridH=480;field.width=gridW;field.height=gridH;const fc=field.getContext('2d');let data=fc.createImageData(gridW,gridH),paletteKey='',paletteColors=null;
 const shown=id=>document.getElementById(id)?.checked;
 const X=x=>(wallXWorld+(p.launch+x)*100)*toCanvasX,Y=y=>(y+yOffset)*100*toCanvasY;
 function spectrumIndex(wallY){
  if(!Number.isFinite(wallY)||!p?.centers?.length)return -1;
  const half=displayExtentSigma()*p.sy,lo=Math.min(...p.centers)-half,hi=Math.max(...p.centers)+half;
  return Math.max(0,Math.min(spectrumSteps-1,Math.round((wallY-lo)/Math.max(1e-12,hi-lo)*(spectrumSteps-1))));
 }
 function spectrumColor(index){const t=index/Math.max(1,spectrumSteps-1);return `hsl(${270*(1-t)}, 88%, 58%)`;}
 function groupColor(group,trajectory=false){return group==='default'?(trajectory?colorTraj:colorPart):group[0]==='s'?spectrumColor(+group.slice(1)):slitColors[group];}
 function particleColorGroup(a){
  if(particleColorMode.value==='slit'&&a.slitSide)return a.slitSide;
  if(particleColorMode.value==='spectrum'){const index=spectrumIndex(a.wallY);if(index>=0)return `s${index}`;}
  return 'default';
 }
 function syncWhichPathButton(){
  const button=document.getElementById('toggleWhichPath');if(!button)return;
  button.disabled=p?.centers.length!==2;
  button.title=button.disabled?'Open both slits to use the which-slit detector.':'Cycle the ideal which-slit detector: none, upper slit, or lower slit. The two detector-tagged waves add incoherently.';
 }
 function config(){
  applyPacketLimits();
  length.max=Math.max(50,Math.min(200,Math.floor(Math.min(sourcePos,detectorDistance)/4)));if(+length.value>+length.max)length.value=length.max;
  syncPacketInput(length);syncPacketInput(interval);
  const next={source:true,spherical:false,focused:false,sx:+length.value/100,sy:+width.value/100,slitExtentSigma:+extent.value,k:2*Math.PI*100/wavelength,launch:-sourcePos/100,wall:sourcePos/100,screen:(sourcePos+detectorDistance)/100,sourceSigma:+sourceWidth.value/100,bins:Math.max(1,Math.floor(nDetectorPixels)),particles:Math.max(1,Math.min(5000,Math.floor(+document.getElementById('MaxPart-input').value||100))),slits:slit1Open&&slit2Open?2:1};
  // Use physical inputs directly: a canvas/world round trip introduces tiny
  // resize-dependent rounding differences that would reset the experiment.
  next.centers=[...(slit1Open?[-slitSeparation/200]:[]),...(slit2Open?[slitSeparation/200]:[])].sort((a,b)=>a-b);
  const slitBalance=+balance.value/100;
  next.apertureWeights=next.centers.length===2?(slitBalance>=0?[1,1-slitBalance]:[1+slitBalance,1]):[1];
  balance.disabled=next.centers.length!==2;balanceRow.title=balance.disabled?'Open both slits to adjust their relative transmission.':'Attenuates one slit at field-amplitude level; Equal leaves both fully open.';
  next.whichPath=whichPathDetector!=='none'&&next.centers.length===2;next.initialRight=-worldCanvasDx/1000-.03;next.initialCenter=next.initialRight-6*next.sx;next.duration=(next.screen-next.initialCenter+8*next.sx)/next.k;return next;
 }
 function emissionPeriod(){return slowPacketMode||+interval.value===0?Infinity:(+interval.value)*(particleType==='neutron'?1:.001)/timeUnit;}
 function prepare(){
  pulse++;const cohort={born:t,count:p.particles,active:p.particles,pending:0,absorbed:0,surfacePhase:0};pulses.push(cohort);
  for(let i=0;i<p.particles;i++){const isDirected=interpretation==='bohmian'&&directed.checked,a=isDirected?sampleTransmittedSource(p,Math.random,null,3):sampleSource(p);if(slowPacketMode)a.x0=a.x=p.initialCenter;a.cohort=cohort;a.schedule=interpretation==='bohmian'?quantumSchedule(a,p,law):{at:(p.screen-a.x0)/p.k,type:'hit',index:samplePixel(law.weights)};particles.push(a);}
  nParticles+=p.particles;nextEmission=t+emissionPeriod();
 }
 function resetEngine(){
  window.qonticMWBranches?.cancel();detectorFlashes.clear();pending=[];particles=[];pulses=[];nextEmission=0;visualPhase=0;flash=null;hold=0;lastMode=interpretation;p=config();fingerprint=configFingerprint(p);yOffset=screenHeight/200;
  coeff=sourceCoefficients(p);sourceGrid=null;profile=sourceProfile(p,-yOffset,screenHeight/100-yOffset,2049);law=detectorLaw(p,profile,-yOffset,screenHeight/100-yOffset);
  timeUnit=(particleType==='neutron'?mNeutron:mElectron)*10000/hbar;syncWhichPathButton();
  hits=Array(p.bins).fill(0);slitHits={upper:Array(p.bins).fill(0),lower:Array(p.bins).fill(0)};spectrumHitCounts=Array(p.bins).fill(0);spectrumHitSums=Array(p.bins).fill(0);nHits=0;hitMax=0;logNBranches=0;nParticles=0;trajectories.length=0;absorbed=0;missed=0;t=0;totalTime=0;pulse=0;nSteps=0;last=null;realElapsed=0;prepare();updateBranchCountDisplay();setWaveRangeAuto(0,1);updateMath();stats();
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
  packetMath.innerHTML=physicsHTML+'<h3>Direct-PW preparation</h3><p>Direct PW samples transmitted configurations within a fixed ±3σₐ window around each Gaussian aperture, independently of the displayed Slit extent. This window contains 99.73% of an isolated Gaussian profile. The green comparison curve remains the common analytical Gaussian-wave prediction rather than introducing a hard finite-core cut.</p><h3>Unequal slit transmission</h3><p>The expert “Slit balance” control multiplies the upper and lower aperture amplitudes by factors a₁ and a₂ between zero and one. One slit remains fully open while the other is attenuated; “Upper only” or “Lower only” sets the opposite factor to zero. The analytical Gaussian propagation is unchanged: only the corresponding closed-form component coefficients change. Unequal amplitudes reduce fringe visibility and break the reflection symmetry of the Pilot-Wave velocity field.</p>'+whichPathPhysicsHTML;
  math.removeAttribute('aria-busy');
  const views=document.getElementById('rationale');views.innerHTML=viewsHTML+'<h3>3D wave surface</h3><p>The optional interactive 3D view graphs the same analytical field used by the 2D view. Dragging rotates the camera, the wheel or a pinch gesture zooms, and right-dragging pans. The Height selector can graph contrast-enhanced |Ψ|², cos φ, or Re Ψ and Im Ψ with the same enhanced amplitude envelope. The monotonic height boost preserves zeros and ordering but is not a linear amplitude scale; it keeps the weaker transmitted wave readable beside the incident packet. The cos φ choice is a continuous phase display that avoids an artificial moving cliff at the ±π wrap; unlike φ itself, it does not uniquely identify the phase angle. For cos φ, Re Ψ and Im Ψ, the middle of the height range is zero, and the reference grid and apparatus lie on that zero plane; the translucent floor lets negative lobes remain visible below it. To prevent temporal aliasing, the 3D carrier-phase animation is display-capped at 2 rad/s; this changes neither the wavefunction used for guidance nor any simulated timing. Surface color independently retains the wave quantity selected in the ordinary Show control and uses the same slowed display phase in 3D. With which-path tagging, phase and signed height use a density-weighted display of the two noninterfering tagged components rather than treating them as a coherent sum. Height and color are display coordinates and do not add a physical spatial dimension. The detector histogram is likewise graphed vertically above a low detector wall: it uses the same predicted curve, retained hits and square-root count error bars as the 2D histogram. When the wave is visible, Pilot-Wave particles and trajectories are lifted onto its graph only to keep their positions visible; hiding the wave places them at a fixed height on the apparatus zero plane. Their dynamics are always calculated entirely in the physical x–y plane. The Pilot-Wave toolbar eye changes only this display; it does not alter the guidance field or interrupt the simulation.</p><h3>Direct-PW statistics</h3><p>The fixed ±3σₐ Direct-PW window omits only the 0.27% isolated-Gaussian tails. The green curve continues to show the common analytical probability distribution, without a hard central cut. Toggling Direct PW preserves earlier hits and affects new packets.</p>'+whichPathViewsHTML;
  views.removeAttribute('aria-busy');
  for(const node of [...packetMath.querySelectorAll('[data-equation]'),...views.querySelectorAll('[data-equation]')]){
   const formula=physicsEquations[node.dataset.equation]??whichPathEquations[node.dataset.equation];
   if(typeof katex!=='undefined')katex.render(formula,node,{displayMode:true,throwOnError:false});
   else node.textContent=formula;
  }
 }
 function syncMode(){
  for(const id of ['waveFunctionOption','basicsWaveFunctionOption']){const select=document.getElementById(id);if(!select)continue;const phase=select.querySelector('option[value=Phase]');if(phase&&phase.textContent!=='Phase (cos θ)')phase.textContent='Phase (cos θ)';if(!select.value)select.value='Phase';}

  directedRow.hidden=slitColorRow.hidden=interpretation!=='bohmian';
  slitWidthHelp(interpretation==='bohmian'&&directed.checked);
  syncPwWaveButton();
  syncWhichPathButton();
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
     ?sampleTransmittedSource(p,Math.random,a.x0,directed.checked?3:null)
     :sampleSource(p,Math.random,a.x0);
    let age=0;while(age<packetAge&&!b.done){const dt=Math.min(.002,packetAge-age);stepSource(b,dt,p,coeff);age+=dt;}
    if(b.done)throw new Error('Active-packet reconstruction reached a completed outcome.');
    b.cohort=a.cohort;particles[i]=b;
   }
  }
  lastMode=interpretation;
 }
 function waveShown(){return shown('plot_wave')&&(interpretation!=='bohmian'||pwWaveVisible);}
 function syncPwWaveButton(){
  if(!pwWaveButton)return;
  pwWaveButton.hidden=interpretation!=='bohmian';pwWaveButton.setAttribute('aria-pressed',String(pwWaveVisible));
  pwWaveButton.title=pwWaveVisible?'Hide the Pilot-Wave field without changing particle guidance':'Show the Pilot-Wave field';
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
 function addHit(index,slitSide=null,wallY=null){hits[index]++;if(slitSide&&slitHits[slitSide])slitHits[slitSide][index]++;const spectrum=spectrumIndex(wallY);if(spectrum>=0){spectrumHitCounts[index]++;spectrumHitSums[index]+=spectrum;}nHits++;hitMax=Math.max(hitMax,hits[index]);logNBranches+=Math.log10(p.bins);}
 function createSurfaceRecord(record){
  const overlay=document.createElement('canvas');overlay.width=canvas.width;overlay.height=canvas.height;const context=overlay.getContext('2d');
  const {curve}=histogramLayout(record,profile,screenHeight/100,1),maximum=Math.max(1e-30,...curve,...record.map(n=>n+Math.sqrt(n)));
  if(shown('hit_prob')&&!p.focused){context.strokeStyle=colorProb;context.lineWidth=1.5;context.beginPath();const step=Math.max(1,Math.ceil(curve.length/300));for(let i=0;i<curve.length;i+=step){const point=surface3D.projectDetector(i/(curve.length-1),.08+.9*curve[i]/maximum,overlay.width,overlay.height);i?context.lineTo(point.x,point.y):context.moveTo(point.x,point.y);}context.stroke();}
  context.strokeStyle=context.fillStyle=colorHit;context.lineWidth=1.5;
  record.forEach((n,i)=>{if(!n)return;const v=(i+.5)/record.length,z=.08+.9*n/maximum,error=.9*Math.sqrt(n)/maximum;
   const point=surface3D.projectDetector(v,z,overlay.width,overlay.height),low=surface3D.projectDetector(v,Math.max(.08,z-error),overlay.width,overlay.height),high=surface3D.projectDetector(v,z+error,overlay.width,overlay.height);
   context.beginPath();context.moveTo(low.x,low.y);context.lineTo(high.x,high.y);context.stroke();context.beginPath();context.arc(point.x,point.y,3,0,2*Math.PI);context.fill();
  });return overlay;
 }
 function processPending(){
  if(!pending.length||window.qonticMWBranches?.busy)return;
  const event=pending.shift(),index=event.index;event.cohort.pending--;
  if(interpretation==='manyworlds'&&window.qonticMWBranches?.enabled){
   event.cohort.branching=true;
   const previous=hits.slice();
   const setRecord=i=>{hits=recordWithHit(previous,i);hitMax=Math.max(...hits);};
   const surfaceBranches=surfaceView&&surface3D;
   const started=window.qonticMWBranches.begin({selected:index,weights:law.weights,detectorFraction:detectorX/canvas.width,sensorFraction:sensorWidth/canvas.width,sensorColor:colorSensor,recordFull:!!surfaceBranches,
    captureFrame:surfaceBranches?((context,w,h,includeWave)=>surface3D.capture(context,w,h,{includeWave,includeRecords:false})):null,
    projectOutcome:surfaceBranches?((pixel,count,w,h)=>surface3D.projectDetector((pixel+.5)/count,.1,w,h)):null,
    createRecord(i){const record=recordWithHit(previous,i);if(surfaceBranches)return createSurfaceRecord(record);const strip=document.createElement('canvas'),scale=Math.min(1,256/canvas.height);strip.width=Math.ceil((canvas.width-detectorX)*scale);strip.height=Math.ceil(canvas.height*scale);const context=strip.getContext('2d');context.scale(scale,scale);context.translate(-detectorX,0);histogram({context,hits:record});return strip;},
    onSplit(){detectorFlashes.clear();nHits++;logNBranches+=Math.log10(p.bins);setRecord(index);updateBranchCountDisplay();stats();},
    onSelect(i){event.cohort.branching=false;setRecord(i);detectorFlashes.clear();flash=null;last=null;draw();}
   });if(started)return;event.cohort.branching=false;
  }
  addHit(index,event.slitSide,event.wallY);detectorFlashes.set(index,DETECTOR_PULSE_SECONDS);flash={index,remaining:DETECTOR_PULSE_SECONDS};
 }
 function integrate(dt){
  const end=t+dt,recordTails=interpretation==='bohmian'&&shown('plot_trajectories')&&+tailLength.value>0;
  for(const a of particles){
   if(a.done)continue;
   if(interpretation==='bohmian'){
    const event=stepSource(a,dt,p,coeff);
    if(event==='absorbed'){absorbed++;pulseAbsorbed++;a.cohort.absorbed++;}
    if(event==='hit'){const index=Math.floor((a.y+yOffset)/(screenHeight/100)*p.bins);if(index>=0&&index<p.bins){a.screenDetected=true;pending.push({index,cohort:a.cohort,slitSide:a.slitSide,wallY:a.wallY});a.cohort.pending++;}else missed++;}
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
  const phaseRate=surfacePhaseRate(speed*p.k*p.screen/12);
  for(const cohort of pulses)cohort.surfacePhase=((cohort.surfacePhase??0)+wallDt*phaseRate)%(2*Math.PI);
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
 async function ensureSurface3D(){
  if(surface3D)return surface3D;
  if(!surface3DLoad)surface3DLoad=import('./packet-surface-3d.js?v=2.106').then(({mountPacketSurface3D})=>{
   surface3D=mountPacketSurface3D({host:document.getElementById('canvas-container')});configureSurfaceEditor();surface3D.configureHeight(surfaceHeightMode,mode=>{surfaceHeightMode=mode;localStorage.setItem('qontic-double-slit-surface-height',mode);draw();});surface3D.setVisible(surfaceView);surface3D.setEditing(geometryEditing);draw();return surface3D;
  }).catch(error=>{surface3DLoad=null;surfaceView=false;syncSurfaceView();console.error('Unable to start the 3D renderer',error);});
  return surface3DLoad;
 }
 function hitMarkerColor(i,n){
  if(interpretation!=='bohmian')return colorHit;
  if(particleColorMode.value==='uniform')return colorPart;
  if(particleColorMode.value==='spectrum'){const spectrum=spectrumHitCounts[i]?Math.round(spectrumHitSums[i]/spectrumHitCounts[i]):Math.round((i+.5)/p.bins*(spectrumSteps-1));return spectrumColor(spectrum);}
  const upper=slitHits.upper?.[i]||0,lower=slitHits.lower?.[i]||0,unclassified=Math.max(0,n-upper-lower),upperDisplay=upper+(i<p.bins/2?unclassified:0),lowerDisplay=lower+(i>=p.bins/2?unclassified:0);
  return upperDisplay>=lowerDisplay?slitColors.upper:slitColors.lower;
 }
 function updateSurface3D(){
  if(!surfaceView||!surface3D||!p)return;
  const half=displayExtentSigma()*(slitPreviewWidth??p.sy*100)*toCanvasY;
  const openings=displayCenters().map(center=>[Math.max(0,(Y(center)-half)/canvas.height),Math.min(1,(Y(center)+half)/canvas.height)]).filter(([a,b])=>b>a);
  const {curve}=histogramLayout(hits,profile,screenHeight/100,1),maximum=Math.max(1e-30,...curve,...hits.map(n=>n+Math.sqrt(n)));
  const trails=[],points=[];
  if(interpretation==='bohmian')for(const a of particles){
   const group=particleColorGroup(a),opacity=tailOpacity(a.done,a.finishedAt??realElapsed,realElapsed);
   if(opacity&&a.path.length)trails.push({color:groupColor(group,true),points:a.path.map(([x,y])=>[Math.max(0,Math.min(1,X(x)/detectorX)),Math.max(0,Math.min(1,Y(y)/canvas.height))])});
   if(!a.done)points.push({color:groupColor(group),u:Math.max(0,Math.min(1,X(a.x)/detectorX)),v:Math.max(0,Math.min(1,Y(a.y)/canvas.height))});
  }
  surface3D.update({gridWidth:gridW,gridHeight:gridH,fieldFraction:detectorX/canvas.width,heightMode:surfaceHeightMode,heights:surfaceHeights,rgba:data.data,
   showWave:waveShown(),showScreen:shown('plot_screen')&&p.source,showDetector:shown('plot_detector'),showProbability:shown('hit_prob')&&!p.focused,showHits:shown('plot_hits'),showParticles:shown('plot_particles'),showTrajectories:shown('plot_trajectories'),
   wallFraction:wallX/detectorX,openings,apertureWeights:p.apertureWeights||[],whichPathFraction:p.whichPath?(Y(p.centers[whichPathDetector==='slit2'?1:0])/canvas.height):null,
   detectorColor:colorDetector,probabilityColor:colorProb,probability:curve.map(value=>value/maximum),hits,hitHeights:hits.map(value=>value/maximum),hitErrors:hits.map(value=>Math.sqrt(value)/maximum),hitColors:hits.map((value,index)=>hitMarkerColor(index,value)),particles:points,trails});
 }
 function drawSourceWave(){
  waveCtx.clearRect(0,0,canvas.width,canvas.height);waveCtx.fillStyle='#344f63';waveCtx.fillRect(0,0,canvas.width,canvas.height);if(!waveShown())return;
 const key=[worldCanvasDx,screenHeight,wallXWorld,p.launch].join(',');
 if(!sourceGrid||sourceGrid.key!==key){
   const values=new Float64Array(gridW*gridH*2),branches=new Float64Array(gridW*gridH*4),xs=Array.from({length:gridW},(_,i)=>((i+.5)/gridW*worldCanvasDx-wallXWorld)/100-p.launch);let maxRho=0;
   for(let j=0;j<gridH;j++)for(let i=0;i<gridW;i++){
    const y=(j+.5)/gridH*screenHeight/100-yOffset,n=2*(j*gridW+i),cell=j*gridW+i;
    if(p.whichPath&&xs[i]>=p.wall){
     const components=sourceComponents(y,xs[i],p,coeff);let rho=0;
     for(let branch=0;branch<Math.min(2,components.length);branch++){const component=components[branch];branches[4*cell+2*branch]=component.rho;branches[4*cell+2*branch+1]=Math.atan2(component.im,component.re);rho+=component.rho;}
     values[n]=rho;values[n+1]=0;maxRho=Math.max(maxRho,rho);
    }else{
     const g=sourceTransverse(y,xs[i],p,coeff);values[n]=g.rho;values[n+1]=Math.atan2(g.im,g.re);maxRho=Math.max(maxRho,g.rho);
    }
   }
   const visibility=new Float32Array(gridW*gridH),phaseCos=new Float32Array(gridW*gridH),phaseSin=new Float32Array(gridW*gridH);
   for(let j=0;j<gridH;j++)for(let i=0;i<gridW;i++){
    phaseCos[j*gridW+i]=Math.cos(values[2*(j*gridW+i)+1]);phaseSin[j*gridW+i]=Math.sin(values[2*(j*gridW+i)+1]);
    const gain=2+6*(1-Math.exp(-Math.max(0,xs[i]-p.wall)/.35));
    visibility[j*gridW+i]=1-Math.exp(-4*Math.sqrt(values[2*(j*gridW+i)]*gain/Math.max(1e-30,maxRho)));
   }
   sourceGrid={key,values,branches,xs,maxRho,visibility,phaseCos,phaseSin};
  }
  setWaveRangeAuto(0,1);const range=getWaveRangeEffective(),span=Math.max(1e-9,range.max-range.min),mode=$('#waveFunctionOption').val();
  // Pulses are independent preparations: add densities, not coherent amplitudes.
  // Blend phase colors by density where independent pulses overlap.
  const env=sourceGrid.xs.map(x=>{
   let density=0,cos=0,sin=0;
   for(const c of pulses){
    const e=sourceEnvelope(x,t-c.born,p),fraction=c.branching?1:(c.active+c.pending)/Math.max(1,c.count-c.absorbed),q=e.rho*fraction;
    const displayPhase=surfaceView?p.k*x-(c.surfacePhase??0):e.phase-visualPhase;
    density+=q;cos+=q*Math.cos(displayPhase);sin+=q*Math.sin(displayPhase);
   }return {rho:density,cos:cos/Math.max(1e-300,density),sin:sin/Math.max(1e-300,density),envelope:Math.min(1,Math.sqrt(density*Math.sqrt(2*Math.PI)*p.sx))};
  });
  const peak=sourceGrid.maxRho/(Math.sqrt(2*Math.PI)*p.sx),envPeak=1/(Math.sqrt(2*Math.PI)*p.sx);
  if(paletteKey!==graphPalette||!paletteColors){paletteKey=graphPalette;paletteColors=Array.from({length:1024},(_,i)=>window.paletteModule.getColorForValue(i/1023,graphPalette));}
  const alpha=255*elementOpacity('plot_wave');surfaceHeights=surfaceView?new Float32Array(gridW*gridH):null;
  for(let j=0;j<gridH;j++)for(let i=0;i<gridW;i++){
   const n=j*gridW+i,rho=sourceGrid.values[2*n]*env[i].rho;
   // Preserve a localized Gaussian envelope; do not amplify its remote tails.
   const rawWeight=sourceGrid.visibility[n]*env[i].envelope;
   // Display-only contrast boost; zero density stays transparent.
   const weight=-Math.expm1(-3*rawWeight)/-Math.expm1(-3);let phaseCos=sourceGrid.phaseCos[n],phaseSin=sourceGrid.phaseSin[n];
   if(p.whichPath&&sourceGrid.xs[i]>=p.wall){const r0=sourceGrid.branches[4*n],r1=sourceGrid.branches[4*n+2],total=Math.max(1e-300,r0+r1),a0=sourceGrid.branches[4*n+1],a1=sourceGrid.branches[4*n+3];phaseCos=(r0*Math.cos(a0)+r1*Math.cos(a1))/total;phaseSin=(r0*Math.sin(a0)+r1*Math.sin(a1))/total;const norm=Math.hypot(phaseCos,phaseSin)||1;phaseCos/=norm;phaseSin/=norm;}
   const cosTheta=phaseCos*env[i].cos-phaseSin*env[i].sin,sinTheta=phaseSin*env[i].cos+phaseCos*env[i].sin,normalizedDensity=rho/Math.max(1e-30,peak);
   if(surfaceHeights)surfaceHeights[n]=surfaceHeightValue(surfaceHeightMode,surfaceDisplayDensity(normalizedDensity),cosTheta,sinTheta);
   let value;
   if(mode==='Phase'){
    // Display cos(theta), a smooth scalar representation of the local phase.
    value=.5+.5*(sourceGrid.phaseCos[n]*env[i].cos-sourceGrid.phaseSin[n]*env[i].sin);
   }else if(mode==='LogPsi2')value=Math.max(0,Math.min(1,(Math.log(Math.max(1e-15,rho/peak))+15)/15));
   else value=Math.sqrt(Math.min(1,rho/peak*8));
   if(p.whichPath&&sourceGrid.xs[i]>=p.wall){
    const colors=[[34,211,238],[255,159,67]],componentRho=[sourceGrid.branches[4*n],sourceGrid.branches[4*n+2]],total=Math.max(1e-300,componentRho[0]+componentRho[1]);let red=0,green=0,blue=0;
    for(let branch=0;branch<2;branch++){
     const fraction=componentRho[branch]/total,phase=sourceGrid.branches[4*n+2*branch+1],phaseValue=.5+.5*(Math.cos(phase)*env[i].cos-Math.sin(phase)*env[i].sin);
     const brightness=mode==='Phase'?.25+.75*phaseValue:.3+.7*value;
     red+=fraction*colors[branch][0]*brightness;green+=fraction*colors[branch][1]*brightness;blue+=fraction*colors[branch][2]*brightness;
    }
    data.data[4*n]=.9*red+.1*255;data.data[4*n+1]=.9*green+.1*255;data.data[4*n+2]=.9*blue+.1*255;data.data[4*n+3]=alpha*weight;
   }else{
    const rgb=paletteColors[Math.round(Math.max(0,Math.min(1,(value-range.min)/span))*1023)];
    data.data[4*n]=.88*rgb[0]+.12*255;data.data[4*n+1]=.88*rgb[1]+.12*255;data.data[4*n+2]=.88*rgb[2]+.12*255;data.data[4*n+3]=alpha*weight;
   }
  }
  fc.putImageData(data,0,0);
  if(!surfaceView){waveCtx.save();waveCtx.imageSmoothingEnabled=true;waveCtx.imageSmoothingQuality="high";waveCtx.beginPath();waveCtx.rect(0,0,detectorX,canvas.height);waveCtx.clip();waveCtx.drawImage(field,0,0,canvas.width,canvas.height);waveCtx.restore();}
  if(!p.whichPath)drawPaletteScale(graphPalette,mode==='Phase'?2*range.min-1:range.min,mode==='Phase'?2*range.max-1:range.max);
 }

 function drawParticles(){
  partCtx.clearRect(0,0,canvas.width,canvas.height);if(interpretation!=='bohmian')return;
  const tails=shown('plot_trajectories'),dots=shown('plot_particles'),maxTail=+tailLength.value/100;
  const groups=['default','upper','lower',...Array.from({length:spectrumSteps},(_,i)=>`s${i}`)];
  const buckets=Object.fromEntries(groups.map(group=>[group,Array.from({length:9},()=>[])]));
  for(const a of particles){
   trimTail(a.path,a.screenDetected?0:maxTail);
   const opacity=tailOpacity(a.done,a.finishedAt??realElapsed,realElapsed);
   if(!opacity)a.path=[];
   if(tails&&a.path.length)buckets[particleColorGroup(a)][Math.min(8,Math.ceil(opacity*8))].push(a);
  }
  partCtx.save();partCtx.beginPath();partCtx.rect(0,0,detectorX,canvas.height);partCtx.clip();
  for(const group of groups){
   partCtx.strokeStyle=groupColor(group,true);
   for(let i=1;i<=8;i++){
    if(!buckets[group][i].length)continue;partCtx.globalAlpha=elementOpacity('plot_trajectories')*i/8;partCtx.beginPath();
    for(const a of buckets[group][i]){let first=true;for(const [x,y] of a.path){const q={x:X(x),y:Y(y)};if(first){partCtx.moveTo(q.x,q.y);first=false;}else partCtx.lineTo(q.x,q.y);}}
    partCtx.stroke();
   }
  }
  if(dots){partCtx.globalAlpha=elementOpacity('plot_particles');for(const group of groups){partCtx.fillStyle=groupColor(group);partCtx.beginPath();for(const a of particles)if(!a.done&&particleColorGroup(a)===group){const q={x:X(a.x),y:Y(a.y)};partCtx.moveTo(q.x+3,q.y);partCtx.arc(q.x,q.y,3,0,2*Math.PI);}partCtx.fill();}}
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
  const prediction=options.profile||profile;
  const {curve:predictionCounts,scale}=histogramLayout(record,prediction,options.screenHeight??screenHeight/100,widthPx);
  context.save();context.globalAlpha=1;context.fillStyle='#fff';context.fillRect(histo,0,widthPx,canvas.height);context.fillStyle='#000';context.fillRect(detectorX,0,sensorWidth,canvas.height);
  if((geometryEditing||shown('hit_prob'))&&!p.focused){context.globalAlpha=geometryEditing?1:elementOpacity('hit_prob');context.strokeStyle=colorProb;context.beginPath();predictionCounts.forEach((q,i)=>{const x=histo+q*scale,y=i*canvas.height/(predictionCounts.length-1);i?context.lineTo(x,y):context.moveTo(x,y);});context.stroke();}
  const rgb=getRGBComponents(colorSensor);
  record.forEach((n,i)=>{if(!n)return;const y=(i+.5)*canvas.height/p.bins,x=histo+n*scale,error=Math.sqrt(n)*scale;
   if(shown('plot_sensor')){context.globalAlpha=elementOpacity('plot_sensor');const intensity=n/maxRecord;context.fillStyle=`rgb(${rgb.red*intensity},${rgb.green*intensity},${rgb.blue*intensity})`;context.fillRect(detectorX,i*canvas.height/p.bins,sensorWidth,canvas.height/p.bins);}
   if(shown('plot_hits')){
    context.globalAlpha=elementOpacity('plot_hits');
    const pwColors=interpretation==='bohmian'&&context===setupCtx;
    const slitResolved=pwColors&&particleColorMode.value==='slit';
    if(slitResolved){
     const upper=slitHits.upper?.[i]||0,lower=slitHits.lower?.[i]||0,unclassified=Math.max(0,n-upper-lower);
     // Coherent PW trajectories do not cross. Hits accumulated in MW or
     // Orthodox views therefore inherit the PW display color of their screen
     // side when the user returns to the By-slit view. Draw one marker for the
     // complete retained count so mixed histories never produce black overlays.
     const upperDisplay=upper+(i<p.bins/2?unclassified:0),lowerDisplay=lower+(i>=p.bins/2?unclassified:0);
     const markerColor=upperDisplay>=lowerDisplay?slitColors.upper:slitColors.lower;
     context.strokeStyle=context.fillStyle=markerColor;context.beginPath();context.moveTo(x-error,y);context.lineTo(x+error,y);context.stroke();context.beginPath();context.arc(x,y,3,0,2*Math.PI);context.fill();
    }else{let markerColor=colorHit;if(pwColors&&particleColorMode.value==='uniform')markerColor=colorPart;else if(pwColors&&particleColorMode.value==='spectrum'){const spectrum=spectrumHitCounts[i]?Math.round(spectrumHitSums[i]/spectrumHitCounts[i]):Math.round((i+.5)/p.bins*(spectrumSteps-1));markerColor=spectrumColor(spectrum);}context.strokeStyle=context.fillStyle=markerColor;context.beginPath();context.moveTo(x-error,y);context.lineTo(x+error,y);context.stroke();context.beginPath();context.arc(x,y,3,0,2*Math.PI);context.fill();}
   }
  });context.restore();
 }
 function draw(){if(!enabled)return;ensure();syncMode();setupCtx.clearRect(0,0,canvas.width,canvas.height);
  setupCtx.save();if(!surfaceView&&shown('plot_screen')){setupCtx.globalAlpha=elementOpacity('plot_screen');setupCtx.strokeStyle=colorScreen;if(p.source){
   // Draw the expert-selected slit cores, except that Direct PW displays its
   // fixed ±3σ preparation window. The analytical wave remains untruncated.
   const half=displayExtentSigma()*(slitPreviewWidth??p.sy*100)*toCanvasY;
   const openings=displayCenters().map(center=>[Math.max(0,Y(center)-half),Math.min(canvas.height,Y(center)+half)]).filter(([a,b])=>b>a).sort((a,b)=>a[0]-b[0]);
   setupCtx.strokeStyle='#d4e6ef';setupCtx.lineWidth=6;setupCtx.lineCap='butt';setupCtx.beginPath();let cursor=0;
   for(const [top,bottom] of openings){if(top>cursor){setupCtx.moveTo(wallX,cursor);setupCtx.lineTo(wallX,top);}cursor=Math.max(cursor,bottom);}
   if(cursor<canvas.height){setupCtx.moveTo(wallX,cursor);setupCtx.lineTo(wallX,canvas.height);}setupCtx.stroke();
   setupCtx.strokeStyle='#81e7f5';setupCtx.lineWidth=1.5;
   for(const [top,bottom] of openings){setupCtx.beginPath();setupCtx.moveTo(wallX-9,top);setupCtx.lineTo(wallX+9,top);setupCtx.moveTo(wallX-9,bottom);setupCtx.lineTo(wallX+9,bottom);setupCtx.stroke();}
   openings.forEach(([top,bottom],index)=>{const transmission=p.apertureWeights?.[index]??1;if(transmission>=1)return;setupCtx.save();setupCtx.globalAlpha*=1-transmission;setupCtx.strokeStyle='#d4e6ef';setupCtx.lineWidth=6;setupCtx.beginPath();setupCtx.moveTo(wallX,top);setupCtx.lineTo(wallX,bottom);setupCtx.stroke();setupCtx.restore();});
   if(p.whichPath){
    const detectorIndex=whichPathDetector==='slit2'?1:0,detectorY=Y(p.centers[detectorIndex]);
    setupCtx.globalAlpha=1;setupCtx.fillStyle='#ffd54a';setupCtx.strokeStyle='#3b2d00';setupCtx.lineWidth=1.5;setupCtx.fillRect(wallX-13,detectorY-9,11,18);setupCtx.strokeRect(wallX-13,detectorY-9,11,18);
    setupCtx.fillStyle='#3b2d00';setupCtx.font='bold 9px Inter,Arial,sans-serif';setupCtx.textAlign='center';setupCtx.textBaseline='middle';setupCtx.fillText('D',wallX-7.5,detectorY);
   }
  }}
  setupCtx.setLineDash([]);if(!surfaceView&&shown('plot_detector')){setupCtx.globalAlpha=elementOpacity('plot_detector');setupCtx.strokeStyle=colorDetector;setupCtx.beginPath();setupCtx.moveTo(detectorX,0);setupCtx.lineTo(detectorX,canvas.height);setupCtx.stroke();}setupCtx.restore();
  drawWave();drawParticles();histogram();drawDetection();updateSurface3D();window.qonticScaleOverlay?.update();geometryControls?.update();slitControls?.update();separationControls?.update();stats();
 }

 function hash(){return '&engine=packet&packetOrigin=source&sourceWidth='+sourceWidth.value+'&packetLength='+length.value+'&packetWidth='+width.value+'&slitExtent='+extent.value+'&slitBalance='+balance.value+'&packetCount='+p.particles+'&tailLength='+tailLength.value+'&packetInterval='+interval.value+(surfaceView?'&surface3d=1&surfaceHeight='+surfaceHeightMode:'');}
 const params=new URLSearchParams(location.hash.slice(1));
 if(params.has('surface3d'))surfaceView=params.get('surface3d')==='1';
 if(['psi2','phase','real','imag'].includes(params.get('surfaceHeight')))surfaceHeightMode=params.get('surfaceHeight');
 for(const [key,el] of [['packetLength',length],['packetWidth',width],['slitExtent',extent],['sourceWidth',sourceWidth],['tailLength',tailLength],['packetInterval',interval]]){const n=Number(params.get(key));if(params.has(key)&&n>=+el.min&&n<=+el.max){el.value=n;syncPacketInput(el);}}
 const savedBalance=Number(params.get('slitBalance'));if(params.has('slitBalance')&&savedBalance>=-100&&savedBalance<=100)balance.value=savedBalance;syncBalance();
 applyPacketLimits();
 const count=+params.get('packetCount');if(count>=1&&count<=5000)$('#MaxPart-group')[0]?.setValueInFirstUnit(count);
 interval.addEventListener('input',()=>{syncPacketInput(interval);nextEmission=Math.max(t,(pulses.at(-1)?.born??t)+emissionPeriod());});
 directed.addEventListener('change',()=>{localStorage.setItem('qontic-pw-directed-slits',String(directed.checked));syncMode();draw();});
 particleColorMode.addEventListener('change',()=>{localStorage.setItem('qontic-pw-particle-color',particleColorMode.value);localStorage.removeItem('qontic-pw-color-by-slit');draw();});
 balance.addEventListener('input',()=>{syncBalance();resetEngine();draw();});
 balanceEqual.addEventListener('click',()=>{if(balance.disabled)return;balance.value='0';balance.dispatchEvent(new Event('input',{bubbles:true}));});
 for(const control of [length,width,sourceWidth,extent])control.addEventListener('input',()=>{applyPacketLimits();syncPacketInput(control);slitWidthHelp(interpretation==='bohmian'&&directed.checked);resetEngine();draw();});

 const constrainedInputs=new Set(['slit-separation','source-position','screen-height','wavelength']);
 document.addEventListener('input',event=>{if(constrainedInputs.has(event.target?.id))applyPacketLimits();},true);

 for(const id of ['MaxPart','MaxPart-input'])document.getElementById(id).addEventListener(id==='MaxPart'?'input':'change',()=>queueMicrotask(()=>{ensure();draw();}));
 const syncGeometryReadouts=next=>{
  document.getElementById('source-position-group')?.setValueInFirstUnit(next?.wall??sourcePos);
  document.getElementById('detector-distance-group')?.setValueInFirstUnit(next?.distance??detectorDistance);
  document.getElementById('screen-height-group')?.setValueInFirstUnit(next?.height??screenHeight);
 };
 const clearHitsForPreview=()=>{
  window.qonticMWBranches?.cancel();hits=Array(p.bins).fill(0);slitHits={upper:Array(p.bins).fill(0),lower:Array(p.bins).fill(0)};spectrumHitCounts=Array(p.bins).fill(0);spectrumHitSums=Array(p.bins).fill(0);nHits=0;hitMax=0;logNBranches=0;detectorFlashes.clear();flash=null;updateBranchCountDisplay();stats();
 };
 function pauseForGeometry(){const running=isAnimating;if(running)document.getElementById('startButton').click();return running;}
 function resumeAfterGeometry(running){if(running&&!isAnimating)document.getElementById('startButton').click();}
 function previewGeometry(next){syncGeometryReadouts(next);window.qonticScaleOverlay?.previewHeight(next?.height??null);if(!next){histogram();drawDetection();return;}if(next.wall!==sourcePos||next.distance!==detectorDistance||next.height!==screenHeight)clearHitsForPreview();const preview={...p,wall:next.wall/100,screen:(next.wall+next.distance)/100},ymin=-next.height/200,ymax=next.height/200;const predicted=sourceProfile(preview,ymin,ymax,2049);histogram({profile:predicted,screenHeight:next.height/100});}
 function commitGeometry(next){if(next.distance===detectorDistance&&next.height===screenHeight&&next.wall===sourcePos)return;document.getElementById('source-position-group').setValueInFirstUnit(next.wall);document.getElementById('detector-distance-group').setValueInFirstUnit(next.distance);document.getElementById('screen-height-group').setValueInFirstUnit(next.height);setupGeo(false);reset=0;resetEngine();draw();}
 function previewWidth(value){const committed=p?.sy*100??+width.value;slitPreviewWidth=value;const shownWidth=value===null?committed:value;width.value=shownWidth;syncPacketInput(width);if(value!==null&&value!==committed)clearHitsForPreview();draw();if(value!==null){const preview={...p,sy:value/100},predicted=sourceProfile(preview,-yOffset,screenHeight/100-yOffset,2049);histogram({profile:predicted});drawDetection();}}
 function commitWidth(value){width.value=value;width.dispatchEvent(new Event('input',{bubbles:true}));}
 function previewSeparation(value){slitPreviewSeparation=value;document.getElementById('slit-separation-group')?.setValueInFirstUnit(value===null?slitSeparation:value);if(value!==null&&value!==slitSeparation)clearHitsForPreview();draw();if(value!==null){const preview={...p,centers:displayCenters()},predicted=sourceProfile(preview,-yOffset,screenHeight/100-yOffset,2049);histogram({profile:predicted});drawDetection();}}
 function commitSeparation(value){document.getElementById('slit-separation-group').setValueInFirstUnit(value);setupGeo(false);reset=0;resetEngine();draw();}
 function surfaceEditorState(){return {wall:sourcePos,distance:detectorDistance,height:screenHeight,wallMin:50,wallMax:1000,distanceMin:50,distanceMax:3000,heightMin:100,heightMax:5000,width:+width.value,minWidth:+width.min,maxWidth:dynamicWidthMax,extentSigma:+extent.value,separation:slitSeparation,maxSeparation:dynamicSeparationMax};}
 function configureSurfaceEditor(){surface3D?.configureEditor({getState:surfaceEditorState,pause:pauseForGeometry,resume:resumeAfterGeometry,preview(kind,value){if(['wall','distance','height'].includes(kind))previewGeometry(value);else if(kind==='width')previewWidth(value);else previewSeparation(value);},commit(kind,value){if(['wall','distance','height'].includes(kind))commitGeometry(value);else if(kind==='width')commitWidth(value);else commitSeparation(value);},cancel(kind){if(['wall','distance','height'].includes(kind))previewGeometry(null);else if(kind==='width')previewWidth(null);else previewSeparation(null);}});}
 const geometryControls=mountPacketGeometry({
  host:document.getElementById('canvas-container'),
  getGeometry(){if(!p)return null;const host=document.getElementById('canvas-container');return {wall:sourcePos,wallFraction:wallX/canvas.width,distance:detectorDistance,height:screenHeight,detectorFraction:detectorX/canvas.width,scaleX:toCanvasX*host.clientWidth/canvas.width,scaleY:toCanvasY*host.clientHeight/canvas.height,busy:window.qonticMWBranches?.busy};},
  onPreview:previewGeometry,onCommit:commitGeometry,pause:pauseForGeometry,resume:resumeAfterGeometry
 });

 const slitControls=mountSlitWidth({
  host:document.getElementById('canvas-container'),
  getState(){const host=document.getElementById('canvas-container');return {width:+width.value,minWidth:+width.min,maxWidth:dynamicWidthMax,extentSigma:displayExtentSigma(),centers:p?displayCenters().map(center=>Y(center)/canvas.height):[],wallFraction:wallX/canvas.width,scaleY:toCanvasY*host.clientHeight/canvas.height,busy:window.qonticMWBranches?.busy,visible:shown('plot_screen')};},
  onPreview:previewWidth,onCommit:commitWidth,pause:pauseForGeometry,resume:resumeAfterGeometry
 });
 const separationControls=mountSlitSeparation({
  host:document.getElementById('canvas-container'),
  getState(){const host=document.getElementById('canvas-container');return {separation:slitSeparation,maxSeparation:dynamicSeparationMax,open:[slit1Open,slit2Open],wallFraction:wallX/canvas.width,scaleY:toCanvasY*host.clientHeight/canvas.height,busy:window.qonticMWBranches?.busy,visible:shown('plot_screen')};},
  onPreview:previewSeparation,onCommit:commitSeparation,pause:pauseForGeometry,resume:resumeAfterGeometry
 });
 const geometryHost=document.getElementById('canvas-container');
 const toolbar=document.querySelector('#canvas-wrapper .qontic-media-toolbar');
 const editButton=document.createElement('button');editButton.type='button';editButton.className=toolbar.querySelector('button').className;
 editButton.setAttribute('aria-label','Edit geometry');editButton.setAttribute('aria-pressed','false');
 editButton.title='Edit geometry · right-click canvas. Drag handles to preview the predicted histogram; Escape exits.';
 editButton.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M15 5l4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15z"/></svg>';
 toolbar.insertBefore(editButton,toolbar.querySelector('[role=status]'));
 const surfaceButton=document.createElement('button');surfaceButton.type='button';surfaceButton.className=editButton.className;surfaceButton.setAttribute('aria-label','3D wave surface');
 surfaceButton.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 15 6-5 5 3 7-6v9l-7 5-5-3-6 4z"/><path d="M3 15v7m6-12v8m5-5v8m7-14v9"/></svg>';
 toolbar.insertBefore(surfaceButton,editButton);
 pwWaveButton=document.createElement('button');pwWaveButton.type='button';pwWaveButton.className=editButton.className;pwWaveButton.setAttribute('aria-label','Pilot-Wave field');
 pwWaveButton.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5z"/><circle cx="12" cy="12" r="2.4"/><path d="M3 20c3-3 5-3 8 0s5 3 10 0"/></svg>';
 toolbar.insertBefore(pwWaveButton,surfaceButton);
 pwWaveButton.addEventListener('click',()=>{pwWaveVisible=!pwWaveVisible;localStorage.setItem('qontic-pw-wave-visible',String(pwWaveVisible));syncPwWaveButton();draw();});
 function syncSurfaceView(){
  localStorage.setItem('qontic-double-slit-surface-view',String(surfaceView));geometryHost.classList.toggle('packet-surface-3d',surfaceView);
  surfaceButton.setAttribute('aria-pressed',String(surfaceView));surfaceButton.title=surfaceView?'Return to the flat 2D wave map':'Open the interactive 3D wave graph. Drag to rotate and use the wheel or pinch gesture to zoom.';
  surface3D?.setVisible(surfaceView);if(surfaceView)ensureSurface3D();
  editButton.disabled=false;geometryHost.dispatchEvent(new CustomEvent('qontic:surface-view',{detail:{active:surfaceView}}));
 }
 surfaceButton.addEventListener('click',()=>{if(geometryEditing)setGeometryEditing(false);surfaceView=!surfaceView;syncSurfaceView();draw();});
 function setGeometryEditing(next,restorePlayback=true){
  if(next===geometryEditing)return;
  if(next){if(window.qonticMWBranches?.busy)return;resumeAfterEditing=isAnimating;if(isAnimating)document.getElementById('startButton').click();geometryEditing=true;}
  else{geometryControls.cancel();slitControls.cancel();separationControls.cancel();surface3D?.cancelEditor();geometryEditing=false;}
  geometryHost.classList.toggle('editing-geometry',geometryEditing);editButton.setAttribute('aria-pressed',String(geometryEditing));draw();
  surface3D?.setEditing(surfaceView&&geometryEditing);
  if(!next){const running=resumeAfterEditing;resumeAfterEditing=false;if(restorePlayback&&running&&!isAnimating)document.getElementById('startButton').click();}
 }
 editButton.addEventListener('click',()=>setGeometryEditing(!geometryEditing));
 geometryHost.addEventListener('contextmenu',event=>{if(window.qonticMWBranches?.busy)return;event.preventDefault();setGeometryEditing(!geometryEditing);});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&geometryEditing){event.preventDefault();setGeometryEditing(false);}},true);
 // An explicit Start action leaves editing before transport resumes.
 document.getElementById('startButton').addEventListener('click',()=>{if(geometryEditing&&!isAnimating)setGeometryEditing(false,false);},true);
 new MutationObserver(()=>{if(geometryEditing&&isAnimating)setGeometryEditing(false,false);}).observe(document.getElementById('startButton'),{childList:true,subtree:true,characterData:true});
 syncSurfaceView();syncPwWaveButton();
 queueMicrotask(()=>{
  for(const id of ['sourceOption','particleRate','particleRate-input']){const el=document.getElementById(id);if(el){el.disabled=true;el.title='Not available for the Gaussian source-packet model';}}
  const origin=document.getElementById('sourceOption');origin.parentElement.classList.remove('bohmian-only');origin.parentElement.classList.add('packet-unused-row');origin.value='isotropic';origin.querySelector('option[value=isotropic]').textContent='Gaussian source';
  const label=document.querySelector('#MaxPart-group label');if(label)label.textContent='Particles / packet:';
  for(const value of ['photon']){const el=document.querySelector('#particleType option[value='+value+']');if(el)el.remove();}
  syncSlowPacketMode();
  if(particleType==='photon'){particleType='electron';$('#particleType').val('electron');}
  document.querySelector('#waveFunctionOption option[value=Phase]').textContent='Phase (cos θ)';if(!$('#waveFunctionOption').val())$('#waveFunctionOption').val('Psi2');
  const species=document.createElement('div');species.className='input-group packet-species packet-core-options';species.append(document.getElementById('particleType'),directedRow,slitColorRow);document.getElementById('experiment-bar').after(species);
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
  hits=record;slitHits={upper:Array(p.bins).fill(0),lower:Array(p.bins).fill(0)};spectrumHitCounts=Array(p.bins).fill(0);spectrumHitSums=Array(p.bins).fill(0);hitMax=Math.max(...hits);detectorFlashes.clear();flash=null;draw();
 }
 return {sampleBranch,syncBranching(){ensure();draw();},setWhichPath(){resetEngine();draw();},get viewportWidth(){return (sourcePos+detectorDistance)/.7;},get enabled(){return true;},reset:resetEngine,draw,drawWave,drawParticles,histogram,frame,updateMath,hash,pause(){last=null;if(packetAnimationId!==null)cancelAnimationFrame(packetAnimationId);packetAnimationId=null;}};
}
