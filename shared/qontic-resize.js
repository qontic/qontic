// Opt-in shared template behavior: apps retain ownership of their simulation.
export function enableResizableSidebar({panel, container, storageKey, minWidth = 300, maxWidth = 600, minStageWidth = 320, breakpoint = 1000}) {
  if (!panel || !container || panel.dataset.qonticResizable) return;
  panel.dataset.qonticResizable = 'true';
  panel.classList.add('qontic-resizable-sidebar');
  const handle = document.createElement('div');
  handle.className = 'qontic-sidebar-divider';
  handle.tabIndex = 0;
  handle.setAttribute('role', 'separator');
  handle.setAttribute('aria-label', 'Resize control panel');
  handle.setAttribute('aria-orientation', 'vertical');
  handle.title = 'Drag to resize controls. Arrow keys adjust; double-click restores the default width.';
  panel.append(handle);
  const desktop = matchMedia(`(min-width: ${breakpoint + 1}px)`);
  let preferredWidth = 340;
  try {
    const saved = Number(localStorage.getItem(storageKey));
    if (Number.isFinite(saved) && saved >= minWidth) preferredWidth = saved;
  } catch (_) { /* Resizing still works when storage is unavailable. */ }
  const limit = () => Math.max(minWidth, Math.min(maxWidth, container.clientWidth - minStageWidth - 18));
  const apply = () => {
    handle.hidden = !desktop.matches;
    if (!desktop.matches) return;
    const width = Math.round(Math.max(minWidth, Math.min(limit(), preferredWidth)));
    panel.style.setProperty('--qontic-sidebar-width', `${width}px`);
    handle.setAttribute('aria-valuemin', minWidth);
    handle.setAttribute('aria-valuemax', limit());
    handle.setAttribute('aria-valuenow', width);
    handle.setAttribute('aria-valuetext', `${width} pixels`);
  };
  const save = () => { try { localStorage.setItem(storageKey, preferredWidth); } catch (_) {} };
  let drag = null;
  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !desktop.matches) return;
    event.preventDefault();
    drag = {id: event.pointerId, x: event.clientX, width: panel.getBoundingClientRect().width};
    handle.setPointerCapture(event.pointerId);
    document.body.classList.add('qontic-sidebar-dragging');
  });
  handle.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    preferredWidth = Math.max(minWidth, Math.min(limit(), drag.width + event.clientX - drag.x));
    apply();
  });
  const finish = () => {
    if (!drag) return;
    drag = null;
    document.body.classList.remove('qontic-sidebar-dragging');
    save();
  };
  handle.addEventListener('pointerup', finish);
  handle.addEventListener('pointercancel', finish);
  handle.addEventListener('lostpointercapture', finish);
  handle.addEventListener('dblclick', () => { preferredWidth = 340; apply(); save(); });
  handle.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    preferredWidth = event.key === 'Home' ? minWidth : event.key === 'End' ? limit()
      : panel.getBoundingClientRect().width + (event.key === 'ArrowRight' ? 1 : -1) * (event.shiftKey ? 40 : 10);
    preferredWidth = Math.max(minWidth, Math.min(limit(), preferredWidth));
    apply(); save();
  });
  desktop.addEventListener('change', () => { finish(); apply(); });
  new ResizeObserver(apply).observe(container);
  apply();
}
