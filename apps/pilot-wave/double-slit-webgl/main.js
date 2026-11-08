import { effectiveDt, effectiveStepsPerFrame, getSimulationSpeed, setSimulationSpeed, initSimulationSpeedControl, setSimulationFrameDuration } from "./simulation-speed.js";
import { RightDetectorHistogram, histogramPlotWidth, HISTOGRAM_GAP, HISTOGRAM_RIGHT_MARGIN } from "./right-detector-histogram.js";
import { initRecorder } from "./recorder-ui.js";
import { WhichSlitMeasurement } from "./which-slit.js";
import { assignRadialGroups } from "./particle-colors.js";
import { paintPhaseLegend, phaseLegendLayout } from "./phase-legend.js";
import { sampleWhichSlitStart } from "./which-slit-launch.js";
import { installTemplateShell } from "./template-shell.js?v=4";
import { mountQonticMedia } from "./vendor/ui/qontic-media.js";
import { mountDistanceScale, mountCoordinateTools } from "./vendor/ui/qontic-overlays.js";
import { mountQonticShortcuts } from "../../../shared/qontic-shortcuts.js";

const template = installTemplateShell();

const canvas = document.getElementById("c");
const phaseLegendCanvas = document.getElementById("phase-legend");
let phaseLegendPlacement = null;
const rightHistogram = new RightDetectorHistogram(document.getElementById("detector-histogram"));
const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, depth: false, stencil: false });
if (!gl) {
  if (template) {
    const notice = document.createElement("p");
    notice.className = "webgl-notice";
    notice.textContent = "This simulation requires WebGL2. Open it in a desktop browser with WebGL2 enabled.";
    template.wrap.append(notice);
  }
  throw new Error("WebGL2 not available.");
}

gl.disable(gl.DEPTH_TEST);
gl.disable(gl.CULL_FACE);

const extFloatRT = gl.getExtension("EXT_color_buffer_float");
if (!extFloatRT) {
  alert("EXT_color_buffer_float missing. Use Chrome/Edge/Firefox desktop.\nThis demo needs float render targets.");
  throw new Error("Missing EXT_color_buffer_float");
}

const params = {
  simScale: 0.5,
  stepsPerFrame: 30,
  edgePadding: 256,
  stageView: 1,

  hbar: 6.0,
  mass: 1.0,
  p0: 1.5,
  dt: 0.02,

  packetX: 0.4,
  packetY: 0.50,
  packetSigma: 25.0,

  barrierX: 0.55,
  barrierThick: 10.0,
  slitWidth: 25.0,
  slitSep: 60.0,
  V0: 50.0,

  absorbPx: 50.0,
  absorbStrength: 2.0,
  particleKillMargin: 1.0,

  nParticles: 500,
  whichSlit: 0,
  rhoMin: 1e-6,
  velClamp: 160.0,
  guidingMode: 0,
  guidingChoice: 0,
  spinSign: 1,
  spinMagnitude: 0.5,

  visGain: 20.0,
  visGamma: 0.5,
  showPhase: 1,

  showParticles: 1,
  colorCodeUpDown: 1,
  colorCodeRightLeft: 1,
  colorCodeRadial: 0,
  dotSize: 12.0,
  dotSigma: 0.28,
  dotGain: 1.,
  particleTailFade: 0.25,

  showTrail: 1,
  showHistogram: 1,
  trailHalfLife: 50.0,
  trailVisGain: 0.3,
  trailVisGamma: 2.0,
  trailStampGain: 0.35,
  trailBlendMode: 1,

  paletteId: 0,
  nmPerGridStep: 1,
};

const DEFAULT_AUTO_RESTART_MOMENTUM = params.p0;

const urlParams = new URLSearchParams(window.location.search);
const isEmbedded = urlParams.get("embed") === "1";
const isVideoRenderer = urlParams.get("renderer") === "video";
const preset = urlParams.get("preset");
initSimulationSpeedControl({ visible: !isEmbedded });
const oneParticlePreset = {
  dt: 0.02,
  simScale: 0.5,
  stepsPerFrame: 15,
  nParticles: 1,
  packetX: 0.4,

  packetSigma: 25.0,

  guidingMode: 0,
  guidingChoice: 0,
  slitSep: 40.0,
  spinSign: 1,
  spinMagnitude: 0.0,
  absorbPx: 40.0,
  absorbStrength: 2.0,
  showPhase: 1,

  showParticles: 1,
  dotSize: 20.0,
  dotGain: 2.,
  trailVisGain: .3,
  trailHalfLife: 190.0,
  showTrail: 1,
};

const particleCountPreset = { ...oneParticlePreset };

particleCountPreset.nParticles= 500,
particleCountPreset.dotSize = 7.0;
particleCountPreset.trailVisGain = .5;
particleCountPreset.trailGamma = .5;
particleCountPreset.trailHalfLife = 19.0;

const equivariancePreset = { ...particleCountPreset };
equivariancePreset.showPhase = 0;
equivariancePreset.nParticles = 5000;
equivariancePreset.dotSize = 4.0;
equivariancePreset.dotGain = 0.6;
equivariancePreset.trailVisGain = 0.2;
equivariancePreset.trailHalfLife = 5.0;

const PRESETS = {
  // Params set preset values. They are fixed by default unless listed in adjustable.
  "one-particle": {
    params: oneParticlePreset,
  },
  "particle-count": {
    params: particleCountPreset,
    adjustable: ["nParticles"],
  },
  "equivariance": {
    params: equivariancePreset,
  },
};

const presetDefinition = PRESETS[preset];
const presetParams = presetDefinition?.params;
const adjustableControls = new Set(presetDefinition?.adjustable ?? []);
const fixedControls = new Set(
  presetParams
    ? Object.keys(presetParams).filter((key) => !adjustableControls.has(key))
    : []
);

if (presetParams) {
  Object.assign(params, presetParams);
}

const TRAIL_FADE_FRAME_DT = Math.max(
  1e-12,
  params.dt * Math.max(1, Math.floor(params.stepsPerFrame))
);

function isControlFixed(key) {
  if (adjustableControls.has(key)) return false;
  if (fixedControls.has(key)) return true;
  if (key === "guidingChoice") {
    return fixedControls.has("guidingMode") || fixedControls.has("spinSign");
  }
  return false;
}

const DEFAULT_PALETTE_COMPLEMENT = [0.20, 0.80, 0.30];

const GUIDING_MODE_NAMES = [
  "Schrodinger",
  "Pauli spin-1/2"
];
const GUIDING_CHOICE_NAMES = [
  "Schrodinger",
  "Pauli Up",
  "Pauli Down"
];

let paused = false;
let frameRecordingActive = isVideoRenderer;
let simulationReady = false;
let initializationError = null;
let recordingSurface = null;
let recordingViewport = null;
let resizeDuringRecording = false;
let videoTick = 0;
let videoHoldTicks = 0;
let whichSlit = null;
let ensembleParticleCount = params.nParticles;
let whichSlitHistogramKey = null;
let whichSlitRunStartHistogram = null;
let whichSlitLaunchState = null;
let whichSlitDelayRemaining = 0;
let whichSlitPendingRestart = false;
let whichSlitRunTime = 0;
const singleParticleReadback = new Float32Array(4);
const INITIAL_HOLD_SECONDS = 0.5;
let initialHoldRemaining = INITIAL_HOLD_SECONDS;
let lastFrameTime = null;

function resetPlaybackClock() {
  lastFrameTime = null;
  setSimulationFrameDuration(0);
}

function beginInitialHold() {
  initialHoldRemaining = INITIAL_HOLD_SECONDS;
  resetPlaybackClock();
}

let controls = template?.panes.core ?? document.getElementById("controls");
const statsEl = document.getElementById("stats");

function fmt(v) {
  const av = Math.abs(v);
  if (av >= 1000 || (av > 0 && av < 0.01)) return v.toExponential(2);
  return v.toFixed(3).replace(/\.?0+$/, "");
}

function simulationDt() {
  return effectiveDt(params.dt);
}

function simulationStepsPerFrame() {
  return effectiveStepsPerFrame(params.stepsPerFrame);
}

function trailFadeFrameDt() {
  return recordingSurface?.trailFadeDt ?? TRAIL_FADE_FRAME_DT;
}

function particleTrailWidth() {
  return params.dotSize * 0.7;
}

function pathColorMask() {
  if (params.colorCodeRadial) return 4;
  return (params.colorCodeUpDown ? 1 : 0) | (params.colorCodeRightLeft ? 2 : 0);
}

function addSlider(key, label, min, max, step, onChange = null, description = "") {
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
  input.setAttribute("aria-label", label);
  input.dataset.param = key;
  if (description) input.title = description;

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

function addToggleInt(key, label, description = "") {
  if (isControlFixed(key)) return;

  const row = document.createElement("div");
  row.className = "row";
  const lab = document.createElement("label");
  lab.textContent = label;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = `toggle-${key}`;
  btn.setAttribute("aria-label", label);
  btn.setAttribute("aria-pressed", String(Boolean(params[key])));
  if (description) btn.title = description;
  btn.style.flex = "1";
  btn.textContent = params[key] ? "ON" : "OFF";
  btn.addEventListener("click", () => {
    params[key] = params[key] ? 0 : 1;
    btn.textContent = params[key] ? "ON" : "OFF";
    btn.setAttribute("aria-pressed", String(Boolean(params[key])));
  });

  const val = document.createElement("div");
  val.className = "val";
  val.textContent = "";

  row.appendChild(lab);
  row.appendChild(btn);
  row.appendChild(val);
  controls.appendChild(row);
}

function addPathColorControls() {
  const row = document.createElement("div");
  row.className = "row";
  const label = document.createElement("label");
  label.textContent = "path colors";
  const group = document.createElement("div");
  group.className = "button-group path-color-toggles";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "path colors");

  for (const [key, name, description] of [
    ["colorCodeUpDown", "up/down", "Color by the starting upper or lower half of the Gaussian."],
    ["colorCodeRightLeft", "right/left", "Color by the starting right or left half of the Gaussian."],
    ["colorCodeRadial", "radial", "Four equally populated rings around the starting Gaussian center. Overrides up/down and right/left."],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.id = `toggle-${key}`;
    button.textContent = name;
    button.title = description;
    const sync = () => {
      button.setAttribute("aria-pressed", String(Boolean(params[key])));
      button.classList.toggle("is-active", Boolean(params[key]));
    };
    sync();
    button.addEventListener("click", () => {
      params[key] = params[key] ? 0 : 1;
      sync();
    });
    group.appendChild(button);
  }

  row.append(label, group);
  controls.appendChild(row);
}

function addCycleButton(key, label, values, onChange = null) {
  if (isControlFixed(key)) return;

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

function addChoiceButtons(key, label, values, onChange = null) {
  if (isControlFixed(key)) return;

  const row = document.createElement("div");
  row.className = "row";

  const lab = document.createElement("label");
  lab.textContent = label;

  const group = document.createElement("div");
  group.className = "button-group";

  const buttons = values.map((value, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = value;
    btn.addEventListener("click", () => {
      if ((params[key] | 0) === index) return;
      params[key] = index;
      sync();
      if (onChange) onChange(index);
    });
    group.appendChild(btn);
    return btn;
  });

  function sync() {
    const selected = params[key] | 0;
    buttons.forEach((btn, index) => {
      btn.classList.toggle("is-active", index === selected);
    });
  }

  sync();
  row.appendChild(lab);
  row.appendChild(group);
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
  document.querySelectorAll("#controls .section-header").forEach((header) => {
    let hasControls = false;
    let node = header.nextElementSibling;

    while (node && !node.classList.contains("section-header")) {
      if (node.classList.contains("row")) {
        hasControls = true;
        break;
      }
      node = node.nextElementSibling;
    }

    if (!hasControls) {
      header.remove();
    }
  });
}

function syncWhichSlitControls() {
  const button = document.getElementById("which-slit");
  button?.setAttribute("aria-pressed", String(Boolean(params.whichSlit)));
  button?.classList.toggle("is-active", Boolean(params.whichSlit));
  const count = document.querySelector('#controls [data-param="nParticles"]');
  if (count) {
    count.disabled = Boolean(params.whichSlit);
    count.value = String(params.nParticles);
    count.closest('.row').querySelector('.val').textContent = fmt(params.nParticles);
  }
  document.getElementById("which-slit-theory").hidden = !params.whichSlit;
  document.getElementById("clear-histogram-row").hidden = !params.whichSlit;
  document.getElementById("reset").textContent = params.whichSlit ? "Next particle (R)" : "Reset (R)";
}

addSectionHeader("Experiment");
{
  const row = document.createElement("div");
  row.className = "row";
  const label = document.createElement("label");
  label.textContent = "slit detector";
  const button = document.createElement("button");
  button.id = "which-slit";
  button.type = "button";
  button.textContent = "Which slit";
  button.title = "Repeated single particles biased toward the slits, with gradual Gaussian localization after each exit. Hits accumulate until cleared or the experiment changes.";
  button.addEventListener("click", () => {
    if (params.whichSlit) {
      params.whichSlit = 0;
      params.nParticles = ensembleParticleCount;
    } else {
      ensembleParticleCount = params.nParticles;
      params.whichSlit = 1;
      params.nParticles = 1;
    }
    syncWhichSlitControls();
    resetAll();
  });
  row.append(label, button);
  controls.append(row);
}

{
  const row = document.createElement("div");
  row.className = "row";
  row.id = "clear-histogram-row";
  row.hidden = !params.whichSlit;
  const label = document.createElement("label");
  label.textContent = "detector memory";
  const button = document.createElement("button");
  button.id = "clear-histogram";
  button.type = "button";
  button.textContent = "Clear histogram";
  button.addEventListener("click", () => {
    captureRightDetectorHits(true);
    rightHistogram.clearCounts();
    whichSlitRunStartHistogram = snapshotHistogram();
    render();
  });
  row.append(label, button);
  controls.append(row);
}
if (template) controls = template.panes.advanced;
addSectionHeader("Performance");
addSlider("simScale", "sim scale", 0.3, 1.0, 0.1, () => rebuildSimulation());
addSlider("stepsPerFrame", "Steps/frame", 1, 100, 1);
addSlider("edgePadding", "offscreen space", 128, 512, 32, () => rebuildSimulation(), "Space for wave absorption above and below the stage. More space reduces reflections and uses more graphics power. Changing it restarts the run.");

if (template) controls = template.panes.core;
addSectionHeader("Physical Parameters");
addSlider("p0", "Momentum p", 0.5, 5.0, 0.1, () => resetAll());
addSlider("dt", "dt", 0.01, 0.03, 0.01);
addSlider("packetSigma", "packet sigma", 8.0, 80.0, 1.0, () => resetAll());
addSlider("slitWidth", "slit width", 6.0, 40.0, 1.0, () => { if (params.whichSlit) resetAll(); });
addSlider("slitSep", "slit separation", 18.0, 140.0, 1.0, () => { if (params.whichSlit) resetAll(); });
//addSlider("absorbPx", "absorb boundary", 0.0, 60.0, 1.0);
//addSlider("spinMagnitude", "spin |s|", 0.0, 2.0, 0.5);
addChoiceButtons("guidingChoice", "guiding law", GUIDING_CHOICE_NAMES, (choice) => {
  params.guidingMode = choice === 0 ? 0 : 1;
  params.spinSign = choice === 2 ? -1 : 1;
  resetAll();
});

if (template) controls = template.panes.display;
if (template) {
  addSectionHeader("Scale calibration");
  addSlider("nmPerGridStep", "nm / grid step", 0.1, 10, 0.1, () => { overlayScale?.update(); overlayCoordinates?.update(); });
  const note = document.createElement("p");
  note.className = "scale-note";
  note.textContent = "Chosen length calibration for the ruler and coordinates; changing it does not alter the simulation.";
  controls.append(note);
}
addSectionHeader("Visual Parameters");
addChoiceButtons("stageView", "stage view", ["Close", "Wide"], () => {
  userAdjustedView = false;
  applyInitialViewTransform();
});
addToggleInt("showPhase", "show phase");
addToggleInt("showParticles", "show particles");
addPathColorControls();
if (template) controls = template.panes.core;
addSlider("nParticles", "particle count", 1, 3000, 1, () => resetAll());
if (template) controls = template.panes.display;

addSlider("dotSize", "particle size", 2.0, 16.0, 0.5);
addSlider("dotGain", "particle brightness", 0.1, 3.0, 0.1);

addToggleInt("showTrail", "draw trails");
addToggleInt("showHistogram", "right histogram", "Show the right detector's hit distribution. Detections keep accumulating while hidden.");
addSlider("trailHalfLife", "trail half-life", 1.0, 150.0, 1.0);
//addSlider("trailVisGain", "trail gain", 0.1, 1.0, 0.1);
//addSlider("trailVisGamma", "trail gamma", 0.4, 2.0, 0.05);

//addSlider("visGain", "wave gain", 0.5, 20.0, 0.5);
//addSlider("visGamma", "wave gamma", 0.3, 2.0, 0.05);

removeEmptySectionHeaders();
syncWhichSlitControls();

const pauseButton = document.getElementById("pause");
function togglePause() {
  paused = !paused;
  pauseButton.textContent = paused ? "Resume" : "Pause";
  template?.commonControls.setAttribute("running", String(!paused));
  resetPlaybackClock();
}

document.addEventListener("visibilitychange", resetPlaybackClock);

document.getElementById("reset").onclick = () => resetAll();
pauseButton.onclick = () => togglePause();
if (template) {
  const common = template.commonControls;
  common.addEventListener("qontic:start", () => { paused = false; pauseButton.textContent = "Pause"; resetPlaybackClock(); });
  common.addEventListener("qontic:stop", () => { paused = true; pauseButton.textContent = "Resume"; resetPlaybackClock(); });
  common.addEventListener("qontic:reset", () => resetAll());
  common.addEventListener("qontic:speed", ({detail}) => setSimulationSpeed(detail.speed));
  common.addEventListener("qontic:theme", ({detail}) => {
    document.documentElement.classList.toggle("qontic-light", detail.theme === "light");
  });
  mountQonticShortcuts({
    togglePlayback: () => { if (!frameRecordingActive) togglePause(); },
    reset: () => { if (!frameRecordingActive) resetAll(); },
    screenshot: () => { if (!frameRecordingActive) template.stage.querySelector('.qontic-media-toolbar button[aria-label="Screenshot"]')?.click(); },
  });
  window.addEventListener("qontic:view-change", () => {
    resetPlaybackClock();
    if (!template.workspace.hidden && simulationReady) requestAnimationFrame(() => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      if (canvas.width !== Math.floor(canvas.clientWidth * dpr) || canvas.height !== Math.floor(canvas.clientHeight * dpr)) rebuildSimulation();
      applyViewTransform();
      overlayScale?.update(); overlayCoordinates?.update();
    });
  });
}

if (isEmbedded) {
  canvas.addEventListener("click", () => togglePause());
} else if (!template) {
  window.addEventListener("keydown", (e) => {
    if (frameRecordingActive || e.target.closest("input, select, textarea, button")) return;
    if (e.key.toLowerCase() === "r") resetAll();
    if (e.key === " ") togglePause();
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

const theoryPanel = document.getElementById("theory");
const theoryBody = document.getElementById("theorybody");
const theoryBtn = document.getElementById("mintheory");

let theoryMinimized = !template;
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
let overlayScale = null, overlayCoordinates = null;

const INITIAL_ZOOM_FRACTION = 0.65;
const INITIAL_VIEW_SHIFT_X = 0.20;
const BOUNDARY_FREEZE_DETECTION_CHANCE = 0.005;
const EMBED_AUTO_RESTART_FRAMES = 1000;
let userAdjustedView = false;
let embeddedFramesSinceReset = 0;
let physicsFrame = 0;

function getEmbedAutoRestartFrameLimit() {
  if (EMBED_AUTO_RESTART_FRAMES <= 0) return 0;

  const momentum = Math.max(0.001, Math.abs(params.p0));
  return Math.max(1, Math.round(
    EMBED_AUTO_RESTART_FRAMES * DEFAULT_AUTO_RESTART_MOMENTUM / momentum
  ));
}

function clampViewOffset() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const screenScale = view.zoom * w / simW;
  const detectorX = rightDetectorX() * screenScale;
  // Keep a separate legend column beyond the histogram, also when zooming.
  const histogramSpace = histogramPlotWidth(w) + HISTOGRAM_GAP + HISTOGRAM_RIGHT_MARGIN
    + phaseLegendLayout(w, h).reservedWidth;
  // Left detections freeze at or before this boundary. Include the dot halo so
  // the entire row stays outside the frame, even on low-DPI displays.
  const leftBoundaryX = 1.20 * 2.25 * (params.absorbPx + params.particleKillMargin) * screenScale;
  const dotRadius = view.zoom * params.dotSize * w / Math.max(1, densW) * 0.5;
  const maxX = Math.min(-leftBoundaryX - dotRadius - 8, w - histogramSpace - detectorX);
  // Allow blank space to the right of the canvas, while keeping the detector
  // on screen when zooming. These offsets never change the physical grid.
  const minX = Math.min(maxX, 24 - detectorX);
  const minY = h * (1 - view.zoom);
  view.offsetX = Math.min(maxX, Math.max(minX, view.offsetX));
  view.offsetY = Math.min(0, Math.max(minY, view.offsetY));
}

function applyViewTransform() {
  clampViewOffset();
  canvas.style.transformOrigin = "0 0";
  canvas.style.transform = `translate(${view.offsetX}px, ${view.offsetY}px) scale(${view.zoom})`;
  overlayScale?.update();
  overlayCoordinates?.update();
}

function applyInitialViewTransform() {
  const visibleFraction = params.stageView ? 1 : Math.min(1, Math.max(0.2, INITIAL_ZOOM_FRACTION));
  view.zoom = 1 / visibleFraction;
  view.offsetX = canvas.clientWidth * (1 - view.zoom) * 0.5 - canvas.clientWidth * INITIAL_VIEW_SHIFT_X;
  view.offsetY = canvas.clientHeight * (1 - view.zoom) * 0.5;
  applyViewTransform();
}

if (!isEmbedded) {
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (frameRecordingActive) return;
    userAdjustedView = true;

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
}

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

function makeFBO(tex, secondTexture = null) {
  const f = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, f);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  if (secondTexture) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, secondTexture, 0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
  }
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
    "barrier_render.frag",
    "which_slit_mix.frag",
    "which_slit_detector.frag",
    "wave_overlap.frag",
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
let progBarrierRender;
let progWhichSlitMix, progWhichSlitDetector, progWaveOverlap;
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
  progBarrierRender = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["barrier_render.frag"]));
  progWhichSlitMix = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["which_slit_mix.frag"]));
  progWhichSlitDetector = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["which_slit_detector.frag"]));
  progWaveOverlap = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["wave_overlap.frag"]));

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
    uPacketPosPx: u(progWaveInit, "uPacketPosPx"),
    uPacketSigmaPx: u(progWaveInit, "uPacketSigmaPx"),
    uLocalizedPacket: u(progWaveInit, "uLocalizedPacket"),
    uLocalizedSigma: u(progWaveInit, "uLocalizedSigma"),
    uLocalizedMomentum: u(progWaveInit, "uLocalizedMomentum"),
    uBarrierXFrac: u(progWaveInit, "uBarrierXFrac"),
    uBarrierThickPx: u(progWaveInit, "uBarrierThickPx"),
    uSlitWidthPx: u(progWaveInit, "uSlitWidthPx"),
    uSlitSepPx: u(progWaveInit, "uSlitSepPx"),
    uV0: u(progWaveInit, "uV0"),
    uAbsorbPx: u(progWaveInit, "uAbsorbPx"),
    uAbsorbYPx: u(progWaveInit, "uAbsorbYPx"),
    uAbsorbYStrength: u(progWaveInit, "uAbsorbYStrength"),
    uAbsorbStrength: u(progWaveInit, "uAbsorbStrength"),
  };

  U.waveStep = {
    uState: u(progWaveStep, "uState"),
    uSimRes: u(progWaveStep, "uSimRes"),
    uHBAR: u(progWaveStep, "uHBAR"),
    uMass: u(progWaveStep, "uMass"),
    uP0: u(progWaveStep, "uP0"),
    uDT: u(progWaveStep, "uDT"),
    uBarrierXFrac: u(progWaveStep, "uBarrierXFrac"),
    uBarrierThickPx: u(progWaveStep, "uBarrierThickPx"),
    uSlitWidthPx: u(progWaveStep, "uSlitWidthPx"),
    uSlitSepPx: u(progWaveStep, "uSlitSepPx"),
    uV0: u(progWaveStep, "uV0"),
    uAbsorbPx: u(progWaveStep, "uAbsorbPx"),
    uAbsorbYPx: u(progWaveStep, "uAbsorbYPx"),
    uAbsorbYStrength: u(progWaveStep, "uAbsorbYStrength"),
    uAbsorbStrength: u(progWaveStep, "uAbsorbStrength"),
  };

  U.waveRender = {
    uState: u(progWaveRender, "uState"),
    uStageUV: u(progWaveRender, "uStageUV"),
    uVisGain: u(progWaveRender, "uVisGain"),
    uVisGamma: u(progWaveRender, "uVisGamma"),
    uShowPhase: u(progWaveRender, "uShowPhase"),
    uPaletteId: u(progWaveRender, "uPaletteId"),
  };

  U.barrierRender = {
    uSimRes: u(progBarrierRender, "uSimRes"),
    uBarrierXFrac: u(progBarrierRender, "uBarrierXFrac"),
    uBarrierThickPx: u(progBarrierRender, "uBarrierThickPx"),
    uSlitWidthPx: u(progBarrierRender, "uSlitWidthPx"),
    uSlitSepPx: u(progBarrierRender, "uSlitSepPx"),
    uBarrierOpacity: u(progBarrierRender, "uBarrierOpacity"),
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
    uBarrierXFrac: u(progPartUpdate, "uBarrierXFrac"),
    uBarrierThickPx: u(progPartUpdate, "uBarrierThickPx"),
    uSlitWidthPx: u(progPartUpdate, "uSlitWidthPx"),
    uSlitSepPx: u(progPartUpdate, "uSlitSepPx"),
    uV0: u(progPartUpdate, "uV0"),
    uAbsorbPx: u(progPartUpdate, "uAbsorbPx"),
    uVerticalDetectorInset: u(progPartUpdate, "uVerticalDetectorInset"),
    uBoundaryFreezeChance: u(progPartUpdate, "uBoundaryFreezeChance"),
    uPhysicsFrame: u(progPartUpdate, "uPhysicsFrame"),
    uRhoMin: u(progPartUpdate, "uRhoMin"),
    uVelClamp: u(progPartUpdate, "uVelClamp"),
    uParticleKillMarginPx: u(progPartUpdate, "uParticleKillMarginPx"),
  };

  U.partView = {
    uState: u(progPartView, "uState"),
    uVisGain: u(progPartView, "uVisGain"),
    uVisGamma: u(progPartView, "uVisGamma"),
    uParticleTailFade: u(progPartView, "uParticleTailFade"),
    uSimRes: u(progPartView, "uSimRes"),
    uStageRect: u(progPartView, "uStageRect"),
    uPointSize: u(progPartView, "uPointSize"),
    uDotSigma: u(progPartView, "uDotSigma"),
    uDotGain: u(progPartView, "uDotGain"),
    uColorCodeMask: u(progPartView, "uColorCodeMask"),
    uTrailWidth: u(progPartView, "uTrailWidth"),
  };

  U.partStamp = {
    uState: u(progPartStamp, "uState"),
    uVisGain: u(progPartStamp, "uVisGain"),
    uVisGamma: u(progPartStamp, "uVisGamma"),
    uParticleTailFade: u(progPartStamp, "uParticleTailFade"),
    uSimRes: u(progPartStamp, "uSimRes"),
    uStageRect: u(progPartStamp, "uStageRect"),
    uPointSize: u(progPartStamp, "uPointSize"),
    uDotSigma: u(progPartStamp, "uDotSigma"),
    uDotGain: u(progPartStamp, "uDotGain"),
    uStampGain: u(progPartStamp, "uStampGain"),
    uTrailWidth: u(progPartStamp, "uTrailWidth"),
  };

  U.densityStep = {
    uPrev: u(progDensityStep, "uPrev"),
    uPrevRadial: u(progDensityStep, "uPrevRadial"),
    uFade: u(progDensityStep, "uFade"),
  };

  U.densityRender = {
    uDensity: u(progDensityRender, "uDensity"),
    uGain: u(progDensityRender, "uGain"),
    uGamma: u(progDensityRender, "uGamma"),
    uColorCodeMask: u(progDensityRender, "uColorCodeMask"),
    uBlendMode: u(progDensityRender, "uBlendMode"),
  };
}

const vaoEmpty = gl.createVertexArray();

let simW = 0, simH = 0;
let stageW = 0, stageH = 0, paddingY = 0;
let verticalAbsorbWidth = 0;
const ABSORBER_GUARD_CELLS = 24;
const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
let texA = null, texB = null, fboA = null, fboB = null, flip = 0;

let particleSrc = null, particleDst = null, vaoParticles = null, tf = null;
let particleReadback = new Float32Array(0);
let initialParticleState = new Float32Array(0);
let lastHistogramReadFrame = -1;
let lastHistogramReadTime = -Infinity;

let densW = 0, densH = 0;
let densTexA = null, densTexB = null, densFboA = null, densFboB = null, densFlip = 0;
let radialTexA = null, radialTexB = null;

function resizeCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = recordingSurface?.width ?? Math.floor(canvas.clientWidth * dpr);
  const h = recordingSurface?.height ?? Math.floor(canvas.clientHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
}

function setWaveInitUniforms() {
  gl.uniform2i(U.waveInit.uSimRes, simW, simH);
  gl.uniform1f(U.waveInit.uHBAR, params.hbar);
  gl.uniform1f(U.waveInit.uMass, params.mass);
  gl.uniform1f(U.waveInit.uP0, params.p0);
  gl.uniform1f(U.waveInit.uDT, simulationDt());

  gl.uniform2f(U.waveInit.uPacketPosPx, params.packetX * stageW, paddingY + params.packetY * stageH);
  gl.uniform1f(U.waveInit.uPacketSigmaPx, params.packetSigma);
  gl.uniform1i(U.waveInit.uLocalizedPacket, 0);

  gl.uniform1f(U.waveInit.uBarrierXFrac, params.barrierX);
  gl.uniform1f(U.waveInit.uBarrierThickPx, params.barrierThick);
  gl.uniform1f(U.waveInit.uSlitWidthPx, params.slitWidth);
  gl.uniform1f(U.waveInit.uSlitSepPx, params.slitSep);
  gl.uniform1f(U.waveInit.uV0, params.V0);

  gl.uniform1f(U.waveInit.uAbsorbPx, params.absorbPx);
  gl.uniform1f(U.waveInit.uAbsorbYPx, verticalAbsorbWidth);
  gl.uniform1f(U.waveInit.uAbsorbYStrength, verticalAbsorbStrength());
  gl.uniform1f(U.waveInit.uAbsorbStrength, params.absorbStrength);
}

function setWaveStepUniforms(srcTex) {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, srcTex);
  gl.uniform1i(U.waveStep.uState, 0);

  gl.uniform2i(U.waveStep.uSimRes, simW, simH);
  gl.uniform1f(U.waveStep.uHBAR, params.hbar);
  gl.uniform1f(U.waveStep.uMass, params.mass);
  gl.uniform1f(U.waveStep.uP0, params.p0);
  gl.uniform1f(U.waveStep.uDT, simulationDt());

  gl.uniform1f(U.waveStep.uBarrierXFrac, params.barrierX);
  gl.uniform1f(U.waveStep.uBarrierThickPx, params.barrierThick);
  gl.uniform1f(U.waveStep.uSlitWidthPx, params.slitWidth);
  gl.uniform1f(U.waveStep.uSlitSepPx, params.slitSep);
  gl.uniform1f(U.waveStep.uV0, params.V0);

  gl.uniform1f(U.waveStep.uAbsorbPx, params.absorbPx);
  gl.uniform1f(U.waveStep.uAbsorbYPx, verticalAbsorbWidth);
  gl.uniform1f(U.waveStep.uAbsorbYStrength, verticalAbsorbStrength());
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

function evolveWave(src, dst) {
  gl.useProgram(progWaveStep);
  setWaveStepUniforms(src);

  gl.bindVertexArray(vaoEmpty);
  gl.bindFramebuffer(gl.FRAMEBUFFER, dst);
  gl.viewport(0, 0, simW, simH);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

}

function waveStep() {
  evolveWave(flip ? texB : texA, flip ? fboA : fboB);
  flip = 1 - flip;
}

function guidingWaveTexture() {
  const original = flip ? texB : texA;
  return whichSlit?.waveTexture(original) ?? original;
}

function initializeWhichSlitMeasurement() {
  whichSlit = new WhichSlitMeasurement({
    gl, vao: vaoEmpty, params,
    programs: { mix: progWhichSlitMix, detector: progWhichSlitDetector, overlap: progWaveOverlap },
    geometry: () => ({ width: simW, height: simH, rightX: rightDetectorX() }),
    makeTexture: makeTexFloat32, makeFBO, evolve: evolveWave, readSurface: readFloatSurface,
    initialize(fbo, position, sigma, momentum) {
      gl.useProgram(progWaveInit);
      setWaveInitUniforms();
      gl.uniform1i(U.waveInit.uLocalizedPacket, 1);
      gl.uniform2fv(U.waveInit.uPacketPosPx, position);
      gl.uniform2fv(U.waveInit.uLocalizedSigma, sigma);
      gl.uniform2fv(U.waveInit.uLocalizedMomentum, momentum);
      gl.bindVertexArray(vaoEmpty);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, simW, simH);
      gl.disable(gl.BLEND);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    commit(source) {
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, source);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fboA);
      gl.blitFramebuffer(0, 0, simW, simH, 0, 0, simW, simH, gl.COLOR_BUFFER_BIT, gl.NEAREST);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      flip = 0;
    },
  });
}

function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function randomWhichSlitLaunch() {
  // Keep future launches reproducible when a recording copies the live series.
  if (whichSlitLaunchState === null) whichSlitLaunchState = Math.floor(Math.random() * 0xffffffff);
  whichSlitLaunchState = (Math.imul(whichSlitLaunchState, 1664525) + 1013904223) >>> 0;
  return (whichSlitLaunchState + 0.5) / 4294967296;
}

function histogramExperimentKey() {
  if (!params.whichSlit) return null;
  return [simW, simH, stageH, paddingY, params.p0, params.packetSigma,
    params.slitWidth, params.slitSep, params.barrierX, params.barrierThick,
    params.packetX, params.packetY, params.V0, params.hbar, params.mass,
    params.guidingMode, params.spinSign, params.spinMagnitude, params.dt,
    params.absorbPx, params.absorbStrength, params.particleKillMargin].join("|");
}

function snapshotHistogram() {
  return { bins: rightHistogram.bins.slice(), seen: rightHistogram.seen.slice(), total: rightHistogram.total };
}

function beginWhichSlitRun() {
  whichSlitHistogramKey = histogramExperimentKey();
  whichSlitRunStartHistogram = params.whichSlit ? snapshotHistogram() : null;
  whichSlitDelayRemaining = 0;
  whichSlitPendingRestart = false;
  whichSlitRunTime = 0;
}

function rebuildParticles(startingState = null, preserveHistogram = false) {
  if (params.whichSlit) params.nParticles = 1;
  const n = Math.floor(params.nParticles);

  if (particleSrc) gl.deleteBuffer(particleSrc);
  if (particleDst) gl.deleteBuffer(particleDst);
  if (vaoParticles) gl.deleteVertexArray(vaoParticles);
  if (tf) gl.deleteTransformFeedback(tf);

  particleSrc = gl.createBuffer();
  particleDst = gl.createBuffer();

  const data = startingState ? new Float32Array(startingState) : new Float32Array(n * 4);

  const sigma1D = params.packetSigma / Math.sqrt(2);
  const x0 = params.packetX * stageW;
  const y0 = paddingY + params.packetY * stageH;

  for (let i = 0; !startingState && i < n; i++) {
    let [x, y] = params.whichSlit
      ? sampleWhichSlitStart(params, { width: simW, height: simH, stageHeight: stageH, paddingY }, randomWhichSlitLaunch)
      : [x0 + randn() * sigma1D, y0 + randn() * sigma1D];
    x = Math.max(0, Math.min(simW - 1, x));
    y = Math.max(0, Math.min(simH - 1, y));
    data[i * 4 + 0] = x;
    data[i * 4 + 1] = y;
    data[i * 4 + 2] = 1.0;
    // WebGL y increases upwards. Bits record the starting lower half and right half.
    // 0: upper left, 1: lower left, 2: upper right, 3: lower right.
    // Classify the stored float coordinates, which are the positions the GPU uses.
    data[i * 4 + 3] = (data[i * 4 + 1] < y0 ? 1 : 0) | (data[i * 4] >= x0 ? 2 : 0);
  }

  if (!startingState) assignRadialGroups(data, x0, y0);
  initialParticleState = data.slice();
  whichSlit?.reset(data);
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
  particleReadback = new Float32Array(n * 4);
  if (preserveHistogram) rightHistogram.beginRun(n);
  else rightHistogram.reset(n, stageH, paddingY);
  lastHistogramReadFrame = -1;
  lastHistogramReadTime = -Infinity;
}

function captureRightDetectorHits(force = false) {
  if (!particleSrc || lastHistogramReadFrame === physicsFrame) return;
  const now = performance.now();
  // Frozen detections persist, so a 10 Hz readback keeps all hits without stalling every frame.
  if (!force && now - lastHistogramReadTime < 100) return;
  const previous = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
  gl.bindBuffer(gl.ARRAY_BUFFER, particleSrc);
  gl.getBufferSubData(gl.ARRAY_BUFFER, 0, particleReadback);
  gl.bindBuffer(gl.ARRAY_BUFFER, previous);
  rightHistogram.record(particleReadback);
  lastHistogramReadFrame = physicsFrame;
  lastHistogramReadTime = now;
}

function rightDetectorX() {
  return (simW - 1) - 2.25 * (params.absorbPx + params.particleKillMargin);
}

function verticalDetectorInset() {
  // The upper/lower particle detectors, like the absorber, stay beyond the stage.
  return Math.max(1, Math.min(1.5 * (params.absorbPx + params.particleKillMargin), paddingY - 8));
}

function verticalAbsorbStrength() {
  // An overly strong imaginary potential reflects slow waves at its entrance.
  // Scale the vertical absorber to the Gaussian packet's mean kinetic energy.
  const energy = (params.p0 ** 2 + (params.hbar / params.packetSigma) ** 2) / (2 * params.mass);
  return Math.min(params.absorbStrength, energy);
}

function renderRightDetectorHistogram() {
  captureRightDetectorHits(paused || frameRecordingActive);
  rightHistogram.render({
    width: canvas.clientWidth,
    height: canvas.clientHeight,
    pixelWidth: canvas.width,
    pixelHeight: canvas.height,
    simWidth: simW,
    rightX: rightDetectorX(),
    view,
    colorMask: pathColorMask(),
    visible: Boolean(params.showHistogram),
  });
}

function renderPhaseLegend() {
  phaseLegendCanvas.hidden = !params.showPhase;
  if (!params.showPhase) return;
  phaseLegendPlacement = phaseLegendLayout(canvas.clientWidth, canvas.clientHeight);
  const { x, y, width, height, scale } = phaseLegendPlacement;
  const pixelScale = canvas.width / canvas.clientWidth;
  if (phaseLegendCanvas.width !== Math.round(width * pixelScale)
    || phaseLegendCanvas.height !== Math.round(height * pixelScale)) {
    paintPhaseLegend(phaseLegendCanvas, scale * pixelScale);
  }
  Object.assign(phaseLegendCanvas.style, { left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` });
}

function particleUpdate() {
  const n = Math.floor(params.nParticles);
  const waveTex = guidingWaveTexture();

  gl.useProgram(progPartUpdate);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, waveTex);
  gl.uniform1i(U.partUpdate.uState, 0);

  gl.uniform2i(U.partUpdate.uSimRes, simW, simH);
  gl.uniform1f(U.partUpdate.uHBAR, params.hbar);
  gl.uniform1f(U.partUpdate.uMass, params.mass);
  gl.uniform1f(U.partUpdate.uDT, simulationDt());
  gl.uniform1i(U.partUpdate.uGuidingMode, params.guidingMode | 0);
  gl.uniform1f(U.partUpdate.uSpinMagnitude, params.spinMagnitude);
  gl.uniform1f(U.partUpdate.uSpinSign, params.spinSign);

  gl.uniform1f(U.partUpdate.uBarrierXFrac, params.barrierX);
  gl.uniform1f(U.partUpdate.uBarrierThickPx, params.barrierThick);
  gl.uniform1f(U.partUpdate.uSlitWidthPx, params.slitWidth);
  gl.uniform1f(U.partUpdate.uSlitSepPx, params.slitSep);
  gl.uniform1f(U.partUpdate.uV0, params.V0);

  gl.uniform1f(U.partUpdate.uAbsorbPx, params.absorbPx);
  gl.uniform1f(U.partUpdate.uVerticalDetectorInset, verticalDetectorInset());
  gl.uniform1f(U.partUpdate.uBoundaryFreezeChance, BOUNDARY_FREEZE_DETECTION_CHANCE);
  gl.uniform1i(U.partUpdate.uPhysicsFrame, physicsFrame);
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

  physicsFrame = (physicsFrame + 1) % 1000000000;
}

const LN2 = Math.log(2);
function fadeFromHalfLife(halfLife, dtTotal) {
  if (halfLife <= 0) return 0.0;
  return Math.exp(-LN2 * (dtTotal / halfLife));
}

function rebuildDensity(width = canvas.width, height = canvas.height) {
  gl.deleteFramebuffer(densFboA);
  gl.deleteFramebuffer(densFboB);
  gl.deleteTexture(densTexA);
  gl.deleteTexture(densTexB);
  gl.deleteTexture(radialTexA);
  gl.deleteTexture(radialTexB);
  densW = width;
  densH = height;

  densTexA = makeTexRGBA16F(densW, densH);
  densTexB = makeTexRGBA16F(densW, densH);
  radialTexA = makeTexRGBA16F(densW, densH);
  radialTexB = makeTexRGBA16F(densW, densH);
  densFboA = makeFBO(densTexA, radialTexA);
  densFboB = makeFBO(densTexB, radialTexB);
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
  const dtTotal = trailFadeFrameDt();

  const waveTex = guidingWaveTexture();
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
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, densFlip ? radialTexB : radialTexA);
  gl.uniform1i(U.densityStep.uPrevRadial, 1);
  gl.uniform1f(U.densityStep.uFade, fade);

  gl.disable(gl.BLEND);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.enable(gl.BLEND);
  // Store quadrant and radial histories together, independent of display toggles.
  gl.blendFunc(gl.ONE, gl.ONE);
  gl.colorMask(true, true, true, true);

  gl.useProgram(progPartStamp);
  gl.bindVertexArray(vaoParticles);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, waveTex);
  gl.uniform1i(U.partStamp.uState, 0);
  gl.uniform1f(U.partStamp.uVisGain, params.visGain);
  gl.uniform1f(U.partStamp.uVisGamma, params.visGamma);
  gl.uniform1f(U.partStamp.uParticleTailFade, params.particleTailFade);
  gl.uniform2i(U.partStamp.uSimRes, simW, simH);
  gl.uniform4f(U.partStamp.uStageRect, 0, paddingY, stageW, stageH);
  gl.uniform1f(U.partStamp.uPointSize, params.dotSize);
  gl.uniform1f(U.partStamp.uDotSigma, params.dotSigma);
  gl.uniform1f(U.partStamp.uDotGain, params.dotGain);
  gl.uniform1f(U.partStamp.uStampGain, params.trailStampGain);
  gl.uniform1f(U.partStamp.uTrailWidth, particleTrailWidth());

  gl.drawArrays(gl.POINTS, 0, Math.floor(params.nParticles));

  gl.colorMask(true, true, true, true);
  gl.disable(gl.BLEND);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindVertexArray(null);

  densFlip = 1 - densFlip;
}

function computeBarrierOpacity() {
  const E = (params.p0 * params.p0) / (2 * params.mass);
  if (params.V0 <= 0) return 0.0;
  if (E >= params.V0) return 0.20;
  const kappa = Math.sqrt(2 * params.mass * (params.V0 - E)) / params.hbar;
  const T = Math.exp(-2 * kappa * params.barrierThick);
  return Math.min(1.0, Math.max(0.20, 1.0 - T));
}

function drawKillBoundary() {

  const base = params.absorbPx + params.particleKillMargin;
  const absDistX = 1.5 * base;
  const freezeDistX = 1.5 * absDistX;
  const freezeDistY = verticalDetectorInset();

  const scaleX = canvas.width / stageW;
  const scaleY = canvas.height / stageH;

  const leftBoundaryX = freezeDistX * 1.20 * scaleX;
  const rightBoundaryX = rightDetectorX() * scaleX;
  const topBoundaryY = (freezeDistY - paddingY + 1) * scaleY;
  const bottomBoundaryY = (stageH + paddingY - freezeDistY) * scaleY;

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

  const boundaryThickness = 2 * canvas.width / densW;

  const canvasToNDCX = (px) => (px * 2 / canvas.width) - 1;
  const canvasToNDCY = (py) => 1 - (py * 2 / canvas.height);

  gl.useProgram(progBoundary);
  gl.bindVertexArray(vaoKillBoundary);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let comp = DEFAULT_PALETTE_COMPLEMENT;
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

function drawBarrier() {
  const opacity = computeBarrierOpacity();
  if (opacity <= 0 || params.barrierThick <= 0) return;

  gl.useProgram(progBarrierRender);
  gl.bindVertexArray(vaoEmpty);
  gl.uniform2i(U.barrierRender.uSimRes, stageW, stageH);
  gl.uniform1f(U.barrierRender.uBarrierXFrac, params.barrierX);
  gl.uniform1f(U.barrierRender.uBarrierThickPx, params.barrierThick);
  gl.uniform1f(U.barrierRender.uSlitWidthPx, params.slitWidth);
  gl.uniform1f(U.barrierRender.uSlitSepPx, params.slitSep);
  gl.uniform1f(U.barrierRender.uBarrierOpacity, opacity);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.disable(gl.BLEND);
  gl.bindVertexArray(null);
}

function render() {
  const waveTex = guidingWaveTexture();
  const densTex = params.colorCodeRadial
    ? (densFlip ? radialTexB : radialTexA)
    : (densFlip ? densTexB : densTexA);

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
  gl.uniform4f(U.waveRender.uStageUV, 0, paddingY / simH, stageW / simW, stageH / simH);

  gl.uniform1f(U.waveRender.uVisGain, params.visGain);
  gl.uniform1f(U.waveRender.uVisGamma, params.visGamma);
  gl.uniform1i(U.waveRender.uShowPhase, params.showPhase);

  gl.uniform1i(U.waveRender.uPaletteId, params.paletteId | 0);

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
    gl.uniform1i(U.densityRender.uColorCodeMask, pathColorMask());
    gl.uniform1i(U.densityRender.uBlendMode, params.trailBlendMode | 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.disable(gl.BLEND);
  }

  drawKillBoundary();

  if (params.showParticles) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(progPartView);
    gl.bindVertexArray(vaoParticles);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, waveTex);
    gl.uniform1i(U.partView.uState, 0);
    gl.uniform1f(U.partView.uVisGain, params.visGain);
    gl.uniform1f(U.partView.uVisGamma, params.visGamma);
    gl.uniform1f(U.partView.uParticleTailFade, params.particleTailFade);
    gl.uniform2i(U.partView.uSimRes, simW, simH);
    gl.uniform4f(U.partView.uStageRect, 0, paddingY, stageW, stageH);
    gl.uniform1f(U.partView.uPointSize, params.dotSize * canvas.width / densW);
    gl.uniform1f(U.partView.uDotSigma, params.dotSigma);
    gl.uniform1f(U.partView.uDotGain, params.dotGain);
    gl.uniform1i(U.partView.uColorCodeMask, pathColorMask());
    gl.uniform1f(U.partView.uTrailWidth, 0.0);

    gl.drawArrays(gl.POINTS, 0, Math.floor(params.nParticles));

    gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
  }

  // The solid screen occludes the trails and dot edges; its openings remain clear.
  drawBarrier();
  whichSlit?.drawDetector(stageW, stageH);
  renderRightDetectorHistogram();
  renderPhaseLegend();
}

function guidingModeLabel() {
  if ((params.guidingMode | 0) === 1) {
    return `${GUIDING_MODE_NAMES[1]} (${params.spinSign > 0 ? "up" : "down"}, |s| = ${fmt(params.spinMagnitude)} hbar)`;
  }
  return GUIDING_MODE_NAMES[params.guidingMode | 0] ?? GUIDING_MODE_NAMES[0];
}

function updateStats() {
  statsEl.innerHTML = `<b>Guiding</b>: ${guidingModeLabel()}`;
  if (params.whichSlit && whichSlit) {
    const state = whichSlit.info;
    const slit = state.slit > 0 ? "Upper slit" : "Lower slit";
    const text = whichSlitPendingRestart ? "Run complete · Next particle shortly"
      : state.status === "waiting" ? "Biased launch · Waiting for a slit"
      : state.status === "missed" ? "No slit detected · Next particle shortly"
      : state.status === "collapsing" ? `${slit} detected · Localizing wave`
      : `${slit} detected · Guiding continues`;
    statsEl.innerHTML += `<div class="slit-status">${text}</div>`;
  }
}

function rebuildSimulation() {
  resizeCanvas();

  stageW = Math.max(64, Math.floor(canvas.width * params.simScale));
  stageH = Math.max(64, Math.floor(canvas.height * params.simScale));
  paddingY = Math.max(0, Math.min(Math.round(params.edgePadding), Math.floor((maxTextureSize - stageH) / 2)));
  simW = stageW;
  simH = stageH + 2 * paddingY;
  // A free propagation gap keeps even the start of the damping ramp outside the view.
  verticalAbsorbWidth = Math.max(0, paddingY - ABSORBER_GUARD_CELLS);

  gl.deleteFramebuffer(fboA);
  gl.deleteFramebuffer(fboB);
  gl.deleteTexture(texA);
  gl.deleteTexture(texB);
  texA = makeTexFloat32(simW, simH);
  texB = makeTexFloat32(simW, simH);
  fboA = makeFBO(texA);
  fboB = makeFBO(texB);
  flip = 0;

  resetWave();
  rebuildParticles();
  rebuildDensity();
  beginWhichSlitRun();
  physicsFrame = 0;
  beginInitialHold();
  overlayScale?.update();
  overlayCoordinates?.update();
}

function resetAll({ preserveHistogram = Boolean(params.whichSlit) } = {}) {
  const keepHits = preserveHistogram && params.whichSlit
    && whichSlitHistogramKey === histogramExperimentKey();
  if (keepHits) captureRightDetectorHits(true);
  resetWave();
  rebuildParticles(null, keepHits);
  clearDensity();
  beginWhichSlitRun();
  physicsFrame = 0;
  embeddedFramesSinceReset = 0;
  beginInitialHold();
}

window.addEventListener("resize", event => {
  if (!simulationReady && !frameRecordingActive) return;
  if (template?.workspace.hidden) return;
  if (frameRecordingActive) {
    resizeDuringRecording = true;
    return;
  }
  // The shared Expand/Restore control dispatches a synthetic resize after
  // moving the stage. Keep the wave, particle buffers, and detector counts.
  if (template && !event.isTrusted) {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const previousWidth = canvas.width / dpr;
    const previousHeight = canvas.height / dpr;
    if (previousWidth > 0 && previousHeight > 0) {
      view.offsetX *= canvas.clientWidth / previousWidth;
      view.offsetY *= canvas.clientHeight / previousHeight;
    }
    resizeCanvas();
    applyViewTransform();
    render();
    return;
  }
  rebuildSimulation();
  if (userAdjustedView) {
    applyViewTransform();
  } else {
    applyInitialViewTransform();
  }
});

function observeWhichSlitParticle() {
  const previous = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
  gl.bindBuffer(gl.ARRAY_BUFFER, particleSrc);
  gl.getBufferSubData(gl.ARRAY_BUFFER, 0, singleParticleReadback);
  gl.bindBuffer(gl.ARRAY_BUFFER, previous);
  whichSlit.observe(singleParticleReadback, flip ? texB : texA, physicsFrame);
}

function advanceSimulationFrame(presentationDt = 1 / 60) {
  if (params.whichSlit && whichSlitHistogramKey !== histogramExperimentKey()) {
    resetAll({ preserveHistogram: false });
    return;
  }
  if (params.whichSlit && whichSlitDelayRemaining > 0) {
    whichSlitDelayRemaining = Math.max(0, whichSlitDelayRemaining - presentationDt);
    if (whichSlitDelayRemaining < 1e-8 && whichSlitPendingRestart) {
      resetAll();
      // The common tick handles this opening hold in both live and video runs.
      initialHoldRemaining = 0;
      whichSlitDelayRemaining = INITIAL_HOLD_SECONDS;
    }
    return;
  }
  const steps = simulationStepsPerFrame();
  const detectorLookAhead = 2 * steps * simulationDt() * params.p0 / params.mass;
  for (let i = 0; i < steps; i++) {
    waveStep();
    whichSlit?.advance(flip ? texB : texA, simulationDt());
    particleUpdate();
    // Only the one-particle measurement needs these extra reads. Check near
    // the slit within a frame so fast playback cannot delay detection by an
    // entire frame's travel. Ordinary ensemble evolution is unchanged.
    if (params.whichSlit && (i + 1) % 8 === 0 && whichSlit.nearDetector(detectorLookAhead)) {
      observeWhichSlitParticle();
    }
  }
  if (params.whichSlit) {
    observeWhichSlitParticle();
    whichSlitRunTime += steps * simulationDt();
    const timeout = Math.max(400, 4 * simW * params.mass / Math.max(0.1, params.p0));
    if (singleParticleReadback[2] !== 1 || whichSlitRunTime > timeout) {
      captureRightDetectorHits(true);
      whichSlitPendingRestart = true;
      whichSlitDelayRemaining = 0.5;
    }
  }
  densityStepAndStamp();
}

function shouldAdvancePhysics(frameSeconds) {
  if (paused) return false;
  if (initialHoldRemaining > 0) {
    // Show the initial wave and dots without advancing physics, trails, or detections.
    // Paused/hidden time is never saved up for a later catch-up step.
    initialHoldRemaining = Math.max(0, initialHoldRemaining - frameSeconds);
    return false;
  }
  return true;
}

function drawSimulationFrame(advancePhysics, presentationDt = 1 / 60) {
  if (template?.workspace.hidden) return;
  resizeCanvas();

  if (advancePhysics) {
    advanceSimulationFrame(presentationDt);
    const autoRestartFrames = getEmbedAutoRestartFrameLimit();
    if (isEmbedded && autoRestartFrames > 0) {
      embeddedFramesSinceReset += 1;
      if (embeddedFramesSinceReset >= autoRestartFrames) {
        resetAll();
      }
    }
  }

  render();
  updateStats();
}

// Capture only the current ping-pong inputs: each simulation pass fully replaces
// its output. The wave texture also contains the previous time level in BA.
function readFloatSurface(framebuffer, width, height, attachment = gl.COLOR_ATTACHMENT0) {
  const previous = gl.getParameter(gl.READ_FRAMEBUFFER_BINDING);
  const data = new Float32Array(width * height * 4);
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, framebuffer);
  const previousReadBuffer = gl.getParameter(gl.READ_BUFFER);
  try {
    gl.readBuffer(attachment);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.FLOAT, data);
    if (gl.getError() !== gl.NO_ERROR) throw new Error("Could not copy the current simulation for video.");
    return data;
  } finally {
    gl.readBuffer(previousReadBuffer);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, previous);
  }
}

function createVideoSnapshot(start = "beginning") {
  if (!simulationReady || gl.isContextLost()) throw new Error("The simulation is not ready to record.");
  const current = start === "current";
  let particles = initialParticleState.slice();
  if (current) {
    captureRightDetectorHits(true);
    const previous = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    gl.bindBuffer(gl.ARRAY_BUFFER, particleSrc);
    gl.getBufferSubData(gl.ARRAY_BUFFER, 0, particles);
    gl.bindBuffer(gl.ARRAY_BUFFER, previous);
  }
  return {
    params: { ...params }, speed: getSimulationSpeed(), trailFadeDt: trailFadeFrameDt(), view: { ...view }, start,
    displayWidth: canvas.clientWidth, displayHeight: canvas.clientHeight,
    stageW, stageH, simW, simH, paddingY, verticalAbsorbWidth, densW, densH,
    particles, physicsFrame: current ? physicsFrame : 0,
    holdRemaining: current ? initialHoldRemaining : INITIAL_HOLD_SECONDS,
    wave: current ? readFloatSurface(flip ? fboB : fboA, simW, simH) : null,
    trails: current ? readFloatSurface(densFlip ? densFboB : densFboA, densW, densH) : null,
    radialTrails: current ? readFloatSurface(densFlip ? densFboB : densFboA, densW, densH, gl.COLOR_ATTACHMENT1) : null,
    histogram: current ? snapshotHistogram() : (params.whichSlit ? structuredClone(whichSlitRunStartHistogram) : null),
    slitSeries: params.whichSlit ? { launchState: whichSlitLaunchState,
      delayRemaining: current ? whichSlitDelayRemaining : 0,
      pendingRestart: current && whichSlitPendingRestart,
      runTime: current ? whichSlitRunTime : 0 } : null,
    measurement: current && params.whichSlit ? whichSlit.snapshot() : null,
  };
}

function configureVideoRenderer(snapshot, width, height) {
  if (!isVideoRenderer || !simulationReady) throw new Error("The video renderer is not ready.");
  const limit = Math.min(maxTextureSize, gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
  if (width > limit || height > limit) throw new Error("This GPU needs a smaller video size.");
  Object.assign(params, snapshot.params, { showHistogram: 1 });
  setSimulationSpeed(snapshot.speed);
  setSimulationFrameDuration(1 / 60);
  ({ stageW, stageH, simW, simH, paddingY, verticalAbsorbWidth } = snapshot);
  recordingSurface = { width, height, trailFadeDt: snapshot.trailFadeDt };
  resizeCanvas();
  if (gl.drawingBufferWidth !== width || gl.drawingBufferHeight !== height) throw new Error("This GPU cannot allocate the video surface. Try a smaller size.");
  texA = makeTexFloat32(simW, simH);
  texB = makeTexFloat32(simW, simH);
  fboA = makeFBO(texA);
  fboB = makeFBO(texB);
  flip = 0;
  const upload = (texture, data, w, h) => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RGBA, gl.FLOAT, data);
  };
  if (snapshot.wave) upload(texA, snapshot.wave, simW, simH);
  else resetWave();
  rebuildParticles(snapshot.particles);
  rebuildDensity(snapshot.densW, snapshot.densH);
  if (snapshot.trails) upload(densTexA, snapshot.trails, densW, densH);
  if (snapshot.radialTrails) upload(radialTexA, snapshot.radialTrails, densW, densH);
  if (snapshot.histogram) {
    rightHistogram.bins.set(snapshot.histogram.bins);
    rightHistogram.seen.set(snapshot.histogram.seen);
    rightHistogram.total = snapshot.histogram.total;
    rightHistogram.version++;
  }
  beginWhichSlitRun();
  whichSlitLaunchState = snapshot.slitSeries?.launchState ?? null;
  whichSlitDelayRemaining = snapshot.slitSeries?.delayRemaining ?? 0;
  whichSlitPendingRestart = snapshot.slitSeries?.pendingRestart ?? false;
  whichSlitRunTime = snapshot.slitSeries?.runTime ?? 0;
  whichSlit.restore(snapshot.measurement, texA);
  physicsFrame = snapshot.physicsFrame;
  initialHoldRemaining = snapshot.holdRemaining;
  videoTick = 0;
  videoHoldTicks = Math.max(0, Math.ceil(initialHoldRemaining * 60 - 1e-8));
  Object.assign(view, snapshot.view);
  paused = false;
  render();
  if (gl.getError() !== gl.NO_ERROR) throw new Error("Could not prepare the simulation for video.");
}

function renderVideoFrame(frame, fps) {
  if (!isVideoRenderer || !recordingSurface) throw new Error("No video render is active.");
  // Two normal 60 Hz simulation ticks per 30 fps video frame. Wall-clock
  // encoding delays never change the timestep, trail fading, or opening hold.
  const targetTick = Math.round(frame * 60 / fps);
  while (videoTick < targetTick) {
    if (videoTick >= videoHoldTicks) advanceSimulationFrame();
    videoTick++;
  }
  render();
  if (gl.isContextLost() || gl.getError() !== gl.NO_ERROR) throw new Error("The GPU could not render a video frame. Try a smaller size.");
  return { canvas, histogram: rightHistogram.canvas, physicsFrame, detectorHits: rightHistogram.total,
    phaseLegend: params.showPhase ? { canvas: phaseLegendCanvas, ...phaseLegendPlacement } : null,
    measurement: params.whichSlit ? { ...whichSlit.info } : null };
}

window.BohmianDoubleSlit = {
  ...(window.BohmianDoubleSlit || {}),
  beginFrameRecording() {
    recordingViewport = { width: canvas.clientWidth, height: canvas.clientHeight };
    resizeDuringRecording = false;
    frameRecordingActive = true;
    if (template) {
      template.commonControls.setAttribute("disabled", "true");
      template.stage.querySelector(".qontic-media-toolbar").inert = true;
      document.querySelector("main.shell .tabs").inert = true;
    }
    resetPlaybackClock();
  },
  endFrameRecording() {
    frameRecordingActive = false;
    if (template) {
      template.commonControls.removeAttribute("disabled");
      template.stage.querySelector(".qontic-media-toolbar").inert = false;
      document.querySelector("main.shell .tabs").inert = false;
    }
    if (resizeDuringRecording && recordingViewport) {
      // Resizing during export must not reset the saved live run.
      view.offsetX *= canvas.clientWidth / recordingViewport.width;
      view.offsetY *= canvas.clientHeight / recordingViewport.height;
      resizeCanvas();
      applyViewTransform();
    }
    recordingViewport = null;
    resizeDuringRecording = false;
    resetPlaybackClock();
    render();
  },
  isReady() {
    return simulationReady;
  },
  getInitializationError() { return initializationError; },
  createVideoSnapshot,
  configureVideoRenderer,
  renderVideoFrame,
  disposeVideoRenderer() {
    if (isVideoRenderer) gl.getExtension("WEBGL_lose_context")?.loseContext();
  },
  renderRecordingFrame() {
    if (!simulationReady) return;
    // Keep the opening still equally long in a frame-by-frame recording.
    const frameSeconds = 1 / 60;
    setSimulationFrameDuration(frameSeconds);
    drawSimulationFrame(shouldAdvancePhysics(frameSeconds));
  },
};

if (template) {
  const gridLength = () => params.nmPerGridStep;
  const unitsPerPixel = () => ({
    x: gridLength() * Math.max(1, stageW) / Math.max(1, canvas.clientWidth * view.zoom),
    y: gridLength() * Math.max(1, stageH) / Math.max(1, canvas.clientHeight * view.zoom),
  });
  const formatDistance = nm => Math.abs(nm) >= 1000
    ? `${Number((nm / 1000).toPrecision(3))} µm`
    : `${Number(nm.toPrecision(3))} nm`;
  overlayScale = mountDistanceScale({
    host: template.wrap, getUnitsPerPixel: unitsPerPixel, format: formatDistance,
    storageKey: "qontic-double-slit-2-scale-position",
  });
  overlayCoordinates = mountCoordinateTools({
    host: template.wrap,
    getBounds: () => {
      const units = unitsPerPixel();
      return {
        xMin: -view.offsetX * units.x,
        xMax: (canvas.clientWidth - view.offsetX) * units.x,
        yMin: -view.offsetY * units.y,
        yMax: (canvas.clientHeight - view.offsetY) * units.y,
      };
    },
    formatValue: formatDistance,
    storageKey: "qontic-double-slit-2-grid-visible",
  });
  // The WebGL canvas is translated and zoomed. Compose the clipped stage for
  // the shared screenshot action, including the independently drawn overlays.
  const screenshotSurface = document.createElement("canvas");
  screenshotSurface.className = "template-screenshot-surface";
  screenshotSurface.setAttribute("aria-hidden", "true");
  template.wrap.append(screenshotSurface);
  const captureStage = () => {
    render(); // Read the WebGL drawing buffer in the same task as the capture.
    screenshotSurface.width = canvas.width;
    screenshotSurface.height = canvas.height;
    const ctx = screenshotSurface.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, screenshotSurface.width, screenshotSurface.height);
    const hostRect = template.wrap.getBoundingClientRect();
    const sx = screenshotSurface.width / hostRect.width;
    const sy = screenshotSurface.height / hostRect.height;
    for (const layer of [canvas, rightHistogram.canvas, phaseLegendCanvas, overlayCoordinates.canvas, overlayScale.canvas]) {
      const rect = layer.getBoundingClientRect();
      if (!(rect.width > 0 && rect.height > 0)) continue;
      ctx.drawImage(layer, (rect.left - hostRect.left) * sx, (rect.top - hostRect.top) * sy, rect.width * sx, rect.height * sy);
    }
    return [screenshotSurface];
  };
  mountQonticMedia({
    stage: template.stage, controls: template.commonControls,
    filename: "qontic-double-slit-2",
    scaleControl: overlayScale, coordinateControl: overlayCoordinates,
    getCanvases: captureStage,
    onRecord: () => {
      template.setActivePane("advanced");
      document.getElementById("export-options").open = true;
      document.getElementById("export-options").scrollIntoView({block:"nearest"});
    },
  });
}

async function main() {
  await loadShaders();
  buildPrograms();
  initializeWhichSlitMeasurement();
  if (isVideoRenderer) {
    simulationReady = true;
    return;
  }
  rebuildSimulation();
  applyInitialViewTransform();
  updateStats();
  simulationReady = true;

  params.trailHalfLife*=0.99;
  if (!isEmbedded) initRecorder(window.BohmianDoubleSlit);

  requestAnimationFrame(function loop(now = performance.now()) {
    const elapsedSeconds = lastFrameTime === null ? 0 : Math.max(0, (now - lastFrameTime) / 1000);
    lastFrameTime = now;
    if (!frameRecordingActive) {
      setSimulationFrameDuration(Math.min(0.05, elapsedSeconds));
      drawSimulationFrame(!template?.workspace.hidden && !document.hidden && shouldAdvancePhysics(elapsedSeconds), Math.min(0.05, elapsedSeconds));
    }

    requestAnimationFrame(loop);
  });
}

main().catch(err => {
  initializationError = String(err);
  console.error(err);
  if (!isVideoRenderer) alert(String(err));
});
