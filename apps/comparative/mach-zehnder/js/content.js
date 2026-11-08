// Explanations for each setup in each account. Keys: `${bs2 ? 'in' : 'out'}-${object}`.
// All accounts give the same detector statistics; they differ in what they say happens.

export const COMMON = {
  'in-none': 'All accounts agree: with the second beam splitter in place and nothing in the arms, every atom reaches D1 and D2 never fires. The interferometer is tuned this way.',
  'out-none': 'All accounts agree: D1 and D2 each fire half the time.',
  'in-marker': 'All accounts agree: D1 and D2 each fire half the time. The flag removes the interference even though nobody reads it.',
  'out-marker': 'All accounts agree: D1 and D2 each fire half the time, exactly as without the flag.',
  'in-bomb': 'All accounts agree: half the atoms are absorbed by the bomb, a quarter reach D1 and a quarter reach D2. A D2 click shows that a live bomb is there, although it absorbed nothing.',
  'out-bomb': 'All accounts agree: half the atoms are absorbed by the bomb and the rest reach D1.',
};

export const EXPLAIN = {
  orthodox: {
    'in-none': 'The wave splits at the first beam splitter and travels both arms. Nothing in the arms is changed by the atom’s path, so the two parts stay coherent: at the second beam splitter they add at D1 and cancel at D2. The state collapses when D1 clicks.',
    'out-none': 'With the second beam splitter removed nothing recombines. Each part of the wave heads to one detector, and the state collapses onto whichever detector clicks.',
    'in-marker': 'Decoherence: the flag becomes entangled with the atom’s path. The part of the wave in the upper arm goes with the flag raised, the part in the lower arm with the flag down, and parts tied to different flag states cannot interfere. Nobody needs to read the flag, and nothing has collapsed yet. At the detectors the state collapses (the postulate) and D1 and D2 are equally likely.',
    'out-marker': 'Nothing recombines, so the flag changes nothing here. Collapse happens at whichever detector clicks.',
    'in-bomb': 'Decoherence: the bomb becomes entangled with the path (exploded or intact), so the two arms can no longer interfere. Because the bomb is a large object, the orthodox account applies collapse here: half the time onto the upper arm, and the bomb absorbs the atom. Otherwise onto the lower arm; a single part arrives at the second beam splitter, and D1 and D2 are equally likely.',
    'out-bomb': 'Half the time the bomb absorbs the atom. Otherwise the state collapses onto the lower arm, which leads straight to D1.',
  },
  'pilot-wave': {
    'in-none': 'The atom goes through one arm only; the wave goes through both. At the second beam splitter the two parts of the wave recombine and guide the atom to D1, whichever arm it took.',
    'out-none': 'The two wave packets cross, but trajectories cannot cross the symmetry line between them (computed here from the guiding equation for two identical packets). So an atom from the upper arm turns back at the crossing and ends at D1, not at D2, where its beam was heading. Reading the path off the detector is wrong in pilot wave.',
    'in-marker': 'The flag is part of the system. In the panel below, the part of the wave with the atom in the upper arm goes with the flag raised, the other with the flag down. At the second beam splitter the two parts no longer overlap in this combined picture, so the empty part cannot steer the atom: D1 and D2 are each reached half the time.',
    'out-marker': 'The two parts of the wave go with different flag states, so they no longer steer the atom together. The atom goes straight through the crossing: upper arm to D2, lower arm to D1. Without the flag it would turn back at the crossing.',
    'in-bomb': 'If the atom is in the upper arm, the bomb absorbs it. If it is in the lower arm, only the empty part of the wave reaches the bomb. That part becomes tied to an exploded bomb, which is not what happened, so it can no longer cancel the wave at D2: the atom reaches D1 or D2 equally. A D2 click means the wave touched the bomb and the atom did not.',
    'out-bomb': 'Atoms in the upper arm are absorbed by the bomb; atoms in the lower arm go straight to D1, because nothing is left in the upper arm to turn them back.',
  },
  'many-worlds': {
    'in-none': 'Nothing inside the interferometer makes a record, so nothing splits there. The two parts of the wave recombine at the second beam splitter and only D1 has any weight, so even at the detector the world does not split.',
    'out-none': 'When the detectors fire, the world splits into two copies of equal weight: one where D1 clicked and one where D2 clicked.',
    'in-marker': 'The flag records the path, and the world splits into two copies: flag raised and flag down. While the record persists the copies do not interfere, so at the detectors each splits again. D1 and D2 each carry total weight one half.',
    'out-marker': 'The flag splits the world into two copies; in each, the atom reaches one detector.',
    'in-bomb': 'The bomb splits the world. In one copy, of weight one half, it explodes. In the other nothing was absorbed and only the lower part of the wave reaches the second beam splitter, so the D1 and D2 copies each get weight one quarter.',
    'out-bomb': 'An explosion copy of weight one half, and an intact copy in which the atom reaches D1.',
  },
  'spontaneous-collapse': {
    'in-none': 'A single atom almost never collapses on its own (about 3.6 million years on average). Nothing collapses inside the interferometer. When D1 registers the atom, about 10²³ of its nucleons move, and collapse follows within about 100 ns.',
    'out-none': 'No collapse inside the interferometer. When the wave reaches both detectors, their combined state of “clicked” and “not clicked” involves many particles and collapses within about 100 ns onto one detector.',
    'in-marker': 'A microscopic flag does not collapse either (it adds only a few nucleons), but it is entangled with the path, so the interference is lost anyway, exactly as in standard quantum mechanics. Collapse happens at the detectors. With a macroscopic flag (Advanced tab) collapse happens at the flag instead; the statistics are the same.',
    'out-marker': 'Nothing recombines, so there is no interference to lose; collapse happens at whichever detector clicks.',
    'in-bomb': 'Exploded and intact bombs differ macroscopically, so collapse picks one within about 100 ns. If the bomb stays intact, the upper part of the wave is gone; the lower one alone reaches the second beam splitter, and D1 and D2 are equally likely.',
    'out-bomb': 'Collapse at the bomb picks explosion or no explosion. If the bomb stays intact, the atom reaches D1.',
  },
};

// Textbook orthodox account (?arm=textbook): collapse at measurement, no decoherence.
// Any device that registers the path (flag, bomb, detector) counts as a measurement.
export const TEXTBOOK_EXPLAIN = {
  'in-none': 'The wave splits at the first beam splitter and travels both arms. Nothing measures the path, so the two parts recombine at the second beam splitter: they add at D1 and cancel at D2. When D1 registers the atom, the wave collapses there.',
  'out-none': 'With the second beam splitter removed nothing recombines. Each part of the wave heads to one detector, and the wave collapses onto whichever detector registers the atom.',
  'in-marker': 'The flag measures which arm the atom took, even though nobody reads it. A measurement collapses the wave onto one arm, so only one part reaches the second beam splitter, nothing cancels, and D1 and D2 are equally likely.',
  'out-marker': 'The flag measures the path and the wave collapses onto one arm, but without the second beam splitter nothing would have recombined anyway. Each detector fires half the time.',
  'in-bomb': 'The bomb measures whether the atom is in the upper arm. Half the time the wave collapses onto the upper arm and the bomb absorbs the atom. Otherwise it collapses onto the lower arm; a single part reaches the second beam splitter, and D1 and D2 are equally likely.',
  'out-bomb': 'Half the time the bomb absorbs the atom. Otherwise the wave collapses onto the lower arm, which leads straight to D1.',
};
export const TEXTBOOK_PHYSICS = 'The wave function evolves smoothly until a measurement occurs. A measurement, any device that registers which arm the atom took (the flag, the bomb, a detector), collapses the wave onto one outcome, with probabilities given by the Born rule. Interference needs both parts of the wave to reach the second beam splitter, so any measurement of the path removes it.';

// What every account agrees on in each setup, beyond the detector counts (?agree=1).
export const AGREE = {
  'in-none': 'All accounts agree: nothing in the arms registers the path, so both parts of the wave reach the second beam splitter and recombine.',
  'out-none': 'All accounts agree: nothing recombines, so neither detector is favoured.',
  'in-marker': 'All accounts agree: the flag holds a record of the path whether or not anyone reads it, and that record is what removes the interference.',
  'out-marker': 'All accounts agree: without the second beam splitter there was no interference to lose, so the flag changes nothing in the counts.',
  'in-bomb': 'All accounts agree: an atom that reaches a detector, with the bomb intact, came through the lower arm. Only such atoms can reach D2.',
  'out-bomb': 'All accounts agree: an atom that reaches D1 came through the lower arm; every atom that met the bomb was absorbed.',
};

export const VIEW_LABEL = {
  orthodox: 'Orthodox',
  'pilot-wave': 'Pilot Wave',
  'many-worlds': 'Many Worlds',
  'spontaneous-collapse': 'Spontaneous Collapse',
};

// Compare mode: one question per setup, answered by each account for the atom shown.
// Answer functions receive { arm, result, done, pastObject }.
const det = arm => (arm === 'upper' ? 'D2' : 'D1');
const pathQ = 'Which way did this atom go?';
const pathAnswers = {
  orthodox: 'The question has no answer: until a detector clicks the atom has no path, and its wave goes through both arms.',
  'pilot-wave': ({ arm, result, done }) => done && result !== 'bomb' ? `The ${arm} arm, and it reached ${result.toUpperCase()}.` : `The ${arm} arm; its wave took both.`,
  'many-worlds': ({ done }) => done ? 'Both arms, in one world. Only the detector can split it.' : 'Both arms, in one world: nothing inside the interferometer makes a record, so nothing splits there.',
  'spontaneous-collapse': ({ done }) => done ? 'Settled when the detector, with about 10²³ nucleons, registered the atom: collapse within about 100 ns.' : 'No fact yet: a single atom almost never collapses. The detector will settle it.',
};
const markerQ = 'Why is there no interference, although nobody reads the flag?';
const markerAnswers = {
  orthodox: 'Decoherence: the path became entangled with the flag, and parts tied to different flag states cannot interfere. Nobody needs to read the flag, and nothing has collapsed yet.',
  'pilot-wave': 'The two parts of the wave go with different flag states (raised or down), so they cannot overlap and steer the atom together.',
  'many-worlds': 'The record split the world into two copies, and the copies do not interfere.',
  'spontaneous-collapse': ({ done }) => done ? 'Entanglement removed the interference; collapse happened later, at the detector.' : 'Entanglement removes the interference without any collapse; a microscopic flag is far too small to collapse.',
};
const markerOutQ = 'Does the flag change which detector clicks?';
const markerOutAnswers = {
  orthodox: 'No. Without the second beam splitter nothing recombines, so each part of the wave reaches its own detector, flag or not.',
  'pilot-wave': ({ arm }) => `Not the statistics, but this atom’s path: from the ${arm} arm it goes straight on to ${det(arm)}. Without the flag it would have turned back at the crossing.`,
  'many-worlds': 'No. The flag splits the world into two copies, and in each the atom reaches one detector.',
  'spontaneous-collapse': 'No. There is no interference to lose; collapse happens at the detector either way.',
};
const bombQ = 'Did the atom touch the bomb?';
const bombAnswers = {
  orthodox: ({ result, pastObject }) => !pastObject ? 'Not yet decided: the bomb will act as a measurement of the upper arm.' : result === 'bomb' ? 'Yes: the state collapsed onto the bomb’s arm and the bomb absorbed the atom.' : 'No. The bomb became entangled with the path, which ended the interference, and the state collapsed onto the lower arm although nothing was absorbed.',
  'pilot-wave': ({ arm, result }) => result === 'bomb' ? 'Yes: the atom was in the bomb’s arm.' : `No: the atom took the ${arm} arm. Only the empty part of the wave reached the bomb.`,
  'many-worlds': ({ result, pastObject }) => !pastObject ? 'Both possibilities are still in one world.' : result === 'bomb' ? 'In this copy, yes: the bomb absorbed the atom.' : 'Not in this copy. In another copy the bomb absorbed the atom and exploded.',
  'spontaneous-collapse': ({ result, pastObject }) => !pastObject ? 'Not yet: the wave has not reached the bomb.' : result === 'bomb' ? 'Yes: collapse picked “exploded” within about 100 ns.' : 'No: collapse picked “intact” within about 100 ns.',
};
export const ANSWERS = {
  'in-none': { q: pathQ, ...pathAnswers },
  'out-none': { q: pathQ, ...pathAnswers },
  'in-marker': { q: markerQ, ...markerAnswers },
  'out-marker': { q: markerOutQ, ...markerOutAnswers },
  'in-bomb': { q: bombQ, ...bombAnswers },
  'out-bomb': { q: bombQ, ...bombAnswers },
};

// Terms that belong to one account only; hidden when that account is not offered.
export const GLOSSARY_ONLY = { 'Copy of the world': 'many-worlds' };

export const GLOSSARY = [
  ['Entangled', 'The atom’s path and another object (the flag, the bomb) can no longer be described separately: each path goes with its own state of the object.'],
  ['Record', 'A lasting physical difference in some object that depends on which path the atom took, read or not.'],
  ['Decoherence', 'Loss of interference between two parts of the wave once each part is tied to a different state of another object (a flag, a bomb, a detector). It explains why the interference disappears, not which outcome occurs.'],
  ['Collapse', 'In the orthodox and spontaneous-collapse accounts, the sudden change of the wave to one outcome. Orthodox: at a measurement (a postulate). Spontaneous collapse: a physical process, fast only when many particles are involved.'],
  ['Copy of the world', 'Many worlds: after a record, the wave splits into parts that no longer interfere; each part is a separate world. Its weight is the Born-rule probability.'],
  ['Born rule', 'The probability of an outcome is the squared size of the wave for that outcome.'],
  ['Configuration space', 'A combined picture with one axis for the atom’s path and one for the flag or bomb. Two parts of the wave interfere only if they overlap there; parts tied to different flag or bomb states do not (decoherence). Pilot wave: they steer the atom together only if they overlap.'],
  ['Bright and dark port', 'With the interferometer tuned, every atom leaves toward D1 (bright port) and none toward D2 (dark port).'],
];
