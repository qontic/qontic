#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uState;
uniform ivec2 uSimRes;

uniform float uVisGain;
uniform float uVisGamma;
uniform int uShowPhase;
uniform float uAbsorbPx;
uniform float uParticleKillMarginPx;

uniform float uBarrierYFrac;
uniform float uBarrierThickPx;

uniform float uBarrierOpacity;
uniform float uBarrierClassicallyForbidden;

in vec2 vUV;
out vec4 fragColor;

vec3 phasePalette(float t) {
  vec3 a = vec3(0.10, 0.02, 0.12);
  vec3 b = vec3(0.75, 0.15, 0.90);
  vec3 d = vec3(0.00, 0.10, 0.30);
  return a + b * cos(6.283185 * (t + d));
}

vec3 densityPalette(float t) {
  vec3 a = vec3(0.22, 0.32, 0.28);
  vec3 b = vec3(0.40, 0.45, 0.35);
  vec3 d = vec3(0.15, 0.55, 0.75);
  return a + b * cos(6.283185 * (t + d));
}

float detectorVisibility(vec2 uv) {
  vec2 xPx = uv * (vec2(uSimRes) - vec2(1.0));
  vec2 maxPx = vec2(uSimRes) - vec2(1.0);
  float base = uAbsorbPx + uParticleKillMarginPx;
  float freezeDistX = 2.25 * base;
  float freezeDistXLeft = 1.20 * freezeDistX;
  float freezeDistY = 1.50 * base;
  float fadeWidth = 8.0;

  float left = smoothstep(freezeDistXLeft - fadeWidth, freezeDistXLeft, xPx.x);
  float right = smoothstep(freezeDistX - fadeWidth, freezeDistX, maxPx.x - xPx.x);
  float top = smoothstep(freezeDistY - fadeWidth, freezeDistY, xPx.y);
  float bottom = smoothstep(freezeDistY - fadeWidth, freezeDistY, maxPx.y - xPx.y);

  return min(min(left, right), min(top, bottom));
}

void main() {
  vec2 uv = vUV;

  vec2 psi = texture(uState, uv).rg;
  float rho = dot(psi, psi);

  float intensity = 1.0 - exp(-uVisGain * rho);
  intensity = pow(clamp(intensity, 0.0, 1.0), uVisGamma);

  vec3 col;
  if (uShowPhase == 1) {
    float phase = atan(psi.y, psi.x);
    float t = fract((phase + 3.14159265) / 6.2831853);
    col = phasePalette(t) * intensity;
  } else {
    col = densityPalette(intensity) * intensity;
  }

  col *= detectorVisibility(uv);

  vec2 xPx = uv * vec2(uSimRes);
  float barrierY = uBarrierYFrac * float(uSimRes.y);
  float halfWidth = max(0.5 * uBarrierThickPx, 1.0);
  float barrierOffset = xPx.y - barrierY;
  float wall = 1.0 - smoothstep(halfWidth, halfWidth + 1.0, abs(barrierOffset));
  float opacity = clamp(uBarrierOpacity, 0.0, 1.0);
  float forbidden = clamp(uBarrierClassicallyForbidden, 0.0, 1.0);

  vec3 allowedWallCol = vec3(0.10, 0.22, 0.29);
  vec3 forbiddenWallCol = vec3(0.58, 0.18, 0.11);
  vec3 allowedAccent = vec3(0.32, 0.62, 0.70);
  vec3 forbiddenAccent = vec3(1.00, 0.48, 0.24);
  vec3 wallCol = mix(allowedWallCol, forbiddenWallCol, forbidden);
  vec3 accentCol = mix(allowedAccent, forbiddenAccent, forbidden);

  float wallY = clamp(0.5 + 0.5 * barrierOffset / halfWidth, 0.0, 1.0);
  float centerSheen = 1.0 - smoothstep(0.0, 0.85, abs(barrierOffset) / halfWidth);
  wallCol *= mix(mix(0.82, 0.92, forbidden), 1.08, wallY);
  wallCol += accentCol * (mix(0.045, 0.065, forbidden) * centerSheen);

  float wallAlpha = wall * opacity;
  col = mix(col, wallCol, wallAlpha);

  float topEdge = 1.0 - smoothstep(0.0, 1.5, abs(barrierOffset - halfWidth));
  float bottomEdge = 1.0 - smoothstep(0.0, 1.5, abs(barrierOffset + halfWidth));
  float outerGlow = (1.0 - smoothstep(1.0, 7.0, abs(abs(barrierOffset) - halfWidth))) * (1.0 - wall);

  col = mix(col, accentCol, topEdge * opacity * 0.38);
  col = mix(col, wallCol * 0.42, bottomEdge * opacity * 0.32);
  col += 9.0 * accentCol * outerGlow * opacity * 0.065;

  fragColor = vec4(col, 1.0);
}
