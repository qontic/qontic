import "../../../shared/qontic-controls.js";
import { mountQonticShell } from "../../../shared/qontic-shell.js";

export function installTemplateShell() {
  const query = new URLSearchParams(location.search);
  if (query.get("embed") === "1" || query.get("renderer") === "video") return null;

  const wrap = document.getElementById("wrap");
  const ui = document.getElementById("ui");
  const theory = document.getElementById("theory");
  const controlBody = document.getElementById("controls");
  const shell = document.createElement("main");
  shell.className = "shell";
  shell.innerHTML = `<header><div><p class="eyebrow">Q-Ontic interactive laboratory</p><h1>Double Slit — Numerical Simulation</h1></div></header>
    <nav class="tabs" aria-label="Views"><button type="button" class="active" data-view="demo">Simulation</button><button type="button" data-view="math">Math</button></nav>`;

  const workspace = document.createElement("section");
  workspace.className = "qontic-workspace";
  workspace.dataset.panel = "demo";
  const sidebar = document.createElement("aside");
  sidebar.className = "qontic-sidebar qontic-panel qontic-control-panel";
  const heading = document.createElement("h2");
  heading.textContent = "Controls";
  const commonControls = document.createElement("qontic-controls");
  commonControls.setAttribute("show-interpretation", "false");
  commonControls.setAttribute("show-reset", "true");
  commonControls.setAttribute("show-autorun", "false");
  commonControls.setAttribute("show-speed", "true");
  commonControls.setAttribute("speed-min", "0.1");
  commonControls.setAttribute("speed-max", "5");
  commonControls.setAttribute("running", "true");
  commonControls.setAttribute("active-tab", "core");
  const stage = document.createElement("div");
  stage.className = "qontic-stage qontic-panel";
  sidebar.append(heading, commonControls, ui);
  stage.append(wrap);
  workspace.append(sidebar, stage);

  const panes = {};
  for (const name of ["core", "advanced", "display"]) {
    const pane = document.createElement("div");
    pane.className = "control-pane";
    pane.dataset.controlPane = name;
    pane.hidden = name !== "core";
    controlBody.append(pane);
    panes[name] = pane;
  }
  panes.advanced.append(ui.querySelector("#export-options"));
  theory.classList.add("details-panel", "qontic-panel", "qontic-reading-panel");
  theory.dataset.panel = "math";
  theory.hidden = true;
  shell.append(workspace, theory);
  document.body.prepend(shell);
  document.documentElement.classList.add("double-slit-template");
  mountQonticShell({ title: "Double Slit — Numerical Simulation", purpose: "Explore pilot-wave trajectories and two-slit interference.", badge: "Pilot Wave", navigation: "breadcrumbs", compactHeader: true, homeHref: "../../../index.html", version: "Double Slit — Numerical Simulation · Pilot Wave" });

  const setActivePane = name => {
    commonControls.setAttribute("active-tab", name);
    for (const [key, pane] of Object.entries(panes)) pane.hidden = key !== name;
  };
  commonControls.addEventListener("qontic:tab", ({detail}) => setActivePane(detail.tab));
  for (const button of shell.querySelectorAll("[data-view]")) button.addEventListener("click", () => {
    for (const tab of shell.querySelectorAll("[data-view]")) tab.classList.toggle("active", tab === button);
    workspace.hidden = button.dataset.view !== "demo";
    theory.hidden = button.dataset.view !== "math";
    window.dispatchEvent(new Event("qontic:view-change"));
  });
  wrap.append(document.getElementById("stats"));
  return { commonControls, panes, stage, wrap, workspace, setActivePane };
}
