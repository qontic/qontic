'use strict';
// ============================================================
//  Double-slit Schrödinger simulation – Web Worker
//  Split-operator (Fourier spectral) + Bohmian trajectories
//  All quantities in SI units
// ============================================================

// ── Physical constants ───────────────────────────────────────
const HB   = 1.054571817e-34;   // ℏ  J·s
const ME   = 9.10938356e-31;    // electron mass kg
const QE   = 1.602176634e-19;   // elementary charge C

// ── Simulation configuration (defaults match MATLAB script) ──
let cfg = {
  Nx: 128, Ny: 128,
  Lx: 100e-9, Ly: 100e-9,           // domain size [m]
  Dt: 0.05e-15,                      // time step [s]
  slitCenterY1: 0.30,                // slit 1 centre (fractional y)
  slitCenterY2: 0.70,                // slit 2 centre (fractional y)
  slitHalfWidth: 0.04,               // half-width of each slit (fractional)
  slitX: 0.50,                       // barrier x position (fractional)
  barrierThick: 5,                   // barrier thickness in grid cells
  velox: 1.0e5,                      // initial vx [m/s]
  veloy: 0.0,                        // initial vy [m/s]
  sigmax: 6.0e-9,                    // wave-packet width x [m]
  sigmay: 10.0e-9,                   // wave-packet width y [m]
  xfrac: 0.20,                       // initial x position (fractional)
  Np: 300,                           // number of Bohmian particles
  barrierV: 10 * QE,                 // barrier potential height [J]
  stepsPerFrame: 16,                 // physics steps per animation frame
};

// ── Runtime state (allocated in init) ────────────────────────
let Nx, Ny, N, Dx, Dy, Dt;
let psiRe, psiIm;                    // wave function (real, imag)
let tmpRe, tmpIm;                    // pre-allocated FFT scratch (avoid GC)
let rowRe, rowIm, colRe, colIm;     // 1-D FFT scratch
let VpropRe, VpropIm;               // position-space half-step propagator
let TpropRe, TpropIm;               // k-space full-step propagator
let posX, posY;                      // Bohmian particle positions
let rho;                             // probability density |ψ|²
let simTime = 0;

// ─────────────────────────────────────────────────────────────
//  1-D radix-2 Cooley–Tukey FFT  (in-place, length must be power-of-2)
// ─────────────────────────────────────────────────────────────
function fft1d(re, im, inverse) {
  const n = re.length;
  // bit-reversal permutation
  for (let i = 0, j = 0; i < n; i++) {
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t;
          t = im[i]; im[i] = im[j]; im[j] = t;
    }
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
  }
  // butterfly passes
  const sign = inverse ? 1.0 : -1.0;
  for (let len = 2; len <= n; len <<= 1) {
    const halfLen = len >> 1;
    const ang = sign * 2.0 * Math.PI / len;
    const wBaseRe = Math.cos(ang), wBaseIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let uRe = 1.0, uIm = 0.0;
      for (let k = 0; k < halfLen; k++) {
        const eRe = re[i+k+halfLen]*uRe - im[i+k+halfLen]*uIm;
        const eIm = re[i+k+halfLen]*uIm + im[i+k+halfLen]*uRe;
        re[i+k+halfLen] = re[i+k] - eRe;
        im[i+k+halfLen] = im[i+k] - eIm;
        re[i+k] += eRe;
        im[i+k] += eIm;
        const nRe = uRe*wBaseRe - uIm*wBaseIm;
        uIm = uRe*wBaseIm + uIm*wBaseRe;
        uRe = nRe;
      }
    }
  }
  if (inverse) {
    for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  }
}

// 2-D FFT via rows then columns (stores result back in psiRe/psiIm)
function fft2d(reArr, imArr, inverse) {
  // FFT each row (fixed ix, vary iy)
  for (let ix = 0; ix < Nx; ix++) {
    const off = ix * Ny;
    rowRe.set(reArr.subarray(off, off + Ny));
    rowIm.set(imArr.subarray(off, off + Ny));
    fft1d(rowRe, rowIm, inverse);
    reArr.set(rowRe, off);
    imArr.set(rowIm, off);
  }
  // FFT each column (fixed iy, vary ix)
  for (let iy = 0; iy < Ny; iy++) {
    for (let ix = 0; ix < Nx; ix++) { colRe[ix] = reArr[ix*Ny+iy]; colIm[ix] = imArr[ix*Ny+iy]; }
    fft1d(colRe, colIm, inverse);
    for (let ix = 0; ix < Nx; ix++) { reArr[ix*Ny+iy] = colRe[ix]; imArr[ix*Ny+iy] = colIm[ix]; }
  }
}

// ─────────────────────────────────────────────────────────────
//  Build potential and propagators
// ─────────────────────────────────────────────────────────────
function buildPropagators() {
  Nx = cfg.Nx; Ny = cfg.Ny; N = Nx * Ny; Dt = cfg.Dt;
  const Lx = cfg.Lx, Ly = cfg.Ly;
  Dx = Lx / (Nx - 1);
  Dy = Ly / (Ny - 1);
  const dkx = 2 * Math.PI / Lx;
  const dky = 2 * Math.PI / Ly;

  // ── Double-slit potential V ──────────────────────────────
  const V = new Float64Array(N); // zero everywhere
  const barrierIx = Math.floor(cfg.slitX * (Nx - 1));
  const j1c = Math.floor(cfg.slitCenterY1 * (Ny - 1));
  const j2c = Math.floor(cfg.slitCenterY2 * (Ny - 1));
  const hw  = Math.floor(cfg.slitHalfWidth * (Ny - 1));
  // Fill the entire barrier column with V, then carve out slit gaps
  for (let t = 0; t < cfg.barrierThick; t++) {
    const ix = barrierIx + t;
    if (ix >= Nx) continue;
    for (let iy = 0; iy < Ny; iy++) {
      // Is this grid cell OUTSIDE both slits? → wall
      const inSlit1 = Math.abs(iy - j1c) <= hw;
      const inSlit2 = Math.abs(iy - j2c) <= hw;
      if (!inSlit1 && !inSlit2) {
        V[ix * Ny + iy] = cfg.barrierV;
      }
    }
  }

  // ── Half-step V propagator: exp(-i V Dt / 2ℏ) ───────────
  VpropRe = new Float64Array(N);
  VpropIm = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const ang = V[i] * Dt / (2 * HB);
    VpropRe[i] =  Math.cos(ang);
    VpropIm[i] = -Math.sin(ang);
  }

  // ── Full-step T propagator in k-space (natural FFT order) ─
  TpropRe = new Float64Array(N);
  TpropIm = new Float64Array(N);
  for (let jx = 0; jx < Nx; jx++) {
    const kx = jx < Nx/2 ? jx * dkx : (jx - Nx) * dkx;
    for (let jy = 0; jy < Ny; jy++) {
      const ky = jy < Ny/2 ? jy * dky : (jy - Ny) * dky;
      const ang = HB * (kx*kx + ky*ky) / (2 * ME) * Dt;
      const idx = jx * Ny + jy;
      TpropRe[idx] =  Math.cos(ang);
      TpropIm[idx] = -Math.sin(ang);
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  Initialise wave function ψ₀ = ψx(x) · ψy(y)
// ─────────────────────────────────────────────────────────────
function initWavePacket() {
  const Lx = cfg.Lx, Ly = cfg.Ly;
  const sx = cfg.sigmax, sy = cfg.sigmay;
  const x0 = cfg.xfrac * Lx;
  const y0 = Ly / 2;
  const vx = cfg.velox, vy = cfg.veloy;

  // 1-D marginals
  const psixRe = new Float64Array(Nx);
  const psixIm = new Float64Array(Nx);
  const psiyRe = new Float64Array(Ny);
  const psiyIm = new Float64Array(Ny);

  const normX = Math.pow(1 / (2 * Math.PI * sx * sx), 0.25) / Math.sqrt(2);
  const normY = Math.pow(1 / (2 * Math.PI * sy * sy), 0.25) / Math.sqrt(2);

  for (let ix = 0; ix < Nx; ix++) {
    const x = ix * Dx;
    const gauss = normX * Math.exp(-(x - x0)*(x - x0) / (4 * sx * sx));
    const phase = ME * vx * (x - x0) / HB;
    psixRe[ix] = gauss * Math.cos(phase);
    psixIm[ix] = gauss * Math.sin(phase);
  }
  for (let iy = 0; iy < Ny; iy++) {
    const y = iy * Dy;
    const gauss = normY * Math.exp(-(y - y0)*(y - y0) / (4 * sy * sy));
    const phase = ME * vy * (y - y0) / HB;
    psiyRe[iy] = gauss * Math.cos(phase);
    psiyIm[iy] = gauss * Math.sin(phase);
  }

  // outer product ψ(x,y) = ψx(x) · ψy(y)
  psiRe = new Float64Array(N);
  psiIm = new Float64Array(N);
  for (let ix = 0; ix < Nx; ix++) {
    for (let iy = 0; iy < Ny; iy++) {
      const idx = ix * Ny + iy;
      psiRe[idx] = psixRe[ix] * psiyRe[iy] - psixIm[ix] * psiyIm[iy];
      psiIm[idx] = psixRe[ix] * psiyIm[iy] + psixIm[ix] * psiyRe[iy];
    }
  }

  // normalise using trapezoidal rule (approx: multiply by Dx·Dy)
  let norm2 = 0;
  for (let i = 0; i < N; i++) norm2 += psiRe[i]*psiRe[i] + psiIm[i]*psiIm[i];
  norm2 *= Dx * Dy;
  const invNorm = 1 / Math.sqrt(norm2);
  for (let i = 0; i < N; i++) { psiRe[i] *= invNorm; psiIm[i] *= invNorm; }
}

// ─────────────────────────────────────────────────────────────
//  Sample Bohmian initial positions from |ψ|²
// ─────────────────────────────────────────────────────────────
function initBohmian() {
  const Np = cfg.Np;
  posX = new Float64Array(Np);
  posY = new Float64Array(Np);

  // Build cumulative distribution from |ψ|²
  const pdf = new Float64Array(N);
  let total = 0;
  for (let i = 0; i < N; i++) {
    pdf[i] = psiRe[i]*psiRe[i] + psiIm[i]*psiIm[i];
    total += pdf[i];
  }
  const cdf = new Float64Array(N);
  let cum = 0;
  for (let i = 0; i < N; i++) { cum += pdf[i] / total; cdf[i] = cum; }

  // Inverse-CDF sampling
  for (let p = 0; p < Np; p++) {
    const u = Math.random();
    // binary search
    let lo = 0, hi = N - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid] < u) lo = mid + 1; else hi = mid; }
    const ix = Math.floor(lo / Ny);
    const iy = lo % Ny;
    posX[p] = ix * Dx + (Math.random() - 0.5) * Dx;
    posY[p] = iy * Dy + (Math.random() - 0.5) * Dy;
    // clamp
    posX[p] = Math.max(Dx, Math.min((Nx - 2) * Dx, posX[p]));
    posY[p] = Math.max(Dy, Math.min((Ny - 2) * Dy, posY[p]));
  }
}

// ─────────────────────────────────────────────────────────────
//  Single split-operator time step  Δt
// ─────────────────────────────────────────────────────────────
function stepSplitOperator() {
  // 1. Half-step V: ψ ← Vprop · ψ
  for (let i = 0; i < N; i++) {
    const r = psiRe[i], im = psiIm[i];
    psiRe[i] = r * VpropRe[i] - im * VpropIm[i];
    psiIm[i] = r * VpropIm[i] + im * VpropRe[i];
  }

  // 2. FFT to k-space
  tmpRe.set(psiRe);
  tmpIm.set(psiIm);
  fft2d(tmpRe, tmpIm, false);

  // 3. Full-step T propagator
  for (let i = 0; i < N; i++) {
    const r = tmpRe[i], im = tmpIm[i];
    tmpRe[i] = r * TpropRe[i] - im * TpropIm[i];
    tmpIm[i] = r * TpropIm[i] + im * TpropRe[i];
  }

  // 4. IFFT back to position space
  fft2d(tmpRe, tmpIm, true);
  psiRe = tmpRe;
  psiIm = tmpIm;

  // 5. Half-step V again
  for (let i = 0; i < N; i++) {
    const r = psiRe[i], im = psiIm[i];
    psiRe[i] = r * VpropRe[i] - im * VpropIm[i];
    psiIm[i] = r * VpropIm[i] + im * VpropRe[i];
  }

  simTime += Dt;
}

// ─────────────────────────────────────────────────────────────
//  Update Bohmian trajectories (one full Dt, single Euler step)
// ─────────────────────────────────────────────────────────────
function stepBohmian() {
  const Np = cfg.Np;
  const hbOverM = HB / ME;

  for (let p = 0; p < Np; p++) {
    // grid indices with clamping
    let ix = Math.floor(posX[p] / Dx);
    let iy = Math.floor(posY[p] / Dy);
    ix = Math.max(1, Math.min(Nx - 2, ix));
    iy = Math.max(1, Math.min(Ny - 2, iy));

    const c  = ix * Ny + iy;
    const re = psiRe[c], im = psiIm[c];
    const mod2 = re*re + im*im;

    if (mod2 < 1e-60) continue; // avoid division by near-zero

    // ∂ψ/∂x via central differences
    const dxRe = (psiRe[(ix+1)*Ny+iy] - psiRe[(ix-1)*Ny+iy]) / (2*Dx);
    const dxIm = (psiIm[(ix+1)*Ny+iy] - psiIm[(ix-1)*Ny+iy]) / (2*Dx);
    // Im( (∂ψ/∂x) / ψ ) = Im( (ar+i·ai)(re-i·im) ) / mod2
    //                    = (ai·re - ar·im) / mod2
    const vx = hbOverM * (dxIm * re - dxRe * im) / mod2;

    // ∂ψ/∂y
    const dyRe = (psiRe[ix*Ny+(iy+1)] - psiRe[ix*Ny+(iy-1)]) / (2*Dy);
    const dyIm = (psiIm[ix*Ny+(iy+1)] - psiIm[ix*Ny+(iy-1)]) / (2*Dy);
    const vy = hbOverM * (dyIm * re - dyRe * im) / mod2;

    posX[p] += vx * Dt;
    posY[p] += vy * Dt;

    // reflect at domain boundaries
    if (posX[p] < 0)         posX[p] = -posX[p];
    if (posX[p] > cfg.Lx)   posX[p] = 2*cfg.Lx - posX[p];
    if (posY[p] < 0)         posY[p] = -posY[p];
    if (posY[p] > cfg.Ly)   posY[p] = 2*cfg.Ly - posY[p];
    // clamp after reflection
    posX[p] = Math.max(Dx, Math.min((Nx-2)*Dx, posX[p]));
    posY[p] = Math.max(Dy, Math.min((Ny-2)*Dy, posY[p]));
  }
}

// ─────────────────────────────────────────────────────────────
//  Compute |ψ|², normalisation, and pack output
// ─────────────────────────────────────────────────────────────
function computeRho() {
  rho = new Float32Array(N);
  let norm2 = 0;
  for (let i = 0; i < N; i++) {
    rho[i] = psiRe[i]*psiRe[i] + psiIm[i]*psiIm[i];
    norm2 += rho[i];
  }
  return norm2 * Dx * Dy;
}

// ─────────────────────────────────────────────────────────────
//  Full initialisation
// ─────────────────────────────────────────────────────────────
function init(newCfg) {
  if (newCfg) cfg = { ...cfg, ...newCfg };
  Nx = cfg.Nx; Ny = cfg.Ny; N = Nx * Ny; Dt = cfg.Dt;
  const Lx = cfg.Lx, Ly = cfg.Ly;
  Dx = Lx / (Nx - 1);
  Dy = Ly / (Ny - 1);
  // Allocate scratch arrays (pre-allocated once to avoid GC pressure)
  rowRe = new Float64Array(Ny);
  rowIm = new Float64Array(Ny);
  colRe = new Float64Array(Nx);
  colIm = new Float64Array(Nx);
  tmpRe = new Float64Array(N);
  tmpIm = new Float64Array(N);
  buildPropagators();
  initWavePacket();
  initBohmian();
  simTime = 0;
  // Send initial frame immediately
  postFrame();
}

// Send one frame to the main thread
function postFrame() {
  const norm = computeRho();
  // Convert Bohmian positions to Float32 (fractional 0-1 for simple transfer)
  const Np = cfg.Np;
  const txF = new Float32Array(Np);
  const tyF = new Float32Array(Np);
  for (let p = 0; p < Np; p++) {
    txF[p] = posX[p] / cfg.Lx;
    tyF[p] = posY[p] / cfg.Ly;
  }
  self.postMessage(
    { type: 'frame', rho, trajX: txF, trajY: tyF, time: simTime, norm,
      Nx: cfg.Nx, Ny: cfg.Ny },
    [rho.buffer, txF.buffer, tyF.buffer]
  );
}

// ─────────────────────────────────────────────────────────────
//  Message handler
// ─────────────────────────────────────────────────────────────
self.onmessage = (e) => {
  const msg = e.data;
  switch (msg.type) {
    case 'init':
      init(msg.config);
      break;
    case 'step': {
      const steps = msg.stepsPerFrame || cfg.stepsPerFrame;
      for (let s = 0; s < steps; s++) {
        stepSplitOperator();
        stepBohmian();
      }
      postFrame();
      break;
    }
    case 'config':
      // Full reinit on any config change
      init(msg.config);
      break;
  }
};
