@group(0) @binding(1) var<storage, read> waveIn: array<WaveCell>;
@group(0) @binding(2) var<storage, read_write> waveOut: array<WaveCell>;

fn fetchDirac(p: vec3<i32>) -> Dirac4 {
  let q = wrapIndex3(p);
  return waveDirac(waveIn[voxelIndexI(q)]);
}
fn add4(a: Dirac4, b: Dirac4) -> Dirac4 {
  return Dirac4(a.c0+b.c0,a.c1+b.c1,a.c2+b.c2,a.c3+b.c3);
}
fn scale4(a: Dirac4, s: f32) -> Dirac4 {
  return Dirac4(a.c0*s,a.c1*s,a.c2*s,a.c3*s);
}
fn potentialAtPx(xPx: vec3<f32>) -> f32 {
  let center = uni.detector.x;
  let width = max(uni.detector.y, 0.0);
  let height = max(uni.detector.z, 0.0);
  let edge = max(1.25, 0.08 * max(width, 1.0));
  let left = center - 0.5 * width;
  let right = center + 0.5 * width;
  let rise = smoothstep(left - edge, left + edge, xPx.x);
  let fall = 1.0 - smoothstep(right - edge, right + edge, xPx.x);
  return height * clamp(rise * fall, 0.0, 1.0);
}
fn deriv4(am2: Dirac4, am1: Dirac4, ap1: Dirac4, ap2: Dirac4) -> Dirac4 {
  return scale4(add4(add4(scale4(am2,1.0),scale4(am1,-8.0)),add4(scale4(ap1,8.0),scale4(ap2,-1.0))),1.0/12.0);
}
fn sigmaDotGrad(dx: Dirac4, dy: Dirac4, dz: Dirac4, lower: bool) -> vec4<f32> {
  var q0: vec2<f32>;
  var q1: vec2<f32>;
  if (lower) {
    q0 = dz.c2 + dx.c3 + mulNegI(dy.c3);
    q1 = dx.c2 + mulI(dy.c2) - dz.c3;
  } else {
    q0 = dz.c0 + dx.c1 + mulNegI(dy.c1);
    q1 = dx.c0 + mulI(dy.c0) - dz.c1;
  }
  return vec4<f32>(q0,q1);
}
fn diracRHS(psi: Dirac4, dx: Dirac4, dy: Dirac4, dz: Dirac4, xPx: vec3<f32>) -> Dirac4 {
  let hbar = max(uni.physics.x,1e-6);
  let mass = max(uni.physics.y,1e-6);
  let c = max(uni.physics.z,1e-6);
  let dt = max(uni.physics.w, 1e-8);
  let rest = mass*c*c;
  let v = potentialAtPx(xPx);
  let upperOmega = sin((v + rest) * dt / hbar) / dt;
  let lowerOmega = sin((v - rest) * dt / hbar) / dt;
  let sgL = sigmaDotGrad(dx,dy,dz,true);
  let sgU = sigmaDotGrad(dx,dy,dz,false);
  return Dirac4(
    -c*sgL.xy + upperOmega*mulNegI(psi.c0),
    -c*sgL.zw + upperOmega*mulNegI(psi.c1),
    -c*sgU.xy + lowerOmega*mulNegI(psi.c2),
    -c*sgU.zw + lowerOmega*mulNegI(psi.c3)
  );
}

@compute @workgroup_size(${WAVE_WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let id = gid.x;
  if (id >= u32(uni.sim.w)) { return; }
  let s = simResU();
  let slice=s.x*s.y;
  let z=id/slice;
  let rem=id-z*slice;
  let y=rem/s.x;
  let x=rem-y*s.x;
  let p=vec3<i32>(i32(x),i32(y),i32(z));
  let state=waveIn[id];
  let psi=waveDirac(state);
  let dx=deriv4(fetchDirac(p+vec3<i32>(-2,0,0)),fetchDirac(p+vec3<i32>(-1,0,0)),fetchDirac(p+vec3<i32>(1,0,0)),fetchDirac(p+vec3<i32>(2,0,0)));
  let dy=deriv4(fetchDirac(p+vec3<i32>(0,-2,0)),fetchDirac(p+vec3<i32>(0,-1,0)),fetchDirac(p+vec3<i32>(0,1,0)),fetchDirac(p+vec3<i32>(0,2,0)));
  let dz=deriv4(fetchDirac(p+vec3<i32>(0,0,-2)),fetchDirac(p+vec3<i32>(0,0,-1)),fetchDirac(p+vec3<i32>(0,0,1)),fetchDirac(p+vec3<i32>(0,0,2)));
  let rhs=diracRHS(psi,dx,dy,dz,vec3<f32>(f32(x),f32(y),f32(z)));
  let twoDt=2.0*uni.physics.w;
  let n0=state.p0+twoDt*rhs.c0;
  let n1=state.p1+twoDt*rhs.c1;
  let n2=state.p2+twoDt*rhs.c2;
  let n3=state.p3+twoDt*rhs.c3;
  waveOut[id]=WaveCell(n0,n1,n2,n3,state.c0,state.c1,state.c2,state.c3);
}
