const canvas = document.getElementById("c");
const wrap = document.getElementById("wrap");
const overlayCanvas = document.createElement("canvas");
overlayCanvas.style.position = "absolute";
overlayCanvas.style.inset = "0";
overlayCanvas.style.width = "100%";
overlayCanvas.style.height = "100%";
overlayCanvas.style.pointerEvents = "none";
wrap.appendChild(overlayCanvas);
const overlayCtx = overlayCanvas.getContext("2d");
const detectorToggleButton = document.createElement("button");
detectorToggleButton.type = "button";
Object.assign(detectorToggleButton.style, {
  position: "absolute",
  width: "232px",
  height: "60px",
  padding: "0 20px",
  borderRadius: "16px",
  border: "2px solid rgba(220,235,245,0.45)",
  background: "rgba(25, 32, 38, 0.72)",
  color: "#f4f8fb",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "56px",
  textAlign: "center",
  cursor: "pointer",
  touchAction: "none",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
  zIndex: "3",
});
wrap.appendChild(detectorToggleButton);
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
  p0: 2.5,
  dt: 0.02,

  packetX: 0.07,
  packetY: 0.75,
  packetSigma: 130.0,

  splitterX: 0.2,
  splitterLength: 1500.0,
  splitterWidth: 2.0,
  splitterOpacity: 0.55,

  detectorX: 0.65,
  detectorLength: 3500.0,
  detectorWidth: 20.0,
  detectorActive: 1,
  showHistogram: 1,

  guideMirrorsActive: 1,
  guideMirrorX: 0.35,
  guideMirrorAngleTrimDeg: 0,
  guideMirrorYTrim: 0.0,
  guideMirrorLength: 1950.0,
  guideMirrorWidth: 8.0,
  guideMirrorPhysicalWidth: 2.0,
  guideMirrorV0: 160.0,

  mirrorThickness: 14.0,
  mirrorV0: 120.0,

  absorbPx: 0.0,
  absorbStrength: 0.0,
  particleKillMargin: 1.0,

  rhoMin: 1e-6,
  velClamp: 160.0,
  guidingMode: 0,
  spinS: 0.5,

  visGain: 20.0,
  visGamma: 0.5,
  waveTailFade: .25,
  showWave: 1,
  showPhase: 1,

  showParticles: 1,
  colorCodePaths: 1,
  nParticles: 3000,
  dotSize: 12.0,
  dotSigma: 0.28,
  dotGain: 1.,

  showTrail: 1,
  trailHalfLife: 50.0,
  trailVisGain: .3,
  trailVisGamma: 2,
  trailStampGain: 0.35,
  trailWidth: 7.0,
  trailBlendMode: 1,
};

const urlParams = new URLSearchParams(window.location.search);
const preset = urlParams.get("preset");
const isEmbedded = urlParams.get("embed") === "1";

const embeddedBasePreset = {
  simScale: 0.3,
  stepsPerFrame: 30,
  dt: 0.02,
  p0: 2.5,
  packetSigma: 130.0,
  splitterX: 0.2,
  spinS: 0.5,
  guideMirrorsActive: 1,
  guideMirrorAngleTrimDeg: 0,
  guideMirrorYTrim: 0,
  guidingMode: 0,
  showWave: 1,
  showPhase: 1,
  showHistogram: 0,
  showParticles: 1,
  colorCodePaths: 1,
  nParticles: 100,
  dotSize: 10,
  dotGain: 1,
  showTrail: 1,
  trailHalfLife: 50,
  trailVisGain: 0.3,
  trailVisGamma: 2,
  trailWidth: 7,
  detectorActive: 1,
};

const standardCollapsePreset = {
  ...embeddedBasePreset,
  showParticles: 0,
  nParticles: 1,
  dotSize: 22,
  colorCodePaths: 0,
  showTrail: 0,
  waveTailFade: 0.45,
  showHistogram: 1,
};

const PRESETS = {
  "standard-collapse-edge": {
    params: {
      ...standardCollapsePreset,
      detectorActive: 0,
    },
    adjustable: ["nParticles"],
  },
  "standard-collapse": {
    params: {
      ...standardCollapsePreset,
      detectorActive: 1,
    },
    adjustable: ["nParticles"],
  },
  splitter: {
    params: {
      ...embeddedBasePreset,
      nParticles: 1,
      trailHalfLife: 190,
      dotSize: 15,
      trailWidth: 11,
      trailVisGain: 0.9,
    },
    adjustable: ["p0"],
  },
  ensemble: {
    params: {
      ...embeddedBasePreset,
      showPhase: 0,
      showHistogram: 1,
      nParticles: 1200,
      dotSize: 5,
      trailHalfLife: 25,
      trailWidth: 3,
      showTrail: 0,
    },
    adjustable: ["nParticles"],
  },
  "delayed-choice": {
    params: {
      ...embeddedBasePreset,
      showHistogram: 1,
      nParticles: 800,
      dotSize: 6,
      trailHalfLife: 35,
      trailWidth: 4,
      detectorActive: 0,
    },
    adjustable: ["nParticles"],
  },
};

const presetDefinition = PRESETS[preset];
const presetParams = presetDefinition?.params;
const adjustableControls = new Set(presetDefinition?.adjustable ?? []);
const detectorControlEnabled = !presetDefinition || isEmbedded;
const collapseEnabled =
  preset === "standard-collapse" || preset === "standard-collapse-edge";
if (!detectorControlEnabled) detectorToggleButton.style.display = "none";

if (presetParams) {
  Object.assign(params, presetParams);
}

function isControlFixed(key) {
  return Boolean(presetDefinition) && !adjustableControls.has(key);
}

const TARGET_SPLITTER_TRANSMISSION = 0.5;
const INPUT_NORMAL_MOMENTUM_SCALE = Math.SQRT1_2;
const SPLITTER_EDGE_FEATHER_PX = 2.0;
const VISUAL_SPLITTER_WIDTH_SCALE = 9.0;
const SPLITTER_CALIBRATION_MAX_V0 = 1e6;
const PHYSICAL_DOMAIN_SCALE = 2.0;
// The physics domain is authored at this size and is fitted to the canvas only for display.
const PHYSICAL_VIEW_WIDTH = 3200;
const PHYSICAL_VIEW_HEIGHT = 1800;
const DETECTOR_BUTTON_SCALE = isEmbedded ? 0.5 : 1.0;
const DETECTOR_BUTTON_WIDTH = 232 * DETECTOR_BUTTON_SCALE;
const DETECTOR_BUTTON_HEIGHT = 60 * DETECTOR_BUTTON_SCALE;
const DETECTOR_BUTTON_ROTATION_DEG = 0;
const DETECTOR_DRAG_THRESHOLD_PX = 4;
const DETECTOR_HISTOGRAM_BIN_FRACTION = 0.05;
const DETECTOR_HISTOGRAM_HIT_KERNEL_FRINGES = 0.10;
const DETECTOR_HISTOGRAM_SMOOTHING_FRINGES = 0.08;
const DETECTOR_HISTOGRAM_PROFILE_GAMMA = 0.72;
const DETECTOR_AUTO_PAUSE_FRACTION = 0.70;
const FALLBACK_ABSORB_WIDTH_PX = 180.0;
const FALLBACK_ABSORB_STRENGTH = 120.0;
const FALLBACK_DETECTOR_GAP_PX = 8.0;
const PARTICLE_RENDER_ALL = 0;
const PARTICLE_RENDER_DETECTED_ONLY = 1;
const VIEW_MIN_ZOOM = 1.0;
const VIEW_MAX_ZOOM = 24.0;
const VIEW_ZOOM_EASING = 20.0;
let splitterCalibrationCache = null;
let detectorDragState = null;
let guideMirrorDetectorX = params.detectorX;

Object.assign(detectorToggleButton.style, {
  width: `${DETECTOR_BUTTON_WIDTH}px`,
  height: `${DETECTOR_BUTTON_HEIGHT}px`,
  padding: `0 ${20 * DETECTOR_BUTTON_SCALE}px`,
  borderRadius: `${16 * DETECTOR_BUTTON_SCALE}px`,
  borderWidth: `${2 * DETECTOR_BUTTON_SCALE}px`,
  fontSize: `${24 * DETECTOR_BUTTON_SCALE}px`,
  lineHeight: `${56 * DETECTOR_BUTTON_SCALE}px`,
  backdropFilter: `blur(${12 * DETECTOR_BUTTON_SCALE}px)`,
  boxShadow: `0 ${8 * DETECTOR_BUTTON_SCALE}px ${28 * DETECTOR_BUTTON_SCALE}px rgba(0,0,0,0.28)`,
});
detectorToggleButton.style.transformOrigin = "center center";
detectorToggleButton.style.transform = `rotate(${DETECTOR_BUTTON_ROTATION_DEG}deg)`;

const GUIDING_MODE_NAMES = [
  "Schrodinger",
  "Pauli spin (+z)",
  "Pauli spin (-z)"
];

let paused = false;
const view = {
  zoom: 1.0,
  centerX: 0.5,
  centerY: 0.5,
};
const targetView = {
  zoom: view.zoom,
  centerX: view.centerX,
  centerY: view.centerY,
};
const collapse = {
  active: false,
  done: false,
  startMs: 0,
  durationMs: 675,
  xPx: 0,
  yPx: 0,
};
let previousFrameTime = performance.now();

const controls = document.getElementById("controls");
const statsEl = document.getElementById("stats");
statsEl.style.display = "none";

function fmt(v) {
  const av = Math.abs(v);
  if (av >= 1000 || (av > 0 && av < 0.01)) return v.toExponential(2);
  return v.toFixed(3).replace(/\.?0+$/, "");
}

function smooth01(t) {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

function collapseProgress() {
  if (!collapse.active) return 0;
  const progress = (performance.now() - collapse.startMs) /
    Math.max(1, collapse.durationMs);
  if (progress >= 1) collapse.done = true;
  return smooth01(progress);
}

function beginCollapseAt(xPx, yPx) {
  if (!collapseEnabled || collapse.active) return;
  collapse.active = true;
  collapse.done = false;
  collapse.startMs = performance.now();
  collapse.xPx = Math.max(0, Math.min(simW - 1, xPx));
  collapse.yPx = Math.max(0, Math.min(simH - 1, yPx));
  paused = true;
  pauseButton.textContent = "Detected";
  pauseButton.disabled = true;
}

function resetCollapse() {
  collapse.active = false;
  collapse.done = false;
  collapse.startMs = 0;
  collapse.xPx = 0;
  collapse.yPx = 0;
  pauseButton.disabled = false;
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

function addToggleInt(key, label, onChange = null) {
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
    onChange && onChange();
  });

  const val = document.createElement("div");
  val.className = "val";
  val.textContent = "";

  row.appendChild(lab);
  row.appendChild(btn);
  row.appendChild(val);
  controls.appendChild(row);
}

function addWaveViewControls() {
  if (isControlFixed("showPhase") && isControlFixed("showWave")) return;

  const row = document.createElement("div");
  row.className = "row";

  const lab = document.createElement("label");
  lab.textContent = "wave view";

  const group = document.createElement("div");
  group.className = "toggle-group";

  const phaseButton = document.createElement("button");
  const waveButton = document.createElement("button");
  waveButton.textContent = "show wave";

  function updateButtons() {
    phaseButton.textContent = params.showPhase ? "Phase" : "Density";
    waveButton.classList.toggle("selected", !!params.showWave);
  }

  phaseButton.addEventListener("click", () => {
    params.showPhase = params.showPhase ? 0 : 1;
    updateButtons();
  });

  waveButton.addEventListener("click", () => {
    params.showWave = params.showWave ? 0 : 1;
    updateButtons();
  });

  updateButtons();

  const val = document.createElement("div");
  val.className = "val";
  val.textContent = "";

  group.appendChild(phaseButton);
  group.appendChild(waveButton);
  row.appendChild(lab);
  row.appendChild(group);
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
  header.style.color = "#aaa";
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

addSlider("simScale", "grid density", 0.25, 1.0, 0.05, () => rebuildSimulation());
addSlider("stepsPerFrame", "Steps/frame", 1, 100, 1);
addSlider("dt", "dt", 0.01, 0.02, 0.001);

addSectionHeader("Physical Parameters");
addSlider("p0", "Momentum p", 0.5, 4.0, 0.1, () => resetAll());

addSlider("packetSigma", "packet sigma", 10.0, 150.0, 10.0);
//addSlider("splitterX", "splitter x", 0.0, 1.0, 0.01, () => resetAll());
//addSlider("spinS", "spin s", 0.0, 2.0, 0.5);

//addSectionHeader("Guide Mirrors");
//addToggleInt("guideMirrorsActive", "guide mirrors", () => resetAll());
//addSlider("guideMirrorAngleTrimDeg", "angle trim", -20.0, 20.0, 0.25, () => resetAll());
//addSlider("guideMirrorYTrim", "mirror y trim", -160.0, 160.0, 2.0, () => resetAll());

if (!isControlFixed("guidingMode")) {
  const row = document.createElement("div");
  row.className = "row mode-row";

  const lab = document.createElement("label");
  lab.textContent = "physics mode";

  const group = document.createElement("div");
  group.className = "toggle-group";

  const btnSchrodinger = document.createElement("button");
  btnSchrodinger.textContent = "Schrodinger";
  btnSchrodinger.addEventListener("click", () => {
    params.guidingMode = 0;
    updateToggleButtons();
    resetAll();
  });

  const btnPauliUp = document.createElement("button");
  btnPauliUp.textContent = "Pauli (+z)";
  btnPauliUp.addEventListener("click", () => {
    params.guidingMode = 1;
    updateToggleButtons();
    resetAll();
  });

  const btnPauliDown = document.createElement("button");
  btnPauliDown.textContent = "Pauli (-z)";
  btnPauliDown.addEventListener("click", () => {
    params.guidingMode = 2;
    updateToggleButtons();
    resetAll();
  });

  group.appendChild(btnSchrodinger);
  group.appendChild(btnPauliUp);
  group.appendChild(btnPauliDown);

  function updateToggleButtons() {
    btnSchrodinger.classList.toggle("selected", params.guidingMode === 0);
    btnPauliUp.classList.toggle("selected", params.guidingMode === 1);
    btnPauliDown.classList.toggle("selected", params.guidingMode === 2);
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
addWaveViewControls();
addToggleInt("showHistogram", "show histogram", () => {
  if (params.showHistogram) captureDetectorHits();
  renderDetectorHistogram();
});
addToggleInt("showParticles", "show particles");
addToggleInt("colorCodePaths", "path colors");

addSlider("nParticles", "particle count", 1, 3000, 1, () => rebuildParticles());
addSlider("dotSize", "particle size", 2.0, 16.0, 0.5);
addSlider("dotGain", "particle brightness", 0.1, 3.0, 0.1);

addToggleInt("showTrail", "draw trails");
addSlider("trailHalfLife", "trail half-life", 1.0, 150.0, 1.0);
//addSlider("trailVisGain", "trail gain", 0.1, 1.0, 0.1);
//addSlider("trailVisGamma", "trail gamma", 0.4, 2.0, 0.05);
addSlider("trailWidth", "trail width (px)", 0.5, 10.0, 0.1);

removeEmptySectionHeaders();
if (presetDefinition && controls.children.length === 0 && !isEmbedded) {
  document.getElementById("ui").style.display = "none";
}

const resetButton = document.getElementById("reset");
const pauseButton = document.getElementById("pause");

function togglePause() {
  if (collapse.active) return;
  paused = !paused;
  pauseButton.textContent = paused ? "Resume" : "Pause";
}

function pauseSimulation() {
  paused = true;
  pauseButton.textContent = "Resume";
}

resetButton.onclick = () => resetAll();
pauseButton.onclick = () => togglePause();
detectorToggleButton.addEventListener("pointerdown", startDetectorButtonDrag);
detectorToggleButton.addEventListener("pointermove", moveDetectorButtonDrag);
detectorToggleButton.addEventListener("pointerup", endDetectorButtonDrag);
detectorToggleButton.addEventListener("pointercancel", cancelDetectorButtonDrag);
window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    togglePause();
    return;
  }

  if (e.key.toLowerCase() === "r") resetAll();
});
if (isEmbedded) {
  wrap.addEventListener("wheel", (e) => {
    e.preventDefault();

    let deltaX = e.deltaX;
    let deltaY = e.deltaY;
    if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      deltaX *= 16;
      deltaY *= 16;
    } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      deltaX *= window.innerWidth;
      deltaY *= window.innerHeight;
    }

    try {
      window.top.scrollBy(deltaX, deltaY);
    } catch {
      // Cross-origin hosts retain the browser's default iframe behavior.
    }
  }, { passive: false });
} else {
  wrap.addEventListener("wheel", handleWheelZoom, { passive: false });
}

// Minimize UI panel
const uiBody = document.getElementById("uibody");
const minBtn = document.getElementById("minui");

let uiMinimized = false;
minBtn.onclick = () => {
  uiMinimized = !uiMinimized;
  uiBody.style.display = uiMinimized ? "none" : "block";
  minBtn.textContent = uiMinimized ? ">" : "v";
};

// --------------------
// WebGL helpers
// --------------------
function sanitizeShaderSource(src) {
  return String(src)
    .replace(/^\uFEFF/, "")
    .replace(/^[\s\uFEFF]+(?=#version\s+300\s+es)/, "");
}

function compile(type, src) {
  const sh = gl.createShader(type);
  const cleanSrc = sanitizeShaderSource(src);
  gl.shaderSource(sh, cleanSrc);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(cleanSrc);
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
  return sanitizeShaderSource(await r.text());
}

// --------------------
// Shader loading
// --------------------
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

// --------------------
// Programs + uniforms
// --------------------
let progWaveInit, progWaveStep, progWaveRender;
let progPartUpdate, progPartView, progPartStamp;
let progDensityStep, progDensityRender;
let progBoundary;

let U = {};

// Boundary rendering
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
  uSplitterXFrac: u(progWaveInit, "uSplitterXFrac"),
  uSplitterLengthPx: u(progWaveInit, "uSplitterLengthPx"),
  uSplitterWidthPx: u(progWaveInit, "uSplitterWidthPx"),
  uSplitterV0: u(progWaveInit, "uSplitterV0"),
  uDetectorXFrac: u(progWaveInit, "uDetectorXFrac"),
  uGuideMirrorXFrac: u(progWaveInit, "uGuideMirrorXFrac"),
  uGuideMirrorLengthPx: u(progWaveInit, "uGuideMirrorLengthPx"),
  uGuideMirrorAngleTrim: u(progWaveInit, "uGuideMirrorAngleTrim"),
  uGuideMirrorYTrimPx: u(progWaveInit, "uGuideMirrorYTrimPx"),
  uGuideMirrorWidthPx: u(progWaveInit, "uGuideMirrorWidthPx"),
  uGuideMirrorV0: u(progWaveInit, "uGuideMirrorV0"),
  uGuideMirrorsActive: u(progWaveInit, "uGuideMirrorsActive"),
  uMirrorThicknessPx: u(progWaveInit, "uMirrorThicknessPx"),
  uMirrorV0: u(progWaveInit, "uMirrorV0"),
  uAbsorbPx: u(progWaveInit, "uAbsorbPx"),
  uAbsorbStrength: u(progWaveInit, "uAbsorbStrength"),
  uFallbackAbsorbPx: u(progWaveInit, "uFallbackAbsorbPx"),
  uFallbackAbsorbStrength: u(progWaveInit, "uFallbackAbsorbStrength"),
};

  
U.waveStep = {
  uState: u(progWaveStep, "uState"),
  uSimRes: u(progWaveStep, "uSimRes"),
  uHBAR: u(progWaveStep, "uHBAR"),
  uMass: u(progWaveStep, "uMass"),
  uP0: u(progWaveStep, "uP0"),
  uDT: u(progWaveStep, "uDT"),
  uSplitterXFrac: u(progWaveStep, "uSplitterXFrac"),
  uSplitterLengthPx: u(progWaveStep, "uSplitterLengthPx"),
  uSplitterWidthPx: u(progWaveStep, "uSplitterWidthPx"),
  uSplitterV0: u(progWaveStep, "uSplitterV0"),
  uDetectorXFrac: u(progWaveStep, "uDetectorXFrac"),
  uGuideMirrorXFrac: u(progWaveStep, "uGuideMirrorXFrac"),
  uGuideMirrorLengthPx: u(progWaveStep, "uGuideMirrorLengthPx"),
  uGuideMirrorAngleTrim: u(progWaveStep, "uGuideMirrorAngleTrim"),
  uGuideMirrorYTrimPx: u(progWaveStep, "uGuideMirrorYTrimPx"),
  uGuideMirrorWidthPx: u(progWaveStep, "uGuideMirrorWidthPx"),
  uGuideMirrorV0: u(progWaveStep, "uGuideMirrorV0"),
  uGuideMirrorsActive: u(progWaveStep, "uGuideMirrorsActive"),
  uMirrorThicknessPx: u(progWaveStep, "uMirrorThicknessPx"),
  uMirrorV0: u(progWaveStep, "uMirrorV0"),
  uAbsorbPx: u(progWaveStep, "uAbsorbPx"),
  uAbsorbStrength: u(progWaveStep, "uAbsorbStrength"),
  uFallbackAbsorbPx: u(progWaveStep, "uFallbackAbsorbPx"),
  uFallbackAbsorbStrength: u(progWaveStep, "uFallbackAbsorbStrength"),
};

  
U.waveRender = {
  uState: u(progWaveRender, "uState"),
  uSimRes: u(progWaveRender, "uSimRes"),
  uVisGain: u(progWaveRender, "uVisGain"),
  uVisGamma: u(progWaveRender, "uVisGamma"),
  uWaveTailFade: u(progWaveRender, "uWaveTailFade"),
  uViewCenterFrac: u(progWaveRender, "uViewCenterFrac"),
  uViewScale: u(progWaveRender, "uViewScale"),
  uShowWave: u(progWaveRender, "uShowWave"),
  uShowPhase: u(progWaveRender, "uShowPhase"),
  uSplitterXFrac: u(progWaveRender, "uSplitterXFrac"),
  uSplitterLengthPx: u(progWaveRender, "uSplitterLengthPx"),
  uSplitterWidthPx: u(progWaveRender, "uSplitterWidthPx"),
  uMirrorThicknessPx: u(progWaveRender, "uMirrorThicknessPx"),
  uAbsorbPx: u(progWaveRender, "uAbsorbPx"),
  uSplitterOpacity: u(progWaveRender, "uSplitterOpacity"),
  uDetectorXFrac: u(progWaveRender, "uDetectorXFrac"),
  uDetectionXFrac: u(progWaveRender, "uDetectionXFrac"),
  uDetectorLengthPx: u(progWaveRender, "uDetectorLengthPx"),
  uDetectorWidthPx: u(progWaveRender, "uDetectorWidthPx"),
  uDetectorActive: u(progWaveRender, "uDetectorActive"),
  uGuideMirrorXFrac: u(progWaveRender, "uGuideMirrorXFrac"),
  uGuideMirrorLengthPx: u(progWaveRender, "uGuideMirrorLengthPx"),
  uGuideMirrorAngleTrim: u(progWaveRender, "uGuideMirrorAngleTrim"),
  uGuideMirrorYTrimPx: u(progWaveRender, "uGuideMirrorYTrimPx"),
  uGuideMirrorWidthPx: u(progWaveRender, "uGuideMirrorWidthPx"),
  uGuideMirrorsActive: u(progWaveRender, "uGuideMirrorsActive"),
  uCollapseActive: u(progWaveRender, "uCollapseActive"),
  uCollapseProgress: u(progWaveRender, "uCollapseProgress"),
  uCollapsePosFrac: u(progWaveRender, "uCollapsePosFrac"),
  uCollapseSigmaPx: u(progWaveRender, "uCollapseSigmaPx"),
};

  
U.partUpdate = {
  uState: u(progPartUpdate, "uState"),
  uSimRes: u(progPartUpdate, "uSimRes"),
  uHBAR: u(progPartUpdate, "uHBAR"),
  uMass: u(progPartUpdate, "uMass"),
  uP0: u(progPartUpdate, "uP0"),
  uDT: u(progPartUpdate, "uDT"),
  uGuidingMode: u(progPartUpdate, "uGuidingMode"),
  uSpinS: u(progPartUpdate, "uSpinS"),
  uSplitterXFrac: u(progPartUpdate, "uSplitterXFrac"),
  uSplitterLengthPx: u(progPartUpdate, "uSplitterLengthPx"),
  uSplitterWidthPx: u(progPartUpdate, "uSplitterWidthPx"),
  uMirrorThicknessPx: u(progPartUpdate, "uMirrorThicknessPx"),
  uDetectorXFrac: u(progPartUpdate, "uDetectorXFrac"),
  uDetectionXFrac: u(progPartUpdate, "uDetectionXFrac"),
  uDetectorLengthPx: u(progPartUpdate, "uDetectorLengthPx"),
  uDetectorActive: u(progPartUpdate, "uDetectorActive"),
  uGuideMirrorXFrac: u(progPartUpdate, "uGuideMirrorXFrac"),
  uGuideMirrorLengthPx: u(progPartUpdate, "uGuideMirrorLengthPx"),
  uGuideMirrorAngleTrim: u(progPartUpdate, "uGuideMirrorAngleTrim"),
  uGuideMirrorYTrimPx: u(progPartUpdate, "uGuideMirrorYTrimPx"),
  uGuideMirrorWidthPx: u(progPartUpdate, "uGuideMirrorWidthPx"),
  uGuideMirrorsActive: u(progPartUpdate, "uGuideMirrorsActive"),
  uAbsorbPx: u(progPartUpdate, "uAbsorbPx"),
  uRhoMin: u(progPartUpdate, "uRhoMin"),
  uVelClamp: u(progPartUpdate, "uVelClamp"),
  uParticleKillMarginPx: u(progPartUpdate, "uParticleKillMarginPx"),
};

  U.partView = {
    uState: u(progPartView, "uState"),
    uSimRes: u(progPartView, "uSimRes"),
    uPointSize: u(progPartView, "uPointSize"),
    uVisGain: u(progPartView, "uVisGain"),
    uVisGamma: u(progPartView, "uVisGamma"),
    uWaveTailFade: u(progPartView, "uWaveTailFade"),
    uDotSigma: u(progPartView, "uDotSigma"),
    uDotGain: u(progPartView, "uDotGain"),
    uColorCodePaths: u(progPartView, "uColorCodePaths"),
    uNumParticles: u(progPartView, "uNumParticles"),
    uTrailWidth: u(progPartView, "uTrailWidth"),
    uRenderMode: u(progPartView, "uRenderMode"),
    uViewCenterFrac: u(progPartView, "uViewCenterFrac"),
    uViewScale: u(progPartView, "uViewScale"),
  };

  U.partStamp = {
    uState: u(progPartStamp, "uState"),
    uSimRes: u(progPartStamp, "uSimRes"),
    uPointSize: u(progPartStamp, "uPointSize"),
    uVisGain: u(progPartStamp, "uVisGain"),
    uVisGamma: u(progPartStamp, "uVisGamma"),
    uWaveTailFade: u(progPartStamp, "uWaveTailFade"),
    uDotSigma: u(progPartStamp, "uDotSigma"),
    uDotGain: u(progPartStamp, "uDotGain"),
    uStampGain: u(progPartStamp, "uStampGain"),
    uNumParticles: u(progPartStamp, "uNumParticles"),
    uTrailWidth: u(progPartStamp, "uTrailWidth"),
    uRenderMode: u(progPartStamp, "uRenderMode"),
    uViewCenterFrac: u(progPartStamp, "uViewCenterFrac"),
    uViewScale: u(progPartStamp, "uViewScale"),
  };

  U.densityStep = {
    uPrev: u(progDensityStep, "uPrev"),
    uFade: u(progDensityStep, "uFade"),
  };

  U.densityRender = {
    uDensity: u(progDensityRender, "uDensity"),
    uGain: u(progDensityRender, "uGain"),
    uGamma: u(progDensityRender, "uGamma"),
    uBlendMode: u(progDensityRender, "uBlendMode"),
    uColorCodePaths: u(progDensityRender, "uColorCodePaths"),
    uViewCenterFrac: u(progDensityRender, "uViewCenterFrac"),
    uViewScale: u(progDensityRender, "uViewScale"),
  };
}

// --------------------
// State
// --------------------
const vaoEmpty = gl.createVertexArray();

let simW = 0, simH = 0;
let texA = null, texB = null, fboA = null, fboB = null, flip = 0;

let particleSrc = null, particleDst = null, vaoParticles = null, tf = null;
let particleReadback = null;
let detectedParticleMask = null;
let detectorAutoPauseTriggered = false;
let detectorHistogram = new Float32Array(0);
let detectorBinSizePx = 16;
let detectorHistogramMinYPx = 0;
let detectorHistogramCentralBin = 0;

let densW = 0, densH = 0;
let densTexA = null, densTexB = null, densFboA = null, densFboB = null, densFlip = 0;

// --------------------
// Resize
// --------------------
function resizeCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = Math.floor(canvas.clientWidth * dpr);
  const h = Math.floor(canvas.clientHeight * dpr);
  const changed = canvas.width !== w || canvas.height !== h;
  if (changed) {
    canvas.width = w;
    canvas.height = h;
  }
  if (overlayCanvas.width !== w || overlayCanvas.height !== h) {
    overlayCanvas.width = w;
    overlayCanvas.height = h;
  }
  return changed;
}

function simPx(px) {
  return px * params.simScale;
}

function getViewScale(zoom = view.zoom) {
  const displayW = Math.max(1, canvas.width);
  const displayH = Math.max(1, canvas.height);
  const worldW = Math.max(1, simW);
  const worldH = Math.max(1, simH);
  const fit = Math.min(displayW / worldW, displayH / worldH);

  return {
    x: zoom * fit * worldW / displayW,
    y: zoom * fit * worldH / displayH,
  };
}

function clampViewState(state) {
  state.zoom = Math.max(VIEW_MIN_ZOOM, Math.min(VIEW_MAX_ZOOM, state.zoom));
  const scale = getViewScale(state.zoom);
  const clampAxis = (center, axisScale) => {
    if (axisScale <= 1.0) return 0.5;
    const half = 0.5 / axisScale;
    return Math.max(half, Math.min(1.0 - half, center));
  };
  state.centerX = clampAxis(state.centerX, scale.x);
  state.centerY = clampAxis(state.centerY, scale.y);
}

function updateViewEasing(frameTime) {
  const dt = Math.min(0.05, Math.max(0.0, (frameTime - previousFrameTime) / 1000.0));
  previousFrameTime = frameTime;
  const t = 1.0 - Math.exp(-VIEW_ZOOM_EASING * dt);

  view.zoom += (targetView.zoom - view.zoom) * t;
  view.centerX += (targetView.centerX - view.centerX) * t;
  view.centerY += (targetView.centerY - view.centerY) * t;
  clampViewState(view);
}

function handleWheelZoom(e) {
  const uiPanel = document.getElementById("ui");
  if (uiPanel && uiPanel.contains(e.target)) return;

  e.preventDefault();

  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  const screenX = Math.max(0.0, Math.min(1.0, (e.clientX - rect.left) / rect.width));
  const screenY = Math.max(0.0, Math.min(1.0, 1.0 - (e.clientY - rect.top) / rect.height));
  const oldZoom = targetView.zoom;
  const oldScale = getViewScale(oldZoom);
  const nextZoom = Math.max(
    VIEW_MIN_ZOOM,
    Math.min(VIEW_MAX_ZOOM, oldZoom * Math.exp(-e.deltaY * 0.001))
  );
  const nextScale = getViewScale(nextZoom);

  const worldX = targetView.centerX + (screenX - 0.5) / oldScale.x;
  const worldY = targetView.centerY + (screenY - 0.5) / oldScale.y;

  targetView.zoom = nextZoom;
  targetView.centerX = worldX - (screenX - 0.5) / nextScale.x;
  targetView.centerY = worldY - (screenY - 0.5) / nextScale.y;
  clampViewState(targetView);
}

function simToScreenUvX(xPx) {
  return 0.5 + getViewScale().x * (xPx / Math.max(1.0, simW - 1.0) - view.centerX);
}

function simToScreenUvY(yPx) {
  return 0.5 + getViewScale().y * (yPx / Math.max(1.0, simH - 1.0) - view.centerY);
}

function simToCanvasX(xPx) {
  return simToScreenUvX(xPx) * overlayCanvas.width;
}

function simToCanvasY(yPx) {
  return (1.0 - simToScreenUvY(yPx)) * overlayCanvas.height;
}

function simToCssX(xPx) {
  return simToScreenUvX(xPx) * (canvas.clientWidth || canvas.width);
}

function simToCssY(yPx) {
  return (1.0 - simToScreenUvY(yPx)) * (canvas.clientHeight || canvas.height);
}

function setViewUniforms(
  uniforms,
  centerX = view.centerX,
  centerY = view.centerY,
  zoom = view.zoom,
  fitToDisplay = true
) {
  const scale = fitToDisplay ? getViewScale(zoom) : { x: zoom, y: zoom };
  if (uniforms.uViewCenterFrac) gl.uniform2f(uniforms.uViewCenterFrac, centerX, centerY);
  if (uniforms.uViewScale) gl.uniform2f(uniforms.uViewScale, scale.x, scale.y);
}

function computeSplitterNormalEnergy() {
  const mass = Math.max(params.mass, 1e-9);
  const normalP = Math.abs(params.p0) * INPUT_NORMAL_MOMENTUM_SCALE;
  return (normalP * normalP) / (2.0 * mass);
}

function computeEffectiveSplitterWidthPx() {
  const halfWidth = Math.max(0.5 * simPx(params.splitterWidth), 0.5);
  return Math.max(2.0 * halfWidth + SPLITTER_EDGE_FEATHER_PX, 1.0);
}

function rectangularBarrierTransmission(v0, energy, mass, hbar, widthPx) {
  if (!Number.isFinite(v0) || v0 <= 0.0) return 1.0;
  if (!Number.isFinite(energy) || energy <= 0.0) return 0.0;

  const nearEnergy = Math.abs(v0 - energy) <= 1e-8 * Math.max(1.0, energy);
  let term = 0.0;

  if (nearEnergy) {
    term = (mass * v0 * v0 * widthPx * widthPx) / (2.0 * energy * hbar * hbar);
  } else if (v0 < energy) {
    const q = Math.sqrt(2.0 * mass * (energy - v0)) / hbar;
    const s = Math.sin(q * widthPx);
    term = (v0 * v0 * s * s) / (4.0 * energy * (energy - v0));
  } else {
    const kappa = Math.sqrt(2.0 * mass * (v0 - energy)) / hbar;
    const x = kappa * widthPx;
    if (x > 40.0) return 0.0;
    const sh = Math.sinh(x);
    term = (v0 * v0 * sh * sh) / (4.0 * energy * (v0 - energy));
  }

  if (!Number.isFinite(term)) return 0.0;
  return 1.0 / (1.0 + Math.max(0.0, term));
}

function computeBalancedSplitterCalibration() {
  const mass = Math.max(params.mass, 1e-9);
  const hbar = Math.max(params.hbar, 1e-9);
  const normalEnergy = computeSplitterNormalEnergy();
  const widthPx = computeEffectiveSplitterWidthPx();
  const key = [
    params.p0,
    mass,
    hbar,
    params.splitterWidth,
    params.simScale,
    TARGET_SPLITTER_TRANSMISSION
  ].join("|");

  if (splitterCalibrationCache && splitterCalibrationCache.key === key) {
    return splitterCalibrationCache;
  }

  let v0 = 0.0;
  if (normalEnergy > 0.0) {
    let lo = 0.0;
    let hi = Math.max(normalEnergy, 1e-6);
    let found = false;

    for (let expansion = 0; expansion < 32 && !found; expansion++) {
      const samples = 96;
      let prevV = 0.0;
      let prevT = 1.0;

      for (let i = 1; i <= samples; i++) {
        const testV = hi * (i / samples);
        const t = rectangularBarrierTransmission(testV, normalEnergy, mass, hbar, widthPx);

        if (prevT > TARGET_SPLITTER_TRANSMISSION && t <= TARGET_SPLITTER_TRANSMISSION) {
          lo = prevV;
          hi = testV;
          found = true;
          break;
        }

        prevV = testV;
        prevT = t;
      }

      if (!found) {
        hi *= 2.0;
        if (hi > SPLITTER_CALIBRATION_MAX_V0) break;
      }
    }

    if (found) {
      for (let i = 0; i < 64; i++) {
        const mid = 0.5 * (lo + hi);
        const t = rectangularBarrierTransmission(mid, normalEnergy, mass, hbar, widthPx);
        if (t > TARGET_SPLITTER_TRANSMISSION) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      v0 = hi;
    } else {
      v0 = Math.min(hi, SPLITTER_CALIBRATION_MAX_V0);
    }
  }

  splitterCalibrationCache = {
    key,
    v0,
    normalEnergy,
    widthPx,
    targetTransmission: TARGET_SPLITTER_TRANSMISSION,
    predictedTransmission: rectangularBarrierTransmission(v0, normalEnergy, mass, hbar, widthPx)
  };
  return splitterCalibrationCache;
}

function computeBalancedSplitterV0() {
  return computeBalancedSplitterCalibration().v0;
}

function getViewportBounds() {
  const mirrorThicknessPx = simPx(params.mirrorThickness);
  const sideAbsorbPx = Math.min(simPx(params.absorbPx), 0.45 * Math.max(1, simW - 1));
  const innerMinX = sideAbsorbPx;
  const innerMinY = mirrorThicknessPx;
  const innerMaxX = Math.max(innerMinX + 1, (simW - 1) - sideAbsorbPx);
  const innerMaxY = simH - mirrorThicknessPx;
  return { innerMinX, innerMinY, innerMaxX, innerMaxY };
}

function computeDetectorGeometry(xFrac = params.detectorX) {
  const bounds = getViewportBounds();
  const centerX = bounds.innerMinX + (bounds.innerMaxX - bounds.innerMinX) * xFrac;
  const centerY = 0.5 * (bounds.innerMinY + bounds.innerMaxY);
  const halfLength = 0.5 * simPx(params.detectorLength);
  return { centerX, centerY, halfLength };
}

function getDetectionXFrac() {
  if (params.detectorActive) return params.detectorX;

  const bounds = getViewportBounds();
  const cavityWidth = Math.max(1.0, bounds.innerMaxX - bounds.innerMinX);
  const absorberStartX = (simW - 1.0) - simPx(FALLBACK_ABSORB_WIDTH_PX);
  const detectorX = absorberStartX - simPx(FALLBACK_DETECTOR_GAP_PX);
  return clamp01((detectorX - bounds.innerMinX) / cavityWidth);
}

function clamp01(v) {
  return Math.max(0.0, Math.min(1.0, v));
}

function detectorDragDeltaToFraction(deltaClientX) {
  if (simW <= 1) return 0.0;

  const bounds = getViewportBounds();
  const cavityWidthPx = Math.max(1.0, bounds.innerMaxX - bounds.innerMinX);
  const canvasRect = canvas.getBoundingClientRect();
  const canvasWidthCss = Math.max(1.0, canvasRect.width);
  const cavityWidthCss =
    (cavityWidthPx / Math.max(1.0, simW - 1)) * canvasWidthCss * getViewScale().x;
  return deltaClientX / Math.max(1.0, cavityWidthCss);
}

function toggleDetectorActive() {
  params.detectorActive = params.detectorActive ? 0 : 1;
  resetDetectorHistogram();
  renderDetectorHistogram();
  updateDetectorToggleButton();
}

function startDetectorButtonDrag(e) {
  if (e.button !== undefined && e.button !== 0) return;

  detectorDragState = {
    pointerId: e.pointerId,
    startClientX: e.clientX,
    startDetectorX: params.detectorX,
    dragged: false
  };
  detectorToggleButton.setPointerCapture(e.pointerId);
  detectorToggleButton.style.cursor = params.detectorActive ? "ew-resize" : "pointer";
  e.preventDefault();
}

function moveDetectorButtonDrag(e) {
  if (!detectorDragState || e.pointerId !== detectorDragState.pointerId) return;
  if (!params.detectorActive) return;

  const dx = e.clientX - detectorDragState.startClientX;
  if (Math.abs(dx) >= DETECTOR_DRAG_THRESHOLD_PX) {
    detectorDragState.dragged = true;
  }

  if (!detectorDragState.dragged) return;

  params.detectorX = clamp01(
    detectorDragState.startDetectorX + detectorDragDeltaToFraction(dx)
  );
  renderDetectorHistogram();
  updateDetectorToggleButton();
  e.preventDefault();
}

function endDetectorButtonDrag(e) {
  if (!detectorDragState || e.pointerId !== detectorDragState.pointerId) return;

  const didDrag = detectorDragState.dragged;
  detectorToggleButton.releasePointerCapture(e.pointerId);
  detectorToggleButton.style.cursor = "pointer";
  detectorDragState = null;

  if (!didDrag) {
    toggleDetectorActive();
  }
  e.preventDefault();
}

function cancelDetectorButtonDrag(e) {
  if (!detectorDragState || e.pointerId !== detectorDragState.pointerId) return;

  detectorToggleButton.releasePointerCapture(e.pointerId);
  detectorToggleButton.style.cursor = "pointer";
  detectorDragState = null;
}

function updateDetectorToggleButton() {
  if (!detectorControlEnabled) {
    detectorToggleButton.style.display = "none";
    return;
  }

  if (simW <= 0 || simH <= 0) {
    detectorToggleButton.style.display = "none";
    return;
  }

  const buttonDetectorX = params.detectorActive
    ? params.detectorX
    : getDetectionXFrac();
  const { centerX, centerY, halfLength } = computeDetectorGeometry(buttonDetectorX);
  const cssW = canvas.clientWidth || canvas.width;
  const cssH = canvas.clientHeight || canvas.height;
  const topDetectorY = Math.min(simH - 1, centerY + halfLength);
  const x = simToCssX(centerX);
  const y = simToCssY(topDetectorY);
  const buttonW = DETECTOR_BUTTON_WIDTH;
  const buttonH = DETECTOR_BUTTON_HEIGHT;
  const rotationRad = DETECTOR_BUTTON_ROTATION_DEG * Math.PI / 180.0;
  const visualW = Math.abs(Math.cos(rotationRad)) * buttonW +
    Math.abs(Math.sin(rotationRad)) * buttonH;
  const visualH = Math.abs(Math.sin(rotationRad)) * buttonW +
    Math.abs(Math.cos(rotationRad)) * buttonH;
  let visualCenterX = Math.max(
    10 + 0.5 * visualW,
    Math.min(cssW - 10 - 0.5 * visualW, x)
  );
  const visualCenterY = Math.max(
    10 + 0.5 * visualH,
    Math.min(cssH - 10 - 0.5 * visualH, y + 8 + 0.5 * visualH)
  );

  const uiPanel = document.getElementById("ui");
  if (uiPanel) {
    const wrapRect = wrap.getBoundingClientRect();
    const uiRect = uiPanel.getBoundingClientRect();
    const uiLeft = uiRect.left - wrapRect.left;
    const uiRight = uiRect.right - wrapRect.left;
    const uiTop = uiRect.top - wrapRect.top;
    const uiBottom = uiRect.bottom - wrapRect.top;
    const visualLeft = visualCenterX - 0.5 * visualW;
    const visualTop = visualCenterY - 0.5 * visualH;
    const overlapsUi = visualLeft < uiRight &&
      visualLeft + visualW > uiLeft &&
      visualTop < uiBottom &&
      visualTop + visualH > uiTop;
    if (overlapsUi) {
      visualCenterX = Math.min(
        cssW - 10 - 0.5 * visualW,
        uiRight + 12 + 0.5 * visualW
      );
    }
  }

  const left = visualCenterX - 0.5 * buttonW;
  const top = visualCenterY - 0.5 * buttonH;
  detectorToggleButton.style.display = "block";
  detectorToggleButton.style.left = `${left}px`;
  detectorToggleButton.style.top = `${top}px`;
  detectorToggleButton.textContent = params.detectorActive ? "Detector" : "Detector";
  detectorToggleButton.title = params.detectorActive
    ? "Click to move detection to the right back wall. Drag horizontally to move the main detector."
    : "Click to restore the main detector. Detection currently occurs at the right back wall.";
  detectorToggleButton.style.borderColor = params.detectorActive
    ? "rgba(220,235,245,0.45)"
    : "rgba(220,235,245,0.25)";
  detectorToggleButton.style.background = params.detectorActive
    ? "rgba(25, 32, 38, 0.72)"
    : "rgba(18, 20, 22, 0.56)";
  detectorToggleButton.style.color = params.detectorActive ? "#f4f8fb" : "#9aa4ad";
}

function computeWavelengthPx() {
  return (2.0 * Math.PI * Math.max(params.hbar, 1e-9)) / Math.max(Math.abs(params.p0), 0.1);
}

function computeDetectorFringeSpacingPx() {
  // The two MZI arms arrive at the detector with opposite vertical momentum
  // components, so the vertical fringe spacing is lambda / (2 sin 45 deg).
  return computeWavelengthPx() / (2.0 * INPUT_NORMAL_MOMENTUM_SCALE);
}

function computeDetectorHistogramLayout() {
  const { centerY, halfLength } = computeDetectorGeometry();
  const detectorLengthPx = Math.max(1.0, 2.0 * halfLength);
  const fringePx = Math.max(1.0, computeDetectorFringeSpacingPx());
  const binSizePx = Math.max(1, Math.round(DETECTOR_HISTOGRAM_BIN_FRACTION * fringePx));
  let numBins = Math.max(1, Math.ceil(detectorLengthPx / binSizePx));

  if (numBins % 2 === 0) numBins += 1;

  const centralBin = Math.floor(numBins / 2);
  const minY = centerY - (centralBin + 0.5) * binSizePx;
  return { binSizePx, numBins, minY, centralBin };
}

function detectorHistogramBinCenterY(i) {
  return detectorHistogramMinYPx + (i + 0.5) * detectorBinSizePx;
}

function smoothDetectorHistogram() {
  const sigmaFringes = DETECTOR_HISTOGRAM_SMOOTHING_FRINGES;
  if (sigmaFringes <= 0.0 || detectorHistogram.length <= 4) return detectorHistogram;

  const fringePx = Math.max(1.0, computeDetectorFringeSpacingPx());
  const sigmaBins = Math.max(0.5, sigmaFringes * fringePx / detectorBinSizePx);
  const radiusBins = Math.max(1, Math.ceil(3.0 * sigmaBins));
  const smoothed = new Float32Array(detectorHistogram.length);

  for (let i = 0; i < detectorHistogram.length; i++) {
    let sum = 0.0;
    let weightSum = 0.0;

    for (let d = -radiusBins; d <= radiusBins; d++) {
      const j = i + d;
      if (j < 0 || j >= detectorHistogram.length) continue;

      const u = d / sigmaBins;
      const w = Math.exp(-0.5 * u * u);
      sum += detectorHistogram[j] * w;
      weightSum += w;
    }

    smoothed[i] = weightSum > 0.0 ? sum / weightSum : detectorHistogram[i];
  }

  return smoothed;
}

function resetDetectorHistogram() {
  const n = Math.floor(params.nParticles);
  const layout = computeDetectorHistogramLayout();
  detectorBinSizePx = layout.binSizePx;
  detectorHistogramMinYPx = layout.minY;
  detectorHistogramCentralBin = layout.centralBin;
  detectorHistogram = new Float32Array(layout.numBins);
  detectedParticleMask = new Uint8Array(n);
  particleReadback = new Float32Array(n * 4);
  detectorAutoPauseTriggered = false;
}

function captureDetectorHits() {
  const n = Math.floor(params.nParticles);
  if (!particleSrc || !particleReadback || particleReadback.length !== n * 4) return 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, particleSrc);
  gl.getBufferSubData(gl.ARRAY_BUFFER, 0, particleReadback);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  let detectedCount = 0;
  const fringePx = Math.max(1.0, computeDetectorFringeSpacingPx());
  const sigmaBins = Math.max(
    0.65,
    DETECTOR_HISTOGRAM_HIT_KERNEL_FRINGES * fringePx / detectorBinSizePx
  );
  const radiusBins = Math.max(1, Math.ceil(3.0 * sigmaBins));

  for (let i = 0; i < n; i++) {
    const base = i * 4;
    const y = particleReadback[base + 1];
    const mode = particleReadback[base + 2];
    if (mode <= 1.5) continue;

    detectedCount++;
    if (!params.showHistogram || detectedParticleMask[i]) continue;

    const binCenter = (y - detectorHistogramMinYPx) / detectorBinSizePx - 0.5;
    const firstBin = Math.max(0, Math.floor(binCenter - radiusBins));
    const lastBin = Math.min(detectorHistogram.length - 1, Math.ceil(binCenter + radiusBins));
    let weightSum = 0.0;

    for (let bin = firstBin; bin <= lastBin; bin++) {
      const u = (bin - binCenter) / sigmaBins;
      weightSum += Math.exp(-0.5 * u * u);
    }

    if (weightSum > 0.0) {
      for (let bin = firstBin; bin <= lastBin; bin++) {
        const u = (bin - binCenter) / sigmaBins;
        detectorHistogram[bin] += Math.exp(-0.5 * u * u) / weightSum;
      }
    }

    detectedParticleMask[i] = 1;
  }

  return detectedCount;
}

function computeHistogramDisplayPeak(profile, detectorMinY, detectorMaxY) {
  const values = [];
  let maxValue = 0.0;

  for (let i = 0; i < profile.length; i++) {
    const y = detectorHistogramBinCenterY(i);
    if (y < detectorMinY || y > detectorMaxY) continue;

    const value = profile[i];
    if (value <= 0.0) continue;
    values.push(value);
    if (value > maxValue) maxValue = value;
  }

  if (!values.length) return 0.0;
  values.sort((a, b) => a - b);

  const qIndex = Math.min(values.length - 1, Math.floor(0.985 * (values.length - 1)));
  return Math.max(values[qIndex], 0.45 * maxValue, 1e-6);
}

function traceSmoothHistogramCurve(points, moveToStart = true) {
  if (!points.length) return;
  if (moveToStart) {
    overlayCtx.moveTo(points[0].x, points[0].y);
  } else {
    overlayCtx.lineTo(points[0].x, points[0].y);
  }

  if (points.length === 1) {
    overlayCtx.lineTo(points[0].x, points[0].y);
    return;
  }

  for (let i = 1; i < points.length - 1; i++) {
    const midX = 0.5 * (points[i].x + points[i + 1].x);
    const midY = 0.5 * (points[i].y + points[i + 1].y);
    overlayCtx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }

  const last = points[points.length - 1];
  overlayCtx.lineTo(last.x, last.y);
}

function renderDetectorHistogram() {
  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  if (!params.showHistogram) return;
  if (!detectorHistogram.length) return;
  if (simW <= 0 || simH <= 0) return;

  const { centerX, centerY, halfLength } = computeDetectorGeometry(getDetectionXFrac());
  const detectorMinY = centerY - halfLength;
  const detectorMaxY = centerY + halfLength;
  const profile = smoothDetectorHistogram();
  const peak = computeHistogramDisplayPeak(profile, detectorMinY, detectorMaxY);
  if (peak <= 0.0) return;

  const detectorCanvasX = simToCanvasX(centerX);
  const profileGapPx = 12.0 * view.zoom;
  const profileWidthPx =
    Math.min(170.0, Math.max(72.0, 0.13 * overlayCanvas.width)) * view.zoom;
  const histogramStrokeScale = view.zoom;
  let direction = 1.0;
  let baseX = detectorCanvasX + profileGapPx;
  if (baseX + profileWidthPx > overlayCanvas.width - 10.0) {
    direction = -1.0;
    baseX = detectorCanvasX - profileGapPx;
  }

  const points = [];
  for (let i = 0; i < profile.length; i++) {
    const y = detectorHistogramBinCenterY(i);
    if (y < detectorMinY || y > detectorMaxY) continue;

    const canvasY = simToCanvasY(y);
    const normalized = Math.max(0.0, Math.min(1.0, profile[i] / peak));
    const shaped = Math.pow(normalized, DETECTOR_HISTOGRAM_PROFILE_GAMMA);
    points.push({
      x: baseX + direction * shaped * profileWidthPx,
      y: canvasY,
    });
  }

  if (points.length < 2) return;

  overlayCtx.save();
  overlayCtx.globalCompositeOperation = "source-over";
  overlayCtx.lineCap = "round";
  overlayCtx.lineJoin = "round";

  const first = points[0];
  const last = points[points.length - 1];
  const fillEndX = baseX + direction * profileWidthPx;
  const fillGradient = overlayCtx.createLinearGradient(baseX, 0, fillEndX, 0);
  fillGradient.addColorStop(0.0, "rgba(80, 205, 245, 0.08)");
  fillGradient.addColorStop(0.55, "rgba(80, 205, 245, 0.20)");
  fillGradient.addColorStop(1.0, "rgba(255, 232, 130, 0.32)");

  overlayCtx.beginPath();
  overlayCtx.moveTo(baseX, first.y);
  traceSmoothHistogramCurve(points, false);
  overlayCtx.lineTo(baseX, last.y);
  overlayCtx.closePath();
  overlayCtx.fillStyle = fillGradient;
  overlayCtx.fill();

  overlayCtx.beginPath();
  overlayCtx.moveTo(baseX, first.y);
  overlayCtx.lineTo(baseX, last.y);
  overlayCtx.strokeStyle = "rgba(205, 232, 240, 0.28)";
  overlayCtx.lineWidth = 1.0 * histogramStrokeScale;
  overlayCtx.stroke();

  overlayCtx.shadowColor = "rgba(70, 215, 255, 0.55)";
  overlayCtx.shadowBlur = 8.0 * histogramStrokeScale;
  overlayCtx.beginPath();
  traceSmoothHistogramCurve(points);
  overlayCtx.strokeStyle = "rgba(210, 246, 255, 0.88)";
  overlayCtx.lineWidth = 1.6 * histogramStrokeScale;
  overlayCtx.stroke();
  overlayCtx.shadowBlur = 0.0;

  overlayCtx.beginPath();
  traceSmoothHistogramCurve(points);
  overlayCtx.strokeStyle = "rgba(255, 233, 145, 0.46)";
  overlayCtx.lineWidth = 0.75 * histogramStrokeScale;
  overlayCtx.stroke();

  overlayCtx.restore();
}

// --------------------
// Wave uniforms
// --------------------

function setWaveInitUniforms() {
  const splitterV0 = computeBalancedSplitterV0();

  gl.uniform2i(U.waveInit.uSimRes, simW, simH);
  gl.uniform1f(U.waveInit.uHBAR, params.hbar);
  gl.uniform1f(U.waveInit.uMass, params.mass);
  gl.uniform1f(U.waveInit.uP0, params.p0);
  gl.uniform1f(U.waveInit.uDT, params.dt);

  gl.uniform2f(U.waveInit.uPacketPosFrac, params.packetX, params.packetY);
  gl.uniform1f(U.waveInit.uPacketSigmaPx, simPx(params.packetSigma));

  gl.uniform1f(U.waveInit.uSplitterXFrac, params.splitterX);
  gl.uniform1f(U.waveInit.uSplitterLengthPx, simPx(params.splitterLength));
  gl.uniform1f(U.waveInit.uSplitterWidthPx, simPx(params.splitterWidth));
  gl.uniform1f(U.waveInit.uSplitterV0, splitterV0);
  gl.uniform1f(U.waveInit.uDetectorXFrac, guideMirrorDetectorX);
  gl.uniform1f(U.waveInit.uGuideMirrorXFrac, params.guideMirrorX);
  gl.uniform1f(U.waveInit.uGuideMirrorLengthPx, simPx(params.guideMirrorLength));
  gl.uniform1f(U.waveInit.uGuideMirrorAngleTrim, params.guideMirrorAngleTrimDeg * Math.PI / 180.0);
  gl.uniform1f(U.waveInit.uGuideMirrorYTrimPx, simPx(params.guideMirrorYTrim));
  gl.uniform1f(U.waveInit.uGuideMirrorWidthPx, simPx(params.guideMirrorPhysicalWidth));
  gl.uniform1f(U.waveInit.uGuideMirrorV0, params.guideMirrorV0);
  gl.uniform1i(U.waveInit.uGuideMirrorsActive, params.guideMirrorsActive | 0);
  gl.uniform1f(U.waveInit.uMirrorThicknessPx, simPx(params.mirrorThickness));
  gl.uniform1f(U.waveInit.uMirrorV0, params.mirrorV0);

  gl.uniform1f(U.waveInit.uAbsorbPx, simPx(params.absorbPx));
  gl.uniform1f(U.waveInit.uAbsorbStrength, params.absorbStrength);
  gl.uniform1f(
    U.waveInit.uFallbackAbsorbPx,
    params.detectorActive ? 0.0 : simPx(FALLBACK_ABSORB_WIDTH_PX)
  );
  gl.uniform1f(
    U.waveInit.uFallbackAbsorbStrength,
    params.detectorActive ? 0.0 : FALLBACK_ABSORB_STRENGTH
  );
}


function setWaveStepUniforms(srcTex) {
  const splitterV0 = computeBalancedSplitterV0();

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, srcTex);
  gl.uniform1i(U.waveStep.uState, 0);

  gl.uniform2i(U.waveStep.uSimRes, simW, simH);
  gl.uniform1f(U.waveStep.uHBAR, params.hbar);
  gl.uniform1f(U.waveStep.uMass, params.mass);
  gl.uniform1f(U.waveStep.uP0, params.p0);
  gl.uniform1f(U.waveStep.uDT, params.dt);

  gl.uniform1f(U.waveStep.uSplitterXFrac, params.splitterX);
  gl.uniform1f(U.waveStep.uSplitterLengthPx, simPx(params.splitterLength));
  gl.uniform1f(U.waveStep.uSplitterWidthPx, simPx(params.splitterWidth));
  gl.uniform1f(U.waveStep.uSplitterV0, splitterV0);
  gl.uniform1f(U.waveStep.uDetectorXFrac, guideMirrorDetectorX);
  gl.uniform1f(U.waveStep.uGuideMirrorXFrac, params.guideMirrorX);
  gl.uniform1f(U.waveStep.uGuideMirrorLengthPx, simPx(params.guideMirrorLength));
  gl.uniform1f(U.waveStep.uGuideMirrorAngleTrim, params.guideMirrorAngleTrimDeg * Math.PI / 180.0);
  gl.uniform1f(U.waveStep.uGuideMirrorYTrimPx, simPx(params.guideMirrorYTrim));
  gl.uniform1f(U.waveStep.uGuideMirrorWidthPx, simPx(params.guideMirrorPhysicalWidth));
  gl.uniform1f(U.waveStep.uGuideMirrorV0, params.guideMirrorV0);
  gl.uniform1i(U.waveStep.uGuideMirrorsActive, params.guideMirrorsActive | 0);
  gl.uniform1f(U.waveStep.uMirrorThicknessPx, simPx(params.mirrorThickness));
  gl.uniform1f(U.waveStep.uMirrorV0, params.mirrorV0);

  gl.uniform1f(U.waveStep.uAbsorbPx, simPx(params.absorbPx));
  gl.uniform1f(U.waveStep.uAbsorbStrength, params.absorbStrength);
  gl.uniform1f(
    U.waveStep.uFallbackAbsorbPx,
    params.detectorActive ? 0.0 : simPx(FALLBACK_ABSORB_WIDTH_PX)
  );
  gl.uniform1f(
    U.waveStep.uFallbackAbsorbStrength,
    params.detectorActive ? 0.0 : FALLBACK_ABSORB_STRENGTH
  );
}

// --------------------
// Wave init/step
// --------------------
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

// --------------------
// Particles
// --------------------
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

  const sigma1D = simPx(params.packetSigma) / Math.sqrt(2);
  const bounds = getViewportBounds();
  const x0 = bounds.innerMinX + (bounds.innerMaxX - bounds.innerMinX) * params.packetX;
  const y0 = bounds.innerMinY + (bounds.innerMaxY - bounds.innerMinY) * params.packetY;

  for (let i = 0; i < n; i++) {
    let x = x0 + randn() * sigma1D;
    let y = y0 + randn() * sigma1D;
    x = Math.max(bounds.innerMinX, Math.min(bounds.innerMaxX, x));
    y = Math.max(bounds.innerMinY, Math.min(bounds.innerMaxY, y));
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
  resetDetectorHistogram();
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
  gl.uniform1f(U.partUpdate.uP0, params.p0);
  gl.uniform1f(U.partUpdate.uDT, params.dt);
  gl.uniform1i(U.partUpdate.uGuidingMode, params.guidingMode | 0);
  gl.uniform1f(U.partUpdate.uSpinS, params.spinS);

  gl.uniform1f(U.partUpdate.uSplitterXFrac, params.splitterX);
  gl.uniform1f(U.partUpdate.uSplitterLengthPx, simPx(params.splitterLength));
  gl.uniform1f(U.partUpdate.uSplitterWidthPx, simPx(params.splitterWidth));
  gl.uniform1f(U.partUpdate.uMirrorThicknessPx, simPx(params.mirrorThickness));
  gl.uniform1f(U.partUpdate.uDetectorXFrac, guideMirrorDetectorX);
  gl.uniform1f(U.partUpdate.uDetectionXFrac, getDetectionXFrac());
  gl.uniform1f(U.partUpdate.uDetectorLengthPx, simPx(params.detectorLength));
  gl.uniform1i(U.partUpdate.uDetectorActive, 1);
  gl.uniform1f(U.partUpdate.uGuideMirrorXFrac, params.guideMirrorX);
  gl.uniform1f(U.partUpdate.uGuideMirrorLengthPx, simPx(params.guideMirrorLength));
  gl.uniform1f(U.partUpdate.uGuideMirrorAngleTrim, params.guideMirrorAngleTrimDeg * Math.PI / 180.0);
  gl.uniform1f(U.partUpdate.uGuideMirrorYTrimPx, simPx(params.guideMirrorYTrim));
  gl.uniform1f(U.partUpdate.uGuideMirrorWidthPx, simPx(params.guideMirrorPhysicalWidth));
  gl.uniform1i(U.partUpdate.uGuideMirrorsActive, params.guideMirrorsActive | 0);

  gl.uniform1f(U.partUpdate.uAbsorbPx, simPx(params.absorbPx));
  gl.uniform1f(U.partUpdate.uParticleKillMarginPx, simPx(params.particleKillMargin));
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

// --------------------
// Density fade from half-life (simulation time)
// --------------------
const LN2 = Math.log(2);
function fadeFromHalfLife(halfLife, dtTotal) {
  if (halfLife <= 0) return 0.0;
  return Math.exp(-LN2 * (dtTotal / halfLife));
}

// --------------------
// Density buffers
// --------------------
function rebuildDensity() {
  if (densTexA) gl.deleteTexture(densTexA);
  if (densTexB) gl.deleteTexture(densTexB);
  if (densFboA) gl.deleteFramebuffer(densFboA);
  if (densFboB) gl.deleteFramebuffer(densFboB);

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

  const waveTex = flip ? texB : texA;
  const src = densFlip ? densTexB : densTexA;
  const dstFbo = densFlip ? densFboA : densFboB;

  const fade = fadeFromHalfLife(params.trailHalfLife, dtTotal);

  // 1) fade old density into dst
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

  // 2) stamp particles additively to RED only
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.colorMask(true, true, true, false);

  gl.useProgram(progPartStamp);
  gl.bindVertexArray(vaoParticles);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, waveTex);
  gl.uniform1i(U.partStamp.uState, 0);

  gl.uniform2i(U.partStamp.uSimRes, simW, simH);
  gl.uniform1f(U.partStamp.uPointSize, params.dotSize);
  gl.uniform1f(U.partStamp.uVisGain, params.visGain);
  gl.uniform1f(U.partStamp.uVisGamma, params.visGamma);
  gl.uniform1f(U.partStamp.uWaveTailFade, params.waveTailFade);
  gl.uniform1f(U.partStamp.uDotSigma, params.dotSigma);
  gl.uniform1f(U.partStamp.uDotGain, params.dotGain);
  gl.uniform1f(U.partStamp.uStampGain, params.trailStampGain);
  gl.uniform1i(U.partStamp.uNumParticles, params.nParticles);
  gl.uniform1f(U.partStamp.uTrailWidth, params.trailWidth);
  gl.uniform1i(U.partStamp.uRenderMode, PARTICLE_RENDER_ALL);
  setViewUniforms(U.partStamp, 0.5, 0.5, 1.0, false);

  gl.drawArrays(gl.POINTS, 0, Math.floor(params.nParticles));

  gl.colorMask(true, true, true, true);
  gl.disable(gl.BLEND);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindVertexArray(null);

  densFlip = 1 - densFlip;
}

// --------------------
// Barrier opacity helper (optional)
// --------------------

function computeSplitterOpacity() {
  const splitter = computeBalancedSplitterCalibration();
  if (splitter.v0 <= 0.0) return 0.0;
  if (splitter.normalEnergy >= splitter.v0) return params.splitterOpacity * 0.7;
  return params.splitterOpacity;
}

// --------------------
// Boundary overlay
// --------------------

function drawKillBoundary() {
  const base = simPx(params.absorbPx + params.particleKillMargin);
  if (base <= 0.0 || simW <= 0 || simH <= 0) return;

  const leftBoundaryX = Math.min(0.45 * (simW - 1), base / 1.20);
  const rightBoundaryX = Math.max(leftBoundaryX + 1, (simW - 1) - base);

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

  gl.useProgram(progBoundary);
  gl.bindVertexArray(vaoKillBoundary);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const colorLoc = gl.getUniformLocation(progBoundary, "uBoundaryColor");
  const boundaryRectLoc = gl.getUniformLocation(progBoundary, "uBoundaryRect");
  gl.uniform4f(colorLoc, 0.20, 0.80, 0.30, 0.15);

  const leftViewX = simToCanvasX(leftBoundaryX);
  const rightViewX = simToCanvasX(rightBoundaryX);

  gl.uniform4f(
    boundaryRectLoc,
    canvasToNDCX(leftViewX),
    -1,
    canvasToNDCX(leftViewX + boundaryThickness),
    1
  );
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.uniform4f(
    boundaryRectLoc,
    canvasToNDCX(rightViewX - boundaryThickness),
    -1,
    canvasToNDCX(rightViewX),
    1
  );
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.disable(gl.BLEND);
  gl.bindVertexArray(null);
}

// --------------------
// Render
// --------------------
function render() {
  const waveTex = flip ? texB : texA;
  const densTex = densFlip ? densTexB : densTexA;

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.disable(gl.BLEND);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // wave background
  gl.useProgram(progWaveRender);
  gl.bindVertexArray(vaoEmpty);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, waveTex);
  gl.uniform1i(U.waveRender.uState, 0);

  gl.uniform2i(U.waveRender.uSimRes, simW, simH);
  gl.uniform1f(U.waveRender.uVisGain, params.visGain);
  gl.uniform1f(U.waveRender.uVisGamma, params.visGamma);
  gl.uniform1f(U.waveRender.uWaveTailFade, params.waveTailFade);
  setViewUniforms(U.waveRender);
  gl.uniform1i(U.waveRender.uShowWave, params.showWave | 0);
  gl.uniform1i(U.waveRender.uShowPhase, params.showPhase);

  gl.uniform1f(U.waveRender.uSplitterXFrac, params.splitterX);
  gl.uniform1f(U.waveRender.uSplitterLengthPx, simPx(params.splitterLength));
  gl.uniform1f(
    U.waveRender.uSplitterWidthPx,
    simPx(params.splitterWidth) * VISUAL_SPLITTER_WIDTH_SCALE
  );
  gl.uniform1f(U.waveRender.uMirrorThicknessPx, simPx(params.mirrorThickness));
  gl.uniform1f(U.waveRender.uAbsorbPx, simPx(params.absorbPx));
  gl.uniform1f(U.waveRender.uSplitterOpacity, computeSplitterOpacity());
  gl.uniform1f(U.waveRender.uDetectorXFrac, guideMirrorDetectorX);
  gl.uniform1f(U.waveRender.uDetectionXFrac, getDetectionXFrac());
  gl.uniform1f(U.waveRender.uDetectorLengthPx, simPx(params.detectorLength));
  gl.uniform1f(U.waveRender.uDetectorWidthPx, simPx(params.detectorWidth));
  gl.uniform1i(U.waveRender.uDetectorActive, 1);
  gl.uniform1f(U.waveRender.uGuideMirrorXFrac, params.guideMirrorX);
  gl.uniform1f(U.waveRender.uGuideMirrorLengthPx, simPx(params.guideMirrorLength));
  gl.uniform1f(U.waveRender.uGuideMirrorAngleTrim, params.guideMirrorAngleTrimDeg * Math.PI / 180.0);
  gl.uniform1f(U.waveRender.uGuideMirrorYTrimPx, simPx(params.guideMirrorYTrim));
  gl.uniform1f(U.waveRender.uGuideMirrorWidthPx, simPx(params.guideMirrorWidth));
  gl.uniform1i(U.waveRender.uGuideMirrorsActive, params.guideMirrorsActive | 0);
  gl.uniform1i(U.waveRender.uCollapseActive, collapse.active ? 1 : 0);
  gl.uniform1f(U.waveRender.uCollapseProgress, collapseProgress());
  gl.uniform2f(
    U.waveRender.uCollapsePosFrac,
    simW > 1 ? collapse.xPx / (simW - 1) : 0.5,
    simH > 1 ? collapse.yPx / (simH - 1) : 0.5
  );
  gl.uniform1f(U.waveRender.uCollapseSigmaPx, Math.max(2.5, simPx(10)));

  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // trail overlay
  if (params.showTrail) {
    gl.enable(gl.BLEND);

    // Different blending modes for better trail visibility
    if (params.trailBlendMode === 0) {
      // Additive blending (original)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    } else if (params.trailBlendMode === 1) {
      // Screen blending - helps preserve individual trails
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR);
    } else if (params.trailBlendMode === 2) {
      // Max blending - shows the brightest trails
      gl.blendFunc(gl.ONE, gl.ONE);
      // For max blending, we need to modify the shader output
    }

    gl.useProgram(progDensityRender);
    gl.bindVertexArray(vaoEmpty);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, densTex);
    gl.uniform1i(U.densityRender.uDensity, 0);

    gl.uniform1f(U.densityRender.uGain, params.trailVisGain);
    gl.uniform1f(U.densityRender.uGamma, params.trailVisGamma);
    gl.uniform1i(U.densityRender.uBlendMode, params.trailBlendMode | 0);
    gl.uniform1i(U.densityRender.uColorCodePaths, params.colorCodePaths | 0);
    setViewUniforms(U.densityRender);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.disable(gl.BLEND);
  }

  // kill boundary (rendered before particles so particles appear on top)
  drawKillBoundary();

  // live particles, or detector hits when normal particles are hidden
  if (particleSrc && detectedParticleMask) {
    const renderMode = params.showParticles
      ? PARTICLE_RENDER_ALL
      : PARTICLE_RENDER_DETECTED_ONLY;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(progPartView);
    gl.bindVertexArray(vaoParticles);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, waveTex);
    gl.uniform1i(U.partView.uState, 0);

    gl.uniform2i(U.partView.uSimRes, simW, simH);
    gl.uniform1f(U.partView.uPointSize, params.dotSize * view.zoom);
    gl.uniform1f(U.partView.uVisGain, params.visGain);
    gl.uniform1f(U.partView.uVisGamma, params.visGamma);
    gl.uniform1f(U.partView.uWaveTailFade, params.waveTailFade);
    gl.uniform1f(U.partView.uDotSigma, params.dotSigma);
    gl.uniform1f(U.partView.uDotGain, params.dotGain);
    gl.uniform1i(U.partView.uColorCodePaths, params.colorCodePaths | 0);
    gl.uniform1i(U.partView.uNumParticles, params.nParticles);
    gl.uniform1f(U.partView.uTrailWidth, 0.0);
    gl.uniform1i(U.partView.uRenderMode, renderMode);
    setViewUniforms(U.partView);

    gl.drawArrays(gl.POINTS, 0, Math.floor(params.nParticles));

    gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
  }
}

function updateStats() {
  statsEl.textContent = "";
}

// --------------------
// Rebuild / reset
// --------------------
function rebuildSimulation() {
  resetCollapse();
  resizeCanvas();

  if (texA) gl.deleteTexture(texA);
  if (texB) gl.deleteTexture(texB);
  if (fboA) gl.deleteFramebuffer(fboA);
  if (fboB) gl.deleteFramebuffer(fboB);

  let targetW = Math.max(
    64,
    Math.floor(PHYSICAL_VIEW_WIDTH * params.simScale * PHYSICAL_DOMAIN_SCALE)
  );
  let targetH = Math.max(
    64,
    Math.floor(PHYSICAL_VIEW_HEIGHT * params.simScale * PHYSICAL_DOMAIN_SCALE)
  );
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  if (targetW > maxTextureSize || targetH > maxTextureSize) {
    const fit = Math.min(maxTextureSize / targetW, maxTextureSize / targetH);
    targetW = Math.max(64, Math.floor(targetW * fit));
    targetH = Math.max(64, Math.floor(targetH * fit));
  }

  simW = targetW;
  simH = targetH;

  texA = makeTexFloat32(simW, simH);
  texB = makeTexFloat32(simW, simH);
  fboA = makeFBO(texA);
  fboB = makeFBO(texB);
  flip = 0;

  resetWave();
  rebuildParticles();
  rebuildDensity();
  updateDetectorToggleButton();
}

function resetAll() {
  resetCollapse();
  paused = false;
  pauseButton.textContent = "Pause";
  guideMirrorDetectorX = params.detectorX;
  resetWave();
  rebuildParticles();
  clearDensity();
  renderDetectorHistogram();
  updateDetectorToggleButton();
}

// --------------------
// Main
// --------------------
function syncDisplaySize() {
  if (!resizeCanvas()) return;
  if (densTexA) rebuildDensity();
  updateDetectorToggleButton();
}

window.addEventListener("resize", syncDisplaySize);

async function main() {
  await loadShaders();
  buildPrograms();
  rebuildSimulation();
  updateStats();

  
  requestAnimationFrame(function loop(frameTime) {
    updateViewEasing(frameTime);
    syncDisplaySize();

    if (!paused) {
      const steps = Math.floor(params.stepsPerFrame);
      for (let i = 0; i < steps; i++) {
        waveStep();
        particleUpdate();
      }
      const detectedCount = captureDetectorHits();
      if (
        collapseEnabled &&
        !collapse.active &&
        detectedCount > 0 &&
        particleReadback &&
        particleReadback[2] > 1.5
      ) {
        beginCollapseAt(particleReadback[0], particleReadback[1]);
      } else if (!collapseEnabled) {
        const autoPauseCount = Math.ceil(
          Math.floor(params.nParticles) * DETECTOR_AUTO_PAUSE_FRACTION
        );
        if (
          !detectorAutoPauseTriggered &&
          detectedCount >= autoPauseCount
        ) {
          detectorAutoPauseTriggered = true;
          pauseSimulation();
        }
      }
      if (!collapse.active) densityStepAndStamp();
    }

    render();
    renderDetectorHistogram();
    updateDetectorToggleButton();
    updateStats();
    requestAnimationFrame(loop);
  });
}

main().catch(err => {
  console.error(err);
  alert(String(err));
});
