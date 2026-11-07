// Kinematics of Bell's spaceship problem (special relativity, units c = 1).
// Lengths are in units of the initial separation L, times in units of L/c.
//
// Two ships start at rest in the launch frame: the rear ship B at x = 0 and the
// front ship C at x = L. At t = 0 (launch frame) both start a constant proper
// acceleration and stop accelerating when they reach the final speed beta.
//
//   k : how much gentler the front engine is. The front ship's proper
//       acceleration is a / (1 + k a L), i.e. 1/a_C = 1/a + k L.
//       k = 0: both ships have the same proper acceleration (Bell's case).
//       k = 1: Born-rigid motion; both worldlines share one Rindler pivot and
//              the proper distance between the ships stays L.
//   After both coast at beta, the launch-frame gap is L - k L (1 - 1/gamma),
//   so a thread of rest length L ends stretched by (gamma - 1)(1 - k):
//   only k = 1 leaves it at its natural length.
//   (mode 'bell' / 'rigid' is accepted as k = 0 / 1.)

export function makeModel({ beta = 0.9, accel = 0.6, L = 1, k, mode = 'bell' } = {}) {
  if (k === undefined) k = mode === 'rigid' ? 1 : 0;
  const b = Math.min(Math.max(beta, 1e-4), 0.9999);
  const gf = 1 / Math.sqrt(1 - b * b);
  // Worldline of the thread element starting at x0 (0 = rear, L = front):
  // proper acceleration a(x0) with 1/a(x0) = 1/a + k x0, the same family that
  // contains both ships. k = 0: all equal; k = 1: Born-rigid (common pivot).
  const element = (x0) => {
    const a = accel / (1 + k * accel * x0);
    const t1 = (gf * b) / a; // launch-frame time at which the element reaches beta
    const x1 = x0 + (Math.sqrt(1 + (a * t1) ** 2) - 1) / a;
    const tau1 = Math.asinh(a * t1) / a;
    return { x0, a, t1, x1, tau1 };
  };
  const ships = [element(0), element(L)];
  const N = 48;
  const elements = Array.from({ length: N + 1 }, (_, i) => element((L * i) / N));
  return { beta: b, gammaF: gf, accel, L, k, mode: k === 0 ? 'bell' : k === 1 ? 'rigid' : 'tuned', ships, elements };
}

// Final elongation once both ships coast: (gamma - 1)(1 - k).
export function finalStrain(model) {
  return (model.gammaF - 1) * (1 - model.k);
}

// State of ship i (0 = rear B, 1 = front C) at launch-frame time t.
export function shipState(model, i, t) {
  return elementState(model, model.ships[i], t);
}

function elementState(model, s, t) {
  if (t <= 0) return { x: s.x0, v: 0, tau: t };
  if (t <= s.t1) {
    const at = s.a * t;
    const root = Math.sqrt(1 + at * at);
    return { x: s.x0 + (root - 1) / s.a, v: at / root, tau: Math.asinh(at) / s.a };
  }
  return {
    x: s.x1 + model.beta * (t - s.t1),
    v: model.beta,
    tau: s.tau1 + (t - s.t1) / model.gammaF,
  };
}

// Event on the front ship's worldline that is simultaneous, in the rear ship's
// instantaneous rest frame, with the rear ship's event at launch time tB.
// Returns the proper distance D measured in that frame, the front ship's
// proper time and launch-frame time there, and the front ship's velocity
// relative to the rear ship.
export function rearFrameView(model, tB) {
  const B = shipState(model, 0, tB);
  const f = (tC) => tC - tB - B.v * (shipState(model, 1, tC).x - B.x);
  // f is strictly increasing because |v_B v_C| < 1.
  let span = 1 + model.L;
  let lo = tB - span;
  let hi = tB + span;
  while (f(lo) > 0) { span *= 2; lo = tB - span; }
  while (f(hi) < 0) { span *= 2; hi = tB + span; }
  for (let k = 0; k < 80; k++) {
    const mid = 0.5 * (lo + hi);
    if (f(mid) < 0) lo = mid; else hi = mid;
  }
  const tC = 0.5 * (lo + hi);
  const C = shipState(model, 1, tC);
  const gB = 1 / Math.sqrt(1 - B.v * B.v);
  const D = gB * ((C.x - B.x) - B.v * (tC - tB));
  const vRel = (C.v - B.v) / (1 - C.v * B.v);
  return { tB, tC, xB: B.x, xC: C.x, vB: B.v, D, tauB: B.tau, tauC: C.tau, vRel };
}

// Elongation of the thread: its proper length divided by its rest length L,
// minus 1. Each element of the thread follows a worldline of the family above.
// An element between neighbouring worldlines x0 and x0 + dx0, which at
// launch-frame time t are dx apart and move at speed v, has proper length
// gamma(v) dx (first order in dx0). Summing over the thread gives the exact
// total elongation at launch-frame time t. For k = 0 it is gamma(v) - 1 at
// every moment; for k = 1 it is 0; once the ships coast it is
// (gamma - 1)(1 - k).
export function strainAt(model, t) {
  if (t <= 0) return 0;
  const els = model.elements;
  let len = 0;
  let prev = elementState(model, els[0], t);
  for (let i = 1; i < els.length; i++) {
    const cur = elementState(model, els[i], t);
    len += gammaOf(0.5 * (prev.v + cur.v)) * (cur.x - prev.x);
    prev = cur;
  }
  return len / model.L - 1;
}

// Elongation measured instead as the proper distance in the rear ship's
// momentary rest frame (used for comparison only).
export function strainRearFrame(model, tB) {
  return rearFrameView(model, tB).D / model.L - 1;
}

export function runEnd(model) {
  const tAcc = Math.max(model.ships[0].t1, model.ships[1].t1);
  return tAcc * 1.2 + 2.5 * model.L;
}

// First launch-frame time at which the elongation reaches breakStrain,
// or null if the thread survives the whole run.
export function findBreak(model, breakStrain, tEnd = runEnd(model)) {
  const n = 600;
  let prevT = 0;
  for (let k = 1; k <= n; k++) {
    const t = (tEnd * k) / n;
    if (strainAt(model, t) >= breakStrain) {
      let lo = prevT;
      let hi = t;
      for (let j = 0; j < 50; j++) {
        const mid = 0.5 * (lo + hi);
        if (strainAt(model, mid) >= breakStrain) hi = mid; else lo = mid;
      }
      return hi;
    }
    prevT = t;
  }
  return null;
}

// Launch-frame time of the rear ship's event whose line of simultaneity
// (in its momentary rest frame) passes through the event (x, t).
export function rearTimeFor(model, x, t) {
  const g = (tB) => { const B = shipState(model, 0, tB); return t - tB - B.v * (x - B.x); };
  let lo = t - 10 * (1 + Math.abs(x)), hi = t + 1e-9;
  while (g(lo) < 0) lo -= 10 * (1 + Math.abs(x));
  for (let k = 0; k < 80; k++) { const mid = 0.5 * (lo + hi); if (g(mid) > 0) lo = mid; else hi = mid; }
  return 0.5 * (lo + hi);
}

// Speed above which a thread with the given breaking elongation must break in
// Bell's case: gamma - 1 = breakStrain once both ships coast.
export function criticalBeta(breakStrain) {
  const g = 1 + breakStrain;
  return Math.sqrt(1 - 1 / (g * g));
}

export const gammaOf = (v) => 1 / Math.sqrt(1 - v * v);
