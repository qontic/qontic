struct DetectorOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vertexIndex: u32) -> DetectorOut {
  var out: DetectorOut;
  var yz = vec2<f32>(0.0, 0.0);
  if (vertexIndex == 1u) { yz = vec2<f32>(1.0, 0.0); }
  if (vertexIndex == 2u) { yz = vec2<f32>(0.0, 1.0); }
  if (vertexIndex == 3u) { yz = vec2<f32>(0.0, 1.0); }
  if (vertexIndex == 4u) { yz = vec2<f32>(1.0, 0.0); }
  if (vertexIndex == 5u) { yz = vec2<f32>(1.0, 1.0); }

  let maxP = uni.sim.xyz - vec3<f32>(1.0);
  let gridPos = vec3<f32>(uni.detector.x, yz.x * maxP.y, yz.y * maxP.z);
  out.uv = yz;
  out.position = uni.viewProj * vec4<f32>(gridPos * uni.visual1.w, 1.0);
  return out;
}

@fragment
fn fs(in: DetectorOut) -> @location(0) vec4<f32> {
  let edge = min(min(in.uv.x, 1.0 - in.uv.x), min(in.uv.y, 1.0 - in.uv.y));
  let border = 1.0 - smoothstep(0.0, 0.025, edge);
  let gridY = 1.0 - smoothstep(0.0, 0.014, abs(fract(in.uv.x * 8.0) - 0.5));
  let gridZ = 1.0 - smoothstep(0.0, 0.014, abs(fract(in.uv.y * 8.0) - 0.5));
  let grid = max(gridY, gridZ);
  let color = mix(vec3<f32>(0.20, 0.72, 0.95), vec3<f32>(0.78, 0.96, 1.0), max(border, 0.55 * grid));
  let alpha = 0.18 + 0.28 * border + 0.08 * grid;
  return vec4<f32>(color, alpha);
}
