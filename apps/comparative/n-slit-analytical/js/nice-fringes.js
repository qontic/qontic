// "Nice fringes": choose slit width, separation, screen distance, screen length
// and source width so that the screen shows a clean series of bumps with the
// central one tallest. Every candidate is judged on the screen density computed
// with the app's own analytical model (sourceProfile), not on a formula.
// No DOM; importable from node. Lengths in nm.
import {sourceProfile} from './source-packet-model.js?cache=nslit30';

export const NICE_LIMITS = Object.freeze({
  wavelength: 50, slitWidth: [30, 200], separation: [0, 2000], distance: [50, 3000], screen: [120, 5000], sourceWidth: [50, 400],
});

function model({openIds, N, sigma, d, D, sourceSigma, wall, lambda}) {
  const sign = (k) => 2 * k - (N - 1);
  return {
    sx: .5, sy: sigma / 100, k: 2 * Math.PI * 100 / lambda, wall: wall / 100, screen: (wall + D) / 100, sourceSigma: sourceSigma / 100,
    slitIds: openIds, centers: openIds.map((k) => sign(k) * d / 200), apertureWeights: openIds.map(() => 1),
  };
}

// Score a screen profile: lower is better; Infinity rejects the candidate.
export function scoreProfile(ys, values, {target = 7, threshold = .15} = {}) {
  const max = Math.max(...values);
  if (!(max > 0)) return {score: Infinity};
  const v = values.map((x) => x / max), peaks = [];
  for (let i = 1; i < v.length - 1; i++) if (v[i] >= threshold && v[i] >= v[i - 1] && v[i] > v[i + 1]) peaks.push(i);
  if (peaks.length < 3) return {score: Infinity};
  const c = peaks.reduce((a, b) => (v[b] > v[a] ? b : a), peaks[0]), ci = peaks.indexOf(c);
  let score = .8 * Math.abs(peaks.length - target);
  // heights must fall off on both sides of the central bump
  for (let i = ci + 1; i < peaks.length; i++) if (v[peaks[i]] > v[peaks[i - 1]] * 1.02) score += 3;
  for (let i = ci - 1; i >= 0; i--) if (v[peaks[i]] > v[peaks[i + 1]] * 1.02) score += 3;
  // the central bump clearly tallest
  const second = Math.max(...peaks.filter((i) => i !== c).map((i) => v[i]));
  // The central bump must be clearly the tallest: reject (do not just penalize)
  // patterns with two equal central peaks, which at many slits are near-field
  // images of the grating rather than fringes.
  if (second > .97) return {score: Infinity};
  if (second > .9) score += 30 * (second - .9);
  // good contrast between neighbouring bumps
  for (let i = 1; i < peaks.length; i++) {
    let low = Infinity; for (let j = peaks[i - 1]; j <= peaks[i]; j++) low = Math.min(low, v[j]);
    const rel = low / Math.min(v[peaks[i]], v[peaks[i - 1]]);
    if (rel > .2) score += 2 * (rel - .2);
  }
  // symmetric pattern for a symmetric slit set: centre bump at the centre
  return {score, peaks: peaks.map((i) => ys[i]), heights: peaks.map((i) => v[i]), centre: ys[c], count: peaks.length};
}

// Search the geometry for N slits with the given open set. wall = source-to-wall
// distance (kept as it is). Returns the best settings and what they give.
export function niceFringeSearch({N, openIds, wall = 225, extentSigma = 1.5, target = 7}) {
  if (!openIds || openIds.length < 2) return null;
  const lambda = NICE_LIMITS.wavelength, signs = openIds.map((k) => 2 * k - (N - 1));
  const outer = Math.max(1, ...signs.map(Math.abs)), span = Math.max(...signs) - Math.min(...signs);
  const ycentre = (Math.max(...signs) + Math.min(...signs)) / 4; // in units of d
  const fit = Math.max(3, extentSigma);
  const evaluate = (sigma, d, D, sourceSigma, samples) => {
    const k = 2 * Math.PI / lambda, s = Math.hypot(sigma, D / (2 * k * sigma));
    const R = Math.min(2500, span * d / 2 + 3.5 * s), yc = ycentre * d;
    const p = model({openIds, N, sigma, d, D, sourceSigma, wall, lambda});
    const prof = sourceProfile(p, (yc - R) / 100, (yc + R) / 100, samples);
    const ys = prof.values.map((_, i) => yc - R + (2 * R * i) / (samples - 1));
    const r = scoreProfile(ys, prof.values, {target});
    if (!Number.isFinite(r.score)) return null;
    // Screen: the counted bumps plus half a fringe on each side, centred on the axis.
    const reach = Math.max(...r.peaks.map((y) => Math.abs(y))), fringe = (r.peaks.at(-1) - r.peaks[0]) / Math.max(1, r.peaks.length - 1);
    const screen = Math.ceil((2 * (reach + .7 * fringe)) / 10) * 10;
    const needed = outer * d + 2 * fit * sigma + 20; // every slit core on the wall
    if (screen > NICE_LIMITS.screen[1] || screen < Math.max(NICE_LIMITS.screen[0], needed)) return null;
    // Mean spacing of the bumps against the far-field (Fraunhofer) spacing λD/d.
    const spacing = (r.peaks.at(-1) - r.peaks[0]) / Math.max(1, r.peaks.length - 1), farField = lambda * D / d;
    // Prefer spacing near λD/d, the period of the pattern where the slit beams overlap.
    // This is not a far-field test: with three or more slits every pattern within the
    // app's distances is near-field (see Physics, Near and far field).
    const regime = Math.abs(spacing / farField - 1);
    return {score: r.score + 6 * regime, sigma, d, D, sourceSigma, screen, count: r.count, peaks: r.peaks, heights: r.heights, spacing, farField};
  };
  // Coarse grid, then a finer one around the best candidate. Written as a
  // generator so the app can run it in short slices without pausing the animation.
  function* search() {
    let best = null;
    const consider = (c) => { if (c && (!best || c.score < best.score)) best = c; };
    // The widest source lights the slits most evenly and the narrowest slits spread
    // most; earlier full searches always picked them, so the coarse grid starts there.
    for (const sigma of [30, 40])
      for (const sourceSigma of [400])
        for (let D = 600; D <= 3000; D += 400)
          for (let d = 4 * sigma; d <= Math.min(1500, 40 * sigma); d += 40) { consider(evaluate(sigma, d, D, sourceSigma, 161)); yield; }
    if (!best) for (const sigma of [30, 50]) for (let D = 600; D <= 3000; D += 400)
      for (let d = 4 * sigma; d <= Math.min(1500, 40 * sigma); d += 40) { consider(evaluate(sigma, d, D, 200, 161)); yield; }
    if (!best) return null;
    const c = best;
    for (let D = Math.max(400, c.D - 200); D <= Math.min(3000, c.D + 200); D += 100)
      for (let d = Math.max(60, c.d - 30); d <= c.d + 30; d += 10) { consider(evaluate(c.sigma, d, D, c.sourceSigma, 321)); yield; }
    // Report the final choice on a fine grid.
    return {...(evaluate(best.sigma, best.d, best.D, best.sourceSigma, 1201) || best), wavelength: lambda};
  }
  return search();
}

// Synchronous use (tests, node).
export function niceFringeGeometry(options) {
  const it = niceFringeSearch(options);
  if (!it) return null;
  let r; do r = it.next(); while (!r.done);
  return r.value;
}
// In the page: slices of `slice` ms between animation frames.
// The app pauses the animation while this runs, so slices can be long; a
// MessageChannel yields to the page without setTimeout's 4 ms clamping.
export function niceFringeGeometryAsync(options, slice = 40) {
  const it = niceFringeSearch(options);
  if (!it) return Promise.resolve(null);
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const step = () => { const t0 = performance.now(); let r; do r = it.next(); while (!r.done && performance.now() - t0 < slice); if (r.done) { channel.port1.close(); resolve(r.value); } else channel.port2.postMessage(0); };
    channel.port1.onmessage = step;
    step();
  });
}