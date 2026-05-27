
@group(0) @binding(1) var<storage, read_write> waveOut: array<WaveCell>;

fn sqr(x: f32) -> f32 { return x * x; }
fn cis(a: f32) -> vec2<f32> { return vec2<f32>(cos(a), sin(a)); }
fn packetWaveNumber() -> f32 {
  let requestedK = uni.physics.z / max(uni.physics.x, 1e-6);
  let mode = round(requestedK * xPeriodF() / 6.28318530718);
  return mode * 6.28318530718 / xPeriodF();
}
fn packetMomentum() -> f32 { return uni.physics.x * packetWaveNumber(); }
fn kineticEnergy() -> f32 { return 0.5 * sqr(packetMomentum()) / uni.physics.y; }
fn orbitalComponentRHS(
  lapPsi: vec2<f32>
) -> vec2<f32> {
  let hbar = max(uni.physics.x, 1e-6);
  let mass = max(uni.physics.y, 1e-6);
  let cLap = hbar / (2.0 * mass);
  return vec2<f32>(-cLap * lapPsi.y, cLap * lapPsi.x);
}
fn sigmaDotBUp(psiUp: vec2<f32>, psiDown: vec2<f32>, xPx: vec3<f32>) -> vec2<f32> {
  let b = magneticFieldAt(xPx);
  return b.z * psiUp + vec2<f32>(
    b.x * psiDown.x + b.y * psiDown.y,
    b.x * psiDown.y - b.y * psiDown.x
  );
}
fn sigmaDotBDown(psiUp: vec2<f32>, psiDown: vec2<f32>, xPx: vec3<f32>) -> vec2<f32> {
  let b = magneticFieldAt(xPx);
  return vec2<f32>(
    b.x * psiUp.x - b.y * psiUp.y,
    b.x * psiUp.y + b.y * psiUp.x
  ) - b.z * psiDown;
}
fn pauliRHS(
  psiUp: vec2<f32>,
  psiDown: vec2<f32>,
  lapUp: vec2<f32>,
  lapDown: vec2<f32>,
  xPx: vec3<f32>
) -> vec4<f32> {
  let mass = max(uni.physics.y, 1e-6);
  let zeemanRate = 1.0 / (2.0 * mass);
  let rhsUp = orbitalComponentRHS(lapUp)
    - zeemanRate * mulNegI(sigmaDotBUp(psiUp, psiDown, xPx));
  let rhsDown = orbitalComponentRHS(lapDown)
    - zeemanRate * mulNegI(sigmaDotBDown(psiUp, psiDown, xPx));
  return vec4<f32>(rhsUp, rhsDown);
}
fn isInterior(xPx: vec3<f32>) -> bool {
  let maxP = uni.sim.xyz - vec3<f32>(1.0);
  return xPx.y > 0.0 && xPx.z > 0.0 && xPx.y < maxP.y && xPx.z < maxP.z;
}
fn initialPacketAtPx(xPx: vec3<f32>, t: f32) -> vec2<f32> {
  if (!isInterior(xPx)) { return vec2<f32>(0.0); }
  let x0 = uni.packet.xyz * (uni.sim.xyz - vec3<f32>(1.0));
  let periodX = xPeriodF();
  let xWrapped = wrapCoordF(xPx.x, periodX);
  var d = vec3<f32>(periodicDeltaF(xWrapped, x0.x, periodX), xPx.y - x0.y, xPx.z - x0.z);
  let amp = exp(-dot(d, d) / (2.0 * sqr(uni.packet.w)));
  let k = packetWaveNumber();
  let phaseSpace = k * d.x;
  let phaseTime = -kineticEnergy() * t / uni.physics.x;
  return amp * cis(phaseSpace + phaseTime);
}

@compute @workgroup_size(${WAVE_WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let id = gid.x;
  if (id >= u32(uni.sim.w)) { return; }
  let s = simResU();
  let slice = s.x * s.y;
  let z = id / slice;
  let rem = id - z * slice;
  let y = rem / s.x;
  let x = rem - y * s.x;
  let xPx = vec3<f32>(f32(x), f32(y), f32(z));
  let xEvalPx = vec3<f32>(wrapCoordF(xPx.x, xPeriodF()), xPx.y, xPx.z);
  if (!isInterior(xPx)) {
    waveOut[id] = WaveCell(vec2<f32>(0.0), vec2<f32>(0.0), vec2<f32>(0.0), vec2<f32>(0.0));
    return;
  }
  let psi0 = initialPacketAtPx(xPx, 0.0);
  let psiE = initialPacketAtPx(xPx + vec3<f32>( 1.0, 0.0, 0.0), 0.0);
  let psiW = initialPacketAtPx(xPx + vec3<f32>(-1.0, 0.0, 0.0), 0.0);
  let psiN = initialPacketAtPx(xPx + vec3<f32>(0.0,  1.0, 0.0), 0.0);
  let psiS = initialPacketAtPx(xPx + vec3<f32>(0.0, -1.0, 0.0), 0.0);
  let psiU = initialPacketAtPx(xPx + vec3<f32>(0.0, 0.0,  1.0), 0.0);
  let psiD = initialPacketAtPx(xPx + vec3<f32>(0.0, 0.0, -1.0), 0.0);
  let psiE2 = initialPacketAtPx(xPx + vec3<f32>( 2.0, 0.0, 0.0), 0.0);
  let psiW2 = initialPacketAtPx(xPx + vec3<f32>(-2.0, 0.0, 0.0), 0.0);
  let psiN2 = initialPacketAtPx(xPx + vec3<f32>(0.0,  2.0, 0.0), 0.0);
  let psiS2 = initialPacketAtPx(xPx + vec3<f32>(0.0, -2.0, 0.0), 0.0);
  let psiU2 = initialPacketAtPx(xPx + vec3<f32>(0.0, 0.0,  2.0), 0.0);
  let psiD2 = initialPacketAtPx(xPx + vec3<f32>(0.0, 0.0, -2.0), 0.0);
  let lapX = (
    -psiE2
    + 16.0 * psiE
    - 30.0 * psi0
    + 16.0 * psiW
    - psiW2
  ) / 12.0;
  let lapY = (
    -psiN2
    + 16.0 * psiN
    - 30.0 * psi0
    + 16.0 * psiS
    - psiS2
  ) / 12.0;
  let lapZ = (
    -psiU2
    + 16.0 * psiU
    - 30.0 * psi0
    + 16.0 * psiD
    - psiD2
  ) / 12.0;
  var upScale = 1.0;
  var downScale = 0.0;
  if (uni.sgField.z > 0.5) {
    upScale = 0.70710678118;
    downScale = 0.70710678118;
  }
  let psiUp0 = upScale * psi0;
  let psiDown0 = downScale * psi0;
  let lap = lapX + lapY + lapZ;
  let rhs0 = pauliRHS(
    psiUp0,
    psiDown0,
    upScale * lap,
    downScale * lap,
    xEvalPx
  );
  let psiPrevUp = psiUp0 - uni.physics.w * rhs0.xy;
  let psiPrevDown = psiDown0 - uni.physics.w * rhs0.zw;
  waveOut[id] = WaveCell(psiUp0, psiDown0, psiPrevUp, psiPrevDown);
}
