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
fn faceEdgeDistance(uv: vec2<f32>) -> f32 {
  let edge = min(uv, vec2<f32>(1.0) - uv);
  return min(edge.x, edge.y);
}
fn edgeCoreMask(uv: vec2<f32>) -> f32 {
  let d = faceEdgeDistance(uv);
  let aa = max(fwidth(d), 0.0012);
  let width = max(0.024, 2.0 * aa);
  return 1.0 - smoothstep(width - aa, width + 1.5 * aa, d);
}
fn edgeHaloMask(uv: vec2<f32>) -> f32 {
  let d = faceEdgeDistance(uv);
  let aa = max(fwidth(d), 0.0012);
  let width = max(0.075, 5.0 * aa);
  return 1.0 - smoothstep(width - 1.5 * aa, width + 3.0 * aa, d);
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
  let edge = edgeCoreMask(in.uv);
  let edgeHalo = edgeHaloMask(in.uv);
  let lattice = latticeMask(in.uv);
  let frontVisibility = mix(1.0, 0.18, frontFace);
  let farEdgeDim = mix(1.0, 0.52, backFace);
  let panelAlpha = (0.014 + 0.12 * backFace + 0.032 * sideFace) * frontVisibility;
  let edgeAlpha = (
    edge * (0.075 + 0.18 * backFace + 0.09 * sideFace) +
    edgeHalo * (0.018 + 0.035 * backFace + 0.025 * sideFace)
  ) * mix(1.0, 0.55, frontFace);
  let edgeAlphaDimmed = edgeAlpha * farEdgeDim;
  let latticeAlpha = lattice * (0.007 + 0.018 * backFace) * mix(1.0, 0.25, frontFace);
  let rimAlpha = rim * (0.01 + 0.035 * backFace) * frontVisibility;
  let alpha = (panelAlpha + edgeAlphaDimmed + latticeAlpha + rimAlpha) * in.fade;
  let nearColor = vec3<f32>(0.035, 0.12, 0.16);
  let sideColor = vec3<f32>(0.10, 0.32, 0.34);
  let backColor = vec3<f32>(0.31, 0.58, 0.50);
  let edgeColor = vec3<f32>(0.62, 0.95, 0.78);
  let rimColor = vec3<f32>(0.24, 0.62, 0.78);
  var color = mix(nearColor, sideColor, sideFace);
  color = mix(color, backColor, backFace);
  color = color + edgeColor * (edge * (0.46 + 0.28 * backFace) + edgeHalo * 0.12) * mix(1.0, 0.65, frontFace) * farEdgeDim;
  color = color + rimColor * rim * 0.18;
  let fieldTint = clamp(uni.field.y, 0.0, 1.0);
  color = mix(color, color * vec3<f32>(1.18, 0.70, 0.66) + vec3<f32>(0.08, 0.0, 0.0), 0.45 * fieldTint);
  if (alpha < 0.002) { discard; }
  return vec4<f32>(color, alpha);
}
