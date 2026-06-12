@group(0) @binding(1) var<storage, read_write> waveOut: array<WaveCell>;

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
  return all(xPx > vec3<f32>(0.0)) && all(xPx < maxP);
}
fn boxEigenstateAtPx(xPx: vec3<f32>) -> vec2<f32> {
  if (!isInterior(xPx)) { return vec2<f32>(0.0); }
  let maxP = max(uni.sim.xyz - vec3<f32>(1.0), vec3<f32>(1.0));
  let modes = max(vec3<f32>(1.0), round(uni.initState.yzw));
  let phase = 3.14159265359 * modes * xPx / maxP;
  let amp = sin(phase.x) * sin(phase.y) * sin(phase.z);
  return vec2<f32>(amp, 0.0);
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
  if (!isInterior(xPx)) {
    waveOut[id] = WaveCell(vec2<f32>(0.0), vec2<f32>(0.0), vec2<f32>(0.0), vec2<f32>(0.0));
    return;
  }
  let psi0 = boxEigenstateAtPx(xPx);
  let psiE = boxEigenstateAtPx(xPx + vec3<f32>( 1.0, 0.0, 0.0));
  let psiW = boxEigenstateAtPx(xPx + vec3<f32>(-1.0, 0.0, 0.0));
  let psiN = boxEigenstateAtPx(xPx + vec3<f32>(0.0,  1.0, 0.0));
  let psiS = boxEigenstateAtPx(xPx + vec3<f32>(0.0, -1.0, 0.0));
  let psiU = boxEigenstateAtPx(xPx + vec3<f32>(0.0, 0.0,  1.0));
  let psiD = boxEigenstateAtPx(xPx + vec3<f32>(0.0, 0.0, -1.0));
  let psiE2 = boxEigenstateAtPx(xPx + vec3<f32>( 2.0, 0.0, 0.0));
  let psiW2 = boxEigenstateAtPx(xPx + vec3<f32>(-2.0, 0.0, 0.0));
  let psiN2 = boxEigenstateAtPx(xPx + vec3<f32>(0.0,  2.0, 0.0));
  let psiS2 = boxEigenstateAtPx(xPx + vec3<f32>(0.0, -2.0, 0.0));
  let psiU2 = boxEigenstateAtPx(xPx + vec3<f32>(0.0, 0.0,  2.0));
  let psiD2 = boxEigenstateAtPx(xPx + vec3<f32>(0.0, 0.0, -2.0));
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
  let dpsidx = (-psiE2 + 8.0 * psiE - 8.0 * psiW + psiW2) / 12.0;
  let dpsidy = (-psiN2 + 8.0 * psiN - 8.0 * psiS + psiS2) / 12.0;
  let dpsidz = (-psiU2 + 8.0 * psiU - 8.0 * psiD + psiD2) / 12.0;
  var upScale = 1.0;
  var downScale = 0.0;
  if (uni.field.z > 1.5) {
    upScale = 0.70710678118;
    downScale = 0.70710678118;
  } else if (uni.field.z > 0.5) {
    upScale = 0.0;
    downScale = 1.0;
  }
  let psiUp0 = upScale * psi0;
  let psiDown0 = downScale * psi0;
  let lap = covariantLaplacian(psi0, lapX + lapY + lapZ, dpsidx, dpsidy, dpsidz, xPx);
  let rhs0 = pauliRHS(
    psiUp0,
    psiDown0,
    upScale * lap,
    downScale * lap,
    xPx
  );
  let psiPrevUp = psiUp0 - uni.physics.w * rhs0.xy;
  let psiPrevDown = psiDown0 - uni.physics.w * rhs0.zw;
  waveOut[id] = WaveCell(psiUp0, psiDown0, psiPrevUp, psiPrevDown);
}
