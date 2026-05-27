#version 300 es
precision highp float;

uniform ivec2 uSimRes;

uniform float uHBAR;
uniform float uMass;
uniform float uP0;
uniform float uDT;

uniform vec2  uPacketPosFrac;
uniform float uPacketSigmaPx;

uniform float uBarrierXFrac;
uniform float uBarrierThickPx;
uniform float uSlitWidthPx;
uniform float uSlitSepPx;
uniform float uV0;

uniform float uAbsorbPx;
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

float absorbW(vec2 xPx){
  if(uAbsorbPx <= 0.0) return 0.0;

  
  float leftFactor = 1.20;
  float dx = min(xPx.x * leftFactor, float(uSimRes.x) - 1.0 - xPx.x);
  float dy = min(xPx.y, float(uSimRes.y) - 1.0 - xPx.y);
  float d  = min(dx, dy);

  float t = clamp((uAbsorbPx - d) / max(uAbsorbPx, 1.0), 0.0, 1.0);

  float s = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  float profile = s * s;
  
  return uAbsorbStrength * profile;
}

vec2 schrodingerRHS(vec2 psi, vec2 lapPsi, float V){
  float cLap = uHBAR / (2.0*uMass);
  float cV   = V / uHBAR;
  return vec2(-cLap*lapPsi.y + cV*psi.y,
               cLap*lapPsi.x - cV*psi.x);
}

vec2 initialPacketAtPx(vec2 xPx, float t){
  vec2 x0 = uPacketPosFrac * vec2(uSimRes);
  vec2 d  = xPx - x0;

  float amp = exp(-dot(d,d)/(2.0*sqr(uPacketSigmaPx)));

  float k  = uP0/uHBAR;
  float phaseSpace = k * d.x;                 
  float phaseTime  = -kineticEnergy() * t / uHBAR;
  return amp * cis(phaseSpace + phaseTime);
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

  fragColor = vec4(psi0, psiPrev);
}
