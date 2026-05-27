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
  stepsPerFrame: 20,

  hbar: 6.0,
  mass: 1.0,
  p0: 2.0,
  dt: 0.04,

  packetX: 0.5,
  packetY: 0.5,
  packetSigma: 50.0,
  doubleGaussian: 0,
  gaussianSeparation: 200.0,

  nParticles: 200,
  rhoMin: 1e-6,
  velClamp: 160.0,
  guidingMode: 1,
  boundaryMode: 0,
  spinS: 0.5,

  visGain: 20.0,
  visGamma: 0.5,
  showPhase: 1,

  showParticles: 1,
  dotSize: 9.0,
  dotSigma: 0.28,
  dotGain: 1.,

  showTrail: 1,
  trailHalfLife: 100.0,
  trailVisGain: 1.,
  trailVisGamma: 1,
  trailStampGain: 0.55,
  trailWidth: 6.0,
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

const GUIDING_MODE_NAMES = [
  "Schrodinger",
  "Pauli spin (+z)",
  "Pauli spin (-z)"
];

let paused = false;

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

addSlider("simScale", "sim scale", 0.25, 1.0, 0.05, () => rebuildSimulation());
addSlider("stepsPerFrame", "Steps/frame", 1, 51, 5);
addSlider("dt", "dt", 0.01, 0.04, 0.01);

addSectionHeader("Physical Parameters");
addSlider("p0", "momentum p", 0., 8.0, 0.1, () => resetAll());

//addSlider("packetX", "packet start x", 0.05, 0.95, 0.01, () => resetAll());
//addSlider("packetY", "packet start y", 0.05, 0.95, 0.01, () => resetAll());
addSlider("packetSigma", "packet sigma", 8.0, 80.0, 1.0, () => resetAll());
addToggleInt("doubleGaussian", "split gaussian");
addSlider("gaussianSeparation", "separation", 0.0, 400.0, 10.0, () => resetAll());
addSlider("spinS", "spin s", 0.0, 2.0, 0.5);
{
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

  const btnPauli = document.createElement("button");
  btnPauli.textContent = "Pauli (spin up)";
  btnPauli.addEventListener("click", () => {
    params.guidingMode = 1;
    updateToggleButtons();
    resetAll();
  });

  const btnPauliDown = document.createElement("button");
  btnPauliDown.textContent = "Pauli (spin down)";
  btnPauliDown.addEventListener("click", () => {
    params.guidingMode = 2;
    updateToggleButtons();
    resetAll();
  });

  group.appendChild(btnSchrodinger);
  group.appendChild(btnPauli);
  group.appendChild(btnPauliDown);

  function updateToggleButtons() {
    btnSchrodinger.classList.toggle("selected", params.guidingMode === 0);
    btnPauli.classList.toggle("selected", params.guidingMode === 1);
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

{
  const row = document.createElement("div");
  row.className = "row mode-row";

  const lab = document.createElement("label");
  lab.textContent = "boundary conditions";

  const group = document.createElement("div");
  group.className = "toggle-group";

  const btnReflecting = document.createElement("button");
  btnReflecting.textContent = "Reflecting";
  btnReflecting.addEventListener("click", () => {
    params.boundaryMode = 0;
    updateBoundaryButtons();
  });

  const btnPeriodic = document.createElement("button");
  btnPeriodic.textContent = "Periodic";
  btnPeriodic.addEventListener("click", () => {
    params.boundaryMode = 1;
    updateBoundaryButtons();
  });

  group.appendChild(btnReflecting);
  group.appendChild(btnPeriodic);

  function updateBoundaryButtons() {
    btnReflecting.classList.toggle("selected", params.boundaryMode === 0);
    btnPeriodic.classList.toggle("selected", params.boundaryMode === 1);
  }
  updateBoundaryButtons();

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
addSlider("trailWidth", "trail width (px)", 3, 10.0, 1);

//addSlider("visGain", "wave gain", 0.5, 20.0, 0.5);
//addSlider("visGamma", "wave gamma", 0.3, 2.0, 0.05);

document.getElementById("reset").onclick = () => resetAll();
document.getElementById("pause").onclick = (e) => {
  paused = !paused;
  e.target.textContent = paused ? "Resume" : "Pause";
};
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r") resetAll();
  if (e.key === " ") paused = !paused;
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

let U = {};

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
    uDoubleGaussian: u(progWaveInit, "uDoubleGaussian"),
    uGaussianSeparation: u(progWaveInit, "uGaussianSeparation"),
  };

  U.waveStep = {
    uState: u(progWaveStep, "uState"),
    uSimRes: u(progWaveStep, "uSimRes"),
    uHBAR: u(progWaveStep, "uHBAR"),
    uMass: u(progWaveStep, "uMass"),
    uDT: u(progWaveStep, "uDT"),
    uBoundaryMode: u(progWaveStep, "uBoundaryMode"),
  };

  U.waveRender = {
    uState: u(progWaveRender, "uState"),
    uSimRes: u(progWaveRender, "uSimRes"),
    uVisGain: u(progWaveRender, "uVisGain"),
    uVisGamma: u(progWaveRender, "uVisGamma"),
    uShowPhase: u(progWaveRender, "uShowPhase"),
    uPaletteId: u(progWaveRender, "uPaletteId"),
  };

  U.partUpdate = {
    uState: u(progPartUpdate, "uState"),
    uSimRes: u(progPartUpdate, "uSimRes"),
    uHBAR: u(progPartUpdate, "uHBAR"),
    uMass: u(progPartUpdate, "uMass"),
    uDT: u(progPartUpdate, "uDT"),
    uGuidingMode: u(progPartUpdate, "uGuidingMode"),
    uSpinS: u(progPartUpdate, "uSpinS"),
    uRhoMin: u(progPartUpdate, "uRhoMin"),
    uVelClamp: u(progPartUpdate, "uVelClamp"),
    uBoundaryMode: u(progPartUpdate, "uBoundaryMode"),
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
  gl.uniform1i(U.waveInit.uDoubleGaussian, params.doubleGaussian | 0);
  gl.uniform1f(U.waveInit.uGaussianSeparation, params.gaussianSeparation);
}

function setWaveStepUniforms(srcTex) {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, srcTex);
  gl.uniform1i(U.waveStep.uState, 0);

  gl.uniform2i(U.waveStep.uSimRes, simW, simH);
  gl.uniform1f(U.waveStep.uHBAR, params.hbar);
  gl.uniform1f(U.waveStep.uMass, params.mass);
  gl.uniform1f(U.waveStep.uDT, params.dt);
  gl.uniform1i(U.waveStep.uBoundaryMode, params.boundaryMode | 0);
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
    let x, y;
    
    if (params.doubleGaussian) {
      // Randomly choose which gaussian to sample from (50/50)
      const useFirst = Math.random() < 0.5;
      const sep = params.gaussianSeparation / 2; // offset amount
      
      x = x0 + randn() * sigma1D;
      y = y0 + randn() * sigma1D + (useFirst ? -sep : sep);
    } else {
      x = x0 + randn() * sigma1D;
      y = y0 + randn() * sigma1D;
    }
    
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
  gl.uniform1f(U.partUpdate.uSpinS, params.spinS);

  gl.uniform1f(U.partUpdate.uRhoMin, params.rhoMin);
  gl.uniform1f(U.partUpdate.uVelClamp, params.velClamp);
  gl.uniform1i(U.partUpdate.uBoundaryMode, params.boundaryMode | 0);

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
  gl.uniform1f(U.waveRender.uShowPhase, params.showPhase);

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
    gl.uniform1i(U.densityRender.uPaletteId, params.paletteId | 0);
    gl.uniform1i(U.densityRender.uBlendMode, params.trailBlendMode | 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.disable(gl.BLEND);
  }

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
  return GUIDING_MODE_NAMES[params.guidingMode | 0] ?? GUIDING_MODE_NAMES[0];
}

function updateStats() {
  statsEl.innerHTML = `<b>Physics</b>: ${guidingModeLabel()}<br><b>Sim</b>: ${simW} x ${simH} (${fmt(params.simScale)}x)`;
}

function rebuildSimulation() {
  resizeCanvas();

  if (texA) gl.deleteTexture(texA);
  if (texB) gl.deleteTexture(texB);
  if (fboA) gl.deleteFramebuffer(fboA);
  if (fboB) gl.deleteFramebuffer(fboB);

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

window.addEventListener("resize", () => rebuildSimulation());

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
    updateStats();
    requestAnimationFrame(loop);
  });
}

main().catch(err => {
  console.error(err);
  alert(String(err));
});
