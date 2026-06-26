
struct Uniforms {
  sim: vec4<f32>,
  physics: vec4<f32>,
  packet: vec4<f32>,
  visual0: vec4<f32>,
  visual1: vec4<f32>,
  particle0: vec4<f32>,
  particle1: vec4<f32>,
  camera: vec4<f32>,
  viewport: vec4<f32>,
  detector: vec4<f32>,
  trail0: vec4<f32>,
  density0: vec4<f32>,
  lineColor: vec4<f32>,
  boxCenter: vec4<f32>,
  sgField: vec4<f32>,
  visual2: vec4<f32>,
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
fn sgMagneticFieldAt(xPx: vec3<f32>) -> vec3<f32> {
  let g = uni.sgField.x;
  let center = 0.5 * (uni.sim.xyz - vec3<f32>(1.0));
  let r = xPx - center;
  let scale = max(1.0, center.z);
  let bias = 0.5 * g;
  return vec3<f32>(
    0.0,
    -g * r.y / scale,
    bias + g * r.z / scale
  );
}
fn magneticFieldAt(xPx: vec3<f32>) -> vec3<f32> {
  return sgMagneticFieldAt(xPx);
}

fn simResU() -> vec3<u32> {
  return vec3<u32>(u32(uni.sim.x), u32(uni.sim.y), u32(uni.sim.z));
}
fn simResI() -> vec3<i32> {
  return vec3<i32>(i32(uni.sim.x), i32(uni.sim.y), i32(uni.sim.z));
}
fn wrapIndex(x: i32, n: i32) -> i32 {
  let m = x % n;
  if (m < 0) { return m + n; }
  return m;
}
fn xPeriodI() -> i32 {
  return max(1, simResI().x - 1);
}
fn xPeriodF() -> f32 {
  return max(1.0, uni.sim.x - 1.0);
}
fn wrapIndexX(x: i32) -> i32 {
  return wrapIndex(x, xPeriodI());
}
fn wrapCoordF(x: f32, period: f32) -> f32 {
  return x - period * floor(x / period);
}
fn periodicDeltaF(x: f32, center: f32, period: f32) -> f32 {
  let d = x - center;
  return d - period * floor(d / period + 0.5);
}
fn nearestVisualX(x: f32) -> f32 {
  let period = xPeriodF();
  return x + period * floor((uni.visual2.x - x) / period + 0.5);
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
