
struct BoxIn {
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(3) fade: f32,
};
struct BoxOut {
  @builtin(position) position: vec4<f32>,
  @location(0) worldPos: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(3) fade: f32,
};

@vertex
fn vs(in: BoxIn) -> BoxOut {
  var out: BoxOut;
  out.worldPos = in.position;
  out.normal = normalize(in.normal);
  out.uv = in.uv;
  out.fade = in.fade;
  out.position = uni.viewProj * vec4<f32>(in.position, 1.0);
  return out;
}
fn edgeMask(uv: vec2<f32>) -> f32 {
  let edge = min(uv, vec2<f32>(1.0) - uv);
  return 1.0 - smoothstep(0.012, 0.085, edge.y);
}
fn latticeMask(uv: vec2<f32>) -> f32 {
  let g = abs(fract(uv * 4.0) - vec2<f32>(0.5));
  return 1.0 - smoothstep(0.0, 0.035, min(g.x, g.y));
}
@fragment
fn fs(in: BoxOut) -> @location(0) vec4<f32> {
  let cameraAxis = normalize(uni.camera.xyz - uni.boxCenter.xyz);
  let fromCenter = normalize(in.worldPos - uni.boxCenter.xyz);
  let cameraSide = dot(fromCenter, cameraAxis);
  let frontFace = smoothstep(0.04, 0.72, cameraSide);
  let backFace = smoothstep(0.02, 0.86, -cameraSide);
  let sideFace = 1.0 - smoothstep(0.0, 0.72, abs(cameraSide));
  let viewDir = normalize(uni.camera.xyz - in.worldPos);
  let rim = pow(1.0 - abs(dot(normalize(in.normal), viewDir)), 1.8);
  let edge = edgeMask(in.uv);
  let lattice = latticeMask(in.uv);
  let frontVisibility = mix(1.0, 0.18, frontFace);
  let panelAlpha = (0.014 + 0.12 * backFace + 0.032 * sideFace) * frontVisibility;
  let edgeAlpha = edge * (0.04 + 0.22 * backFace + 0.055 * sideFace) * mix(1.0, 0.35, frontFace);
  let latticeAlpha = lattice * (0.007 + 0.018 * backFace) * mix(1.0, 0.25, frontFace);
  let rimAlpha = rim * (0.01 + 0.035 * backFace) * frontVisibility;
  let alpha = (panelAlpha + edgeAlpha + latticeAlpha + rimAlpha) * in.fade;
  let nearColor = vec3<f32>(0.035, 0.12, 0.16);
  let sideColor = vec3<f32>(0.10, 0.32, 0.34);
  let backColor = vec3<f32>(0.31, 0.58, 0.50);
  let edgeColor = vec3<f32>(0.62, 0.95, 0.78);
  let rimColor = vec3<f32>(0.24, 0.62, 0.78);
  var color = mix(nearColor, sideColor, sideFace);
  color = mix(color, backColor, backFace);
  color = color + edgeColor * edge * (0.34 + 0.42 * backFace) * mix(1.0, 0.45, frontFace);
  color = color + rimColor * rim * 0.18;
  let sgTint = clamp(uni.sgField.y, 0.0, 1.0);
  color = mix(color, color * vec3<f32>(1.18, 0.70, 0.66) + vec3<f32>(0.08, 0.0, 0.0), 0.45 * sgTint);
  if (alpha < 0.002) { discard; }
  return vec4<f32>(color, alpha);
}
