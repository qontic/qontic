import '../../../../shared/qontic-controls.js?v=3.2';
import { mountQonticShell } from '../../../../shared/qontic-shell.js?v=3.7';
import { mountQonticMedia } from '../../../../shared/qontic-media.js?v=3.0';
import { mountQonticShortcuts } from '../../../../shared/qontic-shortcuts.js?v=1';
import { APP_RELEASE } from './release.js?v=0.2.2';
import { makeRun, pulseAt, delay, gammaOf, markerInApparatusFrame } from './optics.js?v=0.2.2';

mountQonticShell({
  title: 'Michelson–Morley: Two Accounts',
  eyebrow: 'Q-Ontic · Relativity',
  navigation: 'breadcrumbs',
  purpose: 'The same interferometer, drawn with the apparatus moving and at rest, and read two ways: by Lorentz, for whom there is a true rest frame and moving bodies shrink, and by Einstein, for whom no frame is special.',
  badge: 'Relativity',
  version: `Michelson–Morley · Version ${APP_RELEASE.version} · ${APP_RELEASE.date}`,
  homeHref: '../../../index.html',
});

// ---------------------------------------------------------------- state
// The animation variable s is the time on the clock carried by the apparatus, in L/c.
const S0 = -0.35; // a little before the pulse reaches the splitter
const HOLD = 0.4; // pause after the last half returns
const DEG = Math.PI / 180;
const VIEWS = ['classical', 'moving', 'rest', 'both'];
const OLD_VIEWS = { ether: 'moving', apparatus: 'rest' }; // 0.2.0 share links

const $ = (sel) => document.querySelector(sel);
const canvas = $('#stage');
const ctx = canvas.getContext('2d');
const controlsEl = $('qontic-controls');

const state = {
  view: 'classical', beta: 0.6, thetaDeg: 0,
  show: { trails: true, ghost: true, ether: true, curve: true, predict: true },
  s: S0, running: false, autoRun: false, speed: 1,
  prediction: null, finished: false, step: 'setup',
};
let runs, sEnd;

readUrl();

function rebuild() {
  const theta = state.thetaDeg * DEG;
  const make = (picture) => makeRun({ beta: state.beta, theta, account: picture });
  runs = {
    classical: () => [make('classical')],
    moving: () => [make('moving')],
    rest: () => [make('rest')],
    both: () => [make('moving'), make('rest')],
  }[state.view]();
  sEnd = Math.max(...runs.flatMap((r) => r.arms.map((a) => a.T * r.clockRate)));
  updateText();
}
const frameTime = (r, s) => s / r.clockRate; // drawing-frame time at apparatus-clock time s
const isRel = () => state.view !== 'classical';

function resetRun() {
  state.s = S0; state.running = false; state.finished = false; state.prediction = null;
  controlsEl.setAttribute('running', 'false');
  showStep('setup');
}

// ---------------------------------------------------------------- text
const fmt = (x, d = 2) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d);
const g = () => gammaOf(state.beta);

// Clock-reading choices for the relativistic views: 2, 2γ, 2γ².
function clockChoices() {
  const G = g();
  return [
    { key: 'c2', value: 2, note: '' },
    { key: 'c2g', value: 2 * G, note: '' },
    { key: 'c2g2', value: 2 * G * G, note: '' },
  ];
}

function updateText() {
  const G = g();
  $('#betaOut').value = `${fmt(state.beta)} c`;
  $('#betaHint').textContent = {
    classical: 'Speed through the ether. Earth’s orbital speed is about 0.0001 c; it is exaggerated here so the effect can be seen.',
    rest: `With the apparatus at rest, this sets how fast the markers of the other frame stream past. γ = 1/√(1 − v²/c²) = ${fmt(G, 3)}.`,
  }[state.view] || `γ = 1/√(1 − v²/c²) = ${fmt(G, 3)}. A moving length shortens to 1/γ = ${fmt(1 / G)} of its rest length, and a moving clock runs slow by the same factor. Earth’s orbital speed is about 0.0001 c; it is exaggerated here.`;
  $('#thetaOut').value = `${state.thetaDeg}°`;

  const viewLine = {
    classical: '<b>1887 expectation.</b> Light moves at c through a resting <b>ether</b>, a medium thought to carry light. The apparatus moves through it at the speed you set and <b>keeps its shape</b>.',
    moving: '<b>Apparatus moving.</b> The relativistic picture in a frame where the apparatus moves. It is <b>shorter along its motion</b>, and its clock runs slow.',
    rest: '<b>Apparatus at rest.</b> The same events in the apparatus’s own frame. Markers at rest in the other frame stream past.',
    both: '<b>Both.</b> The same events with the apparatus moving (top) and at rest (bottom), run on the clock carried by the apparatus.',
  }[state.view];
  const accountsLine = isRel()
    ? '<b>Lorentz and Einstein draw the same pictures</b> and read them differently; the captions on each panel say how.'
    : '';
  $('#setupList').innerHTML = [
    'A <b>beam splitter</b> divides a light pulse in two. One half runs along <b>arm 1</b> (cyan), the other along <b>arm 2</b> (orange). At rest, both arms have length <b>L</b> and are at right angles.',
    'Each half bounces off a mirror and returns to the splitter. If the halves <b>arrive together</b>, the interference fringes stay put. If one is late, the fringes shift.',
    `The apparatus moves at <b>${fmt(state.beta)} c</b>${state.thetaDeg ? `, turned ${state.thetaDeg}° from its direction of motion` : ', arm 1 along the motion'}. Times are in <b>L/c</b>, the time light takes to cross one arm at rest.`,
    viewLine,
    accountsLine,
  ].filter(Boolean).map((x) => `<li>${x}</li>`).join('');
  $('#setupNext').textContent = state.show.predict ? 'Next: the question' : 'Start';

  // question
  if (!isRel()) {
    $('#predictionText').textContent = 'If the apparatus keeps its shape as it moves through the ether, do the two halves get back to the splitter together?';
    $('#predictButtons').innerHTML = [
      ['together', 'They arrive together.'],
      ['arm1', 'Arm 1 (cyan) is late.'],
      ['arm2', 'Arm 2 (orange) is late.'],
    ].map(([k, l]) => `<button type="button" class="qontic-app-toggle" data-predict="${k}">${l}</button>`).join('');
  } else {
    $('#predictionText').textContent = 'Michelson and Morley found no clear fringe shift: the halves arrive together. What does the clock that rides with the apparatus read when they get back?';
    $('#predictButtons').innerHTML = clockChoices()
      .map((c) => `<button type="button" class="qontic-app-toggle" data-predict="${c.key}">${fmt(c.value)} L/c</button>`).join('');
  }
  // the second time row only makes sense where the apparatus moves and its clock is slow
  $('#rowEther').classList.toggle('hidden', state.view === 'rest' || state.view === 'classical');
  $('#rowEtherOut').classList.toggle('hidden', state.view === 'rest' || state.view === 'classical');
  $('#clockName').textContent = state.view === 'classical' ? 'Time (1887: clocks unaffected)' : 'Apparatus clock';
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
  $('#theta').value = state.thetaDeg;
  setPressed('.view-group', 'data-frameview', state.view);
  document.querySelectorAll('[data-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(state.show[b.dataset.toggle])));
  $('.canvas-host').classList.toggle('tall', state.view === 'both');
}
function setView(view) { state.view = view; syncControls(); rebuild(); resetRun(); }

function showStep(step) {
  ['setup', 'question', 'run', 'verdict'].forEach((k) => $(`#${k}Step`).classList.toggle('hidden', k !== step));
  state.step = step;
}
$('#setupNext').addEventListener('click', () => (state.show.predict ? showStep('question') : start()));
$('#setupBack').addEventListener('click', () => showStep('setup'));
$('#showSetup').addEventListener('click', () => { stop(); showStep('setup'); });
$('#questionStep').addEventListener('click', (e) => {
  const b = e.target.closest('[data-predict]');
  if (!b) return;
  state.prediction = b.dataset.predict === 'skip' ? null : b.dataset.predict;
  start();
});

$('#beta').addEventListener('input', (e) => { state.beta = +e.target.value; rebuild(); resetRun(); });
$('#theta').addEventListener('input', (e) => { state.thetaDeg = +e.target.value; rebuild(); resetRun(); });
document.querySelectorAll('[data-frameview]').forEach((b) => b.addEventListener('click', () => setView(b.dataset.frameview)));
document.querySelectorAll('[data-toggle]').forEach((b) => b.addEventListener('click', () => {
  const key = b.dataset.toggle;
  state.show[key] = !state.show[key];
  b.setAttribute('aria-pressed', String(state.show[key]));
  if (key === 'predict') updateText();
}));

function stop() { state.running = false; controlsEl.setAttribute('running', 'false'); }
controlsEl.addEventListener('qontic:start', () => start());
controlsEl.addEventListener('qontic:stop', () => stop());
controlsEl.addEventListener('qontic:reset', () => resetRun());
controlsEl.addEventListener('qontic:autorun', (e) => { state.autoRun = e.detail.autoRun; controlsEl.setAttribute('auto-run', String(state.autoRun)); });
controlsEl.addEventListener('qontic:speed', (e) => { state.speed = e.detail.speed; });
controlsEl.addEventListener('qontic:tab', (e) => {
  controlsEl.setAttribute('active-tab', e.detail.tab);
  document.querySelectorAll('[data-control-pane]').forEach((p) => p.classList.toggle('hidden', p.dataset.controlPane !== e.detail.tab));
});

function start() {
  if (state.finished || state.s >= sEnd + HOLD) { state.s = S0; state.finished = false; }
  showStep('run');
  state.running = true;
  controlsEl.setAttribute('running', 'true');
}

document.querySelector('.tabs').addEventListener('click', (event) => {
  const button = event.target.closest('[data-view]');
  if (!button) return;
  document.querySelectorAll('.tabs [data-view]').forEach((b) => b.classList.toggle('active', b === button));
  document.querySelectorAll('[data-panel]').forEach((p) => p.classList.toggle('hidden', p.dataset.panel !== button.dataset.view));
  if (button.dataset.view !== 'sim') stop();
});

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
  const b = parseFloat(q.get('beta')); if (Number.isFinite(b)) state.beta = Math.min(0.8, Math.max(0.05, Math.round(b * 20) / 20));
  const th = parseFloat(q.get('theta')); if (Number.isFinite(th)) state.thetaDeg = Math.min(90, Math.max(0, Math.round(th / 5) * 5));
  const v = OLD_VIEWS[q.get('view')] || q.get('view'); if (VIEWS.includes(v)) state.view = v;
}
function shareUrl() {
  const u = new URL(location.href);
  u.search = new URLSearchParams({ view: state.view, beta: fmt(state.beta), theta: String(state.thetaDeg) }).toString();
  return u.href;
}

// ---------------------------------------------------------------- drawing helpers
function palette() {
  const light = document.body.classList.contains('qontic-light');
  return light ? {
    bg: '#fbfdfe', panel: '#f1f6f8', frame: '#c9d9e0', text: '#183747', muted: '#4f6573', grid: '#a9bcc5',
    a1: '#0b8fa0', a2: '#c4661b', arm: '#35505f', ghost: '#7a8f9c', light: '#c99a00', warn: '#c62828', lor: '#7a4fb0', ein: '#0b6f7d',
  } : {
    bg: '#071521', panel: '#0a1c2a', frame: '#23465a', text: '#d6e9f2', muted: '#9fb4c2', grid: '#3b6378',
    a1: '#62dce8', a2: '#f0a35e', arm: '#b6cad6', ghost: '#7e98a8', light: '#f6e27a', warn: '#ff6b6b', lor: '#c9a7ff', ein: '#7cecff',
  };
}
function label(text, x, y, { color, size = 12, align = 'left', base = 'alphabetic', weight = 400 } = {}) {
  ctx.font = `${weight} ${size}px Inter, Arial, sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
  ctx.fillText(text, x, y);
}
// Wrapped text; returns the y after the last line.
function wrap(text, x, y, maxW, { color, size = 12, weight = 400, lead = 1.35 } = {}) {
  ctx.font = `${weight} ${size}px Inter, Arial, sans-serif`;
  const words = text.split(' ');
  let line = '';
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxW && line) { label(line, x, y, { color, size, weight }); y += size * lead; line = w; } else line = t;
  }
  if (line) { label(line, x, y, { color, size, weight }); y += size * lead; }
  return y;
}
function panelFrame(r, title, P) {
  ctx.fillStyle = P.panel; ctx.strokeStyle = P.frame; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 8); ctx.fill(); ctx.stroke();
  label(title, r.x + 12, r.y + 20, { color: P.text, size: 13.5, weight: 600 });
}
function glow(x, y, color) {
  const gr = ctx.createRadialGradient(x, y, 0, x, y, 11);
  gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.3, color); gr.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
}

function captions(run) {
  if (run.account === 'classical') return [['', 'The expectation that failed: light at c through a resting ether, and an apparatus that keeps its shape.']];
  if (run.account === 'lorentz') return [
    ['Lorentz', 'if this is the true rest frame (his ether), the moving arm is really shortened by its internal forces, and this is the true time.'],
    ['Einstein', 'one frame among many; the shortening and the slow clock follow from the two principles.'],
  ];
  return [
    ['Lorentz', 'what the apparatus’s shortened rulers and slow clock report; its motion through the true rest frame cannot be detected.'],
    ['Einstein', 'the apparatus is at rest; light goes at c out and back along each arm.'],
  ];
}

function extent(r) {
  const vEnd = r.v * frameTime(r, sEnd), vStart = r.v * frameTime(r, S0);
  return { x0: Math.min(-1.25, vStart - 1.25), x1: vEnd + 1.35 };
}

function layoutRects(W, H) {
  const gap = 10;
  if (state.view !== 'both') return [{ x: gap, y: gap, w: W - 2 * gap, h: H - 2 * gap }];
  const h = (H - 3 * gap) / 2;
  return [{ x: gap, y: gap, w: W - 2 * gap, h }, { x: gap, y: 2 * gap + h, w: W - 2 * gap, h }];
}

function drawPanel(rect, run, scale, P) {
  const s = Math.min(state.s, sEnd); // hold the final picture after the last return
  const t = frameTime(run, s);
  const ext = extent(runs[0]);
  const title = { classical: '1887 expectation · apparatus moving through the ether', lorentz: `Apparatus moving at ${fmt(run.beta)} c`, einstein: 'Apparatus at rest' }[run.account];
  panelFrame(rect, title, P);

  // captions and clocks, top-left
  let y = rect.y + 40;
  const capW = Math.min(rect.w - 24, state.show.curve && state.view !== 'both' && rect.w >= 640 ? rect.w - 250 : rect.w - 24);
  for (const [who, text] of captions(run)) {
    if (who) {
      ctx.font = '600 12px Inter, Arial, sans-serif';
      const wW = ctx.measureText(`${who}: `).width;
      label(`${who}:`, rect.x + 12, y, { color: who === 'Lorentz' ? P.lor : P.ein, size: 12, weight: 600 });
      y = wrap(text, rect.x + 12 + wW, y, capW - wW, { color: P.muted, size: 12 });
    } else y = wrap(text, rect.x + 12, y, capW, { color: P.muted, size: 12 });
  }
  const tShow = Math.max(0, t);
  const clockText = {
    classical: `time ${fmt(tShow)} L/c (in 1887, clocks were not expected to change)`,
    lorentz: `time in this frame ${fmt(tShow)} · apparatus clock ${fmt(tShow * run.clockRate)} L/c (slow by 1/γ)`,
    einstein: `apparatus clock ${fmt(tShow * run.clockRate)} L/c`,
  }[run.account];
  y = wrap(clockText, rect.x + 12, y + 4, capW, { color: P.text, size: 12.5, weight: 600 });
  if (state.show.ether) {
    const note = run.account === 'classical' ? 'Dots: at rest in the ether.' : run.v > 0 ? 'Dots: markers at rest in this frame.' : `Dots: markers at rest in the other frame, streaming past at ${fmt(run.beta)} c.`;
    y = wrap(note, rect.x + 12, y, capW, { color: P.muted, size: 11.5 });
  }
  const top = y + 2;

  const centre = run.v === 0;
  const ox = centre ? rect.x + rect.w / 2 : rect.x + 20 + (-ext.x0) * scale;
  const oy = Math.min(rect.y + rect.h - 40, top + (rect.y + rect.h - top) / 2 + 0.5 * scale);
  const X = (x) => ox + x * scale, Y = (yy) => oy - yy * scale;

  ctx.save();
  ctx.beginPath(); ctx.rect(rect.x + 1, top, rect.w - 2, rect.y + rect.h - top - 1); ctx.clip();

  // markers at rest in the frame where the apparatus moves; in the apparatus frame they stream past, closer together
  if (state.show.ether) {
    ctx.fillStyle = P.grid;
    const xa = (rect.x - ox) / scale - 1, xb = (rect.x + rect.w - ox) / scale + 1;
    if (run.v > 0 || run.account === 'classical') {
      for (let gx = Math.floor(xa * 2) / 2; gx <= xb; gx += 0.5) for (let gy = -0.25; gy <= 1.6; gy += 0.5) { ctx.beginPath(); ctx.arc(X(gx), Y(gy), 1.8, 0, Math.PI * 2); ctx.fill(); }
    } else {
      const G = gammaOf(run.beta), tp = Math.max(S0, s);
      const Xlo = Math.floor((xa + run.beta * tp) * G * 2) / 2, Xhi = (xb + run.beta * tp) * G;
      for (let Xe = Xlo; Xe <= Xhi; Xe += 0.5) {
        const xp = markerInApparatusFrame(Xe, run.beta, tp);
        for (let gy = -0.25; gy <= 1.6; gy += 0.5) { ctx.beginPath(); ctx.arc(X(xp), Y(gy), 1.8, 0, Math.PI * 2); ctx.fill(); }
      }
    }
  }

  const sx = run.v * t;
  if (state.show.trails && t > 0) {
    run.arms.forEach((a, i) => {
      ctx.strokeStyle = i ? P.a2 : P.a1; ctx.globalAlpha = 0.6; ctx.lineWidth = 1.7;
      ctx.beginPath(); ctx.moveTo(X(0), Y(0));
      if (t < a.t1) { const p = pulseAt(run, i, t); ctx.lineTo(X(p.x), Y(p.y)); }
      else { ctx.lineTo(X(a.Mhit[0]), Y(a.Mhit[1])); const p = pulseAt(run, i, Math.min(t, a.T)); ctx.lineTo(X(p.x), Y(p.y)); }
      ctx.stroke(); ctx.globalAlpha = 1;
    });
  }
  if (run.account === 'lorentz' && state.show.ghost) {
    const restRun = makeRun({ beta: run.beta, theta: run.theta, account: 'classical' });
    ctx.setLineDash([4, 4]); ctx.strokeStyle = P.ghost; ctx.lineWidth = 1.4;
    restRun.arms.forEach((a) => { ctx.beginPath(); ctx.moveTo(X(sx), Y(0)); ctx.lineTo(X(sx + a.R[0]), Y(a.R[1])); ctx.stroke(); });
    ctx.setLineDash([]);
  }
  run.arms.forEach((a, i) => {
    const ex = sx + a.R[0], ey = a.R[1];
    ctx.strokeStyle = P.arm; ctx.lineWidth = 3; ctx.globalAlpha = 0.35;
    ctx.beginPath(); ctx.moveTo(X(sx), Y(0)); ctx.lineTo(X(ex), Y(ey)); ctx.stroke(); ctx.globalAlpha = 1;
    const m = 0.13;
    ctx.strokeStyle = i ? P.a2 : P.a1; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(X(ex - m * a.M[0]), Y(ey - m * a.M[1])); ctx.lineTo(X(ex + m * a.M[0]), Y(ey + m * a.M[1])); ctx.stroke();
    // label beyond the mirror, along the arm
    const n = Math.hypot(a.R[0], a.R[1]);
    const off = 22 + (run.account === 'lorentz' && state.show.ghost ? (1 - n) * scale : 0); // beyond the mirror (and the rest-length outline)
    label(`arm ${i + 1}`, X(ex) + off * a.R[0] / n, Y(ey) - off * a.R[1] / n + 4, { color: i ? P.a2 : P.a1, size: 12, align: 'center', weight: 600 });
  });
  ctx.save(); ctx.translate(X(sx), Y(0)); ctx.rotate(-(run.theta + Math.PI / 4)); ctx.fillStyle = P.light; ctx.globalAlpha = 0.85;
  ctx.fillRect(-9, -2, 18, 4); ctx.restore(); ctx.globalAlpha = 1;
  if (run.v > 0) {
    const ax = X(sx) - 26, ay = Y(0) + 20;
    ctx.strokeStyle = P.muted; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(ax - 30, ay); ctx.lineTo(ax, ay); ctx.lineTo(ax - 6, ay - 4); ctx.moveTo(ax, ay); ctx.lineTo(ax - 6, ay + 4); ctx.stroke();
    label(`${fmt(run.v)} c`, ax - 34, ay + 4, { color: P.muted, size: 11.5, align: 'right' });
  }
  if (t > 0) run.arms.forEach((a, i) => { if (t < a.T) { const p = pulseAt(run, i, t); glow(X(p.x), Y(p.y), i ? P.a2 : P.a1); } });
  run.arms.forEach((a, i) => {
    if (t >= a.T) {
      ctx.strokeStyle = i ? P.a2 : P.a1; ctx.lineWidth = 2; ctx.globalAlpha = Math.max(0.3, 1 - (t - a.T));
      ctx.beginPath(); ctx.arc(X(run.v * a.T), Y(0), 7 + 5 * i, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
    }
  });
  // a note on tilted arms in a frame where the apparatus moves
  if (run.account === 'lorentz' && state.thetaDeg % 90 !== 0) {
    const narrow = rect.w < 760;
    label(narrow ? 'Arms look tilted: only lengths along the motion shorten.' : 'The arms look tilted here: only lengths along the motion shorten.',
      narrow ? rect.x + 12 : rect.x + rect.w - 12, rect.y + rect.h - (narrow ? 27 : 10), { color: P.muted, size: 11.5, align: narrow ? 'left' : 'right' });
  }
  ctx.restore();

  if (state.show.curve && state.view !== 'both' && rect.w >= 640) drawCurve(rect, run, P);
}

// Delay (arm 1 − arm 2) against rotation: the 1887 expectation and the relativistic result.
function drawCurve(rect, run, P) {
  const w = 220, h = 140, x = rect.x + rect.w - w - 12, y = rect.y + 34;
  ctx.fillStyle = P.bg; ctx.globalAlpha = 0.9; ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1;
  ctx.strokeStyle = P.frame; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
  const dMax = Math.max(1e-6, delay(state.beta, 0, 'classical'));
  const px = (deg) => x + 40 + ((w - 52) * deg) / 90;
  const top = y + 40, bot = y + h - 22, mid = (top + bot) / 2;
  const py = (d) => mid - ((bot - top) / 2) * d / dMax;
  label('Delay, arm 1 − arm 2 (L/c)', x + 8, y + 15, { color: P.text, size: 11.5, weight: 600 });
  label(isRel() ? 'dashed: 1887 · solid: measured' : 'expected in 1887; measured: about zero', x + 8, y + 30, { color: P.muted, size: 11 });
  ctx.strokeStyle = P.frame; ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(90), py(0)); ctx.stroke();
  label(`+${fmt(dMax)}`, px(0) - 4, py(dMax) + 4, { color: P.muted, size: 10.5, align: 'right' });
  label('0', px(0) - 4, py(0) + 4, { color: P.muted, size: 10.5, align: 'right' });
  label(`−${fmt(dMax)}`, px(0) - 4, py(-dMax) + 4, { color: P.muted, size: 10.5, align: 'right' });
  ctx.strokeStyle = P.warn; ctx.lineWidth = 2; ctx.setLineDash(isRel() ? [5, 4] : []);
  ctx.beginPath();
  for (let d = 0; d <= 90; d += 2) { const v = delay(state.beta, d * DEG, 'classical'); d ? ctx.lineTo(px(d), py(v)) : ctx.moveTo(px(d), py(v)); }
  ctx.stroke(); ctx.setLineDash([]);
  if (isRel()) { ctx.strokeStyle = P.a1; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(90), py(0)); ctx.stroke(); }
  const cur = isRel() ? 0 : delay(state.beta, state.thetaDeg * DEG, 'classical');
  ctx.fillStyle = P.text; ctx.beginPath(); ctx.arc(px(state.thetaDeg), py(cur), 4, 0, Math.PI * 2); ctx.fill();
  for (const d of [0, 45, 90]) label(`${d}°`, px(d), y + h - 6, { color: P.muted, size: 10.5, align: 'center' });
}

// ---------------------------------------------------------------- main loop
function render() {
  const P = palette();
  const ratio = devicePixelRatio || 1, W = canvas.clientWidth, H = canvas.clientHeight;
  if (W < 40 || H < 40) return;
  if (canvas.width !== Math.round(W * ratio) || canvas.height !== Math.round(H * ratio)) { canvas.width = Math.round(W * ratio); canvas.height = Math.round(H * ratio); }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
  const rects = layoutRects(W, H);
  const ext = extent(runs[0]);
  const capH = state.view === 'both' ? 112 : 130;
  const scale = Math.min(...rects.map((r) => Math.min((r.w - 40) / (ext.x1 - ext.x0), (r.h - capH - 40) / 1.25)));
  rects.forEach((r, i) => drawPanel(r, runs[i], scale, P));
  updateResults();
}

function readings() {
  const r = runs[0];
  const s = Math.min(state.s, sEnd);
  return {
    T1: r.arms[0].T * r.clockRate, T2: r.arms[1].T * r.clockRate,
    now: Math.max(0, s), ether: Math.max(0, frameTime(r, s)),
  };
}
function setResult(name, value) { const o = document.querySelector(`[data-result="${name}"]`); if (o && o.value !== value) o.value = value; }
function updateResults() {
  const { T1, T2, now, ether } = readings();
  setResult('clock', `${fmt(now)} L/c`);
  setResult('ether', `${fmt(ether)} L/c`);
  setResult('t1', now >= T1 - 1e-9 ? `${fmt(T1)} L/c` : '—');
  setResult('t2', now >= T2 - 1e-9 ? `${fmt(T2)} L/c` : '—');
  setResult('diff', now >= Math.max(T1, T2) - 1e-9 ? `${fmt(T1 - T2, 3)} L/c` : '—');
  const G = g();
  setResult('len', {
    classical: 'unchanged',
    moving: `${fmt(1 / G)} of its rest length`,
    rest: 'rest length (at rest)',
    both: `${fmt(1 / G)} of rest / rest length`,
  }[state.view]);
  if (state.step === 'run') {
    let text;
    if (now <= 0) text = 'The pulse is about to reach the splitter.';
    else if (now < Math.min(T1, T2)) text = `Both halves on their way · apparatus clock ${fmt(now)} L/c`;
    else if (now < Math.max(T1, T2)) text = `Arm ${T1 < T2 ? 1 : 2} back at ${fmt(Math.min(T1, T2))} L/c; arm ${T1 < T2 ? 2 : 1} still on its way.`;
    else text = Math.abs(T1 - T2) < 1e-6 ? `Both halves back together at ${fmt(T1)} L/c on the apparatus clock.` : `Arm ${T1 > T2 ? 1 : 2} back ${fmt(Math.abs(T1 - T2), 3)} L/c later.`;
    const el = $('#liveLine'); if (el.textContent !== text) el.textContent = text;
  }
}

// ---------------------------------------------------------------- verdict
const TRADE = '<div class="trade">'
  + '<div><h3>Lorentz</h3><p><b>Keeps:</b> one true rest frame (his ether) and one true time.</p><p><b>Adds:</b> moving bodies shorten and moving clocks slow, because the forces inside them change.</p><p><b>Owes:</b> a reason why no experiment can find the true rest frame. Defenders reply that this follows if all the forces that hold matter together share the same symmetry.</p></div>'
  + '<div><h3>Einstein</h3><p><b>Keeps:</b> the old principle that uniform motion cannot be detected, now extended to light.</p><p><b>Adds:</b> light moves at c for every observer; lengths, durations and simultaneity depend on the frame.</p><p><b>Owes:</b> a physical account of why rods and clocks obey the principles. Defenders reply that the principles are the explanation.</p></div>'
  + '</div>';

function finish() {
  state.finished = true;
  const r = runs[0], G = r.gamma;
  const { T1, T2 } = readings();
  let text, right = null, chose = '';
  if (!isRel()) {
    const d = T1 - T2, key = Math.abs(d) < 1e-6 ? 'together' : d > 0 ? 'arm1' : 'arm2';
    const names = { together: 'together', arm1: 'arm 1 late', arm2: 'arm 2 late' };
    if (state.prediction) { right = state.prediction === key; chose = `You chose: ${names[state.prediction]}. `; }
    text = key === 'together'
      ? `At ${state.thetaDeg}° the two halves happen to arrive together. Turn the apparatus and they would not: the chart shows the expected delay at each angle.`
      : `Arm ${key === 'arm1' ? 1 : 2} is ${fmt(Math.abs(d), 3)} L/c late. Turning the apparatus should change the delay (see the chart), so the fringes should move as it turns. Michelson and Morley looked for that shift. They found far less than expected, consistent with none, at every angle they tried.`;
  } else {
    const choice = clockChoices().find((c) => c.key === state.prediction);
    if (choice) {
      right = Math.abs(choice.value - 2) < 1e-9;
      const why = {
        c2: '',
        c2g: `${fmt(2 * G)} L/c is the time in the frame where the apparatus moves; the clock riding with it runs slow by 1/γ, so it reads ${fmt(2 * G)} × ${fmt(1 / G)} = 2.00. `,
        c2g2: `${fmt(2 * G * G)} L/c is the 1887 expectation for arm 1, with no shortening and no slow clock. `,
      }[choice.key];
      chose = `You chose: ${fmt(choice.value)} L/c. ${why}`;
    }
    const angle = state.thetaDeg % 90 ? ' With the apparatus moving the arms look tilted, because only lengths along the motion shorten.' : '';
    if (state.view === 'moving') {
      text = `Together. Time in this frame ${fmt(2 * G)}; apparatus clock ${fmt(T1)} L/c. The arm along the motion is ${fmt(1 / G)} of its rest length, which exactly makes up for its slower round trip.${angle} If this is the true rest frame, Lorentz reads ${fmt(2 * G)} as the true time and the apparatus clock as slow. Einstein reads ${fmt(2 * G)} as the time in one frame among many.`;
    } else if (state.view === 'rest') {
      text = `Together at ${fmt(T1)} L/c on the apparatus clock. Einstein: the apparatus is at rest, both arms are L, and light goes at c out and back. Lorentz: the same numbers, read off shortened rulers and a slow clock whose motion through the true rest frame cannot be detected.`;
    } else {
      text = `Same events, two frames: in both panels the halves are back together at ${fmt(T1)} L/c on the apparatus clock. Lorentz and Einstein draw the same two pictures. They disagree on what is behind them: whether the top frame is the true rest frame or just one frame among many.${angle}` + TRADE;
    }
  }
  const lead = right === null ? '' : `<strong>${right ? 'Right.' : 'Not quite.'}</strong> ${chose}`;
  $('#verdict').innerHTML = lead + text;
  const next = {
    classical: [['both', 'Now the relativistic picture: moving and at rest'], ['again', 'Run again']],
    moving: [['rest', 'Same events, apparatus at rest'], ['both', 'Both'], ['again', 'Run again']],
    rest: [['moving', 'Same events, apparatus moving'], ['both', 'Both'], ['again', 'Run again']],
    both: [['classical', 'Back to 1887'], ['again', 'Run again']],
  }[state.view];
  $('#nextSteps').innerHTML = next.map(([k, l]) => `<button type="button" class="qontic-app-toggle" data-next="${k}">${l}</button>`).join('');
  showStep('verdict');
}
$('#nextSteps').addEventListener('click', (e) => {
  const k = e.target.closest('[data-next]')?.dataset.next;
  if (!k) return;
  if (k === 'again') { state.s = S0; state.finished = false; start(); return; }
  setView(k);
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (state.running) {
    if (state.step !== 'run') showStep('run');
    const rate = (sEnd + HOLD - S0) / 9; // a run takes about 9 s at speed 1
    state.s += dt * rate * state.speed;
    if (state.s >= sEnd + HOLD) {
      state.s = sEnd + HOLD;
      if (state.autoRun) { finish(); state.s = S0; state.finished = false; }
      else { stop(); finish(); }
    }
  }
  try { render(); } catch (err) { console.error(err); }
  requestAnimationFrame(frame);
}

mountQonticMedia({
  stage: $('.visualization'),
  controls: controlsEl,
  getCanvases: () => [canvas],
  filename: 'michelson-morley',
  getShareUrl: shareUrl,
  beginRecording: () => { const was = state.running; if (!was) start(); return was; },
  endRecording: (was) => { if (!was) stop(); },
});
mountQonticShortcuts({
  togglePlayback: () => (state.running ? stop() : start()),
  reset: () => resetRun(),
  screenshot: () => document.querySelector('.qontic-media-toolbar button[aria-label="Screenshot"]')?.click(),
});

rebuild();
syncControls();
resetRun();
requestAnimationFrame(frame);
