# Hydrogen Atom — changelog

## 1.2.18 · 2026-11-19
- Axes on/off moved to the tool buttons at the top right (new axes icon next to the distance scale); the Axes button in the Display tab is gone.
- Removed the Stop button and the "Controls ↓" link under the canvas: Start/Stop is in the controls panel, and the link only jumped to it on narrow screens.
- Shared media toolbar: optional axesControl ({ getVisible, setVisible }) adds the Axes button; other apps are unchanged.

## 1.2.17 · 2026-11-19
Quiz rebuilt after a ten-student review of the quiz itself (all official answers were correct, but four of seven questions could reasonably be answered differently).
- The guidance law is stated once under the title and in every pilot-wave question: standard law, no spin term (with the spin term, 2p_x electrons move).
- Each question has its own answers, including real misconceptions (2p_x: "swing from one lobe to the other"; 1s: "jiggle at random"; 2p₊₁: clockwise vs anticlockwise); stems no longer give the answer away ("ring", "real", "of two energies" removed).
- 1s + 2p₀: "They move back and forth, mostly along z, without circling"; the feedback says the paths are closed, curved, in planes containing z, and mostly do not cross the nucleus (checked by integrating trajectories).
- 3s nodes: the picture appears only after the answer.
- Orthodox question rebuilt: four equal-length options (probability current as motion; charge cloud; definite but unknown position; only measurement probabilities); feedback "the orthodox reading assigns no position between measurements" and names where each wrong option comes from. No Watch button.
- New question 8: what all readings agree on for 1s + 2p₀ (|ψ|² sloshes every 405 as; no quantum jumps).
- Fixes: answers wrap on phones (the long option made the page 541 px wide on a 390 px screen); keyboard focus moves to the next question; "Simulation → Display"; "the wave does not change" and "the electrons ride along" reworded.
- Shared quiz module: optional intro line, per-question drawAfterAnswer and watch: false, focus on Next, wrapping answers.

## 1.2.16 · 2026-11-19
Accessibility and phones, from the ten-student review (no new controls).
- Contrast: small text now meets 4.5:1 in both themes (section labels, slider labels and values, footer in the light theme; section labels in the dark theme). Shared controls: in the light theme the Orthodox/Pilot Wave button text and the auto-rerun ↻ are darker (affects every app's light theme, for the better).
- Screen readers: the reading button announces "Interpretation: Pilot Wave. Activate to switch to Orthodox." (shared controls, all apps). The n and orbital buttons report their pressed state. Quiz focus moves to the feedback (1.2.13).
- Phones: the atom view is shorter (about a third of the screen), so the state buttons are visible together with the atom. Touch screens get larger slice menu, orbital buttons, sliders and labels; "tap or click to switch"; trails default to 400 steps so 50 electrons stay smooth.
- Laptops with short screens: the control column fades at the bottom while more of it is below.

## 1.2.15 · 2026-11-19
Spin presets, real orbitals and diagnostics, from the ten-student review (no new controls; two rows removed).
- Spin presets show their state written out (e.g. Ψ = 1/√2 |1,0,0⟩↑ + 1/√2 |2,1,0⟩↓, spin and orbit entangled) in place of the Mode, θ and φ rows, which do not apply to them. In State and diagnostics, spinor states (presets, j-states, orbital × spin) show the same decomposition under "State"; the j-state menu is wide enough for its labels.
- Real orbitals: 2p_z (= 2p₀) and 3d_z² (= 3d₀) added, so the group holds all three p and all five d orbitals.
- Orbital picker: a note that each n has n² states at the same energy and that −m has the same |ψ|² as +m.
- Display: "Lobe level (% of peak)"; Physics § 6 says lobes are drawn at a fraction of the peak density, not as the 90%-probability surfaces of chemistry books.
- State and diagnostics: "⟨r⟩ (mean radius)", exact, replaces "Electrons shown" (the slider already shows the number); for 1s + 2s it oscillates in time.

## 1.2.14 · 2026-11-19
Display defaults, from the ten-student review (no new controls).
- Axes on by default, with tick marks in Bohr radii (numbers on the x axis), so "circles the z axis", "lobes along z" and the size of the orbital can be read off the picture.
- Leaving Slices for Volume or Lobes returns to the tilted camera; 2p₀ no longer looks like a ball after the face-on slice view.
- Phase colours default to Twilight, whose purple and orange halves stay distinct with red-green colour blindness (HSV and 4-Phase remain in the palette menu). The legend names the colours by angle: 0, +π/2, ±π, −π/2.
- With the spin term on an orbital, the caption names the spin axis (+x by default) and says the 1s electrons circle it.

## 1.2.13 · 2026-11-19
Quiz, from the ten-student review (Quiz tab only; Core unchanged).
- Seven questions instead of three: 1s, 2p₊₁, 2p_x (same energy as 2p₊₁, but real, so the electrons stand still), 1s + 2p₀, 1s + 2s (in and out along radii), 3s radial nodes, and one Orthodox question (what the 2p₊₁ display says between measurements; it switches the reading to Orthodox).
- A fourth motion answer ("They move in and out along radii"); answers appear in random order, so the right one is no longer 1st, 2nd, 3rd.
- Each feedback opens with one sentence in everyday words; the formula follows on its own line.
- Running score, and "You got k of n right on the first try" after the last question.
- ?quiz=N opens at question N; "Copy link to this question" in the Quiz panel. Going to the Simulation tab removes quiz= from the address bar, so a reload opens the app.
- Keyboard: focus moves to the feedback after an answer.
- Shared module shared/qontic-quiz.js gains plain, per-question shuffle, shareLink, ?quiz=N, the final score line and the URL clean-up (all optional; the N-slit preview is unaffected except for the final score line it already asks for with score: true).

## 1.2.12 · 2026-11-19
Wording from the ten-student review (no change to the controls).
- "At rest" qualified everywhere it appears (1s description, caption, Physics § 3 heading and text, Quiz question 1): it holds for the standard guidance law; with the spin term of § 4 the electron moves.
- Physics § 3: equivariance needs the quantum-equilibrium hypothesis (|ψ|²-distributed starting positions; Dürr–Goldstein–Zanghì's typicality argument). The quantum-potential paragraph is introduced as Bohm's second-order formulation; in the first-order theory used here v = 0 follows from ψ being real.
- Physics § 1: Orthodox defined (Dirac–von Neumann: a definite position only when measured); no measurement takes place, so both readings agree on everything shown. Many-worlds and GRW: why they are not offered separately and how each reads |ψ|² (GRW 1986 added as reference 10).
- Probability current: "reading j/|ψ|² as the velocity of an electron that always has a position is the pilot-wave step"; the caption shows it only when j ≠ 0.
- Orthodox with spin: the state description no longer goes blank.
- Electrons note: "A real hydrogen atom has one electron; the dots are many separate atoms."
- Units: "attoseconds"/"femtoseconds"/"atomic units" written out in captions and quiz; "Sim time (attoseconds)". Stat row "Spin" renamed "Spin term".
- § 2: "angular frequency ΔE/ħ (period 2πħ/ΔE)", "different energies". § 6: ⟨r⟩ oscillates in 1s + 2s, not in 1s + 2p₀; the spin presets with 2p₀↓ or 3d₊₁↓ are not stationary once fine structure is included.

## 1.2.11 · 2026-11-19
Fixes from the ten-student review (no change to the controls).
- Quiz: preparing a question now returns fully to the spinless state and the standard guidance law. Opening the quiz from a spin preset or j-state no longer shows circling electrons for the 1s question.
- 1s + 2p₀ caption: the density sloshes up and down z with ⟨r⟩ fixed (it never becomes a sphere). 2p₊₁ + 3d₊₁ caption and menu label: the ring sloshes above and below the xy plane (interference ∝ sin²θ cosθ), its radius fixed; it does not beat radially.
- 1s↑ + 2s↓: the electrons move with the spin term because S has a nonzero curl, not because S changes in time.
- Spin |v| diagnostic: uses the guidance law in force and a sample point off the axes (it used the x axis, a node of 2p₀).
- The orbital grid no longer highlights an orbital while a superposition or real orbital is shown.
- Spin presets keep their title when the Spin term is switched off.
- Text: "2p+" → "2p₊₁"; Physics § 2 shape row includes the p₊₁ ring; § 3 "For 1s" on the 13.6 eV kinetic energy; § 4 points to the Verify button. Code comments on the spin term corrected (1s↑ moves too). Page icon added (removes a 404).

## 1.2.10 · 2026-11-18
- Orthodox caption and Physics § 1: one sentence on the probability current j = (ħ/mₑ) Im(ψ*∇ψ), which is standard quantum mechanics; reading it as electron motion is the pilot-wave step.
- The Quiz now uses the shared module shared/qontic-quiz.js (same behaviour; other apps can opt in).

## 1.2.9 · 2026-11-18
- Electrons drawn as small shaded spheres in warm yellow (white if the trails are amber), on top of all trails and the nucleus, so long trails no longer hide them (1s + 2p₀ swing). Legend: "Trail" and "Electron". Default dot size 3.

## 1.2.8 · 2026-11-18
- The prediction questions moved from the Core tab to a new Quiz tab (next to Simulation and Physics; app-level, the shared template is unchanged). Each question shows a still image of |ψ|² only, without electrons, so the picture cannot give the answer away. After an answer, "Watch it in the simulation" switches to Simulation with that state running.
- Opening the app with ?quiz=1 starts on the Quiz tab and keeps Simulation locked until the first answer. Without it the app opens as before.
- Core tab: the prediction panel is gone; only states and controls remain.

## 1.2.7 · 2026-11-18
- Real orbitals 2p_x, 2p_y, 3d_xz, 3d_yz, 3d_xy, 3d_x²−y² in the existing superposition menu (group "Real orbitals (as drawn in chemistry)"), signed as in chemistry so Lobes colours match textbook pictures. ψ is real, so pilot-wave electrons stand still; the descriptions point to the complex m states, where they circulate. The p_x preset now has the chemistry sign. No new controls.

## 1.2.6 · 2026-11-18
- The Spin term button no longer changes the state on a spin preset or a j-state: it switches only the guidance law (with the spin term, or the convective current Im(Ψ†∇Ψ)/ρ alone), keeps the electrons where they are and restarts their trails. On a plain orbital it works as before. Same single button; the Spin stat reads "Off (spinor kept)" when the spinor stays without the term. Share links carry term=0.

## 1.2.5 · 2026-11-18
Student suggestions that need no new controls:
- Radial nodes of s orbitals visible: brightness ∝ (ρ/ρmax)^0.25 (was 0.42) in Volume, Slices and Projections, and the volume texture stores (ρ/ρmax)^¼ so faint outer shells survive 8 bits.
- Phase view without the global phase e^{−iEt}: real orbitals show fixed colours; superpositions show phase relative to the first component.
- P(r) inset: r ticks and the ⟨r⟩ value.
- Slices: the camera looks at the slice face-on when Slices is chosen or the state changes (xy from +z, x right, y up), so 1s looks round.
- A label "Reading of the display (click to switch)" above the Orthodox/Pilot Wave button.
- Software-graphics banner only with Volume or Lobes; on phones the prediction panel sits under the canvas; stage button says Stop/Start like the sidebar; larger tap targets on phones; darker trails and distinct legend swatches in the light theme.

## 1.2.4 · 2026-11-18
1.3.0 was withdrawn: Pablo found it more confusing than 1.2.3. This release is 1.2.3 plus five small corrections from the student review:
- Verify: the 1s spin r-independence check samples perpendicular to the spin axis (it compared 0 with 0 on the axis).
- Physics § 4: the added current ½∇×S is divergence-free, not the added velocity.
- j-state labels say "(coupled)" instead of "(mixed)"; Electrons note: "In an actual atom, one orbital holds at most two electrons."
- Consistent names: 2p₊₁, 3d₋₁ … (old share links still work), 2p₀ rather than 2p_z, vᵩ = 1/(r sinθ) in the prediction feedback.
- Predictions no longer give away the answer: state text and caption stay neutral until the student answers.

## 1.3.0 · 2026-11-18 (withdrawn)
Response to the five-student review of 1.2.3 (sophomore, QM I, QM II, chemistry, phone/laptop user).

Spin
- Spin state and guidance law are separate. Advanced → Spinor sets the state (product direction or j-state; spin presets) in both readings. Advanced → Spin term chooses the pilot-wave guidance law; toggling it keeps the state and the positions, so the two laws can be compared on the same spinor. Without the spin term the guidance velocity is Im(Ψ†∇Ψ)/ρ.
- In Orthodox the guidance-law and trajectory settings are hidden; the spinor controls stay.
- Physics § 4: the added current ½∇×S is divergence-free (not the added velocity).

Checks
- Verify: the 1s spin r-independence test now samples perpendicular to the spin axis (it compared 0 with 0 on the axis); new checks for real orbitals (v = 0), product spinor without the spin term (v equals the scalar velocity) and continuity with spinors.
- Sweep: continuity for five spinor states with and without the spin term, scaled by the largest single term; v = 0 for all 44 real orbitals. Continuity stencil refined near the 1s cusp.

New displays
- Probability current arrows (Display → Probability current j): j = (ħ/m) Im(ψ*∇ψ) in Orthodox (on by default there), ρv of the guidance law in Pilot wave.
- Real orbitals (p_x, p_y, d_xy, d_xz, d_yz, d_x²−y², seven f's) in a second grid row, signed as in chemistry. The p_x preset now has the same sign.
- Faint-region control (γ, default 0.25) for Volume, Slices and Projections; the volume texture stores (ρ/ρmax)^¼ so outer s shells survive 8 bits; radial nodes of 2s, 3s… now visible. Cutaway toggle for Volume, Lobes and Cloud.
- Phase view without the global phase e^{−iEt}: real orbitals show fixed colours; superpositions show phase relative to the first component.
- P(r) inset with r ticks and the ⟨r⟩ value.

Interface and wording
- Orthodox / Pilot wave as a two-button switch at the top of the controls.
- Predictions no longer give away the answer: state descriptions and captions are neutral until the student answers. On narrow screens the prediction panel sits under the canvas.
- Consistent names: 2p₊₁, 3d₋₁ … (old share links still work), 2p₀ rather than 2p_z, vᵩ = m/(r sinθ) everywhere; "(coupled)" instead of "(mixed)" for j-states; "In an actual atom, one orbital holds at most two electrons."
- Slices view looks at the slice face-on (x right, y up for xy); axes shown by default.
- Software-graphics banner only with Volume or Lobes; stage button says Stop/Start like the sidebar; larger tap targets on phones; darker trails and distinct legend swatches in the light theme; orbital grid highlight clears with presets; spinor states keep their state description; Orthodox says when a state is stationary.

## 1.2.3 · 2026-11-17
- Spin and Trajectory settings are always shown in the Advanced tab; no extra click to expand.

## 1.2.2 · 2026-11-17
- Display settings (opacity, hide low density, point size, axes, P(r), projections) are always shown in the Display tab; no extra click to expand.

## 1.2.1 · 2026-11-17
- Slider and stat renamed from "Atoms" to "Electrons", with a note under the slider: each electron belongs to its own hydrogen atom in the same state, drawn together; they do not interact; a real orbital holds at most two electrons.

## 1.2.0 · 2026-11-17
- Two readings of the display, chosen with the interpretation button next to Reset: Orthodox (|ψ|² only; no dots or trails; Cloud samples are possible position-measurement outcomes and do not move) and Pilot Wave (adds the electrons and their trajectories; default). Switching keeps the clock and the particles.
- In Orthodox the spin-term button and the prediction sequence are hidden or disabled (both concern pilot-wave motion); the caption and legend change with the reading.
- Share links carry the reading (interp=cpn).
- Physics § 1 explains the two readings and why many-worlds is not offered separately (no measurement, no branches; its display would be the orthodox one).

## 1.1.1 · 2026-11-17
- Removed the Views tab. With no measurement in a stationary atom, orthodox quantum mechanics and many-worlds have nothing to draw beyond |ψ|², which the density displays already show; the app is presented as a pilot-wave app. Physics § 1 now says so in two sentences, and notes that the Cloud view (where position measurements would find the electron) is accepted by every view.

## 1.1.0 · 2026-11-17
Response to the three-reviewer evaluation of 2026-11-17 (physicist, instructor, student and orthodox-view reader).

Physics and numerics
- Removed the r < 0.15 a₀ velocity cutoff. It froze any electron that stepped near the nucleus (27 of 2000 stuck in 1s + 2p₀ against about 2 expected). ψ is smooth there; only the density guard remains.
- Cloud sampler rewritten as grid-bounded rejection sampling. The old stratified grid with ±0.75-voxel jitter smeared |ψ|² outward (⟨r⟩ 1.5–2 % high for 1s, radial KS failed). New sampler passes KS for 1s–6s.
- Cloud view now moves its dots along the Pauli–Bohm trajectories when the spin term is on (up to 500 dots, RK4 step 0.12 a.u.); before, nothing moved.
- Leaving a spin preset turns the spin term off again unless the user switched it on.
- Lobes are coloured by the sign of ψ only when ψ is real up to a global phase; complex states get one colour and a legend note.
- j-state list now includes m_j = −j (2p offered 4 of 6 states).
- Grid ⟨r⟩ check flags differences above 2 % (was 5 %).
- Shared particle stepper for trail and cloud modes. Node tests added: tests/hydrogen-physics.test.mjs.

Text and framing
- Physics tab rewritten: what the display shows, why the 1s electron is at rest (quantum potential), the spin term as a choice of guidance law with the same |ψ|² predictions, numerics.
- New Views tab: orthodox, pilot-wave and many-worlds readings of the same |ψ|², and what a measurement can decide.
- Pilot-wave statements in the app's voice now say "in pilot-wave theory".
- References: removed the unpublished "BYU preprint" placeholder and "Tumulka 2004"; added Holland 1999 and 2003, Colijn and Vrscay 2002 (with erratum) and 2003. Spin term no longer credited to Bohm–Schiller–Tiomno. Removed the unsupported optical-pumping sentence.
- Corrected orbital sizes for n = 4–6 (they were about twice too large), the p_x reason (ψ real, not degeneracy), "+0" in kets, ⟨E⟩ label for superpositions, beat periods also in attoseconds.

Interface
- Predict-then-watch sequence (1s → 2p₊₁ → 1s + 2p₀) with feedback.
- Caption strip under the canvas saying what the marks mean; state description moved out of the canvas.
- 12 atoms by default (up to 50), labelled "Atoms"; zoom fitted to each state; slice plane and camera chosen so rings and lobes are not seen edge-on.
- Share link carries state, guidance law, view and camera.
- Version in the footer and this changelog.
- Legend collapses on short screens; Play/Pause under the canvas on narrow screens; Axes, P(r), Projections use the standard toggle style.
- Darker dots and trails in the light theme.
- Software WebGL renders Volume and Lobes at reduced resolution instead of freezing the page.
- "None (pure state)" no longer breaks the info box.
