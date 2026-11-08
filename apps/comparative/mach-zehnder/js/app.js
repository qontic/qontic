import { mountQonticMedia } from '../../../../shared/qontic-media.js?v=3.0';
import { mountQonticShortcuts } from '../../../../shared/qontic-shortcuts.js?v=1';
import { mountQonticShell } from '../../../../shared/qontic-shell.js?v=resources-20260916';
import { mountQonticControls } from './qontic-controls.js?v=0.3';
import { APP_RELEASE } from './release.js?v=0.18';
import { G, OPTIONS, correctOption, probabilities, outcome, branches, componentPoint, pilotWavePath, pathPoint } from './physics.js?v=0.18';
import { COMMON, EXPLAIN, VIEW_LABEL, ANSWERS, GLOSSARY, GLOSSARY_ONLY, TEXTBOOK_EXPLAIN, TEXTBOOK_PHYSICS, AGREE } from './content.js?v=0.18';
import { waveBranches, computeField, paintField } from './waves.js?v=0.18';

// Study arm (IUSE design). ?arm=orthodox gives the comparison arm: the same app,
// setups, tasks and timing, but only the orthodox account with decoherence.
// Any other value, or none, offers all four accounts.
const PARAMS = new URLSearchParams(location.search);
// ?arm=orthodox: orthodox with decoherence only. ?arm=textbook: orthodox with collapse at any
// measurement and no decoherence. ?arm=pilot-wave: orthodox and pilot wave. Otherwise all four.
const ARM = { orthodox: 'orthodox-only', textbook: 'textbook', 'pilot-wave': 'orthodox+pilot-wave' }[PARAMS.get('arm')] || 'all-accounts';
const TEXTBOOK = ARM === 'textbook';
const TWO_ACCOUNTS = ARM === 'orthodox+pilot-wave';
// ?agree=1 adds what all accounts agree on beyond the counts; ?explain=1 asks students to explain each result.
const AGREE_ON = PARAMS.get('agree') === '1';
const EXPLAIN_ON = PARAMS.get('explain') === '1';
// ?pid=<id> tags every log entry with a participant id (letters, digits, - and _ only).
const PID = (PARAMS.get('pid') || '').replace(/[^\w-]/g, '').slice(0, 40) || null;
// ?start=random (or an account name) sets the account shown first in the all-accounts arm.
const ACCOUNTS = TWO_ACCOUNTS ? ['orthodox', 'pilot-wave'] : ['orthodox', 'pilot-wave', 'many-worlds', 'spontaneous-collapse'];
const START = ARM === 'orthodox-only' || TEXTBOOK ? 'orthodox'
  : PARAMS.get('start') === 'random' ? ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)]
  : ACCOUNTS.includes(PARAMS.get('start')) ? PARAMS.get('start') : 'orthodox';
const ONE_ACCOUNT = ARM === 'orthodox-only' || TEXTBOOK;
if (ONE_ACCOUNT) {
  document.querySelector('qontic-controls').setAttribute('interpretations', 'cpn');
  document.querySelector('qontic-controls').setAttribute('show-interpretation', 'false');
  const show = (n, on) => { n.hidden = !on; n.style.display = on ? '' : 'none'; };
  show(document.querySelector('[data-setup="compare"]').closest('.qontic-control-section'), false);
  document.querySelectorAll('[data-account]').forEach(n => show(n, n.dataset.account === 'orthodox'));
  document.querySelectorAll('[data-all-accounts]').forEach(n => show(n, false));
  document.querySelectorAll('[data-one-account]').forEach(n => show(n, true));
}
if (TWO_ACCOUNTS) {
  document.querySelector('qontic-controls').setAttribute('interpretations', 'cpn,pw');
  const compare = document.querySelector('[data-setup="compare"]').closest('.qontic-control-section');
  compare.hidden = true; compare.style.display = 'none';
  document.querySelectorAll('[data-account]').forEach(n => { const on = ['orthodox', 'pilot-wave'].includes(n.dataset.account); n.hidden = !on; n.style.display = on ? '' : 'none'; });
}
if (TEXTBOOK) {
  const p = document.querySelector('[data-account="orthodox"]');
  if (p) p.textContent = TEXTBOOK_PHYSICS;
  const cfg = document.querySelector('[data-mz-toggle="config"]')?.closest('.qontic-display-layer');
  if (cfg) cfg.style.display = 'none';
}
const agree = text => TWO_ACCOUNTS ? text.replace(/^All accounts agree: /, 'Both accounts agree: ') : ONE_ACCOUNT ? text.replace(/^All accounts agree: /, '').replace(/^./, ch => ch.toUpperCase()) : text;

mountQonticShell({
  compactHeader: true, navigation: 'breadcrumbs',
  title: 'Atom Mach–Zehnder Interferometer', eyebrow: 'Q-Ontic comparative simulation',
  purpose: ONE_ACCOUNT ? 'Predict what the detectors show when the second beam splitter is removed, a which-way flag is added, or a bomb sits in one arm, then see how quantum mechanics accounts for it.'
    : 'Predict what the detectors show when the second beam splitter is removed, a which-way flag is added, or a bomb sits in one arm, then compare four accounts of what happens.',
  badge: 'Prediction mode', version: `App ${APP_RELEASE.version} · ${APP_RELEASE.date}`,
  homeHref: '../../../index.html', labHref: 'https://qonticlab.rice.edu/',
});

// ---------- view tabs ----------
const tabs = document.querySelector('.tabs');
tabs.addEventListener('click', event => {
  const button = event.target.closest('[data-view]');
  if (!button) return;
  tabs.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
  document.querySelectorAll('[data-panel]').forEach(panel => panel.classList.toggle('hidden', panel.dataset.panel !== button.dataset.view));
  if (button.dataset.view === 'log') renderLog();
});

// ---------- storage (falls back to memory when blocked) ----------
const LOG_KEY = 'qontic-mz-log-v1';
// One id per page load, so entries from one sitting can be grouped.
const SESSION = Math.random().toString(36).slice(2, 10);
let memoryLog = [];
const readLog = () => { try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); } catch { return memoryLog; } };
const writeLog = entries => { memoryLog = entries; try { localStorage.setItem(LOG_KEY, JSON.stringify(entries)); } catch { /* memory only */ } };
// Interaction events (account and display changes, setups, atoms sent), for study analysis.
const EVENT_KEY = 'qontic-mz-events-v1';
let memoryEvents = [];
const readEvents = () => { try { return JSON.parse(localStorage.getItem(EVENT_KEY) || '[]'); } catch { return memoryEvents; } };
const writeEvents = entries => { memoryEvents = entries; try { localStorage.setItem(EVENT_KEY, JSON.stringify(entries)); } catch { /* memory only */ } };
const FIRST_RUN_KEY = 'qontic-mz-first-run-v1';
const firstRunDone = () => { try { return localStorage.getItem(FIRST_RUN_KEY) === '1'; } catch { return false; } };
const saveFirstRun = () => { try { localStorage.setItem(FIRST_RUN_KEY, '1'); } catch { /* memory only */ } };

// ---------- state ----------
const state = {
  setup: { bs2: true, object: 'none', markerSize: 'micro', delta: 0 },
  compare: false,
  calibrated: firstRunDone(),
  view: START, running: false, autoRerun: false, speed: 1,
  display: { wave: true, config: !TEXTBOOK, labels: true, predict: true, fixedStart: false },
  fixedU: .3,
  atom: null, // { u, start, path, pathLen, result, clicked }
  tallies: {}, predictions: {},
};
const baseKey = () => `${state.setup.bs2 ? 'in' : 'out'}-${state.setup.object}`;
const detuned = () => state.setup.bs2 && state.setup.object === 'none' && Math.abs(state.setup.delta) > 1e-3;
const key = () => baseKey() + (detuned() ? `-phase${Math.round(state.setup.delta * 180 / Math.PI)}` : '');
const tally = () => (state.tallies[key()] ||= { d1: 0, d2: 0, bomb: 0, total: 0 });
function logEvent(type, extra = {}) {
  const events = readEvents();
  events.push({ t: new Date().toISOString(), participant: PID, session: SESSION, app: 'mach-zehnder', release: APP_RELEASE.version, arm: ARM, type,
    account: state.view, display: state.compare ? 'all-four' : 'one-account', setup: { secondBeamSplitter: state.setup.bs2, upperArm: state.setup.object }, ...extra });
  writeEvents(events);
}

// ---------- controls ----------
const ui = mountQonticControls({
  onStart: () => { if (!canRun()) { ui.setRunning(false); flashHint(); return; } resume(); },
  onStop: () => { pause(); },
  onReset: () => { state.running = false; ui.setRunning(false); state.atom = null; state.tallies[key()] = { d1: 0, d2: 0, bomb: 0, total: 0 }; delete state.predictions[key()]; syncPanel(); },
  onAutorun: ({ autoRerun }) => { state.autoRerun = autoRerun; },
  onInterpretation: ({ interpretation }) => { state.view = interpretation; logEvent('account'); syncPanel(); },
  onControlchange: ({ name, value }) => { if (name === 'speed') state.speed = value; },
});

if (START !== 'orthodox') ui.setInterpretation(START);
logEvent('load', { start: START });

document.querySelectorAll('[data-setup]').forEach(group => group.addEventListener('click', event => {
  const button = event.target.closest('button[data-value]');
  if (!button) return;
  group.querySelectorAll('button').forEach(b => { const on = b === button; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
  const name = group.dataset.setup, value = button.dataset.value;
  if (name === 'compare') { state.compare = value === 'all'; document.querySelector('[data-results-panel]').hidden = state.compare; logEvent('display'); return; }
  state.setup[name] = name === 'bs2' ? value === 'in' : value;
  logEvent('setup');
  if (name !== 'markerSize') { state.atom = null; state.running = false; ui.setRunning(false); }
  syncPanel();
}));

document.querySelectorAll('[data-mz-toggle]').forEach(button => button.addEventListener('click', () => {
  const on = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(on));
  state.display[button.dataset.mzToggle] = on;
  document.getElementById('mz-start-row').hidden = !state.display.fixedStart;
  syncPanel();
}));
// The phase between the arms is fixed at 0: with nothing in the arms D2 stays dark.
const startInput = document.getElementById('mz-start');
startInput.addEventListener('input', () => { state.fixedU = +startInput.value; startInput.nextElementSibling.value = (+startInput.value).toFixed(2); });

// ---------- prediction form ----------
const optionsBox = document.getElementById('mz-options');
let shownOptions = '';
function buildOptions() {
  // Offer only answers that fit the setup: bomb answers only when a bomb is in the arm.
  const ids = state.setup.object === 'bomb' ? ['d1', 'abs-d1', 'abs-both', 'abs-d2'] : ['d1', 'd2', 'both'];
  const sig = ids.join();
  if (sig === shownOptions) return;
  shownOptions = sig;
  optionsBox.querySelectorAll('.mz-option').forEach(n => n.remove());
  ids.forEach(id => {
    const label = OPTIONS.find(([o]) => o === id)[1];
    const row = document.createElement('label');
    row.className = 'mz-option';
    row.innerHTML = `<input type="radio" name="mz-option" id="mz-opt-${id}" value="${id}"><span>${id === 'd1' && state.setup.object === 'bomb' ? 'No atom is ever absorbed; all reach D1' : label}</span>`;
    optionsBox.append(row);
  });
}
buildOptions();
const glossary = document.getElementById('mz-glossary');
GLOSSARY.filter(([term]) => (!ONE_ACCOUNT && !TWO_ACCOUNTS) || !GLOSSARY_ONLY[term]).filter(([term]) => !TEXTBOOK || !['Decoherence', 'Configuration space', 'Entangled'].includes(term)).forEach(([term, def]) => { const dt = document.createElement('dt'); dt.textContent = term; const dd = document.createElement('dd'); dd.textContent = def; glossary.append(dt, dd); });
const confBox = document.getElementById('mz-confidence');
const confNames = ['Guessing', 'Unsure', 'Somewhat sure', 'Sure', 'Certain'];
for (let i = 1; i <= 5; i++) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'mz-conf'; b.textContent = String(i); b.dataset.value = String(i);
  b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false'); b.title = confNames[i - 1]; b.id = `mz-conf-${i}`;
  confBox.append(b);
}
let draft = { option: null, confidence: null };
optionsBox.addEventListener('change', event => { draft.option = event.target.value; syncPanel(); });
confBox.addEventListener('click', event => {
  const b = event.target.closest('.mz-conf'); if (!b || b.disabled) return;
  draft.confidence = +b.dataset.value; syncPanel();
});
const reasonInput = document.getElementById('mz-reason-input');
document.getElementById('mz-predict').addEventListener('submit', event => {
  event.preventDefault();
  if (!draft.option || !draft.confidence) return;
  const entries = readLog();
  const setupLog = { secondBeamSplitter: state.setup.bs2, upperArm: state.setup.object };
  const attempt = 1 + entries.filter(e => e.session === SESSION && e.setup?.secondBeamSplitter === setupLog.secondBeamSplitter && e.setup?.upperArm === setupLog.upperArm).length;
  const id = `${SESSION}-${entries.length + 1}`;
  // Logged at lock time, so a lock later erased by Reset still appears.
  entries.push({ id, participant: PID, session: SESSION, attempt, app: 'mach-zehnder', release: APP_RELEASE.version, arm: ARM, setup: setupLog,
    lockedAt: new Date().toISOString(), interpretationAtLock: state.view, displayAtLock: state.compare ? 'all-four' : 'one-account',
    prediction: draft.option, confidence: draft.confidence, reason: reasonInput.value.trim(), status: 'pending' });
  writeLog(entries);
  state.predictions[key()] = { id, option: draft.option, confidence: draft.confidence, reason: reasonInput.value.trim(), view: state.view, at: new Date().toISOString(), logged: false };
  syncPanel();
});

const isCalibration = () => state.setup.bs2 && state.setup.object === 'none' && !detuned();
const needsCalibration = () => state.display.predict && !state.calibrated && !isCalibration();
const showTuning = () => state.calibrated || !state.display.predict;
const canRun = () => !needsCalibration() && (!state.display.predict || detuned() || isCalibration() || Boolean(state.predictions[key()]));
const hint = document.getElementById('mz-hint');
const flashHint = () => { hint.classList.remove('mz-flash'); void hint.offsetWidth; hint.classList.add('mz-flash'); };

// The first run (beam splitter in, nothing in the arms) counts as soon as atoms are
// sent, so changing the setup while the first atom flies does not lock the app again.
const markFirstRun = () => { if (isCalibration() && !state.calibrated) { state.calibrated = true; saveFirstRun(); syncPanel(); } };
document.getElementById('mz-one').addEventListener('click', () => { if (!canRun()) return flashHint(); markFirstRun(); logEvent('send', { atoms: 1 }); launch(); state.paused = false; state.running = true; ui.setRunning(true); });
document.getElementById('mz-many').addEventListener('click', () => {
  if (!canRun()) return flashHint();
  markFirstRun();
  logEvent('send', { atoms: 200 });
  // Exactly 200 atoms, all tallied at once; the animated atom is the last of them
  // (already counted), so the counter and the log both read 200.
  const t = tally();
  let u = 0;
  for (let i = 0; i < 200; i++) { u = Math.random(); const r = outcome(state.setup, u).result; t[r]++; t.total++; }
  launch(u, true); state.paused = false; state.running = true; ui.setRunning(true);
  syncPanel();
});

let lastKey = null;
function syncPanel() {
  buildOptions();
  const p = state.predictions[key()];
  if (key() !== lastKey) { lastKey = key(); if (!p) { draft = { option: null, confidence: null }; reasonInput.value = ''; } }
  const locked = canRun();
  document.getElementById('mz-predict').hidden = !state.display.predict || detuned() || isCalibration() || needsCalibration();
  if (p) draft = { option: p.option, confidence: p.confidence };
  optionsBox.querySelectorAll('input').forEach(input => { input.checked = input.value === draft.option; input.disabled = Boolean(p); input.closest('.mz-option').classList.toggle('is-selected', input.checked); });
  confBox.querySelectorAll('.mz-conf').forEach(b => { const on = +b.dataset.value === draft.confidence; b.classList.toggle('active', on); b.setAttribute('aria-checked', String(on)); b.disabled = Boolean(p); });
  reasonInput.disabled = Boolean(p);
  if (p) reasonInput.value = p.reason;
  const lock = document.getElementById('mz-lock');
  lock.disabled = Boolean(p) || !draft.option || !draft.confidence;
  lock.textContent = p ? 'Prediction locked' : 'Lock prediction';
  document.getElementById('mz-one').disabled = !locked;
  document.getElementById('mz-many').disabled = !locked;
  const t = tally();
  hint.textContent = !state.display.predict ? 'Prediction mode is off (Advanced tab): send atoms freely.'
    : isCalibration() ? (state.calibrated ? 'Every atom reaches D1: with nothing in the arms, D2 stays dark. Now choose another setup and predict.' : 'First, send a few atoms through the plain interferometer and see where they go. No prediction needed.')
    : needsCalibration() ? 'First, send a few atoms with the second beam splitter in place and nothing in the arms. Then come back to this setup.'
    : !locked ? 'Choose an answer and a confidence, then lock your prediction to run this setup.'
    : t.total < 100 ? `Send at least 100 atoms to compare with your prediction (${t.total} so far).` : ONE_ACCOUNT ? 'Change the setup to explore further.' : 'Change the setup or the interpretation to explore further.';
  ['d1', 'd2', 'bomb', 'total'].forEach(name => ui.setResult(name, String(t[name])));
  document.querySelectorAll('[data-bomb-row]').forEach(n => { n.hidden = state.setup.object !== 'bomb'; });
  const deg = Math.round(state.setup.delta * 180 / Math.PI);
  document.getElementById('mz-tuning').textContent = !state.setup.bs2
    ? 'Removed: nothing recombines. The upper beam heads to D2 and the lower beam to D1.'
    : !showTuning() ? 'In place.'
    : 'In place, tuned so that with nothing in the arms every atom reaches D1 and D2 stays dark.';
  evaluate();
  const fb = document.getElementById('mz-feedback');
  // In prediction mode the explanation waits for the verdict (100 atoms), so one atom
  // does not give the answer away. The first run and free exploration show it at once.
  const needsVerdict = state.display.predict && !isCalibration() && !detuned();
  fb.hidden = t.total === 0 || (needsVerdict && t.total < 100);
  document.getElementById('mz-common').textContent = agree(COMMON[baseKey()]);
  document.getElementById('mz-explain-label').textContent = ONE_ACCOUNT ? 'What happens:' : `${VIEW_LABEL[state.view]}:`;
  let text = (TEXTBOOK ? TEXTBOOK_EXPLAIN : EXPLAIN[state.view])[baseKey()];
  const agreeLine = document.getElementById('mz-agree');
  if (agreeLine) { agreeLine.hidden = !AGREE_ON || isCalibration(); agreeLine.textContent = agree(AGREE[baseKey()]); }
  const selfBox = document.getElementById('mz-self');
  if (selfBox) selfBox.hidden = !EXPLAIN_ON || isCalibration();
  if (state.view === 'spontaneous-collapse' && state.setup.object === 'marker' && state.setup.markerSize === 'macro' && state.setup.bs2)
    text = 'A macroscopic flag moves many particles, so the state collapses at the flag: the atom is then in one arm only, a single part reaches the second beam splitter, and D1 and D2 are equally likely.';
  document.getElementById('mz-explain').textContent = text;
}

function evaluate() {
  const p = state.predictions[key()], t = tally(), verdict = document.getElementById('mz-verdict');
  if (!p || detuned() || isCalibration() || t.total < 100) { verdict.textContent = ''; verdict.className = 'mz-verdict'; return; }
  const correct = correctOption(state.setup);
  const ok = p.option === correct;
  // Lower-case the first word only when it is an ordinary word (not D1, D2).
  const label = id => { const t = OPTIONS.find(([o]) => o === id)[1]; return /^[A-Z][a-z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t; };
  verdict.className = `mz-verdict ${ok ? 'is-right' : 'is-wrong'}`;
  verdict.textContent = ok ? `Your prediction matches: ${label(correct)}.` : `Not this time. You predicted “${label(p.option)}”; the detectors show ${label(correct)}.`;
  if (!p.logged) {
    p.logged = true;
    const entries = readLog();
    const e = entries.find(x => x.id === p.id);
    if (e) Object.assign(e, { status: 'result', resultAt: new Date().toISOString(), interpretationAtResult: state.view, displayAtResult: state.compare ? 'all-four' : 'one-account', correctAnswer: correct, correct: ok, counts: { ...t } });
    writeLog(entries);
  }
}

// ---------- explain step (?explain=1) ----------
document.getElementById('mz-self-prompt').textContent = ONE_ACCOUNT
  ? 'Explain this result in your own words, in two ways: what happens to the atom, and why the detectors show these counts.'
  : TWO_ACCOUNTS ? 'Explain this result in both accounts, orthodox and pilot wave: how does each describe it, and what do they agree on?'
  : 'Explain this result in two of the accounts: how does each describe it, and what do they agree on?';
document.getElementById('mz-self-save').addEventListener('click', () => {
  const input = document.getElementById('mz-self-input'), text = input.value.trim();
  if (!text) return;
  logEvent('explain', { text, prediction: state.predictions[key()]?.id || null });
  document.getElementById('mz-self-status').textContent = 'Saved.';
});
document.querySelectorAll('[data-setup="bs2"], [data-setup="object"]').forEach(g => g.addEventListener('click', () => {
  document.getElementById('mz-self-input').value = ''; document.getElementById('mz-self-status').textContent = '';
}));

// ---------- log tab ----------
function renderLog() {
  const body = document.querySelector('#mz-log-table tbody');
  const entries = readLog();
  body.innerHTML = '';
  if (!entries.length) { body.innerHTML = '<tr><td colspan="5">No predictions yet. Lock a prediction, then send at least 100 atoms.</td></tr>'; return; }
  entries.slice().reverse().forEach(e => {
    const tr = document.createElement('tr');
    const setup = `${e.setup.secondBeamSplitter ? 'BS2 in' : 'BS2 out'}, ${e.setup.upperArm}`;
    const pred = OPTIONS.find(([o]) => o === e.prediction)?.[1] || e.prediction;
    const result = e.status === 'pending' ? 'No result (fewer than 100 atoms)' : e.correct ? 'Matched' : 'Did not match';
    [new Date(e.lockedAt || e.time).toLocaleString(), setup, pred, String(e.confidence), result].forEach(v => { const td = document.createElement('td'); td.textContent = v; tr.append(td); });
    body.append(tr);
  });
}
const logStatus = document.getElementById('mz-log-status');
const exportData = () => ({ participant: PID, predictions: readLog(), events: readEvents() });
document.getElementById('mz-log-copy').addEventListener('click', async () => {
  const text = JSON.stringify(exportData(), null, 2);
  try { await navigator.clipboard.writeText(text); logStatus.textContent = 'Copied.'; } catch { logStatus.textContent = 'Copying is blocked here; use Download.'; }
});
document.getElementById('mz-log-download').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'qontic-mach-zehnder-log.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});
const clearButton = document.getElementById('mz-log-clear');
clearButton.addEventListener('click', () => {
  if (clearButton.dataset.confirm !== 'yes') { clearButton.dataset.confirm = 'yes'; clearButton.textContent = 'Click again to clear'; return; }
  writeLog([]); writeEvents([]); try { localStorage.removeItem(FIRST_RUN_KEY); } catch { /* memory only */ } clearButton.dataset.confirm = ''; clearButton.textContent = 'Clear log'; logStatus.textContent = 'Log cleared.'; renderLog();
});

// ---------- atoms ----------
const DURATION = 3400;
// Stop freezes the atom where it is; Start continues it, or sends a new atom if the last one has finished.
function pause() { state.paused = true; state.running = false; ui.setRunning(false); }
function resume() {
  markFirstRun();
  state.paused = false; state.running = true; ui.setRunning(true);
  if (!state.atom || state.atom.elapsed > DURATION + holdTime()) launch();
}
const holdTime = () => (state.compare || state.view === 'many-worlds') ? 3800 : 700;
function launch(uGiven = null, preCounted = false) {
  const u = uGiven ?? (state.display.fixedStart ? state.fixedU : Math.random());
  const o = outcome(state.setup, u);
  const pw = pilotWavePath(state.setup, u);
  let pathLen = 0;
  for (let i = 1; i < pw.pts.length; i++) pathLen += Math.hypot(pw.pts[i].x - pw.pts[i - 1].x, pw.pts[i].y - pw.pts[i - 1].y);
  state.atom = { u, o, path: pw.pts, pathLen, start: performance.now(), elapsed: 0, last: performance.now(), counted: preCounted };
}
function finishAtom() {
  const a = state.atom;
  if (a.counted) return;
  a.counted = true;
  if (isCalibration()) { state.calibrated = true; saveFirstRun(); }
  const t = tally(); t[a.o.result]++; t.total++;
  syncPanel();
}

// ---------- drawing ----------
const canvas = document.querySelector('.mz-canvas'), ctx = canvas.getContext('2d');
const caption = document.getElementById('mz-caption');
const colors = () => {
  const light = document.documentElement.classList.contains('qontic-light') || document.body.classList.contains('qontic-light');
  return light ? { beam: '#9db6c4', optic: '#2b6476', text: '#284c5d', muted: '#5c7686', wave: '#1594a8', a: '#b7791f', b: '#7b5cc4', particle: '#0e2a38', flash: '#d97706', panel: '#ffffffcc', bomb: '#b4432f' }
    : { beam: '#23465b', optic: '#7cc9d6', text: '#d9edf7', muted: '#7f98a8', wave: '#58d5e8', a: '#e0ad27', b: '#b49cff', particle: '#ffffff', flash: '#ffd166', panel: '#08151fcc', bomb: '#ff7a5c' };
};
let view = { k: 1, ox: 0, oy: 0 };
let V = 'orthodox';
let WORLD = null; // many-worlds tile being drawn: { outcome, exploded }
const T = p => ({ x: view.ox + p.x * view.k, y: view.oy + p.y * view.k });

function blob(p, r, color, alpha) {
  const q = T(p), rr = r * view.k;
  const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, rr);
  g.addColorStop(0, color + Math.round(alpha * 255).toString(16).padStart(2, '0'));
  g.addColorStop(1, color + '00');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q.x, q.y, rr, 0, Math.PI * 2); ctx.fill();
}
function line(a, b, color, width = 1, dash = []) {
  const p = T(a), q = T(b);
  ctx.strokeStyle = color; ctx.lineWidth = width * view.k; ctx.setLineDash(dash.map(d => d * view.k));
  ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.setLineDash([]);
}
function label(text, p, color, align = 'center', size = 14) {
  const q = T(p);
  ctx.fillStyle = color; ctx.font = `${Math.max(8, size * view.k)}px Inter, Arial, sans-serif`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.fillText(text, q.x, q.y);
}
function plate(center, angle, color, dashed = false) {
  const half = 32, c = Math.cos(angle), s = Math.sin(angle);
  line({ x: center.x - c * half, y: center.y - s * half }, { x: center.x + c * half, y: center.y + s * half }, color, dashed ? 2 : 5, dashed ? [5, 5] : []);
}

function drawApparatus(c, s, result) {
  [[G.S, G.BS1], [G.BS1, G.MU], [G.BS1, G.ML], [G.MU, G.BS2], [G.ML, G.BS2], [G.BS2, G.D1], [G.BS2, G.D2]].forEach(([a, b]) => line(a, b, c.beam, 2));
  // source
  const src = T({ x: G.S.x - 26, y: G.S.y - 18 });
  ctx.strokeStyle = c.optic; ctx.lineWidth = 2 * view.k; ctx.strokeRect(src.x, src.y, 34 * view.k, 36 * view.k);
  plate(G.BS1, Math.PI / 2, c.optic);
  plate(G.BS2, Math.PI / 2, c.optic, !state.setup.bs2);
  plate(G.MU, 0, c.muted); plate(G.ML, 0, c.muted);
  const arrived = state.atom && s >= G.total - 1;
  [['D1', G.D1, G.dUp], ['D2', G.D2, G.dDown]].forEach(([name, d]) => {
    const p = T(d), size = 30 * view.k;
    const probs = probabilities(state.setup);
    const hit = WORLD ? arrived && WORLD.outcome === name.toLowerCase() : arrived && result === name.toLowerCase();
    ctx.fillStyle = hit ? c.flash : 'transparent'; ctx.strokeStyle = hit ? c.flash : c.optic; ctx.lineWidth = 2 * view.k;
    ctx.beginPath(); ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (state.display.labels) label(name, { x: d.x + 34, y: d.y }, c.text, 'left', 16);
    const minor = state.display.labels && view.k > .45;
    if (minor && state.setup.bs2 && state.setup.object === 'none' && showTuning() && Math.abs(state.setup.delta) < 1e-3)
      label(name === 'D1' ? 'bright port' : 'dark port', { x: d.x, y: d.y + 32 }, c.muted, 'center', 12);
    if (minor && !state.setup.bs2)
      label(name === 'D1' ? 'lower beam heads here' : 'upper beam heads here', { x: d.x, y: d.y + 32 }, c.muted, 'center', 12);
  });
  if (state.display.labels && view.k > .45 && state.setup.bs2 && showTuning()) {
    const deg = Math.round(state.setup.delta * 180 / Math.PI);
    label(deg !== 0 ? `detuned by ${deg}°` : state.setup.object === 'none' ? 'tuned: D2 dark' : 'tuned: D2 dark with nothing in the arms', { x: G.BS2.x, y: G.BS2.y + 64 }, deg === 0 ? c.wave : c.flash, 'center', 12);
  }
  if (state.setup.object === 'marker') {
    const p = T(G.OBJ);
    ctx.strokeStyle = c.a; ctx.lineWidth = 2 * view.k;
    ctx.strokeRect(p.x - 14 * view.k, p.y - 14 * view.k, 28 * view.k, 28 * view.k);
    if (state.display.labels && view.k > .45) label('Flag', { x: G.OBJ.x - 22, y: G.OBJ.y - 4 }, c.a, 'right');
  }
  if (state.setup.object === 'bomb') {
    const exploded = WORLD ? WORLD.exploded : state.atom && result === 'bomb' && s >= G.sObj;
    const p = T(G.OBJ);
    ctx.fillStyle = exploded ? c.flash : c.bomb; ctx.beginPath(); ctx.arc(p.x, p.y, (exploded ? 22 : 13) * view.k, 0, Math.PI * 2); ctx.fill();
    if (state.display.labels && view.k > .45) label(exploded ? 'Bomb exploded' : 'Bomb', { x: G.OBJ.x - 24, y: G.OBJ.y - 4 }, c.bomb, 'right');
  }
  if (state.display.labels && view.k > .45) {
    label('Source', { x: G.S.x - 9, y: G.S.y + 36 }, c.muted, 'center', 12);
    label('BS1', { x: G.BS1.x, y: G.BS1.y + 46 }, c.muted, 'center', 12);
    label(state.setup.bs2 ? 'BS2' : 'BS2 removed', { x: G.BS2.x, y: G.BS2.y + 46 }, c.muted, 'center', 12);
  }
}

// Which branches are drawn in each account at arc length s.
function visibleBranches(s, result) {
  let list = branches(state.setup, s);
  const collapsesAtObject = V === 'orthodox' ? state.setup.object === 'bomb' || (TEXTBOOK && state.setup.object === 'marker')
    : V === 'spontaneous-collapse' ? state.setup.object === 'bomb' || (state.setup.object === 'marker' && state.setup.markerSize === 'macro') : false;
  if (collapsesAtObject && s >= G.sObj) {
    if (result === 'bomb') return [];
    const arm = state.atom.o.arm;
    list = list.filter(b => !b.exploded && b.arms.includes(arm)).map(b => ({ ...b, weight: 1 }));
  }
  return list;
}

let fieldCache = null;
function fieldsFor(s, result) {
  // Densities per branch, cached per frame; collapse views reuse them with a renormalized branch.
  if (fieldCache && fieldCache.s === s && fieldCache.key === key()) return fieldCache;
  const list = waveBranches(state.setup, s, state.setup.delta);
  const all = computeField(list, s);
  let collapsed = all;
  if (state.setup.object !== 'none' && s >= G.sObj && result !== 'bomb') {
    const keep = state.setup.object === 'bomb' ? 'b' : (state.atom.o.arm === 'U' ? 'a' : 'b');
    collapsed = computeField(list.filter(b => b.key === keep), s, { [keep]: Math.SQRT2 });
  }
  fieldCache = { s, key: key(), all, collapsed };
  return fieldCache;
}

function flightTag(c, s, result) {
  if (!state.atom || view.k < .3) return;
  if (V === 'orthodox') {
    const measured = ((state.setup.object === 'bomb' || (TEXTBOOK && state.setup.object === 'marker')) && s >= G.sObj) || s >= G.total - 1;
    const decohered = !TEXTBOOK && state.setup.object === 'marker' && s >= G.sObj;
    label(measured ? 'a measurement occurred: collapse' : decohered ? 'flag entangled with the path: interference lost (decoherence), no collapse yet' : 'no measurement yet: no collapse',
      { x: 500, y: 18 }, measured ? c.flash : decohered ? c.a : c.muted, 'center', 12);
  } else if (V === 'spontaneous-collapse') {
    const st = scState(s, result);
    label(`collapse clock: ${formatTime(1 / (LAMBDA * st.n))}${st.collapsed ? ' \u2192 collapsed' : ''}`, { x: 500, y: 18 }, st.collapsed ? c.flash : c.muted, 'center', 12);
  }
}
function drawWave(c, s, result) {
  if (!state.display.wave || !state.atom) return;
  flightTag(c, s, result);
  const atDetectors = s >= G.total - 1;
  const collapseViews = V === 'orthodox' || V === 'spontaneous-collapse';
  if (atDetectors && collapseViews && result !== 'bomb') {
    const since = state.atom.elapsed - DURATION;
    if (since < 450) { const f0 = fieldsFor(s, result); ctx.globalAlpha = 1 - since / 450; ctx.drawImage(paintField(f0.all, () => c.wave, 1), view.ox, view.oy, 1000 * view.k, 600 * view.k); ctx.globalAlpha = 1; }
    blob(result === 'd1' ? G.D1 : G.D2, 26, c.wave, .95);
    collapseMark(c, result === 'd1' ? G.D1 : G.D2, since);
    return;
  }
  const collapsesAtObject = V === 'orthodox' ? state.setup.object === 'bomb' || (TEXTBOOK && state.setup.object === 'marker')
    : V === 'spontaneous-collapse' ? state.setup.object === 'bomb' || (state.setup.object === 'marker' && state.setup.markerSize === 'macro') : false;
  const tObj = DURATION * G.sObj / G.total, sinceObj = state.atom.elapsed - tObj;
  if (collapsesAtObject && s >= G.sObj) collapseMark(c, G.OBJ, sinceObj);
  const f = fieldsFor(s, result);
  if (collapsesAtObject && s >= G.sObj && sinceObj < 450) {
    ctx.globalAlpha = 1 - sinceObj / 450;
    ctx.drawImage(paintField(f.all, () => c.wave, 1), view.ox, view.oy, 1000 * view.k, 600 * view.k);
    ctx.globalAlpha = 1;
  }
  if (collapsesAtObject && result === 'bomb' && s >= G.sObj) return;
  const fields = collapsesAtObject && s >= G.sObj ? f.collapsed : f.all;
  const branchColor = k => fields.length < 2 ? c.wave : V === 'many-worlds' || V === 'pilot-wave' ? (k === 'a' ? c.a : c.b) : (k === 'a' ? c.a : c.wave);
  const img = paintField(fields, branchColor, V === 'pilot-wave' ? .55 : 1);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, view.ox, view.oy, 1000 * view.k, 600 * view.k);
  if (fields.length > 1 && view.k > .3 && !state.compare) {
    const items = state.setup.object === 'marker'
      ? [[branchColor('a'), 'part with the atom in the upper arm (flag raised)'], [branchColor('b'), 'part with the atom in the lower arm (flag down)']]
      : [[branchColor('b'), 'part with the bomb intact']];
    items.forEach(([col, text], i) => { blob({ x: 590, y: 548 + i * 22 }, 9, col, .95); label(text, { x: 606, y: 548 + i * 22 }, c.muted, 'left', 12); });
  }
  waveNotes(c, s);
}

// Short on-diagram notes where the picture needs a word of explanation.
function waveNotes(c, s) {
  if (!state.display.labels || view.k < .45 || state.setup.bs2 || !state.atom) return;
  const near = s > G.sBS2 - 140 && s < G.sBS2 + 160;
  if (!near) return;
  if (state.setup.object === 'none' && V !== 'many-worlds')
    label('fringes where the two beams overlap; still 50/50 at the detectors', { x: G.BS2.x, y: G.BS2.y + 86 }, c.muted, 'center', 12);
  if (V === 'pilot-wave')
    label(state.setup.object === 'none' ? 'trajectories cannot cross here: the atom turns back' : 'other part marked or gone: the atom goes straight on', { x: G.BS2.x, y: G.BS2.y - 64 }, c.flash, 'center', 12);
}

function drawParticle(c, s) {
  if (V !== 'pilot-wave' || !state.atom) return;
  const a = state.atom;
  const f = Math.min(1, s / a.pathLen);
  const { point, index } = pathPoint(a.path, f);
  ctx.strokeStyle = c.particle + '99'; ctx.lineWidth = 1.6 * view.k;
  ctx.beginPath();
  const first = T(a.path[0]); ctx.moveTo(first.x, first.y);
  for (let i = 1; i < index; i++) { const q = T(a.path[i]); ctx.lineTo(q.x, q.y); }
  const pt = T(point); ctx.lineTo(pt.x, pt.y); ctx.stroke();
  ctx.fillStyle = c.particle; ctx.beginPath(); ctx.arc(pt.x, pt.y, 5 * view.k, 0, Math.PI * 2); ctx.fill();
}

function drawConfigPanel(c, s, result) {
  if (!state.display.config) return;
  const x0 = 30, y0 = 404, w = 270, h = 180;
  const p = T({ x: x0, y: y0 });
  ctx.fillStyle = c.panel; ctx.strokeStyle = c.beam; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(p.x, p.y, w * view.k, h * view.k, 8 * view.k); ctx.fill(); ctx.stroke();
  const obj = state.setup.object;
  const rows = obj === 'marker' ? ['Flag down', 'Flag raised'] : obj === 'bomb' ? ['Bomb intact', 'Bomb exploded'] : ['No record'];
  label(V === 'orthodox' ? 'Joint state: path × ' + (obj === 'none' ? 'arms' : obj) : 'Configuration space', { x: x0 + 12, y: y0 + 16 }, c.text, 'left', 12);
  const colX = { U: x0 + 110, L: x0 + 170, meet: x0 + 232, in: x0 + 140 };
  const rowY = rows.map((_, i) => y0 + 70 + i * 62);
  rows.forEach((r, i) => { label(r, { x: x0 + 12, y: rowY[i] }, c.muted, 'left', 11); line({ x: x0 + 92, y: rowY[i] }, { x: x0 + w - 10, y: rowY[i] }, c.beam, 1, [3, 4]); });
  if (view.k > .55) {
    label('upper', { x: colX.U, y: y0 + 36 }, c.muted, 'center', 10);
    label('lower', { x: colX.L, y: y0 + 36 }, c.muted, 'center', 10);
    label('at BS2', { x: colX.meet, y: y0 + 36 }, c.muted, 'center', 10);
  }
  if (!state.atom) return;
  const list = visibleBranches(s, result);
  const atBS2 = s >= G.sBS2 - 60;
  const spots = [];
  list.forEach(b => {
    if (b.exploded) { if (rows.length > 1) spots.push({ x: colX.U, y: rowY[1], color: c.bomb, alpha: .9, absorbed: true }); return; }
    const row = obj === 'marker' && b.label === 'Flag raised' ? 1 : 0;
    let color = c.wave;
    if (list.length > 1 && V !== 'orthodox' && V !== 'spontaneous-collapse') color = b.key === 'a' ? c.a : c.b;
    else if (list.length > 1) color = b.key === 'a' ? c.a : c.wave;
    if (s < G.sBS1) spots.push({ x: colX.in, y: rowY[0], color, alpha: .8 });
    else b.arms.forEach(arm => spots.push({ x: atBS2 ? colX.meet : colX[arm], y: rowY[row], color, alpha: .75 / Math.sqrt(b.arms.length) }));
  });
  if (!list.length && result === 'bomb' && s >= G.sObj && rows.length > 1) spots.push({ x: colX.U, y: rowY[1], color: c.bomb, alpha: .9, absorbed: true });
  spots.forEach(sp => {
    if (sp.absorbed) { blob(sp, 14, sp.color, .9); if (view.k > .55) label('absorbed', { x: sp.x + 40, y: sp.y }, sp.color, 'left', 10); return; }
    blob(sp, 20, sp.color, sp.alpha);
  });
  if (atBS2 && s < G.total) {
    const meetRows = spots.filter(sp => !sp.absorbed && sp.x === colX.meet).map(sp => sp.y);
    const overlap = meetRows.length > 1 && meetRows.every(y => y === meetRows[0]);
    const apart = V === 'orthodox' ? 'different flag states: no interference' : 'parts cannot overlap';
    label(overlap ? 'parts overlap: they interfere' : meetRows.length > 1 ? apart : 'one part only', { x: x0 + w / 2, y: y0 + h - 12 }, overlap ? c.wave : c.a, 'center', 11);
  }
  if (V === 'pilot-wave') {
    const a = state.atom.o;
    const row = obj === 'marker' && a.arm === 'U' && s >= G.sObj ? 1 : obj === 'bomb' && a.result === 'bomb' && s >= G.sObj ? 1 : 0;
    const x = s < G.sBS1 ? colX.in : atBS2 ? colX.meet : colX[a.arm];
    const q = T({ x, y: rowY[Math.min(row, rows.length - 1)] });
    ctx.fillStyle = c.particle; ctx.beginPath(); ctx.arc(q.x, q.y, 4.5 * view.k, 0, Math.PI * 2); ctx.fill();
  }
}

function mwText(s) {
  if (!state.atom) return null;
  const info = mwInfo(s), n = info.list.length;
  const exploded = info.list.some(wd => wd.exploded);
  if (s >= G.total - 1) {
    if (n === 1) return 'Only one detector outcome has any weight, so the world does not split.';
    return `The world has split into ${n} copies, weighted by the Born rule${exploded ? ' (one of them with the bomb exploded)' : ''}. You are in one of them.`;
  }
  if (n > 1) return `The ${state.setup.object === 'bomb' ? 'bomb' : 'flag'} made a record: the world has split into 2 copies that no longer interfere.`;
  return null;
}
function captionText(s, result) {
  if (!state.atom) return !showTuning() ? 'First, send a few atoms with the second beam splitter in place and nothing in the arms, and see where they go.' : state.setup.bs2 ? 'The interferometer is tuned so that D2 stays dark. Choose a setup, make a prediction, then send atoms.' : 'With the second beam splitter removed, the upper beam heads to D2 and the lower beam to D1. Make a prediction, then send atoms.';
  if (result === 'bomb' && s >= G.sObj) return 'The bomb absorbed the atom and exploded.';
  if (V === 'many-worlds') { const t = mwText(s); if (t) return t; }
  if (s >= G.total - 1) return result === 'd1' ? 'D1 clicked.' : 'D2 clicked.' + (state.setup.object === 'bomb' && state.setup.bs2 ? ' The bomb is live, and it absorbed nothing.' : '');
  if (s < G.sBS1) return 'An atom leaves the source.';
  if (s < G.sBS2) return V === 'pilot-wave' ? 'The atom takes one arm; its wave takes both.' : 'The wave travels both arms.';
  return state.setup.bs2 ? 'The two arms meet at the second beam splitter.' : 'The beams cross where the second beam splitter used to be.';
}

function wrapText(text, x, yBottom, maxWidth, lineHeight) {
  const words = text.split(' '), lines = [];
  let line = '';
  words.forEach(w => { const test = line ? line + ' ' + w : w; if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test; });
  if (line) lines.push(line);
  lines.slice(-3).reverse().forEach((l, i) => ctx.fillText(l, x, yBottom - i * lineHeight));
}
const questionFor = () => ANSWERS[baseKey()].q;
function answerFor(name, s, result) {
  const a = ANSWERS[baseKey()];
  const atom = state.atom;
  if (!atom) return a.q;
  if (name === 'many-worlds') { const t = mwText(s); if (t) return t; }
  let text = a[name];
  if (typeof text === 'function') text = text({ arm: atom.o.arm === 'U' ? 'upper' : 'lower', result, done: s >= G.total - 1 || (result === 'bomb' && s >= G.sObj), pastObject: s >= G.sObj });
  return text;
}

// A brief mark where the state collapses: the postulate (orthodox) or a physical event (spontaneous collapse).
function collapseMark(c, point, since) {
  if (since < 0 || since > 1100) return;
  const q = T(point), t = since / 1100;
  ctx.strokeStyle = c.flash; ctx.globalAlpha = 1 - t; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(q.x, q.y, (14 + 60 * t) * view.k, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1;
  // Near the right edge (the detectors) the label goes to the left of the mark, so it is not cut off.
  const right = point.x > 700;
  if (view.k > .3) label(V === 'orthodox' ? 'measurement \u2192 collapse (postulate)' : 'collapse (physical process)', { x: point.x + (right ? -30 : 30), y: point.y + 30 + 10 * t }, c.flash, right ? 'right' : 'left', 12);
}

// ---------- spontaneous collapse: how much is in superposition ----------
const LAMBDA = 1e-16; // GRW collapse rate per nucleon, s^-1 (original GRW value)
function scState(s, result) {
  const obj = state.setup.object;
  const arrived = s >= G.total - 1 && result !== 'bomb';
  if (arrived) return { what: 'detector (~10²³ nucleons displaced)', n: 1e23, collapsed: true };
  if (obj === 'bomb' && s >= G.sObj) return { what: 'bomb (~10²³ nucleons)', n: 1e23, collapsed: true };
  if (obj === 'marker' && state.setup.markerSize === 'macro' && s >= G.sObj) return { what: 'macroscopic flag (~10²⁰ nucleons)', n: 1e20, collapsed: true };
  if (obj === 'marker' && s >= G.sObj) return { what: 'atom + microscopic flag (~100 nucleons)', n: 100, collapsed: false };
  return { what: 'one rubidium-87 atom (87 nucleons)', n: 87, collapsed: false };
}
const formatTime = t => t > 3.15e13 ? `${(t / 3.15e13).toFixed(1)} million years` : t > 3.15e7 ? `${(t / 3.15e7).toFixed(0)} years` : t >= 1 ? `${t.toFixed(1)} s` : t >= 1e-3 ? `${(t * 1e3).toFixed(1)} ms` : t >= 1e-6 ? `${(t * 1e6).toFixed(1)} µs` : `${(t * 1e9).toFixed(0)} ns`;
function drawCollapseClock(c, s, result) {
  if (!state.display.config) return;
  const st = scState(s, result), tau = 1 / (LAMBDA * st.n);
  const x0 = 30, y0 = 404, w = 270, h = 180, p = T({ x: x0, y: y0 });
  ctx.fillStyle = c.panel; ctx.strokeStyle = c.beam; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(p.x, p.y, w * view.k, h * view.k, 8 * view.k); ctx.fill(); ctx.stroke();
  label('Collapse clock (GRW)', { x: x0 + 12, y: y0 + 16 }, c.text, 'left', 12);
  label('In superposition:', { x: x0 + 12, y: y0 + 42 }, c.muted, 'left', 11);
  label(st.what, { x: x0 + 12, y: y0 + 60 }, c.text, 'left', 11);
  label('Expected time to collapse:', { x: x0 + 12, y: y0 + 86 }, c.muted, 'left', 11);
  label(formatTime(tau) + (st.collapsed ? '  → collapsed' : ''), { x: x0 + 12, y: y0 + 104 }, st.collapsed ? c.flash : c.text, 'left', 12);
  // log scale from 10 ns to 10^15 s
  const bx = x0 + 14, bw = w - 28, by = y0 + 140, frac = Math.max(0, Math.min(1, (Math.log10(tau) + 8) / 23));
  line({ x: bx, y: by }, { x: bx + bw, y: by }, c.beam, 4);
  line({ x: bx, y: by }, { x: bx + bw * frac, y: by }, st.collapsed ? c.flash : c.wave, 4);
  label('10 ns', { x: bx, y: by + 16 }, c.muted, 'left', 9);
  label('1 s', { x: bx + bw * 8 / 23, y: by + 16 }, c.muted, 'center', 9);
  label('30 Myr', { x: bx + bw, y: by + 16 }, c.muted, 'right', 9);
}

// ---------- many worlds: the world splits into copies ----------
const fraction = w => Math.abs(w - 1) < 1e-6 ? '1' : Math.abs(w - .5) < 1e-6 ? '1/2' : Math.abs(w - .25) < 1e-6 ? '1/4' : `${Math.round(w * 100)}%`;
function outcomeProbs(branch) {
  const bs2 = state.setup.bs2;
  if (branch === null) { if (!bs2) return { d1: .5, d2: .5 }; const p = probabilities(state.setup); return { d1: p.d1, d2: p.d2 }; }
  if (bs2) return { d1: .5, d2: .5 };
  return branch === 'a' ? { d2: 1 } : { d1: 1 };
}
function mwStages() {
  const obj = state.setup.object;
  const s0 = [{ id: 'w', branch: null, w: 1 }];
  let s1 = null;
  if (obj === 'marker') s1 = [{ id: 'a', parent: 'w', branch: 'a', w: .5, record: 'flag raised' }, { id: 'b', parent: 'w', branch: 'b', w: .5, record: 'flag down' }];
  if (obj === 'bomb') s1 = [{ id: 'x', parent: 'w', branch: 'x', exploded: true, w: .5, record: 'bomb exploded' }, { id: 'b', parent: 'w', branch: 'b', w: .5, record: 'bomb intact' }];
  const base = s1 || s0;
  const s2 = [];
  base.forEach(wd => {
    if (wd.exploded) { s2.push({ ...wd, parent: wd.id }); return; }
    Object.entries(outcomeProbs(wd.branch)).forEach(([o, p]) => { if (p > 1e-6) s2.push({ id: wd.id + o, parent: wd.id, branch: wd.branch, outcome: o, w: wd.w * p, record: wd.record }); });
  });
  return { s0, s1, s2 };
}
function tileLayout(list, R) {
  const m = list.length, cols = m <= 3 ? m : Math.ceil(Math.sqrt(m)), rows = Math.ceil(m / cols), gap = 10, lab = 16;
  const tw = Math.min((R.w - gap * (cols - 1)) / cols, ((R.h - rows * lab - gap * (rows - 1)) / rows) * 1000 / 600);
  const th = tw * 600 / 1000, gw = cols * tw + (cols - 1) * gap, gh = rows * (th + lab) + (rows - 1) * gap;
  const out = {};
  list.forEach((wd, i) => {
    const cx = i % cols, cy = Math.floor(i / cols);
    out[wd.id] = { x: R.x + (R.w - gw) / 2 + cx * (tw + gap), y: R.y + (R.h - gh) / 2 + cy * (th + lab + gap) + lab, w: tw, h: th };
  });
  return out;
}
const lerpRect = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t });
const ease = t => t * t * (3 - 2 * t);
function mwInfo(s) {
  const st = mwStages();
  const atom = state.atom, elapsed = atom ? atom.elapsed : 0;
  const tObj = DURATION * G.sObj / G.total, tDet = DURATION;
  let list = st.s0, prev = null, tEvent = 0;
  if (atom && s >= G.total - 1) { list = st.s2; prev = st.s1 || st.s0; tEvent = tDet; }
  else if (atom && st.s1 && s >= G.sObj) { list = st.s1; prev = st.s0; tEvent = tObj; }
  let actual = null;
  if (atom) {
    const o = atom.o, obj = state.setup.object;
    const first = obj === 'marker' ? (o.arm === 'U' ? 'a' : 'b') : obj === 'bomb' ? (o.result === 'bomb' ? 'x' : 'b') : 'w';
    actual = s >= G.total - 1 ? (first === 'x' ? 'x' : first + o.result) : first;
  }
  return { list, prev, progress: prev ? ease(Math.max(0, Math.min(1, (elapsed - tEvent) / 600))) : 1, zoom: s >= G.total - 1 && list.length > 1 ? ease(Math.max(0, Math.min(1, (elapsed - tDet - 2300) / 900))) : 0, actual };
}
function drawMW(c, s, result, R, compact = false) {
  const info = mwInfo(s);
  const now = tileLayout(info.list, R), before = info.prev ? tileLayout(info.prev, R) : null;
  const full = tileLayout([{ id: 'full' }], R).full;
  const maxW = Math.max(...info.list.map(wd => wd.w));
  const f = state.atom ? fieldsFor(s, result) : null;
  const savedLabels = state.display.labels;
  // A split fades in two halves: the parent copies fade out where they are, then the new
  // copies fade in at their final places (sliding tiles crossed each other and were unreadable).
  if (before && info.progress < 1) info.prev.forEach(pw => {
    const rect = before[pw.id];
    if (!rect) return;
    view = { k: rect.w / 1000, ox: rect.x, oy: rect.y };
    ctx.save(); ctx.globalAlpha = Math.max(0, 1 - 2 * info.progress);
    ctx.beginPath(); ctx.rect(rect.x - 2, rect.y - 2, rect.w + 4, rect.h + 4); ctx.clip();
    if (info.prev.length > 1) { ctx.strokeStyle = c.beam; ctx.lineWidth = 1; ctx.strokeRect(rect.x, rect.y, rect.w, rect.h); }
    WORLD = { outcome: pw.outcome || null, exploded: Boolean(pw.exploded) };
    drawApparatus(c, s, result);
    WORLD = null;
    ctx.restore();
  });
  info.list.forEach(wd => {
    let rect = now[wd.id];
    let alpha = info.list.length > 1 ? .35 + .65 * wd.w / maxW : 1;
    if (before && info.progress < 1) alpha *= Math.max(0, 2 * info.progress - 1);
    if (info.zoom > 0) { if (wd.id === info.actual) { rect = lerpRect(rect, full, info.zoom); alpha = alpha + (1 - alpha) * info.zoom; } else alpha *= 1 - info.zoom; }
    if (alpha < .02) return;
    view = { k: rect.w / 1000, ox: rect.x, oy: rect.y };
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.rect(rect.x - 2, rect.y - 2, rect.w + 4, rect.h + 4); ctx.clip();
    if (info.list.length > 1) { ctx.strokeStyle = wd.id === info.actual && info.zoom > 0 ? c.wave : c.beam; ctx.lineWidth = 1; ctx.strokeRect(rect.x, rect.y, rect.w, rect.h); }
    state.display.labels = savedLabels;
    WORLD = { outcome: wd.outcome || null, exploded: Boolean(wd.exploded) };
    drawApparatus(c, s, result);
    if (state.display.wave && f && !wd.exploded) {
      if (wd.outcome) blob(wd.outcome === 'd1' ? G.D1 : G.D2, 26, c.wave, .95);
      else {
        const fields = wd.branch === null ? f.all : f.all.filter(x => x.key === wd.branch);
        ctx.drawImage(paintField(fields, () => c.wave, 1), view.ox, view.oy, 1000 * view.k, 600 * view.k);
      }
    }
    WORLD = null; state.display.labels = savedLabels;
    ctx.restore();
    if (info.list.length > 1 && info.progress > .6 && info.zoom < .5) {
      ctx.globalAlpha = Math.min(alpha, 1); ctx.fillStyle = wd.id === info.actual ? c.wave : c.text;
      ctx.font = '11px Inter, Arial, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      const short = compact || rect.w < 230;
      const parts = [fraction(wd.w), wd.record ? (short ? wd.record.split(' ').slice(-1)[0] : wd.record) : null, wd.outcome ? (short ? wd.outcome.toUpperCase() : `${wd.outcome.toUpperCase()} clicked`) : null].filter(Boolean);
      ctx.fillText(parts.join(' · '), rect.x + 2, rect.y - 3);
      ctx.globalAlpha = 1;
    }
  });
  return info;
}

const resultsPanel = document.querySelector('[data-results-panel]');
let lastFrame = performance.now();
function frame(now) {
  const ratio = devicePixelRatio || 1, width = canvas.clientWidth, height = canvas.clientHeight;
  if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) { canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio); }
 ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  if (width < 40 || height < 80) { lastFrame = now; requestAnimationFrame(frame); return; }
  const k = Math.min(width / 1000, (height - 34) / 600);
  view = { k, ox: (width - 1000 * k) / 2, oy: Math.max(8, (height - 34 - 600 * k) / 2) };
  const c = colors();
  const dt = Math.min(64, now - lastFrame); lastFrame = now;
  let s = 0, result = null;
  if (state.atom) {
    const a = state.atom;
    if (!state.paused) a.elapsed += dt * state.speed;
    const stopAt = G.total; // the wave keeps going in every account, even after an absorption in this branch
    s = Math.min(stopAt, (a.elapsed / DURATION) * G.total);
    result = a.o.result;
    if (s >= stopAt) {
      finishAtom();
      if (a.elapsed > DURATION + holdTime() && state.running) {
        if (state.autoRerun) launch();
        else { state.running = false; ui.setRunning(false); }
      }
    }
  }
  if (!state.compare) {
    V = state.view;
    resultsPanel.hidden = false;
    if (V === 'many-worlds') {
      const info = drawMW(c, s, result, { x: 8, y: 4, w: width - 16, h: height - 38 });
      resultsPanel.hidden = info.list.length > 1 && info.zoom < 1;
    }
    else {
      drawApparatus(c, s, result);
      drawWave(c, s, result);
      drawParticle(c, s);
      if (V === 'spontaneous-collapse') drawCollapseClock(c, s, result); else drawConfigPanel(c, s, result);
    }
    caption.textContent = captionText(s, result);
  } else {
    resultsPanel.hidden = true;
    const views = ['orthodox', 'pilot-wave', 'many-worlds', 'spontaneous-collapse'];
    const qw = width / 2, qh = (height - 34) / 2;
    views.forEach((name, i) => {
      V = name;
      const x0 = (i % 2) * qw, y0 = Math.floor(i / 2) * qh;
      const kk = Math.min((qw - 12) / 1000, (qh - 54) / 600);
      view = { k: kk, ox: x0 + (qw - 1000 * kk) / 2, oy: y0 + 22 };
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, qw, qh); ctx.clip();
      if (name === 'many-worlds') drawMW(c, s, result, { x: x0 + 6, y: y0 + 22, w: qw - 12, h: qh - 58 }, true);
      else { drawApparatus(c, s, result); drawWave(c, s, result); drawParticle(c, s); }
      ctx.restore();
      ctx.fillStyle = name === state.view ? c.wave : c.text;
      ctx.font = '600 13px Inter, Arial, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(VIEW_LABEL[name], x0 + 10, y0 + 6);
      ctx.fillStyle = c.muted; ctx.font = '12px Inter, Arial, sans-serif'; ctx.textBaseline = 'bottom';
      wrapText(answerFor(name, s, result), x0 + 10, y0 + qh - 6, qw - 20, 15);
      ctx.strokeStyle = c.beam; ctx.lineWidth = 1; ctx.strokeRect(x0 + .5, y0 + .5, qw - 1, qh - 1);
    });
    caption.textContent = questionFor() + ' Detector counts are identical in all four.';
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

mountQonticMedia({
  stage: document.querySelector('.visualization'), controls: document.querySelector('qontic-controls'),
  getCanvases: () => [canvas], filename: 'qontic-mach-zehnder',
  beginRecording: () => { const previous = state.running; if (canRun()) resume(); return previous; },
  endRecording: previous => { if (!previous) pause(); },
});
mountQonticShortcuts({
  togglePlayback: () => { if (!canRun()) return flashHint(); if (state.running) pause(); else resume(); },
  reset: () => document.querySelector('qontic-controls').dispatchEvent(new CustomEvent('qontic:reset', { detail: {}, bubbles: true })),
  screenshot: () => document.querySelector('.qontic-media-toolbar button[aria-label="Screenshot"]')?.click(),
});

syncPanel();
