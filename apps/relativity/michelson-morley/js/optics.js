// Michelson–Morley: light pulses in the two arms of a moving interferometer.
// Units: c = 1, L = 1 (each arm's length at rest). Times in L/c.
//
// Pictures:
//   'classical' — 1887 expectation: light moves at c through a resting ether; the
//                 apparatus moves at v and keeps its rest shape and its clock rate.
//   'lorentz'   — a frame in which the apparatus moves at v: the
//                 apparatus is shorter along the motion by 1/γ and its clocks run slow.
//   'einstein'  — the apparatus's own rest frame.
//
// Arm 1 points at angle θ to the direction of motion (θ measured in the apparatus's rest
// frame), arm 2 at θ + 90°. The splitter is at the origin at t = 0 and moves along +x.

export const gammaOf = (beta) => 1 / Math.sqrt(1 - beta * beta);

// Rest-frame direction of each arm and of its mirror face.
export function restArms(theta) {
  const c = Math.cos(theta), s = Math.sin(theta);
  return [
    { dir: [c, s], mirror: [-s, c] },
    { dir: [-s, c], mirror: [-c, -s] },
  ];
}

// A rest-frame vector as it is in the frame used to draw the account.
export function shapeVector([x, y], account, beta) {
  if (account === 'lorentz') return [x / gammaOf(beta), y];
  return [x, y];
}

// Out-and-back light times for a mirror at vector R from the splitter, the apparatus
// moving at speed v along +x through a frame in which light has speed 1.
// Out:  |R + v t e_x| = t.   Back: |R + v t1 e_x - (v (t1 + t2) e_x)| = t2.
export function roundTrip(R, v) {
  const [rx, ry] = R;
  const r2 = rx * rx + ry * ry, k = 1 - v * v;
  const root = Math.sqrt(v * v * rx * rx + k * r2);
  return { t1: (v * rx + root) / k, t2: (-v * rx + root) / k };
}

// The relativistic picture is the same in both accounts: 'lorentz' (alias 'moving') is a
// frame in which the apparatus moves and is contracted; 'einstein' (alias 'rest') is the
// apparatus's rest frame. The accounts differ in how they read these pictures, not in the
// pictures. ('ether' and 'apparatus' are the 0.2.0 names.)
const ALIAS = { moving: 'lorentz', rest: 'einstein', ether: 'lorentz', apparatus: 'einstein' };

export function makeRun({ beta, theta, account: name }) {
  const account = ALIAS[name] || name;
  const v = account === 'einstein' ? 0 : beta;
  const gamma = gammaOf(beta);
  const arms = restArms(theta).map((a) => {
    const R = shapeVector(a.dir, account, beta);
    const M = shapeVector(a.mirror, account, beta);
    const { t1, t2 } = roundTrip(R, v);
    return { R, M, t1, t2, T: t1 + t2, Mhit: [R[0] + v * t1, R[1]] };
  });
  // Rate of the clock carried by the apparatus, per unit time of the drawing frame.
  const clockRate = account === 'lorentz' ? 1 / gamma : 1;
  const tEnd = Math.max(arms[0].T, arms[1].T);
  return { account, beta, theta, v, gamma, arms, clockRate, tEnd };
}

export const splitterX = (run, t) => run.v * t;

// Position of the pulse in arm i at time t (frame of the drawing), and its stage.
export function pulseAt(run, i, t) {
  const a = run.arms[i];
  if (t <= 0) return { x: 0, y: 0, stage: 'waiting' };
  if (t < a.t1) { const s = t / a.t1; return { x: a.Mhit[0] * s, y: a.Mhit[1] * s, stage: 'out' }; }
  if (t < a.T) {
    const s = (t - a.t1) / a.t2, end = run.v * a.T;
    return { x: a.Mhit[0] + (end - a.Mhit[0]) * s, y: a.Mhit[1] * (1 - s), stage: 'back' };
  }
  return { x: run.v * a.T, y: 0, stage: 'back-home' };
}

// Closed form of the 1887 expectation for an arm at angle α to the motion:
// T = 2 γ² √(1 − β² sin² α).
export function classicalTime(beta, alpha) {
  const g = gammaOf(beta);
  return 2 * g * g * Math.sqrt(1 - beta * beta * Math.sin(alpha) ** 2);
}

// Arrival-time difference arm 1 − arm 2, in the drawing frame, for each account.
export function delay(beta, theta, account) {
  const r = makeRun({ beta, theta, account });
  return r.arms[0].T - r.arms[1].T;
}

// A marker at rest in the ether frame at x = X, seen in the apparatus's rest frame at
// apparatus time t': x' = X/γ − v t'. (Lorentz transformation of the worldline x = X.)
export const markerInApparatusFrame = (X, beta, tPrime) => X / gammaOf(beta) - beta * tPrime;
