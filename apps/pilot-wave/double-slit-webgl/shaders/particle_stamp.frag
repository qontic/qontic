#version 300 es
precision highp float;

in float vAlive;
in float vOriginQuadrant;
in float vTailAlpha;
layout(location=0) out vec4 fragColor;
layout(location=1) out vec4 radialColor;

uniform float uDotSigma;
uniform float uDotGain;
uniform float uStampGain;

void main(){
  if(vAlive < 0.5) discard;
  if(vTailAlpha <= 0.001) discard;

  vec2 p = gl_PointCoord - vec2(0.5);
  float r = length(p);

  // Strict circle mask
  if(r > 0.5) discard;

  // Soft edge so stamps don't look pixelly
  float edge = smoothstep(0.5, 0.42, r);

  float s = max(uDotSigma, 1e-4);
  float blur = exp(-(r*r) / s);

  float a = uDotGain * uStampGain * blur * edge * vTailAlpha;
  a = clamp(a, 0.0, 1.0);

  // Keep both classifications so toggling recolors the complete trail history.
  int origin = int(vOriginQuadrant + 0.5);
  vec4 stamp = vec4(0.0);
  stamp[origin & 3] = a;
  fragColor = stamp;
  vec4 radialStamp = vec4(0.0);
  radialStamp[(origin >> 2) & 3] = a;
  radialColor = radialStamp;
}
