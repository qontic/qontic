import '../../../shared/qontic-controls.js';
import { mountQonticShell } from '../../../shared/qontic-shell.js';
import { mountQonticMedia } from '../../../shared/qontic-media.js?v=2';
import { mountDistanceScale } from '../../../shared/qontic-overlays.js';
import { mountQonticShortcuts } from '../../../shared/qontic-shortcuts.js';
import { mountQonticQuiz } from '../../../shared/qontic-quiz.js?v=10';
import { APP_RELEASE } from './release.js?v=1.2.18';

const controls = document.querySelector('qontic-controls');
const canvas = document.getElementById('c');
const stage = document.querySelector('.hydrogen-stage');
const viewButtons = [...document.querySelectorAll('button[data-view]')];
const paneSections = [...document.querySelectorAll('[data-control-pane]')];

mountQonticShell({
  title: 'Hydrogen Atom',
  navigation: 'breadcrumbs',
  purpose: 'Explore hydrogen orbitals, their density and phase, and the electron trajectories of pilot-wave theory, with or without the spin term.',
  homeHref: '../../../index.html?tab=apps',
  version: `Hydrogen Atom · Version ${APP_RELEASE.version} · ${APP_RELEASE.date}`,
});

// The template header can wrap or be hidden. Budget its actual height in the
// stacked layout so the canvas and the jump to controls fit the first screen.
const header = document.getElementById('qontic-app-header');
function updateHeaderHeight() {
  stage.style.setProperty('--hydrogen-header-height', `${header.getBoundingClientRect().height}px`);
}
new ResizeObserver(updateHeaderHeight).observe(header);
updateHeaderHeight();

function setRunning(value) {
  hydrogenSimulation.setRunning(value);
  controls.setAttribute('running', String(value));
}

controls.addEventListener('qontic:start', () => setRunning(true));
controls.addEventListener('qontic:stop', () => setRunning(false));
controls.addEventListener('qontic:reset', () => hydrogenSimulation.reset());
controls.addEventListener('qontic:speed', event => hydrogenSimulation.setSpeed(event.detail.speed));
controls.addEventListener('qontic:theme', event => hydrogenSimulation.setTheme(event.detail.theme));
controls.addEventListener('qontic:interpretation', ({ detail }) => setInterpretation(detail.interpretation));
function applyInterpretation(id) {
  controls.setAttribute('interpretation', id);
  setInterpretation(id);
}
applyInterpretation(new URLSearchParams(location.search).get('interp') === 'cpn' ? 'cpn' : 'pw');
controls.addEventListener('qontic:tab', ({ detail }) => {
  for (const section of paneSections) section.hidden = section.dataset.controlPane !== detail.tab;
});

for (const button of viewButtons) button.addEventListener('click', () => {
  const view = button.dataset.view;
  document.body.dataset.view = view;
  for (const tab of viewButtons) {
    const selected = tab === button;
    document.getElementById(tab.dataset.view).hidden = !selected;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-pressed', String(selected));
  }
  if (view !== 'simulation') setRunning(false);
});

// Rotation uses an orthographic projection with a single length scale.
let lastScale, scaleFrame;
function refreshScale() {
  if (!scale.getVisible()) return;
  const next = hydrogenSimulation.getCanvasScale();
  if (next > 0 && next !== lastScale) {
    lastScale = next;
    scale.update();
  }
  scaleFrame = requestAnimationFrame(refreshScale);
}
const scale = mountDistanceScale({
  host: canvas.parentElement,
  getUnitsPerPixel() {
    const pmPerPixel = 52.9177 / hydrogenSimulation.getCanvasScale();
    return { x: pmPerPixel, y: pmPerPixel };
  },
  format: value => `${Number(value.toPrecision(3))} pm`,
  onVisibilityChange(visible) {
    if (visible) scaleFrame = requestAnimationFrame(refreshScale);
    else cancelAnimationFrame(scaleFrame);
  },
});
scale.setVisible(false);

mountQonticMedia({
  stage,
  controls,
  scaleControl: scale,
  filename: 'hydrogen-atom',
  getShareUrl: () => hydrogenShareUrl(),
  axesControl: { getVisible: () => showAxes, setVisible: visible => { if (visible !== showAxes) toggleAxes(); } },
  getCanvases: () => [canvas, scale.canvas],
  beginRecording() {
    const wasRunning = hydrogenSimulation.isRunning();
    setRunning(true);
    return wasRunning;
  },
  endRecording(wasRunning) { setRunning(wasRunning); },
});

// Sidebar fade when more content is below (laptops with short screens).
{
  const side = document.querySelector('.hydrogen-sidebar');
  const mark = () => side.classList.toggle('more-below', side.scrollHeight - side.scrollTop - side.clientHeight > 4);
  side.addEventListener('scroll', mark, { passive: true });
  new ResizeObserver(mark).observe(side);
  [...side.children].forEach(child => new ResizeObserver(mark).observe(child));
  window.addEventListener('resize', mark);
  mark();
}
// Touch devices: shorter default trails, so 50 electrons stay smooth.
if (matchMedia('(pointer: coarse)').matches) {
  const trail = document.getElementById('sTR');
  trail.value = 400;
  trail.dispatchEvent(new Event('input'));
}

mountQonticShortcuts({
  target: canvas,
  togglePlayback: () => setRunning(!hydrogenSimulation.isRunning()),
  reset: () => hydrogenSimulation.reset(),
  screenshot: () => document.querySelector('#qontic-media-tools button[aria-label="Screenshot"]')?.click(),
});

// ── Quiz tab (shared module): predict before watching ──────────────────────
// Each question shows a still image of |ψ|² only, without electrons.
function drawDensity(canvas, plane, halfWidth) {
  const g = canvas.getContext('2d');
  const light = document.body.classList.contains('light');
  const half = halfWidth || 1.8 * Math.max(...comps.map(c => exactR(c.n, c.l))) * 1.15;
  const N = 240, vals = new Float32Array(N * N);
  let maxV = 1e-30;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const u = -half + (i + 0.5) * 2 * half / N, w = half - (j + 0.5) * 2 * half / N;
    const d = plane === 'xy' ? densityAt(u, w, 0, 0) : densityAt(u, 0, w, 0);
    vals[j * N + i] = d; if (d > maxV) maxV = d;
  }
  const img = new ImageData(N, N);
  for (let k = 0; k < N * N; k++) {
    const vn = Math.pow(vals[k] / maxV, DENS_GAMMA), [r, gg, bb] = sliceCol(vn);
    img.data[k * 4] = r; img.data[k * 4 + 1] = gg; img.data[k * 4 + 2] = bb; img.data[k * 4 + 3] = 255;
  }
  const tmp = document.createElement('canvas');
  tmp.width = N; tmp.height = N;
  tmp.getContext('2d').putImageData(img, 0, 0);
  g.imageSmoothingEnabled = true;
  g.drawImage(tmp, 0, 0, canvas.width, canvas.height);
  const [h, v] = plane === 'xy' ? ['x', 'y'] : ['x', 'z'];
  g.strokeStyle = light ? 'rgba(20,40,70,.5)' : 'rgba(200,220,255,.45)'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(12, canvas.height / 2); g.lineTo(canvas.width - 12, canvas.height / 2);
  g.moveTo(canvas.width / 2, canvas.height - 12); g.lineTo(canvas.width / 2, 12); g.stroke();
  g.fillStyle = light ? '#1a2540' : '#cfe0ff'; g.font = '13px Inter, system-ui, sans-serif';
  g.fillText(h, canvas.width - 20, canvas.height / 2 - 6); g.fillText(v, canvas.width / 2 + 6, 20);
}
function prepare(select, reading = 'pw') {
  return () => {
    if (interp !== reading) applyInterpretation(reading);
    clearSpin();
    select();
    hydrogenSimulation.reset();
    setRunning(false);
  };
}
const orbital = label => () => selectPureOrbital(ORBITALS.findIndex(o => o.label === label));
const superposition = key => () => {
  const menu = document.getElementById('superSel');
  menu.value = key;
  menu.dispatchEvent(new Event('change'));
};
const A = {
  still: { id: 'still', label: 'They stay still' },
  circleZ: { id: 'circleZ', label: 'They circle the z axis' },
  anti: { id: 'anti', label: 'They circle the z axis anticlockwise (seen from +z)' },
  clock: { id: 'clock', label: 'They circle the z axis clockwise (seen from +z)' },
  upDown: { id: 'upDown', label: 'They move back and forth, mostly along z, without circling' },
  radial: { id: 'radial', label: 'Each moves in and out along its own radius' },
};
const PW = 'Pilot wave, standard guidance law (no spin term).';
mountQonticQuiz({
  panel: document.getElementById('quiz'),
  tab: document.querySelector('button[data-view="quiz"]'),
  simulationTab: document.querySelector('button[data-view="simulation"]'),
  intro: 'Questions 1–5 use pilot-wave theory with the standard guidance law v = (ħ/mₑ) Im(∇ψ/ψ), without the spin term of Physics § 4. Each dot in the simulation is the electron of a separate atom.',
  shuffle: true,
  score: true,
  shareLink: true,
  questions: [
    { question: `${PW} The 1s ground state (m = 0). How do the electrons move?`,
      answer: 'still', caption: '1s: |ψ|² in the xz plane.',
      answers: [A.still, A.circleZ, A.radial, { id: 'random', label: 'They jiggle around at random, like molecules in a gas' }],
      prepare: prepare(orbital('1s')), draw: c => drawDensity(c, 'xz'),
      plain: 'Nothing moves them: ψ is real here, apart from an overall phase that is the same everywhere, and the guidance law needs a phase that changes from place to place.',
      explain: 'v = Im(∇ψ/ψ) = 0 for a real ψ, so each electron stays where it started. With the spin term of Physics § 4 they would move; the statistics are the same either way.' },
    { question: `${PW} The 2p₊₁ state (m = +1). How do the electrons move?`,
      answer: 'anti', caption: '2p₊₁: |ψ|² in the xy plane; the z axis points out of the page.',
      answers: [A.still, A.anti, A.clock, A.upDown],
      prepare: prepare(orbital('2p₊₁')), draw: c => drawDensity(c, 'xy'),
      plain: 'The phase of ψ winds once around the z axis, and the electrons go round the way it winds: anticlockwise seen from +z.',
      explain: 'ψ ∝ exp(iφ), so v points along increasing φ with vᵩ = 1/(r sinθ) in atomic units: each electron circles z at fixed height and radius, faster near the axis. In 2p₋₁ they go the other way.' },
    { question: `${PW} The orbital 2p_x, the dumbbell along x from chemistry. How do the electrons move?`,
      answer: 'still', caption: '2p_x: |ψ|² in the xy plane.',
      answers: [A.still, { id: 'swingX', label: 'They swing along x, from one lobe to the other' }, { id: 'circleX', label: 'They circle the x axis' }, A.circleZ],
      prepare: prepare(superposition('px')), draw: c => drawDensity(c, 'xy'),
      plain: 'They stay still: 2p_x is an equal mix of an anticlockwise and a clockwise state, and the two motions cancel.',
      explain: '2p_x = (2p₋₁ − 2p₊₁)/√2 is real, so Im(∇ψ/ψ) = 0. Nothing swings between the lobes: |ψ|² does not change in time. 2p_x and 2p₊₁ have the same energy; only 2p₊₁ carries angular momentum about z.' },
    { question: `${PW} An equal superposition of 1s and 2p₀. How do the electrons move?`,
      answer: 'upDown', caption: '1s + 2p₀: |ψ|² in the xz plane at t = 0.',
      answers: [A.still, A.circleZ, A.upDown, { id: 'away', label: 'They drift away from the nucleus and do not come back' }],
      prepare: prepare(superposition('sp')), draw: c => drawDensity(c, 'xz'),
      plain: 'The density sloshes up and down the z axis every 405 attoseconds, and each electron moves back and forth with it.',
      explain: 'Both states have m = 0, so nothing circles. Each electron follows a closed, curved path in a plane containing z, mostly up and down with a smaller radial part; most do not cross the nucleus. The electrons stay distributed as |ψ|².' },
    { question: `${PW} An equal superposition of 1s and 2s. How do the electrons move?`,
      answer: 'radial', caption: '1s + 2s: |ψ|² in the xz plane at t = 0.',
      answers: [A.still, A.circleZ, A.upDown, A.radial],
      prepare: prepare(superposition('ss')), draw: c => drawDensity(c, 'xz'),
      plain: 'Both states are round, so the density swells and shrinks every 405 attoseconds; each electron moves in and out along its own radius.',
      explain: 'The phase of ψ depends only on r, so v points along r. Unlike 1s + 2p₀, no direction is singled out, so nothing moves preferentially along z.' },
    { question: 'How many radial nodes (spheres, other than at infinity, where |ψ|² = 0) does the 3s state have?',
      answer: 'two', caption: '3s: |ψ|² in the xz plane.', drawAfterAnswer: true,
      shuffle: false,
      answers: [{ id: 'zero', label: 'None' }, { id: 'one', label: 'One' }, { id: 'two', label: 'Two' }, { id: 'three', label: 'Three' }],
      prepare: prepare(orbital('3s')), draw: c => drawDensity(c, 'xz', 14),
      plain: 'Two: the picture shows three bright shells separated by two dark spheres.',
      explain: 'A state has n − l − 1 radial nodes: 3 − 0 − 1 = 2. All n = 3 states have the same energy, −13.6/9 eV = −1.51 eV. The P(r) inset (Simulation → Display) shows the nodes as zeros of the radial probability.' },
    { question: 'Orthodox reading (textbook quantum mechanics): what does the 2p₊₁ picture tell you about the electron between measurements?',
      answer: 'prob', caption: '2p₊₁: |ψ|² in the xy plane.', watch: false,
      answers: [
        { id: 'current', label: 'It moves around the z axis, along the probability current' },
        { id: 'cloud', label: 'It is spread out over the ring, like a cloud of charge' },
        { id: 'unknown', label: 'It has a definite position that we do not know' },
        { id: 'prob', label: 'Only the probabilities of where a measurement would find it' },
      ],
      prepare: prepare(orbital('2p₊₁'), 'cpn'), draw: c => drawDensity(c, 'xy'),
      plain: 'The orthodox reading assigns the electron no position between measurements; |ψ|² gives the probabilities of the results.',
      explain: 'Reading the probability current as the electron’s motion, and saying it has a definite but unknown position, is what pilot-wave theory does. The charge cloud is Schrödinger’s early picture, close to the mass density of GRW collapse theory. None of these is the textbook reading.' },
    { question: 'An equal superposition of 1s and 2p₀. Which of these do all readings of quantum mechanics agree on?',
      answer: 'slosh', caption: '1s + 2p₀: |ψ|² in the xz plane at t = 0.',
      answers: [
        { id: 'slosh', label: '|ψ|² sloshes up and down z every 405 attoseconds' },
        { id: 'jump', label: 'The electron jumps between 1s and 2p₀ every 405 attoseconds' },
        { id: 'move', label: 'Each electron moves up and down z' },
        { id: 'static', label: 'Nothing changes: both states are stationary' },
      ],
      prepare: prepare(superposition('sp'), 'cpn'), draw: c => drawDensity(c, 'xz'),
      plain: 'The density itself oscillates: that is a prediction of quantum mechanics, whatever one says about the electron.',
      explain: 'There are no jumps: the state stays a superposition, and an energy measurement gives 1s or 2p₀ with probability ½ at any time. Moving electrons are the pilot-wave reading. The watch view uses the Orthodox reading, so you see only |ψ|².' },
  ],
  onWatch: () => setRunning(true),
});
