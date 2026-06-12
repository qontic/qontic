struct AxisIn {
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) color: vec4<f32>,
};

struct AxisOut {
  @builtin(position) position: vec4<f32>,
  @location(0) worldPos: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) color: vec4<f32>,
};

@vertex
fn vs(in: AxisIn) -> AxisOut {
  var out: AxisOut;
  out.worldPos = in.position;
  out.normal = normalize(in.normal);
  out.color = in.color;
  out.position = uni.viewProj * vec4<f32>(in.position, 1.0);
  return out;
}

@fragment
fn fs(in: AxisOut) -> @location(0) vec4<f32> {
  let n = normalize(in.normal);
  let viewDir = normalize(uni.camera.xyz - in.worldPos);
  let lightDir = normalize(vec3<f32>(-0.42, 0.58, 0.70));
  let diffuse = 0.45 + 0.42 * max(dot(n, lightDir), 0.0);
  let rim = pow(1.0 - abs(dot(n, viewDir)), 2.0);
  let color = in.color.rgb * diffuse + in.color.rgb * rim * 0.24 + vec3<f32>(0.045) * rim;
  let alpha = in.color.a;
  if (alpha < 0.002) { discard; }
  return vec4<f32>(color, alpha);
}
