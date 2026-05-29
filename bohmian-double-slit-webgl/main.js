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
  simScale: 0.5,
  stepsPerFrame: 30,

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
  rhoMin: 1e-6,
  velClamp: 160.0,
  guidingMode: 1,
  guidingChoice: 1,
  spinSign: 1,
  spinMagnitude: 0.5,

  visGain: 20.0,
  visGamma: 0.5,
  showPhase: 1,

  showParticles: 1,
  dotSize: 10.0,
  dotSigma: 0.28,
  dotGain: 1.,

  showTrail: 1,
  trailHalfLife: 100.0,
  trailVisGain: 1.,
  trailVisGamma: 1,
  trailStampGain: 0.55,
  trailWidth: 5.0,
  trailBlendMode: 1,

  paletteId: 0,
};

const DEFAULT_AUTO_RESTART_MOMENTUM = params.p0;

const urlParams = new URLSearchParams(window.location.search);
const isEmbedded = urlParams.get("embed") === "1";
const preset = urlParams.get("preset");
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
  trailWidth: 15.0,
  trailVisGain: .3,
  trailHalfLife: 190.0,
  showTrail: 1,
};

const particleCountPreset = { ...oneParticlePreset };

particleCountPreset.nParticles= 500,
particleCountPreset.dotSize = 7.0;
particleCountPreset.trailWidth = 5.0;
particleCountPreset.trailVisGain = .5;
particleCountPreset.trailGamma = .5;
particleCountPreset.trailHalfLife = 19.0;

const equivariancePreset = { ...particleCountPreset };
equivariancePreset.showPhase = 0;
equivariancePreset.nParticles = 5000;
equivariancePreset.dotSize = 4.0;
equivariancePreset.dotGain = 0.6;
equivariancePreset.trailWidth = 1.0;
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
let frameRecordingActive = false;
let simulationReady = false;

const controls = document.getElementById("controls");
const statsEl = document.getElementById("stats");

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
  if (isControlFixed(key)) return;

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
  controls.querySelectorAll(".section-header").forEach((header) => {
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

addSectionHeader("Performance");
addSlider("simScale", "sim scale", 0.3, 1.0, 0.1, () => rebuildSimulation());
addSlider("stepsPerFrame", "Steps/frame", 1, 100, 1);

addSectionHeader("Physical Parameters");
addSlider("p0", "Momentum p", 0.5, 5.0, 0.1, () => resetAll());
addSlider("dt", "dt", 0.01, 0.03, 0.01);
addSlider("packetSigma", "packet sigma", 8.0, 80.0, 1.0, () => resetAll());
addSlider("slitWidth", "slit width", 6.0, 40.0, 1.0);
addSlider("slitSep", "slit separation", 18.0, 140.0, 1.0);
addSlider("absorbPx", "absorb boundary", 0.0, 60.0, 1.0);
addSlider("nParticles", "particle count", 1, 3000, 10, () => resetAll());
addSlider("spinMagnitude", "spin |s|", 0.0, 2.0, 0.5);
addChoiceButtons("guidingChoice", "guiding law", GUIDING_CHOICE_NAMES, (choice) => {
  params.guidingMode = choice === 0 ? 0 : 1;
  params.spinSign = choice === 2 ? -1 : 1;
  resetAll();
});

addSectionHeader("Visual Parameters");
addToggleInt("showPhase", "show phase");
addToggleInt("showParticles", "show particles");
addSlider("dotSize", "particle size", 2.0, 16.0, 0.5);
addSlider("dotGain", "particle brightness", 0.1, 3.0, 0.1);

addToggleInt("showTrail", "draw trails");
addSlider("trailHalfLife", "trail half-life", 1.0, 150.0, 1.0);
//addSlider("trailVisGain", "trail gain", 0.1, 1.0, 0.1);
//addSlider("trailVisGamma", "trail gamma", 0.4, 2.0, 0.05);
addSlider("trailWidth", "trail width (px)", 0.5, 10.0, 0.1);

//addSlider("visGain", "wave gain", 0.5, 20.0, 0.5);
//addSlider("visGamma", "wave gamma", 0.3, 2.0, 0.05);

removeEmptySectionHeaders();

const pauseButton = document.getElementById("pause");
function togglePause() {
  paused = !paused;
  pauseButton.textContent = paused ? "Resume" : "Pause";
}

document.getElementById("reset").onclick = () => resetAll();
pauseButton.onclick = () => togglePause();

if (isEmbedded) {
  canvas.addEventListener("click", () => togglePause());
} else {
  window.addEventListener("keydown", (e) => {
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

const INITIAL_ZOOM_FRACTION = 0.65;
const INITIAL_VIEW_SHIFT_X = 0.10;
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

function applyInitialViewTransform() {
  const visibleFraction = Math.min(1, Math.max(0.2, INITIAL_ZOOM_FRACTION));
  view.zoom = 1 / visibleFraction;
  view.offsetX = canvas.clientWidth * (1 - view.zoom) * 0.5 - canvas.clientWidth * INITIAL_VIEW_SHIFT_X;
  view.offsetY = canvas.clientHeight * (1 - view.zoom) * 0.5;
  applyViewTransform();
}

if (!isEmbedded) {
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
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
    uBarrierXFrac: u(progWaveInit, "uBarrierXFrac"),
    uBarrierThickPx: u(progWaveInit, "uBarrierThickPx"),
    uSlitWidthPx: u(progWaveInit, "uSlitWidthPx"),
    uSlitSepPx: u(progWaveInit, "uSlitSepPx"),
    uV0: u(progWaveInit, "uV0"),
    uAbsorbPx: u(progWaveInit, "uAbsorbPx"),
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
    uAbsorbStrength: u(progWaveStep, "uAbsorbStrength"),
  };

  U.waveRender = {
    uState: u(progWaveRender, "uState"),
    uSimRes: u(progWaveRender, "uSimRes"),
    uVisGain: u(progWaveRender, "uVisGain"),
    uVisGamma: u(progWaveRender, "uVisGamma"),
    uShowPhase: u(progWaveRender, "uShowPhase"),
    uBarrierXFrac: u(progWaveRender, "uBarrierXFrac"),
    uBarrierThickPx: u(progWaveRender, "uBarrierThickPx"),
    uSlitWidthPx: u(progWaveRender, "uSlitWidthPx"),
    uSlitSepPx: u(progWaveRender, "uSlitSepPx"),
    uV0: u(progWaveRender, "uV0"),
    uBarrierOpacity: u(progWaveRender, "uBarrierOpacity"),
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
    uBarrierXFrac: u(progPartUpdate, "uBarrierXFrac"),
    uBarrierThickPx: u(progPartUpdate, "uBarrierThickPx"),
    uSlitWidthPx: u(progPartUpdate, "uSlitWidthPx"),
    uSlitSepPx: u(progPartUpdate, "uSlitSepPx"),
    uV0: u(progPartUpdate, "uV0"),
    uAbsorbPx: u(progPartUpdate, "uAbsorbPx"),
    uBoundaryFreezeChance: u(progPartUpdate, "uBoundaryFreezeChance"),
    uPhysicsFrame: u(progPartUpdate, "uPhysicsFrame"),
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

  gl.uniform1f(U.waveInit.uBarrierXFrac, params.barrierX);
  gl.uniform1f(U.waveInit.uBarrierThickPx, params.barrierThick);
  gl.uniform1f(U.waveInit.uSlitWidthPx, params.slitWidth);
  gl.uniform1f(U.waveInit.uSlitSepPx, params.slitSep);
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
  gl.uniform1f(U.waveStep.uP0, params.p0);
  gl.uniform1f(U.waveStep.uDT, params.dt);

  gl.uniform1f(U.waveStep.uBarrierXFrac, params.barrierX);
  gl.uniform1f(U.waveStep.uBarrierThickPx, params.barrierThick);
  gl.uniform1f(U.waveStep.uSlitWidthPx, params.slitWidth);
  gl.uniform1f(U.waveStep.uSlitSepPx, params.slitSep);
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

  gl.uniform1f(U.partUpdate.uBarrierXFrac, params.barrierX);
  gl.uniform1f(U.partUpdate.uBarrierThickPx, params.barrierThick);
  gl.uniform1f(U.partUpdate.uSlitWidthPx, params.slitWidth);
  gl.uniform1f(U.partUpdate.uSlitSepPx, params.slitSep);
  gl.uniform1f(U.partUpdate.uV0, params.V0);

  gl.uniform1f(U.partUpdate.uAbsorbPx, params.absorbPx);
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

  gl.uniform1f(U.waveRender.uBarrierXFrac, params.barrierX);
  gl.uniform1f(U.waveRender.uBarrierThickPx, params.barrierThick);
  gl.uniform1f(U.waveRender.uSlitWidthPx, params.slitWidth);
  gl.uniform1f(U.waveRender.uSlitSepPx, params.slitSep);
  gl.uniform1f(U.waveRender.uV0, params.V0);

  gl.uniform1i(U.waveRender.uPaletteId, params.paletteId | 0);

  if (U.waveRender.uBarrierOpacity) {
    gl.uniform1f(U.waveRender.uBarrierOpacity, computeBarrierOpacity());
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
  statsEl.innerHTML = `<b>Guiding</b>: ${guidingModeLabel()}`;
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
  physicsFrame = 0;
}

function resetAll() {
  resetWave();
  rebuildParticles();
  clearDensity();
  physicsFrame = 0;
  embeddedFramesSinceReset = 0;
}

window.addEventListener("resize", () => {
  rebuildSimulation();
  if (userAdjustedView) {
    applyViewTransform();
  } else {
    applyInitialViewTransform();
  }
});

function advanceSimulationFrame() {
  const steps = Math.max(0, Math.floor(params.stepsPerFrame));
  for (let i = 0; i < steps; i++) {
    waveStep();
    particleUpdate();
  }
  densityStepAndStamp();
}

function drawSimulationFrame(advancePhysics) {
  resizeCanvas();

  if (advancePhysics) {
    advanceSimulationFrame();
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

window.BohmianDoubleSlit = {
  ...(window.BohmianDoubleSlit || {}),
  beginFrameRecording() {
    frameRecordingActive = true;
  },
  endFrameRecording() {
    frameRecordingActive = false;
  },
  isReady() {
    return simulationReady;
  },
  renderRecordingFrame() {
    if (!simulationReady) return;
    drawSimulationFrame(!paused);
  },
};

async function main() {
  await loadShaders();
  buildPrograms();
  rebuildSimulation();
  applyInitialViewTransform();
  updateStats();
  simulationReady = true;

  params.trailHalfLife*=0.99;

  requestAnimationFrame(function loop() {
    if (!frameRecordingActive) {
      drawSimulationFrame(!paused);
    }

    requestAnimationFrame(loop);
  });
}

main().catch(err => {
  console.error(err);
  alert(String(err));
});
