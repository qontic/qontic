#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uState; 
uniform ivec2 uSimRes;

uniform float uHBAR;
uniform float uMass;
uniform float uDT;
uniform int uBoundaryMode;

out vec4 fragColor;

vec2 fetchPsi(ivec2 q){
  if (uBoundaryMode == 1) {
    // Periodic boundary: wrap coordinates
    q = ivec2(mod(vec2(q), vec2(uSimRes)));
    return texelFetch(uState, q, 0).rg;
  } else {
    // Reflecting boundary: return 0 outside domain
    if(q.x < 0 || q.y < 0 || q.x >= uSimRes.x || q.y >= uSimRes.y) return vec2(0.0);
    return texelFetch(uState, q, 0).rg;
  }
}

vec2 schrodingerRHS(vec2 psi, vec2 lapPsi){
  
  float cLap = uHBAR / (2.0*uMass);
  return vec2(-cLap*lapPsi.y,
               cLap*lapPsi.x);
}

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);

  vec4 s = texelFetch(uState, p, 0);
  vec2 psi     = s.rg;
  vec2 psiPrev = s.ba;

  
  vec2 psiE = fetchPsi(p + ivec2( 1, 0));
  vec2 psiW = fetchPsi(p + ivec2(-1, 0));
  vec2 psiN = fetchPsi(p + ivec2( 0, 1));
  vec2 psiS = fetchPsi(p + ivec2( 0,-1));
  vec2 lapPsi = (psiE + psiW + psiN + psiS - 4.0*psi);

  
  vec2 rhs = schrodingerRHS(psi, lapPsi);

  
  vec2 psiNext = psiPrev + 2.0 * uDT * rhs;

  fragColor = vec4(psiNext, psi);
}
