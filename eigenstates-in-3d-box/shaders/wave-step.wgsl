@group(0) @binding(1) var<storage, read> waveIn: array<WaveCell>;
@group(0) @binding(2) var<storage, read_write> waveOut: array<WaveCell>;

fn fetchSpinor(p: vec3<i32>) -> Spinor {
  let s = simResI();
  if (any(p < vec3<i32>(0)) || any(p >= s)) {
    return spinorZero();
  }
  return waveSpinor(waveIn[voxelIndexI(p)]);
}
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
fn isBoundary(p: vec3<i32>) -> bool {
  let s = simResI();
  return any(p <= vec3<i32>(0)) || any(p >= s - vec3<i32>(1));
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
  let p = vec3<i32>(i32(x), i32(y), i32(z));
  if (isBoundary(p)) {
    waveOut[id] = WaveCell(vec2<f32>(0.0), vec2<f32>(0.0), vec2<f32>(0.0), vec2<f32>(0.0));
    return;
  }
  let state = waveIn[voxelIndexI(p)];
  let psiUp = state.psiUp;
  let psiDown = state.psiDown;
  let psiPrevUp = state.prevUp;
  let psiPrevDown = state.prevDown;
  let spinE = fetchSpinor(p + vec3<i32>( 1, 0, 0));
  let spinW = fetchSpinor(p + vec3<i32>(-1, 0, 0));
  let spinN = fetchSpinor(p + vec3<i32>(0,  1, 0));
  let spinS = fetchSpinor(p + vec3<i32>(0, -1, 0));
  let spinU = fetchSpinor(p + vec3<i32>(0, 0,  1));
  let spinD = fetchSpinor(p + vec3<i32>(0, 0, -1));
  let spinE2 = fetchSpinor(p + vec3<i32>( 2, 0, 0));
  let spinW2 = fetchSpinor(p + vec3<i32>(-2, 0, 0));
  let spinN2 = fetchSpinor(p + vec3<i32>(0,  2, 0));
  let spinS2 = fetchSpinor(p + vec3<i32>(0, -2, 0));
  let spinU2 = fetchSpinor(p + vec3<i32>(0, 0,  2));
  let spinD2 = fetchSpinor(p + vec3<i32>(0, 0, -2));
  let lapUp = (
    -spinE2.up + 16.0 * spinE.up - 30.0 * psiUp + 16.0 * spinW.up - spinW2.up
    -spinN2.up + 16.0 * spinN.up - 30.0 * psiUp + 16.0 * spinS.up - spinS2.up
    -spinU2.up + 16.0 * spinU.up - 30.0 * psiUp + 16.0 * spinD.up - spinD2.up
  ) / 12.0;
  let lapDown = (
    -spinE2.down + 16.0 * spinE.down - 30.0 * psiDown + 16.0 * spinW.down - spinW2.down
    -spinN2.down + 16.0 * spinN.down - 30.0 * psiDown + 16.0 * spinS.down - spinS2.down
    -spinU2.down + 16.0 * spinU.down - 30.0 * psiDown + 16.0 * spinD.down - spinD2.down
  ) / 12.0;
  let dpsidxUp = (-spinE2.up + 8.0 * spinE.up - 8.0 * spinW.up + spinW2.up) / 12.0;
  let dpsidyUp = (-spinN2.up + 8.0 * spinN.up - 8.0 * spinS.up + spinS2.up) / 12.0;
  let dpsidzUp = (-spinU2.up + 8.0 * spinU.up - 8.0 * spinD.up + spinD2.up) / 12.0;
  let dpsidxDown = (-spinE2.down + 8.0 * spinE.down - 8.0 * spinW.down + spinW2.down) / 12.0;
  let dpsidyDown = (-spinN2.down + 8.0 * spinN.down - 8.0 * spinS.down + spinS2.down) / 12.0;
  let dpsidzDown = (-spinU2.down + 8.0 * spinU.down - 8.0 * spinD.down + spinD2.down) / 12.0;
  let covLapUp = covariantLaplacian(
    psiUp,
    lapUp,
    dpsidxUp,
    dpsidyUp,
    dpsidzUp,
    vec3<f32>(f32(p.x), f32(y), f32(z))
  );
  let covLapDown = covariantLaplacian(
    psiDown,
    lapDown,
    dpsidxDown,
    dpsidyDown,
    dpsidzDown,
    vec3<f32>(f32(p.x), f32(y), f32(z))
  );
  let rhs = pauliRHS(
    psiUp,
    psiDown,
    covLapUp,
    covLapDown,
    vec3<f32>(f32(p.x), f32(y), f32(z))
  );
  let psiNextUp = psiPrevUp + 2.0 * uni.physics.w * rhs.xy;
  let psiNextDown = psiPrevDown + 2.0 * uni.physics.w * rhs.zw;
  waveOut[id] = WaveCell(psiNextUp, psiNextDown, psiUp, psiDown);
}
