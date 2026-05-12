/**
 * bm.jsx — Bohmian Measurement: Copenhagen vs Pilot-Wave
 *
 * 2D configuration space (x = particle, y = pointer).
 *
 * Ψ(x,y,t) is ALWAYS entangled after the interaction begins:
 *   Ψ = ψ_T(x,t)·χ_T(y,t)  +  ψ_R(x,t)·χ_R(y,t)
 *
 * It CANNOT be written as ψ(x)·χ(y) once the coupling is on —
 * the whole point is that the correlations are what "measurement" is.
 *
 * Copenhagen : show global |Ψ(x,y)|² → at a random time one lobe
 *              is "collapsed" (the other fades out).
 *
 * Pilot-wave  : same global |Ψ(x,y)|² + the Bohmian particle (X,Y)
 *              riding one branch.  Below: three 1D curves
 *                ψ_T(x) marginal, ψ_R(x) marginal, ψ_cond(x,Y(t)).
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import * as THREE from "three";

// ── Physics constants ─────────────────────────────────────────────────────────
const X0     = -8.0;   // initial packet centre
const STEPS  = 500;    // Bohmian integration steps
const PERIOD = 320;    // ticks per cycle
const MAX_P  = 12;     // max simultaneous Bohmian particles
const BARRIER_A = 0.5; // barrier half-width

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, t)    { return a + (b - a) * t; }

// Box-Muller Gaussian sample  N(0,1)
function sampleGauss() {
  let u;
  do { u = Math.random(); } while (u <= 0);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
}

// Exact rectangular-barrier |T|² (ℏ=m=1)
function exactT(k0, V0) {
  if (V0 <= 0) return 1.0;
  const E = 0.5 * k0 * k0;
  if (E <= 0) return 0.0;
  const dV = V0 - E;
  if (Math.abs(dV) < 1e-9) return 1.0 / (1.0 + 0.5 * V0 * V0 * BARRIER_A * BARRIER_A);
  if (dV > 0) {
    const kv = Math.sqrt(2 * dV), sh = Math.sinh(kv * BARRIER_A);
    return 1.0 / (1.0 + (V0 * V0 * sh * sh) / (4 * E * dV));
  }
  const kv = Math.sqrt(-2 * dV), sn = Math.sin(kv * BARRIER_A);
  return 1.0 / (1.0 + (V0 * V0 * sn * sn) / (4 * E * (-dV)));
}

function gauss(x, mu, sig) { const d = (x - mu) / sig; return Math.exp(-0.5 * d * d); }

// ── Spectral wavepacket physics (exact rectangular-barrier scattering) ────────
// ψ(x,t) = Σ_k φ(k)·ψ_k^scat(x)·exp(-ik²t/2)·Δk
// ψ_k^scat(x) = exact right-incident scattering eigenstate; barrier at [0,L].
// In bm.jsx barrier spans [-BARRIER_A, +BARRIER_A] → shift x by +BARRIER_A.
const WP = {
  nx: 800, nk: 100,
  xmin: -50, xmax: 50,
  xs:     null,
  ks:     null,
  phi:    null,   // complex Float64Array(2*nk)
  psiK:   null,   // pre-computed Float32Array(nk * nx * 2)  — scattering eigenstates
  psi_re: new Float64Array(800),
  psi_im: new Float64Array(800),
  psiF_re: new Float64Array(800), // free-particle ψ for pre-scatter blend
  psiF_im: new Float64Array(800),
  rhoBuf: new Float32Array(800),  // |ψ|² — pre-allocated, never reassigned
  T_mean: 0,
  tCross: 0,      // t when packet centre reaches barrier
};

function _wpAnalyticScatter(E, V0, L) {
  const k1 = Math.sqrt(2 * E);
  const tun = E < V0;
  let r_re, r_im, t_re, t_im, T;
  if (tun) {
    const kappa = Math.sqrt(2 * (V0 - E) + 1e-20);
    const ch = Math.cosh(kappa * L), sh = Math.sinh(kappa * L);
    const dRe = ch, dIm = 0.5 * (kappa / k1 - k1 / kappa) * sh;
    const dM2 = dRe * dRe + dIm * dIm;
    const eRe = Math.cos(k1 * L), eIm = -Math.sin(k1 * L);
    t_re = (eRe * dRe + eIm * dIm) / dM2;
    t_im = (eIm * dRe - eRe * dIm) / dM2;
    T = t_re * t_re + t_im * t_im;
    const rFi = -0.5 * (kappa / k1 + k1 / kappa) * sh;
    const rt_re = -rFi * t_im, rt_im = rFi * t_re;
    const eP_re = Math.cos(k1 * L), eP_im = Math.sin(k1 * L);
    r_re = rt_re * eP_re - rt_im * eP_im;
    r_im = rt_re * eP_im + rt_im * eP_re;
    return { k1, kappa, tun: true, T, R: 1 - T, r_re, r_im, t_re, t_im };
  } else {
    const k2 = Math.sqrt(2 * (E - V0) + 1e-20);
    const co = Math.cos(k2 * L), si = Math.sin(k2 * L);
    const dRe = co, dIm = -0.5 * (k2 / k1 + k1 / k2) * si;
    const dM2 = dRe * dRe + dIm * dIm;
    const eRe = Math.cos(k1 * L), eIm = -Math.sin(k1 * L);
    t_re = (eRe * dRe + eIm * dIm) / dM2;
    t_im = (eIm * dRe - eRe * dIm) / dM2;
    T = t_re * t_re + t_im * t_im;
    const rFi = 0.5 * (k1 / k2 - k2 / k1) * si;
    const rt_re = -rFi * t_im, rt_im = rFi * t_re;
    const eP_re = Math.cos(k1 * L), eP_im = Math.sin(k1 * L);
    r_re = rt_re * eP_re - rt_im * eP_im;
    r_im = rt_re * eP_im + rt_im * eP_re;
    return { k1, k2, tun: false, T, R: 1 - T, r_re, r_im, t_re, t_im };
  }
}

// Evaluate scattering eigenstate at x (barrier sits at [0, L])
function _wpEvalState(x, sc, L) {
  const { k1, tun, r_re, r_im, t_re, t_im } = sc;
  const kk = tun ? sc.kappa : sc.k2;
  if (x >= L) {
    const cr = Math.cos(k1 * x), si = Math.sin(k1 * x);
    return [t_re * cr - t_im * si, t_re * si + t_im * cr];
  }
  if (x < 0) {
    const c1 = Math.cos(k1 * x), s1 = Math.sin(k1 * x);
    return [c1 + r_re * c1 - r_im * (-s1), s1 + r_re * (-s1) + r_im * c1];
  }
  const tEr = t_re * Math.cos(k1 * L) - t_im * Math.sin(k1 * L);
  const tEi = t_re * Math.sin(k1 * L) + t_im * Math.cos(k1 * L);
  const dtEr = -k1 * tEi, dtEi = k1 * tEr;
  if (tun) {
    const k = kk;
    const Ur = (tEr + dtEr / k) * 0.5, Ui = (tEi + dtEi / k) * 0.5;
    const Vr = (tEr - dtEr / k) * 0.5, Vi = (tEi - dtEi / k) * 0.5;
    const epxL = Math.exp(k * (x - L)), emxL = Math.exp(-k * (x - L));
    return [Ur * epxL + Vr * emxL, Ui * epxL + Vi * emxL];
  } else {
    const k2 = kk;
    const Ur = (tEr + dtEi / k2) * 0.5, Ui = (tEi - dtEr / k2) * 0.5;
    const Vr = tEr - Ur, Vi = tEi - Ui;
    const c = Math.cos(k2 * (x - L)), s = Math.sin(k2 * (x - L));
    return [Ur * c - Ui * s + Vr * c + Vi * s, Ur * s + Ui * c - Vr * s + Vi * c];
  }
}

// Pre-compute ψ_k^scat(x) for all k modes × all x grid points.
// Call this when k0, V0, or sigX changes (once per parameter set).
function wpPrecompute(k0, V0, sigX) {
  const { nx, nk, xmin, xmax, psi_re, psi_im, rhoBuf } = WP;
  const L  = 2 * BARRIER_A;   // barrier width
  const dx = (xmax - xmin) / (nx - 1);
  WP.xs = new Float64Array(nx);
  for (let i = 0; i < nx; i++) WP.xs[i] = xmin + i * dx;

  const sig_k = 1.0 / (2.0 * sigX);
  const kmin = Math.max(0.05, k0 - 5.0 * sig_k);
  const kmax = k0 + 5.0 * sig_k;
  const dk   = (kmax - kmin) / (nk - 1);
  const norm_phi = Math.pow(2.0 * Math.PI * sigX * sigX, -0.25);

  WP.ks  = new Float64Array(nk);
  WP.phi = new Float64Array(2 * nk);
  WP.psiK = new Float32Array(nk * nx * 2);

  let T_sum = 0, w_sum = 0;
  for (let ik = 0; ik < nk; ik++) {
    const k  = kmin + ik * dk;
    WP.ks[ik] = k;
    const env = norm_phi * Math.exp(-0.5 * (k - k0) * (k - k0) * sigX * sigX);
    const wt  = env * dk;
    WP.phi[2 * ik]     =  wt * Math.cos(k * X0);
    WP.phi[2 * ik + 1] = -wt * Math.sin(k * X0);
    const E  = 0.5 * k * k;
    const sc = _wpAnalyticScatter(E, V0, L);
    T_sum += sc.T * wt * wt;
    w_sum += wt * wt;
    for (let ix = 0; ix < nx; ix++) {
      // shift world-x so barrier left edge maps to 0 (barrier at [-BA,+BA] → [0,L])
      const p = _wpEvalState(WP.xs[ix] + BARRIER_A, sc, L);
      WP.psiK[2 * (ik * nx + ix)]     = p[0];
      WP.psiK[2 * (ik * nx + ix) + 1] = p[1];
    }
  }
  WP.T_mean = w_sum > 0 ? T_sum / w_sum : 0;
  WP.tCross = Math.abs(X0) / k0;   // time for packet centre to reach barrier
  // Also eval ψ(x,0) so rhoBuf is valid before first frame
  wpEvalPsi(0);
}

// Per-frame: fill psi_re/psi_im from spectral sum, then fill rhoBuf = |ψ|²
// Before the packet reaches the barrier we blend in the free-particle
// wavefunction to suppress standing-wave fringes from the eigenstate basis.
function wpEvalPsi(t) {
  const { nk, nx, ks, phi, psiK, psi_re, psi_im, psiF_re, psiF_im, rhoBuf, tCross } = WP;
  if (!psiK) return;

  // Blend factor: 0 = fully free-particle, 1 = fully scattering eigenstate
  // Transition over ±1 time unit around t_cross
  const blendW = 0.5 * (1 + Math.tanh(3.0 * (t - tCross)));

  // Scattering eigenstate sum
  psi_re.fill(0); psi_im.fill(0);
  // Free-particle sum (e^{ikx} only — no scattering terms)
  psiF_re.fill(0); psiF_im.fill(0);

  for (let ik = 0; ik < nk; ik++) {
    const k = ks[ik], E = 0.5 * k * k;
    const tpR =  Math.cos(E * t), tpI = -Math.sin(E * t);
    const phR = phi[2 * ik], phI = phi[2 * ik + 1];
    const wR = phR * tpR - phI * tpI, wI = phR * tpI + phI * tpR;
    const base = 2 * ik * nx;
    // Pre-compute per-k trig stepping for free-particle plane wave e^{ikx}
    // using recurrence: e^{ik(x+dx)} = e^{ikx} * e^{ikdx}
    const kdx = k * (WP.xmax - WP.xmin) / (nx - 1);
    const stepR = Math.cos(kdx), stepI = Math.sin(kdx);
    let fR = Math.cos(k * WP.xmin), fI = Math.sin(k * WP.xmin);
    for (let ix = 0; ix < nx; ix++) {
      // Scattering eigenstate
      const psR = psiK[base + 2 * ix], psI = psiK[base + 2 * ix + 1];
      psi_re[ix] += wR * psR - wI * psI;
      psi_im[ix] += wR * psI + wI * psR;
      // Free-particle plane wave e^{ikx} via recurrence
      psiF_re[ix] += wR * fR - wI * fI;
      psiF_im[ix] += wR * fI + wI * fR;
      // Advance recurrence
      const nfR = fR * stepR - fI * stepI;
      fI = fR * stepI + fI * stepR;
      fR = nfR;
    }
  }

  // Blend and fill rhoBuf
  for (let ix = 0; ix < nx; ix++) {
    const re = psi_re[ix] * blendW + psiF_re[ix] * (1 - blendW);
    const im = psi_im[ix] * blendW + psiF_im[ix] * (1 - blendW);
    // Use blended wavefunction for Bohmian velocity too
    psi_re[ix] = re;
    psi_im[ix] = im;
    rhoBuf[ix] = re * re + im * im;
  }
}

// Bohmian x-velocity: v = Im(ψ* ∂ₓψ) / |ψ|²
function wpBohmV(x) {
  const { psi_re, psi_im, nx, xmin, xmax } = WP;
  if (!psi_re) return 0;
  const dx  = (xmax - xmin) / (nx - 1);
  const fi  = (x - xmin) / dx;
  const i0  = clamp(Math.floor(fi), 1, nx - 2);
  const i1  = Math.min(i0 + 1, nx - 2);
  const frac = fi - i0;
  const re  = psi_re[i0] * (1 - frac) + psi_re[i1] * frac;
  const im  = psi_im[i0] * (1 - frac) + psi_im[i1] * frac;
  const den = re * re + im * im;
  if (den < 1e-12) return 0;
  const reP0 = (psi_re[i0 + 1] - psi_re[i0 - 1]) / (2 * dx);
  const imP0 = (psi_im[i0 + 1] - psi_im[i0 - 1]) / (2 * dx);
  const reP1 = (psi_re[i1 + 1] - psi_re[i1 - 1]) / (2 * dx);
  const imP1 = (psi_im[i1 + 1] - psi_im[i1 - 1]) / (2 * dx);
  const reP  = reP0 * (1 - frac) + reP1 * frac;
  const imP  = imP0 * (1 - frac) + imP1 * frac;
  const v = (re * imP - im * reP) / den;
  return v > 50 ? 50 : v < -50 ? -50 : v;
}

// Linear-interpolate |ψ(x)|² from rhoBuf
function wpRho(x) {
  const { rhoBuf, nx, xmin, xmax } = WP;
  if (!rhoBuf) return 0;
  const dx  = (xmax - xmin) / (nx - 1);
  const fi  = (x - xmin) / dx;
  const i0  = clamp(Math.floor(fi), 0, nx - 2);
  const frac = fi - i0;
  return rhoBuf[i0] * (1 - frac) + rhoBuf[i0 + 1] * frac;
}

// Invert T: binary-search V₀ so that exactT(k0, V₀) ≈ target
function invertT(target, k0) {
  if (target >= 0.9999) return 0.0;
  if (target <= 0.0001) return 60.0;
  let lo = 0, hi = 60;
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    if (exactT(k0, mid) > target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// Integrate one Bohmian trajectory (returns array of {x,y})
// Uses the real spectral wavefunction for x-velocity (guidance equation).
function computeTraj(k0, V0, lam, sigX, sigY, y0, isT) {
  const tScatter = Math.abs(X0) / k0;
  const tTotal   = tScatter + 9.0;
  const dt       = tTotal / STEPS;
  // Branch is determined by the particle's initial x position (via Born-rule in the caller),
  // NOT by the sign of y0. The pointer y0 is drawn independently from N(0, σ_p).
  // dir = +1 → T branch (transmitted), -1 → R branch (reflected).
  // Pointer branch displacement is applied in screen mapping (animate loop),
  // so Y here stores only the pointer's branch-relative offset.
  const dir = isT ? 1 : -1;
  let X = X0, Y = y0;
  const pts = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i * dt;
    pts.push({ x: X, y: Y });
    if (t < tScatter) {
      // Pre-scatter: move at constant k0 to match the analytical Gaussian blob
      // (the 2D display uses xIn = X0 + k0*t, not the dispersive quantum velocity)
      X += k0 * dt;
    } else {
      // Commit to branch immediately at scatter — no lag from smooth alpha weighting.
      X += dir * k0  * dt;
      // Keep branch-relative Y offset fixed; display-space branch motion is applied later.
      Y += 0;
    }
  }
  return pts;
}

// Compute N trajectories with Born-rule initial positions
function computeMultiTraj(k0, V0, lam, sigX, sigY, n) {
  const trajs = [];
  const Tprob = clamp(exactT(k0, V0), 0, 1);
  for (let i = 0; i < n; i++) {
    // Branch (T or R) is determined by the particle's initial x position,
    // drawn with Born-rule probability P(T). This is the Bohmian non-crossing rule:
    // the top T_prob fraction of x-initial-positions transmit, the rest reflect.
    // The pointer initial position y0 is drawn independently from N(0, σ_p).
    const isT = Math.random() < Tprob;
    const y0 = sigY * sampleGauss();  // independent of branch — pointer starts anywhere in N(0,σ_p)
    const pts = computeTraj(k0, V0, lam, sigX, sigY, y0, isT);
    // isTransmit comes from the x trajectory (particle moved right = transmitted)
    const isTransmit = pts[pts.length - 1].x > 0;
    trajs.push({ pts, isTransmit });
  }
  return trajs;
}

// ── GLSL: 2D heatmap ──────────────────────────────────────────────────────────
// Shows |Ψ(x,y)|² = |ψ_T χ_T + ψ_R χ_R|²
// For the analytic (non-interfering) approximation the cross-term is negligible
// once the two lobes separate, so we display |ψ_T|²|χ_T|² + |ψ_R|²|χ_R|².
// In Copenhagen mode, uCollapse fades one branch out.

const VERT2D = /* glsl */`
  varying vec2 vPos;
  void main() { vPos = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;

const FRAG2D = /* glsl */`
  varying vec2 vPos;
  uniform float uBl;              // blend 0→1 (scatter progress)
  uniform float uPT, uPR;
  uniform float uYT, uYR;
  uniform float uSigX, uSigY;
  uniform float uColBranch;       // collapse: 1=kill R, -1=kill T, 0=keep both
  uniform float uColFade;         // 0→1 fade of killed branch
  uniform float uIsPW;            // 1=pilot-wave mode
  uniform float uBY;              // Bohmian pointer Y(t)
  uniform float uXin, uXT, uXR;  // packet x-centres: pre-scatter, T, R

  vec3 inferno(float t) {
    t = clamp(t,0.,1.);
    vec3 c0=vec3(0.000,0.000,0.016), c1=vec3(0.227,0.031,0.384),
         c2=vec3(0.698,0.165,0.322), c3=vec3(0.937,0.490,0.129),
         c4=vec3(0.988,1.000,0.643);
    if(t<.25) return mix(c0,c1,t*4.);
    if(t<.50) return mix(c1,c2,(t-.25)*4.);
    if(t<.75) return mix(c2,c3,(t-.50)*4.);
    return               mix(c3,c4,(t-.75)*4.);
  }

  void main() {
    float x=vPos.x, y=vPos.y;

    // Particle x-Gaussians (analytical — compact, no quantum dispersion widening)
    float gX0 = exp(-0.5 * ((x - uXin) / uSigX) * ((x - uXin) / uSigX));
    float gXT  = exp(-0.5 * ((x - uXT)  / uSigX) * ((x - uXT)  / uSigX));
    float gXR  = exp(-0.5 * ((x - uXR)  / uSigX) * ((x - uXR)  / uSigX));

    // Pointer y-Gaussians
    // Incoming and reflected both sit at uYR (the "not detected" position)
    float gY0 = exp(-0.5 * ((y - uYR) / uSigY) * ((y - uYR) / uSigY));
    float gYT = exp(-0.5 * ((y - uYT) / uSigY) * ((y - uYT) / uSigY));
    float gYR = exp(-0.5 * ((y - uYR) / uSigY) * ((y - uYR) / uSigY));

    // Branch weights — Copenhagen collapses one branch; Pilot-Wave shows both always
    float wT = uPT, wR = uPR;
    if (uIsPW < 0.5) {
      if(uColBranch > 0.5)  wR *= (1. - uColFade);
      if(uColBranch < -0.5) wT *= (1. - uColFade);
    }

    // Pre-scatter: incoming packet approaching barrier, pointer at y=0
    float pre  = gX0 * gY0;

    // Post-scatter: T/R branches, each at its x/y centre
    float post = wT * gXT * gYT + wR * gXR * gYR;

    float dens = mix(pre, post, uBl);
    vec3  col  = inferno(clamp(dens * 2.2, 0., 1.));
    gl_FragColor = vec4(col, 1.0);
  }
`;

// ── GLSL: 1D curves (particle marginals + conditional wf) ────────────────────
// Drawn as a flat plane with a curve mask.  Three separate instances:
//   - ψ_T(x) : marginal ∫|Ψ|²χ_T(y)dy  ∝  |ψ_T(x)|²
//   - ψ_R(x) : marginal ∝ |ψ_R(x)|²
//   - ψ_cond(x) = Ψ(x, Y(t)) — depends on Bohmian pointer position Y(t)

const VERT1D = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;

// Single Gaussian curve shader — one instance per curve
const FRAG1D = /* glsl */`
  varying vec2 vUv;
  uniform float uMu, uSig, uAmp;   // Gaussian params in x-world coords
  uniform float uXlo, uXhi;        // x world range covered by this plane
  uniform float uYbase, uYscale;   // bottom of panel and height in world coords
  uniform vec3  uColor;
  uniform float uOpacity;

  void main(){
    float x = uXlo + vUv.x * (uXhi - uXlo);       // world x
    float g = uAmp * exp(-0.5 * ((x - uMu)/uSig) * ((x - uMu)/uSig));
    // y inside panel: 0 at bottom, 1 at peak-ish
    float yPanel = vUv.y;                           // 0 → 1 bottom → top
    float gNorm  = clamp(g, 0., 1.);
    // Draw filled area under curve + thin line at curve edge
    float fill = step(yPanel, gNorm);
    float edge = smoothstep(0.01, 0.0, abs(yPanel - gNorm));
    float alpha = clamp(fill * 0.35 + edge * 0.9, 0., 1.) * uOpacity;
    if(alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

// ── Colours ───────────────────────────────────────────────────────────────────
const COL_T   = new THREE.Color(0x22ee88);
const COL_R   = new THREE.Color(0xff6633);
const COL_CND = new THREE.Color(0x66ccff);

// ── Many-Worlds overlay shader (diagonal split of config space) ─────────────
const VERT_MW = /* glsl */`
  varying vec2 vPos;
  void main() { vPos = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const FRAG_MW = /* glsl */`
  varying vec2 vPos;
  uniform float uSep;       // sepFrac 0→1
  uniform float uSepA;      // x-position of vertical separator (= 0, the barrier)
  void main() {
    float isT = step(uSepA, vPos.x);  // 1 if x > uSepA (right = World 1)
    vec3 tCol = vec3(0.00, 0.90, 1.00);  // electric cyan — World 1 (T)
    vec3 rCol = vec3(0.93, 0.08, 0.82);  // hot magenta — World 2 (R)
    vec3 color = mix(rCol, tCol, isT);
    float alpha = uSep * 0.28;
    gl_FragColor = vec4(color, alpha);
  }
`;

// ── Small React helpers ───────────────────────────────────────────────────────
const Tip = ({ text, children }) => {
  const [pos, setPos] = React.useState(null);
  const ref = React.useRef();
  const show = () => {
    if (!text) return;
    const r = ref.current?.getBoundingClientRect();
    if (r) setPos({ x: r.left + r.width / 2, yTop: r.top, yBot: r.bottom });
  };
  const hide = () => setPos(null);
  // Tooltip width cap is 260px; estimate ~14px per line for height
  const tooltipW = 260;
  const spaceAbove = pos ? pos.yTop : 999;
  const above = spaceAbove > 120; // enough room above?
  return (
    <span ref={ref} style={{ position:"relative", display:"block" }}
      onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {pos && text && ReactDOM.createPortal(
        <span style={{
          position:"fixed",
          // Clamp left so tooltip never goes off-screen edges
          left: Math.min(
            Math.max(pos.x - tooltipW / 2, 8),
            window.innerWidth - tooltipW - 8
          ),
          top: above ? pos.yTop - 8 : pos.yBot + 8,
          transform: above ? "translateY(-100%)" : "none",
          background:"rgba(8,20,55,0.97)",
          border:"1px solid rgba(80,140,255,0.4)", borderRadius:5,
          padding:"6px 10px", fontSize:11, color:"#b8d4ff",
          whiteSpace:"pre-wrap", width: tooltipW, lineHeight:1.5,
          zIndex:99999, pointerEvents:"none",
          fontFamily:"'JetBrains Mono','Courier New',monospace",
          boxShadow:"0 4px 16px rgba(0,0,30,0.7)",
        }}>{text}</span>,
        document.body
      )}
    </span>
  );
};

const SL = ({ label, tip, children, fullWidth }) => (
  <div style={{ marginBottom: 10, gridColumn: fullWidth ? "1 / -1" : undefined }}>
    <Tip text={tip}>
      <div style={{
        fontSize:12, color:"#7ab8ff", marginBottom:4,
        textTransform:"uppercase", letterSpacing:"0.08em",
        cursor: tip ? "help" : "default",
        borderBottom: tip ? "1px dotted rgba(100,160,255,0.4)" : "none",
        display:"inline-block",
      }}>{label}</div>
    </Tip>
    {children}
  </div>
);

const VIEWS      = ["cpn","pw","mw"];
const VIEW_LABEL = { cpn:"Orthodox", pw:"Pilot-Wave", mw:"Many Worlds" };
const VIEW_COLOR = { cpn:"#ff9966",    pw:"#44ddff",   mw:"#cc88ff" };
const VIEW_TIP   = {
  cpn: "Orthodox QM (von Neumann collapse):\nThe wavefunction collapses onto one branch when the\npointer states become sufficiently distinguishable.\nThe outcome is random with Born-rule probabilities.\nNo physical mechanism for collapse is specified —\nit is an additional postulate. Whether collapse occurs\ndepends on pointer overlap: if T and R branches still\noverlap significantly the measurement is too weak to\ntrigger collapse.",
  pw:  "Pilot-Wave / de Broglie–Bohm:\nThe particle always has a definite position, guided\nby the wavefunction via the guidance equation.\nNo collapse ever occurs. Randomness arises solely\nfrom uncertainty in the particle's initial position.\nThe x-projection shows ψ_cond(x|Y(t)) = Ψ(x, Y(t)) —\nthe conditional wavefunction at the actual pointer position.\nWeak coupling: both T and R peaks survive (pointer branches\noverlap at Y(t)). Strong coupling: only the particle's branch\nsurvives as the pointer branches separate.",
  mw:  "Many-Worlds (Everett):\nThe wavefunction never collapses. Every outcome\noccurs — in separate, non-communicating branches\nof a universal wavefunction. There is no preferred\noutcome and no randomness beyond branch indexing.",
};
const VIEW_DESC  = {
  cpn: "A quantum particle hits a potential barrier — it tunnels through (T) or reflects (R). The 2D canvas shows the full configuration space: x = particle position, y = pointer of the measuring device. When the wave reaches the detector (yellow line), measurement occurs — but only if the pointer states are sufficiently separated (overlap < 1%). In a weak measurement the branches remain in superposition; in a strong measurement one branch collapses.",
  pw:  "A quantum particle hits a potential barrier — it tunnels through (T) or reflects (R). Same global |Ψ(x,y)|² plus the Bohmian particle (X,Y) that rides one branch. Below: conditional wavefunction ψ_cond(x,Y(t)) and the two marginals.",
  mw:  "A quantum particle hits a potential barrier — it tunnels through (T) or reflects (R). Both branches persist — the universe splits. World 1: particle transmitted. World 2: particle reflected. Neither world 'knows about' the other.",
};

// ── Collapsible description ──────────────────────────────────────────────────
function ShowDesc({ text }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ marginTop: 3 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        background: "none", border: "none", padding: 0, cursor: "pointer",
        fontSize: 10, color: "#4a6a9a", fontFamily: "'JetBrains Mono','Courier New',monospace",
        textDecoration: "underline dotted",
      }}>{open ? "▲ hide" : "▼ what is this?"}</button>
      {open && (
        <div style={{ fontSize: 11, color: "#99b8e8", lineHeight: 1.6, marginTop: 4 }}>{text}</div>
      )}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
// ── Shared audio player ─────────────────────────────────────────────────────
const SimPanel = React.memo(({
  interp, setInterp,
  tTarget, setTTarget, tTargetRef,
  lam, setLam, lamRef,
  xPointer, setXPointer, xPointerRef,
  detWidth, setDetWidth, detWidthRef,
  sigX, setSigX, sigXRef,
  sigY, setSigY, sigYRef,
  collapseThreshold, setCollapseThreshold, collapseThresholdRef,
  speed, setSpeed, speedRef,
  pauseHoldMs, setPauseHoldMs, pauseHoldMsRef,
  showWave, setShowWave,
  showTraj, setShowTraj,
  showProj, setShowProj,
  running, setRunning,
  barrierOn, setBarrierOn,
  detectorOn, setDetectorOn,
  Tp, Rp,
  isMobile,
  advMode,
}) => {
  const adv = !!advMode;
  const vc  = VIEW_COLOR[interp];
  const p   = isMobile ? "8px 8px" : "10px 9px";
  const fs  = isMobile ? 10 : 12;

  return (
    <div style={{ display:"flex", flexDirection:"column",
      width:"100%",
      fontFamily:"'JetBrains Mono','Courier New',monospace", color:"#e8f2ff",
      overflowY:"auto" }}>

      <div style={{ display:"flex", flexDirection:"column", gap: isMobile ? 6 : 10, padding:p }}>

        {/* View switcher — always visible */}
        <SL label="View" tip="Click to cycle: Orthodox → Pilot-Wave → Many Worlds&#10;&#10;Orthodox QM: collapse fires when pointer overlap drops below 1% (von Neumann criterion). Outcome random with Born-rule probabilities.&#10;&#10;Pilot-Wave (de Broglie–Bohm): particle has a definite trajectory guided by the wavefunction. No collapse; randomness comes from unknown initial positions.&#10;&#10;Many Worlds (Everett): wavefunction never collapses. All outcomes happen in branching worlds.">
          <Tip text={VIEW_TIP[interp]}>
            <button onClick={() => setInterp(VIEWS[(VIEWS.indexOf(interp)+1)%VIEWS.length])}
              style={{
                display:"block", width:"100%", padding:"7px 10px", marginBottom:5,
                background:`rgba(${interp==="cpn"?"200,80,40":"30,160,220"},0.18)`,
                border:`2px solid ${vc}`, borderRadius:6, color:vc,
                cursor:"pointer", fontSize:13,
                fontFamily:"'JetBrains Mono','Courier New',monospace",
                fontWeight:700, textAlign:"center",
              }}>{">"} {VIEW_LABEL[interp]}</button>
          </Tip>
          <ShowDesc text={interp === "cpn" ? VIEW_DESC.cpn : VIEW_DESC[interp]} />
        </SL>

        <SL label={`Transmission  ${barrierOn ? Math.round(tTarget*100)+"%" : "100% (barrier off)"}`}
          tip={"Fraction of the wave that passes through the barrier.\n0% = total reflection,  100% = total transmission.\n(Sets the barrier height internally.)"}>
          <input type="range" min={0} max={100} step={1}
            defaultValue={Math.round(tTarget*100)}
            ref={tTargetRef}
            onInput={e => setTTarget(+e.target.value / 100)}
            disabled={!barrierOn}
            style={{ width:"100%", accentColor:"#5090f0", opacity: barrierOn ? 1 : 0.35 }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#506080" }}>
            <span style={{color:"#ff7744"}}>← all reflected</span>
            <span style={{color:"#44ee88"}}>all transmitted →</span>
          </div>
        </SL>

        {adv && <SL label={`Coupling  ${detectorOn ? Math.round(lam/3*100)+"%" : "off (detector off)"}`}
          tip={"How far the pointer deflects after the interaction.\n0 = pointer does not move (no measurement).\nHigh = pointer clearly separates the two branches."}>
          <input type="range" min={0} max={3} step={0.05} value={lam}
            ref={lamRef} onChange={e => setLam(+e.target.value)}
            disabled={!detectorOn}
            style={{ width:"100%", accentColor:"#44ffaa", opacity: detectorOn ? 1 : 0.35 }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#506080" }}>
            <span>off</span><span>strong</span></div>
        </SL>}

        {adv && <SL label={`σ_x = ${sigX.toFixed(2)}`}
          tip={"Particle wavepacket width (Gaussian σ in x).\nAlso sets the initial pointer width if not overridden."}>
          <input type="range" min={0.2} max={2.0} step={0.05} defaultValue={sigX}
            ref={sigXRef} onInput={e => setSigX(+e.target.value)}
            style={{ width:"100%", accentColor:"#cc88ff" }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#506080" }}>
            <span>narrow</span><span>wide</span></div>
        </SL>}

        {adv && <SL label={`σ_pointer = ${sigY.toFixed(2)}`}
          tip={"Pointer wavepacket width (Gaussian σ in y).\nSmall σ_pointer + large coupling → strong measurement: T and R branches clearly resolved.\nLarge σ_pointer + small coupling → weak measurement: branches overlap, outcome uncertain."}>
          <input type="range" min={0.1} max={2.5} step={0.05} defaultValue={sigY}
            ref={sigYRef} onInput={e => setSigY(+e.target.value)}
            disabled={!detectorOn}
            style={{ width:"100%", accentColor:"#ff88cc", opacity: detectorOn ? 1 : 0.35 }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#506080" }}>
            <span>narrow</span><span>wide</span></div>
        </SL>}

        {adv && (() => {
          // Compute final pointer overlap from current params (at full detector interaction)
          const k0 = 4.0, v0 = k0;
          const gWindowUI   = detWidth / v0;
          const effLamUI    = detectorOn ? lam : 0;
          const deltaYFinal = 4 * effLamUI * gWindowUI;
          const ptrOverlap  = Math.exp(-deltaYFinal * deltaYFinal / (4 * sigY * sigY));
          const overlapPct  = Math.round(ptrOverlap * 100);
          // von Neumann criterion: collapse fires when pointer states are effectively orthogonal (overlap < 1%)
          const COLLAPSE_CUTOFF = 0.01;
          const isWeak = !detectorOn || effLamUI === 0 || ptrOverlap >= COLLAPSE_CUTOFF;
          const regimeColor = isWeak ? "#ffaa44" : "#44ee88";
          const regimeLabel = isWeak
            ? "Weak  —  branches overlap, not resolved"
            : interp === "cpn"
              ? "Strong  —  branches resolved, collapse fires"
              : "Strong  —  branches resolved";
          return (
            <SL label="Measurement strength"
              tip={"Pointer overlap ⟨χ_T|χ_R⟩ — how much the T and R pointer states overlap.\n\n100%  →  pointer is blind to the outcome  (weak, no collapse)\n  0%  →  branches orthogonal  (strong, collapse fires)\n\nOverlap is set by the Coupling and σ_pointer sliders:\n  O = exp(−(4λw/v₀)² / 4σ_p²)\n\nCollapse fires when O < 1% (von Neumann orthogonality criterion).\nAbove 1% the pointer states still overlap — the global state remains entangled\nand the particle alone is in a mixed state.\nPilot-Wave / Many-Worlds never collapse regardless."}>
              {/* Overlap monitor */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                marginBottom:4, fontSize:11 }}>
                <span style={{ color:"rgba(160,180,220,0.7)", fontSize:10 }}>Pointer overlap</span>
                <span style={{ color: regimeColor, fontWeight:700 }}>{overlapPct}%</span>
              </div>
              <div style={{ height:5, background:"rgba(15,30,70,0.6)", borderRadius:3,
                overflow:"hidden", marginBottom:4 }}>
                <div style={{ height:"100%", borderRadius:3,
                  background: isWeak
                    ? "linear-gradient(90deg,#aa6600,#ffaa44)"
                    : "linear-gradient(90deg,#226633,#44ee88)",
                  width:`${overlapPct}%`, transition:"width 0.2s" }} />
              </div>
              {/* Regime badge */}
              <div style={{ fontSize:11, color: regimeColor, fontWeight:700,
                textAlign:"center", padding:"2px 0", borderRadius:3,
                background: isWeak ? "rgba(100,60,0,0.2)" : "rgba(0,80,40,0.2)" }}>
                {regimeLabel}
              </div>
            </SL>
          );
        })()}

        {/* Outcome bar */}
        <SL label="Outcome probabilities">
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:11 }}>
            <span style={{ color:"#44ee88" }}>Transmitted {Math.round(Tp*100)}%</span>
            <span style={{ color:"#ff7744" }}>Reflected {Math.round(Rp*100)}%</span>
          </div>
          <div style={{ height:6, background:"rgba(15,30,70,0.6)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:3,
              background:"linear-gradient(90deg,#22aa44,#44ee88)",
              width:`${Math.round(Tp*100)}%`, transition:"width 0.3s" }} />
          </div>
        </SL>



        <SL label="Speed" tip="Playback speed">
          <input type="range" min={0.1} max={4} step={0.05} defaultValue={0.5}
            ref={speedRef} onInput={e => setSpeed(+e.target.value)}
            style={{ width:"100%", accentColor:"#ffcc44" }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#506080" }}>
            <span>×{speed.toFixed(1)}</span></div>
        </SL>

        {adv && <SL label={`Cycle pause  ${(pauseHoldMs/1000).toFixed(1)} s`} tip="How long the simulation pauses at the end of each cycle before restarting.\n\nIncrease this to have more time to observe the final state before the next particle is fired.">
          <input type="range" min={0} max={5000} step={100} defaultValue={1000}
            ref={pauseHoldMsRef} onInput={e => setPauseHoldMs(+e.target.value)}
            style={{ width:"100%", accentColor:"#88aaff" }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#506080" }}>
            <span>0 s</span><span>5 s</span></div>
        </SL>}

        {adv && <SL label="Physics">
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {[
              { key:"barrier",  label:"Barrier",  on:barrierOn,  fn:setBarrierOn,  tip:"Toggle the potential barrier.\nOff = 100% transmission (free particle)." },
              { key:"detector", label:"Detector", on:detectorOn, fn:setDetectorOn, tip:"Toggle the measuring device.\nOff = no coupling, pointer stays at rest." },
            ].map(({ key, label, on, fn, tip }) => (
              <Tip key={key} text={tip}>
                <button onClick={() => fn(!on)} style={{
                  padding:"5px 10px",
                  background: on ? "rgba(40,80,180,0.5)" : "rgba(15,30,70,0.5)",
                  border:"1px solid " + (on ? "#5588cc" : "#334466"),
                  borderRadius:5, color: on ? "#c8e8ff" : "#7090b8",
                  cursor:"pointer", fontSize:12,
                  fontFamily:"'JetBrains Mono','Courier New',monospace",
                }}>{on ? "◉" : "○"} {label}</button>
              </Tip>
            ))}
          </div>
        </SL>}

        {adv && interp === "pw" && (
        <SL label="Toggles">
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {[
              { key:"wave", label:"Wave",  on:showWave, fn:setShowWave, tip:"Show/hide 2D |Ψ|² heatmap" },
              { key:"traj", label:"Paths",  on:showTraj, fn:setShowTraj, tip:"Show/hide Bohmian trajectories" },
              { key:"proj", label:"Proj",  on:showProj, fn:setShowProj, tip:"Also overlay global projections ρ(x), ρ(y) on the CWF panels" },
            ].map(({ key, label, on, fn, tip }) => (
              <Tip key={key} text={tip}>
                <button onClick={() => fn(!on)} style={{
                  padding:"5px 10px",
                  background: on ? "rgba(40,80,180,0.5)" : "rgba(15,30,70,0.5)",
                  border:"1px solid " + (on ? "#5588cc" : "#334466"),
                  borderRadius:5, color: on ? "#c8e8ff" : "#7090b8",
                  cursor:"pointer", fontSize:12,
                  fontFamily:"'JetBrains Mono','Courier New',monospace",
                }}>{on ? "◉" : "○"} {label}</button>
              </Tip>
            ))}
            <Tip text="Pause / resume">
              <button onClick={() => setRunning(!running)} style={{
                padding:"5px 10px",
                background: running ? "rgba(20,55,130,0.6)" : "rgba(25,80,40,0.6)",
                border:"1px solid " + (running ? "rgba(70,130,255,0.4)" : "rgba(60,200,80,0.35)"),
                borderRadius:5, color: running ? "#88bbff" : "#66dd88",
                cursor:"pointer", fontSize:12,
                fontFamily:"'JetBrains Mono','Courier New',monospace",
              }}>{running ? "⏸" : "▶"}</button>
            </Tip>
          </div>
        </SL>
        )}

        {!(adv && interp === "pw") && (
        <SL label="Playback">
          <div style={{ display:"flex", gap:4 }}>
            <Tip text="Pause / resume">
              <button onClick={() => setRunning(!running)} style={{
                padding:"5px 10px",
                background: running ? "rgba(20,55,130,0.6)" : "rgba(25,80,40,0.6)",
                border:"1px solid " + (running ? "rgba(70,130,255,0.4)" : "rgba(60,200,80,0.35)"),
                borderRadius:5, color: running ? "#88bbff" : "#66dd88",
                cursor:"pointer", fontSize:12,
                fontFamily:"'JetBrains Mono','Courier New',monospace",
              }}>{running ? "⏸" : "▶"}</button>
            </Tip>
          </div>
        </SL>
        )}

        {!isMobile && <div style={{ fontSize:10, color:"#506080",
          borderTop:"1px solid rgba(50,80,180,0.15)", paddingTop:8 }}>
          Drag: pan
        </div>}

      </div>
    </div>
  );
});


// ── Canvas for the 1D wavefunction panel (below the 2D heatmap) ──────────────
// Draws three Gaussian curves on a <canvas> — faster than Three.js for 2D plots.
// WF1DPanel removed — projections only
function _WF1DPanel_removed({ Tp, Rp, xT, xR, yT, yR, sigX, sigY, bX, bY, bl, show }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020812";
    ctx.fillRect(0, 0, W, H);

    if (!show || bl < 0.05) return;

    const XLO = -12, XHI = 12;
    function worldToCanvas(x) { return (x - XLO) / (XHI - XLO) * W; }
    function densToCanvas(d, panelFrac) { return H - panelFrac * H * 2.8 - 4; }

    // Axis
    ctx.strokeStyle = "rgba(60,100,200,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H - 2); ctx.lineTo(W, H - 2);
    ctx.stroke();
    // Zero line (barrier)
    const bx = worldToCanvas(0);
    ctx.strokeStyle = "rgba(0,200,255,0.25)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx, H); ctx.stroke();
    ctx.setLineDash([]);

    const N = 300;
    const curves = [
      { mu: xT, sig: sigX, amp: Tp * bl, color: "#22ee88", label: "ψ_T marginal" },
      { mu: xR, sig: sigX, amp: Rp * bl, color: "#ff7744", label: "ψ_R marginal" },
      { mu: bX, sig: sigX, amp: bl,      color: "#66ccff", label: "ψ_cond(x, Y(t))", dash: true },
    ];

    curves.forEach(({ mu, sig, amp, color, dash }) => {
      // Compute conditional amplitude: slice of Ψ at y = bY
      // ψ_cond(x) ∝ Tp·gauss(x,xT,sigX)·gauss(bY,yT,sigY) + Rp·gauss(x,xR,sigX)·gauss(bY,yR,sigY)
      // For marginals we simply show ψ_T(x) and ψ_R(x) separately.
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.fillStyle   = color + "28";
      ctx.lineWidth   = dash ? 1.5 : 2;
      if (dash) ctx.setLineDash([4, 3]);

      let first = true;
      for (let i = 0; i <= N; i++) {
        const x = XLO + (XHI - XLO) * i / N;
        let density;
        if (dash) {
          // Conditional: Ψ(x, Y(t)) ∝ Tp·ψ_T(x)·χ_T(bY) + Rp·ψ_R(x)·χ_R(bY)
          const chiT = gauss(bY, yT, sigY);
          const chiR = gauss(bY, yR, sigY);
          density = (Tp * gauss(x, xT, sigX) * chiT + Rp * gauss(x, xR, sigX) * chiR);
        } else if (color === "#22ee88") {
          density = amp * gauss(x, xT, sigX);
        } else {
          density = amp * gauss(x, xR, sigX);
        }
        const cx = worldToCanvas(x);
        const cy = H - 8 - density * (H - 16) * 0.7;
        if (first) { ctx.moveTo(cx, H - 8); ctx.lineTo(cx, cy); first = false; }
        else ctx.lineTo(cx, cy);
      }
      ctx.lineTo(worldToCanvas(XHI), H - 8);
      ctx.closePath();
      ctx.fill();

      // Stroke on top
      ctx.beginPath();
      first = true;
      for (let i = 0; i <= N; i++) {
        const x = XLO + (XHI - XLO) * i / N;
        let density;
        if (dash) {
          const chiT = gauss(bY, yT, sigY), chiR = gauss(bY, yR, sigY);
          density = (Tp * gauss(x, xT, sigX) * chiT + Rp * gauss(x, xR, sigX) * chiR);
        } else if (color === "#22ee88") {
          density = amp * gauss(x, xT, sigX);
        } else {
          density = amp * gauss(x, xR, sigX);
        }
        const cx = worldToCanvas(x);
        const cy = H - 8 - density * (H - 16) * 0.7;
        if (first) { ctx.moveTo(cx, cy); first = false; }
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Bohmian dot position line
    if (bX !== undefined) {
      const cx = worldToCanvas(bX);
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H - 8); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Legend
    [
      { color:"#22ee88", label:"ψ_T  (marginal)" },
      { color:"#ff7744", label:"ψ_R  (marginal)" },
      { color:"#66ccff", label:"ψ_cond (Bohmian slice)", dash:true },
    ].forEach(({ color, label, dash }, i) => {
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = color;
      const tx = 8 + i * 160;
      ctx.fillText(label, tx, 13);
    });

  });

  return (
    <canvas ref={canvasRef} width={900} height={110}
      style={{ width:"100%", height:"100%", display:"block" }} />
  );
}


// ── X-marginal panel: ∫|Ψ(x,y)|²dy  vs  x  (horizontal strip below 2D) ──────
function drawXMarg(canvas, { Tp, Rp, xIn, xT, xR, sigX, bl, colBranch, colFade, bX, bY, bIsTransmit, yT, yR, sigY, isPW, interp, colElapsedMs, colPhase, sepFrac, ptrOverlap, showProj, xLo, xHi, rho, rhoXs, V0 }) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  // Sync intrinsic size to CSS rendered size so fonts/coords are in real screen pixels
  if (canvas.clientWidth > 0)  canvas.width  = canvas.clientWidth;
  if (canvas.clientHeight > 0) canvas.height = canvas.clientHeight;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const isMW  = interp === "mw";
  const XLO = xLo, XHI = xHi;
  const wx = x => (x - XLO) / (XHI - XLO) * W;

  const fadeT = colBranch === -1 ? colFade : 0;
  const fadeR = colBranch ===  1 ? colFade : 0;
  const ampT = Tp * (1 - fadeT);
  const ampR = Rp * (1 - fadeR);

  const N = 350;
  const SCALE = (H - 10) * 0.66; // wave fills ~66% of panel height

  const peakDensity = (fn) => {
    let pk = 1e-10;
    for (let i = 0; i <= N; i++) { const v = fn(XLO + (XHI - XLO) * i / N); if (v > pk) pk = v; }
    return pk;
  };

  // Draw density curve into a clipped sub-region [y0..y0+h] (baseline = y0+h)
  const drawDensityInRegion = (getDensity, color, scale, y0, h) => {
    const baseline = y0 + h - 3;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, y0, W, h); ctx.clip();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color + "28";
    ctx.lineWidth = 2;
    let first = true;
    for (let i = 0; i <= N; i++) {
      const x = XLO + (XHI - XLO) * i / N;
      const cx = wx(x);
      const cy = baseline - getDensity(x) * scale;
      if (first) { ctx.moveTo(cx, baseline); ctx.lineTo(cx, cy); first = false; }
      else ctx.lineTo(cx, cy);
    }
    ctx.lineTo(wx(XHI), baseline); ctx.closePath(); ctx.fill();
    ctx.beginPath(); first = true;
    for (let i = 0; i <= N; i++) {
      const x = XLO + (XHI - XLO) * i / N;
      const cx = wx(x);
      const cy = baseline - getDensity(x) * scale;
      if (first) { ctx.moveTo(cx, cy); first = false; } else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.restore();
  };

  const drawDensity = (getDensity, color, scale = SCALE) =>
    drawDensityInRegion(getDensity, color, scale, 0, H);

  const gIn = x => gauss(x, xIn, sigX);
  const gT  = x => gauss(x, xT,  sigX);
  const gR  = x => gauss(x, xR,  sigX);
  const rhoTotal = x => (1 - bl) * gIn(x) + bl * (ampT * gT(x) + ampR * gR(x));
  const rhoT = x => bl * ampT * gT(x);
  const rhoR = x => bl * ampR * gR(x);

  // Conditional pointer weights — needed by both the density block and the label block.
  // Declared here (function scope) so the label block outside the if/else can access them.
  const pwChiT = isPW ? gauss(bY, yT, sigY) : 0;
  const pwChiR = isPW ? gauss(bY, yR, sigY) : 0;
  const pwMaxChi = Math.max(pwChiT, pwChiR, 1e-8);

  // MW split strength: matches the same COLLAPSE_CUTOFF=0.01 used by the collapse logic.
  // Strong (ptrOverlap < 0.01) → full split; weak (ptrOverlap ≥ 0.01) → no split.
  const mwSplitStrength = (isMW && (ptrOverlap ?? 1) < 0.01) ? 1 : 0;

  if (isMW && bl > 0.05) {
    const mid = Math.round(H / 2);
    // sf: visual split driven by both sepFrac (timing) AND mwSplitStrength (coupling).
    // Weak measurement → mwSplitStrength≈0 → sf≈0 → no split drawn.
    const sf  = Math.min(sepFrac * 1.5, 1) * mwSplitStrength;

    ctx.fillStyle = "#020812"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(60,100,200,0.25)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 2); ctx.lineTo(W, H - 2); ctx.stroke();
    ctx.strokeStyle = "rgba(0,200,255,0.2)"; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(wx(0),0); ctx.lineTo(wx(0),H); ctx.stroke();
    ctx.setLineDash([]);

    const fs = Math.max(7, Math.round(H * 0.12));
    const lbY = Math.round(H * 0.09);
    ctx.font = `bold ${fs}px 'JetBrains Mono',monospace`;

    if (sf > 0.05) {
      // ── Split view: two worlds ──────────────────────────────────────────
      // Background tints
      ctx.fillStyle = `rgba(0,229,255,${0.12 * sf})`;   ctx.fillRect(0,   0,   W, mid);
      ctx.fillStyle = `rgba(238,20,210,${0.12 * sf})`;  ctx.fillRect(0,   mid, W, H - mid);
      // Separator line
      ctx.strokeStyle = `rgba(255,255,255,${0.75 * sf})`;
      ctx.lineWidth = 2; ctx.setLineDash([6, 3]);
      ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();
      ctx.setLineDash([]);
      // Axis lines
      ctx.strokeStyle = "rgba(60,100,200,0.25)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, mid - 1); ctx.lineTo(W, mid - 1); ctx.stroke();
      // World 1 (top): ρ_T in cyan
      if (ampT > 0.001) drawDensityInRegion(rhoT, "#00e5ff", 0.75*(mid-6)/Math.max(peakDensity(rhoT),1e-10), 0, mid);
      // World 2 (bottom): ρ_R in magenta
      if (ampR > 0.001) drawDensityInRegion(rhoR, "#ee14d2", 0.75*(H-mid-6)/Math.max(peakDensity(rhoR),1e-10), mid, H-mid);
      ctx.fillStyle = `rgba(0,229,255,${0.95 * sf})`;  ctx.fillText("World 1  (transmitted)", 6, lbY);
      ctx.fillStyle = `rgba(238,20,210,${0.95 * sf})`; ctx.fillText("World 2  (reflected)",   6, mid + lbY);
    } else {
      // ── Pre-detector OR weak measurement: show combined superposition ──────
      if (ampT > 0.001) drawDensity(rhoT, "#22ee88", SCALE);
      if (ampR > 0.001) drawDensity(rhoR, "#ff7744", SCALE);
      // Only label as "weak" once the particle has actually reached the detector.
      if (sepFrac > 0.02) {
        ctx.fillStyle = "rgba(100,160,255,0.55)";
        ctx.fillText("worlds not resolved  (weak measurement)", 6, lbY);
      }
    }
  } else {
    // ── Standard (CPn / PW) background + axes ─────────────────────────────
    ctx.fillStyle = "#020812"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(60,100,200,0.25)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 2); ctx.lineTo(W, H - 2); ctx.stroke();
    ctx.strokeStyle = "rgba(0,200,255,0.2)"; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(wx(0),0); ctx.lineTo(wx(0),H); ctx.stroke();
    ctx.setLineDash([]);
    if (isPW) {
      const chiT = pwChiT, chiR = pwChiR, maxChi = pwMaxChi;
      // Pre-scatter: single blue incoming blob
      if (1 - bl > 0.01) drawDensity(x => (1 - bl) * gIn(x), "#88aaff", SCALE);
      // Post-scatter: ψ_cond(x|Y(t)) = Σ_branch |ψ_branch(x)|² · |χ_branch(Y(t))|²
      // Each component weighted by the pointer overlap at the actual pointer position.
      if (bl > 0.05 && ampT > 0.001) {
        drawDensity(x => bl * Tp * (chiT/maxChi) * gT(x), "#22ee88", SCALE);
      }
      if (bl > 0.05 && ampR > 0.001) {
        drawDensity(x => bl * Rp * (chiR/maxChi) * gR(x), "#ff7744", SCALE);
      }
      if (showProj) {
        if (ampT > 0.001) drawDensity(rhoT, "rgba(34,238,136,0.4)", SCALE / peakDensity(rhoT));
        if (ampR > 0.001) drawDensity(rhoR, "rgba(255,119,68,0.4)", SCALE / peakDensity(rhoR));
      }
    } else {
      // Three separate colour-coded curves, all normalised to the same combined peak
      // so relative heights reflect actual T/R amplitudes.
      const normScale = SCALE;
      const preFrac = 1 - bl;
      if (preFrac > 0.01) drawDensity(x => preFrac * gIn(x), "#88aaff", normScale);
      if (bl > 0.01 && ampT > 0.001) drawDensity(rhoT, "#22ee88", normScale);
      if (bl > 0.01 && ampR > 0.001) drawDensity(rhoR, "#ff7744", normScale);
    }
  }

  if (!isMW && isPW && bX !== undefined) {
    const cx = wx(bX);
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H - 4); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(cx, H - 4 - 3, 3, 0, 2 * Math.PI); ctx.fill();
  }

  if (!isMW) {
    const fs = Math.max(9, Math.round(H * 0.16));
    const labelY = Math.round(H * 0.22);
    const branchLabelY = Math.round(H * 0.92);  // T/R labels near bottom
    ctx.font = `${fs}px 'JetBrains Mono', monospace`;
    if (isPW) {
      if (bl < 0.05) {
        ctx.fillStyle = "#88aaff"; ctx.fillText("Ψ_in(x)", 6, labelY);
      } else {
        // Show T/R labels based on conditional weight at Y(t), not just bIsTransmit.
        // Both labels appear for weak measurement (both branches present in ψ_cond);
        // only one label for strong (other branch suppressed at Y(t)).
        const fracT = pwChiT / pwMaxChi, fracR = pwChiR / pwMaxChi;
        const THRESH = 0.15;  // branch is "visible" if its conditional weight > 15%
        if (ampT > 0.001 && fracT > THRESH) { ctx.fillStyle = "#22ee88"; ctx.fillText("T", Math.min(W - 20, wx(xT) - 6), branchLabelY); }
        if (ampR > 0.001 && fracR > THRESH) { ctx.fillStyle = "#ff7744"; ctx.fillText("R", Math.max(6, wx(xR) - 6), branchLabelY); }
      }
      // Axis label — top-right, always visible in PW mode
      ctx.font = `${Math.max(8, Math.round(H * 0.13))}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "rgba(100,160,255,0.5)";
      ctx.textAlign = "right";
      ctx.fillText("\u03c8_cond(x|Y(t))", W - 4, labelY);
      ctx.textAlign = "left";
    } else {
      // Floating labels at each blob's x-centre — only show the winning branch post-collapse
      const showT = colBranch >= 0;  // 0 = pre-collapse (show both), 1 = T won
      const showR = colBranch <= 0;  // 0 = pre-collapse (show both), -1 = R won
      if (bl > 0.12 && ampT > 0.05 && showT) {
        ctx.fillStyle = `rgba(34,238,136,${Math.min(bl * 1.5, 0.9)})`;
        ctx.fillText("T", Math.min(W - 20, wx(xT) - 6), branchLabelY);
      }
      if (bl > 0.12 && ampR > 0.05 && showR) {
        ctx.fillStyle = `rgba(255,119,68,${Math.min(bl * 1.5, 0.9)})`;
        ctx.fillText("R", Math.max(6, wx(xR) - 6), branchLabelY);
      }
      // Axis label — top-right, matches style of y-panel and PW x-panel
      ctx.font = `${Math.max(8, Math.round(H * 0.13))}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "rgba(100,160,255,0.5)";
      ctx.textAlign = "right";
      ctx.fillText("\u03c1(x) = \u222b|\u03a8|\u00b2dy", W - 4, labelY);
      ctx.textAlign = "left";
    }
  }
}

const XMarginalPanel = React.forwardRef(function XMarginalPanel(_, ref) {
  return (
    <canvas ref={ref} width={900} height={70}
      style={{ width:"100%", height:"100%", display:"block" }} />
  );
});


// ── Y-marginal panel: ∫|Ψ(x,y)|²dx  vs  y  (vertical strip right of 2D) ─────
// The canvas is drawn with y mapping vertically (bottom=yLo, top=yHi).
// The density curve fills horizontally (density → rightward).
function drawYMarg(canvas, { Tp, Rp, yT, yR, yRFixed, sigY, bl, colBranch, colFade, bY, bX, bIsTransmit, xT, xR, sigX, isPW, interp, sepFrac, ptrOverlap, showProj, yLo, yHi }) {
  // yRFixed: the R (not-transmitted) blob display position — kept in sync with 2D shader uYR.
  // yR itself (-lam*dtA) is only used for chi-weighting in x-panel (not drawing here).
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  // Sync intrinsic size to CSS rendered size so fonts/coords are in real screen pixels
  if (canvas.clientWidth > 0)  canvas.width  = canvas.clientWidth;
  if (canvas.clientHeight > 0) canvas.height = canvas.clientHeight;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const isMW = interp === "mw";

    ctx.fillStyle = "#020812";
    ctx.fillRect(0, 0, W, H);

    const YLO = yLo, YHI = yHi;
    // yRFixed comes from animation loop: camY - halfH*0.6 (20% up from bottom), matches 2D shader
    const yRDisplay = yRFixed;
    // y → vertical pixel (top = YHI, bottom = YLO)
    const wy = y => (1 - (y - YLO) / (YHI - YLO)) * H;

    // Axis (left edge)
    ctx.strokeStyle = "rgba(60,100,200,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(2, H); ctx.stroke();
    // y=0 line
    ctx.strokeStyle = "rgba(0,200,255,0.2)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(0, wy(0)); ctx.lineTo(W, wy(0)); ctx.stroke();
    ctx.setLineDash([]);

    const fadeT = colBranch === -1 ? colFade : 0;
    const fadeR = colBranch ===  1 ? colFade : 0;
    // Post-scatter amplitudes (without bl weighting — handled in blend)
    const ampT = Tp * (1 - fadeT);
    const ampR = Rp * (1 - fadeR);

    const N = 350;
    const SCALE = (W - 6) * 0.88;

    const drawDensityY = (getDensity, color, xOff = 4, scale = SCALE) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.fillStyle = color + "28";
      ctx.lineWidth = 2;
      let first = true;
      for (let i = 0; i <= N; i++) {
        const y  = YLO + (YHI - YLO) * i / N;
        const py = wy(y);
        const px = xOff + getDensity(y) * scale;
        if (first) { ctx.moveTo(xOff, py); ctx.lineTo(px, py); first = false; }
        else ctx.lineTo(px, py);
      }
      ctx.lineTo(xOff, wy(YLO));
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      first = true;
      for (let i = 0; i <= N; i++) {
        const y  = YLO + (YHI - YLO) * i / N;
        const py = wy(y);
        const px = xOff + getDensity(y) * scale;
        if (first) { ctx.moveTo(px, py); first = false; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    };

    drawDensityY(y => (1 - bl) * gauss(y, yRFixed, sigY), "#88aaff");
    const mwStrong = isMW && (ptrOverlap ?? 1) < 0.01;
    if (isMW && bl > 0.05) {
      if (mwStrong) {
        // ── Many-Worlds strong: split Y-panel into two worlds ─────────────
        const sf    = Math.min(sepFrac * 1.5, 1);
        const pxMid = W / 2;
        // Tinted backgrounds
        ctx.fillStyle = `rgba(0,229,255,${0.12 * sf})`;   ctx.fillRect(0,      0, pxMid,      H);
        ctx.fillStyle = `rgba(238,20,210,${0.12 * sf})`;  ctx.fillRect(pxMid,  0, W - pxMid,  H);
        // Separator line (vertical) at W/2 — bright white
        ctx.strokeStyle = `rgba(255,255,255,${0.75 * sf})`;
        ctx.lineWidth = 2; ctx.setLineDash([6, 3]);
        ctx.beginPath(); ctx.moveTo(pxMid, 0); ctx.lineTo(pxMid, H); ctx.stroke();
        ctx.setLineDash([]);
        // World 1 density clipped to left half (cyan)
        if (ampT > 0.001) {
          ctx.save(); ctx.beginPath(); ctx.rect(0, 0, pxMid, H); ctx.clip();
          drawDensityY(y => bl * ampT * gauss(y, yT, sigY), "#00e5ff", 4, (pxMid - 6) * 0.88);
          ctx.restore();
        }
        // World 2 density clipped to right half (magenta)
        if (ampR > 0.001) {
          ctx.save(); ctx.beginPath(); ctx.rect(pxMid, 0, W - pxMid, H); ctx.clip();
          drawDensityY(y => bl * ampR * gauss(y, yRDisplay, sigY), "#ee14d2", pxMid + 2, (W - pxMid - 6) * 0.88);
          ctx.restore();
        }
      } else {
        // ── Many-Worlds weak: single panel, overlapping T (green) + R (orange) ─
        if (ampT > 0.001) drawDensityY(y => bl * ampT * gauss(y, yT,        sigY), "#22ee88");
        if (ampR > 0.001) drawDensityY(y => bl * ampR * gauss(y, yRDisplay, sigY), "#ff7744");
      }
    } else if (isPW && bl > 0.05) {
      // Conditional wavefunction: split into T (green) and R (orange) components,
      // weighted by the Bohmian particle's current x-position.
      const gXatBX_T = gauss(bX, xT, sigX);
      const gXatBX_R = gauss(bX, xR, sigX);
      const maxGX = Math.max(gXatBX_T, gXatBX_R, 1e-8);
      if (ampT > 0.001) drawDensityY(
        y => bl * Tp * (gXatBX_T/maxGX) * gauss(y, yT, sigY), "#22ee88");
      if (ampR > 0.001) drawDensityY(
        y => bl * Rp * (gXatBX_R/maxGX) * gauss(y, yRDisplay, sigY), "#ff7744");
      if (showProj) {
        if (ampT > 0.001) drawDensityY(y => bl * ampT * gauss(y, yT,       sigY), "rgba(34,238,136,0.35)");
        if (ampR > 0.001) drawDensityY(y => bl * ampR * gauss(y, yRDisplay, sigY), "rgba(255,119,68,0.35)");
      }
    } else if (!isPW && !isMW) {
      if (ampT > 0.001) drawDensityY(y => bl * ampT * gauss(y, yT,       sigY), "#22ee88");
      if (ampR > 0.001) drawDensityY(y => bl * ampR * gauss(y, yRDisplay, sigY), "#ff7744");
    }

    // PW: horizontal marker line at Y(t)
    if (!isMW && isPW && bY !== undefined) {
      const py = wy(bY);
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(4, py); ctx.lineTo(W, py); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(4 + 3, py, 3, 0, 2 * Math.PI); ctx.fill();
    }

    // ── Curve labels (horizontal, at each blob centre) ────────────────────
    if (!isMW) {
      const fsL = Math.max(8, Math.round(W * 0.17));
      ctx.font = `bold ${fsL}px 'JetBrains Mono', monospace`;
      ctx.textAlign = "left";
      const labelX = 5;
      // For PW: show only the branch the Bohmian particle is actually in.
      // For CPN: show only the winning branch post-collapse (colBranch 0 = both, 1 = T, -1 = R).
      const showT = isPW ? (bl > 0.05 && bIsTransmit) : colBranch >= 0;
      const showR = isPW ? (bl > 0.05 && !bIsTransmit) : colBranch <= 0;
      if (bl > 0.12 && ampT > 0.05 && showT) {
        ctx.fillStyle = `rgba(34,238,136,${Math.min(bl * 1.5, 0.9)})`;
        ctx.fillText("T", labelX, wy(yT) - 4);
      }
      if (bl > 0.12 && ampR > 0.05 && showR && Math.abs(yT - yRDisplay) > sigY * 0.5) {
        ctx.fillStyle = `rgba(255,119,68,${Math.min(bl * 1.5, 0.9)})`;
        ctx.fillText("R", labelX, wy(yRDisplay) - 4);
      }
    }

    // Rotated axis label — short form only (full label is in the HTML between panels)
    ctx.save();
    ctx.translate(W - 4, H / 2);
    ctx.rotate(-Math.PI / 2);
    const fsY = Math.max(9, Math.round(W * 0.16));
    ctx.font = `${fsY}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "rgba(100,160,255,0.5)";
    ctx.textAlign = "center";
    const yLabel = (isMW && mwStrong) ? "two worlds" :
                   isPW ? "ψ_cond(y|X(t))" : "ρ(y) = ∫|Ψ|²dx";
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();
}

const YMarginalPanel = React.forwardRef(function YMarginalPanel(_, ref) {
  return (
    <canvas ref={ref} width={70} height={500}
      style={{ width:"100%", height:"100%", display:"block" }} />
  );
});


// ── Trajectory palette ────────────────────────────────────────────────────────
const PAL_T = [0x22ee88, 0x44ffaa, 0x00cc88, 0x88ffcc];
const PAL_R = [0xff6633, 0xff9955, 0xff4400, 0xffaa44];


// ── Math panel ────────────────────────────────────────────────────────────────
function MathPanel({ interp }) {
  const eq = (s) => (
    <div style={{ fontFamily:"'JetBrains Mono','Courier New',monospace",
      fontSize:13, color:"#d0e8ff", background:"rgba(20,40,100,0.25)",
      padding:"8px 12px", borderRadius:5, margin:"6px 0", lineHeight:1.8,
      borderLeft:"3px solid rgba(80,140,255,0.4)", whiteSpace:"pre" }}>{s}</div>
  );
  const sec = (s) => (
    <div style={{ color:"#44bbff", fontWeight:700, fontSize:13, marginTop:14, marginBottom:4,
      textTransform:"uppercase", letterSpacing:"0.08em" }}>{s}</div>
  );
  const txt = (s) => (
    <div style={{ fontSize:12, color:"#9ab8dd", lineHeight:1.8, marginBottom:4 }}>{s}</div>
  );
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"14px 20px",
      fontFamily:"'JetBrains Mono','Courier New',monospace",
      background:"#040a1c", color:"#9ab8dd" }}>

      {sec("Initial state")}
      {txt("Particle Gaussian wavepacket approaching barrier, pointer at rest:")}
      {eq("Ψ₀(x,y) = ψ₀(x) · χ₀(y)\n\nψ₀(x) = exp[-(x-x₀)²/4σₓ²] · exp[ik₀x]\nχ₀(y) = exp[-y²/4σ_p²]\n\nσₓ     — particle wavepacket width (σ_x slider)\nσ_p    — pointer wavepacket width (σ_pointer slider)")}

      {sec("After barrier scattering")}
      {txt("Only the T (transmitted) branch couples to the detector pointer via H_int = λ·Π_T·P_y. The R branch never reaches the detector:")}
      {eq("Ψ(x,y,t) = √T · ψ_T(x,t) · χ_T(y,t)\n         + √R · ψ_R(x,t) · χ_R(y,t)\n\nψ_T:  centre → +v₀t          (transmitted, heading right)\nψ_R:  centre → -v₀t          (reflected, heading left)\nχ_T:  shifts up by +Δy = 4λ·(w/v₀)   as T traverses detector\nχ_R:  stays at rest                   (R never enters the detector)")}

      {sec("Probabilities")}
      {txt("Exact rectangular-barrier transmission (ℏ = m = 1, barrier width a):")}
      {eq("T = 1 / [1 + V₀² sinh²(κa) / (4E(V₀-E))]   (E < V₀)\nT = 1 / [1 + V₀² sin²(κa)  / (4E(E-V₀))]   (E > V₀)\n\nE = k₀²/2,   κ = √(2|V₀-E|)")}

      {sec("Marginal densities")}
      {txt("The x-projection (below) and y-projection (right strip):")}
      {eq("ρ(x,t) = ∫|Ψ(x,y,t)|²dy  ≈  T·|ψ_T(x)|² + R·|ψ_R(x)|²\n\nρ(y,t) = ∫|Ψ(x,y,t)|²dx  ≈  T·|χ_T(y)|² + R·|χ_R(y)|²")}

      {interp === "cpn" && (<>
        {sec("Orthodox QM — collapse criterion")}
        {txt("After the detector interaction, each branch has a pointer state. Collapse requires these to be orthogonal — the von Neumann criterion:")}
        {eq("O = ⟨χ_T|χ_R⟩ = exp(−Δy² / 4σ_p²)\n\nΔy = 4λ·(detector width / v₀)   — total pointer separation\nσ_p                          — pointer wavepacket width\n\nCollapse fires  iff  O ≈ 0   (in practice O < 1%)")}
        {txt("When collapse occurs, one branch is selected with Born-rule probability:")}
        {eq("Ψ(x,y,t*)  →  ψ_T · χ_T   with prob T\n            →  ψ_R · χ_R   with prob R = 1 − T")}
        {txt("The pointer gauge shows a position sampled from the winning branch's Gaussian — not the exact branch centre. This reflects the spread of the pointer wavepacket: even after collapse, the recorded pointer value is distributed as N(y_branch, σ_p).")}
        {txt("When O is not negligible (weak measurement), the global state Ψ = √T·ψ_T·χ_T + √R·ψ_R·χ_R remains entangled. The particle alone is in a mixed state — the pointer has shifted, but no definite outcome has occurred.")}
        {txt("Note: Orthodox QM provides no microscopic derivation of the collapse rule — it is an axiom. The von Neumann criterion (orthogonal pointer states) gives the most precise operational version of 'when a measurement is complete'.")}
      </>)}

      {interp === "mw" && (<>
        {sec("Many Worlds — no collapse")}
        {txt("The wavefunction evolves unitarily forever. After scattering, the global state is:")}
        {eq("Ψ(x,y,t) = √T · ψ_T(x,t) · χ_T(y,t)\n         + √R · ψ_R(x,t) · χ_R(y,t)")}
        {txt("Both branches are equally real. There is no collapse and no preferred outcome. The universe 'splits' into two non-interacting worlds:")}
        {eq("World 1:  ψ_T · χ_T   (particle transmitted, pointer deflected up)\nWorld 2:  ψ_R · χ_R   (particle reflected, pointer at rest)")}
        {txt("The vertical dividing line at x=0 in the simulation marks the separation between the two worlds in configuration space. Right of the line (x>0) belongs to World 1; left (x<0) belongs to World 2.")}
        {txt("The x- and y-projection panels are each split in two: the cyan half shows World 1 (transmitted), the magenta half shows World 2 (reflected).")}
        {txt("Probabilities emerge from the Born rule applied to the branch amplitudes — but in MW this is a derived (and debated) result, not a postulate.")}
        {eq("P(World 1) = ‖√T ψ_T χ_T‖² = T\nP(World 2) = ‖√R ψ_R χ_R‖² = R")}
      </>)}

      {interp === "pw" && (<>
        {sec("Pilot-wave — guidance equation")}
        {txt("The particle has a definite position (X,Y) at all times, guided by:")}
        {eq("dX/dt = ℏ/m · Im[Ψ* ∂_x Ψ] / |Ψ|²  |_(X,Y)\ndY/dt = ℏ/m · Im[Ψ* ∂_y Ψ] / |Ψ|²  |_(X,Y)")}
        {txt("For the two-branch state with non-overlapping lobes, whichever branch contains (X,Y) acts as the effective wavefunction — the other branch is 'empty'.")}
        {eq("ψ_cond(x,t) = Ψ(x, Y(t), t)  [conditional wavefunction]")}
        {txt("Bohmian statistics: the branch (T or R) is determined by the particle's initial x position, drawn with Born-rule probability P(T)=T from the position distribution |ψ₀(x)|². The initial pointer position Y₀ is drawn independently from the full Gaussian |χ₀(y)|² = N(0, σ_p) — it is not correlated with which branch the particle is on. Together these reproduce the correct Born-rule statistics. After scattering, the x-branches are spatially separated, so the pointer y-guidance reduces to: y→y_T (rate 4λ) for the T-branch trajectory, y→0 for the R-branch — regardless of measurement strength.")}
      </>)}

      {sec("Measurement strength")}
      {txt("The quality of a measurement depends on whether the pointer states for T and R are distinguishable. The pointer overlap quantifies this:")}
      {eq("O = ⟨χ_T|χ_R⟩ = exp(−Δy² / 4σ_p²)\n\nΔy = 4λ·(w / v₀)   — total pointer separation (w = detector width)\nσ_p             — pointer wavepacket width\n\nO → 0  (strong):  branches orthogonal, unambiguous readout, collapse fires\nO → 1  (weak):    branches indistinguishable, no information gained, no collapse")}
      {txt("In Orthodox mode, collapse fires when O < 1% (branches effectively orthogonal). Above that the global system+pointer state remains entangled; the particle alone is in a mixed state. In Pilot-Wave / Many-Worlds, the wavefunction never collapses regardless of the overlap.")}

      {sec("Animation")}
      {txt("Units: ℏ = m = 1. Velocity v₀ = k₀. The simulation rescales physical time to fit the canvas. The barrier occupies |x| < 0.5.")}
      {txt("Approximations: (1) Wavepacket dispersion is omitted in the 2D display — packets keep their initial width σ_x for visual clarity (realistic packets broaden as σ_x(t)=σ_x0√(1+t²/4σ_x0⁴)). (2) The Bohmian x-trajectory uses the exact spectral guidance equation; the y (pointer) motion uses the leading-order Gaussian approximation, which is exact for spatially separated branches.")}
    </div>
  );
}


// ── Gauge face renderer ──────────────────────────────────────────────────────
// needles: [{fraction 0→1, color, alpha}]
// fraction 0 = R side (left), 0.5 = centre, 1 = T side (right)
// labelFracs: { r: 0..1, t: 0..1 } — fixed arc positions marking where each branch's
// pointer rests once coupling is fully applied. Determined by coupling strength alone,
// not the current animation frame. R is always 0; T = lamScale (effLam / LAM_MAX).
function drawGaugeFace(gCtx, W, H, needles, labelFracs) {
  gCtx.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2;
  const R  = Math.min(cx, cy) - 3;
  const sweepHalf = (2 * Math.PI) / 3;   // ±120° sweep

  // Outer ring
  gCtx.beginPath();
  gCtx.arc(cx, cy, R, 0, 2 * Math.PI);
  gCtx.fillStyle   = "rgba(8,16,40,0.92)";
  gCtx.fill();
  gCtx.strokeStyle = "rgba(180,200,255,0.65)";
  gCtx.lineWidth   = 2.5;
  gCtx.stroke();

  // Sweep arc (active range)
  gCtx.beginPath();
  gCtx.arc(cx, cy, R - 5, -Math.PI / 2 - sweepHalf, -Math.PI / 2 + sweepHalf);
  gCtx.strokeStyle = "rgba(60,100,200,0.22)";
  gCtx.lineWidth   = 5;
  gCtx.stroke();

  // Tick marks
  const nTicks = 6;
  for (let i = 0; i <= nTicks; i++) {
    const frac  = i / nTicks;
    const angle = -Math.PI / 2 + (frac - 0.5) * 2 * sweepHalf;
    const isMain = i === 0 || i === nTicks || i === nTicks / 2;
    const tLen  = isMain ? R * 0.22 : R * 0.13;
    gCtx.strokeStyle = isMain ? "rgba(200,210,255,0.8)" : "rgba(140,160,210,0.4)";
    gCtx.lineWidth   = isMain ? 2 : 1;
    gCtx.beginPath();
    gCtx.moveTo(cx + Math.cos(angle) * (R - tLen - 2), cy + Math.sin(angle) * (R - tLen - 2));
    gCtx.lineTo(cx + Math.cos(angle) * (R - 3),        cy + Math.sin(angle) * (R - 3));
    gCtx.stroke();
  }

  // R / T labels — fixed at the final resting positions for each branch given
  // the current coupling strength. R never deflects (always fraction 0);
  // T deflects to lamScale = effLam / LAM_MAX.
  const lf = labelFracs || { r: 0, t: 1 };
  const lR   = R * 0.67;
  const angR = -Math.PI / 2 + (lf.r - 0.5) * 2 * sweepHalf;
  const angT = -Math.PI / 2 + (lf.t - 0.5) * 2 * sweepHalf;

  // Green tick on the arc marking the T resting position
  if (lf.t > 0) {
    gCtx.beginPath();
    gCtx.moveTo(cx + Math.cos(angT) * (R - R * 0.28), cy + Math.sin(angT) * (R - R * 0.28));
    gCtx.lineTo(cx + Math.cos(angT) * (R - 3),        cy + Math.sin(angT) * (R - 3));
    gCtx.strokeStyle = "rgba(34,238,136,0.9)";
    gCtx.lineWidth   = 2.5;
    gCtx.stroke();
  }

  gCtx.font = `bold ${Math.round(R * 0.28)}px 'JetBrains Mono',monospace`;
  gCtx.textAlign = "center"; gCtx.textBaseline = "middle";
  gCtx.shadowColor = "rgba(0,0,0,0.8)"; gCtx.shadowBlur = 4;
  gCtx.fillStyle = "rgba(255,110,60,0.85)";
  gCtx.fillText("R", cx + Math.cos(angR) * lR, cy + Math.sin(angR) * lR);
  gCtx.fillStyle = "rgba(34,238,136,0.85)";
  gCtx.fillText("T", cx + Math.cos(angT) * lR, cy + Math.sin(angT) * lR);
  gCtx.shadowBlur = 0;

  // Needles
  needles.forEach(({ fraction, color, alpha }) => {
    if (alpha < 0.03) return;
    const angle = -Math.PI / 2 + (fraction - 0.5) * 2 * sweepHalf;
    gCtx.save();
    gCtx.globalAlpha = alpha;
    gCtx.shadowColor = color; gCtx.shadowBlur = 7;
    gCtx.strokeStyle = color; gCtx.lineWidth = 2.5; gCtx.lineCap = "round";
    // Needle: short tail behind pivot, long arm forward
    gCtx.beginPath();
    gCtx.moveTo(cx + Math.cos(angle + Math.PI) * R * 0.18,
                cy + Math.sin(angle + Math.PI) * R * 0.18);
    gCtx.lineTo(cx + Math.cos(angle) * R * 0.76,
                cy + Math.sin(angle) * R * 0.76);
    gCtx.stroke();
    // Pivot cap
    gCtx.shadowBlur = 0;
    gCtx.fillStyle = "rgba(210,225,255,0.95)";
    gCtx.beginPath(); gCtx.arc(cx, cy, 4, 0, 2 * Math.PI); gCtx.fill();
    gCtx.restore();
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const mountRef  = useRef(null);
  const tTargetRef = useRef(null), lamRef = useRef(null);
  const xPointerRef = useRef(null), detWidthRef = useRef(null);
  const sigXRef = useRef(null), sigYRef = useRef(null), speedRef = useRef(null);
  const collapseThresholdRef = useRef(null);
  const T = useRef(null);
  const xCanvasRef = useRef(null);
  const yCanvasRef = useRef(null);
  const xMargRowRef = useRef(null);

  // Responsive layout
  const [winW, setWinW] = useState(() => window.innerWidth);
  const [winH, setWinH] = useState(() => window.innerHeight);
  useEffect(() => {
    const onResize = () => { setWinW(window.innerWidth); setWinH(window.innerHeight); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isMobile   = winW <= 700;
  const isLandscape = isMobile && winW > winH;
  // On mobile: hide y-panel (too narrow to be useful)
  const showYPanel = !isMobile;
  // yPanelW tracks the actual rendered height of the x-marg row so the Y-panel matches
  const [yPanelW, setYPanelW] = useState(() => Math.round((window.innerHeight - 28) / 5));
  useEffect(() => {
    const el = xMargRowRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => { const h = el.offsetHeight; if (h > 0) setYPanelW(h); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Sidebar: on mobile-portrait stacks below; on mobile-landscape stays right (compact)
  const sidebarBelow = isMobile && !isLandscape;
  const sidebarW     = isLandscape ? 200 : (isMobile ? "100%" : 240);

  const S = useRef({
    interp:"cpn",
    k0:4.0, V0:invertT(0.5,4.0), tTarget:0.5, lam:3.0, sigX:0.5, sigY:0.3,
    xPointer: 4.0,
    detWidth: 2.0,
    speed:0.5,
    collapseThreshold:0.01, // von Neumann criterion — fixed, not user-adjustable
    showWave:true, showTraj:true, showProj:false, running:true,
    tick:0, dirty:true,
    pauseUntil:0,  // wall-clock ms to hold before restarting cycle
    pauseHoldMs:1000, // duration of end-of-cycle pause in ms
    camX:0, camY:0, camZ:14,
    drag:null,
    // Copenhagen collapse state
    colBranch:0, colFade:0, colTriggered:false,
    colYHold:0,
    colPhase:0,
    sampledPointerY: null,  // Y sampled from ρ(y) on first pointer hit — drives needle
    sampledPointerY_T: null,  // Y sampled from χ_T² for MW strong world-1 needle
    sampledPointerY_R: null,  // Y sampled from χ_R² for MW strong world-2 needle
    barrierOn:true,
    detectorOn:true,
    // Projection panel state
    marg: { Tp:0.5, Rp:0.5, xIn:X0, xT:0, xR:0, yT:0, yR:0,
            sigX:0.5, sigY:0.3, bl:0, colBranch:0, colFade:0, bX:0, bY:0 },
  });

  const [interp,    setInterpUI]    = useState("cpn");
  const [tTarget,   setTTargetUI]   = useState(0.5);
  const [lam,       setLamUI]       = useState(3.0);
  const [xPointer,  setXPointerUI]  = useState(4.0);
  const [detWidth,   setDetWidthUI]  = useState(2.0);
  const [sigX,     setSigXUI]     = useState(0.5);
  const [sigY,     setSigYUI]     = useState(0.3);
  const [collapseThreshold, setCollapseThresholdUI] = useState(0.10);
  const [speed,    setSpeedUI]    = useState(0.5);
  const [pauseHoldMs, setPauseHoldMsUI] = useState(1000);
  const pauseHoldMsRef = useRef(null);
  const [showWave, setShowWaveUI] = useState(true);
  const [showTraj, setShowTrajUI] = useState(true);
  const [showProj, setShowProjUI] = useState(false);
  const [running,  setRunningUI]  = useState(true);
  const [barrierOn,  setBarrierOnUI]  = useState(true);
  const [detectorOn, setDetectorOnUI] = useState(true);
  const [Tp,       setTpUI]       = useState(0.5);
  const [Rp,       setRpUI]       = useState(0.5);
  // Collapse flash: branch = ±1 while flashing, 0 when idle
  const [flashBranch, setFlashBranch] = useState(0);
  const [flashAlpha,  setFlashAlpha]  = useState(0);
  const flashRaf = useRef(null);
  const setInterp = v => {
    S.current.interp = v; setInterpUI(v);
    S.current.colBranch = 0; S.current.colFade = 0; S.current.colTriggered = false; S.current.colYHold = 0;

    S.current.dirty = true;
  };
  const setTTarget = v => {
    S.current.tTarget = v;
    S.current.V0 = invertT(v, S.current.k0);
    S.current.dirty = true;
    setTTargetUI(v);
    setTpUI(v); setRpUI(1 - v);
    if (tTargetRef.current) tTargetRef.current.value = Math.round(v * 100);
  };
  const setLam = useCallback(v => { S.current.lam = v; S.current.dirty=true; setLamUI(v); if(lamRef.current) lamRef.current.value=v; }, []);
  const setXPointer = v => { S.current.xPointer = v; setXPointerUI(v); if(xPointerRef.current) xPointerRef.current.value=v; };
  const setDetWidth  = v => { S.current.detWidth = v; setDetWidthUI(v); if(detWidthRef.current) detWidthRef.current.value=v; };
  const setSigX= v => { S.current.sigX=v; S.current.dirty=true; setSigXUI(v); if(sigXRef.current) sigXRef.current.value=v; };
  const setSigY= v => { S.current.sigY=v; S.current.dirty=true; setSigYUI(v); if(sigYRef.current) sigYRef.current.value=v; };
  const setSpeed= v => { S.current.speed=v; setSpeedUI(v); if(speedRef.current) speedRef.current.value=v; };
  const setPauseHoldMs = v => { S.current.pauseHoldMs=v; setPauseHoldMsUI(v); if(pauseHoldMsRef.current) pauseHoldMsRef.current.value=v; };
  const setShowWave = v => { S.current.showWave=v; setShowWaveUI(v); };
  const setShowTraj = v => { S.current.showTraj=v; setShowTrajUI(v); };
  const setShowProj = v => { S.current.showProj=v; setShowProjUI(v); };
  const setRunning   = v => { S.current.running=v;  setRunningUI(v);  };
  const setBarrierOn  = v => { S.current.barrierOn=v;  S.current.dirty=true; setBarrierOnUI(v);  };
  const setDetectorOn = v => { S.current.detectorOn=v; S.current.dirty=true; setDetectorOnUI(v); };
  const setCollapseThreshold = v => { S.current.collapseThreshold=v; setCollapseThresholdUI(v); if(collapseThresholdRef.current) collapseThresholdRef.current.value=Math.round(v*100); };


  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setClearColor(0x000004, 1);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y;";
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 200);

    function resize() {
      const w = el.offsetWidth  || el.clientWidth  || window.innerWidth;
      const h = el.offsetHeight || el.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize); ro.observe(el);

    function updateCam() {
      const s = S.current;
      camera.position.set(s.camX, s.camY, s.camZ);
      camera.lookAt(s.camX, s.camY, 0);
    }
    updateCam();

    // ── Pre-compute spectral wavepacket and create density texture ────────────
    wpPrecompute(S.current.k0, S.current.V0, S.current.sigX);
    const rhoTex = new THREE.DataTexture(
      WP.rhoBuf, WP.nx, 1,
      THREE.RedFormat, THREE.FloatType
    );
    rhoTex.minFilter = THREE.LinearFilter;
    rhoTex.magFilter = THREE.LinearFilter;
    rhoTex.needsUpdate = true;

    // ── 2D heatmap ────────────────────────────────────────────────────────────
    const heatUni = {
      uBl:{ value:0 }, uPT:{ value:0.5 }, uPR:{ value:0.5 },
      uYT:{ value:0 }, uYR:{ value:0 },
      uSigX:{ value:1.0 }, uSigY:{ value:0.6 },
      uColBranch:{ value:0 }, uColFade:{ value:0 },
      uIsPW:{ value:0 }, uBY:{ value:0 },
      uXin:{ value:X0 }, uXT:{ value:0 }, uXR:{ value:0 },
    };
    const heatMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 40),
      new THREE.ShaderMaterial({
        vertexShader:VERT2D, fragmentShader:FRAG2D,
        uniforms:heatUni, side:THREE.DoubleSide, depthWrite:false,
      })
    );
    heatMesh.position.z = -0.1;
    scene.add(heatMesh);

    // ── Axes ──────────────────────────────────────────────────────────────────
    const axMat = new THREE.LineBasicMaterial({ color:0x1a3a6e, transparent:true, opacity:0.45 });
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-14,0,0), new THREE.Vector3(14,0,0)]), axMat));
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-10,0), new THREE.Vector3(0,10,0)]), axMat));

    // ── Barrier ────────────────────────────────────────────────────────────────
    const bMat = new THREE.LineBasicMaterial({ color:0x00ccff, transparent:true, opacity:0.5 });
    const bLine1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(-0.5,-10,0),new THREE.Vector3(-0.5,10,0)]), bMat);
    scene.add(bLine1);
    const bLine2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(0.5,-10,0),new THREE.Vector3(0.5,10,0)]), bMat);
    scene.add(bLine2);
    const bFill = new THREE.Mesh(new THREE.PlaneGeometry(1.0,20),
      new THREE.MeshBasicMaterial({ color:0x002244, transparent:true, opacity:0.15, side:THREE.DoubleSide }));
    scene.add(bFill);

    // ── Detector region (two vertical yellow lines) ─
    const ptrLineMat  = new THREE.LineBasicMaterial({ color:0xffcc44, transparent:true, opacity:0.7 });
    const ptrLineGeo  = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(3.0, -10, 0.05), new THREE.Vector3(3.0, 10, 0.05)
    ]);
    const ptrLine = new THREE.Line(ptrLineGeo, ptrLineMat);
    scene.add(ptrLine);
    const ptrLine2Mat = new THREE.LineBasicMaterial({ color:0xffcc44, transparent:true, opacity:0.7 });
    const ptrLine2Geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(5.0, -10, 0.05), new THREE.Vector3(5.0, 10, 0.05)
    ]);
    const ptrLine2 = new THREE.Line(ptrLine2Geo, ptrLine2Mat);
    scene.add(ptrLine2);
    // Shaded region between the two detector lines
    const detFillMat = new THREE.MeshBasicMaterial({ color:0xffcc00, transparent:true, opacity:0.04, side:THREE.DoubleSide });
    const detFillGeo = new THREE.PlaneGeometry(1, 20);
    const detFill    = new THREE.Mesh(detFillGeo, detFillMat);
    scene.add(detFill);
    const labelFont = "700 24px 'JetBrains Mono','Courier New',monospace";
    const lblPointer = makeSprite("detector", "#ffcc44", labelFont);
    lblPointer.scale.set(4.6, 1.05, 1);
    lblPointer.position.set(3.0, 9.0, 0.2);
    scene.add(lblPointer);

    // ── Branch label sprites ──────────────────────────────────────────────────
    function makeSprite(text, color, font = "700 16px 'JetBrains Mono','Courier New',monospace") {
      const cv = document.createElement("canvas");
      cv.width=300; cv.height=52;
      const ctx = cv.getContext("2d");
      ctx.font = font;
      ctx.fillStyle = color; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(text, 150, 26);
      const tex = new THREE.CanvasTexture(cv);
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true, opacity:0.85 }));
      spr.scale.set(5.2, 0.9, 1); // aspect matches 300/52 * 0.9 ≈ 5.2
      return spr;
    }
    const lblBarrier = makeSprite("barrier V0", "#00dcff", labelFont);
    lblBarrier.scale.set(4.6, 1.05, 1);
    lblBarrier.position.set(0.0, 9.0, 0.2);
    scene.add(lblBarrier);
    const lblT = makeSprite("T-branch  (x>0,  y>0)", "#44ee88");
    const lblR = makeSprite("R-branch  (x<0,  y<0)", "#ff8844");
    lblT.position.set(6.5, 5.5, 0.2); scene.add(lblT);
    lblR.position.set(-6.5,-5.5, 0.2); scene.add(lblR);

    // ── Many-Worlds overlay (diagonal tinted plane + separator line + world labels) ─
    const mwUni = {
      uSep:      { value: 0 },
      uSepA:     { value: 0 },
    };
    const mwOverlay = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 40),
      new THREE.ShaderMaterial({
        vertexShader: VERT_MW, fragmentShader: FRAG_MW,
        uniforms: mwUni, transparent: true, depthWrite: false,
      })
    );
    mwOverlay.position.z = 0.0; // above heatmap (z=-0.1)
    mwOverlay.visible = false;
    scene.add(mwOverlay);

    // Separator line — updated each frame via geometry.setFromPoints
    const mwDivLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-15, 0, 0.1), new THREE.Vector3(15, 0, 0.1)
      ]),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    );
    mwDivLine.visible = false;
    scene.add(mwDivLine);

    // World label sprites — "World 1 (transmitted)" / "World 2 (reflected)"
    const lblMW1 = makeSprite("World 1  (transmitted)", "#00e5ff");
    const lblMW2 = makeSprite("World 2  (reflected)",   "#ee14d2");
    lblMW1.visible = false; lblMW2.visible = false;
    scene.add(lblMW1); scene.add(lblMW2);

    // ── Bohmian trajectory lines + dots (pilot-wave only) ─────────────────────
    const fLines = Array.from({ length:MAX_P }, () => {
      const pos = new Float32Array((STEPS+1)*3);
      const col = new Float32Array((STEPS+1)*3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos,3));
      geo.setAttribute("color",    new THREE.BufferAttribute(col,3));
      const line = new THREE.Line(geo,
        new THREE.LineBasicMaterial({ vertexColors:true, transparent:true, opacity:0.7 }));
      scene.add(line); return { geo, pos, col, line };
    });
    const fDots = Array.from({ length:MAX_P }, () => {
      const m = new THREE.Mesh(
        new THREE.CircleGeometry(0.18,16),
        new THREE.MeshBasicMaterial({ transparent:true, opacity:0, depthWrite:false }));
      scene.add(m); return m;
    });
    const fGlows = Array.from({ length:MAX_P }, () => {
      const m = new THREE.Mesh(
        new THREE.CircleGeometry(0.42,16),
        new THREE.MeshBasicMaterial({ transparent:true, opacity:0, depthWrite:false,
          blending:THREE.AdditiveBlending }));
      scene.add(m); return m;
    });

    let trajs = [];

    function rebuild() {
      const s = S.current;
      const effV0  = s.barrierOn  ? s.V0  : 0;
      const effLam = s.detectorOn ? s.lam : 0;
      // Re-compute spectral wavepacket whenever parameters change
      wpPrecompute(s.k0, effV0, s.sigX);
      // Copenhagen has no trajectories
      if (s.interp === "cpn") {
        trajs = [];
        fLines.forEach(fl => fl.line.visible = false);
        fDots.forEach(d => d.visible = false);
        fGlows.forEach(g => g.visible = false);
        return;
      }
      trajs = computeMultiTraj(s.k0, effV0, effLam, s.sigX, s.sigY, 1);
      const tScat_rb = Math.abs(X0) / s.k0;
      const dt_rb    = (tScat_rb + 9.0) / STEPS;
      const mid = Math.round(STEPS*0.4);
      trajs.forEach(({ pts, isTransmit }, i) => {
        const fl = fLines[i];
        const pal = isTransmit ? PAL_T : PAL_R;
        const c   = new THREE.Color(pal[i % pal.length]);
        const faded = new THREE.Color(0x336699);
        // Precompute per-step dtA for screen-space y-transform in animate loop
        fl.rawY = new Float32Array(pts.length);
        fl.dtAs = new Float32Array(pts.length);
        pts.forEach((p, j) => {
          fl.rawY[j] = p.y;
          fl.dtAs[j] = Math.max(0, j * dt_rb - tScat_rb);
        });
        pts.forEach((p,j) => {
          fl.pos[j*3]=p.x; fl.pos[j*3+1]=p.y; fl.pos[j*3+2]=0.05;
          const t = clamp((j-mid)/20,0,1);
          fl.col[j*3]   = lerp(faded.r, c.r, t);
          fl.col[j*3+1] = lerp(faded.g, c.g, t);
          fl.col[j*3+2] = lerp(faded.b, c.b, t);
        });
        fl.geo.attributes.position.needsUpdate = true;
        fl.geo.attributes.color.needsUpdate    = true;
        fl.geo.setDrawRange(0, pts.length);
        fl.line.visible = false;
      });
      for (let i = 1; i < MAX_P; i++) {
        fLines[i].line.visible = false;
        fDots[i].visible = false; fGlows[i].visible = false;
      }
    }
    rebuild();

    // ── Input ─────────────────────────────────────────────────────────────────
    function onDown(e) {
      if (e.pointerType === "touch") return; // disable pan on touch devices
      S.current.drag={x:e.clientX,y:e.clientY}; el.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      const s=S.current; if(!s.drag) return;
      const dx=e.clientX-s.drag.x, dy=e.clientY-s.drag.y;
      s.drag.x=e.clientX; s.drag.y=e.clientY;
      const sc=(s.camZ/14)*0.016;
      s.camX-=dx*sc; s.camY+=dy*sc; updateCam();
    }
    function onUp(e) { S.current.drag=null; if(el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); }
    function onWheel(e) { e.preventDefault(); } // zoom disabled
    const noCtx = e => e.preventDefault();
    el.addEventListener("pointerdown",onDown);
    el.addEventListener("pointermove",onMove);
    el.addEventListener("pointerup",onUp);
    el.addEventListener("wheel",onWheel,{passive:false});
    el.addEventListener("contextmenu",noCtx);

    // ── Gauge sprite (meter dial at top of detector line) ───────────────────────
    const gaugeCanvas = document.createElement("canvas");
    gaugeCanvas.width = 128; gaugeCanvas.height = 128;
    const gaugeCtx = gaugeCanvas.getContext("2d");
    const gaugeTex = new THREE.CanvasTexture(gaugeCanvas);
    const gaugeSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: gaugeTex, transparent: true, depthWrite: false })
    );
    scene.add(gaugeSprite);

    T.current = {
      scene, camera, renderer, heatUni, heatMesh,
      fLines, fDots, fGlows, lblT, lblR,
      mwOverlay, mwUni, mwDivLine, lblMW1, lblMW2,
      ptrLine, ptrLine2, detFill, lblPointer, lblBarrier,
      bLine1, bLine2, bFill,
      gaugeCanvas, gCtx: gaugeCtx, gaugeTex, gaugeSprite,
      rebuild, trajs:()=>trajs, updateCam,
    };

    // ── Render loop ───────────────────────────────────────────────────────────
    let raf;
    // throttle React state updates to ~10Hz to avoid jank
    let lastReactUpdate = 0;

    function animate() {
      raf = requestAnimationFrame(animate);
      const s=S.current, Tr=T.current;
      if(!Tr) return;
      if(s.dirty) { Tr.rebuild(); s.dirty=false; }
      // Advance tick only while running and not in end-of-cycle pause
      const nowMs = performance.now();
      if (s.running) {
        if (s.pauseUntil > 0) {
          // Holding at cycle end — wait, then restart
          if (nowMs >= s.pauseUntil) {
            s.tick = 0;
            s.pauseUntil = 0;
            s.colTriggered = false; s.colBranch = 0; s.colFade = 0; s.colYHold = 0;
            s.sampledPointerY = null;  // fresh sample next cycle
            s.sampledPointerY_T = null;
            s.sampledPointerY_R = null;
            s.dirty = true;  // rebuild trajectory with new random initial conditions
          }
          // else: don't advance tick
        } else {
          s.tick += s.speed;
        }
      }

      updateCam();

      // Camera geometry — ensure portrait phones always see ≥7 world units horizontally
      const tan26 = Math.tan(26 * Math.PI / 180); // ≈ 0.4877
      const rendW = Tr.renderer.domElement.clientWidth;
      const rendH = Tr.renderer.domElement.clientHeight;
      const rendHidden = rendW === 0 || rendH === 0;
      let halfW, halfH;
      if (!rendHidden) {
        const camAspect = rendW / rendH;
        const minCamZ = 7.0 / (camAspect * tan26); // camZ needed to show ±7 horizontal
        const effectiveCamZ = Math.max(s.camZ, minCamZ);
        if (effectiveCamZ > s.camZ) camera.position.z = effectiveCamZ;
        halfH = tan26 * effectiveCamZ;
        halfW = camAspect * halfH; // always ≥ 7.0 world units
        s._halfW = halfW; s._halfH = halfH;
      } else {
        // Renderer hidden: use cached values or fall back to x-panel dimensions
        if (s._halfW) {
          halfW = s._halfW; halfH = s._halfH;
        } else {
          // First frame before any valid render — derive from x-panel canvas aspect
          const xc = xCanvasRef.current;
          const aspect = xc ? (xc.clientWidth / Math.max(xc.clientHeight, 1)) : 4;
          halfH = 7.0 / Math.max(aspect, 0.1);
          halfW = aspect * halfH;
          s._halfW = halfW; s._halfH = halfH;
        }
      }
      // R/incoming blob: 20% up from bottom, pointer stays here when not transmitted
      const yRFixed = s.camY - halfH * 0.6;

      const effV0   = s.barrierOn  ? s.V0  : 0;
      const effLam  = s.detectorOn ? s.lam : 0;
      const Tprob  = clamp(exactT(s.k0, effV0), 0, 1);
      const Rprob  = 1 - Tprob;
      const v0     = s.k0;
      const tScatter = Math.abs(X0) / v0;
      const tTotal   = tScatter + 9.0;
      // tFrac is clamped to [0,1) — do not loop via modulo any more;
      // the pause-and-restart above handles cycling.
      const tFrac    = Math.min((s.tick % PERIOD) / PERIOD, 1.0);
      const tPhys    = tFrac * tTotal;
      const bl       = clamp(0.5*(1+Math.tanh(10*(tPhys-tScatter))),0,1);
      const dtA      = Math.max(0, tPhys - tScatter);
      const xIn      = X0 + v0 * Math.min(tPhys, tScatter);
      const xT       =  v0 * dtA,  xR = -v0 * dtA;
      // Pointer coupling starts only when the T wave-front reaches xPointer.
      const tPointerHit = tScatter + s.xPointer / v0;
      const dtP      = Math.max(0, tPhys - tPointerHit);  // time since wave hit pointer
      // Pointer only moves while the particle overlaps the detector region [xPointer, xPointer+detWidth].
      // Once the particle exits the region, dtP_capped freezes at its max value.
      const detWidth  = s.detWidth;
      const dtP_capped = Math.min(dtP, detWidth / v0);
      // edgeX / gWindow computed here so dtPShown can reference them.
      // Must be at least xPointer+detWidth so the cycle never stops before the wave
      // finishes traversing the detector (otherwise the needle freezes short of T).
      const edgeX  = Math.max(Math.min(halfW - 1.5, 9.0), s.xPointer + s.detWidth);
      // gWindow: max time the pointer can be active (capped by detector width)
      const gWindow = detWidth / v0;
      // CPN: pointer jumps instantly to its final (coupling-scaled) position at T-collapse.
      // For R collapse: keep dtP_capped (blob stays where it is, then fades).
      const dtPShown = (s.interp === "cpn" && s.colTriggered && s.colBranch > 0) ? gWindow : dtP_capped;
      // T blob starts at yRFixed and moves up only while inside detector; R stays at yRFixed.
      const yT       = yRFixed + 4 * effLam * dtPShown, yR = yRFixed;
      const sepFrac  = effLam > 0 ? clamp(dtPShown / 3.0, 0, 1) : 0;
      const tIdx     = clamp(Math.round(tFrac*STEPS), 0, STEPS);

      // ── Stop before lobes exit canvas, pause 1.5 s then restart ───────────
      // Stop when lobe centre is 1.5 world units from screen edge (adaptive to halfW).
      // Cap at 9.0 so zoomed-out views still stop at a reasonable time.
      if (s.running && s.pauseUntil === 0 && xT > edgeX) {
        s.pauseUntil = performance.now() + (s.pauseHoldMs ?? 1000);
      }

      // Pointer overlap O = ⟨χ_T|χ_R⟩ — shared across all views.
      // Determines whether the measurement is weak (O≈1) or strong (O≈0).
      const deltaYFinal = 4 * effLam * gWindow;
      const ptrOverlap  = effLam > 0
        ? Math.exp(-deltaYFinal * deltaYFinal / (4 * s.sigY * s.sigY))
        : 1.0;  // no coupling → complete overlap (trivially weak)

      // ── Copenhagen: collapse logic ─────────────────────────────────────────
      // Collapse requires both detector on AND non-zero coupling (effLam > 0).
      // λ=0 means no interaction — same as no detector.
      if (s.interp === "cpn" && s.detectorOn && effLam > 0) {
        // Compute final pointer overlap (at full interaction time) to decide if
        // the measurement is strong enough to trigger collapse.
        const collapseAllowed = ptrOverlap < 0.01; // von Neumann criterion: collapse when pointer states effectively orthogonal
        // New cycle: restore pre-collapse superposition so both branches are visible
        // again until the transmitted branch reaches the detector.
        if (tFrac < 0.02 && s.colTriggered) {
          s.colTriggered = false;
          s.colBranch = 0;
          s.colFade = 0;
          s.colYHold = 0;
          s.sampledPointerY = null;
          s.sampledPointerY_T = null;
          s.sampledPointerY_R = null;
        }
        if (!s.colTriggered && tPhys >= tPointerHit) {
          s.colTriggered = true;
          if (collapseAllowed) {
            s.colBranch = Math.random() < Tprob ? 1 : -1;
            // Re-draw sampledPointerY from the winning branch so needle agrees with collapse.
            // Box-Muller Gaussian sample from the correct pointer wavepacket.
            const yT_final = yRFixed + 4 * effLam * gWindow;
            const u = Math.max(1e-10, Math.random()), vv = Math.random();
            const g = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * vv);
            s.sampledPointerY = (s.colBranch > 0 ? yT_final : yRFixed) + g * s.sigY;
            // Capture jump at detector-triggered collapse, then hold y constant.
            s.colYHold = Math.max(dtP, 1.0);
            s.colFade   = 0;
            s.colStartMs = performance.now();
            s.colPhase = 0;
            s._flashPending = true;
          }
          // If weak (collapseAllowed = false): colBranch stays 0, no flash, no fade.
        }
        if (s.colTriggered && s.colBranch !== 0) {
          s.colFade = Math.min(s.colFade + 0.08, 1);
        }
        // Reset is handled by the pause-restart cycle above
      } else {
        s.colBranch = 0; s.colFade = 0; s.colTriggered = false; s.colYHold = 0;
      }

      // ── Pilot-wave: trajectories + dots ───────────────────────────────────
      const td = Tr.trajs();
      // Pick first trajectory for the 1D conditional wavefunction
      let bX = 0, bY = 0, bIsTransmit = false;
      td.forEach(({ pts, isTransmit }, i) => {
        const fl = fLines[i];
        if (i >= 1 || s.interp !== "pw") {
          fl.line.visible = false; fDots[i].visible=false; fGlows[i].visible=false; return;
        }
        fl.line.visible = s.showTraj;
        if (s.showTraj) fl.geo.setDrawRange(0, tIdx+1);
        // Re-upload y-positions every frame with screen-space transform:
        // Y_screen = yRFixed + Y_raw + branchShift,
        // where branchShift matches displayed branch centres (T: +2*lam*dtP, R: 0).
        if (fl.rawY && fl.dtAs) {
          const dtPointerOffset = s.xPointer / s.k0; // additional delay after scatter
          const dtCap = s.detWidth / s.k0;
          for (let j = 0; j <= STEPS; j++) {
            const dtP_j = Math.min(Math.max(0, fl.dtAs[j] - dtPointerOffset), dtCap);
            const branchShift = isTransmit ? (4 * effLam * dtP_j) : 0;
            fl.pos[j*3+1] = yRFixed + fl.rawY[j] + branchShift;
          }
          fl.geo.attributes.position.needsUpdate = true;
        }
        const pt = pts[tIdx];
        const dtPointerOffset = s.xPointer / s.k0;
        const dtCap = s.detWidth / s.k0;
        const dtP_cur = Math.min(Math.max(0, (fl.dtAs ? fl.dtAs[tIdx] : 0) - dtPointerOffset), dtCap);
        const branchShiftCur = isTransmit ? (4 * effLam * dtP_cur) : 0;
        const ptYScreen = yRFixed + pt.y + branchShiftCur;
        if (i === 0) { bX = pt.x; bY = ptYScreen; bIsTransmit = isTransmit; }
        fDots[i].visible  = s.showTraj;
        fGlows[i].visible = s.showTraj;
        if (s.showTraj) {
          fDots[i].position.set(pt.x, ptYScreen, 0.15);
          fGlows[i].position.set(pt.x, ptYScreen, 0.12);
          const pal = isTransmit ? PAL_T : PAL_R;
          const col = new THREE.Color(pal[i%pal.length]);
          fDots[i].material.color.copy(col);
          fGlows[i].material.color.copy(col);
          fDots[i].material.opacity  = 0.93;
          fGlows[i].material.opacity = 0.20 * sepFrac;
        }
      });

      // ── Update detector region lines ──────────────────────────────────────
      const xExit = s.xPointer + s.detWidth;
      if (Tr.ptrLine) {
        Tr.ptrLine.geometry.setFromPoints([
          new THREE.Vector3(s.xPointer, -20, 0.05),
          new THREE.Vector3(s.xPointer,  20, 0.05),
        ]);
        Tr.ptrLine.visible = s.detectorOn;
      }
      if (Tr.ptrLine2) {
        Tr.ptrLine2.geometry.setFromPoints([
          new THREE.Vector3(xExit, -20, 0.05),
          new THREE.Vector3(xExit,  20, 0.05),
        ]);
        Tr.ptrLine2.visible = s.detectorOn;
      }
      if (Tr.detFill) {
        const cx = (s.xPointer + xExit) / 2;
        Tr.detFill.position.set(cx, s.camY, 0.04);
        Tr.detFill.scale.set(s.detWidth, 40, 1);
        Tr.detFill.visible = s.detectorOn;
      }
      if (Tr.lblPointer) {
        Tr.lblPointer.position.set((s.xPointer + xExit) / 2, s.camY + halfH - 0.8, 0.2);
        Tr.lblPointer.visible = s.detectorOn;
      }
      if (Tr.lblBarrier) {
        Tr.lblBarrier.position.set(0, s.camY + halfH - 0.8, 0.2);
        Tr.lblBarrier.visible = s.barrierOn;
      }
      if (Tr.bLine1) Tr.bLine1.visible = s.barrierOn;
      if (Tr.bLine2) Tr.bLine2.visible = s.barrierOn;
      if (Tr.bFill)  Tr.bFill.visible  = s.barrierOn;

      // ── Update heatmap ─────────────────────────────────────────────────────
      // Evaluate real wavepacket and upload density texture
      wpEvalPsi(tPhys);
      rhoTex.needsUpdate = true;

      Tr.heatMesh.visible = s.showWave;
      if (s.showWave) {
        const u = Tr.heatUni;
        u.uBl.value=bl; u.uPT.value=Tprob; u.uPR.value=Rprob;
        u.uXin.value=xIn; u.uXT.value=xT; u.uXR.value=xR;
        u.uYT.value=yT; u.uYR.value=yRFixed;
        u.uSigX.value=s.sigX; u.uSigY.value=s.sigY;
        u.uColBranch.value=s.colBranch;
        u.uColFade.value=s.colFade;
        u.uIsPW.value = s.interp === "pw" ? 1 : 0;
        u.uBY.value = bY;
      }

      // Branch labels — keep within visible area on any screen aspect
      Tr.lblT.visible = sepFrac > 0.3;
      Tr.lblR.visible = sepFrac > 0.3;
      const lblX = Math.min(6.5, halfW - 2.2);
      const lblSX = Math.min(5.2, halfW * 0.68);
      const lblSY = lblSX * (52 / 300); // maintain canvas aspect ratio
      const isMW  = s.interp === "mw";
      // T/R branch labels: hidden in MW mode (replaced by World 1/2 labels)
      Tr.lblT.visible = !isMW && sepFrac > 0.3;
      Tr.lblR.visible = !isMW && sepFrac > 0.3;
      Tr.lblT.position.set( lblX,  5.5, 0.2);
      Tr.lblR.position.set(-lblX, -5.5, 0.2);
      Tr.lblT.scale.set(lblSX, lblSY, 1);
      Tr.lblR.scale.set(lblSX, lblSY, 1);

      // ── Many-Worlds overlay ────────────────────────────────────────────────
      // Branching happens at measurement (detector entanglement), not at the barrier
      const sepFracMW = effLam > 0 ? clamp(dtP / 3.0, 0, 1) : 0;
      const mwStrong3D = isMW && ptrOverlap < 0.01;
      Tr.mwOverlay.visible = isMW;
      Tr.mwDivLine.visible = mwStrong3D && sepFracMW > 0.05;
      Tr.lblMW1.visible    = mwStrong3D && sepFracMW > 0.08;
      Tr.lblMW2.visible    = mwStrong3D && sepFracMW > 0.08;
      if (isMW) {
        // Vertical separator at x = 0 (the barrier): World 1 right, World 2 left
        Tr.mwUni.uSep.value  = sepFracMW;
        Tr.mwUni.uSepA.value = 0;
        // Update dividing line as a vertical line at x = 0
        Tr.mwDivLine.geometry.setFromPoints([
          new THREE.Vector3(0, s.camY - halfH, 0.1),
          new THREE.Vector3(0, s.camY + halfH, 0.1),
        ]);
        Tr.mwDivLine.material.opacity = Math.min(sepFracMW * 1.5, 0.95);
        // World labels: track branch centres, clamped inside visible area
        const pad = 2.5;
        const lx1 = clamp(Math.max(xT * 0.7, 1.5), 0.5, halfW-pad);  // always right of x=0
        const ly1 = clamp(yT * 0.7 + yRFixed * 0.3, s.camY-halfH+1, s.camY+halfH-1);
        const lx2 = clamp(Math.min(xR * 0.7, -1.5), -(halfW-pad), -0.5);  // always left of x=0
        const ly2 = clamp(yRFixed - halfH * 0.28, s.camY-halfH+1, s.camY+halfH-1);
        Tr.lblMW1.position.set(lx1, ly1, 0.2); Tr.lblMW1.scale.set(lblSX * 1.3, lblSY * 1.3, 1);
        Tr.lblMW2.position.set(lx2, ly2, 0.2); Tr.lblMW2.scale.set(lblSX * 1.3, lblSY * 1.3, 1);
      }

      // ── Throttled React state updates (~10 Hz) ────────────────────────────
      const now = performance.now();
      if (now - lastReactUpdate > 80) {
        lastReactUpdate = now;

        // nothing else throttled here — panels drawn directly below

        // Collapse flash signal
        if (s._flashPending) {
          s._flashPending = false;
          const branch = s.colBranch;
          setFlashBranch(branch);
          setFlashAlpha(1);
          // Decay over 800ms
          let start = null;
          const decay = (ts) => {
            if (!start) start = ts;
            const alpha = Math.max(0, 1 - (ts - start) / 1400);
            setFlashAlpha(alpha);
            if (alpha > 0) flashRaf.current = requestAnimationFrame(decay);
            else { setFlashBranch(0); }
          };
          if (flashRaf.current) cancelAnimationFrame(flashRaf.current);
          flashRaf.current = requestAnimationFrame(decay);
        }
      }

      // ── Draw projection panels directly (no throttle, matches heatmap) ─────
      const margData = {
        Tp: Tprob, Rp: Rprob,
        xIn, xT, xR, yT, yR, yRFixed,
        sigX: s.sigX, sigY: s.sigY,
        bl,
        colBranch: s.colBranch, colFade: s.colFade,
        bX, bY, bIsTransmit,
        isPW: s.interp === "pw",
        interp: s.interp,
        colElapsedMs: s.colTriggered ? (performance.now() - (s.colStartMs || 0)) : 0,
        colPhase: s.colPhase,
        sepFrac,
        ptrOverlap,
        showProj: s.showProj,
        // x-panel: use camera's actual visible range so particle position matches 2D canvas exactly
        xLo: s.camX - halfW,
        xHi: s.camX + halfW,
        yLo: s.camY - halfH, yHi: s.camY + halfH,
        rho: WP.rhoBuf, rhoXs: WP.xs,
        V0: s.V0,
      };
      drawXMarg(xCanvasRef.current, margData);
      drawYMarg(yCanvasRef.current, margData);

      // ── Gauge dial ─────────────────────────────────────────────────────
      if (Tr.gaugeSprite && s.detectorOn) {
        // Size: adapt to screen so it stays below the detector label
        const gaugeSize = Math.min(halfH * 0.40, 2.2);
        Tr.gaugeSprite.scale.set(gaugeSize, gaugeSize, 1);
        Tr.gaugeSprite.position.set(
          s.xPointer,
          s.camY + halfH - gaugeSize * 0.5 - 1.15,
          0.4
        );
        Tr.gaugeSprite.visible = true;

        // Needle fraction: 0 = R side (rest/no-deflection), 1 = T side (full deflection)
        // Gate on dtPShown: before the wave reaches the detector the pointer is at rest.
        const pointerHit = dtPShown > 0.02 && effLam > 0;
        const LAM_MAX = 3.0;
        const lamScale = effLam / LAM_MAX;
        const gFrac = (effLam > 0) ? clamp(dtPShown / gWindow, 0, 1) * lamScale : 0;

        // Sample pointer position from ρ(y) = T·χ_T² + R·χ_R² once, on first pointer hit.
        // Stored in s.sampledPointerY; cleared each cycle reset for a fresh draw.
        // Also sample per-world positions for MW strong (one draw per world per cycle).
        if (pointerHit && s.sampledPointerY === null) {
          const yT_final = yRFixed + 4 * effLam * gWindow;
          const randn = () => {
            const u = Math.max(1e-10, Math.random()), v = Math.random();
            return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
          };
          const branch = Math.random() < Tprob ? yT_final : yRFixed;
          s.sampledPointerY = branch + randn() * s.sigY;
          // Per-world samples: each drawn independently from its own χ²
          s.sampledPointerY_T = yT_final + randn() * s.sigY;
          s.sampledPointerY_R = yRFixed  + randn() * s.sigY;
        }
        // Convert sampled Y to gauge fraction [0..1], normalised by max possible deflection.
        const yMaxDeflect = 4 * LAM_MAX * gWindow;
        const sampledFrac = (s.sampledPointerY !== null && yMaxDeflect > 0)
          ? clamp((s.sampledPointerY - yRFixed) / yMaxDeflect, -0.05, 1.05)
          : 0;

        const needles = [];
        const mwStrong = isMW && ptrOverlap < 0.01;
        // Progress scalar 0→1 as detector traversal completes
        const progress = clamp(dtPShown / gWindow, 0, 1);
        // Needle target from sampled Y — grows toward sampledFrac over traversal time
        const sampledNeedle = progress * sampledFrac;

        if (!pointerHit) {
          // Wave hasn't reached detector yet — needle at dead rest
          needles.push({ fraction: 0, color: "#88aaff", alpha: 0.55 });
        } else if (mwStrong) {
          // Many-Worlds strong: two resolved worlds, each needle at a position sampled
          // from its own pointer wavepacket N(y_branch, σ_p) — not the exact centre.
          const sf = Math.min(gFrac * 2, 1);
          const tFracSampled = (s.sampledPointerY_T !== null && yMaxDeflect > 0)
            ? clamp((s.sampledPointerY_T - yRFixed) / yMaxDeflect, -0.05, 1.05) : gFrac;
          const rFracSampled = (s.sampledPointerY_R !== null && yMaxDeflect > 0)
            ? clamp((s.sampledPointerY_R - yRFixed) / yMaxDeflect, -0.05, 1.05) : 0;
          needles.push({ fraction: progress * tFracSampled, color: "#22ee88", alpha: sf * 0.88 });
          needles.push({ fraction: progress * rFracSampled, color: "#ff7744", alpha: sf * 0.88 });
        } else if (isMW) {
          // Many-Worlds weak: single needle at sampled position from ρ(y)
          needles.push({ fraction: sampledNeedle, color: "#88aaff", alpha: 0.82 });
        } else if (s.interp === "pw") {
          // Pilot-wave: needle tracks the actual Bohmian pointer coordinate bY —
          // the exact y-position of the pointer particle on the guidance equation,
          // which sits within the T or R pointer wavepacket (not exactly at its centre).
          const pwFrac = pointerHit
            ? clamp((bY - yRFixed) / yMaxDeflect, -0.05, 1.05)
            : 0;
          needles.push({ fraction: pwFrac, color: "#ffffff", alpha: 0.92 });
        } else {
          // Copenhagen — needle always tracks the sampled position from ρ(y).
          // sampledPointerY is drawn once from T·N(yT,σ) + R·N(yR,σ) on first pointer hit,
          // so it sits within the wavepacket, not exactly at T or R — even post-collapse.
          needles.push({ fraction: sampledNeedle, color: "#88aaff", alpha: s.colBranch !== 0 ? 0.95 : 0.82 });
        }
        drawGaugeFace(Tr.gCtx, 128, 128, needles, { r: 0, t: lamScale });
        Tr.gaugeTex.needsUpdate = true;
      } else if (Tr.gaugeSprite) {
        Tr.gaugeSprite.visible = false;
      }

      Tr.renderer.render(Tr.scene, Tr.camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown",onDown);
      el.removeEventListener("pointermove",onMove);
      el.removeEventListener("pointerup",onUp);
      el.removeEventListener("wheel",onWheel);
      el.removeEventListener("contextmenu",noCtx);
      renderer.dispose();
      if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      T.current=null;
    };
  }, []);

  const [canvasTab, setCanvasTab] = useState("sim"); // "sim" | "math"
  const [advMode,   setAdvMode]   = useState(false); // false = beginner, true = advanced

  return (
    <div style={{ display:"flex", flexDirection: sidebarBelow ? "column" : "row",
      width:"100%", maxWidth:"100vw",
      minHeight: sidebarBelow ? "100dvh" : "100%",
      background:"#040a1c",
      overflowX:"hidden",
      overflowY: sidebarBelow ? "auto" : "hidden" }}>
      {/* Left: canvas area + tab strip */}
      <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column",
        position:"relative", overflow:"hidden",
        height: sidebarBelow ? undefined : "100%",
        // portrait: canvas ≈ min(winW,500) square, x-marg = 1/4 of that, + tab strip
        minHeight: sidebarBelow ? Math.min(winW, 500) * 1.25 + 28 : 0 }}>

        {/* Tab strip */}
        <div style={{ display:"flex", flexShrink:0, background:"rgba(4,10,30,0.9)",
          borderBottom:"1px solid rgba(40,80,180,0.35)", height:28, alignItems:"center" }}>
          {[["sim","Simulation"],["math","Math"],["about","About"]].map(([key,label]) => {
            if (key === "math" && !advMode) return null;
            return (
            <button key={key} onClick={() => setCanvasTab(key)} style={{
              padding:"0 16px", fontSize:11, cursor:"pointer", border:"none",
              fontFamily:"'JetBrains Mono','Courier New',monospace",
              textTransform:"uppercase", letterSpacing:"0.08em",
              background: canvasTab===key ? "rgba(40,80,200,0.3)" : "transparent",
              color: canvasTab===key ? "#88bbff" : "#4a6a9a",
              borderBottom: canvasTab===key ? "2px solid #5588ff" : "2px solid transparent",
              height:"100%",
            }}>{label}</button>
            );
          })}
          {/* Beginner / Advanced toggle — pinned to the right */}
          <button onClick={() => {
              const goingBeginner = advMode;
              setAdvMode(a => !a);
              // if switching to beginner while on math tab, go back to sim
              if (goingBeginner && canvasTab === "math") setCanvasTab("sim");
            }}
            style={{
              marginLeft:"auto", padding:"0 12px", height:"100%",
              fontSize:10, cursor:"pointer", border:"none",
              fontFamily:"'JetBrains Mono','Courier New',monospace",
              letterSpacing:"0.06em", textTransform:"uppercase",
              background: advMode ? "rgba(80,40,160,0.35)" : "rgba(0,60,120,0.25)",
              color: advMode ? "#cc99ff" : "#4a8ac0",
              borderLeft:"1px solid rgba(60,80,180,0.25)",
              borderBottom:"2px solid transparent",
            }}>
            {advMode ? "▼ Advanced" : "▶ Beginner"}
          </button>
        </div>

        {/* Simulation view */}
        <div style={{ display: canvasTab==="sim" ? "flex" : "none",
          flex:1, flexDirection:"column", overflow:"hidden" }}>

        {/* Top row: 2D heatmap + y-marginal side by side — flex:4 so x-marg gets flex:1 (1/4 of canvas) */}
        <div style={{ flex:4, minHeight:0, display:"flex", flexDirection:"row", overflow:"hidden" }}>
          {/* 2D Three.js canvas */}
          <div ref={mountRef} style={{ flex:1, position:"relative", overflow:"hidden", touchAction:"pan-y" }}>
            {/* Collapse flash overlay — CPN only */}
            {flashBranch !== 0 && flashAlpha > 0 && (() => {
              const flashColor = flashBranch === 1 ? "#22ee88" : "#ff7744";
              return (
                <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:10,
                  boxShadow:`inset 0 0 ${50 * flashAlpha}px ${flashColor}88`,
                  border:`2px solid ${flashColor}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  opacity: flashAlpha }}>
                  <div style={{ fontSize: isMobile ? 18 : 28, fontWeight:700, color: flashColor,
                    letterSpacing:"0.18em",
                    fontFamily:"'JetBrains Mono','Courier New',monospace",
                    textShadow:`0 0 30px ${flashColor}, 0 0 60px ${flashColor}66` }}>COLLAPSE</div>
                </div>
              );
            })()}
            {/* Axis labels */}
            <div style={{ position:"absolute", bottom:14, left:"50%", transform:"translateX(-50%)",
              color:"rgba(100,160,255,0.5)", fontSize: isMobile ? 13 : 16, pointerEvents:"none",
              fontFamily:"'JetBrains Mono','Courier New',monospace" }}>
              {isMobile ? "x — position →" : "x — particle position →"}
            </div>

            {/* View badge */}
            <div style={{ position:"absolute", top:10, right:12 }}>
              <Tip text={VIEW_TIP[interp]}>
                <div style={{
                  color: VIEW_COLOR[interp], fontSize:12, fontWeight:700,
                  fontFamily:"'JetBrains Mono','Courier New',monospace",
                  background:"rgba(4,10,30,0.7)", padding:"3px 8px", borderRadius:4,
                  border:`1px solid ${VIEW_COLOR[interp]}55`,
                  cursor:"help",
                }}>
                  {VIEW_LABEL[interp]}
                </div>
              </Tip>
            </div>

          </div>

          {/* Y-marginal + y-axis label: vertical strip — hidden on mobile */}
          {showYPanel && (
          <React.Fragment>
          {/* y-axis label — sits between 2D canvas edge and Y-panel */}
          <div style={{ width:18, flexShrink:0, display:"flex", alignItems:"center",
            justifyContent:"center", background:"#020812",
            borderLeft:"1px solid rgba(40,80,180,0.3)" }}>
            <span style={{ color:"rgba(100,160,255,0.5)", fontSize:16, pointerEvents:"none",
              fontFamily:"'JetBrains Mono','Courier New',monospace",
              writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>
              y — pointer position →
            </span>
          </div>
          <div style={{ width:yPanelW, flexShrink:0,
            background:"#020812" }}>
            <YMarginalPanel ref={yCanvasRef} />
          </div>
          </React.Fragment>
          )}
        </div>

        {/* X-marginal: horizontal strip — flex:1 so it is 1/4 the height of the canvas row above */}
        <div ref={xMargRowRef} style={{ flex:1, minHeight:0, display:"flex", flexDirection:"row",
          borderTop:"1px solid rgba(40,80,180,0.3)", position:"relative" }}>
          <div style={{ flex:1, background:"#020812", overflow:"hidden" }}>
            <XMarginalPanel ref={xCanvasRef} />
          </div>
          {/* spacer matching Y-panel width so X axis aligns with 2D canvas — desktop only */}
          {showYPanel && <div style={{ width:yPanelW, flexShrink:0, background:"#020812",
            borderLeft:"1px solid rgba(40,80,180,0.3)" }} />}
        </div>


        </div>{/* simulation view */}

        {/* Math view */}
        {canvasTab === "math" && <MathPanel interp={interp} />}

        {/* About / narration view */}
        {canvasTab === "about" && (
          <div style={{ flex:1, overflowY:"auto", padding:"28px 36px",
            fontFamily:"Georgia,'Times New Roman',serif",
            background:"#040a1c", color:"#c8d8f0", lineHeight:1.9, fontSize:15 }}>
              {[
              "What does it mean to measure a quantum particle?",
              "This simulation shows a quantum particle — say, an electron — approaching a potential barrier from the left. The horizontal axis is the particle's position x. The vertical axis is the internal coordinate of a measuring device: a pointer that deflects upward when the particle transmits and stays at rest when it reflects. The yellow vertical line marks the detector where the particle–pointer coupling begins.",
              "Before the barrier, the wavefunction is a single two-dimensional blob moving horizontally — the particle drifts toward the barrier while the pointer stays at rest.",
              "At the barrier, the wavefunction splits into two branches. The transmitted branch moves to the upper right — the particle passes through and the pointer deflects upward. The reflected branch moves to the lower left — the particle bounces back and the pointer stays near rest. The projection panels on the sides show the resulting two-peaked distributions.",
              "What happens next depends on your view of quantum mechanics.",
              "Orthodox QM: The wavefunction collapses to a single branch when the two pointer states become orthogonal — that is, when their overlap ⟨χ_T|χ_R⟩ drops to essentially zero. This is the von Neumann orthogonality criterion: the device has unambiguously recorded a result. If the coupling is too weak or the pointer too broad, the overlap stays high, no collapse occurs, and the system remains in an entangled superposition. The Pointer overlap readout in the Advanced panel tracks this live.",
              "Many Worlds (Everett): The wavefunction never collapses. Both branches continue to exist in separate, non-communicating worlds — one where the particle transmitted, one where it reflected. Whether the worlds are distinguishable depends on the measurement strength. In a strong measurement (pointer overlap < 1%), the two worlds are resolved: the simulation shows the cyan/magenta split and labels World 1 / World 2. In a weak measurement, the pointer states still overlap; the worlds have not yet branched into distinguishable copies, and the simulation shows a single superposed distribution. There is no randomness in the dynamics; the appearance of probability arises from counting branches.",
              "Pilot-Wave (Bohmian mechanics): The wavefunction never collapses either, but the particle always has a definite position, guided by the wave. The white dot traces this trajectory. It enters one branch and never crosses to the other. The other branch — the empty wave — continues to propagate but carries no particle and has no further physical effect on the outcome.",
              "All three views make identical experimental predictions. The difference is ontological: what they claim is really happening between measurements.",
              "A strong measurement uses a large coupling and a narrow pointer so the T and R pointer states end up well separated and orthogonal — collapse fires every cycle in Orthodox mode. A weak measurement uses a small coupling or a wide pointer: the pointer states overlap significantly, the device cannot distinguish the two outcomes, and no definite result is recorded. Switch to Advanced mode to adjust these parameters and watch the Pointer overlap change in real time.",
            ].map((para, i) => (
              <p key={i} style={{
                marginBottom:"1.2em",
                fontWeight: i === 0 ? 700 : 400,
                fontSize: i === 0 ? 18 : 15,
                color: i === 0 ? "#88ccff" : "#c8d8f0",
              }}>{para}</p>
            ))}
            <p style={{ marginTop:"2em", fontSize:11,
              color:"#2a4060", fontFamily:"'JetBrains Mono','Courier New',monospace" }}>
              Bohmian Measurement · v{typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "dev"}
            </p>
          </div>
        )}

      </div>{/* left column */}

      {/* Right (desktop/landscape) / Bottom (mobile-portrait): sidebar */}
      <div style={{
        width:       sidebarBelow ? "100%" : sidebarW,
        flexShrink:  0,
        background:  "rgba(4,10,30,0.92)",
        borderLeft:  sidebarBelow ? "none" : "1px solid rgba(40,80,180,0.35)",
        borderTop:   sidebarBelow ? "1px solid rgba(40,80,180,0.35)" : "none",
        overflowY:   "auto",
        // On mobile-portrait, allow sidebar to grow to show all controls
        maxHeight:   sidebarBelow ? "none" : undefined,
      }}>
        <SimPanel
          interp={interp}   setInterp={setInterp}
          tTarget={tTarget} setTTarget={setTTarget} tTargetRef={tTargetRef}
          lam={lam} setLam={setLam} lamRef={lamRef}
          xPointer={xPointer} setXPointer={setXPointer} xPointerRef={xPointerRef}
          detWidth={detWidth} setDetWidth={setDetWidth} detWidthRef={detWidthRef}
          sigX={sigX} setSigX={setSigX} sigXRef={sigXRef}
          sigY={sigY} setSigY={setSigY} sigYRef={sigYRef}
          collapseThreshold={collapseThreshold} setCollapseThreshold={setCollapseThreshold} collapseThresholdRef={collapseThresholdRef}
          speed={speed} setSpeed={setSpeed} speedRef={speedRef}
          pauseHoldMs={pauseHoldMs} setPauseHoldMs={setPauseHoldMs} pauseHoldMsRef={pauseHoldMsRef}
          showWave={showWave} setShowWave={setShowWave}
          showTraj={showTraj} setShowTraj={setShowTraj}
          showProj={showProj} setShowProj={setShowProj}
          running={running} setRunning={setRunning}
          barrierOn={barrierOn} setBarrierOn={setBarrierOn}
          detectorOn={detectorOn} setDetectorOn={setDetectorOn}
          Tp={Tp} Rp={Rp}
          isMobile={isMobile}
          advMode={advMode}
        />
      </div>
    </div>
  );
}

const container = document.getElementById("root");
if (container) createRoot(container).render(<App />);
