const INTERPRETATIONS = [
  ["cpn", "Orthodox"],
  ["pw", "Pilot Wave"],
  ["mw", "Many Worlds"],
];

const boolAttr = (element, name, fallback = false) => {
  const value = element.getAttribute(name);
  return value == null ? fallback : value !== "false";
};

class QonticControls extends HTMLElement {
  static observedAttributes = ["interpretation", "running", "auto-run", "speed", "active-tab", "accent", "theme", "show-interpretation", "show-autorun", "show-reset", "show-speed", "speed-min", "speed-max", "speed-step", "disabled", "show-tabs", "show-appearance", "show-advanced", "show-expert"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${new URL("./qontic-controls.css?v=3.2", import.meta.url).href}">
      <section class="qontic-common-controls" aria-label="Simulation controls">
        <button class="qontic-interpretation" type="button"></button>
        <div class="qontic-run-row" role="group" aria-label="Run controls">
          <button class="qontic-main-run" type="button"></button>
          <button class="qontic-reset" type="button">Reset</button>
          <button class="qontic-auto-rerun" type="button">↻</button>
          <label class="qontic-speed"><span>Speed</span><input type="range" min=".1" max="4" step=".05"><output></output></label>
        </div>
        <nav class="qontic-control-tabs" role="tablist" aria-label="Control sections">
          <button type="button" data-tab="core" role="tab">Core</button>
          <button type="button" data-tab="advanced" role="tab">Advanced</button>
          <button type="button" data-tab="expert" role="tab">Expert</button>
          <button type="button" data-tab="display" role="tab">Display</button>
        </nav>
        <div class="qontic-common-display" hidden>
          <button class="qontic-theme-toggle" type="button" role="switch"><span>Light theme</span><i></i></button>
        </div>
      </section>`;
  }

  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
    const root = this.shadowRoot;
    root.querySelector(".qontic-interpretation").addEventListener("click", () => {
      const current = this.getAttribute("interpretation") || "cpn";
      const index = INTERPRETATIONS.findIndex(([id]) => id === current);
      const interpretation = INTERPRETATIONS[(index + 1) % INTERPRETATIONS.length][0];
      this.setAttribute("interpretation", interpretation);
      this.dispatch("interpretation", { interpretation });
    });
    root.querySelector(".qontic-main-run").addEventListener("click", () => {
      const running = !boolAttr(this, "running");
      this.setAttribute("running", String(running));
      this.dispatch(running ? "start" : "stop", { running });
    });
    root.querySelector(".qontic-reset").addEventListener("click", () => {
      this.dispatch("reset", {});
    });
    root.querySelector(".qontic-auto-rerun").addEventListener("click", () => {
      const autoRun = !boolAttr(this, "auto-run", true);
      this.setAttribute("auto-run", String(autoRun));
      this.dispatch("autorun", { autoRun });
    });
    root.querySelector(".qontic-speed input").addEventListener("input", event => {
      const speed = +event.target.value;
      this.setAttribute("speed", String(speed));
      this.dispatch("speed", { speed });
    });
    root.querySelector(".qontic-control-tabs").addEventListener("click", event => {
      const button = event.target.closest("[data-tab]");
      if (button) {
        this.setAttribute("active-tab", button.dataset.tab);
        this.dispatch("tab", { tab: button.dataset.tab });
      }
    });
    root.querySelector(".qontic-theme-toggle").addEventListener("click", () => {
      const theme = (this.getAttribute("theme") || "dark") === "light" ? "dark" : "light";
      this.setAttribute("theme", theme);
      this.dispatch("theme", { theme });
    });
    this.sync();
  }

  attributeChangedCallback() {
    if (this._connected) this.sync();
  }

  dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(`qontic:${name}`, { detail, bubbles: true }));
  }

  sync() {
    const root = this.shadowRoot;
    const interpretation = this.getAttribute("interpretation") || "cpn";
    const [, label] = INTERPRETATIONS.find(([id]) => id === interpretation) || INTERPRETATIONS[0];
    const interpretationButton = root.querySelector(".qontic-interpretation");
    interpretationButton.hidden = this.getAttribute("show-interpretation") === "false";
    interpretationButton.textContent = label;
    interpretationButton.style.setProperty("--qontic-control-accent", this.getAttribute("accent") || "#55d8e6");
    interpretationButton.title = "Click to change interpretation";

    const running = boolAttr(this, "running");
    const runButton = root.querySelector(".qontic-main-run");
    runButton.textContent = running ? "Stop" : "Start";
    runButton.setAttribute("aria-label", running ? "Stop simulation" : "Start simulation");

    const resetButton = root.querySelector(".qontic-reset");
    resetButton.hidden = this.getAttribute("show-reset") !== "true";
    resetButton.setAttribute("aria-label", "Reset simulation");
    resetButton.title = "Return the simulation to its initial state";

    const autoRun = boolAttr(this, "auto-run", true);
    const autoButton = root.querySelector(".qontic-auto-rerun");
    autoButton.hidden = this.getAttribute("show-autorun") === "false";
    const runRow = root.querySelector(".qontic-run-row");
    runRow.classList.toggle("without-autorun", autoButton.hidden);
    runRow.classList.toggle("without-reset", resetButton.hidden);
    autoButton.classList.toggle("active", autoRun);
    autoButton.setAttribute("aria-pressed", String(autoRun));
    autoButton.setAttribute("aria-label", `Auto rerun ${autoRun ? "on" : "off"}`);
    autoButton.title = autoRun ? "Auto rerun is on. Click for one run only." : "One run only. Click to automatically rerun.";

    const speedControl = root.querySelector(".qontic-speed");
    speedControl.hidden = this.getAttribute("show-speed") === "false";
    const speed = +(this.getAttribute("speed") || 1);
    const speedInput = root.querySelector(".qontic-speed input");
    // Additive public configuration: adapters never need shadow DOM selectors.
    for (const name of ["min", "max", "step"]) {
      if (this.hasAttribute(`speed-${name}`)) speedInput[name] = this.getAttribute(`speed-${name}`);
    }
    if (root.activeElement !== speedInput) speedInput.value = String(speed);
    speedInput.setAttribute("aria-label", "Simulation speed");
    root.querySelector(".qontic-speed output").value = `${speed.toFixed(1)}×`;

    const showAdvanced = this.getAttribute("show-advanced") !== "false";
    const advancedButton = root.querySelector('[data-tab="advanced"]');
    advancedButton.hidden = !showAdvanced;
    const showExpert = this.getAttribute("show-expert") === "true";
    const expertButton = root.querySelector('[data-tab="expert"]');
    expertButton.hidden = !showExpert;
    let tab = this.getAttribute("active-tab") || "core";
    if ((tab === "advanced" && !showAdvanced) || (tab === "expert" && !showExpert)) {
      tab = "core";
      this.setAttribute("active-tab", tab);
    }
    const showTabs = this.getAttribute("show-tabs") !== "false";
    const showAppearance = this.getAttribute("show-appearance") === "true" || (showTabs && tab === "display");
    root.querySelector(".qontic-control-tabs").hidden = !showTabs;
    root.querySelector(".qontic-common-display").hidden = !showAppearance;
    const disabled = boolAttr(this, "disabled");
    root.querySelectorAll("button, input").forEach(control => { control.disabled = disabled; });
    root.querySelectorAll("[data-tab]").forEach(button => {
      const active = button.dataset.tab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });

    const theme = this.getAttribute("theme") || "dark";
    const light = theme === "light";
    document.documentElement.classList.toggle("qontic-light", light);
    document.body?.classList.toggle("qontic-light", light);
    const themeButton = root.querySelector(".qontic-theme-toggle");
    themeButton.setAttribute("aria-checked", String(light));
    themeButton.classList.toggle("active", light);
  }
}

if (!customElements.get("qontic-controls")) customElements.define("qontic-controls", QonticControls);
export { QonticControls };
