struct OverlayUniforms {
  viewport: vec4<f32>,
  rect: vec4<f32>,
};

@group(0) @binding(0) var<uniform> overlay: OverlayUniforms;
@group(0) @binding(1) var overlayTex: texture_2d<f32>;
@group(0) @binding(2) var overlaySampler: sampler;

struct OverlayOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

fn quadUv(v: u32) -> vec2<f32> {
  if (v == 0u) { return vec2<f32>(0.0, 0.0); }
  if (v == 1u) { return vec2<f32>(1.0, 0.0); }
  if (v == 2u) { return vec2<f32>(0.0, 1.0); }
  if (v == 3u) { return vec2<f32>(0.0, 1.0); }
  if (v == 4u) { return vec2<f32>(1.0, 0.0); }
  return vec2<f32>(1.0, 1.0);
}

@vertex
fn vs(@builtin(vertex_index) vertexIndex: u32) -> OverlayOut {
  let uv = quadUv(vertexIndex);
  let px = overlay.rect.xy + uv * overlay.rect.zw;
  let ndc = vec2<f32>(
    2.0 * px.x / max(1.0, overlay.viewport.x) - 1.0,
    1.0 - 2.0 * px.y / max(1.0, overlay.viewport.y)
  );
  var out: OverlayOut;
  out.position = vec4<f32>(ndc, 0.0, 1.0);
  out.uv = uv;
  return out;
}

@fragment
fn fs(in: OverlayOut) -> @location(0) vec4<f32> {
  return textureSample(overlayTex, overlaySampler, in.uv);
}
