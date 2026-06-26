#version 300 es
precision highp float;

in float vAlive;
out vec4 fragColor;

uniform float uDotSigma;
uniform float uDotGain;

vec3 particleColor() {
  vec3 a = vec3(0.08, 0.06, 0.02);
  vec3 b = vec3(1.00, 0.90, 0.40);
  vec3 d = vec3(0.08, 0.18, 0.28);
  return max(a + b * cos(6.283185 * (0.85 + d)), vec3(0.0));
}

void main(){
  if(vAlive < 0.5) discard;

  vec2 p = gl_PointCoord * 2.0 - vec2(1.0);
  float r2 = dot(p, p);
  if(r2 > 1.0) discard;

  vec3 particleCol = particleColor();

  float softness = clamp(uDotSigma, 0.08, 0.65);
  float halo = exp(-r2 / softness) * (1.0 - smoothstep(0.72, 1.0, r2));
  float body = 1.0 - smoothstep(0.16, 0.72, r2);
  float core = 1.0 - smoothstep(0.0, 0.13, r2);

  vec3 col = mix(particleCol * 0.72, particleCol * 1.18, body);
  col = mix(col, vec3(1.0, 0.98, 0.88), core * 0.92);

  float a = uDotGain * (11.72 * halo + 0.78 * body + 0.28 * core);
  a = clamp(a, 0.0, 0.92);

  fragColor = vec4(col, a);
}
