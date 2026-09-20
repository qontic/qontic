const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../js/packet-engine.js'), 'utf8');
const config = source.slice(source.indexOf(' function config(){'), source.indexOf(' function emissionPeriod()'));
const fingerprint = source.match(/ function configFingerprint\(value\)\{[^\n]+/)[0];
const ensure = source.match(/ function ensure\(\)\{[^\n]+/)[0];
const context = vm.createContext({
  length: {value: 50}, width: {value: 30}, sourceWidth: {value: 200}, interval: {},
  sourcePos: 200, detectorDistance: 400, wavelength: 10, nDetectorPixels: 64,
  screenHeight: 600, slitSeparation: 150, slit1Open: true, slit2Open: true,
  worldCanvasDx: 905, particleType: 'electron',
  sourceXWorld: 90.5, slit1YWorld: 225, slit2YWorld: 375,
  document: {getElementById: () => ({value: 100})}, syncPacketInput() {}, syncSlowPacketMode() {},
  resets: 0, hits: [2, 7, 4], nHits: 13, elapsed: 42,
});
vm.runInContext(config + fingerprint + ensure + `
  let p=config(), fingerprint=configFingerprint(p);
  function resetEngine(){resets++;hits.fill(0);nHits=0;elapsed=0;p=config();fingerprint=configFingerprint(p);}
`, context);
// Reproduce the geometry conversion performed by setupGeo across both directions.
for (const mode of ['electron', 'neutron', 'photon']) {
  context.particleType = mode;
  vm.runInContext('p=config();fingerprint=configFingerprint(p);', context);
  for (const [width, height] of [[800,600],[1537,913],[800,600],[431,377],[1920,1080],[800,600]]) {
    context.sourceXWorld = (width * .1) * (1 / (width / context.worldCanvasDx));
    context.slit1YWorld = (height / 2 - context.slitSeparation * (height / context.screenHeight) / 2) * (1 / (height / context.screenHeight));
    context.slit2YWorld = (height / 2 + context.slitSeparation * (height / context.screenHeight) / 2) * (1 / (height / context.screenHeight));
    vm.runInContext('ensure()', context);
    assert.equal(context.resets, 0, 'display resize must not reset the experiment');
    assert.deepEqual(context.hits, [2,7,4]);
    assert.equal(context.nHits, 13);
    assert.equal(context.elapsed, 42);
  }
}
context.slitSeparation += 10;
vm.runInContext('ensure()', context);
assert.equal(context.resets, 1, 'a physical geometry change must still reset');
assert.equal(context.nHits, 0);
console.log('PASS: repeated expand/restore preserves histogram and time; geometry changes still reset.');
