// =============================================================================
//  Free Particle Quantum Simulation
//  Q-Ontic Lab — qonticlab.rice.edu
//
//  Models the 1D free particle: the simplest quantum system that already
//  diverges dramatically from classical intuition.
//
//  Wavefunction mode:
//    "Wave packet" — Gaussian-modulated packet with group velocity
//
//  Detector panel (right edge):
//    A finite-width position detector sits at a configurable x-position.
//    In every supported interpretation the detector "fires" when the
//    Bohmian particle enters its window.
//
//  Interpretations:
//    Copenhagen — collapse on detection; particle has no trajectory before
//                 measurement; |ψ|² gives prediction probabilities.
//    Pilot-Wave — the Bohmian particle rides the guidance field
//                 v = (ħ/m) Im(∂ₓψ / ψ). Detection occurs when the
//                 definite particle position enters the detector.
//    Many-Worlds — no collapse; the branch containing the detector and
//                  the branch without "separate"; a distinct colour marks
//                  the post-detection branch amplitude.
//
//  Physics units used internally:
//    length  : nm   (1 nm = 1e-9 m)
//    time    : fs   (1 fs = 1e-15 s)
//    mass    : same as electron mass in kg, scaled by (nm/fs)² / eV
//    energy  : eV
//
//  All rendering is done on three stacked HTML5 Canvas elements:
//    waveCanvas  — wavefunction / |ψ|² / phase
//    partCanvas  — Bohmian particle (pilot-wave mode)
//    detCanvas   — detector graphic & fired indicator
// =============================================================================

'use strict';

// Cached once per theme change, never queried inside the pixel loop.
let fpLightCanvas = document.documentElement.dataset.theme !== 'dark';
const fpCanvasColor = (dark, light) => fpLightCanvas ? light : dark;
new MutationObserver(() => {
  fpLightCanvas = document.documentElement.dataset.theme !== 'dark';
  if (fpWaveCtx) fpRender();
}).observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});

// ---------------------------------------------------------------------------
// Physical constants (internal units: nm, fs, eV)
// ---------------------------------------------------------------------------
const FP_HBAR_EV_FS = 6.582119569e-1;   // eV·fs  (ħ in eV·s × 1e15)
const FP_MASS_EV    = 5.6856301;          // eV·fs²/nm²  (m_e = 9.109e-31 kg in nm/fs/eV units)

// ---------------------------------------------------------------------------
// Simulation state
// ---------------------------------------------------------------------------
let fp = {
  // ── mode ──────────────────────────────────────────────────────────────────
  waveMode        : 'packet',   // packet-only mode
  interpMode      : 'pilotwave',// 'copenhagen' | 'pilotwave' | 'manyworlds'
  displayMode     : 'prob',     // 'prob' | 'real' | 'imag' | 'phase'
  showPilotWave   : true,       // visual preference only; guidance stays active

  // ── physical parameters ───────────────────────────────────────────────────
  energy_eV       : 1.0,        // kinetic energy in eV  → sets k, omega
  sigma0_nm       : 2.0,        // initial spatial width of Gaussian (packet mode)
  sigmaY0_nm      : 33.0,       // initial vertical spread of 2D packet
  x0_nm           : -20.0,      // initial centre of packet
  detectorX_nm    : 30.0,       // position of detector (nm)
  detectorW_nm    : 4.0,        // half-width of detector window (nm)
  absorbGamma_fs  : 0.02,       // effective absorption rate [1/fs] in detector strip
  absorbEdge_nm   : 1.5,        // smooth edge width for absorber profile

  // ── derived ───────────────────────────────────────────────────────────────
  k_nm            : 0,          // wave-vector  [1/nm]
  kx_nm           : 0,
  ky_nm           : 0,
  omega_fs        : 0,          // angular frequency [1/fs]
  vGroup_nm_fs    : 0,          // group velocity [nm/fs]
  vGroupX_nm_fs   : 0,
  vGroupY_nm_fs   : 0,
  vPhase_nm_fs    : 0,          // phase velocity [nm/fs]
  launchAngle_deg : 0,          // legacy; not used in dynamics

  // ── time ──────────────────────────────────────────────────────────────────
  time_fs         : 0,
  dt_fs           : 0.5,
  running         : false,
  animId          : null,
  autoNextCycle   : true,
  autoDtScale     : 1,
  speed           : 1,          // continuous multiplier of the automatic preview pace
  _lastFrameTime_ms: null,
  collapseElapsed_ms: 0,        // presentation time only; never advances the physics
  _collapseVisual : null,

  // ── world geometry ────────────────────────────────────────────────────────
  xMin_nm         : -50,
  xMax_nm         :  50,
  yMin_nm         : -30,
  yMax_nm         :  30,

  // ── Bohmian particle ──────────────────────────────────────────────────────
  bPos_nm         : -20.0,      // current particle position
  bPosY_nm        : 0.0,        // physical y position in nm
  bPos_y          : 0.5,        // vertical position (0=top,1=bottom) — display only
  bTrail          : [],         // [{x, y, t}] history
  bDetected       : false,      // has detector fired?
  bDetectedTime   : null,
  postDetectFrames: 0,          // frames since detection fired (auto-advance timer)

  // ── many-worlds branch ────────────────────────────────────────────────────
  mwFired             : false,
  mwFireTime          : null,
  mwBranchPath        : [],         // section indices chosen: [s0, s1, ...]
  mwWaitingForChoice  : false,      // simulation paused – user must click a branch
  mwChoiceCommitted   : false,      // this run's MW branch already tallied into histogram
  mwChoiceMode        : 'auto',     // 'auto' follows Born weights; 'manual' waits for a click
  mwChoiceDelay_ms    : 1500,
  mwChoiceElapsed_ms  : 0,
  mwZoom              : null,       // selected-branch camera animation
  eventCommitted      : false,      // this run's detection already tallied into histogram

  // ── detection stats ───────────────────────────────────────────────────────
  nTrials         : 0,          // run counter
  nHits           : 0,          // runs where a detection occurred
  histogram       : [],         // (legacy)
  nSections       : 6,          // number of vertical detector pixels
  sectionHits     : [],         // hit count per band  [nSections]
  sectionExpected : [],         // accumulated expected hits per band from |psi|^2 model
  bDetectedSection: -1,         // which band fired this run (-1 = none)
  _mwSplit        : false,      // MW branch canvases built for this run
  _mwSnapProb     : null,       // Float64Array snapshot of |ψ|² at branching moment
  _mwSnapMaxP     : 1e-12,      // corresponding max prob for normalization
  _mwBranchProb   : null,       // normalized detector-section weights at the split

  // ── grid for wavefunction ─────────────────────────────────────────────────
  NX              : 800,        // number of spatial grid points
  psiRe           : null,       // Float64Array length NX
  psiIm           : null,
  prob            : null,       // |ψ|²
};

// ---------------------------------------------------------------------------
// Palette  (reuses the project palette mechanism if available, else built-in)
// ---------------------------------------------------------------------------
function fpColor(t) {
  // "Inferno"-like palette from black → purple → orange → yellow
  t = Math.max(0, Math.min(1, t));
  const stops = [
    [0,   [0,   0,   0  ]],
    [0.25,[72,  0,  101  ]],
    [0.5, [179, 58,  30  ]],
    [0.75,[237, 149, 32  ]],
    [1.0, [252, 255, 164 ]],
  ];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const lo = stops[i-1], hi = stops[i];
      const f  = (t - lo[0]) / (hi[0] - lo[0]);
      const r  = Math.round(lo[1][0] + f*(hi[1][0] - lo[1][0]));
      const g  = Math.round(lo[1][1] + f*(hi[1][1] - lo[1][1]));
      const b  = Math.round(lo[1][2] + f*(hi[1][2] - lo[1][2]));
      return `rgb(${r},${g},${b})`;
    }
  }
  return 'rgb(252,255,164)';
}

// Phase palette: maps [0, 2π] → hue wheel
function fpPhaseColor(phase) {
  const h = ((phase / (2*Math.PI)) % 1 + 1) % 1 * 360;
  return `hsl(${h.toFixed(1)},90%,55%)`;
}

// DoubleSlit2.0/shaders/wave_render.frag and its ungrouped yellow particles.
// Keep the legacy palettes above for Many-Worlds. Lookup tables avoid per-pixel
// trigonometry in the Canvas renderer.
const FP_WAVE_AMPLITUDE_CUTOFF = 0.001;
const FP_PHASE_AMOUNT = 0.77905591;
const FP_PALETTE_STEPS = 1024;
const FP_YELLOW = '255,235,20';
const FP_COLLAPSE_SPEED = 4;
const FP_COLLAPSE_DURATION_MS = 950 / FP_COLLAPSE_SPEED;
const FP_COLLAPSE_HOLD_MS = 450 / FP_COLLAPSE_SPEED;

// Density uses the full relative-density range, without the phase view's
// high exposure. Deep magenta is reserved for values nearest the peak.
// Adjust the wave and both profiles here: [relative density, [red, green, blue]],
// all values 0..1. Keep densities increasing; move a stop to change where its
// color appears. Tones sampled from the supplied DoubleSlit reference: dark
// teal, green, a subdued transition into red, then deep magenta. Keep the
// transition dark to avoid introducing a bright yellow band.
const FP_DENSITY_STOPS = [
  [0.00, [0.000, 0.000, 0.000]],
  [0.08, [0.040, 0.065, 0.100]],
  [0.32, [0.080, 0.235, 0.240]],
  [0.58, [0.024, 0.408, 0.153]],
  [0.66, [0.196, 0.369, 0.051]],
  [0.74, [0.427, 0.208, 0.051]],
  [0.82, [0.569, 0.067, 0.039]],
  [0.91, [0.592, 0.047, 0.106]],
  [0.97, [0.549, 0.043, 0.239]],
  [1.00, [0.506, 0.039, 0.314]],
];
const FP_DENSITY_PALETTE = Array.from({ length: FP_PALETTE_STEPS + 1 }, (_, i) => {
  const density = i / FP_PALETTE_STEPS;
  const hi = FP_DENSITY_STOPS.findIndex((stop, index) => index > 0 && density <= stop[0]);
  const [loValue, loColor] = FP_DENSITY_STOPS[hi - 1];
  const [hiValue, hiColor] = FP_DENSITY_STOPS[hi];
  const blend = (density - loValue) / (hiValue - loValue);
  return loColor.map((channel, c) => channel + (hiColor[c] - channel) * blend);
});
const FP_PHASE_DENSITY_PALETTE = Array.from({ length: FP_PALETTE_STEPS + 1 }, (_, i) => {
  const I = i / FP_PALETTE_STEPS;
  return [0.26, 0.13, 0.49].map((lo, c) =>
    (lo + ([0.72, 0.50, 0.99][c] - lo) * Math.pow(I, 0.7)) * I);
});
const FP_PHASE_PALETTE = Array.from({ length: FP_PALETTE_STEPS + 1 }, (_, i) => {
  const phase = (i / FP_PALETTE_STEPS * 2 - 1) * Math.PI;
  const magnitude = Math.abs(phase);
  const blend = Math.max(0, (magnitude - Math.PI / 2) / (Math.PI / 2));
  const u = Math.min(1, magnitude / 1.05);
  const visibility = u * u * u * (u * (u * 6 - 15) + 10);
  const branch = phase >= 0 ? [0.08, 0.25, 1] : [1, 0.08, 0.02];
  return branch.map((v, c) => (v + ([0.72, 0.04, 0.88][c] - v) * blend) * visibility);
});

function fpWaveIntensity(rho) {
  return Math.sqrt(-Math.expm1(-20 * Math.max(0, rho)));
}

function fpDensityRGB(relativeDensity) {
  return FP_DENSITY_PALETTE[Math.round(Math.max(0, Math.min(1, relativeDensity)) * FP_PALETTE_STEPS)];
}

function fpDensityColor(relativeDensity) {
  const rgb = fpDensityRGB(relativeDensity);
  return `rgb(${rgb.map(v => Math.round(255 * v)).join(',')})`;
}

function fpClearCollapse() {
  fp.collapseElapsed_ms = 0;
  fp._collapseVisual = null;
  fp._lastFrameTime_ms = null;
}

// ---------------------------------------------------------------------------
// Derived physics  (call after changing energy or sigma0)
// ---------------------------------------------------------------------------
function fpUpdatePhysics() {
  const E   = fp.energy_eV;
  const m   = FP_MASS_EV;          // eV·fs²/nm²
  const hb  = FP_HBAR_EV_FS;       // eV·fs

  // k from E = ħ²k² / (2m)
  fp.k_nm      = Math.sqrt(2 * m * E) / hb;          // 1/nm
  // Do not inject a preset transverse tilt; the local direction should come
  // from the guidance equation via the wave phase field itself.
  fp.kx_nm     = fp.k_nm;
  fp.ky_nm     = 0;
  fp.omega_fs  = E / hb;                              // 1/fs  (E = ħω)
  fp.vGroup_nm_fs = hb * fp.k_nm / m;                // nm/fs (magnitude)
  fp.vGroupX_nm_fs = fp.vGroup_nm_fs;
  fp.vGroupY_nm_fs = 0;
  fp.vPhase_nm_fs = fp.omega_fs / fp.k_nm;           // nm/fs

  // Auto-speed: target ~3 s real-time for packet to travel from x0 to detector
  const _dist = Math.abs(fp.detectorX_nm - fp.x0_nm);
  const _trav = _dist / Math.max(0.001, Math.abs(fp.vGroupX_nm_fs)); // fs
  const _raw = _trav / (fp.dt_fs * 180);
  fp.autoStepsPerFrame = Math.max(1, Math.round(Math.max(1, _raw)));
  // For high-energy cases where _raw < 1, scale dt smoothly instead of skipping frames.
  fp.autoDtScale = Math.max(0.05, Math.min(1, _raw));
}

// ---------------------------------------------------------------------------
// Wavefunction evaluation on the grid
// ---------------------------------------------------------------------------
function fpBuildGrid() {
  const N  = fp.NX;
  fp.psiRe = new Float64Array(N);
  fp.psiIm = new Float64Array(N);
  fp.prob  = new Float64Array(N);
}

function fpSigmaY0() {
  // User-controlled y spread with sane floor for numerical stability.
  return Math.max(2, fp.sigmaY0_nm || 0);
}

// Section probabilities from |psi|^2 inside detector window at time t.
// Returns { secMass, total } where secMass[s] are normalized probabilities.
function fpDetectorSectionProbabilities(t_fs) {
  const xd = fp.detectorX_nm;
  const hw = fp.detectorW_nm;
  const NX2 = 120;
  const NY2 = 72;
  const dx = (fp.xMax_nm - fp.xMin_nm) / (NX2 - 1);
  const dy = (fp.yMax_nm - fp.yMin_nm) / (NY2 - 1);

  const secMassRaw = new Array(fp.nSections).fill(0);
  let total = 0;
  for (let j = 0; j < NY2; j++) {
    const y = fp.yMin_nm + j * dy;
    const sec = Math.min(
      fp.nSections - 1,
      Math.max(0, Math.floor(((y - fp.yMin_nm) / (fp.yMax_nm - fp.yMin_nm)) * fp.nSections))
    );
    for (let i = 0; i < NX2; i++) {
      const x = fp.xMin_nm + i * dx;
      if (x >= xd - hw && x <= xd + hw) {
        const psi = fpPsi2D(x, y, t_fs);
        const p = (psi.re * psi.re + psi.im * psi.im) * dx * dy;
        secMassRaw[sec] += p;
        total += p;
      }
    }
  }

  if (total <= 1e-30) {
    const uniform = 1 / Math.max(1, fp.nSections);
    return { secMass: new Array(fp.nSections).fill(uniform), total: 0 };
  }
  return {
    secMass: secMassRaw.map(v => v / total),
    total,
  };
}

// Smooth detector-window profile in x: 0 outside, ~1 in detector interior.
// This acts as an effective proxy for an imaginary absorbing potential.
function fpDetectorProfileX(x_nm) {
  const d = Math.abs(x_nm - fp.detectorX_nm);
  const hw = Math.max(1e-6, fp.detectorW_nm);
  const edge = Math.max(1e-6, fp.absorbEdge_nm || 0);
  if (d <= hw) return 1;
  if (d >= hw + edge) return 0;
  const u = (d - hw) / edge; // 0..1 across smoothing shell
  const c = Math.cos(Math.PI * u);
  return 0.5 * (1 + c);
}

/**
 * Evaluate the FREE-PARTICLE wavefunction at position x (nm) and time t (fs).
 * Returns {re, im}.
 *
 * Gaussian packet:
 *   σ(t) = σ₀ √(1 + (ħt / (mσ₀²))²)
 *   ψ(x,t) = [σ₀/σ(t)]^(1/2) · exp(−(x−x̄(t))²/(4σ₀σ(t)))
 *            · exp(i·k(x−x̄(t))) · exp(−iωt) · [phase correction]
 *
 * The exact analytic solution for the spreading Gaussian package is
 * the propagator acting on a minimum-uncertainty state.
 */
function fpPsi2D(x_nm, y_nm, t_fs) {
  const hb   = FP_HBAR_EV_FS;
  const m    = FP_MASS_EV;
  const sigX0 = fp.sigma0_nm;
  const sigY0 = fpSigmaY0();

  const xbar = fp.x0_nm + fp.vGroupX_nm_fs * t_fs;
  const ybar = fp.vGroupY_nm_fs * t_fs;
  const tauX = hb * t_fs / (m * sigX0 * sigX0);
  const tauY = hb * t_fs / (m * sigY0 * sigY0);
  const sigX = sigX0 * Math.sqrt(1 + tauX * tauX);
  const sigY = sigY0 * Math.sqrt(1 + tauY * tauY);

  const dx = x_nm - xbar;
  const dy = y_nm - ybar;

  // Relative normalization is sufficient for visualization and guidance ratios.
  const amp   = Math.sqrt((sigX0 * sigY0) / (sigX * sigY));
  const gauss = Math.exp(-((dx * dx) / (4 * sigX0 * sigX) + (dy * dy) / (4 * sigY0 * sigY)));

  const carrier = fp.kx_nm * x_nm + fp.ky_nm * y_nm - fp.omega_fs * t_fs;
  const chirp   = (tauX * dx * dx) / (4 * sigX0 * sigX) + (tauY * dy * dy) / (4 * sigY0 * sigY);
  const phase   = carrier + chirp - 0.5 * (Math.atan(tauX) + Math.atan(tauY));
  // Effective absorbing detector: local amplitude damping in detector window.
  // This is a pedagogical approximation to an imaginary potential region.
  const absorbProfile = fpDetectorProfileX(x_nm);
  const absorb = Math.exp(-Math.max(0, fp.absorbGamma_fs) * Math.max(0, t_fs) * absorbProfile);

  return {
    re: absorb * amp * gauss * Math.cos(phase),
    im: absorb * amp * gauss * Math.sin(phase),
  };
}

// Legacy 1D helper retained for the probability strip by sampling y=0 slice.
function fpPsi(x_nm, t_fs) {
  return fpPsi2D(x_nm, 0, t_fs);
}

/**
 * Update fp.psiRe, fp.psiIm, fp.prob for current fp.time_fs.
 */
function fpComputeGrid() {
  const N    = fp.NX;
  const xMin = fp.xMin_nm;
  const xMax = fp.xMax_nm;
  const dx   = (xMax - xMin) / (N - 1);
  const t    = fp.time_fs;

  let maxProb = 0;
  for (let i = 0; i < N; i++) {
    const x = xMin + i * dx;
    const {re, im} = fpPsi(x, t);
    fp.psiRe[i] = re;
    fp.psiIm[i] = im;
    const p = re*re + im*im;
    fp.prob[i]  = p;
    if (p > maxProb) maxProb = p;
  }
  fp._maxProb = maxProb;
}

// ---------------------------------------------------------------------------
// Bohmian velocity field from the guide equation: v = (ħ/m)∇S.
// ---------------------------------------------------------------------------
function fpBohmianVelocity2D(x_nm, y_nm, t_fs) {
  // Exact guidance law for this packet family: v = (ħ/m)∇S,
  // where S/ħ is the phase used in fpPsi2D.
  const hb = FP_HBAR_EV_FS;
  const m  = FP_MASS_EV;

  const sigX0 = fp.sigma0_nm;
  const sigY0 = fpSigmaY0();

  const tauX = hb * t_fs / (m * sigX0 * sigX0);
  const tauY = hb * t_fs / (m * sigY0 * sigY0);
  const sigX = sigX0 * Math.sqrt(1 + tauX * tauX);
  const sigY = sigY0 * Math.sqrt(1 + tauY * tauY);

  const xbar = fp.x0_nm + fp.vGroupX_nm_fs * t_fs;
  const ybar = fp.vGroupY_nm_fs * t_fs;
  const dx = x_nm - xbar;
  const dy = y_nm - ybar;

  // For a spreading Gaussian packet, the chirp gradient is
  // tau * delta / (2 * sigma0^2 * (1 + tau^2)) = tau * delta / (2 * sigma(t)^2).
  // Using sigma0*sigma(t) overestimates this term and can produce spurious
  // velocity sign flips that look like particle-only reflections.
  const dPhaseDx = fp.kx_nm + (tauX * dx) / (2 * sigX * sigX);
  const dPhaseDy = fp.ky_nm + (tauY * dy) / (2 * sigY * sigY);

  return {
    vx: (hb / m) * dPhaseDx,
    vy: (hb / m) * dPhaseDy,
  };
}

// ---------------------------------------------------------------------------
// Advance Bohmian particle by dt using 4th-order Runge–Kutta
// ---------------------------------------------------------------------------
function fpStepBohmian(dt_fs) {
  if (fp.bDetected) return;
  const x = fp.bPos_nm;
  const y = fp.bPosY_nm;
  const t = fp.time_fs;
  const v = fpBohmianVelocity2D;

  const k1 = v(x, y, t);
  const k2 = v(x + k1.vx * dt_fs / 2, y + k1.vy * dt_fs / 2, t + dt_fs / 2);
  const k3 = v(x + k2.vx * dt_fs / 2, y + k2.vy * dt_fs / 2, t + dt_fs / 2);
  const k4 = v(x + k3.vx * dt_fs,     y + k3.vy * dt_fs,     t + dt_fs);

  const xNew = x + (dt_fs / 6) * (k1.vx + 2 * k2.vx + 2 * k3.vx + k4.vx);
  const yNew = y + (dt_fs / 6) * (k1.vy + 2 * k2.vy + 2 * k3.vy + k4.vy);

  // Wrap/clamp to domain
  const clamped = Math.max(fp.xMin_nm, Math.min(fp.xMax_nm, xNew));
  const yClamped = Math.max(fp.yMin_nm, Math.min(fp.yMax_nm, yNew));
  fp.bPos_nm = clamped;
  fp.bPosY_nm = yClamped;
  fp.bPos_y = (yClamped - fp.yMin_nm) / (fp.yMax_nm - fp.yMin_nm);

  fp.bTrail.push({ x: clamped, y: yClamped, t: fp.time_fs });
  if (fp.bTrail.length > 2000) fp.bTrail.shift();

  // Check detector
  const dx = Math.abs(clamped - fp.detectorX_nm);
  if (dx <= fp.detectorW_nm) {
    const expected = fpDetectorSectionProbabilities(fp.time_fs).secMass;
    fp.bDetected         = true;
    fp.bDetectedTime     = fp.time_fs;
    fp.bDetectedSection  = Math.min(fp.nSections - 1, Math.max(0, Math.floor(fp.bPos_y * fp.nSections)));
    fpCommitDetectionStats(fp.bDetectedSection, expected);
  }
}

function fpCommitDetectionStats(sectionIdx, expectedSecProb = null) {
  if (fp.eventCommitted) return;
  if (fp.sectionHits.length !== fp.nSections)
    fp.sectionHits = new Array(fp.nSections).fill(0);
  if (fp.sectionExpected.length !== fp.nSections)
    fp.sectionExpected = new Array(fp.nSections).fill(0);

  const sec = (sectionIdx >= 0 && sectionIdx < fp.nSections)
    ? sectionIdx
    : Math.floor(Math.random() * fp.nSections);

  fp.nTrials++;
  fp.nHits++;
  fp.sectionHits[sec] = (fp.sectionHits[sec] || 0) + 1;
  if (Array.isArray(expectedSecProb) && expectedSecProb.length === fp.nSections) {
    for (let i = 0; i < fp.nSections; i++) {
      fp.sectionExpected[i] = (fp.sectionExpected[i] || 0) + (expectedSecProb[i] || 0);
    }
  }
  fp.eventCommitted = true;
}

// ---------------------------------------------------------------------------
// Copenhagen: stochastic detection check each frame
// Probability of detection in dt:  dp = v_group · |ψ(x_det)|² · dt · 2·w_det
// (approximate: probability flux through detector window)
// ---------------------------------------------------------------------------
function fpCheckCopenhagen(dt_fs = fp.dt_fs) {
  if (fp.bDetected) return;

  // 2D detector stripe mass: ∫_{|x-xd|<=w} |ψ(x,y,t)|² dx dy
  const det = fpDetectorSectionProbabilities(fp.time_fs);
  const prob_window = det.total;
  const secMassProb = det.secMass;

  // Probability of click per time step ~ |ψ|²(window) if not yet detected
  // We use a small correction factor to avoid over-triggering
  const clickProb = Math.min(0.5, prob_window * dt_fs * 1.2);
  if (Math.random() < clickProb) {
    let sec = 0;
    if (prob_window > 1e-30) {
      let r = Math.random();
      for (let s = 0; s < fp.nSections; s++) {
        r -= secMassProb[s];
        if (r <= 0) { sec = s; break; }
      }
    } else {
      sec = Math.floor(Math.random() * fp.nSections);
    }
    fp.bDetectedSection  = sec;
    fp.bPos_y            = (sec + Math.random()) / fp.nSections;
    fp.bPosY_nm          = fp.yMin_nm + fp.bPos_y * (fp.yMax_nm - fp.yMin_nm);
    fp.bDetected         = true;
    fp.bDetectedTime     = fp.time_fs;
    fpCommitDetectionStats(sec, secMassProb);
  }
}

// ---------------------------------------------------------------------------
// Canvas setup helpers
// ---------------------------------------------------------------------------
let fpWaveCanvas, fpPartCanvas, fpDetCanvas;
let fpWaveCtx, fpPartCtx, fpDetCtx;
// Export copies can draw at higher resolution without changing view geometry.
let fpRenderScale = 1;
let fpDeferRender = false;

function fpInitCanvases() {
  fpWaveCanvas = document.getElementById('fpWaveCanvas');
  fpPartCanvas = document.getElementById('fpPartCanvas');
  fpDetCanvas  = document.getElementById('fpDetCanvas');

  if (fpWaveCanvas)  fpWaveCtx  = fpWaveCanvas.getContext('2d');
  if (fpPartCanvas)  fpPartCtx  = fpPartCanvas.getContext('2d');
  if (fpDetCanvas)   fpDetCtx   = fpDetCanvas.getContext('2d');
}

// ---------------------------------------------------------------------------
// Coordinate transforms  (nm ↔ pixel)
// ---------------------------------------------------------------------------
function fpXtoPixel(x_nm) {
  const W = fpWaveCanvas ? fpWaveCanvas.width / fpRenderScale : 800;
  return (x_nm - fp.xMin_nm) / (fp.xMax_nm - fp.xMin_nm) * W;
}

function fpPixelToX(px) {
  const W = fpWaveCanvas ? fpWaveCanvas.width / fpRenderScale : 800;
  return fp.xMin_nm + (px / W) * (fp.xMax_nm - fp.xMin_nm);
}

// ---------------------------------------------------------------------------
// RENDER – wave layer
// ---------------------------------------------------------------------------
function fpCaptureCollapse(image, probs) {
  const W = image.width, H = image.height;
  let left = W - 1, right = 0, top = H - 1, bottom = 0;
  const xDensity = new Float64Array(W);
  const yDensity = new Float64Array(H);
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const rho = probs[j * W + i];
      xDensity[i] += rho;
      yDensity[j] += rho;
      if (rho > FP_WAVE_AMPLITUDE_CUTOFF ** 2) {
        left = Math.min(left, i); right = Math.max(right, i);
        top = Math.min(top, j); bottom = Math.max(bottom, j);
      }
    }
  }
  if (right < left || bottom < top) { left = 0; right = W - 1; top = 0; bottom = H - 1; }
  const feathered = document.createElement('canvas');
  feathered.width = W; feathered.height = H;
  fp._collapseVisual = {
    image, feathered, xDensity, yDensity,
    xPeak: Math.max(1e-12, ...xDensity), yPeak: Math.max(1e-12, ...yDensity),
    source: { x: left / W, y: top / H, w: (right - left + 1) / W, h: (bottom - top + 1) / H },
  };
}

function fpCollapseFrame(W, H) {
  const source = fp._collapseVisual.source;
  const p = Math.min(1, fp.collapseElapsed_ms / FP_COLLAPSE_DURATION_MS);
  const ease = p * p * p * (p * (p * 6 - 15) + 10);
  const { detL, detR } = fpDetectorLayout(W);
  const binH = H / fp.nSections;
  const target = { x: (detL + detR) / 2, y: (fp.bDetectedSection + 0.5) * binH };
  const mix = (a, b) => a + (b - a) * ease;
  const w = mix(source.w * W, Math.max(1, detR - detL - 4));
  const h = mix(source.h * H, binH * 0.82);
  return {
    x: mix((source.x + source.w / 2) * W, target.x) - w / 2,
    y: mix((source.y + source.h / 2) * H, target.y) - h / 2,
    w, h, p, ease, target,
  };
}

function fpRenderCollapse(ctx, W, H) {
  const { image, feathered, source } = fp._collapseVisual;
  const frame = fpCollapseFrame(W, H);
  // The initial wave can extend beyond the viewport. Feather those clipped
  // edges as it contracts so they become a soft packet instead of a rectangle.
  const layer = feathered.getContext('2d');
  layer.clearRect(0, 0, image.width, image.height);
  layer.drawImage(image, 0, 0);
  const edgeAlpha = 1 - Math.min(1, frame.p * 4);
  const edgeFade = layer.createLinearGradient(0, source.y * image.height,
    0, (source.y + source.h) * image.height);
  edgeFade.addColorStop(0, `rgba(255,255,255,${edgeAlpha})`);
  edgeFade.addColorStop(0.16, '#fff');
  edgeFade.addColorStop(0.84, '#fff');
  edgeFade.addColorStop(1, `rgba(255,255,255,${edgeAlpha})`);
  layer.globalCompositeOperation = 'destination-in';
  layer.fillStyle = edgeFade;
  layer.fillRect(0, 0, image.width, image.height);
  layer.globalCompositeOperation = 'source-over';
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(feathered, source.x * image.width, source.y * image.height,
    source.w * image.width, source.h * image.height, frame.x, frame.y, frame.w, frame.h);

  // A few faint converging wisps make the direction of the contraction legible.
  // This is a presentation effect on a frozen wave snapshot, not wave evolution.
  const pull = Math.sin(Math.PI * frame.p);
  ctx.globalCompositeOperation = 'screen';
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i++) {
    const y = frame.y + frame.h * (i + 0.5) / 9;
    const x = frame.x + frame.w * 0.65;
    ctx.strokeStyle = fp.displayMode === 'phase'
      ? `rgba(${i < 3 ? '255,50,75' : i > 5 ? '55,95,255' : '200,65,235'},${0.22 * pull})`
      : `rgba(190,115,245,${0.22 * pull})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + frame.w * 0.25, y, frame.target.x - W * 0.035,
      frame.target.y, frame.target.x, frame.target.y);
    ctx.stroke();
  }

  // The glow fits within the fired bin and holds there after the contraction.
  const { detL, detR } = fpDetectorLayout(W);
  ctx.beginPath();
  ctx.rect(detL + 1, fp.bDetectedSection * H / fp.nSections + 1,
    Math.max(1, detR - detL - 2), Math.max(1, H / fp.nSections - 2));
  ctx.clip();
  ctx.translate(frame.target.x, frame.target.y);
  ctx.scale(Math.max(2, (detR - detL) * 0.8), H / fp.nSections * 0.6);
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  glow.addColorStop(0, `rgba(255,247,206,${0.9 * frame.ease})`);
  glow.addColorStop(0.25, `rgba(231,151,255,${0.75 * frame.ease})`);
  glow.addColorStop(1, 'rgba(95,60,220,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();

  ctx.fillStyle = 'rgba(235,220,255,0.85)';
  ctx.font = '13px Inter,sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${frame.p < 1 ? 'Collapsing into' : 'Localized in'} bin ${fp.bDetectedSection + 1}`, 8, 18);
}

// Draw continuous, subpixel-accurate profiles instead of rounded pixel bars.
// Supersampling smooths the silhouette; a continuous gradient removes seams
// between neighboring samples. Each profile canvas reuses its own layer.
const fpProfileLayers = new WeakMap();
function fpDrawDensityProfile(ctx, W, H, values, peak, axis, start = 0, span = axis === 'x' ? W : H) {
  if (W <= 0 || H <= 0 || values.length < 2 || span <= 0) return;
  let layer = fpProfileLayers.get(ctx.canvas);
  if (!layer) {
    const canvas = document.createElement('canvas');
    layer = { canvas, ctx: canvas.getContext('2d') };
    fpProfileLayers.set(ctx.canvas, layer);
  }
  const scale = Math.max(2, fpRenderScale);
  if (layer.canvas.width !== W * scale || layer.canvas.height !== H * scale) {
    layer.canvas.width = W * scale;
    layer.canvas.height = H * scale;
  }
  const paint = layer.ctx;
  paint.setTransform(scale, 0, 0, scale, 0, 0);
  paint.clearRect(0, 0, W, H);
  const isX = axis === 'x';
  const baseline = isX ? H : W - 1;
  const amplitude = Math.max(0, isX ? H - 20 : W - 12);
  const gradient = isX ? paint.createLinearGradient(start, 0, start + span, 0)
    : paint.createLinearGradient(0, start, 0, start + span);
  paint.beginPath();
  paint.moveTo(isX ? start : baseline, isX ? baseline : start);
  let lastColor = null, pendingStop = null;
  for (let i = 0; i < values.length; i++) {
    const fraction = i / (values.length - 1);
    const density = Math.max(0, Math.min(1, values[i] / Math.max(1e-12, peak)));
    const position = start + fraction * span;
    const edge = baseline - density * amplitude;
    paint.lineTo(isX ? position : edge, isX ? edge : position);
    const color = fpDensityColor(density);
    // Keep the two ends of each constant-color run. Interior stops do not
    // change the gradient, but are costly for the canvas rasterizer.
    if (color !== lastColor) {
      if (pendingStop !== null) gradient.addColorStop(pendingStop, lastColor);
      gradient.addColorStop(fraction, color);
      lastColor = color;
      pendingStop = null;
    } else pendingStop = fraction;
  }
  if (pendingStop !== null) gradient.addColorStop(pendingStop, lastColor);
  paint.lineTo(isX ? start + span : baseline, isX ? baseline : start + span);
  paint.closePath();
  paint.fillStyle = gradient;
  paint.fill();
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(layer.canvas, 0, 0, W, H);
  ctx.restore();
}

function fpRenderCollapseProjection(ctx, W, H, axis) {
  if (!fp._collapseVisual) return;
  const { source, xDensity, yDensity, xPeak, yPeak } = fp._collapseVisual;
  const frame = fpCollapseFrame(fpWaveCanvas.width / fpRenderScale, fpWaveCanvas.height / fpRenderScale);
  const isX = axis === 'x';
  const values = isX ? xDensity : yDensity;
  const peak = isX ? xPeak : yPeak;
  const extent = isX ? W : H;
  const mainExtent = (isX ? fpWaveCanvas.width : fpWaveCanvas.height) / fpRenderScale;
  const start = (isX ? frame.x : frame.y) / mainExtent * extent;
  const span = (isX ? frame.w : frame.h) / mainExtent * extent;
  const srcStart = isX ? source.x : source.y;
  const srcSpan = isX ? source.w : source.h;
  const first = Math.round(srcStart * values.length);
  const last = Math.min(values.length, Math.round((srcStart + srcSpan) * values.length));
  const profile = new Float64Array(last - first);
  for (let i = first; i < last; i++) {
    const edge = Math.max(0, Math.min(1, (i - first) / (last - first) / 0.16,
      (last - i - 1) / (last - first) / 0.16));
    const feather = isX ? 1 : 1 - Math.min(1, frame.p * 4) * (1 - edge);
    profile[i - first] = values[i] / peak * feather;
  }
  fpDrawDensityProfile(ctx, W, H, profile, 1, axis, start, span);
}

// Render-only workspace stays outside fp so video snapshots remain serializable.
let fpWaveBuffers = null;

// The existing packet and x-only absorber are separable. Evaluate each axis
// once, then combine them on the unchanged 800 x 140 display grid.
function fpRenderFactors(nx, ny, t) {
  const sx0 = fp.sigma0_nm, sy0 = fpSigmaY0();
  const tx = FP_HBAR_EV_FS * t / (FP_MASS_EV * sx0 * sx0);
  const ty = FP_HBAR_EV_FS * t / (FP_MASS_EV * sy0 * sy0);
  const sx = sx0 * Math.sqrt(1 + tx * tx), sy = sy0 * Math.sqrt(1 + ty * ty);
  const amp = Math.sqrt((sx0 * sy0) / (sx * sy));
  const phase0 = -fp.omega_fs * t - 0.5 * (Math.atan(tx) + Math.atan(ty));
  const xAmp = new Float64Array(nx), yAmp = new Float64Array(ny);
  const xPhase = new Float64Array(nx), yPhase = new Float64Array(ny);
  for (let i = 0; i < nx; i++) {
    const x = fp.xMin_nm + i / Math.max(1, nx - 1) * (fp.xMax_nm - fp.xMin_nm);
    const dx = x - (fp.x0_nm + fp.vGroupX_nm_fs * t);
    const q = dx * dx / (4 * sx0 * sx);
    xAmp[i] = amp * Math.exp(-q) * Math.exp(-Math.max(0, fp.absorbGamma_fs) * Math.max(0, t) * fpDetectorProfileX(x));
    xPhase[i] = fp.kx_nm * x + tx * q + phase0;
  }
  for (let j = 0; j < ny; j++) {
    const y = fp.yMin_nm + j / Math.max(1, ny - 1) * (fp.yMax_nm - fp.yMin_nm);
    const dy = y - fp.vGroupY_nm_fs * t;
    const q = dy * dy / (4 * sy0 * sy);
    yAmp[j] = Math.exp(-q);
    yPhase[j] = fp.ky_nm * y + ty * q;
  }
  return { xAmp, yAmp, xPhase, yPhase };
}

function fpRenderWave() {
  if (!fpWaveCtx) return;
  const ctx = fpWaveCtx;
  const W   = fpWaveCanvas.width / fpRenderScale;
  const H   = fpWaveCanvas.height / fpRenderScale;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = fpCanvasColor('#000', '#ffffff');
  ctx.fillRect(0, 0, W, H);

  if (fp.interpMode === 'collapse' && fp.bDetected && fp._collapseVisual) {
    fpRenderCollapse(ctx, W, H);
    return;
  }

  // Pilot-wave: particle absorbed — wavefunction no longer guides anything
  if (fp.interpMode === 'pilotwave' && fp.bDetected) {
    ctx.fillStyle = 'rgba(100,180,255,0.70)';
    ctx.font      = 'bold 16px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Particle absorbed', W / 2, H / 2 - 10);
    ctx.fillStyle = fpCanvasColor('rgba(200,200,200,0.45)', '#64748b');
    ctx.font      = '12px Inter,sans-serif';
    ctx.fillText('Bohmian particle registered at detector', W / 2, H / 2 + 14);
    return;
  }

  // 2D field rendering: keep existing UI, but visualize ψ(x,y,t) over the canvas.
  if (fp.interpMode === 'pilotwave' && !fp.showPilotWave) return;

  const NY = 140;
  if (!fp._waveOff || fp._waveOff.width !== fp.NX || fp._waveOff.height !== NY) {
    fp._waveOff = document.createElement('canvas');
    fp._waveOff.width = fp.NX;
    fp._waveOff.height = NY;
    fp._waveOffCtx = fp._waveOff.getContext('2d');
  }
  const off = fp._waveOff;
  const octx = fp._waveOffCtx;
  if (!fpWaveBuffers || fpWaveBuffers.width !== off.width || fpWaveBuffers.height !== off.height) {
    fpWaveBuffers = { width: off.width, height: off.height,
      img: octx.createImageData(off.width, off.height),
      vals: new Float32Array(off.width * off.height),
      probs: new Float32Array(off.width * off.height) };
  }
  const { img, vals, probs } = fpWaveBuffers;
  const data = img.data;

  let p = 0;
  let maxP2D = 1e-12;
  const mode = fp.displayMode;

  const factors = fpRenderFactors(off.width, off.height, fp.time_fs);
  for (let j = 0; j < off.height; j++) {
    for (let i = 0; i < off.width; i++) {
      const index = j * off.width + i;
      const amplitude = factors.xAmp[i] * factors.yAmp[j];
      const prob = amplitude * amplitude;
      maxP2D = Math.max(maxP2D, prob);
      probs[index] = prob;
      if (mode === 'prob') vals[index] = prob;
      else {
        const phase = factors.xPhase[i] + factors.yPhase[j];
        if (mode === 'real') vals[index] = amplitude * Math.cos(phase);
        else if (mode === 'imag') vals[index] = amplitude * Math.sin(phase);
        else vals[index] = Math.atan2(amplitude * Math.sin(phase), amplitude * Math.cos(phase));
      }
    }
  }

  let vmin = 0, vmax = maxP2D;
  if (mode === 'real' || mode === 'imag') {
    vmax = 1e-12;
    for (let i = 0; i < vals.length; i++) vmax = Math.max(vmax, Math.abs(vals[i]));
    vmin = -vmax;
  }

  for (let j = 0; j < off.height; j++) {
    for (let i = 0; i < off.width; i++) {
      const v = vals[j * off.width + i];
      let r = 0, g = 0, b = 0, a = 255;
      if (fp.interpMode !== 'manyworlds' && (mode === 'phase' || mode === 'prob')) {
        const rho = probs[j * off.width + i];
        const fade = Math.max(0, Math.min(1, (Math.sqrt(rho) - FP_WAVE_AMPLITUDE_CUTOFF) / FP_WAVE_AMPLITUDE_CUTOFF));
        const visibility = fade * fade * (3 - 2 * fade);
        if (mode === 'phase') {
          const I = fpWaveIntensity(rho);
          const colorIndex = Math.round(I * FP_PALETTE_STEPS);
          const phaseIndex = Math.max(0, Math.min(FP_PALETTE_STEPS,
            Math.round((v / Math.PI + 1) * 0.5 * FP_PALETTE_STEPS)));
          const phase = FP_PHASE_PALETTE[phaseIndex];
          const density = FP_PHASE_DENSITY_PALETTE[colorIndex];
          r = ((1 - FP_PHASE_AMOUNT) * density[0] + FP_PHASE_AMOUNT * phase[0] * I) * 255 * visibility;
          g = ((1 - FP_PHASE_AMOUNT) * density[1] + FP_PHASE_AMOUNT * phase[1] * I) * 255 * visibility;
          b = ((1 - FP_PHASE_AMOUNT) * density[2] + FP_PHASE_AMOUNT * phase[2] * I) * 255 * visibility;
        } else {
          const rgb = fpDensityRGB(rho / maxP2D);
          r = rgb[0] * 255 * visibility; g = rgb[1] * 255 * visibility; b = rgb[2] * 255 * visibility;
        }
      } else if (mode === 'phase') {
        // Modulate hue brightness by local amplitude so near-zero regions
        // appear dark rather than showing noisy colour at the packet edges.
        const ampWeight = Math.min(1, Math.sqrt(probs[j * off.width + i] / maxP2D));
        const h = (((v / (2 * Math.PI)) % 1 + 1) % 1) * 6;
        const xh = 1 - Math.abs((h % 2) - 1);
        let rr = 0, gg = 0, bb = 0;
        if (h < 1) { rr = 1; gg = xh; }
        else if (h < 2) { rr = xh; gg = 1; }
        else if (h < 3) { gg = 1; bb = xh; }
        else if (h < 4) { gg = xh; bb = 1; }
        else if (h < 5) { rr = xh; bb = 1; }
        else { rr = 1; bb = xh; }
        r = Math.round(255 * rr * ampWeight);
        g = Math.round(255 * gg * ampWeight);
        b = Math.round(255 * bb * ampWeight);
      } else if (mode === 'real' || mode === 'imag') {
        const t = (v - vmin) / Math.max(1e-12, vmax - vmin);
        const dv = t - 0.5;
        r = Math.round(Math.max(0, dv * 2) * 220 + 20);
        b = Math.round(Math.max(0, -dv * 2) * 220 + 20);
        g = Math.round(35 * (1 - 4 * dv * dv));
      } else {
        const t = Math.max(0, Math.min(1, v / Math.max(1e-12, maxP2D)));
        // Inferno-like palette
        const rr = Math.round(252 * t);
        const gg = Math.round(255 * Math.pow(t, 1.6));
        const bb = Math.round(164 * Math.pow(t, 0.6));
        r = rr; g = gg; b = bb;
      }
      // In light mode, let empty space reveal the light canvas. Keep the
      // existing RGB palette; alpha follows the packet, including signed views.
      if (fpLightCanvas) {
        a = Math.round(255 * Math.min(1, Math.sqrt(probs[j * off.width + i] / maxP2D) * 4));
      }
      data[p++] = r; data[p++] = g; data[p++] = b; data[p++] = a;
    }
  }
  octx.putImageData(img, 0, 0);
  if (fp.interpMode === 'collapse' && fp.bDetected) {
    fpCaptureCollapse(off, probs);
    fpRenderCollapse(ctx, W, H);
    return;
  }
  ctx.drawImage(off, 0, 0, W, H);

  // Detector window overlay in world x-mapped coordinates
  const xd2 = fpXtoPixel(fp.detectorX_nm);
  const hw2 = Math.abs(fpXtoPixel(fp.detectorX_nm + fp.detectorW_nm) - xd2);
  ctx.strokeStyle = 'rgba(80,240,80,0.8)';
  ctx.lineWidth = 2;
  ctx.strokeRect(xd2 - hw2, 0, 2 * hw2, H);

  ctx.textAlign = 'left';
  ctx.font = '13px Inter, sans-serif';
  ctx.fillStyle = fpCanvasColor('rgba(255,255,255,0.7)', '#334155');
  const modeLabel2 = { prob:'|ψ|² (2D)', real:'Re(ψ)', imag:'Im(ψ)', phase:'Phase(ψ)' }[mode];
  ctx.fillText(`Wave Packet · ${modeLabel2}`, 8, 18);
  return;
}

// ---------------------------------------------------------------------------
// RENDER – particle / trajectory layer
// ---------------------------------------------------------------------------
function fpRenderParticle() {
  if (!fpPartCtx) return;
  const ctx = fpPartCtx;
  const W   = fpPartCanvas.width / fpRenderScale;
  const H   = fpPartCanvas.height / fpRenderScale;

  ctx.clearRect(0, 0, W, H);
  if (fp.interpMode !== 'pilotwave') return;

  // Draw trail
  if (fp.bTrail.length > 1) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const trailStart = Math.max(0, fp.bTrail.length - 600);
    const yPix = (y_nm) => ((y_nm - fp.yMin_nm) / (fp.yMax_nm - fp.yMin_nm)) * H;
    const t0 = fp.bTrail[trailStart];
    const y0 = (typeof t0.y === 'number') ? t0.y : (fp.yMin_nm + fp.bPos_y * (fp.yMax_nm - fp.yMin_nm));
    ctx.moveTo(fpXtoPixel(t0.x), yPix(y0));
    for (let i = trailStart + 1; i < fp.bTrail.length; i++) {
      const ti = fp.bTrail[i];
      const yi = (typeof ti.y === 'number') ? ti.y : (fp.yMin_nm + fp.bPos_y * (fp.yMax_nm - fp.yMin_nm));
      ctx.lineTo(fpXtoPixel(ti.x), yPix(yi));
    }
    const last = fp.bTrail[fp.bTrail.length - 1];
    const fade = ctx.createLinearGradient(fpXtoPixel(t0.x), yPix(y0),
      fpXtoPixel(last.x) + 0.01, yPix(last.y ?? y0));
    fade.addColorStop(0, `rgba(${FP_YELLOW},0.06)`);
    fade.addColorStop(0.45, `rgba(${FP_YELLOW},0.48)`);
    fade.addColorStop(1, `rgba(${FP_YELLOW},0.92)`);
    ctx.strokeStyle = `rgba(${FP_YELLOW},0.13)`;
    ctx.lineWidth = 5;
    ctx.shadowColor = `rgba(${FP_YELLOW},0.5)`;
    ctx.shadowBlur = 7 * fpRenderScale;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = fade;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();
  }

  // DoubleSlit2.0's warm yellow body, pale core, and soft transparent halo.
  const px = fpXtoPixel(fp.bDetected ? fp.detectorX_nm : fp.bPos_nm);
  const py = ((fp.bPosY_nm - fp.yMin_nm) / (fp.yMax_nm - fp.yMin_nm)) * H;
  const radius = fp.bDetected ? 13 : 11;
  const dot = ctx.createRadialGradient(px, py, 0, px, py, radius);
  dot.addColorStop(0, 'rgba(255,252,199,1)');
  dot.addColorStop(0.18, 'rgba(255,252,199,0.98)');
  dot.addColorStop(0.34, `rgba(${FP_YELLOW},0.94)`);
  dot.addColorStop(0.55, `rgba(${FP_YELLOW},0.30)`);
  dot.addColorStop(1, `rgba(${FP_YELLOW},0)`);
  ctx.fillStyle = dot;
  ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
}

// ---------------------------------------------------------------------------
// RENDER – detector layer
// ---------------------------------------------------------------------------
function fpDetectorLayout(W) {
  const xd     = fpXtoPixel(fp.detectorX_nm);
  const hw     = Math.abs(fpXtoPixel(fp.detectorX_nm + fp.detectorW_nm) - fpXtoPixel(fp.detectorX_nm));
  const xLeft  = Math.round(xd - hw);
  const xRight = Math.round(xd + hw);

  const fullW = Math.max(12, xRight - xLeft);

  // Geometry: detector strip (about 1/3 original width) + separate histogram area to the right.
  const detW = Math.max(8, Math.round(fullW / 3));
  const gapW = 3;
  const histWTarget = fullW; // keep histogram width equal to old detector width

  let detL  = xLeft;
  let detR  = detL + detW;
  let histL = detR + gapW;
  let histR = histL + histWTarget;

  if (histR > W - 2) {
    const shift = histR - (W - 2);
    detL  -= shift;
    detR  -= shift;
    histL -= shift;
    histR -= shift;
  }
  if (detL < 2) {
    const shift = 2 - detL;
    detL  += shift;
    detR  += shift;
    histL += shift;
    histR += shift;
  }
  detL  = Math.max(2, detL);
  detR  = Math.min(W - 4, detR);
  histL = Math.max(detR + 1, histL);
  histR = Math.min(W - 2, histR);
  // Let the horizontal bars use all remaining space, preserving the detector
  // position and the existing Many-Worlds layout.
  if (fp.interpMode !== 'manyworlds') histR = W - 2;
  const histW = Math.max(4, histR - histL);
  return { detL, detR, histL, histR, histW };
}

function fpRenderDetector() {
  if (!fpDetCtx) return;
  const ctx = fpDetCtx;
  const W = fpDetCanvas.width / fpRenderScale, H = fpDetCanvas.height / fpRenderScale;
  const N_SECTS = fp.nSections;
  ctx.clearRect(0, 0, W, H);
  const { detL, detR, histL, histR, histW } = fpDetectorLayout(W);
  const anyFired = fp.bDetected || fp.mwFired;
  const mwUnchosen = fp.mwFired && fp.bDetectedSection < 0;
  const collapse = fp.interpMode === 'collapse' && fp.bDetected;
  const hits = fp.sectionHits || [];
  const maxH = Math.max(1, ...(hits.length ? hits : [0]));

  // Draw each section with histogram in its own zone, detector hit in a separate zone.
  for (let i = 0; i < N_SECTS; i++) {
    const secY     = Math.round(H * i / N_SECTS);
    const secH     = Math.round(H * (i + 1) / N_SECTS) - secY;
    const cnt      = hits[i] || 0;
    const t        = cnt / maxH;
    const barW     = Math.max(1, Math.round((histW - 2) * t));

    // Histogram zone (right): per-section track + filled hit bar.
    ctx.fillStyle = fpCanvasColor('rgba(20,30,50,0.55)', 'rgba(226,232,240,0.85)');
    ctx.fillRect(histL + 1, secY + 1, Math.max(1, histW - 2), Math.max(1, secH - 2));
    if (cnt > 0) {
      ctx.fillStyle = 'rgba(250,204,21,0.40)';
      ctx.fillRect(histL + 1, secY + 1, barW, Math.max(1, secH - 2));
    }

    // Detector zone (left): only event-highlight information.
    const secFired = anyFired && (mwUnchosen || fp.bDetectedSection === i);
    ctx.fillStyle  = secFired ? 'rgba(80,240,80,0.74)' : 'rgba(100,140,255,0.28)';
    if (collapse && secFired) ctx.fillStyle = 'rgba(255,223,150,0.10)';
    ctx.fillRect(detL, secY, Math.max(1, detR - detL), secH);
    if (collapse && secFired) {
      ctx.strokeStyle = 'rgba(255,232,163,0.95)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(detL + 1, secY + 1, Math.max(1, detR - detL - 2), Math.max(1, secH - 2));
    }

    // Per-section count labels directly on detector panel.
    ctx.fillStyle = cnt > 0 ? fpCanvasColor('#f8fafc', '#334155') : fpCanvasColor('rgba(148,163,184,0.7)', '#64748b');
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(cnt), histR - 4, secY + Math.max(1, secH) * 0.5);
  }

  // Section dividers in both zones
  ctx.strokeStyle = fpCanvasColor('rgba(255,255,255,0.22)', 'rgba(51,65,85,0.25)');
  ctx.lineWidth   = 0.5;
  for (let i = 1; i < N_SECTS; i++) {
    const sy = Math.round(H * i / N_SECTS);
    ctx.beginPath(); ctx.moveTo(detL, sy);  ctx.lineTo(detR, sy);  ctx.stroke();
    ctx.beginPath(); ctx.moveTo(histL, sy); ctx.lineTo(histR, sy); ctx.stroke();
  }

  // Zone borders
  ctx.strokeStyle = anyFired ? '#50f050' : '#6688ff';
  if (collapse) ctx.strokeStyle = '#9d88cb';
  ctx.lineWidth   = 2;
  ctx.strokeRect(detL, 0, Math.max(1, detR - detL), H);
  ctx.strokeStyle = 'rgba(250,204,21,0.65)';
  ctx.lineWidth   = 1;
  ctx.strokeRect(histL, 0, Math.max(1, histR - histL), H);

  // Labels
  ctx.fillStyle = anyFired ? '#50f050' : fpCanvasColor('rgba(180,200,255,0.9)', '#4159a0');
  if (collapse) ctx.fillStyle = '#ffe8a3';
  ctx.font      = 'bold 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('D', Math.round((detL + detR) * 0.5), 16);
  ctx.fillStyle = fpCanvasColor('rgba(250,204,21,0.9)', '#806300');
  ctx.fillText('H', Math.round((histL + histR) * 0.5), 16);
}

// ---------------------------------------------------------------------------
// RENDER – y-projection panel  ρ(y,t) = ∫ |ψ(x,y,t)|² dx
// ---------------------------------------------------------------------------
function fpRenderYProjection() {
  const canvas = document.getElementById('fpYProjCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width / fpRenderScale;
  const H = canvas.height / fpRenderScale;
  if (!W || !H) return;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = fpCanvasColor('#0a0a1a', '#f1f5f9');
  ctx.fillRect(0, 0, W, H);

  // Match wave visibility semantics.
  if (fp.interpMode === 'pilotwave' && !fp.showPilotWave) return;
  if (fp.interpMode === 'collapse' && fp.bDetected) {
    fpRenderCollapseProjection(ctx, W, H, 'y');
    return;
  }
  if ((fp.interpMode === 'collapse' || fp.interpMode === 'pilotwave') && fp.bDetected) return;

  const NXp = 180;
  const dx = (fp.xMax_nm - fp.xMin_nm) / (NXp - 1);
  const rhoY = new Float64Array(H);
  let maxRho = 1e-12;

  const factors = fpRenderFactors(NXp, H, fp.time_fs);
  let xMass = 0;
  for (let i = 0; i < NXp; i++) xMass += factors.xAmp[i] * factors.xAmp[i] * dx;
  for (let j = 0; j < H; j++) {
    const accum = xMass * factors.yAmp[j] * factors.yAmp[j];
    rhoY[j] = accum;
    if (accum > maxRho) maxRho = accum;
  }

  if (fp.interpMode !== 'manyworlds') {
    fpDrawDensityProfile(ctx, W, H, rhoY, maxRho, 'y');
  } else {
    for (let j = 0; j < H; j++) {
      const t = Math.max(0, Math.min(1, rhoY[j] / maxRho));
      const barW = Math.max(1, Math.round((W - 12) * t));
      ctx.fillStyle = fpColor(t);
      ctx.fillRect(W - barW - 1, j, barW, 1);
    }
  }

  // Detector section guides to compare y-density against detector pixels.
  ctx.strokeStyle = fpCanvasColor('rgba(255,255,255,0.18)', 'rgba(51,65,85,0.22)');
  ctx.lineWidth = 1;
  for (let i = 1; i < fp.nSections; i++) {
    const sy = Math.round(H * i / fp.nSections);
    ctx.beginPath();
    ctx.moveTo(0, sy);
    ctx.lineTo(W, sy);
    ctx.stroke();
  }

  ctx.fillStyle = fpCanvasColor('rgba(200,200,200,0.85)', '#475569');
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('rho(y)', 4, 4);
}

// ---------------------------------------------------------------------------
// Observer stick figure
// ---------------------------------------------------------------------------
function fpDrawObserver(ctx, cx, cy, r, color, label) {
  ctx.save();
  ctx.lineCap     = 'round';
  const lw = Math.max(1, r * 0.45);
  // Head
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.fillStyle = color; ctx.fill();
  ctx.strokeStyle = fpCanvasColor('rgba(255,255,255,0.4)', 'rgba(51,65,85,0.4)'); ctx.lineWidth = 1; ctx.stroke();
  // Body + limbs
  ctx.strokeStyle = color; ctx.lineWidth = lw;
  ctx.beginPath(); ctx.moveTo(cx, cy + r);   ctx.lineTo(cx, cy + 3.2 * r); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 1.5*r, cy + 1.8*r); ctx.lineTo(cx + 1.5*r, cy + 1.8*r); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy + 3.2*r); ctx.lineTo(cx - r, cy + 5.2*r);
  ctx.moveTo(cx, cy + 3.2*r); ctx.lineTo(cx + r, cy + 5.2*r);
  ctx.stroke();
  if (label) {
    ctx.fillStyle = fpCanvasColor('rgba(220,220,220,0.9)', '#334155');
    ctx.font = Math.max(8, Math.round(r * 1.3)) + 'px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, cy + 6.8 * r);
  }
  ctx.restore();
}

function fpRenderMWBranch(ctx, W, H, sectionIdx) {
  ctx.fillStyle = fpCanvasColor('#000', '#ffffff');
  ctx.fillRect(0, 0, W, H);
  if (!fp.prob) return;

  // |\u03c8|² background
  // Use frozen snapshot so the waveform stays fixed at the branching moment
  const snapProb = fp._mwSnapProb || fp.prob;
  const maxP = fp._mwSnapMaxP || fp._maxProb || 1e-12;
  const N = fp.NX, dxP = W / N;
  for (let i = 0; i < N; i++) {
    const t = Math.max(0, Math.min(1, snapProb[i] / maxP));
    ctx.fillStyle = fpColor(t);
    ctx.fillRect(Math.round(i * dxP), 0, Math.max(1, Math.ceil(dxP)), H);
  }

  // Detector bands
  const xd_ = (fp.detectorX_nm - fp.xMin_nm) / (fp.xMax_nm - fp.xMin_nm) * W;
  const hw_ = fp.detectorW_nm / (fp.xMax_nm - fp.xMin_nm) * W;
  const xL  = Math.round(xd_ - hw_), xR = Math.round(xd_ + hw_);
  const xAbsorb = Math.max(0, Math.min(W, xL));
  // Which branch is the "winning" one (our observer's world this run)?
  const isWinner = fp.bDetectedSection >= 0 && fp.bDetectedSection === sectionIdx;
  const NS  = fp.nSections;
  const branchY = Math.round(H * sectionIdx / NS);
  const branchH = Math.max(1, Math.round(H * (sectionIdx + 1) / NS) - branchY);

  // Branch-specific absorbing detector view:
  // keep only this section on incident side; remove transmitted side for all branches.
  ctx.fillStyle = fpCanvasColor('rgba(0,0,0,0.88)', 'rgba(241,245,249,0.88)');
  ctx.fillRect(0, 0, xAbsorb, branchY);
  ctx.fillRect(0, branchY + branchH, xAbsorb, Math.max(0, H - (branchY + branchH)));
  ctx.fillStyle = fpCanvasColor('rgba(0,0,0,0.94)', 'rgba(241,245,249,0.94)');
  ctx.fillRect(xAbsorb, 0, W - xAbsorb, H);

  for (let si = 0; si < NS; si++) {
    const sY = Math.round(H * si / NS), sH = Math.round(H * (si + 1) / NS) - sY;
    const isThis = (si === sectionIdx);
    ctx.fillStyle = isWinner && isThis ? 'rgba(251,191,36,0.70)'
                  : isThis             ? 'rgba(80,240,80,0.50)'
                  :                      'rgba(80,100,200,0.22)';
    ctx.fillRect(xL, sY, xR - xL, sH);
  }
  ctx.strokeStyle = fpCanvasColor('rgba(255,255,255,0.20)', 'rgba(51,65,85,0.25)'); ctx.lineWidth = 0.5;
  for (let si = 1; si < NS; si++) {
    const sy = Math.round(H * si / NS);
    ctx.beginPath(); ctx.moveTo(xL, sy); ctx.lineTo(xR, sy); ctx.stroke();
  }
  ctx.strokeStyle = isWinner ? '#fbbf24' : '#50f050'; ctx.lineWidth = 1.5;
  ctx.strokeRect(xL, 0, xR - xL, H);

  // Section label
  const fs = Math.max(9, Math.round(H * 0.17));
  ctx.fillStyle = isWinner ? '#fbbf24' : fpCanvasColor('rgba(200,200,200,0.9)', '#334155');
  ctx.font = `bold ${fs}px Inter,sans-serif`;
  ctx.textAlign = 'left'; ctx.fillText('S' + (sectionIdx + 1), 4, fs + 1);

  // Observer — positioned at vertical centre of THIS section, in definite post-measurement state
  const obsr  = Math.max(4, Math.round(H * 0.09));
  const sSecY = (sectionIdx + 0.5) / fp.nSections * H;
  const obsx  = Math.round(W * 0.88);
  const obsy  = Math.round(Math.max(obsr + 2, Math.min(H - obsr * 6 - 4, sSecY - obsr)));
  // Gold observer = our world; green = other valid branch
  fpDrawObserver(ctx, obsx, obsy, obsr,
    isWinner ? 'rgba(251,191,36,0.95)' : 'rgba(120,255,170,0.92)', '');

  // Hit count bottom-right
  const cnt = (fp.sectionHits && fp.sectionHits[sectionIdx]) || 0;
  ctx.fillStyle = isWinner ? '#fbbf24' : (cnt > 0 ? '#34d399' : '#475569');
  ctx.font = `bold ${fs}px Inter,sans-serif`; ctx.textAlign = 'right';
  ctx.fillText(cnt, W - 4, H - 3);

  // Gold outer border marks the branch our observer inhabits
  if (isWinner) {
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth   = 3;
    ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
  }
}

function fpSampleMWBranch() {
  const weights = Array.isArray(fp._mwBranchProb) && fp._mwBranchProb.length === fp.nSections
    ? fp._mwBranchProb : new Array(fp.nSections).fill(1 / Math.max(1, fp.nSections));
  let draw = Math.random();
  for (let i = 0; i < weights.length; i++) {
    draw -= Math.max(0, weights[i] || 0);
    if (draw <= 0) return i;
  }
  return Math.max(0, weights.length - 1);
}

function fpPrepareMWZoom(sectionIdx) {
  const grid = document.getElementById('fp-mw-grid');
  const tile = _fpMWCanvases[sectionIdx]?.parentElement;
  if (!grid || !tile || !_fpMWZoomCanvas) return;

  const inset = 6;
  const gridRect = grid.getBoundingClientRect();
  const tileRect = tile.getBoundingClientRect();
  const width = Math.max(1, Math.round(grid.clientWidth - 2 * inset));
  const height = Math.max(1, Math.round(grid.clientHeight - 2 * inset));
  _fpMWZoomCanvas.width = width;
  _fpMWZoomCanvas.height = height;
  _fpMWZoomCanvas.hidden = false;

  const source = document.createElement('canvas');
  source.width = width;
  source.height = height;
  fpRenderMWBranch(source.getContext('2d'), width, height, sectionIdx);
  fp.mwZoom = {
    sectionIdx,
    elapsed_ms: 0,
    duration_ms: 1200,
    hold_ms: 600,
    complete: false,
    source,
    from: {
      x: tileRect.left - gridRect.left - inset,
      y: tileRect.top - gridRect.top - inset,
      width: tileRect.width,
      height: tileRect.height,
    },
  };
}

function fpRenderMWZoom() {
  const zoom = fp.mwZoom;
  if (!zoom || !_fpMWZoomCanvas) return;
  const ctx = _fpMWZoomCanvas.getContext('2d');
  const W = _fpMWZoomCanvas.width;
  const H = _fpMWZoomCanvas.height;
  const progress = zoom.complete ? 1 : Math.max(0, Math.min(1, zoom.elapsed_ms / zoom.duration_ms));
  const ease = progress * progress * (3 - 2 * progress);
  const x = zoom.from.x * (1 - ease);
  const y = zoom.from.y * (1 - ease);
  const width = zoom.from.width + (W - zoom.from.width) * ease;
  const height = zoom.from.height + (H - zoom.from.height) * ease;
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(zoom.source, x, y, width, height);
  ctx.strokeStyle = '#7cf2ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, Math.max(0, width - 2), Math.max(0, height - 2));
}

function fpStartMWZoomLoop() {
  if (_fpMWZoomTimer) clearTimeout(_fpMWZoomTimer);
  let last = performance.now();
  const tick = () => {
    if (!fp.mwWaitingForChoice || !fp.mwZoom) {
      _fpMWZoomTimer = null;
      return;
    }
    const now = performance.now();
    const dt = Math.max(0, now - last);
    last = now;
    if (fp.running && !fp.mwZoom.complete) {
      fp.mwZoom.elapsed_ms += dt;
      fpRenderMWZoom();
      fpUpdateMWStatus();
      if (fp.mwZoom.elapsed_ms >= fp.mwZoom.duration_ms + fp.mwZoom.hold_ms) {
        fp.mwZoom.complete = true;
        fpRenderMWZoom();
        fpUpdateMWStatus();
        _fpMWZoomTimer = null;
        if (fp.autoNextCycle) {
          if (fp.animId) cancelAnimationFrame(fp.animId);
          fp.animId = null;
          fp.mwWaitingForChoice = false;
          fpRunReset();
          return;
        }
        fp.running = false;
        const btnStart = document.getElementById('fp-btn-start');
        const btnStop = document.getElementById('fp-btn-stop');
        if (btnStart) btnStart.disabled = false;
        if (btnStop) btnStop.disabled = true;
        return;
      }
    }
    _fpMWZoomTimer = setTimeout(tick, 16);
  };
  _fpMWZoomTimer = setTimeout(tick, 16);
}

// MW: automatic or manual selection enters one detector-record branch.
function fpMWChooseBranch(sectionIdx) {
  if (!fp.mwWaitingForChoice || fp.mwZoom) return;
  if (fp.sectionHits.length !== fp.nSections)
    fp.sectionHits = new Array(fp.nSections).fill(0);

  fp.bDetectedSection   = sectionIdx;
  fp.mwBranchPath       = [...fp.mwBranchPath, sectionIdx];
  // Commit this measurement immediately so histogram and detector update at click time.
  if (!fp.mwChoiceCommitted) {
    const expected = fpDetectorSectionProbabilities(fp.mwFireTime ?? fp.time_fs).secMass;
    fpCommitDetectionStats(sectionIdx, expected);
    fp.mwChoiceCommitted = true;
  }
  fp.mwChoiceElapsed_ms = 0;
  fpPrepareMWZoom(sectionIdx);
  fpManageMWView();
  fpRender();
  fpStartMWZoomLoop();
}

function fpUpdateMWStatus() {
  const el = document.getElementById('fp-mw-status');
  if (!el) return;
  const path  = fp.mwBranchPath;
  const trail = path.map(s => '<b>S' + (s + 1) + '</b>').join(' -> ');
  const depthChosen = path.length;
  const depthNow    = depthChosen + (fp.mwWaitingForChoice && !fp.mwZoom ? 1 : 0);
  const nS          = Math.max(2, fp.nSections || 2);
  const worldsAtDepth = Math.pow(nS, depthNow);
  const branchesGenerated = depthNow * nS;

  if (!fp.mwFired) {
    el.innerHTML = '<span style="color:#475569">Approaching detector — branching will occur...</span>'
      + (path.length ? '<br><span style="color:#64748b">Previously followed: ' + trail + '</span>' : '');
  } else if (fp.mwZoom?.complete) {
    el.innerHTML = '<span style="color:#34d399">Entered world: ' + trail + '</span>'
      + ' <span style="color:#64748b">— measurement complete; press Start for the next run.</span>';
  } else if (fp.mwZoom) {
    el.innerHTML = '<span style="color:#38bdf8">Following S' + (fp.mwZoom.sectionIdx + 1)
      + ' · other branches continue.</span>';
  } else if (fp.mwWaitingForChoice) {
    const instruction = fp.mwChoiceMode === 'manual'
      ? 'Click a panel to enter that world.'
      : 'A branch will be followed automatically using its Born weight.';
    el.innerHTML =
      '<span style="color:#38bdf8">Universe branched. ' + instruction + '</span>'
      + (path.length ? '<br><span style="color:#94a3b8">Path so far: ' + trail
        + ' -> <b>?</b></span>' : '')
      + '<br><span style="color:#64748b">Depth: ' + depthNow
      + ' · Worlds at this depth: ' + worldsAtDepth.toLocaleString()
      + ' · Branches generated: ' + branchesGenerated.toLocaleString() + '</span>';
  } else if (path.length) {
    el.innerHTML = '<span style="color:#34d399">Entered world: ' + trail + '</span>'
      + ' <span style="color:#64748b">- measurement complete; clock paused.</span>'
      + '<br><span style="color:#64748b">Depth reached: ' + depthChosen
      + ' · Worlds generated through this process: ' + worldsAtDepth.toLocaleString()
      + ' · Branches generated: ' + branchesGenerated.toLocaleString() + '</span>';
  } else {
    el.innerHTML =
      '<span style="color:#475569">Approaching detector - branching will occur...</span>';
  }
}

let _fpMWCanvases = [];
let _fpMWZoomCanvas = null;
let _fpMWZoomTimer = null;

function fpBuildMWCanvases() {
  const grid = document.getElementById('fp-mw-grid');
  if (!grid) return;
  grid.innerHTML = '';
  _fpMWCanvases  = [];
  const N    = fp.nSections;
  const cols = N <= 3 ? N : (N <= 6 ? 3 : 4);
  const rows = Math.ceil(N / cols);
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows    = `repeat(${rows}, 1fr)`;
  for (let i = 0; i < N; i++) {
    const wrap = document.createElement('div');
    wrap.className = 'mw-mini-wrap';
    const cnv = document.createElement('canvas');
    cnv.addEventListener('click', () => {
      if (fp.mwWaitingForChoice && fp.mwChoiceMode === 'manual') fpMWChooseBranch(i);
    });
    wrap.appendChild(cnv);
    grid.appendChild(wrap);
    _fpMWCanvases.push(cnv);
  }
  _fpMWZoomCanvas = document.createElement('canvas');
  _fpMWZoomCanvas.className = 'mw-zoom-canvas';
  _fpMWZoomCanvas.hidden = true;
  grid.appendChild(_fpMWZoomCanvas);
  fpResizeMWCanvases();
}

function fpResizeMWCanvases() {
  const grid = document.getElementById('fp-mw-grid');
  if (!grid || !_fpMWCanvases.length) return;
  const N    = _fpMWCanvases.length;
  const cols = N <= 3 ? N : (N <= 6 ? 3 : 4);
  const rows = Math.ceil(N / cols);
  const pad  = 6; // matches CSS padding
  const gap  = 6; // matches CSS gap
  const gW   = grid.clientWidth  || 600;
  const gH   = grid.clientHeight || Math.round(gW * 0.45);
  const cellW = Math.max(1, Math.floor((gW - pad * 2 - gap * (cols - 1)) / cols));
  const cellH = Math.max(1, Math.floor((gH - pad * 2 - gap * (rows - 1)) / rows));

  _fpMWCanvases.forEach(cnv => {
    const wrap = cnv.parentElement;
    cnv.width  = cellW;
    cnv.height = cellH;
    if (wrap) {
      wrap.style.width  = cellW + 'px';
      wrap.style.height = cellH + 'px';
    }
  });
  if (_fpMWZoomCanvas && fp.mwZoom) {
    const {sectionIdx, elapsed_ms, complete} = fp.mwZoom;
    fpPrepareMWZoom(sectionIdx);
    fp.mwZoom.elapsed_ms = elapsed_ms;
    fp.mwZoom.complete = complete;
  }
}

function fpRenderMWGrid() {
  if (!_fpMWCanvases.length) fpBuildMWCanvases();
  _fpMWCanvases.forEach((cnv, i) => {
    const ctx = cnv.getContext('2d');
    if (ctx) fpRenderMWBranch(ctx, cnv.width, cnv.height, i);
  });
  fpRenderMWZoom();
}

function fpManageMWView() {
  const isMW      = fp.interpMode === 'manyworlds';
  const postSplit = isMW && fp.mwFired && fp.mwWaitingForChoice;
  const mainWrap = document.getElementById('fp-main-vis-wrap');
  const probw  = document.querySelector('.prob-wrap');
  const mwgrid = document.getElementById('fp-mw-grid');
  const mwstat = document.getElementById('fp-mw-status');

  if (mainWrap) mainWrap.style.display = postSplit ? 'none' : '';
  if (probw)  probw.style.display  = postSplit ? 'none' : '';
  if (mwgrid) mwgrid.style.display = postSplit ? ''     : 'none';
  if (mwstat) mwstat.style.display = isMW ? '' : 'none';
  if (mwgrid) mwgrid.classList.toggle('mw-choosing', postSplit && fp.mwWaitingForChoice
    && fp.mwChoiceMode === 'manual' && !fp.mwZoom);

  if (postSplit && !fp._mwSplit) {
    fp._mwSplit = true;
    fpBuildMWCanvases();
    // Defer sizing + render so CSS grid layout has time to compute clientWidth
    setTimeout(() => { fpResizeMWCanvases(); fpRenderMWGrid(); }, 0);
  }
  fpUpdateMWStatus();
}

// ---------------------------------------------------------------------------
// RENDER – probability density panel (right side histogram)
// ---------------------------------------------------------------------------
function fpRenderProbPanel() {
  const canvas = document.getElementById('fpProbCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W   = canvas.width / fpRenderScale;
  const H   = canvas.height / fpRenderScale;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = fpCanvasColor('#0a0a1a', '#f1f5f9');
  ctx.fillRect(0, 0, W, H);

  // Blank the strip when the wavefunction is gone (collapse or pilot-wave post-detection)
  if (fp.interpMode === 'pilotwave' && !fp.showPilotWave) return;
  if (fp.interpMode === 'collapse' && fp.bDetected) {
    fpRenderCollapseProjection(ctx, W, H, 'x');
    return;
  }
  if ((fp.interpMode === 'collapse' || fp.interpMode === 'pilotwave') && fp.bDetected) return;

  // Draw the continuous density profile; retain the Many-Worlds rendering.
  const N     = fp.NX;
  const maxP  = fp._maxProb || 1e-12;
  const dxPix = W / N;

  if (fp.interpMode !== 'manyworlds') {
    fpDrawDensityProfile(ctx, W, H, fp.prob, maxP, 'x');
  } else {
    for (let i = 0; i < N; i++) {
      const t = fp.prob[i] / maxP;
      const bH = Math.round(t * (H - 20));
      ctx.fillStyle = fpColor(t);
      ctx.fillRect(Math.round(i * dxPix), H - bH, Math.max(1, Math.ceil(dxPix)), bH);
    }
  }

  // detector window marker (map using this panel's own width)
  const xToProbPx = (x_nm) => ((x_nm - fp.xMin_nm) / (fp.xMax_nm - fp.xMin_nm)) * W;
  const xd  = xToProbPx(fp.detectorX_nm);
  const hw  = Math.abs(xToProbPx(fp.detectorX_nm + fp.detectorW_nm) - xd);
  ctx.strokeStyle = '#50f050';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.moveTo(xd - hw, 0);
  ctx.lineTo(xd - hw, H);
  ctx.moveTo(xd + hw, 0);
  ctx.lineTo(xd + hw, H);
  ctx.stroke();

  // Label
  ctx.fillStyle = fpCanvasColor('rgba(200,200,200,0.7)', '#475569');
  ctx.font      = '11px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('|ψ|²  (position density at fixed time)', 6, 14);
}

// ---------------------------------------------------------------------------
// RENDER – section hit histogram (Detector Section Hits panel)
// ---------------------------------------------------------------------------
function fpRenderSectionHist() {
  const canvas = document.getElementById('fpSectHistCanvas');
  if (!canvas) return;
  // Self-size if the canvas was measured before layout settled (width can be 0)
  if (!canvas.width || !canvas.height) {
    const sw = canvas.parentElement;
    if (sw) {
      canvas.width  = sw.clientWidth  || 200;
      canvas.height = sw.clientHeight ||  80;
    }
  }
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  if (!W || !H) return;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = fpCanvasColor('#0a0a1a', '#f1f5f9');
  ctx.fillRect(0, 0, W, H);

  const nS   = fp.nSections || 6;
  const hits = fp.sectionHits || [];
  const expHits = fp.sectionExpected || [];
  const maxH = Math.max(1, ...( hits.length ? hits : [0] ));
  const padL = 6, padR = 6, padB = 18, padT = 4;
  const barW = Math.max(4, Math.floor((W - padL - padR) / nS));
  const COLORS = ['#3b82f6','#6366f1','#8b5cf6','#a855f7','#ec4899','#ef4444',
                  '#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#0ea5e9'];

  for (let i = 0; i < nS; i++) {
    const x   = padL + i * barW;
    const cnt = (hits[i] || 0);
    const t   = cnt / maxH;
    const bH  = Math.round(t * (H - padT - padB));

    // Ghost background track
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(x + 1, padT, barW - 2, H - padT - padB);

    // Filled bar
    if (cnt > 0) {
      ctx.globalAlpha = 0.6 + 0.4 * t;
      ctx.fillStyle   = COLORS[i % COLORS.length];
      ctx.fillRect(x + 1, H - padB - bH, barW - 2, bH);
      ctx.globalAlpha = 1;
      const labelY = Math.max(padT + 10, H - padB - bH - 2);
      ctx.font      = Math.max(8, Math.min(11, barW - 4)) + 'px Inter,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = fpCanvasColor('#e2e8f0', '#334155');
      ctx.fillText(cnt, x + barW / 2, labelY);
    }

    // Section label (always visible, even before first detection)
    ctx.font      = Math.max(8, Math.min(10, barW - 4)) + 'px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.fillText('S' + (i + 1), x + barW / 2, H - 3);
  }

  // Wave-model expected counts per section (gold ticks), accumulated run-by-run.
  if (fp.nHits >= 4 && expHits.length === nS) {
    ctx.strokeStyle = 'rgba(250,204,21,0.95)';
    ctx.lineWidth = 2;
    for (let i = 0; i < nS; i++) {
      const x = padL + i * barW;
      const eh = Math.round(((expHits[i] || 0) / maxH) * (H - padT - padB));
      const y = H - padB - eh;
      ctx.beginPath();
      ctx.moveTo(x + 2, y);
      ctx.lineTo(x + barW - 2, y);
      ctx.stroke();
    }
  }

  // Update runs label in DOM
  const el = document.getElementById('fp-runs-label');
  if (el) {
    el.textContent = fp.nTrials > 0
      ? '\u2014 ' + fp.nHits + '/' + fp.nTrials + ' detected' : '';
  }
}

// ---------------------------------------------------------------------------
// Master render  (all layers)
// ---------------------------------------------------------------------------
function fpRender() {
  if (fpDeferRender) return;
  fpComputeGrid();
  fpRenderWave();
  fpRenderYProjection();
  fpRenderParticle();
  fpRenderDetector();
  fpRenderProbPanel();
  if (fp.interpMode === 'manyworlds' && fp.mwFired && fp.mwWaitingForChoice) fpRenderMWGrid();
    fpUpdateMWStatus();
    fpUpdateInfoPanel();
}

// ---------------------------------------------------------------------------
// Status / info panel update
// ---------------------------------------------------------------------------
function fpUpdateInfoPanel() {
  const setTxt = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };

  setTxt('fp-time',     fp.time_fs.toFixed(1) + ' fs');
  setTxt('fp-energy',   fp.energy_eV.toFixed(3) + ' eV');
  setTxt('fp-k',        fp.k_nm.toFixed(4) + ' nm⁻¹');
  setTxt('fp-lambda',   (2*Math.PI / fp.k_nm).toFixed(3) + ' nm');
  setTxt('fp-vgroup',   fp.vGroup_nm_fs.toFixed(4) + ' nm/fs');
  setTxt('fp-vphase',   fp.vPhase_nm_fs.toFixed(4) + ' nm/fs');
  setTxt('fp-sigma',
    (fp.sigma0_nm * Math.sqrt(1 + Math.pow(FP_HBAR_EV_FS * fp.time_fs / (FP_MASS_EV * fp.sigma0_nm * fp.sigma0_nm), 2))).toFixed(3) + ' nm');
  setTxt('fp-bpos',     fp.interpMode === 'pilotwave' ?
    (fp.bDetected ? '— detected' : `(${fp.bPos_nm.toFixed(3)}, ${fp.bPosY_nm.toFixed(3)}) nm`) : '—');
  setTxt('fp-ntrials',  fp.nTrials.toString());
  setTxt('fp-detected', fp.bDetected || fp.mwFired ? 'YES' : 'No');

  // Bohmian velocity v_B at current particle position
  if (fp.interpMode === 'pilotwave' && !fp.bDetected) {
    const vB = fpBohmianVelocity2D(fp.bPos_nm, fp.bPosY_nm, fp.time_fs);
    const vMag = Math.hypot(vB.vx, vB.vy);
    setTxt('fp-vbohm', vMag.toFixed(4) + ' nm/fs');
  } else {
    setTxt('fp-vbohm', '—');
  }

  const isPilot = fp.interpMode === 'pilotwave';
  ['fp-bpos-label','fp-bpos','fp-vbohm-label','fp-vbohm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = isPilot ? '' : 'none';
  });
}

// ---------------------------------------------------------------------------
// Animation loop
// ---------------------------------------------------------------------------
function fpStep(timestamp = performance.now()) {
  // Divide an exact, fractional time budget into bounded integration steps.
  // Rounding the speed itself would turn the slider back into discrete gears.
  const stepBudget = (fp.autoStepsPerFrame || 1) * fp.speed;
  const stepsPerFrame = Math.max(1, Math.ceil(stepBudget));
  const stepDt = fp.dt_fs * (fp.autoDtScale || 1) * stepBudget / stepsPerFrame;
  const elapsed_ms = fp._lastFrameTime_ms === null ? 1000 / 60
    : Math.max(0, Math.min(100, timestamp - fp._lastFrameTime_ms));
  fp._lastFrameTime_ms = timestamp;

  // Pause transport while the branch grid is inspected and the selected
  // detector record expands back to the full simulation view.
  if (fp.mwWaitingForChoice) {
    if (fp.running && !fp.mwZoom && fp.mwChoiceMode === 'auto') {
      fp.mwChoiceElapsed_ms += elapsed_ms;
      if (fp.mwChoiceElapsed_ms >= fp.mwChoiceDelay_ms) fpMWChooseBranch(fpSampleMWBranch());
    }
    fpRender();
    if (fp.running) fp.animId = requestAnimationFrame(fpStep);
    return;
  }

  // Freeze physics after any measurement event unless auto-next is enabled.
  if (fp.bDetected) {
    // In MW, auto-next is allowed only after branch choice (mwWaitingForChoice is handled above).
    const autoNext = fp.autoNextCycle;
    if (fp.interpMode === 'collapse') {
      fp.collapseElapsed_ms = Math.min(FP_COLLAPSE_DURATION_MS + FP_COLLAPSE_HOLD_MS,
        fp.collapseElapsed_ms + elapsed_ms);
      fpRender();
      const finishAt = FP_COLLAPSE_DURATION_MS + (autoNext ? FP_COLLAPSE_HOLD_MS : 0);
      if (fp.collapseElapsed_ms < finishAt) {
        if (fp.running) fp.animId = requestAnimationFrame(fpStep);
        return;
      }
      if (autoNext) { fpRunReset(); return; }
    } else if (autoNext) {
      fp.postDetectFrames++;
      fpRender();
      if (fp.postDetectFrames >= 24) { fpRunReset(); return; }
      if (fp.running) fp.animId = requestAnimationFrame(fpStep);
      return;
    }

    fp.running = false;
    if (fp.animId) { cancelAnimationFrame(fp.animId); fp.animId = null; }
    const btnStart = document.getElementById('fp-btn-start');
    const btnStop  = document.getElementById('fp-btn-stop');
    if (btnStart) btnStart.disabled = false;
    if (btnStop)  btnStop.disabled  = true;
    fpRender();
    return;
  }

  for (let s = 0; s < stepsPerFrame; s++) {
    // advance time
    fp.time_fs += stepDt;

    // interpretation-specific updates
    if (fp.interpMode === 'pilotwave') {
      fpComputeGrid();
      fpStepBohmian(stepDt);
    } else if (fp.interpMode === 'collapse') {
      fpComputeGrid();
      fpCheckCopenhagen(stepDt);
    } else if (fp.interpMode === 'manyworlds') {
      fpComputeGrid();
      // MW: "firing" is when sufficient probability has accumulated in window
      if (!fp.mwFired) {
        const xd  = fp.detectorX_nm;
        const hw  = fp.detectorW_nm;
        const dxg = (fp.xMax_nm - fp.xMin_nm) / (fp.NX - 1);
        let pw = 0;
        for (let i = 0; i < fp.NX; i++) {
          const xi = fp.xMin_nm + i * dxg;
          if (xi >= xd - hw && xi <= xd + hw) pw += fp.prob[i] * dxg;
        }
        if (pw > 0.02) { // branch separation threshold ~ 2% probability in window
          const branchProb = fpDetectorSectionProbabilities(fp.time_fs).secMass;
          fp.mwFired          = true;
          fp.mwFireTime       = fp.time_fs;
          fp.bDetected        = true;
          fp.bDetectedTime    = fp.time_fs;
          fp.mwWaitingForChoice = true; // pause; user must click a branch to continue
          fp.mwChoiceElapsed_ms = 0;
          fp.mwZoom = null;
          // Freeze wavefunction snapshot BEFORE the loop advances any further
          fp._mwSnapProb = fp.prob.slice();
          fp._mwSnapMaxP = fp._maxProb || 1e-12;
          fp._mwBranchProb = branchProb;
          fpManageMWView(); // reveal branch grid
        }
      }
    }

    // Freeze the detected packet at the event time, even at a high speed.
    if (fp.bDetected && fp.interpMode !== 'manyworlds') break;

    // auto-advance to next run when packet exits or after a brief post-detection pause
    if (fp.waveMode === 'packet') {
      const xbar     = fp.x0_nm + fp.vGroupX_nm_fs * fp.time_fs;
      const detected = fp.bDetected || fp.mwFired;
      if (!detected && (xbar > fp.xMax_nm + 3 || xbar < fp.xMin_nm - 3)) {
        fpRunReset();
        return;
      }
    }
  }

  fpRender();

  if (fp.running) {
    fp.animId = requestAnimationFrame(fpStep);
  }
}

// ---------------------------------------------------------------------------
// Reset helpers
// ---------------------------------------------------------------------------
function fpResetParticle() {
  fpClearCollapse();
  // Reset particle but keep stats accumulating
  fp.bDetected     = false;
  fp.bDetectedTime = null;
  fp.mwFired       = false;
  fp.mwFireTime    = null;
  fp.bTrail        = [];

  if (fp.interpMode === 'pilotwave') {
    // Sample from |ψ(x,t=0)|²  via inverse CDF
    fp.bPos_nm = fpSampleFromPsi0();
    fp.bPosY_nm = fpSampleY0();
    fp.bPos_y = (fp.bPosY_nm - fp.yMin_nm) / (fp.yMax_nm - fp.yMin_nm);
  }
}

// ---------------------------------------------------------------------------
// Run reset — starts a new run, keeping accumulated detection stats
// ---------------------------------------------------------------------------
function fpRunReset() {
  fpClearCollapse();
  const shouldTally = !fp.eventCommitted;
  if (shouldTally) fp.nTrials++;
  // Tally per-section hits before clearing state
  if (fp.sectionHits.length !== fp.nSections)
    fp.sectionHits = new Array(fp.nSections).fill(0);
  if (shouldTally && fp.mwFired) {
    fp.nHits++;
    // One branch is selected per run; over many runs this builds Born-rule statistics
    const sec = fp.bDetectedSection >= 0 ? fp.bDetectedSection
                                         : Math.floor(Math.random() * fp.nSections);
    fp.sectionHits[sec] = (fp.sectionHits[sec] || 0) + 1;
  } else if (shouldTally && fp.bDetected) {
    fp.nHits++;
    const sec = fp.bDetectedSection >= 0 ? fp.bDetectedSection
                                         : Math.floor(Math.random() * fp.nSections);
    fp.sectionHits[sec] = (fp.sectionHits[sec] || 0) + 1;
  }

  fp.time_fs          = 0;
  fp.bDetected        = false;
  fp.bDetectedTime    = null;
  fp.bDetectedSection = -1;
  fp.mwFired          = false;
  fp.mwFireTime       = null;
  fp.bTrail           = [];
  fp.postDetectFrames = 0;
  fp._mwSplit         = false;
  fp._mwSnapProb      = null;
  fp._mwSnapMaxP      = 1e-12;
  fp._mwBranchProb    = null;
  fp.mwWaitingForChoice = false;
  fp.mwChoiceCommitted  = false;
  fp.mwChoiceElapsed_ms = 0;
  fp.mwZoom              = null;
  fp.eventCommitted     = false;
  if (_fpMWZoomTimer) clearTimeout(_fpMWZoomTimer);
  _fpMWZoomTimer = null;
  if (_fpMWZoomCanvas) _fpMWZoomCanvas.hidden = true;

  fpUpdatePhysics();
  fpBuildGrid();
  fpComputeGrid();

  if (fp.interpMode === 'pilotwave') {
    fp.bPos_nm = fpSampleFromPsi0();
    fp.bPosY_nm = fpSampleY0();
    fp.bPos_y = (fp.bPosY_nm - fp.yMin_nm) / (fp.yMax_nm - fp.yMin_nm);
  } else {
    fp.bPos_nm = fp.x0_nm;
    fp.bPosY_nm = 0;
    fp.bPos_y  = 0.5;
  }

  if (fp.interpMode === 'manyworlds') fpManageMWView();
  fpRender();

  // Keep the animation running without requiring a button press
  if (fp.running) {
    fp.animId = requestAnimationFrame(fpStep);
  }
}

function fpFullReset() {
  fpClearCollapse();
  fp.time_fs          = 0;
  fp.bDetected        = false;
  fp.bDetectedTime    = null;
  fp.bDetectedSection = -1;
  fp.mwFired          = false;
  fp.mwFireTime       = null;
  fp.bTrail           = [];
  fp.nTrials          = 0;
  fp.nHits            = 0;
  fp.postDetectFrames = 0;
  fp._mwSplit         = false;
  fp._mwSnapProb      = null;
  fp._mwSnapMaxP      = 1e-12;
  fp._mwBranchProb    = null;
  fp.sectionHits      = new Array(fp.nSections).fill(0);
  fp.sectionExpected  = new Array(fp.nSections).fill(0);
  fp.mwBranchPath     = [];
  fp.mwWaitingForChoice = false;
  fp.mwChoiceCommitted  = false;
  fp.mwChoiceElapsed_ms = 0;
  fp.mwZoom              = null;
  fp.eventCommitted     = false;
  if (_fpMWZoomTimer) clearTimeout(_fpMWZoomTimer);
  _fpMWZoomTimer = null;
  if (_fpMWZoomCanvas) _fpMWZoomCanvas.hidden = true;

  fpUpdatePhysics();
  fpBuildGrid();
  fpComputeGrid();

  if (fp.interpMode === 'pilotwave') {
    fp.bPos_nm = fpSampleFromPsi0();
    fp.bPosY_nm = fpSampleY0();
    fp.bPos_y = (fp.bPosY_nm - fp.yMin_nm) / (fp.yMax_nm - fp.yMin_nm);
  } else {
    fp.bPos_nm = fp.x0_nm;
    fp.bPosY_nm = 0;
    fp.bPos_y  = 0.5;
  }

  if (fp.interpMode === 'manyworlds') fpManageMWView();
  fpRender();
}

/**
 * Sample a position from |ψ(x,0)|².
 * For the packet model this is a Gaussian draw.
 */
function fpSampleFromPsi0() {
  // Gaussian packet: Box–Muller
  const u1 = Math.random(), u2 = Math.random();
  const z  = Math.sqrt(-2 * Math.log(u1 + 1e-12)) * Math.cos(2 * Math.PI * u2);
  // Start σ-distribution from x0 but shifted left so particle enters domain
  return fp.x0_nm + fp.sigma0_nm * z;
}

function fpSampleY0() {
  const sigmaY0 = fpSigmaY0();
  const yMin = fp.yMin_nm;
  const yMax = fp.yMax_nm;

  // Sample from |psi(y)|^2 conditioned on the visible window [yMin, yMax].
  // Rejection avoids edge spikes produced by hard clamping.
  for (let tries = 0; tries < 64; tries++) {
    const u1 = Math.random(), u2 = Math.random();
    const z  = Math.sqrt(-2 * Math.log(u1 + 1e-12)) * Math.cos(2 * Math.PI * u2);
    const y  = sigmaY0 * z;
    if (y >= yMin && y <= yMax) return y;
  }

  // Deterministic fallback (numerically very unlikely to hit).
  return 0.5 * (yMin + yMax);
}

// ---------------------------------------------------------------------------
// UI wiring  (called from HTML onload)
// ---------------------------------------------------------------------------
function fpInit() {
  fpInitCanvases();
  fpUpdatePhysics();
  fpBuildGrid();
  fpFullReset();
  fpWireUI();
  fpManageMWView();
}

function fpWireUI() {
  const speedSlider = document.getElementById('fp-speed');
  const speedValue = document.getElementById('fp-speed-value');
  const mwControls = document.getElementById('fp-mw-controls');
  const mwChoiceMode = document.getElementById('fp-mw-choice-mode');
  const mwChoiceDelay = document.getElementById('fp-mw-choice-delay');
  const mwChoiceDelayValue = document.getElementById('fp-mw-choice-delay-value');
  function updateMWControls() {
    if (mwControls) mwControls.hidden = fp.interpMode !== 'manyworlds';
    if (mwChoiceMode) mwChoiceMode.value = fp.mwChoiceMode;
    if (mwChoiceDelay) mwChoiceDelay.value = String(fp.mwChoiceDelay_ms / 1000);
    if (mwChoiceDelayValue) {
      mwChoiceDelayValue.textContent = (fp.mwChoiceDelay_ms / 1000).toFixed(1) + ' s';
    }
  }
  if (mwChoiceMode) mwChoiceMode.addEventListener('change', () => {
    fp.mwChoiceMode = mwChoiceMode.value === 'manual' ? 'manual' : 'auto';
    fp.mwChoiceElapsed_ms = 0;
    fpManageMWView();
    fpRender();
  });
  if (mwChoiceDelay) mwChoiceDelay.addEventListener('input', () => {
    fp.mwChoiceDelay_ms = Math.max(500, Math.min(5000,
      Number(mwChoiceDelay.value) * 1000 || 1500));
    fp.mwChoiceElapsed_ms = 0;
    updateMWControls();
  });
  function updateSpeed() {
    const value = Number(speedSlider.value);
    fp.speed = Number.isFinite(value) ? Math.max(0.1, Math.min(16, value)) : 1;
    const label = `${Number(fp.speed.toFixed(2))}×`;
    speedValue.textContent = label;
    speedSlider.setAttribute('aria-valuetext', `${label} playback speed`);
  }
  if (speedSlider) {
    speedSlider.addEventListener('input', updateSpeed);
    updateSpeed();
  }

  // One visual toggle for the main wave and both probability projections.
  const waveToggle = document.getElementById('fp-btn-wave');
  function updateWaveToggle() {
    if (!waveToggle) return;
    waveToggle.hidden = fp.interpMode !== 'pilotwave';
    waveToggle.textContent = fp.showPilotWave ? 'Hide waves' : 'Show waves';
    waveToggle.setAttribute('aria-pressed', String(!fp.showPilotWave));
  }
  if (waveToggle) waveToggle.addEventListener('click', () => {
    fp.showPilotWave = !fp.showPilotWave;
    updateWaveToggle();
    fpRender();
  });
  updateWaveToggle();
  updateMWControls();

  // ── Interpretation ─────────────────────────────────────────────────────────
  document.querySelectorAll('input[name="fp-interp"]').forEach(rb => {
    rb.addEventListener('change', () => {
      fp.interpMode = rb.value;
      updateWaveToggle();
      updateMWControls();
      fpFullReset();
      fpManageMWView();
    });
  });

  // ── Display mode ───────────────────────────────────────────────────────────
  document.querySelectorAll('input[name="fp-display"]').forEach(rb => {
    rb.addEventListener('change', () => {
      fp.displayMode = rb.value;
      fp._collapseVisual = null;
      fpRender();
    });
  });

  // ── Energy ─────────────────────────────────────────────────────────────────
  const eSlider = document.getElementById('fp-energy-slider');
  const eInput  = document.getElementById('fp-energy-input');
  function setEnergy(val) {
    val = Math.max(0.01, Math.min(20, parseFloat(val)));
    fp.energy_eV = val;
    if (eSlider) eSlider.value = val;
    if (eInput)  eInput.value  = val.toFixed(3);
    fpFullReset();
  }
  if (eSlider) eSlider.addEventListener('input', () => setEnergy(eSlider.value));
  if (eInput)  eInput.addEventListener('change', () => setEnergy(eInput.value));

  // ── Sigma0 ─────────────────────────────────────────────────────────────────
  const sSlider = document.getElementById('fp-sigma-slider');
  const sInput  = document.getElementById('fp-sigma-input');
  function setSigma(val) {
    val = Math.max(1, Math.min(20, parseFloat(val)));
    fp.sigma0_nm = val;
    if (sSlider) sSlider.value = val;
    if (sInput)  sInput.value  = val.toFixed(1);
    fpFullReset();
  }
  if (sSlider) sSlider.addEventListener('input', () => setSigma(sSlider.value));
  if (sInput)  sInput.addEventListener('change', () => setSigma(sInput.value));

  // ── SigmaY0 (independent vertical spread) ─────────────────────────────────
  const sySlider = document.getElementById('fp-sigmay-slider');
  const syInput  = document.getElementById('fp-sigmay-input');
  function setSigmaY(val) {
    val = Math.max(8, Math.min(60, parseFloat(val)));
    fp.sigmaY0_nm = val;
    if (sySlider) sySlider.value = val;
    if (syInput)  syInput.value  = val.toFixed(0);
    fpFullReset();
  }
  if (sySlider) sySlider.addEventListener('input', () => setSigmaY(sySlider.value));
  if (syInput)  syInput.addEventListener('change', () => setSigmaY(syInput.value));

  // ── Number of sections ───────────────────────────────────────────────────────
  const nsSlider = document.getElementById('fp-nsect-slider');
  const nsInput  = document.getElementById('fp-nsect-input');
  function setNSections(val) {
    val = Math.max(2, Math.min(12, parseInt(val) || 6));
    fp.nSections   = val;
    fp.sectionHits = new Array(val).fill(0);
    fp.sectionExpected = new Array(val).fill(0);
    if (nsSlider) nsSlider.value = val;
    if (nsInput)  nsInput.value  = val;
    fpManageMWView();
    fpFullReset();
  }
  if (nsSlider) nsSlider.addEventListener('input',  () => setNSections(nsSlider.value));
  if (nsInput)  nsInput.addEventListener('change', () => setNSections(nsInput.value));

  // ── Start / Stop ───────────────────────────────────────────────────────────
  const btnStart = document.getElementById('fp-btn-start');
  const btnStop  = document.getElementById('fp-btn-stop');
  const btnReset = document.getElementById('fp-btn-reset');
  const autoNext = document.getElementById('fp-auto-next');

  if (autoNext) {
    autoNext.checked = !!fp.autoNextCycle;
    autoNext.addEventListener('change', () => {
      fp.autoNextCycle = !!autoNext.checked;
    });
  }

  if (btnStart) btnStart.addEventListener('click', () => {
    if (!fp.running) {
      // After a completed measurement, Start launches the next run directly.
      const resumingCollapse = fp.interpMode === 'collapse' && fp.bDetected
        && fp.collapseElapsed_ms < FP_COLLAPSE_DURATION_MS;
      const inspectingMW = fp.interpMode === 'manyworlds' && fp.mwWaitingForChoice
        && !fp.mwZoom?.complete;
      if ((fp.bDetected || fp.mwFired) && !resumingCollapse && !inspectingMW) {
        fpRunReset();
      }
      fp._lastFrameTime_ms = null;
      fp.running = true;
      fp.animId  = requestAnimationFrame(fpStep);
      btnStart.disabled = true;
      if (btnStop) btnStop.disabled = false;
    }
  });
  if (btnStop) btnStop.addEventListener('click', () => {
    fp.running = false;
    if (fp.animId) { cancelAnimationFrame(fp.animId); fp.animId = null; }
    if (btnStart) btnStart.disabled = false;
    btnStop.disabled = true;
  });
  if (btnReset) btnReset.addEventListener('click', () => {
    fp.running = false;
    if (fp.animId) { cancelAnimationFrame(fp.animId); fp.animId = null; }
    if (btnStart) btnStart.disabled = false;
    if (btnStop)  btnStop.disabled = true;
    fpFullReset();
  });

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, select, textarea, [contenteditable="true"]')) return;
    if (e.code === 'Space') {
      if (e.target.tagName === 'BUTTON') return; // Space activates the focused button.
      e.preventDefault();
      if (fp.running) {
        btnStop && btnStop.click();
      } else {
        btnStart && btnStart.click();
      }
    }
    if (e.code === 'KeyR') { btnReset && btnReset.click(); }
  });
}

