import "../../../../shared/qontic-controls.js?v=3.3";
export function mountQonticControls(options = {}) {
  const root = options.root || document;
  const controls = root.querySelector("qontic-controls");
  if (!controls) return null;
  const panes = [...root.querySelectorAll("[data-control-pane]")];
  const syncTab = tab => panes.forEach(pane => pane.classList.toggle("hidden", pane.dataset.controlPane !== tab));
  const callbacks = {
    "qontic:start": event => options.onStart?.(event.detail),
    "qontic:stop": event => options.onStop?.(event.detail),
    "qontic:reset": event => options.onReset?.(event.detail),
    "qontic:autorun": event => options.onAutorun?.({ autoRerun: event.detail.autoRun }),
    "qontic:interpretation": event => {
      const map = { cpn: "orthodox", pw: "pilot-wave", mw: "many-worlds", sc: "spontaneous-collapse" };
      const interpretation = map[event.detail.interpretation] || event.detail.interpretation;
      controls.setAttribute("interpretation", event.detail.interpretation);
      root.querySelectorAll("[data-pw-only]").forEach(item => item.classList.toggle("hidden", interpretation !== "pilot-wave"));
      root.querySelectorAll("[data-no-pw]").forEach(item => item.classList.toggle("hidden", interpretation === "pilot-wave"));
      options.onInterpretation?.({ interpretation });
    },
    "qontic:speed": event => options.onControlchange?.({ name: "speed", value: event.detail.speed }),
    "qontic:tab": event => {
      controls.setAttribute("active-tab", event.detail.tab);
      syncTab(event.detail.tab);
    },
  };
  Object.entries(callbacks).forEach(([name, callback]) => controls.addEventListener(name, callback));
  root.querySelectorAll("[data-qontic-control]").forEach(control => {
    const update = () => {
      const output = control.closest(".control-row,.toolbar-slider")?.querySelector("output");
      if (output) output.value = `${control.value}${control.dataset.suffix || ""}`;
      options.onControlchange?.({ name: control.dataset.qonticControl, value: control.type === "range" ? +control.value : control.value });
    };
    control.addEventListener("input", update);
    control.addEventListener("change", update);
  });
  root.querySelectorAll("[data-qontic-toggle]").forEach(button => button.addEventListener("click", () => {
    const pressed = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(pressed));
    if (button.dataset.qonticToggle === "light-theme") document.body.classList.toggle("qontic-light", pressed);
    options.onControlchange?.({ name: button.dataset.qonticToggle, value: pressed });
  }));
  const results = root.querySelector("[data-results-panel]");
  results?.querySelector("[data-results-collapse]")?.addEventListener("click", () => {
    const body = results.querySelector(".results-body");
    body.hidden = !body.hidden;
  });
  syncTab(controls.getAttribute("active-tab") || "core");
  return {
    setRunning(value) { controls.setAttribute("running", String(Boolean(value))); },
    setAutoRerun(value) { controls.setAttribute("auto-run", String(Boolean(value))); },
    setInterpretation(value) {
      const map = { orthodox: "cpn", "pilot-wave": "pw", "many-worlds": "mw", "spontaneous-collapse": "sc" };
      controls.setAttribute("interpretation", map[value] || value);
    },
    setResult(name, value) {
      const output = results?.querySelector(`[data-result="${name}"]`);
      if (output) output.value = value;
    }
  };
}
