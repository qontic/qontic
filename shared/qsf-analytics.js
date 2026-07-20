/*
 * Q-Ontic / QSF Google Analytics telemetry helper.
 *
 * Tracks coarse educational interaction choices:
 *   - which demo was opened
 *   - which representational view / interpretation is selected
 *   - which controls are changed
 *   - a compact session summary when the user leaves
 *
 * It does not collect names, emails, free text, or student identifiers.
 */
(function () {
  'use strict';
  document.documentElement.dataset.qsfAnalyticsScriptLoaded = 'true';

  const MEASUREMENT_ID = 'G-ZWF6YQM0YV';
  const EVENT_DEBOUNCE_MS = 250;
  const pendingEvents = [];
  const lastEventTimes = new Map();

  const telemetry = {
    demoId: inferDemoId(),
    demoTitle: document.title || inferDemoId(),
    sessionStartMs: Date.now(),
    lastView: '',
    lastViewStartedMs: Date.now(),
    viewTimeMs: {},
    interpretationSwitches: 0,
    controlsUsed: 0,
    summarySent: false
  };

  function inferDemoId() {
    const parts = window.location.pathname
      .replace(/\/$/, '')
      .split('/')
      .filter(Boolean);

    if (parts.length === 0) return 'qontic-home';
    const leaf = parts[parts.length - 1];
    if (leaf === 'index.html' && parts.length > 1) return parts[parts.length - 2];
    return leaf.replace(/\.html$/i, '') || 'qsf-demo';
  }

  function hasGtag() {
    return typeof window.gtag === 'function';
  }

  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];

    if (!hasGtag()) {
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
    }

    if (!document.querySelector('script[data-qsf-gtag="true"]') &&
        !document.querySelector('script[src*="googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID + '"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
      script.dataset.qsfGtag = 'true';
      script.onload = flushPendingEvents;
      document.head.appendChild(script);
    }

    window.gtag('config', MEASUREMENT_ID);
    window.setTimeout(flushPendingEvents, 0);
  }

  function cleanValue(value) {
    if (value === null || value === undefined) return '';
    return String(value).trim().slice(0, 100);
  }

  function normalizeView(value) {
    const raw = cleanValue(value).toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
    if (raw.includes('pilot') || raw.includes('bohm')) return 'pilot_wave';
    if (raw.includes('many')) return 'many_worlds';
    if (raw.includes('collapse') || raw.includes('copenhagen')) return 'collapse';
    return raw || 'unknown';
  }

  function currentView() {
    return normalizeView(window.interpretation || document.getElementById('toggleView')?.textContent || document.getElementById('view-label')?.textContent);
  }

  function basePayload(params) {
    return Object.assign({
      demo_id: telemetry.demoId,
      demo_title: telemetry.demoTitle,
      page_path: window.location.pathname,
      send_to: MEASUREMENT_ID
    }, params || {});
  }

  function sendEvent(eventName, params) {
    const payload = basePayload(params);
    const debounceKey = eventName + ':' + JSON.stringify(payload);
    const now = Date.now();
    if ((lastEventTimes.get(debounceKey) || 0) + EVENT_DEBOUNCE_MS > now) return;
    lastEventTimes.set(debounceKey, now);

    if (!hasGtag()) {
      pendingEvents.push([eventName, payload]);
      return;
    }

    window.gtag('event', eventName, payload);
  }

  function flushPendingEvents() {
    if (!hasGtag()) return;
    while (pendingEvents.length > 0) {
      const item = pendingEvents.shift();
      window.gtag('event', item[0], item[1]);
    }
  }

  function addViewTime(viewName) {
    const view = normalizeView(viewName || telemetry.lastView || currentView());
    const now = Date.now();
    const elapsed = Math.max(0, now - telemetry.lastViewStartedMs);
    telemetry.viewTimeMs[view] = (telemetry.viewTimeMs[view] || 0) + elapsed;
    telemetry.lastViewStartedMs = now;
  }

  function getControlLabel(el) {
    if (!el) return '';
    const explicitLabel = el.getAttribute('data-analytics-label');
    if (explicitLabel) return explicitLabel;

    if (el.id) {
      const label = document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
      if (label) return cleanValue(label.textContent);
    }

    const parentLabel = el.closest && el.closest('label');
    if (parentLabel) return cleanValue(parentLabel.textContent);

    return cleanValue(el.id || el.name || el.className || el.tagName);
  }

  function getControlValue(el) {
    if (!el) return '';
    if (el.type === 'checkbox') return el.checked ? 'checked' : 'unchecked';
    if (el.type === 'radio') return el.checked ? cleanValue(el.value) : '';
    if (el.tagName === 'BUTTON') return cleanValue(el.textContent || el.value);
    return cleanValue(el.value);
  }

  function getState(reason) {
    return {
      reason: cleanValue(reason || 'state_snapshot'),
      interpretation: currentView(),
      view_label: cleanValue(document.getElementById('view-label')?.textContent),
      slits: cleanValue(document.getElementById('toggleSlits')?.textContent),
      which_path: cleanValue(document.getElementById('toggleWhichPath')?.textContent),
      wave_display: cleanValue(document.getElementById('waveFunctionOption')?.value || document.getElementById('basicsWaveFunctionOption')?.value),
      particle_type: cleanValue(document.getElementById('particleType')?.value),
      source: cleanValue(document.getElementById('sourceOption')?.value)
    };
  }

  function trackCurrentState(reason) {
    sendEvent('demo_state', getState(reason));
  }

  function handleInterpretationChange(reason) {
    const newView = currentView();
    const oldView = telemetry.lastView || newView;

    if (newView !== oldView) {
      addViewTime(oldView);
      telemetry.interpretationSwitches += 1;
      sendEvent('interpretation_change', {
        reason: cleanValue(reason || 'view_change'),
        previous_interpretation: oldView,
        interpretation: newView,
        switch_index: telemetry.interpretationSwitches
      });
      telemetry.lastView = newView;
      telemetry.lastViewStartedMs = Date.now();
    }
  }

  function trackControl(el, action) {
    if (!el) return;
    telemetry.controlsUsed += 1;

    if (el.id === 'toggleView') {
      handleInterpretationChange('toggleView');
    }

    sendEvent('control_change', {
      action: cleanValue(action || el.type || el.tagName.toLowerCase()),
      control_id: cleanValue(el.id),
      control_label: getControlLabel(el),
      control_value: getControlValue(el),
      interpretation: currentView(),
      control_count: telemetry.controlsUsed
    });

    if (el.id === 'toggleView' || el.id === 'toggleSlits' || el.id === 'toggleWhichPath' || el.id === 'waveFunctionOption' || el.id === 'basicsWaveFunctionOption') {
      window.setTimeout(function () { trackCurrentState(el.id); }, 0);
    }
  }

  function attachControlListeners() {
    const importantIds = [
      'toggleView',
      'toggleSlits',
      'toggleWhichPath',
      'waveFunctionOption',
      'basicsWaveFunctionOption',
      'sourceOption',
      'particleType',
      'wave-continous',
      'onlyWallMode',
      'showWaveSlit1',
      'showWaveSlit2',
      'plot_wave',
      'plot_particles',
      'plot_trajectories',
      'plot_hits',
      'plot_sensor',
      'plot_detector',
      'plot_screen'
    ];

    importantIds.forEach(function (id) {
      const el = document.getElementById(id);
      if (!el || el.dataset.qsfAnalyticsAttached === 'true') return;
      el.dataset.qsfAnalyticsAttached = 'true';

      if (el.tagName === 'BUTTON') {
        el.addEventListener('click', function () {
          window.setTimeout(function () { trackControl(el, 'click'); }, 0);
        });
      } else {
        el.addEventListener('change', function () {
          trackControl(el, 'change');
        });
      }
    });

    document.querySelectorAll('.view-link[data-view]').forEach(function (link) {
      if (link.dataset.qsfAnalyticsAttached === 'true') return;
      link.dataset.qsfAnalyticsAttached = 'true';
      link.addEventListener('click', function () {
        const oldView = telemetry.lastView || currentView();
        window.setTimeout(function () {
          handleInterpretationChange('view_link');
          sendEvent('view_link_click', {
            selected_interpretation: normalizeView(link.dataset.view),
            previous_interpretation: oldView,
            link_text: cleanValue(link.textContent)
          });
          trackCurrentState('view_link');
        }, 0);
      });
    });
  }

  function sendSessionSummary() {
    if (telemetry.summarySent) return;
    telemetry.summarySent = true;

    addViewTime(telemetry.lastView || currentView());

    const totalMs = Math.max(0, Date.now() - telemetry.sessionStartMs);
    const payload = {
      total_time_sec: Math.round(totalMs / 1000),
      time_collapse_sec: Math.round((telemetry.viewTimeMs.collapse || 0) / 1000),
      time_pilot_wave_sec: Math.round((telemetry.viewTimeMs.pilot_wave || 0) / 1000),
      time_many_worlds_sec: Math.round((telemetry.viewTimeMs.many_worlds || 0) / 1000),
      interpretation_switches: telemetry.interpretationSwitches,
      controls_used: telemetry.controlsUsed,
      final_interpretation: currentView()
    };

    sendEvent('session_summary', payload);
    flushPendingEvents();
  }

  function init() {
    document.documentElement.dataset.qsfAnalyticsInitStarted = 'true';
    try {
      ensureGtag();
    } catch (error) {
      document.documentElement.dataset.qsfAnalyticsError = cleanValue(error && error.message ? error.message : error);
      console.error('Q-Ontic Analytics initialization failed', error);
      return;
    }
    document.documentElement.dataset.qsfAnalyticsReady = 'true';
    telemetry.lastView = currentView();
    telemetry.lastViewStartedMs = Date.now();

    sendEvent('demo_open', {
      interpretation: telemetry.lastView
    });
    document.documentElement.dataset.qsfAnalyticsOpenSent = 'true';
    attachControlListeners();
    window.setTimeout(function () { trackCurrentState('initial'); }, 500);

    window.addEventListener('pagehide', sendSessionSummary);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') sendSessionSummary();
    });
  }

  window.QSFAnalytics = {
    trackEvent: sendEvent,
    trackCurrentState: trackCurrentState,
    attachControlListeners: attachControlListeners,
    sendSessionSummary: sendSessionSummary
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
