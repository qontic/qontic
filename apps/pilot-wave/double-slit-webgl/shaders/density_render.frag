#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uDensity;
uniform float uGain;
uniform float uGamma;
uniform int uBlendMode;
uniform int uColorCodeMask;

in vec2 vUV;
out vec4 fragColor;

vec3 pathColor(int group) {
  if (group == 1) return vec3(0.15, 0.95, 1.00);
  if (group == 2) return vec3(1.00, 0.28, 0.18);
  if (group == 3) return vec3(0.74, 0.32, 1.00);
  return vec3(1.0, 1.0, 0.0);
}

void main(){
  // The selected texture holds either four starting quadrants or four radial bands.
  vec4 dacc = max(texture(uDensity, vUV), vec4(0.0));
  float density = dot(dacc, vec4(1.0));
  float exposure = uGain * density;
  float v = 1.0 - exp(-exposure);
  v = pow(clamp(v, 0.0, 1.0), uGamma);

  vec3 col = vec3(0.0);
  if (density > 1e-5) {
    for (int quadrant = 0; quadrant < 4; quadrant++) {
      col += dacc[quadrant] * pathColor(uColorCodeMask == 4 ? quadrant : (quadrant & uColorCodeMask));
    }
    col /= density;
  }

  if (uColorCodeMask == 0) {
    col = vec3(1.0, 0.92, 0.08);
  } else {
    float crowded = smoothstep(1.0, 3.0, exposure);
    float oversaturated = smoothstep(3.0, 5.0, exposure);
    vec3 overlapHue = mix(
      vec3(1.0, 0.55, 0.08),
      vec3(1.0, 0.35, 0.62),
      oversaturated
    );
    col = mix(col, overlapHue, 0.18 * crowded + 0.12 * oversaturated);
  }

  if (uBlendMode == 0) {
    fragColor = vec4(col, v);
  } else {
    fragColor = vec4(col * v, 1.0);
  }
}
