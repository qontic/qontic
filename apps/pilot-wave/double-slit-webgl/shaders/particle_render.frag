#version 300 es
precision highp float;

in float vAlive;
in float vOriginQuadrant;
in float vTailAlpha;
out vec4 fragColor;

uniform float uDotSigma;
uniform float uDotGain;
uniform int   uColorCodeMask;

vec3 colorMap(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d)
{
    return a + b*cos(6.283185*(c*t+d));
}

void main(){
  if(vAlive < 0.5) discard;
  if(vTailAlpha <= 0.001) discard;

  vec2 p = gl_PointCoord * 2.0 - vec2(1.0);
  float r2 = dot(p, p);
  if(r2 > 1.0) discard;

  vec3 A = vec3(0.08,0.06,0.02);
  vec3 B = vec3(1.00,0.90,0.40);
  vec3 C = vec3(1.0);
  vec3 D = vec3(0.08,0.18,0.28);
  vec3 particleCol = max(colorMap(0.85, A,B,C,D), vec3(0.0));
  vec3 coreCol = vec3(1.0, 0.98, 0.88);
  int origin = int(vOriginQuadrant + 0.5);
  int colorGroup = uColorCodeMask == 4 ? ((origin >> 2) & 3) : (origin & uColorCodeMask);
  if (colorGroup == 1) {
    particleCol = vec3(0.15, 0.95, 1.00);
    coreCol = vec3(0.88, 0.99, 1.00);
  } else if (colorGroup == 2) {
    particleCol = vec3(1.00, 0.28, 0.18);
    coreCol = vec3(1.00, 0.90, 0.86);
  } else if (colorGroup == 3) {
    particleCol = vec3(0.74, 0.32, 1.00);
    coreCol = vec3(0.96, 0.89, 1.00);
  }
  if (uColorCodeMask == 0) {
    particleCol = vec3(1.0, 0.92, 0.08);
    coreCol = vec3(1.0, 0.99, 0.78);
  }

  float softness = clamp(uDotSigma, 0.08, 0.65);
  float halo = exp(-r2 / softness) * (1.0 - smoothstep(0.72, 1.0, r2));
  float body = 1.0 - smoothstep(0.16, 0.72, r2);
  float core = 1.0 - smoothstep(0.0, 0.13, r2);

  vec3 col = mix(particleCol * 0.72, particleCol * 1.18, body);
  col = mix(col, coreCol, core * 0.92);

  float a = uDotGain * (11.72 * halo + 0.78 * body + 0.28 * core) * vTailAlpha;
  a = clamp(a, 0.0, 0.92);

  fragColor = vec4(col, a);
}
