// Run with: node apps/relativity/bell-spaceships/tests/kinematics.test.mjs
import assert from 'node:assert/strict';
import { finalStrain, makeModel, shipState, rearFrameView, strainAt, strainRearFrame, findBreak, criticalBeta, runEnd, gammaOf, rearTimeFor, localStrainAt, peakStrainAt, maxFrontSetting } from '../js/kinematics.js';

const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log('ok', name); };

test('Bell: launch-frame separation stays L', () => {
  const m = makeModel({ beta: 0.9, accel: 0.6, mode: 'bell' });
  for (const t of [-0.3, 0, 0.5, 2, m.ships[0].t1, 8]) {
    close(shipState(m, 1, t).x - shipState(m, 0, t).x, 1, 1e-12, `t=${t}`);
  }
});

test('Bell: rear-frame separation is gamma L while coasting', () => {
  const m = makeModel({ beta: 0.9, accel: 0.6, mode: 'bell' });
  const t = m.ships[0].t1 + 1;
  close(rearFrameView(m, t).D, m.gammaF, 1e-9, 'D');
  close(rearFrameView(m, t).vRel, 0, 1e-12, 'vRel');
});

test('Bell: front clock ahead by gamma beta L while coasting', () => {
  const m = makeModel({ beta: 0.6, accel: 0.8, mode: 'bell' });
  const v = rearFrameView(m, m.ships[0].t1 + 2);
  close(v.tauC - v.tauB, m.gammaF * m.beta, 1e-9, 'clock offset');
});

test('Rigid: rear-frame separation stays L throughout', () => {
  const m = makeModel({ beta: 0.95, accel: 0.9, mode: 'rigid' });
  for (const t of [0.1, 1, 3, m.ships[0].t1, m.ships[1].t1, m.ships[1].t1 + 2]) {
    close(rearFrameView(m, t).D, 1, 1e-9, `t=${t}`);
  }
});

test('Rigid: launch-frame separation contracts to L/gamma', () => {
  const m = makeModel({ beta: 0.8, accel: 0.5, mode: 'rigid' });
  const t = m.ships[1].t1 + 1;
  close(shipState(m, 1, t).x - shipState(m, 0, t).x, 1 / m.gammaF, 1e-9, 'sep');
});

test('Rigid: front proper acceleration is a/(1+aL)', () => {
  const m = makeModel({ beta: 0.8, accel: 0.5, mode: 'rigid' });
  close(m.ships[1].a, 0.5 / 1.5, 1e-15, 'a_front');
});

test('Proper time and velocity consistent (dtau/dt = 1/gamma)', () => {
  const m = makeModel({ beta: 0.9, accel: 0.6, mode: 'bell' });
  for (const t of [0.7, 2.5, 6]) {
    const h = 1e-6;
    const dtau = (shipState(m, 0, t + h).tau - shipState(m, 0, t - h).tau) / (2 * h);
    close(dtau, 1 / gammaOf(shipState(m, 0, t).v), 1e-6, `t=${t}`);
    const dx = (shipState(m, 0, t + h).x - shipState(m, 0, t - h).x) / (2 * h);
    close(dx, shipState(m, 0, t).v, 1e-6, `v t=${t}`);
  }
});

test('Break threshold matches critical speed', () => {
  const eps = 0.2;
  const bc = criticalBeta(eps);
  close(gammaOf(bc) - 1, eps, 1e-12, 'gamma at bc');
  assert.ok(findBreak(makeModel({ beta: bc + 0.02, mode: 'bell' }), eps) !== null, 'breaks above');
  assert.equal(findBreak(makeModel({ beta: bc - 0.02, mode: 'bell' }), eps), null, 'holds below');
  assert.equal(findBreak(makeModel({ beta: 0.99, mode: 'rigid' }), 0.01), null, 'rigid never breaks');
});

test('Bell: launch-frame strain is exactly gamma(v) - 1', () => {
  const m = makeModel({ beta: 0.9, accel: 0.2, mode: 'bell' });
  for (const t of [0.5, 2, 5, 12]) close(strainAt(m, t), gammaOf(shipState(m, 0, t).v) - 1, 1e-12, `t=${t}`);
});

test('Bell: the thread snaps exactly when the ships reach the critical speed', () => {
  const eps = 0.2, m = makeModel({ beta: 0.9, accel: 0.2, mode: 'bell' });
  close(shipState(m, 0, findBreak(m, eps)).v, criticalBeta(eps), 1e-9, 'v at break');
});

test('Rear-frame strain also bounded by gamma_f - 1, equal once coasting', () => {
  const m = makeModel({ beta: 0.9, accel: 0.6, mode: 'bell' });
  const end = runEnd(m);
  for (let k = 0; k <= 200; k++) {
    const s = strainRearFrame(m, (end * k) / 200);
    assert.ok(s >= -1e-12 && s <= m.gammaF - 1 + 1e-9, `strain ${s}`);
  }
  close(strainRearFrame(m, end), strainAt(m, end), 1e-9, 'coasting');
});

test('Rigid: thread unstretched at every moment, even for strong acceleration', () => {
  for (const [a, beta] of [[0.2, 0.9], [1, 0.9], [1, 0.99]]) {
    const m = makeModel({ beta, accel: a, k: 1 });
    const end = runEnd(m);
    for (let i = 1; i <= 300; i++) assert.ok(Math.abs(strainAt(m, (end * i) / 300)) < 0.003, `a=${a} beta=${beta}`);
  }
});

test('Rigid: launch-frame strain stays within 2.5% of zero at a = 0.2', () => {
  const m = makeModel({ beta: 0.95, accel: 0.2, mode: 'rigid' });
  const end = runEnd(m);
  for (let k = 0; k <= 200; k++) assert.ok(Math.abs(strainAt(m, (end * k) / 200)) < 0.025);
});

test('rearTimeFor inverts the rear frame simultaneity', () => {
  const m = makeModel({ beta: 0.9, accel: 0.3, mode: 'bell' });
  for (const tB of [0.5, 3, 8]) { const v = rearFrameView(m, tB); close(rearTimeFor(m, 0.5 * (v.xB + v.xC), 0.5 * (v.tB + v.tC)), tB, 1e-7, `tB=${tB}`); }
});

test('Final stretch is (gamma - 1)(1 - k) for any front-engine setting', () => {
  for (const k of [0, 0.3, 0.8, 1, 1.4]) {
    const m = makeModel({ beta: 0.85, accel: 0.25, k });
    close(strainAt(m, runEnd(m)), finalStrain(m), 1e-9, `k=${k}`);
    close(finalStrain(m), (m.gammaF - 1) * (1 - k), 1e-15, 'formula');
  }
});

test('Only k = 1 keeps the thread unstretched; k slightly off stretches or slackens it', () => {
  const at = (k) => finalStrain(makeModel({ beta: 0.9, accel: 0.2, k }));
  assert.ok(at(0.9) > 0.1 && at(1.1) < -0.1 && Math.abs(at(1)) < 1e-12);
});

test('Local stretch agrees with independent neighbouring-worldline distances', () => {
  for (const k of [0, 0.5, 1, 1.4]) {
    const m = makeModel({ beta: 0.9, accel: 1, k });
    for (const t of [0.3, 1, 2, runEnd(m)]) {
      const h = 1e-5, x0 = 0.4;
      const sample = (x) => {
        const a = m.accel / (1 + m.k * m.accel * x);
        const t1 = m.gammaF * m.beta / a;
        const tc = Math.min(t, t1);
        return x + (Math.sqrt(1 + (a * tc) ** 2) - 1) / a + m.beta * Math.max(0, t - t1);
      };
      const a = m.accel / (1 + m.k * m.accel * x0);
      const v = Math.min(m.beta, a * t / Math.sqrt(1 + (a * t) ** 2));
      const measured = gammaOf(v) * (sample(x0 + h) - sample(x0 - h)) / (2 * h) - 1;
      close(localStrainAt(m, x0, t), measured, 1e-7, `k=${k}, t=${t}`);
    }
  }
});

test('An intermediate setting breaks at the rear local limit, before the mean limit', () => {
  for (const accel of [0.2, 1]) {
    const m = makeModel({ beta: 0.9, accel, k: 0.5 });
    const t = findBreak(m, 0.2);
    close(t, Math.sqrt(1.4 ** 2 - 1) / accel, 1e-12, 'local failure time');
    close(peakStrainAt(m, t), 0.2, 1e-12, 'rear at limit');
    assert.ok(strainAt(m, t) < 0.2, 'mean is still below limit');
    for (const el of m.elements) assert.ok(localStrainAt(m, el.x0, t - 1e-5) < 0.2);
  }
});

test('Every allowed worldline remains ordered, even at maximum speed and k', () => {
  for (const beta of [0.05, 0.8, 0.95, 0.99]) {
    const m = makeModel({ beta, accel: 1, k: 1.5 });
    assert.equal(m.k, maxFrontSetting(beta), 'model clamps shared-link settings too');
    for (let i = 0; i <= 100; i++) {
      const t = runEnd(m) * i / 100;
      assert.ok(shipState(m, 1, t).x > shipState(m, 0, t).x, 'ships stay ordered');
      for (const el of m.elements) assert.ok(localStrainAt(m, el.x0, t) >= -0.950000001);
    }
  }
});

test('Surviving and unstretched are different outcomes, including low speeds', () => {
  const held = makeModel({ beta: 0.9, accel: 1, k: 0.9 });
  assert.equal(findBreak(held, 0.2), null);
  assert.ok(finalStrain(held) > 0.12 && finalStrain(held) < 0.13);
  const slow = makeModel({ beta: 0.05, k: 0 });
  assert.ok(finalStrain(slow) > 0 && finalStrain(slow) < 0.005);
  const rigid = makeModel({ beta: 0.99, k: 1 });
  assert.equal(peakStrainAt(rigid, runEnd(rigid) / 2), 0);
});

console.log(`${passed} tests passed`);
