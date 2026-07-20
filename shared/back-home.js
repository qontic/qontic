(function () {
  const fallbackHref = '../../../index.html';

  function safeReturnHref() {
    const params = new URLSearchParams(window.location.search);
    const explicit = params.get('returnTo');

    if (explicit) {
      try {
        const url = new URL(explicit, window.location.href);
        if (url.origin === window.location.origin) return url.href;
      } catch (_) {}
    }

    if (document.referrer) {
      try {
        const referrer = new URL(document.referrer);
        if (referrer.origin === window.location.origin && referrer.href !== window.location.href) {
          return referrer.href;
        }
      } catch (_) {}
    }

    return fallbackHref;
  }

  function ensureThemeToggleLabels() {
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      if (!btn.querySelector('.theme-toggle-label')) {
        const span = document.createElement('span');
        span.className = 'theme-toggle-label';
        span.textContent = '';
        span.style.display = 'none';
        btn.appendChild(span);
      }
      if (!btn.querySelector('.material-icons')) {
        const icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.style.display = 'none';
        btn.insertBefore(icon, btn.firstChild);
      }
    });
  }

  function loadQSFAnalytics() {
    if (document.querySelector('script[data-qsf-analytics="true"]')) return;

    const currentScript = document.currentScript;
    const src = currentScript && currentScript.src ? currentScript.src : '';
    const base = src ? src.replace(/back-home\.js(?:\?.*)?$/, '') : '../../../shared/';

    const script = document.createElement('script');
    script.src = base + 'qsf-analytics.js';
    script.defer = true;
    script.dataset.qsfAnalytics = 'true';
    document.head.appendChild(script);
  }

  function init() {
    ensureThemeToggleLabels();
    loadQSFAnalytics();

    if (new URLSearchParams(window.location.search).get('embed') === '1') return;
    if (document.getElementById('qontic-back-home')) return;

    const link = document.createElement('a');
    link.id = 'qontic-back-home';
    link.className = 'qontic-back-home';
    link.href = safeReturnHref();
    link.textContent = '← Back';
    link.setAttribute('aria-label', 'Return to the page that opened this resource');
    document.body.appendChild(link);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();