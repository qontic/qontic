struct LineIn {
  @location(0) start: vec3<f32>,
  @location(1) end: vec3<f32>,
  @location(2) fade: f32,
  @location(3) side: f32,
  @location(4) along: f32,
};
struct LineOut {
  @builtin(position) position: vec4<f32>,
  @location(0) fade: f32,
  @location(1) @interpolate(linear) lineCoordPx: f32,
  @location(2) @interpolate(linear) along: f32,
};
@vertex
fn vs(in: LineIn) -> LineOut {
  var out: LineOut;
  let clipA = uni.viewProj * vec4<f32>(in.start, 1.0);
  let clipB = uni.viewProj * vec4<f32>(in.end, 1.0);
  let ndcA = clipA.xy / max(1e-6, clipA.w);
  let ndcB = clipB.xy / max(1e-6, clipB.w);
  let screenDir = (ndcB - ndcA) * uni.viewport.xy;
  let screenLen = max(1e-4, length(screenDir));
  let normalPx = vec2<f32>(-screenDir.y, screenDir.x) / screenLen;
  let halfWidthPx = 1.65;
  let aaPx = 1.25;
  let outerHalfWidthPx = halfWidthPx + aaPx;
  let ndcOffset = normalPx * in.side * outerHalfWidthPx * 2.0 / max(uni.viewport.xy, vec2<f32>(1.0));
  let clip = mix(clipA, clipB, in.along);
  out.position = vec4<f32>(
    clip.x + ndcOffset.x * clip.w,
    clip.y + ndcOffset.y * clip.w,
    clip.z,
    clip.w
  );
  out.fade = in.fade;
  out.lineCoordPx = in.side * outerHalfWidthPx;
  out.along = in.along;
  return out;
}
@fragment
fn fs(in: LineOut) -> @location(0) vec4<f32> {
  let fieldOn = clamp(uni.field.y, 0.0, 1.0);
  let halfWidthPx = 1.65;
  let aaPx = 1.25;
  let edge = 1.0 - smoothstep(halfWidthPx, halfWidthPx + aaPx, abs(in.lineCoordPx));
  let endFade = smoothstep(0.0, 0.08, in.along) * (1.0 - smoothstep(0.92, 1.0, in.along));
  let core = 1.0 - smoothstep(0.0, halfWidthPx + aaPx, abs(in.lineCoordPx));
  let color = mix(vec3<f32>(1.0, 0.16, 0.055), vec3<f32>(1.0, 0.54, 0.30), 0.35 * core);
  let alpha = 0.28 * in.fade * fieldOn * edge * endFade;
  if (alpha < 0.002) { discard; }
  return vec4<f32>(color, alpha);
}
