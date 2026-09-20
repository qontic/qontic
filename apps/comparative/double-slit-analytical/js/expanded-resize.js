// Display size is independent of the physical experiment and detector record.
export function mountExpandedResize(container) {
  const dialog = document.querySelector('.qontic-expanded-dialog');
  const storageKey = 'qontic-double-slit-expanded-size';
  let preferred = null, drag = null;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Number.isFinite(saved.width) && Number.isFinite(saved.height)
        && saved.width >= 100 && saved.height >= 100) preferred = saved;
  } catch (_) { /* Private browsing may disable storage. */ }
  const handle = document.createElement('button');
  handle.type = 'button';
  handle.className = 'expanded-canvas-resize';
  handle.setAttribute('aria-label', 'Resize expanded canvas');
  handle.title = 'Drag to resize · Shift: keep proportions · Double-click: fit · Arrow keys: resize';
  handle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M11 19l8-8M17 19l2-2"/></svg>';
  container.append(handle);
  const bounds = () => {
    const rect = dialog.getBoundingClientRect();
    const toolbar = dialog.querySelector('.qontic-media-toolbar').getBoundingClientRect();
    const controls = dialog.querySelector('qontic-controls').getBoundingClientRect();
    return {width: Math.max(1, rect.width - 16),
      height: Math.max(1, rect.bottom - 8 - Math.max(toolbar.bottom, controls.bottom) - 4)};
  };
  const apply = size => {
    const max = bounds();
    const width = Math.min(max.width, Math.max(Math.min(280, max.width), size.width));
    const height = Math.min(max.height, Math.max(Math.min(200, max.height), size.height));
    container.style.setProperty('--expanded-canvas-width', width + 'px');
    container.style.setProperty('--expanded-canvas-height', height + 'px');
    container.classList.add('has-expanded-size');
    return {width, height};
  };
  const save = () => {
    try {
      if (preferred) localStorage.setItem(storageKey, JSON.stringify(preferred));
      else localStorage.removeItem(storageKey);
    } catch (_) { /* Keep the size in memory when storage is unavailable. */ }
  };
  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault(); event.stopPropagation();
    const rect = container.getBoundingClientRect();
    drag = {x:event.clientX, y:event.clientY, width:rect.width, height:rect.height};
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', event => {
    if (!drag) return;
    event.preventDefault(); event.stopPropagation();
    // The canvas stays centered, so its corner moves by half the size change.
    let width = drag.width + 2 * (event.clientX - drag.x);
    let height = drag.height + 2 * (event.clientY - drag.y);
    if (event.shiftKey) {
      const max = bounds(), ratio = drag.width / drag.height;
      width = Math.min(Math.max(Math.min(280, max.width), width), max.width, max.height * ratio);
      height = width / ratio;
    }
    preferred = apply({width, height});
  });
  const finish = () => { if (drag) { drag = null; save(); } };
  handle.addEventListener('pointerup', finish);
  handle.addEventListener('pointercancel', finish);
  handle.addEventListener('lostpointercapture', finish);
  handle.addEventListener('dblclick', event => {
    event.preventDefault(); event.stopPropagation();
    preferred = null; container.classList.remove('has-expanded-size'); save();
  });
  handle.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation();
    const rect = container.getBoundingClientRect(), step = event.shiftKey ? 40 : 10;
    preferred = apply({width:rect.width + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0),
      height:rect.height + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0)});
    save();
  });
  const restore = () => { if (dialog.open && preferred) apply(preferred); };
  new MutationObserver(restore).observe(dialog, {attributes:true, attributeFilter:['open']});
  window.addEventListener('resize', restore);
}
