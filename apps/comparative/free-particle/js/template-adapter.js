import { mountQonticMedia } from '../../../../shared/qontic-media.js?v=3.0';
import { mountQonticShell } from '../../../../shared/qontic-shell.js';
import '../../../../shared/qontic-controls.js?v=3.2';
import { mountDistanceScale, mountCoordinateTools } from '../../../../shared/qontic-overlays.js?v=6';

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
    'show-tabs':'true', 'show-advanced':'false', 'show-appearance':'false', 'active-tab':'core',
    'speed-min':'0.1', 'speed-max':'16', 'speed-step':'0.01', 'speed':String(fp.speed),
  })) controls.setAttribute(name, value);
  const controlPanel = document.createElement('section');
  controlPanel.className = 'fp-control-panel qontic-panel qontic-control-panel';
  controlPanel.setAttribute('aria-label', 'Free Particle controls');
  const corePane = document.createElement('div');
  corePane.id = 'fp-controls-core';
  corePane.className = 'fp-control-pane qontic-control-body';
  const displayPane = document.createElement('div');
  displayPane.id = 'fp-controls-display';
  displayPane.className = 'fp-control-pane qontic-control-body fp-display-pane';
  displayPane.hidden = true;
  controlPanel.append(controls, corePane, displayPane);
  left.prepend(controlPanel);
  // Move existing inputs rather than cloning them or registering a second engine.
  corePane.append(
    $('fp-energy-slider').closest('.slider-row'),
    $('fp-bin-control'),
    $('fp-sigma-row'),
    $('fp-sigma-y-row'),
  );
  const quantitySection = document.createElement('section');
  quantitySection.className = 'qontic-control-section fp-quantity-section';
  const quantityTitle = document.createElement('h3');
  quantityTitle.className = 'qontic-control-section-title';
  quantityTitle.textContent = 'What to display';
  quantitySection.append(quantityTitle, $('fp-display-row'));
  corePane.append(quantitySection, $('fp-mw-controls'));
  $('fp-display-row').querySelectorAll('label').forEach(label => label.classList.add('qontic-app-toggle'));
  $('fp-display-row').classList.add('qontic-app-toggle-group');

  const displayLayers = document.createElement('div');
  displayLayers.className = 'qontic-display-layers fp-display-layers';

  const paletteRow = document.createElement('div');
  paletteRow.className = 'fp-display-control qontic-display-layer';
  const paletteLabel = document.createElement('span');
  paletteLabel.className = 'qontic-display-layer-label';
  paletteLabel.textContent = 'Wave palette';
  const paletteName = document.createElement('span');
  paletteName.className = 'fp-palette-name qontic-display-layer-value';
  const paletteButton = document.createElement('button');
  paletteButton.type = 'button';
  paletteButton.className = 'fp-palette-button qontic-color-button';
  paletteButton.setAttribute('aria-label', 'Choose wave palette');
  paletteButton.title = 'Choose wave palette';
  const paletteSwatch = document.createElement('i');
  paletteSwatch.className = 'fp-palette-swatch';
  paletteButton.append(paletteSwatch);
  const paletteGradients = {
    'Q-Ontic':['#000000','#0e2263','#2e48bb','#9239bb','#e53938','#ff6728'],
    Thermal:['#000000','#4b4ac8','#2f9ef5','#35eba2','#96fa50','#ebd22e','#ff801d','#d2350e'],
    Ice:['#000000','#080e28','#143374','#1c74b2','#4abcd6','#a6e8f1','#e8fbff'],
    Classic:['#000000','#0a111a','#143c3d','#066827','#6d350d','#91111b','#970c1b','#8c0b3d','#810a50'],
    Gray:['#717171','#8d8d8d','#aaaaaa','#c6c6c6','#e2e2e2'],
    Green:['#5aa664','#a6dba0','#d9f0d3'], Blue:['#4292c6','#6baed6','#c6dbef'],
    Red:['#67000d','#a50f15','#cb181d','#ef3b2c','#fcbba1'], Yellow:['#8c510a','#d8b365','#f6e8c3','#fee08b','#ffffbf'],
    Inferno:['#000004','#420a68','#932667','#dd513a','#fca50a'],
    Spectral:['#9e0142','#f46d43','#fdae61','#fee08b','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2'],
    RdYlBu:['#d73027','#fc8d59','#fee090','#e0f3f8','#91bfdb','#4575b4']
  };
  let selectedPalette = 'Q-Ontic';
  const palettePopup = document.createElement('div');
  palettePopup.className = 'fp-palette-popup';
  palettePopup.hidden = true;
  palettePopup.setAttribute('role', 'dialog');
  palettePopup.setAttribute('aria-modal', 'true');
  palettePopup.setAttribute('aria-labelledby', 'fp-palette-title');
  const palettePanel = document.createElement('section');
  palettePanel.className = 'fp-palette-panel';
  const paletteTitle = document.createElement('h3');
  paletteTitle.id = 'fp-palette-title';
  paletteTitle.textContent = 'Select a Color Palette';
  const paletteClose = document.createElement('button');
  paletteClose.type = 'button'; paletteClose.className = 'fp-palette-close';
  paletteClose.setAttribute('aria-label', 'Close palette chooser'); paletteClose.textContent = 'Close';
  const paletteGrid = document.createElement('div');
  paletteGrid.className = 'fp-palette-grid';
  palettePanel.append(paletteTitle, paletteClose, paletteGrid);
  palettePopup.append(palettePanel);
  document.body.append(palettePopup);
  const closePalette = () => { palettePopup.hidden = true; paletteButton.setAttribute('aria-expanded', 'false'); paletteButton.focus(); };
  const choosePalette = name => {
    selectedPalette = name;
    paletteName.textContent = name;
    paletteSwatch.style.background = `linear-gradient(90deg,${paletteGradients[name].join(',')})`;
    paletteGrid.querySelectorAll('.fp-palette-option').forEach(option => {
      const selected = option.dataset.palette === name;
      option.classList.toggle('selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
    window.fpSetWavePalette?.(name);
    try { localStorage.setItem('qontic-free-particle-palette-v2', name); } catch (_) {}
  };
  for (const name of window.fpWavePaletteNames || ['Q-Ontic']) {
    const option = document.createElement('button');
    option.type = 'button'; option.className = 'fp-palette-option'; option.dataset.palette = name;
    const label = document.createElement('span'); label.className = 'fp-palette-option-label'; label.textContent = name;
    const swatch = document.createElement('i'); swatch.className = 'fp-palette-option-swatch';
    swatch.style.background = `linear-gradient(90deg,${paletteGradients[name].join(',')})`;
    option.append(label, swatch);
    option.addEventListener('click', () => { choosePalette(name); closePalette(); });
    paletteGrid.append(option);
  }
  const syncPalette = () => {
    choosePalette(selectedPalette);
  };
  paletteButton.setAttribute('aria-haspopup', 'dialog');
  paletteButton.setAttribute('aria-expanded', 'false');
  paletteButton.addEventListener('click', () => {
    palettePopup.hidden = false; paletteButton.setAttribute('aria-expanded', 'true');
    paletteGrid.querySelector('.selected')?.focus();
  });
  paletteClose.addEventListener('click', closePalette);
  palettePopup.addEventListener('click', event => { if (event.target === palettePopup) closePalette(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !palettePopup.hidden) closePalette(); });
  paletteRow.append(paletteLabel, paletteName, paletteButton);

  const opacityRow = document.createElement('label');
  opacityRow.className = 'fp-display-control qontic-display-layer';
  const opacityLabel = document.createElement('span'); opacityLabel.className = 'qontic-display-layer-label'; opacityLabel.textContent = 'Wave opacity';
  const opacity = document.createElement('input');
  opacity.type = 'range'; opacity.id = 'fp-wave-opacity'; opacity.min = '0'; opacity.max = '100'; opacity.step = '5'; opacity.value = '100';
  opacity.setAttribute('aria-label', 'Wave opacity');
  const opacityValue = document.createElement('output'); opacityValue.value = '100%'; opacityValue.textContent = '100%';
  const syncOpacity = () => {
    opacityValue.value = opacity.value + '%'; opacityValue.textContent = opacity.value + '%';
    window.fpSetWaveOpacity?.(Number(opacity.value) / 100);
    try { localStorage.setItem('qontic-free-particle-wave-opacity', opacity.value); } catch (_) {}
  };
  opacity.addEventListener('input', syncOpacity);
  opacityRow.append(opacityLabel, opacity, opacityValue);

  const makeColorRow = (labelText, id, defaultColor, setterName, storageKey) => {
    const row = document.createElement('label');
    row.className = 'qontic-display-layer';
    const label = document.createElement('span');
    label.className = 'qontic-display-layer-label';
    label.textContent = labelText;
    const input = document.createElement('input');
    input.type = 'color'; input.id = id; input.value = defaultColor;
    input.className = 'qontic-color-input';
    input.setAttribute('aria-label', `Choose ${labelText.toLowerCase()} color`);
    input.title = input.getAttribute('aria-label');
    const syncColor = () => {
      window[setterName]?.(input.value);
      try { localStorage.setItem(storageKey, input.value); } catch (_) {}
    };
    input.addEventListener('input', syncColor);
    row.append(label, input);
    return { row, input, sync: syncColor, storageKey };
  };
  const detectorColor = makeColorRow('Detector', 'fp-detector-color', '#648cff', 'fpSetDetectorColor', 'qontic-free-particle-detector-color');
  const hitColor = makeColorRow('Hits', 'fp-hit-color', '#50f050', 'fpSetHitColor', 'qontic-free-particle-hit-color');
  displayLayers.append(paletteRow, opacityRow, detectorColor.row, hitColor.row);
  displayPane.append(displayLayers);
  try {
    const savedPalette = localStorage.getItem('qontic-free-particle-palette-v2');
    if (savedPalette && paletteGradients[savedPalette]) selectedPalette = savedPalette;
    const savedOpacityRaw = localStorage.getItem('qontic-free-particle-wave-opacity');
    if (savedOpacityRaw !== null) {
      const savedOpacity = Number(savedOpacityRaw);
      if (Number.isFinite(savedOpacity) && savedOpacity >= 0 && savedOpacity <= 100) opacity.value = String(savedOpacity);
    }
    for (const control of [detectorColor, hitColor]) {
      const savedColor = localStorage.getItem(control.storageKey);
      if (/^#[0-9a-f]{6}$/i.test(savedColor || '')) control.input.value = savedColor;
    }
  } catch (_) {}
  syncPalette(); syncOpacity(); detectorColor.sync(); hitColor.sync();

  controls.addEventListener('qontic:tab', event => {
    const display = event.detail.tab === 'display';
    corePane.hidden = display;
    displayPane.hidden = !display;
  });
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
  const canvasHost = $('fp-canvas-wrap');
  const formatDistance = value => Number(value.toPrecision(4)) + ' nm';
  let media;
  const scale = mountDistanceScale({
    host:canvasHost, storageKey:'qontic-free-particle-scale-position-v2',
    defaultPosition:({hostHeight,height}) => ({x:8,y:Math.max(8,hostHeight-height-8)}),
    getUnitsPerPixel:() => ({
      x:(fp.xMax_nm - fp.xMin_nm) / Math.max(1, canvasHost.clientWidth),
      y:(fp.yMax_nm - fp.yMin_nm) / Math.max(1, canvasHost.clientHeight),
    }),
    format:formatDistance,
    onVisibilityChange:() => media?.syncScale(),
  });
  const coordinates = mountCoordinateTools({
    host:canvasHost, storageKey:'qontic-free-particle-grid-visible', formatValue:formatDistance,
    getBounds:() => ({xMin:fp.xMin_nm, xMax:fp.xMax_nm, yMin:fp.yMin_nm, yMax:fp.yMax_nm}),
  });
  media = mountQonticMedia({
    stage, controls, filename:'qontic-free-particle',
    coordinateControl:coordinates, scaleControl:scale,
    getCanvases: () => [...stage.querySelectorAll('#fpYProjCanvas, #fpWaveCanvas, #fpPartCanvas, #fpDetCanvas, #fpProbCanvas, .mw-mini-wrap canvas'), scale.canvas, coordinates.canvas],
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
    version:'Free Particle · Version 1.12 · 2026-11-06', homeHref:'../../../index.html'});
  document.body.classList.add('fp-template');
  sync(); syncPage();
  // Existing resize handler refreshes all canvases after the layout changes.
  window.dispatchEvent(new Event('resize'));
}
if (document.readyState === 'complete') mountFreeParticleTemplate();
else window.addEventListener('load', mountFreeParticleTemplate, {once:true});
