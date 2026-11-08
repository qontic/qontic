#version 300 es
precision highp float;

uniform ivec2 uSimRes;

uniform float uHBAR;
uniform float uMass;
uniform float uP0;
uniform float uDT;

uniform vec2  uPacketPosPx;
uniform float uPacketSigmaPx;
uniform int uLocalizedPacket;
uniform vec2 uLocalizedSigma;
uniform vec2 uLocalizedMomentum;

uniform float uBarrierXFrac;
uniform float uBarrierThickPx;
uniform float uSlitWidthPx;
uniform float uSlitSepPx;
uniform float uV0;

uniform float uAbsorbPx;
uniform float uAbsorbYPx;
uniform float uAbsorbYStrength;
uniform float uAbsorbStrength;

out vec4 fragColor;

float sqr(float x){ return x*x; }
vec2 cis(float a){ return vec2(cos(a), sin(a)); }
float kineticEnergy(){ return 0.5*sqr(uP0)/uMass; }

float band(float x, float c, float halfW, float feather){
  return smoothstep(c-halfW-feather, c-halfW, x) *
         (1.0 - smoothstep(c+halfW, c+halfW+feather, x));
}

float barrierPotentialPx(vec2 xPx){
  float bx = uBarrierXFrac * float(uSimRes.x);
  float slab = band(xPx.x, bx, 0.5*uBarrierThickPx, 1.0);

  float y0 = 0.5 * float(uSimRes.y);
  float s  = 0.5 * uSlitSepPx;
  float hw = 0.5 * uSlitWidthPx;

  float slit1 = band(xPx.y, y0 - s, hw, 1.0);
  float slit2 = band(xPx.y, y0 + s, hw, 1.0);
  float slits = clamp(slit1 + slit2, 0.0, 1.0);

  float wall = slab * (1.0 - slits);
  return uV0 * wall;
}

float absorberProfile(float distance, float width){
  if(width <= 0.0) return 0.0;
  float t = clamp((width - distance) / width, 0.0, 1.0);
  float s = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  return s * s;
}

float absorbW(vec2 xPx){
  float dx = min(xPx.x * 1.20, float(uSimRes.x) - xPx.x);
  float dy = min(xPx.y, float(uSimRes.y) - xPx.y);
  // The vertical ramp is wider and entirely in the offscreen extension.
  return max(uAbsorbStrength * absorberProfile(dx, uAbsorbPx), uAbsorbYStrength * absorberProfile(dy, uAbsorbYPx));
}

vec2 schrodingerRHS(vec2 psi, vec2 lapPsi, float V){
  float cLap = uHBAR / (2.0*uMass);
  float cV   = V / uHBAR;
  return vec2(-cLap*lapPsi.y + cV*psi.y,
               cLap*lapPsi.x - cV*psi.x);
}

float localizedWallEnvelope(vec2 xPx) {
  if (uV0 <= 0.0) return 1.0;
  float bx = uBarrierXFrac * float(uSimRes.x);
  float y0 = 0.5 * float(uSimRes.y);
  // Include the potential's one-cell outer feather. The new packet must
  // contain no amplitude inside the solid barrier, including its corners.
  float horizontal = abs(xPx.x - bx) - (0.5 * uBarrierThickPx + 1.0);
  float vertical = 0.5 * uSlitWidthPx - min(
    abs(xPx.y - y0 - 0.5 * uSlitSepPx),
    abs(xPx.y - y0 + 0.5 * uSlitSepPx));
  if (uSlitSepPx <= uSlitWidthPx) {
    vertical = 0.5 * (uSlitWidthPx + uSlitSepPx) - abs(xPx.y - y0);
  }
  vec2 clearance = vec2(horizontal, vertical);
  float distance = length(max(clearance, vec2(0.0)))
    + min(max(clearance.x, clearance.y), 0.0);
  float feather = min(2.0, 0.5 * uSlitWidthPx);
  float t = clamp(distance / max(feather, 1.0), 0.0, 1.0);
  // The compact packet is already clear of the wall. Only its negligible
  // boundary tail needs this C2 taper; do not reshape the Gaussian's core.
  // The opening remains connected across the wall: cutting off the whole
  // upstream half of the packet would spuriously reflect its trailing particle.
  return t*t*t*(10.0+t*(-15.0+6.0*t));
}

vec2 initialPacketAtPx(vec2 xPx, float t){
  vec2 x0 = uPacketPosPx;
  vec2 d  = xPx - x0;

  vec2 sigma = uLocalizedPacket == 1 ? uLocalizedSigma : vec2(uPacketSigmaPx);
  vec2 momentum = uLocalizedPacket == 1 ? uLocalizedMomentum : vec2(uP0, 0.0);
  float amp = uLocalizedPacket == 1 ? exp(-0.5*dot(d/sigma,d/sigma))
    : exp(-dot(d,d)/(2.0*sqr(uPacketSigmaPx)));
  if (uLocalizedPacket == 1) amp *= localizedWallEnvelope(xPx);

  float phaseSpace = uLocalizedPacket == 1 ? dot(momentum,d)/uHBAR : (uP0/uHBAR)*d.x;
  float phaseTime = uLocalizedPacket == 1 ? -dot(momentum,momentum)*t/(2.0*uMass*uHBAR)
    : -kineticEnergy()*t/uHBAR;
  return amp * cis(phaseSpace + phaseTime);
}

vec2 initialLocalizedRateAtPx(vec2 p) {
  vec2 psi = initialPacketAtPx(p, 0.0);
  vec2 lap = initialPacketAtPx(p + vec2(1.0, 0.0), 0.0)
    + initialPacketAtPx(p - vec2(1.0, 0.0), 0.0)
    + initialPacketAtPx(p + vec2(0.0, 1.0), 0.0)
    + initialPacketAtPx(p - vec2(0.0, 1.0), 0.0) - 4.0 * psi;
  return schrodingerRHS(psi, lap, barrierPotentialPx(p)) - absorbW(p) / uHBAR * psi;
}

void main() {
  vec2 xPx = gl_FragCoord.xy;

  vec2 psi0 = initialPacketAtPx(xPx, 0.0);

  
  vec2 psiE = initialPacketAtPx(xPx + vec2( 1.0, 0.0), 0.0);
  vec2 psiW = initialPacketAtPx(xPx + vec2(-1.0, 0.0), 0.0);
  vec2 psiN = initialPacketAtPx(xPx + vec2( 0.0, 1.0), 0.0);
  vec2 psiS = initialPacketAtPx(xPx + vec2( 0.0,-1.0), 0.0);
  vec2 lap0 = (psiE + psiW + psiN + psiS - 4.0*psi0);

  float V = barrierPotentialPx(xPx);

  vec2 rhs0 = schrodingerRHS(psi0, lap0, V);

  float W = absorbW(xPx);
  float absorbA = uDT * W / uHBAR;

  // First-order backward start-up for the leapfrog state with local damping.
  vec2 psiPrev = psi0 - uDT * rhs0 + absorbA * psi0;
  if (uLocalizedPacket == 1) {
    // Give the newly prepared packet a consistent second-order time history.
    // This suppresses the alternating-time startup component of leapfrog.
    // Ordinary incoming-wave initialization retains its existing behavior.
    vec2 rate0 = rhs0 - W / uHBAR * psi0;
    vec2 lapRate = initialLocalizedRateAtPx(xPx + vec2(1.0, 0.0))
      + initialLocalizedRateAtPx(xPx - vec2(1.0, 0.0))
      + initialLocalizedRateAtPx(xPx + vec2(0.0, 1.0))
      + initialLocalizedRateAtPx(xPx - vec2(0.0, 1.0)) - 4.0 * rate0;
    psiPrev += 0.5 * uDT * uDT
      * (schrodingerRHS(rate0, lapRate, V) - W / uHBAR * rate0);
  }

  fragColor = vec4(psi0, psiPrev);
}
