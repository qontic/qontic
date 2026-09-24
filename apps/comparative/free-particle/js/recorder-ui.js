'use strict';

function fpCreateVideoSnapshot(start = 'beginning') {
  if (!['beginning', 'current'].includes(start)) throw new Error('Choose where the recording should begin.');
  if (!['pilotwave', 'collapse'].includes(fp.interpMode)) throw new Error('Choose Pilot-Wave or Collapse before recording.');
  const entries = [['wave', 'fpWaveCanvas'], ['y', 'fpYProjCanvas'], ['prob', 'fpProbCanvas']];
  const areas = entries.map(([name, id]) => ({ name, canvas: document.getElementById(id),
    rect: document.getElementById(id).getBoundingClientRect() }));
  if (areas.some(({ rect }) => rect.width <= 0 || rect.height <= 0)) throw new Error('Open the simulation view before recording.');
  const left = Math.min(...areas.map(a => a.rect.left)), top = Math.min(...areas.map(a => a.rect.top));
  const layout = { width: Math.max(...areas.map(a => a.rect.right)) - left,
    height: Math.max(...areas.map(a => a.rect.bottom)) - top };
  const sizes = {};
  for (const { name, canvas, rect } of areas) {
    layout[name] = { x: rect.left - left, y: rect.top - top, width: rect.width, height: rect.height };
    sizes[name] = { width: canvas.width / fpRenderScale, height: canvas.height / fpRenderScale };
  }
  const transient = new Set(['_waveOff', '_waveOffCtx', '_collapseVisual']);
  const state = structuredClone(Object.fromEntries(Object.entries(fp).filter(([key]) => !transient.has(key))));
  state.running = false;
  state.animId = null;
  state._lastFrameTime_ms = null;
  return { state, layout, sizes, start, seed: crypto.getRandomValues(new Uint32Array(1))[0] };
}

function fpInitRecorder() {
  const $ = id => document.getElementById(id);
  const dialog = $('fp-record-dialog'), openButton = $('fp-btn-record'), renderButton = $('fp-record-render');
  const status = $('fp-record-status'), progress = $('fp-record-progress'), download = $('fp-record-download');
  let job = null, downloadURL = null;
  const supported = typeof VideoEncoder !== 'undefined';
  const syncMode = () => { openButton.hidden = fp.interpMode === 'manyworlds'; };
  const syncSizes = () => {
    if (job || fp.interpMode === 'manyworlds') return;
    const { layout } = fpCreateVideoSnapshot('current');
    for (const option of $('fp-record-size').options) {
      const width = Number(option.value);
      const height = Math.max(2, 2 * Math.round(width * layout.height / layout.width / 2));
      option.textContent = `${width === 2560 ? '2K · ' : ''}${width} × ${height}`;
    }
  };
  const syncButton = () => {
    renderButton.textContent = job ? 'Cancel render' : 'Render video · 30 fps';
    renderButton.disabled = !supported;
    openButton.classList.toggle('recording', Boolean(job));
    if (!job) openButton.textContent = '● Record video';
    if (!supported) status.textContent = 'Open in Chrome or Edge to render video.';
  };
  openButton.addEventListener('click', () => {
    syncSizes();
    if (!dialog.open) dialog.showModal();
  });
  $('fp-record-close').addEventListener('click', () => dialog.close());
  // Escape closes the settings dialog without also restoring the expanded view.
  dialog.addEventListener('keydown', e => { if (e.key === 'Escape') e.stopPropagation(); });
  document.querySelectorAll('input[name="fp-interp"]').forEach(input => input.addEventListener('change', syncMode));
  renderButton.addEventListener('click', async () => {
    if (job) { job.abort(); renderButton.disabled = true; status.textContent = 'Cancelling…'; return; }
    if (!$('fp-record-duration').reportValidity()) return;
    let snapshot;
    try { snapshot = fpCreateVideoSnapshot($('fp-record-start').value); }
    catch (error) { status.textContent = error.message; return; }
    const controller = new AbortController();
    job = controller;
    const wasRunning = fp.running;
    const excluded = new Set(['fp-record-render', 'fp-record-close', 'fp-btn-record', 'fp-btn-expand']);
    const controls = [...document.querySelectorAll('.left-panel input, .left-panel button, #viewpanel-sim input, #viewpanel-sim select, #viewpanel-sim button')]
      .filter(control => !excluded.has(control.id));
    const disabled = controls.map(control => control.disabled);
    controls.forEach(control => { control.disabled = true; });
    fp.running = false;
    if (fp.animId) cancelAnimationFrame(fp.animId);
    fp.animId = null;
    progress.hidden = false;
    progress.value = 0;
    download.hidden = true;
    status.textContent = 'Preparing video…';
    syncButton();
    try {
      if (downloadURL) { URL.revokeObjectURL(downloadURL); downloadURL = null; }
      const { renderVideo } = await import('./video-export.js');
      const result = await renderVideo({ snapshot, width: Number($('fp-record-size').value),
        duration: Number($('fp-record-duration').value), signal: controller.signal,
        onPreview: canvas => $('fp-record-preview').append(canvas),
        onProgress: ({ stage, completed, total }) => {
          progress.max = total;
          progress.value = completed;
          const percent = Math.round(completed / total * 100);
          status.textContent = stage === 'Rendering' ? `Rendering ${percent}% · ${completed} / ${total} frames` : `${stage} video…`;
          openButton.textContent = stage === 'Rendering' ? `● Rendering ${percent}%` : `● ${stage}…`;
        },
      });
      downloadURL = URL.createObjectURL(result.blob);
      download.href = downloadURL;
      download.download = `free-particle-${snapshot.state.interpMode}-${result.report.width}x${result.report.height}-30fps-${new Date().toISOString().replace(/[:.]/g, '-')}.${result.extension}`;
      download.textContent = `Save ${result.extension.toUpperCase()} again`;
      download.hidden = false;
      status.textContent = `Ready · ${result.report.width} × ${result.report.height} · 30 fps · ${result.report.duration} s`;
      download.click();
    } catch (error) {
      status.textContent = error.name === 'AbortError' ? 'Render cancelled.' : `Export failed: ${error.message}`;
      if (error.name !== 'AbortError') console.error('Video export:', error);
    } finally {
      job = null;
      controls.forEach((control, i) => { control.disabled = disabled[i]; });
      progress.hidden = true;
      fp.running = wasRunning;
      fp._lastFrameTime_ms = null;
      if (wasRunning) fp.animId = requestAnimationFrame(fpStep);
      syncButton();
    }
  });
  window.addEventListener('pagehide', () => {
    job?.abort();
    if (downloadURL) URL.revokeObjectURL(downloadURL);
  });
  syncMode();
  syncButton();
}
