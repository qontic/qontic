
struct LineIn {
  @location(0) position: vec3<f32>,
  @location(1) fade: f32,
};
struct LineOut {
  @builtin(position) position: vec4<f32>,
  @location(0) fade: f32,
};
@vertex
fn vs(in: LineIn) -> LineOut {
  var out: LineOut;
  out.position = uni.viewProj * vec4<f32>(in.position, 1.0);
  out.fade = in.fade;
  return out;
}
@fragment
fn fs(in: LineOut) -> @location(0) vec4<f32> {
  return vec4<f32>(uni.lineColor.rgb, uni.lineColor.a * in.fade);
}
