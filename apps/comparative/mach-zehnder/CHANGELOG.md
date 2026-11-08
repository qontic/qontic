# Atom Mach–Zehnder Interferometer — changelog

## 0.18 — 2026-11-06
Study arms and options for the four-arm pilot.
- `?arm=textbook`: orthodox with collapse at any measurement (the flag counts as one) and no decoherence; no configuration-space panel; textbook explanations and Physics paragraph.
- `?arm=pilot-wave`: orthodox and pilot wave only; no "all four" view.
- `?agree=1`: after the verdict, one line on what all accounts agree on beyond the counts (worded without "accounts" in one-account arms).
- `?explain=1`: after the verdict, students write an explanation (in two accounts, or twice in their own words in one-account arms); saved as an `explain` event.

## 0.17 — 2026-11-06
Study logging, from the simulated-student pilot.
- `?pid=<id>` writes a participant id into every prediction entry and event.
- New event log (`qontic-mz-events-v1`): page load (with starting account), account switches, display mode (one account / all four), setup changes, atoms sent. Copy and Download now export `{participant, predictions, events}`.
- `?start=random` (or an account name) sets the account shown first in the all-accounts arm, so the orthodox account is not always first.
- The first run (splitter in, nothing in the arms) is remembered across reloads; Clear log resets it.

## 0.16 — 2026-11-06
- The which-way marker is now a which-way flag, with states "flag raised" (upper arm) and "flag down" (lower arm), replacing "untouched/marked" ("marker marked" read badly). Internal key stays `marker`, so logs and URLs are unchanged.

## 0.15.1 — 2026-11-06
- State labels shortened to "untouched" / "marked" ("marker marked" read badly); prose reworded ("the upper part leaves the marker marked").

## 0.15 — 2026-11-06
- Marker states renamed: "marker untouched" (lower arm) and "marker marked" (upper arm), replacing "ready" and "flipped". "Flipped" suggested a phase flip; the marker removes the interference, it does not shift it.

## 0.14 — 2026-11-05
Fixes from a ten-student review (eight on the full app, two on `?arm=orthodox`).
- First run (beam splitter in, nothing in the arms) counts as soon as atoms are sent, so changing the setup while the first atom flies no longer locks the app. Until it is done, other setups show no prediction form, only a plain instruction. The word "calibration" is gone.
- The explanation and the "All accounts agree" line appear only with the verdict (100 atoms); one atom no longer gives the answer away.
- Prediction log: an entry is written when the prediction is locked and completed at the verdict, so Reset can no longer erase a first guess. New fields: session, attempt, lockedAt, resultAt, account and display (one account or all four) at lock and at result. Result column reads "Matched" / "Did not match" / "No result".
- "Send 200 atoms" sends exactly 200 (it counted 201).
- With the second beam splitter removed, detector labels read "upper/lower beam heads here" (the wave), not "from upper/lower arm", which contradicted pilot wave. Bright/dark port labels only with nothing in the arms; with a marker or bomb the splitter label reads "tuned: D2 dark with nothing in the arms".
- Light theme: Physics and Prediction log tabs readable.
- Many worlds: a split cross-fades instead of sliding copies across each other. Collapse labels near the detectors no longer run off the edge.

## 0.13 — 2026-11-05
Back to a fixed phase: the interferometer is always tuned so that, with nothing in the arms, every atom reaches D1 and D2 stays dark. 0.9, 0.11 and 0.12 (phase as a control) are withdrawn; 0.10 (decoherence, `?arm=orthodox`) is kept.
- The phase controls are gone, including the Advanced slider.
- Behaviour as in 0.8: a first run with nothing in the arms shows the tuning before the other setups.
- Kept fixes: hidden elements stay hidden (the prediction form no longer shows during the first run); verdicts no longer lower-case D1 and D2.

## 0.10 — 2026-11-05
Orthodox account with decoherence, and a comparison-arm configuration for the IUSE study design.
- Orthodox explanations and compare answers give the decoherence account: the marker or bomb becomes entangled with the path, parts tied to different states cannot interfere, and collapse (the postulate) still picks the outcome.
- Orthodox in-flight tag after the marker: "interference lost (decoherence), no collapse yet".
- Orthodox panel titled "Joint state", with "different marker states: no interference" where the parts fail to meet.
- Glossary: Decoherence added; configuration space described for all accounts.
- `?arm=orthodox` shows only the orthodox account: no interpretation switch, no side-by-side view, other accounts hidden on the Physics tab and in the glossary. The prediction log records the arm.

## 0.9, 0.11, 0.12 — 2026-11-05 (withdrawn in 0.13)
Phase between the arms as a main control, with presets as prediction items; then a locked first step; then no first step. Withdrawn: the logic became confusing.

## 0.8 — 2026-11-05
Fixes from a ten-persona design walkthrough.
- Calibration run first (beam splitter in, nothing in the arms): no prediction, and the tuning labels appear only after it.
- Setup 4 (beam splitter removed, marker) has its own question: "Does the marker change which detector clicks?"
- Spontaneous-collapse answers update as collapse happens; collapse times are consistent (3.6 or 3.2 million years; about 100 ns).
- Orthodox and spontaneous collapse are visibly different: an in-flight tag ("no measurement yet" or the collapse clock) and different collapse labels.
- Pilot wave: on-diagram notes on turning back versus going straight; arm-to-detector labels when the beam splitter is removed; caption on the crossing fringes; symmetry caveat on the Physics tab.
- Many worlds: detector labels inside the copies, a faster split, "no record, no split" wording.
- Colour legend, glossary of terms, clearer bomb options and question, neutral reasoning placeholder.

## 0.7 — 2026-11-05
- Many worlds uses the same text and the same tile labels (weight · record · detector) in the single view and the side-by-side view.

## 0.6 — 2026-11-05
- Stop freezes the atom mid-flight; Start continues it. Sending atoms switches the button to Stop.

## 0.5 — 2026-11-05
- The tuning is explicit: "tuned: D2 dark" at the second beam splitter, bright and dark port labels, and a sentence under the beam-splitter control.
- Prediction answers and detector counts match the setup: bomb answers and the bomb counter appear only with a bomb.

## 0.4 — 2026-11-05
- Many worlds: each record splits the apparatus into weighted copies (as in the analytical double slit), then the view follows the copy you are in.
- Spontaneous collapse: collapse clock with the GRW rate, and a visible collapse when the wave reaches a macroscopic object.
- Orthodox: the collapse postulate is marked where it is applied.

## 0.3 — 2026-11-05
- Wave drawn as Gaussian packets with carrier waves: real interference fringes where parts of one branch overlap, none across branches.
- Compare mode: all four accounts side by side for the same atom, each answering the setup's key question.
- Phase between the arms (Advanced); prediction mode applies only at the tuned phase.
- The wave continues to the detectors after an absorption in another branch.

## 0.2 — 2026-11-05
- The chosen prediction stays highlighted after it is locked.

## 0.1 — 2026-11-05
- First prototype on the shared Q-Ontic template.
- Setups: second beam splitter in or removed; nothing, a which-way marker, or a bomb in the upper arm.
- Four accounts: orthodox, pilot wave, many worlds, spontaneous collapse.
- Prediction mode: answer, confidence and reason locked before a setup can run; verdict after 100 atoms; local prediction log with JSON copy and download.
- Pilot-wave trajectories through the crossing (second beam splitter removed) computed from the guiding equation for two freely evolving Gaussian packets.
- Configuration-space panel showing whether the two parts of the wave can overlap at the second beam splitter.
