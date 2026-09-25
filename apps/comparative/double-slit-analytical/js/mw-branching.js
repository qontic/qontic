import {drawBinPulse,DETECTOR_PULSE_SECONDS} from './detector-pulse.js?v=59';
// Count active branch-view time only; pausing does not consume the interval.
export function createBranchDwellClock(now=()=>performance.now()) {
  let elapsed=0,last=null;
  return {
    reset(){elapsed=0;last=null;},
    pause(){last=null;},
    tick(running){if(!running){last=null;return elapsed;}const current=now();if(last!==null)elapsed+=Math.max(0,current-last);last=current;return elapsed;}
  };
}
// A visual tour of detector records, not propagation of separate world wavefunctions.
export function mountMWBranching({host,controls,isMW,isRunning}) {
  const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./mw-branching.css?v=85',import.meta.url);document.head.append(style);
  const settings=document.createElement('div');settings.className='mw-branch-settings';
  settings.innerHTML=`<label><input type="checkbox" id="mw-branch-tour"> Slow-motion branching</label><div class="mw-follow mw-choice-row" hidden><select aria-label="Branch selection" title="Random follows Born probabilities; Manual lets you choose."><option value="auto">Random</option><option value="manual">Manual</option></select><label class="mw-probability" title="Show branch probabilities"><input type="checkbox" id="mw-show-probabilities"> Prob.</label></div><label class="mw-follow mw-dwell-control" hidden><span>Time in branch</span><input id="mw-branch-dwell" type="range" min="1" max="5" step="0.1" value="1" aria-label="Time in branch"><output for="mw-branch-dwell">1.0 s</output></label><small class="mw-follow" hidden>One view per detector pixel. Try 10–20 pixels in Advanced for larger views.</small>`;
  controls.append(settings);
  const enabled=settings.querySelector('input'),mode=settings.querySelector('select');
  const overlay=document.createElement('div');overlay.className='mw-branch-overlay';overlay.hidden=true;
  overlay.innerHTML='<div class="mw-branch-status" role="status"></div><div class="mw-branch-scroll"><div class="mw-branch-grid"></div></div><canvas class="mw-branch-zoom"></canvas>';
  host.append(overlay);
  const status=overlay.querySelector('[role=status]'),scroll=overlay.querySelector('.mw-branch-scroll'),grid=overlay.querySelector('.mw-branch-grid'),zoom=overlay.querySelector('.mw-branch-zoom');
  const dwell=settings.querySelector('#mw-branch-dwell'),dwellOutput=settings.querySelector('output');
  const dwellClock=createBranchDwellClock();
  dwell.addEventListener('input',()=>{dwellOutput.textContent=Number(dwell.value).toFixed(1)+' s';dwell.setAttribute('aria-valuetext',dwellOutput.textContent);dwellClock.reset();});
  let active=null;
  const showProbabilities=settings.querySelector("#mw-show-probabilities");
  showProbabilities.addEventListener("change",()=>active?.layout?.());
  const cancel=()=>{dwellClock.reset();if(!active)return;cancelAnimationFrame(active.frame);active=null;overlay.hidden=true;grid.replaceChildren();zoom.hidden=true;};
  const sync=()=>{if(!isRunning())dwellClock.pause();settings.hidden=!isMW();settings.querySelectorAll('.mw-follow').forEach(el=>el.hidden=!enabled.checked);if(!isMW()||!enabled.checked)cancel();if(window.qonticPacketEngine?.enabled)settings.querySelector('.mw-dwell-control').hidden=true;};
  enabled.addEventListener('change',()=>{dwellClock.reset();sync();window.qonticPacketEngine?.syncBranching();});mode.addEventListener('change',cancel);
  // Cancel before existing input handlers can replace geometry or the record.
  for(const type of ['input','change']) document.addEventListener(type,event=>{
    if(['MaxPart','MaxPart-input','MaxPart-units'].includes(event.target.id))return;
    if(active&&!settings.contains(event.target)&&!overlay.contains(event.target))cancel();
  },true);
  for(const id of ['resetBranches']) document.getElementById(id)?.addEventListener('click',cancel,true);
  // Mode switches can originate in several existing controls.
  const observer=new MutationObserver(sync);observer.observe(document.getElementById('sharedControls'),{attributes:true,attributeFilter:['interpretation','running']});sync();
  const begin=({selected,weights,detectorFraction,sensorFraction=.01,sensorColor='#90ee90',createRecord,captureFrame=null,recordFull=false,projectOutcome=null,onSplit,onSelect})=>{
    if(active||!enabled.checked||!isMW())return false;
    const snapshot=document.createElement('canvas');snapshot.width=host.clientWidth;snapshot.height=host.clientHeight;
    const ctx=snapshot.getContext('2d');
    const layers=['waveCanvas','setupCanvas','partCanvas'].map(id=>document.getElementById(id));
    const updateSharedFrame=(includeIncomingWave=true)=>{ctx.clearRect(0,0,snapshot.width,snapshot.height);if(captureFrame){captureFrame(ctx,snapshot.width,snapshot.height,includeIncomingWave);return;}if(!includeIncomingWave){ctx.fillStyle='#344f63';ctx.fillRect(0,0,snapshot.width,snapshot.height);}for(const layer of layers)if(includeIncomingWave||layer.id!=='waveCanvas')ctx.drawImage(layer,0,0,snapshot.width,snapshot.height);};
    updateSharedFrame();
    overlay.hidden=false;status.style.opacity='1';zoom.hidden=true;scroll.hidden=false;scroll.style.visibility='';scroll.scrollTop=0;grid.replaceChildren();
    const count=weights.length,aspect=snapshot.width/snapshot.height;
    // Prefer complete, near-square grids (25 -> 5x5, 500 -> 25x20).
    // For prime counts use the smallest near-square rectangle.
    let columns=Math.ceil(Math.sqrt(count));
    for(let divisor=Math.floor(Math.sqrt(count));divisor>=1;divisor--){
      if(count%divisor===0 && count/divisor<=2*divisor){columns=count/divisor;break;}
    }
    const rows=Math.ceil(count/columns),gap=5;
    // Fill both dimensions; camera entry restores the full-view proportions.
    const labelTexts=weights.map((weight,index)=>`${index+1} · ${(100*weight).toPrecision(3)}%`);
    ctx.font='10px Inter,Arial,sans-serif';
    const minimumLabelWidth=Math.max(80,...labelTexts.map(text=>ctx.measureText(text).width+12));
    let displayLabels=false;
    const sizeGrid=()=>{
      const width=Math.max(1,scroll.clientWidth-10),height=Math.max(1,scroll.clientHeight-10);
      const tileWidth=(width-gap*(columns-1))/columns-2;
      const tileHeight=(height-gap*(rows-1))/rows-2;
      displayLabels=showProbabilities.checked && tileWidth>=minimumLabelWidth && tileHeight>=55;
      grid.style.width='calc(100% - 10px)';
      grid.style.height='calc(100% - 10px)';
      grid.style.gridTemplateColumns=`repeat(${columns},minmax(0,1fr))`;
      grid.style.gridTemplateRows=`repeat(${rows},minmax(0,1fr))`;
    };
    sizeGrid();
    active={frame:0,elapsed:0,last:performance.now(),selected:null,splitTime:0,splitDone:false,zoomTime:0,buttons:[],miniatures:[],snapshot};
    const session=active;
    const choose=index=>{
      if(active!==session||!session.splitDone||session.selected!==null||!isRunning()||weights[index]<=0)return;
      session.selected=index;session.zoomTime=0;
      const tile=session.buttons[index];tile.scrollIntoView({block:'nearest',inline:'nearest'});
      const h=overlay.getBoundingClientRect();
      session.tiles=session.buttons.map(button=>{
        const r=button.querySelector('canvas').getBoundingClientRect();
        return {x:r.left-h.left,y:r.top-h.top,w:r.width,h:r.height,label:button.querySelector('span').textContent};
      });
      session.from=session.tiles[index];
      tile.setAttribute('aria-current','true');
      zoom.width=snapshot.width;zoom.height=snapshot.height;zoom.hidden=false;
      status.textContent=`Selected pixel ${index+1} · entering this branch`;
      renderCamera(0);
      scroll.hidden=true;
    };
    // Relative Born weights retain contrast even with hundreds of pixels.
    const peakWeight=Math.max(...weights,Number.EPSILON);
    const opacities=weights.map(weight=>0.2+0.8*Math.max(0,weight)/peakWeight);
    const records=weights.map((_,index)=>createRecord(index));
    onSplit();
    // Detection has already split the state. Do not keep showing the obsolete incoming packet in branch canvases.
    updateSharedFrame(false);
    const paint=(target,index,w,h,source=snapshot,highlight=true,opacity=opacities[index],markerScaleX=1,markerScaleY=markerScaleX,markerRadius=3)=>{
      target.clearRect(0,0,w,h);
      target.drawImage(source,0,0,w,h);
      const x=detectorFraction*w,y=(index+.5)/count*h;
      if(recordFull)target.drawImage(records[index],0,0,w,h);else target.drawImage(records[index],x,0,w-x,h);
      if(highlight&&!projectOutcome&&session.splitTime<DETECTOR_PULSE_SECONDS*1000){
        drawBinPulse(target,{x,y:index/count*h,width:Math.max(1,sensorFraction*w),height:Math.max(1,h/count),color:sensorColor,strength:1-session.splitTime/(1000*DETECTOR_PULSE_SECONDS)});
      }
      // Composite the entire system uniformly against the stage background.
      // Applying alpha separately to wave and detector layers would bleed through.
      target.save();target.globalAlpha=1-opacity;target.fillStyle='#0b1725';
      target.fillRect(0,0,w,h);target.restore();
      // Keep the outcome identifiable even after the brief bin pulse ends.
      // Draw above the probability shading so rare branches remain readable.
      if(highlight){
        const radius=markerRadius;
        const projected=projectOutcome?.(index,count,w,h),markerX=Math.max(radius+1,Math.min(w-radius-1,projected?.x??x+Math.max(1,sensorFraction*w)/2));
        const markerY=Math.max(radius+1,Math.min(h-radius-1,projected?.y??y));
        // The branch camera scales the subcanvas, but this outcome marker is
        // a screen-space annotation: keep its diameter constant during zoom.
        target.save();target.translate(markerX,markerY);
        target.scale(1/Math.max(Number.EPSILON,markerScaleX),1/Math.max(Number.EPSILON,markerScaleY));
        target.beginPath();target.arc(0,0,radius,0,2*Math.PI);
        target.fillStyle='#ffe66b';target.fill();target.lineWidth=1.5;
        target.strokeStyle='#172332';target.stroke();
        target.beginPath();target.arc(0,0,radius+1,0,2*Math.PI);
        target.lineWidth=.75;target.strokeStyle='#fff7cf';target.stroke();target.restore();
      }
    };
    // A single camera transform moves every branch together. The selected
    // system fills the viewport while its neighbors pass beyond the edges.
    const renderCamera=progress=>{
      const z=zoom.getContext('2d'),r=session.from;
      const ease=progress*progress*(3-2*progress);
      // Clear the topmost detector pixel as we enter the selected world.
      status.style.opacity=String(Math.max(0,1-progress*4));
      const scaleX=Math.exp(Math.log(zoom.width/r.w)*ease);
      const scaleY=Math.exp(Math.log(zoom.height/r.h)*ease);
      const cx=r.x+r.w/2,cy=r.y+r.h/2;
      const tx=cx+(zoom.width/2-cx)*ease-scaleX*cx;
      const ty=cy+(zoom.height/2-cy)*ease-scaleY*cy;
      z.fillStyle='#0b1725';z.fillRect(0,0,zoom.width,zoom.height);
      z.save();z.translate(tx,ty);z.scale(scaleX,scaleY);
      session.tiles.forEach((tile,index)=>{
        const {x,y,w,h,label}=tile;
        if(tx+(x+w)*scaleX<0||tx+x*scaleX>zoom.width||ty+(y+h+18)*scaleY<0||ty+y*scaleY>zoom.height)return;
        z.save();z.translate(x,y);paint(z,index,w,h,snapshot,progress<1,opacities[index]+(index===session.selected?(1-opacities[index])*ease:0),scaleX,scaleY);
        z.fillStyle=index===session.selected?'rgba(85,216,230,'+(.18*(1-ease))+')':'rgba(4,14,24,.22)';
        z.fillRect(0,0,w,h);
        if(displayLabels && w>=minimumLabelWidth){
          z.fillStyle='#142737';z.fillRect(0,h,w,16);
          z.fillStyle='#e9faff';z.font='10px Inter,Arial,sans-serif';z.textAlign='center';z.fillText(label,w/2,h+12);
        }
        z.strokeStyle=index===session.selected?'#7cf2ff':'#496577';z.lineWidth=index===session.selected?2:1;
        z.strokeRect(-1,-1,w+2,h+(displayLabels?18:2));z.restore();
      });
      z.restore();
    };
    const miniatureMarkerRadius=miniature=>{
      const cssWidth=miniature.getBoundingClientRect().width;
      const fallback=Math.max(1,(grid.clientWidth-gap*(columns-1))/columns-2);
      return 3*miniature.width/Math.max(1,cssWidth||fallback);
    };
    weights.forEach((weight,index)=>{
      const button=document.createElement('button');button.type='button';button.className='mw-branch-tile';
      const percent=(100*weight).toPrecision(3)+'%';button.setAttribute('aria-label',`Follow pixel ${index+1}, weight ${percent}`);button.title=`Pixel ${index+1} · Born weight ${percent}`;
      button.disabled=true;
      const miniature=document.createElement('canvas');miniature.width=192;miniature.height=Math.round(192/aspect);
      const label=document.createElement('span');label.textContent=labelTexts[index];label.hidden=!displayLabels;button.append(miniature,label);button.addEventListener('click',()=>choose(index));grid.append(button);
      paint(miniature.getContext('2d'),index,miniature.width,miniature.height,snapshot,true,opacities[index],1,1,miniatureMarkerRadius(miniature));
      session.buttons.push(button);session.miniatures.push(miniature);
    });
    // Capture the destination layout before hiding its interactive DOM layer.
    let destinations=[];
    const captureDestinations=()=>{
      const bounds=overlay.getBoundingClientRect();
      destinations=session.miniatures.map((miniature,index)=>{
        const r=miniature.getBoundingClientRect();
        paint(miniature.getContext('2d'),index,miniature.width,miniature.height,snapshot,true,opacities[index],1,1,miniatureMarkerRadius(miniature));
        return {x:r.left-bounds.left,y:r.top-bounds.top,w:r.width,h:r.height};
      });
    };
    session.layout=()=>{
      if(session.selected!==null)return;
      sizeGrid();
      session.buttons.forEach(button=>button.querySelector('span').hidden=!displayLabels);
      captureDestinations();
    };
    captureDestinations();
    zoom.width=snapshot.width;zoom.height=snapshot.height;zoom.hidden=false;
    scroll.style.visibility='hidden';
    const splitDuration=1250;
    const renderSplit=elapsed=>{
      const z=zoom.getContext('2d'),W=zoom.width,H=zoom.height;
      const depthProgress=Math.min(1,elapsed/350);
      const spread=Math.max(0,Math.min(1,(elapsed-350)/900));
      const ease=spread*spread*(3-2*spread);
      z.fillStyle='#0b1725';z.fillRect(0,0,W,H);
      // A few visible layers convey the initial stack without painting hundreds
      // of fully occluded full-size copies. Every outcome fans out into its tile.
      const stride=spread===0?Math.max(1,Math.ceil(count/12)):1;
      for(let index=count-1;index>=0;index-=stride){
        const depth=count>1?index/(count-1):0,d=destinations[index];
        const stackScale=1+(0.42/(1+depth*1.3)-1)*depthProgress;
        const sw=W*stackScale,sh=H*stackScale;
        const sx=(W-sw)/2+depth*24*depthProgress,sy=(H-sh)/2-depth*18*depthProgress;
        const x=sx+(d.x-sx)*ease,y=sy+(d.y-sy)*ease,w=sw+(d.w-sw)*ease,h=sh+(d.h-sh)*ease;
        if(x>W||y>H||x+w<0||y+h<0)continue;
        z.save();z.translate(x,y);
        // Each copy already carries its own fired pixel from its first frame.
        paint(z,index,w,h,w<240?thumbnail:snapshot);
        z.strokeStyle='rgba(124,242,255,'+(0.65*(1-spread)+0.25)+')';z.lineWidth=1.5;z.strokeRect(0,0,w,h);
        if(spread>.75 && displayLabels && w>=minimumLabelWidth){
          z.globalAlpha=(spread-.75)/.25;
          z.fillStyle='#142737';z.fillRect(0,h,w,16);
          z.fillStyle='#e9faff';z.font='10px Inter,Arial,sans-serif';z.textAlign='center';
          z.fillText(labelTexts[index],w/2,h+12);
        }
        z.restore();
      }
      status.style.opacity=String(Math.min(1,spread*2));
    };
    // Render the physics once, then reuse one downsampled live frame for every tile.
    // The full-resolution shared frame also drives the camera zoom.
    const thumbnail=document.createElement('canvas');thumbnail.width=192;thumbnail.height=Math.round(192/aspect);
    const thumbnailCtx=thumbnail.getContext('2d');
    thumbnailCtx.drawImage(snapshot,0,0,thumbnail.width,thumbnail.height);
    renderSplit(0);
    session.refresh=()=>{
      if(active!==session||!isRunning())return;
      updateSharedFrame(false);
      if(session.selected!==null)return;
      thumbnailCtx.clearRect(0,0,thumbnail.width,thumbnail.height);
      thumbnailCtx.drawImage(snapshot,0,0,thumbnail.width,thumbnail.height);
      session.miniatures.forEach((miniature,index)=>paint(miniature.getContext('2d'),index,miniature.width,miniature.height,thumbnail,true,opacities[index],1,1,miniatureMarkerRadius(miniature)));
    };
    const tick=now=>{
      if(active!==session)return;
      if(!isMW()||!enabled.checked){cancel();return;}
      const dt=Math.min(100,now-session.last);session.last=now;
      if(isRunning()){
        if(!session.splitDone){
          session.splitTime+=dt;
          renderSplit(session.splitTime);
          status.textContent='Detection · outcome branches separating';
          if(session.splitTime>=splitDuration){
            session.splitDone=true;session.elapsed=0;zoom.hidden=true;
            scroll.style.visibility='';status.style.opacity='1';
            session.buttons.forEach((button,index)=>button.disabled=mode.value!=='manual'||weights[index]<=0);
          }
        }else if(session.selected===null){
          session.elapsed+=dt;
          status.textContent=mode.value==='manual'?`${count} outcome branches · choose a pixel to follow`:`${count} outcome branches · following one by Born weight…`;
          if(mode.value==='auto'&&session.elapsed>=1000)choose(selected);
        }else{
          session.zoomTime+=dt;
          // Let the selection register before moving the camera.
          const progress=Math.max(0,Math.min(1,(session.zoomTime-350)/1200));
          renderCamera(progress);
          status.textContent=`Following pixel ${session.selected+1} · other branches continue`;
          if(session.zoomTime>=2000){const index=session.selected;cancel();onSelect(index);return;}
        }
      }else status.textContent='Paused · press Start to continue branching';
      session.frame=requestAnimationFrame(tick);
    };
    session.frame=requestAnimationFrame(tick);return true;
  };
  return {refreshFrame(){active?.refresh?.();},ready(){return dwellClock.tick(isRunning())>=Number(dwell.value)*1000;},get enabled(){return enabled.checked&&isMW();},get busy(){return !!active;},begin,cancel};
}
