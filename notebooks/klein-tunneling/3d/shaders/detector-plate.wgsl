struct BarrierOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
  @location(1) side: f32,
};

@vertex
fn vs(@builtin(vertex_index) vertexIndex: u32) -> BarrierOut {
  var out: BarrierOut;
  let local = vertexIndex % 6u;
  let face = vertexIndex / 6u;

  var yz = vec2<f32>(0.0, 0.0);
  if (local == 1u) { yz = vec2<f32>(1.0, 0.0); }
  if (local == 2u) { yz = vec2<f32>(0.0, 1.0); }
  if (local == 3u) { yz = vec2<f32>(0.0, 1.0); }
  if (local == 4u) { yz = vec2<f32>(1.0, 0.0); }
  if (local == 5u) { yz = vec2<f32>(1.0, 1.0); }

  let maxP = uni.sim.xyz - vec3<f32>(1.0);
  let halfWidth = 0.5 * max(uni.detector.y, 0.0);
  let leftX = clamp(uni.detector.x - halfWidth, 0.0, maxP.x);
  let rightX = clamp(uni.detector.x + halfWidth, 0.0, maxP.x);
  let x = mix(leftX, rightX, yz.x);

  var gridPos = vec3<f32>(x, yz.y * maxP.y, 0.0);
  var side = 0.0;
  if (face == 0u) {
    gridPos = vec3<f32>(leftX, yz.x * maxP.y, yz.y * maxP.z);
    side = -1.0;
  } else if (face == 1u) {
    gridPos = vec3<f32>(rightX, yz.x * maxP.y, yz.y * maxP.z);
    side = 1.0;
  } else if (face == 2u) {
    gridPos = vec3<f32>(x, 0.0, yz.y * maxP.z);
  } else if (face == 3u) {
    gridPos = vec3<f32>(x, maxP.y, yz.y * maxP.z);
  } else if (face == 4u) {
    gridPos = vec3<f32>(x, yz.y * maxP.y, 0.0);
  } else {
    gridPos = vec3<f32>(x, yz.y * maxP.y, maxP.z);
  }

  out.uv = yz;
  out.side = side;
  out.position = uni.viewProj * vec4<f32>(gridPos * uni.visual1.w, 1.0);
  return out;
}

@fragment
fn fs(in: BarrierOut) -> @location(0) vec4<f32> {
  let edge = min(min(in.uv.x, 1.0 - in.uv.x), min(in.uv.y, 1.0 - in.uv.y));
  let border = 1.0 - smoothstep(0.0, 0.026, edge);
  let gridY = 1.0 - smoothstep(0.0, 0.012, abs(fract(in.uv.x * 9.0) - 0.5));
  let gridZ = 1.0 - smoothstep(0.0, 0.012, abs(fract(in.uv.y * 9.0) - 0.5));
  let grid = max(gridY, gridZ);
  let strength = clamp(uni.detector.z / 14.0, 0.0, 1.0);
  let plateFace = step(0.5, abs(in.side));
  let faceTint = mix(0.58, 0.82 + 0.10 * in.side, plateFace);
  let barrierColor = max(uni.visual2.yzw, vec3<f32>(0.0));
  let base = barrierColor * faceTint;
  let hot = mix(barrierColor, vec3<f32>(1.0, 1.0, 0.72), 0.45);
  let detail = max(border, 0.45 * grid) * plateFace;
  let color = mix(base, hot, detail);
  let slabAlpha = 0.035 + 0.10 * strength;
  let plateAlpha = (0.09 + 0.22 * strength) + 0.26 * border + 0.075 * grid;
  let alpha = mix(slabAlpha, plateAlpha, plateFace);
  return vec4<f32>(color, clamp(alpha, 0.0, 0.68));
}
