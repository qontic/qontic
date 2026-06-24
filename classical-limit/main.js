const canvas = document.getElementById("c");
const credit = document.getElementById("credit");

function setStatus(message) {
  if (credit) credit.textContent = message;
}

function failStartup(message) {
  setStatus(message);
  alert(message);
  throw new Error(message);
}

if (!navigator.gpu) {
  failStartup("WebGPU is not available. Use a current Chrome/Edge desktop build.");
}

setStatus("Requesting WebGPU adapter...");
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  failStartup("No WebGPU adapter found. Enable WebGPU or try another browser/GPU.");
}

setStatus("Starting WebGPU device...");
const device = await adapter.requestDevice();
device.lost.then((info) => {
  console.error("WebGPU device lost:", info);
});

const context = canvas.getContext("webgpu");
if (!context) {
  failStartup("Could not create a WebGPU canvas context.");
}

const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
const trailFormat = "rgba16float";

const params = {
  simScale: 1.0,
  stepsPerFrame: 120,

  classicality: 0.0,
  classicalSpeed: 8.0,
  velocityAngleDeg: 45.0,
  particleSeed: 1,
  packetSpread: 1.0,

  hbar: 24.0,
  mass: 0.25,
  p0: 2.0,
  dt: 0.002,

  packetX: 0.55,
  packetY: 0.5,
  packetSigma: 72.0,
  doubleGaussian: 0,
  gaussianSeparation: 200.0,

  rhoMin: 1e-6,
  velClamp: 180.0,
  boundaryMode: 0,

  visGain: 20.0,
  visGamma: 0.5,
  densityMaskLow: 0.0,
  densityMaskHigh: 0.0,
  showWave: 1,
  particleMode: 0,
  showPhase: 1,

  showParticles: 1,
  nParticles: 1,
  dotSize: 30.0,
  dotSigma: 0.28,
  dotGain: 1.0,

  showTrail: 1,
  trailHalfLife: 1558.0,
  trailVisGain: 0.5,
  trailVisGamma: 0.6,
  trailStampGain: 0.55,
  trailWidth: 19.0,
  trailBlendMode: 1,

  paletteId: 5,
};

const urlParams = new URLSearchParams(window.location.search);
const isEmbedded = urlParams.get("embed") === "1";

const REGIME_PRESETS = {
  quantum: {
    id: "quantum",
    label: "Quantum packet",
    shortLabel: "Quantum",
    classicality: 0.0,
    simScale: 1.0,
    showWave: 1,
    particleMode: 0,
    showPhase: 1,
    speed: 8.0,
    hbar: 24.0,
    hbarOverMass: 96.0,
    packetSigma: 72.0,
    densityMaskLow: 0.0,
    densityMaskHigh: 0.0,
    dt: 0.002,
    stepsPerFrame: 120,
  },
  classical: {
    id: "classical",
    label: "Semi-Quantum",
    shortLabel: "Semi-Quantum",
    classicality: 1.0,
    simScale: 3.0,
    showWave: 1,
    particleMode: 0,
    showPhase: 1,
    speed: 4.0,
    hbar: 0.18,
    hbarOverMass: 12.0,
    packetSigma: 96.0,
    densityMaskLow: 0.00003,
    densityMaskHigh: 0.0006,
    dt: 0.018,
    stepsPerFrame: 25,
  },
  "recording-classical": {
    id: "recording-classical",
    label: "Semi-Classical",
    shortLabel: "Semi-Classical",
    classicality: 1.0,
    simScale: 4.0,
    showWave: 1,
    particleMode: 0,
    showPhase: 0,
    speed: 2.35,
    hbar: 0.018,
    hbarOverMass: 2.2,
    packetSigma: 44.0,
    densityMaskLow: 0.003,
    densityMaskHigh: 0.02,
    paletteId: 10,
    dt: 0.05,
    stepsPerFrame: 25,
  },
  "classical-particle": {
    id: "classical-particle",
    label: "Classical",
    shortLabel: "Classical",
    classicality: 1.0,
    simScale: 1.0,
    showWave: 0,
    particleMode: 1,
    showPhase: 0,
    speed: 10.0,
    hbar: 0.012,
    hbarOverMass: 0.8,
    packetSigma: 24.0,
    densityMaskLow: 1.0,
    densityMaskHigh: 1.0,
    dt: 0.05,
    stepsPerFrame: 5,
    nParticles: 1,
    showParticles: 1,
    showTrail: 1,
  },
};

const PRESET_ORDER = ["quantum", "classical", "recording-classical", "classical-particle"];

function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

function clampViewCenter() {
  if (viewState.zoom <= 1.0001) {
    viewState.zoom = 1.0;
    viewState.centerX = 0.5;
    viewState.centerY = 0.5;
    return;
  }

  const half = 0.5 / viewState.zoom;
  viewState.centerX = Math.min(1 - half, Math.max(half, viewState.centerX));
  viewState.centerY = Math.min(1 - half, Math.max(half, viewState.centerY));
}

let activePresetId = "quantum";
let presetNameReadout = null;
const presetButtons = new Map();
const controlSetters = new Map();

function getActivePreset() {
  return REGIME_PRESETS[activePresetId] || REGIME_PRESETS.quantum;
}

function syncPresetUI() {
  const preset = getActivePreset();
  if (presetNameReadout) {
    presetNameReadout.textContent = `version: ${preset.label}`;
  }
  for (const [id, button] of presetButtons) {
    button.classList.toggle("selected", id === activePresetId);
  }
  for (const setter of controlSetters.values()) {
    setter();
  }
}

function applyRegimePreset(presetId = activePresetId) {
  const preset = REGIME_PRESETS[presetId] || REGIME_PRESETS.quantum;
  activePresetId = preset.id;

  params.classicality = preset.classicality;
  params.simScale = preset.simScale;
  params.showWave = preset.showWave;
  params.particleMode = preset.particleMode;
  params.showPhase = preset.showPhase;
  params.classicalSpeed = preset.speed;
  params.packetSpread = 1.0;
  params.hbar = preset.hbar;
  params.mass = preset.hbar / preset.hbarOverMass;
  params.p0 = preset.speed * params.mass;
  params.packetSigma = preset.packetSigma;
  params.densityMaskLow = preset.densityMaskLow;
  params.densityMaskHigh = preset.densityMaskHigh;
  params.paletteId = preset.paletteId ?? 5;
  params.dt = preset.dt;
  params.stepsPerFrame = preset.stepsPerFrame;
  params.boundaryMode = 0;
  params.doubleGaussian = 0;
  if (preset.nParticles !== undefined) params.nParticles = preset.nParticles;
  if (preset.showParticles !== undefined) params.showParticles = preset.showParticles;
  if (preset.showTrail !== undefined) params.showTrail = preset.showTrail;
  syncPresetUI();
}

let simW = 0;
let simH = 0;
const viewState = {
  centerX: 0.5,
  centerY: 0.5,
  zoom: 1.0,
};

const urlMode = (urlParams.get("mode") || "").toLowerCase();
const modeAliases = {
  recording: "recording-classical",
  "deep-classical": "recording-classical",
  "ultra-classical": "recording-classical",
  particle: "classical-particle",
  "hard-wall": "classical-particle",
  "pure-classical": "classical-particle",
};
const requestedMode = modeAliases[urlMode] || urlMode;
if (REGIME_PRESETS[requestedMode]) {
  activePresetId = requestedMode;
} else {
  const urlClassicality = parseFloat(urlParams.get("classicality"));
  if (Number.isFinite(urlClassicality)) {
    activePresetId = clamp01(urlClassicality) >= 0.5 ? "classical" : "quantum";
  }
}

applyRegimePreset();

const urlAngle = parseFloat(urlParams.get("angle"));
if (Number.isFinite(urlAngle)) {
  params.velocityAngleDeg = Math.min(90.0, Math.max(-90.0, urlAngle));
}

const urlSeed = parseInt(urlParams.get("seed"), 10);
if (Number.isFinite(urlSeed)) {
  params.particleSeed = Math.max(1, Math.min(999999, urlSeed));
}

function isControlFixed(key) {
  return false;
}

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
  chunks: [],
  startedAt: 0,
  mimeType: "",
  finalizing: false,
  lastUrl: null,
};

const controls = document.getElementById("controls");

function fmt(v) {
  const av = Math.abs(v);
  if (av >= 1000 || (av > 0 && av < 0.01)) return v.toExponential(2);
  return v.toFixed(3).replace(/\.?0+$/, "");
}

function addSlider(key, label, min, max, step, onChange = null) {
  if (isControlFixed(key)) return;

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
  controlSetters.set(key, () => {
    input.value = params[key];
    val.textContent = fmt(params[key]);
  });

  input.addEventListener("input", () => {
    const v = parseFloat(input.value);
    params[key] = v;
    if (key === "classicalSpeed" || key === "packetSpread") {
      applyRegimePreset();
      updateUniforms();
    }
    val.textContent = fmt(v);
  });
  input.addEventListener("change", () => onChange && onChange());

  row.appendChild(lab);
  row.appendChild(input);
  row.appendChild(val);
  controls.appendChild(row);
}

function addNumberInput(key, label, min, max, step, onChange = null) {
  if (isControlFixed(key)) return;

  const row = document.createElement("div");
  row.className = "row";

  const lab = document.createElement("label");
  lab.textContent = label;

  const input = document.createElement("input");
  input.type = "number";
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = params[key];
  input.style.flex = "1";
  input.style.minWidth = "0";
  input.style.background = "rgba(5,16,36,0.72)";
  input.style.border = "1px solid rgba(132,192,255,0.26)";
  input.style.borderRadius = "6px";
  input.style.color = "#fff";
  input.style.padding = "6px 8px";

  const val = document.createElement("div");
  val.className = "val";
  val.textContent = "";

  controlSetters.set(key, () => {
    input.value = params[key];
  });

  input.addEventListener("change", () => {
    const parsed = parseInt(input.value, 10);
    const v = Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : params[key];
    params[key] = v;
    input.value = v;
    if (onChange) onChange();
  });

  row.appendChild(lab);
  row.appendChild(input);
  row.appendChild(val);
  controls.appendChild(row);
}

function addPresetControl() {
  const row = document.createElement("div");
  row.className = "row mode-row";

  const lab = document.createElement("label");
  presetNameReadout = lab;

  const group = document.createElement("div");
  group.className = "toggle-group";
  for (const id of PRESET_ORDER) {
    const preset = REGIME_PRESETS[id];
    const button = document.createElement("button");
    button.textContent = preset.shortLabel || preset.label;
    button.title = preset.label;
    button.addEventListener("click", () => {
      if (activePresetId === id) return;
      applyRegimePreset(id);
      rebuildSimulation();
    });
    presetButtons.set(id, button);
    group.appendChild(button);
  }

  row.appendChild(lab);
  row.appendChild(group);
  controls.appendChild(row);

  syncPresetUI();
}

function addToggleInt(key, label, onChange = null) {
  if (isControlFixed(key)) return;

  const row = document.createElement("div");
  row.className = "row";
  const lab = document.createElement("label");
  lab.textContent = label;

  const btn = document.createElement("button");
  btn.style.flex = "1";
  btn.textContent = params[key] ? "ON" : "OFF";
  controlSetters.set(key, () => {
    btn.textContent = params[key] ? "ON" : "OFF";
  });
  btn.addEventListener("click", () => {
    params[key] = params[key] ? 0 : 1;
    btn.textContent = params[key] ? "ON" : "OFF";
    updateUniforms();
    if (onChange) onChange(params[key]);
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
  header.className = "section-header";
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

function removeEmptySectionHeaders() {
  for (const header of controls.querySelectorAll(".section-header")) {
    let sibling = header.nextElementSibling;
    let hasControl = false;

    while (sibling && !sibling.classList.contains("section-header")) {
      if (sibling.classList.contains("row")) {
        hasControl = true;
        break;
      }
      sibling = sibling.nextElementSibling;
    }

    if (!hasControl) header.remove();
  }
}

addSectionHeader("Regime");
addPresetControl();
addSlider("velocityAngleDeg", "velocity angle", -90.0, 90.0, 1.0, () => {
  resetAll();
});
addNumberInput("particleSeed", "particle seed", 1, 999999, 1, () => resetAll());

addSectionHeader("Visual Parameters");
addToggleInt("showPhase", "show phase");
addToggleInt("showParticles", "show particles");
addSlider("nParticles", "particle count", 1, 300, 1, () => resetAll());
//addSlider("dotSize", "particle size", 2.0, 16.0, 0.5);
//addSlider("dotGain", "particle brightness", 0.1, 3.0, 0.1);

//addToggleInt("showTrail", "draw trails");
//addSlider("trailHalfLife", "trail half-life", 1.0, 100.0, 1.0);
//addSlider("trailWidth", "trail width (px)", 3, 10.0, 1);

removeEmptySectionHeaders();

document.getElementById("reset").onclick = () => resetAll();
const pauseButton = document.getElementById("pause");
const recordButton = document.getElementById("record");

function setPaused(nextPaused) {
  paused = Boolean(nextPaused);
  pauseButton.textContent = paused ? "Resume" : "Pause";
}

function togglePause() {
  setPaused(!paused);
}

pauseButton.onclick = togglePause;
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
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return candidates.find(type => MediaRecorder.isTypeSupported?.(type)) || "";
}

function recordingExtension(mimeType = recordingState.mimeType) {
  return mimeType.includes("webm") ? "webm" : "mp4";
}

function recordingFileName(startedAt = recordingState.startedAt) {
  const stamp = new Date(startedAt || Date.now()).toISOString().replace(/[:.]/g, "-");
  return `classical-limit-${stamp}.${recordingExtension()}`;
}

function syncRecordingButton() {
  const recording = isRecording();
  const supported = canRecordCanvas();
  recordButton.textContent = recordingState.finalizing
    ? "Saving Recording..."
    : (recording ? "Stop Recording" : "Start Recording");
  recordButton.classList.toggle("recording", recording);
  recordButton.disabled = recordingState.finalizing || !supported;
  recordButton.title = supported
    ? "Records the WebGPU canvas at a fixed 60 fps; UI overlays are excluded."
    : "Canvas recording is not supported by this browser.";
}

function toggleRecording() {
  if (isRecording()) stopRecording();
  else startRecording();
}

function startRecording() {
  if (!canRecordCanvas()) {
    alert("Canvas recording is not supported by this browser.");
    syncRecordingButton();
    return;
  }
  clearRecordingUrl();

  const mimeType = chooseRecordingMimeType();
  const options = {
    mimeType,
    videoBitsPerSecond: RECORDING_CONFIG.videoBitsPerSecond,
  };

  let stream;
  let recorder;
  try {
    stream = canvas.captureStream(RECORDING_CONFIG.fps);
    recorder = new MediaRecorder(stream, options);
  } catch (error) {
    stream?.getTracks().forEach(track => track.stop());
    alert(`Could not start canvas recording: ${error.message}`);
    syncRecordingButton();
    return;
  }

  recordingState.recorder = recorder;
  recordingState.stream = stream;
  recordingState.videoTrack = stream.getVideoTracks()[0] || null;
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
  const chunks = recordingState.chunks;
  recordingState.chunks = [];

  if (!chunks.length) {
    recordingState.recorder = null;
    recordingState.finalizing = false;
    alert("No recording data was produced.");
    syncRecordingButton();
    return;
  }

  const blob = new Blob(chunks, { type: recordingState.mimeType || chooseRecordingMimeType() || "video/mp4" });
  const fileName = recordingFileName();
  recordingState.recorder = null;
  recordingState.finalizing = false;
  downloadRecordingBlob(blob, fileName);
  syncRecordingButton();
}

function clearRecordingUrl() {
  if (recordingState.lastUrl) {
    URL.revokeObjectURL(recordingState.lastUrl);
    recordingState.lastUrl = null;
  }
}

function downloadRecordingBlob(blob, fileName) {
  clearRecordingUrl();
  recordingState.lastUrl = URL.createObjectURL(blob);
  const url = recordingState.lastUrl;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName || recordingFileName();
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => {
    if (recordingState.lastUrl === url) clearRecordingUrl();
  }, 1000);
}

recordButton.onclick = toggleRecording;
syncRecordingButton();

window.addEventListener("beforeunload", () => {
  if (isRecording()) {
    recordingState.stream?.getTracks().forEach(track => track.stop());
  }
  clearRecordingUrl();
});

window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r") resetAll();
  if (e.key === " ") togglePause();
});

if (isEmbedded) {
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type !== "qontic:set-paused" || !event.data.paused) return;
    setPaused(true);
  });
}

const uiBody = document.getElementById("uibody");
const minBtn = document.getElementById("minui");
minBtn.textContent = "-";

let uiMinimized = false;
minBtn.onclick = () => {
  uiMinimized = !uiMinimized;
  uiBody.style.display = uiMinimized ? "none" : "block";
  minBtn.textContent = uiMinimized ? "+" : "-";
};

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();

  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  const mouseUvX = (event.clientX - rect.left) / rect.width;
  const mouseUvY = (event.clientY - rect.top) / rect.height;
  const oldZoom = viewState.zoom;
  const zoomFactor = Math.exp(-event.deltaY * 0.0015);
  const newZoom = Math.min(32.0, Math.max(1.0, oldZoom * zoomFactor));

  const worldX = viewState.centerX + (mouseUvX - 0.5) / oldZoom;
  const worldY = viewState.centerY + (mouseUvY - 0.5) / oldZoom;
  viewState.zoom = newZoom;
  viewState.centerX = worldX - (mouseUvX - 0.5) / newZoom;
  viewState.centerY = worldY - (mouseUvY - 0.5) / newZoom;
  clampViewCenter();

  updateUniforms();
  clearTrails();
}, { passive: false });

canvas.addEventListener("dblclick", () => {
  viewState.zoom = 1.0;
  viewState.centerX = 0.5;
  viewState.centerY = 0.5;
  updateUniforms();
  clearTrails();
});

const PARAM_FLOATS = 40;
const paramsArray = new Float32Array(PARAM_FLOATS);
const uniformBuffer = device.createBuffer({
  size: PARAM_FLOATS * 4,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

let waveBuffers = [];
let waveFlip = 0;

let particleBuffers = [];
let particleFlip = 0;

let trailTextures = [];
let trailFlip = 0;

let bindGroupsReady = false;

const commonWGSL = /* wgsl */`
struct Params {
  simSize: vec2<f32>,
  canvasSize: vec2<f32>,
  hbar: f32,
  mass: f32,
  p0: f32,
  dt: f32,
  packetPos: vec2<f32>,
  packetSigma: f32,
  gaussianSep: f32,
  doubleGaussian: f32,
  boundaryMode: f32,
  nParticles: f32,
  rhoMin: f32,
  velClamp: f32,
  visGain: f32,
  visGamma: f32,
  showPhase: f32,
  dotSize: f32,
  dotSigma: f32,
  dotGain: f32,
  stampGain: f32,
  trailWidth: f32,
  trailFade: f32,
  trailGain: f32,
  trailGamma: f32,
  trailBlendMode: f32,
  paletteId: f32,
  densityMask: vec2<f32>,
  viewCenter: vec2<f32>,
  packetDir: vec2<f32>,
  viewScale: f32,
  showWave: f32,
  particleMode: f32,
  _pad2: f32,
}

const PI = 3.14159265359;
const TAU = 6.28318530718;

fn simW(params: Params) -> u32 {
  return max(1u, u32(params.simSize.x));
}

fn simH(params: Params) -> u32 {
  return max(1u, u32(params.simSize.y));
}

fn cellIndex(params: Params, x: u32, y: u32) -> u32 {
  return y * simW(params) + x;
}

fn wrapI(v: i32, size: i32) -> i32 {
  return ((v % size) + size) % size;
}

fn wrapF(v: f32, size: f32) -> f32 {
  return v - floor(v / size) * size;
}

fn cis(a: f32) -> vec2<f32> {
  return vec2<f32>(cos(a), sin(a));
}

fn sqr(x: f32) -> f32 {
  return x * x;
}

fn schrodingerRHS(params: Params, psi: vec2<f32>, lapPsi: vec2<f32>) -> vec2<f32> {
  let cLap = params.hbar / (2.0 * params.mass);
  return vec2<f32>(-cLap * lapPsi.y, cLap * lapPsi.x);
}

fn reflectIntoBox(params: Params, xIn: vec2<f32>) -> vec2<f32> {
  var x = xIn;
  let maxX = params.simSize - vec2<f32>(1.0, 1.0);
  if (x.x < 0.0) { x.x = -x.x; }
  if (x.x > maxX.x) { x.x = 2.0 * maxX.x - x.x; }
  if (x.y < 0.0) { x.y = -x.y; }
  if (x.y > maxX.y) { x.y = 2.0 * maxX.y - x.y; }
  return clamp(x, vec2<f32>(0.0, 0.0), maxX);
}

fn applyBoundary(params: Params, xIn: vec2<f32>) -> vec2<f32> {
  if (i32(params.boundaryMode + 0.5) == 1) {
    return vec2<f32>(wrapF(xIn.x, params.simSize.x), wrapF(xIn.y, params.simSize.y));
  }
  return reflectIntoBox(params, xIn);
}

struct FullscreenOut {
  @builtin(position) pos: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@vertex
fn fullscreenVS(@builtin(vertex_index) vertexIndex: u32) -> FullscreenOut {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0)
  );
  var out: FullscreenOut;
  let p = pos[vertexIndex];
  out.pos = vec4<f32>(p, 0.0, 1.0);
  out.uv = vec2<f32>(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  return out;
}
`;

const waveInitWGSL = /* wgsl */`
${commonWGSL}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read_write> waveA: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> waveB: array<vec4<f32>>;

fn packetAngularFrequency() -> f32 {
  let k = params.p0 / params.hbar;
  let kd = k * params.packetDir;
  let omegaFD = (params.hbar / params.mass) * ((1.0 - cos(kd.x)) + (1.0 - cos(kd.y)));
  let omegaDt = asin(clamp(params.dt * omegaFD, -0.999, 0.999));
  return omegaDt / max(params.dt, 1.0e-6);
}

fn initialPacketAtPx(xPx: vec2<f32>, t: f32) -> vec2<f32> {
  let x0 = params.packetPos * params.simSize;
  let k = params.p0 / params.hbar;
  let dir = params.packetDir;
  let phaseTime = -packetAngularFrequency() * t;

  if (i32(params.doubleGaussian + 0.5) != 0) {
    let sep = params.gaussianSep * 0.5;
    let d1 = xPx - x0 - vec2<f32>(0.0, -sep);
    let d2 = xPx - x0 - vec2<f32>(0.0,  sep);
    let amp1 = exp(-dot(d1, d1) / (2.0 * sqr(params.packetSigma)));
    let amp2 = exp(-dot(d2, d2) / (2.0 * sqr(params.packetSigma)));
    let psi1 = amp1 * cis(k * dot(dir, d1) + phaseTime);
    let psi2 = amp2 * cis(k * dot(dir, d2) + phaseTime);
    return (psi1 + psi2) / sqrt(2.0);
  }

  let d = xPx - x0;
  let amp = exp(-dot(d, d) / (2.0 * sqr(params.packetSigma)));
  return amp * cis(k * dot(dir, d) + phaseTime);
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= simW(params) || gid.y >= simH(params)) {
    return;
  }

  let xPx = vec2<f32>(f32(gid.x), f32(gid.y));
  let psi0 = initialPacketAtPx(xPx, 0.0);
  let psiPrev = initialPacketAtPx(xPx, -params.dt);
  let state = vec4<f32>(psi0, psiPrev);
  let idx = cellIndex(params, gid.x, gid.y);
  waveA[idx] = state;
  waveB[idx] = state;
}
`;

const waveStepWGSL = /* wgsl */`
${commonWGSL}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> waveSrc: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> waveDst: array<vec4<f32>>;

fn fetchPsi(q: vec2<i32>) -> vec2<f32> {
  let w = i32(simW(params));
  let h = i32(simH(params));
  if (i32(params.boundaryMode + 0.5) == 1) {
    let x = u32(wrapI(q.x, w));
    let y = u32(wrapI(q.y, h));
    return waveSrc[cellIndex(params, x, y)].xy;
  }
  if (q.x < 0 || q.y < 0 || q.x >= w || q.y >= h) {
    return vec2<f32>(0.0, 0.0);
  }
  return waveSrc[cellIndex(params, u32(q.x), u32(q.y))].xy;
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= simW(params) || gid.y >= simH(params)) {
    return;
  }

  let p = vec2<i32>(i32(gid.x), i32(gid.y));
  let state = waveSrc[cellIndex(params, gid.x, gid.y)];
  let psi = state.xy;
  let psiPrev = state.zw;
  let psiE = fetchPsi(p + vec2<i32>( 1,  0));
  let psiW = fetchPsi(p + vec2<i32>(-1,  0));
  let psiN = fetchPsi(p + vec2<i32>( 0,  1));
  let psiS = fetchPsi(p + vec2<i32>( 0, -1));
  let lapPsi = psiE + psiW + psiN + psiS - 4.0 * psi;
  let rhs = schrodingerRHS(params, psi, lapPsi);
  let psiNext = psiPrev + 2.0 * params.dt * rhs;
  waveDst[cellIndex(params, gid.x, gid.y)] = vec4<f32>(psiNext, psi);
}
`;

const particleUpdateWGSL = /* wgsl */`
${commonWGSL}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> wave: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> particleSrc: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> particleDst: array<vec4<f32>>;

fn loadPsi(x: u32, y: u32) -> vec2<f32> {
  return wave[cellIndex(params, x, y)].xy;
}

fn samplePsiBilinear(xIn: vec2<f32>, boundaryMode: i32) -> vec2<f32> {
  var xPx = xIn;
  let size = params.simSize;
  if (boundaryMode == 1) {
    xPx = vec2<f32>(wrapF(xPx.x, size.x), wrapF(xPx.y, size.y));
  } else {
    xPx = clamp(xPx, vec2<f32>(0.0, 0.0), size - vec2<f32>(1.0001, 1.0001));
  }

  let x0f = floor(xPx);
  let f = xPx - x0f;
  let p00 = vec2<u32>(x0f);
  var p10: vec2<u32>;
  var p01: vec2<u32>;
  var p11: vec2<u32>;

  if (boundaryMode == 1) {
    p10 = vec2<u32>(u32(wrapI(i32(p00.x) + 1, i32(simW(params)))), p00.y);
    p01 = vec2<u32>(p00.x, u32(wrapI(i32(p00.y) + 1, i32(simH(params)))));
    p11 = vec2<u32>(p10.x, p01.y);
  } else {
    p10 = vec2<u32>(min(p00.x + 1u, simW(params) - 1u), p00.y);
    p01 = vec2<u32>(p00.x, min(p00.y + 1u, simH(params) - 1u));
    p11 = vec2<u32>(p10.x, p01.y);
  }

  let a = loadPsi(p00.x, p00.y);
  let b = loadPsi(p10.x, p10.y);
  let c = loadPsi(p01.x, p01.y);
  let d = loadPsi(p11.x, p11.y);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

fn schrodingerVelocity(psi: vec2<f32>, dpsidx: vec2<f32>, dpsidy: vec2<f32>, rhoEff: f32) -> vec2<f32> {
  let a = psi.x;
  let b = psi.y;
  let jx = (params.hbar / params.mass) * (a * dpsidx.y - b * dpsidx.x);
  let jy = (params.hbar / params.mass) * (a * dpsidy.y - b * dpsidy.x);
  return vec2<f32>(jx, jy) / rhoEff;
}

fn guidingVelocity(xPx: vec2<f32>, boundaryMode: i32) -> vec2<f32> {
  let psi = samplePsiBilinear(xPx, boundaryMode);
  let psiE = samplePsiBilinear(xPx + vec2<f32>( 1.0,  0.0), boundaryMode);
  let psiW = samplePsiBilinear(xPx + vec2<f32>(-1.0,  0.0), boundaryMode);
  let psiN = samplePsiBilinear(xPx + vec2<f32>( 0.0,  1.0), boundaryMode);
  let psiS = samplePsiBilinear(xPx + vec2<f32>( 0.0, -1.0), boundaryMode);
  let dpsidx = 0.5 * (psiE - psiW);
  let dpsidy = 0.5 * (psiN - psiS);
  let rho = dot(psi, psi);
  let rhoEff = max(rho, params.rhoMin);
  var v = schrodingerVelocity(psi, dpsidx, dpsidy, rhoEff);
  let sp = length(v);
  if (sp > params.velClamp) {
    v *= params.velClamp / sp;
  }
  return v;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u32(params.nParticles)) {
    return;
  }

  let state = particleSrc[i];
  var x = state.xy;
  let mode = state.z;
  if (params.particleMode > 0.5) {
    var v = state.zw;
    if (length(v) < 1.0e-4) {
      v = (params.p0 / params.mass) * params.packetDir;
    }

    let maxX = params.simSize - vec2<f32>(1.0, 1.0);
    var xn = x + params.dt * v;
    if (xn.x < 0.0) {
      xn.x = -xn.x;
      v.x = -v.x;
    } else if (xn.x > maxX.x) {
      xn.x = 2.0 * maxX.x - xn.x;
      v.x = -v.x;
    }
    if (xn.y < 0.0) {
      xn.y = -xn.y;
      v.y = -v.y;
    } else if (xn.y > maxX.y) {
      xn.y = 2.0 * maxX.y - xn.y;
      v.y = -v.y;
    }

    particleDst[i] = vec4<f32>(clamp(xn, vec2<f32>(0.0, 0.0), maxX), v);
    return;
  }

  if (mode < 0.5 || mode > 1.5) {
    particleDst[i] = state;
    return;
  }

  let boundaryMode = i32(params.boundaryMode + 0.5);
  x = applyBoundary(params, x);
  let v1 = guidingVelocity(x, boundaryMode);
  let xm = applyBoundary(params, x + 0.5 * params.dt * v1);
  let v2 = guidingVelocity(xm, boundaryMode);
  let xn = applyBoundary(params, x + params.dt * v2);
  particleDst[i] = vec4<f32>(xn, 1.0, 0.0);
}
`;

const waveRenderWGSL = /* wgsl */`
${commonWGSL}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> wave: array<vec4<f32>>;

fn palette(t: f32, a: vec3<f32>, b: vec3<f32>, c: vec3<f32>, d: vec3<f32>) -> vec3<f32> {
  return a + b * cos(TAU * (c * t + d));
}

fn paletteColor(idIn: i32, t: f32) -> vec3<f32> {
  var id = idIn;
  if (id == 5 && params.showPhase < 0.5) {
    id = 2;
  }

  var a: vec3<f32>;
  var b: vec3<f32>;
  var c = vec3<f32>(1.0, 1.0, 1.0);
  var d: vec3<f32>;

  if (id == 0) {
    a = vec3<f32>(0.08,0.07,0.12); b = vec3<f32>(0.55,0.50,0.70); d = vec3<f32>(0.00,0.15,0.35);
  } else if (id == 1) {
    a = vec3<f32>(0.06,0.02,0.10); b = vec3<f32>(0.85,0.35,0.95); d = vec3<f32>(0.00,0.10,0.25);
  } else if (id == 2) {
    a = vec3<f32>(0.22,0.32,0.28); b = vec3<f32>(0.40,0.45,0.35); d = vec3<f32>(0.15,0.55,0.75);
  } else if (id == 3) {
    a = vec3<f32>(0.10,0.02,0.02); b = vec3<f32>(0.90,0.45,0.20); d = vec3<f32>(0.00,0.08,0.20);
  } else if (id == 4) {
    a = vec3<f32>(0.02,0.05,0.08); b = vec3<f32>(0.40,0.70,0.85); d = vec3<f32>(0.10,0.30,0.55);
  } else if (id == 5) {
    a = vec3<f32>(0.10,0.02,0.12); b = vec3<f32>(0.75,0.15,0.90); d = vec3<f32>(0.00,0.10,0.30);
  } else if (id == 6) {
    a = vec3<f32>(0.05,0.15,0.15); b = vec3<f32>(0.20,0.80,0.60); d = vec3<f32>(0.10,0.40,0.20);
  } else if (id == 7) {
    a = vec3<f32>(0.15,0.05,0.00); b = vec3<f32>(0.95,0.50,0.10); d = vec3<f32>(0.00,0.05,0.15);
  } else if (id == 8) {
    a = vec3<f32>(0.20,0.15,0.10); b = vec3<f32>(0.60,0.50,0.30); d = vec3<f32>(0.10,0.30,0.25);
  } else if (id == 9) {
    a = vec3<f32>(0.02,0.02,0.02); b = vec3<f32>(0.00,0.80,0.80); d = vec3<f32>(0.90,0.10,0.90);
  } else {
    a = vec3<f32>(0.75,0.70,0.80); b = vec3<f32>(0.60,0.85,0.70); d = vec3<f32>(0.10,0.20,0.30);
  }

  return palette(t, a, b, c, d);
}

fn smoothPurpleDensity(tIn: f32) -> vec3<f32> {
  let t = clamp(tIn, 0.0, 1.0);
  let base = vec3<f32>(0.06, 0.005, 0.11);
  let mid = vec3<f32>(0.42, 0.02, 0.70);
  let hot = vec3<f32>(1.00, 0.18, 0.95);
  let a = smoothstep(0.0, 0.65, t);
  let b = smoothstep(0.55, 1.0, t);
  return mix(mix(base, mid, a), hot, b);
}

fn rhoAt(coordIn: vec2<i32>) -> f32 {
  let maxCoord = vec2<i32>(i32(simW(params)) - 1, i32(simH(params)) - 1);
  let coord = vec2<u32>(clamp(coordIn, vec2<i32>(0, 0), maxCoord));
  let psi = wave[cellIndex(params, coord.x, coord.y)].xy;
  return dot(psi, psi);
}

fn blurredRhoAt(coord: vec2<u32>) -> f32 {
  let center = vec2<i32>(i32(coord.x), i32(coord.y));
  var acc = 0.0;
  var weightSum = 0.0;

  for (var oy: i32 = -8; oy <= 8; oy = oy + 2) {
    for (var ox: i32 = -8; ox <= 8; ox = ox + 2) {
      let dist = length(vec2<f32>(f32(ox), f32(oy)));
      let weight = max(0.0, 1.0 - dist / 11.5);
      acc += rhoAt(center + vec2<i32>(ox, oy)) * weight;
      weightSum += weight;
    }
  }

  return acc / max(weightSum, 1.0e-6);
}

@fragment
fn fs(in: FullscreenOut) -> @location(0) vec4<f32> {
  let qView = params.viewCenter + (in.uv - vec2<f32>(0.5, 0.5)) / params.viewScale;
  if (qView.x < 0.0 || qView.y < 0.0 || qView.x >= 1.0 || qView.y >= 1.0) {
    return vec4<f32>(0.0, 0.0, 0.0, 1.0);
  }
  let q = clamp(qView, vec2<f32>(0.0, 0.0), vec2<f32>(0.999999, 0.999999));
  let coord = vec2<u32>(q * params.simSize);
  let psi = wave[cellIndex(params, coord.x, coord.y)].xy;
  let paletteId = i32(params.paletteId + 0.5);
  var rho = dot(psi, psi);
  if (paletteId == 10) {
    rho = blurredRhoAt(coord);
  }
  var intensity = 1.0 - exp(-params.visGain * rho);
  if (params.densityMask.y > params.densityMask.x) {
    intensity *= smoothstep(params.densityMask.x, params.densityMask.y, rho);
  }
  intensity = pow(clamp(intensity, 0.0, 1.0), params.visGamma);

  var col: vec3<f32>;
  if (paletteId == 10) {
    col = smoothPurpleDensity(intensity) * intensity;
  } else if (params.showPhase > 0.5) {
    let ph = atan2(psi.y, psi.x);
    let t = fract((ph + PI) / TAU);
    col = paletteColor(paletteId, t) * intensity;
  } else {
    col = paletteColor(paletteId, intensity) * intensity;
  }

  return vec4<f32>(col, 1.0);
}
`;

const particleRenderWGSL = /* wgsl */`
${commonWGSL}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> particles: array<vec4<f32>>;

struct ParticleOut {
  @builtin(position) pos: vec4<f32>,
  @location(0) local: vec2<f32>,
  @location(1) alive: f32,
}

@vertex
fn vs(@builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instanceIndex: u32) -> ParticleOut {
  var corners = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>( 1.0,  1.0)
  );

  let local = corners[vertexIndex];
  let state = particles[instanceIndex];
  let simUv = state.xy / params.simSize;
  let screenUv = (simUv - params.viewCenter) * params.viewScale + vec2<f32>(0.5, 0.5);
  var ndc = vec2<f32>(screenUv.x * 2.0 - 1.0, 1.0 - screenUv.y * 2.0);
  let pixelOffset = local * params.dotSize * 0.5;
  ndc += vec2<f32>(2.0 * pixelOffset.x / params.canvasSize.x, -2.0 * pixelOffset.y / params.canvasSize.y);

  var out: ParticleOut;
  out.pos = vec4<f32>(ndc, 0.0, 1.0);
  out.local = local;
  out.alive = select(state.z, 1.0, params.particleMode > 0.5);
  return out;
}

fn particleColor() -> vec3<f32> {
  let a = vec3<f32>(0.08, 0.06, 0.02);
  let b = vec3<f32>(1.00, 0.90, 0.40);
  let d = vec3<f32>(0.08, 0.18, 0.28);
  return max(a + b * cos(TAU * (vec3<f32>(0.85, 0.85, 0.85) + d)), vec3<f32>(0.0, 0.0, 0.0));
}

@fragment
fn fs(in: ParticleOut) -> @location(0) vec4<f32> {
  if (in.alive < 0.5) {
    discard;
  }
  let r2 = dot(in.local, in.local);
  if (r2 > 1.0) {
    discard;
  }

  let particleCol = particleColor();
  let softness = clamp(params.dotSigma, 0.08, 0.65);
  let halo = exp(-r2 / softness) * (1.0 - smoothstep(0.72, 1.0, r2));
  let body = 1.0 - smoothstep(0.16, 0.72, r2);
  let core = 1.0 - smoothstep(0.0, 0.13, r2);

  var col = mix(particleCol * 0.72, particleCol * 1.18, body);
  col = mix(col, vec3<f32>(1.0, 0.98, 0.88), core * 0.92);

  var alpha = params.dotGain * (11.72 * halo + 0.78 * body + 0.28 * core);
  alpha = clamp(alpha, 0.0, 0.92);
  return vec4<f32>(col, alpha);
}
`;

const trailFadeWGSL = /* wgsl */`
${commonWGSL}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var trailSrc: texture_2d<f32>;

@fragment
fn fs(in: FullscreenOut) -> @location(0) vec4<f32> {
  let q = clamp(in.uv, vec2<f32>(0.0, 0.0), vec2<f32>(0.999999, 0.999999));
  let coord = vec2<i32>(q * params.canvasSize);
  let prev = max(textureLoad(trailSrc, coord, 0), vec4<f32>(0.0, 0.0, 0.0, 0.0));
  return prev * params.trailFade;
}
`;

const particleStampWGSL = /* wgsl */`
${commonWGSL}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> particles: array<vec4<f32>>;

struct ParticleOut {
  @builtin(position) pos: vec4<f32>,
  @location(0) local: vec2<f32>,
  @location(1) alive: f32,
}

@vertex
fn vs(@builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instanceIndex: u32) -> ParticleOut {
  var corners = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>( 1.0,  1.0)
  );

  let local = corners[vertexIndex];
  let state = particles[instanceIndex];
  let simUv = state.xy / params.simSize;
  let screenUv = (simUv - params.viewCenter) * params.viewScale + vec2<f32>(0.5, 0.5);
  let canvasPos = screenUv * params.canvasSize;
  let pixelOffset = local * params.trailWidth * 0.5;
  let stamped = canvasPos + pixelOffset;
  var ndc = vec2<f32>(
    stamped.x / params.canvasSize.x * 2.0 - 1.0,
    1.0 - stamped.y / params.canvasSize.y * 2.0
  );

  var out: ParticleOut;
  out.pos = vec4<f32>(ndc, 0.0, 1.0);
  out.local = local;
  out.alive = select(state.z, 1.0, params.particleMode > 0.5);
  return out;
}

@fragment
fn fs(in: ParticleOut) -> @location(0) vec4<f32> {
  if (in.alive < 0.5) {
    discard;
  }
  let r = length(in.local);
  if (r > 1.0) {
    discard;
  }

  let edge = smoothstep(1.0, 0.84, r);
  let s = max(params.dotSigma, 1e-4);
  let blur = exp(-(r * r) / s);
  let alpha = clamp(params.dotGain * params.stampGain * blur * edge, 0.0, 1.0);
  return vec4<f32>(1.0, 1.0, 0.0, alpha);
}
`;

const trailRenderWGSL = /* wgsl */`
${commonWGSL}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var trailTex: texture_2d<f32>;

@fragment
fn fs(in: FullscreenOut) -> @location(0) vec4<f32> {
  let q = clamp(in.uv, vec2<f32>(0.0, 0.0), vec2<f32>(0.999999, 0.999999));
  let coord = vec2<i32>(q * params.canvasSize);
  let dacc = max(textureLoad(trailTex, coord, 0), vec4<f32>(0.0, 0.0, 0.0, 0.0));
  let density = max(max(dacc.r, dacc.g), dacc.b);
  let exposure = params.trailGain * density;
  var value = 1.0 - exp(-exposure);
  value = pow(clamp(value, 0.0, 1.0), params.trailGamma);

  var col = vec3<f32>(1.0, 1.0, 0.0);
  let crowded = smoothstep(1.0, 3.0, exposure);
  let oversaturated = smoothstep(3.0, 5.0, exposure);
  col = mix(col, vec3<f32>(1.0, 0.55, 0.08), 0.45 * crowded);
  col = mix(col, vec3<f32>(1.0, 0.35, 0.62), 0.30 * oversaturated);
  return vec4<f32>(col, value);
}
`;

function createShaderModule(label, code) {
  return device.createShaderModule({ label, code });
}

const waveInitPipeline = device.createComputePipeline({
  label: "wave init",
  layout: "auto",
  compute: { module: createShaderModule("wave init wgsl", waveInitWGSL), entryPoint: "main" },
});

const waveStepPipeline = device.createComputePipeline({
  label: "wave step",
  layout: "auto",
  compute: { module: createShaderModule("wave step wgsl", waveStepWGSL), entryPoint: "main" },
});

const particleUpdatePipeline = device.createComputePipeline({
  label: "particle update",
  layout: "auto",
  compute: { module: createShaderModule("particle update wgsl", particleUpdateWGSL), entryPoint: "main" },
});

const waveRenderPipeline = device.createRenderPipeline({
  label: "wave render",
  layout: "auto",
  vertex: { module: createShaderModule("wave render wgsl", waveRenderWGSL), entryPoint: "fullscreenVS" },
  fragment: {
    module: createShaderModule("wave render wgsl fragment", waveRenderWGSL),
    entryPoint: "fs",
    targets: [{ format: presentationFormat }],
  },
  primitive: { topology: "triangle-list" },
});

const particleRenderPipeline = device.createRenderPipeline({
  label: "particle render",
  layout: "auto",
  vertex: { module: createShaderModule("particle render wgsl", particleRenderWGSL), entryPoint: "vs" },
  fragment: {
    module: createShaderModule("particle render wgsl fragment", particleRenderWGSL),
    entryPoint: "fs",
    targets: [{
      format: presentationFormat,
      blend: {
        color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
        alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
      },
    }],
  },
  primitive: { topology: "triangle-list" },
});

const trailFadePipeline = device.createRenderPipeline({
  label: "trail fade",
  layout: "auto",
  vertex: { module: createShaderModule("trail fade wgsl", trailFadeWGSL), entryPoint: "fullscreenVS" },
  fragment: {
    module: createShaderModule("trail fade wgsl fragment", trailFadeWGSL),
    entryPoint: "fs",
    targets: [{ format: trailFormat }],
  },
  primitive: { topology: "triangle-list" },
});

const particleStampPipeline = device.createRenderPipeline({
  label: "particle stamp",
  layout: "auto",
  vertex: { module: createShaderModule("particle stamp wgsl", particleStampWGSL), entryPoint: "vs" },
  fragment: {
    module: createShaderModule("particle stamp wgsl fragment", particleStampWGSL),
    entryPoint: "fs",
    targets: [{
      format: trailFormat,
      blend: {
        color: { srcFactor: "src-alpha", dstFactor: "one", operation: "add" },
        alpha: { srcFactor: "one", dstFactor: "one", operation: "add" },
      },
    }],
  },
  primitive: { topology: "triangle-list" },
});

const trailRenderPipeline = device.createRenderPipeline({
  label: "trail render",
  layout: "auto",
  vertex: { module: createShaderModule("trail render wgsl", trailRenderWGSL), entryPoint: "fullscreenVS" },
  fragment: {
    module: createShaderModule("trail render wgsl fragment", trailRenderWGSL),
    entryPoint: "fs",
    targets: [{
      format: presentationFormat,
      blend: {
        color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
        alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
      },
    }],
  },
  primitive: { topology: "triangle-list" },
});

let waveInitBindGroup = null;
let waveStepBindGroups = [];
let waveRenderBindGroups = [];
let particleUpdateBindGroups = [];
let particleRenderBindGroups = [];
let particleStampBindGroups = [];
let trailFadeBindGroups = [];
let trailRenderBindGroups = [];

function resizeCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
  const changed = canvas.width !== w || canvas.height !== h;
  if (changed) {
    canvas.width = w;
    canvas.height = h;
    context.configure({
      device,
      format: presentationFormat,
      alphaMode: "opaque",
    });
  }
  return changed;
}

function maxCellsForWaveBuffer() {
  const maxStorageBytes = device.limits.maxStorageBufferBindingSize || (128 * 1024 * 1024);
  return Math.max(4096, Math.floor(maxStorageBytes / 16) - 1024);
}

function computeSimulationSize() {
  const maxDim = device.limits.maxTextureDimension2D || 8192;
  let w = Math.max(64, Math.floor(canvas.width * params.simScale));
  let h = Math.max(64, Math.floor(canvas.height * params.simScale));

  const dimScale = Math.min(1, maxDim / Math.max(w, h));
  w = Math.max(64, Math.floor(w * dimScale));
  h = Math.max(64, Math.floor(h * dimScale));

  const maxCells = maxCellsForWaveBuffer();
  const cells = w * h;
  if (cells > maxCells) {
    const s = Math.sqrt(maxCells / cells);
    w = Math.max(64, Math.floor(w * s));
    h = Math.max(64, Math.floor(h * s));
  }

  return { w, h };
}

function createStorageBuffer(label, byteLength, data = null) {
  const buffer = device.createBuffer({
    label,
    size: Math.max(4, byteLength),
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  if (data) {
    device.queue.writeBuffer(buffer, 0, data);
  }
  return buffer;
}

function destroyBuffer(buffer) {
  if (buffer) buffer.destroy();
}

function destroyTexture(texture) {
  if (texture) texture.destroy();
}

function updateUniforms() {
  const steps = Math.floor(params.stepsPerFrame);
  const fade = fadeFromHalfLife(params.trailHalfLife, params.dt * steps);

  paramsArray[0] = simW;
  paramsArray[1] = simH;
  paramsArray[2] = canvas.width;
  paramsArray[3] = canvas.height;
  paramsArray[4] = params.hbar;
  paramsArray[5] = params.mass;
  paramsArray[6] = params.p0;
  paramsArray[7] = params.dt;
  paramsArray[8] = params.packetX;
  paramsArray[9] = params.packetY;
  paramsArray[10] = params.packetSigma;
  paramsArray[11] = params.gaussianSeparation;
  paramsArray[12] = params.doubleGaussian;
  paramsArray[13] = params.boundaryMode;
  paramsArray[14] = Math.floor(params.nParticles);
  paramsArray[15] = params.rhoMin;
  paramsArray[16] = params.velClamp;
  paramsArray[17] = params.visGain;
  paramsArray[18] = params.visGamma;
  paramsArray[19] = params.showPhase;
  paramsArray[20] = params.dotSize;
  paramsArray[21] = params.dotSigma;
  paramsArray[22] = params.dotGain;
  paramsArray[23] = params.trailStampGain;
  paramsArray[24] = params.trailWidth;
  paramsArray[25] = fade;
  paramsArray[26] = params.trailVisGain;
  paramsArray[27] = params.trailVisGamma;
  paramsArray[28] = params.trailBlendMode;
  paramsArray[29] = params.paletteId;
  paramsArray[30] = params.densityMaskLow;
  paramsArray[31] = params.densityMaskHigh;
  paramsArray[32] = viewState.centerX;
  paramsArray[33] = viewState.centerY;
  const angleRad = params.velocityAngleDeg * Math.PI / 180;
  paramsArray[34] = Math.cos(angleRad);
  paramsArray[35] = -Math.sin(angleRad);
  paramsArray[36] = viewState.zoom;
  paramsArray[37] = params.showWave;
  paramsArray[38] = params.particleMode;
  paramsArray[39] = 0;
  device.queue.writeBuffer(uniformBuffer, 0, paramsArray);
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randn(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function rebuildParticles() {
  destroyBuffer(particleBuffers[0]);
  destroyBuffer(particleBuffers[1]);

  const n = Math.floor(params.nParticles);
  const data = new Float32Array(n * 4);
  const sigma1D = params.packetSigma / Math.sqrt(2);
  const x0 = params.packetX * simW;
  const y0 = params.packetY * simH;
  const angleRad = params.velocityAngleDeg * Math.PI / 180;
  const vx = params.classicalSpeed * Math.cos(angleRad);
  const vy = -params.classicalSpeed * Math.sin(angleRad);
  const seed = Math.max(1, Math.floor(params.particleSeed)) >>> 0;
  const rng = seededRandom(seed);

  for (let i = 0; i < n; i++) {
    let x;
    let y;

    if (params.particleMode > 0.5) {
      x = x0 + randn(rng) * sigma1D;
      y = y0 + randn(rng) * sigma1D;
    } else if (params.doubleGaussian) {
      const useFirst = rng() < 0.5;
      const sep = params.gaussianSeparation / 2;
      x = x0 + randn(rng) * sigma1D;
      y = y0 + randn(rng) * sigma1D + (useFirst ? -sep : sep);
    } else {
      x = x0 + randn(rng) * sigma1D;
      y = y0 + randn(rng) * sigma1D;
    }

    x = Math.max(0, Math.min(simW - 1, x));
    y = Math.max(0, Math.min(simH - 1, y));
    data[i * 4 + 0] = x;
    data[i * 4 + 1] = y;
    data[i * 4 + 2] = params.particleMode > 0.5 ? vx : 1.0;
    data[i * 4 + 3] = params.particleMode > 0.5 ? vy : 0.0;
  }

  particleBuffers = [
    createStorageBuffer("particle A", data.byteLength, data),
    createStorageBuffer("particle B", data.byteLength, data),
  ];
  particleFlip = 0;
  rebuildBindGroups();
}

function createTrailTexture(label) {
  return device.createTexture({
    label,
    size: [canvas.width, canvas.height],
    format: trailFormat,
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
  });
}

function rebuildTrailTextures() {
  destroyTexture(trailTextures[0]);
  destroyTexture(trailTextures[1]);
  trailTextures = [createTrailTexture("trail A"), createTrailTexture("trail B")];
  trailFlip = 0;
  rebuildBindGroups();
  clearTrails();
}

function rebuildWaveBuffers() {
  destroyBuffer(waveBuffers[0]);
  destroyBuffer(waveBuffers[1]);

  const waveByteLength = simW * simH * 4 * 4;
  waveBuffers = [
    createStorageBuffer("wave A", waveByteLength),
    createStorageBuffer("wave B", waveByteLength),
  ];
  waveFlip = 0;
}

function rebuildBindGroups() {
  if (!waveBuffers[0] || !waveBuffers[1] || !particleBuffers[0] || !particleBuffers[1] || !trailTextures[0] || !trailTextures[1]) {
    bindGroupsReady = false;
    return;
  }

  waveInitBindGroup = device.createBindGroup({
    label: "wave init bind group",
    layout: waveInitPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBuffers[0] } },
      { binding: 2, resource: { buffer: waveBuffers[1] } },
    ],
  });

  waveStepBindGroups = [0, 1].map((src) => device.createBindGroup({
    label: `wave step ${src}`,
    layout: waveStepPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBuffers[src] } },
      { binding: 2, resource: { buffer: waveBuffers[1 - src] } },
    ],
  }));

  waveRenderBindGroups = [0, 1].map((src) => device.createBindGroup({
    label: `wave render ${src}`,
    layout: waveRenderPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBuffers[src] } },
    ],
  }));

  particleUpdateBindGroups = [0, 1].map((waveIndex) => [0, 1].map((particleIndex) => device.createBindGroup({
    label: `particle update wave ${waveIndex} particle ${particleIndex}`,
    layout: particleUpdatePipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBuffers[waveIndex] } },
      { binding: 2, resource: { buffer: particleBuffers[particleIndex] } },
      { binding: 3, resource: { buffer: particleBuffers[1 - particleIndex] } },
    ],
  })));

  particleRenderBindGroups = [0, 1].map((particleIndex) => device.createBindGroup({
    label: `particle render ${particleIndex}`,
    layout: particleRenderPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: particleBuffers[particleIndex] } },
    ],
  }));

  particleStampBindGroups = [0, 1].map((particleIndex) => device.createBindGroup({
    label: `particle stamp ${particleIndex}`,
    layout: particleStampPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: particleBuffers[particleIndex] } },
    ],
  }));

  trailFadeBindGroups = [0, 1].map((src) => device.createBindGroup({
    label: `trail fade ${src}`,
    layout: trailFadePipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: trailTextures[src].createView() },
    ],
  }));

  trailRenderBindGroups = [0, 1].map((src) => device.createBindGroup({
    label: `trail render ${src}`,
    layout: trailRenderPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: trailTextures[src].createView() },
    ],
  }));

  bindGroupsReady = true;
}

function resetWave() {
  if (!bindGroupsReady) return;
  updateUniforms();
  const encoder = device.createCommandEncoder({ label: "reset wave encoder" });
  const pass = encoder.beginComputePass({ label: "reset wave pass" });
  pass.setPipeline(waveInitPipeline);
  pass.setBindGroup(0, waveInitBindGroup);
  pass.dispatchWorkgroups(Math.ceil(simW / 16), Math.ceil(simH / 16));
  pass.end();
  waveFlip = 0;
  device.queue.submit([encoder.finish()]);
}

function clearTrails() {
  if (!trailTextures[0] || !trailTextures[1]) return;
  const encoder = device.createCommandEncoder({ label: "clear trails encoder" });
  for (const texture of trailTextures) {
    const pass = encoder.beginRenderPass({
      colorAttachments: [{
        view: texture.createView(),
        loadOp: "clear",
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        storeOp: "store",
      }],
    });
    pass.end();
  }
  trailFlip = 0;
  device.queue.submit([encoder.finish()]);
}

function fadeFromHalfLife(halfLife, dtTotal) {
  if (halfLife <= 0) return 0.0;
  return Math.exp(-Math.log(2) * (dtTotal / halfLife));
}

function stepSimulation(encoder) {
  const steps = Math.floor(params.stepsPerFrame);
  const n = Math.floor(params.nParticles);
  const pass = encoder.beginComputePass({ label: "simulation step" });

  for (let i = 0; i < steps; i++) {
    if (params.particleMode < 0.5) {
      pass.setPipeline(waveStepPipeline);
      pass.setBindGroup(0, waveStepBindGroups[waveFlip]);
      pass.dispatchWorkgroups(Math.ceil(simW / 16), Math.ceil(simH / 16));
      waveFlip = 1 - waveFlip;
    }

    pass.setPipeline(particleUpdatePipeline);
    pass.setBindGroup(0, particleUpdateBindGroups[waveFlip][particleFlip]);
    pass.dispatchWorkgroups(Math.ceil(n / 64));
    particleFlip = 1 - particleFlip;
  }

  pass.end();
}

function stepTrails(encoder) {
  const n = Math.floor(params.nParticles);
  const src = trailFlip;
  const dst = 1 - trailFlip;

  let pass = encoder.beginRenderPass({
    label: "trail fade",
    colorAttachments: [{
      view: trailTextures[dst].createView(),
      loadOp: "clear",
      clearValue: { r: 0, g: 0, b: 0, a: 0 },
      storeOp: "store",
    }],
  });
  pass.setPipeline(trailFadePipeline);
  pass.setBindGroup(0, trailFadeBindGroups[src]);
  pass.draw(3);
  pass.end();

  pass = encoder.beginRenderPass({
    label: "trail stamp",
    colorAttachments: [{
      view: trailTextures[dst].createView(),
      loadOp: "load",
      storeOp: "store",
    }],
  });
  pass.setPipeline(particleStampPipeline);
  pass.setBindGroup(0, particleStampBindGroups[particleFlip]);
  pass.draw(6, n);
  pass.end();

  trailFlip = dst;
}

function render(encoder) {
  const n = Math.floor(params.nParticles);
  const view = context.getCurrentTexture().createView();
  const pass = encoder.beginRenderPass({
    label: "main render",
    colorAttachments: [{
      view,
      loadOp: "clear",
      clearValue: { r: 0, g: 0, b: 0, a: 1 },
      storeOp: "store",
    }],
  });

  if (params.showWave) {
    pass.setPipeline(waveRenderPipeline);
    pass.setBindGroup(0, waveRenderBindGroups[waveFlip]);
    pass.draw(3);
  }

  if (params.showTrail) {
    pass.setPipeline(trailRenderPipeline);
    pass.setBindGroup(0, trailRenderBindGroups[trailFlip]);
    pass.draw(3);
  }

  if (params.showParticles) {
    pass.setPipeline(particleRenderPipeline);
    pass.setBindGroup(0, particleRenderBindGroups[particleFlip]);
    pass.draw(6, n);
  }

  pass.end();
}

function rebuildSimulation() {
  resizeCanvas();
  applyRegimePreset();

  const size = computeSimulationSize();
  simW = size.w;
  simH = size.h;

  rebuildWaveBuffers();
  rebuildTrailTextures();
  rebuildParticles();
  rebuildBindGroups();
  resetWave();
  clearTrails();
  updateUniforms();
}

function resetAll() {
  applyRegimePreset();
  updateUniforms();
  resetWave();
  rebuildParticles();
  clearTrails();
}

window.addEventListener("resize", () => rebuildSimulation());

function frame() {
  const changed = resizeCanvas();
  if (changed) {
    rebuildSimulation();
    requestAnimationFrame(frame);
    return;
  }

  updateUniforms();
  const encoder = device.createCommandEncoder({ label: "frame encoder" });
  if (!paused) {
    stepSimulation(encoder);
    stepTrails(encoder);
  }
  render(encoder);
  device.queue.submit([encoder.finish()]);
  requestAnimationFrame(frame);
}

rebuildSimulation();
setStatus("Q-Ontic Lab classical-limit WebGPU applet");
requestAnimationFrame(frame);
