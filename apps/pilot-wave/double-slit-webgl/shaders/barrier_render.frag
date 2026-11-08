#version 300 es
precision highp float;

uniform ivec2 uSimRes;
uniform float uBarrierXFrac;
uniform float uBarrierThickPx;
uniform float uSlitWidthPx;
uniform float uSlitSepPx;
uniform float uBarrierOpacity;

in vec2 vUV;
out vec4 fragColor;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 p = vUV * vec2(uSimRes);
  float x = p.x - uBarrierXFrac * float(uSimRes.x);
  float y = p.y - 0.5 * float(uSimRes.y);
  float halfWidth = 0.5 * uBarrierThickPx;
  float halfSlit = 0.5 * uSlitWidthPx;
  float halfSeparation = 0.5 * uSlitSepPx;

  // The metal silhouette uses the actual potential's thickness and slit positions.
  float lowerSlitY = y + halfSeparation;
  float upperSlitY = y - halfSeparation;
  float nearestSlitY = abs(lowerSlitY) < abs(upperSlitY) ? lowerSlitY : upperSlitY;
  float edgeX = halfWidth - abs(x);
  float edgeY = abs(nearestSlitY) - halfSlit;
  float aa = max(0.5 * max(fwidth(p.x), fwidth(p.y)), 0.08);
  float solidY = smoothstep(-aa, aa, edgeY);
  float coverage = smoothstep(-aa, aa, edgeX) * solidY;

  // A restrained dark edge gives the metal separation from bright wave crests.
  float outsideX = max(-edgeX, 0.0);
  float shadow = exp(-outsideX * 1.4) * 0.24 * solidY;
  shadow *= 1.0 - coverage;
  if (coverage + shadow < 0.002) discard;

  float across = clamp(0.5 + x / max(2.0 * halfWidth, 0.001), 0.0, 1.0);
  float softReflection = exp(-pow((across - 0.32) / 0.38, 2.0));
  vec3 metal = mix(vec3(0.18, 0.23, 0.29), vec3(0.44, 0.52, 0.59), softReflection);
  metal += 0.025 * sin(y * 0.012 + 0.7);

  // Fine horizontal brushing and a narrow recessed line on the shaded face.
  float grain = hash21(vec2(floor(p.x * 0.25), floor(p.y * 1.6))) - 0.5;
  metal += grain * 0.024;
  float recess = 1.0 - smoothstep(0.025, 0.070, abs(across - 0.76));
  metal *= 1.0 - 0.38 * recess;

  // Tiny etched ticks stay inside the face and away from the slit lips.
  float tickDistance = abs(fract(y / 18.0 + 0.5) - 0.5) * 18.0;
  float ticks = (1.0 - smoothstep(0.12, 0.50, tickDistance)) * smoothstep(0.48, 0.62, across);
  metal *= 1.0 - 0.22 * ticks * smoothstep(1.6, 3.2, edgeY);

  float edgeDepth = min(edgeX, edgeY);
  float bevelWidth = min(1.3, halfWidth * 0.30);
  float bevel = 1.0 - smoothstep(0.0, max(bevelWidth, 0.01), edgeDepth);
  vec2 normal = edgeX < edgeY ? vec2(sign(x), 0.0) : vec2(0.0, -sign(nearestSlitY));
  float light = clamp(0.50 + 0.50 * dot(normal, normalize(vec2(-0.65, 0.76))), 0.0, 1.0);
  vec3 bevelColor = mix(vec3(0.12, 0.17, 0.22), vec3(0.85, 0.91, 0.96), light);
  metal = mix(metal, bevelColor, bevel);

  // Polished slit mouths are brighter than the long side rails.
  float slitLip = (1.0 - smoothstep(0.12, 0.72, edgeY)) * smoothstep(-aa, aa, edgeX);
  metal = mix(metal, vec3(0.84, 0.91, 0.96), slitLip * 0.72);
  float rim = 1.0 - smoothstep(0.0, 0.27, edgeDepth);
  metal = mix(metal, vec3(0.79, 0.87, 0.93), rim * (0.20 + 0.48 * light));

  float alpha = (coverage + shadow) * clamp(uBarrierOpacity, 0.0, 1.0);
  vec3 color = metal * coverage / max(coverage + shadow, 1e-5);
  fragColor = vec4(color, alpha);
}
