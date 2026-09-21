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
assert(engine.includes('sampleTransmittedSource(p,Math.random,a.x0,directed.checked?3:null)'));
assert(!engine.includes('const attempts=') && !engine.includes('attempt<20000'));

// Slit coloring is display-only metadata assigned after successful wall
// transmission, and live geometry previews discard the obsolete hit record.
assert(model.indexOf("return 'absorbed'") < model.indexOf('a.slitSide='));
assert(engine.includes('packet-color-by-slit'));
assert(engine.includes("slitColors={upper:'#22d3ee',lower:'#ff9f43'}"));
assert(engine.includes('pending.push({index,cohort:a.cohort,slitSide:a.slitSide})'));
assert(engine.includes("for(const [side,offset] of [['upper',-2.5],['lower',2.5]])"));
assert(engine.includes('slitError=Math.sqrt(count)*scale'));
assert(engine.includes("drawMarker(n-(slitHits.upper?.[i]||0)-(slitHits.lower?.[i]||0),null,0)"));
assert(engine.includes('clearHitsForPreview()'));
assert(engine.includes("sampleTransmittedSource(p,Math.random,null,3)"));
assert(engine.includes('const half=3*(slitPreviewWidth??p.sy*100)*toCanvasY'));
assert(content.includes('finite slit core extending ±3σₐ'));

console.log('PASS: packet engine is authoritative; Physics and Views match the active model.');
