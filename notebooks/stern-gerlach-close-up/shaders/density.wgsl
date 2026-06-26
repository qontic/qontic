
@group(0) @binding(1) var prevTex: texture_2d<f32>;
@group(0) @binding(2) var prevSampler: sampler;

struct FullOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vsFull(@builtin(vertex_index) vertexIndex: u32) -> FullOut {
  var out: FullOut;
  var pos = vec2<f32>(-1.0, -1.0);
  if (vertexIndex == 1u) { pos = vec2<f32>(3.0, -1.0); }
  if (vertexIndex == 2u) { pos = vec2<f32>(-1.0, 3.0); }
  out.uv = 0.5 * (pos + vec2<f32>(1.0));
  out.position = vec4<f32>(pos, 0.0, 1.0);
  return out;
}

@fragment
fn fsFade(in: FullOut) -> @location(0) vec4<f32> {
  let uv = vec2<f32>(in.uv.x, 1.0 - in.uv.y);
  return textureSample(prevTex, prevSampler, uv) * uni.density0.z;
}

@fragment
fn fsRender(in: FullOut) -> @location(0) vec4<f32> {
  let uv = vec2<f32>(in.uv.x, 1.0 - in.uv.y);
  let dacc = max(textureSample(prevTex, prevSampler, uv), vec4<f32>(0.0));
  var v = max(max(dacc.r, dacc.g), dacc.b);
  v = 1.0 - exp(-uni.trail0.w * v);
  v = pow(clamp(v, 0.0, 1.0), uni.density0.x);
  let col = vec3<f32>(1.0, 1.0, 0.0);
  let mode = i32(uni.density0.y);
  if (mode == 0) {
    return vec4<f32>(col, v);
  }
  if (mode == 1) {
    return vec4<f32>(col * v, 1.0 - v);
  }
  return vec4<f32>(col * v, 1.0);
}
