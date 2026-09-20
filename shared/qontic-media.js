// Optional shared presentation tools. Models supply canvas layers and playback hooks.
export function mountQonticMedia({stage, controls, getCanvases, beginRecording = () => {}, endRecording = () => {}, filename = 'qontic-simulation', getShareUrl = () => location.href, onRecord = null, headerTools = false, scaleControl = null, rangeControl = null}) {
  if (!document.querySelector('link[data-qontic-media]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = new URL('./qontic-media.css?v=header-20260916', import.meta.url);
    link.dataset.qonticMedia = ''; document.head.append(link);
  }
  const toolbar = document.createElement('div'); toolbar.className = 'qontic-media-toolbar';
  toolbar.setAttribute('role','group'); toolbar.setAttribute('aria-label','Simulation tools');
  const icons = {
    range:'<path d="M7 3v18M17 3v18M3 8h8m2 8h8"/><circle cx="7" cy="8" r="2"/><circle cx="17" cy="16" r="2"/>',
    ruler:'<path d="M3 7h18v10H3zM7 7v5m4-5v3m4-3v5m4-5v3"/>',
    expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    restore:'<path d="M3 8h5V3m8 0v5h5M8 21v-5H3m13 5v-5h5"/>',
    record:'<rect x="3" y="5" width="13" height="14" rx="3"/><path d="m16 10 5-3v10l-5-3"/>',
    screenshot:'<path d="M8 5 10 3h4l2 2h4a1 1 0 0 1 1 1v13H3V6a1 1 0 0 1 1-1Z"/><circle cx="12" cy="12" r="4"/>',
    share:'<path d="m10 13 4-4m-5 7-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m0 10a4 4 0 0 0 6 0l4-4a4 4 0 0 0-6-6l-1 1"/>',
    check:'<path d="m5 12 4 4L19 6"/>'
  };
  const setAction = (button, icon, name, description = name) => {
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+icons[icon]+'</svg>';
    button.setAttribute('aria-label',name); button.dataset.tooltip=description;
  };
  const action = (icon,name,description) => {
    const button=document.createElement('button');button.type='button';button.className='qontic-media-action';
    setAction(button,icon,name,description);toolbar.append(button);return button;
  };
  const screenshot=action('screenshot','Screenshot','Save simulation as a PNG image');
  const share=action('share','Share link','Copy a link to this simulation');
  const expand=action('expand','Expand','Expand simulation · Esc to restore');
  const record=action('record','Record video','Record a video of the simulation');
  screenshot.after(record);
  let scaleButton;
  const syncScale = () => {if(scaleButton){const shown=scaleControl.getVisible();scaleButton.setAttribute('aria-pressed',String(shown));setAction(scaleButton,'ruler','Distance scale',shown?'Hide distance scale':'Show distance scale');}};
  if(scaleControl){scaleButton=action('ruler','Distance scale','Show or hide distance scale');scaleButton.addEventListener('click',()=>{scaleControl.setVisible(!scaleControl.getVisible());syncScale();});syncScale();}

  let rangeButton;
  const syncRange=()=>{if(rangeButton){const shown=rangeControl.getVisible();rangeButton.setAttribute('aria-pressed',String(shown));setAction(rangeButton,'range','Wave range',shown?'Hide wave range':'Show wave range');}};
  if(rangeControl){rangeButton=action('range','Wave range','Show or hide wave range');rangeButton.addEventListener('click',()=>{rangeControl.setVisible(!rangeControl.getVisible());syncRange();});syncRange();}
  expand.setAttribute('aria-expanded','false');
  const notice=document.createElement('span');notice.className='qontic-media-status';
  notice.setAttribute('role','status');toolbar.append(notice);
  screenshot.addEventListener('click',()=>{
    try {
      const layers=getCanvases().filter(c=>c.getBoundingClientRect().width>0 && c.getBoundingClientRect().height>0);
      if(!layers.length)throw new Error('Open the simulation first.');
      const rects=layers.map(c=>c.getBoundingClientRect());
      const x=Math.min(...rects.map(r=>r.left)),y=Math.min(...rects.map(r=>r.top));
      const w=Math.max(...rects.map(r=>r.right))-x,h=Math.max(...rects.map(r=>r.bottom))-y;
      const scale=layers[0].width/rects[0].width,output=document.createElement('canvas');
      output.width=Math.round(w*scale);output.height=Math.round(h*scale);
      const ctx=output.getContext('2d');ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--bg-primary').trim()||'#0f172a';
      ctx.fillRect(0,0,output.width,output.height);
      layers.forEach((c,i)=>{const r=rects[i];ctx.drawImage(c,(r.left-x)*scale,(r.top-y)*scale,r.width*scale,r.height*scale);});
      const link=document.createElement('a');link.download=filename+'-'+Date.now()+'.png';link.href=output.toDataURL('image/png');link.click();
      notice.textContent='Screenshot saved.';
    }catch(error){notice.textContent='Screenshot failed: '+error.message;}
  });
  share.addEventListener('click',async()=>{
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setAction(share,'check','Link copied','Link copied');notice.textContent='Link copied.';
      setTimeout(()=>setAction(share,'share','Share link','Copy a link to this simulation'),1800);
    }catch(error){notice.textContent='Could not copy the link. Please use the address bar.';}
  });
  // Opt-in header placement keeps existing media consumers unchanged.
  const titleRow = headerTools && stage.closest('.shell')?.querySelector('.qontic-title-row');
  if (titleRow) {
    titleRow.classList.add('qontic-title-with-tools');
    let tools = titleRow.querySelector('.qontic-header-tools');
    if (!tools) {
      tools = document.createElement('div'); tools.className = 'qontic-header-tools';
      const tabs = titleRow.querySelector('.qontic-view-tabs');
      titleRow.append(tools);
      if (tabs) tools.append(tabs);
    }
    tools.append(toolbar);
  } else stage.prepend(toolbar);
  const toolbarHome = document.createComment('Simulation tools position');
  toolbar.before(toolbarHome);
  const expanded = document.createElement('dialog'); expanded.className = 'qontic-expanded-dialog';
  expanded.setAttribute('aria-label', 'Expanded simulation'); document.body.append(expanded);
  let home, controlHome, attributes;
  const setExpanded = value => {
    if (value === expanded.open) return;
    if (value) {
      home = document.createComment('Simulation position'); stage.replaceWith(home);
      if (controls) {
        controlHome = document.createComment('Playback position'); controls.replaceWith(controlHome);
        attributes = ['show-tabs','show-interpretation'].map(name => [name,controls.getAttribute(name)]);
        controls.setAttribute('show-tabs','false'); controls.setAttribute('show-interpretation','false');
        expanded.append(controls);
      }
      if (titleRow) stage.prepend(toolbar);
      expanded.append(stage); expanded.showModal();
    } else {
      expanded.close(); home.replaceWith(stage);
      if (titleRow) toolbarHome.after(toolbar);
      if (controls) {
        controlHome.replaceWith(controls);
        for (const [name, value] of attributes) value === null ? controls.removeAttribute(name) : controls.setAttribute(name,value);
      }
    }
    setAction(expand,value?'restore':'expand',value?'Restore view':'Expand',value?'Restore normal view · Esc':'Expand simulation · Esc to restore');
    expand.setAttribute('aria-expanded', String(value)); expand.focus();
    window.dispatchEvent(new Event('resize'));
  };
  expand.addEventListener('click', () => setExpanded(!expanded.open));
  expanded.addEventListener('cancel', event => { event.preventDefault(); setExpanded(false); });
  const dialog = document.createElement('dialog'); dialog.className = 'qontic-record-dialog';
  dialog.setAttribute('aria-label','Record video');
  dialog.innerHTML = `<div class="qontic-record-heading"><h2>Record video</h2><button type="button" data-close aria-label="Close recording settings">✕</button></div>
    <label>Resolution<select data-size><option value="1280">1280 px wide</option><option value="1920">1920 px wide</option></select></label>
    <label>Length (seconds)<input data-duration type="number" min="1" max="120" step="1" value="10"></label>
    <p>Records the current simulation as it runs, up to 30 fps. Controls stay out of the video. Keep this tab visible while recording.</p>
    <button type="button" data-start>Start recording</button>
    <progress hidden max="1" value="0" aria-label="Recording progress"></progress>
    <p role="status" aria-live="polite"></p><video controls hidden aria-label="Recorded simulation preview"></video><a hidden data-download>Save video</a>`;
  document.body.append(dialog);
  const start = dialog.querySelector('[data-start]'), status = dialog.querySelector('[role=status]');
  const duration = dialog.querySelector('[data-duration]'), size = dialog.querySelector('[data-size]');
  const progress = dialog.querySelector('progress'), download = dialog.querySelector('a'), preview = dialog.querySelector('video');
  const supported = typeof MediaRecorder !== 'undefined' && typeof HTMLCanvasElement.prototype.captureStream === 'function';
  let recorder, stream, frame, timeout, url, token, captureCanvas, recording = false;
  const stop = () => { if (recording && recorder?.state === 'recording') recorder.stop(); };
  const close = () => { stop(); dialog.close(); };
  record.addEventListener('click', () => { if (onRecord) { onRecord(); return; } dialog.showModal(); if (!supported) status.textContent = 'Video recording is unavailable in this browser.'; });
  dialog.querySelector('[data-close]').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); event.stopPropagation(); close(); });
  dialog.addEventListener('keydown', event => event.stopPropagation());
  start.disabled = !supported;
  const cleanup = () => {
    cancelAnimationFrame(frame); clearTimeout(timeout); stream?.getTracks().forEach(track => track.stop()); captureCanvas?.remove();
    if (recording) endRecording(token);
    recording = false; setAction(record,'record','Record video','Record a video of the simulation'); record.classList.remove('is-recording'); start.textContent = 'Start recording';
    start.disabled = !supported; duration.disabled = size.disabled = false; progress.hidden = true;
  };
  start.addEventListener('click', async () => {
    if (recording) { stop(); return; }
    if (!duration.reportValidity()) return;
    try {
      const layers = getCanvases().filter(canvas => {const r=canvas.getBoundingClientRect();return r.width>0 && r.height>0;});
      if (!layers.length) throw new Error('Open the simulation view before recording.');
      const bounds = layers.map(c => c.getBoundingClientRect());
      const left = Math.min(...bounds.map(r=>r.left)), top = Math.min(...bounds.map(r=>r.top));
      const width = Math.max(...bounds.map(r=>r.right))-left, height = Math.max(...bounds.map(r=>r.bottom))-top;
      const output = document.createElement('canvas'); captureCanvas = output; output.style.cssText = 'display:block;width:100%;max-height:220px;object-fit:contain;margin-top:8px'; preview.before(output); output.width = +size.value;
      output.height = Math.max(2, 2*Math.round(output.width*height/width/2));
      const ctx = output.getContext('2d');
      const draw = () => {
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-primary').trim() || '#0f172a';
        ctx.fillRect(0,0,output.width,output.height);
        layers.forEach((canvas,i) => { const r=bounds[i];ctx.drawImage(canvas,(r.left-left)*output.width/width,(r.top-top)*output.height/height,r.width*output.width/width,r.height*output.height/height); });
      };
      draw(); stream = output.captureStream(0); const captureTrack = stream.getVideoTracks()[0];
      const mimeType = ['video/webm;codecs=vp8','video/webm;codecs=vp9','video/webm','video/mp4'].find(type=>MediaRecorder.isTypeSupported(type));
      if (!mimeType) throw new Error('No supported video format is available.');
      recorder = new MediaRecorder(stream,{mimeType,videoBitsPerSecond:6000000});
      const chunks=[];
      recorder.ondataavailable = event => { if(event.data.size) chunks.push(event.data); };
      recorder.onstop = () => {
        cleanup();
        if (chunks.reduce((sum,chunk)=>sum+chunk.size,0)<256) {status.textContent='No video frames were recorded. Please try again.';return;}
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(new Blob(chunks,{type:mimeType}));
        download.href = preview.src = url;
        download.download = filename + '-' + new Date().toISOString().replace(/[:.]/g,'-') + (mimeType.includes('mp4')?'.mp4':'.webm');
        download.hidden = preview.hidden = false;
        status.textContent = 'Ready — preview or save your video.';
      };
      recorder.onerror = event => { cleanup(); status.textContent = 'Recording failed: ' + (event.error?.message || 'browser error'); };
      token = await beginRecording(); recording = true;
      size.disabled = duration.disabled = true; download.hidden = preview.hidden = true;
      progress.hidden = false; progress.value = 0; start.textContent = 'Stop and save'; setAction(record,'record','Recording video','Recording in progress'); record.classList.add('is-recording');
      status.textContent = 'Recording the live simulation…';
      const began=performance.now(), length=Number(duration.value)*1000;
      let last=0;
      const tick = now => {if(!recording)return;if(now-last>=1000/30){draw();captureTrack.requestFrame();last=now;progress.value=Math.min(1,(now-began)/length);}frame=requestAnimationFrame(tick);};
      recorder.start(); draw(); captureTrack.requestFrame(); frame=requestAnimationFrame(tick); timeout=setTimeout(stop,length);
    } catch(error) { cleanup(); status.textContent = 'Recording failed: ' + error.message; }
  });
  window.addEventListener('pagehide',()=>{stop();if(url)URL.revokeObjectURL(url);});
  return {setExpanded, stopRecording:stop, syncScale, syncRange};
}
