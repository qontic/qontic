import { mountExpandedResize } from './expanded-resize.js?v=72';
import { mountPacketEngine } from './packet-engine.js?v=2.89-truth';
import { mountMWBranching } from './mw-branching.js?v=2.89-marker-continuity';
import { APP_RELEASE } from './release.js?v=2.89';
import { mountDistanceScale, mountValueRange } from '../../../../shared/qontic-overlays.js?v=4';
import { mountQonticMedia } from '../../../../shared/qontic-media.js?v=range-25';
import { enableResizableSidebar } from '../../../../shared/qontic-resize.js?v=1';
import { mountQonticShell } from '../../../../shared/qontic-shell.js?v=resources-20260916';
import '../../../../shared/qontic-controls.js?v=2.89-controls';

// Adapt the existing controls in place so their listeners and physics stay intact.
$(function () {
  const shell = document.createElement('main');
  shell.className = 'shell analytical-shell';
  shell.innerHTML = `<header><div><p class="eyebrow">Q-Ontic interactive laboratory</p><h1>Double Slit</h1></div></header>
    <nav class="tabs" aria-label="Application sections">
      <button type="button" data-page="0" class="active">Simulation</button>
      <button type="button" data-page="1">Physics</button>
      <button type="button" data-page="2">Views</button>
    </nav>`;
  const root = document.getElementById('superContainer');
  root.before(shell);
  shell.append(root);
  $('#psiTabs').tabs('destroy');
  const math = document.getElementById('math-container');
  root.append(math);
  document.querySelector('#superContainer > ul a[href="#rationale"]')?.closest('li').remove();
  document.getElementById('rationale')?.remove();
  $('#superContainer > ul').append('<li><a href="#math-container">Physics</a></li>');
  const views=document.createElement('div');views.id='rationale';root.append(views);
  $('#superContainer > ul').append('<li><a href="#rationale">Views</a></li>');
  $('#superContainer').tabs('refresh');
  const pageButtons = shell.querySelectorAll('[data-page]');
  const syncPage = () => {
    const active = $('#superContainer').tabs('option', 'active');
    pageButtons.forEach(button => {
      const selected = Number(button.dataset.page) === active;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  };
  const showPage = index => {
    $('#superContainer').tabs('option', 'active', index);
    syncPage();
    shell.scrollIntoView({block: 'start'});
  };
  pageButtons.forEach(button => button.addEventListener('click', () => {
    showPage(Number(button.dataset.page));
  }));
  $('#superContainer').on('tabsactivate', syncPage);
  // Handle these links directly: the outer jQuery tabs widget can consume
  // their hash-link click before the legacy document-level handler sees it.
  root.querySelectorAll('.view-link').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    changeInterpretation(link.dataset.view);
    showPage(0);
  }));

  const controls = document.createElement('qontic-controls');
  controls.id = 'sharedControls';
  controls.setAttribute('show-reset', 'true');
  controls.setAttribute('show-autorun', 'false');
  document.getElementById('psiTabs').prepend(controls);
  const themeStyle = document.createElement('style');
  themeStyle.textContent = `:host-context(.qontic-light) .qontic-speed { color: #526a77; }
    :host-context(.qontic-light) .qontic-speed output { color: #075c69; }
    :host-context(.qontic-light) .qontic-speed input { accent-color: #087487; }`;
  controls.shadowRoot.append(themeStyle);
  const core = document.getElementById('basics-container');
  core.prepend(document.getElementById('experiment-bar'));

  const advanced = document.createElement('div');
  advanced.id = 'analytical-advanced';
  core.after(advanced);
  for (const id of ['particle-parameter-container', 'detector-parameter-container']) {
    advanced.append(document.getElementById(id));
  }
  // Keep the engine's unit conversion controls, but present units as quiet text.
  advanced.querySelectorAll('select[id$="-units"]').forEach(select => {
    select.hidden = true;
    const unit = document.createElement('span');
    unit.className = 'analytical-unit';
    const syncUnit = () => {
      unit.textContent = select.selectedOptions[0]?.textContent.trim() || '';
      unit.hidden = !unit.textContent;
    };
    select.after(unit);
    select.addEventListener('change', syncUnit);
    syncUnit();
  });
  // Keep one visible copy of each control, preserving the original input IDs.
  // The wave quantity selector belongs with the main experiment controls.
  // Reuse the original inputs and color actions in a single readable layer list.
  const displayPanel = document.getElementById('graphics-parameter-container');
  const layerTable = displayPanel.querySelector('table');
  const layers = document.createElement('div');
  layers.className = 'analytical-layers';
  layerTable.before(layers);
  for (const [id, name, colorId] of [
    ['plot_wave', 'Wave', 'openPaletteBtn'],
    ['plot_palette', 'Color scale', null],
    ['hit_prob', 'Probability curve', 'prob-color'],
    ['plot_hits', 'Screen hits', 'hit-color'],
    ['plot_sensor', 'Sensor band', 'sensor-color'],
    ['plot_trajectories', 'Trajectories', 'traj-color'],
    ['plot_particles', 'Particles', 'part-color'],
    ['plot_screen', 'Slit wall', 'screen-color'],
    ['plot_detector', 'Detector', 'detector-color'],
    ['plot_scales', 'Distance scales', 'scale-color'],
  ]) {
    const input = document.getElementById(id);
    const oldLabel = input.closest('label');
    const row = document.createElement('div');
    row.className = 'analytical-layer' + (input.closest('.bohmian-only') ? ' bohmian-only' : '');
    if (input.closest('.bohmian-only')) row.style.display = input.closest('.bohmian-only').style.display;
    const label = document.createElement('label');
    label.htmlFor = id + '-opacity';
    label.title = oldLabel.dataset.tip || name;
    // Keep engine visibility endpoints, but make opacity the visible control.
    input.hidden = true;
    if (!Number.isFinite(displayOpacities[id])) {
      displayOpacities[id] = (input.checked || id === 'plot_particles' || id === 'plot_trajectories') ? 1 : 0;
    }
    if (id !== 'plot_particles' && id !== 'plot_trajectories') input.checked = true;
    label.textContent = name;
    const slider = document.createElement('input');
    slider.type = 'range'; slider.id = id + '-opacity';
    slider.min = '0'; slider.max = '100'; slider.step = '5';
    slider.value = Math.round(elementOpacity(id) * 100);
    slider.className = 'analytical-opacity-slider';
    slider.setAttribute('aria-label', name + ' opacity');
    const updateValue = () => {
      const value = Number(slider.value);
      slider.title = name + ': ' + value + '% opacity (0 hides)';
      slider.setAttribute('aria-valuetext', value === 0 ? 'Hidden' : value + '% opacity');
      row.classList.toggle('is-transparent', value === 0);
      if (id === 'plot_palette') {
        for (const element of document.querySelectorAll('#paletteRangeSlider, #waveRangeLabel')) {
          element.style.opacity = value / 100;
          element.style.pointerEvents = value === 0 ? 'none' : '';
        }
      }
    };
    slider.addEventListener('input', () => {
      displayOpacities[id] = Number(slider.value) / 100;
      updateValue();
      renderSetupFlag = 1;
      invalidateWaveCache();
      lastCycleIndex = -1;
      if (!isAnimating) drawSystem(currentCycleIndex);
    });
    slider.addEventListener('change', saveSimulationState);
    updateValue();
    row.append(input, label, slider);
    if (colorId) {
      const color = document.getElementById(colorId);
      color.title = colorId === 'openPaletteBtn' ? 'Choose wave palette' : 'Choose ' + name.toLowerCase() + ' color';
      color.setAttribute('aria-label', color.title);
      if (color.tagName === 'CANVAS') {
        const paletteButton = document.createElement('button');
        paletteButton.type = 'button';
        paletteButton.className = 'analytical-palette-button';
        paletteButton.setAttribute('aria-label', color.title);
        paletteButton.title = color.title;
        paletteButton.append(color);
        paletteButton.addEventListener('click', event => { if (event.target !== color) color.click(); });
        row.append(paletteButton);
      } else {
        color.type = 'button';
        row.append(color);
      }
    }
    layers.append(row);
  }
  layerTable.remove();
  document.getElementById('waveCanvas').style.display = '';
  sensorWidth = 30;
  // Browser zoom supplies consistent sizing across controls and canvas.
  displayPanel.querySelector('#fontTarget').parentElement.parentElement.hidden = true;
  document.getElementById('opacity-box').hidden = true;
  invalidateWaveCache();
  renderSetupFlag = 1;
  lastCycleIndex = -1;
  if (!isAnimating) drawSystem(currentCycleIndex);

  const panels = {core, advanced, display: document.getElementById('graphics-parameter-container')};
  const showControls = name => {
    Object.entries(panels).forEach(([key, panel]) => { panel.hidden = key !== name; });
    document.body.classList.toggle('show-advanced', name === 'advanced');
  };
  controls.addEventListener('qontic:tab', event => showControls(event.detail.tab));
  showControls('core');

  const modeMap = {cpn: 'copenhagen', pw: 'bohmian', mw: 'manyworlds'};
  const reverseModes = {copenhagen: 'cpn', bohmian: 'pw', manyworlds: 'mw'};
  const setAttribute = (key, value) => {
    if (controls.getAttribute(key) !== String(value)) controls.setAttribute(key, String(value));
  };
  const sync = () => {
    setAttribute('interpretation', reverseModes[interpretation]);
    setAttribute('running', isAnimating);
    setAttribute('speed', $('#animationStep-group')[0].getValueInFirstUnit());
    setAttribute('theme', document.documentElement.getAttribute('data-theme') || 'dark');
    setAttribute('accent', document.documentElement.getAttribute('data-theme') === 'light' ? '#087487' : '#55d8e6');
    setAttribute('show-interpretation', !viewLocked && !controls.closest('.qontic-expanded-dialog'));
    const slider = controls.shadowRoot.querySelector('.qontic-speed input');
    slider.min = document.getElementById('animationStep').min;
    slider.max = document.getElementById('animationStep').max;
    slider.step = document.getElementById('animationStep').step;
    slider.value = controls.getAttribute('speed');
    slider.setAttribute('aria-label', 'Simulation speed');
  };
  controls.addEventListener('qontic:interpretation', event => { changeInterpretation(modeMap[event.detail.interpretation]); sync(); });
  for (const action of ['start', 'stop']) controls.addEventListener('qontic:' + action, () => {
    if ((action === 'start') !== isAnimating) $('#startButton').trigger('click');
    sync();
  });
  $('#resetButton').on('click.template', () => {
    $('#nhits, #shownParticles, #systemTime').text('0');
    sync();
  });
  controls.addEventListener('qontic:reset', () => { $('#resetButton').trigger('click'); });
  controls.addEventListener('qontic:speed', event => {
    $('#animationStep').val(event.detail.speed).trigger('input').trigger('change');
    sync();
  });
  controls.addEventListener('qontic:theme', event => {
    if (document.documentElement.getAttribute('data-theme') !== event.detail.theme) toggleTheme();
    sync();
  });
  // Prevent typing/arrow/space events inside shadow controls from activating
  // the legacy document shortcuts as though the user had clicked the canvas.
  controls.addEventListener('keydown', event => event.stopPropagation());
  for (const id of ['startButton', 'toggleView']) new MutationObserver(sync).observe(document.getElementById(id), {childList: true});
  new MutationObserver(sync).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
  $('#animationStep, #animationStep-input').on('input.template change.template', sync);
  sync();

  mountQonticShell({
    title: 'Double Slit', compactHeader: true, navigation: 'breadcrumbs',
    version: `Analytical double slit · Version ${APP_RELEASE.version} · ${APP_RELEASE.date}`,
    homeHref: '../../../index.html',
  });
  document.body.classList.add('analytical-template');
  syncPage();
  enableResizableSidebar({
    panel: document.getElementById('leftPanel'),
    container: document.querySelector('.main-container'),
    storageKey: 'qontic-double-slit-sidebar-width',
    minWidth: 320,
  });

  // Use the same preferred sidebar width when bounding the whole desktop
  // arrangement, so spare space stays outside the controls-and-canvas group.
  const sidebar = document.getElementById('leftPanel');
  const layout = document.querySelector('.main-container');
  const syncLayoutWidth = () => layout.style.setProperty('--qontic-sidebar-width',
    sidebar.style.getPropertyValue('--qontic-sidebar-width') || '340px');
  new MutationObserver(syncLayoutWidth).observe(sidebar, {attributes: true, attributeFilter: ['style']});
  syncLayoutWidth();

  // On phones, keep playback and the experiment first; statistics follow
  // the canvas instead of pushing it beneath a tall sidebar.
  const phone = matchMedia('(max-width: 600px)');
  const info = document.getElementById('Info');
  const placeStatistics = () => {
    if (phone.matches) document.getElementById('canvas-wrapper').after(info);
    else sidebar.append(info);
  };
  phone.addEventListener('change', placeStatistics);
  placeStatistics();

  // Match actual canvas pixels to the displayed size. Geometry and time step
  // in world units, all detections, and in-flight trajectories are preserved.
  const container = document.getElementById('canvas-container');
  window.qonticMWBranches = mountMWBranching({host:container,controls:core,isMW:()=>interpretation==='manyworlds',isRunning:()=>isAnimating});
  core.append(document.getElementById('resetDefaultsButton'));
  const resizeCanvas = () => {
    const width = Math.round(container.clientWidth), height = Math.round(container.clientHeight);
    if (width < 100 || height < 100 || (canvas.width === width && canvas.height === height)) return;
    const previousDeltaT = deltaT, previousStepsPerCycle = stepsPerCycle;
    for (const id of ['setupCanvas', 'waveCanvas', 'partCanvas']) {
      const layer = document.getElementById(id);
      layer.width = width; layer.height = height;
    }
    // Reuse the GPU context/resources instead of creating a context per resize.
    if (waveGlCanvas) { waveGlCanvas.width = width; waveGlCanvas.height = height; }
    invalidateAllCaches();
    setupGeo(false);
    deltaT = previousDeltaT;
    stepsPerCycle = previousStepsPerCycle;
    renderSetupFlag = 1;
    if (!isAnimating) drawSystem(currentCycleIndex);
  };
  let resizeFrame;
  new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(resizeCanvas);
  }).observe(container);
  resizeCanvas();
  document.getElementById('screenshotButton').parentElement.hidden = true;
  let previewScreenHeight=null;
  const scale = mountDistanceScale({
    host:container,storageKey:'qontic-double-slit-scale-position',
    getUnitsPerPixel:()=>({x:worldCanvasDx/Math.max(1,container.clientWidth),y:(previewScreenHeight??screenHeight)/Math.max(1,container.clientHeight)}),
    format:value=>value>=1e6?(value/1e6).toPrecision(3)+' mm':value>=1e3?(value/1e3).toPrecision(3)+' µm':Number(value.toPrecision(3))+' nm'
  });
  let lastScaleOpacity=elementOpacity('plot_scales')||1;
  window.qonticScaleOverlay={previewHeight:height=>{previewScreenHeight=height;scale.update();},update:()=>{scale.setOpacity(elementOpacity('plot_scales'));media?.syncScale();}};
  const rangeHost=document.getElementById('paletteRangeSlider');
  const rangePanel=document.createElement('div');rangePanel.className='qontic-range-panel';
  rangePanel.style.left='0px';rangePanel.style.bottom='0px';container.append(rangePanel);
  for(const id of ['paletteScaleCanvas','paletteScaleCanvas1','paletteScaleCanvas2']){
    const palette=document.getElementById(id);rangePanel.append(palette);
    palette.style.left='78px';
    palette.style.bottom=id==='paletteScaleCanvas1'?'100px':'0px';
  }
  rangePanel.append(rangeHost);rangeHost.style.left='0px';rangeHost.style.bottom='8px';

  document.getElementById('waveRangeLabel').hidden=true;
  window.qonticWaveRangeControl=mountValueRange({
    host:rangeHost,label:'wave display range',movableContainer:rangePanel,storageKey:'qontic-double-slit-range-position-v2.86-left',
    format:value=>formatWaveRangeValue(window.qonticPacketEngine?.enabled && $('#waveFunctionOption').val()==='Phase'?2*value-1:useWebGLWave && $('#waveFunctionOption').val()==='Phase'?value*2*Math.PI:(useWebGLWave || window.qonticPacketEngine?.enabled) && $('#waveFunctionOption').val()==='LogPsi2'?(value*15-15)/Math.log(10):value),
    onChange:({lower,upper})=>{
      waveRangeUserMin=lower;waveRangeUserMax=upper;waveRangeLockedByUser=true;
      lastCycleIndex=-1;
      if(!isAnimating)renderWaveFunction(currentCycleIndex);
    }
  });
  updateWaveRangeSliderUI();
  let media;
  media=mountQonticMedia({
    stage: document.getElementById('canvas-wrapper'), controls,
    filename: 'double-slit', headerTools: false, rangeControl:window.qonticWaveRangeControl,
    scaleControl:{getVisible:()=>elementOpacity('plot_scales')>0,setVisible:shown=>{if(!shown)lastScaleOpacity=elementOpacity('plot_scales')||1;const slider=document.getElementById('plot_scales-opacity');slider.value=shown?lastScaleOpacity*100:0;slider.dispatchEvent(new Event('input',{bubbles:true}));slider.dispatchEvent(new Event('change',{bubbles:true}));}},
    getShareUrl: () => location.href.split('#')[0] + buildUrlHash(),
    getCanvases: () => [...container.querySelectorAll('canvas')].sort((a,b) =>
      (Number(getComputedStyle(a).zIndex) || 0) - (Number(getComputedStyle(b).zIndex) || 0)),
    beginRecording: () => {
      const wasRunning = isAnimating;
      if (!wasRunning) $('#startButton').trigger('click');
      sync();
      return wasRunning;
    },
    endRecording: wasRunning => {
      if (!wasRunning && isAnimating) $('#startButton').trigger('click');
      sync();
    },
  });
  // Keep the finite detector model's branch count visible in expanded MW view.
  const worldCount = document.createElement('div');
  worldCount.className = 'expanded-world-count';
  worldCount.title = document.getElementById('infoBranchCount').closest('tr').dataset.tip;
  const syncWorldCount = () => {
    worldCount.hidden = interpretation !== 'manyworlds';
    const exponent = logNBranches.toFixed(0);
    const html = 'Branches: ' + (logNBranches > 0 ? `10<sup>${exponent}</sup>` : '1');
    if (worldCount.innerHTML !== html) worldCount.innerHTML = html;
    worldCount.setAttribute('aria-label', logNBranches > 0 ? `Branches: 10 to the power of ${exponent}` : 'Branches: 1');
  };
  container.append(worldCount);
  const worldCountObserver = new MutationObserver(syncWorldCount);
  worldCountObserver.observe(document.getElementById('nhits'), {childList:true,subtree:true,characterData:true});
  worldCountObserver.observe(document.getElementById('view-label'), {childList:true,subtree:true,characterData:true});
  worldCountObserver.observe(controls, {attributes:true,attributeFilter:['interpretation']});
  syncWorldCount();
  mountExpandedResize(container);
  renderSetupFlag=1;window.qonticScaleOverlay.update();if(!isAnimating)drawSystem(currentCycleIndex);
  document.querySelector('#canvas-wrapper .qontic-media-toolbar').prepend(document.getElementById('view-label'));
  window.qonticPacketEngine=mountPacketEngine({core,advanced});
  // Capture shortcuts before the shadow controls stop propagation. Respect
  // editable fields; Space always controls playback, even with toolbar focus.
  document.addEventListener('keydown', event => {
    if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||event.isComposing)return;
    const target=event.composedPath()[0];
    if(target?.matches?.('input,select,textarea')||target?.isContentEditable)return;
    const actions={Space:()=>document.getElementById('startButton').click(),
      KeyR:()=>document.getElementById('resetButton').click(),
      KeyS:()=>document.querySelector('#canvas-wrapper .qontic-media-toolbar button[aria-label="Screenshot"]')?.click(),
      KeyV:()=>{if(!viewLocked)document.getElementById('toggleView').click();},
      KeyW:()=>{const select=document.getElementById('waveFunctionOption');select.selectedIndex=(select.selectedIndex+1)%select.options.length;$(select).trigger('change');}};
    if(!actions[event.code])return;event.preventDefault();event.stopImmediatePropagation();if(!event.repeat)actions[event.code]();
  },true);
});
