// Q-Ontic notebook template, 1.0.
// Gives a notebook the same branded header, breadcrumbs, footer and themes as
// the Q-Ontic apps (it uses the apps' shell), and adds what notebooks need:
// a sticky bar of section links, a light/dark switch remembered across
// notebooks, and one shared behaviour for multiple-choice questions.
//
// Page structure expected (see templates/qontic-notebook/index.html):
//   <body class="qontic-notebook">
//   <main class="shell">
//     <header><div><p class="eyebrow"></p><h1>Title</h1></div></header>
//     <div class="qn-intro">…lead, prerequisites…</div>
//     <section class="section" id="s1"><div class="section-head"><h2>…</h2>…</section>
//     …
//   </main>
//
// Questions: <div class="quiz" data-quiz> with <button data-ok="true|false"
// data-fb="feedback">. Each answer dispatches a bubbling `qontic:quiz` event
// with detail {quiz, correct}; notebooks can listen to it (e.g. for progress).
import { mountQonticShell } from './qontic-shell.js?v=3.7';

const THEME_KEY = 'qontic-notebook-theme';
const DEPTH_KEY = 'qontic-notebook-depth';

// Reading depth. Mark text with .qn-brief (shown only in Brief) or .qn-full
// (shown only in Full). A whole section marked .qn-full disappears from the
// section bar in Brief. Each .qn-brief paragraph gets a link to the full text.
function applyDepth(depth) {
  const full = depth === 'full';
  document.body.classList.toggle('qn-depth-full', full);
  document.body.classList.toggle('qn-depth-brief', !full);
  document.querySelectorAll('.qn-depth button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.depth === depth)));
  document.querySelectorAll('.qn-sections a').forEach((a) => {
    const s = document.getElementById(a.hash.slice(1));
    a.hidden = !full && !!s?.classList.contains('qn-full');
  });
}
function setDepth(depth) {
  try { localStorage.setItem(DEPTH_KEY, depth); } catch (_) { /* storage unavailable */ }
  applyDepth(depth);
}

function applyTheme(theme) {
  const light = theme === 'light';
  document.documentElement.classList.toggle('qontic-light', light);
  document.body.classList.toggle('qontic-light', light);
  document.querySelectorAll('.qn-theme').forEach((b) => {
    b.setAttribute('aria-checked', String(light));
    const label = b.querySelector('span');
    if (label) label.textContent = 'Light theme';
  });
}

function sectionLabel(section) {
  const h2 = section.querySelector('.section-head h2, h2');
  return section.dataset.navLabel || (h2 ? h2.textContent.trim() : section.id);
}

function buildBar(shell, header) {
  const sections = [...shell.querySelectorAll(':scope > section.section[id]')];
  const bar = document.createElement('nav');
  bar.className = 'qn-bar';
  bar.setAttribute('aria-label', 'Notebook sections');
  const list = document.createElement('div');
  list.className = 'qn-sections';
  for (const s of sections) {
    const a = document.createElement('a');
    a.href = `#${s.id}`;
    a.textContent = sectionLabel(s);
    list.append(a);
  }
  const theme = document.createElement('button');
  theme.type = 'button';
  theme.className = 'qn-theme';
  theme.setAttribute('role', 'switch');
  theme.innerHTML = '<span>Light theme</span><i aria-hidden="true"></i>';
  theme.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('qontic-light') ? 'dark' : 'light';
    try { localStorage.setItem(THEME_KEY, next); } catch (_) { /* storage unavailable */ }
    applyTheme(next);
  });
  const hasDepth = !!document.querySelector('.qn-brief, .qn-full');
  if (hasDepth) {
    const depth = document.createElement('div');
    depth.className = 'qn-depth';
    depth.setAttribute('role', 'group');
    depth.setAttribute('aria-label', 'Reading depth');
    depth.innerHTML = '<button type="button" data-depth="brief" title="Short summaries, demonstrations and questions">Brief</button><button type="button" data-depth="full" title="The complete explanation and the math">Full</button>';
    depth.addEventListener('click', (e) => { const b = e.target.closest('button[data-depth]'); if (b) setDepth(b.dataset.depth); });
    bar.append(list, depth, theme);
    document.querySelectorAll('.prose.qn-brief').forEach((el) => {
      const target = el.matches('p') ? el : el.querySelector('p:last-of-type');
      if (!target || target.querySelector('.qn-more')) return;
      const more = document.createElement('button');
      more.type = 'button'; more.className = 'qn-more'; more.textContent = 'Full explanation';
      more.addEventListener('click', () => {
        const section = el.closest('section');
        setDepth('full');
        section?.scrollIntoView({ block: 'start' });
      });
      target.append(' ', more);
    });
  } else bar.append(list, theme);
  const intro = shell.querySelector(':scope > .qn-intro');
  (intro || header).after(bar);

  // highlight the section being read
  if ('IntersectionObserver' in window && sections.length) {
    const links = new Map([...list.children].map((a) => [a.hash.slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.remove('current'));
        const a = links.get(e.target.id);
        if (a) { a.classList.add('current'); a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }
}

function wireQuizzes(root) {
  root.querySelectorAll('[data-quiz]').forEach((quiz) => {
    if (quiz.dataset.qnWired) return;
    quiz.dataset.qnWired = '1';
    const fb = quiz.querySelector('.fb');
    quiz.querySelectorAll('button[data-ok]').forEach((b) => b.addEventListener('click', () => {
      quiz.querySelectorAll('button[data-ok]').forEach((x) => x.classList.remove('right', 'wrong'));
      const correct = b.dataset.ok === 'true';
      b.classList.add(correct ? 'right' : 'wrong');
      if (fb) { fb.textContent = b.dataset.fb || ''; fb.hidden = false; }
      quiz.dispatchEvent(new CustomEvent('qontic:quiz', { bubbles: true, detail: { quiz, correct } }));
    }));
  });
}

// Embedded applets: <div class="applet-shell is-inactive"> with an
// <iframe data-src> and a .applet-play button. The iframe loads only when the
// reader presses play, and is asked to pause (qontic:set-paused) when it
// scrolls out of view.
function wireApplets(root) {
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) return;
      const f = e.target.querySelector('iframe[src]');
      f?.contentWindow?.postMessage({ type: 'qontic:set-paused', paused: true }, window.location.origin);
    });
  }) : null;
  root.querySelectorAll('.applet-shell.is-inactive').forEach((shell) => {
    if (shell.dataset.qnWired) return;
    shell.dataset.qnWired = '1';
    const frame = shell.querySelector('iframe[data-src]');
    const play = shell.querySelector('.applet-play');
    if (!frame || !play) return;
    play.addEventListener('click', () => {
      if (!frame.hasAttribute('src')) frame.setAttribute('src', frame.dataset.src);
      shell.classList.remove('is-inactive');
      play.remove();
      io?.observe(shell);
    });
  });
}

export function mountQonticNotebook(options = {}) {
  const settings = {
    navigation: 'breadcrumbs',
    headerVisibilityControl: false,
    eyebrow: 'Q-Ontic notebook',
    badge: 'Notebook',
    ...options,
  };
  document.body.classList.add('qontic-notebook');
  let stored = null;
  try { stored = localStorage.getItem(THEME_KEY); } catch (_) { /* storage unavailable */ }
  applyTheme(stored || settings.theme || 'dark');
  mountQonticShell(settings);
  const shell = document.querySelector('main.shell');
  const header = shell?.querySelector(':scope > header');
  if (shell && header && settings.sectionBar !== false) buildBar(shell, header);
  let depth = null;
  try { depth = localStorage.getItem(DEPTH_KEY); } catch (_) { /* storage unavailable */ }
  applyDepth(depth || settings.depth || 'brief');
  applyTheme(document.documentElement.classList.contains('qontic-light') ? 'light' : 'dark');
  wireQuizzes(document);
  wireApplets(document);
  return { wireQuizzes: () => wireQuizzes(document), setTheme: (t) => { applyTheme(t); } };
}
