const DEFAULT_SPEED = 1.0;
const MIN_SPEED = 0.1;
const MAX_SPEED = 5.0;
const SPEED_STEP = 0.05;

function clampSpeed(value) {
  if (!Number.isFinite(value)) return DEFAULT_SPEED;
  return Math.max(MIN_SPEED, Math.min(MAX_SPEED, value));
}

function formatSpeed(value) {
  return `${value.toFixed(2).replace(/\.?0+$/, "")}x`;
}

function injectStyles() {
  if (document.getElementById("qontic-embedded-speed-styles")) return;

  const style = document.createElement("style");
  style.id = "qontic-embedded-speed-styles";
  style.textContent = `
    .applet-toolbar.qontic-toolbar-with-speed {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .qontic-toolbar-title {
      min-width: 0;
    }
    .qontic-embedded-speed {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
      color: #d9e6f8;
      font: 700 0.78rem/1.2 "Segoe UI", system-ui, sans-serif;
      white-space: nowrap;
    }
    .qontic-embedded-speed input {
      width: min(190px, 24vw);
      min-width: 96px;
      accent-color: #58a6ff;
      cursor: pointer;
    }
    .qontic-embedded-speed__value {
      min-width: 2.6rem;
      color: #fff;
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    @media (max-width: 620px) {
      .qontic-embedded-speed {
        width: 100%;
        margin-left: 0;
      }
      .qontic-embedded-speed input {
        flex: 1;
        width: auto;
      }
    }
  `;
  document.head.appendChild(style);
}

function isEmbeddedAppletFrame(frame) {
  const url = frame.getAttribute("data-src") || frame.getAttribute("src") || "";
  return /[?&]embed=1(?:&|$)/.test(url);
}

function postSpeed(frame, speed) {
  if (!frame.contentWindow) return;
  frame.contentWindow.postMessage(
    { type: "qontic:set-speed", speed },
    window.location.origin
  );
}

function moveToolbarContents(toolbar, title) {
  while (toolbar.firstChild) title.appendChild(toolbar.firstChild);
}

function attachSpeedControl(shell) {
  const toolbar = shell.querySelector(".applet-toolbar");
  const frame = shell.querySelector("iframe");
  if (!toolbar || !frame || !isEmbeddedAppletFrame(frame) || toolbar.dataset.speedControlAttached === "1") return;

  toolbar.dataset.speedControlAttached = "1";
  toolbar.classList.add("qontic-toolbar-with-speed");

  const title = document.createElement("span");
  title.className = "qontic-toolbar-title";
  moveToolbarContents(toolbar, title);

  const control = document.createElement("label");
  control.className = "qontic-embedded-speed";

  const labelText = document.createElement("span");
  labelText.textContent = "Speed";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = String(MIN_SPEED);
  slider.max = String(MAX_SPEED);
  slider.step = String(SPEED_STEP);
  slider.value = String(DEFAULT_SPEED);
  slider.setAttribute("aria-label", "Simulation speed");

  const value = document.createElement("span");
  value.className = "qontic-embedded-speed__value";

  const sync = () => {
    const speed = clampSpeed(Number(slider.value));
    slider.value = String(speed);
    value.textContent = formatSpeed(speed);
    postSpeed(frame, speed);
  };

  slider.addEventListener("input", sync);
  frame.addEventListener("load", sync);

  control.append(labelText, slider, value);
  toolbar.append(title, control);
  sync();
}

function installEmbeddedSpeedControls() {
  injectStyles();
  document.querySelectorAll(".applet-shell").forEach(attachSpeedControl);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", installEmbeddedSpeedControls, { once: true });
} else {
  installEmbeddedSpeedControls();
}
