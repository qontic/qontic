
struct PaletteParams {
  a: vec3<f32>,
  b: vec3<f32>,
  c: vec3<f32>,
  d: vec3<f32>,
};
fn palette(t: f32, a: vec3<f32>, b: vec3<f32>, c: vec3<f32>, d: vec3<f32>) -> vec3<f32> {
  return a + b * cos(6.283185 * (c * t + d));
}
fn getPaletteParams(id: i32) -> PaletteParams {
  var p: PaletteParams;
  if (id == 0) { p.a=vec3<f32>(0.05,0.03,0.08); p.b=vec3<f32>(0.85,0.65,0.95); p.c=vec3<f32>(1.0); p.d=vec3<f32>(0.00,0.20,0.55); }
  else if (id == 1) { p.a=vec3<f32>(0.02,0.01,0.05); p.b=vec3<f32>(1.00,0.35,1.00); p.c=vec3<f32>(1.0); p.d=vec3<f32>(0.05,0.10,0.75); }
  else if (id == 2) { p.a=vec3<f32>(0.10,0.18,0.14); p.b=vec3<f32>(0.70,0.90,0.55); p.c=vec3<f32>(1.0); p.d=vec3<f32>(0.15,0.45,0.75); }
  else if (id == 3) { p.a=vec3<f32>(0.08,0.02,0.01); p.b=vec3<f32>(1.00,0.65,0.25); p.c=vec3<f32>(1.0); p.d=vec3<f32>(0.05,0.15,0.30); }
  else if (id == 4) { p.a=vec3<f32>(0.02,0.06,0.10); p.b=vec3<f32>(0.65,0.95,1.00); p.c=vec3<f32>(1.0); p.d=vec3<f32>(0.10,0.30,0.60); }
  else if (id == 5) { p.a=vec3<f32>(0.08,0.06,0.02); p.b=vec3<f32>(1.00,0.90,0.40); p.c=vec3<f32>(1.0); p.d=vec3<f32>(0.08,0.18,0.28); }
  else if (id == 6) { p.a=vec3<f32>(0.03,0.07,0.03); p.b=vec3<f32>(0.50,1.00,0.65); p.c=vec3<f32>(1.0); p.d=vec3<f32>(0.10,0.35,0.55); }
  else if (id == 7) { p.a=vec3<f32>(0.07,0.05,0.02); p.b=vec3<f32>(1.00,0.85,0.20); p.c=vec3<f32>(1.0); p.d=vec3<f32>(0.00,0.10,0.20); }
  else if (id == 8) { p.a=vec3<f32>(0.07,0.02,0.04); p.b=vec3<f32>(1.00,0.55,0.30); p.c=vec3<f32>(1.0); p.d=vec3<f32>(0.05,0.25,0.45); }
  else { p.a=vec3<f32>(0.02,0.03,0.08); p.b=vec3<f32>(0.35,1.00,1.00); p.c=vec3<f32>(1.0); p.d=vec3<f32>(0.05,0.35,0.55); }
  return p;
}
