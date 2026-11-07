# Bell's Spaceships — changelog

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
