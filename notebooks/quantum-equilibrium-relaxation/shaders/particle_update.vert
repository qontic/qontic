#version 300 es
precision highp float;

const int MAX_MODES = 4;

layout(location=0) in vec4 aState;
out vec4 vState;

uniform int uModeCount;
uniform vec4 uModes[MAX_MODES];
uniform float uTime;
uniform float uHBAR;
uniform float uMass;
uniform float uDT;
uniform vec2 uBoxSize;
uniform int uGuidingMode;
uniform float uSpinMagnitude;
uniform float uRhoMin;
uniform float uVelClamp;
uniform int uSubsteps;

float eigenEnergy(vec2 n) {
  float scale = uHBAR * uHBAR * 9.86960440109 / (2.0 * max(uMass, 1e-8));
  return scale * (n.x * n.x / (uBoxSize.x * uBoxSize.x) + n.y * n.y / (uBoxSize.y * uBoxSize.y));
}

struct WaveSample {
  vec2 psi;
  vec2 dpsidx;
  vec2 dpsidy;
};

WaveSample waveAt(vec2 xy, float t) {
  WaveSample w;
  w.psi = vec2(0.0);
  w.dpsidx = vec2(0.0);
  w.dpsidy = vec2(0.0);

  for (int i = 0; i < MAX_MODES; i++) {
    if (i >= uModeCount) { break; }
    vec4 m = uModes[i];
    vec2 n = m.xy;
    float amp = m.z;
    float phase0 = m.w;
    vec2 arg = 3.14159265359 * n * xy / uBoxSize;
    vec2 s = sin(arg);
    vec2 c = cos(arg);
    float phase = phase0 - eigenEnergy(n) * t / max(uHBAR, 1e-8);
    vec2 coeff = amp * vec2(cos(phase), sin(phase));

    float phi = s.x * s.y;
    float dphidx = (n.x * 3.14159265359 / uBoxSize.x) * c.x * s.y;
    float dphidy = (n.y * 3.14159265359 / uBoxSize.y) * s.x * c.y;

    w.psi += coeff * phi;
    w.dpsidx += coeff * dphidx;
    w.dpsidy += coeff * dphidy;
  }

  return w;
}

float modf1(float x, float y) {
  return x - y * floor(x / y);
}

float reflectCoord(float x, float hi) {
  float lo = 0.00001;
  float h = hi - lo;
  if (h <= lo) { return 0.5 * hi; }
  float width = h - lo;
  float period = 2.0 * width;
  float v = modf1(x - lo, period);
  return lo + ((v <= width) ? v : period - v);
}

vec2 reflectIntoBox(vec2 xy) {
  return vec2(reflectCoord(xy.x, uBoxSize.x), reflectCoord(xy.y, uBoxSize.y));
}

vec2 guidingVelocity(vec2 xy, float t) {
  xy = clamp(xy, vec2(0.00001), uBoxSize - vec2(0.00001));
  WaveSample w = waveAt(xy, t);
  float rho = dot(w.psi, w.psi);
  float rhoEff = max(rho, uRhoMin);

  float hbarOverMass = uHBAR / max(uMass, 1e-8);
  vec2 v = hbarOverMass * vec2(
    w.psi.x * w.dpsidx.y - w.psi.y * w.dpsidx.x,
    w.psi.x * w.dpsidy.y - w.psi.y * w.dpsidy.x
  ) / rhoEff;

  if (uGuidingMode == 1 && uSpinMagnitude != 0.0) {
    float drhodx = 2.0 * dot(w.psi, w.dpsidx);
    float drhody = 2.0 * dot(w.psi, w.dpsidy);
    v += uSpinMagnitude * hbarOverMass * vec2(drhody, -drhodx) / rhoEff;
  }

  float speed = length(v);
  if (uVelClamp > 0.0 && speed > uVelClamp) {
    v *= uVelClamp / speed;
  }
  return v;
}

vec2 rk4Step(vec2 x, float t, float h) {
  vec2 k1 = guidingVelocity(x, t);
  vec2 k2 = guidingVelocity(reflectIntoBox(x + 0.5 * h * k1), t + 0.5 * h);
  vec2 k3 = guidingVelocity(reflectIntoBox(x + 0.5 * h * k2), t + 0.5 * h);
  vec2 k4 = guidingVelocity(reflectIntoBox(x + h * k3), t + h);
  return reflectIntoBox(x + (h / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4));
}

void main() {
  if (aState.z < 0.5) {
    vState = aState;
    gl_Position = vec4(-2.0);
    return;
  }

  vec2 x = reflectIntoBox(aState.xy);
  int substeps = clamp(uSubsteps, 1, 16);
  float h = uDT / float(substeps);
  float t = uTime;

  for (int i = 0; i < 16; i++) {
    if (i >= substeps) { break; }
    x = rk4Step(x, t, h);
    t += h;
  }

  vState = vec4(x, 1.0, 0.0);
  gl_Position = vec4(-2.0);
}
