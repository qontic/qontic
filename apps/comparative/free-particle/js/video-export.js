// Adapted from DoubleSlit2.0/export.js: the same local encoder, 30 fps clock,
// MP4/WebM fallback, supersampling, progress, and cancellation workflow.
export const EXPORT_FPS = 30;
export const EXPORT_WIDTHS = [1920, 2560];
export const videoHeight = (width, layout) => Math.max(2, 2 * Math.round(width * layout.height / layout.width / 2));
const yieldToUI = () => new Promise(resolve => setTimeout(resolve, 0));

export async function renderVideo({ snapshot, width = 2560, duration = 10, signal,
  onProgress = () => {}, onPreview = () => {}, onFrame }) {
  if (!EXPORT_WIDTHS.includes(width) || !Number.isFinite(duration) || duration < 1 || duration > 120) {
    throw new Error('Choose a video length from 1 to 120 seconds.');
  }
  if (typeof VideoEncoder === 'undefined') throw new Error('Open this page in Chrome or Edge to render video.');
  const checkCancelled = () => { if (signal?.aborted) throw new DOMException('Export cancelled', 'AbortError'); };
  checkCancelled();
  const height = videoHeight(width, snapshot.layout);
  const total = Math.round(duration * EXPORT_FPS);
  onProgress({ stage: 'Preparing', completed: 0, total });
  const { Output, BufferTarget, Mp4OutputFormat, WebMOutputFormat, CanvasSource, Quality, canEncodeVideo } = await import('./vendor/media.js');
  const bitrate = Math.round(80000000 * width * height / (3840 * 2400));
  const quality = new Quality({ bitrate });
  let codec;
  for (const candidate of ['avc', 'vp9']) {
    checkCancelled();
    if (await canEncodeVideo(candidate, { width, height, quality })) { codec = candidate; break; }
  }
  if (!codec) throw new Error('This browser cannot encode that size. Try the smaller resolution.');
  checkCancelled();

  const renderer = document.createElement('iframe');
  renderer.dataset.freeParticleVideoRenderer = '';
  renderer.title = 'Video renderer';
  renderer.setAttribute('aria-hidden', 'true');
  renderer.tabIndex = -1;
  Object.assign(renderer.style, { position: 'fixed', left: '-100000px', top: '0',
    width: '1px', height: '1px', visibility: 'hidden', border: '0', pointerEvents: 'none' });
  renderer.src = new URL('../video-renderer.html?v=20260914-1', import.meta.url).href;
  const canvas = document.createElement('canvas');
  canvas.className = 'fp-record-preview-canvas';
  canvas.setAttribute('aria-label', 'Video preview');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false, colorSpace: 'srgb' });
  const report = { width, height, fps: EXPORT_FPS, duration: total / EXPORT_FPS,
    frames: 0, codec, bitrate, start: snapshot.start, layout: snapshot.layout,
    seed: snapshot.seed, initialTime: snapshot.state.time_fs };
  let api, output;
  try {
    document.body.append(renderer);
    const deadline = performance.now() + 30000;
    while (!(api = renderer.contentWindow?.FreeParticleVideoRenderer)) {
      checkCancelled();
      if (performance.now() > deadline) throw new Error('The video renderer did not start. Reload and try again.');
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    checkCancelled();
    api.configure(snapshot, width);
    const target = new BufferTarget();
    const format = codec === 'avc' ? new Mp4OutputFormat({ fastStart: 'in-memory' }) : new WebMOutputFormat();
    output = new Output({ format, target });
    const source = new CanvasSource(canvas, { codec, quality, latencyMode: 'quality',
      keyFrameInterval: 2, contentHint: 'detail',
      onEncodedPacket: () => { report.frames++; },
      onEncoderConfig: config => { report.encoderConfig = config; } });
    output.addVideoTrack(source, { frameRate: EXPORT_FPS });
    await output.start();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const sx = width / snapshot.layout.width, sy = height / snapshot.layout.height;
    for (let frame = 0; frame < total; frame++) {
      checkCancelled();
      const layers = api.renderFrame(frame, EXPORT_FPS);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      // Only these five canvases enter the video. No DOM capture or controls.
      for (const [name, area] of [['wave', 'wave'], ['particle', 'wave'], ['detector', 'wave'], ['y', 'y'], ['prob', 'prob']]) {
        const r = snapshot.layout[area];
        ctx.drawImage(layers[name], r.x * sx, r.y * sy, r.width * sx, r.height * sy);
      }
      if (frame === 0) onPreview(canvas);
      report.finalState = layers.state;
      await onFrame?.(canvas, frame, layers.state);
      checkCancelled();
      await source.add(frame / EXPORT_FPS, 1 / EXPORT_FPS);
      onProgress({ stage: 'Rendering', completed: frame + 1, total });
      await yieldToUI();
    }
    checkCancelled();
    onProgress({ stage: 'Finishing', completed: total, total });
    await output.finalize();
    checkCancelled();
    if (report.frames !== total) throw new Error(`Video encoder returned ${report.frames} of ${total} frames.`);
    return { blob: new Blob([target.buffer], { type: codec === 'avc' ? 'video/mp4' : 'video/webm' }),
      extension: codec === 'avc' ? 'mp4' : 'webm', report };
  } finally {
    if (output && output.state !== 'finalized' && output.state !== 'canceled') await output.cancel().catch(() => {});
    api?.dispose();
    renderer.remove();
    canvas.remove();
    canvas.width = 1;
    canvas.height = 1;
  }
}
