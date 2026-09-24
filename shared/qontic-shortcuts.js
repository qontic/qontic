const isEditable = target => target?.matches?.('input, select, textarea, [contenteditable="true"]')
  || target?.isContentEditable;

/**
 * Mount the common Q-Ontic keyboard contract without coupling it to an engine.
 * Apps provide handlers and may add model-specific keys through `additional`.
 */
export function mountQonticShortcuts({
  togglePlayback,
  reset,
  screenshot,
  additional = {},
  target = document,
  capture = true,
} = {}) {
  const actions = {
    ...(togglePlayback ? { Space: togglePlayback } : {}),
    ...(reset ? { KeyR: reset } : {}),
    ...(screenshot ? { KeyS: screenshot } : {}),
    ...additional,
  };

  const onKeydown = event => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    const origin = event.composedPath?.()[0] || event.target;
    if (isEditable(origin)) return;
    const action = actions[event.code];
    if (!action) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!event.repeat) action(event);
  };

  target.addEventListener('keydown', onKeydown, capture);
  return { destroy: () => target.removeEventListener('keydown', onKeydown, capture) };
}
