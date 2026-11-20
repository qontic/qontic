// Physics checks for the Hydrogen Atom app.
// Run: node apps/pilot-wave/hydrogen-atom/tests/hydrogen-physics.test.mjs
// The app is a classic script with globals, so the physics functions are
// extracted from hydrogen-3d.js and evaluated without the DOM.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const src = readFileSync(fileURLToPath(new URL('../hydrogen-3d.js', import.meta.url)), 'utf8');
function grab(kind, name) {
  const head = kind === 'function' ? `function ${name}(` : `const ${name}=`;
  const i = src.indexOf(head);
  if (i < 0) throw new Error(`missing ${name}`);
  if (kind === 'function') {
    let d = 0, k = src.indexOf('{', i);
    for (; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}' && --d === 0) break; }
    return src.slice(i, k + 1);
  }
  const j = i + head.length, open = src[j], close = open === '[' ? ']' : '}';
  let d = 0, k = j;
  for (; k < src.length; k++) { if (src[k] === open) d++; else if (src[k] === close && --d === 0) break; }
  return src.slice(i, k + 1) + ';';
}
const fns = ['realOrbital', 'factorial', 'laguerre', 'assocLegendre', 'ylmNorm', 'Ylm', 'Rnl', 'psiXYZ', 'rhoAt', 'bohmV', 'psiSpinor',
  'rhoSpinAt', 'bohmVPauli', 'buildSpinComps', 'exactR', 'densityAt', 'psiRealUpToPhase', 'densityEvolves', 'rotateAroundZ',
  'cloudCount', 'stepCloudParticles', 'stepParticle', 'rMax', 'sampleParticlesStratified', 'sampleParticles', 'integrate', 'autoCloudN'];
let code = `var spinEnabled=false,spinComps=[],spinMode='product',spinTheta=Math.PI/2,spinPhi=0,comps=[],particles=[],t=0,
superKey='none',orbIdx=0,showCloud=false,interp='pw',spinTerm=true,dtStep=0.04,trailLen=800,W=600,H=600,cloudSpherePx=10,lastCloudBoundMisses=0;
const CLOUD_SPIN_MAX=500, CLOUD_SPIN_STEP=0.12; function invalidateDensity(){}\n`;
{ const i = src.indexOf('const REAL_SUPERS='); code += src.slice(i, src.indexOf('\n', i)) + '\n'; }
for (const c of ['ORBITALS', 'SUPERS', 'SUPER_RM', 'SPIN_SUPERS']) code += grab('const', c) + '\n';
for (const f of fns) code += grab('function', f) + '\n';
const ctx = vm.createContext({ Math, Float32Array, Float64Array, Number, console });
vm.runInContext(code, ctx);
const A = (expr) => vm.runInContext(expr, ctx);
const set = (o) => { for (const [k, v] of Object.entries(o)) { ctx.__v = v; A(`${k}=__v`); } };

let failures = 0;
function check(name, ok, detail) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`); if (!ok) failures++; }

function pure(idx) {
  const o = A(`ORBITALS[${idx}]`);
  set({ orbIdx: idx, superKey: 'none', spinEnabled: false, spinComps: [], t: 0, comps: [{ n: o.n, l: o.l, m: o.m, cRe: 1, cIm: 0 }] });
  return o;
}
function ks(samples, cdf) {
  const r = samples.slice().sort((a, b) => a - b); let d = 0;
  r.forEach((x, i) => { const F = cdf(x); d = Math.max(d, Math.abs(F - i / r.length), Math.abs(F - (i + 1) / r.length)); });
  return d;
}
function radialCdf(n, l) {
  const rm = n * n * 18 + 30, N = 20000, dr = rm / N, xs = [], cs = []; let c = 0;
  for (let i = 0; i < N; i++) { const r = (i + 0.5) * dr, R = A(`Rnl(${n},${l},${r})`); c += r * r * R * R * dr; xs.push((i + 1) * dr); cs.push(c); }
  return (x) => { const i = Math.min(N - 1, Math.max(0, Math.floor(x / dr))); return cs[i] / c; };
}

// 1. Radial normalisation and <r>.
for (const idx of [0, 1, 2, 12, 30, 41]) {
  const o = pure(idx); const rm = o.n * o.n * 18 + 30, N = 40000, dr = rm / N; let s = 0, sr = 0;
  for (let i = 0; i < N; i++) { const r = (i + 0.5) * dr, R = A(`Rnl(${o.n},${o.l},${r})`); s += r * r * R * R * dr; sr += r * r * r * R * R * dr; }
  check(`norm/<r> ${o.label}`, Math.abs(s - 1) < 1e-4 && Math.abs(sr - A(`exactR(${o.n},${o.l})`)) < 1e-3, `norm ${s.toFixed(6)} <r> ${sr.toFixed(4)}`);
}

// 2. Cloud sampler reproduces |psi|^2 (radial KS and <r>), and its cell bound holds.
for (const idx of [0, 1, 3, 5, 12, 30]) {
  const o = pure(idx); const N = 12000;
  const pts = A(`sampleParticlesStratified(${N},0)`);
  const r = pts.map(p => Math.hypot(p.x, p.y, p.z));
  const d = ks(r, radialCdf(o.n, o.l)), crit = 1.95 / Math.sqrt(r.length);   // 0.1% level (six orbitals tested)
  const mean = r.reduce((a, b) => a + b, 0) / r.length, ex = A(`exactR(${o.n},${o.l})`);
  const misses = A('lastCloudBoundMisses');
  check(`cloud sampler ${o.label}`, pts.length === N && d < crit && Math.abs(mean / ex - 1) < 0.02 && misses <= N * 1e-3,
    `KS ${d.toFixed(4)} (crit ${crit.toFixed(4)}), <r> ${mean.toFixed(3)} vs ${ex}, bound misses ${misses}`);
}

// 3. No particle is trapped at the nucleus (old r < 0.15 cutoff).
set({ superKey: 'sp', spinEnabled: false, showCloud: false, t: 0, comps: A('SUPERS.sp').map(c => ({ ...c })) });
const v0 = A('bohmV(comps,0,0.05,0.1,4)');
set({ particles: [{ x: 0, y: 0.05, z: 0.1, trail: [], age: 0 }] });
let maxDisp = 0;   // the motion is periodic (16.8 a.u.), so track the largest excursion
for (let i = 0; i < 300; i++) { A('integrate(1/3)'); const p0 = A('particles[0]'); maxDisp = Math.max(maxDisp, Math.hypot(p0.x, p0.y - 0.05, p0.z - 0.1)); }
check('no trap at nucleus (1s+2p0)', Math.hypot(...v0) > 0.05 && maxDisp > 0.1,
  `|v|=${Math.hypot(...v0).toFixed(3)} at t=4, largest excursion ${maxDisp.toFixed(2)} a0`);

// 4. Equivariance for 1s+2p0: <z> of moving particles tracks fresh |psi(t)|^2 samples.
set({ t: 0, particles: A('sampleParticles(2000,0)') });
let worst = 0;
for (let step = 0; step < 5; step++) {
  for (let i = 0; i < 6; i++) A('integrate(1/3)');
  const moved = A('particles').map(p => p.z), fresh = A('sampleParticles(4000,t)').map(p => p.z);
  const m1 = moved.reduce((a, b) => a + b) / moved.length, m2 = fresh.reduce((a, b) => a + b) / fresh.length;
  const sd = Math.sqrt(fresh.reduce((a, b) => a + (b - m2) ** 2, 0) / fresh.length);
  worst = Math.max(worst, Math.abs(m1 - m2) / (sd * Math.sqrt(1 / moved.length + 1 / fresh.length)));
}
check('equivariance <z>, 1s+2p0', worst < 4, `worst z-score ${worst.toFixed(2)}`);
const stuck = A('particles').filter(p => Math.hypot(p.x, p.y, p.z) < 0.15).length;
check('few particles inside 0.15 a0', stuck <= 8, `${stuck} of 2000 (expected ~2)`);

// 5. Cloud view moves dots when spin is on (2p0 with spin along x).
pure(2);
set({ spinEnabled: true, spinMode: 'product', spinTheta: Math.PI / 2, spinPhi: 0, showCloud: true });
A('buildSpinComps()');
set({ particles: A('sampleParticlesStratified(cloudCount(),0)') });
const before = A('particles').map(p => [p.x, p.y, p.z]);
A('integrate(5)');
const movedCount = A('particles').filter((p, i) => Math.hypot(p.x - before[i][0], p.y - before[i][1], p.z - before[i][2]) > 1e-3).length;
check('cloud + spin: dots move', movedCount > 0.9 * before.length && before.length <= 500, `${movedCount}/${before.length} moved`);

// 5b. Cloud dots under the spin term keep the |psi|^2 distribution (step 0.12 a.u.).
{
  const stats = () => { const P = A('particles'); const r = P.map(p => Math.hypot(p.x, p.y, p.z)), x2 = P.map(p => p.x * p.x);
    const m = a => a.reduce((s, v) => s + v, 0) / a.length; return [m(r), m(x2)]; };
  set({ particles: A('sampleParticlesStratified(4000,0)') });
  const s0 = stats();
  for (let i = 0; i < 30; i++) A('integrate(1/3)');
  const s1 = stats(), ex = A('exactR(2,1)');
  check('cloud + spin keeps |psi|^2', Math.abs(s1[0] / ex - 1) < 0.03 && Math.abs(s1[1] / s0[1] - 1) < 0.06,
    `<r> ${s0[0].toFixed(2)} -> ${s1[0].toFixed(2)} (exact ${ex}), <x^2> ${s0[1].toFixed(1)} -> ${s1[1].toFixed(1)}`);
}

// 6. Sign colouring only for real psi.
pure(3); check('sign colours off for 2p+1', A('psiRealUpToPhase()') === false);
pure(2); check('sign colours on for 2p0', A('psiRealUpToPhase()') === true);
set({ superKey: 'px', comps: A('SUPERS.px').map(c => ({ ...c })) }); check('sign colours on for p_x', A('psiRealUpToPhase()') === true);
set({ superKey: 'sp', comps: A('SUPERS.sp').map(c => ({ ...c })) }); check('sign colours off for 1s+2p0', A('psiRealUpToPhase()') === false);

// 7. Spin term off on a spin preset: same spinor, convective guidance only.
{
  set({ superKey: 'spin_ss', spinEnabled: true, spinMode: 'product', comps: A('SPIN_SUPERS.spin_ss.comps'), spinComps: A('SPIN_SUPERS.spin_ss.spinComps'), spinTerm: true });
  const pt = [1.2, 0.8, 0.9];
  const vOn = Math.hypot(...A(`bohmV(comps,${pt},5)`));
  set({ spinTerm: false });
  const vOff = Math.hypot(...A(`bohmV(comps,${pt},5)`));
  check('1s up + 2s down: spin term moves it, convective law does not', vOn > 0.05 && vOff < 1e-6, `|v| with term ${vOn.toFixed(3)}, without ${vOff.toExponential(1)}`);
  set({ superKey: 'none', spinEnabled: false, spinComps: [], spinTerm: true });
}

// 8. Real orbitals in the superposition menu: real, chemistry signs, v = 0.
{
  const cases = { px: [[2, 0, 0], [-2, 0, 0]], py: [[0, 2, 0], [0, -2, 0]], pz: [[0, 0, 2], [0, 0, -2]], dz2: [[0, 0, 3], [3, 0, 0]], dxz: [[2, 0, 2], [2, 0, -2]], dyz: [[0, 2, 2], [0, 2, -2]], dxy: [[2, 2, 0], [2, -2, 0]], dx2y2: [[3, 0, 0], [0, 3, 0]] };
  let ok = true, maxV = 0, bad = [];
  for (const [key, [plus, minus]] of Object.entries(cases)) {
    set({ superKey: key, spinEnabled: false, comps: A(`SUPERS.${key}`).map(c => ({ ...c })) });
    const a = A(`psiXYZ(comps,${plus},0)`), b = A(`psiXYZ(comps,${minus},0)`);
    if (!(a[0] > 0 && b[0] < 0 && Math.abs(a[1]) < 1e-12 && Math.abs(b[1]) < 1e-12)) { ok = false; bad.push(key); }
    for (const pt of [[1.7, 0.9, 1.2], [-0.8, 2.1, 0.6]]) if (A(`rhoAt(comps,${pt},0)`) > 1e-10) maxV = Math.max(maxV, Math.hypot(...A(`bohmV(comps,${pt},0)`)));
    if (!A('psiRealUpToPhase()')) { ok = false; bad.push(key + ' (sign colours off)'); }
  }
  check('real orbitals: real, chemistry signs, v = 0', ok && maxV < 1e-6, bad.join(', ') || `8 orbitals, max |v| ${maxV.toExponential(1)}`);
  set({ superKey: 'none' });
}

console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
