// Atom Mach–Zehnder interferometer: geometry, outcome statistics, branch
// structure and pilot-wave trajectories. Coordinates are virtual pixels on a
// 1000 x 600 stage; y increases downward.

const P = (x, y) => ({ x, y });
const sub = (a, b) => P(a.x - b.x, a.y - b.y);
const add = (a, b) => P(a.x + b.x, a.y + b.y);
const mul = (a, k) => P(a.x * k, a.y * k);
const len = a => Math.hypot(a.x, a.y);
const unit = a => mul(a, 1 / len(a));

export const G = (() => {
  const S = P(60, 300), BS1 = P(200, 300), MU = P(430, 80), ML = P(430, 520), BS2 = P(660, 300);
  const dDown = unit(sub(BS2, MU));   // direction of the upper arm after its mirror
  const dUp = unit(sub(BS2, ML));     // direction of the lower arm after its mirror
  const armLen = len(sub(MU, BS1));
  const outLen = 0.9 * armLen;
  const D1 = add(BS2, mul(dUp, outLen));   // upper-right detector
  const D2 = add(BS2, mul(dDown, outLen)); // lower-right detector
  const OBJ = add(BS1, mul(sub(MU, BS1), 0.5)); // object position on the upper arm
  const sBS1 = len(sub(BS1, S));
  const sObj = sBS1 + armLen / 2;
  const sM = sBS1 + armLen;
  const sBS2 = sBS1 + 2 * armLen;
  const total = sBS2 + outLen;
  return { S, BS1, MU, ML, BS2, D1, D2, OBJ, dDown, dUp, armLen, outLen, sBS1, sObj, sM, sBS2, total };
})();

export const OPTIONS = [
  ['d1', 'Only D1 clicks'],
  ['d2', 'Only D2 clicks'],
  ['both', 'D1 and D2 about equally'],
  ['abs-d1', 'Some atoms absorbed by the bomb; the rest only at D1'],
  ['abs-both', 'Some atoms absorbed by the bomb; the rest reach D1 and D2 about equally'],
  ['abs-d2', 'Some atoms absorbed by the bomb; the rest only at D2'],
];

export function correctOption(setup) {
  if (setup.object === 'bomb') return setup.bs2 ? 'abs-both' : 'abs-d1';
  if (setup.object === 'none' && setup.bs2) return 'd1';
  return 'both';
}

export function probabilities(setup) {
  if (setup.object === 'bomb') return setup.bs2 ? { d1: .25, d2: .25, bomb: .5 } : { d1: .5, d2: 0, bomb: .5 };
  if (setup.object === 'none' && setup.bs2) { const c2 = Math.cos((setup.delta || 0) / 2) ** 2; return { d1: c2, d2: 1 - c2, bomb: 0 }; }
  return { d1: .5, d2: .5, bomb: 0 };
}

// One hidden number u in (0,1) fixes the run in every view. In pilot wave it is
// the atom's initial position: u < 1/2 means the upper packet; the rescaled
// value u2 is the position inside that packet.
export function outcome(setup, u) {
  const arm = u < .5 ? 'U' : 'L';
  const u2 = arm === 'U' ? 2 * u : 2 * u - 1;
  let result;
  if (setup.object === 'bomb' && arm === 'U') result = 'bomb';
  else if (setup.bs2) {
    if (setup.object === 'none') result = u < Math.cos((setup.delta || 0) / 2) ** 2 ? 'd1' : 'd2';
    else result = u2 < .5 ? 'd1' : 'd2';
  } else if (setup.object === 'none') {
    // Pilot-wave trajectories cannot cross the symmetry line: the upper packet's
    // atom ends at the upper detector D1.
    result = arm === 'U' ? 'd1' : 'd2';
  } else {
    // A record separates the branches in configuration space: each atom goes straight.
    result = arm === 'U' ? 'd2' : 'd1';
  }
  return { arm, u2, result };
}

// Branch structure at arc length s. Each branch lists wave components with
// probability weights. Components: 'in' (before BS1), 'U', 'L', 'p1', 'p2'.
export function branches(setup, s) {
  const out = [];
  const record = setup.object !== 'none' && s >= G.sObj;
  const portsFor = arms => {
    if (setup.bs2) {
      if (arms.length === 2) return [['p1', 1]];
      return [['p1', .5], ['p2', .5]];
    }
    return arms.map(arm => [arm === 'U' ? 'p2' : 'p1', 1 / arms.length]);
  };
  const stage = s < G.sBS1 ? 'in' : s < G.sBS2 ? 'arms' : 'out';
  const build = (label, weight, arms, key) => {
    let comps;
    if (stage === 'in') comps = [['in', 1]];
    else if (stage === 'arms') comps = arms.map(arm => [arm, 1 / arms.length]);
    else comps = portsFor(arms);
    out.push({ key, label, weight, arms, comps });
  };
  if (!record) build(setup.object === 'none' ? 'No record' : setup.object === 'marker' ? 'Flag down' : 'Bomb intact', 1, ['U', 'L'], 'a');
  else if (setup.object === 'marker') {
    build('Flag raised', .5, ['U'], 'a');
    build('Flag down', .5, ['L'], 'b');
  } else {
    out.push({ key: 'x', label: 'Bomb exploded', weight: .5, arms: [], comps: [], exploded: true });
    build('Bomb intact', .5, ['L'], 'b');
  }
  return out;
}

// Position of a wave component centre at arc length s.
export function componentPoint(comp, s) {
  if (comp === 'in') return add(G.S, mul(unit(sub(G.BS1, G.S)), Math.min(s, G.sBS1)));
  if (comp === 'U' || comp === 'L') {
    const M = comp === 'U' ? G.MU : G.ML;
    if (s < G.sM) return add(G.BS1, mul(unit(sub(M, G.BS1)), s - G.sBS1));
    return add(M, mul(unit(sub(G.BS2, M)), s - G.sM));
  }
  const dir = comp === 'p1' ? G.dUp : G.dDown;
  return add(G.BS2, mul(dir, Math.min(s - G.sBS2, G.outLen)));
}

// ---------- Pilot-wave trajectory ----------

const C = (re, im = 0) => ({ re, im });
const cadd = (a, b) => C(a.re + b.re, a.im + b.im);
const cmul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
const cexp = a => { const m = Math.exp(a.re); return C(m * Math.cos(a.im), m * Math.sin(a.im)); };

// Exact free evolution (hbar = m = 1) of two equal Gaussian packets that cross
// at the second beam-splitter position with the splitter removed. Returns the
// Bohmian trajectory of an atom starting in the upper packet at transverse
// offset w (units of the packet width). Local units: 1 unit = 40 px.
export function crossingTrajectory(w, { K = 30, sigma = .5, R = 3, steps = 1200 } = {}) {
  const dU = G.dDown, dL = G.dUp;
  const k = [mul(dU, K), mul(dL, K)];
  const r0 = [mul(dU, -R), mul(dL, -R)];
  const s2 = sigma * sigma;
  const T = 2 * R / K;
  const field = (r, t) => {
    const ia = cdiv(C(1), C(1, t / s2)); // 1 / alpha(t)
    let psi = C(0), gx = C(0), gy = C(0);
    for (let j = 0; j < 2; j++) {
      const dx = r.x - r0[j].x - k[j].x * t, dy = r.y - r0[j].y - k[j].y * t;
      const phase = k[j].x * (r.x - r0[j].x) + k[j].y * (r.y - r0[j].y);
      const expo = cadd(cmul(C(-(dx * dx + dy * dy) / (2 * s2)), ia), C(0, phase));
      const phi = cexp(expo);
      psi = cadd(psi, phi);
      gx = cadd(gx, cmul(phi, cadd(cmul(C(-dx / s2), ia), C(0, k[j].x))));
      gy = cadd(gy, cmul(phi, cadd(cmul(C(-dy / s2), ia), C(0, k[j].y))));
    }
    return P(cdiv(gx, psi).im, cdiv(gy, psi).im);
  };
  const nU = P(dU.y, -dU.x); // transverse direction, pointing away from the axis
  let r = add(r0[0], mul(nU, w * sigma));
  const dt = T / steps;
  const pts = [r];
  for (let i = 0; i < steps; i++) {
    const t = i * dt;
    const a = field(r, t);
    const b = field(add(r, mul(a, dt / 2)), t + dt / 2);
    const c = field(add(r, mul(b, dt / 2)), t + dt / 2);
    const d = field(add(r, mul(c, dt)), t + dt);
    r = add(r, mul(add(add(a, mul(b, 2)), add(mul(c, 2), d)), dt / 6));
    if (i % 6 === 5) pts.push(r);
  }
  const scale = 40;
  return pts.map(p => add(G.BS2, mul(p, scale)));
}

const normalQuantile = p => { // Acklam-style approximation, adequate for display
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const q = Math.min(Math.max(p, 1e-6), 1 - 1e-6) - .5, r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
};

// Full pilot-wave path as a polyline of screen points.
export function pilotWavePath(setup, u) {
  const { arm, u2, result } = outcome(setup, u);
  const w = Math.max(-1.6, Math.min(1.6, normalQuantile(u2) * .6));
  const offsetPx = w * 20;
  const M = arm === 'U' ? G.MU : G.ML;
  const n1 = (() => { const d = unit(sub(M, G.BS1)); return P(-d.y, d.x); })();
  const n2 = (() => { const d = unit(sub(G.BS2, M)); return P(-d.y, d.x); })();
  const pts = [add(G.S, P(0, offsetPx * .4)), add(G.BS1, mul(n1, offsetPx)), add(M, mul(n1, offsetPx)), add(M, mul(n2, offsetPx))];
  if (result === 'bomb') return { pts: [...pts.slice(0, 2), add(G.OBJ, mul(n1, offsetPx))], result, arm };
  if (!setup.bs2 && setup.object === 'none') {
    // The crossing is computed from the guiding equation, mirrored for the lower packet.
    let local = crossingTrajectory(Math.abs(w) < .05 ? .05 : Math.abs(w));
    if (arm === 'L') local = local.map(p => P(p.x, 2 * G.BS2.y - p.y));
    const last = local[local.length - 1], prev = local[local.length - 8];
    const dir = unit(sub(last, prev));
    const end = add(last, mul(dir, (G.D1.x - last.x) / dir.x));
    return { pts: [...pts.slice(0, 3), ...local, end], result, arm };
  }
  const port = result === 'd1' ? G.dUp : G.dDown;
  const nOut = P(-port.y, port.x);
  return { pts: [...pts, add(G.BS2, mul(n2, offsetPx)), add(add(G.BS2, mul(port, G.outLen)), mul(nOut, offsetPx))], result, arm };
}

export function pathPoint(pts, f) {
  const lengths = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) { const l = len(sub(pts[i], pts[i - 1])); lengths.push(l); total += l; }
  let target = Math.max(0, Math.min(1, f)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (target <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] ? Math.min(1, target / lengths[i]) : 0;
      return { point: add(pts[i], mul(sub(pts[i + 1], pts[i]), t)), index: i + 1 };
    }
    target -= lengths[i];
  }
  return { point: pts[pts.length - 1], index: pts.length - 1 };
}
