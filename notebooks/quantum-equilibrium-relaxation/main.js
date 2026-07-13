import { effectiveDt, effectiveStepsPerFrame, initSimulationSpeedControl, setSimulationFrameDuration } from "../simulation-speed.js";

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

const controls = document.getElementById("controls");
const statsEl = document.getElementById("stats");
const resetBtn = document.getElementById("reset");
const pauseBtn = document.getElementById("pause");
const minUiBtn = document.getElementById("minui");
const uiBody = document.getElementById("uibody");
const theoryPanel = document.getElementById("theory");
const theoryBody = document.getElementById("theorybody");
const theoryToggle = document.getElementById("mintheory");

const TAU = Math.PI * 2;
const LN2 = Math.log(2);
const BOX_LX = 1.6;
const BOX_LY = 1.0;
const EDGE_EPS = 1e-5;
const urlParams = new URLSearchParams(window.location.search);
const isEmbedded = urlParams.get("embed") === "1";
initSimulationSpeedControl({ visible: !isEmbedded });

function mode(nx, ny, amp = 1, phase = 0) {
  return { nx, ny, amp, phase, key: nx * nx + ny * ny };
}

const WAVE_PRESETS = [
  { short: "1", name: "Ground state", modes: [mode(1, 1)] },
  { short: "2", name: "Two-state shear", modes: [mode(1, 1, 1.0, 0.0), mode(3, 2, 0.92, 0.35)] },
  { short: "3", name: "Three-state fold", modes: [mode(1, 2, 1.0, 0.0), mode(2, 1, 0.85, 1.2), mode(3, 3, 0.72, 2.1)] },
];

for (const preset of WAVE_PRESETS) {
  const norm = Math.hypot(...preset.modes.map((m) => m.amp));
  for (const m of preset.modes) m.amp /= Math.max(norm, 1e-9);
}

const INIT_DISTRIBUTIONS = ["Born", "Uniform", "Square"];
const GUIDING_MODE_NAMES = ["Schrodinger", "Pauli spin"];

const params = {
  stepsPerFrame: 1,
  hbar: 1.0,
  mass: 1.0,
  dt: 0.001,
  integratorSubsteps: 1,
  wavePreset: 1,
  initDistribution: 2,
  initRectangleSize: 0.10,
  nParticles: 50000,
  rhoMin: 1e-14,
  velClamp: 100.0,
  guidingMode: 1,
  spinMagnitude: 0.5,

  visGain: 5.0,
  visGamma: 0.8,
  showPhase: 0,

  showParticles: 1,
  dotSize: 4.0,
  dotSigma: 0.28,
  dotGain: 0.5,

  showTrail: 1,
  trailHalfLife: .001,
  trailVisGain: 0.5,
  trailVisGamma: 0.6,
  trailStampGain: 0.55,
  trailBlendMode: 1,
};

const EMBEDDED_DEMOS = {
  born: {
    params: { initDistribution: 0, guidingMode: 0 , nParticles:10000},
    controls: new Set(["guidingMode","wavePreset", "nParticles"]),
  },
  square: {
    params: { initDistribution: 2, guidingMode: 0 },
    controls: new Set(["wavePreset", "nParticles"]),
  },
  "pauli-square": {
    params: { initDistribution: 2, guidingMode: 1 },
    controls: new Set(["wavePreset", "nParticles", "initDistribution"]),
  },
};

const activeDemo = isEmbedded ? (urlParams.get("demo") || "born") : "full";
const activeDemoProfile = EMBEDDED_DEMOS[activeDemo] || null;
if (activeDemoProfile) {
  Object.assign(params, activeDemoProfile.params);
}

const TRAIL_FADE_FRAME_DT = Math.max(
  1e-12,
  params.dt * Math.max(1, Math.floor(params.stepsPerFrame))
);

let paused = false;
let simTime = 0;
let particleCount = 0;
let particleData = new Float32Array(0);
let particleSrc = null;
let particleDst = null;
let particleVao = null;
let particleTF = null;
let densW = 0, densH = 0;
let densTexA = null, densTexB = null, densFboA = null, densFboB = null, densFlip = 0;
let densityBound = 1;

const SH = {};
let progWaveRender, progPartUpdate, progPartView, progPartStamp, progDensityStep, progDensityRender;
let U = {};
const vaoEmpty = gl.createVertexArray();
const modeUniformData = new Float32Array(16);
const debugEnabled = urlParams.has("debug");

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
  return TRAIL_FADE_FRAME_DT;
}

function particleTrailWidth() {
  return params.dotSize * 0.7;
}

function selectedPreset() {
  const index = Math.max(0, Math.min(WAVE_PRESETS.length - 1, params.wavePreset | 0));
  return WAVE_PRESETS[index];
}

function modeText(m) {
  return `(${m.nx},${m.ny})`;
}

function modeListText(preset = selectedPreset()) {
  return preset.modes.map(modeText).join("+");
}

function shouldShowControl(key) {
  return !activeDemoProfile || activeDemoProfile.controls.has(key);
}

function eigenEnergy(m) {
  const scale = params.hbar * params.hbar * Math.PI * Math.PI / (2 * Math.max(params.mass, 1e-9));
  return scale * (m.nx * m.nx / (BOX_LX * BOX_LX) + m.ny * m.ny / (BOX_LY * BOX_LY));
}

function addSlider(key, label, min, max, step, onChange = null) {
  if (!shouldShowControl(key)) return;

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
    updateStats();
  });
  input.addEventListener("change", () => {
    if (onChange) onChange();
    updateStats();
  });

  row.appendChild(lab);
  row.appendChild(input);
  row.appendChild(val);
  controls.appendChild(row);
}

function addToggleInt(key, label, onChange = null) {
  if (!shouldShowControl(key)) return;

  const row = document.createElement("div");
  row.className = "row no-value";

  const lab = document.createElement("label");
  lab.textContent = label;

  const btn = document.createElement("button");
  btn.style.flex = "1";
  const sync = () => { btn.textContent = params[key] ? "ON" : "OFF"; };
  sync();
  btn.addEventListener("click", () => {
    params[key] = params[key] ? 0 : 1;
    sync();
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

function addSegmentedControl(key, label, values, onChange = null) {
  if (!shouldShowControl(key)) return;

  const row = document.createElement("div");
  row.className = "row no-value";

  const lab = document.createElement("label");
  lab.textContent = label;

  const group = document.createElement("div");
  group.className = "toggle-group";

  const buttons = values.map((value, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = value;
    btn.addEventListener("click", () => {
      params[key] = index;
      sync();
      if (onChange) onChange(index);
    });
    group.appendChild(btn);
    return btn;
  });

  const sync = () => {
    const selected = params[key] | 0;
    buttons.forEach((btn, index) => btn.classList.toggle("selected", index === selected));
  };

  const val = document.createElement("div");
  val.className = "val";
  val.textContent = "";

  row.appendChild(lab);
  row.appendChild(group);
  row.appendChild(val);
  controls.appendChild(row);
  sync();
}

function addSectionHeader(label, keys = []) {
  if (keys.length && !keys.some(shouldShowControl)) return;

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

addSectionHeader("Simulation", ["stepsPerFrame", "dt", "integratorSubsteps", "velClamp"]);
addSlider("stepsPerFrame", "Steps/frame", 1, 30, 1);
addSlider("dt", "dt",  0.001, 0.01, 0.001);


addSectionHeader("Physical Parameters", ["wavePreset", "guidingMode", "spinMagnitude", "initDistribution", "initRectangleSize"]);
addSegmentedControl("wavePreset", "state", WAVE_PRESETS.map((p) => p.short), () => resetAll());
addSegmentedControl("guidingMode", "guiding law", GUIDING_MODE_NAMES, () => resetAll());
addSlider("spinMagnitude", "spin strength", 0.0, 2.0, 0.05);
addSegmentedControl("initDistribution", "init particles", INIT_DISTRIBUTIONS, () => resetAll());
addSlider("initRectangleSize", "square size", 0.05, 0.90, 0.01, () => rebuildParticles());

addSectionHeader("Visual Parameters", ["visGain", "visGamma", "showPhase", "showParticles", "nParticles", "dotSize", "dotGain", "showTrail", "trailHalfLife"]);
//addSlider("visGain", "density gain", 1.0, 40.0, 1.0);
//addSlider("visGamma", "density gamma", 0.25, 1.4, 0.05);
addToggleInt("showPhase", "show phase");

addToggleInt("showParticles", "show particles");
addSlider("nParticles", "particle count", 10000, 100000, 10000, () => resetAll());
addSlider("dotSize", "particle size", 2.0, 16.0, 0.5);
//addSlider("dotGain", "particle gain", 0.1, 3.0, 0.1);
addToggleInt("showTrail", "draw trails");
addSlider("trailHalfLife", "trail length", .001, .01, .001);

function waveAt(x, y, t, withGradient = false) {
  const preset = selectedPreset();
  let re = 0, im = 0;
  let dxRe = 0, dxIm = 0, dyRe = 0, dyIm = 0;

  for (const m of preset.modes) {
    const px = m.nx * Math.PI * x / BOX_LX;
    const py = m.ny * Math.PI * y / BOX_LY;
    const sx = Math.sin(px);
    const sy = Math.sin(py);
    const phi = sx * sy;
    const phase = m.phase - eigenEnergy(m) * t / Math.max(params.hbar, 1e-9);
    const cr = m.amp * Math.cos(phase);
    const ci = m.amp * Math.sin(phase);

    re += cr * phi;
    im += ci * phi;

    if (withGradient) {
      const dphidx = (m.nx * Math.PI / BOX_LX) * Math.cos(px) * sy;
      const dphidy = (m.ny * Math.PI / BOX_LY) * sx * Math.cos(py);
      dxRe += cr * dphidx;
      dxIm += ci * dphidx;
      dyRe += cr * dphidy;
      dyIm += ci * dphidy;
    }
  }

  return { re, im, dxRe, dxIm, dyRe, dyIm };
}

function densityAt(x, y, t = simTime) {
  const w = waveAt(x, y, t, false);
  return w.re * w.re + w.im * w.im;
}

function updateDensityBound() {
  const cols = 120;
  const rows = 80;
  let maxRho = 0;
  for (let j = 0; j < rows; j++) {
    const y = BOX_LY * (j + 0.5) / rows;
    for (let i = 0; i < cols; i++) {
      const x = BOX_LX * (i + 0.5) / cols;
      maxRho = Math.max(maxRho, densityAt(x, y, 0));
    }
  }
  densityBound = Math.max(1e-6, maxRho * 1.08);
}

function sampleUniform() {
  return {
    x: EDGE_EPS + Math.random() * (BOX_LX - 2 * EDGE_EPS),
    y: EDGE_EPS + Math.random() * (BOX_LY - 2 * EDGE_EPS),
  };
}

function sampleBorn() {
  for (let attempt = 0; attempt < 8000; attempt++) {
    const p = sampleUniform();
    if (Math.random() * densityBound <= densityAt(p.x, p.y, 0)) return p;
  }
  return sampleUniform();
}

function sampleSquare() {
  const size = Math.max(0.01, Math.min(0.98, params.initRectangleSize));
  const side = size * Math.min(BOX_LX, BOX_LY);
  const cx = 0.5 * BOX_LX;
  const cy = 0.5 * BOX_LY;
  return {
    x: Math.max(EDGE_EPS, Math.min(BOX_LX - EDGE_EPS, cx + (Math.random() - 0.5) * side)),
    y: Math.max(EDGE_EPS, Math.min(BOX_LY - EDGE_EPS, cy + (Math.random() - 0.5) * side)),
  };
}

function compile(type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
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

function u(prog, name) {
  return gl.getUniformLocation(prog, name);
}

async function loadText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to load ${url}: ${r.status}`);
  return await r.text();
}

async function loadShaders() {
  const base = "./shaders/";
  const files = [
    "fullscreen.vert",
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

function buildPrograms() {
  const vsFull = compile(gl.VERTEX_SHADER, SH["fullscreen.vert"]);
  const vsParticle = compile(gl.VERTEX_SHADER, SH["particle_render.vert"]);
  const vsParticleUpdate = compile(gl.VERTEX_SHADER, SH["particle_update.vert"]);

  progWaveRender = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["wave_render.frag"]));
  progPartUpdate = link(
    vsParticleUpdate,
    compile(gl.FRAGMENT_SHADER, SH["particle_update.frag"]),
    ["vState"],
  );
  progPartView = link(vsParticle, compile(gl.FRAGMENT_SHADER, SH["particle_render.frag"]));
  progPartStamp = link(vsParticle, compile(gl.FRAGMENT_SHADER, SH["particle_stamp.frag"]));
  progDensityStep = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["density_step.frag"]));
  progDensityRender = link(vsFull, compile(gl.FRAGMENT_SHADER, SH["density_render.frag"]));

  U.waveRender = {
    uModeCount: u(progWaveRender, "uModeCount"),
    uModes: u(progWaveRender, "uModes[0]"),
    uTime: u(progWaveRender, "uTime"),
    uHBAR: u(progWaveRender, "uHBAR"),
    uMass: u(progWaveRender, "uMass"),
    uBoxSize: u(progWaveRender, "uBoxSize"),
    uVisGain: u(progWaveRender, "uVisGain"),
    uVisGamma: u(progWaveRender, "uVisGamma"),
    uShowPhase: u(progWaveRender, "uShowPhase"),
  };
  U.partUpdate = {
    uModeCount: u(progPartUpdate, "uModeCount"),
    uModes: u(progPartUpdate, "uModes[0]"),
    uTime: u(progPartUpdate, "uTime"),
    uHBAR: u(progPartUpdate, "uHBAR"),
    uMass: u(progPartUpdate, "uMass"),
    uDT: u(progPartUpdate, "uDT"),
    uBoxSize: u(progPartUpdate, "uBoxSize"),
    uGuidingMode: u(progPartUpdate, "uGuidingMode"),
    uSpinMagnitude: u(progPartUpdate, "uSpinMagnitude"),
    uRhoMin: u(progPartUpdate, "uRhoMin"),
    uVelClamp: u(progPartUpdate, "uVelClamp"),
    uSubsteps: u(progPartUpdate, "uSubsteps"),
  };
  U.partView = {
    uBoxSize: u(progPartView, "uBoxSize"),
    uPointSize: u(progPartView, "uPointSize"),
    uNumParticles: u(progPartView, "uNumParticles"),
    uTrailWidth: u(progPartView, "uTrailWidth"),
    uDotSigma: u(progPartView, "uDotSigma"),
    uDotGain: u(progPartView, "uDotGain"),
  };
  U.partStamp = {
    uBoxSize: u(progPartStamp, "uBoxSize"),
    uPointSize: u(progPartStamp, "uPointSize"),
    uNumParticles: u(progPartStamp, "uNumParticles"),
    uTrailWidth: u(progPartStamp, "uTrailWidth"),
    uDotSigma: u(progPartStamp, "uDotSigma"),
    uDotGain: u(progPartStamp, "uDotGain"),
    uStampGain: u(progPartStamp, "uStampGain"),
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
  };
}

function makeDensityTex(w, h) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.FLOAT, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}

function makeFBO(tex) {
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (ok !== gl.FRAMEBUFFER_COMPLETE) throw new Error("FBO incomplete: " + ok);
  return fbo;
}

function deleteDensityTargets() {
  if (densTexA) gl.deleteTexture(densTexA);
  if (densTexB) gl.deleteTexture(densTexB);
  if (densFboA) gl.deleteFramebuffer(densFboA);
  if (densFboB) gl.deleteFramebuffer(densFboB);
  densTexA = densTexB = densFboA = densFboB = null;
}

function resizeCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    rebuildDensity();
    return true;
  }
  return false;
}

function rebuildDensity() {
  deleteDensityTargets();
  densW = Math.max(1, canvas.width);
  densH = Math.max(1, canvas.height);
  densTexA = makeDensityTex(densW, densH);
  densTexB = makeDensityTex(densW, densH);
  densFboA = makeFBO(densTexA);
  densFboB = makeFBO(densTexB);
  clearDensity();
}

function clearDensity() {
  if (!densFboA || !densFboB) return;
  for (const fbo of [densFboA, densFboB]) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, densW, densH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  densFlip = 0;
}

function writeParticle(i, p) {
  const k = i * 4;
  particleData[k + 0] = p.x;
  particleData[k + 1] = p.y;
  particleData[k + 2] = 1;
  particleData[k + 3] = 0;
}

function rebuildParticles() {
  updateDensityBound();
  particleCount = Math.max(0, Math.floor(params.nParticles));
  particleData = new Float32Array(particleCount * 4);

  for (let i = 0; i < particleCount; i++) {
    let p;
    if (params.initDistribution === 0) p = sampleBorn();
    else if (params.initDistribution === 1) p = sampleUniform();
    else p = sampleSquare();
    writeParticle(i, p);
  }

  if (!particleSrc || !particleDst) rebuildParticleBuffers();

  gl.bindBuffer(gl.ARRAY_BUFFER, particleSrc);
  gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, particleDst);
  gl.bufferData(gl.ARRAY_BUFFER, particleData.byteLength, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  bindParticleSource();
  clearDensity();
}

function bindParticleSource() {
  if (!particleVao || !particleSrc) return;
  gl.bindVertexArray(particleVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, particleSrc);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 16, 0);
  gl.bindVertexArray(null);
}

function rebuildParticleBuffers() {
  if (particleSrc) gl.deleteBuffer(particleSrc);
  if (particleDst) gl.deleteBuffer(particleDst);
  if (particleVao) gl.deleteVertexArray(particleVao);
  if (particleTF) gl.deleteTransformFeedback(particleTF);

  particleSrc = gl.createBuffer();
  particleDst = gl.createBuffer();
  particleVao = gl.createVertexArray();
  particleTF = gl.createTransformFeedback();

  bindParticleSource();
}

function setModeUniforms(targetU) {
  const preset = selectedPreset();
  modeUniformData.fill(0);
  for (let i = 0; i < preset.modes.length; i++) {
    const m = preset.modes[i];
    const k = i * 4;
    modeUniformData[k + 0] = m.nx;
    modeUniformData[k + 1] = m.ny;
    modeUniformData[k + 2] = m.amp;
    modeUniformData[k + 3] = m.phase;
  }
  gl.uniform1i(targetU.uModeCount, preset.modes.length);
  gl.uniform4fv(targetU.uModes, modeUniformData);
}

function particleUpdate() {
  if (!particleCount || !particleVao || !particleTF) return;

  gl.useProgram(progPartUpdate);
  setModeUniforms(U.partUpdate);
  gl.uniform1f(U.partUpdate.uTime, simTime);
  gl.uniform1f(U.partUpdate.uHBAR, params.hbar);
  gl.uniform1f(U.partUpdate.uMass, params.mass);
  gl.uniform1f(U.partUpdate.uDT, simulationDt());
  gl.uniform2f(U.partUpdate.uBoxSize, BOX_LX, BOX_LY);
  gl.uniform1i(U.partUpdate.uGuidingMode, params.guidingMode | 0);
  gl.uniform1f(U.partUpdate.uSpinMagnitude, params.spinMagnitude);
  gl.uniform1f(U.partUpdate.uRhoMin, params.rhoMin);
  gl.uniform1f(U.partUpdate.uVelClamp, params.velClamp);
  gl.uniform1i(U.partUpdate.uSubsteps, Math.max(1, Math.floor(params.integratorSubsteps)));

  gl.bindVertexArray(particleVao);
  gl.enable(gl.RASTERIZER_DISCARD);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, particleTF);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, particleDst);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, particleCount);
  gl.endTransformFeedback();
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
  gl.disable(gl.RASTERIZER_DISCARD);
  gl.bindVertexArray(null);

  const oldSrc = particleSrc;
  particleSrc = particleDst;
  particleDst = oldSrc;
  bindParticleSource();
}

function densityStepAndStamp(dtTotal) {
  if (!params.showTrail || !densFboA || !particleVao) return;

  const src = densFlip ? densTexB : densTexA;
  const dstFbo = densFlip ? densFboA : densFboB;
  const fade = params.trailHalfLife <= 0 ? 0 : Math.exp(-LN2 * dtTotal / params.trailHalfLife);

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
  gl.bindVertexArray(particleVao);
  gl.uniform2f(U.partStamp.uBoxSize, BOX_LX, BOX_LY);
  gl.uniform1f(U.partStamp.uPointSize, params.dotSize);
  gl.uniform1i(U.partStamp.uNumParticles, particleCount);
  gl.uniform1f(U.partStamp.uTrailWidth, particleTrailWidth());
  gl.uniform1f(U.partStamp.uDotSigma, params.dotSigma);
  gl.uniform1f(U.partStamp.uDotGain, params.dotGain);
  gl.uniform1f(U.partStamp.uStampGain, params.trailStampGain);
  gl.drawArrays(gl.POINTS, 0, particleCount);

  gl.colorMask(true, true, true, true);
  gl.disable(gl.BLEND);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindVertexArray(null);

  densFlip = 1 - densFlip;
}

function updateSimulation() {
  const steps = simulationStepsPerFrame();
  const dt = simulationDt();
  for (let s = 0; s < steps; s++) {
    particleUpdate();
    simTime += dt;
  }
  densityStepAndStamp(trailFadeFrameDt());
}

function render() {
  const densTex = densFlip ? densTexB : densTexA;

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.disable(gl.BLEND);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(progWaveRender);
  gl.bindVertexArray(vaoEmpty);
  setModeUniforms(U.waveRender);
  gl.uniform1f(U.waveRender.uTime, simTime);
  gl.uniform1f(U.waveRender.uHBAR, params.hbar);
  gl.uniform1f(U.waveRender.uMass, params.mass);
  gl.uniform2f(U.waveRender.uBoxSize, BOX_LX, BOX_LY);
  gl.uniform1f(U.waveRender.uVisGain, params.visGain);
  gl.uniform1f(U.waveRender.uVisGamma, params.visGamma);
  gl.uniform1i(U.waveRender.uShowPhase, params.showPhase | 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  if (params.showTrail && densTex) {
    gl.enable(gl.BLEND);
    if (params.trailBlendMode === 0) gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    else if (params.trailBlendMode === 1) gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR);
    else gl.blendFunc(gl.ONE, gl.ONE);

    gl.useProgram(progDensityRender);
    gl.bindVertexArray(vaoEmpty);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, densTex);
    gl.uniform1i(U.densityRender.uDensity, 0);
    gl.uniform1f(U.densityRender.uGain, params.trailVisGain);
    gl.uniform1f(U.densityRender.uGamma, params.trailVisGamma);
    gl.uniform1i(U.densityRender.uBlendMode, params.trailBlendMode | 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.BLEND);
  }

  if (params.showParticles && particleVao) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(progPartView);
    gl.bindVertexArray(particleVao);
    gl.uniform2f(U.partView.uBoxSize, BOX_LX, BOX_LY);
    gl.uniform1f(U.partView.uPointSize, params.dotSize);
    gl.uniform1i(U.partView.uNumParticles, particleCount);
    gl.uniform1f(U.partView.uTrailWidth, 0);
    gl.uniform1f(U.partView.uDotSigma, params.dotSigma);
    gl.uniform1f(U.partView.uDotGain, params.dotGain);
    gl.drawArrays(gl.POINTS, 0, particleCount);
    gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
  }
}

function updateStats() {
  const preset = selectedPreset();
  const initName = INIT_DISTRIBUTIONS[Math.max(0, Math.min(INIT_DISTRIBUTIONS.length - 1, params.initDistribution | 0))];
  const guidingName = GUIDING_MODE_NAMES[Math.max(0, Math.min(GUIDING_MODE_NAMES.length - 1, params.guidingMode | 0))];
  statsEl.innerHTML = `<b>State</b>: ${preset.name} n=${modeListText(preset)}<br><b>Initial</b>: ${initName}; <b>Guiding</b>: ${guidingName}`;
}

function resetAll() {
  simTime = 0;
  rebuildParticles();
  updateStats();
}

function readParticleBuffer() {
  const data = new Float32Array(particleCount * 4);
  if (!particleSrc || !particleCount) return data;
  gl.bindBuffer(gl.ARRAY_BUFFER, particleSrc);
  gl.getBufferSubData(gl.ARRAY_BUFFER, 0, data);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return data;
}

function particleDensityMetric(cols = 40, rows = 25) {
  const counts = new Float32Array(cols * rows);
  const expected = new Float32Array(cols * rows);
  const data = readParticleBuffer();
  let outside = 0;

  for (let i = 0; i < particleCount; i++) {
    const k = i * 4;
    const x = data[k + 0];
    const y = data[k + 1];
    if (x < 0 || x > BOX_LX || y < 0 || y > BOX_LY) {
      outside++;
      continue;
    }
    const ix = Math.min(cols - 1, Math.max(0, Math.floor(cols * x / BOX_LX)));
    const iy = Math.min(rows - 1, Math.max(0, Math.floor(rows * y / BOX_LY)));
    counts[iy * cols + ix]++;
  }

  let expectedSum = 0;
  for (let iy = 0; iy < rows; iy++) {
    const y = BOX_LY * (iy + 0.5) / rows;
    for (let ix = 0; ix < cols; ix++) {
      const x = BOX_LX * (ix + 0.5) / cols;
      const r = densityAt(x, y, simTime);
      expected[iy * cols + ix] = r;
      expectedSum += r;
    }
  }

  let l1 = 0;
  let rms = 0;
  let maxAbs = 0;
  const n = Math.max(1, particleCount - outside);
  const invExpectedSum = expectedSum > 0 ? 1 / expectedSum : 0;
  for (let i = 0; i < counts.length; i++) {
    const observedProb = counts[i] / n;
    const expectedProb = expected[i] * invExpectedSum;
    const d = observedProb - expectedProb;
    const ad = Math.abs(d);
    l1 += ad;
    rms += d * d;
    maxAbs = Math.max(maxAbs, ad);
  }

  return {
    particleCount,
    simTime,
    cols,
    rows,
    outside,
    l1: 0.5 * l1,
    rms: Math.sqrt(rms / counts.length),
    maxAbs,
  };
}

function installDebugHooks() {
  window.RelaxationBox2DTest = {
    state() {
      return {
        paused,
        simTime,
        particleCount,
        params: { ...params },
      };
    },
    setPaused(value) {
      setPaused(value);
      return this.state();
    },
    setParams(next, reset = false) {
      Object.assign(params, next);
      if (reset) resetAll();
      else updateStats();
      return this.state();
    },
    reset() {
      resetAll();
      render();
      return this.state();
    },
    advance(steps = 1) {
      const n = Math.max(0, Math.floor(steps));
      for (let i = 0; i < n; i++) updateSimulation();
      render();
      updateStats();
      return this.state();
    },
    metric(cols = 40, rows = 25) {
      return particleDensityMetric(cols, rows);
    },
  };
}

resetBtn.addEventListener("click", resetAll);
function setPaused(value) {
  paused = Boolean(value);
  pauseBtn.textContent = paused ? "Resume" : "Pause";
}

pauseBtn.addEventListener("click", () => {
  setPaused(!paused);
});

if (isEmbedded) {
  window.addEventListener("message", (event) => {
    if (event.source !== window.parent) return;
    if (window.location.protocol !== "file:" && event.origin !== window.location.origin) return;
    if (event.data?.type !== "qontic:set-paused") return;
    setPaused(event.data.paused);
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "r" || event.key === "R") resetAll();
  if (event.code === "Space") {
    event.preventDefault();
    pauseBtn.click();
  }
});

window.addEventListener("resize", () => {
  resizeCanvas();
  clearDensity();
});

minUiBtn.addEventListener("click", () => {
  const hidden = uiBody.hidden;
  uiBody.hidden = !hidden;
  minUiBtn.textContent = hidden ? "-" : "+";
});

theoryToggle.addEventListener("click", () => {
  const open = theoryBody.hidden;
  theoryBody.hidden = !open;
  theoryPanel.classList.toggle("is-minimized", !open);
  theoryToggle.textContent = open ? "-" : "+";
  theoryToggle.setAttribute("aria-expanded", String(open));
});

async function main() {
  await loadShaders();
  buildPrograms();
  resizeCanvas();
  rebuildParticleBuffers();
  resetAll();
  if (debugEnabled) installDebugHooks();

  let lastFrameTime = performance.now();
  requestAnimationFrame(function loop(now = performance.now()) {
    const frameSeconds = Math.min(0.05, Math.max(0, (now - lastFrameTime) / 1000));
    lastFrameTime = now;
    setSimulationFrameDuration(frameSeconds);
    resizeCanvas();
    if (!paused) updateSimulation();
    render();
    updateStats();
    requestAnimationFrame(loop);
  });
}

main().catch((err) => {
  console.error(err);
  alert(String(err));
});
