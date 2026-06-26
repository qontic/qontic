
@group(0) @binding(1) var<storage, read> wave: array<WaveCell>;

struct CloudOut {
  @builtin(position) position: vec4<f32>,
  @location(0) alpha: f32,
  @location(1) phase: f32,
  @location(2) intensity: f32,
  @location(3) local: vec2<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instanceIndex: u32) -> CloudOut {
  var out: CloudOut;
  let id = instanceIndex;
  let s = simResU();
  let slice = s.x * s.y;
  let z = id / slice;
  let rem = id - z * slice;
  let y = rem / s.x;
  let x = rem - y * s.x;
  if (x >= s.x - 1u) {
    out.position = vec4<f32>(2.0, 2.0, 2.0, 1.0);
    out.alpha = 0.0;
    out.intensity = 0.0;
    out.phase = 0.0;
    out.local = vec2<f32>(0.0);
    return out;
  }
  let spinor = waveSpinor(wave[id]);
  let rho = spinorRho(spinor);
  var intensity = 1.0 - exp(-uni.visual0.x * rho);
  intensity = pow(clamp(intensity, 0.0, 1.0), uni.visual0.y);
  intensity = mix(intensity, pow(intensity, 0.52), clamp(uni.visual0.z, 0.0, 1.0));
  out.intensity = intensity;
  let upRho = dot(spinor.up, spinor.up);
  let downRho = dot(spinor.down, spinor.down);
  let upWeight = upRho * upRho;
  let downWeight = downRho * downRho;
  let phaseVec =
    spinor.up * (upWeight / sqrt(max(upRho, 1e-30))) +
    spinor.down * (downWeight / sqrt(max(downRho, 1e-30)));
  let phasePsi = select(vec2<f32>(1.0, 0.0), phaseVec, dot(phaseVec, phaseVec) > 1e-20);
  out.phase = atan2(phasePsi.y, phasePsi.x);
  out.alpha = 0.24 * intensity;
  out.local = quadCorner(vertexIndex) + vec2<f32>(0.5);
  if (intensity < uni.visual0.w) {
    out.position = vec4<f32>(2.0, 2.0, 2.0, 1.0);
    out.alpha = 0.0;
    return out;
  }
  let visualX = nearestVisualX(f32(x));
  if (uni.detector.y > 0.5 && visualX > uni.detector.x) {
    out.position = vec4<f32>(2.0, 2.0, 2.0, 1.0);
    out.alpha = 0.0;
    return out;
  }
  let worldPos = vec3<f32>(visualX, f32(y), f32(z)) * uni.visual1.w;
  let clip = uni.viewProj * vec4<f32>(worldPos, 1.0);
  var viewScale = clamp(160.0 / max(1.0, clip.w), 0.35, 2.3);
  if (i32(uni.viewport.z) == 1) {
    viewScale = clamp(160.0 / max(1.0, uni.camera.w), 0.35, 2.3);
  }
  let pointSize = uni.visual1.x * viewScale * mix(0.65, 1.45, intensity);
  let ndcOffset = quadCorner(vertexIndex) * pointSize * 2.0 / max(uni.viewport.xy, vec2<f32>(1.0));
  out.position = vec4<f32>(
    clip.x + ndcOffset.x * clip.w,
    clip.y + ndcOffset.y * clip.w,
    clip.z,
    clip.w
  );
  return out;
}

@fragment
fn fs(in: CloudOut) -> @location(0) vec4<f32> {
  if (in.alpha <= 0.0) { discard; }
  let p = in.local - vec2<f32>(0.5);
  let r = length(p);
  if (r > 0.5) { discard; }
  let edge = smoothstep(0.5, 0.18, r);
  let blur = exp(-16.0 * r * r);
  let a = in.alpha * edge * blur;
  let params = getPaletteParams(i32(uni.visual1.z));
  let phaseT = fract((1.0*in.phase + 3.14159265) / 6.2831853);
  let phaseCol = palette(phaseT, params.a, params.b, params.c, params.d);
    let densityCol = mix(vec3<f32>(0.05, 0.22, 0.46), vec3<f32>(0.58, 0.95, 1.00), smoothstep(0.08, 0.95, in.intensity));
  var col = densityCol;
  var alpha = a;
  if (i32(uni.visual1.y) == 1) {
    let phaseGate = smoothstep(0.0, 0.25, in.intensity);
  col = 0.92 * phaseCol;
    alpha = alpha * phaseGate;
  }
  col = col * (0.35 + 1.15 * in.intensity);
  return vec4<f32>(col * alpha, alpha);
}
