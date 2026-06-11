#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uDensity;
uniform float uGain;
uniform float uGamma;
uniform int uBlendMode;
uniform int uColorCodePaths;
uniform vec2 uViewCenterFrac;
uniform vec2 uViewScale;

in vec2 vUV;
out vec4 fragColor;

void main(){
  vec2 uv = uViewCenterFrac + (vUV - vec2(0.5)) / max(uViewScale, vec2(1e-6));
  if(any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) {
    fragColor = vec4(0.0);
    return;
  }

  vec4 dacc = max(texture(uDensity, uv), vec4(0.0));
  float density = max(max(dacc.r, dacc.g), dacc.b);
  float exposure = uGain * density;
  float v = 1.0 - exp(-exposure);
  v = pow(clamp(v, 0.0, 1.0), uGamma);

  vec3 col = vec3(0.0);
  if (density > 1e-5) {
    col = dacc.rgb / density;
  }

  if (uColorCodePaths == 0) {
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
