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
function computeTraj(k0, V0, lam, sigX, sigY, y0) {
  const tScatter = Math.abs(X0) / k0;
  const tTotal   = tScatter + 9.0;
  const dt       = tTotal / STEPS;
  // Bohmian non-crossing: sign of y0 determines branch deterministically.
  // dir = +1 → T branch (transmitted, pointer climbs), -1 → R branch (reflected, pointer stays).
  const dir = y0 >= 0 ? 1 : -1;
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
      Y += dir * lam * dt;
    }
  }
  return pts;
}

// Compute N trajectories with Born-rule initial positions
function computeMultiTraj(k0, V0, lam, sigX, sigY, n) {
  const trajs = [];
  for (let i = 0; i < n; i++) {
    // Initial pointer position is random, but the OUTCOME is determined by it (Bohmian determinism).
    // Sample uniformly in [-sigY, sigY]; positive y0 → T branch, negative → R branch.
    const y0 = sigY * (Math.random() * 2 - 1);
    const pts = computeTraj(k0, V0, lam, sigX, sigY, y0);
    // isTransmit read from final trajectory point — physics, not a coin flip
    const isTransmit = pts[pts.length - 1].y > 0;
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
  uniform float uSepA;      // y-intercept of branch separator (= yRFixed + lam*dtA)
  uniform float uSepSlope;  // slope (perpendicular bisector of T–R direction)
  void main() {
    float sep = uSepA + uSepSlope * vPos.x;
    float isT = step(sep, vPos.y);  // 1 if in T-branch half
    vec3 tCol = vec3(0.13, 0.93, 0.53);  // green — World T
    vec3 rCol = vec3(1.0,  0.47, 0.27);  // orange — World R
    vec3 color = mix(rCol, tCol, isT);
    float alpha = uSep * 0.13;
    gl_FragColor = vec4(color, alpha);
  }
`;

// ── Small React helpers ───────────────────────────────────────────────────────
const Tip = ({ text, children }) => {
  const [show, setShow] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "block" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && text && (
        <span style={{
          position:"absolute", bottom:"calc(100% + 6px)", left:"50%",
          transform:"translateX(-50%)", background:"rgba(8,20,55,0.97)",
          border:"1px solid rgba(80,140,255,0.4)", borderRadius:5,
          padding:"5px 9px", fontSize:11, color:"#b8d4ff",
          whiteSpace:"pre-wrap", maxWidth:220, lineHeight:1.5,
          zIndex:999, pointerEvents:"none",
          fontFamily:"'JetBrains Mono','Courier New',monospace",
          boxShadow:"0 4px 16px rgba(0,0,30,0.7)",
        }}>{text}</span>
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
const VIEW_LABEL = { cpn:"Copenhagen", pw:"Pilot-Wave", mw:"Many Worlds" };
const VIEW_COLOR = { cpn:"#ff9966",    pw:"#44ddff",   mw:"#cc88ff" };
const VIEW_DESC  = {
  cpn: {
    "2d": "A quantum particle hits a potential barrier — it tunnels through (T) or reflects (R). The 2D canvas shows the full configuration space: x = particle, y = measuring apparatus pointer. Global |Ψ(x,y)|² splits into two branches; at a random moment one is selected and the other collapses.",
    "1d": "A quantum particle hits a potential barrier — it tunnels through (T) or reflects (R). The textbook operator view: only the particle coordinate x is shown. Measurement is modelled by a projection operator P̂_T or P̂_R acting on |ψ(x)⟩ — no apparatus visible.",
  },
  pw:  "A quantum particle hits a potential barrier — it tunnels through (T) or reflects (R). Same global |Ψ(x,y)|² plus the Bohmian particle (X,Y) that rides one branch. Below: conditional wavefunction ψ_cond(x,Y(t)) and the two marginals.",
  mw:  "A quantum particle hits a potential barrier — it tunnels through (T) or reflects (R). Both branches persist — the universe splits. World 1: particle transmitted. World 2: particle reflected. Neither world 'knows about' the other.",
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
// ── Shared audio player ─────────────────────────────────────────────────────
function SharedAudioPlayer({ audioRef, playing, setPlaying, time, duration }) {
  const pct = duration > 0 ? time / duration : 0;
  const fmt = s => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2,'0')}`;
  };
  const seek = e => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <button onClick={() => {
          if (!audioRef.current) return;
          playing ? audioRef.current.pause() : audioRef.current.play();
        }} style={{
          width:28, height:28, borderRadius:"50%", border:"none", cursor:"pointer",
          background:"rgba(40,100,220,0.7)", color:"#fff", fontSize:13,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
        }}>{playing ? "⏸" : "▶"}</button>
        <div onClick={seek} style={{ flex:1, height:4, background:"rgba(255,255,255,0.12)",
          borderRadius:2, cursor:"pointer", position:"relative" }}>
          <div style={{ position:"absolute", left:0, top:0, height:"100%",
            width:`${pct*100}%`, background:"#5588ff", borderRadius:2,
            pointerEvents:"none" }} />
        </div>
        <span style={{ fontSize:10, color:"#7090b8", flexShrink:0, fontFamily:"monospace" }}>
          {fmt(time)}
        </span>
      </div>
    </div>
  );
}

const SimPanel = React.memo(({
  interp, setInterp,
  tTarget, setTTarget, tTargetRef,
  lam, setLam, lamRef,
  sigX, setSigX, sigXRef,
  speed, setSpeed, speedRef,
  showWave, setShowWave,
  showTraj, setShowTraj,
  showProj, setShowProj,
  running, setRunning,
  Tp, Rp,
  cpnMode, setCpnMode,
  stepMode, setStepMode,
  audioRef, audioPlaying, setAudioPlaying, audioTime, audioDuration,
  isMobile,
}) => {
  const vc  = VIEW_COLOR[interp];
  const p   = isMobile ? "8px 8px" : "10px 9px";
  const fs  = isMobile ? 10 : 12;

  return (
    <div style={{ display:"flex", flexDirection:"column",
      width:"100%",
      fontFamily:"'JetBrains Mono','Courier New',monospace", color:"#e8f2ff",
      overflowY:"auto" }}>

      <div style={{ display:"flex", flexDirection:"column", gap: isMobile ? 6 : 10, padding:p }}>

        {/* Interpretation switcher — full width */}
        <SL label="Interpretation" tip="Click to cycle: Copenhagen → Pilot-Wave">
          <button onClick={() => setInterp(VIEWS[(VIEWS.indexOf(interp)+1)%VIEWS.length])}
            style={{
              display:"block", width:"100%", padding:"7px 10px", marginBottom:5,
              background:`rgba(${interp==="cpn"?"200,80,40":"30,160,220"},0.18)`,
              border:`2px solid ${vc}`, borderRadius:6, color:vc,
              cursor:"pointer", fontSize:13,
              fontFamily:"'JetBrains Mono','Courier New',monospace",
              fontWeight:700, textAlign:"center",
            }}>{">"} {VIEW_LABEL[interp]}</button>
          <div style={{ fontSize:11, color:"#99b8e8", lineHeight:1.6 }}>{interp === "cpn" ? VIEW_DESC.cpn[cpnMode] : VIEW_DESC[interp]}</div>
          {interp === "cpn" && (
          <div style={{ display:"flex", gap:4, marginTop:6 }}>
            {["2d","1d"].map(v => {
              const active = cpnMode === v;
              return (
                <button key={v} onClick={() => setCpnMode(v)} style={{
                  flex:1, padding:"4px 0", borderRadius:4, cursor:"pointer",
                  fontFamily:"'JetBrains Mono','Courier New',monospace", fontSize:11,
                  fontWeight: active ? 700 : 400,
                  background: active ? "rgba(200,80,40,0.25)" : "rgba(200,80,40,0.07)",
                  color: active ? "#ff9966" : "rgba(180,140,120,0.6)",
                  border:`1px solid ${active ? "#ff9966" : "rgba(150,80,40,0.3)"}`,
                }}>{v === "2d" ? "+ Apparatus" : "Operator"}</button>
              );
            })}
          </div>
          )}
        </SL>

        <SL label={`Transmission  ${Math.round(tTarget*100)}%`}
          tip={"Fraction of the wave that passes through the barrier.\n0% = total reflection,  100% = total transmission.\n(Sets the barrier height internally.)"}>
          <input type="range" min={0} max={100} step={1}
            defaultValue={Math.round(tTarget*100)}
            ref={tTargetRef}
            onInput={e => setTTarget(+e.target.value / 100)}
            style={{ width:"100%", accentColor:"#5090f0" }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#506080" }}>
            <span style={{color:"#ff7744"}}>← all reflected</span>
            <span style={{color:"#44ee88"}}>all transmitted →</span>
          </div>
        </SL>

        <SL label={`Coupling  ${Math.round(lam/3*100)}%`}
          tip={"How far the pointer deflects after the interaction.\n0 = pointer does not move (no measurement).\nHigh = pointer clearly separates the two branches."}>
          <input type="range" min={0} max={3} step={0.05} defaultValue={lam}
            ref={lamRef} onInput={e => setLam(+e.target.value)}
            style={{ width:"100%", accentColor:"#44ffaa" }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#506080" }}>
            <span>off</span><span>strong</span></div>
        </SL>

        <SL label={`σ = ${sigX.toFixed(2)}`}
          tip={"Gaussian wavepacket width\n(same for particle and initial pointer)"}>
          <input type="range" min={0.2} max={2.0} step={0.05} defaultValue={sigX}
            ref={sigXRef} onInput={e => setSigX(+e.target.value)}
            style={{ width:"100%", accentColor:"#cc88ff" }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#506080" }}>
            <span>narrow</span><span>wide</span></div>
        </SL>

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

        <SL label="Toggles">
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {[
              { key:"wave", label:"Wave",  on:showWave, fn:setShowWave, tip:"Show/hide 2D |Ψ|² heatmap" },
              interp==="pw" && { key:"traj", label:"Paths",  on:showTraj, fn:setShowTraj, tip:"Show/hide Bohmian trajectories" },
              interp==="pw" && { key:"proj", label:"Proj",  on:showProj, fn:setShowProj, tip:"Also overlay global projections ρ(x), ρ(y) on the CWF panels" },
            ].filter(Boolean).map(({ key, label, on, fn, tip }) => (
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

        {!isMobile && <div style={{ fontSize:10, color:"#506080",
          borderTop:"1px solid rgba(50,80,180,0.15)", paddingTop:8 }}>
          Drag: pan
        </div>}

        <div style={{ borderTop:"1px solid rgba(50,80,180,0.15)", paddingTop:8 }}>
          <div style={{ fontSize:10, color:"#44bbff", marginBottom:6 }}>▶ Narration</div>
          <SharedAudioPlayer audioRef={audioRef} playing={audioPlaying}
            setPlaying={setAudioPlaying} time={audioTime} duration={audioDuration} />
        </div>
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
function drawXMarg(canvas, { Tp, Rp, xIn, xT, xR, sigX, bl, colBranch, colFade, bX, bY, yT, yR, sigY, isPW, interp, cpnMode, colElapsedMs, stepMode, colPhase, sepFrac, showProj, xLo, xHi, rho, rhoXs, V0 }) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  // Sync intrinsic size to CSS rendered size so fonts/coords are in real screen pixels
  if (canvas.clientWidth > 0)  canvas.width  = canvas.clientWidth;
  if (canvas.clientHeight > 0) canvas.height = canvas.clientHeight;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const isMW  = interp === "mw";
  const is1D  = interp === "cpn" && cpnMode === "1d";
  const XLO = xLo, XHI = xHi;
  const wx = x => (x - XLO) / (XHI - XLO) * W;

  const fadeT = colBranch === -1 ? colFade : 0;
  const fadeR = colBranch ===  1 ? colFade : 0;
  // In 1D mode collapse is instantaneous — as soon as colBranch is set, kill the branch
  const ampT = is1D ? (colBranch === -1 ? 0 : Tp) : Tp * (1 - fadeT);
  const ampR = is1D ? (colBranch ===  1 ? 0 : Rp) : Rp * (1 - fadeR);

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

  if (isMW && bl > 0.05) {
    // ── Many-Worlds: split panel into two worlds, one per half ───────────────
    const mid = Math.round(H / 2);
    const sf  = Math.min(sepFrac * 1.5, 1);

    // Background tints — fade in with sepFrac
    ctx.fillStyle = `rgba(34,238,136,${0.07 * sf})`;  ctx.fillRect(0,   0,   W, mid);
    ctx.fillStyle = `rgba(255,119,68,${0.07 * sf})`;  ctx.fillRect(0,   mid, W, H - mid);
    // Separator line
    ctx.strokeStyle = `rgba(200,170,255,${0.5 * sf})`;
    ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();
    ctx.setLineDash([]);
    // Axis & barrier lines
    ctx.strokeStyle = "rgba(60,100,200,0.25)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, mid - 1); ctx.lineTo(W, mid - 1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, H    - 2); ctx.lineTo(W, H    - 2); ctx.stroke();
    ctx.strokeStyle = "rgba(0,200,255,0.2)"; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(wx(0),0); ctx.lineTo(wx(0),H); ctx.stroke();
    ctx.setLineDash([]);
    // World T (top half): ρ_T in green
    if (ampT > 0.001) drawDensityInRegion(rhoT, "#22ee88", 0.75*(mid-6)/Math.max(peakDensity(rhoT),1e-10), 0, mid);
    // World R (bottom half): ρ_R in orange
    if (ampR > 0.001) drawDensityInRegion(rhoR, "#ff7744", 0.75*(H-mid-6)/Math.max(peakDensity(rhoR),1e-10), mid, H-mid);
    // Labels
    const fs = Math.max(7, Math.round(H * 0.12));
    const lbY = Math.round(H * 0.09);
    ctx.font = `bold ${fs}px 'JetBrains Mono',monospace`;
    ctx.fillStyle = `rgba(34,238,136,${0.85 * sf})`; ctx.fillText("World 1  (transmitted)", 6, lbY);
    ctx.fillStyle = `rgba(255,119,68,${0.85 * sf})`; ctx.fillText("World 2  (reflected)",   6, mid + lbY);
  } else if (is1D) {
    // ── Copenhagen 1D / Textbook: three-act narrative ──────────────────────
    ctx.fillStyle = "#020812"; ctx.fillRect(0, 0, W, H);

    // Top label band (equation area) vs plot area below it
    const labelH = Math.round(H * 0.20);
    const plotH  = H - labelH;

    // Separator between equation band and plot
    ctx.strokeStyle = "rgba(40,60,140,0.5)"; ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath(); ctx.moveTo(0, labelH); ctx.lineTo(W, labelH); ctx.stroke();
    ctx.setLineDash([]);
    // x-axis
    ctx.strokeStyle = "rgba(60,100,200,0.25)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 2); ctx.lineTo(W, H - 2); ctx.stroke();
    // Barrier: filled rectangle spanning [-BARRIER_A, +BARRIER_A], height ∝ V0
    {
      const bLo = wx(-BARRIER_A), bHi = wx(BARRIER_A);
      const bW = Math.max(bHi - bLo, 2);
      // Scale barrier height to ~40% of plot area at max V0 (~50)
      const barrierPx = Math.round(plotH * 0.40 * Math.min((V0 || 0) / 50, 1));
      ctx.fillStyle = "rgba(0,200,255,0.10)";
      ctx.fillRect(bLo, H - 2 - barrierPx, bW, barrierPx);
      ctx.strokeStyle = "rgba(0,200,255,0.35)"; ctx.lineWidth = 1.5;
      ctx.strokeRect(bLo, H - 2 - barrierPx, bW, barrierPx);
      // Label
      ctx.font = "11px 'JetBrains Mono',monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.fillStyle = "rgba(0,200,255,0.50)";
      ctx.fillText("V₀", bLo + bW / 2, H - 4 - barrierPx);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }
    // Barrier dashed centre line
    ctx.strokeStyle = "rgba(0,200,255,0.18)"; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(wx(0), labelH); ctx.lineTo(wx(0), H); ctx.stroke();
    ctx.setLineDash([]);

    const SCMAX = plotH * 0.82 * 0.80;
    const drawIn1D = (fn, color, sc) => drawDensityInRegion(fn, color, sc, labelH, plotH);
    const collapsed = colBranch !== 0;

    if (!collapsed) {
      // Normalize all curves to the same peak (rhoTotal peak)
      const pkTotal = Math.max(peakDensity(rhoTotal), 1e-10);
      const sc = SCMAX / pkTotal;

      // Incoming packet (blue) fades out as bl→1
      if (bl < 0.99) drawIn1D(x => (1 - bl) * gIn(x), "#88aaff", sc);
      // T branch (green) and R branch (orange) fade in
      if (bl > 0.02 && ampT > 0.001) drawIn1D(rhoT, "#22ee88", sc);
      if (bl > 0.02 && ampR > 0.001) drawIn1D(rhoR, "#ff7744", sc);

      // ── Equation in label band ────────────────────────────────────────────
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const eqFS = Math.min(27, Math.max(18, Math.round(H * 0.043 * 1.5)));
      ctx.font = `bold ${eqFS}px 'JetBrains Mono',monospace`;
      const eqY = labelH / 2;

      if (bl < 0.12) {
        // Act 1: ket + setup subtitle
        ctx.fillStyle = "rgba(136,170,255,0.85)";
        ctx.fillText("|ψ_in⟩", W / 2, eqY * 0.55);
        const subFS2 = Math.round(eqFS * 0.55);
        ctx.font = `${subFS2}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = "rgba(120,150,210,0.55)";
        ctx.fillText("quantum particle approaching potential barrier V\u2080", W / 2, eqY * 1.45);
        ctx.font = `bold ${eqFS}px 'JetBrains Mono',monospace`;
      } else {
        // Act 2: superposition, fade in
        const alpha = Math.min(1, (bl - 0.12) / 0.25);
        const aT = Math.sqrt(Tp).toFixed(2), aR = Math.sqrt(Rp).toFixed(2);
        ctx.fillStyle = `rgba(210,225,255,${0.9 * alpha})`;
        ctx.fillText(`|ψ⟩  =  ${aT} |ψ_T⟩  +  ${aR} |ψ_R⟩`, W / 2, eqY);
      }
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      // ── Lobe labels positioned above each peak ────────────────────────────
      if (bl > 0.18) {
        const alpha = Math.min(1, (bl - 0.18) / 0.35);
        const lblFS = Math.min(26, Math.max(20, Math.round(H * 0.030 * 2.0)));
        ctx.font = `${lblFS}px 'JetBrains Mono',monospace`;
        ctx.textAlign = "center";
        const base = labelH + plotH - 3; // bottom of plot area

        if (ampT > 0.001) {
          const pyT = base - rhoT(xT) * sc;
          const lxT = clamp(wx(xT), 44, W - 44);
          const lyT = Math.max(pyT - 10, labelH + lblFS + 4);
          ctx.fillStyle = `rgba(34,238,136,${alpha})`;
          ctx.fillText(`√T |ψ_T⟩`, lxT, lyT);
        }
        if (ampR > 0.001) {
          const pyR = base - rhoR(xR) * sc;
          const lxR = clamp(wx(xR), 44, W - 44);
          const lyR = Math.max(pyR - 10, labelH + lblFS + 4);
          ctx.fillStyle = `rgba(255,119,68,${alpha})`;
          ctx.fillText(`√R |ψ_R⟩`, lxR, lyR);
        }
        ctx.textAlign = "left";
      }

    } else {
      // ── Act 3: three-phase measurement narrative ──────────────────────────
      // Phase 0: M̂ shown on top of both lobes
      // Phase 1: collapse — dying lobe fades, survivor stays
      // Phase 2: result — survivor at full height + label
      const isT = colBranch === 1;
      const col      = isT ? "#22ee88" : "#ff7744";
      const colDying = isT ? "#ff7744" : "#22ee88";
      const survivorFn = isT ? (x => bl * Tp * gT(x)) : (x => bl * Rp * gR(x));
      const dyingFn    = isT ? (x => bl * Rp * gR(x)) : (x => bl * Tp * gT(x));
      const xSurv = isT ? xT : xR;
      const pkBoth = Math.max(peakDensity(rhoTotal), 1e-10);
      const scBoth = SCMAX / pkBoth;

      const eqFS  = Math.min(30, Math.max(19, Math.round(H * 0.048 * 1.5)));
      const subFS = Math.round(eqFS * 0.72);
      const sub2FS = Math.round(eqFS * 0.55);
      const pct = Math.round((isT ? Tp : Rp) * 100);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";

      // Resolve which phase to display
      const phase = stepMode
        ? colPhase
        : colElapsedMs < 1200 ? 0 : colElapsedMs < 2600 ? 1 : 2;

      // In phase B (auto mode), compute local fade from elapsed time; step mode snaps to mid-fade=0
      const localFade = stepMode ? 0 : Math.min((colElapsedMs - 1200) / 1400, 1);

      if (phase === 0) {
        // ── Phase 0: show M̂ operator — both lobes visible ─────────────────
        drawIn1D(x => bl * Tp * gT(x), "#22ee88", scBoth);
        drawIn1D(x => bl * Rp * gR(x), "#ff7744", scBoth);
        // Lobe labels
        const lbFS = Math.min(26, Math.max(20, Math.round(H * 0.060)));
        ctx.font = `${lbFS}px 'JetBrains Mono',monospace`;
        if (Tp > 0.001) { ctx.fillStyle = "rgba(34,238,136,0.85)"; ctx.fillText("√T |ψ_T⟩", clamp(wx(xT), 60, W-60), labelH + 20); }
        if (Rp > 0.001) { ctx.fillStyle = "rgba(255,119,68,0.85)";  ctx.fillText("√R |ψ_R⟩", clamp(wx(xR), 60, W-60), labelH + 20); }
        // Operator equation in label band
        ctx.font = `bold ${eqFS}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = "rgba(210,230,255,0.92)";
        ctx.fillText("M̂  =  (+1) Π̂_T  +  (−1) Π̂_R", W / 2, labelH * 0.32);
        ctx.font = `${subFS}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = "rgba(150,180,230,0.65)";
        ctx.fillText("Π̂_T = ∫₀^∞|x⟩⟨x|dx     Π̂_R = ∫₋∞^0|x⟩⟨x|dx", W / 2, labelH * 0.62);
        ctx.font = `${sub2FS}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = "rgba(120,150,200,0.50)";
        ctx.fillText("eigenvalue +1 → transmitted   −1 → reflected", W / 2, labelH * 0.87);
        // Step mode: click-to-advance hint at bottom-right
        if (stepMode) {
          ctx.font = `${sub2FS}px 'JetBrains Mono',monospace`;
          ctx.fillStyle = "rgba(100,180,255,0.55)";
          ctx.textAlign = "right";
          ctx.fillText("click to apply M̂  →", W - 10, H - 8);
        }

      } else if (phase === 1) {
        // ── Phase 1: collapse — dying lobe fades out ───────────────────────
        const dyingAlpha = stepMode ? 0.35 : (1 - localFade);  // step: freeze at 35% so user sees both
        if (dyingAlpha > 0.02) drawIn1D(x => dyingFn(x) * dyingAlpha, colDying, scBoth);
        drawIn1D(survivorFn, col, scBoth);
        // Label band: projection being applied
        ctx.font = `bold ${eqFS}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = `${col}ee`;
        ctx.fillText(
          isT ? "Π̂_T |ψ⟩  /  ‖Π̂_T|ψ⟩‖" : "Π̂_R |ψ⟩  /  ‖Π̂_R|ψ⟩‖",
          W / 2, labelH * 0.30
        );
        ctx.font = `${subFS}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = `${col}88`;
        ctx.fillText(
          isT ? "projecting onto transmitted subspace…" : "projecting onto reflected subspace…",
          W / 2, labelH * 0.62
        );
        ctx.font = `${sub2FS}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = "rgba(180,140,60,0.55)";
        ctx.fillText(`outcome: M̂|ψ⟩ = ${isT ? "+1" : "−1"} (prob = ${pct}%)`, W / 2, labelH * 0.87);
        if (stepMode) {
          ctx.font = `${sub2FS}px 'JetBrains Mono',monospace`;
          ctx.fillStyle = "rgba(100,180,255,0.55)";
          ctx.textAlign = "right";
          ctx.fillText("click to see collapsed state  →", W - 10, H - 8);
        }

      } else {
        // ── Phase 2: result — survivor at full height + label ──────────────
        const pkS = Math.max(peakDensity(survivorFn), 1e-10);
        drawIn1D(survivorFn, col, SCMAX / pkS);
        // Label band
        ctx.font = `bold ${eqFS}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = `${col}ee`;
        ctx.fillText(isT ? "Π̂_T |ψ⟩  →  |ψ_T⟩" : "Π̂_R |ψ⟩  →  |ψ_R⟩", W / 2, labelH * 0.30);
        ctx.font = `${subFS}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = `${col}aa`;
        ctx.fillText(
          isT ? "Π̂_T = projector onto transmitted state" : "Π̂_R = projector onto reflected state",
          W / 2, labelH * 0.60
        );
        ctx.font = `${sub2FS}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = `${col}66`;
        ctx.fillText(`outcome probability = ${pct}%`, W / 2, labelH * 0.85);
        // Lobe label
        const lxS = clamp(wx(xSurv), 44, W - 44);
        const base = labelH + plotH - 3;
        const peakY = base - survivorFn(xSurv) * (SCMAX / pkS);
        const lblFS = Math.min(26, Math.max(20, Math.round(H * 0.060)));
        ctx.font = `${lblFS}px 'JetBrains Mono',monospace`;
        ctx.fillStyle = `${col}cc`;
        ctx.fillText(isT ? "|ψ_T⟩" : "|ψ_R⟩", lxS, Math.max(peakY - 10, labelH + lblFS + 4));
      }
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
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
      const chiT = gauss(bY, yT, sigY), chiR = gauss(bY, yR, sigY);
      const maxChi = Math.max(chiT, chiR, 1e-8);
      const mainFn = x => (1 - bl) * gIn(x) + bl * (
        Tp*(1-fadeT) * gT(x) * (chiT/maxChi) +
        Rp*(1-fadeR) * gR(x) * (chiR/maxChi)
      );
      drawDensity(mainFn, "#66ccff", SCALE / peakDensity(mainFn));
      if (showProj) {
        if (ampT > 0.001) drawDensity(rhoT, "#22ee88", SCALE / peakDensity(rhoT));
        if (ampR > 0.001) drawDensity(rhoR, "#ff7744", SCALE / peakDensity(rhoR));
      }
    } else {
      drawDensity(rhoTotal, "#88aaff", SCALE / peakDensity(rhoTotal));
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

  if (!isMW && !is1D) {
    const fs = Math.max(9, Math.round(H * 0.16));
    const labelY = Math.round(H * 0.22);
    ctx.font = `${fs}px 'JetBrains Mono', monospace`;
    if (isPW) {
      ctx.fillStyle = "#66ccff"; ctx.fillText("Ψ(x,Y(t)) conditional", 6, labelY);
      if (showProj) {
        ctx.fillStyle = "#22ee88"; ctx.fillText("ρ_T(x)", Math.round(W * 0.22), labelY);
        ctx.fillStyle = "#ff7744"; ctx.fillText("ρ_R(x)", Math.round(W * 0.29), labelY);
      }
    } else {
      ctx.fillStyle = "rgba(100,160,255,0.5)";
      ctx.fillText("particle projection  ρ(x) = ∫|Ψ|²dy", 6, labelY);
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
function drawYMarg(canvas, { Tp, Rp, yT, yR, yRFixed, sigY, bl, colBranch, colFade, bY, bX, xT, xR, sigX, isPW, interp, sepFrac, showProj, yLo, yHi }) {
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

    drawDensityY(y => (1 - bl) * 0.5 * gauss(y, yRFixed, sigY), "#88aaff");
    if (isMW && bl > 0.05) {
      // ── Many-Worlds: split Y-panel with vertical line at W/2
      // Bars extend rightward, so left half = World T, right half = World R
      const sf    = Math.min(sepFrac * 1.5, 1);
      const pxMid = W / 2;
      // Tinted backgrounds
      ctx.fillStyle = `rgba(34,238,136,${0.07 * sf})`;  ctx.fillRect(0,      0, pxMid,      H);
      ctx.fillStyle = `rgba(255,119,68,${0.07 * sf})`;  ctx.fillRect(pxMid,  0, W - pxMid,  H);
      // Separator line (vertical) at W/2
      ctx.strokeStyle = `rgba(200,170,255,${0.5 * sf})`;
      ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(pxMid, 0); ctx.lineTo(pxMid, H); ctx.stroke();
      ctx.setLineDash([]);
      // World T density clipped to left half
      if (ampT > 0.001) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, pxMid, H); ctx.clip();
        drawDensityY(y => bl * ampT * gauss(y, yT, sigY), "#22ee88", 4, (pxMid - 6) * 0.88);
        ctx.restore();
      }
      // World R density clipped to right half
      if (ampR > 0.001) {
        ctx.save(); ctx.beginPath(); ctx.rect(pxMid, 0, W - pxMid, H); ctx.clip();
        drawDensityY(y => bl * ampR * gauss(y, yRDisplay, sigY), "#ff7744", pxMid + 2, (W - pxMid - 6) * 0.88);
        ctx.restore();
      }
    } else if (isPW && bl > 0.05) {
      // Conditional wavefunction: ψ_cond(y) ∝ Ψ(X(t), y)
      // x-amplitude split by barrier: T on right, R on left using analytical Gaussians
      const gXatBX_T = gauss(bX, xT, sigX);
      const gXatBX_R = gauss(bX, xR, sigX);
      const maxGX = Math.max(gXatBX_T, gXatBX_R, 1e-8);
      drawDensityY(y => bl * (
        Tp*(1-fadeT) * gXatBX_T/maxGX * gauss(y,yT,sigY) +
        Rp*(1-fadeR) * gXatBX_R/maxGX * gauss(y,yRDisplay,sigY)
      ), "#66ccff");
      if (showProj) {
        if (ampT > 0.001) drawDensityY(y => bl * ampT * gauss(y, yT,       sigY), "#22ee88");
        if (ampR > 0.001) drawDensityY(y => bl * ampR * gauss(y, yRDisplay, sigY), "#ff7744");
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

    // Label (rotated)
    ctx.save();
    ctx.translate(W - 4, H / 2);
    ctx.rotate(-Math.PI / 2);
    const fsY = Math.max(9, Math.round(W * 0.16));
    ctx.font = `${fsY}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "rgba(100,160,255,0.5)";
    ctx.textAlign = "center";
    const yLabel = isMW ? "pointer projection — two worlds" :
                   isPW ? "ψ_cond(y|X(t))" : "pointer projection  ρ(y) = ∫|Ψ|²dx";
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
      {eq("Ψ₀(x,y) = ψ₀(x) · χ₀(y)\n\nψ₀(x) = exp[-(x-x₀)²/4σ²] · exp[ik₀x]\nχ₀(y) = exp[-y²/4σ²]")}

      {sec("After barrier scattering")}
      {txt("The barrier splits the particle into transmitted (T) and reflected (R) branches.\nEach branch couples to the pointer via H_int = λ (Π_T - Π_R) P_y:")}
      {eq("Ψ(x,y,t) = √T · ψ_T(x,t) · χ_T(y,t)\n         + √R · ψ_R(x,t) · χ_R(y,t)\n\nψ_T:  centre → +v₀t   (transmitted)\nψ_R:  centre → -v₀t   (reflected)\nχ_T:  centre → +λt    (pointer shifts up)\nχ_R:  centre → -λt    (pointer shifts down)")}

      {sec("Probabilities")}
      {txt("Exact rectangular-barrier transmission (ℏ = m = 1, barrier width a):")}
      {eq("T = 1 / [1 + V₀² sinh²(κa) / (4E(V₀-E))]   (E < V₀)\nT = 1 / [1 + V₀² sin²(κa)  / (4E(E-V₀))]   (E > V₀)\n\nE = k₀²/2,   κ = √(2|V₀-E|)")}

      {sec("Marginal densities")}
      {txt("The x-projection (below) and y-projection (right strip, when apparatus is visible):")}
      {eq("ρ(x,t) = ∫|Ψ(x,y,t)|²dy  ≈  T·|ψ_T(x)|² + R·|ψ_R(x)|²\n\nρ(y,t) = ∫|Ψ(x,y,t)|²dx  ≈  T·|χ_T(y)|² + R·|χ_R(y)|²")}

      {interp === "cpn" && (<>
        {sec("Copenhagen — collapse (+ Apparatus view)")}
        {txt("The 2D canvas shows the full configuration space (x = particle, y = pointer). At a random time after scattering, the global wavefunction collapses to one branch with Born-rule probability:")}
        {eq("Ψ(x,y,t*)  →  ψ_T · χ_T   with prob T\n            →  ψ_R · χ_R   with prob R = 1 - T")}
        {txt("The mechanism of collapse is not specified by the theory.")}
        {sec("Copenhagen — operator picture (Operator view)")}
        {txt("The measurement observable is the detector that distinguishes 'transmitted' from 'reflected'. It is a hermitian operator with two eigenspaces:")}
        {eq("M̂ = (+1) Π̂_T  +  (−1) Π̂_R\n\nΠ̂_T = ∫₀^∞ |x⟩⟨x| dx   (projector onto x > 0)\nΠ̂_R = ∫₋∞^0 |x⟩⟨x| dx   (projector onto x < 0)\n\neigenvalue +1  →  particle found transmitted\neigenvalue −1  →  particle found reflected\n\n⟨M̂⟩ = T − R")}
        {txt("After scattering the particle state is |ψ⟩ = √T |ψ_T⟩ + √R |ψ_R⟩. Applying the measurement postulate:")}
        {eq("|ψ⟩  →  Π̂_T|ψ⟩ / ‖Π̂_T|ψ⟩‖  =  |ψ_T⟩   with prob ⟨ψ|Π̂_T|ψ⟩ = T\n     →  Π̂_R|ψ⟩ / ‖Π̂_R|ψ⟩‖  =  |ψ_R⟩   with prob ⟨ψ|Π̂_R|ψ⟩ = R")}
        {txt("The post-measurement state is the projected (and renormalised) branch. The apparatus is invisible in this picture — measurement is an instantaneous, axiomatic operation on the 1D state.")}
        {txt("Tracing out the apparatus degree of freedom y gives the pre-measurement mixed state:")}
        {eq("ρ̂_particle = T |ψ_T⟩⟨ψ_T| + R |ψ_R⟩⟨ψ_R|")}
      </>)}

      {interp === "mw" && (<>
        {sec("Many Worlds — no collapse")}
        {txt("The wavefunction evolves unitarily forever. After scattering, the global state is:")}
        {eq("Ψ(x,y,t) = √T · ψ_T(x,t) · χ_T(y,t)\n         + √R · ψ_R(x,t) · χ_R(y,t)")}
        {txt("Both branches are equally real. There is no collapse and no preferred outcome. The universe 'splits' into two non-interacting worlds:")}
        {eq("World 1:  ψ_T · χ_T   (particle transmitted, pointer up)\nWorld 2:  ψ_R · χ_R   (particle reflected, pointer down)")}
        {txt("The diagonal dividing line in the simulation marks where the two branches separate in configuration space. Each half of the 2D canvas belongs to a different world.")}
        {txt("The x- and y-projection panels are each split in two: the top/green half shows World 1 (transmitted), the bottom/orange half shows World 2 (reflected).")}
        {txt("Probabilities emerge from the Born rule applied to the branch amplitudes — but in MW this is a derived (and debated) result, not a postulate.")}
        {eq("P(World 1) = ‖√T ψ_T χ_T‖² = T\nP(World 2) = ‖√R ψ_R χ_R‖² = R")}
      </>)}

      {interp === "pw" && (<>
        {sec("Pilot-wave — guidance equation")}
        {txt("The particle has a definite position (X,Y) at all times, guided by:")}
        {eq("dX/dt = ℏ/m · Im[Ψ* ∂_x Ψ] / |Ψ|²  |_(X,Y)\ndY/dt = ℏ/m · Im[Ψ* ∂_y Ψ] / |Ψ|²  |_(X,Y)")}
        {txt("For the two-branch state with non-overlapping lobes, whichever branch contains (X,Y) acts as the effective wavefunction — the other branch is 'empty'.")}
        {eq("ψ_cond(x,t) = Ψ(x, Y(t), t)  [conditional wavefunction]")}
      </>)}

      {sec("Animation")}
      {txt("Units: ℏ = m = 1. Velocity v₀ = k₀. The simulation rescales physical time to fit the canvas. The barrier occupies |x| < 0.5.")}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const mountRef  = useRef(null);
  const tTargetRef = useRef(null), lamRef = useRef(null);
  const sigXRef = useRef(null), speedRef = useRef(null);
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
    interp:"cpn", cpnMode:"2d",
    k0:4.0, V0:invertT(0.5,4.0), tTarget:0.5, lam:1.5, sigX:0.5, sigY:0.3,
    speed:0.5,
    showWave:true, showTraj:true, showProj:false, running:true,
    tick:0, dirty:true,
    pauseUntil:0,  // wall-clock ms to hold before restarting cycle
    camX:0, camY:0, camZ:14,
    drag:null,
    // Copenhagen collapse state
    colBranch:0, colFade:0, colTriggered:false,
    colPhase:0,          // manual step phase (0/1/2) used when stepMode=true
    stepMode:false,      // manual click-through vs auto-timed Act 3
    // Projection panel state
    marg: { Tp:0.5, Rp:0.5, xIn:X0, xT:0, xR:0, yT:0, yR:0,
            sigX:0.5, sigY:0.3, bl:0, colBranch:0, colFade:0, bX:0, bY:0 },
  });

  const [interp,    setInterpUI]    = useState("cpn");
  const [tTarget,   setTTargetUI]   = useState(0.5);
  const [lam,       setLamUI]       = useState(1.5);
  const [sigX,     setSigXUI]     = useState(0.5);
  const [speed,    setSpeedUI]    = useState(0.5);
  const [showWave, setShowWaveUI] = useState(true);
  const [showTraj, setShowTrajUI] = useState(true);
  const [showProj, setShowProjUI] = useState(false);
  const [running,  setRunningUI]  = useState(true);
  const [Tp,       setTpUI]       = useState(0.5);
  const [Rp,       setRpUI]       = useState(0.5);
  // Collapse flash: branch = ±1 while flashing, 0 when idle
  const [flashBranch, setFlashBranch] = useState(0);
  const [flashAlpha,  setFlashAlpha]  = useState(0);
  const flashRaf = useRef(null);
  // Copenhagen sub-mode: "2d" = full configuration space (default), "1d" = textbook operator picture
  const [cpnMode, setCpnModeUI] = useState("2d");
  const setCpnMode = v => { S.current.cpnMode = v; setCpnModeUI(v); };
  const [stepMode, setStepModeUI] = useState(false);
  const setStepMode = v => { S.current.stepMode = v; setStepModeUI(v); };

  const setInterp = v => {
    S.current.interp = v; setInterpUI(v);
    S.current.colBranch = 0; S.current.colFade = 0; S.current.colTriggered = false;
    if (v !== "cpn") { S.current.cpnMode = "2d"; setCpnModeUI("2d"); }
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
  const setLam = v => { S.current.lam = v; S.current.dirty=true; setLamUI(v); if(lamRef.current) lamRef.current.value=v; };
  const setSigX= v => { S.current.sigX=v; S.current.sigY=v*1.2; S.current.dirty=true; setSigXUI(v); if(sigXRef.current) sigXRef.current.value=v; };
  const setSpeed= v => { S.current.speed=v; setSpeedUI(v); if(speedRef.current) speedRef.current.value=v; };
  const setShowWave = v => { S.current.showWave=v; setShowWaveUI(v); };
  const setShowTraj = v => { S.current.showTraj=v; setShowTrajUI(v); };
  const setShowProj = v => { S.current.showProj=v; setShowProjUI(v); };
  const setRunning  = v => { S.current.running=v;  setRunningUI(v);  };


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
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(-0.5,-10,0),new THREE.Vector3(-0.5,10,0)]), bMat));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(0.5,-10,0),new THREE.Vector3(0.5,10,0)]), bMat));
    const bFill = new THREE.Mesh(new THREE.PlaneGeometry(1.0,20),
      new THREE.MeshBasicMaterial({ color:0x002244, transparent:true, opacity:0.15, side:THREE.DoubleSide }));
    scene.add(bFill);

    // ── Branch label sprites ──────────────────────────────────────────────────
    function makeSprite(text, color) {
      const cv = document.createElement("canvas");
      cv.width=300; cv.height=52;
      const ctx = cv.getContext("2d");
      ctx.font = "bold 16px 'JetBrains Mono',monospace";
      ctx.fillStyle = color; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(text, 150, 26);
      const tex = new THREE.CanvasTexture(cv);
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true, opacity:0.85 }));
      spr.scale.set(5.2, 0.9, 1); // aspect matches 300/52 * 0.9 ≈ 5.2
      return spr;
    }
    const lblT = makeSprite("T-branch  (x>0,  y>0)", "#44ee88");
    const lblR = makeSprite("R-branch  (x<0,  y<0)", "#ff8844");
    lblT.position.set(6.5, 5.5, 0.2); scene.add(lblT);
    lblR.position.set(-6.5,-5.5, 0.2); scene.add(lblR);

    // ── Many-Worlds overlay (diagonal tinted plane + separator line + world labels) ─
    const mwUni = {
      uSep:      { value: 0 },
      uSepA:     { value: 0 },
      uSepSlope: { value: -1 },
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
      new THREE.LineBasicMaterial({ color: 0xccaaff, transparent: true, opacity: 0 })
    );
    mwDivLine.visible = false;
    scene.add(mwDivLine);

    // World label sprites — "World 1 (transmitted)" / "World 2 (reflected)"
    const lblMW1 = makeSprite("World 1  (transmitted)", "#44ee88");
    const lblMW2 = makeSprite("World 2  (reflected)",   "#ff8844");
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
      // Re-compute spectral wavepacket whenever parameters change
      wpPrecompute(s.k0, s.V0, s.sigX);
      // Copenhagen has no trajectories
      if (s.interp === "cpn") {
        trajs = [];
        fLines.forEach(fl => fl.line.visible = false);
        fDots.forEach(d => d.visible = false);
        fGlows.forEach(g => g.visible = false);
        return;
      }
      trajs = computeMultiTraj(s.k0, s.V0, s.lam, s.sigX, s.sigY, 1);
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

    T.current = {
      scene, camera, renderer, heatUni, heatMesh,
      fLines, fDots, fGlows, lblT, lblR,
      mwOverlay, mwUni, mwDivLine, lblMW1, lblMW2,
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
            s.colTriggered = false; s.colBranch = 0; s.colFade = 0;
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
      const rendHidden = rendW === 0 || rendH === 0; // true in 1D mode (top row display:none)
      let halfW, halfH;
      if (!rendHidden) {
        const camAspect = rendW / rendH;
        const minCamZ = 7.0 / (camAspect * tan26); // camZ needed to show ±7 horizontal
        const effectiveCamZ = Math.max(s.camZ, minCamZ);
        if (effectiveCamZ > s.camZ) camera.position.z = effectiveCamZ;
        halfH = tan26 * effectiveCamZ;
        halfW = camAspect * halfH; // always ≥ 7.0 world units
        s._halfW = halfW; s._halfH = halfH; // cache for 1D mode
      } else {
        // Renderer hidden (1D mode) — use cached values or fall back to xPanel dimensions
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

      const Tprob  = clamp(exactT(s.k0, s.V0), 0, 1);
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
      // T blob starts at yRFixed and moves diagonally up; R stays at yRFixed.
      const yT       = yRFixed + 2 * s.lam * dtA, yR = yRFixed;
      const sepFrac  = clamp(dtA / 3.0, 0, 1);
      const tIdx     = clamp(Math.round(tFrac*STEPS), 0, STEPS);

      // ── Stop before lobes exit canvas, pause 1.5 s then restart ───────────
      // Stop when lobe centre is 1.5 world units from screen edge (adaptive to halfW).
      // Cap at 9.0 so zoomed-out views still stop at a reasonable time.
      const edgeX = Math.min(halfW - 1.5, 9.0);
      if (s.running && s.pauseUntil === 0 && s.interp !== "cpn" && xT > edgeX) {
        s.pauseUntil = performance.now() + 1500;
      }

      // ── Copenhagen: collapse logic ─────────────────────────────────────────
      // Trigger when the leading edge of the T-lobe reaches near the canvas edge.
      // Uses halfW so collapse always happens while blobs are still visible.
      if (s.interp === "cpn") {
        // Trigger when xT + 2σ reaches the adaptive canvas edge.
        if (!s.colTriggered && bl > 0.85 && xT + 2 * s.sigX >= Math.min(halfW - 0.5, 9.0)) {
          s.colTriggered = true;
          s.colBranch = Math.random() < Tprob ? 1 : -1;
          s.colFade   = 0;
          s.colStartMs = performance.now();
          s.colPhase = 0;
          s._flashPending = true;
          // Freeze here — lobe centre is still inside canvas
          // In 1D textbook mode, hold longer so the post-collapse state is readable
          // stepMode: no auto-advance, so pauseUntil is irrelevant but we set a long hold to prevent restart
          s.pauseUntil = performance.now() + (s.cpnMode === "1d" ? (s.stepMode ? 60000 : 4500) : 1800);
        }
        if (s.colTriggered) {
          s.colFade = Math.min(s.colFade + 0.08, 1);
        }
        // Reset is handled by the pause-restart cycle above
      } else {
        s.colBranch = 0; s.colFade = 0; s.colTriggered = false;
      }

      // ── Pilot-wave: trajectories + dots ───────────────────────────────────
      const td = Tr.trajs();
      // Pick first trajectory for the 1D conditional wavefunction
      let bX = 0, bY = 0;
      td.forEach(({ pts, isTransmit }, i) => {
        const fl = fLines[i];
        if (i >= 1 || s.interp !== "pw") {
          fl.line.visible = false; fDots[i].visible=false; fGlows[i].visible=false; return;
        }
        fl.line.visible = s.showTraj;
        if (s.showTraj) fl.geo.setDrawRange(0, tIdx+1);
        // Re-upload y-positions every frame with screen-space transform:
        // Y_screen = Y_raw + yRFixed + lam*dtA  (T climbs diag, R stays at bottom)
        if (fl.rawY && fl.dtAs) {
          for (let j = 0; j <= STEPS; j++) {
            fl.pos[j*3+1] = fl.rawY[j] + yRFixed + s.lam * fl.dtAs[j];
          }
          fl.geo.attributes.position.needsUpdate = true;
        }
        const pt = pts[tIdx];
        const ptYScreen = pt.y + yRFixed + s.lam * (fl.dtAs ? fl.dtAs[tIdx] : 0);
        if (i === 0) { bX = pt.x; bY = ptYScreen; }
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
      Tr.mwOverlay.visible = isMW;
      Tr.mwDivLine.visible = isMW && sepFrac > 0.05;
      Tr.lblMW1.visible    = isMW && sepFrac > 0.3;
      Tr.lblMW2.visible    = isMW && sepFrac > 0.3;
      if (isMW) {
        // Perpendicular bisector between T-branch (xT,yT) and R-branch (xR,yRFixed)
        // Midpoint: (0, yRFixed + lam*dtA); slope: -k0 / (2*lam)
        const sepA     = yRFixed + s.lam * dtA;
        const sepSlope = -s.k0 / (2 * s.lam);
        Tr.mwUni.uSep.value      = sepFrac;
        Tr.mwUni.uSepA.value     = sepA;
        Tr.mwUni.uSepSlope.value = sepSlope;
        // Update dividing line endpoints to span visible width
        Tr.mwDivLine.geometry.setFromPoints([
          new THREE.Vector3(-halfW, sepA + sepSlope * (-halfW), 0.1),
          new THREE.Vector3( halfW, sepA + sepSlope *   halfW,  0.1),
        ]);
        Tr.mwDivLine.material.opacity = Math.min(sepFrac * 1.5, 0.65);
        // World labels: track branch centres, clamped inside visible area
        const pad = 2.5;
        const lx1 = clamp(xT * 0.7, -(halfW-pad), halfW-pad);
        const ly1 = clamp(yT * 0.7 + yRFixed * 0.3, s.camY-halfH+1, s.camY+halfH-1);
        const lx2 = clamp(xR * 0.7, -(halfW-pad), halfW-pad);
        const ly2 = clamp(yRFixed - halfH * 0.28, s.camY-halfH+1, s.camY+halfH-1);
        Tr.lblMW1.position.set(lx1, ly1, 0.2); Tr.lblMW1.scale.set(lblSX, lblSY, 1);
        Tr.lblMW2.position.set(lx2, ly2, 0.2); Tr.lblMW2.scale.set(lblSX, lblSY, 1);
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
        bX, bY,
        isPW: s.interp === "pw",
        interp: s.interp,
        cpnMode: s.cpnMode,
        colElapsedMs: s.colTriggered ? (performance.now() - (s.colStartMs || 0)) : 0,
        stepMode: s.stepMode,
        colPhase: s.colPhase,
        sepFrac,
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
  const audioRef = useRef(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioTime,    setAudioTime]    = useState(0);
  const [audioDuration,setAudioDuration]= useState(0);

  return (
    <div style={{ display:"flex", flexDirection: sidebarBelow ? "column" : "row",
      width:"100%", maxWidth:"100vw",
      minHeight: sidebarBelow ? "100dvh" : "100%",
      background:"#040a1c",
      overflowX:"hidden",
      overflowY: sidebarBelow ? "auto" : "hidden" }}>
      <audio ref={audioRef} src="measurement-expanation.mp3"
        onPlay={() => setAudioPlaying(true)}
        onPause={() => setAudioPlaying(false)}
        onEnded={() => setAudioPlaying(false)}
        onTimeUpdate={e => setAudioTime(e.target.currentTime)}
        onLoadedMetadata={e => setAudioDuration(e.target.duration)}
      />
      {/* Left: canvas area + tab strip */}
      <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column",
        position:"relative", overflow:"hidden",
        height: sidebarBelow ? undefined : "100%",
        // portrait: canvas ≈ min(winW,500) square, x-marg = 1/4 of that, + tab strip
        minHeight: sidebarBelow ? Math.min(winW, 500) * 1.25 + 28 : 0 }}>

        {/* Tab strip */}
        <div style={{ display:"flex", flexShrink:0, background:"rgba(4,10,30,0.9)",
          borderBottom:"1px solid rgba(40,80,180,0.35)", height:28 }}>
          {[["sim","Simulation"],["math","Math"],["about","About"]].map(([key,label]) => (
            <button key={key} onClick={() => setCanvasTab(key)} style={{
              padding:"0 16px", fontSize:11, cursor:"pointer", border:"none",
              fontFamily:"'JetBrains Mono','Courier New',monospace",
              textTransform:"uppercase", letterSpacing:"0.08em",
              background: canvasTab===key ? "rgba(40,80,200,0.3)" : "transparent",
              color: canvasTab===key ? "#88bbff" : "#4a6a9a",
              borderBottom: canvasTab===key ? "2px solid #5588ff" : "2px solid transparent",
            }}>{label}</button>
          ))}
        </div>

        {/* Simulation view */}
        <div style={{ display: canvasTab==="sim" ? "flex" : "none",
          flex:1, flexDirection:"column", overflow:"hidden" }}>

        {/* Top row: 2D heatmap + y-marginal side by side — flex:4 so x-marg gets flex:1 (1/4 of canvas) */}
        <div style={{ flex:4, minHeight:0, display: cpnMode === "1d" ? "none" : "flex", flexDirection:"row", overflow:"hidden" }}>
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
              color:"rgba(100,160,255,0.5)", fontSize: isMobile ? 9 : 11, pointerEvents:"none",
              fontFamily:"'JetBrains Mono','Courier New',monospace" }}>
              {isMobile ? "x — position →" : "x — particle position →"}
            </div>
            {!isMobile && (
            <div style={{ position:"absolute", left:12, top:"50%",
              transform:"translateY(-50%) rotate(-90deg)",
              color:"rgba(100,160,255,0.5)", fontSize:11, pointerEvents:"none",
              fontFamily:"'JetBrains Mono','Courier New',monospace" }}>
              y — pointer
            </div>
            )}
            <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)",
              color:"rgba(0,200,255,0.45)", fontSize:10, pointerEvents:"none",
              fontFamily:"'JetBrains Mono','Courier New',monospace" }}>
              barrier V₀
            </div>
            {/* Interpretation badge */}
            <div style={{ position:"absolute", top:10, right:12,
              color: VIEW_COLOR[interp], fontSize:12, fontWeight:700,
              fontFamily:"'JetBrains Mono','Courier New',monospace",
              background:"rgba(4,10,30,0.7)", padding:"3px 8px", borderRadius:4,
              border:`1px solid ${VIEW_COLOR[interp]}55` }}>
              {VIEW_LABEL[interp]}
            </div>

          </div>

          {/* Y-marginal: vertical strip — hidden on mobile */}
          {showYPanel && (
          <div style={{ width:yPanelW, flexShrink:0,
            borderLeft:"1px solid rgba(40,80,180,0.3)",
            background:"#020812" }}>
            <YMarginalPanel ref={yCanvasRef} />
          </div>
          )}
        </div>

        {/* X-marginal: horizontal strip — flex:1 so it is 1/4 the height of the canvas row above
            In 1D mode it fills the whole canvas area (top row hidden) so flex:5 */}
        <div ref={xMargRowRef} style={{ flex: cpnMode === "1d" ? 5 : 1, minHeight:0, display:"flex", flexDirection:"row",
          borderTop:"1px solid rgba(40,80,180,0.3)", position:"relative" }}>
          <div style={{ flex:1, background:"#020812", overflow:"hidden" }}
            onClick={() => {
              const s = S.current;
              if (s.cpnMode === "1d" && s.stepMode && s.colTriggered && s.colPhase < 2) {
                s.colPhase += 1;
                // Extend pause so manual mode never auto-restarts mid-phase
                s.pauseUntil = performance.now() + 60000;
              }
            }}
            style={{ cursor: (cpnMode === "1d" && stepMode && S.current.colTriggered && S.current.colPhase < 2) ? "pointer" : "default" }}>
            <XMarginalPanel ref={xCanvasRef} />
          </div>
          {/* spacer matching Y-panel width so X axis aligns with 2D canvas — desktop only */}
          {showYPanel && cpnMode !== "1d" && <div style={{ width:yPanelW, flexShrink:0, background:"#020812",
            borderLeft:"1px solid rgba(40,80,180,0.3)" }} />}
          {/* In 1D mode: show badge + toggle in top-right of the X-panel */}
          {cpnMode === "1d" && (
          <div style={{ position:"absolute", top:8, right:12, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
            <div style={{ color:"#ff9966", fontSize:12, fontWeight:700,
              fontFamily:"'JetBrains Mono','Courier New',monospace",
              background:"rgba(4,10,30,0.7)", padding:"3px 8px", borderRadius:4,
              border:"1px solid #ff996655" }}>Copenhagen</div>
            {/* Step / Auto toggle */}
            <button onClick={() => setStepMode(!stepMode)} title={stepMode ? "Switch to auto-timed mode" : "Switch to manual step mode"}
              style={{
                fontFamily:"'JetBrains Mono','Courier New',monospace",
                fontSize:11, padding:"3px 9px", borderRadius:4, cursor:"pointer",
                background: stepMode ? "rgba(80,180,255,0.18)" : "rgba(255,255,255,0.06)",
                color: stepMode ? "#88ddff" : "rgba(160,190,230,0.55)",
                border:`1px solid ${stepMode ? "#88ddff66" : "rgba(80,120,180,0.25)"}`,
                fontWeight: stepMode ? 700 : 400,
              }}>
              {stepMode ? "▶ Step" : "▶ Auto"}
            </button>
          </div>
          )}
        </div>


        </div>{/* simulation view */}

        {/* Math view */}
        {canvasTab === "math" && <MathPanel interp={interp} />}

        {/* About / narration view */}
        {canvasTab === "about" && (
          <div style={{ flex:1, overflowY:"auto", padding:"28px 36px",
            fontFamily:"Georgia,'Times New Roman',serif",
            background:"#040a1c", color:"#c8d8f0", lineHeight:1.9, fontSize:15 }}>
            <div style={{ marginBottom:28 }}>
              <SharedAudioPlayer audioRef={audioRef} playing={audioPlaying}
                setPlaying={setAudioPlaying} time={audioTime} duration={audioDuration} />
            </div>
            {[
              "What does it mean to measure a quantum particle?",
              "This simulation shows a quantum particle — say, an electron — approaching a potential barrier from the left. The horizontal axis is the particle's position. The vertical axis is the pointer of a measuring device — think of a needle that clicks left if the particle reflects, and right if it transmits.",
              "Before the particle hits the barrier, the two-dimensional wavefunction is a single blob moving diagonally. The particle and pointer are not yet entangled. They move together as one.",
              "At the barrier, the wavefunction splits into two branches. The transmitted branch moves to the upper right — particle goes through, pointer deflects up. The reflected branch moves to the lower left — particle bounces back, pointer deflects down. The projections on the sides confirm this: two distinct peaks emerge, one for each outcome.",
              "Now, what happens next depends on your interpretation of quantum mechanics.",
              "In the Copenhagen interpretation, measurement causes the wavefunction to collapse. One branch survives. The other vanishes. The outcome is random, with probabilities set by the Born rule. The pointer lands at a definite value. This is what we observe in the lab.",
              "In the Pilot-Wave interpretation — also called Bohmian mechanics — the wavefunction never collapses. Both branches continue to exist. But the particle itself follows a definite trajectory, guided by the wave. The white dot traces that trajectory. It enters one branch and stays there — guided deterministically by its initial position. The other branch becomes empty. It still exists mathematically, but it carries no particle and has no further effect. This is what Bohmian mechanics calls the empty wave.",
              "The side panels show the conditional wavefunction: a slice of the full two-dimensional wavefunction at the particle's actual position. Unlike the global projection, which always shows two peaks, the conditional wavefunction has a single peak — localised on the occupied branch. This is the effective wavefunction the particle actually rides.",
              "Both interpretations give the same experimental predictions. The difference is not about what we measure — it is about what we believe is really happening.",
              "The Copenhagen interpretation also offers two levels of description. In the Operator view, the apparatus is hidden and measurement is an abstract projection operator P̂_T or P̂_R acting instantaneously on the particle state. In the + Apparatus view, the apparatus is made explicit as the y coordinate — and you can watch the entanglement and collapse unfold.",
              "This simulation makes that difference visible.",
            ].map((para, i) => (
              <p key={i} style={{
                marginBottom:"1.2em",
                fontWeight: i === 0 ? 700 : 400,
                fontSize: i === 0 ? 18 : 15,
                color: i === 0 ? "#88ccff" : "#c8d8f0",
              }}>{para}</p>
            ))}
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
          sigX={sigX} setSigX={setSigX} sigXRef={sigXRef}
          speed={speed} setSpeed={setSpeed} speedRef={speedRef}
          showWave={showWave} setShowWave={setShowWave}
          showTraj={showTraj} setShowTraj={setShowTraj}
          showProj={showProj} setShowProj={setShowProj}
          running={running} setRunning={setRunning}
          Tp={Tp} Rp={Rp}
          audioRef={audioRef} audioPlaying={audioPlaying} setAudioPlaying={setAudioPlaying}
          audioTime={audioTime} audioDuration={audioDuration}
          cpnMode={cpnMode} setCpnMode={setCpnMode}
          stepMode={stepMode} setStepMode={setStepMode}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}

const container = document.getElementById("root");
if (container) createRoot(container).render(<App />);
