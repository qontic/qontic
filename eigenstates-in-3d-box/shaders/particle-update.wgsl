@group(0) @binding(1) var<storage, read> wave: array<WaveCell>;
@group(0) @binding(2) var<storage, read> particlesIn: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> particlesOut: array<vec4<f32>>;

fn fetchSpinorVoxel(p: vec3<i32>) -> Spinor {
  let s = simResI();
  if (any(p < vec3<i32>(0)) || any(p >= s)) {
    return spinorZero();
  }
  return waveSpinor(wave[voxelIndexI(p)]);
}
fn mixSpinor(a: Spinor, b: Spinor, t: f32) -> Spinor {
  return Spinor(mix(a.up, b.up, t), mix(a.down, b.down, t));
}
fn sampleSpinorTrilinear(xPx: vec3<f32>) -> Spinor {
  let x0f = floor(xPx);
  let f = xPx - x0f;
  let p000 = vec3<i32>(x0f);
  let p100 = p000 + vec3<i32>(1, 0, 0);
  let p010 = p000 + vec3<i32>(0, 1, 0);
  let p110 = p000 + vec3<i32>(1, 1, 0);
  let p001 = p000 + vec3<i32>(0, 0, 1);
  let p101 = p000 + vec3<i32>(1, 0, 1);
  let p011 = p000 + vec3<i32>(0, 1, 1);
  let p111 = p000 + vec3<i32>(1, 1, 1);
  let c00 = mixSpinor(fetchSpinorVoxel(p000), fetchSpinorVoxel(p100), f.x);
  let c10 = mixSpinor(fetchSpinorVoxel(p010), fetchSpinorVoxel(p110), f.x);
  let c01 = mixSpinor(fetchSpinorVoxel(p001), fetchSpinorVoxel(p101), f.x);
  let c11 = mixSpinor(fetchSpinorVoxel(p011), fetchSpinorVoxel(p111), f.x);
  let c0 = mixSpinor(c00, c10, f.y);
  let c1 = mixSpinor(c01, c11, f.y);
  return mixSpinor(c0, c1, f.z);
}
fn pauliCurrentVelocity(
  spinor: Spinor,
  dpsidx: Spinor,
  dpsidy: Spinor,
  dpsidz: Spinor,
  rhoEff: f32
) -> vec3<f32> {
  let hbar = max(uni.physics.x, 1e-6);
  let mass = max(uni.physics.y, 1e-6);
  let scale = hbar / mass;
  let current = scale * vec3<f32>(
    imagConjMul(spinor.up, dpsidx.up) + imagConjMul(spinor.down, dpsidx.down),
    imagConjMul(spinor.up, dpsidy.up) + imagConjMul(spinor.down, dpsidy.down),
    imagConjMul(spinor.up, dpsidz.up) + imagConjMul(spinor.down, dpsidz.down)
  ) / rhoEff;
  return current;
}
fn pauliSpinCorrection(rhoEff: f32, curlSpin: vec3<f32>) -> vec3<f32> {
  return uni.particle0.w * (uni.physics.x / uni.physics.y) * curlSpin / rhoEff;
}
fn guidingVelocity(xPx: vec3<f32>) -> vec3<f32> {
  let spinor = sampleSpinorTrilinear(xPx);
  let spinE = sampleSpinorTrilinear(xPx + vec3<f32>(1.0, 0.0, 0.0));
  let spinW = sampleSpinorTrilinear(xPx + vec3<f32>(-1.0, 0.0, 0.0));
  let spinN = sampleSpinorTrilinear(xPx + vec3<f32>(0.0, 1.0, 0.0));
  let spinS = sampleSpinorTrilinear(xPx + vec3<f32>(0.0, -1.0, 0.0));
  let spinU = sampleSpinorTrilinear(xPx + vec3<f32>(0.0, 0.0, 1.0));
  let spinD = sampleSpinorTrilinear(xPx + vec3<f32>(0.0, 0.0, -1.0));
  let spinE2 = sampleSpinorTrilinear(xPx + vec3<f32>(2.0, 0.0, 0.0));
  let spinW2 = sampleSpinorTrilinear(xPx + vec3<f32>(-2.0, 0.0, 0.0));
  let spinN2 = sampleSpinorTrilinear(xPx + vec3<f32>(0.0, 2.0, 0.0));
  let spinS2 = sampleSpinorTrilinear(xPx + vec3<f32>(0.0, -2.0, 0.0));
  let spinU2 = sampleSpinorTrilinear(xPx + vec3<f32>(0.0, 0.0, 2.0));
  let spinD2 = sampleSpinorTrilinear(xPx + vec3<f32>(0.0, 0.0, -2.0));
  let dpsidx = Spinor(
    (-spinE2.up + 8.0 * spinE.up - 8.0 * spinW.up + spinW2.up) / 12.0,
    (-spinE2.down + 8.0 * spinE.down - 8.0 * spinW.down + spinW2.down) / 12.0
  );
  let dpsidy = Spinor(
    (-spinN2.up + 8.0 * spinN.up - 8.0 * spinS.up + spinS2.up) / 12.0,
    (-spinN2.down + 8.0 * spinN.down - 8.0 * spinS.down + spinS2.down) / 12.0
  );
  let dpsidz = Spinor(
    (-spinU2.up + 8.0 * spinU.up - 8.0 * spinD.up + spinD2.up) / 12.0,
    (-spinU2.down + 8.0 * spinU.down - 8.0 * spinD.down + spinD2.down) / 12.0
  );
  let rho = spinorRho(spinor);
  let rhoEff = max(rho, uni.particle1.x);
  var v = pauliCurrentVelocity(spinor, dpsidx, dpsidy, dpsidz, rhoEff);
  v = v - chargeOverC() * vectorPotentialAt(xPx) / max(uni.physics.y, 1e-6);
  let mE = spinDensity(spinE);
  let mW = spinDensity(spinW);
  let mN = spinDensity(spinN);
  let mS = spinDensity(spinS);
  let mU = spinDensity(spinU);
  let mD = spinDensity(spinD);
  let mE2 = spinDensity(spinE2);
  let mW2 = spinDensity(spinW2);
  let mN2 = spinDensity(spinN2);
  let mS2 = spinDensity(spinS2);
  let mU2 = spinDensity(spinU2);
  let mD2 = spinDensity(spinD2);
  let dMdx = (-mE2 + 8.0 * mE - 8.0 * mW + mW2) / 12.0;
  let dMdy = (-mN2 + 8.0 * mN - 8.0 * mS + mS2) / 12.0;
  let dMdz = (-mU2 + 8.0 * mU - 8.0 * mD + mD2) / 12.0;
  let curlSpin = vec3<f32>(
    dMdy.z - dMdz.y,
    dMdz.x - dMdx.z,
    dMdx.y - dMdy.x
  );
  v = v + pauliSpinCorrection(rhoEff, curlSpin);
  let sp = length(v);
  if (sp > uni.particle1.y) {
    v = v * (uni.particle1.y / sp);
  }
  return v;
}
fn modf1(x: f32, y: f32) -> f32 {
  return x - y * floor(x / y);
}
fn reflectCoord(x: f32, lo: f32, hi: f32) -> f32 {
  if (hi <= lo) { return 0.5 * (lo + hi); }
  let width = hi - lo;
  let period = 2.0 * width;
  let y = modf1(x - lo, period);
  return lo + select(period - y, y, y <= width);
}
fn reflectIntoBox(xPx: vec3<f32>) -> vec3<f32> {
  let maxX = uni.sim.xyz - vec3<f32>(1.0);
  let lo = vec3<f32>(0.001);
  let hi = maxX - vec3<f32>(0.001);
  return vec3<f32>(
    reflectCoord(xPx.x, lo.x, hi.x),
    reflectCoord(xPx.y, lo.y, hi.y),
    reflectCoord(xPx.z, lo.z, hi.z)
  );
}

@compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let id = gid.x;
  if (id >= u32(uni.particle1.z)) { return; }
  let state = particlesIn[id];
  let x = reflectIntoBox(state.xyz);
  let v1 = guidingVelocity(x);
  let xm = reflectIntoBox(x + 0.5 * uni.physics.w * v1);
  let v2 = guidingVelocity(xm);
  let xh = reflectIntoBox(x + 0.5 * uni.physics.w * v2);
  let v3 = guidingVelocity(xh);
  let xe = reflectIntoBox(x + uni.physics.w * v3);
  let v4 = guidingVelocity(xe);
  let xn = reflectIntoBox(x + (uni.physics.w / 6.0) * (v1 + 2.0 * v2 + 2.0 * v3 + v4));
  particlesOut[id] = vec4<f32>(xn.x, xn.y, xn.z, xn.x);
}
