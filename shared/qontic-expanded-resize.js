/** Optional display-only resizing for a canvas inside the shared expanded dialog. */
export function mountExpandedResize({
  container,
  dialog = document.querySelector('.qontic-expanded-dialog'),
  storageKey,
  minWidth = 280,
  minHeight = 200,
} = {}) {
  if (!container || !dialog || container.querySelector(':scope > .qontic-expanded-resize')) return null;
  let preferred = null;
  let drag = null;

  if (storageKey) {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && Number.isFinite(saved.width) && Number.isFinite(saved.height)
          && saved.width >= 100 && saved.height >= 100) preferred = saved;
    } catch (_) { /* Storage is optional. */ }
  }

  const handle = document.createElement('button');
  handle.type = 'button';
  handle.className = 'qontic-expanded-resize';
  handle.setAttribute('aria-label', 'Resize expanded canvas');
  handle.title = 'Drag to resize · Shift: keep proportions · Double-click: fit · Arrow keys: resize';
  handle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M11 19l8-8M17 19l2-2"/></svg>';
  container.append(handle);

  const bounds = () => {
    const rect = dialog.getBoundingClientRect();
    const tops = [...dialog.children]
      .filter(item => item !== container && !item.contains(container))
      .map(item => item.getBoundingClientRect().bottom)
      .filter(Number.isFinite);
    return {
      width: Math.max(1, rect.width - 16),
      height: Math.max(1, rect.bottom - 12 - Math.max(rect.top, ...tops)),
    };
  };

  const apply = size => {
    const max = bounds();
    const width = Math.min(max.width, Math.max(Math.min(minWidth, max.width), size.width));
    const height = Math.min(max.height, Math.max(Math.min(minHeight, max.height), size.height));
    container.style.setProperty('--qontic-expanded-width', `${width}px`);
    container.style.setProperty('--qontic-expanded-height', `${height}px`);
    container.classList.add('qontic-expanded-custom-size');
    return { width, height };
  };

  const save = () => {
    if (!storageKey) return;
    try {
      if (preferred) localStorage.setItem(storageKey, JSON.stringify(preferred));
      else localStorage.removeItem(storageKey);
    } catch (_) { /* Keep the size in memory when storage is unavailable. */ }
  };

  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !dialog.open) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = container.getBoundingClientRect();
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, width: rect.width, height: rect.height };
    handle.setPointerCapture(event.pointerId);
  });

  handle.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    event.preventDefault();
    let width = drag.width + 2 * (event.clientX - drag.x);
    let height = drag.height + 2 * (event.clientY - drag.y);
    if (event.shiftKey) {
      const max = bounds();
      const ratio = drag.width / drag.height;
      width = Math.min(Math.max(Math.min(minWidth, max.width), width), max.width, max.height * ratio);
      height = width / ratio;
    }
    preferred = apply({ width, height });
  });

  const finish = event => {
    if (!drag || (event?.pointerId != null && event.pointerId !== drag.id)) return;
    drag = null;
    save();
  };
  handle.addEventListener('pointerup', finish);
  handle.addEventListener('pointercancel', finish);
  handle.addEventListener('lostpointercapture', finish);
  handle.addEventListener('dblclick', event => {
    event.preventDefault();
    event.stopPropagation();
    preferred = null;
    container.classList.remove('qontic-expanded-custom-size');
    save();
  });
  handle.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = container.getBoundingClientRect();
    const step = event.shiftKey ? 40 : 10;
    preferred = apply({
      width: rect.width + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0),
      height: rect.height + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0),
    });
    save();
  });

  const restore = () => { if (dialog.open && preferred) apply(preferred); };
  const observer = new MutationObserver(restore);
  observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  window.addEventListener('resize', restore);

  return {
    reset() { preferred = null; container.classList.remove('qontic-expanded-custom-size'); save(); },
    destroy() { observer.disconnect(); window.removeEventListener('resize', restore); handle.remove(); },
  };
}
