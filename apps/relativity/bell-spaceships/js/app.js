import '../../../../shared/qontic-controls.js?v=3.2';
import { mountQonticShell } from '../../../../shared/qontic-shell.js?v=3.7';
import { mountQonticMedia } from '../../../../shared/qontic-media.js?v=3.0';
import { mountQonticShortcuts } from '../../../../shared/qontic-shortcuts.js?v=1';
import { APP_RELEASE } from './release.js?v=0.4.2';
import { makeModel, finalStrain, shipState, rearFrameView, strainAt, rearTimeFor, findBreak, criticalBeta, runEnd, gammaOf } from './kinematics.js?v=0.3.0';

mountQonticShell({
  title: "Bell's Spaceships",
  eyebrow: 'Q-Ontic · Relativity',
  navigation: 'breadcrumbs',
  purpose: 'Two ships joined by a thread accelerate identically. Does the thread break? Answered first in one frame, as Bell suggested, then in the ships’ frame and spacetime.',
  badge: 'Relativity',
  version: `Bell's spaceships · Version ${APP_RELEASE.version} · ${APP_RELEASE.date}`,
  homeHref: '../../../index.html',
});

// ---------------------------------------------------------------- state
const T0 = -0.75; // launch-frame time at which the animation starts (A's signal leaves at -L/2)
const SNAP = 0.35; // launch-frame time for the broken halves to recoil (schematic)
const SHIP_LEN = 0.26; // proper length of a ship, in units of L

const $ = (sel) => document.querySelector(sel);
const canvas = $('#stage');
const ctx = canvas.getContext('2d');
const controlsEl = $('qontic-controls');

const state = {
  k: 0, beta: 0.9, breakStrain: 0.2, accel: 0.2, layout: 'lab',
  show: { clocks: false, atoms: false, ghost: true, marks: true, signal: true, simul: true, predict: true },
  t: T0, running: false, autoRun: false, speed: 1,
  prediction: null, predictionAsked: false, askedOnce: false, finished: false, explore: false,
};
let model, tEnd, tBreak, breakEvent, dMax;

readUrl();

function rebuild() {
  model = makeModel({ beta: state.beta, accel: state.accel, k: state.k });
  tEnd = runEnd(model);
  tBreak = findBreak(model, state.breakStrain, tEnd);
  breakEvent = null;
  if (tBreak !== null) {
    // the break, as an event: mid-thread at launch-frame time tBreak
    const B = shipState(model, 0, tBreak), C = shipState(model, 1, tBreak);
    const x = 0.5 * (B.x + C.x);
    breakEvent = { t: tBreak, x, v: 0.5 * (B.v + C.v), tauB: B.tau, tRear: rearTimeFor(model, x, tBreak), strain: strainAt(model, tBreak) };
  }
  dMax = 1;
  for (let i = 1; i <= 80; i++) dMax = Math.max(dMax, rearFrameView(model, (tEnd * i) / 80).D);
  updateHints();
}

function resetRun() {
  state.t = T0;
  state.running = false;
  state.finished = false;
  state.prediction = null;
  state.predictionAsked = false;
  controlsEl.setAttribute('running', 'false');
  showStep(state.askedOnce ? 'run' : 'setup');
}

// ---------------------------------------------------------------- controls
const fmt = (x, d = 2) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d);

function updateHints() {
  const g = model.gammaF;
  $('#betaOut').value = `${fmt(state.beta)} c`;
  $('#gammaHint').textContent = `γ = ${fmt(g)} at the final speed`;
  $('#breakOut').value = `${Math.round(state.breakStrain * 100)}%`;
  const bc = criticalBeta(state.breakStrain);
  const fs = finalStrain(model), kk = state.k;
  $('#snapRow').classList.toggle('disabled', kk >= 1);
  $('#breakStrain').disabled = kk >= 1;
  $('#critHint').textContent = kk >= 1
    ? 'With this setting the thread is never stretched, so its breaking limit does not matter.'
    : `It snaps if the final speed is above ${fmt(criticalBeta(state.breakStrain / (1 - kk)))} c.`;
  $('#kOut').value = fmt(kk);
  setPressed('.k-group', 'data-k', kk === 0 ? '0' : kk === 1 ? '1' : '');
  $('#accelOut').value = fmt(state.accel);
  const fsTxt = `${Math.round(Math.abs(fs) * 100)}%`;
  $('#modeHint').textContent = kk === 0
    ? `Same engines: in A\u2019s frame the gap stays L while the moving thread gets shorter. Final stretch γ − 1 = ${fsTxt}.`
    : Math.abs(fs) < 0.005
      ? 'Born-rigid: the gap shrinks with the thread, which stays at its natural length. Any other setting stretches it or leaves it slack.'
      : fs > 0 ? `Final stretch (γ − 1)(1 − k) = ${fsTxt}. Still stretched; k = 1 is the only setting that avoids it.`
        : `The ships end closer than the thread's natural length: it goes slack by ${fsTxt}.`;
  $('#frontAccelHint').textContent = `Front ship: a/(1 + k·aL/c²) = ${fmt(model.ships[1].a, 3)} c²/L.`;
  const v = `${fmt(state.beta)} c`, pct = `${Math.round(state.breakStrain * 100)}%`;
  const engines0 = kk === 0
    ? `When it arrives, B and C fire <b>identical engines running the same program</b> and stop at ${v}. So, as A sees it, the ships always have the same speed and <b>stay L apart</b>.`
    : `When it arrives, B and C fire their engines and stop at ${v}. This time <b>C's engine is turned down</b> (k = ${fmt(kk)}).`;
  const engines = engines0;
  $('#setupList').innerHTML = [
    'Spaceships <b>B</b> (rear) and <b>C</b> (front) float at rest a distance <b>L</b> apart. <b>A</b>, halfway between them, stays at rest.',
    `A fragile <b>thread</b>, just long enough, joins B to C. It is far too weak to pull on the ships, and snaps if it is stretched by more than <b>${pct}</b>.`,
    'A sends a <b>light flash</b>, which reaches B and C at the same moment, as A sees it. A\u2019s clock reads <b>t = 0</b> when it arrives.',
    engines,
  ].map((x) => `<li>${x}</li>`).join('');
  $('#predictionText').textContent = `When the ships reach ${v}, will the thread have snapped?`;
  $('#setupNext').textContent = state.show.predict ? 'Next: the question' : 'Start';
}

function setPressed(group, attr, value) {
  document.querySelectorAll(`${group} [${attr}]`).forEach((b) => {
    const on = b.getAttribute(attr) === value;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

function syncControls() {
  $('#beta').value = state.beta;
  $('#breakStrain').value = Math.round(state.breakStrain * 100);
  $('#accel').value = state.accel;
  $('#kSlider').value = state.k;
  setPressed('.view-group', 'data-layout', state.layout);
  document.querySelectorAll('[data-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(state.show[b.dataset.toggle])));
}

// ---------------------------------------------------------------- story strip (setup, question, live line, verdict)
function showStep(step) {
  ['setup', 'question', 'run', 'verdict'].forEach((k) => $(`#${k}Step`).classList.toggle('hidden', k !== step));
  state.step = step;
}
$('#setupNext').addEventListener('click', () => {
  if (state.show.predict) showStep('question'); else start();
});
$('#setupBack').addEventListener('click', () => showStep('setup'));
$('#showSetup').addEventListener('click', () => {
  if (state.running) { state.running = false; controlsEl.setAttribute('running', 'false'); }
  showStep('setup');
});
document.querySelectorAll('[data-predict]').forEach((b) => b.addEventListener('click', () => {
  const p = b.dataset.predict;
  state.prediction = p === 'skip' ? null : p;
  start();
}));

$('#beta').addEventListener('input', (e) => { state.beta = +e.target.value; rebuild(); resetRun(); });
$('#breakStrain').addEventListener('input', (e) => { state.breakStrain = +e.target.value / 100; rebuild(); resetRun(); });
$('#accel').addEventListener('input', (e) => { state.accel = +e.target.value; rebuild(); resetRun(); });
function revealExplore(flash = false) {
  state.explore = true;
  $('#explore').classList.remove('hidden');
  $('#firstRunHint').classList.add('hidden');
  if (flash) document.querySelectorAll('#frontEngine, .k-row').forEach((e) => { e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); });
}
function setK(k) { state.k = Math.round(k * 100) / 100; $('#kSlider').value = state.k; rebuild(); resetRun(); }
$('#kSlider').addEventListener('input', (e) => setK(+e.target.value));
document.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => setK(+b.dataset.k)));
document.querySelectorAll('[data-layout]').forEach((b) => b.addEventListener('click', () => setLayout(b.dataset.layout)));
function setLayout(layout) {
  state.layout = layout; setPressed('.view-group', 'data-layout', layout);
  document.querySelectorAll('.ship-only').forEach((e) => e.classList.toggle('hidden', !['frames', 'all'].includes(layout)));
  $('.canvas-host').classList.toggle('tall', layout !== 'lab');
}
document.querySelectorAll('[data-toggle]').forEach((b) => b.addEventListener('click', () => {
  const key = b.dataset.toggle;
  state.show[key] = !state.show[key];
  b.setAttribute('aria-pressed', String(state.show[key]));
  if (key === 'predict') updateHints();
}));

controlsEl.addEventListener('qontic:start', () => start());
controlsEl.addEventListener('qontic:stop', () => { state.running = false; controlsEl.setAttribute('running', 'false'); });
controlsEl.addEventListener('qontic:reset', () => resetRun());
controlsEl.addEventListener('qontic:autorun', (e) => { state.autoRun = e.detail.autoRun; controlsEl.setAttribute('auto-run', String(state.autoRun)); });
controlsEl.addEventListener('qontic:speed', (e) => { state.speed = e.detail.speed; });
controlsEl.addEventListener('qontic:tab', (e) => {
  controlsEl.setAttribute('active-tab', e.detail.tab);
  document.querySelectorAll('[data-control-pane]').forEach((p) => p.classList.toggle('hidden', p.dataset.controlPane !== e.detail.tab));
});

function start() {
  if (state.finished || state.t >= tEnd) { state.t = T0; state.finished = false; }
  state.predictionAsked = true;
  state.askedOnce = true;
  showStep('run');
  state.running = true;
  controlsEl.setAttribute('running', 'true');
}

// Section tabs (Simulation / Physics / Rationale)
document.querySelector('.tabs').addEventListener('click', (event) => {
  const button = event.target.closest('[data-view]');
  if (!button) return;
  document.querySelectorAll('.tabs [data-view]').forEach((b) => b.classList.toggle('active', b === button));
  document.querySelectorAll('[data-panel]').forEach((p) => p.classList.toggle('hidden', p.dataset.panel !== button.dataset.view));
  if (button.dataset.view !== 'sim' && state.running) { state.running = false; controlsEl.setAttribute('running', 'false'); }
});

// Collapsible results panel
(() => {
  const panel = $('[data-results-panel]');
  panel.querySelector('[data-results-collapse]').addEventListener('click', (e) => {
    const body = panel.querySelector('.results-body');
    body.hidden = !body.hidden;
    e.currentTarget.textContent = body.hidden ? '+' : '−';
  });
})();

// ---------------------------------------------------------------- URL state
function readUrl() {
  const q = new URLSearchParams(location.search);
  if ([...q.keys()].some((k) => ['k', 'mode', 'beta', 'snap', 'a', 'view'].includes(k))) state.explore = true;
  const num = (k, lo, hi) => { const v = parseFloat(q.get(k)); return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : null; };
  const b = num('beta', 0.05, 0.99); if (b !== null) state.beta = b;
  const e = num('snap', 1, 150); if (e !== null) state.breakStrain = Math.round(e) / 100;
  const a = num('a', 0.05, 1); if (a !== null) state.accel = a;
  if (q.get('mode') === 'rigid') state.k = 1;
  const kq = num('k', 0, 1.5); if (kq !== null) state.k = kq;
  if (['lab', 'all', 'frames', 'spacetime'].includes(q.get('view'))) state.layout = q.get('view');
}
function shareUrl() {
  const u = new URL(location.href);
  u.search = new URLSearchParams({ k: fmt(state.k), beta: fmt(state.beta), snap: String(Math.round(state.breakStrain * 100)), a: fmt(state.accel), view: state.layout }).toString();
  return u.href;
}

// ---------------------------------------------------------------- drawing helpers
function palette() {
  const light = document.body.classList.contains('qontic-light');
  return light ? {
    bg: '#fbfdfe', panel: '#f1f6f8', frame: '#c9d9e0', text: '#183747', muted: '#5f7684', grid: '#e1eaee',
    B: '#0b8fa0', C: '#c4661b', A: '#6c7c88', light: '#c99a00', hull: '#e8eef2', simA: '#7a8b97', ok: '#2d4a5a', bad: '#c62828',
  } : {
    bg: '#071521', panel: '#0a1c2a', frame: '#23465a', text: '#d6e9f2', muted: '#7f98a7', grid: '#122a3a',
    B: '#62dce8', C: '#f0a35e', A: '#9aa9b5', light: '#f6e27a', hull: '#1a3242', simA: '#8aa0ae', ok: '#d9edf7', bad: '#ff5d5d',
  };
}

// Thread color from elongation relative to the breaking elongation.
function strainColor(strain, P) {
  const u = Math.max(0, Math.min(1, strain / state.breakStrain));
  const a = hexToRgb(P.ok), b = [240, 190, 70], c = hexToRgb(P.bad);
  const mix = (p, q, s) => p.map((x, i) => Math.round(x + (q[i] - x) * s));
  const rgb = u < 0.6 ? mix(a, b, u / 0.6) : mix(b, c, (u - 0.6) / 0.4);
  return `rgb(${rgb.join(',')})`;
}
function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

function label(text, x, y, { color, size = 12, align = 'left', base = 'alphabetic', weight = 400 } = {}) {
  ctx.font = `${weight} ${size}px Inter, Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.fillText(text, x, y);
}

// A ship facing +x. attach = screen x of the thread attachment point.
// rear ship: body to the left of attach; front ship: body to the right.
function drawShip(attach, y, lenPx, hPx, color, isRear, firing, P) {
  const x0 = isRear ? attach - lenPx : attach;
  const x1 = x0 + lenPx;
  const nose = Math.min(lenPx * 0.32, hPx * 1.2);
  ctx.save();
  if (firing) {
    const fl = Math.min(lenPx * 0.7, hPx * 1.8) * (0.85 + 0.15 * Math.sin(performance.now() / 45));
    const g = ctx.createLinearGradient(x0, y, x0 - fl, y);
    g.addColorStop(0, '#fff3b0'); g.addColorStop(0.4, '#ff9f3d'); g.addColorStop(1, 'rgba(255,90,40,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(x0, y - hPx * 0.28); ctx.lineTo(x0 - fl, y); ctx.lineTo(x0, y + hPx * 0.28); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = P.hull; ctx.strokeStyle = color; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x0, y - hPx * 0.5);
  ctx.lineTo(x1 - nose, y - hPx * 0.5);
  ctx.quadraticCurveTo(x1, y - hPx * 0.35, x1, y);
  ctx.quadraticCurveTo(x1, y + hPx * 0.35, x1 - nose, y + hPx * 0.5);
  ctx.lineTo(x0, y + hPx * 0.5);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // fins
  const fin = Math.min(lenPx * 0.28, hPx);
  ctx.beginPath();
  ctx.moveTo(x0, y - hPx * 0.5); ctx.lineTo(x0 - fin * 0.25, y - hPx * 0.85); ctx.lineTo(x0 + fin, y - hPx * 0.5);
  ctx.moveTo(x0, y + hPx * 0.5); ctx.lineTo(x0 - fin * 0.25, y + hPx * 0.85); ctx.lineTo(x0 + fin, y + hPx * 0.5);
  ctx.stroke();
  // window
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x0 + lenPx * 0.62, y, Math.max(1.5, Math.min(hPx * 0.16, lenPx * 0.07)), hPx * 0.16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  return { x0, x1 };
}

function drawThreadSegment(xa, xb, y, color, sag = 0, slack = 0) {
  ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(xa, y);
  if (slack) ctx.quadraticCurveTo(0.5 * (xa + xb), y + 2 * slack, xb, y); // both ends attached, hanging slack
  else if (sag) ctx.quadraticCurveTo(0.5 * (xa + xb), y + sag, xb, y + sag * 0.6); // a loose broken end
  else ctx.lineTo(xb, y);
  ctx.stroke();
}
// Sag (px) for a thread whose ends are closer than its natural length.
// Below 3% the launch-frame estimate is not reliable during the push (mean-speed approximation), so treat it as taut.
const SLACK_MIN = 0.03;
const slackPx = (strain, len) => (strain < -SLACK_MIN ? Math.min(60, len * Math.sqrt(-strain - SLACK_MIN) * 0.7) : 0);

// Atoms of the thread with their electric fields flattened by 1/gamma.
function drawAtoms(xa, xb, y, gamma, P, s, n = 9) {
  const r = Math.max(4, Math.min(12, 0.045 * s));
  for (let i = 0; i <= n; i++) {
    const x = xa + ((xb - xa) * i) / n;
    ctx.strokeStyle = P.muted; ctx.lineWidth = 1; ctx.globalAlpha = 0.75;
    ctx.beginPath(); ctx.ellipse(x, y, r / gamma, r, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1; ctx.fillStyle = P.text;
    ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
  }
}

// Above the ship name labels (and clocks), so the marker never covers them.
function bracketY(y, s) {
  const hPx = Math.min(lastPanelH * 0.12, SHIP_LEN * s * 0.42);
  return y - hPx * 0.95 - (state.show.clocks ? 36 : 22);
}
let lastPanelH = 400;
function bracket(xa, xb, y, text, P) {
  ctx.strokeStyle = P.muted; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(xa, y + 5); ctx.lineTo(xa, y); ctx.lineTo(xb, y); ctx.lineTo(xb, y + 5); ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = '400 11px Inter, Arial, sans-serif';
  if (ctx.measureText(text).width < Math.abs(xb - xa) - 4) label(text, 0.5 * (xa + xb), y - 4, { color: P.muted, size: 11, align: 'center' });
}

function panelFrame(r, title, P, right = '', short = title) {
  if (r.w < 520) title = short;
  ctx.fillStyle = P.panel; ctx.strokeStyle = P.frame; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 8); ctx.fill(); ctx.stroke();
  label(title, r.x + 12, r.y + 20, { color: P.text, size: 13, weight: 600 });
  if (right) label(right, r.x + r.w - 12, r.y + 20, { color: P.muted, size: 12, align: 'right' });
}

// ---------------------------------------------------------------- layout
function layoutRects(W, H) {
  const g = 10;
  if (state.layout === 'spacetime') return { st: { x: g, y: g, w: W - 2 * g, h: H - 2 * g } };
  if (state.layout === 'lab') return { lab: { x: g, y: g, w: W - 2 * g, h: H - 2 * g } };
  if (state.layout === 'frames') {
    const h = (H - 3 * g) / 2;
    return { lab: { x: g, y: g, w: W - 2 * g, h }, ship: { x: g, y: 2 * g + h, w: W - 2 * g, h } };
  }
  if (W >= 880) {
    const wl = (W - 3 * g) * 0.58, h = (H - 3 * g) / 2;
    return {
      lab: { x: g, y: g, w: wl, h }, ship: { x: g, y: 2 * g + h, w: wl, h },
      st: { x: 2 * g + wl, y: g, w: W - 3 * g - wl, h: H - 2 * g },
    };
  }
  const h1 = (H - 4 * g) * 0.27;
  return {
    lab: { x: g, y: g, w: W - 2 * g, h: h1 }, ship: { x: g, y: 2 * g + h1, w: W - 2 * g, h: h1 },
    st: { x: g, y: 3 * g + 2 * h1, w: W - 2 * g, h: H - 4 * g - 2 * h1 },
  };
}

// Pixels per L shared by both frame panels, so lengths can be compared directly.
function frameScale(rects) {
  const w = (rects.lab || rects.ship).w;
  const span = rects.ship ? dMax : 1;
  return Math.min(w * 0.46, (w * 0.9) / (span + 2 * SHIP_LEN + 0.15));
}

// ---------------------------------------------------------------- panels
function drawLaunchPanel(r, s, P) {
  lastPanelH = r.h;
  const t = state.t;
  const B = shipState(model, 0, t), C = shipState(model, 1, t);
  panelFrame(r, 'Launch frame (A at rest)', P, `A’s clock t = ${fmt(t)} L/c`, 'Launch frame');
  const y = r.y + r.h * 0.5;
  const xc = 0.5 * (B.x + C.x);
  const X = (x) => r.x + r.w / 2 + (x - xc) * s;
  ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y + 26, r.w, r.h - 26); ctx.clip();

  if (state.show.marks) {
    const ry = r.y + r.h - 22;
    ctx.strokeStyle = P.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(r.x, ry); ctx.lineTo(r.x + r.w, ry); ctx.stroke();
    const lo = Math.floor((xc - r.w / (2 * s)) * 4), hi = Math.ceil((xc + r.w / (2 * s)) * 4);
    for (let k = lo; k <= hi; k++) {
      const x = X(k / 4), major = k % 4 === 0;
      ctx.strokeStyle = major ? P.muted : P.grid;
      ctx.beginPath(); ctx.moveTo(x, ry - (major ? 7 : 4)); ctx.lineTo(x, ry); ctx.stroke();
      if (major) label(`${k / 4} L`, x, ry + 13, { color: P.muted, size: 10, align: 'center' });
    }
  }
  drawStationA(X(0.5), y + Math.min(r.h * 0.26, 46), Math.min(16, s * 0.06), 1, P);
  if (state.show.signal && t < 0.02) drawSignal(X, y, t, P);
  drawThreadLaunch(X, y, s, t, B, C, P);
  const hPx = Math.min(r.h * 0.12, SHIP_LEN * s * 0.42);
  const lenB = (SHIP_LEN * s) / gammaOf(B.v), lenC = (SHIP_LEN * s) / gammaOf(C.v);
  drawShip(X(B.x), y, lenB, hPx, P.B, true, t > 0 && t < model.ships[0].t1, P);
  drawShip(X(C.x), y, lenC, hPx, P.C, false, t > 0 && t < model.ships[1].t1, P);
  shipLabels(X(B.x) - lenB / 2, X(C.x) + lenC / 2, y, hPx, B, C, B.tau, C.tau, P, true);
  if (t > 0) {
    let note;
    if (breakEvent && t >= breakEvent.t) {
      const b = snapState();
      note = `snapped at ${fmt(b.v)} c: gap ${fmt(b.gap)} L, thread's natural length ${fmt(b.nat)} L`;
    } else {
      const gap = C.x - B.x, nat = 1 / gammaOf(0.5 * (B.v + C.v));
      const st = gap / nat - 1;
      note = state.k === 0
        ? `gap held at ${fmt(gap)} L · thread's natural length ${fmt(nat)} L`
        : `gap ${fmt(gap)} L · thread's natural length ${fmt(nat)} L · ${st > 0.005 ? 'stretched' : st < -SLACK_MIN ? 'slack' : 'matching'}`;
    }
    caption(note, r, X(0.5 * (B.x + C.x)), y, hPx, P);
  }
  ctx.restore();
  return { sep: C.x - B.x, v: B.v };
}

function drawThreadLaunch(X, y, s, t, B, C, P) {
  const xa = X(B.x), xb = X(C.x);
  const g = gammaOf(0.5 * (B.v + C.v));
  const tb = breakEvent ? breakEvent.t : Infinity;
  if (t < tb) {
    const strain = strainAt(model, t);
    if (state.show.ghost) bracket(xa, xa + s / g, bracketY(y, s), `natural length ${fmt(1 / g)} L`, P);
    drawThreadSegment(xa, xb, y, strainColor(strain, P), 0, slackPx(strain, xb - xa));
    if (state.show.atoms) drawAtoms(xa, xb, y, g, P, s);
    return;
  }
  // broken: each half recoils toward its natural (contracted) length
  const u = Math.min(1, (t - tb) / SNAP), ease = 1 - (1 - u) ** 3;
  const gB = gammaOf(B.v), gC = gammaOf(C.v);
  const half = 0.5 * (xb - xa);
  const lB = half + (0.5 * s / gB - half) * ease, lC = half + (0.5 * s / gC - half) * ease;
  drawThreadSegment(xa, xa + lB, y, P.ok, 6 * ease);
  drawThreadSegment(xb, xb - lC, y, P.ok, 6 * ease);
  if (state.show.atoms) { drawAtoms(xa, xa + lB, y, gB, P, s, 4); drawAtoms(xb - lC, xb, y, gC, P, s, 4); }
  if (u < 1) flash(0.5 * (xa + xb), y, u, P);
}

function drawShipPanel(r, s, P) {
  lastPanelH = r.h;
  const tB = Math.max(state.t, 0);
  const pre = state.t < 0;
  const v = pre ? { D: 1, tauB: state.t, tauC: state.t, vB: 0, vRel: 0, xB: 0, tC: state.t } : rearFrameView(model, tB);
  panelFrame(r, 'Rear ship B at rest (its momentary frame)', P, `τB = ${fmt(v.tauB)} L/c`, 'Rear ship\u2019s frame');
  const y = r.y + r.h * 0.5;
  const left = r.x + r.w / 2 - (dMax * s) / 2;
  const X = (xp) => left + xp * s; // xp: position in B's frame, B's attachment at 0
  const gB = gammaOf(v.vB);
  ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y + 26, r.w, r.h - 26); ctx.clip();

  if (state.show.marks) {
    // marks at rest in the launch frame: in B's frame they are contracted and move backwards
    const ry = r.y + r.h - 22;
    const xB = pre ? 0 : v.xB;
    ctx.strokeStyle = P.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(r.x, ry); ctx.lineTo(r.x + r.w, ry); ctx.stroke();
    const span = (r.w / s) * gB;
    const lo = Math.floor((xB - span) * 4), hi = Math.ceil((xB + span) * 4);
    for (let k = lo; k <= hi; k++) {
      const x = X((k / 4 - xB) / gB), major = k % 4 === 0;
      if (x < r.x - 20 || x > r.x + r.w + 20) continue;
      ctx.strokeStyle = major ? P.muted : P.grid;
      ctx.beginPath(); ctx.moveTo(x, ry - (major ? 7 : 4)); ctx.lineTo(x, ry); ctx.stroke();
      if (major && (gB < 2.5 || k % 8 === 0)) label(`${k / 4} L`, x, ry + 13, { color: P.muted, size: 10, align: 'center' });
    }
    drawStationA(X((0.5 - xB) / gB), y + Math.min(r.h * 0.26, 46), Math.min(16, s * 0.06), 1 / gB, P);
  }
  if (state.show.signal && pre) drawSignal(X, y, state.t, P);

  const xa = X(0), xb = X(v.D);
  const broken = breakEvent && tB >= breakEvent.tRear && !pre;
  if (!broken) {
    if (state.show.ghost) bracket(xa, xa + s, bracketY(y, s), 'rest length L', P);
    const stB = strainAt(model, tB);
    drawThreadSegment(xa, xb, y, strainColor(stB, P), 0, slackPx(stB, xb - xa));
    if (state.show.atoms) drawAtoms(xa, xb, y, gammaOf(0.5 * v.vRel), P, s);
  } else {
    const u = Math.min(1, (tB - breakEvent.tRear) / SNAP), ease = 1 - (1 - u) ** 3;
    const half = 0.5 * (xb - xa);
    const l = half + (0.5 * s - half) * ease;
    drawThreadSegment(xa, xa + l, y, P.ok, 6 * ease);
    drawThreadSegment(xb, xb - l, y, P.ok, 6 * ease);
    if (state.show.atoms) { drawAtoms(xa, xa + l, y, 1, P, s, 4); drawAtoms(xb - l, xb, y, 1, P, s, 4); }
    if (u < 1) flash(0.5 * (xa + xb), y, u, P);
  }
  const hPx = Math.min(r.h * 0.12, SHIP_LEN * s * 0.42);
  const lenC = (SHIP_LEN * s) / gammaOf(v.vRel);
  const cAcc = !pre && v.tC > 0 && v.tC < model.ships[1].t1;
  drawShip(xa, y, SHIP_LEN * s, hPx, P.B, true, !pre && tB < model.ships[0].t1, P);
  drawShip(xb, y, lenC, hPx, P.C, false, cAcc, P);
  shipLabels(xa - SHIP_LEN * s / 2, xb + lenC / 2, y, hPx, { v: 0 }, { v: v.vRel }, v.tauB, v.tauC, P, false);
  if (!pre) {
    const note = breakEvent && tB >= breakEvent.tRear
      ? `thread snapped · gap in B's frame now ${fmt(v.D)} L`
      : v.D > 1.005 ? `C fired first in B's frame and pulls ahead: gap ${fmt(v.D)} L, thread's rest length 1.00 L`
        : `gap ${fmt(v.D)} L · thread's rest length 1.00 L`;
    caption(note, r, 0.5 * (xa + xb), y, hPx, P);
  }
  if (state.show.clocks && !pre && v.tauC - v.tauB > 0.005) {
    label(`C's clock reads ${fmt(v.tauC - v.tauB)} L/c ahead of B's`, r.x + 12, r.y + 40, { color: P.muted, size: 11 });
  }
  ctx.restore();
  return v;
}

function shipLabels(xB, xC, y, hPx, B, C, tauB, tauC, P, launch) {
  const top = y - hPx * 0.95 - 6, bottom = y + hPx * 0.95 + 15;
  label('B', xB, top - (state.show.clocks ? 14 : 0), { color: P.B, size: 12, align: 'center', weight: 600 });
  label('C', xC, top - (state.show.clocks ? 14 : 0), { color: P.C, size: 12, align: 'center', weight: 600 });
  if (state.show.clocks) {
    label(`τ ${fmt(tauB)}`, xB, top, { color: P.B, size: 11, align: 'center' });
    label(`τ ${fmt(tauC)}`, xC, top, { color: P.C, size: 11, align: 'center' });
  }
  const vb = launch ? `${fmt(B.v)}c` : 'at rest';
  const vc = `${fmt(C.v)}c`;
  label(vb, xB, bottom, { color: P.muted, size: 10.5, align: 'center' });
  label(vc, xC, bottom, { color: P.muted, size: 10.5, align: 'center' });
}

// Caption under the ships; moved to the top right of the panel if it would hit the distance marks.
function caption(text, r, xc, y, hPx, P) {
  ctx.font = '400 12.5px Inter, Arial, sans-serif';
  const w = ctx.measureText(text).width;
  let cy = y + hPx + 44;
  const limit = r.y + r.h - (state.show.marks ? 40 : 14);
  let cx = Math.min(Math.max(xc, r.x + 12 + w / 2), r.x + r.w - 12 - w / 2);
  if (cy > limit) { cy = r.y + 40; cx = r.x + r.w - 12 - w / 2; }
  const size = w > r.w - 24 ? Math.max(9.5, 12.5 * (r.w - 24) / w) : 12.5; // shrink rather than clip on narrow screens
  if (size < 12.5) cx = r.x + r.w / 2;
  label(text, cx, cy, { color: P.text, size, align: 'center' });
}

function drawStationA(x, y, size, squeeze, P) {
  ctx.strokeStyle = P.A; ctx.fillStyle = P.A; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.ellipse(x, y, size * squeeze, size * 0.45, 0, Math.PI, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + size * 0.8); ctx.stroke();
  label('A', x + size * squeeze + 5, y + 4, { color: P.A, size: 11, weight: 600 });
}

// Light signal from A (at x = L/2) that starts both ships at t = 0.
function drawSignal(X, y, t, P) {
  const d = t + 0.5;
  if (d < 0) return;
  ctx.fillStyle = P.light; ctx.strokeStyle = P.light;
  for (const x of [0.5 - d, 0.5 + d]) {
    ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(X(x), y, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 0.35; ctx.setLineDash([2, 4]);
  ctx.beginPath(); ctx.moveTo(X(0.5 - d), y); ctx.lineTo(X(0.5 + d), y); ctx.stroke();
  ctx.setLineDash([]); ctx.globalAlpha = 1;
}

function flash(x, y, u, P) {
  ctx.save(); ctx.globalAlpha = 1 - u; ctx.strokeStyle = P.bad; ctx.lineWidth = 2;
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4, r1 = 4 + 10 * u, r2 = 10 + 22 * u;
    ctx.beginPath(); ctx.moveTo(x + r1 * Math.cos(a), y + r1 * Math.sin(a)); ctx.lineTo(x + r2 * Math.cos(a), y + r2 * Math.sin(a)); ctx.stroke();
  }
  label('snap!', x, y - 26 - 8 * u, { color: P.bad, size: 13, align: 'center', weight: 700 });
  ctx.restore();
}

function drawSpacetime(r, P) {
  panelFrame(r, 'Spacetime (launch-frame coordinates)', P, '', 'Spacetime');
  const m = { l: 42, r: 14, t: 34, b: 34 };
  const xEndB = shipState(model, 0, tEnd).x, xEndC = shipState(model, 1, tEnd).x;
  const xmin = -0.35, xmax = Math.max(xEndB, xEndC, 1) + 0.35, tmin = T0, tmax = tEnd;
  const k = Math.min((r.w - m.l - m.r) / (xmax - xmin), (r.h - m.t - m.b) / (tmax - tmin));
  const ox = r.x + m.l + ((r.w - m.l - m.r) - k * (xmax - xmin)) / 2;
  const oy = r.y + r.h - m.b - ((r.h - m.t - m.b) - k * (tmax - tmin)) / 2;
  const SX = (x) => ox + (x - xmin) * k, SY = (t) => oy - (t - tmin) * k;
  const t = state.t;
  ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y + 26, r.w, r.h - 26); ctx.clip();

  // grid
  ctx.lineWidth = 1; ctx.strokeStyle = P.grid;
  const step = (xmax - xmin) > 12 ? 2 : 1;
  for (let x = Math.ceil(xmin / step) * step; x <= xmax; x += step) { ctx.beginPath(); ctx.moveTo(SX(x), SY(tmin)); ctx.lineTo(SX(x), SY(tmax)); ctx.stroke(); label(String(x), SX(x), SY(tmin) + 14, { color: P.muted, size: 10, align: 'center' }); }
  for (let tt = Math.ceil(tmin / step) * step; tt <= tmax; tt += step) { ctx.beginPath(); ctx.moveTo(SX(xmin), SY(tt)); ctx.lineTo(SX(xmax), SY(tt)); ctx.stroke(); label(String(tt), SX(xmin) - 6, SY(tt) + 3, { color: P.muted, size: 10, align: 'right' }); }
  label('x / L', SX(xmax), SY(tmin) + 26, { color: P.muted, size: 10.5, align: 'right' });
  ctx.save(); ctx.translate(r.x + 13, SY(tmax) + 30); ctx.rotate(-Math.PI / 2); label('ct / L', 0, 0, { color: P.muted, size: 10.5, align: 'right' }); ctx.restore();

  // thread history between the worldlines, sliced along B's lines of simultaneity
  const tStop = Math.min(t, breakEvent ? breakEvent.tRear : Infinity, tEnd);
  if (tStop > tmin) {
    const n = 140;
    let prev = null;
    for (let i = 0; i <= n; i++) {
      const tb = tmin + ((tStop - tmin) * i) / n;
      const sl = tb <= 0 ? { xB: 0, tB: tb, xC: 1, tC: tb, D: 1 } : rearFrameView(model, tb);
      const cur = [SX(sl.xB), SY(sl.tB), SX(sl.xC), SY(sl.tC)];
      if (prev) {
        ctx.fillStyle = strainColor(strainAt(model, sl.tB), P); ctx.globalAlpha = 0.28;
        ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(prev[2], prev[3]); ctx.lineTo(cur[2], cur[3]); ctx.lineTo(cur[0], cur[1]); ctx.closePath(); ctx.fill();
      }
      prev = cur;
    }
    ctx.globalAlpha = 1;
  }

  // A and the start signal
  ctx.strokeStyle = P.A; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.7;
  ctx.beginPath(); ctx.moveTo(SX(0.5), SY(tmin)); ctx.lineTo(SX(0.5), SY(tmax)); ctx.stroke(); ctx.globalAlpha = 1;
  label('A', SX(0.5) + 4, SY(tmax) + 12, { color: P.A, size: 11, weight: 600 });
  if (state.show.signal) {
    ctx.strokeStyle = P.light; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(SX(0.5), SY(-0.5)); ctx.lineTo(SX(0), SY(0)); ctx.moveTo(SX(0.5), SY(-0.5)); ctx.lineTo(SX(1), SY(0)); ctx.stroke(); ctx.setLineDash([]);
  }

  // worldlines: faint for the whole run, bright up to now
  for (const [i, color] of [[0, P.B], [1, P.C]]) {
    for (const [end, alpha, width] of [[tmax, 0.3, 1.5], [Math.min(t, tmax), 1, 2.4]]) {
      if (end <= tmin) continue;
      ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineWidth = width;
      ctx.beginPath();
      for (let j = 0; j <= 200; j++) { const tt = tmin + ((end - tmin) * j) / 200; const x = shipState(model, i, tt).x; j ? ctx.lineTo(SX(x), SY(tt)) : ctx.moveTo(SX(x), SY(tt)); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const xe = shipState(model, i, tmax).x;
    label(i ? 'C' : 'B', SX(xe) + (i ? 6 : -6), SY(tmax) + 12, { color, size: 12, align: i ? 'left' : 'right', weight: 600 });
  }

  // lines of simultaneity through B's current event
  const B = shipState(model, 0, t), C = shipState(model, 1, t);
  if (state.show.simul && t > tmin) {
    ctx.lineWidth = 1.2; ctx.setLineDash([5, 4]);
    ctx.strokeStyle = P.simA;
    ctx.beginPath(); ctx.moveTo(SX(xmin), SY(t)); ctx.lineTo(SX(xmax), SY(t)); ctx.stroke();
    label('same time for A', SX(xmin) + 4, SY(t) - 5 < r.y + 42 ? SY(t) + 13 : SY(t) - 5, { color: P.simA, size: 10.5 });
    if (t > 0 && B.v > 0.002) {
      const tAt = (x) => t + B.v * (x - B.x);
      ctx.strokeStyle = P.B;
      ctx.beginPath(); ctx.moveTo(SX(xmin), SY(tAt(xmin))); ctx.lineTo(SX(xmax), SY(tAt(xmax))); ctx.stroke();
      // label at the left end, below the line, clear of the worldline labels at the top
      const ly = Math.min(SY(tAt(xmin)) + 13, r.y + r.h - 8);
      label('same time for B', SX(xmin) + 4, ly, { color: P.B, size: 10.5, align: 'left' });
    }
    ctx.setLineDash([]);
  }
  if (t > tmin) {
    dot(SX(B.x), SY(t), P.B, true); dot(SX(C.x), SY(t), P.C, true);
    if (t > 0) { const v = rearFrameView(model, t); dot(SX(v.xC), SY(v.tC), P.C, false); }
  }
  if (breakEvent && t >= breakEvent.t) star(SX(breakEvent.x), SY(breakEvent.t), P.bad);
  ctx.restore();
}

function dot(x, y, color, filled) {
  ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
  if (filled) { ctx.fillStyle = color; ctx.fill(); } else { ctx.strokeStyle = color; ctx.lineWidth = 1.8; ctx.stroke(); }
}
function star(x, y, color) {
  ctx.fillStyle = color; ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? 3 : 8; ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); }
  ctx.closePath(); ctx.fill();
}

function drawGauge(r, strain, P, broken = false) {
  const w = Math.min(170, r.w * 0.4), h = 7, x = r.x + 12, y = r.y + 42;
  const max = Math.max(state.breakStrain * 1.25, 0.05);
  ctx.fillStyle = P.grid; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = strainColor(strain, P); ctx.fillRect(x, y, w * Math.min(1, Math.max(0, strain) / max), h);
  const xb = x + (w * state.breakStrain) / max;
  ctx.strokeStyle = P.bad; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xb, y - 3); ctx.lineTo(xb, y + h + 3); ctx.stroke();
  label(broken ? 'thread snapped' : strain < -SLACK_MIN ? 'thread slack' : `stretch ${Math.round(Math.max(0, strain) * 100)}%`, x, y + h + 13, { color: broken ? P.bad : P.muted, size: 10.5 });
  label('snaps', xb, y - 5, { color: P.bad, size: 10, align: 'center' });
}

// ---------------------------------------------------------------- main loop
function render() {
  const P = palette();
  const ratio = devicePixelRatio || 1, W = canvas.clientWidth, H = canvas.clientHeight;
  if (W < 40 || H < 40) return; // canvas hidden (another section tab is open)
  if (canvas.width !== Math.round(W * ratio) || canvas.height !== Math.round(H * ratio)) { canvas.width = Math.round(W * ratio); canvas.height = Math.round(H * ratio); }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
  const rects = layoutRects(W, H);
  const t = state.t;
  const broken = breakEvent && t >= breakEvent.t;
  const strain = broken ? 0 : strainAt(model, t);
  if (rects.lab) {
    const s = frameScale(rects);
    drawLaunchPanel(rects.lab, s, P);
    drawGauge(rects.lab, strain, P, broken);
    if (rects.ship) drawShipPanel(rects.ship, s, P);
  }
  if (rects.st) { drawSpacetime(rects.st, P); if (!rects.lab) drawGauge(rects.st, strain, P, broken); }

  const B = shipState(model, 0, t), C = shipState(model, 1, t);
  const vMean = 0.5 * (B.v + C.v), natural = 1 / gammaOf(vMean);
  if (broken) {
    // freeze the readout at the moment of the snap
    const b = snapState();
    setResult('v', `${fmt(b.v)} c`);
    setResult('sepLab', `${fmt(b.gap)} L`);
    setResult('natural', `${fmt(b.nat)} L`);
    setResult('strain', `${Math.round(b.strain * 100)}% (limit)`);
    setResult('sepShip', `${fmt(b.sepShip)} L`);
    setResult('status', 'snapped');
  } else {
    setResult('v', `${fmt(vMean)} c`);
    setResult('sepLab', `${fmt(C.x - B.x)} L`);
    setResult('natural', `${fmt(natural)} L`);
    setResult('strain', strain < -SLACK_MIN ? `slack ${Math.round(-strain * 100)}%` : `${Math.round(Math.max(0, strain) * 100)}%`);
    setResult('sepShip', `${fmt(t > 0 ? rearFrameView(model, t).D : 1)} L`);
    setResult('status', 'intact');
  }
  $('#resultsNote').classList.toggle('hidden', !broken);
  const head = broken ? `Results at the snap (${fmt(breakEvent.v)} c)` : 'Results';
  const h = document.querySelector('.results-head strong'); if (h.textContent !== head) h.textContent = head;
  updateLiveLine(t, vMean, C.x - B.x, natural, strain, broken);
}
function snapState() {
  const B = shipState(model, 0, breakEvent.t), C = shipState(model, 1, breakEvent.t);
  return { v: breakEvent.v, gap: C.x - B.x, nat: 1 / gammaOf(breakEvent.v), strain: breakEvent.strain, sepShip: rearFrameView(model, breakEvent.tRear).D };
}
function setResult(name, value) { const o = document.querySelector(`[data-result="${name}"]`); if (o && o.value !== value) o.value = value; }

function updateLiveLine(t, v, gap, natural, strain, broken) {
  if (state.step !== 'run') return;
  let text;
  if (t <= T0 && !state.running) text = 'Press Start to run.';
  else if (t < 0) text = 'A\u2019s light flash is on its way to B and C.';
  else if (broken) { const b = snapState(); text = `Snapped at ${fmt(b.v)} c: the gap was ${fmt(b.gap)} L, the thread\u2019s natural length only ${fmt(b.nat)} L.`; }
  else text = `Speed ${fmt(v)} c · gap between ships ${fmt(gap)} L · thread\u2019s natural length ${fmt(natural)} L · stretch ${Math.round(Math.max(0, strain) * 100)}% (snaps at ${Math.round(state.breakStrain * 100)}%)`;
  const el = $('#liveLine');
  if (el.textContent !== text) el.textContent = text;
}

function finish() {
  state.finished = true;
  const firstTime = !state.explore;
  revealExplore(false);
  const snapped = breakEvent !== null;
  const g = model.gammaF, fs = finalStrain(model), lim = Math.round(state.breakStrain * 100);
  const gapEnd = 1 - state.k * (1 - 1 / g);
  let outcome, why = '';
  if (snapped) {
    const b = snapState();
    outcome = `The thread snapped at ${fmt(b.v)} c. The gap between the ships was ${fmt(b.gap)} L, but a thread moving that fast is only ${fmt(b.nat)} L long when relaxed, so it had been stretched past its ${lim}% limit.`;
    const gapNote = state.k < 0.005
      ? 'What broke the thread is that the gap did not shrink with it.'
      : `What broke the thread is that the gap shrank too little: ${fmt(b.gap)} L at the snap, against ${fmt(b.nat)} L for the relaxed thread.`;
    why = `Contraction alone breaks nothing: the ships got shorter too. ${gapNote} The tension is real: a strain gauge on the thread would show it, whichever frame you describe it from.`;
  } else if (Math.abs(fs) < 0.005) {
    outcome = `The thread held, unstretched: the gap shrank to ${fmt(1 / g)} L together with it.`;
    why = 'Only this setting (k = 1, Born-rigid motion) does that. It is what a strong thread would force on light ships by pulling them together.';
  } else if (fs > 0) outcome = `The thread held, stretched by ${Math.round(fs * 100)}%, below its ${lim}% limit: the gap ended at ${fmt(gapEnd)} L, its natural length ${fmt(1 / g)} L.`;
  else outcome = `The thread held but went slack: the gap ended at ${fmt(gapEnd)} L, shorter than its natural length ${fmt(1 / g)} L.`;
  let lead = '';
  if (state.prediction) lead = `<strong>${(state.prediction === 'snaps') === snapped ? 'Your prediction was right.' : 'Not what you predicted.'}</strong> `;
  $('#verdict').innerHTML = lead + outcome + (why ? ` <span class="feedback">${why}</span>` : '');
  const next = [];
  if (snapped && state.k < 1) next.push(['challenge', 'Can you make it hold?']);
  if (state.k !== 0) next.push(['k0', 'Back to the same engines']);
  if (state.layout === 'lab') next.push(['frames', 'See it from the ships\u2019 frame']);
  next.push(['again', 'Run again']);
  $('#nextSteps').innerHTML = next.map(([k, l]) => `<button type="button" class="qontic-app-toggle" data-next="${k}">${l}</button>`).join('');
  if (firstTime) $('#nextSteps').insertAdjacentHTML('beforeend', '<p class="story-links">More controls are now open in the Core tab.</p>');
  showStep('verdict');
}
$('#nextSteps').addEventListener('click', (e) => {
  const k = e.target.closest('[data-next]')?.dataset.next;
  if (!k) return;
  if (k === 'challenge') {
    revealExplore(true);
    $('#verdict').innerHTML = 'Try to keep the thread intact by holding the front ship back with the Front engine slider in the controls, then press Start. The ships must still reach the same final speed.';
    $('#nextSteps').innerHTML = '<button type="button" class="qontic-app-toggle" data-next="k1">Show me the setting that works</button>';
    $('#kSlider').focus();
    return;
  }
  if (k === 'k1' || k === 'k0') { setK(k === 'k1' ? 1 : 0); start(); }
  else if (k === 'frames') { setLayout('frames'); state.t = T0; state.finished = false; start(); }
  else { state.t = T0; state.finished = false; start(); }
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (state.running) {
    if (state.step !== 'run') showStep('run');
    const rate = (tEnd - T0) / 14; // a full run takes about 14 s at speed 1
    state.t += dt * rate * state.speed;
    if (state.t >= tEnd) {
      state.t = tEnd;
      if (state.autoRun) { finish(); state.t = T0; state.finished = false; }
      else { state.running = false; controlsEl.setAttribute('running', 'false'); finish(); }
    }
  }
  try { render(); } catch (err) { console.error(err); }
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- media and shortcuts
mountQonticMedia({
  stage: $('.visualization'),
  controls: controlsEl,
  getCanvases: () => [canvas],
  filename: 'bell-spaceships',
  getShareUrl: shareUrl,
  beginRecording: () => { const was = state.running; if (!was) start(); return was; },
  endRecording: (was) => { if (!was) { state.running = false; controlsEl.setAttribute('running', 'false'); } },
});
mountQonticShortcuts({
  togglePlayback: () => (state.running ? controlsEl.dispatchEvent(new CustomEvent('qontic:stop')) : start()),
  reset: () => resetRun(),
  screenshot: () => document.querySelector('.qontic-media-toolbar button[aria-label="Screenshot"]')?.click(),
});

rebuild();
syncControls();
setLayout(state.layout);
if (state.explore) revealExplore(false);
resetRun();
requestAnimationFrame(frame);
