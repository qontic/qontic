// Quiz tab for the N-slit preview: predict before you watch (shared module).
// Each question sets the app to a paused state and shows a still schematic of the
// apparatus (slits, detectors, screen), drawn here, so that the running simulation
// cannot give the answer away. Uses the app's classic-script globals (numSlits,
// slitOpen, slitDetector, interpretation, …) from double-slit.js.
import { mountQonticQuiz } from '../../../../shared/qontic-quiz.js?v=9';

const light = () => document.body.classList.contains('qontic-light');

// Schematic: source on the left, wall with N slits, screen on the right.
// slits: array of 'open' | 'closed' | 'detector'. Options: hitY (fraction of the
// screen height, 0 = top) marks one detection; packet draws wavefronts past the
// wall; shutter marks a slit being closed.
function drawSetup(canvas, slits, { hitY = null, packet = false, shutter = null } = {}) {
  const g = canvas.getContext('2d'), W = canvas.width, H = canvas.height, isLight = light();
  const ink = isLight ? '#16324a' : '#d8ecf5', dim = isLight ? '#6b8796' : '#7f9cab';
  g.fillStyle = isLight ? '#eef4f8' : '#16293a'; g.fillRect(0, 0, W, H);
  const wallX = 150, screenX = 318, n = slits.length, gap = Math.min(46, 240 / n), pitch = Math.min(70, 260 / Math.max(1, n - 1));
  const centre = k => H / 2 + (k - (n - 1) / 2) * pitch;
  // source
  const grad = g.createRadialGradient(34, H / 2, 2, 34, H / 2, 40);
  grad.addColorStop(0, isLight ? 'rgba(8,116,135,.8)' : 'rgba(129,231,245,.9)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad; g.fillRect(0, H / 2 - 50, 80, 100);
  g.fillStyle = dim; g.font = '11px Inter, system-ui, sans-serif'; g.textAlign = 'center';
  g.fillText('source', 34, H / 2 + 58);
  // incoming wavefronts
  g.strokeStyle = isLight ? 'rgba(8,116,135,.35)' : 'rgba(129,231,245,.35)'; g.lineWidth = 2;
  for (let x = 70; x < wallX - 8; x += 16) { g.beginPath(); g.moveTo(x, H / 2 - 120); g.lineTo(x, H / 2 + 120); g.stroke(); }
  // wall with openings
  g.strokeStyle = ink; g.lineWidth = 6; g.beginPath(); let y = 14;
  const openings = slits.map((s, k) => [centre(k) - gap / 2, centre(k) + gap / 2, s, k]);
  for (const [top, bottom, s] of openings) { if (s === 'closed') continue; g.moveTo(wallX, y); g.lineTo(wallX, top); y = bottom; }
  g.moveTo(wallX, y); g.lineTo(wallX, H - 14); g.stroke();
  for (const [top, bottom, s, k] of openings) {
    g.fillStyle = dim; g.font = '12px Inter, system-ui, sans-serif'; g.textAlign = 'right';
    g.fillText(String(k + 1), wallX + 26, (top + bottom) / 2 + 4);
    if (s === 'detector') {
      g.fillStyle = '#ffd54a'; g.strokeStyle = '#3b2d00'; g.lineWidth = 1.5;
      g.fillRect(wallX - 22, (top + bottom) / 2 - 10, 14, 20); g.strokeRect(wallX - 22, (top + bottom) / 2 - 10, 14, 20);
      g.fillStyle = '#3b2d00'; g.font = 'bold 11px Inter, system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('D', wallX - 15, (top + bottom) / 2 + 4);
    }
    if (shutter === k) {
      g.strokeStyle = '#e66767'; g.lineWidth = 6; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(wallX, top); g.lineTo(wallX, bottom); g.stroke(); g.setLineDash([]);
      g.fillStyle = '#e66767'; g.font = '11px Inter, system-ui, sans-serif'; g.textAlign = 'left'; g.fillText('closing', wallX + 8, bottom + 14);
    }
  }
  // wavefronts that have passed the wall
  if (packet) {
    g.strokeStyle = isLight ? 'rgba(8,116,135,.45)' : 'rgba(129,231,245,.45)'; g.lineWidth = 2;
    for (const [top, bottom, s] of openings) {
      if (s === 'closed') continue;
      for (let r = 18; r <= 66; r += 12) { g.beginPath(); g.arc(wallX, (top + bottom) / 2, r, -Math.PI / 2.6, Math.PI / 2.6); g.stroke(); }
    }
  }
  // screen
  g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(screenX, 14); g.lineTo(screenX, H - 14); g.stroke();
  g.fillStyle = dim; g.font = '11px Inter, system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('screen', screenX, H - 2);
  if (hitY !== null) {
    const yy = 14 + hitY * (H - 28);
    g.fillStyle = '#ff4d4d'; g.beginPath(); g.arc(screenX, yy, 6, 0, 2 * Math.PI); g.fill();
    g.strokeStyle = isLight ? '#16324a' : '#ffffff'; g.lineWidth = 1.5; g.stroke();
  }
}

// The colour selector is attached to the page a little after the engine starts;
// with ?quiz=1 the first question is prepared before that, so wait for it.
function setColor(color, tries = 60) {
  const select = document.getElementById('packet-particle-color');
  if (!select) { if (tries > 0) setTimeout(() => setColor(color, tries - 1), 50); return; }
  if (select.value !== color) { select.value = color; select.dispatchEvent(new Event('change', { bubbles: true })); }
}

function isRunning() { return typeof isAnimating !== 'undefined' && isAnimating; }

// Put the app in the question's configuration, paused and reset.
function setTo({ view, slits, color = null }) {
  if (isRunning()) $('#startButton').trigger('click');
  // Q5's Watch ticks this; every question starts with it off.
  const atWall = document.getElementById('slit-at-wall'); if (atWall && atWall.checked) { atWall.checked = false; atWall.dispatchEvent(new Event('change', { bubbles: true })); }
  if (view && interpretation !== view) changeInterpretation(view);
  numSlits = slits.length;
  for (let k = 0; k < MAX_SLITS; k++) {
    const s = slits[k];
    slitOpen[k] = s === undefined || s !== 'closed';
    slitDetector[k] = s === 'detector';
  }
  if (color) setColor(color);
  slitConfigurationChanged();
  window.qonticPacketEngine?.setWhichPath?.(whichPathDetector);
}

export function mountNSlitQuiz({ panel, tab, simulationTab }) {
  const questions = [
    {
      question: 'Pilot Wave, three equal slits open. A particle lands near the top of the screen. Which slit did it go through?',
      caption: 'Three open slits; the dot is where the particle landed.',
      plain: 'Slit 1: in pilot-wave theory paths never cross, so the top slit feeds the top of the screen.',
      answers: [{ id: 's1', label: 'Slit 1' }, { id: 's2', label: 'Slit 2' }, { id: 's3', label: 'Slit 3' }, { id: 'any', label: 'Any of them: the waves overlap there' }],
      answer: 's1',
      explain: 'In pilot-wave theory each particle passes one slit, and trajectories never cross, so the slits map onto bands of the screen in order: slit 1 to the top band, slit 3 to the bottom one. The band edges follow from the guidance law itself; how many particles land in each band comes from the theory’s assumption that starting positions are distributed as |ψ|². In the simulation, Color: By slit colours each particle by its slit, and dashed lines on the histogram mark the bands. The Orthodox view gives no slit at all (question 4).',
      prepare: () => setTo({ view: 'bohmian', slits: ['open', 'open', 'open'], color: 'slit' }),
      draw: c => drawSetup(c, ['open', 'open', 'open'], { hitY: .1 }),
    },
    {
      question: 'Four slits, with an ideal which-slit detector on slit 2 only. What does the screen show?',
      caption: 'Four open slits; D marks the detector on slit 2.',
      plain: 'Slits 1, 3 and 4 still make fringes together; slit 2 only adds a smooth bump.',
      answers: [
        { id: 'none', label: 'No interference left anywhere on the screen' },
        { id: 'partial', label: 'Slits 1, 3, 4 interfere; slit 2 adds a bump' },
        { id: 'same', label: 'Exactly the same fringes as without it' },
        { id: 'blocked', label: 'Slit 2 is blocked; the rest is unchanged' },
      ],
      answer: 'partial',
      explain: 'The detector record separates the wave from slit 2 from the rest: the density is |ψ₂|² + |ψ₁ + ψ₃ + ψ₄|². Only the cross terms involving slit 2 disappear; the undetected slits still interfere with each other, and slit 2 adds its own single-slit bump. The detector does not block the slit.',
      prepare: () => setTo({ view: 'copenhagen', slits: ['open', 'detector', 'open', 'open'] }),
      draw: c => drawSetup(c, ['open', 'detector', 'open', 'open']),
    },
    {
      question: 'The same four slits, now with a detector on every slit. What does the screen show?',
      caption: 'Four open slits, each with a detector.',
      plain: 'No fringes: every slit is told apart, so only smooth single-slit bumps add up.',
      answers: [
        { id: 'four', label: 'The four-slit fringes, unchanged' },
        { id: 'pairs', label: 'Weaker fringes from neighbouring pairs' },
        { id: 'smooth', label: 'No fringes: a sum of single-slit bumps' },
        { id: 'nothing', label: 'Nothing: detectors absorb the particles' },
      ],
      answer: 'smooth',
      explain: 'Every pair of slits is now told apart by the detector records, so no cross term is left: the density is |ψ₁|² + |ψ₂|² + |ψ₃|² + |ψ₄|². Here the single-slit bumps overlap into one smooth hump; with slits farther apart they would show as separate humps, still without fringes. This is how decoherence removes interference; with these ideal detectors the records could in principle be erased and the fringes brought back. With imperfect detectors the fringes would only fade.',
      prepare: () => setTo({ view: 'copenhagen', slits: ['detector', 'detector', 'detector', 'detector'] }),
      draw: c => drawSetup(c, ['detector', 'detector', 'detector', 'detector']),
    },
    {
      question: 'Orthodox view, two slits, no detector. A particle is detected in the central bright fringe. Which slit did it go through?',
      caption: 'Two open slits; the dot is the detection in the central fringe.',
      plain: 'Standard quantum mechanics does not say: without a measurement at the slits it assigns no slit.',
      answers: [
        { id: 'upper', label: 'The upper slit; which one is random' },
        { id: 'lower', label: 'The lower slit; which one is random' },
        { id: 'half', label: 'Half of it went through each of the slits' },
        { id: 'none', label: 'No slit is assigned without measuring' },
      ],
      answer: 'none',
      explain: 'In the orthodox view, quantum mechanics gives the probabilities of measurement outcomes. With no measurement at the slits it says nothing about a path, not even that the particle split in two. Put a detector on a slit and the question gets an answer, but the interference involving that slit goes away.',
      prepare: () => setTo({ view: 'copenhagen', slits: ['open', 'open'] }),
      draw: c => drawSetup(c, ['open', 'open'], { hitY: .5 }),
    },
    {
      question: 'Pilot Wave, two slits. The packet centre is reaching the wall when you close the lower slit. In this app\u2019s model, what do the particles already past the wall do?',
      caption: 'The packet centre is reaching the wall; slit 2 is being closed.',
      plain: 'In the app\u2019s model they keep the two-slit pattern, because the wave from slit 2 is already past the wall. In the full Schr\u00f6dinger equation the later, changed part of the wave also reaches them, so the wave guiding them changes substantially (by tens of per cent of its amplitude in the numerical preview).',
      answers: [
        { id: 'keep', label: 'Keep moving in the two-slit pattern' },
        { id: 'switch', label: 'Switch at once to a one-slit pattern' },
        { id: 'stop', label: 'Stop, or vanish from the screen' },
      ],
      answer: 'keep',
      explain: 'In the app\u2019s model each particle went through one slit but is guided by the whole wave, including the part from the other slit, which is already past the wall. The model carries each slice of the packet forward at the packet speed, so only slices that cross the wall after the click see one slit. This is an approximation: in the full equation the part already past changes very little, but the later, changed part spreads into its region (see Physics, \u201cWhat the full Schr\u00f6dinger equation does\u201d). Watch it: the app ticks \u201cApply slit changes when the packet reaches the wall\u201d and closes slit 2 as the packet centre reaches the wall. The front of the packet keeps the two-slit fringes; the back shows one slit. The dashed curve on the screen is the two-slit prediction for the part of the packet already past the wall. At these default settings the model is outside its range of validity: the fringes kept at the front show the model, not the Schr\u00f6dinger equation.',
      prepare: () => setTo({ view: 'bohmian', slits: ['open', 'open'], color: 'slit' }),
      afterWatch: () => { const box = document.getElementById('slit-at-wall'); if (box) box.checked = true; setTimeout(() => document.querySelector('#slit-open-buttons button[data-slit="1"]')?.click(), 100); },
      draw: c => drawSetup(c, ['open', 'open'], { packet: true, shutter: 1 }),
    },
    {
      question: 'Many Worlds, two slits, a (macroscopic) which-slit detector on the upper slit. What happens at the slits?',
      caption: 'Two open slits; D marks the detector on slit 1.',
      plain: 'The state splits into two branches: one where the detector fired, one where it stayed silent.',
      answers: [
        { id: 'split', label: 'Two branches: detector fired, and silent' },
        { id: 'late', label: 'One branch until the particle hits the screen' },
        { id: 'interfere', label: 'Two branches that still interfere later' },
        { id: 'nothing', label: 'No change: the detector does not affect the wave' },
      ],
      answer: 'split',
      explain: 'The wave never collapses. The detector becomes correlated with the slit: (upper-slit wave) × (detector fired) + (lower-slit wave) × (detector silent). With a macroscopic detector these two branches have different, practically irreversible records, so they no longer interfere on the screen. Each branch’s weight is |ψ|² of its part; reading weights as probabilities is assumed here, and how Many Worlds justifies that is debated.',
      prepare: () => setTo({ view: 'manyworlds', slits: ['detector', 'open'] }),
      draw: c => drawSetup(c, ['detector', 'open']),
    },
  ];
  return mountQonticQuiz({
    panel, tab, simulationTab, questions, shuffle: true, score: true,
    title: 'Quiz · predict before you watch',
    onWatch: q => { if (!isRunning()) $('#startButton').trigger('click'); q?.afterWatch?.(); },
  });
}
