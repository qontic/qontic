#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uDensity;
uniform float uGain;
uniform float uGamma;
uniform int uBlendMode;

in vec2 vUV;
out vec4 fragColor;

void main(){
  vec4 dacc = max(texture(uDensity, vUV), vec4(0.0));

  float density = max(max(dacc.r, dacc.g), dacc.b);
  float exposure = uGain * density;
  float v = 1.0 - exp(-exposure);
  v = pow(clamp(v, 0.0, 1.0), uGamma);

  vec3 col = vec3(1.0, 1.0, 0.0);
  float crowded = smoothstep(1., 3.0, exposure);
  float oversaturated = smoothstep(3.0, 5.0, exposure);
  col = mix(col, vec3(1.0, 0.55, 0.08), 0.45 * crowded);
  col = mix(col, vec3(1.0, 0.35, 0.62), 0.30 * oversaturated);

  if (uBlendMode == 0) {
    fragColor = vec4(col, v);
  } else if (uBlendMode == 1) {
    fragColor = vec4(col * v, 1.0);
  } else if (uBlendMode == 2) {
    fragColor = vec4(col * v, 1.0);
  } else {
    fragColor = vec4(col, v);
  }
}
