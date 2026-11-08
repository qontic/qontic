#version 300 es
precision highp float;
precision highp sampler2D;

layout(location=0) in vec4 aState; // x, y, alive/detected, packed starting color groups
uniform sampler2D uState;
uniform ivec2 uSimRes;
uniform vec4 uStageRect;
uniform float uPointSize;
uniform float uTrailWidth;
uniform float uVisGain;
uniform float uVisGamma;
uniform float uParticleTailFade;
out float vAlive;
out float vOriginQuadrant;
out float vTailAlpha;

// Match the delayed-choice applet's gentle fading at the wave-packet edges.
float packetTailAlpha(vec2 uv){
  vec2 psi = texture(uState, clamp(uv, vec2(0.0), vec2(1.0))).rg;
  float rho = dot(psi, psi);
  float I = 1.0 - exp(-uVisGain * rho);
  I = pow(clamp(I, 0.0, 1.0), uVisGamma);

  float tailFade = max(uParticleTailFade, 0.0);
  if(tailFade <= 0.0) return 1.0;

  float tailAmount = 1.0 - exp(-0.7 * tailFade);
  float tailKnee = mix(0.04, 0.70, tailAmount);
  float tailPower = 1.0 + 1.4 * tailFade;
  float tailMask = smoothstep(0.0, tailKnee, I);
  return pow(tailMask, tailPower);
}

void main(){
  vAlive = aState.z;
  vOriginQuadrant = aState.w;
  vec2 uv = (aState.xy - uStageRect.xy) / uStageRect.zw;
  vec2 waveUV = aState.xy / vec2(uSimRes);
  vTailAlpha = (aState.z > 1.5) ? 1.0 : packetTailAlpha(waveUV);
  gl_Position = vec4(uv * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = uTrailWidth > 0.0 ? uTrailWidth : uPointSize;
}
