import {
  DENSITY_FRAG,
  FULLSCREEN_VERT,
  PARTICLE_FRAG,
  PARTICLE_STAMP_FRAG,
  PARTICLE_VERT,
  TRAIL_FADE_FRAG,
  TRAIL_RENDER_FRAG,
} from "./shaders/sources.js";
import { effectiveDt, effectiveStepsPerFrame, initSimulationSpeedControl, setSimulationFrameDuration } from "../../simulation-speed.js";

const canvas = document.getElementById("c");
const gl = canvas.getContext("webgl2", {
  alpha: false,
  antialias: false,
  depth: false,
  stencil: false,
  premultipliedAlpha: false,
});
if (!gl) throw new Error("WebGL2 is required for KleinTunneling2D.");

const controls = document.getElementById("controls");
const statsEl = document.getElementById("stats");
const resetBtn = document.getElementById("reset");
const pauseBtn = document.getElementById("pause");
const minUiBtn = document.getElementById("minui");
const uiBody = document.getElementById("uibody");
const theoryPanel = document.getElementById("theory");
const theoryBody = document.getElementById("theorybody");
const theoryToggle = document.getElementById("mintheory");

const PI = Math.PI;
const TAU = 2 * Math.PI;
const NX = 256;
const NY = 128;
const SIZE = NX * NY;
const BOX_LX = 12.0;
const BOX_LY = 6.75;
const DX = BOX_LX / NX;
const DY = BOX_LY / NY;
const HBAR = 1.0;
const PACKET_X0 = 2.45;
const ABSORB_WIDTH = 2.0;
const ABSORB_STRENGTH = 65.0;
const ABSORB_POWER = 4.0;
const WALL_MARGIN = 0.85;
const BARRIER_EDGE = 0.075;
const SPECTRAL_SAFETY = 0.62;
const urlParams = new URLSearchParams(window.location.search);
const isEmbedded = urlParams.get("embed") === "1";
const debugEnabled = urlParams.has("debug");
const embeddedAdjustableControls = new Set([
  "packetK",
  "potentialHeight",
  "showParticles",
  "nParticles",]);

function isControlFixed(key) {
  return isEmbedded && !embeddedAdjustableControls.has(key);
}

const params = {
  stepsPerFrame: 1,
  dt: 0.005,
  diracC: 6.0,
  mass: 1.0,
  packetK: 6.0,
  packetAngle: 0.0,
  packetSigma: 0.55,
  potentialHeight: 95.0,
  barrierWidth: 1.10,
  nParticles: 300,
  densityGain: 7.,
  densityGamma: 0.8,
  amplitudeView: 0,
  showParticles: 1,
  showTrail: 1,
  dotSize: 6,
  trailLength: 12,
  trailVisGain: 1.35,
  trailVisGamma: 0.6,
  trailStampGain: 0.55,
};

let paused = false;
let simTime = 0;
let potentialDirty = true;
let particleCount = 0;

const ar = new Float64Array(SIZE);
const ai = new Float64Array(SIZE);
const br = new Float64Array(SIZE);
const bi = new Float64Array(SIZE);
const density = new Float64Array(SIZE);
const velocityX = new Float64Array(SIZE);
const velocityY = new Float64Array(SIZE);
const potential = new Float64Array(SIZE);
const absorber = new Float64Array(SIZE);
const cdf = new Float64Array(SIZE);
const kxValues = new Float64Array(NX);
const kyValues = new Float64Array(NY);

const tempR = new Float64Array(Math.max(NX, NY));
const tempI = new Float64Array(Math.max(NX, NY));

let particleX = new Float32Array(0);
let particleY = new Float32Array(0);
let particleAlive = new Uint8Array(0);

const displayDensityUpload = new Float32Array(SIZE);

let fullscreenVao = null;
let densityProgram = null;
let fadeProgram = null;
let trailProgram = null;
let particleProgram = null;
let particleStampProgram = null;
let densityTexture = null;
let particleBuffer = null;
let particleVao = null;
let particleUpload = new Float32Array(0);
let trailTextures = [null, null];
let trailFbos = [null, null];
let trailReadIndex = 0;
let trailWidth = 0;
let trailHeight = 0;
let trailFormat = null;

let diagnostics = {
  total: 1,
  left: 1,
  barrier: 0,
  right: 0,
  maxRho: 1,
  aliveParticles: 0,
  particleLeft: 0,
  particleBarrier: 0,
  particleRight: 0,
  effectivePotential: 95.0,
  potentialCap: 95.0,
};

for (let ix = 0; ix < NX; ix++) {
  const mode = ix < NX / 2 ? ix : ix - NX;
  kxValues[ix] = TAU * mode / BOX_LX;
}

for (let iy = 0; iy < NY; iy++) {
  const mode = iy < NY / 2 ? iy : iy - NY;
  kyValues[iy] = TAU * mode / BOX_LY;
}

rebuildAbsorber();

function index(ix, iy) {
  return iy * NX + ix;
}

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

function rebuildAbsorber() {
  const dt = simulationDt();
  for (let iy = 0; iy < NY; iy++) {
    const y = (iy + 0.5) * DY;
    for (let ix = 0; ix < NX; ix++) {
      const x = (ix + 0.5) * DX;
      const edgeDist = Math.min(x, BOX_LX - x, y, BOX_LY - y);
      let a = 1.0;
      if (edgeDist < ABSORB_WIDTH) {
        const s = (ABSORB_WIDTH - edgeDist) / ABSORB_WIDTH;
        const ramp = s * s * (3.0 - 2.0 * s);
        a = Math.exp(-ABSORB_STRENGTH * Math.pow(ramp, ABSORB_POWER) * dt);
      }
      absorber[index(ix, iy)] = a;
    }
  }
}

initSimulationSpeedControl({ visible: !isEmbedded, onChange: rebuildAbsorber });

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

function addSlider(key, label, min, max, step, onChange = null, live = false) {
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
    if (live && onChange) onChange();
    updateStats();
  });

  input.addEventListener("change", () => {
    if (!live && onChange) onChange();
    updateStats();
  });

  row.appendChild(lab);
  row.appendChild(input);
  row.appendChild(val);
  controls.appendChild(row);
}

function addToggleInt(key, label, onChange = null) {
  if (isControlFixed(key)) return;
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
    updateStats();
  });

  const val = document.createElement("div");
  val.className = "val";

  row.appendChild(lab);
  row.appendChild(btn);
  row.appendChild(val);
  controls.appendChild(row);
}

function addToggleChoice(key, label, offText, onText, onChange = null) {
  if (isControlFixed(key)) return;
  const row = document.createElement("div");
  row.className = "row no-value";

  const lab = document.createElement("label");
  lab.textContent = label;

  const btn = document.createElement("button");
  btn.style.flex = "1";
  const sync = () => { btn.textContent = params[key] ? onText : offText; };
  sync();
  btn.addEventListener("click", () => {
    params[key] = params[key] ? 0 : 1;
    sync();
    if (onChange) onChange(params[key]);
    updateStats();
  });

  const val = document.createElement("div");
  val.className = "val";

  row.appendChild(lab);
  row.appendChild(btn);
  row.appendChild(val);
  controls.appendChild(row);
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

addSectionHeader("Simulation");
//addSlider("stepsPerFrame", "Steps/frame", 1, 5, 1);
addSlider("dt", "dt", 0.0003, 0.004, 0.0001, rebuildAbsorber);

addSectionHeader("Dirac Packet");
addSlider("diracC", "Dirac c", 2.0, 12.0, 0.1, resetAll);
addSlider("mass", "mass", 0.2, 2.0, 0.05, resetAll);
addSlider("packetK", "mean k", 2.0, 10.0, 0.1, resetAll);
addSlider("packetAngle", "angle deg", -35.0, 35.0, 1.0, resetAll);
addSlider("packetSigma", "packet width", 0.30, 1.05, 0.01, resetAll);

addSectionHeader("Potential Wall");
addSlider("potentialHeight", "potential strength", 0.0, 180.0, 1.0, updateWall, true);
addSlider("barrierWidth", "wall width", 0.25, 2.6, 0.05, updateWall, true);

addSectionHeader("Visual Parameters");
//addSlider("densityGain", "density gain", 0.4, 8.0, 0.1);
//addSlider("densityGamma", "density gamma", 0.25, 1.2, 0.05);
addToggleChoice("amplitudeView", "amp view", "Total", "Lower");
addToggleInt("showParticles", "show particles");

addSlider("nParticles", "particle count", 1, 500, 10, resetAll);
addSlider("dotSize", "particle size", 2.0, 10.0, 1);
addToggleInt("showTrail", "draw trails", (value) => { if (!value) clearTrail(); });
addSlider("trailLength", "trail length", 2.0, 40.0, 1);
removeEmptySectionHeaders();


function barrierBounds() {
  const width = Math.max(0.05, Math.min(BOX_LX - 2.0 * WALL_MARGIN, params.barrierWidth));
  const center = 0.5 * BOX_LX;
  return {
    left: center - 0.5 * width,
    right: center + 0.5 * width,
  };
}

function packetWaveVector() {
  const angle = params.packetAngle * PI / 180;
  return {
    kx: params.packetK * Math.cos(angle),
    ky: params.packetK * Math.sin(angle),
  };
}

function incidentEnergy() {
  const c = Math.max(params.diracC, 1e-9);
  const m = Math.max(params.mass, 1e-9);
  const M = m * c * c;
  const k = Math.max(params.packetK, 1e-9);
  const ck = HBAR * c * k;
  return Math.sqrt(ck * ck + M * M);
}

function resolvedPotentialCap() {
  const c = Math.max(params.diracC, 1e-9);
  const m = Math.max(params.mass, 1e-9);
  const M = m * c * c;
  const kSafe = SPECTRAL_SAFETY * PI / DX;
  return incidentEnergy() + Math.sqrt(M * M + (HBAR * c * kSafe) ** 2);
}

function effectivePotentialHeight() {
  return Math.min(params.potentialHeight, resolvedPotentialCap());
}

function mixRgb(a, b, t) {
  const u = Math.max(0, Math.min(1, t));
  return [
    a[0] + (b[0] - a[0]) * u,
    a[1] + (b[1] - a[1]) * u,
    a[2] + (b[2] - a[2]) * u,
  ];
}

function barrierRegimeColor() {
  const E = incidentEnergy();
  const M = params.mass * params.diracC * params.diracC;
  const V = effectivePotentialHeight();
  const green = [0.20, 0.92, 0.36];
  const red = [1.00, 0.12, 0.08];
  const yellow = [1.00, 0.86, 0.12];

  if (V < E) return green;
  if (V < E + M) return red;

  const excess = Math.max(0, V - (E + M));
  const scale = Math.max(M, 0.25 * E, 1e-6);
  const ease = 1 - Math.exp(-excess / scale);
  return mixRgb(yellow, green, ease);
}

function updatePotential() {
  const { left, right } = barrierBounds();
  const edge = Math.max(0.02, BARRIER_EDGE);
  const height = effectivePotentialHeight();
  for (let iy = 0; iy < NY; iy++) {
    for (let ix = 0; ix < NX; ix++) {
      const x = (ix + 0.5) * DX;
      const inside = 0.5 * (Math.tanh((x - left) / edge) - Math.tanh((x - right) / edge));
      potential[index(ix, iy)] = height * inside;
    }
  }
  potentialDirty = false;
}

function updateWall() {
  potentialDirty = true;
  updatePotential();
  updateDensityVelocity();
}

function positiveEnergySpinor(kx, ky) {
  const c = Math.max(params.diracC, 1e-9);
  const m = Math.max(params.mass, 1e-9);
  const M = m * c * c;
  const ck = HBAR * c * Math.hypot(kx, ky);
  const E = Math.sqrt(ck * ck + M * M);
  const upper = Math.sqrt((E + M) / (2 * E));
  const lowerCoeff = upper * HBAR * c / Math.max(E + M, 1e-12);
  return {
    upper,
    lowerR: lowerCoeff * kx,
    lowerI: lowerCoeff * ky,
  };
}

function resetWave() {
  const { kx, ky } = packetWaveVector();
  const sigma = Math.max(params.packetSigma, 1e-4);
  const spinor = positiveEnergySpinor(kx, ky);
  const y0 = 0.5 * BOX_LY;

  for (let iy = 0; iy < NY; iy++) {
    const y = (iy + 0.5) * DY;
    for (let ix = 0; ix < NX; ix++) {
      const x = (ix + 0.5) * DX;
      const dx = (x - PACKET_X0) / sigma;
      const dy = (y - y0) / sigma;
      const env = Math.exp(-0.5 * (dx * dx + dy * dy));
      const phase = kx * x + ky * (y - y0);
      const cr = Math.cos(phase);
      const ci = Math.sin(phase);
      const k = index(ix, iy);

      ar[k] = spinor.upper * env * cr;
      ai[k] = spinor.upper * env * ci;
      br[k] = env * (spinor.lowerR * cr - spinor.lowerI * ci);
      bi[k] = env * (spinor.lowerR * ci + spinor.lowerI * cr);
    }
  }

  let norm = 0;
  for (let k = 0; k < SIZE; k++) {
    norm += (ar[k] * ar[k] + ai[k] * ai[k] + br[k] * br[k] + bi[k] * bi[k]) * DX * DY;
  }
  const scale = 1 / Math.sqrt(Math.max(norm, 1e-30));
  for (let k = 0; k < SIZE; k++) {
    ar[k] *= scale;
    ai[k] *= scale;
    br[k] *= scale;
    bi[k] *= scale;
  }
}

function fft1d(re, im, n, inverse) {
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      let tr = re[i]; re[i] = re[j]; re[j] = tr;
      let ti = im[i]; im[i] = im[j]; im[j] = ti;
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const ang = (inverse ? 2 : -2) * PI / len;
    const wlenR = Math.cos(ang);
    const wlenI = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let wr = 1;
      let wi = 0;
      const half = len >> 1;
      for (let j = 0; j < half; j++) {
        const uR = re[i + j];
        const uI = im[i + j];
        const vR = re[i + j + half] * wr - im[i + j + half] * wi;
        const vI = re[i + j + half] * wi + im[i + j + half] * wr;
        re[i + j] = uR + vR;
        im[i + j] = uI + vI;
        re[i + j + half] = uR - vR;
        im[i + j + half] = uI - vI;
        const nextWr = wr * wlenR - wi * wlenI;
        wi = wr * wlenI + wi * wlenR;
        wr = nextWr;
      }
    }
  }

  if (inverse) {
    const inv = 1 / n;
    for (let i = 0; i < n; i++) {
      re[i] *= inv;
      im[i] *= inv;
    }
  }
}

function fft2d(re, im, inverse) {
  for (let iy = 0; iy < NY; iy++) {
    const row = iy * NX;
    for (let ix = 0; ix < NX; ix++) {
      tempR[ix] = re[row + ix];
      tempI[ix] = im[row + ix];
    }
    fft1d(tempR, tempI, NX, inverse);
    for (let ix = 0; ix < NX; ix++) {
      re[row + ix] = tempR[ix];
      im[row + ix] = tempI[ix];
    }
  }

  for (let ix = 0; ix < NX; ix++) {
    for (let iy = 0; iy < NY; iy++) {
      const k = index(ix, iy);
      tempR[iy] = re[k];
      tempI[iy] = im[k];
    }
    fft1d(tempR, tempI, NY, inverse);
    for (let iy = 0; iy < NY; iy++) {
      const k = index(ix, iy);
      re[k] = tempR[iy];
      im[k] = tempI[iy];
    }
  }
}

function applyPotentialHalf(dt) {
  const h = 0.5 * dt / HBAR;
  for (let k = 0; k < SIZE; k++) {
    const phase = -potential[k] * h;
    const cr = Math.cos(phase);
    const ci = Math.sin(phase);

    let r = ar[k] * cr - ai[k] * ci;
    let q = ar[k] * ci + ai[k] * cr;
    ar[k] = r;
    ai[k] = q;

    r = br[k] * cr - bi[k] * ci;
    q = br[k] * ci + bi[k] * cr;
    br[k] = r;
    bi[k] = q;
  }
}

function applyKineticMass(dt) {
  const c = Math.max(params.diracC, 1e-9);
  const m = Math.max(params.mass, 1e-9);
  const M = m * c * c;

  fft2d(ar, ai, false);
  fft2d(br, bi, false);

  for (let iy = 0; iy < NY; iy++) {
    const ky = kyValues[iy];
    for (let ix = 0; ix < NX; ix++) {
      const k = index(ix, iy);
      const kx = kxValues[ix];
      const bx = HBAR * c * kx;
      const by = -HBAR * c * ky;
      const E = Math.sqrt(M * M + bx * bx + by * by);
      const theta = E * dt / HBAR;
      const co = Math.cos(theta);
      const s = Math.sin(theta) / Math.max(E, 1e-12);

      const aR = ar[k];
      const aI = ai[k];
      const bR = br[k];
      const bI = bi[k];

      const hAR = M * aR + bx * bR - by * bI;
      const hAI = M * aI + bx * bI + by * bR;
      const hBR = bx * aR + by * aI - M * bR;
      const hBI = bx * aI - by * aR - M * bI;

      ar[k] = co * aR + s * hAI;
      ai[k] = co * aI - s * hAR;
      br[k] = co * bR + s * hBI;
      bi[k] = co * bI - s * hBR;
    }
  }

  fft2d(ar, ai, true);
  fft2d(br, bi, true);
}

function applyAbsorber() {
  for (let k = 0; k < SIZE; k++) {
    const a = absorber[k];
    ar[k] *= a;
    ai[k] *= a;
    br[k] *= a;
    bi[k] *= a;
  }
}

function stepWave(dt) {
  if (potentialDirty) updatePotential();
  applyPotentialHalf(dt);
  applyKineticMass(dt);
  applyPotentialHalf(dt);
  applyAbsorber();
}

function updateDensityVelocity() {
  const { left, right } = barrierBounds();
  const c = Math.max(params.diracC, 1e-9);
  let total = 0;
  let leftProb = 0;
  let barrierProb = 0;
  let rightProb = 0;
  let maxRho = 0;

  for (let iy = 0; iy < NY; iy++) {
    for (let ix = 0; ix < NX; ix++) {
      const k = index(ix, iy);
      const rho = ar[k] * ar[k] + ai[k] * ai[k] + br[k] * br[k] + bi[k] * bi[k];
      const jx = 2 * c * (ar[k] * br[k] + ai[k] * bi[k]);
      const jy = 2 * c * (ar[k] * bi[k] - ai[k] * br[k]);
      const x = (ix + 0.5) * DX;
      const p = rho * DX * DY;

      density[k] = rho;
      velocityX[k] = jx / Math.max(rho, 1e-14);
      velocityY[k] = jy / Math.max(rho, 1e-14);
      total += p;
      maxRho = Math.max(maxRho, rho);

      if (x < left) leftProb += p;
      else if (x > right) rightProb += p;
      else barrierProb += p;
    }
  }

  let alive = 0;
  let particleLeft = 0;
  let particleBarrier = 0;
  let particleRight = 0;
  for (let p = 0; p < particleCount; p++) {
    if (!particleAlive[p]) continue;
    alive++;
    if (particleX[p] < left) particleLeft++;
    else if (particleX[p] > right) particleRight++;
    else particleBarrier++;
  }

  diagnostics = {
    total,
    left: leftProb,
    barrier: barrierProb,
    right: rightProb,
    maxRho: Math.max(maxRho, 1e-12),
    aliveParticles: alive,
    particleLeft,
    particleBarrier,
    particleRight,
    effectivePotential: effectivePotentialHeight(),
    potentialCap: resolvedPotentialCap(),
  };
}

function rebuildParticleBuffers() {
  particleCount = Math.max(0, Math.floor(params.nParticles));
  particleX = new Float32Array(particleCount);
  particleY = new Float32Array(particleCount);
  particleAlive = new Uint8Array(particleCount);
}

function rebuildParticles() {
  updateDensityVelocity();
  rebuildParticleBuffers();

  let sum = 0;
  for (let k = 0; k < SIZE; k++) {
    sum += density[k];
    cdf[k] = sum;
  }

  for (let p = 0; p < particleCount; p++) {
    const r = Math.random() * Math.max(sum, 1e-30);
    let lo = 0;
    let hi = SIZE - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    const ix = lo % NX;
    const iy = Math.floor(lo / NX);
    particleX[p] = (ix + Math.random()) * DX;
    particleY[p] = (iy + Math.random()) * DY;
    particleAlive[p] = 1;
  }

  clearTrail();
}

function sampleVelocity(x, y) {
  const gx = x / DX - 0.5;
  const gy = y / DY - 0.5;
  const ix = Math.max(0, Math.min(NX - 2, Math.floor(gx)));
  const iy = Math.max(0, Math.min(NY - 2, Math.floor(gy)));
  const fx = Math.max(0, Math.min(1, gx - ix));
  const fy = Math.max(0, Math.min(1, gy - iy));
  const k00 = index(ix, iy);
  const k10 = k00 + 1;
  const k01 = k00 + NX;
  const k11 = k01 + 1;
  const w00 = (1 - fx) * (1 - fy);
  const w10 = fx * (1 - fy);
  const w01 = (1 - fx) * fy;
  const w11 = fx * fy;
  return {
    x: velocityX[k00] * w00 + velocityX[k10] * w10 + velocityX[k01] * w01 + velocityX[k11] * w11,
    y: velocityY[k00] * w00 + velocityY[k10] * w10 + velocityY[k01] * w01 + velocityY[k11] * w11,
  };
}

function updateParticles(dt) {
  if (!particleCount) return;
  for (let p = 0; p < particleCount; p++) {
    if (!particleAlive[p]) continue;
    const x = particleX[p];
    const y = particleY[p];
    const v1 = sampleVelocity(x, y);
    const mx = x + 0.5 * dt * v1.x;
    const my = y + 0.5 * dt * v1.y;
    const v2 = sampleVelocity(mx, my);
    const nx = x + v2.x * dt;
    const ny = y + v2.y * dt;
    if (nx <= 0 || nx >= BOX_LX || ny <= 0 || ny >= BOX_LY) {
      particleAlive[p] = 0;
    } else {
      particleX[p] = nx;
      particleY[p] = ny;
    }
  }
}

function updateSimulation() {
  const steps = simulationStepsPerFrame();
  const dt = simulationDt();
  for (let s = 0; s < steps; s++) {
    stepWave(dt);
    updateDensityVelocity();
    updateParticles(dt);
    simTime += dt;
  }
}

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || "unknown shader error";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function createProgram(vertexSource, fragmentSource) {
  const program = gl.createProgram();
  const vertex = compileShader(gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || "unknown program link error";
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function createTexture(width, height, internalFormat, format, type, filter, data = null) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, data);
  return tex;
}

function createFramebuffer(tex) {
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error(`Incomplete WebGL framebuffer: 0x${status.toString(16)}`);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return fbo;
}

function initWebGLRenderer() {
  const hasFloatTargets = Boolean(gl.getExtension("EXT_color_buffer_float"));
  const hasFloatLinear = Boolean(gl.getExtension("OES_texture_float_linear"));
  const dataFilter = hasFloatLinear ? gl.LINEAR : gl.NEAREST;
  trailFormat = {
    internal: hasFloatTargets ? gl.RGBA16F : gl.RGBA8,
    type: hasFloatTargets ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE,
    filter: hasFloatLinear ? gl.LINEAR : gl.NEAREST,
  };

  fullscreenVao = gl.createVertexArray();
  densityProgram = createProgram(FULLSCREEN_VERT, DENSITY_FRAG);
  fadeProgram = createProgram(FULLSCREEN_VERT, TRAIL_FADE_FRAG);
  trailProgram = createProgram(FULLSCREEN_VERT, TRAIL_RENDER_FRAG);
  particleProgram = createProgram(PARTICLE_VERT, PARTICLE_FRAG);
  particleStampProgram = createProgram(PARTICLE_VERT, PARTICLE_STAMP_FRAG);

  densityTexture = createTexture(NX, NY, gl.R32F, gl.RED, gl.FLOAT, dataFilter);

  particleBuffer = gl.createBuffer();
  particleVao = gl.createVertexArray();
  gl.bindVertexArray(particleVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.clearColor(0, 0, 0, 1);
}

function resizeCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    rebuildTrailTargets(w, h);
    return true;
  }
  return false;
}

function rebuildTrailTargets(width, height) {
  if (!trailFormat) return;

  for (let i = 0; i < 2; i++) {
    if (trailFbos[i]) gl.deleteFramebuffer(trailFbos[i]);
    if (trailTextures[i]) gl.deleteTexture(trailTextures[i]);
    trailTextures[i] = createTexture(
      width,
      height,
      trailFormat.internal,
      gl.RGBA,
      trailFormat.type,
      trailFormat.filter
    );
    trailFbos[i] = createFramebuffer(trailTextures[i]);
  }

  trailWidth = width;
  trailHeight = height;
  trailReadIndex = 0;
  clearTrail();
}

function clearTrail() {
  if (!trailFbos[0] || !trailFbos[1]) return;
  gl.disable(gl.BLEND);
  gl.viewport(0, 0, trailWidth, trailHeight);
  for (let i = 0; i < 2; i++) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, trailFbos[i]);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.clearColor(0, 0, 0, 1);
}

function uploadDisplayDensity() {
  for (let k = 0; k < SIZE; k++) {
    displayDensityUpload[k] = params.amplitudeView ? br[k] * br[k] + bi[k] * bi[k] : density[k];
  }

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, densityTexture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, NX, NY, gl.RED, gl.FLOAT, displayDensityUpload);
}

function uploadParticleBuffer() {
  const needed = particleCount * 4;
  if (particleUpload.length !== needed) particleUpload = new Float32Array(needed);
  for (let p = 0; p < particleCount; p++) {
    const o = p * 4;
    particleUpload[o + 0] = particleX[p];
    particleUpload[o + 1] = particleY[p];
    particleUpload[o + 2] = particleAlive[p] ? 1 : 0;
    particleUpload[o + 3] = 0;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, particleUpload, gl.DYNAMIC_DRAW);
}

function drawFullscreen(program) {
  gl.useProgram(program);
  gl.bindVertexArray(fullscreenVao);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.bindVertexArray(null);
}

function particlePixelScale() {
  return canvas.width / Math.max(1, canvas.clientWidth);
}

function drawParticlePoints(program, trail = false) {
  if (!particleCount) return;

  const scale = particlePixelScale();
  const pointSize = Math.max(2, params.dotSize * 2.35 * scale);
  const trailSize = Math.max(1, pointSize * 0.7);

  gl.useProgram(program);
  gl.bindVertexArray(particleVao);
  gl.uniform2f(gl.getUniformLocation(program, "uBoxSize"), BOX_LX, BOX_LY);
  gl.uniform1f(gl.getUniformLocation(program, "uPointSize"), pointSize);
  gl.uniform1i(gl.getUniformLocation(program, "uNumParticles"), particleCount);
  gl.uniform1f(gl.getUniformLocation(program, "uTrailWidth"), trail ? trailSize : 0);
  gl.uniform1f(gl.getUniformLocation(program, "uDotSigma"), trail ? 0.28 : 0.18);
  gl.uniform1f(gl.getUniformLocation(program, "uDotGain"), trail ? 1.0 : 0.72);

  const stampGain = gl.getUniformLocation(program, "uStampGain");
  if (stampGain) gl.uniform1f(stampGain, params.trailStampGain);

  gl.drawArrays(gl.POINTS, 0, particleCount);
  gl.bindVertexArray(null);
}

function updateTrailTexture() {
  if (!trailFbos[0] || !trailFbos[1]) return;

  const src = trailReadIndex;
  const dst = 1 - src;

  gl.bindFramebuffer(gl.FRAMEBUFFER, trailFbos[dst]);
  gl.viewport(0, 0, trailWidth, trailHeight);
  gl.disable(gl.BLEND);

  gl.useProgram(fadeProgram);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, trailTextures[src]);
  gl.uniform1i(gl.getUniformLocation(fadeProgram, "uTrail"), 0);
  const fade = Math.exp(-1 / Math.max(1, params.trailLength));
  gl.uniform1f(gl.getUniformLocation(fadeProgram, "uFade"), fade);
  drawFullscreen(fadeProgram);

  if (params.showParticles && particleCount) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    drawParticlePoints(particleStampProgram, true);
    gl.disable(gl.BLEND);
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  trailReadIndex = dst;
}

function render(advanceTrails = !paused) {
  resizeCanvas();
  const { left, right } = barrierBounds();

  uploadDisplayDensity();
  if (params.showParticles) uploadParticleBuffer();
  if (params.showTrail && advanceTrails) updateTrailTexture();

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.disable(gl.BLEND);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(densityProgram);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, densityTexture);
  gl.uniform1i(gl.getUniformLocation(densityProgram, "uDensity"), 0);
  gl.uniform2f(gl.getUniformLocation(densityProgram, "uBoxSize"), BOX_LX, BOX_LY);
  gl.uniform2f(gl.getUniformLocation(densityProgram, "uBarrier"), left, right);
  gl.uniform1f(gl.getUniformLocation(densityProgram, "uDensityGain"), params.densityGain);
  gl.uniform1f(gl.getUniformLocation(densityProgram, "uDensityGamma"), params.densityGamma);
  gl.uniform1f(gl.getUniformLocation(densityProgram, "uPotentialStrength"), effectivePotentialHeight() / 130);
  gl.uniform3fv(gl.getUniformLocation(densityProgram, "uBarrierColor"), barrierRegimeColor());
  drawFullscreen(densityProgram);

  if (params.showTrail && trailTextures[trailReadIndex]) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR);
    gl.useProgram(trailProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, trailTextures[trailReadIndex]);
    gl.uniform1i(gl.getUniformLocation(trailProgram, "uTrail"), 0);
    gl.uniform1f(gl.getUniformLocation(trailProgram, "uGain"), params.trailVisGain);
    gl.uniform1f(gl.getUniformLocation(trailProgram, "uGamma"), params.trailVisGamma);
    drawFullscreen(trailProgram);
  }

  if (params.showParticles) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    drawParticlePoints(particleProgram, false);
  }

  gl.disable(gl.BLEND);
}

function regimeText() {
  const E = incidentEnergy();
  const M = params.mass * params.diracC * params.diracC;
  const V = effectivePotentialHeight();
  if (V < E) return "above barrier";
  if (V < E + M) return "tunneling gap";
  return "Klein zone";
}

function updateStats() {
  if (!statsEl) return;
  const E = incidentEnergy();
  const M = params.mass * params.diracC * params.diracC;
  const Veff = effectivePotentialHeight();
  const clipped = Veff < params.potentialHeight - 1e-6;
  statsEl.innerHTML =
    `<b>E</b>: ${fmt(E)} &nbsp; <b>mc^2</b>: ${fmt(M)} &nbsp; ` +
    `<b>V</b>: ${fmt(Veff)}${clipped ? ` clipped` : ""} &nbsp; <b>Klein V</b>: ${fmt(E + M)}<br>` +
    `<b>Regime</b>: ${regimeText()} &nbsp; <b>t</b>: ${fmt(simTime)} &nbsp; ` +
    `<b>view</b>: ${params.amplitudeView ? "Lower" : "Total"} &nbsp; ` +
    `<b>alive</b>: ${diagnostics.aliveParticles}<br>` +
    `<b>P</b>: ${fmt(diagnostics.total)} &nbsp; ` +
    `<b>L</b>: ${fmt(diagnostics.left)} &nbsp; ` +
    `<b>wall</b>: ${fmt(diagnostics.barrier)} &nbsp; ` +
    `<b>R</b>: ${fmt(diagnostics.right)}`;
}

function resetAll() {
  simTime = 0;
  potentialDirty = true;
  updatePotential();
  resetWave();
  updateDensityVelocity();
  rebuildParticles();
  updateStats();
}

function installDebugHooks() {
  window.KleinTunneling2DTest = {
    state() {
      return {
        paused,
        simTime,
        particleCount,
        params: { ...params },
        diagnostics: { ...diagnostics },
      };
    },
    setPaused(value) {
      paused = Boolean(value);
      pauseBtn.textContent = paused ? "Resume" : "Pause";
      return this.state();
    },
    setParams(next, reset = false) {
      Object.assign(params, next);
      potentialDirty = true;
      if (reset) resetAll();
      else {
        updatePotential();
        updateStats();
      }
      return this.state();
    },
    reset() {
      resetAll();
      render();
      return this.state();
    },
    advance(frames = 1) {
      const n = Math.max(0, Math.floor(frames));
      for (let i = 0; i < n; i++) updateSimulation();
      render(n > 0);
      updateStats();
      return this.state();
    },
  };
}

resetBtn.addEventListener("click", resetAll);
function setPausedState(nextPaused) {
  paused = Boolean(nextPaused);
  pauseBtn.textContent = paused ? "Resume" : "Pause";
}

pauseBtn.addEventListener("click", () => setPausedState(!paused));

if (isEmbedded) {
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type !== "qontic:set-paused" || !event.data.paused) return;
    setPausedState(true);
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
  clearTrail();
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
  if (open) window.MathJax?.typesetPromise?.([theoryBody])?.catch(() => {});
});

initWebGLRenderer();
resizeCanvas();
resetAll();
if (debugEnabled) installDebugHooks();

let lastFrameTime = performance.now();
requestAnimationFrame(function loop(now = performance.now()) {
  const frameSeconds = Math.min(0.05, Math.max(0, (now - lastFrameTime) / 1000));
  lastFrameTime = now;
  setSimulationFrameDuration(frameSeconds);
  if (!paused) updateSimulation();
  render();
  updateStats();
  requestAnimationFrame(loop);
});
