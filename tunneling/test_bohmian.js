// Standalone diagnostic for the spectral Bohmian mechanics T/R statistics.
// Mirrors physics in index.html exactly. Run with: node test_bohmian.js

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function analyticScatter(E, V0, L) {
  const k1 = Math.sqrt(2 * E);
  const tunneling = E < V0;
  let r_re, r_im, t_re, t_im, T, R;
  if (tunneling) {
    const kappa = Math.sqrt(2 * (V0 - E) + 1e-20);
    const c2k = Math.cosh(kappa * L), s2k = Math.sinh(kappa * L);
    const dRe = c2k, dIm = 0.5 * (kappa / k1 - k1 / kappa) * s2k;
    const dMod2 = dRe * dRe + dIm * dIm;
    const eRe = Math.cos(k1 * L), eIm = -Math.sin(k1 * L);
    t_re = (eRe * dRe + eIm * dIm) / dMod2;
    t_im = (eIm * dRe - eRe * dIm) / dMod2;
    T = t_re * t_re + t_im * t_im; R = 1 - T;
    const rFac_im = -0.5 * (kappa / k1 + k1 / kappa) * s2k;
    const rt_re = -rFac_im * t_im, rt_im = rFac_im * t_re;
    const eP_re = Math.cos(k1 * L), eP_im = Math.sin(k1 * L);
    r_re = rt_re * eP_re - rt_im * eP_im;
    r_im = rt_re * eP_im + rt_im * eP_re;
    return { k1, kappa, tunneling, T, R, r_re, r_im, t_re, t_im };
  } else {
    const k2 = Math.sqrt(2 * (E - V0) + 1e-20);
    const c2k = Math.cos(k2 * L), s2k = Math.sin(k2 * L);
    const dRe = c2k, dIm = -0.5 * (k2 / k1 + k1 / k2) * s2k;
    const dMod2 = dRe * dRe + dIm * dIm;
    const eRe = Math.cos(k1 * L), eIm = -Math.sin(k1 * L);
    t_re = (eRe * dRe + eIm * dIm) / dMod2;
    t_im = (eIm * dRe - eRe * dIm) / dMod2;
    T = t_re * t_re + t_im * t_im; R = 1 - T;
    const rFac_im = 0.5 * (k1 / k2 - k2 / k1) * s2k;
    const rt_re = -rFac_im * t_im, rt_im = rFac_im * t_re;
    const eP_re = Math.cos(k1 * L), eP_im = Math.sin(k1 * L);
    r_re = rt_re * eP_re - rt_im * eP_im;
    r_im = rt_re * eP_im + rt_im * eP_re;
    return { k1, k2, tunneling, T, R, r_re, r_im, t_re, t_im };
  }
}

function evalPsiRspecL(x, sc, L) {
  const { k1, tunneling, r_re, r_im, t_re, t_im } = sc;
  const kk = tunneling ? sc.kappa : sc.k2;
  if (x >= L) {
    const cr = Math.cos(k1 * x), si = Math.sin(k1 * x);
    return [t_re * cr - t_im * si, t_re * si + t_im * cr];
  }
  if (x < 0) {
    const c1 = Math.cos(k1 * x), s1 = Math.sin(k1 * x), cm = c1, sm = -s1;
    return [c1 + r_re * cm - r_im * sm, s1 + r_re * sm + r_im * cm];
  }
  const tEr = t_re * Math.cos(k1 * L) - t_im * Math.sin(k1 * L);
  const tEi = t_re * Math.sin(k1 * L) + t_im * Math.cos(k1 * L);
  const dtEr = -k1 * tEi, dtEi = k1 * tEr;
  if (tunneling) {
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

// ── parameters (same defaults as index.html) ──────────────────────────────
const k0 = 3.5, sigma = 1.2, x0 = -8.0, V0 = 7.0, L = 1.5;
const nk = 150, nx = 600, xmin = -20, xmax = 20;
const np = 1000;
const dt = 0.015;
const dx = (xmax - xmin) / (nx - 1);

// ── build grid & scattering states ────────────────────────────────────────
const xs = new Float64Array(nx);
for (let i = 0; i < nx; i++) xs[i] = xmin + i * dx;

const sig_k = 1.0 / (2.0 * sigma);
const kmin = Math.max(0.05, k0 - 5.0 * sig_k);
const kmax = k0 + 5.0 * sig_k;
const dk = (kmax - kmin) / (nk - 1);
const ks = new Float64Array(nk);
const phi = new Float64Array(2 * nk);
const psiK = new Float64Array(nk * nx * 2);
const norm_phi = Math.pow(2.0 * Math.PI * sigma * sigma, -0.25);

let T_sum = 0, w_sum = 0;
for (let ik = 0; ik < nk; ik++) {
  const k = kmin + ik * dk;
  ks[ik] = k;
  const env = norm_phi * Math.exp(-0.5 * (k - k0) * (k - k0) * sigma * sigma);
  const wt = env * dk;
  phi[2 * ik]     =  wt * Math.cos(k * x0);
  phi[2 * ik + 1] = -wt * Math.sin(k * x0);
  const E = 0.5 * k * k;
  const sc = analyticScatter(E, V0, L);
  T_sum += sc.T * wt * wt;
  w_sum += wt * wt;
  for (let ix = 0; ix < nx; ix++) {
    const p = evalPsiRspecL(xs[ix], sc, L);
    psiK[2 * (ik * nx + ix)]     = p[0];
    psiK[2 * (ik * nx + ix) + 1] = p[1];
  }
}
const T_mean = w_sum > 0 ? T_sum / w_sum : 0;

// ── time evolution ─────────────────────────────────────────────────────────
const psi_re = new Float64Array(nx);
const psi_im = new Float64Array(nx);

function specEvalPsi(t) {
  psi_re.fill(0); psi_im.fill(0);
  for (let ik = 0; ik < nk; ik++) {
    const k = ks[ik], E = 0.5 * k * k;
    const tpR =  Math.cos(E * t), tpI = -Math.sin(E * t);
    const phR = phi[2 * ik], phI = phi[2 * ik + 1];
    const wR = phR * tpR - phI * tpI, wI = phR * tpI + phI * tpR;
    const base = 2 * ik * nx;
    for (let ix = 0; ix < nx; ix++) {
      const psR = psiK[base + 2 * ix], psI = psiK[base + 2 * ix + 1];
      psi_re[ix] += wR * psR - wI * psI;
      psi_im[ix] += wR * psI + wI * psR;
    }
  }
}

function specBohmV(x) {
  const fi = (x - xmin) / dx;
  const i0 = clamp(Math.floor(fi), 1, nx - 2);
  const i1 = Math.min(i0 + 1, nx - 2);
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

// ── DIAGNOSTIC 1: norm evolution by region ────────────────────────────────
console.log('=== Norm evolution by region ===');
console.log('t=0: norm should be ~3.16 (not 1!) because scattering states are');
console.log('     unnormalized; the initial state includes a ghost reflected packet.');
for (let ti = 0; ti <= 14; ti++) {
  const t = ti * 0.5;
  specEvalPsi(t);
  let nL = 0, nM = 0, nR = 0;
  for (let i = 0; i < nx; i++) {
    const p2 = (psi_re[i] * psi_re[i] + psi_im[i] * psi_im[i]) * dx;
    if (xs[i] < 0) nL += p2; else if (xs[i] < L) nM += p2; else nR += p2;
  }
  const tot = nL + nM + nR;
  console.log(
    `t=${String(t.toFixed(1)).padStart(4)}  tot=${tot.toFixed(3)}  L=${nL.toFixed(3)}  M=${nM.toFixed(3)}  R=${nR.toFixed(3)}  R/tot=${(nR/tot*100).toFixed(1)}%`
  );
}

// ── DIAGNOSTIC 2: probability flux through measurement planes ─────────────
// The wave T fraction is measured as flux through planes either side of domain.
// J(x,t) = Im(psi* dpsi/dx) = Re(psi)*Im(dpsi/dx) - Im(psi)*Re(dpsi/dx)
// Transmitted fraction = integral J(x_R, t) dt  (rightward)
// Reflected  fraction  = -integral J(x_L, t) dt  (leftward = negative J)
console.log('\n=== Probability flux (true T/R from wavefunction) ===');
const iR = Math.round((xmax - 0.5 - xmin) / dx);
const iL = Math.round((xmin + 0.5 - xmin) / dx);
console.log(`Measuring at xL=${xs[iL].toFixed(2)}, xR=${xs[iR].toFixed(2)}`);

specEvalPsi(0);
let totalTransFlux = 0, totalRefFlux = 0;
for (let step = 1; step <= 2000; step++) {
  specEvalPsi(step * dt);
  const dRr = (psi_re[iR + 1] - psi_re[iR - 1]) / (2 * dx);
  const dRi = (psi_im[iR + 1] - psi_im[iR - 1]) / (2 * dx);
  totalTransFlux += (psi_re[iR] * dRi - psi_im[iR] * dRr) * dt;
  const dLr = (psi_re[iL + 1] - psi_re[iL - 1]) / (2 * dx);
  const dLi = (psi_im[iL + 1] - psi_im[iL - 1]) / (2 * dx);
  totalRefFlux   -= (psi_re[iL] * dLi - psi_im[iL] * dLr) * dt;
}
const fluxSum = totalTransFlux + totalRefFlux;
console.log(`Trans flux = ${totalTransFlux.toFixed(4)}`);
console.log(`Refl  flux = ${totalRefFlux.toFixed(4)}`);
console.log(`Sum        = ${fluxSum.toFixed(4)}  (initial norm ≈ 3.16)`);
console.log(`T from flux = ${(totalTransFlux / fluxSum * 100).toFixed(2)}%`);
console.log(`T_mean      = ${(T_mean * 100).toFixed(2)}%`);

// ── DIAGNOSTIC 3: Bohmian particle T/R ────────────────────────────────────
console.log('\n=== Bohmian particle statistics ===');
specEvalPsi(0);
let n0 = 0;
for (let i = 0; i < nx; i++) n0 += (psi_re[i]*psi_re[i]+psi_im[i]*psi_im[i])*dx;
console.log(`Initial norm = ${n0.toFixed(4)}  (expected ~3.16 due to ghost reflected packet)`);

const bx       = new Float64Array(np);
const bDecided = new Int8Array(np).fill(-1);
{
  const prob = new Float64Array(nx);
  let tot = 0;
  for (let i = 0; i < nx; i++) { prob[i] = (psi_re[i]*psi_re[i]+psi_im[i]*psi_im[i])*dx; tot += prob[i]; }
  const cum = new Float64Array(nx + 1);
  for (let i = 0; i < nx; i++) cum[i + 1] = cum[i] + prob[i] / (tot + 1e-30);
  for (let p = 0; p < np; p++) {
    const u = (p + 0.5) / np;
    let lo = 0, hi = nx;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < u) lo = m; else hi = m; }
    bx[p] = xs[lo] + ((u - cum[lo]) / (cum[lo + 1] - cum[lo] + 1e-30)) * dx;
  }
}

const threshR = xmin + 0.2, threshT = xmax - 0.2;
for (let step = 1; step <= 3000; step++) {
  const t = step * dt;
  specEvalPsi(t);
  for (let p = 0; p < np; p++) {
    if (bDecided[p] !== -1) continue;
    const v = specBohmV(bx[p]);
    bx[p] += v * dt;
    if (bx[p] < threshR) { bDecided[p] = 0; bx[p] = xmin - 999; }
    else if (bx[p] > threshT) { bDecided[p] = 1; bx[p] = xmax + 999; }
  }
  let norm = 0;
  for (let i = 0; i < nx; i++) norm += (psi_re[i]*psi_re[i]+psi_im[i]*psi_im[i])*dx;
  if (step % 200 === 0) {
    let cT = 0, cR = 0, cU = 0;
    for (let p = 0; p < np; p++) { if(bDecided[p]===1)cT++; else if(bDecided[p]===0)cR++; else cU++; }
    console.log(`  t=${t.toFixed(2)}  norm%=${(norm/n0*100).toFixed(1)}%  T=${cT}  R=${cR}  U=${cU}  T%=${(cT/(cT+cR||1)*100).toFixed(1)}%`);
  }
  if (norm < 0.005 * n0) {
    const mid = L / 2;
    for (let p = 0; p < np; p++) {
      if (bDecided[p] === -1) bDecided[p] = bx[p] > mid ? 1 : 0;
    }
    let finalT = 0, finalR = 0;
    for (let p = 0; p < np; p++) { if(bDecided[p]===1)finalT++; else finalR++; }
    console.log(`\nFINAL: T_mean=${(T_mean*100).toFixed(2)}%  T_particle=${(finalT/np*100).toFixed(2)}%  T/R=${finalT}/${finalR}/${np}`);
    break;
  }
}
