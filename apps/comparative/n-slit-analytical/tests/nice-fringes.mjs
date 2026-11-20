// "Nice fringes" search: the chosen geometry gives a clean series of bumps,
// central one tallest and heights falling off, on the app's own screen density.
import assert from 'node:assert/strict';
import {niceFringeGeometry, scoreProfile} from '../js/nice-fringes.js';
let checks = 0;
for (const [N, open] of [[2, [0, 1]], [3, [0, 1, 2]], [5, [0, 1, 2, 3, 4]], [8, [0, 1, 2, 3, 4, 5, 6, 7]]]) {
  const r = niceFringeGeometry({N, openIds: open});
  assert(r, `N=${N}: a geometry is found`);
  const c = r.heights.indexOf(1);
  assert(r.count >= 5, `N=${N}: at least five bumps (${r.count})`);
  assert(Math.abs(r.peaks[c]) < r.d / 4 + 1, `N=${N}: tallest bump on the axis`);
  for (let i = c + 1; i < r.heights.length; i++) assert(r.heights[i] < r.heights[i - 1], `N=${N}: heights fall off to the right`);
  for (let i = c - 1; i >= 0; i--) assert(r.heights[i] < r.heights[i + 1], `N=${N}: heights fall off to the left`);
  assert(r.screen <= 5000 && r.D <= 3000 && r.sigma >= 30 && r.wavelength <= 50, `N=${N}: within the app's ranges`);
  assert(r.screen >= (N - 1) * r.d + 6 * r.sigma, `N=${N}: all slit cores fit on the wall`);
  console.log(`PASS  N=${N}: σ ${r.sigma} nm, d ${r.d} nm, D ${r.D} nm, screen ${r.screen} nm, ${r.count} bumps, heights ${r.heights.map((h) => h.toFixed(2)).join(' ')}`);
  checks++;
}
assert(niceFringeGeometry({N: 1, openIds: [0]}) === null, 'one slit: no fringes to adjust'); checks++;
// the scorer rejects a pattern whose central bump is not the tallest
const ys = Array.from({length: 401}, (_, i) => -10 + i * .05), bad = ys.map((y) => (1 + Math.cos(2 * y)) * Math.exp(-((Math.abs(y) - 4) ** 2) / 8));
const good = ys.map((y) => (1 + Math.cos(2 * y)) * Math.exp(-(y * y) / 18));
assert(scoreProfile(ys, good).score < scoreProfile(ys, bad).score, 'scorer prefers a central maximum'); checks++;
console.log(JSON.stringify({passed: true, checks}));
