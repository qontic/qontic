/**
 * bm2d.jsx — 2D Split-Operator Quantum Measurement  (GPU accelerated)
 *
 * Physics ported directly from matlab2D_measurement_transmitted_charge.m
 *
 * Grid:   N=256, Lx=Ly=100 nm, Dt=0.04 fs
 * ψ(x,y) propagated entirely on the GPU via WebGL fragment shaders:
 *   1. V-half   : pointwise multiply by exp(-i V Dt/2ℏ)
 *   2. W-half   : finite-difference y-shift on Q-mask rows
 *   3. T-full   : Stockham FFT2D → multiply Tprop → IFFT2D
 *   4. W-half   : repeat (2)
 *   5. V-half   : repeat (1)
 * Barrier: V0 at x∈[Nx/2, Nx/2+2], height=0.05q
 * Q mask:  x∈[Qini=155,Qfin=219]
 * λ = λ₂·(Dt/2)/(2·Dy),  λ₂=1e5 m/s
 *
 * ψ stored as RGBA float32 texture: (Re, Im, 0, 0)
 * FFT uses log2(N) passes of the Stockham algorithm.
 *
 * Bohmian trajectories: CPU, reading back rho once per frame (async).
 */

import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";

// ── Physical constants (SI) ───────────────────────────────────────────────────
const HB  = 1.054571817e-34;   // J·s
const M   = 9.10938356e-31;    // kg
const Q_C = 1.602176634e-19;   // C

// ── Grid parameters ────────────────────────────────────────────────────────────
const NX = 256, NY = 256;
const LX = 100e-9, LY = 100e-9;
const DX = LX / (NX - 1);
const DY = LY / (NY - 1);
const DT = 0.04e-15;           // 0.04 fs time step

// ── Simulation parameters ──────────────────────────────────────────────────────
const NP        = 60;           // number of Bohmian trajectories
const STEPS_VIS = 400;          // how many DT steps between full resets
const SKIP      = 160;          // DT steps per animation frame (speed knob baseline)
const NUMLIM    = 500;          // adaptive sub-step limit for Bohmian integrator

// ── Measurement coupling ──────────────────────────────────────────────────────
const LAMBDA2 = 1e5;                          // m/s
const LAMBDA  = LAMBDA2 * (DT / 2) / (2 * DY); // finite-diff coefficient
const QINI = 154, QFIN = 219;                  // 0-based indices

// ── Barrier ───────────────────────────────────────────────────────────────────
const BARRIER_HEIGHT = 0.05 * Q_C;            // J
const BARRIER_INI    = Math.floor(NX / 2) - 1; // 0-based
const BARRIER_FIN    = BARRIER_INI + 2;

// ── Initial wave-packet parameters ────────────────────────────────────────────
const VELOX    = 0.8e5;     // x velocity m/s
const SIGMAX   = 6.0e-9;    // σx in m
const XCENTRAL = 30.0e-9;   // initial x centre
const VELOY    = 0.0;
const SIGMAY   = 6.0e-9;
const YCENTRAL = (2 / 3) * LY;  // pointer resting position

// ── Total simulation time (limited so it fits on screen) ─────────────────────
const NT_TOTAL = 16000;         // matches MATLAB; we run a window at a time

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

// ── Complex FFT (radix-2 Cooley-Tukey, in-place) ─────────────────────────────
function fftRadix2(re, im, inverse) {
  const n = re.length;
  // bit-reversal
  for (let i = 0, j = 0; i < n; i++) {
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t;
      t = im[i]; im[i] = im[j]; im[j] = t;
    }
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
  }
  const sign = inverse ? 1 : -1;
  for (let len = 2; len <= n; len <<= 1) {
    const ang = sign * 2 * Math.PI / len;
    const wRe = Math.cos(ang), wIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let uRe = 1, uIm = 0;
      for (let j = 0; j < len / 2; j++) {
        const tRe = uRe * re[i+j+len/2] - uIm * im[i+j+len/2];
        const tIm = uRe * im[i+j+len/2] + uIm * re[i+j+len/2];
        re[i+j+len/2] = re[i+j] - tRe;
        im[i+j+len/2] = im[i+j] - tIm;
        re[i+j] += tRe;
        im[i+j] += tIm;
        const nu = uRe * wRe - uIm * wIm;
        uIm = uRe * wIm + uIm * wRe;
        uRe = nu;
      }
    }
  }
  if (inverse) {
    for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  }
}

// ── 2D FFT (row-by-row then column-by-column) ─────────────────────────────────
// psiRe, psiIm: Float64Array of length NX*NY, row-major (x fast, y slow)
// i.e. index = ix + iy*NX
function fft2d(psiRe, psiIm, inverse) {
  const rowRe = new Float64Array(NX);
  const rowIm = new Float64Array(NX);
  // rows (fixed iy, vary ix)
  for (let iy = 0; iy < NY; iy++) {
    for (let ix = 0; ix < NX; ix++) {
      rowRe[ix] = psiRe[ix + iy * NX];
      rowIm[ix] = psiIm[ix + iy * NX];
    }
    fftRadix2(rowRe, rowIm, inverse);
    for (let ix = 0; ix < NX; ix++) {
      psiRe[ix + iy * NX] = rowRe[ix];
      psiIm[ix + iy * NX] = rowIm[ix];
    }
  }
  // columns (fixed ix, vary iy)
  const colRe = new Float64Array(NY);
  const colIm = new Float64Array(NY);
  for (let ix = 0; ix < NX; ix++) {
    for (let iy = 0; iy < NY; iy++) {
      colRe[iy] = psiRe[ix + iy * NX];
      colIm[iy] = psiIm[ix + iy * NX];
    }
    fftRadix2(colRe, colIm, inverse);
    for (let iy = 0; iy < NY; iy++) {
      psiRe[ix + iy * NX] = colRe[iy];
      psiIm[ix + iy * NX] = colIm[iy];
    }
  }
}

// fftshift for 1D array of length n
function fftshift1d(arr, n) {
  const half = n >> 1;
  for (let i = 0; i < half; i++) {
    const t = arr[i]; arr[i] = arr[i + half]; arr[i + half] = t;
  }
}

// fftshift2d on (psiRe, psiIm): swap quadrants
function fftshift2d(psiRe, psiIm) {
  const hx = NX >> 1, hy = NY >> 1;
  for (let iy = 0; iy < hy; iy++) {
    for (let ix = 0; ix < hx; ix++) {
      const a = ix       + iy       * NX;
      const b = ix + hx  + (iy + hy)* NX;
      let t = psiRe[a]; psiRe[a] = psiRe[b]; psiRe[b] = t;
      t = psiIm[a]; psiIm[a] = psiIm[b]; psiIm[b] = t;
    }
    for (let ix = hx; ix < NX; ix++) {
      const a = ix       + iy       * NX;
      const b = ix - hx  + (iy + hy)* NX;
      let t = psiRe[a]; psiRe[a] = psiRe[b]; psiRe[b] = t;
      t = psiIm[a]; psiIm[a] = psiIm[b]; psiIm[b] = t;
    }
  }
}

// ── Pre-compute static arrays ─────────────────────────────────────────────────
// x and y grids
const XS = new Float64Array(NX);
const YS = new Float64Array(NY);
for (let i = 0; i < NX; i++) XS[i] = i * DX;
for (let i = 0; i < NY; i++) YS[i] = i * DY;

// Q mask (measurement region) — 1D over x
const QMASK = new Uint8Array(NX);
for (let ix = QINI; ix <= QFIN; ix++) QMASK[ix] = 1;

// Q 2D array — Q[ix,iy] = QMASK[ix]
// (We only need QMASK for the propagation, Q values for velocity correction)

// Barrier potential V[ix,iy]
const V_ARR = new Float64Array(NX * NY);
for (let ix = BARRIER_INI; ix <= BARRIER_FIN; ix++) {
  for (let iy = 0; iy < NY; iy++) {
    V_ARR[ix + iy * NX] = BARRIER_HEIGHT;
  }
}

// Split-operator Vprop: exp(-i V Dt / (2 ℏ))
// Re and Im parts
const VPROP_RE = new Float64Array(NX * NY);
const VPROP_IM = new Float64Array(NX * NY);
for (let k = 0; k < NX * NY; k++) {
  const phi = -V_ARR[k] * DT / (2 * HB);
  VPROP_RE[k] = Math.cos(phi);
  VPROP_IM[k] = Math.sin(phi);
}

// Momentum grids kx, ky (after fftshift: centred)
// kx[i] = (i - NX/2) * 2π/Lx
const KX = new Float64Array(NX);
const KY = new Float64Array(NY);
for (let i = 0; i < NX; i++) KX[i] = (i - NX / 2) * 2 * Math.PI / LX;
for (let i = 0; i < NY; i++) KY[i] = (i - NY / 2) * 2 * Math.PI / LY;

// Tprop: exp(-i ℏ(kx²+ky²)/(2m) · Dt)
const TPROP_RE = new Float64Array(NX * NY);
const TPROP_IM = new Float64Array(NX * NY);
for (let iy = 0; iy < NY; iy++) {
  for (let ix = 0; ix < NX; ix++) {
    const phi = -(HB * (KX[ix] * KX[ix] + KY[iy] * KY[iy]) / (2 * M)) * DT;
    TPROP_RE[ix + iy * NX] = Math.cos(phi);
    TPROP_IM[ix + iy * NX] = Math.sin(phi);
  }
}

// ── Build initial wavefunction ────────────────────────────────────────────────
function buildInitialPsi() {
  const psiRe = new Float64Array(NX * NY);
  const psiIm = new Float64Array(NX * NY);

  const normX = Math.pow(2 * Math.PI * SIGMAX * SIGMAX, -0.25) / Math.SQRT2;
  const normY = Math.pow(2 * Math.PI * SIGMAY * SIGMAY, -0.25) / Math.SQRT2;

  for (let iy = 0; iy < NY; iy++) {
    const dy = YS[iy] - YCENTRAL;
    const gy  = normY * Math.exp(-dy * dy / (4 * SIGMAY * SIGMAY));
    const phY = M * VELOY * dy / HB;
    const gyRe = gy * Math.cos(phY);
    const gyIm = gy * Math.sin(phY);

    for (let ix = 0; ix < NX; ix++) {
      const dx = XS[ix] - XCENTRAL;
      const gx  = normX * Math.exp(-dx * dx / (4 * SIGMAX * SIGMAX));
      const phX = M * VELOX * dx / HB;
      const gxRe = gx * Math.cos(phX);
      const gxIm = gx * Math.sin(phX);

      // psi = psix * psiy  (complex product)
      psiRe[ix + iy * NX] = gxRe * gyRe - gxIm * gyIm;
      psiIm[ix + iy * NX] = gxRe * gyIm + gxIm * gyRe;
    }
  }

  // Normalize via trapz-like sum (uniform grid → just sum)
  let norm2 = 0;
  for (let k = 0; k < NX * NY; k++) {
    norm2 += psiRe[k] * psiRe[k] + psiIm[k] * psiIm[k];
  }
  norm2 *= DX * DY;
  const inv = 1 / Math.sqrt(norm2);
  for (let k = 0; k < NX * NY; k++) {
    psiRe[k] *= inv;
    psiIm[k] *= inv;
  }
  return { psiRe, psiIm };
}

// ── One split-operator time step ──────────────────────────────────────────────
function stepPsi(psiRe, psiIm, detectorOn) {
  // V half-step
  for (let k = 0; k < NX * NY; k++) {
    const re = psiRe[k], im = psiIm[k];
    const vr = VPROP_RE[k], vi = VPROP_IM[k];
    psiRe[k] = re * vr - im * vi;
    psiIm[k] = re * vi + im * vr;
  }

  // W half-step (measurement coupling, finite differences in y for x in Q-mask)
  if (detectorOn) {
    for (let ix = QINI; ix <= QFIN; ix++) {
      for (let iy = 1; iy < NY - 1; iy++) {
        const k  = ix + iy * NX;
        const kp = ix + (iy + 1) * NX;
        const km = ix + (iy - 1) * NX;
        psiRe[k] += LAMBDA * (psiRe[kp] - psiRe[km]);
        psiIm[k] += LAMBDA * (psiIm[kp] - psiIm[km]);
      }
    }
  }

  // T full step: FFT → multiply by Tprop → IFFT
  fft2d(psiRe, psiIm, false);
  fftshift2d(psiRe, psiIm);
  for (let k = 0; k < NX * NY; k++) {
    const re = psiRe[k], im = psiIm[k];
    const tr = TPROP_RE[k], ti = TPROP_IM[k];
    psiRe[k] = re * tr - im * ti;
    psiIm[k] = re * ti + im * tr;
  }
  fftshift2d(psiRe, psiIm);
  fft2d(psiRe, psiIm, true);

  // W half-step again
  if (detectorOn) {
    for (let ix = QINI; ix <= QFIN; ix++) {
      for (let iy = 1; iy < NY - 1; iy++) {
        const k  = ix + iy * NX;
        const kp = ix + (iy + 1) * NX;
        const km = ix + (iy - 1) * NX;
        psiRe[k] += LAMBDA * (psiRe[kp] - psiRe[km]);
        psiIm[k] += LAMBDA * (psiIm[kp] - psiIm[km]);
      }
    }
  }

  // V half-step
  for (let k = 0; k < NX * NY; k++) {
    const re = psiRe[k], im = psiIm[k];
    const vr = VPROP_RE[k], vi = VPROP_IM[k];
    psiRe[k] = re * vr - im * vi;
    psiIm[k] = re * vi + im * vr;
  }
}

// ── Bohmian velocity at (px, py) ─────────────────────────────────────────────
function bohmVelocity(psiRe, psiIm, px, py) {
  const ix = clamp(Math.floor(px / DX), 2, NX - 3);
  const iy = clamp(Math.floor(py / DY), 2, NY - 3);

  const k   = ix + iy * NX;
  const phR = psiRe[k], phI = psiIm[k];
  const rho2 = phR * phR + phI * phI;

  if (rho2 < 1e-30) return { vx: 0, vy: 0 };

  const dxR = (psiRe[ix + 1 + iy * NX] - psiRe[ix - 1 + iy * NX]) / (2 * DX);
  const dxI = (psiIm[ix + 1 + iy * NX] - psiIm[ix - 1 + iy * NX]) / (2 * DX);
  const dyR = (psiRe[ix + (iy + 1) * NX] - psiRe[ix + (iy - 1) * NX]) / (2 * DY);
  const dyI = (psiIm[ix + (iy + 1) * NX] - psiIm[ix + (iy - 1) * NX]) / (2 * DY);

  // Im(dphi/dx / phi) = Im((dxR+i dxI)(phR-i phI)) / rho2
  //                   = (phR * dxI - phI * dxR) / rho2
  const vx = (HB / M) * (phR * dxI - phI * dxR) / rho2;
  const vyPsi = (HB / M) * (phR * dyI - phI * dyR) / rho2;

  // Subtract λ₂·Q(ix) correction (the measurement back-action on Bohmian vy)
  const qVal = (ix >= QINI && ix <= QFIN) ? 1.0 : 0.0;
  const vy = vyPsi - LAMBDA2 * qVal;

  return { vx, vy };
}

// ── Advance Bohmian trajectory one DT step (adaptive sub-stepping) ────────────
function advanceParticle(psiRe, psiIm, px, py) {
  let tRem = DT;
  let control = 0;
  while (control === 0) {
    const ix = clamp(Math.floor(px / DX), 0, NX - 1);
    const iy = clamp(Math.floor(py / DY), 0, NY - 1);

    const { vx, vy } = bohmVelocity(psiRe, psiIm, px, py);

    // Adaptive sub-step: don't cross more than one cell
    let dtx, dty;
    if (Math.abs(vx) < 1e-30) {
      dtx = DT;
    } else if (vx > 0) {
      dtx = Math.abs(((ix + 1) * DX - px) / vx);
      if (dtx < DT / NUMLIM) dtx = Math.abs(DX / (vx * NUMLIM));
    } else {
      dtx = Math.abs((px - ix * DX) / vx);
      if (dtx < DT / NUMLIM) dtx = Math.abs(DX / (Math.abs(vx) * NUMLIM));
    }
    if (Math.abs(vy) < 1e-30) {
      dty = DT;
    } else if (vy > 0) {
      dty = Math.abs(((iy + 1) * DY - py) / vy);
      if (dty < DT / NUMLIM) dty = Math.abs(DY / (vy * NUMLIM));
    } else {
      dty = Math.abs((py - iy * DY) / vy);
      if (dty < DT / NUMLIM) dty = Math.abs(DY / (Math.abs(vy) * NUMLIM));
    }

    const tempo = Math.min(DT, Math.min(tRem, Math.min(dtx, dty)));
    px = clamp(px + vx * tempo, 0, LX);
    py = clamp(py + vy * tempo, 0, LY);
    tRem -= tempo;
    if (tRem < DT / NUMLIM) control = 1;
  }
  return { px, py };
}

// ── Sample NP initial positions from |ψ(x,y,0)|² ─────────────────────────────
function sampleInitialPositions(psiRe, psiIm) {
  const pdf = new Float64Array(NX * NY);
  let total = 0;
  for (let k = 0; k < NX * NY; k++) {
    pdf[k] = psiRe[k] * psiRe[k] + psiIm[k] * psiIm[k];
    total += pdf[k];
  }
  // normalise to CDF
  const cdf = new Float64Array(NX * NY);
  cdf[0] = pdf[0] / total;
  for (let k = 1; k < NX * NY; k++) cdf[k] = cdf[k - 1] + pdf[k] / total;

  const px = new Float64Array(NP);
  const py = new Float64Array(NP);
  for (let ip = 0; ip < NP; ip++) {
    const r = Math.random();
    let lo = 0, hi = NX * NY - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1; else hi = mid;
    }
    const ix = lo % NX, iy = Math.floor(lo / NX);
    // small random offset within the cell
    px[ip] = (ix + Math.random()) * DX;
    py[ip] = (iy + Math.random()) * DY;
  }
  return { px, py };
}

// ── Inferno colormap ──────────────────────────────────────────────────────────
function infernoRGB(t) {
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const c0 = [0.000, 0.000, 0.016];
  const c1 = [0.227, 0.031, 0.384];
  const c2 = [0.698, 0.165, 0.322];
  const c3 = [0.937, 0.490, 0.129];
  const c4 = [0.988, 1.000, 0.643];
  let a, b, s;
  if (t < 0.25) { a = c0; b = c1; s = t / 0.25; }
  else if (t < 0.50) { a = c1; b = c2; s = (t - 0.25) / 0.25; }
  else if (t < 0.75) { a = c2; b = c3; s = (t - 0.50) / 0.25; }
  else { a = c3; b = c4; s = (t - 0.75) / 0.25; }
  return [
    (a[0] + (b[0] - a[0]) * s) * 255,
    (a[1] + (b[1] - a[1]) * s) * 255,
    (a[2] + (b[2] - a[2]) * s) * 255,
  ];
}

// ── React App ─────────────────────────────────────────────────────────────────
export default function App() {
  const canvasRef    = useRef(null);  // 2D canvas for heatmap
  const trajCanvasRef = useRef(null); // overlay canvas for trajectories
  const offscreen    = useRef(null);  // OffscreenCanvas / ImageData for rho
  const simState     = useRef(null);  // mutable simulation state

  // UI state
  const [running,    setRunning]    = useState(true);
  const [detectorOn, setDetectorOn] = useState(true);
  const [barrierOn,  setBarrierOn]  = useState(true);
  const [showTraj,   setShowTraj]   = useState(true);
  const [speed,      setSpeed]      = useState(1);
  const [timeFs,     setTimeFs]     = useState(0);
  const [probTotal,  setProbTotal]  = useState(1);

  const runningRef    = useRef(true);
  const detectorOnRef = useRef(true);
  const barrierOnRef  = useRef(true);
  const showTrajRef   = useRef(true);
  const speedRef      = useRef(1);

  // Sync refs with state
  useEffect(() => { runningRef.current    = running;    }, [running]);
  useEffect(() => { detectorOnRef.current = detectorOn; }, [detectorOn]);
  useEffect(() => { showTrajRef.current   = showTraj;   }, [showTraj]);
  useEffect(() => { speedRef.current      = speed;      }, [speed]);
  useEffect(() => {
    barrierOnRef.current = barrierOn;
    // Rebuild Vprop when barrier toggled
    const s = simState.current;
    if (s) s.rebuildVprop = true;
  }, [barrierOn]);

  useEffect(() => {
    const heatCanvas = canvasRef.current;
    const trajCanvas = trajCanvasRef.current;
    if (!heatCanvas || !trajCanvas) return;

    // ── Setup ──────────────────────────────────────────────────────────────
    const { psiRe, psiIm } = buildInitialPsi();
    const { px, py } = sampleInitialPositions(psiRe, psiIm);

    // trajectory history (last 200 positions per particle)
    const HIST = 200;
    const trajHistX = Array.from({ length: NP }, () => new Float64Array(HIST));
    const trajHistY = Array.from({ length: NP }, () => new Float64Array(HIST));
    const trajHead  = new Int32Array(NP);
    const trajLen   = new Int32Array(NP);
    for (let ip = 0; ip < NP; ip++) {
      trajHistX[ip][0] = px[ip];
      trajHistY[ip][0] = py[ip];
      trajHead[ip] = 0;
      trajLen[ip]  = 1;
    }

    // Reuse Vprop buffers (will be rebuilt if barrier changes)
    const vpropRe = new Float64Array(VPROP_RE);
    const vpropIm = new Float64Array(VPROP_IM);

    simState.current = {
      psiRe, psiIm, px, py,
      trajHistX, trajHistY, trajHead, trajLen,
      stepCount: 0,
      vpropRe, vpropIm,
      rebuildVprop: false,
    };

    // rho ImageData
    const imgData = new ImageData(NX, NY);
    let maxRho = 1;

    // ── Animation loop ─────────────────────────────────────────────────────
    let raf;
    let lastTime = performance.now();
    let stepsThisFrame = 0;

    // Vprop that respects barrierOn flag
    function getVprop() {
      const s = simState.current;
      if (s.rebuildVprop) {
        s.rebuildVprop = false;
        const on = barrierOnRef.current;
        for (let k = 0; k < NX * NY; k++) {
          const phi = on ? -V_ARR[k] * DT / (2 * HB) : 0;
          s.vpropRe[k] = Math.cos(phi);
          s.vpropIm[k] = Math.sin(phi);
        }
      }
      return { vpropRe: s.vpropRe, vpropIm: s.vpropIm };
    }

    // Local step function using current vprop
    function stepPsiLocal(psiRe, psiIm) {
      const { vpropRe, vpropIm } = getVprop();

      // V half-step
      for (let k = 0; k < NX * NY; k++) {
        const re = psiRe[k], im = psiIm[k];
        psiRe[k] = re * vpropRe[k] - im * vpropIm[k];
        psiIm[k] = re * vpropIm[k] + im * vpropRe[k];
      }
      // W half-step
      if (detectorOnRef.current) {
        for (let ix = QINI; ix <= QFIN; ix++) {
          for (let iy = 1; iy < NY - 1; iy++) {
            const k  = ix + iy * NX;
            const kp = ix + (iy + 1) * NX;
            const km = ix + (iy - 1) * NX;
            psiRe[k] += LAMBDA * (psiRe[kp] - psiRe[km]);
            psiIm[k] += LAMBDA * (psiIm[kp] - psiIm[km]);
          }
        }
      }
      // T full step
      fft2d(psiRe, psiIm, false);
      fftshift2d(psiRe, psiIm);
      for (let k = 0; k < NX * NY; k++) {
        const re = psiRe[k], im = psiIm[k];
        psiRe[k] = re * TPROP_RE[k] - im * TPROP_IM[k];
        psiIm[k] = re * TPROP_IM[k] + im * TPROP_RE[k];
      }
      fftshift2d(psiRe, psiIm);
      fft2d(psiRe, psiIm, true);
      // W half-step
      if (detectorOnRef.current) {
        for (let ix = QINI; ix <= QFIN; ix++) {
          for (let iy = 1; iy < NY - 1; iy++) {
            const k  = ix + iy * NX;
            const kp = ix + (iy + 1) * NX;
            const km = ix + (iy - 1) * NX;
            psiRe[k] += LAMBDA * (psiRe[kp] - psiRe[km]);
            psiIm[k] += LAMBDA * (psiIm[kp] - psiIm[km]);
          }
        }
      }
      // V half-step
      for (let k = 0; k < NX * NY; k++) {
        const re = psiRe[k], im = psiIm[k];
        psiRe[k] = re * vpropRe[k] - im * vpropIm[k];
        psiIm[k] = re * vpropIm[k] + im * vpropRe[k];
      }
    }

    function resetSim() {
      const { psiRe: r, psiIm: i } = buildInitialPsi();
      const s = simState.current;
      s.psiRe.set(r); s.psiIm.set(i);
      s.stepCount = 0;
      const { px: nx, py: ny } = sampleInitialPositions(s.psiRe, s.psiIm);
      s.px.set(nx); s.py.set(ny);
      for (let ip = 0; ip < NP; ip++) {
        s.trajHistX[ip].fill(0); s.trajHistY[ip].fill(0);
        s.trajHistX[ip][0] = s.px[ip];
        s.trajHistY[ip][0] = s.py[ip];
        s.trajHead[ip] = 0; s.trajLen[ip] = 1;
      }
      maxRho = 1;
    }

    function frame() {
      raf = requestAnimationFrame(frame);
      const s = simState.current;
      if (!s) return;

      const stepsPerFrame = Math.max(1, Math.round(speedRef.current * SKIP));

      // Advance simulation
      if (runningRef.current) {
        for (let st = 0; st < stepsPerFrame; st++) {
          if (s.stepCount >= NT_TOTAL) { resetSim(); return; }
          stepPsiLocal(s.psiRe, s.psiIm);
          // Advance Bohmian trajectories
          for (let ip = 0; ip < NP; ip++) {
            const res = advanceParticle(s.psiRe, s.psiIm, s.px[ip], s.py[ip]);
            s.px[ip] = res.px; s.py[ip] = res.py;
            // Store in ring buffer
            const head = (s.trajHead[ip] + 1) % HIST;
            s.trajHistX[ip][head] = res.px;
            s.trajHistY[ip][head] = res.py;
            s.trajHead[ip] = head;
            if (s.trajLen[ip] < HIST) s.trajLen[ip]++;
          }
          s.stepCount++;
        }
      }

      // ── Render heatmap ────────────────────────────────────────────────────
      // Find max rho for normalisation (smooth)
      let mx = 0;
      for (let k = 0; k < NX * NY; k++) {
        const r = s.psiRe[k] * s.psiRe[k] + s.psiIm[k] * s.psiIm[k];
        if (r > mx) mx = r;
      }
      maxRho = maxRho * 0.9 + mx * 0.1;  // exponential smoothing
      const scale = maxRho > 0 ? 1 / maxRho : 1;

      // Fill RGBA ImageData — layout: x = column, y = row (ImageData is row-major, origin top-left)
      // Our array: index = ix + iy*NX, x → horizontal, y → vertical (y=0 bottom in physics)
      // We flip y so y=0 is at bottom of canvas.
      for (let iy = 0; iy < NY; iy++) {
        for (let ix = 0; ix < NX; ix++) {
          const k = ix + iy * NX;
          const rho = (s.psiRe[k] * s.psiRe[k] + s.psiIm[k] * s.psiIm[k]) * scale;
          const [r, g, b] = infernoRGB(Math.min(rho * 2.2, 1));
          // flip y: canvas row 0 = top = physics iy = NY-1
          const row = NY - 1 - iy;
          const px4 = (ix + row * NX) * 4;
          imgData.data[px4]     = r;
          imgData.data[px4 + 1] = g;
          imgData.data[px4 + 2] = b;
          imgData.data[px4 + 3] = 255;
        }
      }

      const hCtx = heatCanvas.getContext("2d");
      hCtx.putImageData(imgData, 0, 0);

      // ── Draw overlay (barrier, Q region, trajectories) ─────────────────
      const tCtx = trajCanvas.getContext("2d");
      const W = trajCanvas.width, H = trajCanvas.height;
      tCtx.clearRect(0, 0, W, H);

      const sx = W / LX, sy = H / LY;
      const worldX = px => px * sx;
      const worldY = py => H - py * sy;  // flip y

      // Barrier lines (yellow)
      if (barrierOnRef.current) {
        tCtx.strokeStyle = "rgba(255,220,50,0.85)";
        tCtx.lineWidth = 2;
        [BARRIER_INI, BARRIER_FIN].forEach(ix => {
          const xc = worldX(ix * DX);
          tCtx.beginPath(); tCtx.moveTo(xc, 0); tCtx.lineTo(xc, H); tCtx.stroke();
        });
      }

      // Q region lines (red/coral — detector)
      if (detectorOnRef.current) {
        tCtx.strokeStyle = "rgba(255,100,100,0.75)";
        tCtx.lineWidth = 2;
        [QINI, QFIN].forEach(ix => {
          const xc = worldX(ix * DX);
          tCtx.beginPath(); tCtx.moveTo(xc, 0); tCtx.lineTo(xc, H); tCtx.stroke();
        });
        // label
        tCtx.fillStyle = "rgba(255,120,120,0.7)";
        tCtx.font = "11px 'JetBrains Mono', monospace";
        tCtx.fillText("detector Q", worldX(QINI * DX) + 4, 14);
      }

      // Bohmian trajectories
      if (showTrajRef.current) {
        for (let ip = 0; ip < NP; ip++) {
          const len  = s.trajLen[ip];
          const head = s.trajHead[ip];
          if (len < 2) continue;
          // color: early=blue, late=green/orange based on final y position
          const finalY = s.py[ip];
          const isHigh = finalY > YCENTRAL;
          const col = isHigh ? "rgba(60,230,140,0.55)" : "rgba(255,140,60,0.55)";
          tCtx.beginPath();
          tCtx.strokeStyle = col;
          tCtx.lineWidth = 1;
          for (let j = 0; j < len; j++) {
            const idx = (head - (len - 1 - j) + HIST) % HIST;
            const cx = worldX(s.trajHistX[ip][idx]);
            const cy = worldY(s.trajHistY[ip][idx]);
            if (j === 0) tCtx.moveTo(cx, cy); else tCtx.lineTo(cx, cy);
          }
          tCtx.stroke();
          // current dot
          tCtx.beginPath();
          tCtx.fillStyle = isHigh ? "#3afe90" : "#ffaa44";
          tCtx.arc(worldX(s.px[ip]), worldY(s.py[ip]), 3, 0, 2 * Math.PI);
          tCtx.fill();
        }
      }

      // Axis labels
      tCtx.fillStyle = "rgba(120,180,255,0.45)";
      tCtx.font = "11px 'JetBrains Mono', monospace";
      tCtx.fillText("x →  (particle position)", 8, H - 6);

      // Info
      const t_fs = s.stepCount * DT / 1e-15;
      tCtx.fillStyle = "rgba(160,200,255,0.7)";
      tCtx.font = "11px 'JetBrains Mono', monospace";
      tCtx.fillText(`t = ${t_fs.toFixed(1)} fs   step ${s.stepCount}/${NT_TOTAL}`, 8, 26);

      // throttled React state update
      if (Math.random() < 0.05) {
        setTimeFs(t_fs);
        // total probability check
        let p2 = 0;
        for (let k = 0; k < NX * NY; k++) {
          p2 += s.psiRe[k] * s.psiRe[k] + s.psiIm[k] * s.psiIm[k];
        }
        setProbTotal(p2 * DX * DY);
      }
    }

    frame();
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Layout ─────────────────────────────────────────────────────────────────
  const sideW = 220;

  return (
    <div style={{
      display: "flex", flexDirection: "row",
      width: "100vw", height: "100vh",
      background: "#040a1c", overflow: "hidden",
      fontFamily: "'JetBrains Mono','Courier New',monospace",
      color: "#e0ecff",
    }}>
      {/* Canvas area */}
      <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
        {/* Heatmap canvas — NX×NY pixels, stretched to fill */}
        <canvas ref={canvasRef} width={NX} height={NY}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
            imageRendering: "pixelated" }} />
        {/* Trajectory overlay */}
        <canvas ref={trajCanvasRef} width={NX} height={NY}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
            imageRendering: "pixelated", pointerEvents: "none" }} />

        {/* y-axis label */}
        <div style={{
          position: "absolute", left: 10, top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          color: "rgba(100,160,255,0.45)", fontSize: 11, pointerEvents: "none",
          whiteSpace: "nowrap",
        }}>y — pointer ↑</div>
      </div>

      {/* Sidebar */}
      <div style={{
        width: sideW, flexShrink: 0,
        borderLeft: "1px solid rgba(40,80,180,0.35)",
        background: "rgba(4,10,30,0.95)",
        overflowY: "auto", padding: "12px 10px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        <div style={{ fontSize: 13, color: "#5599ff", fontWeight: 700,
          borderBottom: "1px solid rgba(40,80,180,0.3)", paddingBottom: 6 }}>
          2D Measurement
        </div>

        <div style={{ fontSize: 10, color: "#6080a0", lineHeight: 1.55 }}>
          Split-operator 2D simulation.<br />
          x = particle, y = pointer.<br />
          Physics from MATLAB code.
        </div>

        {/* Time / probability */}
        <div style={{ fontSize: 11, color: "#88aacc" }}>
          <div>t = {timeFs.toFixed(1)} fs</div>
          <div style={{ color: Math.abs(probTotal - 1) > 0.01 ? "#ff8844" : "#44cc88" }}>
            ∫|ψ|² = {probTotal.toFixed(5)}
          </div>
        </div>

        {/* Controls */}
        <CtrlBtn on={running} onClick={() => setRunning(r => !r)}
          label={running ? "⏸ Pause" : "▶ Run"} />
        <CtrlBtn on={detectorOn} onClick={() => setDetectorOn(d => !d)}
          label="Detector (Q)" />
        <CtrlBtn on={barrierOn} onClick={() => setBarrierOn(b => !b)}
          label="Barrier (V₀)" />
        <CtrlBtn on={showTraj} onClick={() => setShowTraj(t => !t)}
          label="Trajectories" />

        <div>
          <div style={{ fontSize: 11, color: "#7ab8ff", marginBottom: 4 }}>
            Speed ×{speed.toFixed(1)}
          </div>
          <input type="range" min={0.25} max={4} step={0.25} value={speed}
            onChange={e => setSpeed(+e.target.value)}
            style={{ width: "100%", accentColor: "#ffcc44" }} />
        </div>

        <div style={{ fontSize: 10, color: "#405060", lineHeight: 1.6,
          borderTop: "1px solid rgba(40,80,180,0.15)", paddingTop: 8 }}>
          <b style={{ color: "#6080a0" }}>Barrier</b>: x ∈ [Nx/2, Nx/2+2]<br />
          V₀ = 0.05 eV<br />
          <b style={{ color: "#6080a0" }}>Detector Q</b>: x ∈ [{QINI},{QFIN}]<br />
          λ₂ = {LAMBDA2.toExponential(0)} m/s<br />
          <b style={{ color: "#6080a0" }}>Packet</b>:<br />
          vx = 0.8×10⁵ m/s<br />
          σx = σy = 6 nm<br />
          Np = {NP} trajectories<br />
          Dt = {(DT / 1e-15).toFixed(2)} fs
        </div>
      </div>
    </div>
  );
}

function CtrlBtn({ on, onClick, label }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 10px", borderRadius: 5, cursor: "pointer", fontSize: 12,
      fontFamily: "'JetBrains Mono','Courier New',monospace",
      background: on ? "rgba(40,80,180,0.5)" : "rgba(15,30,70,0.5)",
      border: "1px solid " + (on ? "#5588cc" : "#334466"),
      color: on ? "#c8e8ff" : "#7090b8",
      textAlign: "left",
    }}>{on ? "◉" : "○"} {label}</button>
  );
}

const container = document.getElementById("root");
if (container) createRoot(container).render(<App />);
