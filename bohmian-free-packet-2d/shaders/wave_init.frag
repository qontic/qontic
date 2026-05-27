#version 300 es
precision highp float;

uniform ivec2 uSimRes;

uniform float uHBAR;
uniform float uMass;
uniform float uP0;
uniform float uDT;

uniform vec2  uPacketPosFrac;
uniform float uPacketSigmaPx;
uniform int   uDoubleGaussian;
uniform float uGaussianSeparation;

out vec4 fragColor;

float sqr(float x){ return x*x; }
vec2 cis(float a){ return vec2(cos(a), sin(a)); }
float kineticEnergy(){ return 0.5*sqr(uP0)/uMass; }

vec2 schrodingerRHS(vec2 psi, vec2 lapPsi){
  float cLap = uHBAR / (2.0*uMass);
  return vec2(-cLap*lapPsi.y,
               cLap*lapPsi.x);
}

vec2 initialPacketAtPx(vec2 xPx, float t){
  vec2 x0 = uPacketPosFrac * vec2(uSimRes);
  
  if (uDoubleGaussian != 0) {
    // Superposition of two Gaussians, separated vertically
    float sep = uGaussianSeparation / 2.0;
    
    vec2 d1 = xPx - x0 - vec2(0.0, -sep);
    vec2 d2 = xPx - x0 - vec2(0.0, sep);
    
    float amp1 = exp(-dot(d1,d1)/(2.0*sqr(uPacketSigmaPx)));
    float amp2 = exp(-dot(d2,d2)/(2.0*sqr(uPacketSigmaPx)));
    
    // Normalize by 1/sqrt(2) so total probability is conserved
    float amp = (amp1 + amp2) / sqrt(2.0);
    
    float k  = uP0/uHBAR;
    vec2 dir = vec2(1.0, 0.0);
    
    // Phase for both gaussians (same momentum direction)
    float phase1 = k * dot(dir, d1);
    float phase2 = k * dot(dir, d2);
    float phaseTime  = -kineticEnergy() * t / uHBAR;
    
    vec2 psi1 = amp1 * cis(phase1 + phaseTime);
    vec2 psi2 = amp2 * cis(phase2 + phaseTime);
    
    // Return superposition (normalized)
    return (psi1 + psi2) / sqrt(2.0);
  } else {
    // Single Gaussian (original behavior)
    vec2 d  = xPx - x0;

    float amp = exp(-dot(d,d)/(2.0*sqr(uPacketSigmaPx)));

    float k  = uP0/uHBAR;
    vec2 dir = vec2(1.0, 0.0);
    float phaseSpace = k * dot(dir, d);
    float phaseTime  = -kineticEnergy() * t / uHBAR;
    return amp * cis(phaseSpace + phaseTime);
  }
}

void main() {
  vec2 xPx = gl_FragCoord.xy;

  vec2 psi0 = initialPacketAtPx(xPx, 0.0);

  
  vec2 psiE = initialPacketAtPx(xPx + vec2( 1.0, 0.0), 0.0);
  vec2 psiW = initialPacketAtPx(xPx + vec2(-1.0, 0.0), 0.0);
  vec2 psiN = initialPacketAtPx(xPx + vec2( 0.0, 1.0), 0.0);
  vec2 psiS = initialPacketAtPx(xPx + vec2( 0.0,-1.0), 0.0);
  vec2 lap0 = (psiE + psiW + psiN + psiS - 4.0*psi0);

  vec2 rhs0 = schrodingerRHS(psi0, lap0);

  vec2 psiPrev = psi0 - uDT * rhs0;

  fragColor = vec4(psi0, psiPrev);
}
