#version 300 es
precision highp float;
precision highp sampler2D;

layout(location=0) in vec4 aState;
out vec4 vState;

uniform sampler2D uState;
uniform ivec2 uSimRes;

uniform float uHBAR;
uniform float uMass;
uniform float uDT;
uniform int uGuidingMode;
uniform float uSpinMagnitude;
uniform float uSpinSign;

uniform float uBarrierXFrac;
uniform float uBarrierThickPx;
uniform float uSlitWidthPx;
uniform float uSlitSepPx;
uniform float uParticleKillMarginPx;
uniform float uV0;

uniform float uAbsorbPx;

uniform float uRhoMin;
uniform float uVelClamp;

float band(float x, float c, float halfW, float feather) {
  return smoothstep(c - halfW - feather, c - halfW, x) *
         (1.0 - smoothstep(c + halfW, c + halfW + feather, x));
}

float barrierWallMaskAtPx(vec2 xPx) {
  float bx = uBarrierXFrac * float(uSimRes.x);
  float slab = band(xPx.x, bx, 0.5 * uBarrierThickPx, 1.0);

  float y0 = 0.5 * float(uSimRes.y);
  float s = 0.5 * uSlitSepPx;
  float hw = 0.5 * uSlitWidthPx;

  float slit1 = band(xPx.y, y0 - s, hw, 1.0);
  float slit2 = band(xPx.y, y0 + s, hw, 1.0);
  float slits = clamp(slit1 + slit2, 0.0, 1.0);

  return slab * (1.0 - slits);
}

struct BoundaryAction {
  bool freeze;
  vec2 frozenPos;
};

BoundaryAction boundaryAction(vec2 xPx) {
  float base = uAbsorbPx + uParticleKillMarginPx;
  float absDistX = 1.5 * base;
  float absDistY = 1.0 * base;
  float freezeDistX = 1.5 * absDistX;
  float freezeDistXLeft = freezeDistX * 1.20;
  float freezeDistY = 1.5 * absDistY;

  float w = float(uSimRes.x) - 1.0;
  float h = float(uSimRes.y) - 1.0;

  BoundaryAction a;
  a.freeze = false;
  a.frozenPos = xPx;

  if (xPx.x < freezeDistXLeft) {
    a.freeze = true;
    a.frozenPos = vec2(freezeDistXLeft, clamp(xPx.y, 0.0, h));
    return a;
  }

  if (xPx.x > (w - freezeDistX)) {
    a.freeze = true;
    a.frozenPos = vec2(w - freezeDistX, clamp(xPx.y, 0.0, h));
    return a;
  }

  if (xPx.y < freezeDistY) {
    a.freeze = true;
    a.frozenPos = vec2(clamp(xPx.x, 0.0, w), freezeDistY);
    return a;
  }

  if (xPx.y > (h - freezeDistY)) {
    a.freeze = true;
    a.frozenPos = vec2(clamp(xPx.x, 0.0, w), h - freezeDistY);
    return a;
  }

  return a;
}

vec2 samplePsiBilinear(vec2 xPx) {
  vec2 maxX = vec2(uSimRes) - vec2(1.0001);
  vec2 x = clamp(xPx, vec2(0.0), maxX);

  vec2 x0 = floor(x);
  vec2 f = x - x0;

  ivec2 p00 = ivec2(x0);
  ivec2 p10 = min(p00 + ivec2(1, 0), uSimRes - ivec2(1));
  ivec2 p01 = min(p00 + ivec2(0, 1), uSimRes - ivec2(1));
  ivec2 p11 = min(p00 + ivec2(1, 1), uSimRes - ivec2(1));

  vec2 a = texelFetch(uState, p00, 0).rg;
  vec2 b = texelFetch(uState, p10, 0).rg;
  vec2 c = texelFetch(uState, p01, 0).rg;
  vec2 d = texelFetch(uState, p11, 0).rg;

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec2 schrodingerVelocity(vec2 psi, vec2 dpsidx, vec2 dpsidy, float rhoEff) {
  float a = psi.x;
  float b = psi.y;

  float jx = (uHBAR / uMass) * (a * dpsidx.y - b * dpsidx.x);
  float jy = (uHBAR / uMass) * (a * dpsidy.y - b * dpsidy.x);

  return vec2(jx, jy) / rhoEff;
}

vec2 pauliSpinCorrection(float rhoEff, float drhodx, float drhody) {
  return uSpinMagnitude * uSpinSign * (uHBAR / uMass) * vec2(drhody, -drhodx) / rhoEff;
}

vec2 guidingVelocity(vec2 xPx) {
  vec2 psi = samplePsiBilinear(xPx);
  vec2 psiE = samplePsiBilinear(xPx + vec2(1.0, 0.0));
  vec2 psiW = samplePsiBilinear(xPx + vec2(-1.0, 0.0));
  vec2 psiN = samplePsiBilinear(xPx + vec2(0.0, 1.0));
  vec2 psiS = samplePsiBilinear(xPx + vec2(0.0, -1.0));

  vec2 dpsidx = 0.5 * (psiE - psiW);
  vec2 dpsidy = 0.5 * (psiN - psiS);

  float rho = dot(psi, psi);
  float rhoEff = max(rho, uRhoMin);

  vec2 v = schrodingerVelocity(psi, dpsidx, dpsidy, rhoEff);

  if (uGuidingMode == 1) {
    float rhoE = dot(psiE, psiE);
    float rhoW = dot(psiW, psiW);
    float rhoN = dot(psiN, psiN);
    float rhoS = dot(psiS, psiS);
    float drhodx = 0.5 * (rhoE - rhoW);
    float drhody = 0.5 * (rhoN - rhoS);
    v += pauliSpinCorrection(rhoEff, drhodx, drhody);
  }

  float sp = length(v);
  if (sp > uVelClamp) v *= (uVelClamp / sp);

  return v;
}

void main() {
  vec2 x = aState.xy;
  float mode = aState.z;

  if (mode < 0.5) {
    vState = aState;
    gl_Position = vec4(-2.0);
    return;
  }

  if (mode > 1.5) {
    vState = aState;
    gl_Position = vec4(-2.0);
    return;
  }

  BoundaryAction act0 = boundaryAction(x);
  if (barrierWallMaskAtPx(x) > 0.5) {
    vState = vec4(-10.0, -10.0, 0.0, 0.0);
    gl_Position = vec4(-2.0);
    return;
  }
  if (act0.freeze) {
    vState = vec4(act0.frozenPos, 2.0, 0.0);
    gl_Position = vec4(-2.0);
    return;
  }

  vec2 v1 = guidingVelocity(x);
  vec2 xm = clamp(x + 0.5 * uDT * v1, vec2(0.0), vec2(uSimRes) - vec2(1.0));

  BoundaryAction actM = boundaryAction(xm);
  if (actM.freeze) {
    vState = vec4(actM.frozenPos, 2.0, 0.0);
    gl_Position = vec4(-2.0);
    return;
  }

  vec2 v2 = guidingVelocity(xm);
  vec2 xn = x + uDT * v2;

  BoundaryAction actN = boundaryAction(xn);
  if (actN.freeze) {
    vState = vec4(actN.frozenPos, 2.0, 0.0);
    gl_Position = vec4(-2.0);
    return;
  }

  vState = vec4(xn, 1.0, 0.0);
  gl_Position = vec4(-2.0);
}
