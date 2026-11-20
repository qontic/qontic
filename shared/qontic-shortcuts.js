const isEditable = target => target?.matches?.('input, select, textarea, [contenteditable="true"]')
  || target?.isContentEditable;
// Space on a control reached with the keyboard (Tab or arrow keys) presses that
// control (standard behaviour), so the play/pause shortcut must not take it. After
// a mouse click or tap the control keeps focus, and Space still toggles playback.
// (:focus-visible cannot tell these apart: any key press makes focus visible.)
let focusByKeyboard = false;
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => { focusByKeyboard = false; }, true);
  document.addEventListener('keydown', event => {
    if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) focusByKeyboard = true;
  }, true);
}
const isKeyboardControl = target => focusByKeyboard
  && target?.matches?.('button, a[href], summary, [role="button"], [role="tab"], [role="checkbox"], [role="switch"], [role="radio"]');

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
    if (event.code === 'Space' && isKeyboardControl(origin)) return;
    const action = actions[event.code];
    if (!action) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.code === 'Space') spaceTaken = true;
    if (!event.repeat) action(event);
  };
  // Buttons activate on Space key-up: when the shortcut took the key-down, also
  // swallow the key-up, so a mouse-focused button is not pressed as well.
  let spaceTaken = false;
  const onKeyup = event => {
    if (event.code !== 'Space' || !spaceTaken) return;
    spaceTaken = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  target.addEventListener('keydown', onKeydown, capture);
  target.addEventListener('keyup', onKeyup, capture);
  return { destroy: () => { target.removeEventListener('keydown', onKeydown, capture); target.removeEventListener('keyup', onKeyup, capture); } };
}
