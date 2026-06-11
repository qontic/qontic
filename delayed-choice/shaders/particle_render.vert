#version 300 es
precision highp float;
precision highp sampler2D;

layout(location=0) in vec4 aState; // x,y,alive,transmitted
uniform sampler2D uState;
uniform ivec2 uSimRes;
uniform float uPointSize;
uniform float uVisGain;
uniform float uVisGamma;
uniform float uWaveTailFade;
uniform int uNumParticles;
uniform float uTrailWidth;
uniform int uRenderMode;
uniform vec2 uViewCenterFrac;
uniform vec2 uViewScale;
out float vAlive;
out float vParticleId;
out float vTransmitted;
out float vTailAlpha;

float packetTailAlpha(vec2 uv){
  vec2 psi = texture(uState, clamp(uv, vec2(0.0), vec2(1.0))).rg;
  float rho = dot(psi, psi);

  float I = 1.0 - exp(-uVisGain * rho);
  I = pow(clamp(I, 0.0, 1.0), uVisGamma);

  float tailFade = max(uWaveTailFade, 0.0);
  if(tailFade <= 0.0) return 1.0;

  float tailAmount = 1.0 - exp(-0.7 * tailFade);
  float tailKnee = mix(0.04, 0.70, tailAmount);
  float tailPower = 1.0 + 1.4 * tailFade;
  float tailMask = smoothstep(0.0, tailKnee, I);
  return pow(tailMask, tailPower);
}

void main(){
  bool drawParticle = aState.z > 0.5;
  if(uRenderMode == 1) {
    drawParticle = aState.z > 1.5;
  }

  if(!drawParticle) {
    vAlive = 0.0;
    vTransmitted = aState.w;
    vParticleId = float(gl_VertexID) / float(uNumParticles);
    vTailAlpha = 0.0;
    gl_Position = vec4(-2.0, -2.0, 0.0, 1.0);
    gl_PointSize = 0.0;
    return;
  }

  vAlive = aState.z;
  vTransmitted = aState.w;
  vParticleId = float(gl_VertexID) / float(uNumParticles);
  vec2 uv  = aState.xy / vec2(uSimRes);
  vTailAlpha = (aState.z > 1.5) ? 1.0 : packetTailAlpha(uv);
  vec2 screenUv = vec2(0.5) + (uv - uViewCenterFrac) * uViewScale;
  vec2 ndc = screenUv * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  // choose width: trail stamps can be thinner
  float size = uPointSize;
  if(uTrailWidth > 0.0) size = uTrailWidth;
  gl_PointSize = size;
}
