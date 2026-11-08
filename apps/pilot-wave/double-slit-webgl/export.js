// Adapted from ClassicalLimit/src/export.js. Uses its local encoder, 30 fps
// frame clock, 2x rendering, codec fallback, and cancellation workflow.
export const EXPORT_FPS = 30;
export const EXPORT_WIDTHS = [1920, 2560];
const yieldToUI = () => new Promise(resolve => setTimeout(resolve, 0));

export function videoHeight(width, displayWidth, displayHeight) {
  return Math.max(2, 2 * Math.round(width * displayHeight / displayWidth / 2));
}

export async function renderVideo({ snapshot, width = 2560, duration = 10,
  signal, onProgress = () => {}, onPreview = () => {}, onFrame }) {
  if (!EXPORT_WIDTHS.includes(width) || !Number.isFinite(duration) || duration < 1 || duration > 120) {
    throw new Error('Choose a video length from 1 to 120 seconds.');
  }
  if (typeof VideoEncoder === 'undefined') throw new Error('Open this page in Chrome or Edge to render video.');
  const checkCancelled = () => { if (signal?.aborted) throw new DOMException('Export cancelled', 'AbortError'); };
  checkCancelled();
  const height = videoHeight(width, snapshot.displayWidth, snapshot.displayHeight);
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
  if (!codec) throw new Error('This browser cannot encode the selected resolution. Try a smaller video size.');
  checkCancelled();

  // The isolated copy has the same CSS viewport and physical grid as the live
  // app. Only its drawing surface is enlarged; export resolution cannot change
  // the wave, slit dimensions, trajectories, or histogram bin positions.
  const rendererFrame = document.createElement('iframe');
  rendererFrame.className = 'video-renderer';
  rendererFrame.title = 'Video renderer';
  rendererFrame.setAttribute('aria-hidden', 'true');
  rendererFrame.tabIndex = -1;
  Object.assign(rendererFrame.style, {
    position: 'fixed', left: '-100000px', top: '0', border: '0', visibility: 'hidden',
    width: `${snapshot.displayWidth}px`, height: `${snapshot.displayHeight}px`, pointerEvents: 'none',
  });
  const rendererURL = new URL('./index.html', import.meta.url);
  rendererURL.searchParams.set('renderer', 'video');
  rendererFrame.src = rendererURL.href;
  const outputCanvas = document.createElement('canvas');
  outputCanvas.className = 'export-preview';
  outputCanvas.setAttribute('aria-label', 'Video render preview');
  outputCanvas.width = width;
  outputCanvas.height = height;
  const context = outputCanvas.getContext('2d', { alpha: false, colorSpace: 'srgb' });
  const report = { width, height, fps: EXPORT_FPS, frames: 0, duration: total / EXPORT_FPS,
    start: snapshot.start, codec, bitrate, initialPhysicsFrame: snapshot.physicsFrame,
    openingHold: snapshot.holdRemaining, histogram: true,
    gridSize: [snapshot.simW, snapshot.simH], renderSize: [width * 2, height * 2],
    displaySize: [snapshot.displayWidth, snapshot.displayHeight], view: { ...snapshot.view } };
  let api, output;
  try {
    document.body.append(rendererFrame);
    const deadline = performance.now() + 30000;
    while (!api?.isReady()) {
      checkCancelled();
      api = rendererFrame.contentWindow?.BohmianDoubleSlit;
      const error = api?.getInitializationError();
      if (error) throw new Error(error);
      if (performance.now() > deadline) throw new Error('The video renderer did not start. Reload and try again.');
      if (!api?.isReady()) await new Promise(resolve => setTimeout(resolve, 25));
    }
    checkCancelled();
    api.configureVideoRenderer(snapshot, ...report.renderSize);
    const target = new BufferTarget();
    const format = codec === 'avc' ? new Mp4OutputFormat({ fastStart: 'in-memory' }) : new WebMOutputFormat();
    output = new Output({ format, target });
    const source = new CanvasSource(outputCanvas, { codec, quality, latencyMode: 'quality',
      keyFrameInterval: 2, contentHint: 'detail',
      onEncodedPacket: () => { report.frames++; },
      onEncoderConfig: config => { report.encoderConfig = config; } });
    output.addVideoTrack(source, { frameRate: EXPORT_FPS });
    await output.start();
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    const sx = width / snapshot.displayWidth, sy = height / snapshot.displayHeight;
    for (let frame = 0; frame < total; frame++) {
      checkCancelled();
      const layers = api.renderVideoFrame(frame, EXPORT_FPS);
      context.fillStyle = '#000';
      context.fillRect(0, 0, width, height);
      // CSS zoom/pan applies to the simulation only. The histogram already
      // follows that transform and is drawn in viewport coordinates.
      context.drawImage(layers.canvas, snapshot.view.offsetX * sx, snapshot.view.offsetY * sy,
        width * snapshot.view.zoom, height * snapshot.view.zoom);
      context.drawImage(layers.histogram, 0, 0, width, height);
      if (layers.phaseLegend) {
        const legend = layers.phaseLegend;
        context.drawImage(legend.canvas, legend.x * sx, legend.y * sy, legend.width * sx, legend.height * sy);
      }
      const state = { physicsFrame: layers.physicsFrame, detectorHits: layers.detectorHits,
        measurement: layers.measurement };
      report.finalState = state;
      if (frame === 0) onPreview(outputCanvas);
      await onFrame?.(outputCanvas, frame, state);
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
    api?.disposeVideoRenderer();
    rendererFrame.remove();
    outputCanvas.remove();
    outputCanvas.width = 1;
    outputCanvas.height = 1;
  }
}
