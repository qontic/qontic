import { mountQonticMedia } from '../../../../shared/qontic-media.js?v=3.0';
import { mountQonticShell } from '../../../../shared/qontic-shell.js';
import '../../../../shared/qontic-controls.js?v=3.1';

// The shared component owns presentation; the original engine owns all state.
// Keep legacy controls as hidden event endpoints so keyboard and export behavior
// retain the same code paths. No shadow-DOM implementation details are used here.
function mountFreeParticleTemplate() {
  const $ = id => document.getElementById(id);
  const app = document.querySelector('.app-outer');
  if (!app || document.body.classList.contains('fp-template')) return;
  const left = app.querySelector('.left-panel');
  const canvasArea = app.querySelector('.canvas-area');
  app.classList.add('qontic-workspace');
  left.classList.add('qontic-sidebar');
  canvasArea?.classList.add('qontic-stage');
  const cards = [...left.querySelectorAll(':scope > .panel-card')];
  const shell = document.createElement('main');
  shell.className = 'shell fp-shell';
  shell.innerHTML = '<header><div><p class="eyebrow">Q-Ontic interactive laboratory</p><h1>Free Particle</h1></div></header>';
  const nav = document.querySelector('.view-tab-bar');
  nav.classList.add('tabs');
  nav.setAttribute('aria-label', 'Application sections');
  const simulationTab = nav.querySelector('[data-viewtab="sim"]');
  const physicsTab = nav.querySelector('[data-viewtab="physics"]');
  const viewsTab = nav.querySelector('[data-viewtab="rationale"]');
  const compareTab = nav.querySelector('[data-viewtab="compare"]');
  const viewsPanel = $('viewpanel-rationale');
  const comparePanel = $('viewpanel-compare');
  simulationTab.textContent = 'Simulation';
  physicsTab.textContent = 'Physics';
  viewsTab.textContent = 'Views';
  viewsTab.dataset.viewtab = 'views';
  viewsPanel.id = 'viewpanel-views';
  const comparisonHeading = document.createElement('h4');
  comparisonHeading.textContent = 'Comparison of views';
  viewsPanel.append(comparisonHeading, ...comparePanel.children);
  comparePanel.remove();
  compareTab.remove();
  nav.append(simulationTab, physicsTab, viewsTab);
  app.before(shell);
  shell.append(nav, app);
  const modelNote = document.querySelector('.top-bar').nextElementSibling;
  if (modelNote !== shell && modelNote.textContent.includes('Pedagogical')) {
    modelNote.removeAttribute('style');
    modelNote.className = 'fp-model-note';
    viewsPanel.prepend(modelNote);
  }

  const controls = document.createElement('qontic-controls');
  controls.id = 'fp-shared-controls';
  for (const [name, value] of Object.entries({
    'show-reset':'true', 'interpretation':'pw', 'theme':document.documentElement.dataset.theme || 'light',
    'show-tabs':'false', 'show-appearance':'true',
    'speed-min':'0.1', 'speed-max':'16', 'speed-step':'0.01', 'speed':String(fp.speed),
  })) controls.setAttribute(name, value);
  const controlPanel = document.createElement('section');
  controlPanel.className = 'fp-control-panel qontic-panel qontic-control-panel';
  controlPanel.setAttribute('aria-label', 'Free Particle controls');
  const corePane = document.createElement('div');
  corePane.id = 'fp-controls-core';
  corePane.className = 'fp-control-pane qontic-control-body';
  controlPanel.append(controls, corePane);
  left.prepend(controlPanel);
  // Move existing inputs rather than cloning them or registering a second engine.
  corePane.append(
    $('fp-energy-slider').closest('.slider-row'),
    $('fp-bin-control'),
    $('fp-sigma-row'),
    $('fp-sigma-y-row'),
    $('fp-display-row'),
  );
  controlPanel.append($('fp-mw-controls'));
  $('fp-display-row').querySelectorAll('label').forEach(label => label.classList.add('qontic-app-toggle'));
  $('fp-display-row').classList.add('qontic-app-toggle-group');
  cards.forEach(card => card.classList.add('fp-legacy-control'));
  for (const id of ['fp-playback-controls', 'fp-speed-control']) $(id).classList.add('fp-legacy-control');
  for (const [id,label] of [['fp-energy-slider','Energy'],['fp-sigma-slider','Packet width'],['fp-sigmay-slider','Vertical spread']]) $(id).setAttribute('aria-label',label);
  const modeMap = {cpn:'collapse', pw:'pilotwave', mw:'manyworlds'};
  const reverseModes = {collapse:'cpn', pilotwave:'pw', manyworlds:'mw'};
  const set = (key,value) => { if (controls.getAttribute(key) !== String(value)) controls.setAttribute(key,String(value)); };
  function sync() {
    set('running', fp.running);
    set('interpretation', reverseModes[fp.interpMode]);
    set('auto-run', fp.autoNextCycle);
    set('speed', fp.speed);
    // Recorder disables legacy reset for the duration of the export.
    set('disabled', $('fp-btn-reset').disabled);
    const theme = document.documentElement.dataset.theme || 'light';
    set('theme', theme);
    set('accent', theme === 'light' ? '#087487' : '#55d8e6');
  }
  controls.addEventListener('qontic:start', () => { $('fp-btn-start').click(); sync(); });
  controls.addEventListener('qontic:stop', () => { $('fp-btn-stop').click(); sync(); });
  controls.addEventListener('qontic:reset', () => { $('fp-btn-reset').click(); sync(); });
  controls.addEventListener('qontic:autorun', event => {
    $('fp-auto-next').checked = event.detail.autoRun;
    $('fp-auto-next').dispatchEvent(new Event('change', {bubbles:true})); sync();
  });
  controls.addEventListener('qontic:speed', event => {
    $('fp-speed').value = event.detail.speed;
    $('fp-speed').dispatchEvent(new Event('input', {bubbles:true})); sync();
  });
  controls.addEventListener('qontic:interpretation', event => {
    const radio = document.querySelector(`input[name="fp-interp"][value="${modeMap[event.detail.interpretation]}"]`);
    radio.checked = true;
    radio.dispatchEvent(new Event('change', {bubbles:true})); sync();
  });
  controls.addEventListener('qontic:theme', event => {
    const current = document.documentElement.dataset.theme || 'light';
    if (current !== event.detail.theme) $('fp-theme-btn').click();
    sync();
  });
  controls.addEventListener('keydown', event => event.stopPropagation());
  const observer = new MutationObserver(sync);
  for (const id of ['fp-btn-start','fp-btn-stop','fp-btn-reset']) observer.observe($(id),{attributes:true,attributeFilter:['disabled']});
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  left.addEventListener('change',sync);
  document.addEventListener('keyup',sync);

  function syncPage() {
    const active = nav.querySelector('.view-tab-active')?.dataset.viewtab || 'sim';
    // The navigation swaps the content inside the stage. Keep the control
    // column mounted so non-simulation views cannot fall into its grid cell.
    left.hidden = false;
    nav.querySelectorAll('button').forEach(button => {
      const selected = button.dataset.viewtab === active;
      button.classList.toggle('active',selected);
      button.setAttribute('aria-pressed',String(selected));
    });
    // A canvas measured while its panel is hidden keeps a zero or stale size.
    // Wait for the restored stage to complete layout, then use the app's
    // existing resize handler to redraw at the real dimensions.
    if (active === 'sim') {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      }));
    }
  }
  nav.addEventListener('click',syncPage);
  // Shared media toolbar; retain the app's offline high-resolution MP4 exporter.
  const stage = $('viewpanel-sim');
  mountQonticMedia({
    stage, controls, filename:'qontic-free-particle',
    getCanvases: () => [...stage.querySelectorAll('#fpYProjCanvas, #fpWaveCanvas, #fpPartCanvas, #fpDetCanvas, #fpProbCanvas, .mw-mini-wrap canvas')],
    onRecord: () => $('fp-btn-record').click(),
  });
  const toolbar = stage.querySelector('.qontic-media-toolbar');
  stage.querySelector('.sim-toolbar').append(toolbar);
  $('fp-btn-record').hidden = true;
  $('fp-btn-expand').hidden = true;

  // Preserve every readout in a compact, collapsible Results panel.
  const results = document.querySelector('.info-compact');
  const resultBody = document.createElement('div');
  resultBody.className = 'fp-results-body';
  while(results.firstChild) resultBody.append(results.firstChild);
  const toggle = document.createElement('button');
  toggle.type = 'button'; toggle.className = 'qontic-app-toggle fp-results-title';
  toggle.textContent = 'Results'; toggle.setAttribute('aria-expanded','true');
  resultBody.hidden = false;
  toggle.addEventListener('click',() => { resultBody.hidden = !resultBody.hidden; toggle.setAttribute('aria-expanded',String(!resultBody.hidden)); });
  results.append(toggle,resultBody);
  results.classList.add('fp-results');
  controlPanel.after(results);

  mountQonticShell({title:'Free Particle', purpose:'Explore wave-packet spreading and detector outcomes in three quantum interpretations.',
    version:'Free Particle · Version 1.10 · 2026-09-24', homeHref:'../../../index.html'});
  document.body.classList.add('fp-template');
  sync(); syncPage();
  // Existing resize handler refreshes all canvases after the layout changes.
  window.dispatchEvent(new Event('resize'));
}
if (document.readyState === 'complete') mountFreeParticleTemplate();
else window.addEventListener('load', mountFreeParticleTemplate, {once:true});
