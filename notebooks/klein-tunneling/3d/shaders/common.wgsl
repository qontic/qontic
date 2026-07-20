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

// Four complex Dirac amplitudes plus the previous leapfrog time slice.
// Standard Dirac representation: psi = (phi_0, phi_1, chi_0, chi_1)^T.
struct WaveCell {
  c0: vec2<f32>,
  c1: vec2<f32>,
  c2: vec2<f32>,
  c3: vec2<f32>,
  p0: vec2<f32>,
  p1: vec2<f32>,
  p2: vec2<f32>,
  p3: vec2<f32>,
};

struct Dirac4 {
  c0: vec2<f32>,
  c1: vec2<f32>,
  c2: vec2<f32>,
  c3: vec2<f32>,
};

fn diracZero() -> Dirac4 {
  return Dirac4(vec2<f32>(0.0), vec2<f32>(0.0), vec2<f32>(0.0), vec2<f32>(0.0));
}
fn waveDirac(cell: WaveCell) -> Dirac4 {
  return Dirac4(cell.c0, cell.c1, cell.c2, cell.c3);
}
fn diracRho(s: Dirac4) -> f32 {
  return dot(s.c0, s.c0) + dot(s.c1, s.c1) + dot(s.c2, s.c2) + dot(s.c3, s.c3);
}
fn cconjMulRe(a: vec2<f32>, b: vec2<f32>) -> f32 {
  return a.x * b.x + a.y * b.y;
}
fn cconjMulIm(a: vec2<f32>, b: vec2<f32>) -> f32 {
  return a.x * b.y - a.y * b.x;
}
fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
  return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
fn mulI(z: vec2<f32>) -> vec2<f32> {
  return vec2<f32>(-z.y, z.x);
}
fn mulNegI(z: vec2<f32>) -> vec2<f32> {
  return vec2<f32>(z.y, -z.x);
}
fn cis(a: f32) -> vec2<f32> {
  return vec2<f32>(cos(a), sin(a));
}

fn simResU() -> vec3<u32> {
  return vec3<u32>(u32(uni.sim.x), u32(uni.sim.y), u32(uni.sim.z));
}
fn simResI() -> vec3<i32> {
  return vec3<i32>(i32(uni.sim.x), i32(uni.sim.y), i32(uni.sim.z));
}
fn periodI() -> vec3<i32> {
  return max(vec3<i32>(1), simResI() - vec3<i32>(1));
}
fn periodF() -> vec3<f32> {
  return max(vec3<f32>(1.0), uni.sim.xyz - vec3<f32>(1.0));
}
fn wrapIndex1(x: i32, n: i32) -> i32 {
  let m = x % n;
  if (m < 0) { return m + n; }
  return m;
}
fn wrapIndex3(p: vec3<i32>) -> vec3<i32> {
  let n = periodI();
  return vec3<i32>(wrapIndex1(p.x, n.x), wrapIndex1(p.y, n.y), wrapIndex1(p.z, n.z));
}
fn wrapCoord1(x: f32, period: f32) -> f32 {
  return x - period * floor(x / period);
}
fn wrapCoord3(x: vec3<f32>) -> vec3<f32> {
  let p = periodF();
  return vec3<f32>(wrapCoord1(x.x, p.x), wrapCoord1(x.y, p.y), wrapCoord1(x.z, p.z));
}
fn periodicDelta1(x: f32, center: f32, period: f32) -> f32 {
  let d = x - center;
  return d - period * floor(d / period + 0.5);
}
fn periodicDelta3(x: vec3<f32>, center: vec3<f32>) -> vec3<f32> {
  let p = periodF();
  return vec3<f32>(
    periodicDelta1(x.x, center.x, p.x),
    periodicDelta1(x.y, center.y, p.y),
    periodicDelta1(x.z, center.z, p.z)
  );
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
