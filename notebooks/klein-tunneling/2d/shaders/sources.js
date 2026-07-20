export const FULLSCREEN_VERT = `#version 300 es
precision highp float;
out vec2 vUv;

void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const DENSITY_FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uDensity;
uniform vec2 uBoxSize;
uniform vec2 uBarrier;
uniform float uDensityGain;
uniform float uDensityGamma;
uniform float uPotentialStrength;
uniform vec3 uBarrierColor;

vec3 densityPalette(float t) {
  vec3 base = vec3(0.22, 0.32, 0.28);
  vec3 amp = vec3(0.40, 0.45, 0.35);
  vec3 phase = vec3(0.15, 0.55, 0.75);
  return max(base + amp * cos(6.28318530718 * (t + phase)), vec3(0.0));
}

void main() {
  vec2 uv = clamp(vUv, vec2(0.0), vec2(1.0));
  float rho = max(texture(uDensity, uv).r, 0.0);
  float intensity = 1.0 - exp(-uDensityGain * rho);
  intensity = pow(clamp(intensity, 0.0, 1.0), max(uDensityGamma, 0.01));

  vec3 col = densityPalette(intensity) * intensity;

  float x = uv.x * uBoxSize.x;
  float insideWall = step(uBarrier.x, x) * step(x, uBarrier.y);
  float strength = clamp(uPotentialStrength, 0.0, 1.0);
  vec3 wallCol = max(uBarrierColor, vec3(0.0));
  col = mix(col, wallCol, insideWall * (0.10 + 0.24 * strength));

  float edgeDist = min(abs(x - uBarrier.x), abs(x - uBarrier.y));
  float edgeLine = 1.0 - smoothstep(0.0, 0.024, edgeDist);
  col += wallCol * edgeLine * (0.24 + 0.42 * strength);

  float edgeUv = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
  float border = 1.0 - smoothstep(0.0, 0.0024, edgeUv);
  col = mix(col, vec3(0.36, 0.62, 0.95), border * 0.42);

  fragColor = vec4(col, 1.0);
}`;

export const TRAIL_FADE_FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTrail;
uniform float uFade;

void main() {
  fragColor = texture(uTrail, clamp(vUv, vec2(0.0), vec2(1.0))) * uFade;
}`;

export const TRAIL_RENDER_FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTrail;
uniform float uGain;
uniform float uGamma;

void main() {
  vec4 trail = texture(uTrail, clamp(vUv, vec2(0.0), vec2(1.0)));
  float density = max(max(trail.r, trail.g), trail.b);
  float exposure = uGain * density;
  float v = 1.0 - exp(-exposure);
  v = pow(clamp(v, 0.0, 1.0), max(uGamma, 0.01));

  vec3 col = vec3(1.0, 1.0, 0.0);
  float crowded = smoothstep(1.0, 3.0, exposure);
  float oversaturated = smoothstep(3.0, 5.0, exposure);
  col = mix(col, vec3(1.0, 0.55, 0.08), 0.45 * crowded);
  col = mix(col, vec3(1.0, 0.35, 0.62), 0.30 * oversaturated);

  fragColor = vec4(col * v, 1.0);
}`;

export const PARTICLE_VERT = `#version 300 es
precision highp float;

layout(location=0) in vec4 aState;

uniform vec2 uBoxSize;
uniform float uPointSize;
uniform int uNumParticles;
uniform float uTrailWidth;

out float vAlive;
out float vParticleId;

void main() {
  vAlive = aState.z;
  vParticleId = float(gl_VertexID) / float(max(uNumParticles, 1));
  vec2 uv = aState.xy / uBoxSize;
  gl_Position = vec4(uv * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = uTrailWidth > 0.0 ? uTrailWidth : uPointSize;
}`;

export const PARTICLE_FRAG = `#version 300 es
precision highp float;

in float vAlive;
out vec4 fragColor;

uniform float uDotSigma;
uniform float uDotGain;

vec3 particleColor() {
  vec3 a = vec3(0.08, 0.06, 0.02);
  vec3 b = vec3(1.00, 0.90, 0.40);
  vec3 d = vec3(0.08, 0.18, 0.28);
  return max(a + b * cos(6.283185 * (0.85 + d)), vec3(0.0));
}

void main() {
  if(vAlive < 0.5) discard;

  vec2 p = gl_PointCoord * 2.0 - vec2(1.0);
  float r2 = dot(p, p);
  if(r2 > 1.0) discard;

  vec3 particleCol = particleColor();
  float softness = clamp(uDotSigma, 0.08, 0.65);
  float halo = exp(-r2 / softness) * (1.0 - smoothstep(0.72, 1.0, r2));
  float body = 1.0 - smoothstep(0.16, 0.72, r2);
  float core = 1.0 - smoothstep(0.0, 0.13, r2);

  vec3 col = mix(particleCol * 0.72, particleCol * 1.18, body);
  col = mix(col, vec3(1.0, 0.98, 0.88), core * 0.92);

  float a = uDotGain * (11.72 * halo + 0.78 * body + 0.28 * core);
  a = clamp(a, 0.0, 0.92);
  fragColor = vec4(col, a);
}`;

export const PARTICLE_STAMP_FRAG = `#version 300 es
precision highp float;

in float vAlive;
in float vParticleId;
out vec4 fragColor;

uniform float uDotSigma;
uniform float uDotGain;
uniform float uStampGain;

void main() {
  if(vAlive < 0.5) discard;

  vec2 p = gl_PointCoord - vec2(0.5);
  float r = length(p);
  if(r > 0.5) discard;

  float edge = smoothstep(0.5, 0.42, r);
  float s = max(uDotSigma, 1e-4);
  float blur = exp(-(r * r) / s);
  float a = clamp(uDotGain * uStampGain * blur * edge, 0.0, 1.0);

  fragColor = vec4(1.0, 1.0, 0.0, a);
}`;
