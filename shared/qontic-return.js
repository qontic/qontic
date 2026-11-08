/* Same-site return navigation, independent of simulation startup. */
(() => {
  if (window.self !== window.top) return;
  const params = new URLSearchParams(location.search);
  if (params.get('embed') === '1' || params.get('renderer') === 'video') return;
  const scriptURL = document.currentScript?.src;
  if (!scriptURL) return;
  const root = new URL('../', scriptURL);
  const here = new URL(location.href);
  const isResource = url => ['apps/', 'notebooks/', 'modules/'].some(p => url.pathname.startsWith(root.pathname + p));
  function safeURL(value) {
    if (!value) return null;
    try {
      const url = new URL(value, here);
      if (!['http:', 'https:'].includes(url.protocol) || url.origin !== here.origin || !url.pathname.startsWith(root.pathname)) return null;
      if (url.pathname === here.pathname && url.search === here.search) return null;
      return url;
    } catch (_) { return null; }
  }
  function fallback() {
    const url = new URL('index.html', root);
    const path = here.pathname.slice(root.pathname.length);
    url.searchParams.set('tab', path.startsWith('notebooks/') ? 'notebooks' : path.startsWith('apps/') ? 'apps' : 'modules');
    return url;
  }
  const returnURL = safeURL(params.get('returnTo')) || safeURL(document.referrer) || fallback();
  function isBack(link) {
    if (link.id === 'qontic-context-back' || link.id === 'catalog-back' || link.id === 'qontic-back-home') return true;
    if (link.closest('.notebook-footer-nav') && link.classList.contains('footer-nav-button-main')) return true;
    return /^(?:←\s*)?back(?:\s|$)/i.test(link.textContent.trim()) || link.matches('header.applet-toolbar a') && link.textContent.trim() === 'Notebook';
  }
  let updating = false;
  function updateBackLinks() {
    if (updating || !isResource(here)) return;
    updating = true;
    let existing = false;
    document.querySelectorAll('a[href]').forEach(link => {
      if (!isBack(link)) return;
      existing = existing || link.id !== 'qontic-context-back' && link.getClientRects().length > 0 && getComputedStyle(link).visibility !== 'hidden';
      if (link.href !== returnURL.href) link.href = returnURL.href;
      if (link.textContent.trim() === 'Notebook' || /back to main page/i.test(link.textContent)) link.textContent = '← Back';
      if (link.getAttribute('aria-label') !== 'Return to the page that opened this resource') link.setAttribute('aria-label', 'Return to the page that opened this resource');
      if (!link.dataset.qonticReturn) link.dataset.qonticReturn = 'true';
    });
    const trail = document.querySelector('.qontic-breadcrumbs ol');
    let link = document.getElementById('qontic-context-back');
    if (trail && (!link || !trail.contains(link))) {
      link?.remove();
      const item = document.createElement('li');
      link = document.createElement('a');link.id='qontic-context-back';link.href=returnURL.href;link.textContent='← Back';link.dataset.qonticReturn='true';
      item.append(link);trail.prepend(item);
    } else if (!trail && existing && link) {
      link.remove();
    } else if (!trail && !existing && !link) {
      link=document.createElement('a');link.id='qontic-context-back';link.href=returnURL.href;link.textContent='← Back';link.dataset.qonticReturn='true';
      link.style.cssText='position:fixed;bottom:10px;left:10px;z-index:1000;padding:7px 12px;border:1px solid #7895a8;border-radius:7px;background:#102839;color:#fff;text-decoration:none;font:600 13px system-ui;';
      document.body.append(link);
    }
    updating = false;
  }
  function carryParent(event) {
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || isBack(link)) return;
    let target;
    try { target = new URL(link.href, here); } catch (_) { return; }
    if (target.origin !== here.origin || !isResource(target) || target.pathname === here.pathname && target.search === here.search) return;
    // Current URL includes its own returnTo, preserving a finite notebook -> app -> notebook chain.
    target.searchParams.set('returnTo', location.href);
    link.href = target.href;
  }
  document.addEventListener('click', carryParent, true);
  document.addEventListener('auxclick', carryParent, true);
  function init() {
    updateBackLinks();
    let scheduled=false;
    new MutationObserver(() => {
      if (scheduled) return;scheduled=true;
      queueMicrotask(() => {scheduled=false;updateBackLinks();});
    }).observe(document.body,{childList:true,subtree:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
})();
