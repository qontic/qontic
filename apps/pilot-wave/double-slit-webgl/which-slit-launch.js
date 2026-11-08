// Deliberately biased starting positions for the single-particle demonstration.
// Back-project a broad Gaussian proposal near either aperture through free
// spreading. This changes only the initial particle sample, never its guidance.
export function sampleWhichSlitStart(p, { width, height, stageHeight, paddingY }, random = Math.random) {
  const centerX = p.packetX * width;
  const centerY = paddingY + p.packetY * stageHeight;
  const front = p.barrierX * width - p.barrierThick * 0.5 - 2;
  const distance = Math.max(1, front - centerX);
  const slit = random() < 0.5 ? -1 : 1;
  // A tiny interval aimed at each slit center samples mainly its outer-going
  // trajectories: the incident packet is already fanning out near the wall.
  // Include the inner routes as well. This is still a transmission-biased
  // proposal, not an exact sample of the transmitted Born flux.
  let offset;
  do {
    offset = Math.sqrt(-2 * Math.log(Math.max(random(), 1e-12)))
      * Math.cos(2 * Math.PI * random()) * p.slitWidth * 0.35;
  } while (Math.abs(offset) > p.slitWidth * 0.7);
  const targetDistance = Math.max(p.slitWidth * 0.1,
    p.slitSep * 0.5 - p.slitWidth * 0.28 + offset);
  const targetY = height * 0.5 + slit * targetDistance;
  // Narrow apertures transmit mainly the leading tail of this wave packet.
  const narrowBias = Math.max(0, (18 - p.slitWidth) / 12);
  const lead = Math.min(distance * (0.55 + 0.30 * narrowBias),
    p.packetSigma * (1.2 + 1.4 * narrowBias + 0.3 * random()));
  const velocity = Math.max(0.01, p.hbar / p.mass * Math.sin(p.p0 / p.hbar));
  const spreadRate = p.hbar / (p.mass * p.packetSigma ** 2);
  const spread = t => Math.hypot(1, spreadRate * t);
  let low = 0, high = distance / velocity;
  for (let i = 0; i < 32; i++) {
    const t = (low + high) * 0.5;
    if (velocity * t + lead * spread(t) < distance) low = t;
    else high = t;
  }
  const time = (low + high) * 0.5;
  const y = (targetY - centerY) / spread(time);
  const angle = p.guidingMode === 1
    ? 2 * p.spinMagnitude * p.spinSign * Math.atan(spreadRate * time) : 0;
  const x0 = centerX + Math.cos(angle) * lead + Math.sin(angle) * y;
  const y0 = centerY - Math.sin(angle) * lead + Math.cos(angle) * y;
  const left = 1.2 * 2.25 * (p.absorbPx + p.particleKillMargin) + 4;
  return [Math.max(1, Math.min(front - 2, Math.max(left, x0))), Math.max(1, Math.min(height - 2, y0))];
}
