// N-slit checks for the source-packet model. Run: node tests/n-slit.mjs
import assert from 'node:assert/strict';
import {gaussian} from '../js/packet-model.js';
import {
  aperture, branchOf, sourceCoefficients, sourceComponents, sourceBranches, sourceDensity, sourceTransverse,
  sampleTransmittedSource, stepSource, sourceProfile, slitBands, detectorBranches,
} from '../js/source-packet-model.js';

let checks = 0;
const ok = (cond, msg) => { assert(cond, msg); checks++; console.log('PASS  ' + msg); };
const base = { sx: .5, sy: .3, sourceSigma: 6, wall: 2.25, screen: 6.25, k: 2 * Math.PI };
const sign = (k, N) => 2 * k - (N - 1);
const make = (N, sep, open = null, extra = {}) => {
  const slitIds = Array.from({ length: N }, (_, k) => k).filter((k) => !open || open[k]);
  return { ...base, slitIds, centers: slitIds.map((k) => sign(k, N) * sep / 2), apertureWeights: slitIds.map(() => 1), ...extra };
};
function integral(f, lo = -30, hi = 30, steps = 24000) { let v = 0; const dx = (hi - lo) / steps; for (let i = 0; i < steps; i++) v += f(lo + (i + .5) * dx) * dx; return v; }
let seed = 2026; const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) + .5) / 4294967296;
const ksError = (samples, profile, lo, hi) => {
  const s = samples.filter((y) => y > lo && y < hi).sort((a, b) => a - b), dy = (hi - lo) / (profile.values.length - 1);
  let cdf = 0, j = 0, max = 0;
  for (let i = 1; i < profile.values.length; i++) {
    cdf += (profile.values[i - 1] + profile.values[i]) * .5 * dy / profile.integral;
    const y = lo + i * dy; while (j < s.length && s[j] <= y) j++;
    max = Math.max(max, Math.abs(j / s.length - cdf));
  }
  return max;
};
const run = (p, n) => {
  const coeff = sourceCoefficients(p), out = [];
  for (let i = 0; i < n; i++) {
    const a = sampleTransmittedSource(p, random);
    for (let s = 0; s < 3000 && !a.done; s++) stepSource(a, .0008, p, coeff, random);
    if (!a.absorbed) out.push({ y: a.y, group: a.slitSide });
  }
  return out;
};

// 1. Two slits: the generalized which-path branches reproduce the double-slit model exactly.
{
  const p2 = make(2, 2.5), plain = { ...p2, whichPath: true }, explicit = { ...p2, whichPath: true, branchOf: [0, 1] };
  const c = sourceCoefficients(plain);
  let worst = 0;
  for (let y = -8; y <= 8; y += .013) worst = Math.max(worst, Math.abs(sourceDensity(y, plain.screen, plain, c) - sourceDensity(y, explicit.screen, explicit, c)));
  ok(worst === 0, 'two slits: explicit branches [0,1] identical to the original which-slit model');
  ok(JSON.stringify(branchOf(plain)) === '[0,1]', 'default branches are one per aperture');
}

// 2. Many apertures: the mask stays absorptive and the field is the masked incident wave.
for (const [N, sep] of [[3, 1.5], [5, .9], [8, .55], [5, .4]]) {
  const p = make(N, sep), c = sourceCoefficients(p);
  let peak = 0;
  for (let y = -8; y <= 8; y += .007) {
    const T = aperture(y, p); peak = Math.max(peak, T);
    const a = gaussian(y, p.wall / p.k, p.sourceSigma), b = sourceTransverse(y, p.wall, p, c);
    if (Math.hypot(b.re - a.re * T, b.im - a.im * T) > 1e-12) throw new Error('mask');
  }
  ok(peak <= 1 + 1e-12 && peak > .999, `N=${N}, d=${sep}: aperture mask peaks at 1 (got ${peak.toFixed(5)})`);
  const n0 = integral((y) => sourceTransverse(y, p.wall + 1e-7, p, c).rho), n1 = integral((y) => sourceTransverse(y, p.screen, p, c).rho);
  ok(Math.abs(n1 / n0 - 1) < 1e-8, `N=${N}: transmitted flux conserved`);
}

// 3. Detector at one slit of four: two coherent branches, {detector slit} and {the others}.
{
  const p = { ...make(4, 1.5), whichPath: true, branchOf: [0, 1, 0, 0], detectorSlot: 1 }, c = sourceCoefficients(p);
  let worst = 0, differsFull = 0, differsCoherent = 0;
  for (let y = -6; y <= 6; y += .021) {
    const comps = sourceComponents(y, p.screen, p, c);
    const sum = (ids) => { let re = 0, im = 0; for (const i of ids) { re += comps[i].re; im += comps[i].im; } return re * re + im * im; };
    const expected = sum([1]) + sum([0, 2, 3]);
    worst = Math.max(worst, Math.abs(sourceDensity(y, p.screen, p, c) - expected));
    differsFull = Math.max(differsFull, Math.abs(expected - comps.reduce((s, q) => s + q.rho, 0)));
    differsCoherent = Math.max(differsCoherent, Math.abs(expected - sum([0, 1, 2, 3])));
    const br = sourceBranches(y, p.screen, p, c);
    if (br.length !== 2) throw new Error('two branches');
  }
  ok(worst < 1e-15, 'detector at slit 2 of 4: density = |ψ₂|² + |ψ₁+ψ₃+ψ₄|²');
  ok(differsFull > 1e-3 && differsCoherent > 1e-3, 'it differs from both full decoherence and full coherence');
}

// 4. Pilot-wave Monte Carlo reproduces the screen density, with and without the detector.
for (const [label, p] of [['four slits', make(4, 1.5)], ['four slits, detector at slit 2', { ...make(4, 1.5), whichPath: true, branchOf: [0, 1, 0, 0], detectorSlot: 1 }], ['three of five slits', make(5, 1.2, [true, false, true, true, false])]]) {
  const hits = run(p, 4000), profile = sourceProfile(p, -8, 8);
  const e = ksError(hits.map((h) => h.y), profile, -8, 8);
  ok(e < .04, `${label}: PW screen CDF matches the prediction (KS ${e.toFixed(3)})`);
}

// 5. Bands: every PW particle from slit k lands in slit k's band; band weights match the counts.
for (const [label, p] of [['four slits', make(4, 1.5)], ['five slits', make(5, 1.2)], ['three of five', make(5, 1.2, [true, false, true, true, false])]]) {
  const bands = slitBands(p), hits = run(p, 4000);
  let outside = 0; const counts = Object.fromEntries(bands.map((b) => [b.group, 0]));
  for (const h of hits) {
    const b = bands.find((x) => x.group === h.group); counts[h.group]++;
    if (h.y < b.top - .01 || h.y > b.bottom + .01) outside++;
  }
  ok(outside === 0, `${label}: all ${hits.length} PW hits land in their slit's band (${outside} outside)`);
  const chi = bands.reduce((s, b) => s + (counts[b.group] - hits.length * b.weight) ** 2 / Math.max(1e-9, hits.length * b.weight), 0);
  ok(chi < bands.length - 1 + 4 * Math.sqrt(2 * (bands.length - 1)) + 4, `${label}: hits per slit follow the band weights (χ² ${chi.toFixed(1)}, ${bands.length - 1} dof)`);
  ok(bands.every((b, i) => i === 0 || Math.abs(b.top - bands[i - 1].bottom) < 1e-12), `${label}: bands are contiguous and ordered`);
}
ok(slitBands({ ...make(4, 1.5), whichPath: true, branchOf: [0, 1, 0, 0] }) === null, 'no bands with the which-slit detector');

// 6. Symmetry: equal slits, symmetric source → bands symmetric about the axis.
{
  const b = slitBands(make(4, 1.5));
  ok(Math.abs(b[1].bottom) < 1e-3 && Math.abs(b[0].bottom + b[2].bottom) < 1e-3, 'four equal slits: symmetric band edges');
}

// 9. Several detectors (3.0-dev.15).
{
  // Branch assignment: N = 2 matches the old two-branch rule.
  ok(JSON.stringify(detectorBranches([0, 1], [0])) === '[0,1]' && JSON.stringify(detectorBranches([0, 1], [1])) === '[0,1]', 'two slits: one detector gives branch i = aperture i');
  ok(JSON.stringify(detectorBranches([0, 1, 2, 3], [1, 3])) === '[0,1,0,2]', 'four slits, detectors at 2 and 4: branches {1,3}, {2}, {4}');
  const N = 4, sep = 1.8, ids = [0, 1, 2, 3];
  const plain = make(N, sep), coeffPlain = sourceCoefficients(plain);
  const single = (k) => { const q = make(N, sep, ids.map((j) => j === k)); return [q, sourceCoefficients(q)]; };
  // Density with detectors on D = {1, 3}: |ψ0+ψ2|² + |ψ1|² + |ψ3|², from apertures of the full mask.
  const D = [1, 3], p = { ...plain, whichPath: true, branchOf: detectorBranches(ids, D) }, coeff = sourceCoefficients(p);
  let maxErr = 0, scale = 0;
  for (let y = -6; y <= 6; y += .05) {
    const c = sourceComponents(y, plain.screen, plain, coeffPlain);
    const sum = (list) => { let re = 0, im = 0; for (const i of list) { re += c[i].re; im += c[i].im; } return re * re + im * im; };
    const expected = sum([0, 2]) + sum([1]) + sum([3]), got = sourceDensity(y, p.screen, p, coeff);
    maxErr = Math.max(maxErr, Math.abs(got - expected)); scale = Math.max(scale, expected);
  }
  ok(maxErr / scale < 1e-12, `detectors at slits 2 and 4: density = |ψ1+ψ3|² + |ψ2|² + |ψ4|² (rel. err ${(maxErr / scale).toExponential(1)})`);
  // Detectors on every open slit: no cross terms left; density = Σ_k |ψ_k|².
  const all = { ...plain, whichPath: true, branchOf: detectorBranches(ids, ids) }, coeffAll = sourceCoefficients(all);
  let errAll = 0, scaleAll = 0, minPlain = Infinity, maxPlain = 0;
  for (let y = -6; y <= 6; y += .05) {
    const c = sourceComponents(y, plain.screen, plain, coeffPlain), expected = c.reduce((t, q) => t + q.re * q.re + q.im * q.im, 0);
    errAll = Math.max(errAll, Math.abs(sourceDensity(y, all.screen, all, coeffAll) - expected)); scaleAll = Math.max(scaleAll, expected);
  }
  ok(errAll / scaleAll < 1e-12, 'detectors on all four slits: density = Σ|ψk|², no interference');
  // Pilot-wave statistics with two detectors follow the predicted density.
  const hits = run(p, 2500).map((h) => h.y), profile = sourceProfile(p, -8, 8, 2049), ks = ksError(hits, profile, -8, 8);
  ok(ks < .04, `PW hits with detectors at slits 2 and 4 follow the prediction (KS ${ks.toFixed(3)}, n=${hits.length})`);
  // Sixteen slits: the field and the mask are well defined.
  const p16 = make(16, .9), c16 = sourceCoefficients(p16);
  let maxT = 0; for (let y = -9; y <= 9; y += .01) maxT = Math.max(maxT, aperture(y, p16));
  ok(Math.abs(maxT - 1) < 1e-3 && Number.isFinite(sourceTransverse(0, p16.screen, p16, c16).rho), `sixteen slits: max T = ${maxT.toFixed(4)}, field finite`);
}

console.log(JSON.stringify({ passed: true, checks }));
