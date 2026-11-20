## 3.0 — 2026-11-19
- Published as a separate app, N-Slits (Pablo). Same content as 3.0-dev.28.

## 3.0-dev.28 — 2026-11-19
Second panel round (Raj, Tomás, Hannah) on dev.27. Tomás and Hannah: ready after small fixes; Raj: one wrong number.
- **Correction (Raj):** at the closing moment about a tenth of the packet is past the wall, not 1% (the 1% was the weight of the smoothly split part, not the probability beyond the wall exit). "Most of the wave ahead of the cut came from the later part" softened to "a large part": the 83% depends on the smooth split (about 65% counting only wave behind the wall exit).
- Q5 caption "The packet centre is reaching the wall"; short answer: the wave guiding them changes by tens of per cent of its amplitude in the numerical preview (not "guidance"; Tomás, Raj).
- Cut defined as the slice crossing the wall at the click, moving on at v (Hannah, Raj); limit: small angles (little wave lingers behind the cut) and a closure gentle enough to scatter little (Tomás); Orthodox: nothing settled before detection, Many Worlds: every outcome in some branch (Hannah); Orthodox "the wave gives probabilities only" (Tomás).

## 3.0-dev.27 — 2026-11-19
Fixes from a three-reviewer panel (Raj, Tomás, Hannah) on the closing-a-slit text.
- **Correction (Raj):** the reference packet σ is an amplitude width; as density widths (this app's convention) the packets are 0.7λ and 1.7λ, not 1λ and 2.4λ. The app default (2λ) is slightly longer than the 33% case, not shorter. Blade closes while the packet moves 3.6λ (not 3.6σ).
- **Correction (Raj):** mechanism. The change ahead of the cut comes from the faster components of the speed spread and the fast waves scattered by a sudden closure (90% of it in components faster than the central speed in his check). Wide-angle diffraction slows the forward motion and leaves wave behind the cut; it was wrongly listed as a cause.
- Physics paragraph split into "what the app does" and "what the full Schrödinger equation does"; the cut defined; the part already past "changes very little" (not "is not changed"; Tomás); the 50% is a relative amplitude change with ~1% of the packet past the wall; most of the wave ahead of the cut comes from the later part even with no closing; the limit includes a slow closure; a slit click resets with detectors or MW branching (Raj); "redrawn" outcomes described as the app's display pre-draw (Tomás); Direct PW sentence in plain words (Hannah).
- Views: opening sentence no longer gives particles paths in all views; Orthodox detections distributed as |ψ|², no wave guides anything; "statistics of what is recorded" (Tomás, Hannah).
- Quiz Q5: stem and caption say the packet centre is reaching the wall (matches Watch it); short answer says the guidance changes substantially; explanation shortened, warns that the default settings are outside the model's range (Hannah).
- Stats row Fringes shows "(front: earlier)" while the part past the wall still has the earlier pattern (Hannah).

## 3.0-dev.26 — 2026-11-19
- Text checked against the code. Fixed: the closing-a-slit Views section now says the old pattern ahead of the cut holds in this model (the full equation changes that wave, in all three views alike); Physics says the earlier prediction stays dashed and describes the "Apply at the wall" option; the reference numbers state the packet and slit size, and the default packet (σₓ = 2λ) is said to be outside the long-packet limit; normalization C and the slit-limit sentences cover N slits (two-slit wording removed).
- Catalog: to be published as a separate app (Pablo), not as a replacement for Double Slit 2.128. id n-slits-analytical, title N-Slits, description updated (it still said 1–8 slits). Still draft.

## 3.0-dev.25 — 2026-11-19
- Renamed to "N-Slits" (Pablo): page title, header, breadcrumb, catalog title. No change to the simulation.

## 3.0-dev.24 — 2026-11-19
- **Correction of dev.23:** dev.23 said that in the full Schrödinger equation closing a slit perturbs the part of the wave already past the wall. A 2D split-operator calculation (geometry of the numerical app; script in apps/pilot-wave/n-slit-numerical/tools/) splitting ψ(t_c) smoothly into the part already past and the rest shows the part already past changes by < 1%; the change of the wave ahead of the cut (52% sudden reflecting blade, 24% blade over τ = 60, 33% for a 2.4 λ packet) comes entirely from the later part, which the spread of forward speeds, wide-angle diffraction and scattering carry into that region (with a 1 λ packet it makes up 83% of the amplitude ahead of the cut even with the slit open). Q5, Physics and Views reworded; they point to the numerical N-slit preview.

## 3.0-dev.23 — 2026-11-19
- **Correction (Pablo):** quiz Q5 and the Physics and Views text said that closing a slit cannot change the part of the packet already past the wall. That is a property of the reduced paraxial equation (each slice carried at v, no longitudinal dispersion), not of the Schrödinger equation. A 1D Crank–Nicolson test (λ = 50 nm, σx = 100 nm, 20 nm barrier at 5E switched on at the packet centre) changed the amplitude ahead of the cut by |δψ|/|ψ| ≈ 0.3–0.5. Q5 now asks for the model's prediction and explains the limitation; Physics ("Opening or closing a slit during a run") and Views ("Closing a slit after the particle has passed") say the same and keep the empty-wave picture as the model's idealisation. No change to the simulation.

## 3.0-dev.22 — 2026-11-19
Fixes from the five-student follow-up on dev.21 (Emma, Leila, Jun, Raj, Tomás).
- **Correction (Raj):** dev.17 called 3–8-slit Nice-fringes results far-field when their spacing was near λD/d, and its changelog said "2–8 slits within 8% of λD/d". Both were wrong: where the slit beams overlap, the near-field pattern repeats every λD/d anyway, and 7 and 9 slits give slit images (269 vs 536, 199 vs 381 nm). All Nice-fringes picks for three or more slits sit near a quarter, a half or a whole number of Talbot lengths (3–5 slits ≈ 0.25, 6 and 8 ≈ 0.5, 7 and 9 ≈ 1, 10 and 11 ≈ 2; checked). The status line now gives the spacing, λD/d and the screen distance in Talbot lengths, and says "double-slit fringes" (two slits) or "near field … image of the slits, not the textbook N-slit pattern". Physics text corrected to match.
- **Correction (Tomás):** Views and quiz Q1 said the band edges depend on the |ψ|² starting distribution. They follow from the guidance flow alone (each trajectory keeps the fraction of |ψ|² on its side); the |ψ|² hypothesis fixes the fraction of particles per band and the hit distribution.
- Normalization numbers corrected: with two slits open the peak of T is 0.73 at d = 3σₐ, 0.94 at about 7σₐ, 0.998 at the default 10σₐ (checked with aperture()); the text said 0.73–0.9.
- Stats row "Fringes" counts only slits without a detector ("none (detectors)" when fewer than two remain).
- Wide slits: the slit width maximum shrinks when the openings could not fit side by side on a 5000 nm wall (16 slits: 100 nm), so openings never overlap (Raj: 16 slits at 200 nm still overlapped).
- Links: view=orthodox / pilotwave / pw / mw accepted; unknown names ignored (view=orthodox lost the caption sentence).
- Caption: hit swatch matches the drawing (coloured by slit or by wall position in Pilot Wave); particle colours shown alongside detector-record colours; closed slits with hits still on screen stay in the legend; band-line sentence only without detectors; "black strip with green bars"; one packet = N particles.
- "Apply at the wall" checkbox is unticked at every quiz question; the closed-slit tooltip says it reopens without a detector while ticked.
- Detector button for two slits: "Detector @ 2 (lower)", matching the numbered slit buttons.
- Contrast: removed the leftover opacity 0.7 on the view label and shortcut hint (light theme was 3.5:1); closed slit buttons full opacity with a dashed border; dark edges on light swatches, slit-coloured hit markers and band numbers.
- Accessibility: the image role moved from the canvas container (which holds the range sliders) to the main canvas; Hits tooltip explains packets.
- Quiz: each question opens its explanation with one plain sentence; no kets (Q6 in words); Q4 "In the orthodox view, quantum mechanics…"; Q3 qualifies decoherence (erasable ideal records); Q6 stem says macroscopic detector; captions say "the dot".
- Wording: "In short" no longer uses path language; Many-Worlds sentence in "Closing a slit…" made specific; 3D paragraph no longer says "the two" components.
- Not changed: colour mode chosen by the quiz is still remembered in the browser (Emma); Views still lacks a plain opening paragraph.

## 3.0-dev.21 — 2026-11-19
Accessibility and 16-slit geometry (Jun, Priya, Sofia).
- Slit colours for three or more slits replaced: worst pair over all eight is ΔE 8.1 under normal, deutan and protan vision (was 1.4; checked with the dataviz palette validator and a Machado-matrix search over Okabe–Ito/Tol colours); neighbouring slits ≥ 15.7. Slits 9–16 repeat the eight; band numbers and the caption legend give the slit number too. Two slits keep cyan/orange.
- Default hit colour blue (#2f6fd6) instead of red on the green curve; the old red default in saved settings is migrated.
- Spectrum colouring uses viridis (0.2–1) instead of an HSL rainbow; tooltip says blue (top) to yellow (bottom).
- Accessible names for the λ, separation, distance and screen-length number boxes; the canvas stack is one image with a description (canvases aria-hidden); keyboard focus stays on a slit button after it is pressed.
- Contrast: view label and shortcut hint #b9c8d4 (dark) / #3f5868 (light), footer link and caption darker in the light theme, closed slit buttons less dimmed (strike-through kept).
- Slit openings never overlap: the separation has a minimum of one core width plus 10 nm (2·extent·σ + 10), and the minimum screen length rises with the number of open slits when needed (16 slits at default width: 1600 nm), with a status message. Previously 16 slits were clamped to 74 nm with 90 nm cores and the wall vanished.
- Expanded view on a portrait phone: the canvas was placed in the 36 px toolbar row (a more specific rule overrode the phone layout); now it fills the rest of the screen (390 × 844: 374 × 740 px). The caption is hidden in expanded view.

## 3.0-dev.20 — 2026-11-19
Classroom aids from the review (Emma, Leila, Sofia, Jun).
- Caption under the canvas: one plain sentence for the current view; a screen legend (curve = predicted distribution, dots = hits ± √n, black strip = detector pixels); and a colour legend, with swatch plus text, for detector records ("slits 1, 3, 4 (no detector fired) · slit 2 (its detector fired)") or, in Pilot Wave By slit, for the slits. Many Worlds says what "Branch records" counts.
- After a live slit change the previous prediction stays on the screen as a dashed curve until the slices that crossed the wall before the click have reached the screen ((screen − wall)/v); the legend says what the dashed curve is.
- "Apply slit changes when the packet reaches the wall" (checkbox under the slit buttons): during a run, an open/close waits until the newest packet's centre crosses the wall (the button blinks while waiting). While ticked, a closed slit reopens without a detector.
- Quiz Q5 "Watch it" ticks that box and closes slit 2 automatically at the wall, so the demonstration no longer depends on timing a click.
- Physics opens with an "In short" paragraph in plain words.

## 3.0-dev.19 — 2026-11-19
Review follow-ups: near/far field, quiz, interpretive wording.
- Stats panel row "Fringes": λD/d for two slits; for three or more, "near field (far field ≫ W²/λ)" with W the width of the open slit array (e.g. 4 slits at 300 nm: ≫ 16 µm). Tooltip explains; the Near and far field paragraph was added in dev.17.
- Quiz rebalanced: the correct answer is no longer the longest option (lengths now within a few characters, Q1 correct answer the shortest); new distractors (Q1 "Any of them: the waves overlap there", Q2 "Slit 2 is blocked", Q3 "Weaker fringes from neighbouring pairs" / "detectors absorb the particles", Q6 "One branch until the particle hits the screen" / "Two branches that still interfere later", replacing "collapses", which is not a Many-Worlds answer). Explanations: Q1 states the |ψ|² starting-position assumption and points to Q4; Q3 says the single-slit bumps can be separate humps for wider spacing; Q5 no longer calls the guiding part an empty wave downstream and says all three views predict the same record; Q6 flags the Born-rule assumption in Many Worlds.
- Wording (Hannah, Tomás): detector records stated for the part of the wave through each slit (no path language in the neutral section); decoherence paragraph says a single ideal record could be erased, a macroscopic one effectively not, and that decoherence does not select an outcome; empty-wave paragraph rewritten (empty at the slits, guiding behind the wall); Views: band positions use the |ψ|² (equivariance) assumption and bands are unobservable; Many-Worlds weights as probabilities is assumed and debated (Views and slow-motion text); y points down; N_hits distinguished from the number of slits.

## 3.0-dev.18 — 2026-11-19
- **Fix:** 3.0-dev.17 had a JavaScript syntax error (an apostrophe inside a quoted string in the slit-balance text, packet-engine.js), so the page loaded without the Q-Ontic template. Added a syntax check of every file to the pre-push routine, run after the last edit.
- Shared shortcuts (shared/qontic-shortcuts.js, all apps): Space on a control reached by keyboard (Tab/arrows) now presses that control instead of toggling play/pause. After a mouse click or tap, Space still toggles play/pause, and the button is no longer pressed as well on key-up. (:focus-visible could not be used: any key press makes focus visible.)
- Shared quiz (shared/qontic-quiz.js/.css, also Hydrogen): after an answer the correct one is marked (✓ and a green outline, not colour alone); "Start again" after the last question resets the score. Wrapping on phones and focus handling were already in the shared module (Hydrogen 1.2.13–1.2.17); the N-slit app now loads that version (?v=9). Checked: at 360 px all six questions stay 360 px wide.

## 3.0-dev.17 — 2026-11-19
Fixes from the ten-student review (context/2026-11-19-n-slit-ten-student-review.md), text and N-slit logic.
- Old two-slit detector sections in Physics and Views replaced by general ones: equations for detectors on any set D of slits (records |d_k⟩ and "none fired" |d₀⟩); Pilot Wave guided by its detected slit's wave, or by the coherent wave of all undetected slits (the old text said "one effective single-slit packet", wrong for N > 2); Many Worlds counter counts screen records only. Colours: each record in the colour of its first slit.
- Views: trajectory integration is adaptive Dormand–Prince 5(4) (since dev.13), not fourth-order Runge–Kutta.
- New Physics paragraph "Near and far field": the textbook N-slit pattern needs D ≫ W²/λ (≈ 80 µm for 8 slits 290 nm apart); two slits are special; with more slits the screen here is in the Fresnel field, with Talbot images of the slits near multiples of 2d²/λ. Paraxial vs exact Helmholtz propagation: up to 4–10% of peak density at default and Nice-fringes settings (checked: 3.6–9.5%).
- Nice fringes: a pattern whose centre is not clearly tallest is rejected (10 and 12 slits had two equal central peaks reported as "central tallest"); the search prefers spacing near λD/d; the status reports the measured spacing and, when it is far from λD/d, says the bumps are a near-field image of the slits. Results: 2–8 slits within 8% of λD/d; 10 slits near-field image (stated); 12 and 16 none (explained).
- Normalization text: C is the closed-form bound for exactly two open slits and the numerical maximum for three or more; the peak of T (0.73–0.9 vs 1) changes the absorbed fraction, not the pattern.
- Slit balance: text and tooltip say it works only with exactly two open slits.
- ?quiz=1: Q1 now sets Color: By slit (the selector is attached after the quiz prepares Q1; the quiz now waits for it).
- Detector button: stale native title removed (two contradictory tooltips).
- Q5 explanation no longer says "press Start" after Watch has started the run.
- Many Worlds caption: "the hit markers on the histogram are the record of one sampled branch" (there are no dots on the canvas).

## 3.0-dev.16 — 2026-11-19
- Quiz tab (between Simulation and Physics), with the shared quiz module used by the Hydrogen app. Six questions, each with a still schematic of the apparatus drawn by the app so the simulation does not give the answer away: (1) Pilot Wave, three slits, which slit for a hit near the top; (2) detector on one of four slits; (3) detectors on all four; (4) Orthodox, which slit for a hit in the central fringe (no slit assigned without a measurement at the slits); (5) Pilot Wave, closing a slit after the packet has passed (empty wave); (6) Many Worlds, what a detector at one slit does. Each question sets the app (paused); "Watch it in the simulation" starts it. ?quiz=1 opens on the Quiz tab with the Simulation tab locked until the first answer.
- Facts behind the questions checked against the model: slit bands in order from the top (slitBands); densities with detectors (n-slit tests). A question on 2 → 8 slits was dropped: within the 3000 nm screen-distance limit the 8-slit pattern is near-field, not the textbook narrowing.
- Shared module (shared/qontic-quiz.js): two opt-in options, shuffle (random answer order) and score (running score after each first answer). Both default off; the Hydrogen quiz is unchanged (checked).
- The legacy global rule canvas{position:absolute} is overridden inside the quiz panel.

## 3.0-dev.15 — 2026-11-19
Pablo's requests of 2026-11-19.
- Which-slit detectors at any set of slits. Each slit button cycles open → closed → open with a detector (D). Closing stays one click, so a slit can still be closed mid-packet without resetting the run; adding or removing a detector starts a new run, as before.
  - Physics: one branch per detected slit (record "this slit") and one branch for no detector firing, in which the undetected open slits stay coherent. Screen density Σ_{k∈D}|ψ_k|² + |Σ_{j∉D}ψ_j|². Detectors on every open slit: Σ_k|ψ_k|², no interference. For two slits identical to the single-detector model (branch i = aperture i). The model layer (sourceBranches, transmittedMixture, stepSource) was already general; the engine now builds the branches with detectorBranches().
  - Wave picture: any number of branches, each in the colour of its first slit (cyan/orange for two slits, as before). The density-weighted colour and phase are computed when a column is filled, not per frame: 16 slits with 8 detectors, frames 50 → 26 ms (headless).
  - D markers on every detected slit, in 2D and 3D.
  - Detector button: "No Detectors" puts a detector on every open slit; otherwise it removes them all. Label lists the detected slits.
  - Links: slits=1d0… (d = open with a detector); old links with wp=slitK still work.
  - Physics text: N-slit detector formula, and a paragraph on detectors as decoherence (Zurek, Rev. Mod. Phys. 75, 715 (2003)); ideal detectors only, partial which-path information not modelled (Englert, Phys. Rev. Lett. 77, 2154 (1996), for two paths). Views text: what each view says with several detectors. Both references checked.
- "Both Slits" cycle button removed (the slit buttons do the same and more). Nice fringes moved to the row with the Detector button.
- Up to 16 slits; eight more slit colours (lighter tints of the first eight). With more than 12 slits Nice fringes finds no clean pattern within the 3000 nm screen-distance limit (near field of the grating) and now says so.
- Electron/Neutron selector moved to Advanced (top row, "Particle").
- Tests: n-slit.mjs +6 checks (branch assignment; density with detectors at slits 2 and 4 equals |ψ1+ψ3|² + |ψ2|² + |ψ4|² to rounding; all detectors = Σ|ψk|²; PW hits with two detectors follow the prediction, KS 0.021; 16-slit mask). model-checks and resize-state updated for the detector set.

## 3.0-dev.14 — 2026-11-18
- Defaults doubled at Pablo's request: source width σ 200 → 400 nm (slider maximum 400 → 800 nm), packet length σ 50 → 100 nm.
- Packet-length cap relaxed from a quarter to half of the shorter of source–wall and wall–screen distances (still ≤ 200 nm), so 100 nm is allowed with the default 225 nm source distance (cap now 112 nm). The cap is a display choice: the packet starts off canvas and the transverse pattern does not depend on σx.
- Cost: the longer packet covers more of the picture; headless, Pilot Wave with 2 slits, frames ~18 → ~22 ms. Physics unchanged.

## 3.0-dev.13 — 2026-11-18
- Still slow after the slits in Pablo's case: 4 slits, Pilot Wave, Phase & |Ψ|, 823 particles per packet, packet interval 120 ps (two packets in flight, ~1660 particles), speed 2.2×, source width 400 nm, packet length 85 nm. In headless Chrome the physics was 3 ms per frame and never truncated; the frame time went to drawing: the wave ~14 ms and the trajectories ~11 ms of a 37 ms frame (16.6 ms with both off). With a 120 ps interval the second packet leaves about when the first crosses the wall, which is why it slows there.
  - Trajectory tails: the running arc length of each tail is cached (only new segments measured); it was re-measured every frame (~200 000 segment lengths). Identical to the old trimTail to 2.5e-14.
  - Trajectory drawing: points closer than 1.5 px to the last drawn point are skipped (the newest point is always drawn).
  - Wave image: a fast pixel loop for the 2D view without the which-path detector; per-column quantities hoisted, no hypot. Pixel-identical to the general loop in all four Show modes (checked with getImageData).
  - Pilot-wave guidance behind the wall: each trajectory now has its own error-controlled step (Dormand–Prince 5(4), tolerance 1e-4 nm per step) instead of a fixed RK4 step of ~2 nm shared by all particles; positions between accepted points are drawn by cubic Hermite interpolation, and the screen is always an accepted point. Against a fine fixed-step reference: screen positions within 0.02 nm (2, 4, 8 slits; screens 1000–3000 nm). Against dev.12, over 300 full trajectories per case: screen positions within 0.05 nm, drawn positions in flight within 0.9 nm (sub-pixel); 5–8× less stepping time. Transport test unchanged (same hits, same CDF error).
  - Result in Pablo's case (headless): frame 37 → 28 ms; physics 3 → 1.5 ms.
- Not changed: high-quality image smoothing when the wave image is scaled to the canvas (medium would save ~3 ms per frame here, but changes the look slightly; cheap on a GPU).

## 3.0-dev.12 — 2026-11-18
- Faster drawing (Pablo: the simulation slows down, especially after the packet crosses the slits; 4 slits, Pilot Wave, Phase & |Ψ|, ~500 particles). Profiling showed the physics took 1–2 ms per frame; drawing took ~48 ms per frame in headless Chrome. A slow frame also lets more simulated time pass, so the next frame has more physics steps, which made it worse behind the wall where each step sums over every aperture.
  - Wave image: columns where the packet envelope is too small for any pixel to reach visible opacity are skipped (the image is unchanged; the packet covers a fraction of the field). Not in the 3D view, which needs every height.
  - Phase & |Ψ|: colour index from cos θ directly instead of atan2 then cos; the legend wheel is drawn once per palette instead of on a new canvas every frame.
  - Particles: colour group computed once per particle per frame. The dots were drawn by scanning every particle for each of ~50 colour groups, reading a DOM control each time (~25 000 reads per frame).
  - Field grid: x-dependent factors computed once per column (sourceColumn), not once per cell.
  - Trajectories: allocation-free guidance velocity (sourceVelocity) with factors shared by the two RK4 midpoints; apertures whose Gaussian factor is below e^-40 of the largest are skipped. Over 300 full trajectories per case (2, 4, 8 slits), final positions agree with the previous integrator to 3e-16 (units of 100 nm).
  - Result, headless Chrome, 4 slits, 500 particles, Phase & |Ψ|: draw time 48 → 8–11 ms per frame; frame time 60 → ~20 ms. 8 slits with 1000 particles: physics 3–8 ms per frame behind the wall at ~30 ms frames.
- frameStats.drawMs added to the read-only test probe.

## 3.0-dev.11 — 2026-11-17
- Smoother motion (Pablo: the wave evolution looked bumpy under some conditions). The simulated time per frame followed each frame's real duration, so one slow frame made the packet jump. It now follows a smoothed frame time, held within ±20% of the running average; the clock catches up over the following frames. Headless Chrome: frames with a >1.5× jump in simulated advance went from up to 3 per 8 s run to 0. The physics loop was never truncated by its 12 ms budget in any tested condition (2 and 8 slits, Pilot Wave and Orthodox, with and without Nice fringes).
- Read-only probes for testing: qonticPacketEngine.simTime and .frameStats.

## 3.0-dev.10 — 2026-11-17
- Fixed faint streaks that ran past the packet along the dark fringes (all display modes). The opacity of each pixel was the stationary field's visibility times the square root of the packet envelope; the square root let the stationary pattern show well ahead of and behind the packet, cut by its nodal lines. The envelope now enters linearly: the packet core is unchanged, its edges fade sooner.
- Phase & |Ψ|: |Ψ| is shown as opacity over the background instead of darkening the colour, which drew a black rim around the packet. The legend wheel fades the same way.

## 3.0-dev.9 — 2026-11-17
- "Phase + amplitude" renamed "Phase & |Ψ|". The colour now comes from cos θ through the wave palette, as in "Phase (cos θ)", instead of θ itself: the palette ends no longer meet at θ = ±π, so there is no seam (Pablo's screenshot showed it with the Blue palette). Brightness is still |Ψ|. Legend wheel relabelled (cos θ; 0 and π at the sides).
- Removed the Cyclic palette added in 3.0-dev.8; with cos θ it is not needed.

## 3.0-dev.8 — 2026-11-17
- Phase + amplitude now takes its colours from the wave palette chosen in Display (Pablo's request): θ from −π to π runs across the palette, θ = 0 in the middle; brightness is |Ψ|. The phase wheel and the 3D legend follow the palette.
- New cyclic palette "Cyclic" in the Display list (same colour at both ends). The other palettes are not cyclic and show a seam where θ = ±π; palettes that start dark (Inferno, Red) also make phases near −π look dim.

## 3.0-dev.7 — 2026-11-17
- New wave display "Phase + amplitude" (Show menu, Core and Display): hue = phase θ of Ψ, brightness = |Ψ| (domain colouring). Colour from the wave palette chosen in Display (θ from −π to π across the palette; a non-cyclic palette shows a seam at θ = ±π); the phase includes the moving carrier, as in the "Phase (cos θ)" view. A phase wheel (dark centre = small |Ψ|) is drawn in the 2D view and in screenshots; the 3D legend shows the hue ring. The value-range control scales the brightness. With the which-slit detector the branch colouring (cyan/orange) is kept.

## 3.0-dev.6 — 2026-11-17
Nice fringes is fast (Pablo: it took forever).
- 90% of the search time was the mask normalization for N > 2, recomputed for every candidate geometry by scanning the slit array in steps of σ/40. Now a σ/4 scan plus golden-section refinement: same maximum (tests unchanged), ~50× cheaper. This also speeds up every reset with more than two slits.
- Smaller search grid (the widest source and narrowest slits were always chosen; the old full grid remains as fallback). The animation is paused during the search, since the result starts a new run anyway, and resumes afterwards; slices of 40 ms yielded through a MessageChannel instead of 8 ms setTimeout slices that competed with the animation.
- The wave picture of a new run is filled from the packet front onward instead of all at once, with the display normalization estimated on a coarse sub-grid.
- Fixed: with many slits the chosen separation was clamped by the slider's old maximum (e.g. 240 → 109 nm for 8 slits). The screen length and slit width are now applied and the limits recomputed before the separation is set.
- Node: 8 slits 820 → 84 ms; headless Chrome, click to applied: 2 slits 128 ms, 8 slits 301 ms (was 1.1–1.5 s). Same geometries and bump heights.

## 3.0-dev.5 — 2026-11-17
- **Nice fringes** button (Core): searches slit width, separation, screen distance, screen length and source width (λ = 50 nm) for a screen pattern with a clean series of bumps, the central one tallest and heights falling off on both sides, judged on the screen density computed with the app's model (js/nice-fringes.js). Runs in 8 ms slices so the animation does not freeze; applies the result, starts a new run and reports the choice. Results for all slits open: N = 2: d 640 nm, D 3000 nm, screen 1720 nm; N = 3: d 440, D 2200; N = 5: d 240, D 2200; N = 8: d 280, D 1800; seven bumps each. tests/nice-fringes.mjs.
- Slit switching: measured cost of a switch ~16 ms (plus ~9 ms for the bands just after and ~4 ms per frame of grid filling); simulated time keeps advancing through the click (headless check with 4× CPU throttling). Pages may serve the previous index.html for up to 10 minutes after a push.

## 3.0-dev.4 — 2026-11-17
No pause when a slit is opened or closed (Pablo: the whole wave stopped for a moment).
- The new field grid (640 × 480 points × N slits, ~175 ms with 8 slits) was built in one go at the click. It is now built column by column from the wall outward: the columns between the wall and the boundary of the new pattern are filled at once, the rest ~4 ms per frame. Columns before the wall are copied from the previous grid.
- The pilot-wave bands are computed just after the click instead of inside it; the click no longer rebuilds the Physics text or redraws twice.
- Headless Chrome, PW: click handler 150–260 ms → 4–10 ms; worst frame after the click 250–370 ms → 83–100 ms, the same as this browser's ordinary worst frame.

## 3.0-dev.3 — 2026-11-17
Opening or closing a slit no longer resets the run (Pablo's request).
- The mask is switched for the slices that cross the wall from that moment on. In the paraxial model each transverse slice moves at v and receives the mask when it crosses the wall, so the part of the packet already beyond the wall keeps the old field, and Pilot-Wave particles in it keep their old guidance (each particle keeps the mask epoch in force when it crossed). The wave image, the 3D surface and the flow arrows show, at each x, the mask in force when that slice crossed: t_w = t − (x − L)/v.
- Hits and the clock are kept; the prediction curve and the pilot-wave bands switch to the new mask. Orthodox/Many-Worlds outcomes of slices not yet at the wall are redrawn from the new screen law. Direct PW particles not yet at the wall lose their transmission conditioning and face the new mask by the ordinary rule.
- Still reset: number of slits, geometry, slit width, wavelength, detector, and Many-Worlds slow-motion branching (and any change made while the detector is on).
- Physics and Views: new paragraphs ("Opening or closing a slit during a run"; "Closing a slit after the particle has passed", empty waves, Hardy, Phys. Lett. A 167, 11 (1992)).
- Checked in headless Chrome: two slits, closing the lower slit while the packet crosses the wall; five slits, closing the middle one with flow arrows on; Orthodox keeps its record (400 → 800 hits); changing N still resets; no console errors. Node suites unchanged.

## 3.0-dev.2 — 2026-11-17
Speed with many slits (Pablo: with 8 slits in Pilot Wave the simulation slowed down when the packet went through the slits).
- The mask normalization for N > 2 (a grid search, ~0.1 ms) was recomputed for every particle crossing the wall; it is now computed once per configuration. aperture() with 8 slits: 93 µs → 0.9 µs per call.
- Guidance with many slits: factors shared by all apertures are computed once per position, the coherent sum no longer allocates one object per aperture, and apertures whose Gaussian factor underflows to exactly zero are skipped. Same results. Pilot-Wave step with 8 slits: 2.9 → 1.0 µs per particle (2 slits: 0.42 → 0.26 µs).
- The separation limit (an O(N²) binary search) was recomputed every frame; it is now cached until the geometry changes.
- Headless Chrome, Pilot Wave, 9 s from Start: 8 slits 21.6 fps vs 22.6 fps for 2 slits (before: 18.9 vs 23.6). Same tests pass.

## 3.0-dev.1 — 2026-11-17 (N-slit preview, draft)
Copy of the published analytical double slit (2.128) with the number of slits as a parameter. The published app is unchanged.
- Number of slits N = 1–8 and an open/closed button per slit (Core). Slit k is centred at (2k − 1 − N) d/2. The "Both Slits" button cycles all open → slit 1 only → … → all open; for N = 2 it behaves as before.
- Which-slit detector at any open slit. It records "this slit" or "another slit": two branches, {detector slit} and {other open slits}, with the other slits still coherent. For two slits this is the previous model exactly (test).
- Aperture-mask normalization for more than two slits: the exact maximum of the summed Gaussians on a fine grid (two slits keep the previous closed form).
- Separation limit scales with the outermost slit's offset so that all slit cores stay on the wall. Fixes a display bug (also in 2.128): when the separation was clamped, the number box kept the old value.
- Pilot Wave, Color: By slit: one colour per slit (cyan/orange kept for two slits), and the screen band reached by each slit's particles, from the quantile map, marked with dashed edges and slit numbers. Hits collected in other views take the colour of their band.
- Physics and Views: N-slit section (geometry, detector branches, which slit from the screen).
- Saved state uses its own storage key (nSlitState) so it never overwrites the published app's settings.
- Tests: tests/n-slit.mjs (26 checks: two-slit identity of the detector model, mask ≤ 1, flux, detector branch densities, PW Monte Carlo vs prediction with and without detector, every PW hit inside its slit band, band weights). Existing tests pass, except the single-hit histogram-scale assertion in source-packet.mjs, which also fails in the published 2.128.

## 2.128 — 2026-10-21

- Opens in Orthodox when no link or saved state chooses a view. Previously the checked Particles/Trajectories boxes made Pilot-Wave the default.
- Slit button reads Upper Slit Only / Lower Slit Only, matching the which-slit detector (Detector @ Upper / Lower) and the companion notebook.
- Many-Worlds readout renamed "Branch records"; its tooltip says N^m depends on the detector pixel size and is not a physical count of worlds.
- Phones (≤600 px): the distance-scale and color-range overlays are hidden so the source and wall stay visible; the greyed PW/O/MW header chip is hidden (≤560 px), since the view pill above Start names the view.
- Changes follow simulated student reviews of the double-slit notebook.
- Fixed: the wave palette swatch in the Display tab was blank on page load and appeared only after the palette was changed. It was drawn while its row was not yet attached to the page, so the lookup by id found nothing; the template now keeps a direct reference to the swatch. The default palette name is also recorded at start-up, so the swatch tooltip names it.
- Rollback: backup/double-slit-before-palette-swatch-2.127-20261021.

## 2.127 — 2026-10-20

- Restored the 3D graphics of 2.125: palette-colored surface, previous floor and background, standard particles and trails, 96×64 mesh. The Phase hue style of 2.126 is removed.
- Kept from 2.126: the Pilot-Wave 3D Wave-opacity slider (default back to 55%) and Particle-height slider, and the larger canvas.
- Kept the phase wheel: in 3D, when Show is set to Phase, a corner wheel gives the surface color for each phase angle θ using the current palette and display range (cos θ, so +θ and −θ share a color). Hidden for |Ψ|², log |Ψ|² and with the which-slit detector.
- Rollback: backup/double-slit-before-3d-restore-2.126-20261020.

## 2.126 — 2026-10-20

- 3D "Phase hue" color style (new default): the surface is colored by the complex phase θ (blue 0, violet +π/2, red ±π, magenta −π/2) with brightness set by the amplitude, on a dark floor; a phase-wheel legend appears in the corner. "2D palette" keeps the previous coloring. Selector in the 3D toolbar.
- 3D Pilot-Wave in Phase hue: glowing particles and thick trails; uniformly colored particles are shown in yellow.
- 3D toolbar sliders in Pilot-Wave: Wave (surface opacity, default 75%) and Particle height (height of the plane carrying particles and trails, 0–110% of the surface height; display only).
- Finer 3D mesh (240×160) so the phase bands are resolved.
- Larger canvas: the layout reserves 150 px instead of 270 px of the viewport height for page chrome, so the 4:3 canvas grows (e.g. 907×680 → 1067×800 on a 1500×950 window) and side margins shrink.
- Rollback: backup/double-slit-before-3d-style-2.125-20261020.

## 2.125 — 2026-10-20

- 3D: Pilot-Wave particles and trajectories always lie on the fixed apparatus plane (the physical x–y plane) instead of riding the graph of the wave.
- 3D in Pilot-Wave: the wave surface is semi-transparent (55%, times the Wave opacity slider) and drawn after the particles so they stay visible beneath it. Orthodox and Many-Worlds keep the nearly opaque surface.
- Views text updated.
- Rollback: backup/double-slit-before-3d-plane-2.124-20261020.

## 2.124 — 2026-10-20

- Removed the Front/back color mode added in 2.123 (reverted).
- 3D view now applies the Display-tab opacity sliders: wave, slit wall, detector, probability curve, screen hits and error bars, particles and trajectories. Previously only the on/off state reached 3D.
- In 3D, hiding the detector wall no longer hides the probability curve and hit histogram.
- The 3D slit wall uses the Slit wall color swatch.
- Rollback: backup/double-slit-before-3d-opacity-2.123-20261020.

## 2.122 — 2026-10-20

- Phone layout: smaller distance-scale and color-range overlays so the source and slits stay visible; Core option row wraps; compact PW/O/MW header badge; smaller Feedback button and room to scroll past it.
- 3D view hides the 2D color-range control, which does not affect the 3D surface.
- The Slit wall color swatch now sets the drawn wall color (default light gray-blue; the old unused blue default is migrated).
- Pilot-Wave readout "No hit: absorbed · missed" explains why the same per-packet setting gives fewer hits than Orthodox and Many-Worlds.
- Particle selector tooltip and Physics text: at fixed λ the mass changes only speed, energy and time scale.
- Separation and slit-width limits also respect the ±3σ Direct PW window (strictest of the displayed windows); Views text notes it.
- Cleanup: removed unreferenced packet-preview.js, spherical-worker.js, sampleFromCDF and lcg; one ?v= suffix for all local modules; README links and app.json description updated.
- Rollback: backup/double-slit-before-open-issues-2.121-20261020.

## 2.121 — 2026-10-19

- Saved settings restore values within each control's own range; a reload no longer widens λ to 500 nm or the source-position minimum to 0.
- Share links keep the which-slit detector and now also carry detector pixels, particle type, Direct PW, Pilot-Wave color mode, Show option, playback speed and flow settings.
- Many-Worlds branch counter shows N^m exactly (e.g. 16² = 256) instead of rounding to a power of ten.
- The app starts when browser storage is blocked (in-memory fallback); a corrupted saved state is ignored.
- Reset Defaults clears only this app's settings, not every app on the site.
- Readout renamed Packet Speed: it is the group velocity ħk/m (tooltip said phase velocity ω/k). Energy tooltip: central packet energy, not assigned to individual trajectories. Updated stale tooltips.
- 3D text and Height menu use θ for the phase (φ is the transverse field). Views text: the eye button hides the wave in 2D and 3D.
- Rollback: backup/double-slit-before-review-fixes-2.120-20261019.

## 2.120 — 2026-10-05

- Physics explains reduced-model probability current, streamline slope and physical arrow-shaft arc length.
- Views explains field markers across interpretations, density fades and capped display motion; distinguishes the overlay from particle histories and weak-measurement reconstruction.
- Corrected the histogram explanation to the shared expected-count scale introduced in 2.116. No physics or overlay behavior changed.
- Rollback: backup/before-flow-math-2.119-20261005.

## 2.119 — 2026-10-05

- Flow Length and Separation use physical nm units. Arrow shafts follow the flow curve for the selected arc length.
- Continuous transmitted marker paths through the slit plane; arrowheads anchor forward motion even when the field turns.
- Fixed opacity reference and boundary fade prevent earlier arrows brightening as the leading arrows leave the wall or screen.
- Rollback: backup/before-flow-boundaries-2.118-20261005.

## 2.118 — 2026-10-05

- Arrows checkbox, Length slider and value share one row; Streamlines and Separation share the next.
- Limit animated marker displacement per frame to prevent backward temporal aliasing at high speeds or after long frames. Physics timing and detector statistics are unchanged; tooltip explains the display limit.
- Rollback: backup/before-arrow-alias-fix-2.117-20261005.

## 2.117 — 2026-10-05

- Three flow-control rows: arrows; arrow length; streamlines and separation. Explanation moved to an information tooltip.
- Arrow markers advance continuously along analytical flow curves with smooth density fades. Streamline separation now controls curve spacing.

## 2.116 — 2026-10-05

- Flow toggles and arrow spacing share one compact row; yellow arrows and orange streamlines contrast with blue waves.
- Probability curves and hit histograms now share a count scale (N × bin width × normalized density), including 3D and branch previews.

## 2.115 — 2026-10-05

- Optional 2D current-velocity arrows and calculated streamlines in Display, shared by all interpretations; default off.
- Arrow density and length controls; fade weak-density regions. Suppressed in 3D and during which-slit detection.
- Pre-change rollback branch: backup/double-slit-before-flow-2.114-20261005 (commit 1a2ba0bc50a43fb7435b6cd43e936fd8b724ae7a). Restore only this app directory from that branch to retain unrelated later changes.
- This release visualizes analytical flow; it does not simulate weak-measurement readings.

## Version 2.114 — 2026-09-29

- Replaced the individually wrapped phone toolbar buttons with one three-dot Simulation tools button and a labeled floating menu that is closed by default.
- Close the phone tool menu after an action, an outside press, or Escape, while preserving the full toolbar on larger screens and in expanded view.

## Version 2.113 — 2026-09-29

- Removed the larger-header mode and its button; the shared template now always uses the compact header.
- On phones, section tabs use short labels and the active interpretation becomes a compact O/PW/MW badge.

## Version 2.112 — 2026-09-29

- Added a remembered Hide Header control with a small restore button that remains available while the header is hidden.
- On tablet and phone widths, the simulation canvas now appears before the controls and statistics.

## Version 2.111 — 2026-09-29

- Kept the section tabs and interpretation label left-aligned while moving the Screenshot and other canvas actions to the right edge of the responsive header.

## Version 2.110 — 2026-09-29

- Left-aligned the section tabs, interpretation label, and header tool groups.
- Added responsive desktop, tablet, and phone layouts with wrapping header controls, stacked workspaces, compact branding, and touch-sized controls.

## Version 2.109 — 2026-09-29

- Moved the canvas utility controls into the application header beside Simulation, Physics, and Views.
- Added a remembered compact/comfortable header toggle with a smaller logo and title in compact mode.

## Version 2.108 — 2026-09-29

- Scale the observed histogram to its largest upper error-bar endpoint, n + √n, so every square-root error bar is fully visible while the prediction retains its independent probability-density scale.
- Apply the complete-error-bar scaling consistently in the 2D histogram, interactive 3D detector wall and Many-Worlds branch records.

## Version 2.107 — 2026-09-29

- Normalize the green analytical probability-density curve to fill the histogram panel independently of the number of recorded hits.
- Scale observed hit markers by their own maximum and keep their square-root error bars within the panel, preserving convergence of the two normalized shapes at high statistics.
- Apply the independent prediction and observation scales consistently in the 2D histogram, interactive 3D detector wall and Many-Worlds branch records.

## Version 2.106 — 2026-09-26

- Assigned Pilot-Wave particles their “By slit” display color at injection, using the analytically known future wall-crossing position.
- Kept that display color unchanged when a particle reaches or is absorbed at the slit wall; the physics and transmission decisions are unchanged.

## Version 2.105 — 2026-09-25

- Changed the wave-palette button into a live horizontal preview of the selected palette.
- Kept the preview and its accessible label synchronized when a palette is selected or restored.

## Version 2.104 — 2026-09-25

- Kept Pilot-Wave particles and trajectory tails at a fixed apparatus-plane z level whenever the 3D wave is hidden, instead of projecting them onto an invisible cached surface.
- Preserved the optional wave-surface lift only while the wave is visibly rendered; physical x–y guidance remains unchanged in both cases.

## Version 2.103 — 2026-09-25

- Aligned the 3D reference grid, floor, slit wall, detector and histogram baseline with the midpoint zero plane for cos φ, Re Ψ and Im Ψ.
- Kept the zero plane at the bottom for nonnegative |Ψ|² height, so signed waves now extend visibly above and below the apparatus plane without hiding the geometry.

## Version 2.102 — 2026-09-25

- Restored a monotonic display-only contrast boost for amplitude-based 3D heights so the transmitted wave remains visible relative to the stronger incident packet.
- Applied the same enhanced envelope to |Ψ|², Re Ψ and Im Ψ heights while preserving nodes, ordering, particle guidance and all probability calculations.

## Version 2.101 — 2026-09-25

- Renamed the geometrical detector dimension from “Screen height” to “Screen length” throughout the controls, tooltips, accessibility text and drag readouts to avoid confusion with 3D wave height.
- Labeled the corresponding 2D and 3D geometry handles “Length.”
- Made the drawn slit openings follow Direct PW’s fixed ±3σ preparation window, eliminating the misleading appearance of trajectories crossing solid wall while preserving the selected expert extent in other views.

## Version 2.100 — 2026-09-25

- Capped the display-only carrier-phase motion in the 3D view at 2 rad/s, removing temporal aliasing and abrupt frame-to-frame surface changes.
- Applied the same slowed display phase to the 3D height and its wave colors while leaving density, trajectories, guidance, probabilities and simulation time unchanged.

## Version 2.99 — 2026-09-25

- Replaced wrapped phase angle as a 3D height with smooth cos φ, eliminating the artificial moving cliff at the ±π boundary.
- Added a remembered Pilot-Wave toolbar control to hide or show the wave without changing the guidance field, particles, statistics or playback.
- Clarified that Re Ψ and Im Ψ retain genuine carrier oscillations, while cos φ is continuous but does not uniquely determine the phase angle.

## Version 2.98 — 2026-09-25

- Separated the overlapping 3D slit handles: Width is attached to the upper slit edge and Separation to the lower slit center.
- Added a persistent 3D Height selector for normalized |Ψ|², wrapped phase θ, normalized Re Ψ and normalized Im Ψ; signed quantities use the middle height as zero and shared links retain the selection.
- Kept height independent of the ordinary wave-color selection and documented the unavoidable ±π wrap discontinuity in phase height.
- Increased 3D surface color strength with a brighter opacity response and an unlit vertex-color material, without changing the 2D palette or any dynamics.

## Version 2.97 — 2026-09-25

- Enabled geometry editing in the interactive 3D view through projected handles attached to the rotated scene.
- Added direct 3D dragging for slit-wall position, wall-to-detector distance, screen height, slit width and slit separation, with physical limits and rounded increments matching the 2D controls.
- Reused the existing analytical preview and commit paths so dragging updates the predicted histogram, clears incompatible retained hits, and starts a new record only when the change is committed.
- Paused camera rotation while editing and retained right-click, the toolbar edit button and Escape as consistent entry/exit controls across 2D and 3D.

## Version 2.96 — 2026-09-25

- Changed the default detector-hit and error-bar color from black to red in the 2D and 3D views, including migration of the previous saved black default while preserving other custom colors.
- Made Many-Worlds slow-motion branches capture the active 3D camera and scene instead of reverting to the legacy 2D canvas layers.
- Projected each MW branch's retained hits and error bars onto its three-dimensional detector wall while keeping the branch probability curve and outcome marker visible.

## Version 2.95 — 2026-09-25

- Replaced the fixed oblique 3D illustration with a true WebGL scene using an orbit camera: drag to rotate, wheel or pinch to zoom, right-drag to pan, and double-click or use Reset view to restore the camera.
- Rendered the existing analytical packet field as a genuine height mesh while retaining the selected phase or density display as its surface color; the height remains a graph coordinate and does not enter the dynamics.
- Added the slit mask and detector as low three-dimensional walls, with the predicted probability curve, retained hit markers, and their square-root count error bars projected vertically above the detector.
- Lifted Pilot-Wave particles and trajectory tails onto the displayed mesh without changing their two-dimensional guidance calculation, sampling, or accumulated statistics.

## Version 2.94 — 2026-09-25

- Added an optional 3D wave-surface view without introducing a second physics engine: it renders the same analytical packet field and preserves all particles, trajectories, hits, and statistics when toggled.
- Used display-scaled wave magnitude for surface height and the existing selected quantity for surface color; labelled the extra height explicitly as a graph coordinate rather than a physical spatial direction.
- Overlaid Pilot-Wave particles and trajectories on the surface for visibility while retaining their physical two-dimensional guidance calculation.
- Kept the detector histogram flat and unchanged, disabled Cartesian grid/measurement tools in the projected view, and retained the 3D choice in shared links and local preferences.

## Version 2.93 — 2026-09-24

- Restored the ideal which-slit detector for the Gaussian packet engine, selectable at the upper or lower slit.
- Propagated the two detector-tagged Gaussian aperture components analytically and formed the screen prediction from their incoherent density sum, removing the interference cross term.
- In Pilot-Wave view, assigned each transmitted configuration to its detector branch and integrated guidance with the corresponding single-slit effective wave; the retired straight-line construction is not used.
- Displayed the upper and lower noninterfering waves in cyan and orange, marked the instrumented slit on the wall, and documented the ideal-detector treatment across all three views.
- Added regression checks for the incoherent density identity and agreement of Pilot-Wave screen crossings with the which-slit prediction.
- Added an expert slit-core extent control (±1σₐ to ±5σₐ, default ±1.5σₐ) for the drawing, handles and shared URLs.
- Decoupled Direct PW from the displayed slit extent: it always samples the fixed ±3σₐ transmitted window, while the green curve remains the common analytical probability distribution without a finite-core central cut.
- Removed the duplicate simulation-speed row from Core; the template run controls remain the single speed control.
- Added an `=` button beside Slit balance to restore equal transmission immediately.
- Prevented mixed black/colored PW histogram markers after cycling interpretations: By-slit mode now draws one full-count marker per bin and colors retained non-PW hits by the corresponding PW screen side.
- Dynamically limited slit separation from the exact analytical transmitted density so selectable settings cannot enter the regime where Gaussian-tail transmission lies mainly outside the drawn openings.
- Limited each visible opening to at most half the wall height, kept both slit cores on the wall, and made the slider and canvas-drag limits move together instead of bouncing back after release.
- Added an Expert tab and moved the slit-core extent control there, keeping the Advanced tab focused on ordinary packet and geometry settings.
- Moved the particle selector, Direct PW and Color by slit into one compact Core row, without the redundant “Particle” label.
- Added an analytical slit-balance control that attenuates either Gaussian aperture amplitude, including exact one-slit endpoints and a matching visual indication on the wall.
- Made the wave display selector a compact standard control and kept the detector/histogram at a fixed canvas fraction as physical distances change, with distance scales recalculated to match.
- Returned to three control tabs: moved screen distance and height into Core, and moved slit extent and slit balance into Advanced.
- Fixed restored control limits so mouse and slider edits can retain wall-to-screen distances up to 3000 nm instead of snapping back to 1000 nm.
- Tightened the Core spacing above the wave display selector and removed the redundant rule and padding above Many-Worlds slow-motion branching.
- Added reusable template toolbar tools for a responsive physical-coordinate grid and a cursor/ruler mode that reports x, y, Δx, Δy and two-point distance; connected the double-slit canvas to live nanometre coordinates across normal and expanded views.
- Aligned every Core parameter row to the same label, slider, numeric-value, and unit columns, with one consistent range-track style.
- Replaced the binary Pilot-Wave color checkbox with Uniform, By slit, and Spectrum modes; Spectrum continuously maps each transmitted particle's exact wall-crossing coordinate without changing its dynamics.
- Carry the active Pilot-Wave particle colors into the histogram markers and error bars: Uniform uses the particle color, By slit remains resolved, and Spectrum uses the mean incoming hue in each detector bin.
- Put the compact Direct PW label before its checkbox for a more natural reading order in the Core row.

## Version 2.92 — 2026-09-22

- Moved reusable two-column layout, panel, host-button, keyboard-shortcut and expanded-canvas-resize behavior into shared Q-Ontic template modules.
- Switched the analytical app to those shared modules while retaining its slit controls, packet physics, geometry editing, detector statistics and Many-Worlds presentation locally.
- Made the interpretation label an optional shared media-toolbar element and aligned common Start/Stop and Reset colors across template consumers.

## Version 2.91 — 2026-09-21

- Extended Pilot-Wave slit coloring to the detector histogram: upper- and lower-slit hits now retain their cyan/orange identity in separate dots and Poisson-style error bars.
- Added a subtle scale-style background behind the movable wave-range control in both dark and light themes.

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
