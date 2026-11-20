# Shared Q-Ontic app template: compatibility and releases

The template is executable shared code, not a set of copied pages:

- `shared/qontic-shell.js` and `.css`: branding, header, navigation, footer.
- `shared/qontic-controls.js` and `.css`: interpretation, playback, reset, rerun, speed, tabs, and appearance.
- `shared/qontic-app.css`: opt-in controls-and-canvas layout, panels, reading surfaces, compact control sections, and display-layer/color controls.
- `shared/qontic-shortcuts.js`: common Space, R, and S keyboard behavior with app-supplied handlers.
- `shared/qontic-expanded-resize.js`: optional display-only canvas resizing in the shared expanded dialog.
- Each app has a small adapter and scoped layout CSS. The adapter translates shared events into existing engine actions. Physics, accumulated statistics, canvas rendering, and recording belong to the app.

Free Particle uses `apps/comparative/free-particle/js/template-adapter.js`. Its original inputs remain hidden event endpoints so the engine, keyboard shortcuts, and recorder share one behavior. Existing inputs are moved rather than cloned. Shared components must not depend on any Free Particle IDs.

## Core and Display conventions

Core contains the controls needed to run and understand the model, including a compact “What to display” quantity selector when the canvas can show alternative mathematical fields. Display contains appearance only: layer visibility/opacity, wave palettes, and colors for elements such as detectors and hits.

Use `qontic-control-section` with `qontic-control-section-title` for a titled group inside Core. Use `qontic-display-layers`, `qontic-display-layer`, and `qontic-display-layer-label` for the compact Display list. Color targets use `qontic-color-input` for a native color chooser or `qontic-color-button` for an app-supplied chooser such as the wave-palette dialog. These classes provide layout and appearance only; adapters own state and engine events.

## Safe shared updates

Compatible shared changes automatically affect apps importing these paths. Query strings such as `?v=2.8` refresh caches; **they do not pin an immutable version**. Do not treat them as rollback protection.

1. Preserve existing attribute defaults, event names, and event payloads. Add optional features with unchanged defaults. Do not reach into an app engine from shared code.
2. Run `templates/qontic-app/controls-check.html` after changing shared controls. It checks default behavior, event payloads, event counts, programmatic synchronization, speed configuration, export locking, and expansion.
3. Test the canonical template and representative consumers in qontic-dev: Free Particle (including expanded view and video export), analytical Double Slit, and Measurement Detector. Check narrow layouts, both themes, reset/stop, and interpretation switching.
4. Stage a migration on an app preview before replacing its entry page. Preserve unrelated concurrent commits. Promote only the tested files.
5. Use Git history to revert a regression. Shared changes require a shared-file revert; an app adapter can be reverted independently.
6. A breaking API or layout redesign must use a separate major-version path and migrate apps individually. Once published, retain the previous major version until its consumers have migrated. Never silently replace the existing shared API with an incompatible one.

This limits the risk; a shared change can still regress multiple apps. The compatibility check is a gate, not a substitute for the representative app checks. Changes to qontic-dev do not modify the separate production repository.

## Added optional public attributes (2.8)

- `speed-min`, `speed-max`, `speed-step`: configure the speed input. Omitted attributes retain the current default and continue to support older adapters that configured the input directly.
- `disabled="true"`: disable controls while an app is exporting video. `disabled="false"` restores them.
- `show-tabs="false"`: hide tabs and the appearance section in a compact expanded-view toolbar. Defaults to visible.
- `show-appearance="true"`: keep the appearance switch visible when tabs are hidden, for compact single-section control panels.
- `show-advanced="false"`: hide the Advanced tab when an app has no advanced controls. If Advanced was active, the component returns to Core.

Use these public attributes and the documented `qontic:*` events. New adapters must not query or modify internal shadow-DOM elements. Keep app styles scoped to an app class.

## Optional expansion and live video
Import `mountQonticMedia` from `shared/qontic-media.js` and call it with:
- `stage`: the simulation wrapper; receives the media actions while the view is expanded.
- Media actions appear beside the section tabs in the title header by default. On narrow screens the groups wrap; during expansion the toolbar moves into the dialog and returns to the header on restore. Use `headerTools: false` only when a model requires stage placement.
- `labelNode`: optional live interpretation or state label placed at the start of the canvas toolbar.
- `controls`: optional shared controls, moved into the expanded dialog and restored intact.
- `getCanvases()`: visible canvas layers in painting order (background first); CSS placement is preserved in the exported frame.
- `beginRecording()`: starts playback and returns an app-defined state token.
- `endRecording(token)`: restores playback after recording. Do not reset statistics.
- `filename`: download prefix.

The template always uses its compact header. A remembered hide-header control sits beside the media tools, and a small fixed restore button remains available while the header is hidden; use `headerVisibilityControl: false` to remove it. The title, section tabs, and interpretation label are left aligned; Screenshot and the remaining canvas actions align to the right. At tablet widths the tool row wraps, the simulation workspace stacks, and the canvas is placed before controls and statistics. Phone layouts use abbreviated section labels, a compact state badge and branding, and a single three-dot Simulation tools button. Its labeled floating menu is closed by default, closes after an action, on outside press, or with Escape, while the full toolbar remains visible in expanded view. Double Slit places its interpretation label on the same header row as the media tools.

The canonical demo and analytical Double Slit show working integrations. Escape restores the normal view. The recorder uses MediaRecorder, starts from the current state, captures up to 30 fps in real time, and offers preview plus download. Resolution changes output dimensions; it does not increase the model's spatial resolution. Only canvas layers are recorded, not DOM controls. Recording hooks should be synchronous. Do not change geometry or canvas placement during capture. Free Particle retains its model-specific offline renderer (snapshot, fixed frame stepping, high-resolution render); this optional shared recorder does not replace that engine.

The shared media toolbar uses four labeled SVG icon buttons: Screenshot, Share link, Expand/Restore, and Record video. Hover and keyboard focus reveal explanations. `getShareUrl()` optionally supplies a model-specific parameterized URL; the default is the current page URL. Screenshots composite the same ordered canvas layers as recording. Existing app-specific export buttons can be hidden when the shared actions are mounted.

## Directory navigation and standalone apps
The canonical template uses `mountQonticShell({navigation: 'breadcrumbs', ...})`; compact sizing is built in.
The default trail is Q-Ontic Lab › Resources › current app, using `labHref`, `homeHref`, and `title`. It suppresses the floating Back link and duplicate footer links.

Set `breadcrumbs` to an array of parent entries `{label, href}` to represent the resource's actual location or entry route; the current app title is appended automatically. For example, a module can supply Resources › module title before the app. Only include routes that exist. The shell does not guess hierarchy from browser history or referrer.

Navigation is a deployment setting, not a user control. Set `showSiteNavigation: false` to omit site navigation and disable the logo link. There is no Show/Hide button and URL parameters cannot override the setting. Simulation/Math/Rationale stay available. The old `standalone` query parameter is no longer used.

For a reviewer deployment, the shell also supports `showBranding: false` (no logo or brand eyebrow) and `showFooter: false`. These settings alone do not anonymize the complete app: use neutral hosting and separately audit app content, document metadata, feedback links, analytics, external assets, downloads and source references. Do not call an existing Q-Ontic-hosted URL anonymous.

Existing consumers retain legacy navigation until they opt in. No engine behavior or controls change.

## Reusable canvas overlays
Import `mountDistanceScale` and `mountValueRange` from `shared/qontic-overlays.js`. The canonical demo includes both.

- `mountDistanceScale({host,getUnitsPerPixel,format,storageKey?,defaultPosition?})`: host is a positioned wrapper matching the displayed canvas. The adapter supplies positive physical units per CSS pixel for x/y and a label formatter. `defaultPosition` may be `{x,y}` or a function receiving `{hostWidth,hostHeight,width,height}`; it defaults to the upper-left. The scale stays within the host, supports pointer/touch dragging and arrow-key positioning (Home restores the default), and optionally remembers its position. Call `update()` when geometry changes; resizing is observed. `setOpacity()`, `setVisible()`, and `getVisible()` control appearance.
- Pass a `scaleControl: {getVisible,setVisible}` to `mountQonticMedia` to add the optional Distance scale toolbar action. If another UI changes visibility, call the returned `syncScale()`.
- Include the returned scale `canvas` after the simulation layers in `getCanvases()` so screenshots and video include it. The canvas contains the scale graphics; the drag affordance is excluded.
- `mountValueRange({host,label,format,onChange})`: provides two keyboard-accessible vertical range handles. Call `setState({min,max,lower,upper})` when the model's scalar range changes. `onChange({lower,upper})` updates the app's color mapping; it must not reset model state. Values cannot cross. Formatters must describe the app's actual scalar mapping, including normalized quantities.
- The range control itself is DOM UI and is excluded from exports. Apps supply their own palette canvas/legend.
- Both components offer `destroy()`. Existing apps remain unchanged until they mount these optional tools.

## App version tracking
Each app should import one release record for its visible footer and maintain a CHANGELOG. Analytical Double Slit uses `js/release.js`; bump its release for every published app change and refresh affected asset URLs. Template releases and app releases are independent.

### Movable value-range panel
Pass `movableContainer` to `mountValueRange` to move a whole panel (for example, palette canvases plus slider and labels) within its positioned parent. Without it, the range host itself moves. Drag the palette, value labels, or panel background to move it; the slider inputs and a 4 px surrounding gutter are reserved for range adjustment. The panel itself is keyboard-focusable, without a separate drag grip: arrow keys move the focused panel and Home restores its initial position. Optional `storageKey` remembers placement. Resizing keeps the panel in bounds.
Pass the returned controller as `rangeControl` to `mountQonticMedia` for the Wave range toggle. Hiding the panel preserves the current range and color mapping. The template and Double Slit demonstrate this integration.

The distance scale uses a nearly transparent background (10% opacity) to leave the simulation visible beneath it.

## Optional Quiz view
`shared/qontic-quiz.js` + `shared/qontic-quiz.css` add a "predict before you watch" view. Apps that do not use it are unchanged.

- Add a top-level tab button `<button class="qontic-app-toggle" data-view="quiz">Quiz</button>` next to Simulation and Physics, and an empty `<section id="quiz" hidden></section>`. The app's own view-switching code shows and hides it like the other views; pause the simulation when the view is not Simulation.
- Call `mountQonticQuiz({ panel, tab, simulationTab, answers, questions, onWatch })`. Each question has `question`, `answer` (an answer id), `explain`, optional `caption` and `answers`, `prepare()` (set the app state, paused) and `draw(canvas)` (paint a still 360 × 360 picture that does not give the answer away, e.g. the density without particles).
- After an answer the view offers "Watch it in the simulation" (clicks the Simulation tab, then calls `onWatch`) and "Next question".
- `?quiz=1` opens the page on the Quiz tab and disables the Simulation tab until the first answer; `?quiz=N` starts at question N. Going to the Simulation tab removes the parameter from the address bar. Without it the app opens normally.
- Optional: `plain` on a question (one everyday-words sentence shown before `explain`), `shuffle: true` (random answer order), `score: true` (running score and a final "k of n right" line), `shareLink: true` (a "Copy link to this question" button that copies `?quiz=N`). `intro: '…'` adds one line under the title (assumptions shared by all questions). Per question: `drawAfterAnswer: true` hides the picture until an answer (for questions the picture would answer), `watch: false` drops the Watch button.
- Reference: `apps/pilot-wave/hydrogen-atom/hydrogen-template.js`.
