const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const shell = read('js/double-slit.js');
const engine = read('js/packet-engine.js');
const model = read('js/source-packet-model.js');
const content = read('js/physics-content.js');
const html = read('index.html');

// The legacy shell delegates active physics and drawing to the packet engine,
// without retaining the retired point-source guidance implementation.
for (const method of ['reset', 'histogram', 'drawWave', 'draw', 'frame']) {
  assert(new RegExp(`qonticPacketEngine\\??\\.${method}\\(`).test(shell), `missing packet-engine hook ${method}`);
}
for (const retired of ['psiPointFunction', 'computeBohmianVelocity', 'precomputeYArrayWithFixedX']) {
  assert(!shell.includes(retired), `retired 1/r routine still shipped: ${retired}`);
}

// Physics and Views have one authoritative source. Static HTML contains empty
// mount points instead of the obsolete stationary-wave explanation.
assert.match(html, /id="math-container" aria-busy="true"><\/div>/);
assert.match(html, /id="rationale" aria-busy="true"><\/div>/);
for (const stale of ['outgoing point-source waves', 'screen endpoints and backtracked', 'stationary analytical construction']) {
  assert(!html.includes(stale), `stale explanatory text remains: ${stale}`);
}

// Displayed equations and prose describe the implemented reduced model.
for (const equation of ['schrodinger', 'exactEnvelope', 'approxEnvelope', 'packet', 'propagation', 'mask', 'probability', 'guidance']) {
  assert(content.includes(`"${equation}"`), `missing displayed equation ${equation}`);
}
for (const statement of ['forward, paraxial approximation', 'Direct PW', 'Part./packet', 'Phase colors show cos θ']) {
  assert(content.includes(statement), `missing current Views/Physics statement: ${statement}`);
}

// New packets and in-flight interpretation changes use analytical conditional
// transmission sampling; no bounded rejection loop remains.
assert(model.includes('finite Gaussian mixture'));
assert(engine.includes('sampleTransmittedSource(p,Math.random,a.x0)'));
assert(!engine.includes('const attempts=') && !engine.includes('attempt<20000'));

console.log('PASS: packet engine is authoritative; Physics and Views match the active model.');
