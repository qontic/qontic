const canvas = document.getElementById("c");
const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, depth: false, stencil: false });
if (!gl) throw new Error("WebGL2 not available.");

gl.disable(gl.DEPTH_TEST);
gl.disable(gl.CULL_FACE);

const extFloatRT = gl.getExtension("EXT_color_buffer_float");
if (!extFloatRT) {
  alert("EXT_color_buffer_float missing. Use Chrome/Edge/Firefox desktop.\nThis demo needs float render targets.");
  throw new Error("Missing EXT_color_buffer_float");
}

const params = {
  simScale: .5,
  stepsPerFrame: 20,

  hbar: 6.0,
  mass: 1.0,
  p0: 4.5,
  dt: 0.02,

  packetX: 0.3,
  packetY: 0.3,
  packetSigma: 30.0,

  barrierY: 0.55,
  barrierThick: 50.0,
  V0: 5.0,

  absorbPx: 40.0,
  absorbStrength: 3.,
  particleKillMargin: 12.0,

  nParticles: 400,
  rhoMin: 1e-6,
  velClamp: 160.0,
  guidingMode: 1,
  spinSign: 1,
  spinMagnitude: 0.5,

  visGain: 20.0,
  visGamma: 0.5,
  showPhase: 1,

  showParticles: 1,
  dotSize: 7.0,
  dotSigma: 0.28,
  dotGain: 1.,

  showTrail: 1,
  trailHalfLife: 100.0,
  trailVisGain: .8,
  trailVisGamma: 1,
  trailStampGain: 0.55,
  trailWidth: 5.0,
  trailBlendMode: 1,

  paletteId: 5,
};

const PALETTE_NAMES = [
  "Nebula",
  "Synthwave",
  "Viridis-ish",
  "Inferno-ish",
  "Ice",
  "Plasma Drift",
  "Arctic Aurora",
  "Solar Flare",
  "Cosmic Dust",
  "Neon Noir",
  "Pastel Mirage"
];

const PALETTE_COMPLEMENTS = [
  [0.92,0.93,0.88],
  [0.10,0.60,0.10],
  [0.80,0.60,0.55],
  [0.10,0.60,0.80],
  [0.80,0.30,0.15],
  [0.20,0.80,0.30],
  [0.85,0.25,0.25],
  [0.10,0.10,0.80],
  [0.40,0.50,0.70],
  [0.90,0.90,0.10],
  [0.40,0.40,0.60]
];

const GUIDING_MODE_NAMES = [
  "Schrodinger",
  "Pauli spin"
];

const BARRIER_V0_MAX = 12.0;

let paused = false;
const RECORDING_CONFIG = {
  fps: 60,
  videoBitsPerSecond: 14_000_000,
  chunkMs: 1000,
};
const recordingState = {
  recorder: null,
  stream: null,
  videoTrack: null,
  manualFrames: false,
  chunks: [],
  startedAt: 0,
  mimeType: "",
  finalizing: false,
  lastUrl: null,
  pendingBlob: null,
  pendingFileName: "",
};

const controls = document.getElementById("controls");
const statsEl = document.getElementById("stats");

function fmt(v) {
  const av = Math.abs(v);
  if (av >= 1000 || (av > 0 && av < 0.01)) return v.toExponential(2);
  return v.toFixed(3).replace(/\.?0+$/, "");
}

function addSlider(key, label, min, max, step, onChange = null) {
  const row = document.createElement("div");
  row.className = "row";

  const lab = document.createElement("label");
  lab.textContent = label;

  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = params[key];

  const val = document.createElement("div");
  val.className = "val";
  val.textContent = fmt(params[key]);

  input.addEventListener("input", () => {
    const v = parseFloat(input.value);
    params[key] = v;
    val.textContent = fmt(v);
  });
  input.addEventListener("change", () => onChange && onChange());

  row.appendChild(lab);
  row.appendChild(input);
  row.appendChild(val);
  controls.appendChild(row);
}

function addToggleInt(key, label) {
  const row = document.createElement("div");
  row.className = "row";
  const lab = document.createElement("label");
  lab.textContent = label;

  const btn = document.createElement("button");
  btn.style.flex = "1";
  btn.textContent = params[key] ? "ON" : "OFF";
  btn.addEventListener("click", () => {
    params[key] = params[key] ? 0 : 1;
    btn.textContent = params[key] ? "ON" : "OFF";
  });

  const val = document.createElement("div");
  val.className = "val";
  val.textContent = "";

  row.appendChild(lab);
  row.appendChild(btn);
  row.appendChild(val);
  controls.appendChild(row);
}

function addCycleButton(key, label, values, onChange = null) {
  const row = document.createElement("div");
  row.className = "row";

  const lab = document.createElement("label");
  lab.textContent = label;

  const btn = document.createElement("button");
  btn.style.flex = "1";

  const sync = () => {
    btn.textContent = values[params[key] | 0] ?? values[0];
  };

  sync();
  btn.addEventListener("click", () => {
    params[key] = (params[key] + 1) % values.length;
    sync();
    if (onChange) onChange(params[key] | 0);
  });

  const val = document.createElement("div");
  val.className = "val";
  val.textContent = "";

  row.appendChild(lab);
  row.appendChild(btn);
  row.appendChild(val);
  controls.appendChild(row);
}

function addSectionHeader(label) {
  const header = document.createElement("div");
  header.style.marginTop = "12px";
  header.style.marginBottom = "8px";
  header.style.fontSize = "11px";
  header.style.fontWeight = "700";
  header.style.color = "#9fbce0";
  header.style.textTransform = "uppercase";
  header.style.letterSpacing = "1px";
  header.textContent = label;
  controls.appendChild(header);
}

addSectionHeader("Performance");
addSlider("simScale", "sim scale", 0.25, 1.0, 0.05, () => rebuildSimulation());
addSlider("stepsPerFrame", "Steps/frame", 1, 100, 1);

addSectionHeader("Physical Parameters");
addSlider("p0", "momentum p", 0.5, 8.0, 0.1, () => resetAll());
addSlider("dt", "dt", 0.01, 0.04, 0.001);
//addSlider("packetX", "packet start x", 0.05, 0.95, 0.01, () => resetAll());
//addSlider("packetY", "packet start y", 0.05, 0.95, 0.01, () => resetAll());
addSlider("packetSigma", "packet sigma", 8.0, 80.0, 1.0, () => resetAll());
addSlider("V0", "barrier V0", 0.0, BARRIER_V0_MAX, 0.1, () => resetAll());
addSlider("barrierThick", "barrier thickness", 4.0, 150.0, 1.0, () => resetAll());
addSlider("absorbPx", "absorb boundary", 0.0, 60.0, 1.0);
addSlider("spinMagnitude", "spin |s|", 0.0, 2.0, 0.5);
{
  const row = document.createElement("div");
  row.className = "row";

  const lab = document.createElement("label");
  lab.textContent = "guiding law";

  const group = document.createElement("div");
  group.className = "toggle-group";

  const btnSchrodinger = document.createElement("button");
  btnSchrodinger.textContent = "Schrodinger";
  btnSchrodinger.addEventListener("click", () => {
    params.guidingMode = 0;
    params.spinSign = 1;
    updateToggleButtons();
    resetAll();
  });

  const btnPauliUp = document.createElement("button");
  btnPauliUp.textContent = "Pauli Up";
  btnPauliUp.addEventListener("click", () => {
    params.guidingMode = 1;
    params.spinSign = 1;
    updateToggleButtons();
    resetAll();
  });

  const btnPauliDown = document.createElement("button");
  btnPauliDown.textContent = "Pauli Down";
  btnPauliDown.addEventListener("click", () => {
    params.guidingMode = 1;
    params.spinSign = -1;
    updateToggleButtons();
    resetAll();
  });

  group.appendChild(btnSchrodinger);
  group.appendChild(btnPauliUp);
  group.appendChild(btnPauliDown);

  function updateToggleButtons() {
    btnSchrodinger.classList.toggle("selected", params.guidingMode === 0);
    btnPauliUp.classList.toggle("selected", params.guidingMode === 1 && params.spinSign > 0);
    btnPauliDown.classList.toggle("selected", params.guidingMode === 1 && params.spinSign < 0);
  }
  updateToggleButtons();

  const val = document.createElement("div");
  val.className = "val";
  val.textContent = "";

  row.appendChild(lab);
  row.appendChild(group);
  row.appendChild(val);
  controls.appendChild(row);
}

addSectionHeader("Visual Parameters");
addToggleInt("showPhase", "show phase");
addToggleInt("showParticles", "show particles");
addSlider("nParticles", "particle count", 1, 3000, 1, () => rebuildParticles());
addSlider("dotSize", "particle size", 2.0, 16.0, 0.5);
addSlider("dotGain", "particle brightness", 0.1, 3.0, 0.1);

addToggleInt("showTrail", "draw trails");
addSlider("trailHalfLife", "trail half-life", 1.0, 100.0, 1.0);
//addSlider("trailVisGain", "trail gain", 0.1, 1.0, 0.1);
//addSlider("trailVisGamma", "trail gamma", 0.4, 2.0, 0.05);
addSlider("trailWidth", "trail width (px)", 1, 9.0, 1);

//addSlider("visGain", "wave gain", 0.5, 20.0, 0.5);
//addSlider("visGamma", "wave gamma", 0.3, 2.0, 0.05);

document.getElementById("reset").onclick = () => resetAll();
const pauseButton = document.getElementById("pause");
const recordButton = document.getElementById("record");

function syncPauseButton() {
  pauseButton.textContent = paused ? "Resume" : "Pause";
}

function togglePause() {
  paused = !paused;
  syncPauseButton();
}

function canRecordCanvas() {
  return typeof MediaRecorder !== "undefined" && typeof canvas.captureStream === "function" && !!chooseRecordingMimeType();
}

function isRecording() {
  return recordingState.recorder?.state === "recording";
}

function chooseRecordingMimeType() {
  const candidates = [
    "video/mp4;codecs=avc1.42E01E",
    "video/mp4;codecs=avc1.640028",
    "video/mp4;codecs=h264",
    "video/mp4",
  ];
  return candidates.find(type => MediaRecorder.isTypeSupported?.(type)) || "";
}

function recordingFileName(startedAt = recordingState.startedAt) {
  const stamp = new Date(startedAt || Date.now()).toISOString().replace(/[:.]/g, "-");
  return `bohmian-tunneling-${stamp}.mp4`;
}

function syncRecordingButton() {
  const recording = isRecording();
  const supported = canRecordCanvas();
  recordButton.textContent = recording ? "Stop Recording" : (recordingState.finalizing ? "Saving Recording..." : "Start Recording");
  recordButton.classList.toggle("recording", recording);
  recordButton.disabled = recordingState.finalizing || (!recordingState.pendingBlob && !supported);
  recordButton.title = recordingState.pendingBlob
    ? "Download the most recent MP4 recording."
    : (supported ? "Records the WebGL canvas only; DOM controls are excluded." : "MP4 canvas recording is not supported by this browser.");
}

function toggleRecording() {
  if (recordingState.pendingBlob && !isRecording()) downloadPendingRecording(true);
  else if (isRecording()) stopRecording();
  else startRecording();
}

function startRecording() {
  if (!canRecordCanvas()) {
    alert("MP4 canvas recording is not supported by this browser.");
    syncRecordingButton();
    return;
  }
  clearPendingRecording();

  const mimeType = chooseRecordingMimeType();
  const options = {
    mimeType,
    videoBitsPerSecond: RECORDING_CONFIG.videoBitsPerSecond,
  };

  let stream, recorder, videoTrack, manualFrames = false;
  try {
    stream = canvas.captureStream(0);
    videoTrack = stream.getVideoTracks()[0];
    manualFrames = typeof videoTrack?.requestFrame === "function";
    if (!manualFrames) {
      stream.getTracks().forEach(track => track.stop());
      stream = canvas.captureStream(RECORDING_CONFIG.fps);
      videoTrack = stream.getVideoTracks()[0];
    }
    recorder = new MediaRecorder(stream, options);
  } catch (error) {
    stream?.getTracks().forEach(track => track.stop());
    alert(`Could not start MP4 recording: ${error.message}`);
    syncRecordingButton();
    return;
  }

  recordingState.recorder = recorder;
  recordingState.stream = stream;
  recordingState.videoTrack = videoTrack;
  recordingState.manualFrames = manualFrames;
  recordingState.chunks = [];
  recordingState.startedAt = Date.now();
  recordingState.mimeType = recorder.mimeType || mimeType;
  recordingState.finalizing = false;

  recorder.ondataavailable = event => {
    if (event.data && event.data.size > 0) recordingState.chunks.push(event.data);
  };
  recorder.onerror = event => {
    console.error("Recording error:", event.error || event);
    stopRecording();
  };
  recorder.onstop = finishRecordingDownload;
  recorder.start(RECORDING_CONFIG.chunkMs);
  requestRecordingFrame();
  syncRecordingButton();
}

function stopRecording() {
  const recorder = recordingState.recorder;
  if (!recorder || recorder.state === "inactive") return;
  recordingState.finalizing = true;
  syncRecordingButton();
  try {
    recorder.requestData();
  } catch (error) {
    console.warn("Could not flush recording data:", error);
  }
  recorder.stop();
}

function finishRecordingDownload() {
  recordingState.stream?.getTracks().forEach(track => track.stop());
  recordingState.stream = null;
  recordingState.videoTrack = null;
  recordingState.manualFrames = false;
  const chunks = recordingState.chunks;
  recordingState.chunks = [];

  if (!chunks.length) {
    recordingState.recorder = null;
    recordingState.finalizing = false;
    alert("No recording data was produced.");
    syncRecordingButton();
    return;
  }

  recordingState.pendingBlob = new Blob(chunks, { type: recordingState.mimeType || "video/mp4" });
  recordingState.pendingFileName = recordingFileName();
  recordingState.recorder = null;
  recordingState.finalizing = false;
  downloadPendingRecording(true);
  syncRecordingButton();
}

function requestRecordingFrame() {
  if (!isRecording() || !recordingState.manualFrames) return;
  recordingState.videoTrack?.requestFrame?.();
}

function requestRecordingFrameAfterRender() {
  if (!isRecording() || !recordingState.manualFrames) return;
  gl.flush();
  requestRecordingFrame();
}

function clearPendingRecording() {
  if (recordingState.lastUrl) {
    URL.revokeObjectURL(recordingState.lastUrl);
    recordingState.lastUrl = null;
  }
  recordingState.pendingBlob = null;
  recordingState.pendingFileName = "";
}

function downloadPendingRecording(clearAfterClick) {
  if (!recordingState.pendingBlob) return;
  if (!recordingState.lastUrl) {
    recordingState.lastUrl = URL.createObjectURL(recordingState.pendingBlob);
  }
  const url = recordingState.lastUrl;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = recordingState.pendingFileName || recordingFileName();
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  if (clearAfterClick) {
    recordingState.pendingBlob = null;
    recordingState.pendingFileName = "";
    syncRecordingButton();
    setTimeout(() => {
      if (recordingState.lastUrl === url) {
        URL.revokeObjectURL(recordingState.lastUrl);
        recordingState.lastUrl = null;
      }
      syncRecordingButton();
    }, 1000);
  }
}

pauseButton.onclick = togglePause;
recordButton.onclick = toggleRecording;
syncPauseButton();
syncRecordingButton();

window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r") resetAll();
  if (e.key === " ") togglePause();
});

const uiBody = document.getElementById("uibody");
const minBtn = document.getElementById("minui");
minBtn.textContent = "-";

let uiMinimized = false;
minBtn.onclick = () => {
  uiMinimized = !uiMinimized;
  uiBody.style.display = uiMinimized ? "none" : "block";
  minBtn.textContent = uiMinimized ? "+" : "-";
};

const theoryPanel = document.getElementById("theory");
const theoryBody = document.getElementById("theorybody");
const theoryBtn = document.getElementById("mintheory");

let theoryMinimized = true;
function syncTheoryPanel() {
  theoryPanel.classList.toggle("is-minimized", theoryMinimized);
  theoryBody.hidden = theoryMinimized;
  theoryBtn.textContent = theoryMinimized ? "+" : "-";
  theoryBtn.setAttribute("aria-expanded", String(!theoryMinimized));
}

theoryBtn.onclick = () => {
  theoryMinimized = !theoryMinimized;
  syncTheoryPanel();
};
syncTheoryPanel();

const view = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
};

function clampViewOffset() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const minX = w * (1 - view.zoom);
  const minY = h * (1 - view.zoom);
  view.offsetX = Math.min(0, Math.max(minX, view.offsetX));
  view.offsetY = Math.min(0, Math.max(minY, view.offsetY));
}

function applyViewTransform() {
  clampViewOffset();
  canvas.style.transformOrigin = "0 0";
  canvas.style.transform = `translate(${view.offsetX}px, ${view.offsetY}px) scale(${view.zoom})`;
}

canvas.addEventListener("wheel", (e) => {
  e.preventDefault();

  const rect = canvas.parentElement.getBoundingClientRect();
  const cursorX = e.clientX - rect.left;
  const cursorY = e.clientY - rect.top;
  const oldZoom = view.zoom;
  const zoomFactor = Math.exp(-e.deltaY * 0.0012);
  const nextZoom = Math.min(8, Math.max(1, oldZoom * zoomFactor));

  if (nextZoom === oldZoom) return;

  const worldX = (cursorX - view.offsetX) / oldZoom;
  const worldY = (cursorY - view.offsetY) / oldZoom;
  view.zoom = nextZoom;
  view.offsetX = cursorX - worldX * nextZoom;
  view.offsetY = cursorY - worldY * nextZoom;
  applyViewTransform();
}, { passive: false });

function compile(type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(src);
    throw new Error(gl.getShaderInfoLog(sh));
  }
  return sh;
}

function link(vs, fs, tfVaryings = null) {
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  if (tfVaryings) gl.transformFeedbackVaryings(prog, tfVaryings, gl.INTERLEAVED_ATTRIBS);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prog));
  }
  return prog;
}

function makeTexFloat32(w, h) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return t;
}

function makeTexRGBA16F(w, h) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.FLOAT, null);

  gl.bindTexture(gl.TEXTURE_2D, null);
  return t;
}

function makeFBO(tex) {
  const f = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, f);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (ok !== gl.FRAMEBUFFER_COMPLETE) throw new Error("FBO incomplete: " + ok);
  return f;
}

function u(prog, name) { return gl.getUniformLocation(prog, name); }

async function loadText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to load ${url}: ${r.status}`);
  return await r.text();
}

const SH = {};
async function loadShaders() {
  const base = "./shaders/";
  const files = [
    "fullscreen.vert",
    "wave_init.frag",
    "wave_step.frag",
    "wave_render.frag",
    "particle_update.vert",
    "particle_update.frag",
    "particle_render.vert",
    "particle_render.frag",
    "particle_stamp.frag",
    "density_step.frag",
    "density_render.frag",
  ];
  await Promise.all(files.map(async (f) => { SH[f] = await loadText(base + f); }));
}

let progWaveInit, progWaveStep, progWaveRender;
let progPartUpdate, progPartView, progPartStamp;
let progDensityStep, progDensityRender;
let progBoundary;

let U = {};

let vaoKillBoundary = null;
let boundaryBuffer = null;

function buildPrograms() {
  const vsFull = compile(gl.VERTEX_SHADER, SH["fullscreen.vert"]);

  progWaveInit   = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["wave_init.frag"]));
  progWaveStep   = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["wave_step.frag"]));
  progWaveRender = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["wave_render.frag"]));

  progPartUpdate = link(
    compile(gl.VERTEX_SHADER, SH["particle_update.vert"]),
    compile(gl.FRAGMENT_SHADER, SH["particle_update.frag"]),
    ["vState"]
  );
  progPartView = link(
    compile(gl.VERTEX_SHADER, SH["particle_render.vert"]),
    compile(gl.FRAGMENT_SHADER, SH["particle_render.frag"])
  );
  progPartStamp = link(
    compile(gl.VERTEX_SHADER, SH["particle_render.vert"]),
    compile(gl.FRAGMENT_SHADER, SH["particle_stamp.frag"])
  );

  progDensityStep = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["density_step.frag"]));
  progDensityRender = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["density_render.frag"]));

  U.waveInit = {
    uSimRes: u(progWaveInit, "uSimRes"),
    uHBAR: u(progWaveInit, "uHBAR"),
    uMass: u(progWaveInit, "uMass"),
    uP0: u(progWaveInit, "uP0"),
    uDT: u(progWaveInit, "uDT"),
    uPacketPosFrac: u(progWaveInit, "uPacketPosFrac"),
    uPacketSigmaPx: u(progWaveInit, "uPacketSigmaPx"),
    uBarrierYFrac: u(progWaveInit, "uBarrierYFrac"),
    uBarrierThickPx: u(progWaveInit, "uBarrierThickPx"),
    uV0: u(progWaveInit, "uV0"),
    uAbsorbPx: u(progWaveInit, "uAbsorbPx"),
    uAbsorbStrength: u(progWaveInit, "uAbsorbStrength"),
  };

  U.waveStep = {
    uState: u(progWaveStep, "uState"),
    uSimRes: u(progWaveStep, "uSimRes"),
    uHBAR: u(progWaveStep, "uHBAR"),
    uMass: u(progWaveStep, "uMass"),
    uDT: u(progWaveStep, "uDT"),
    uBarrierYFrac: u(progWaveStep, "uBarrierYFrac"),
    uBarrierThickPx: u(progWaveStep, "uBarrierThickPx"),
    uV0: u(progWaveStep, "uV0"),
    uAbsorbPx: u(progWaveStep, "uAbsorbPx"),
    uAbsorbStrength: u(progWaveStep, "uAbsorbStrength"),
  };

  U.waveRender = {
    uState: u(progWaveRender, "uState"),
    uSimRes: u(progWaveRender, "uSimRes"),
    uVisGain: u(progWaveRender, "uVisGain"),
    uVisGamma: u(progWaveRender, "uVisGamma"),
    uShowPhase: u(progWaveRender, "uShowPhase"),
    uBarrierYFrac: u(progWaveRender, "uBarrierYFrac"),
    uBarrierThickPx: u(progWaveRender, "uBarrierThickPx"),
    uBarrierOpacity: u(progWaveRender, "uBarrierOpacity"),
    uBarrierClassicallyForbidden: u(progWaveRender, "uBarrierClassicallyForbidden"),
    uPaletteId: u(progWaveRender, "uPaletteId"),
  };

  U.partUpdate = {
    uState: u(progPartUpdate, "uState"),
    uSimRes: u(progPartUpdate, "uSimRes"),
    uHBAR: u(progPartUpdate, "uHBAR"),
    uMass: u(progPartUpdate, "uMass"),
    uDT: u(progPartUpdate, "uDT"),
    uGuidingMode: u(progPartUpdate, "uGuidingMode"),
    uSpinMagnitude: u(progPartUpdate, "uSpinMagnitude"),
    uSpinSign: u(progPartUpdate, "uSpinSign"),
    uAbsorbPx: u(progPartUpdate, "uAbsorbPx"),
    uRhoMin: u(progPartUpdate, "uRhoMin"),
    uVelClamp: u(progPartUpdate, "uVelClamp"),
    uParticleKillMarginPx: u(progPartUpdate, "uParticleKillMarginPx"),
  };

  U.partView = {
    uSimRes: u(progPartView, "uSimRes"),
    uPointSize: u(progPartView, "uPointSize"),
    uDotSigma: u(progPartView, "uDotSigma"),
    uDotGain: u(progPartView, "uDotGain"),
    uPaletteId: u(progPartView, "uPaletteId"),
  };

  U.partStamp = {
    uSimRes: u(progPartStamp, "uSimRes"),
    uPointSize: u(progPartStamp, "uPointSize"),
    uDotSigma: u(progPartStamp, "uDotSigma"),
    uDotGain: u(progPartStamp, "uDotGain"),
    uStampGain: u(progPartStamp, "uStampGain"),
    uNumParticles: u(progPartStamp, "uNumParticles"),
    uTrailWidth: u(progPartStamp, "uTrailWidth"),
  };

  U.densityStep = {
    uPrev: u(progDensityStep, "uPrev"),
    uFade: u(progDensityStep, "uFade"),
  };

  U.densityRender = {
    uDensity: u(progDensityRender, "uDensity"),
    uGain: u(progDensityRender, "uGain"),
    uGamma: u(progDensityRender, "uGamma"),
    uPaletteId: u(progDensityRender, "uPaletteId"),
    uBlendMode: u(progDensityRender, "uBlendMode"),
  };
}

const vaoEmpty = gl.createVertexArray();

let simW = 0, simH = 0;
let texA = null, texB = null, fboA = null, fboB = null, flip = 0;

let particleSrc = null, particleDst = null, vaoParticles = null, tf = null;

let densW = 0, densH = 0;
let densTexA = null, densTexB = null, densFboA = null, densFboB = null, densFlip = 0;

function resizeCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = Math.floor(canvas.clientWidth * dpr);
  const h = Math.floor(canvas.clientHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
}

function setWaveInitUniforms() {
  gl.uniform2i(U.waveInit.uSimRes, simW, simH);
  gl.uniform1f(U.waveInit.uHBAR, params.hbar);
  gl.uniform1f(U.waveInit.uMass, params.mass);
  gl.uniform1f(U.waveInit.uP0, params.p0);
  gl.uniform1f(U.waveInit.uDT, params.dt);

  gl.uniform2f(U.waveInit.uPacketPosFrac, params.packetX, params.packetY);
  gl.uniform1f(U.waveInit.uPacketSigmaPx, params.packetSigma);

  gl.uniform1f(U.waveInit.uBarrierYFrac, params.barrierY);
  gl.uniform1f(U.waveInit.uBarrierThickPx, params.barrierThick);
  gl.uniform1f(U.waveInit.uV0, params.V0);

  gl.uniform1f(U.waveInit.uAbsorbPx, params.absorbPx);
  gl.uniform1f(U.waveInit.uAbsorbStrength, params.absorbStrength);
}

function setWaveStepUniforms(srcTex) {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, srcTex);
  gl.uniform1i(U.waveStep.uState, 0);

  gl.uniform2i(U.waveStep.uSimRes, simW, simH);
  gl.uniform1f(U.waveStep.uHBAR, params.hbar);
  gl.uniform1f(U.waveStep.uMass, params.mass);
  gl.uniform1f(U.waveStep.uDT, params.dt);

  gl.uniform1f(U.waveStep.uBarrierYFrac, params.barrierY);
  gl.uniform1f(U.waveStep.uBarrierThickPx, params.barrierThick);
  gl.uniform1f(U.waveStep.uV0, params.V0);

  gl.uniform1f(U.waveStep.uAbsorbPx, params.absorbPx);
  gl.uniform1f(U.waveStep.uAbsorbStrength, params.absorbStrength);
}

function resetWave() {
  gl.bindVertexArray(vaoEmpty);
  gl.viewport(0, 0, simW, simH);

  gl.useProgram(progWaveInit);
  setWaveInitUniforms();

  gl.bindFramebuffer(gl.FRAMEBUFFER, fboA);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  flip = 0;
}

function waveStep() {
  const src = flip ? texB : texA;
  const dst = flip ? fboA : fboB;

  gl.useProgram(progWaveStep);
  setWaveStepUniforms(src);

  gl.bindVertexArray(vaoEmpty);
  gl.bindFramebuffer(gl.FRAMEBUFFER, dst);
  gl.viewport(0, 0, simW, simH);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  flip = 1 - flip;
}

function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function rebuildParticles() {
  const n = Math.floor(params.nParticles);

  if (particleSrc) gl.deleteBuffer(particleSrc);
  if (particleDst) gl.deleteBuffer(particleDst);
  if (vaoParticles) gl.deleteVertexArray(vaoParticles);
  if (tf) gl.deleteTransformFeedback(tf);

  particleSrc = gl.createBuffer();
  particleDst = gl.createBuffer();

  const data = new Float32Array(n * 4);

  const sigma1D = params.packetSigma / Math.sqrt(2);
  const x0 = params.packetX * simW;
  const y0 = params.packetY * simH;

  for (let i = 0; i < n; i++) {
    let x = x0 + randn() * sigma1D;
    let y = y0 + randn() * sigma1D;
    x = Math.max(0, Math.min(simW - 1, x));
    y = Math.max(0, Math.min(simH - 1, y));
    data[i * 4 + 0] = x;
    data[i * 4 + 1] = y;
    data[i * 4 + 2] = 1.0;
    data[i * 4 + 3] = 0.0;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, particleSrc);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, particleDst);
  gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW);

  vaoParticles = gl.createVertexArray();
  gl.bindVertexArray(vaoParticles);
  gl.bindBuffer(gl.ARRAY_BUFFER, particleSrc);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 16, 0);
  gl.bindVertexArray(null);

  tf = gl.createTransformFeedback();
}

function particleUpdate() {
  const n = Math.floor(params.nParticles);
  const waveTex = flip ? texB : texA;

  gl.useProgram(progPartUpdate);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, waveTex);
  gl.uniform1i(U.partUpdate.uState, 0);

  gl.uniform2i(U.partUpdate.uSimRes, simW, simH);
  gl.uniform1f(U.partUpdate.uHBAR, params.hbar);
  gl.uniform1f(U.partUpdate.uMass, params.mass);
  gl.uniform1f(U.partUpdate.uDT, params.dt);
  gl.uniform1i(U.partUpdate.uGuidingMode, params.guidingMode | 0);
  gl.uniform1f(U.partUpdate.uSpinMagnitude, params.spinMagnitude);
  gl.uniform1f(U.partUpdate.uSpinSign, params.spinSign);

  gl.uniform1f(U.partUpdate.uAbsorbPx, params.absorbPx);
  gl.uniform1f(U.partUpdate.uParticleKillMarginPx, params.particleKillMargin);
  gl.uniform1f(U.partUpdate.uRhoMin, params.rhoMin);
  gl.uniform1f(U.partUpdate.uVelClamp, params.velClamp);

  gl.bindVertexArray(vaoParticles);

  gl.enable(gl.RASTERIZER_DISCARD);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, particleDst);

  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, n);
  gl.endTransformFeedback();

  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
  gl.disable(gl.RASTERIZER_DISCARD);

  [particleSrc, particleDst] = [particleDst, particleSrc];
  gl.bindBuffer(gl.ARRAY_BUFFER, particleSrc);
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 16, 0);
  gl.bindVertexArray(null);
}

const LN2 = Math.log(2);
function fadeFromHalfLife(halfLife, dtTotal) {
  if (halfLife <= 0) return 0.0;
  return Math.exp(-LN2 * (dtTotal / halfLife));
}

function rebuildDensity() {
  densW = canvas.width;
  densH = canvas.height;

  densTexA = makeTexRGBA16F(densW, densH);
  densTexB = makeTexRGBA16F(densW, densH);
  densFboA = makeFBO(densTexA);
  densFboB = makeFBO(densTexB);
  densFlip = 0;

  clearDensity();
}

function clearDensity() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, densFboA);
  gl.viewport(0, 0, densW, densH);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindFramebuffer(gl.FRAMEBUFFER, densFboB);
  gl.viewport(0, 0, densW, densH);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  densFlip = 0;
}

function densityStepAndStamp() {
  const dtTotal = params.dt * Math.floor(params.stepsPerFrame);

  const src = densFlip ? densTexB : densTexA;
  const dstFbo = densFlip ? densFboA : densFboB;

  const fade = fadeFromHalfLife(params.trailHalfLife, dtTotal);

  gl.useProgram(progDensityStep);
  gl.bindVertexArray(vaoEmpty);
  gl.bindFramebuffer(gl.FRAMEBUFFER, dstFbo);
  gl.viewport(0, 0, densW, densH);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, src);
  gl.uniform1i(U.densityStep.uPrev, 0);
  gl.uniform1f(U.densityStep.uFade, fade);

  gl.disable(gl.BLEND);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.colorMask(true, false, false, false);

  gl.useProgram(progPartStamp);
  gl.bindVertexArray(vaoParticles);

  gl.uniform2i(U.partStamp.uSimRes, simW, simH);
  gl.uniform1f(U.partStamp.uPointSize, params.dotSize);
  gl.uniform1f(U.partStamp.uDotSigma, params.dotSigma);
  gl.uniform1f(U.partStamp.uDotGain, params.dotGain);
  gl.uniform1f(U.partStamp.uStampGain, params.trailStampGain);
  gl.uniform1i(U.partStamp.uNumParticles, params.nParticles);
  gl.uniform1f(U.partStamp.uTrailWidth, params.trailWidth);

  gl.drawArrays(gl.POINTS, 0, Math.floor(params.nParticles));

  gl.colorMask(true, true, true, true);
  gl.disable(gl.BLEND);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindVertexArray(null);

  densFlip = 1 - densFlip;
}

function computeBarrierOpacity() {
  if (params.V0 <= 0) return 0.0;
  const t = Math.min(1.0, params.V0 / BARRIER_V0_MAX);
  return 0.85 * t;
}

function isBarrierClassicallyForbidden() {
  const kineticEnergy = (params.p0 * params.p0) / (2 * params.mass);
  return params.V0 > kineticEnergy;
}

function drawKillBoundary() {

  const base = params.absorbPx + params.particleKillMargin;
  const absDistX = 1.5 * base;
  const absDistY = 1.0 * base;
  const freezeDistX = 1.5 * absDistX;
  const freezeDistY = 1.5 * absDistY;

  const scaleX = canvas.width / simW;
  const scaleY = canvas.height / simH;

  const leftBoundaryX = freezeDistX * 1.20 * scaleX;
  const rightBoundaryX = (simW - freezeDistX) * scaleX;
  const topBoundaryY = freezeDistY * scaleY;
  const bottomBoundaryY = (simH - freezeDistY) * scaleY;

  if (!progBoundary) {
    const vsSource = `#version 300 es
      precision mediump float;
      in vec2 aPos;
      uniform vec4 uBoundaryRect;
      out vec2 vPos;
      void main() {
        vPos = aPos;
        float x = mix(uBoundaryRect.x, uBoundaryRect.z, aPos.x * 0.5 + 0.5);
        float y = mix(uBoundaryRect.y, uBoundaryRect.w, aPos.y * 0.5 + 0.5);
        gl_Position = vec4(x, y, 0.0, 1.0);
      }
    `;
    const fsSource = `#version 300 es
      precision mediump float;
      uniform vec4 uBoundaryColor;
      out vec4 outColor;
      void main() {
        outColor = uBoundaryColor;
      }
    `;

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    progBoundary = link(vs, fs);
  }

  if (!vaoKillBoundary) {
    vaoKillBoundary = gl.createVertexArray();
    boundaryBuffer = gl.createBuffer();

    const rectVertices = new Float32Array([
      -1, -1,
       1, -1,
       1,  1,
      -1, -1,
       1,  1,
      -1,  1,
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, boundaryBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rectVertices, gl.STATIC_DRAW);

    gl.bindVertexArray(vaoKillBoundary);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
    gl.bindVertexArray(null);
  }

  const boundaryThickness = 2;

  const canvasToNDCX = (px) => (px * 2 / canvas.width) - 1;
  const canvasToNDCY = (py) => 1 - (py * 2 / canvas.height);

  gl.useProgram(progBoundary);
  gl.bindVertexArray(vaoKillBoundary);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let comp = PALETTE_COMPLEMENTS[params.paletteId | 0] || [1,1,1];
  const alpha = 0.15;
  const colorLoc = gl.getUniformLocation(progBoundary, 'uBoundaryColor');
  gl.uniform4f(colorLoc, comp[0], comp[1], comp[2], alpha);

  const boundaryRectLoc = gl.getUniformLocation(progBoundary, 'uBoundaryRect');

  gl.uniform4f(
    boundaryRectLoc,
    canvasToNDCX(leftBoundaryX),
    -1,
    canvasToNDCX(leftBoundaryX + boundaryThickness),
    1
  );
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.uniform4f(
    boundaryRectLoc,
    canvasToNDCX(rightBoundaryX - boundaryThickness),
    -1,
    canvasToNDCX(rightBoundaryX),
    1
  );
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.uniform4f(
    boundaryRectLoc,
    -1,
    canvasToNDCY(topBoundaryY),
    1,
    canvasToNDCY(topBoundaryY + boundaryThickness)
  );
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.uniform4f(
    boundaryRectLoc,
    -1,
    canvasToNDCY(bottomBoundaryY - boundaryThickness),
    1,
    canvasToNDCY(bottomBoundaryY)
  );
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.disable(gl.BLEND);
  gl.bindVertexArray(null);
}

function render() {
  const waveTex = flip ? texB : texA;
  const densTex = densFlip ? densTexB : densTexA;

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.disable(gl.BLEND);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(progWaveRender);
  gl.bindVertexArray(vaoEmpty);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, waveTex);
  gl.uniform1i(U.waveRender.uState, 0);

  gl.uniform2i(U.waveRender.uSimRes, simW, simH);
  gl.uniform1f(U.waveRender.uVisGain, params.visGain);
  gl.uniform1f(U.waveRender.uVisGamma, params.visGamma);
  gl.uniform1i(U.waveRender.uShowPhase, params.showPhase);

  gl.uniform1f(U.waveRender.uBarrierYFrac, params.barrierY);
  gl.uniform1f(U.waveRender.uBarrierThickPx, params.barrierThick);

  gl.uniform1i(U.waveRender.uPaletteId, params.paletteId | 0);

  if (U.waveRender.uBarrierOpacity) {
    gl.uniform1f(U.waveRender.uBarrierOpacity, computeBarrierOpacity());
  }
  if (U.waveRender.uBarrierClassicallyForbidden) {
    gl.uniform1f(U.waveRender.uBarrierClassicallyForbidden, isBarrierClassicallyForbidden() ? 1.0 : 0.0);
  }

  gl.drawArrays(gl.TRIANGLES, 0, 3);

  if (params.showTrail) {
    gl.enable(gl.BLEND);

    if (params.trailBlendMode === 0) {

      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    } else if (params.trailBlendMode === 1) {

      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR);
    } else if (params.trailBlendMode === 2) {

      gl.blendFunc(gl.ONE, gl.ONE);

    }

    gl.useProgram(progDensityRender);
    gl.bindVertexArray(vaoEmpty);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, densTex);
    gl.uniform1i(U.densityRender.uDensity, 0);

    gl.uniform1f(U.densityRender.uGain, params.trailVisGain);
    gl.uniform1f(U.densityRender.uGamma, params.trailVisGamma);
    gl.uniform1i(U.densityRender.uPaletteId, params.paletteId | 0);
    gl.uniform1i(U.densityRender.uBlendMode, params.trailBlendMode | 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.disable(gl.BLEND);
  }

  drawKillBoundary();

  if (params.showParticles) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.useProgram(progPartView);
    gl.bindVertexArray(vaoParticles);

    gl.uniform2i(U.partView.uSimRes, simW, simH);
    gl.uniform1f(U.partView.uPointSize, params.dotSize);
    gl.uniform1f(U.partView.uDotSigma, params.dotSigma);
    gl.uniform1f(U.partView.uDotGain, params.dotGain);
    gl.uniform1i(U.partView.uPaletteId, params.paletteId | 0);

    gl.drawArrays(gl.POINTS, 0, Math.floor(params.nParticles));

    gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
  }
}

function guidingModeLabel() {
  if ((params.guidingMode | 0) === 1) {
    return `${GUIDING_MODE_NAMES[1]} (${params.spinSign > 0 ? "up" : "down"}, |s| = ${fmt(params.spinMagnitude)} hbar)`;
  }
  return GUIDING_MODE_NAMES[params.guidingMode | 0] ?? GUIDING_MODE_NAMES[0];
}

function updateStats() {
  statsEl.innerHTML =
    `<b>Guiding</b>: ${guidingModeLabel()}<br>` +
    `<b>Sim Grid</b>: ${simW} x ${simH} (${fmt(params.simScale)}x)`;
}

function rebuildSimulation() {
  resizeCanvas();

  simW = Math.max(64, Math.floor(canvas.width * params.simScale));
  simH = Math.max(64, Math.floor(canvas.height * params.simScale));

  texA = makeTexFloat32(simW, simH);
  texB = makeTexFloat32(simW, simH);
  fboA = makeFBO(texA);
  fboB = makeFBO(texB);
  flip = 0;

  resetWave();
  rebuildParticles();
  rebuildDensity();
}

function resetAll() {
  resetWave();
  rebuildParticles();
  clearDensity();
}

window.addEventListener("resize", () => {
  rebuildSimulation();
  applyViewTransform();
});

async function main() {
  await loadShaders();
  buildPrograms();
  rebuildSimulation();
  updateStats();

  params.trailHalfLife*=0.99;

  requestAnimationFrame(function loop() {
    resizeCanvas();

    if (!paused) {
      const steps = Math.floor(params.stepsPerFrame);
      for (let i = 0; i < steps; i++) {
        waveStep();
        particleUpdate();
      }
      densityStepAndStamp();
    }

    render();
    requestRecordingFrameAfterRender();
    updateStats();
    requestAnimationFrame(loop);
  });
}

main().catch(err => {
  console.error(err);
  alert(String(err));
});
