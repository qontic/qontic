#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uState;
uniform vec4 uStageUV;

uniform float uVisGain;
uniform float uVisGamma;
uniform int   uShowPhase;

uniform int   uPaletteId;

in vec2 vUV;
out vec4 fragColor;

// Raw wave amplitude |psi|; the initial Gaussian has peak amplitude 1.
// All wave colors (phase and density) are off below this value and fade in
// up to twice this value. Raise it to hide more faint wave detail; 0 disables it.
const float PHASE_AMPLITUDE_CUTOFF = 0.001;

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d)
{
    return a + b*cos(6.283185*(c*t+d));
}

void getPaletteParams(int id, out vec3 a, out vec3 b, out vec3 c, out vec3 d)
{
  if(uShowPhase==0){
    a=vec3(0.22,0.32,0.28);
    b=vec3(0.40,0.45,0.35);
    c=vec3(1.0);
    d=vec3(0.15,0.55,0.75);
  } else {
    a=vec3(0.10,0.02,0.12);
    b=vec3(0.75,0.15,0.90);
    c=vec3(1.0);
    d=vec3(0.00,0.10,0.30);
  }
}

// Phase mapping from Bohmian Free Packet/shaders/wave_render.frag.
vec3 phaseColor(float ph)
{
  const float halfPi = 1.57079633;
  const float blackFadeWidth = 1.05;
  const vec3 blue = vec3(0.08, 0.25, 1.0);
  const vec3 red = vec3(1.0, 0.08, 0.02);
  const vec3 magenta = vec3(0.72, 0.04, 0.88);

  float magnitude = abs(ph);
  vec3 branchColor = ph >= 0.0 ? blue : red;
  float seamBlend = clamp((magnitude - halfPi) / halfPi, 0.0, 1.0);
  float fadeProgress = clamp(magnitude / blackFadeWidth, 0.0, 1.0);
  float phaseVisibility = fadeProgress * fadeProgress * fadeProgress
    * (fadeProgress * (fadeProgress * 6.0 - 15.0) + 10.0);

  return mix(branchColor, magenta, seamBlend) * phaseVisibility;
}

void main(){
  vec2 uv = uStageUV.xy + vUV * uStageUV.zw;

  vec2 psi = texture(uState, uv).rg;
  float rho = dot(psi, psi);
  float waveVisibility = PHASE_AMPLITUDE_CUTOFF > 0.0
    ? smoothstep(PHASE_AMPLITUDE_CUTOFF, 2.0 * PHASE_AMPLITUDE_CUTOFF, sqrt(rho))
    : 1.0;

  float I = 1.0 - exp(-uVisGain * rho);
  I = pow(clamp(I, 0.0, 1.0), uVisGamma);

  vec3 a,b,c,d;
  getPaletteParams(uPaletteId, a,b,c,d);

  vec3 col;
  if(uShowPhase==1){
    float ph = rho > 0.0 && waveVisibility > 0.0 ? atan(psi.y, psi.x) : 0.0;
    // ClassicalLimit's purple density ramp and default phase/density blend.
    // Keep some density visible even where the phase palette fades to black.
    const float phaseAmount = 0.77905591; // pow(1.0 - 0.3, 0.7)
    vec3 densityColor = mix(vec3(0.26, 0.13, 0.49), vec3(0.72, 0.50, 0.99), pow(I, 0.7));
    col = mix(densityColor, phaseColor(ph), phaseAmount) * I;
  } else {
    col = palette(I, a,b,c,d) * I;
  }

  // Apply the same fade once to the complete wave in either display mode.
  fragColor = vec4(col * waveVisibility, 1.0);
}
