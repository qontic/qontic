@group(0) @binding(1) var<storage, read> wave: array<WaveCell>;

struct CloudOut {
  @builtin(position) position: vec4<f32>,
  @location(0) alpha: f32,
  @location(1) phase: f32,
  @location(2) intensity: f32,
  @location(3) local: vec2<f32>,
};

fn cloudAlphaResolutionScale() -> f32 {
  let n = max(uni.sim.x, max(uni.sim.y, uni.sim.z));
  let s = 120.0 / max(1.0, n);
  return clamp(s*s, 0.35, 3.0);
}
fn warpedPhaseT(t: f32) -> f32 {
  let k = 0.72;
  return fract(t - k * sin(12.5663706 * t) / 12.5663706);
}
fn visiblePhaseColor(rawColor: vec3<f32>, phaseT: f32) -> vec3<f32> {
  let t = warpedPhaseT(phaseT);
  let compressedPalette = 0.5 + 0.5 * rawColor / (vec3<f32>(1.0) + abs(rawColor));
  let wheelColor = 0.5 + 0.5 * cos(6.2831853 * (t + vec3<f32>(0.00, 0.67, 0.33)));
  let hueColor = mix(wheelColor, compressedPalette, 0.28);
  let luma = dot(hueColor, vec3<f32>(0.2126, 0.7152, 0.0722));
  let saturated = clamp(luma + 1.85 * (hueColor - vec3<f32>(luma)), vec3<f32>(0.0), vec3<f32>(1.45));
  let transition = pow(abs(sin(6.2831853 * phaseT)), 1.35);
  let targetLuma = mix(0.64, 0.40, transition);
  let satLuma = dot(saturated, vec3<f32>(0.2126, 0.7152, 0.0722));
  return min(saturated * (targetLuma / max(satLuma, 1e-4)), vec3<f32>(1.55));
}

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
  let stationaryPhase = -uni.physics.z * (1.0 - clamp(uni.field.y, 0.0, 1.0));
  out.phase = atan2(phasePsi.y, phasePsi.x) + stationaryPhase;
  out.alpha = 0.24 * intensity * cloudAlphaResolutionScale();
  out.local = quadCorner(vertexIndex) + vec2<f32>(0.5);
  if (intensity < uni.visual0.w) {
    out.position = vec4<f32>(2.0, 2.0, 2.0, 1.0);
    out.alpha = 0.0;
    return out;
  }
  let worldPos = vec3<f32>(f32(x), f32(y), f32(z)) * uni.visual1.w;
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
  let phaseT = fract((5.0 * in.phase + 3.14159265) / 6.2831853);
  let phaseCol = visiblePhaseColor(palette(phaseT, params.a, params.b, params.c, params.d), phaseT);
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
