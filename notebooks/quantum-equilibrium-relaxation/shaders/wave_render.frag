#version 300 es
precision highp float;

const int MAX_MODES = 4;

uniform int uModeCount;
uniform vec4 uModes[MAX_MODES];
uniform float uTime;
uniform float uHBAR;
uniform float uMass;
uniform vec2 uBoxSize;
uniform float uVisGain;
uniform float uVisGamma;
uniform int uShowPhase;

in vec2 vUV;
out vec4 fragColor;

vec3 phasePalette(float t) {
  vec3 p = abs(fract(t + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  return clamp(p - 1.0, 0.0, 1.0);
}

vec3 densityPalette(float t) {
  vec3 a = vec3(0.22, 0.32, 0.28);
  vec3 b = vec3(0.40, 0.45, 0.35);
  vec3 d = vec3(0.15, 0.55, 0.75);
  return a + b * cos(6.283185 * (t + d));
}

float eigenEnergy(vec2 n) {
  float scale = uHBAR * uHBAR * 9.86960440109 / (2.0 * max(uMass, 1e-8));
  return scale * (n.x * n.x / (uBoxSize.x * uBoxSize.x) + n.y * n.y / (uBoxSize.y * uBoxSize.y));
}

vec2 waveAt(vec2 xy) {
  vec2 psi = vec2(0.0);
  for (int i = 0; i < MAX_MODES; i++) {
    if (i >= uModeCount) { break; }
    vec4 m = uModes[i];
    vec2 n = m.xy;
    float amp = m.z;
    float phase0 = m.w;
    vec2 arg = 3.14159265359 * n * xy / uBoxSize;
    float phi = sin(arg.x) * sin(arg.y);
    float phase = phase0 - eigenEnergy(n) * uTime / max(uHBAR, 1e-8);
    psi += amp * phi * vec2(cos(phase), sin(phase));
  }
  return psi;
}

void main(){
  vec2 xy = vUV * uBoxSize;
  vec2 psi = waveAt(xy);
  float rho = dot(psi, psi);

  float I = 1.0 - exp(-uVisGain * rho);
  I = pow(clamp(I, 0.0, 1.0), uVisGamma);

  vec3 col;
  if(uShowPhase==1){
    float ph = atan(psi.y, psi.x);
    float t = fract((ph + 3.14159265) / 6.2831853);
    col = phasePalette(t) * mix(0.08, 1.0, I);
  } else {
    col = densityPalette(I) * I;
  }

  float wallFade = smoothstep(0.0, 0.012, vUV.x)
                 * smoothstep(0.0, 0.012, vUV.y)
                 * smoothstep(0.0, 0.012, 1.0 - vUV.x)
                 * smoothstep(0.0, 0.012, 1.0 - vUV.y);
  col *= mix(0.22, 1.0, wallFade);

  fragColor = vec4(col, 1.0);
}
