const DEFAULT_SPEED = 1.0;
const MIN_SPEED = 0.1;
const MAX_SPEED = 5.0;
const TARGET_FRAME_SECONDS = 1 / 60;
const MAX_FRAME_DURATION_SCALE = 3.0;

const listeners = new Set();
let currentSpeed = DEFAULT_SPEED;
let currentFrameDurationScale = 1.0;

function clampSpeed(value) {
  if (!Number.isFinite(value)) return DEFAULT_SPEED;
  return Math.max(MIN_SPEED, Math.min(MAX_SPEED, value));
}

function notifySpeedChange() {
  for (const listener of listeners) listener(currentSpeed);
}

function setCurrentSpeed(nextSpeed) {
  const clamped = clampSpeed(Number(nextSpeed));
  if (Math.abs(clamped - currentSpeed) < 1e-9) return;
  currentSpeed = clamped;
  notifySpeedChange();
}

export function getSimulationSpeed() {
  return currentSpeed;
}

export function setSimulationSpeed(nextSpeed) {
  setCurrentSpeed(nextSpeed);
}

export function setSimulationFrameDuration(seconds) {
  const duration = Number(seconds);
  if (!Number.isFinite(duration) || duration <= 0) {
    currentFrameDurationScale = 1.0;
    return;
  }
  currentFrameDurationScale = Math.max(
    1.0,
    Math.min(MAX_FRAME_DURATION_SCALE, duration / TARGET_FRAME_SECONDS)
  );
}

export function effectiveDt(baseDt) {
  const base = Number(baseDt);
  if (!Number.isFinite(base)) return baseDt;
  if (currentSpeed < DEFAULT_SPEED) return base * currentSpeed;
  if (currentSpeed > DEFAULT_SPEED) return base * currentFrameDurationScale;
  return base;
}

export function effectiveStepsPerFrame(baseSteps) {
  const base = Math.max(0, Math.round(Number(baseSteps) || 0));

  if (currentSpeed <= DEFAULT_SPEED) return base;

  return Math.max(base, Math.ceil(base * currentSpeed));
}

export function onSimulationSpeedChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function initSimulationSpeedControl(options = {}) {
  const { onChange = null } = options;
  const unsubscribeChange = onChange ? onSimulationSpeedChange(onChange) : () => {};

  return {
    destroy() {
      unsubscribeChange();
    },
  };
}

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.data?.type !== "qontic:set-speed") return;
  setCurrentSpeed(event.data.speed);
});
