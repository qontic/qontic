// Bits 0–1 retain the starting quadrant; bits 2–3 retain the radial quartile.
// Rank the actual sample so finite ensembles have equal populations (±1).
export function assignRadialGroups(states, centerX, centerY) {
  const count = states.length / 4;
  const radiusSquared = Array.from({ length: count }, (_, i) =>
    (states[i * 4] - centerX) ** 2 + (states[i * 4 + 1] - centerY) ** 2);
  const order = Array.from({ length: count }, (_, i) => i);
  order.sort((a, b) => radiusSquared[a] - radiusSquared[b] || a - b);
  for (let rank = 0; rank < count; rank++) {
    const index = order[rank] * 4 + 3;
    states[index] = (Math.round(states[index]) & 3) | (Math.floor(rank * 4 / count) << 2);
  }
}
