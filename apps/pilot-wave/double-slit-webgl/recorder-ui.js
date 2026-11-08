import { renderVideo, videoHeight } from './export.js';

export function initRecorder(simulation) {
  const $ = id => document.getElementById(id);
  let job = null, downloadURL = null;
  const syncButton = () => {
    $('record').classList.toggle('recording', Boolean(job));
    $('record-label').textContent = job ? 'Cancel render' : 'Render video · 30 fps';
    $('record').disabled = typeof VideoEncoder === 'undefined';
    if ($('record').disabled) $('export-status').textContent = 'Open in Chrome or Edge to render video.';
  };
  const syncSizes = () => {
    const canvas = $('c');
    for (const option of $('export-size').options) {
      const width = Number(option.value);
      option.textContent = `${width === 2560 ? '2K · ' : ''}${width} × ${videoHeight(width, canvas.clientWidth, canvas.clientHeight)}`;
    }
  };
  window.addEventListener('resize', syncSizes);
  window.addEventListener('pagehide', () => {
    job?.abort();
    if (downloadURL) URL.revokeObjectURL(downloadURL);
  });
  $('record').addEventListener('click', async () => {
    if (job) { job.abort(); $('record').disabled = true; return; }
    if (!$('export-duration').reportValidity()) return;
    const controller = new AbortController();
    job = controller;
    simulation.beginFrameRecording();
    const controls = [...document.querySelectorAll('#ui input, #ui select, #ui button:not(#record):not(#minui)')];
    const disabled = controls.map(control => control.disabled);
    controls.forEach(control => { control.disabled = true; });
    syncButton();
    $('export-progress').hidden = false;
    $('export-progress').value = 0;
    $('export-download').hidden = true;
    try {
      if (downloadURL) { URL.revokeObjectURL(downloadURL); downloadURL = null; }
      const snapshot = simulation.createVideoSnapshot($('export-start').value);
      const result = await renderVideo({ snapshot, width: Number($('export-size').value),
        duration: Number($('export-duration').value), signal: controller.signal,
        onPreview: canvas => $('wrap').append(canvas),
        onProgress: ({ stage, completed, total }) => {
          $('export-progress').max = total;
          $('export-progress').value = completed;
          $('export-status').textContent = stage === 'Rendering'
            ? `Rendering ${Math.round(100 * completed / total)}% · ${completed} / ${total} frames`
            : `${stage} video…`;
        },
      });
      downloadURL = URL.createObjectURL(result.blob);
      const link = $('export-download');
      link.href = downloadURL;
      link.download = `double-slit-${result.report.width}x${result.report.height}-30fps-${new Date().toISOString().replace(/[:.]/g, '-')}.${result.extension}`;
      link.hidden = false;
      link.textContent = `Save ${result.extension.toUpperCase()} again`;
      $('export-status').textContent = `Ready · ${result.report.width} × ${result.report.height} · 30 fps · ${result.report.duration} s`;
      link.click();
    } catch (error) {
      $('export-status').textContent = error.name === 'AbortError' ? 'Render cancelled.' : `Export failed: ${error.message}`;
      if (error.name !== 'AbortError') console.error('Video export:', error);
    } finally {
      job = null;
      controls.forEach((control, i) => { control.disabled = disabled[i]; });
      $('export-progress').hidden = true;
      simulation.endFrameRecording();
      syncButton();
    }
  });
  syncSizes();
  syncButton();
}
