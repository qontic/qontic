import { mountQonticNotebook } from '../../shared/qontic-notebook.js?v=1.2';

// Use the shared notebook shell for navigation, reading depth and quizzes.
mountQonticNotebook({
  title: 'Double Slit: Three Accounts — Analytical Notebook',
  eyebrow: 'Q-Ontic notebook',
  version: 'Double-slit notebook',
  purpose: 'Build the double-slit pattern from single electrons, amplitudes and which-slit records, then compare three accounts of the same experiment.',
  depth: 'full',
  compactHeader: true,
  homeHref: '../../index.html',
});

// Retain links made with the earlier reading-mode names.
const requested = new URLSearchParams(location.search).get('mode');
const depth = { succinct: 'brief', detailed: 'full', brief: 'brief', full: 'full' }[requested];
if (depth) document.querySelector(`.qn-depth [data-depth="${depth}"]`)?.click();

const depthButtons = document.querySelector('.qn-depth');
if (depthButtons) {
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'qn-depth-reset';
  reset.textContent = '↺';
  reset.setAttribute('aria-label', 'Reset reading preference');
  reset.title = 'Reset reading preference to Full';
  reset.addEventListener('click', () => {
    depthButtons.querySelector('[data-depth="full"]').click();
    try {
      localStorage.removeItem('qontic-notebook-depth');
      localStorage.removeItem('qontic-notebook-mode-v3');
    } catch (_) { /* Reading remains available without storage. */ }
    const url = new URL(location.href);
    url.searchParams.delete('mode');
    history.replaceState(null, '', url);
  });
  depthButtons.after(reset);
}

document.querySelectorAll('[data-qn-result-collapse]').forEach(button => {
  button.addEventListener('click', () => {
    const readout = button.closest('.qn-results').querySelector('.readout');
    readout.hidden = !readout.hidden;
    button.textContent = readout.hidden ? '+' : '−';
    button.setAttribute('aria-expanded', String(!readout.hidden));
    const label = button.closest('.qn-results').querySelector('strong').textContent;
    button.setAttribute('aria-label', `${readout.hidden ? 'Expand' : 'Collapse'} ${label.toLowerCase()}`);
  });
});

document.querySelectorAll('[data-qn-representation]').forEach(button => {
  button.setAttribute('aria-pressed', String(button.dataset.qnRepresentation === 'pilot-wave'));
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-qn-representation]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('primary', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.dispatchEvent(new CustomEvent('qontic:representation', {
      detail: { representation: button.dataset.qnRepresentation },
    }));
  });
});

// Changing reading depth can resize a hidden figure; redraw it when revealed.
document.querySelector('.qn-bar')?.addEventListener('click', event => {
  const selected = event.target.closest('[data-depth]');
  if (selected) {
    const url = new URL(location.href);
    if (selected.dataset.depth === 'full') url.searchParams.delete('mode');
    else url.searchParams.set('mode', selected.dataset.depth);
    history.replaceState(null, '', url);
  }
  requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
});
