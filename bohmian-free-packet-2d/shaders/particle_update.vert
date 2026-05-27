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
uniform float uSpinS;
uniform int uBoundaryMode;

uniform float uRhoMin;
uniform float uVelClamp;

vec2 samplePsiBilinear(vec2 xPx, int boundaryMode) {
  vec2 simResF = vec2(uSimRes);
  
  // Apply boundary conditions to the sample position
  if (boundaryMode == 1) {
    xPx = mod(xPx, simResF);
  } else {
    vec2 maxX = simResF - vec2(1.0001);
    xPx = clamp(xPx, vec2(0.0), maxX);
  }

  vec2 x0 = floor(xPx);
  vec2 f = xPx - x0;

  ivec2 p00 = ivec2(x0);
  
  // For periodic boundaries, wrap indices; for reflecting, clamp
  ivec2 p10, p01, p11;
  if (boundaryMode == 1) {
    p10 = ivec2(mod(vec2(p00) + vec2(1.0, 0.0), simResF));
    p01 = ivec2(mod(vec2(p00) + vec2(0.0, 1.0), simResF));
    p11 = ivec2(mod(vec2(p00) + vec2(1.0, 1.0), simResF));
  } else {
    p10 = min(p00 + ivec2(1, 0), uSimRes - ivec2(1));
    p01 = min(p00 + ivec2(0, 1), uSimRes - ivec2(1));
    p11 = min(p00 + ivec2(1, 1), uSimRes - ivec2(1));
  }

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
  return uSpinS * (uHBAR / uMass) * vec2(drhody, -drhodx) / rhoEff;
}

vec2 guidingVelocity(vec2 xPx, int boundaryMode) {
  vec2 psi = samplePsiBilinear(xPx, boundaryMode);
  vec2 psiE = samplePsiBilinear(xPx + vec2(1.0, 0.0), boundaryMode);
  vec2 psiW = samplePsiBilinear(xPx + vec2(-1.0, 0.0), boundaryMode);
  vec2 psiN = samplePsiBilinear(xPx + vec2(0.0, 1.0), boundaryMode);
  vec2 psiS = samplePsiBilinear(xPx + vec2(0.0, -1.0), boundaryMode);

  vec2 dpsidx = 0.5 * (psiE - psiW);
  vec2 dpsidy = 0.5 * (psiN - psiS);

  float rho = dot(psi, psi);
  float rhoEff = max(rho, uRhoMin);

  vec2 v = schrodingerVelocity(psi, dpsidx, dpsidy, rhoEff);

  float spinSign = 0.0;
  if (uGuidingMode == 1) {
    spinSign = 1.0;
  } else if (uGuidingMode == 2) {
    spinSign = -1.0;
  }

  if (spinSign != 0.0) {
    float rhoE = dot(psiE, psiE);
    float rhoW = dot(psiW, psiW);
    float rhoN = dot(psiN, psiN);
    float rhoS = dot(psiS, psiS);
    float drhodx = 0.5 * (rhoE - rhoW);
    float drhody = 0.5 * (rhoN - rhoS);
    v += spinSign * pauliSpinCorrection(rhoEff, drhodx, drhody);
  }

  float sp = length(v);
  if (sp > uVelClamp) v *= (uVelClamp / sp);

  return v;
}

vec2 reflectIntoBox(vec2 xPx) {
  vec2 maxX = vec2(uSimRes) - vec2(1.0);

  if (xPx.x < 0.0) xPx.x = -xPx.x;
  if (xPx.x > maxX.x) xPx.x = 2.0 * maxX.x - xPx.x;
  if (xPx.y < 0.0) xPx.y = -xPx.y;
  if (xPx.y > maxX.y) xPx.y = 2.0 * maxX.y - xPx.y;

  return clamp(xPx, vec2(0.0), maxX);
}

vec2 applyPeriodicBC(vec2 xPx) {
  vec2 maxX = vec2(uSimRes);
  return mod(xPx, maxX);
}

vec2 applyBoundaryConditions(vec2 xPx, int boundaryMode) {
  if (boundaryMode == 1) {
    return applyPeriodicBC(xPx);
  } else {
    return reflectIntoBox(xPx);
  }
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

  x = applyBoundaryConditions(x, uBoundaryMode);
  vec2 v1 = guidingVelocity(x, uBoundaryMode);
  vec2 xm = applyBoundaryConditions(x + 0.5 * uDT * v1, uBoundaryMode);

  vec2 v2 = guidingVelocity(xm, uBoundaryMode);
  vec2 xn = applyBoundaryConditions(x + uDT * v2, uBoundaryMode);

  vState = vec4(xn, 1.0, 0.0);
  gl_Position = vec4(-2.0);
}
