// Exercise the real verdict and challenge handlers without a rendering canvas.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { makeModel, finalStrain, findBreak } from '../js/kinematics.js';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const nodes = new Map();
const $ = (key) => {
  if (!nodes.has(key)) nodes.set(key, {
    innerHTML: '', focus() {},
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
});
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
console.log('Feedback checks passed: survival, second challenge, low-speed wording, Born-rigid success');
