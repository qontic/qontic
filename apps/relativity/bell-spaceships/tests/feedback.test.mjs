// Exercise the real verdict and challenge handlers without a rendering canvas.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { makeModel, finalStrain, findBreak } from '../js/kinematics.js';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const nodes = new Map();
const $ = (key) => {
  if (!nodes.has(key)) nodes.set(key, {
    innerHTML: '', focus() {}, scrollIntoView() {},
    addEventListener(_, fn) { this.handler = fn; },
    insertAdjacentHTML(_, html) { this.innerHTML += html; },
  });
  return nodes.get(key);
};
const state = { k: 0.9, beta: 0.9, breakStrain: 0.2, layout: 'lab', explore: true, challenge: 'hold', tries: 0 };
const context = vm.createContext({
  $, state, model: null, breakEvent: null, finalStrain,
  fmt: (x) => x.toFixed(2),
  stretchPercent: (x) => (Math.abs(x) * 100).toFixed(Math.abs(x) < 0.01 ? 2 : 0),
  revealExplore() {}, revealRigid() { state.rigidShown = true; },
  showStep(step) { state.step = step; },
  T0: -0.75,
  tEnd: 10,
  controlsEl: { setAttribute() {} },
});
vm.runInContext(source.slice(source.indexOf('function start()'), source.indexOf('// Section tabs')), context);
state.askedOnce = false;
state.prediction = null;
assert.equal(vm.runInContext('start()', context), false, 'Start cannot bypass the first question');
assert.equal(state.running, false);
assert.equal(state.askedOnce, false);
assert.equal(state.step, 'question');
state.prediction = 'holds';
assert.equal(vm.runInContext('start()', context), true);
assert.equal(state.askedOnce, true);
assert.equal(state.running, true);
state.prediction = null;
assert.equal(vm.runInContext('start()', context), true, 'later runs do not require another answer');
vm.runInContext(source.slice(source.indexOf('function finish()'), source.indexOf('let last = performance.now()')), context);
const finish = (k, beta = 0.9) => {
  state.k = k; state.beta = beta;
  context.model = makeModel({ k, beta });
  assert.equal(findBreak(context.model, state.breakStrain), null);
  context.breakEvent = null;
  vm.runInContext('finish()', context);
};
const clickNext = (key) => $('#nextSteps').handler({ target: { closest: () => ({ dataset: { next: key } }) } });

finish(0.9);
assert.equal(state.challenge, false, 'survival completes the hold challenge');
assert.match($('#verdict').innerHTML, /You kept it intact/);
assert.match($('#nextSteps').innerHTML, /Can you keep it unstretched/);
assert.doesNotMatch($('#nextSteps').innerHTML, /Show me a setting/);

clickNext('unstretched');
assert.equal(state.challenge, 'unstretched');
finish(0, 0.05);
assert.equal(state.challenge, 'unstretched', 'small stretch is not Born-rigid success');
assert.match($('#verdict').innerHTML, /stretched by 0.13%/);
assert.doesNotMatch($('#verdict').innerHTML, /held, unstretched|Born-rigid/);
assert.match($('#nextSteps').innerHTML, /Show me a setting/);

finish(1);
assert.equal(state.challenge, false);
assert.equal(state.rigidShown, true);
assert.match($('#verdict').innerHTML, /held, unstretched/);

for (const [prediction, expected] of [['holds', 'Correct'], ['snaps', 'Wrong'], ['depends', 'Wrong']]) {
  state.prediction = prediction;
  finish(0.9);
  assert.ok($('#verdict').innerHTML.startsWith(`<strong>${expected}.</strong>`));
}
// Check the same three answers for the default breaking run.
context.uneven = () => false;
context.snapState = () => ({ v: 0.553, vB: 0.553, vC: 0.553, gap: 1, nat: 1 / 1.2, strain: 0.2 });
context.model = makeModel();
context.breakEvent = { t: findBreak(context.model, 0.2) };
state.k = 0; state.beta = 0.9;
for (const [prediction, expected] of [['snaps', 'Correct'], ['holds', 'Wrong'], ['depends', 'Wrong']]) {
  state.prediction = prediction;
  vm.runInContext('finish()', context);
  assert.ok($('#verdict').innerHTML.startsWith(`<strong>${expected}.</strong>`));
}
state.lastPrediction = { p: 'holds', beta: state.beta, eps: state.breakStrain, k: state.k };
state.prediction = null;
vm.runInContext('finish()', context);
assert.ok($('#verdict').innerHTML.startsWith('<strong>Wrong.</strong>'), 'rerun retains prediction feedback');
console.log('Feedback checks passed: required first answer, reruns, all answers for both outcomes, challenges and low-speed wording');
