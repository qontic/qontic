#version 300 es
precision highp float;

in float vAlive;
out vec4 fragColor;

uniform float uDotSigma;
uniform float uDotGain;
uniform int   uPaletteId;

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d)
{
    return a + b*cos(6.283185*(c*t+d));
}

void getPaletteParams(int id, out vec3 a, out vec3 b, out vec3 c, out vec3 d)
{
  a=vec3(0.08,0.06,0.02);
  b=vec3(1.00,0.90,0.40);
  c=vec3(1.0);
  d=vec3(0.08,0.18,0.28);
}

void main(){
  if(vAlive < 0.5) discard;

  
  vec2 p = gl_PointCoord - vec2(0.5);
  float r = length(p);           

  
  if(r > 0.5) discard;

  
  float edge = smoothstep(0.5, 0.42, r);

  
  float s = max(uDotSigma, 1e-4);
  float blur = exp(-(r*r) / s);

  float a = uDotGain * blur * edge;
  a = clamp(a, 0.0, 0.85);

  vec3 A,B,C,D;
  getPaletteParams(uPaletteId, A,B,C,D);
  vec3 col = palette(0.85, A,B,C,D);

  fragColor = vec4(col, a);
}
