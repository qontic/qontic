@group(0) @binding(1) var<storage, read> wave: array<WaveCell>;

struct CloudOut {
  @builtin(position) position: vec4<f32>,
  @location(0) alpha: f32,
  @location(1) phase: f32,
  @location(2) intensity: f32,
  @location(3) local: vec2<f32>,
};

fn phaseAccumulator(s: Dirac4) -> vec2<f32> {
  let r0=dot(s.c0,s.c0); let r1=dot(s.c1,s.c1);
  let r2=dot(s.c2,s.c2); let r3=dot(s.c3,s.c3);
  var a=vec2<f32>(0.0);
  if(r0>1e-20){a = a + s.c0*(r0/sqrt(r0));}
  if(r1>1e-20){a = a + s.c1*(r1/sqrt(r1));}
  if(r2>1e-20){a = a + s.c2*(r2/sqrt(r2));}
  if(r3>1e-20){a = a + s.c3*(r3/sqrt(r3));}
  return select(vec2<f32>(1.0,0.0),a,dot(a,a)>1e-20);
}

fn phasePalette(t: f32) -> vec3<f32> {
  let a = vec3<f32>(0.02, 0.06, 0.10);
  let b = vec3<f32>(0.65, 0.95, 1.00);
  let d = vec3<f32>(0.10, 0.30, 0.60);
  return a + b * cos(6.283185 * (vec3<f32>(t) + d));
}

@vertex
fn vs(@builtin(vertex_index) vertexIndex:u32,@builtin(instance_index) instanceIndex:u32)->CloudOut{
  var out:CloudOut;
  let id=instanceIndex;
  let sres=simResU();
  let slice=sres.x*sres.y;
  let z=id/slice;
  let rem=id-z*slice;
  let y=rem/sres.x;
  let x=rem-y*sres.x;
  if(x>=sres.x-1u||y>=sres.y-1u||z>=sres.z-1u){
    out.position=vec4<f32>(2.0,2.0,2.0,1.0);out.alpha=0.0;out.phase=0.0;out.intensity=0.0;out.local=vec2<f32>(0.0);return out;
  }
  let spinor=waveDirac(wave[id]);
  let rho=diracRho(spinor);
  var intensity=1.0-exp(-uni.visual0.x*rho);
  intensity=pow(clamp(intensity,0.0,1.0),uni.visual0.y);
  intensity=mix(intensity,pow(intensity,0.52),clamp(uni.visual0.z,0.0,1.0));
  out.intensity=intensity;
  let phasePsi=phaseAccumulator(spinor);
  out.phase=atan2(phasePsi.y,phasePsi.x);
  out.alpha=0.24*intensity;
  out.local=quadCorner(vertexIndex)+vec2<f32>(0.5);
  if(intensity<uni.visual0.w){out.position=vec4<f32>(2.0,2.0,2.0,1.0);out.alpha=0.0;return out;}
  let worldPos=vec3<f32>(f32(x),f32(y),f32(z))*uni.visual1.w;
  let clip=uni.viewProj*vec4<f32>(worldPos,1.0);
  var viewScale=clamp(160.0/max(1.0,clip.w),0.35,2.3);
  if(i32(uni.viewport.z)==1){viewScale=clamp(160.0/max(1.0,uni.camera.w),0.35,2.3);}
  let pointSize=uni.visual1.x*viewScale*mix(0.65,1.45,intensity);
  let ndcOffset=quadCorner(vertexIndex)*pointSize*2.0/max(uni.viewport.xy,vec2<f32>(1.0));
  out.position=vec4<f32>(clip.x+ndcOffset.x*clip.w,clip.y+ndcOffset.y*clip.w,clip.z,clip.w);
  return out;
}

@fragment
fn fs(in:CloudOut)->@location(0) vec4<f32>{
  if(in.alpha<=0.0){discard;}
  let p=in.local-vec2<f32>(0.5);let r=length(p);if(r>0.5){discard;}
  let edge=smoothstep(0.5,0.18,r);let blur=exp(-16.0*r*r);let a=in.alpha*edge*blur;
  let phaseT=fract((in.phase+3.14159265)/6.2831853);
  let phaseCol=phasePalette(phaseT);
  let densityCol=mix(vec3<f32>(0.05,0.22,0.46),vec3<f32>(0.58,0.95,1.00),smoothstep(0.08,0.95,in.intensity));
  var col=densityCol;var alpha=a;
  if(i32(uni.visual1.y)==1){let phaseGate=smoothstep(0.0,0.25,in.intensity);col=0.92*phaseCol;alpha = alpha * phaseGate;}
  col = col * (0.35+1.15*in.intensity);
  return vec4<f32>(col*alpha,alpha);
}
