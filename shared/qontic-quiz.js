// Optional "Quiz" view for Q-Ontic apps: predict before you watch.
//
// The app supplies an empty panel, a top-level tab button for it, and its questions.
// Each question shows a still picture drawn by the app (so the running simulation
// cannot give the answer away), a set of answers and an explanation. After an answer,
// "Watch it in the simulation" switches to the Simulation tab with that state running.
// Opening the page with ?quiz=1 starts on the Quiz tab and keeps the Simulation tab
// locked until the first answer; ?quiz=N starts at question N. Leaving for the
// simulation removes the parameter from the address bar, so a reload opens the app.
// Apps that do not call mountQonticQuiz are unaffected.
//
// mountQonticQuiz({
//   panel,            // element that receives the quiz markup (e.g. <section id="quiz" hidden>)
//   tab,              // the top-level button that shows the panel (data-view="quiz")
//   simulationTab,    // the top-level button for the simulation
//   title,            // optional heading, default 'Quiz · predict before you watch'
//   answers,          // default answers: [{ id, label }]
//   questions,        // [{ question, answer, explain, plain?, caption?, answers?, prepare(), draw(canvas) }]
//                     //   plain: optional one-sentence answer in everyday words, shown first;
//                     //   explain then follows on its own line.
//   onWatch,          // called after switching to the simulation (e.g. start running)
//   param,            // URL parameter that enables quiz-first mode, default 'quiz'
//   shuffle,          // optional: show the answers in a random order (default false;
//                     //   a question can override it with its own shuffle: false)
//   score,            // optional: show the running score in the step line and a final
//                     //   "k of n right" line after the last question (default false)
//   shareLink,        // optional: a "Copy link to this question" button (default false)
//   intro,            // optional: one line shown under the title (e.g. the assumptions all questions share)
// })
// Per question, optionally: drawAfterAnswer: true (the picture appears only after an answer,
// for questions the picture would answer) and watch: false (no "Watch it in the simulation").
// prepare() sets the app state for the question (paused); draw(canvas) paints the still
// picture onto a 360 × 360 canvas. Returns { show(index), get index() }.

export function mountQonticQuiz({ panel, tab, simulationTab, title = 'Quiz · predict before you watch',
  answers: defaultAnswers = [], questions, onWatch = () => {}, param = 'quiz', shuffle = false, score = false,
  shareLink = false, intro = '' }) {
  panel.classList.add('qontic-panel', 'qontic-quiz');
  panel.innerHTML = `
    <div class="qontic-quiz-layout">
      <figure class="qontic-quiz-figure">
        <canvas width="360" height="360"></canvas>
        <figcaption></figcaption>
      </figure>
      <div class="qontic-quiz-body">
        <p class="qontic-quiz-title"></p>
        <p class="qontic-quiz-intro" hidden></p>
        <p class="qontic-quiz-step"></p>
        <p class="qontic-quiz-question" tabindex="-1"></p>
        <div class="qontic-app-toggle-group qontic-quiz-answers"></div>
        <div class="qontic-quiz-feedback" role="status" tabindex="-1"></div>
        <div class="qontic-quiz-actions">
          <button type="button" class="qontic-app-toggle" data-quiz="watch" hidden>Watch it in the simulation →</button>
          <button type="button" class="qontic-app-toggle" data-quiz="next" hidden>Next question</button>
          <button type="button" class="qontic-app-toggle qontic-quiz-link" data-quiz="link" hidden>Copy link to this question</button>
        </div>
      </div>
    </div>`;
  const $ = selector => panel.querySelector(selector);
  const canvas = $('canvas'), feedback = $('.qontic-quiz-feedback');
  const watch = $('[data-quiz="watch"]'), next = $('[data-quiz="next"]'), link = $('[data-quiz="link"]');
  link.hidden = !shareLink;
  $('.qontic-quiz-title').textContent = title;
  if (intro) { $('.qontic-quiz-intro').textContent = intro; $('.qontic-quiz-intro').hidden = false; }
  function placeholder() {
    const g = canvas.getContext('2d');
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.fillStyle = getComputedStyle(panel).color || '#a8bdc9';
    g.globalAlpha = 0.6;
    g.font = '15px Inter, system-ui, sans-serif';
    g.textAlign = 'center';
    g.fillText('The picture appears after you answer.', canvas.width / 2, canvas.height / 2);
    g.globalAlpha = 1;
    g.textAlign = 'start';
  }
  let index = 0, answered = false;
  const results = new Map(); // question index → answered correctly (first answer only)
  const stepText = () => `Question ${index + 1} of ${questions.length}` + (score && results.size ? ` · score ${[...results.values()].filter(Boolean).length} / ${results.size}` : '');

  function show(i) {
    index = ((i % questions.length) + questions.length) % questions.length;
    answered = false;
    const q = questions[index];
    q.prepare?.();
    $('.qontic-quiz-step').textContent = stepText();
    $('.qontic-quiz-question').textContent = q.question;
    $('figcaption').textContent = q.caption || '';
    feedback.textContent = '';
    watch.hidden = true;
    next.hidden = true;
    const box = $('.qontic-quiz-answers');
    const list = [...(q.answers || defaultAnswers)];
    if (q.shuffle ?? shuffle) for (let k = list.length - 1; k > 0; k--) { const r = Math.floor(Math.random() * (k + 1)); [list[k], list[r]] = [list[r], list[k]]; }
    box.replaceChildren(...list.map(({ id, label }) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'qontic-app-toggle';
      b.textContent = label;
      b.setAttribute('aria-pressed', 'false');
      b.dataset.answer = id;
      b.addEventListener('click', () => choose(id, b));
      return b;
    }));
    if (q.drawAfterAnswer) placeholder(); else q.draw?.(canvas);
  }

  function choose(id, button) {
    if (answered) return;
    answered = true;
    const q = questions[index];
    for (const b of $('.qontic-quiz-answers').children) {
      b.setAttribute('aria-pressed', String(b === button));
      b.disabled = true;
      // Mark the correct answer (text mark as well as style, not colour alone).
      if (b.dataset.answer === q.answer) { b.classList.add('qontic-quiz-correct'); b.textContent = '✓ ' + b.textContent; }
    }
    if (!results.has(index)) results.set(index, id === q.answer);
    if (score) $('.qontic-quiz-step').textContent = stepText();
    const verdict = id === q.answer ? 'Yes.' : 'Not quite.';
    const lines = q.plain ? [`${verdict} ${q.plain}`, q.explain] : [`${verdict} ${q.explain}`];
    if (score && results.size === questions.length && index === questions.length - 1) {
      const right = [...results.values()].filter(Boolean).length;
      lines.push(`You got ${right} of ${questions.length} right on the first try.`);
    }
    feedback.replaceChildren(...lines.map((text, k) => {
      const p = document.createElement('p');
      p.textContent = text;
      if (k > 0) p.className = 'qontic-quiz-detail';
      return p;
    }));
    feedback.focus({ preventScroll: true });
    if (q.drawAfterAnswer) q.draw?.(canvas);
    watch.hidden = q.watch === false;
    next.hidden = false;
    next.textContent = index + 1 < questions.length ? 'Next question' : 'Start again';
    simulationTab.disabled = false;
    simulationTab.removeAttribute('title');
  }

  function dropParam() {
    const url = new URL(location.href);
    if (!url.searchParams.has(param)) return;
    url.searchParams.delete(param);
    history.replaceState(history.state, '', url);
  }
  watch.addEventListener('click', () => { simulationTab.click(); onWatch(questions[index]); });
  simulationTab.addEventListener('click', dropParam);
  next.addEventListener('click', () => {
    // "Start again" after the last question starts a fresh score.
    if (index + 1 >= questions.length) results.clear();
    show(index + 1); $('.qontic-quiz-question').focus({ preventScroll: true });
  });
  tab.addEventListener('click', () => { if (!answered) show(index); });
  link.addEventListener('click', async () => {
    const url = new URL(location.href);
    url.search = `?${param}=${index + 1}`;
    try { await navigator.clipboard.writeText(url.href); link.textContent = 'Link copied'; }
    catch { link.textContent = url.href; }
    setTimeout(() => { link.textContent = 'Copy link to this question'; }, 2500);
  });

  const start = parseInt(new URLSearchParams(location.search).get(param), 10);
  if (start >= 1) {
    index = Math.min(start, questions.length) - 1;
    simulationTab.disabled = true;
    simulationTab.title = 'Answer the quiz question first';
    tab.click();
  }
  return { show, get index() { return index; } };
}
