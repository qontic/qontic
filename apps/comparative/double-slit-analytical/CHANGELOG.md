## Version 2.90 — 2026-09-21

- Redefined the visible slit cores and cyan edge ticks to span ±3σₐ from each Gaussian aperture center.
- Conditioned Direct PW particles to cross within those displayed slit cores, eliminating trajectories through the visibly solid wall while leaving the common analytical Gaussian wave and guidance equation unchanged.
- Kept the slit-core sampler rejection-free by sampling the analytically expanded Gaussian mixture from its truncated-normal components, including extremely low-transmission geometries.
- Documented that Direct PW adds slit-core postselection and that its difference from the common Gaussian transmitted ensemble is about 0.28% at the defaults but can grow for extreme geometries.
- Aligned the displayed release and active module cache versions.

## Version 2.89 — 2026-09-21

- Added an optional Pilot-Wave “Color by slit” display: transmitted paths nearest the upper aperture are cyan and those nearest the lower aperture are orange. The slit-region label is visual metadata and does not alter guidance or outcomes.
- Clear accumulated detector hits as soon as a geometry, slit-width or slit-separation drag changes the live predicted histogram, so observations from the old setup are never shown against a new prediction.
- Aligned the displayed release and active module cache versions.

## Version 2.88 — 2026-09-20

- Renamed the expanded Many-Worlds counter from “Worlds” to “Branches,” including its accessibility label, to avoid implying a literal count of worlds.
- Aligned the displayed release and active module cache versions.

## Version 2.87 — 2026-09-20

- Doubled the branch-counter text size in the expanded Many-Worlds view while preserving its compact size in the normal grid.
- Gave Start/Stop a green treatment and Reset a red treatment for clearer action semantics.
- Aligned the displayed release and active module cache versions.

## Version 2.86 — 2026-09-19

- Replaced rejection sampling for “Direct PW” with the exact analytical Gaussian-mixture sampler for the conditional wall density \(T^2(y)|\phi(y,L)|^2\), then mapped each sample back to its source plane along the exact incident guidance trajectory.
- Removed the fixed 20,000-attempt failure mode, so directed packets remain fast and reliable even when total slit transmission is extremely small.
- Removed the retired point-source \(1/r\) wave, guidance, trajectory, detector-distribution, precomputation and rendering paths from the active script; the Gaussian packet engine is now the only physics engine.
- Aligned active packet-module cache versions.
- Anchored the wave-range sliders at the exact lower-left canvas edge, with the optional palette immediately to their right; rebased the saved position for this layout.
- Kept the selected Many-Worlds detector-pixel marker at a constant screen size through branch separation, the completed grid and selected-subcanvas zoom, eliminating the size jump at the grid handoff.

## Version 85 — 2026-09-19

- Standardized slider rows throughout Core, Advanced and Display with the same faint solid divider; removed dotted label underlines inside the controls.
- Compressed Advanced slider rows to about 90% of their previous vertical spacing.
- Moved the Pilot-Wave direct-particle option beside the particle selector, shortened it to “Direct PW,” and moved the full explanation into its tooltip.
- Placed the Many-Worlds Random/Manual selector and the shortened “Prob.” option on one line.
- Removed the obsolete incoming wave packet from post-detection slow-motion branch canvases; branch views now show the apparatus and their detector record after splitting.
- Updated active module cache versions.

## Version 84 — 2026-09-19

- Changed the default slit separation to 300 nm and the default wall-to-screen distance to 1000 nm; wavelength remains 50 nm and slit width remains 30 nm.
- Added compact source-position, screen-distance and screen-height sliders to the Advanced panel, with clearer wall-to-screen labeling.
- Synchronized the displayed geometry, slit-width and slit-separation controls continuously while their canvas handles are dragged; cancelling a drag restores the committed values.
- Tightened Advanced-panel spacing so the added geometry controls fit without unnecessary crowding.
- Updated active module cache versions.

## Version 83 — 2026-09-19

- Set the default wall-to-detector distance to 800 nm so the λ = 50 nm slit packets overlap and produce a visible interference pattern.
- Extended the detector-distance range to 50–3000 nm; larger distances are allowed within the analytical reduced model.
- Aligned geometry handles with all permitted bounds. Detector and wall guides stop at the legal position during dragging, and slit-width handles no longer enter the forbidden σₐ < 30 nm region before snapping back.
- Updated active module cache versions and the Physics explanation.

## Version 82 — 2026-09-19

- Ensure manually entered packet lengths and slit widths visibly snap to their permitted bounds on Enter or when the field loses focus; the underlying range controls were already clamped.

## Version 81 — 2026-09-19

- Replaced the approximation warning with validity-preserving control limits: wavelength ≤ 50 nm, slit width σₐ ≥ 30 nm and packet length σₓ ≥ 50 nm.
- The allowed combinations therefore satisfy kσₐ ≥ 3.77, kσₓ ≥ 6.28 and Δk/k ≤ 0.080 without coupling the sliders or automatically changing one parameter when another moves.
- Updated the Physics explanation and aligned active packet-module cache versions.

## Version 80 — 2026-09-19

- Changed the default wavelength from 100 nm to 50 nm, placing the default packet close to the recommended paraxial aperture range and within the narrow-band packet range.
- Added live, non-blocking validity diagnostics for kσₐ, kσₓ and Δk/k; controls remain unrestricted for exploring the approximation outside its recommended regime.
- Aligned active packet-physics module cache versions to prevent mixed cached revisions.
- Removed the unused packet-model sample and prediction functions and clarified in the legacy shell source that the active physics resides in the packet modules.

## Version 79 — 2026-09-19

- Removed the unused quantum-potential display and its dormant legacy calculation. The active packet app continues to offer phase, |Ψ|², and log(|Ψ|²) displays; packet physics and trajectories are unchanged.

# Analytical Double Slit releases

## Version 78 — 2026-09-19

- Make the Pilot-Wave slit-conditioning toggle non-disruptive: leave the current packet, histogram and clock unchanged, and apply the new selection only when the next packet is launched.

## Version 77 — 2026-09-19

- Preserve the histogram, hit count and elapsed time when toggling the Pilot-Wave slit-conditioned source option. Replace only the unfinished in-flight packet so the visual change takes effect immediately.

## Version 76 — 2026-09-19

- Make the Pilot-Wave “Direct particles through slits” option span the full control-panel width, preventing its label from wrapping inside the narrow slider-label column.

## Version 75 — 2026-09-19

- Add an optional Pilot-Wave-only “Direct particles through slits” preparation. It conditions the incident Born ensemble on slit transmission while leaving the wavefunction and guidance equation unchanged; the default incident ensemble remains unchanged.

## Version 74 — 2026-09-19

- Show the live finite-model world count in the expanded Many-Worlds canvas. Hide it for other interpretations and keep it synchronized with detections and resets.

## Version 73 — 2026-09-19

- Expanded view fills all available width and height by default. Previously saved custom dimensions are still respected; double-clicking the resize grip restores the full-space default.

## Version 72 — 2026-09-19

- Add an expanded-canvas resize grip with remembered width and height across restore/expand and reloads. Shift-drag preserves proportions; double-click returns to automatic fit. Resize remains display-only and preserves statistics.

## Version 71 — 2026-09-19

- Maximize the expanded canvas within the viewport while preserving its 4:3 proportions. Combine playback and media tools in one compact row on desktop; stack them on narrow screens.

## Version 70 — 2026-09-19

- Preserve accumulated histogram counts and simulation progress when expanding, restoring, or resizing the canvas. Derive packet preparation from physical inputs directly so display rounding cannot trigger a reset.

## Version 69 — 2026-09-19

- Clear Pilot-Wave trajectory tails immediately upon screen detection. Preserve detector records and the brief fade of wall-absorbed particles.

## Version 68 — 2026-09-19

- Retract detected Pilot-Wave tails from their oldest end toward the detector at their arrival speed, using simulation time. Pausing freezes retraction; playback speed controls it. Preserve the brief fade for wall-absorbed/missed particles and leave hit statistics unchanged.

## Version 67 — 2026-09-19

- Make Space control playback even when a toolbar button retains focus, preventing accidental geometry editing or capture actions. Keep native keyboard behavior in input fields.

## Version 66 — 2026-09-19

- Hide geometry handles during normal playback; add pencil/right-click editing mode, Escape exit, and pause/resume restoration.
- Keep predicted histogram previews live for all geometry drags and visible throughout editing, even if the probability display was hidden. Cancel unfinished drags on exit; explicit Start exits editing.

## Version 65 — 2026-09-19

- Restore keyboard shortcuts across the shared controls, respecting text entry and native Space activation; route screenshots to the shared capture toolbar.
- Add labeled Sep handles beside slit centers, distinct from Width handles at aperture edges. Separation moves both centers symmetrically with fixed width, live opening/probability preview, arrow keys and Escape cancellation.

## Version 64 — 2026-09-18

- Remove the related-paper citation and reference section from Physics; retain the current equations and simulation model.

## Version 63 — 2026-09-18

- Define consistent wave, geometry, width and detector notation, with explicit mappings to control labels.
- Standardize view terminology and provide a numbered full bibliographic reference with DOI and open-access preprint.

## Version 62 — 2026-09-18

- Separate Physics and Views: common equations and approximation limits in Physics; interpretations, visualization and record behavior in Views.
- Show the exact envelope equation and the longitudinal derivative omitted by the app; distinguish the effective mask from wall-potential scattering and state the unvalidated parameter range.

## Version 61 — 2026-09-18

- Merge Math and Rationale into one Physics section without duplicated interpretation text.
- Audit the explanation against the Gaussian source engine: paraxial limits, soft-mask normalization, numerical quadrature and trajectories, conditioned counts, approximate errors, MW timing, and display enhancements.
- Present five model equations with a verified reference to the Gaussian-aperture literature.

## Version 60 — 2026-09-18

- Anchor the color scale and wave-range panel at the exact lower-left canvas corner. Rebase its saved position for this release; subsequent dragging remains saved.

## Version 59 — 2026-09-18

- Reduce the detector hit enlargement and extend it toward the histogram instead of the slit wall.
- Add vertical slit-width handles at the openings, with live opening/histogram previews, keyboard adjustment, and Escape cancellation. Both Gaussian aperture widths remain linked; committing starts a new detector record.

## Version 58 — 2026-09-18

- Enable Sample another branch for packet-model detector histories, preserving hit count and elapsed time.
- Move Reset Defaults to Advanced and remove the Gaussian source status paragraph from Core.
- Keep the MW Follow selector on one line with concise Random and Manual choices; random selection still uses Born weights.

## Version 57 — 2026-09-18

- Fill both dimensions of the MW branch grid, including the complete 8 × 5 layout for 40 detector pixels.
- Fit each whole system to its tile and smoothly restore full-canvas proportions during branch entry. Probability labels appear only when both width and height allow them.

## Version 56 — 2026-09-18

- Keep a high-contrast fired-pixel marker visible throughout MW splitting and branch selection, clearing it at full-size entry.
- Strengthen packet-wave opacity and color visibility consistently in all interpretations, retaining the Wave opacity control and unchanged physics.

## Version 55 — 2026-09-18

- MW slow motion temporarily uses one hit per packet and restores the previous count on exit, preserving recorded statistics.
- Split at packet-center arrival at the screen, with one distinct fired pixel per branch. Launch the next packet only after branch selection and expansion.
- Keep the packet visible during branch inspection; suspend packet spacing and hide the obsolete branch dwell control during the tour.

## Version 54 — 2026-09-18

- Update the distance scale continuously during detector-height dragging, using the preview height and displayed canvas dimensions. Cancelling restores the original scale; release retains the committed scale.


## Version 53 — 2026-09-18

- Replace yellow hit flashes with sensor-colored bin enlargement and neutral outlines, lasting 225 ms in all modes.
- Preserve statistics and current packets when particles/hits per packet changes; apply the new count at the next launch. Keep an active MW branch selection intact.
- Preview the predicted screen histogram on each drag frame for the slit wall, detector position and detector height. Cancellation restores the original curve; committing changed geometry starts a new record as before.


## Version 52 — 2026-09-18

- Draw clear wall openings between the Gaussian aperture FWHM markers; document that these are schematic edges while Gaussian transmission remains the model.
- Initialize wave packets and particles six longitudinal sigma upstream of the left canvas boundary. All sampled particles enter through the left edge.
- Flash every registered detector pixel yellow in PW, Orthodox and ordinary MW, including simultaneous hits. Paint on the sensor layer; MW branch views highlight their own complete sensor pixel.
- Default Packet interval to Auto (0), waiting for all prior outcomes and branch selections. Positive intervals remain available for overlapping pulses.


## Version 51 — 2026-09-18

- Keep high-particle-count playback responsive by yielding between complete physics steps after a 12 ms integration budget. Requested speed becomes best-effort under load; no particles or detector events are dropped.
- Trim trajectory tails once per displayed frame, sample their drawing vertices at 2 nm intervals, and batch tail/particle drawing. Physics steps and aperture probabilities are unchanged.
- Make the soft wall more legible and mark each aperture’s intensity FWHM with cyan ticks. Slit width remains Gaussian σ; tooltips explain FWHM = 2.355 σ and overlapping profiles.


## Version 50 — 2026-09-18

- Continuous packet transport through ordinary registrations; batch Orthodox/PW hits per frame instead of pausing after each hit.
- Packet interval (10–300 ps for electrons or ns for neutrons, default 40) controls independent source launches. Multiple pulses can coexist; their densities add without inter-pulse coherence.
- Preserve localized Gaussian display envelopes, smooth cyclic phase colors, double the wave raster resolution, and cache transverse visibility/palette data.
- Cap animation catch-up at 100 ms to avoid large jumps. Explicit MW branch inspection still pauses transport and the source clock.


## Version 49 — Clearer packet display and hit targets (2026-09-18)

- Remove the unused source-control row and its gap below Tail length.
- Use Particles / packet for Pilot-Wave incident trials; use Hits / packet for Orthodox/MW screen-conditioned ensembles. Explain the change of flux convention in Rationale.
- Slate-blue canvas background, including captures, and stronger fixed wave visibility on both sides of the slits; probabilities and trajectories are unaffected by display enhancement.

## Version 48 — Compact handles and brighter transmitted waves (2026-09-18)

- Detector movement and height controls appear only at the bottom; add a bottom slit-wall handle that keeps the detector fixed.
- Smoothly enhance transmitted-wave brightness without changing probabilities or trajectories.
- Always repeat packets; remove repeat checkbox and control-panel drag explanation, retain handle tooltips.
- Move the particle species selector to the top of Advanced.

## Version 47 — Canvas geometry and trajectory tails (2026-09-17)

- Remove the source marker and source-position control; fix the preparation plane at 225 nm before the apertures.
- Replace detector distance and screen-height sliders with draggable canvas handles and keyboard adjustment. Preview while dragging; commit starts a new record, Escape cancels.
- Keep the horizontal viewport stable when moving the detector; expand it when necessary.
- Inline packet-width controls with numeric entry and units. Add trajectory tail length in nm; completed paths fade over 0.8 playback seconds.
- Geometry, bounds, tail-length and fade checks passed. Browser verification unavailable because the execution environment was disconnected.

## Version 46 — Gaussian packets across interpretations (2026-09-17)

- Gaussian source packets are the sole engine; previous models remain recoverable in git.
- Orthodox samples absorption and screen outcomes from the packet probabilities, shows localized absorbing-detector registration and removes only the detected member from the ensemble.
- MW packet detections now drive split-and-zoom views with integrated pixel weights, branch-specific records at splitting, and no duplicate hit on selection.
- Pilot-Wave retains source preparation and forward propagation. Switching preserves records and conditions unresolved preparations on survival.
- Rewrite Math/Rationale for the packet model and its effective detector, aperture and finite branch approximations.

## Version 45 — Source cone and reusable preparation (2026-09-17)

- Save the latest spherical field in browser storage and restore matching geometry across reloads; show preparation stages. First preparation and changed geometry still require computation.
- Default particle emission to one cone spanning the open Gaussian slits, using two-sigma outer limits. Draw the source and cone guides. This biased particle sampling leaves the wave unchanged; the ordinary prediction stays hidden.
- Remove the slit-exit packet selector; legacy slit-exit links open spherical-source mode. Retain Continuous and Gaussian source.
- Preserve version 44 in git history.

## Version 44 — Packet playback and launch controls (2026-09-17)

- Cache and interpolate the carrier-demodulated spectral solution once per geometry; reuse it for repeat packets and resets.
- Independent Launch interval control (0.5–10 playback seconds, default 3); concurrent independent packets, capped at 12 without truncating existing packets.
- Keep packet motion speed in the shared Speed control; eliminate the one-small-step-per-frame cap and allow catch-up substeps.
- Extend slit/exit Gaussian width to 200 nm.
- Optional biased slit-directed particle sampling; hide the ordinary prediction curve while enabled, preserve actual hit counts and explain the limitation.
- Numerical cache-convergence, speed benchmark, emission scheduling, angular sampling and detector-statistics checks.
- Prior release retained in git at ef9396480f07c7b509e76ca12bb0173e0446db3e.


## Version 43 — Circular-source packet prototype (2026-09-17)

- Integrated into the existing Wave model selector; previous engines retained.
- Analytical outgoing 2D Hankel kernels and angular-spectrum propagation; spectral/aperture quadrature, analytical time phases and numerical current-guided trajectories. No time-stepped wave PDE.
- Radial source emission and reduced one-way aperture transmission, with assumptions and 2D/3D distinction documented in Math and Rationale.
- Background preparation, resolution guards, hit-driven histogram scaling, existing display and capture controls.
- Seeded 30,000-emission validation: 1,375 screen hits; maximum screen CDF difference 0.01528. This validates the tested configuration, not arbitrary geometries.
- Rollback: rollback/double-slit-v42-before-spherical at a4ddfc53354bdee79d817f47ee6b0b33a066a959.



## Version 42 — Analytical source-to-screen packets (2026-09-17)

- Added Packet · source to the existing Wave model selector; retained the exact free Packet · slit exits engine and continuous engine.
- Connected one translating Gaussian pulse to analytical Gaussian-aperture transmission with inherited complex phase and spatial transverse propagation. No fade, phase reset, or downstream packet reinjection at the wall.
- Added source width in Advanced. Existing source distance, aperture width, slit switches, wavelength, detector geometry, opacity, screenshot/video and interpretation controls continue to apply.
- Source trajectories sample the incident ensemble. Effective mask absorption uses T²; transmitted paths continue at their crossing positions. Screen density and counts share the hit-driven scale.
- Cached the analytical transverse field and used a fixed brightness reference for smooth pulse motion and stable opacity across transmission.
- Math and Rationale distinguish the paraxial, non-reflecting source model from exact free slit-exit evolution, including stochastic absorption and longitudinal-dispersion limits.
- Validated complex aperture matching, paraxial equation residuals, transmitted flux conservation, overlapping/single apertures, and a seeded 12,000-particle screen-distribution comparison.

## 41 — 2026-09-17
- Prepare packet centers three standard deviations beyond the exit plane, retain analytical tails and adjust the detector flight distance consistently.
- Draw a smooth current profile independent of detector binning. Normalize model and sampled counts to observed hits on one shared scale, unchanged by packet launches.
- Strengthen packet visibility with a display-only envelope in all interpretations, retaining the Wave opacity control.

## 40 — 2026-09-17
- Integrate analytical packets into the existing app through Core → Wave model. Reuse playback, geometry, display, canvas layers, media tools, stats and Math/Rationale.
- Packet-only widths live in Advanced; Max. Particles controls particles per packet. Interpretation switching preserves the packet history.
- Remove the separate preview entry. The packet engine currently excludes source propagation, which-path coupling, photons and MW split-tour animation; these remain available with the continuous engine.
- The version 38 rollback branch and complete Git history remain available.

## 39 — 2026-09-17
- Add a separate experimental analytical Gaussian packet preview linked from Core, with single/pair slit-exit preparation, repeated independent pulses, and a Pilot-Wave ensemble.
- Use exact free Gaussian fields and longitudinal trajectories, RK4 transverse trajectories, and quadrature of analytical screen current. No screen-endpoint seeding.
- Validation: normalization, spreading, gradients, step convergence; 2,500 seeded trajectories give maximum screen CDF discrepancy 0.01088.
- Rollback snapshot: `rollback/double-slit-v38-before-packets` at `faaa6861163976c8a0d3b1f1ce17f47f14e72c02`. To undo this release, revert its commit only; do not reset main or overwrite unrelated shared-template work.

## 38 — 2026-09-17
- Hide branch probability labels by default; add an optional Show probabilities checkbox.
- Show labels only when complete text fits; remove their reserved space otherwise. Keep full probabilities in tooltips and accessible names.

## 37 — 2026-09-17
- Prefer complete balanced branch grids: 25 outcomes form 5×5; 500 form 25×20.
- Fit desktop grids within the canvas by scaling their width while retaining each miniature’s aspect ratio.

## 36 — 2026-09-17
- Show relative Born weights through branch opacity during splitting and in the grid, with a visibility floor and readable probability labels.
- Restore the selected branch smoothly to full opacity during entry; document the visual mapping in Rationale.

## 35 — 2026-09-17
- Remove the temporary yellow detection highlight at the instant the selected branch fills the canvas, retaining its detector record and histogram.

## 34 — 2026-09-17
- Each branch has its updated histogram and sensor record from the first split frame, through the grid and zoom.
- Advance hit and branch totals at detection; following a branch adopts its existing record without counting another hit.
- Cache detector strips once per split while sharing the live wave rendering.

## 33 — 2026-09-17
- Animate detection and branching together: fired detector records emerge in a depth stack and fan out into the branch grid.
- Keep the wave live during the split; enable selection and start the one-second automatic-choice delay after the grid settles.
- Preserve the branch-entry camera zoom and record one outcome when a branch is followed.

## 32 — 2026-09-16
- Scale the model curve and sampled histogram together to keep all count markers and upper sqrt(n) error bars inside the plotting area, including at very low counts.
- Fade the branch-entry status banner during zoom so it cannot hide the topmost fired detector pixel.

## 31 — 2026-09-16
- Keep the wave evolving in every MW miniature and during branch-entry zooms; only new detections wait for selection.
- Reuse a single evolving wave render and one downsampled frame across all miniature canvases.
- Preserve Start/Stop behavior, branch dwell timing, and one recorded hit per selection.

## 30 — 2026-09-16
- Add an MW slow-motion Time in branch slider (1–5 seconds, default 1 second).
- Run the full-size branch before the first split and after each selection; exclude paused time and prevent queued detections during this interval.

## 29 — 2026-09-16
- Highlight the selected MW branch, then move the entire branch grid through a shared camera zoom until the selected system fills the canvas.
- Add a selection pause, a smooth 1.2-second zoom, and a brief full-view hold.

## 28 — 2026-09-16
- Add optional slow-motion Many-Worlds branching: one miniature per detector pixel, Born-weighted automatic following or manual selection, and expansion into the followed world.
- Pause evolution during the branch tour; cancel pending outcomes on reset, geometry, or interpretation changes.
- Explain the schematic branch view and manually selected histories in the Rationale.

## 27 — 2026-09-16
- Remove the redundant range drag grip; retain panel dragging and keyboard movement.
- Make the distance-scale background nearly transparent through the shared template.

The displayed release is defined in `js/release.js`. For each published app change, increment that version, add an entry here, and refresh changed assets' import URLs. Query strings are cache refreshes, not a release history.

## 26 — 2026-09-16
- Drag the wave-range panel from its palette, values, or background.
- Protect slider handles and their surrounding area from panel dragging.
- Apply the same behavior in the shared template.

## 25 — 2026-09-16
- Make the wave-range slider, values, and palette movable together with a drag grip.
- Add a Wave range toolbar toggle; hiding preserves the selected range.
- Extend the reusable template components and demo.

## 24 — 2026-09-16
- Correct the footer's stale Version 15 label and centralize the displayed release.
- Adopt shared draggable distance scale, toolbar toggle, and two-handle color-range control.
- Add working examples and integration contract to the canonical template.

## Changes since the former Version 15 label
- Group capture actions; add configurable resource breadcrumbs and deployment-only navigation settings.
- Replace Display switches with independent opacity sliders and unify slider styles across Core, Advanced, and Display.
- Remove particle-based wave masking and fix screen-endpoint initialization.
- Expand Math and Rationale with readable typography and explicit model limitations.
