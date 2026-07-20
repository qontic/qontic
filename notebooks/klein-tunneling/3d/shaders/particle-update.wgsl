@group(0) @binding(1) var<storage, read> wave: array<WaveCell>;
@group(0) @binding(2) var<storage, read> particlesIn: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> particlesOut: array<vec4<f32>>;

fn fetchDiracVoxel(p: vec3<i32>) -> Dirac4 {
  let q=wrapIndex3(p);
  return waveDirac(wave[voxelIndexI(q)]);
}
fn mixDirac(a: Dirac4,b: Dirac4,t:f32)->Dirac4{
  return Dirac4(mix(a.c0,b.c0,t),mix(a.c1,b.c1,t),mix(a.c2,b.c2,t),mix(a.c3,b.c3,t));
}
fn sampleDiracTrilinear(xRaw: vec3<f32>) -> Dirac4 {
  let xPx=wrapCoord3(xRaw);
  let x0f=floor(xPx);
  let f=xPx-x0f;
  let p000=vec3<i32>(x0f);
  let p100=p000+vec3<i32>(1,0,0);
  let p010=p000+vec3<i32>(0,1,0);
  let p110=p000+vec3<i32>(1,1,0);
  let p001=p000+vec3<i32>(0,0,1);
  let p101=p000+vec3<i32>(1,0,1);
  let p011=p000+vec3<i32>(0,1,1);
  let p111=p000+vec3<i32>(1,1,1);
  let c00=mixDirac(fetchDiracVoxel(p000),fetchDiracVoxel(p100),f.x);
  let c10=mixDirac(fetchDiracVoxel(p010),fetchDiracVoxel(p110),f.x);
  let c01=mixDirac(fetchDiracVoxel(p001),fetchDiracVoxel(p101),f.x);
  let c11=mixDirac(fetchDiracVoxel(p011),fetchDiracVoxel(p111),f.x);
  return mixDirac(mixDirac(c00,c10,f.y),mixDirac(c01,c11,f.y),f.z);
}
fn guidingVelocity(xPx: vec3<f32>) -> vec3<f32> {
  let s=sampleDiracTrilinear(xPx);
  let rho=max(diracRho(s),uni.particle1.x);
  let c=max(uni.physics.z,1e-6);
  // j = c psi^dagger alpha psi in the standard Dirac representation.
  let jx=2.0*c*(cconjMulRe(s.c0,s.c3)+cconjMulRe(s.c1,s.c2));
  let jy=2.0*c*(cconjMulIm(s.c0,s.c3)-cconjMulIm(s.c1,s.c2));
  let jz=2.0*c*(cconjMulRe(s.c0,s.c2)-cconjMulRe(s.c1,s.c3));
  var v=vec3<f32>(jx,jy,jz)/rho;
  let sp=length(v);
  let vmax=min(max(uni.particle1.y,1e-6),c);
  if(sp>vmax){v=v*(vmax/sp);}
  return v;
}

@compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let id=gid.x;
  if(id>=u32(uni.particle1.z)){return;}
  let x=wrapCoord3(particlesIn[id].xyz);
  let dt=uni.physics.w;
  let v1=guidingVelocity(x);
  let v2=guidingVelocity(wrapCoord3(x+0.5*dt*v1));
  let v3=guidingVelocity(wrapCoord3(x+0.5*dt*v2));
  let v4=guidingVelocity(wrapCoord3(x+dt*v3));
  let xn=wrapCoord3(x+(dt/6.0)*(v1+2.0*v2+2.0*v3+v4));
  particlesOut[id]=vec4<f32>(xn,0.0);
}
