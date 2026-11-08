// Wave-packet field for the Mach–Zehnder stage. Each part of the wave is a
// Gaussian packet with a carrier wave; parts in the same branch are added as
// complex amplitudes (so they interfere), different branches add as densities
// (so they do not). Beam splitters act on the half-plane beyond their plate.
import { G } from './physics.js?v=0.18';

export const SIGMA = 20;   // packet width, virtual px (0.5 units at 40 px/unit)
export const KWAVE = 0.75; // carrier wavenumber, rad per virtual px (30 units^-1)
const STEP = 2, NX = 500, NY = 300;

const C = (re, im = 0) => ({ re, im });
const cmul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const cadd = (a, b) => C(a.re + b.re, a.im + b.im);
const cscale = (a, k) => C(a.re * k, a.im * k);
const T_ = C(Math.SQRT1_2), R_ = C(0, Math.SQRT1_2); // beam-splitter transmission and reflection

const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const unit = a => { const l = Math.hypot(a.x, a.y); return { x: a.x / l, y: a.y / l }; };
const along = (p, d, t) => ({ x: p.x + d.x * t, y: p.y + d.y * t });

// Centre and direction of each part at arc length s; positions are extrapolated
// past the optics so that a packet straddling a plate is split correctly.
function part(type, s) {
  const xhat = { x: 1, y: 0 };
  if (type === 'in') return { c: along(G.S, xhat, s), d: xhat, mask: p => p.x < G.BS1.x };
  if (type === 'U' || type === 'L') {
    const M = type === 'U' ? G.MU : G.ML;
    const d1 = unit(sub(M, G.BS1)), d2 = unit(sub(G.BS2, M));
    let c, d;
    if (s < G.sM) { c = along(G.BS1, d1, s - G.sBS1); d = d1; }
    else { c = along(M, d2, s - G.sM); d = d2; }
    return { c, d, mask: p => p.x > G.BS1.x && (type === 'U' ? p.y > G.MU.y : p.y < G.ML.y) };
  }
  const d = type === 'p1' ? G.dUp : G.dDown;
  return { c: along(G.BS2, d, s - G.sBS2), d, mask: p => p.x > G.BS2.x };
}

// Amplitudes after the first beam splitter; delta detunes the lower arm (0 = D2 dark).
export function armAmplitudes(delta) {
  const aU = cmul(R_, C(1));
  const aL = cmul(T_, C(Math.cos(Math.PI + delta), Math.sin(Math.PI + delta)));
  return { aU, aL };
}

// Branch list: each branch is a list of [partType, amplitude, extraMask].
export function waveBranches(setup, s, delta = 0) {
  const { aU, aL } = armAmplitudes(delta);
  const bs2 = setup.bs2;
  const before = p => !bs2 || p.x < G.BS2.x;
  const armParts = arms => {
    const parts = [];
    arms.forEach(arm => parts.push([arm, arm === 'U' ? aU : aL, before]));
    if (bs2) {
      let p1 = C(0), p2 = C(0);
      if (arms.includes('U')) { p1 = cadd(p1, cmul(R_, aU)); p2 = cadd(p2, cmul(T_, aU)); }
      if (arms.includes('L')) { p1 = cadd(p1, cmul(T_, aL)); p2 = cadd(p2, cmul(R_, aL)); }
      parts.push(['p1', p1, null], ['p2', p2, null]);
    }
    return parts;
  };
  const record = setup.object !== 'none' && s >= G.sObj;
  if (!record) return [{ key: 'a', parts: [['in', C(1), null], ...armParts(['U', 'L'])] }];
  if (setup.object === 'marker') return [{ key: 'a', parts: armParts(['U']) }, { key: 'b', parts: armParts(['L']) }];
  return [{ key: 'x', exploded: true, parts: [] }, { key: 'b', parts: armParts(['L']) }];
}

const buffers = new Map();
const buffer = key => {
  if (!buffers.has(key)) buffers.set(key, { re: new Float32Array(NX * NY), im: new Float32Array(NX * NY), rho: new Float32Array(NX * NY) });
  return buffers.get(key);
};

// Density on the 500 x 300 grid for each branch; renorm rescales a branch (collapse).
export function computeField(branchList, s, renorm = {}) {
  const out = [];
  const inv = 1 / (4 * SIGMA * SIGMA), reach = 3.2 * SIGMA;
  for (const b of branchList) {
    if (b.exploded) continue;
    const buf = buffer(b.key);
    buf.re.fill(0); buf.im.fill(0);
    const scale = renorm[b.key] || 1;
    for (const [type, amp0, extra] of b.parts) {
      const amp = cscale(amp0, scale);
      if (amp.re * amp.re + amp.im * amp.im < 1e-9) continue;
      const { c, d, mask } = part(type, s);
      const i0 = Math.max(0, Math.floor((c.x - reach) / STEP)), i1 = Math.min(NX - 1, Math.ceil((c.x + reach) / STEP));
      const j0 = Math.max(0, Math.floor((c.y - reach) / STEP)), j1 = Math.min(NY - 1, Math.ceil((c.y + reach) / STEP));
      for (let j = j0; j <= j1; j++) {
        const y = j * STEP, dy = y - c.y;
        for (let i = i0; i <= i1; i++) {
          const x = i * STEP, dx = x - c.x;
          const p = { x, y };
          if (!mask(p) || (extra && !extra(p))) continue;
          const g = Math.exp(-(dx * dx + dy * dy) * inv);
          if (g < 1e-4) continue;
          const ph = KWAVE * (d.x * dx + d.y * dy);
          const cr = Math.cos(ph) * g, ci = Math.sin(ph) * g;
          const idx = j * NX + i;
          buf.re[idx] += amp.re * cr - amp.im * ci;
          buf.im[idx] += amp.re * ci + amp.im * cr;
        }
      }
    }
    for (let n = 0; n < NX * NY; n++) buf.rho[n] = buf.re[n] * buf.re[n] + buf.im[n] * buf.im[n];
    out.push({ key: b.key, rho: buf.rho });
  }
  return out;
}

const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const offscreen = document.createElement('canvas');
offscreen.width = NX; offscreen.height = NY;
const octx = offscreen.getContext('2d');
const image = octx.createImageData(NX, NY);

// Colour the densities (one colour per branch) and return a canvas to draw scaled.
export function paintField(fields, colorFor, gain = 1) {
  const data = image.data;
  const cols = fields.map(f => hex(colorFor(f.key)));
  for (let n = 0; n < NX * NY; n++) {
    let total = 0, r = 0, g = 0, b = 0;
    for (let k = 0; k < fields.length; k++) {
      const v = fields[k].rho[n];
      if (v <= 0) continue;
      total += v; r += cols[k][0] * v; g += cols[k][1] * v; b += cols[k][2] * v;
    }
    const o = n * 4;
    if (total < 1e-4) { data[o + 3] = 0; continue; }
    data[o] = r / total; data[o + 1] = g / total; data[o + 2] = b / total;
    data[o + 3] = Math.min(255, 255 * Math.min(1, total * gain));
  }
  octx.putImageData(image, 0, 0);
  return offscreen;
}
