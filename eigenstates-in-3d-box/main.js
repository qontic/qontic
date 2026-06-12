import { createShaderSources } from "./shaders.js";

const canvas = document.getElementById("c");
if (!navigator.gpu) {
  alert("WebGPU is not available. Use a current Chrome/Edge desktop browser with WebGPU enabled.");
  throw new Error("WebGPU not available.");
}

const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
if (!adapter) {
  alert("No WebGPU adapter was found.");
  throw new Error("No WebGPU adapter.");
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
const DEFAULT_B_FIELD = 0.0;
const MAX_EIGEN_QUANTUM_NUMBER = 6;
const maxWaveBytes = Math.min(device.limits.maxStorageBufferBindingSize, device.limits.maxBufferSize);
const maxWaveCellsByStorage = Math.max(32 ** 3, Math.floor(maxWaveBytes / WAVE_CELL_BYTES));
const maxResByStorage = Math.floor(Math.cbrt(maxWaveCellsByStorage));
const maxResByDispatch = Math.floor(Math.cbrt(device.limits.maxComputeWorkgroupsPerDimension * WAVE_WORKGROUP_SIZE));
const rawMaxSimRes = Math.min(256, maxResByStorage, maxResByDispatch);
const MAX_SIM_RES = Math.max(32, Math.floor(rawMaxSimRes / 4) * 4);

const params = {
  simRes: Math.min(128, MAX_SIM_RES),
  stepsPerFrame: 8,
  boxScale: 2.5,
  cameraProjection: 0,

  hbar: 6.0,
  mass: 1.0,
  dt: 0.01,

  nParticles: 100,
  rhoMin: 1e-6,
  velClamp: 80.0,
  spinS: 2.,
  initialSpin: 0,
  bFieldStrength: DEFAULT_B_FIELD,
  bFieldAxis: 0,
  eigenNx: 1,
  eigenNy: 1,
  eigenNz: 1,

  cloudGain: .02,
  cloudGamma: 0.55,
  cloudLowBoost: 0.5,
  cloudCutoff: 0.003,
  cloudPointSize: 80.,
  showPhase: 0,
  showCloud: 1,
  showProjectedContour: 1,
  showLevelsets: 1,
  showFieldLines: 1,

  showParticles: 1,
  dotSize: 25.0,
  dotSigma: 0.28,
  dotGain: 2.0,

  showTrail: 1,
  trailHalfLife: 2.0,
  trailVisGain: 0.5,
  trailVisGamma: 1,
  trailStampGain: 0.45,
  trailWidth: 14.0,
  trailBlendMode: 2,
  densityScale: 0.5,
};

const urlParams = new URLSearchParams(window.location.search);
const preset = urlParams.get("preset");
const isEmbedded = urlParams.get("embed") === "1";

const embeddedBasePreset = {
  simRes: 64,
  stepsPerFrame: 4,
  nParticles: 300,
  showCloud: 1,
  showParticles: 1,
  showTrail: 1,
  showProjectedContour: 1,
  showLevelsets: 0,
  showFieldLines: 0,
};

const PRESETS = {
  ground: {
    params: {
      ...embeddedBasePreset,
      eigenNx: 1,
      eigenNy: 1,
      eigenNz: 1,
      bFieldStrength: 0,
      spinS: 2,
      showTrail: 1,
    },
    adjustable: ["spinS", "nParticles","showPhase","showTrail"],
  },
  excited: {
    params: {
      ...embeddedBasePreset,
      eigenNx: 2,
      eigenNy: 1,
      eigenNz: 2,
      showPhase: 1,
      bFieldStrength: 0,
      spinS: 2,
    },
    adjustable: [
      "spinS",
      "eigenQuantumNumbers",
      "showPhase","showTrail"
    ],
  },
  magnetic: {
    params: {
      ...embeddedBasePreset,
      eigenNx: 1,
      eigenNy: 1,
      eigenNz: 1,
      bFieldStrength: 0.01,
      bFieldAxis: 0,
      initialSpin: 0,
      spinS: 2,
      showPhase: 1,
      showFieldLines: 1,
    },
    adjustable: ["spinS", "initialSpin", "bFieldStrength", "bFieldAxis","eigenQuantumNumbers","showPhase",],
  },
};

const presetDefinition = PRESETS[preset];
const adjustableControls = new Set(presetDefinition?.adjustable ?? []);
if (presetDefinition) Object.assign(params, presetDefinition.params);

function isControlFixed(key) {
  return Boolean(presetDefinition) && !adjustableControls.has(key);
}

const GUIDING_MODE_NAMES = [
  "Pauli spinor"
];

const INITIAL_SPIN_NAMES = [
  "+Z",
  "-Z",
  "+X"
];

const B_FIELD_AXIS_NAMES = [
  "X",
  "Y",
  "Z"
];

const EQUIPOTENTIAL_LEVEL_COUNT = 9;
const EQUIPOTENTIAL_LOG_RHO_MAX = -0.45;
const EQUIPOTENTIAL_LOG_RHO_STEP = 0.83;
const EQUIPOTENTIAL_SUBDIV = 3;
const EQUIPOTENTIAL_LINE_WIDTH_PX = 3.0;
const DRAW_COORDINATE_AXES = true;
const COORDINATE_AXIS_OPACITY = 0.6;
const COORDINATE_AXIS_SEGMENTS = 28;
const COORDINATE_AXIS_SHAFT_RADIUS_FRACTION = 0.010;
const COORDINATE_AXIS_HEAD_RADIUS_FRACTION = 0.032;
const COORDINATE_AXIS_HEAD_LENGTH_FRACTION = 0.12;
const CENTER_CUBE_IN_SCREENSPACE = true;
const UI_SCENE_SCREEN_OFFSET_X =0.15;
const INFO_OVERLAY_FONT_FAMILY = "OrbitronInfo";
const INFO_OVERLAY_FONT_FILE = "./Orbitron-Medium.ttf";
const INFO_OVERLAY_SIZE_MULTIPLIER = 2;
const INFO_OVERLAY_WIDTH_CSS = 200 * INFO_OVERLAY_SIZE_MULTIPLIER;
const INFO_OVERLAY_HEIGHT_CSS = 144 * INFO_OVERLAY_SIZE_MULTIPLIER;
const INFO_OVERLAY_SCALE = 2;
const INFO_OVERLAY_TEXTURE_WIDTH = INFO_OVERLAY_WIDTH_CSS * INFO_OVERLAY_SCALE;
const INFO_OVERLAY_TEXTURE_HEIGHT = INFO_OVERLAY_HEIGHT_CSS * INFO_OVERLAY_SCALE;
const INFO_OVERLAY_MARGIN_CSS = 18;
const DRAW_INFO_OVERLAY_IN_WEBGPU = !isEmbedded;

let paused = false;
let redrawPending = true;
const PAUSED_IDLE_MS = 180;
const infoOverlayCanvas = document.createElement("canvas");
infoOverlayCanvas.width = INFO_OVERLAY_TEXTURE_WIDTH;
infoOverlayCanvas.height = INFO_OVERLAY_TEXTURE_HEIGHT;
Object.assign(infoOverlayCanvas.style, {
  position: "absolute",
  top: `${INFO_OVERLAY_MARGIN_CSS}px`,
  right: `${INFO_OVERLAY_MARGIN_CSS}px`,
  width: `${INFO_OVERLAY_WIDTH_CSS}px`,
  height: `${INFO_OVERLAY_HEIGHT_CSS}px`,
  display: "none",
  pointerEvents: "none",
  zIndex: "6",
});
document.getElementById("wrap")?.appendChild(infoOverlayCanvas);
const infoOverlayCtx = infoOverlayCanvas.getContext("2d");

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

let simW = 0, simH = 0, simD = 0;
let voxelCount = 0;

function fmt(v) {
  const av = Math.abs(v);
  if (av >= 1000 || (av > 0 && av < 0.01)) return v.toExponential(2);
  return v.toFixed(3).replace(/\.?0+$/, "");
}

function selectedEigenMode() {
  const nx = Math.max(1, Math.min(MAX_EIGEN_QUANTUM_NUMBER, Math.round(params.eigenNx)));
  const ny = Math.max(1, Math.min(MAX_EIGEN_QUANTUM_NUMBER, Math.round(params.eigenNy)));
  const nz = Math.max(1, Math.min(MAX_EIGEN_QUANTUM_NUMBER, Math.round(params.eigenNz)));
  return { nx, ny, nz, key: nx * nx + ny * ny + nz * nz };
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
  if (key === "bFieldStrength") val.style.display = "none";

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

function addSpinCurrentToggle() {
  if (isControlFixed("spinS")) return;
  const row = document.createElement("div");
  row.className = "row";

  const lab = document.createElement("label");
  lab.textContent = "Spin current";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.style.flex = "1";

  const sync = () => {
    btn.textContent = params.spinS > 0 ? "ON" : "OFF";
  };

  btn.addEventListener("click", () => {
    params.spinS = params.spinS > 0 ? 0 : 2;
    sync();
    requestTrailClear();
    requestRedraw();
  });

  const val = document.createElement("div");
  val.className = "val";
  val.textContent = "";

  row.appendChild(lab);
  row.appendChild(btn);
  row.appendChild(val);
  controls.appendChild(row);
  sync();
}

function addToggleButtonGroup(label, entries) {
  const visibleEntries = entries.filter(([key]) => !isControlFixed(key));
  if (visibleEntries.length === 0) return;
  const row = document.createElement("div");
  row.className = "row";

  const lab = document.createElement("label");
  lab.textContent = label;

  const group = document.createElement("div");
  group.className = "toggle-group";

  const buttons = visibleEntries.map(([key, text]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      params[key] = params[key] ? 0 : 1;
      sync();
      requestRedraw();
    });
    group.appendChild(btn);
    return [key, btn];
  });

  const sync = () => {
    for (const [key, btn] of buttons) {
      btn.classList.toggle("selected", !!params[key]);
    }
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

function addCycleButton(key, label, values, onChange = null) {
  if (isControlFixed(key)) return { button: null, sync() {} };
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

function addSegmentedControl(key, label, values, onChange = null) {
  if (isControlFixed(key)) return { sync() {} };
  const row = document.createElement("div");
  row.className = "row";

  const lab = document.createElement("label");
  lab.textContent = label;

  const group = document.createElement("div");
  group.className = "toggle-group";

  const buttons = values.map((value, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = value;
    btn.style.whiteSpace = "nowrap";
    btn.addEventListener("click", () => {
      params[key] = index;
      sync();
      if (onChange) onChange(index);
      requestRedraw();
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
  return { sync };
}

function addEigenQuantumPicker(onChange = null) {
  if (isControlFixed("eigenQuantumNumbers")) return { sync() {} };
  const row = document.createElement("div");
  row.className = "row";

  const lab = document.createElement("label");
  lab.textContent = "quantum numbers";

  const picker = document.createElement("div");
  picker.style.display = "grid";
  picker.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
  picker.style.gap = "12px 46px";
  picker.style.flex = "1";

  const selectEntries = [
    ["eigenNx", "nx"],
    ["eigenNy", "ny"],
    ["eigenNz", "nz"],
  ];

  const selects = selectEntries.map(([key, label]) => {
    const cell = document.createElement("div");
    cell.style.minWidth = "40px";

    const caption = document.createElement("div");
    caption.textContent = label;
    caption.style.fontSize = "10px";
    caption.style.color = "#aaa";
    caption.style.textAlign = "center";
    caption.style.marginBottom = "2px";

    const select = document.createElement("select");
    select.title = `${label} quantum number`;
    select.style.width = "100%";
    select.style.padding = "6px 4px";
    select.style.borderRadius = "6px";
    select.style.border = "1px solid rgba(255,255,255,0.2)";
    select.style.background = "rgba(0,0,0,0.55)";
    select.style.color = "#fff";
    select.style.fontVariantNumeric = "tabular-nums";
    select.style.textAlign = "center";
    for (let n = 1; n <= MAX_EIGEN_QUANTUM_NUMBER; n++) {
      const option = document.createElement("option");
      option.value = String(n);
      option.textContent = String(n);
      select.appendChild(option);
    }
    select.addEventListener("change", () => {
      params[key] = parseInt(select.value, 10);
      sync();
      if (onChange) onChange();
      requestRedraw();
    });
    cell.appendChild(caption);
    cell.appendChild(select);
    picker.appendChild(cell);
    return [key, select];
  });

  const val = document.createElement("div");
  val.className = "val";
  val.style.display = "90px";

  const sync = () => {
    for (const [key, select] of selects) {
      select.value = String(Math.max(1, Math.min(MAX_EIGEN_QUANTUM_NUMBER, Math.round(params[key]))));
    }
  };

  row.appendChild(lab);
  row.appendChild(picker);
  row.appendChild(val);
  controls.appendChild(row);
  sync();
  return { sync };
}

function addSectionHeader(label) {
  const header = document.createElement("div");
  header.className = "control-section-header";
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
  const children = [...controls.children];
  children.forEach((child, index) => {
    if (!child.classList.contains("control-section-header")) return;
    const next = children[index + 1];
    if (!next || next.classList.contains("control-section-header")) child.remove();
  });
}

addSlider("simRes", "grid size", 32, MAX_SIM_RES, 4, () => rebuildSimulation());
addSlider("stepsPerFrame", "Steps/frame", 1, 30, 1);
addSlider("dt", "dt", 0.002, 0.02, 0.002);

const cameraProjectionControl = addCycleButton("cameraProjection", "camera view", ["Perspective", "Orthographic"], () => {
  activeOrthoView = null;
  syncCameraUi();
  requestTrailClear();
});

addSectionHeader("Physical Parameters");
addSpinCurrentToggle();
addSegmentedControl("initialSpin", "Spin", INITIAL_SPIN_NAMES, () => resetAll());
addSlider("bFieldStrength", "B strength", 0.0, 0.05, 0.001);
addSegmentedControl("bFieldAxis", "B direction", B_FIELD_AXIS_NAMES, () => {
  rebuildMagneticFieldLines();
});
const eigenQuantumPicker = addEigenQuantumPicker(() => resetAll());


addSectionHeader("Visual Parameters");
addToggleInt("showCloud", "density cloud");
addToggleInt("showPhase", "show phase");
addToggleButtonGroup("contours", [
  ["showProjectedContour", "floor contours"],
  ["showLevelsets", "Levelsets"],
]);
addToggleInt("showFieldLines", "B streamlines");
addSlider("cloudGain", "cloud density", 0.005, 0.05, 0.005);

addToggleInt("showParticles", "show particles");
addSlider("nParticles", "particle count", 1, 301, 10, () => rebuildParticles());

addSlider("dotSize", "particle size", 2.0, 26.0, 0.5);
addSlider("dotGain", "particle brightness", 0.1, 5.0, 0.1);

addToggleInt("showTrail", "draw trails");
addSlider("trailHalfLife", "trail half-life", .1, 10.0, .1);
//addSlider("trailVisGain", "trail gain", 0.1, 1.0, 0.1);
//addSlider("trailVisGamma", "trail gamma", 0.4, 2.0, 0.05);
addSlider("trailWidth", "trail width", 1, 15.0, 1);

removeEmptySectionHeaders();

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
const UNIFORM_FLOATS = 76;
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
const infoOverlayUniformData = new Float32Array(8);
const infoOverlayUniformBuffer = device.createBuffer({
  label: "info overlay uniforms",
  size: infoOverlayUniformData.byteLength,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
const infoOverlayTexture = device.createTexture({
  label: "info overlay texture",
  size: [INFO_OVERLAY_TEXTURE_WIDTH, INFO_OVERLAY_TEXTURE_HEIGHT],
  format: "rgba8unorm",
  usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
});
const infoOverlayTextureView = infoOverlayTexture.createView();
const infoOverlaySampler = device.createSampler({
  magFilter: "linear",
  minFilter: "linear",
});

const {
  WAVE_INIT_WGSL,
  WAVE_STEP_WGSL,
  PARTICLE_UPDATE_WGSL,
  CLOUD_WGSL,
  PARTICLE_RENDER_WGSL,
  DENSITY_WGSL,
  BOX_SHELL_WGSL,
  AXIS_ARROW_WGSL,
  FIELD_LINE_WGSL,
  EQUIPOTENTIAL_WGSL,
  EQUIPOTENTIAL_LEVELSET_WGSL,
  INFO_OVERLAY_WGSL,
} = await createShaderSources({ WAVE_WORKGROUP_SIZE, PARTICLE_WORKGROUP_SIZE });
let pipelineWaveInit, pipelineWaveStep, pipelineParticleUpdate;
let pipelineCloud, pipelineEquipotential, pipelineLevelsets, pipelineBoxShell, pipelineAxisArrow, pipelineFieldLine;
let pipelineParticleRender, pipelineParticleStamp;
let pipelineDensityFade, pipelineDensityRenderAdd, pipelineDensityRenderScreen, pipelineDensityRenderGlow;
let pipelineInfoOverlay;
let nearestSampler = device.createSampler({ magFilter: "nearest", minFilter: "nearest" });

let waveBufferA = null, waveBufferB = null, flip = 0;
let simTime = 0;

let particleSrc = null, particleDst = null, particleFlip = 0;
let boxShellBuffer = null, boxShellVertexCount = 0;
let axisArrowBuffer = null, axisArrowVertexCount = 0;
let fieldLineBuffer = null, fieldLineVertexCount = 0;

let densW = 0, densH = 0;
let densTexA = null, densTexB = null, densViewA = null, densViewB = null, densFlip = 0;
let trailClearPending = false;

let waveInitBindGroups = [];
let waveStepBindGroups = [];
let cloudBindGroups = [];
let equipotentialBindGroups = [];
let levelsetBindGroups = [];
let particleUpdateBindGroups = [];
let particleRenderBindGroups = [];
let particleStampBindGroups = [];
let densityFadeBindGroups = [];
let densityRenderBindGroups = [];
let boxShellBindGroup = null;
let axisArrowBindGroup = null;
let fieldLineBindGroup = null;
let infoOverlayBindGroup = null;

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
  equipotentialBindGroups = [];
  levelsetBindGroups = [];
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
  const axisArrowModule = shaderModule("coordinate axis arrows", AXIS_ARROW_WGSL);
  const fieldLineModule = shaderModule("uniform magnetic field lines", FIELD_LINE_WGSL);
  const equipotentialModule = shaderModule("equipotential", EQUIPOTENTIAL_WGSL);
  const levelsetModule = shaderModule("equipotential levelsets", EQUIPOTENTIAL_LEVELSET_WGSL);
  const infoOverlayModule = shaderModule("info overlay", INFO_OVERLAY_WGSL);

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
  pipelineAxisArrow = device.createRenderPipeline({
    label: "coordinate axis arrow pipeline",
    layout: "auto",
    vertex: {
      module: axisArrowModule,
      entryPoint: "vs",
      buffers: [{
        arrayStride: 40,
        attributes: [
          { shaderLocation: 0, offset: 0, format: "float32x3" },
          { shaderLocation: 1, offset: 12, format: "float32x3" },
          { shaderLocation: 2, offset: 24, format: "float32x4" },
        ],
      }],
    },
    fragment: {
      module: axisArrowModule,
      entryPoint: "fs",
      targets: [{ format: presentationFormat, blend: blendState("src-alpha", "one-minus-src-alpha"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "triangle-list", cullMode: "back" },
  });

  pipelineFieldLine = device.createRenderPipeline({
    label: "uniform magnetic field line pipeline",
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

  pipelineEquipotential = device.createRenderPipeline({
    label: "equipotential pipeline",
    layout: "auto",
    vertex: { module: equipotentialModule, entryPoint: "vs" },
    fragment: {
      module: equipotentialModule,
      entryPoint: "fs",
      targets: [{ format: presentationFormat, blend: blendState("src-alpha", "one-minus-src-alpha"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "triangle-list" },
  });
  pipelineLevelsets = device.createRenderPipeline({
    label: "equipotential levelset pipeline",
    layout: "auto",
    vertex: { module: levelsetModule, entryPoint: "vs" },
    fragment: {
      module: levelsetModule,
      entryPoint: "fs",
      targets: [{ format: presentationFormat, blend: blendState("src-alpha", "one-minus-src-alpha"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "triangle-list" },
  });
  pipelineInfoOverlay = device.createRenderPipeline({
    label: "info overlay pipeline",
    layout: "auto",
    vertex: { module: infoOverlayModule, entryPoint: "vs" },
    fragment: {
      module: infoOverlayModule,
      entryPoint: "fs",
      targets: [{ format: presentationFormat, blend: blendState("src-alpha", "one-minus-src-alpha"), writeMask: COLOR_WRITE_ALL }],
    },
    primitive: { topology: "triangle-list" },
  });

  boxShellBindGroup = bindGroup(pipelineBoxShell, [{ binding: 0, resource: { buffer: uniformBuffer } }]);
  axisArrowBindGroup = bindGroup(pipelineAxisArrow, [{ binding: 0, resource: { buffer: uniformBuffer } }]);
  fieldLineBindGroup = bindGroup(pipelineFieldLine, [{ binding: 0, resource: { buffer: uniformBuffer } }]);
  infoOverlayBindGroup = bindGroup(pipelineInfoOverlay, [
    { binding: 0, resource: { buffer: infoOverlayUniformBuffer } },
    { binding: 1, resource: infoOverlayTextureView },
    { binding: 2, resource: infoOverlaySampler },
  ]);
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
  equipotentialBindGroups = [
    bindGroup(pipelineEquipotential, [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBufferA } },
    ]),
    bindGroup(pipelineEquipotential, [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBufferB } },
    ]),
  ];
  levelsetBindGroups = [
    bindGroup(pipelineLevelsets, [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: waveBufferA } },
    ]),
    bindGroup(pipelineLevelsets, [
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

function selectedEigenEnergy(mode = selectedEigenMode()) {
  const sx = simW || Math.floor(params.simRes);
  const sy = simH || Math.floor(params.simRes);
  const sz = simD || Math.floor(params.simRes);
  const lx = Math.max(1, sx - 1);
  const ly = Math.max(1, sy - 1);
  const lz = Math.max(1, sz - 1);
  const scale = params.hbar * params.hbar * Math.PI * Math.PI / (2 * Math.max(1e-6, params.mass));
  return scale * (
    (mode.nx * mode.nx) / (lx * lx) +
    (mode.ny * mode.ny) / (ly * ly) +
    (mode.nz * mode.nz) / (lz * lz)
  );
}

function writeUniforms(buffer, camera, viewportW, viewportH, densityFade = 1.0, densitySizeScale = 1.0) {
  uniformData.fill(0);
  const mode = selectedEigenMode();
  const fieldActive = params.bFieldStrength > 0 ? 1 : 0;
  const stationaryPhase = fieldActive
    ? 0
    : (simTime * selectedEigenEnergy(mode) / Math.max(1e-6, params.hbar)) % (2 * Math.PI);
  uniformData.set([simW, simH, simD, voxelCount], 0);
  uniformData.set([params.hbar, params.mass, stationaryPhase, params.dt], 4);
  uniformData.set([params.cloudGain, params.cloudGamma, params.cloudLowBoost, params.cloudCutoff], 8);
  uniformData.set([params.cloudPointSize, params.showPhase, 0, params.boxScale], 12);
  uniformData.set([params.dotSize, params.dotSigma, params.dotGain, params.spinS], 16);
  uniformData.set([params.rhoMin, params.velClamp, Math.floor(params.nParticles), params.trailWidth], 20);
  uniformData.set([camera.eye[0], camera.eye[1], camera.eye[2], camera.distance], 24);
  uniformData.set([viewportW, viewportH, params.cameraProjection | 0, params.trailStampGain], 28);
  uniformData.set([EQUIPOTENTIAL_LEVEL_COUNT, EQUIPOTENTIAL_SUBDIV, EQUIPOTENTIAL_LOG_RHO_MAX, EQUIPOTENTIAL_LOG_RHO_STEP], 32);
  uniformData.set([params.rhoMin, 0.0, EQUIPOTENTIAL_LINE_WIDTH_PX, params.trailVisGain], 36);
  uniformData.set([params.trailVisGamma, params.trailBlendMode | 0, densityFade, densitySizeScale], 40);
  uniformData.set(fieldActive ? [0.82, 0.34, 0.28, 0.30] : [0.38, 0.72, 0.68, 0.22], 44);
  const boxCenter = boxCenterWorld();
  uniformData.set([boxCenter[0], boxCenter[1], boxCenter[2], 0.0], 48);
  uniformData.set([params.bFieldStrength, fieldActive, params.initialSpin | 0, params.bFieldAxis | 0], 52);
  uniformData.set([0.0, mode.nx, mode.ny, mode.nz], 56);
  uniformData.set(camera.viewProj, 60);
  device.queue.writeBuffer(buffer, 0, uniformData);
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

const cameraOrbit = {
  yaw: -2.22 + Math.PI * 0.5,
  pitch: 0.43,
  distance: 1,
};
const KEYBOARD_YAW_CENTER = -Math.PI * 0.5;
const KEYBOARD_YAW_LIMIT = Math.PI * 0.5;
const KEYBOARD_ORBIT_SPEED = .5;
const KEYBOARD_ZOOM_SPEED = .3;
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
    min: 0.65 * n,
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

  const horizontal = -(pressedCameraKeys.has("KeyA") ? 1 : 0) + (pressedCameraKeys.has("KeyD") ? 1 : 0);
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
  if (isEmbedded) {
    try {
      window.top.scrollBy(e.deltaX, e.deltaY);
    } catch {
      // Cross-origin hosts retain the browser's default iframe behavior.
    }
    return;
  }
  applyCameraZoomDelta(e.deltaY);
}, { passive: false });

function cameraFrame() {
  const target = boxCenterWorld();
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
  const fovy = 36 * Math.PI / 180;
  let proj;
  if ((params.cameraProjection | 0) === 1) {
    const halfH = Math.tan(fovy * 0.5) * cameraOrbit.distance;
    const halfW = halfH * aspect;
    proj = mat4Orthographic(-halfW, halfW, -halfH, halfH, 0.04 * n, 8.0 * n);
  } else {
    proj = mat4Perspective(fovy, aspect, 0.04 * n, 8.0 * n);
  }
  const screenOffsetX = CENTER_CUBE_IN_SCREENSPACE ? 0 : UI_SCENE_SCREEN_OFFSET_X;
  const viewProj = mat4Mul(mat4ClipOffset(screenOffsetX, 0), mat4Mul(proj, view));
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

function shouldUpdateWave() {
  return params.bFieldStrength > 0;
}

function shouldUpdateParticles() {
  return Math.floor(params.nParticles) > 0 && (params.spinS > 0 || params.bFieldStrength > 0);
}

function eigenDensityAtGrid(x, y, z, mode) {
  const lx = Math.max(1, simW - 1);
  const ly = Math.max(1, simH - 1);
  const lz = Math.max(1, simD - 1);
  if (x <= 0 || y <= 0 || z <= 0 || x >= lx || y >= ly || z >= lz) return 0;
  const sx = Math.sin(Math.PI * mode.nx * x / lx);
  const sy = Math.sin(Math.PI * mode.ny * y / ly);
  const sz = Math.sin(Math.PI * mode.nz * z / lz);
  return sx * sx * sy * sy * sz * sz;
}

function sampleEigenParticle(mode) {
  const lx = Math.max(1, simW - 1);
  const ly = Math.max(1, simH - 1);
  const lz = Math.max(1, simD - 1);
  for (let attempt = 0; attempt < 10000; attempt++) {
    const x = Math.random() * lx;
    const y = Math.random() * ly;
    const z = Math.random() * lz;
    if (Math.random() <= eigenDensityAtGrid(x, y, z, mode)) return [x, y, z];
  }
  return [
    (0.1 + 0.8 * Math.random()) * lx,
    (0.1 + 0.8 * Math.random()) * ly,
    (0.1 + 0.8 * Math.random()) * lz,
  ];
}

function rebuildParticles() {
  const n = Math.floor(params.nParticles);

  destroyGpuResource(particleSrc);
  destroyGpuResource(particleDst);

  const data = new Float32Array(n * 4);
  const eigenMode = selectedEigenMode();

  for (let i = 0; i < n; i++) {
    let [x, y, z] = sampleEigenParticle(eigenMode);
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
  if (!shouldUpdateParticles()) return;
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

function equipotentialVertexCount(sliceCount = 1) {
  if (simW < 2 || simH < 2) return 0;
  const subcellsPerCell = EQUIPOTENTIAL_SUBDIV * EQUIPOTENTIAL_SUBDIV;
  return (simW - 1) * (simH - 1) * subcellsPerCell * EQUIPOTENTIAL_LEVEL_COUNT * sliceCount * 12;
}

function levelsetVertexCount() {
  return equipotentialVertexCount(selectedEigenMode().nz);
}

async function loadInfoOverlayFont() {
  if (typeof FontFace === "undefined" || !document.fonts) return;
  try {
    const font = new FontFace(INFO_OVERLAY_FONT_FAMILY, `url("${INFO_OVERLAY_FONT_FILE}")`);
    document.fonts.add(await font.load());
  } catch (error) {
    console.warn("Could not load info overlay font:", error);
  }
}

function roundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function drawInfoStatusPill(ctx, text, x, y, active) {
  const s = INFO_OVERLAY_SIZE_MULTIPLIER;
  const w = 44 * s;
  const h = 18 * s;
  roundedRectPath(ctx, x, y - h + 3 * s, w, h, 9 * s);
  ctx.fillStyle = active ? "rgba(255, 185, 52, 0.20)" : "rgba(116, 134, 143, 0.18)";
  ctx.fill();
  ctx.strokeStyle = active ? "rgba(255, 203, 88, 0.72)" : "rgba(140, 160, 170, 0.34)";
  ctx.lineWidth = 1 * s;
  ctx.stroke();
  ctx.fillStyle = active ? "rgb(255, 226, 126)" : "rgb(154, 170, 178)";
  ctx.font = `${10 * s}px ${INFO_OVERLAY_FONT_FAMILY}, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + w * 0.5, y - h * 0.5 + 3 * s);
}

function drawInfoEigenstate(ctx, mode, xRight, y, s) {
  const parts = [
    { text: "n=(", color: "rgb(255, 222, 128)" },
    { text: `${mode.nx}`, color: infoAxisColor("X") },
    { text: ",", color: "rgb(255, 222, 128)" },
    { text: `${mode.ny}`, color: infoAxisColor("Y") },
    { text: ",", color: "rgb(255, 222, 128)" },
    { text: `${mode.nz}`, color: infoAxisColor("Z") },
    { text: ")", color: "rgb(255, 222, 128)" },
  ];
  ctx.font = `${13 * s}px ${INFO_OVERLAY_FONT_FAMILY}, system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const totalWidth = parts.reduce((sum, part) => sum + ctx.measureText(part.text).width, 0);
  let x = xRight - totalWidth;
  for (const part of parts) {
    ctx.fillStyle = part.color;
    ctx.fillText(part.text, x, y);
    x += ctx.measureText(part.text).width;
  }
}

function infoAxisColor(value) {
  const axis = String(value).replace(/[^XYZ]/g, "");
  if (axis === "X") return "rgb(255, 91, 91)";
  if (axis === "Y") return "rgb(88, 210, 111)";
  if (axis === "Z") return "rgb(88, 166, 255)";
  return "rgb(255, 222, 128)";
}

function updateInfoOverlayTexture() {
  if (!infoOverlayCtx) return;

  const mode = selectedEigenMode();
  const spinCurrentOn = params.spinS > 0;
  const magneticFieldOn = params.bFieldStrength > 0;
  const spinDirection = INITIAL_SPIN_NAMES[params.initialSpin | 0] || INITIAL_SPIN_NAMES[0];
  const magneticFieldDirection = B_FIELD_AXIS_NAMES[params.bFieldAxis | 0] || B_FIELD_AXIS_NAMES[2];
  const rows = [
    ["SPIN CURRENT", spinCurrentOn ? "ON" : "OFF", spinCurrentOn],
    ["SPIN DIRECTION", spinDirection, "axis"],
    ["MAGNETIC FIELD", magneticFieldOn ? "ON" : "OFF", magneticFieldOn],
    ["B DIRECTION", magneticFieldDirection, "axis"],
    ["EIGENSTATE", mode, "eigenstate"],
  ];

  const ctx = infoOverlayCtx;
  const w = INFO_OVERLAY_WIDTH_CSS;
  const h = INFO_OVERLAY_HEIGHT_CSS;
  const s = INFO_OVERLAY_SIZE_MULTIPLIER;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, infoOverlayCanvas.width, infoOverlayCanvas.height);
  ctx.scale(INFO_OVERLAY_SCALE, INFO_OVERLAY_SCALE);

  const panelGrad = ctx.createLinearGradient(0, 0, 0, h);
  panelGrad.addColorStop(0, "rgba(8, 18, 23, 0.84)");
  panelGrad.addColorStop(1, "rgba(5, 10, 15, 0.66)");
  roundedRectPath(ctx, 0.5 * s, 0.5 * s, w - 1 * s, h - 1 * s, 14 * s);
  ctx.fillStyle = panelGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(244, 185, 84, 0.34)";
  ctx.lineWidth = 1.2 * s;
  ctx.stroke();

  const accentGrad = ctx.createLinearGradient(16 * s, 0, w - 16 * s, 0);
  accentGrad.addColorStop(0, "rgba(255, 133, 43, 0.0)");
  accentGrad.addColorStop(0.35, "rgba(255, 185, 63, 0.74)");
  accentGrad.addColorStop(1, "rgba(102, 226, 214, 0.34)");
  ctx.fillStyle = accentGrad;
  ctx.fillRect(18 * s, 12 * s, w - 36 * s, 1.4 * s);

  let y = 34 * s;
  for (const [label, value, active] of rows) {
    ctx.fillStyle = "rgba(178, 195, 195, 0.82)";
    ctx.font = `${10 * s}px ${INFO_OVERLAY_FONT_FAMILY}, system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 22 * s, y);
    if (active === "eigenstate") {
      drawInfoEigenstate(ctx, value, w - 24 * s, y, s);
    } else if (active === "axis") {
      ctx.fillStyle = infoAxisColor(value);
      ctx.font = `${13 * s}px ${INFO_OVERLAY_FONT_FAMILY}, system-ui, sans-serif`;
      ctx.textAlign = "right";
      ctx.fillText(value, w - 24 * s, y);
    } else if (active === null) {
      ctx.fillStyle = "rgb(255, 222, 128)";
      ctx.font = `${13 * s}px ${INFO_OVERLAY_FONT_FAMILY}, system-ui, sans-serif`;
      ctx.textAlign = "right";
      ctx.fillText(value, w - 24 * s, y);
    } else {
      drawInfoStatusPill(ctx, value, w - 68 * s, y + 6 * s, active);
    }
    y += 19 * s;
  }

  const dpr = Math.max(1, canvas.width / Math.max(1, canvas.clientWidth || canvas.width));
  const overlayW = INFO_OVERLAY_WIDTH_CSS * dpr;
  const overlayH = INFO_OVERLAY_HEIGHT_CSS * dpr;
  const margin = INFO_OVERLAY_MARGIN_CSS * dpr;
  infoOverlayUniformData.set([
    canvas.width, canvas.height, 0, 0,
    canvas.width - overlayW - margin, margin, overlayW, overlayH,
  ]);
  if (DRAW_INFO_OVERLAY_IN_WEBGPU && infoOverlayBindGroup) {
    device.queue.writeBuffer(infoOverlayUniformBuffer, 0, infoOverlayUniformData);
    device.queue.copyExternalImageToTexture(
      { source: infoOverlayCanvas },
      { texture: infoOverlayTexture },
      [INFO_OVERLAY_TEXTURE_WIDTH, INFO_OVERLAY_TEXTURE_HEIGHT]
    );
  }
}

function render(encoder, camera) {
  updateInfoOverlayTexture();
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

  if (DRAW_COORDINATE_AXES && axisArrowBuffer && axisArrowVertexCount > 0) {
    pass.setPipeline(pipelineAxisArrow);
    pass.setBindGroup(0, axisArrowBindGroup);
    pass.setVertexBuffer(0, axisArrowBuffer);
    pass.draw(axisArrowVertexCount);
  }

  if (params.showFieldLines && params.bFieldStrength > 0 && fieldLineBuffer && fieldLineVertexCount > 0) {
    pass.setPipeline(pipelineFieldLine);
    pass.setBindGroup(0, fieldLineBindGroup);
    pass.setVertexBuffer(0, fieldLineBuffer);
    pass.draw(fieldLineVertexCount);
  }

  if (params.showProjectedContour) {
    const vertexCount = equipotentialVertexCount();
    if (vertexCount > 0) {
      pass.setPipeline(pipelineEquipotential);
      pass.setBindGroup(0, equipotentialBindGroups[flip]);
      pass.draw(vertexCount);
    }
  }

  if (params.showLevelsets) {
    const vertexCount = levelsetVertexCount();
    if (vertexCount > 0) {
      pass.setPipeline(pipelineLevelsets);
      pass.setBindGroup(0, levelsetBindGroups[flip]);
      pass.draw(vertexCount);
    }
  }

  if (params.showParticles) {
    pass.setPipeline(pipelineParticleRender);
    pass.setBindGroup(0, particleRenderBindGroups[particleFlip]);
    pass.draw(6, Math.floor(params.nParticles));
  }

  if (DRAW_INFO_OVERLAY_IN_WEBGPU && infoOverlayBindGroup) {
    pass.setPipeline(pipelineInfoOverlay);
    pass.setBindGroup(0, infoOverlayBindGroup);
    pass.draw(6);
  }

  pass.end();
}

function guidingModeLabel() {
  return `${GUIDING_MODE_NAMES[0]} ${INITIAL_SPIN_NAMES[params.initialSpin | 0] || INITIAL_SPIN_NAMES[0]}`;
}

function bFieldAxisName() {
  return B_FIELD_AXIS_NAMES[params.bFieldAxis | 0] || B_FIELD_AXIS_NAMES[2];
}

function updateStats() {
  const mode = selectedEigenMode();
  const waveText = `box n=(${mode.nx},${mode.ny},${mode.nz}), E=${fmt(selectedEigenEnergy(mode))}`;
  statsEl.innerHTML = `<b>Physics</b>: ${guidingModeLabel()} &nbsp; <b>B${bFieldAxisName()}</b>: ${fmt(params.bFieldStrength)} &nbsp; <b>Wave</b>: ${waveText} &nbsp; <b>Grid</b>: ${simW}^3 &nbsp; <b>Particles</b>: ${Math.floor(params.nParticles)}`;
}

function rebuildBoxGeometry() {
  destroyGpuResource(boxShellBuffer);

  const x0 = 0, y0 = 0, z0 = 0;
  const x1 = simW - 1, y1 = simH - 1, z1 = simD - 1;
  const shellVerts = [];
  const corners = [
    [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
    [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1],
  ];

  const faceUv = (corner, normal) => {
    const ax = Math.abs(normal[0]);
    const ay = Math.abs(normal[1]);
    const az = Math.abs(normal[2]);
    if (ax >= ay && ax >= az) {
      return [
        (corner[1] - y0) / Math.max(1, y1 - y0),
        (corner[2] - z0) / Math.max(1, z1 - z0),
      ];
    }
    if (ay >= az) {
      return [
        (corner[0] - x0) / Math.max(1, x1 - x0),
        (corner[2] - z0) / Math.max(1, z1 - z0),
      ];
    }
    return [
      (corner[0] - x0) / Math.max(1, x1 - x0),
      (corner[1] - y0) / Math.max(1, y1 - y0),
    ];
  };
  const pushShellVertex = (corner, normal, fade) => {
    const uv = faceUv(corner, normal);
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
  const pushFace = (a, b, c, d, normal, fade = 1.0) => {
    pushShellVertex(corners[a], normal, fade);
    pushShellVertex(corners[b], normal, fade);
    pushShellVertex(corners[c], normal, fade);
    pushShellVertex(corners[a], normal, fade);
    pushShellVertex(corners[c], normal, fade);
    pushShellVertex(corners[d], normal, fade);
  };

  pushFace(0, 3, 7, 4, [-1, 0, 0]);
  pushFace(1, 5, 6, 2, [1, 0, 0]);
  pushFace(0, 1, 2, 3, [0, 0, -1]);
  pushFace(4, 7, 6, 5, [0, 0, 1]);
  pushFace(0, 4, 5, 1, [0, -1, 0]);
  pushFace(3, 2, 6, 7, [0, 1, 0]);

  boxShellVertexCount = shellVerts.length / 9;
  boxShellBuffer = makeBuffer("box shell vertices", new Float32Array(shellVerts), GPUBufferUsage.VERTEX);
}

function pushAxisArrowVertex(verts, position, normal, color) {
  verts.push(
    position[0], position[1], position[2],
    normal[0], normal[1], normal[2],
    color[0], color[1], color[2], color[3]
  );
}

function pushAxisArrowTriangle(verts, a, na, b, nb, c, nc, color) {
  pushAxisArrowVertex(verts, a, na, color);
  pushAxisArrowVertex(verts, b, nb, color);
  pushAxisArrowVertex(verts, c, nc, color);
}

function axisArrowBasis(dir) {
  const helper = Math.abs(dir[2]) > 0.82 ? [0, 1, 0] : [0, 0, 1];
  const u = vec3Normalize(vec3Cross(helper, dir));
  const v = vec3Normalize(vec3Cross(dir, u));
  return [u, v];
}

function pushCoordinateAxisArrow(verts, origin, dir, length, color) {
  const d = vec3Normalize(dir);
  const [u, v] = axisArrowBasis(d);
  const segments = Math.max(8, COORDINATE_AXIS_SEGMENTS | 0);
  const shaftRadius = Math.max(0.0005, length * COORDINATE_AXIS_SHAFT_RADIUS_FRACTION);
  const headRadius = Math.max(shaftRadius * 2.0, length * COORDINATE_AXIS_HEAD_RADIUS_FRACTION);
  const headLength = Math.min(length * 0.4, Math.max(headRadius * 2.6, length * COORDINATE_AXIS_HEAD_LENGTH_FRACTION));
  const shaftLength = Math.max(length * 0.1, length - headLength);
  const shaftEnd = [
    origin[0] + d[0] * shaftLength,
    origin[1] + d[1] * shaftLength,
    origin[2] + d[2] * shaftLength,
  ];
  const tip = [
    origin[0] + d[0] * length,
    origin[1] + d[1] * length,
    origin[2] + d[2] * length,
  ];
  const negD = [-d[0], -d[1], -d[2]];
  const radialUnit = (angle) => [
    u[0] * Math.cos(angle) + v[0] * Math.sin(angle),
    u[1] * Math.cos(angle) + v[1] * Math.sin(angle),
    u[2] * Math.cos(angle) + v[2] * Math.sin(angle),
  ];
  const offset = (center, radial, radius) => [
    center[0] + radial[0] * radius,
    center[1] + radial[1] * radius,
    center[2] + radial[2] * radius,
  ];
  const coneNormal = (radial) => vec3Normalize([
    radial[0] * headLength + d[0] * headRadius,
    radial[1] * headLength + d[1] * headRadius,
    radial[2] * headLength + d[2] * headRadius,
  ]);

  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    const r0 = radialUnit(a0);
    const r1 = radialUnit(a1);
    const shaft0 = offset(origin, r0, shaftRadius);
    const shaft1 = offset(origin, r1, shaftRadius);
    const shaftEnd0 = offset(shaftEnd, r0, shaftRadius);
    const shaftEnd1 = offset(shaftEnd, r1, shaftRadius);
    const coneBase0 = offset(shaftEnd, r0, headRadius);
    const coneBase1 = offset(shaftEnd, r1, headRadius);
    const coneN0 = coneNormal(r0);
    const coneN1 = coneNormal(r1);
    const tipNormal = vec3Normalize([
      coneN0[0] + coneN1[0],
      coneN0[1] + coneN1[1],
      coneN0[2] + coneN1[2],
    ]);

    pushAxisArrowTriangle(verts, shaft0, r0, shaft1, r1, shaftEnd0, r0, color);
    pushAxisArrowTriangle(verts, shaft1, r1, shaftEnd1, r1, shaftEnd0, r0, color);
    pushAxisArrowTriangle(verts, origin, negD, shaft1, negD, shaft0, negD, color);
    pushAxisArrowTriangle(verts, coneBase0, coneN0, coneBase1, coneN1, tip, tipNormal, color);
    pushAxisArrowTriangle(verts, shaftEnd, negD, coneBase1, negD, coneBase0, negD, color);
  }
}

function rebuildCoordinateAxes() {
  destroyGpuResource(axisArrowBuffer);
  axisArrowBuffer = null;
  axisArrowVertexCount = 0;
  if (!DRAW_COORDINATE_AXES || simW < 2 || simH < 2 || simD < 2) return;

  const edgeLength = Math.max(1, simW - 1) * params.boxScale;
  const origin = [0, 0, 0];
  const colors = [
    [1.0, 0.357, 0.357, COORDINATE_AXIS_OPACITY],
    [0.345, 0.824, 0.435, COORDINATE_AXIS_OPACITY],
    [0.345, 0.651, 1.0, COORDINATE_AXIS_OPACITY],
  ];
  const verts = [];
  pushCoordinateAxisArrow(verts, origin, [1, 0, 0], edgeLength, colors[0]);
  pushCoordinateAxisArrow(verts, origin, [0, 1, 0], edgeLength, colors[1]);
  pushCoordinateAxisArrow(verts, origin, [0, 0, 1], edgeLength, colors[2]);

  axisArrowVertexCount = verts.length / 10;
  if (axisArrowVertexCount > 0) {
    axisArrowBuffer = makeBuffer("coordinate axis arrow vertices", new Float32Array(verts), GPUBufferUsage.VERTEX);
  }
}

function isInsideFieldLineBox(p, margin) {
  return p[0] >= margin && p[0] <= simW - 1 - margin &&
    p[1] >= margin && p[1] <= simH - 1 - margin &&
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

function rebuildMagneticFieldLines() {
  destroyGpuResource(fieldLineBuffer);
  fieldLineBuffer = null;
  fieldLineVertexCount = 0;
  if (simW < 4 || simH < 4 || simD < 4) return;

  const verts = [];
  const maxP = [simW - 1, simH - 1, simD - 1];
  const margin = 1.35;
  const axis = Math.max(0, Math.min(2, params.bFieldAxis | 0));
  const planeA = (axis + 1) % 3;
  const planeB = (axis + 2) % 3;
  const fracs = [0.20, 0.38, 0.62, 0.80];
  const lo = margin;
  const hi = maxP[axis] - margin;

  for (const fa of fracs) {
    for (const fb of fracs) {
      const radial = Math.hypot(fa - 0.5, fb - 0.5) / Math.SQRT1_2;
      const fade = 1.0 - 0.42 * Math.min(1.0, radial);
      const start = [0, 0, 0];
      const end = [0, 0, 0];
      start[axis] = lo;
      end[axis] = hi;
      start[planeA] = end[planeA] = fa * maxP[planeA];
      start[planeB] = end[planeB] = fb * maxP[planeB];
      if (isInsideFieldLineBox(start, margin) && isInsideFieldLineBox(end, margin)) {
        pushFieldLineSegment(verts, start, end, fade);
      }
    }
  }

  fieldLineVertexCount = verts.length / 9;
  if (fieldLineVertexCount > 0) {
    fieldLineBuffer = makeBuffer("uniform magnetic field line vertices", new Float32Array(verts), GPUBufferUsage.VERTEX);
  }
}

function rebuildSimulation() {
  resizeCanvas();

  const n = Math.max(32, Math.min(MAX_SIM_RES, Math.floor(params.simRes)));
  params.simRes = n;
  simW = n;
  simH = n;
  simD = n;
  voxelCount = simW * simH * simD;
  eigenQuantumPicker.sync();
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
  rebuildCoordinateAxes();
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
  await loadInfoOverlayFont();
  configureCanvas();
  buildPipelines();
  rebuildSimulation();
  updateStats();

  params.trailHalfLife*=0.99;

  let lastFrameTime = performance.now();
  requestAnimationFrame(function loop(now = performance.now()) {
    const dtSeconds = Math.min(0.05, Math.max(0, (now - lastFrameTime) / 1000));
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
      const updateWave = shouldUpdateWave();
      const updateParticles = shouldUpdateParticles();
      if (updateWave || updateParticles) {
        const compute = encoder.beginComputePass({ label: "simulation compute pass" });
        for (let i = 0; i < steps; i++) {
          if (updateWave) waveStep(compute);
          if (updateParticles) particleUpdate(compute);
          simTime += params.dt;
        }
        compute.end();
      } else {
        simTime += params.dt * steps;
      }
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
