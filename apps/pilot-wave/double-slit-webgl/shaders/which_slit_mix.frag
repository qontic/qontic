#version 300 es
precision highp float;
uniform sampler2D uOriginal;
uniform sampler2D uGaussian;
uniform vec2 uProgress;
uniform float uGain;
uniform float uOverlap;
uniform vec2 uPhase;
out vec4 fragColor;

vec2 rotatePhase(vec2 z) { return vec2(z.x*uPhase.x-z.y*uPhase.y, z.x*uPhase.y+z.y*uPhase.x); }
vec2 conditionalWave(vec2 original, vec2 gaussian, float t) {
  t = clamp(t, 0.0, 1.0);
  // Zero first and second derivatives at both ends prevent a sudden change
  // in the wave or its time derivative when ordinary evolution takes over.
  float s = clamp(t*t*t*(10.0+t*(-15.0+6.0*t)),0.0,1.0);
  float a = 1.0-s;
  float normalization = inversesqrt(max(a*a+s*s+2.0*a*s*uOverlap, 1e-8));
  return normalization*(a*original+s*uGain*rotatePhase(gaussian));
}
void main() {
  ivec2 p=ivec2(gl_FragCoord.xy);
  vec4 a=texelFetch(uOriginal,p,0), b=texelFetch(uGaussian,p,0);
  // Both time levels use their own conditioning coefficient.
  fragColor=vec4(conditionalWave(a.rg,b.rg,uProgress.x),conditionalWave(a.ba,b.ba,uProgress.y));
}
