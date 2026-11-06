# Michelson–Morley: Two Accounts — changelog

## 0.2.2 (2026-11-06)
After the second simulated-student review (project doc 2026-11-06-relativity-section-student-review).
- Fix: the 1887 view's speed hint no longer says moving lengths shorten.
- "Saw no shift" → "found far less than expected, consistent with none" (verdict, question, chart).
- Clocks: the 1887 view shows one time row ("Time (1887: clocks unaffected)"); the second row is "Time in the frame where it moves"; panel clock line says "(slow by 1/γ)"; γ = 1/√(1 − v²/c²) in the speed hint.
- Clock-question verdict explains each wrong answer (2γ: time in the moving frame, slowed by 1/γ; 2γ²: the 1887 number).
- Physics tab: path length and the observed bound quoted from the 1887 paper (2 × 10⁷ wavelengths; shift "certainly less than the twentieth part … probably less than the fortieth part" of the expected 0.4 fringe). DOIs added to the Michelson–Morley and Kennedy–Thorndike references.
- Layout: the markers note moved into the caption block (no overlap with the speed arrow, no clipping on phones); shorter setup in the relativistic views.

## 0.2.1 (2026-11-05)
- No "ether frame": the relativistic views are "Apparatus moving" and "Apparatus at rest" (and "Both"). "Ether" now appears only in the 1887 expectation and as Lorentz's name for his true rest frame. Old share links (view=ether / apparatus) still work.

## 0.2.0 (2026-11-05)
After a review by ten simulated students (project doc 2026-11-05-michelson-morley-student-review).
- Views are now frames, not accounts: 1887 expectation, Ether frame, Apparatus frame, Both frames. Lorentz and Einstein draw the same two pictures; each panel carries a Lorentz caption and an Einstein caption saying how each reads it. Opens on 1887; its verdict leads to Both frames.
- Apparatus frame: markers at rest in the ether frame stream past at v, contracted by 1/γ (Lorentz transformation of their worldlines), so the speed slider matters there too.
- One clock throughout: the clock carried by the apparatus. Ether-frame time shown as a second, labelled reading. Times defined as L/c in the setup; γ and 1/γ in the speed hint.
- Questions per view: 1887 asks which arm is late; the relativistic views ask what the apparatus clock reads at the return (2, 2γ, 2γ²). Verdict repeats the choice.
- Wording balanced: removed "nothing to explain", "conspires", "and with reason"; both Owes lines carry the defenders' reply; claims limited to special relativity.
- Physics tab: exact delay 2Lγ(γ − 1)/c with the small-v limit; references renumbered in order of citation; Einstein's account now says the moving-frame picture is the same as Lorentz's.
- Chart: axis title in L/c, ±values, larger text, dashed vs solid in addition to colour. Note on tilted arms at intermediate angles. Arm labels placed beyond the mirrors.
- Shared shell: the Purpose tooltip no longer opens when a section tab in the header is focused or hovered (it covered the Physics and Rationale pages in every app).
- Tests: 11 (adds ether markers in the apparatus frame and view aliases).


## 0.1.0 (2026-11-05)
- First version (draft, dev site only). Replaces Mark Hattarki's Michelson–Morley notebook, now in archive/notebooks/.
- Accounts: 1887 expectation (ether, no contraction), Lorentz (ether frame, contraction 1/γ, slow clocks), Einstein (apparatus frame, no ether), and Both (Lorentz and Einstein side by side on the apparatus clock).
- Controls: speed (exaggerated, 0.05–0.8 c), rotation 0–90°. Prediction prompt, live readout, verdict with next steps; Keeps / Adds / Owes for the two accounts.
- Delay-vs-rotation chart: the 1887 expectation and the flat line of the two accounts.
- Tests: `node apps/relativity/michelson-morley/tests/optics.test.mjs` (9 tests: closed-form 1887 times, zero at 45° and reversal at 90°, Lorentz 2γ at every angle, apparatus clock 2 L/c, Einstein 2 L/c, pulse speed and return point).
