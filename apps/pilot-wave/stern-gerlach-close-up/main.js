const canvas = document.getElementById("c");
if (!navigator.gpu) {
  alert("WebGPU is not available. Use a current Chrome/Edge desktop browser with WebGPU enabled.");
  throw new Error("WebGPU not available.");
}

// Try several adapter hints before failing. Some environments reject
// high-performance but still provide a valid low-power/default adapter.
let adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
if (!adapter) adapter = await navigator.gpu.requestAdapter({ powerPreference: "low-power" });
if (!adapter) adapter = await navigator.gpu.requestAdapter();
if (!adapter) adapter = await navigator.gpu.requestAdapter({ forceFallbackAdapter: true });
if (!adapter) {
  const secure = window.isSecureContext ? "yes" : "no";
  const host = location.host;
  const ua = navigator.userAgent;
  const inFrame = window.top !== window ? "yes" : "no";
  const policy = document.permissionsPolicy || document.featurePolicy;
  let webgpuAllowed = "unknown";
  try {
    if (policy && typeof policy.allowsFeature === "function") {
      webgpuAllowed = policy.allowsFeature("webgpu") ? "yes" : "no";
    }
  } catch {
    webgpuAllowed = "unknown";
  }
  const cause = [
    `No WebGPU adapter found (secureContext=${secure}, host=${host}).`,
    "Likely causes: hardware acceleration disabled, remote desktop/software rendering,",
    "browser policy/flags, or unsupported GPU/driver.",
    `Context: inIframe=${inFrame}, permissionsPolicy.webgpu=${webgpuAllowed}.`,
    `UA: ${ua}`
  ].join(" ");
  alert(cause);
  throw new Error(cause);
}

const requestedLimits = {};
for (const name of ["maxStorageBufferBindingSize", "maxBufferSize"]) {
  const value = adapter.limits?.[name];
  if (Number.isFinite(value) && value > 0) requestedLimits[name] = value;
}
const device = await adapter.requestDevice(
  Object.keys(requestedLimits).length ? { requiredLimits: requestedLimits } : undefined
);
device.lost.then((info) => {
  console.error("WebGPU device lost:", info);
  alert(`WebGPU device lost: ${info.message || info.reason}`);
});

const gpuContext = canvas.getContext("webgpu");
if (!gpuContext) {
  alert("Could not create a WebGPU canvas context.");
  throw new Error("WebGPU canvas context unavailable.");
}

const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
const WAVE_WORKGROUP_SIZE = 256;
const PARTICLE_WORKGROUP_SIZE = 128;
const WAVE_CELL_BYTES = 32;
const DEFAULT_SG_GRADIENT = 4.0;
const TUNNEL_Z_SCALE = 2.0;
const maxWaveBytes = Math.min(device.limits.maxStorageBufferBindingSize, device.limits.maxBufferSize);
const maxWaveCellsByStorage = Math.max(32 ** 3, Math.floor(maxWaveBytes / WAVE_CELL_BYTES));

function zResolutionForBase(baseRes) {
  return Math.max(1, Math.round(baseRes * TUNNEL_Z_SCALE));
}

function voxelCountForBaseResolution(baseRes) {
  return baseRes * baseRes * zResolutionForBase(baseRes);
}

function maxBaseResolutionForCells(maxCells) {
  let baseRes = Math.floor(Math.cbrt(maxCells / TUNNEL_Z_SCALE));
  while (baseRes > 1 && voxelCountForBaseResolution(baseRes) > maxCells) baseRes--;
  return baseRes;
}

const maxResByStorage = maxBaseResolutionForCells(maxWaveCellsByStorage);
const maxResByDispatch = maxBaseResolutionForCells(device.limits.maxComputeWorkgroupsPerDimension * WAVE_WORKGROUP_SIZE);
const rawMaxSimRes = Math.min(256, maxResByStorage, maxResByDispatch);
const MAX_SIM_RES = Math.max(32, Math.floor(rawMaxSimRes / 4) * 4);

const params = {
  simRes: Math.min(128, MAX_SIM_RES),
  stepsPerFrame: 8,
  boxScale: 2.5,
  cameraProjection: 0,

  hbar: 6.0,
  mass: 1.0,
  p0: 5.5,
  dt: 0.01,

  packetX: 0.25,
  packetY: 0.5,
  packetZ: 0.5,
  packetSigma: 10.0,

  nParticles: 500,
  rhoMin: 1e-6,
  velClamp: 80.0,
  spinS: 0.5,
  initialSpin: 1,
  sgGradient: DEFAULT_SG_GRADIENT,
  sgFieldOn: 1,

  cloudGain: .05,
  cloudGamma: 0.7,
  cloudLowBoost: 0.9,
  cloudCutoff: 0.003,
  cloudPointSize: 80.,
  showPhase: 0,
  showCloud: 1,

  showParticles: 1,
  dotSize: 10.0,
  dotSigma: 0.28,
  dotGain: 2.0,

  showTrail: 1,
  trailHalfLife: 0.5,
  trailVisGain: 0.5,
  trailVisGamma: 1,
  trailStampGain: 0.45,
  trailWidth: 15.0,
  trailBlendMode: 2,
  densityScale: 0.5,

  paletteId: 4,
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
  "Pauli spinor"
];

const INITIAL_SPIN_NAMES = [
  "+Z",
  "Up+Down"
];

const SCENE_SCREEN_OFFSET_X = 0.15;

let paused = false;
let redrawPending = true;
const PAUSED_IDLE_MS = 180;

function requestRedraw() {
  redrawPending = true;
}

const controls = document.getElementById("controls");
const statsEl = document.getElementById("stats");
const viewGizmo = document.getElementById("viewGizmo");
const viewButtons = {
  XY: document.getElementById("viewXY"),
  XZ: document.getElementById("viewXZ"),
  YZ: document.getElementById("viewYZ"),
};

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
    requestRedraw();
  });
  input.addEventListener("change", () => {
    if (onChange) onChange();
    requestRedraw();
  });

  row.appendChild(lab);
  row.appendChild(input);
  row.appendChild(val);
  controls.appendChild(row);
}

function addToggleInt(key, label, onChange = null) {
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
    if (onChange) onChange(params[key]);
    requestRedraw();
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
    requestRedraw();
  });

  const val = document.createElement("div");
  val.className = "val";
  val.textContent = "";

  row.appendChild(lab);
  row.appendChild(btn);
  row.appendChild(val);
  controls.appendChild(row);
  return { button: btn, sync };
}

function addSectionHeader(label) {
  const header = document.createElement("div");
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

addSlider("simRes", "sim resolution", 64, MAX_SIM_RES, 4, () => rebuildSimulation());
addSlider("stepsPerFrame", "Steps/frame", 1, 30, 1);
addSlider("dt", "dt", 0.002, 0.02, 0.002);

const cameraProjectionControl = addCycleButton("cameraProjection", "camera view", ["Perspective", "Orthographic"], () => {
  activeOrthoView = null;
  syncCameraUi();
  requestTrailClear();
});

addSectionHeader("Physical Parameters");
addSlider("p0", "momentum p", 0., 6.0, 0.1, () => resetAll());

addSlider("packetSigma", "packet sigma", 4.0, 14.0, 0.5, () => resetAll());
addSlider("spinS", "spin strength", 0.0, 2.0, 0.5);
addCycleButton("initialSpin", "initial spin", INITIAL_SPIN_NAMES, () => resetAll());
addToggleInt("sgFieldOn", "SG z-gradient", () => requestTrailClear());
addSlider("sgGradient", "SG strength", 0.0, 9.9, 0.002, () => requestTrailClear());


addSectionHeader("Visual Parameters");
addToggleInt("showCloud", "density cloud");
addSlider("cloudGain", "cloud density", 0.1, 2.0, 0.1);
addToggleInt("showPhase", "show phase");

addToggleInt("showParticles", "show particles");
addSlider("nParticles", "particle count", 1, 5001, 100, () => rebuildParticles());
addSlider("dotSize", "particle size", 2.0, 26.0, 1);
addSlider("dotGain", "particle brightness", 0.1, 5.0, 0.1);

addToggleInt("showTrail", "draw trails");
addSlider("trailHalfLife", "trail half-life", .1, 10.0, .1);


document.getElementById("reset").onclick = () => resetAll();
const pauseButton = document.getElementById("pause");
function syncPauseButton() {
  pauseButton.textContent = paused ? "Resume" : "Pause";
}
pauseButton.onclick = () => {
  paused = !paused;
  syncPauseButton();
  requestRedraw();
};

window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r") resetAll();
  if (e.key === " ") {
    e.preventDefault();
    paused = !paused;
    syncPauseButton();
    requestRedraw();
  }
  handleCameraKey(e);
});

window.addEventListener("keyup", (e) => {
  handleCameraKeyUp(e);
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

const explainPanel = document.getElementById("explain");
const explainToggle = document.getElementById("explainToggle");
let explainOpen = false;
if (explainPanel && explainToggle) {
  explainToggle.onclick = () => {
    explainOpen = !explainOpen;
    explainPanel.classList.toggle("closed", !explainOpen);
    explainToggle.textContent = explainOpen ? "-" : "+";
    explainToggle.title = explainOpen ? "Close explanation" : "Open explanation";
  };
}

const COLOR_WRITE_RED = 0x1;
const COLOR_WRITE_ALL = 0xf;
const UNIFORM_FLOATS = 80;
const UNIFORM_BYTES = UNIFORM_FLOATS * 4;
const DENSITY_FORMAT = "rgba16float";
const uniformData = new Float32Array(UNIFORM_FLOATS);
const uniformBuffer = device.createBuffer({
  label: "main uniforms",
  size: UNIFORM_BYTES,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
const trailUniformBuffer = device.createBuffer({
  label: "trail uniforms",
  size: UNIFORM_BYTES,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const SHADER_FILES = {
  common: "./shaders/common.wgsl",
  palette: "./shaders/palette.wgsl",
  waveInit: "./shaders/wave-init.wgsl",
  waveStep: "./shaders/wave-step.wgsl",
  particleUpdate: "./shaders/particle-update.wgsl",
  cloud: "./shaders/cloud.wgsl",
  particleRender: "./shaders/particle-render.wgsl",
  density: "./shaders/density.wgsl",
  boxShell: "./shaders/box-shell.wgsl",
  line: "./shaders/line.wgsl",
  fieldLine: "./shaders/field-line.wgsl",
  detectorPlate: "./shaders/detector-plate.wgsl",
};

function applyShaderConstants(source) {
  return source
    .replaceAll("${WAVE_WORKGROUP_SIZE}", String(WAVE_WORKGROUP_SIZE))
    .replaceAll("${PARTICLE_WORKGROUP_SIZE}", String(PARTICLE_WORKGROUP_SIZE));
}

async function fetchShader(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load shader ${path}: ${response.status} ${response.statusText}`);
  return applyShaderConstants(await response.text());
}

async function loadShaders() {
  const entries = await Promise.all(
    Object.entries(SHADER_FILES).map(async ([name, path]) => [name, await fetchShader(path)])
  );
  const parts = Object.fromEntries(entries);
  return {
    waveInit: parts.common + parts.waveInit,
    waveStep: parts.common + parts.waveStep,
    particleUpdate: parts.common + parts.particleUpdate,
    cloud: parts.common + parts.palette + parts.cloud,
    particleRender: parts.common + parts.particleRender,
    density: parts.common + parts.density,
    boxShell: parts.common + parts.boxShell,
    line: parts.common + parts.line,
    fieldLine: parts.common + parts.fieldLine,
    detectorPlate: parts.common + parts.detectorPlate,
  };
}

const SHADERS = await loadShaders();
const WAVE_INIT_WGSL = SHADERS.waveInit;
const WAVE_STEP_WGSL = SHADERS.waveStep;
const PARTICLE_UPDATE_WGSL = SHADERS.particleUpdate;
const CLOUD_WGSL = SHADERS.cloud;
const PARTICLE_RENDER_WGSL = SHADERS.particleRender;
const DENSITY_WGSL = SHADERS.density;
const BOX_SHELL_WGSL = SHADERS.boxShell;
const LINE_WGSL = SHADERS.line;
const FIELD_LINE_WGSL = SHADERS.fieldLine;
const DETECTOR_PLATE_WGSL = SHADERS.detectorPlate;
let pipelineWaveInit, pipelineWaveStep, pipelineParticleUpdate;
let pipelineCloud, pipelineBoxShell, pipelineLine, pipelineFieldLine, pipelineDetectorPlate;
let pipelineParticleRender, pipelineParticleStamp;
let pipelineDensityFade, pipelineDensityRenderAdd, pipelineDensityRenderScreen, pipelineDensityRenderGlow;
let nearestSampler = device.createSampler({ magFilter: "nearest", minFilter: "nearest" });

let simW = 0, simH = 0, simD = 0;
let voxelCount = 0;
let waveBufferA = null, waveBufferB = null, flip = 0;
let simTime = 0;

let particleSrc = null, particleDst = null, particleFlip = 0;
let boxBuffer = null, boxVertexCount = 0;
let boxShellBuffer = null, boxShellVertexCount = 0;
let fieldLineBuffer = null, fieldLineVertexCount = 0;

let densW = 0, densH = 0;
let densTexA = null, densTexB = null, densViewA = null, densViewB = null, densFlip = 0;
let trailClearPending = false;

let waveInitBindGroups = [];
let waveStepBindGroups = [];
let cloudBindGroups = [];
let particleUpdateBindGroups = [];
let particleRenderBindGroups = [];
let particleStampBindGroups = [];
let densityFadeBindGroups = [];
let densityRenderBindGroups = [];
let boxShellBindGroup = null;
let lineBindGroup = null;
let fieldLineBindGroup = null;
let detectorPlateBindGroup = null;

function shaderModule(label, code) {
  return device.createShaderModule({ label, code });
}

function bindGroup(pipeline, entries) {
  return device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries,
  });
}

function configureCanvas() {
  gpuContext.configure({
    device,
    format: presentationFormat,
    alphaMode: "opaque",
  });
}

function resizeCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    configureCanvas();
    return true;
  }
  return false;
}

function destroyGpuResource(resource) {
  if (resource && typeof resource.destroy === "function") resource.destroy();
}

function deleteWaveTargets() {
  destroyGpuResource(waveBufferA);
  destroyGpuResource(waveBufferB);
  waveBufferA = waveBufferB = null;
  waveInitBindGroups = [];
  waveStepBindGroups = [];
  cloudBindGroups = [];
  particleUpdateBindGroups = [];
}

function deleteDensityTargets() {
  destroyGpuResource(densTexA);
  destroyGpuResource(densTexB);
  densTexA = densTexB = densViewA = densViewB = null;
  densityFadeBindGroups = [];
  densityRenderBindGroups = [];
}

function blendState(srcFactor, dstFactor) {
  return {
    color: { srcFactor, dstFactor, operation: "add" },
    alpha: { srcFactor, dstFactor, operation: "add" },
  };
}

function buildPipelines() {
  const waveInitModule = shaderModule("wave init", WAVE_INIT_WGSL);
  const waveStepModule = shaderModule("wave step", WAVE_STEP_WGSL);
  const particleUpdateModule = shaderModule("particle update", PARTICLE_UPDATE_WGSL);
  const cloudModule = shaderModule("cloud render", CLOUD_WGSL);
  const particleModule = shaderModule("particle render", PARTICLE_RENDER_WGSL);
  const densityModule = shaderModule("density", DENSITY_WGSL);
  const boxShellModule = shaderModule("box shell", BOX_SHELL_WGSL);
  const lineModule = shaderModule("line", LINE_WGSL);
  const fieldLineModule = shaderModule("SG field lines", FIELD_LINE_WGSL);
  const detectorPlateModule = shaderModule("detector plate", DETECTOR_PLATE_WGSL);

  pipelineWaveInit = device.createComputePipeline({
    label: "wave init pipeline",
    layout: "auto",
    compute: { module: waveInitModule, entryPoint: "main" },
  });
  pipelineWaveStep = device.createComputePipeline({
    label: "wave step pipeline",
    layout: "auto",
    compute: { module: waveStepModule, entryPoint: "main" },
  });
  pipelineParticleUpdate = device.createComputePipeline({
    label: "particle update pipeline",
    layout: "auto",
    compute: { module: particleUpdateModule, entryPoint: "main" },
  });

  pipelineCloud = device.createRenderPipeline({
    label: "cloud render pipeline",
    layout: "auto",
    vertex: { module: cloudModule, entryPoint: "vs" },
    fragment: {
      module: cloudModule,
      entryPoint: "fs",
      targets: [{ format: presentationFormat, blend: blendState("one", "one"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "triangle-list" },
  });

  pipelineParticleRender = device.createRenderPipeline({
    label: "particle render pipeline",
    layout: "auto",
    vertex: { module: particleModule, entryPoint: "vsRender" },
    fragment: {
      module: particleModule,
      entryPoint: "fsRender",
      targets: [{ format: presentationFormat, blend: blendState("src-alpha", "one"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "triangle-list" },
  });

  pipelineParticleStamp = device.createRenderPipeline({
    label: "particle trail stamp pipeline",
    layout: "auto",
    vertex: { module: particleModule, entryPoint: "vsStamp" },
    fragment: {
      module: particleModule,
      entryPoint: "fsStamp",
      targets: [{ format: DENSITY_FORMAT, blend: blendState("src-alpha", "one"), writeMask: COLOR_WRITE_RED }],
    },
    primitive: { topology: "triangle-list" },
  });

  pipelineDensityFade = device.createRenderPipeline({
    label: "density fade pipeline",
    layout: "auto",
    vertex: { module: densityModule, entryPoint: "vsFull" },
    fragment: { module: densityModule, entryPoint: "fsFade", targets: [{ format: DENSITY_FORMAT }] },
    primitive: { topology: "triangle-list" },
  });

  pipelineDensityRenderAdd = device.createRenderPipeline({
    label: "density render additive pipeline",
    layout: "auto",
    vertex: { module: densityModule, entryPoint: "vsFull" },
    fragment: {
      module: densityModule,
      entryPoint: "fsRender",
      targets: [{ format: presentationFormat, blend: blendState("src-alpha", "one"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "triangle-list" },
  });
  pipelineDensityRenderScreen = device.createRenderPipeline({
    label: "density render screen pipeline",
    layout: "auto",
    vertex: { module: densityModule, entryPoint: "vsFull" },
    fragment: {
      module: densityModule,
      entryPoint: "fsRender",
      targets: [{
        format: presentationFormat,
        blend: {
          color: { srcFactor: "src-alpha", dstFactor: "one-minus-src", operation: "add" },
          alpha: { srcFactor: "one", dstFactor: "one", operation: "add" },
        },
        writeMask: COLOR_WRITE_ALL,
      }],
    },
    primitive: { topology: "triangle-list" },
  });
  pipelineDensityRenderGlow = device.createRenderPipeline({
    label: "density render glow pipeline",
    layout: "auto",
    vertex: { module: densityModule, entryPoint: "vsFull" },
    fragment: {
      module: densityModule,
      entryPoint: "fsRender",
      targets: [{ format: presentationFormat, blend: blendState("one", "one"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "triangle-list" },
  });

  pipelineBoxShell = device.createRenderPipeline({
    label: "box shell pipeline",
    layout: "auto",
    vertex: {
      module: boxShellModule,
      entryPoint: "vs",
      buffers: [{
        arrayStride: 36,
        attributes: [
          { shaderLocation: 0, offset: 0, format: "float32x3" },
          { shaderLocation: 1, offset: 12, format: "float32x3" },
          { shaderLocation: 2, offset: 24, format: "float32x2" },
          { shaderLocation: 3, offset: 32, format: "float32" },
        ],
      }],
    },
    fragment: {
      module: boxShellModule,
      entryPoint: "fs",
      targets: [{ format: presentationFormat, blend: blendState("src-alpha", "one-minus-src-alpha"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "triangle-list" },
  });

  pipelineLine = device.createRenderPipeline({
    label: "box line pipeline",
    layout: "auto",
    vertex: {
      module: lineModule,
      entryPoint: "vs",
      buffers: [{
        arrayStride: 16,
        attributes: [
          { shaderLocation: 0, offset: 0, format: "float32x3" },
          { shaderLocation: 1, offset: 12, format: "float32" },
        ],
      }],
    },
    fragment: {
      module: lineModule,
      entryPoint: "fs",
      targets: [{ format: presentationFormat, blend: blendState("src-alpha", "one-minus-src-alpha"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "line-list" },
  });

  pipelineFieldLine = device.createRenderPipeline({
    label: "SG field line pipeline",
    layout: "auto",
    vertex: {
      module: fieldLineModule,
      entryPoint: "vs",
      buffers: [{
        arrayStride: 36,
        attributes: [
          { shaderLocation: 0, offset: 0, format: "float32x3" },
          { shaderLocation: 1, offset: 12, format: "float32x3" },
          { shaderLocation: 2, offset: 24, format: "float32" },
          { shaderLocation: 3, offset: 28, format: "float32" },
          { shaderLocation: 4, offset: 32, format: "float32" },
        ],
      }],
    },
    fragment: {
      module: fieldLineModule,
      entryPoint: "fs",
      targets: [{ format: presentationFormat, blend: blendState("src-alpha", "one-minus-src-alpha"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "triangle-list" },
  });

  pipelineDetectorPlate = device.createRenderPipeline({
    label: "detector plate pipeline",
    layout: "auto",
    vertex: { module: detectorPlateModule, entryPoint: "vs" },
    fragment: {
      module: detectorPlateModule,
      entryPoint: "fs",
      targets: [{ format: presentationFormat, blend: blendState("src-alpha", "one-minus-src-alpha"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "triangle-list" },
  });

  boxShellBindGroup = bindGroup(pipelineBoxShell, [{ binding: 0, resource: { buffer: uniformBuffer } }]);
  lineBindGroup = bindGroup(pipelineLine, [{ binding: 0, resource: { buffer: uniformBuffer } }]);
  fieldLineBindGroup = bindGroup(pipelineFieldLine, [{ binding: 0, resource: { buffer: uniformBuffer } }]);
  detectorPlateBindGroup = bindGroup(pipelineDetectorPlate, [{ binding: 0, resource: { buffer: uniformBuffer } }]);
}

function makeBuffer(label, data, usage) {
  const buffer = device.createBuffer({
    label,
    size: Math.max(4, (data.byteLength + 3) & ~3),
    usage: usage | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
}

function makeStorageBuffer(label, byteSize) {
  return device.createBuffer({
    label,
    size: Math.max(4, (byteSize + 3) & ~3),
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}

function makeDensityTexture(label, w, h) {
  return device.createTexture({
    label,
    size: [w, h],
    format: DENSITY_FORMAT,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });
}

function rebuildWaveBindGroups() {
  if (!waveBufferA || !waveBufferB) return;
  waveInitBindGroups = [
    bindGroup(pipelineWaveInit, [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBufferA } },
    ]),
    bindGroup(pipelineWaveInit, [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBufferB } },
    ]),
  ];
  waveStepBindGroups = [
    bindGroup(pipelineWaveStep, [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBufferA } },
      { binding: 2, resource: { buffer: waveBufferB } },
    ]),
    bindGroup(pipelineWaveStep, [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBufferB } },
      { binding: 2, resource: { buffer: waveBufferA } },
    ]),
  ];
  cloudBindGroups = [
    bindGroup(pipelineCloud, [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBufferA } },
    ]),
    bindGroup(pipelineCloud, [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBufferB } },
    ]),
  ];
  rebuildParticleBindGroups();
}

function rebuildParticleBindGroups() {
  if (!waveBufferA || !waveBufferB || !particleSrc || !particleDst) return;
  const waves = [waveBufferA, waveBufferB];
  const particles = [particleSrc, particleDst];
  particleUpdateBindGroups = waves.map((waveBuffer) => particles.map((src, srcIndex) => bindGroup(pipelineParticleUpdate, [
    { binding: 0, resource: { buffer: uniformBuffer } },
    { binding: 1, resource: { buffer: waveBuffer } },
    { binding: 2, resource: { buffer: src } },
    { binding: 3, resource: { buffer: particles[1 - srcIndex] } },
  ])));
  particleRenderBindGroups = particles.map((buffer) => bindGroup(pipelineParticleRender, [
    { binding: 0, resource: { buffer: uniformBuffer } },
    { binding: 1, resource: { buffer } },
  ]));
  particleStampBindGroups = particles.map((buffer) => bindGroup(pipelineParticleStamp, [
    { binding: 0, resource: { buffer: trailUniformBuffer } },
    { binding: 1, resource: { buffer } },
  ]));
}

function rebuildDensityBindGroups() {
  if (!densViewA || !densViewB) return;
  const views = [densViewA, densViewB];
  densityFadeBindGroups = views.map((view) => bindGroup(pipelineDensityFade, [
    { binding: 0, resource: { buffer: trailUniformBuffer } },
    { binding: 1, resource: view },
    { binding: 2, resource: nearestSampler },
  ]));
  const renderPipelines = [pipelineDensityRenderAdd, pipelineDensityRenderScreen, pipelineDensityRenderGlow];
  densityRenderBindGroups = renderPipelines.map((pipeline) => views.map((view) => bindGroup(pipeline, [
    { binding: 0, resource: { buffer: uniformBuffer } },
    { binding: 1, resource: view },
    { binding: 2, resource: nearestSampler },
  ])));
}

function dispatchCount(count, groupSize) {
  return Math.ceil(count / groupSize);
}

function writeUniforms(buffer, camera, viewportW, viewportH, densityFade = 1.0, densitySizeScale = 1.0) {
  uniformData.fill(0);
  uniformData.set([simW, simH, simD, voxelCount], 0);
  uniformData.set([params.hbar, params.mass, params.p0, params.dt], 4);
  uniformData.set([params.packetX, params.packetY, params.packetZ, params.packetSigma], 8);
  uniformData.set([params.cloudGain, params.cloudGamma, params.cloudLowBoost, params.cloudCutoff], 12);
  uniformData.set([params.cloudPointSize, params.showPhase, params.paletteId | 0, params.boxScale], 16);
  uniformData.set([params.dotSize, params.dotSigma, params.dotGain, params.spinS], 20);
  uniformData.set([params.rhoMin, params.velClamp, Math.floor(params.nParticles), params.trailWidth], 24);
  uniformData.set([camera.eye[0], camera.eye[1], camera.eye[2], camera.distance], 28);
  uniformData.set([viewportW, viewportH, params.cameraProjection | 0, params.trailStampGain], 32);
  uniformData.set([detectorPlateXGrid(), 1.0, 0.0, 0.0], 36);
  uniformData.set([0.0, 0.0, 0.0, params.trailVisGain], 40);
  uniformData.set([params.trailVisGamma, params.trailBlendMode | 0, densityFade, densitySizeScale], 44);
  const sgTint = params.sgFieldOn && params.sgGradient > 0 ? 1 : 0;
  uniformData.set(sgTint ? [0.82, 0.34, 0.28, 0.30] : [0.38, 0.72, 0.68, 0.22], 48);
  const boxCenter = boxCenterWorld();
  uniformData.set([boxCenter[0], boxCenter[1], boxCenter[2], 0.0], 52);
  const sgStrength = params.sgFieldOn ? params.sgGradient : 0.0;
  uniformData.set([sgStrength, params.sgFieldOn ? 1.0 : 0.0, params.initialSpin | 0, 0.0], 56);
  uniformData.set([visualPacketCenterX(), 0.0, 0.0, 0.0], 60);
  uniformData.set(camera.viewProj, 64);
  device.queue.writeBuffer(buffer, 0, uniformData);
}

function effectivePeriodicP0() {
  if (simW <= 1 || params.hbar <= 0) return params.p0;
  const period = simW - 1;
  const mode = Math.round((params.p0 / params.hbar) * period / (2 * Math.PI));
  return params.hbar * mode * 2 * Math.PI / period;
}

function visualPacketCenterX() {
  if (simW <= 1) return 0;
  const x0 = params.packetX * (simW - 1);
  return x0 + (effectivePeriodicP0() / Math.max(1e-6, params.mass)) * simTime;
}

function detectorPlateXGrid() {
  return 2.0 * Math.max(1, simW - 1);
}

function worldFromGrid(p) {
  return [
    p[0] * params.boxScale,
    p[1] * params.boxScale,
    p[2] * params.boxScale,
  ];
}

function vec3Sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function vec3Dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function vec3Cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function vec3Normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function mat4Perspective(fovyRad, aspect, near, far) {
  const f = 1 / Math.tan(fovyRad * 0.5);
  const nf = 1 / (near - far);
  const out = new Float32Array(16);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = far * nf;
  out[11] = -1;
  out[14] = far * near * nf;
  return out;
}

function mat4Orthographic(left, right, bottom, top, near, far) {
  const out = new Float32Array(16);
  out[0] = 2 / (right - left);
  out[5] = 2 / (top - bottom);
  out[10] = -1 / (far - near);
  out[12] = -(right + left) / (right - left);
  out[13] = -(top + bottom) / (top - bottom);
  out[14] = -near / (far - near);
  out[15] = 1;
  return out;
}

function mat4LookAt(eye, center, up) {
  const z = vec3Normalize(vec3Sub(eye, center));
  const x = vec3Normalize(vec3Cross(up, z));
  const y = vec3Cross(z, x);
  const out = new Float32Array(16);

  out[0] = x[0]; out[1] = y[0]; out[2] = z[0]; out[3] = 0;
  out[4] = x[1]; out[5] = y[1]; out[6] = z[1]; out[7] = 0;
  out[8] = x[2]; out[9] = y[2]; out[10] = z[2]; out[11] = 0;
  out[12] = -vec3Dot(x, eye);
  out[13] = -vec3Dot(y, eye);
  out[14] = -vec3Dot(z, eye);
  out[15] = 1;
  return out;
}

function mat4Mul(a, b) {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] =
        a[0 * 4 + row] * b[col * 4 + 0] +
        a[1 * 4 + row] * b[col * 4 + 1] +
        a[2 * 4 + row] * b[col * 4 + 2] +
        a[3 * 4 + row] * b[col * 4 + 3];
    }
  }
  return out;
}

function mat4ClipOffset(x, y) {
  const out = new Float32Array(16);
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[12] = x;
  out[13] = y;
  out[15] = 1;
  return out;
}

function boxCenterWorld() {
  return worldFromGrid([
    0.5 * (simW - 1),
    0.5 * (simH - 1),
    0.5 * (simD - 1),
  ]);
}

function cameraLookAtWorld() {
  return worldFromGrid([
    simW - 1,
    0.5 * (simH - 1),
    0.5 * (simD - 1),
  ]);
}

const cameraOrbit = {
  yaw: -2.22,
  pitch: 0.43,
  distance: 1,
};
const KEYBOARD_YAW_CENTER = -Math.PI * 0.5;
const KEYBOARD_YAW_LIMIT = Math.PI * 0.5;
const KEYBOARD_ORBIT_SPEED = .6;
const KEYBOARD_ZOOM_SPEED = .5;
const cameraTarget = {
  yaw: cameraOrbit.yaw,
  pitch: cameraOrbit.pitch,
  distance: cameraOrbit.distance,
};
const CAMERA_EASE = 0.1;
const ORTHO_VIEWS = {
  XY: { yaw: -Math.PI * 0.5, pitch: Math.PI * 0.5 },
  XZ: { yaw: -Math.PI * 0.5, pitch: 0 },
  YZ: { yaw: 0, pitch: 0 },
};

let activeOrthoView = null;

let orbitPointer = null;
let orbitLastX = 0;
let orbitLastY = 0;
const pressedCameraKeys = new Set();

function requestTrailClear() {
  trailClearPending = true;
  requestRedraw();
}

function clampCameraPitch(pitch) {
  const halfPi = Math.PI * 0.5;
  return Math.max(-halfPi, Math.min(halfPi, pitch));
}

function cameraDistanceBounds() {
  const n = Math.max(simW, simH, simD) * params.boxScale;
  return {
    n,
    min: 0.325 * n,
    max: 5.0 * n,
  };
}

function clampCameraDistance(distance) {
  const bounds = cameraDistanceBounds();
  if (!Number.isFinite(distance) || distance <= 1) return 2.15 * bounds.n;
  return Math.max(bounds.min, Math.min(bounds.max, distance));
}

function syncCameraUi() {
  cameraProjectionControl.sync();
  for (const [key, btn] of Object.entries(viewButtons)) {
    if (!btn) continue;
    btn.classList.toggle("selected", params.cameraProjection === 1 && activeOrthoView === key);
  }
}

function setCameraProjection(mode) {
  const nextMode = mode ? 1 : 0;
  if (params.cameraProjection !== nextMode) {
    params.cameraProjection = nextMode;
    requestTrailClear();
  }
  if (nextMode === 0) activeOrthoView = null;
  syncCameraUi();
}

function selectOrthoView(key) {
  const view = ORTHO_VIEWS[key];
  if (!view) return;
  activeOrthoView = key;
  setCameraProjection(1);
  cameraTarget.yaw = view.yaw;
  cameraTarget.pitch = view.pitch;
  requestTrailClear();
  syncCameraUi();
}

function disableOrthoModeFromOrbit() {
  if (activeOrthoView === null) return;
  activeOrthoView = null;
  setCameraProjection(0);
}

function syncCameraTargetToCurrent() {
  cameraTarget.yaw = cameraOrbit.yaw;
  cameraTarget.pitch = cameraOrbit.pitch;
  cameraTarget.distance = cameraOrbit.distance;
}

function shortestAngleDelta(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function updateCameraEasing() {
  const prevYaw = cameraOrbit.yaw;
  const prevPitch = cameraOrbit.pitch;
  const prevDistance = cameraOrbit.distance;
  const targetDistance = clampCameraDistance(cameraTarget.distance);
  cameraTarget.distance = targetDistance;

  cameraOrbit.yaw += shortestAngleDelta(cameraOrbit.yaw, cameraTarget.yaw) * CAMERA_EASE;
  cameraOrbit.pitch += (cameraTarget.pitch - cameraOrbit.pitch) * CAMERA_EASE;
  cameraOrbit.distance += (targetDistance - cameraOrbit.distance) * CAMERA_EASE;

  if (Math.abs(shortestAngleDelta(cameraOrbit.yaw, cameraTarget.yaw)) < 1e-5) cameraOrbit.yaw = cameraTarget.yaw;
  if (Math.abs(cameraOrbit.pitch - cameraTarget.pitch) < 1e-5) cameraOrbit.pitch = cameraTarget.pitch;
  if (Math.abs(cameraOrbit.distance - targetDistance) < 1e-3) cameraOrbit.distance = targetDistance;

  return Math.abs(shortestAngleDelta(prevYaw, cameraOrbit.yaw)) > 1e-7 ||
    Math.abs(prevPitch - cameraOrbit.pitch) > 1e-7 ||
    Math.abs(prevDistance - cameraOrbit.distance) > 1e-5;
}

function clampKeyboardYaw(yaw) {
  const delta = shortestAngleDelta(KEYBOARD_YAW_CENTER, yaw);
  return KEYBOARD_YAW_CENTER + Math.max(-KEYBOARD_YAW_LIMIT, Math.min(KEYBOARD_YAW_LIMIT, delta));
}

function applyCameraOrbitRadians(yawDelta, pitchDelta, limitYaw = false) {
  if (yawDelta === 0 && pitchDelta === 0) return;
  disableOrthoModeFromOrbit();
  const prevYaw = cameraTarget.yaw;
  const prevPitch = cameraTarget.pitch;
  cameraTarget.yaw += yawDelta;
  if (limitYaw) cameraTarget.yaw = clampKeyboardYaw(cameraTarget.yaw);
  cameraTarget.pitch = clampCameraPitch(cameraTarget.pitch + pitchDelta);
  if (cameraTarget.yaw !== prevYaw || cameraTarget.pitch !== prevPitch) requestTrailClear();
}

function applyCameraOrbitDelta(dx, dy) {
  applyCameraOrbitRadians(-dx * 0.006, dy * 0.006);
}

function applyCameraZoomDelta(deltaY) {
  const zoom = Math.exp(deltaY * 0.001);
  const prevDistance = cameraTarget.distance;
  cameraTarget.distance = clampCameraDistance(cameraTarget.distance * zoom);
  if (cameraTarget.distance !== prevDistance) requestTrailClear();
}

function isTextEntryTarget(target) {
  return target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable;
}

function handleCameraKey(e) {
  if (isTextEntryTarget(e.target) || e.altKey || e.ctrlKey || e.metaKey) return;

  switch (e.code) {
    case "KeyW":
    case "KeyS":
    case "KeyA":
    case "KeyD":
    case "KeyQ":
    case "KeyE":
      break;
    default:
      return;
  }

  e.preventDefault();
  if (!pressedCameraKeys.size) syncCameraTargetToCurrent();
  pressedCameraKeys.add(e.code);
  requestRedraw();
}

function handleCameraKeyUp(e) {
  if (!pressedCameraKeys.delete(e.code)) return;
  e.preventDefault();
  requestRedraw();
}

function hasActiveCameraKeys() {
  return pressedCameraKeys.size > 0;
}

function updateCameraKeyMotion(dtSeconds) {
  if (!hasActiveCameraKeys() || dtSeconds <= 0) return false;

  const horizontal = -(pressedCameraKeys.has("KeyA") ? 1 : 0) +(pressedCameraKeys.has("KeyD") ? 1 : 0);
  const vertical = -(pressedCameraKeys.has("KeyS") ? 1 : 0) + (pressedCameraKeys.has("KeyW") ? 1 : 0);
  const zoom = -(pressedCameraKeys.has("KeyE") ? 1 : 0) + (pressedCameraKeys.has("KeyQ") ? 1 : 0);

  applyCameraOrbitRadians(
    horizontal * KEYBOARD_ORBIT_SPEED * dtSeconds,
    vertical * KEYBOARD_ORBIT_SPEED * dtSeconds,
    horizontal !== 0
  );
  if (zoom !== 0) applyCameraZoomDelta(zoom * KEYBOARD_ZOOM_SPEED * 1000 * dtSeconds);
  requestRedraw();
  return horizontal !== 0 || vertical !== 0 || zoom !== 0;
}

for (const [key, btn] of Object.entries(viewButtons)) {
  if (btn) btn.addEventListener("click", () => selectOrthoView(key));
}
syncCameraUi();

canvas.addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  orbitPointer = e.pointerId;
  orbitLastX = e.clientX;
  orbitLastY = e.clientY;
  syncCameraTargetToCurrent();
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener("pointermove", (e) => {
  if (orbitPointer !== e.pointerId) return;
  const dx = e.clientX - orbitLastX;
  const dy = e.clientY - orbitLastY;
  orbitLastX = e.clientX;
  orbitLastY = e.clientY;
  applyCameraOrbitDelta(dx, dy);
});

canvas.addEventListener("pointerup", (e) => {
  if (orbitPointer !== e.pointerId) return;
  canvas.releasePointerCapture(e.pointerId);
  orbitPointer = null;
});

canvas.addEventListener("pointercancel", (e) => {
  if (orbitPointer !== e.pointerId) return;
  canvas.releasePointerCapture(e.pointerId);
  orbitPointer = null;
});

canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  applyCameraZoomDelta(e.deltaY);
}, { passive: false });

function cameraFrame() {
  const target = cameraLookAtWorld();
  const n = Math.max(simW, simH, simD) * params.boxScale;
  cameraOrbit.distance = clampCameraDistance(cameraOrbit.distance);
  cameraTarget.distance = clampCameraDistance(cameraTarget.distance);

  const cp = Math.cos(cameraOrbit.pitch);
  const eye = [
    target[0] + cameraOrbit.distance * cp * Math.cos(cameraOrbit.yaw),
    target[1] + cameraOrbit.distance * cp * Math.sin(cameraOrbit.yaw),
    target[2] + cameraOrbit.distance * Math.sin(cameraOrbit.pitch),
  ];
  const sp = Math.sin(cameraOrbit.pitch);
  const up = [
    -sp * Math.cos(cameraOrbit.yaw),
    -sp * Math.sin(cameraOrbit.yaw),
    cp,
  ];
  const aspect = Math.max(1e-3, canvas.width / Math.max(1, canvas.height));
  const view = mat4LookAt(eye, target, up);
  const fovy = 40 * Math.PI / 180;
  let proj;
  if ((params.cameraProjection | 0) === 1) {
    const halfH = Math.tan(fovy * 0.5) * cameraOrbit.distance;
    const halfW = halfH * aspect;
    proj = mat4Orthographic(-halfW, halfW, -halfH, halfH, 0.04 * n, 8.0 * n);
  } else {
    proj = mat4Perspective(fovy, aspect, 0.04 * n, 8.0 * n);
  }
  const viewProj = mat4Mul(mat4ClipOffset(SCENE_SCREEN_OFFSET_X, 0), mat4Mul(proj, view));
  return {
    viewProj,
    eye,
    distance: cameraOrbit.distance,
  };
}

function cameraBasis() {
  const cp = Math.cos(cameraOrbit.pitch);
  const sp = Math.sin(cameraOrbit.pitch);
  const back = vec3Normalize([
    cp * Math.cos(cameraOrbit.yaw),
    cp * Math.sin(cameraOrbit.yaw),
    sp,
  ]);
  const upHint = [
    -sp * Math.cos(cameraOrbit.yaw),
    -sp * Math.sin(cameraOrbit.yaw),
    cp,
  ];
  const right = vec3Normalize(vec3Cross(upHint, back));
  const up = vec3Cross(back, right);
  return { right, up, back };
}

function drawViewGizmo() {
  if (!viewGizmo) return;

  const rect = viewGizmo.getBoundingClientRect();
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = Math.max(1, Math.floor(rect.width * dpr));
  const h = Math.max(1, Math.floor(rect.height * dpr));
  if (viewGizmo.width !== w || viewGizmo.height !== h) {
    viewGizmo.width = w;
    viewGizmo.height = h;
  }

  const ctx = viewGizmo.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const basis = cameraBasis();
  const origin = [rect.width * 0.46, rect.height * 0.58];
  const len = Math.min(rect.width, rect.height) * 0.33;
  const axes = [
    { label: "X", color: "#ff5b5b", dir: [1, 0, 0] },
    { label: "Y", color: "#58d26f", dir: [0, 1, 0] },
    { label: "Z", color: "#58a6ff", dir: [0, 0, 1] },
  ].map((axis) => {
    const sx = vec3Dot(axis.dir, basis.right);
    const sy = vec3Dot(axis.dir, basis.up);
    const depth = vec3Dot(axis.dir, basis.back);
    return { ...axis, x: sx * len, y: -sy * len, depth };
  }).sort((a, b) => a.depth - b.depth);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.beginPath();
  ctx.arc(origin[0], origin[1], 2.4, 0, Math.PI * 2);
  ctx.fill();

  for (const axis of axes) {
    const x0 = origin[0];
    const y0 = origin[1];
    const x1 = x0 + axis.x;
    const y1 = y0 + axis.y;
    const angle = Math.atan2(axis.y, axis.x);
    const alpha = 0.62 + 0.38 * ((axis.depth + 1) * 0.5);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = axis.color;
    ctx.fillStyle = axis.color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - Math.cos(angle - 0.55) * 7, y1 - Math.sin(angle - 0.55) * 7);
    ctx.lineTo(x1 - Math.cos(angle + 0.55) * 7, y1 - Math.sin(angle + 0.55) * 7);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.font = "700 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(axis.label, x1 + Math.cos(angle) * 9, y1 + Math.sin(angle) * 9);
  }
}

function resetWave() {
  if (!waveBufferA || !waveBufferB) return;
  simTime = 0;
  writeUniforms(uniformBuffer, cameraFrame(), canvas.width, canvas.height);
  const encoder = device.createCommandEncoder({ label: "reset wave encoder" });
  const pass = encoder.beginComputePass({ label: "reset wave pass" });
  pass.setPipeline(pipelineWaveInit);
  pass.setBindGroup(0, waveInitBindGroups[0]);
  pass.dispatchWorkgroups(dispatchCount(voxelCount, WAVE_WORKGROUP_SIZE));
  pass.setBindGroup(0, waveInitBindGroups[1]);
  pass.dispatchWorkgroups(dispatchCount(voxelCount, WAVE_WORKGROUP_SIZE));
  pass.end();
  device.queue.submit([encoder.finish()]);
  flip = 0;
}

function waveStep(pass) {
  pass.setPipeline(pipelineWaveStep);
  pass.setBindGroup(0, waveStepBindGroups[flip]);
  pass.dispatchWorkgroups(dispatchCount(voxelCount, WAVE_WORKGROUP_SIZE));
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

  destroyGpuResource(particleSrc);
  destroyGpuResource(particleDst);

  const data = new Float32Array(n * 4);

  const sigma1D = params.packetSigma / Math.sqrt(2);
  const x0 = params.packetX * (simW - 1);
  const y0 = params.packetY * (simH - 1);
  const z0 = params.packetZ * (simD - 1);

  for (let i = 0; i < n; i++) {
    let x = x0 + randn() * sigma1D;
    let y = y0 + randn() * sigma1D;
    let z = z0 + randn() * sigma1D;
    x = Math.max(0, Math.min(simW - 1, x));
    y = Math.max(0, Math.min(simH - 1, y));
    z = Math.max(0, Math.min(simD - 1, z));
    data[i * 4 + 0] = x;
    data[i * 4 + 1] = y;
    data[i * 4 + 2] = z;
    data[i * 4 + 3] = x;
  }

  particleSrc = makeBuffer("particle src", data, GPUBufferUsage.STORAGE);
  particleDst = makeStorageBuffer("particle dst", data.byteLength);
  particleFlip = 0;
  rebuildParticleBindGroups();
}

function particleUpdate(pass) {
  const n = Math.floor(params.nParticles);
  if (n <= 0) return;
  pass.setPipeline(pipelineParticleUpdate);
  pass.setBindGroup(0, particleUpdateBindGroups[flip][particleFlip]);
  pass.dispatchWorkgroups(dispatchCount(n, PARTICLE_WORKGROUP_SIZE));
  particleFlip = 1 - particleFlip;
}

const LN2 = Math.log(2);
function fadeFromHalfLife(halfLife, dtTotal) {
  if (halfLife <= 0) return 0.0;
  return Math.exp(-LN2 * (dtTotal / halfLife));
}

function rebuildDensity() {
  deleteDensityTargets();

  densW = Math.max(64, Math.floor(canvas.width * params.densityScale));
  densH = Math.max(64, Math.floor(canvas.height * params.densityScale));

  densTexA = makeDensityTexture("trail density A", densW, densH);
  densTexB = makeDensityTexture("trail density B", densW, densH);
  densViewA = densTexA.createView();
  densViewB = densTexB.createView();
  densFlip = 0;
  rebuildDensityBindGroups();

  clearDensity();
}

function clearDensity() {
  if (!densViewA || !densViewB) {
    trailClearPending = false;
    return;
  }

  const encoder = device.createCommandEncoder({ label: "clear trail density encoder" });
  for (const view of [densViewA, densViewB]) {
    const pass = encoder.beginRenderPass({
      label: "clear trail density pass",
      colorAttachments: [{
        view,
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        loadOp: "clear",
        storeOp: "store",
      }],
    });
    pass.end();
  }
  device.queue.submit([encoder.finish()]);
  densFlip = 0;
  trailClearPending = false;
}

function densityStepAndStamp(encoder, camera) {
  if (!densViewA || !densViewB) return;
  const dtTotal = params.dt * Math.floor(params.stepsPerFrame);
  const sizeScale = densW / Math.max(1, canvas.width);
  const fade = fadeFromHalfLife(params.trailHalfLife, dtTotal);
  writeUniforms(trailUniformBuffer, camera, densW, densH, fade, sizeScale);
  const dstView = densFlip ? densViewA : densViewB;
  const pass = encoder.beginRenderPass({
    label: "trail fade and stamp pass",
    colorAttachments: [{
      view: dstView,
      clearValue: { r: 0, g: 0, b: 0, a: 0 },
      loadOp: "clear",
      storeOp: "store",
    }],
  });
  pass.setPipeline(pipelineDensityFade);
  pass.setBindGroup(0, densityFadeBindGroups[densFlip]);
  pass.draw(3);
  pass.setPipeline(pipelineParticleStamp);
  pass.setBindGroup(0, particleStampBindGroups[particleFlip]);
  pass.draw(6, Math.floor(params.nParticles));
  pass.end();
  densFlip = 1 - densFlip;
}

function render(encoder, camera) {
  const currentTexture = gpuContext.getCurrentTexture();
  const pass = encoder.beginRenderPass({
    label: "main render pass",
    colorAttachments: [{
      view: currentTexture.createView(),
      clearValue: { r: 0.005, g: 0.008, b: 0.012, a: 1 },
      loadOp: "clear",
      storeOp: "store",
    }],
  });

  if (params.showCloud) {
    pass.setPipeline(pipelineCloud);
    pass.setBindGroup(0, cloudBindGroups[flip]);
    pass.draw(6, voxelCount);
  }

  if (params.showTrail && densityRenderBindGroups.length) {
    const mode = Math.max(0, Math.min(2, params.trailBlendMode | 0));
    const pipeline = mode === 0 ? pipelineDensityRenderAdd : (mode === 1 ? pipelineDensityRenderScreen : pipelineDensityRenderGlow);
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, densityRenderBindGroups[mode][densFlip]);
    pass.draw(3);
  }

  if (boxShellBuffer && boxShellVertexCount > 0) {
    pass.setPipeline(pipelineBoxShell);
    pass.setBindGroup(0, boxShellBindGroup);
    pass.setVertexBuffer(0, boxShellBuffer);
    pass.draw(boxShellVertexCount);
  }

  if (boxBuffer && boxVertexCount > 0) {
    pass.setPipeline(pipelineLine);
    pass.setBindGroup(0, lineBindGroup);
    pass.setVertexBuffer(0, boxBuffer);
    pass.draw(boxVertexCount);
  }

  pass.setPipeline(pipelineDetectorPlate);
  pass.setBindGroup(0, detectorPlateBindGroup);
  pass.draw(6);

  if (params.sgFieldOn && params.sgGradient > 0 && fieldLineBuffer && fieldLineVertexCount > 0) {
    pass.setPipeline(pipelineFieldLine);
    pass.setBindGroup(0, fieldLineBindGroup);
    pass.setVertexBuffer(0, fieldLineBuffer);
    pass.draw(fieldLineVertexCount);
  }

  if (params.showParticles) {
    pass.setPipeline(pipelineParticleRender);
    pass.setBindGroup(0, particleRenderBindGroups[particleFlip]);
    pass.draw(6, Math.floor(params.nParticles));
  }

  pass.end();
}

function guidingModeLabel() {
  return `${GUIDING_MODE_NAMES[0]} ${INITIAL_SPIN_NAMES[params.initialSpin | 0] || INITIAL_SPIN_NAMES[0]}`;
}

function updateStats() {
  const pPeriodic = effectivePeriodicP0();
  const lambda = pPeriodic > 1e-6 ? (2 * Math.PI * params.hbar / pPeriodic) : Infinity;
  const lambdaText = Number.isFinite(lambda) ? fmt(lambda) : "inf";
  const quality = lambda < 8 ? ` <span style="color:#ffb347">under-resolved</span>` : "";
  const sgText = params.sgFieldOn && params.sgGradient > 0 ? fmt(params.sgGradient) : "off";
  statsEl.innerHTML = `<b>Physics</b>: ${guidingModeLabel()} &nbsp; <b>SG grad</b>: ${sgText} &nbsp; <b>Grid</b>: ${simW}x${simH}x${simD} &nbsp; <b>Particles</b>: ${Math.floor(params.nParticles)} &nbsp; <b>lambda</b>: ${lambdaText}${quality}`;
}

function rebuildBoxGeometry() {
  destroyGpuResource(boxBuffer);
  destroyGpuResource(boxShellBuffer);

  const x0 = 0, y0 = 0, z0 = 0;
  const x1 = simW - 1, y1 = simH - 1, z1 = simD - 1;
  const edges = [
    0, 1, 3, 2,
    4, 5, 7, 6,
  ];
  const copyOffsets = [-1, 0, 1];
  const corridorFade = (copy) => {
    const d = Math.abs(copy);
    if (d <= 2) return 1.0;
    return 0.18;
  };
  const periodX = Math.max(1, simW - 1);
  const lineVerts = [];
  const shellVerts = [];
  const copyCorners = (copy) => {
    const dx = copy * periodX;
    return [
      [x0 + dx, y0, z0], [x1 + dx, y0, z0], [x1 + dx, y1, z0], [x0 + dx, y1, z0],
      [x0 + dx, y0, z1], [x1 + dx, y0, z1], [x1 + dx, y1, z1], [x0 + dx, y1, z1],
    ];
  };
  for (const copy of copyOffsets) {
    const fade = corridorFade(copy);
    const corners = copyCorners(copy);
    for (let i = 0; i < edges.length; i++) {
      const p = corners[edges[i]];
      lineVerts.push(p[0] * params.boxScale, p[1] * params.boxScale, p[2] * params.boxScale, fade);
    }
  }

  boxVertexCount = lineVerts.length / 4;
  boxBuffer = makeBuffer("box wireframe vertices", new Float32Array(lineVerts), GPUBufferUsage.VERTEX);

  const faceUv = (corner, normal, copy) => {
    const localX = (corner[0] - copy * periodX) / Math.max(1, x1 - x0);
    const cross = Math.abs(normal[1]) > Math.abs(normal[2])
      ? corner[2] / Math.max(1, z1 - z0)
      : corner[1] / Math.max(1, y1 - y0);
    return [localX, cross];
  };
  const pushShellVertex = (corner, normal, fade, copy) => {
    const uv = faceUv(corner, normal, copy);
    shellVerts.push(
      corner[0] * params.boxScale,
      corner[1] * params.boxScale,
      corner[2] * params.boxScale,
      normal[0],
      normal[1],
      normal[2],
      uv[0],
      uv[1],
      fade
    );
  };
  const pushFace = (corners, copy, a, b, c, d, normal, fade) => {
    pushShellVertex(corners[a], normal, fade, copy);
    pushShellVertex(corners[b], normal, fade, copy);
    pushShellVertex(corners[c], normal, fade, copy);
    pushShellVertex(corners[a], normal, fade, copy);
    pushShellVertex(corners[c], normal, fade, copy);
    pushShellVertex(corners[d], normal, fade, copy);
  };

  for (const copy of copyOffsets) {
    const fade = corridorFade(copy);
    const corners = copyCorners(copy);
    pushFace(corners, copy, 0, 1, 2, 3, [0, 0, -1], fade);
    pushFace(corners, copy, 4, 7, 6, 5, [0, 0, 1], fade);
    pushFace(corners, copy, 0, 4, 5, 1, [0, -1, 0], fade);
    pushFace(corners, copy, 3, 2, 6, 7, [0, 1, 0], fade);
  }

  boxShellVertexCount = shellVerts.length / 9;
  boxShellBuffer = makeBuffer("box shell vertices", new Float32Array(shellVerts), GPUBufferUsage.VERTEX);
}

function sgFieldDirectionGrid(p) {
  const centerY = 0.5 * (simH - 1);
  const centerZ = 0.5 * (simD - 1);
  const scale = Math.max(1, centerZ);
  const by = -(p[1] - centerY) / scale;
  const bz = 0.5 + (p[2] - centerZ) / scale;
  const len = Math.hypot(by, bz);
  if (len < 1e-5) return null;
  return [0, by / len, bz / len];
}

function isInsideFieldLineBox(p, margin) {
  return p[1] >= margin && p[1] <= simH - 1 - margin &&
    p[2] >= margin && p[2] <= simD - 1 - margin;
}

function pushFieldLineSegment(verts, a, b, fade) {
  const ax = a[0] * params.boxScale;
  const ay = a[1] * params.boxScale;
  const az = a[2] * params.boxScale;
  const bx = b[0] * params.boxScale;
  const by = b[1] * params.boxScale;
  const bz = b[2] * params.boxScale;
  const pushVertex = (side, along) => {
    verts.push(ax, ay, az, bx, by, bz, fade, side, along);
  };
  pushVertex(-1, 0);
  pushVertex(1, 0);
  pushVertex(-1, 1);
  pushVertex(-1, 1);
  pushVertex(1, 0);
  pushVertex(1, 1);
}

function traceSgFieldLine(verts, start, sign, fade, step, maxSteps, margin) {
  let p = start.slice();
  for (let i = 0; i < maxSteps; i++) {
    const dir = sgFieldDirectionGrid(p);
    if (!dir) break;
    const q = [
      p[0],
      p[1] + sign * dir[1] * step,
      p[2] + sign * dir[2] * step,
    ];
    if (!isInsideFieldLineBox(q, margin)) break;
    pushFieldLineSegment(verts, p, q, fade);
    p = q;
  }
}

function rebuildMagneticFieldLines() {
  destroyGpuResource(fieldLineBuffer);
  fieldLineBuffer = null;
  fieldLineVertexCount = 0;
  if (simW < 4 || simH < 4 || simD < 4) return;

  const verts = [];
  const periodX = Math.max(1, simW - 1);
  const yMax = simH - 1;
  const zMax = simD - 1;
  const margin = 1.35;
  const step = Math.max(0.75, Math.max(simH, simD) / 112);
  const maxSteps = Math.ceil(3.2 * Math.max(simH, simD) / step);
  const copyOffsets = [-1, 0, 1];
  const xFracs = [0.12, 0.32, 0.5, 0.68, 0.88];
  const yFracs = [0.22, 0.78];
  const zFracs = [0.30, 0.50];

  for (const copy of copyOffsets) {
    const copyFade = Math.abs(copy) <= 1 ? 0.88 : 0.52;
    for (const xf of xFracs) {
      const x = copy * periodX + xf * periodX;
      const xFade = 1.0 - 0.18 * Math.abs(xf - 0.5) / 0.5;
      const fade = copyFade * xFade;
      for (const zf of zFracs) {
        for (const yf of yFracs) {
          const start = [x, yf * yMax, zf * zMax];
          traceSgFieldLine(verts, start, 1, fade, step, maxSteps, margin);
          traceSgFieldLine(verts, start, -1, fade, step, maxSteps, margin);
        }
      }
    }
  }

  fieldLineVertexCount = verts.length / 9;
  if (fieldLineVertexCount > 0) {
    fieldLineBuffer = makeBuffer("SG magnetic field line vertices", new Float32Array(verts), GPUBufferUsage.VERTEX);
  }
}

function rebuildSimulation() {
  resizeCanvas();

  const n = Math.max(32, Math.min(MAX_SIM_RES, Math.floor(params.simRes)));
  params.simRes = n;
  simW = n;
  simH = n;
  simD = zResolutionForBase(n);
  voxelCount = simW * simH * simD;
  cameraOrbit.distance = 2.15 * Math.max(simW, simH, simD) * params.boxScale;
  cameraTarget.distance = cameraOrbit.distance;

  deleteWaveTargets();
  const waveBytes = voxelCount * WAVE_CELL_BYTES;
  waveBufferA = makeStorageBuffer("wave state A", waveBytes);
  waveBufferB = makeStorageBuffer("wave state B", waveBytes);
  flip = 0;
  rebuildWaveBindGroups();

  resetWave();
  rebuildParticles();
  rebuildBoxGeometry();
  rebuildMagneticFieldLines();
  rebuildDensity();
}

function resetAll() {
  resetWave();
  rebuildParticles();
  clearDensity();
  requestRedraw();
}

window.addEventListener("resize", () => {
  if (resizeCanvas()) {
    rebuildDensity();
    requestRedraw();
  }
});

async function main() {
  configureCanvas();
  buildPipelines();
  rebuildSimulation();
  updateStats();

  params.trailHalfLife*=0.99;

  let lastFrameTime = performance.now();
  requestAnimationFrame(function loop(now = performance.now()) {
    const wallDtSeconds = Math.min(0.05, Math.max(0, (now - lastFrameTime) / 1000));
    const dtSeconds = wallDtSeconds;
    lastFrameTime = now;
    const resized = resizeCanvas();
    if (resized) rebuildDensity();

    const cameraKeyMoved = updateCameraKeyMotion(dtSeconds);
    const cameraMoved = updateCameraEasing() || cameraKeyMoved;
    if (cameraMoved) requestTrailClear();

    const cameraInputActive = hasActiveCameraKeys();
    const shouldDraw = !paused || redrawPending || resized || cameraMoved || cameraInputActive || trailClearPending;
    if (!shouldDraw) {
      setTimeout(loop, PAUSED_IDLE_MS);
      return;
    }

    drawViewGizmo();
    const camera = cameraFrame();

    if (trailClearPending) clearDensity();

    writeUniforms(uniformBuffer, camera, canvas.width, canvas.height);
    const encoder = device.createCommandEncoder({ label: "frame encoder" });

    if (!paused) {
      const steps = Math.floor(params.stepsPerFrame);
      const compute = encoder.beginComputePass({ label: "simulation compute pass" });
      for (let i = 0; i < steps; i++) {
        waveStep(compute);
        particleUpdate(compute);
        simTime += params.dt;
      }
      compute.end();
      if (params.showTrail) densityStepAndStamp(encoder, camera);
    }

    writeUniforms(uniformBuffer, camera, canvas.width, canvas.height);
    render(encoder, camera);
    device.queue.submit([encoder.finish()]);
    updateStats();
    redrawPending = false;

    if (paused && !cameraMoved && !cameraInputActive && !trailClearPending && !redrawPending) {
      setTimeout(loop, PAUSED_IDLE_MS);
    } else {
      requestAnimationFrame(loop);
    }
  });
}

main().catch(err => {
  console.error(err);
  alert(String(err));
});
