struct Uniforms {
  sim: vec4<f32>,
  physics: vec4<f32>,
  visual0: vec4<f32>,
  visual1: vec4<f32>,
  particle0: vec4<f32>,
  particle1: vec4<f32>,
  camera: vec4<f32>,
  viewport: vec4<f32>,
  contour0: vec4<f32>,
  contour1: vec4<f32>,
  density0: vec4<f32>,
  lineColor: vec4<f32>,
  boxCenter: vec4<f32>,
  field: vec4<f32>,
  initState: vec4<f32>,
  viewProj: mat4x4<f32>,
};
@group(0) @binding(0) var<uniform> uni: Uniforms;

struct WaveCell {
  psiUp: vec2<f32>,
  psiDown: vec2<f32>,
  prevUp: vec2<f32>,
  prevDown: vec2<f32>,
};

struct Spinor {
  up: vec2<f32>,
  down: vec2<f32>,
};

fn spinorZero() -> Spinor {
  return Spinor(vec2<f32>(0.0), vec2<f32>(0.0));
}
fn waveSpinor(cell: WaveCell) -> Spinor {
  return Spinor(cell.psiUp, cell.psiDown);
}
fn spinorRho(spinor: Spinor) -> f32 {
  return dot(spinor.up, spinor.up) + dot(spinor.down, spinor.down);
}
fn spinDensity(spinor: Spinor) -> vec3<f32> {
  let up = spinor.up;
  let down = spinor.down;
  return vec3<f32>(
    2.0 * (up.x * down.x + up.y * down.y),
    2.0 * (up.x * down.y - up.y * down.x),
    dot(up, up) - dot(down, down)
  );
}
fn imagConjMul(a: vec2<f32>, b: vec2<f32>) -> f32 {
  return a.x * b.y - a.y * b.x;
}
fn mulNegI(z: vec2<f32>) -> vec2<f32> {
  return vec2<f32>(z.y, -z.x);
}
fn chargeOverC() -> f32 {
  return 1.0;
}
fn magneticFieldVector() -> vec3<f32> {
  let b = uni.field.x;
  let axis = i32(round(uni.field.w));
  if (axis == 0) { return vec3<f32>(b, 0.0, 0.0); }
  if (axis == 1) { return vec3<f32>(0.0, b, 0.0); }
  return vec3<f32>(0.0, 0.0, b);
}
fn vectorPotentialAt(xPx: vec3<f32>) -> vec3<f32> {
  let center = 0.5 * (uni.sim.xyz - vec3<f32>(1.0));
  let r = xPx - center;
  return 0.5 * cross(magneticFieldVector(), r);
}
fn magneticFieldAt(xPx: vec3<f32>) -> vec3<f32> {
  _ = xPx;
  return magneticFieldVector();
}
fn covariantLaplacian(
  psi: vec2<f32>,
  lapPsi: vec2<f32>,
  dpsidx: vec2<f32>,
  dpsidy: vec2<f32>,
  dpsidz: vec2<f32>,
  xPx: vec3<f32>
) -> vec2<f32> {
  let hbar = max(uni.physics.x, 1e-6);
  let coupling = chargeOverC() / hbar;
  let a = vectorPotentialAt(xPx);
  let aDotGrad = a.x * dpsidx + a.y * dpsidy + a.z * dpsidz;
  return lapPsi + 2.0 * coupling * mulNegI(aDotGrad) - coupling * coupling * dot(a, a) * psi;
}

fn simResU() -> vec3<u32> {
  return vec3<u32>(u32(uni.sim.x), u32(uni.sim.y), u32(uni.sim.z));
}
fn simResI() -> vec3<i32> {
  return vec3<i32>(i32(uni.sim.x), i32(uni.sim.y), i32(uni.sim.z));
}
fn voxelIndexU(p: vec3<u32>) -> u32 {
  let s = simResU();
  return p.x + p.y * s.x + p.z * s.x * s.y;
}
fn voxelIndexI(p: vec3<i32>) -> u32 {
  let s = simResI();
  return u32(p.x + p.y * s.x + p.z * s.x * s.y);
}
fn quadCorner(v: u32) -> vec2<f32> {
  if (v == 0u) { return vec2<f32>(-0.5, -0.5); }
  if (v == 1u) { return vec2<f32>( 0.5, -0.5); }
  if (v == 2u) { return vec2<f32>(-0.5,  0.5); }
  if (v == 3u) { return vec2<f32>(-0.5,  0.5); }
  if (v == 4u) { return vec2<f32>( 0.5, -0.5); }
  return vec2<f32>(0.5, 0.5);
}
