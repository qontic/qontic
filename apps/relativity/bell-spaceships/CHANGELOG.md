# Bell's Spaceships — changelog

## 0.6.1 (2026-11-07)
After the third review by the same three experts (project doc 2026-11-07-bell-spaceships-0.6-review).
- Framing: the app's two frames are no longer presented as Lorentz's and Einstein's accounts. Home card: "Answered in one frame by the dynamics of moving matter, as Bell taught, then checked in the ships' frame." Rationale says both frames belong to one theory and the quantum parallel is Lorentz vs Einstein. Lorentz "as completed by Poincaré"; "interpretations" of quantum mechanics, collapse models as distinct theories.
- Physics tab: "Bell's dynamical explanation, given in A's frame", with a pointer to the debate; note on where the ships'-frame gap at the snap is measured.
- Rationale: Brown and Pooley's thesis stated (geometry codifies the Lorentz covariance of matter's laws), not only its assumptions.
- "It depends on the frame" reply gives the reason: a break is one event; frames disagree about lengths and order, not about whether it happened. No duplicate when the ships' frame is open.
- Ships'-frame verdict split into short sentences; clock offset dropped (clocks are hidden by default). Caption: "gap … was 1.20 L; it is now 2.29 L".
- k ≠ 0 snap verdict reworded so it cannot be read backwards.

## 0.6.0 (2026-11-07)
Bell quotes checked against *Speakable and Unspeakable in Quantum Mechanics* (Cambridge, 1987), ch. 9.
- Third prediction: "It depends on the frame". The verdict answers it: breaking is a fact every frame agrees on; A's frame and the ships' frame describe the same break differently.
- With the ships' frame shown (k = 0, snapped), the verdict adds the ships'-frame account: C fired first, the coasting gap is γL, C's clock is γvL/c² ahead, the rest length stays L.
- Ships'-frame caption after the snap gives the gap at the snap (matches Results), not the current gap.
- Physics: Bell's atom described as he did it (computer integration of the orbit, then Lorentz invariance for any system set gently in motion); Bell's proviso on strong threads and massive rockets quoted (p. 75).
- Rationale: verified quotes from pp. 68 and 77 (the CERN poll, "classical education… as well as that of Einstein", philosophy vs. style, "the longer road…"). New references: Born 1909 (Born rigidity), Janssen 2009 (geometrical vs. dynamical views).

## 0.5.1 (2026-11-07)
After the re-review of 0.5.0 by the same three experts.
- Results at the snap say "Mean speed of the ships (B …, C …)" when the ships' speeds differed (the label used the speeds after the snap).
- When the two ships move at different speeds (front engine held back, during the push) there is no single relaxed length: captions, live line, verdict and Results show the stretch only ("none (speeds differ)"); the relaxed-length marker is hidden. Physics tab says so.
- Born-rigid verdict: "Within this family of engine settings, only this one…".
- Challenge prompt names the slider as labelled ("Hold the front ship back").

## 0.5.0 (2026-11-07)
After three expert reviews (project doc 2026-11-07-bell-spaceships-expert-review).
- Thread elongation now exact: proper length summed over a family of element worldlines (1/a(x0) = 1/a + k·x0), γ(v)·dx per piece. k = 0 gives γ − 1, k = 1 gives 0 at every moment and any acceleration (the old mean-speed estimate showed a Born-rigid thread as slack for large aL). Taut tolerance 0.5% (was 3%). New test.
- "Relaxed length" replaces "natural length" (rest length stays L); relaxed = gap / (1 + strain).
- Ships'-frame panel: distance scale in B's frame from B (was A's moving ruler marks labelled in L); caption notes B's frame is not the thread's rest frame while accelerating.
- Results show "Mean speed of the ships" with B and C values when they differ.
- Challenge: Born-rigid preset and the "k = 1 only" hint stay hidden until the thread holds at k = 1 or the student asks; "Show me the setting that works" appears after a first attempt; prompt asks which way to move the slider.
- Setup "as A sees it" → "in A's frame".
- Text: atom orbit "contracted by the factor √(1 − v²/c²)"; strong thread gives "approximately" Born-rigid motion; "only k = 1" limited to this family; Bell's pedagogy needs no ether; Brown & Pooley presented as defenders of the dynamical view, with the geometrical view stated; model assumptions describe the exact measure.
- Home-page section text (shared with Michelson–Morley): "differ on how to explain it. A similar situation to…" (was "disagree on what is happening. The same situation as…").

## 0.4.2 (2026-11-07)
- Published to production (qonticlab.rice.edu), Relativity: Two Accounts section.
- Links to the Bell's atom notebook removed until the notebook is reviewed and published.

## 0.4.1 (2026-11-06)
After the relativity-section review (project doc 2026-11-06-relativity-section-student-review).
- Fix: with the front engine held back (0 < k < 1) the verdict no longer says "the gap did not shrink"; it gives the gap and the relaxed length at the snap.
- Results heading reads "Results at the snap (v)" after a break; note says the ships on screen keep going.
- Setup: the flash reaches B and C at the same moment "as A sees it"; A's clock reads t = 0 then. Launch panel shows "A's clock t".
- Physics tab: slider named as on screen ("Hold the front ship back", k).
- Spacetime: "same time for B" moved to the left end of its line (no overlap with the worldline labels). Caption shrinks instead of clipping on phones.

## 0.4.0 (2026-11-06)
After the second simulated-student review (project doc 2026-11-06-bell-spaceships-0.3-student-review).
- First run shows only Start and the setup; the front-engine setting, final speed, breaking limit and views open after the first run. The verdict offers "Can you make it hold?" (opens and highlights the front engine; "Show me the setting that works" sets k = 1).
- Verdict in plain words, with the key lines moved from the Physics tab: "Contraction alone breaks nothing… the gap did not shrink with it" and the strain-gauge sentence.
- Results, caption and live line frozen at the moment of the snap (no more 0.83 L vs 0.44 L); "Values at the moment it snapped".
- Renamed: "Hold the front ship back" (slider k), "Born-rigid (no stress)" preset. "Thread snaps at" disabled for k ≥ 1.
- Ships'-frame panel caption ("C fired first in B's frame and pulls ahead: gap … L, rest length 1.00 L"); Physics tab explains why the gap is γL there.
- Setup says the thread is too weak to pull on the ships. "Ask for a prediction" moved to Display.
- Layout: natural-length marker drawn above ship labels; captions move to the panel's top right when they would hit the distance marks; "same time for A" label kept inside the plot.

## 0.3.0 (2026-11-05)
- Front engine is now a continuous setting k (front proper acceleration a/(1 + k·aL/c²)) with presets "Same as rear (Bell)" (k = 0) and "Exactly right" (k = 1), replacing the two-way toggle. Final stretch (γ − 1)(1 − k): only k = 1 keeps the thread at its natural length; k < 1 still stretches it (and it can snap), k > 1 leaves it slack (drawn sagging).
- One prediction question (It snaps / It holds), asked only on the first run.
- Physics tab: the formula and why k = 1 is a special tuning (Bell's strong-thread proviso).
- Tests: final-stretch formula for several k (15 tests).

## 0.2.1 (2026-11-05)
- Engines renamed "Same engines (Bell)" / "Front engine gentler" (was Identical / Rigid), with a one-line hint for each.
- Launch frame shows "gap held at … L" or "gap shrinking with the thread" during the run.
- Physics tab: why a gentler front engine keeps the thread intact, and its link to Bell's strong-thread proviso.

## 0.2.0 (2026-11-05)
After a review by ten simulated students (project doc 2026-11-05-bell-spaceships-student-review).
- Launch frame alone is the default view; ships' frame and spacetime are reveals (View: Launch frame / + Ships' frame / Spacetime / All).
- Thread elongation now computed as in Bell's argument: in the launch frame, gap divided by the natural length L/γ at the ships' speed. The thread snaps exactly when the ships pass the critical speed (fixes the 0.46 c vs 0.55 c contradiction). Rear-frame distance still shown in the ships' frame.
- Gentle default acceleration (aL = 0.2 c²; range 0.05–1).
- Story strip below the canvas (no overlays): short setup, a prediction with a reason (four choices), a live readout (speed, gap, natural length, stretch), a verdict with feedback on the chosen reason and next steps (Try Rigid, See it from the ships' frame, Run again).
- Results trimmed to speed, gap, natural length, stretch, status (+ ships'-frame gap when shown). Clocks off by default.
- Physics and Rationale rewritten: spoiler note; one-frame answer first; precise statement of Bell's atom result; Bell's strong-thread proviso; Brown & Pooley caveat; where the parallel to quantum mechanics breaks. Links to the new Bell's atom notebook.
- Spacetime diagram clipped to its panel.

## 0.1.1 (2026-11-05)
- Fix: the canvas stayed blank after visiting Physics or Rationale (drawing at zero size threw and stopped the animation loop).
- The run pauses when you leave the Simulation section.
- New setup card before the question: five numbered points (ships, thread, start signal, engines, breaking limit). "Show the setup" button in Core reopens it.

## 0.1.0 (2026-11-05)
- First version (draft, dev site only).
- Identical (Bell) and rigid (Born) acceleration programs; final speed, breaking elongation, rear-ship proper acceleration.
- Launch-frame and rear-ship-frame panels at a common scale; spacetime diagram with the thread's history, lines of simultaneity and the break event.
- Prediction prompt and end-of-run verdict; ship clocks; optional atoms with flattened fields.
- Kinematics tests: `node apps/relativity/bell-spaceships/tests/kinematics.test.mjs`.
