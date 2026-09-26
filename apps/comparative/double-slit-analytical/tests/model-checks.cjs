const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const shell = read('js/double-slit.js');
const engine = read('js/packet-engine.js');
const model = read('js/source-packet-model.js');
const surface = read('js/packet-surface-3d.js');
const template = read('js/qontic-template.js');
const palette = read('js/palette.js');
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
assert(content.includes('orthogonal which-slit detector records'));
assert(content.includes('incoherent sum'));

// New packets and in-flight interpretation changes use analytical conditional
// transmission sampling; no bounded rejection loop remains.
assert(model.includes('finite Gaussian mixture'));
assert(engine.includes('sampleTransmittedSource(p,Math.random,a.x0,directed.checked?3:null)'));
assert(!engine.includes('const attempts=') && !engine.includes('attempt<20000'));

// Slit coloring is display-only metadata assigned from the analytically known
// aperture-plane crossing at injection, and remains stable across the wall.
assert(model.includes('const slitSide=classifySlitSide(wallY,p)'));
assert(model.includes('a.slitSide=classifySlitSide(a.y,p)'));
assert(engine.includes('packet-particle-color'));
assert(engine.includes('<option value="spectrum">Spectrum</option>'));
assert(engine.includes('spectrumIndex(a.wallY)'));
assert(model.includes('wallY:yWall'));
assert(engine.includes('event.wallY'));
assert(engine.includes("particleColorMode.value==='uniform')markerColor=colorPart"));
assert(engine.includes('spectrumHitSums[i]/spectrumHitCounts[i]'));
assert(engine.includes('packet-core-options'));
assert(engine.includes('packet-slit-balance'));
assert(engine.includes('apertureWeights'));
assert(engine.includes('return (sourcePos+detectorDistance)/.7'));
assert(shell.includes("updateParameter('detector-distance', 50, 3000"));
assert(engine.includes("slitColors={upper:'#22d3ee',lower:'#ff9f43'}"));
assert(engine.includes('pending.push({index,cohort:a.cohort,slitSide:a.slitSide,wallY:a.wallY})'));
assert(engine.includes("directedRow.innerHTML='Direct PW <input"));
assert(!engine.includes('coreConditionedProfile'));
assert(!model.includes('coreConditionedProfile'));
assert(engine.includes('const upperDisplay=upper+'));
assert(engine.includes('const markerColor=upperDisplay>=lowerDisplay?slitColors.upper:slitColors.lower'));
assert(engine.includes('packet-balance-equal'));
assert(engine.includes("balance.value='0'"));
assert(shell.includes("$('#animationStep-group').hide()"));
assert(engine.includes('clearHitsForPreview()'));
assert(engine.includes('sampleTransmittedSource(p,Math.random,null,3)'));
assert(engine.includes("const displayExtentSigma=()=>interpretation==='bohmian'&&directed.checked?3:"));
assert(engine.includes('const half=displayExtentSigma()*(slitPreviewWidth??p.sy*100)*toCanvasY'));
assert(engine.includes('maximumCoreSafeSeparation'));
assert(content.includes('finite slit core extending ±nσₐ'));
assert(model.includes('sourceComponents'));
assert(model.includes('if(p.whichPath)'));
assert(engine.includes("whichPathDetector!=='none'&&next.centers.length===2"));
assert(engine.includes('setWhichPath(){resetEngine();draw();}'));
assert(surface.includes('state.showWave&&state.heights?sampleHeight'));
assert(engine.includes("colors=[[34,211,238],[255,159,67]]"));
assert(template.includes('context.createLinearGradient(0, 0, canvas.width, 0)'));
assert(template.includes('window.qonticUpdateWavePalettePreview = updateWavePalettePreview'));
assert(palette.includes('window.qonticUpdateWavePalettePreview?.()'));

console.log('PASS: packet engine is authoritative; Physics and Views match the active model.');
