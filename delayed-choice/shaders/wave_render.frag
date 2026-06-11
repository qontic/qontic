#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uState;
uniform ivec2 uSimRes;

uniform float uVisGain;
uniform float uVisGamma;
uniform float uWaveTailFade;
uniform vec2  uViewCenterFrac;
uniform vec2  uViewScale;
uniform int   uShowWave;
uniform int   uShowPhase;

uniform float uSplitterXFrac;
uniform float uSplitterLengthPx;
uniform float uSplitterWidthPx;
uniform float uMirrorThicknessPx;
uniform float uAbsorbPx;
uniform float uSplitterOpacity;
uniform float uDetectorXFrac;
uniform float uDetectionXFrac;
uniform float uDetectorLengthPx;
uniform float uDetectorWidthPx;
uniform int   uDetectorActive;
uniform float uGuideMirrorXFrac;
uniform float uGuideMirrorLengthPx;
uniform float uGuideMirrorAngleTrim;
uniform float uGuideMirrorYTrimPx;
uniform float uGuideMirrorWidthPx;
uniform int   uGuideMirrorsActive;

in vec2 vUV;
out vec4 fragColor;

const float PI = 3.14159265;

vec3 colorMap(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d)
{
    return a + b*cos(6.283185*(c*t+d));
}

void cavityBounds(out vec2 innerMin, out vec2 innerMax, out vec2 centerPx){
  vec2 sim = vec2(uSimRes) - vec2(1.0);
  float sideInset = min(max(uAbsorbPx, 0.0), 0.45 * sim.x);
  innerMin = vec2(sideInset, uMirrorThicknessPx);
  innerMax = vec2(max(sideInset + 1.0, sim.x - sideInset), sim.y - uMirrorThicknessPx);
  centerPx = vec2(
    mix(innerMin.x, innerMax.x, uSplitterXFrac),
    0.5 * (innerMin.y + innerMax.y)
  );
}

float plateMask(vec2 xPx){
  vec2 innerMin, innerMax, centerPx;
  cavityBounds(innerMin, innerMax, centerPx);
  vec2 d = xPx - centerPx;

  vec2 tangent = vec2(1.0, 0.0);
  vec2 normal = vec2(0.0, 1.0);

  float along = abs(dot(d, tangent));
  float across = abs(dot(d, normal));

  float halfLength = max(0.5 * uSplitterLengthPx, 1.0);
  float halfWidth = max(0.5 * uSplitterWidthPx, 0.5);
  float feather = 2.0;

  float lenMask = 1.0 - smoothstep(halfLength, halfLength + feather, along);
  float widMask = 1.0 - smoothstep(halfWidth, halfWidth + feather, across);
  return clamp(lenMask * widMask, 0.0, 1.0);
}

float mirrorMask(vec2 xPx){
  vec2 innerMin, innerMax, centerPx;
  cavityBounds(innerMin, innerMax, centerPx);
  float feather = 2.0;

  float bottom = 1.0 - smoothstep(innerMin.y - feather, innerMin.y + feather, xPx.y);
  float top    = smoothstep(innerMax.y - feather, innerMax.y + feather, xPx.y);

  return clamp(max(bottom, top), 0.0, 1.0);
}

float detectorMask(vec2 xPx){
  vec2 innerMin, innerMax, centerPx;
  cavityBounds(innerMin, innerMax, centerPx);

  vec2 detectorCenter = vec2(
    mix(innerMin.x, innerMax.x, uDetectionXFrac),
    0.5 * (innerMin.y + innerMax.y)
  );

  vec2 d = xPx - detectorCenter;
  float halfLength = max(0.5 * uDetectorLengthPx, 1.0);
  float halfWidth = max(0.5 * uDetectorWidthPx, 0.5);
  float feather = 2.0;

  float lenMask = 1.0 - smoothstep(halfLength, halfLength + feather, abs(d.y));
  float widMask = 1.0 - smoothstep(halfWidth, halfWidth + feather, abs(d.x));
  return clamp(lenMask * widMask, 0.0, 1.0);
}

float guideMirrorMaskAt(vec2 xPx, float armSign){
  vec2 innerMin, innerMax, centerPx;
  cavityBounds(innerMin, innerMax, centerPx);

  float splitterX = centerPx.x;
  float detectorX = mix(innerMin.x, innerMax.x, uDetectorXFrac);
  float rawHitX = mix(innerMin.x, innerMax.x, uGuideMirrorXFrac);
  float hitMin = splitterX + 16.0;
  float hitMax = max(hitMin + 1.0, detectorX - 16.0);
  float hitX = clamp(rawHitX, hitMin, hitMax);

  float rawArmDy = max(hitX - splitterX + uGuideMirrorYTrimPx, 4.0);
  float anchorY = clamp(
    centerPx.y + armSign * rawArmDy,
    innerMin.y + 8.0,
    innerMax.y - 8.0
  );
  vec2 anchor = vec2(hitX, anchorY);

  float dxOut = max(detectorX - hitX, 1.0);
  float incidentAngle = armSign * 0.25 * PI;
  float targetAngle = atan(centerPx.y - anchorY, dxOut);
  float mirrorAngle = 0.5 * (incidentAngle + targetAngle) + armSign * uGuideMirrorAngleTrim;
  vec2 tangent = vec2(cos(mirrorAngle), sin(mirrorAngle));
  vec2 normal = vec2(-tangent.y, tangent.x);

  vec2 d = xPx - anchor;
  float along = dot(d, tangent);
  float across = abs(dot(d, normal));

  float halfLength = max(0.5 * uGuideMirrorLengthPx, 1.0);
  float halfWidth = max(0.5 * uGuideMirrorWidthPx, 0.5);
  float feather = 2.0;

  float lenMask = 1.0 - smoothstep(halfLength, halfLength + feather, abs(along));
  float widMask = 1.0 - smoothstep(halfWidth, halfWidth + feather, across);
  return clamp(lenMask * widMask, 0.0, 1.0);
}

float guideMirrorMask(vec2 xPx){
  if(uGuideMirrorsActive != 1) return 0.0;
  return max(guideMirrorMaskAt(xPx, 1.0), guideMirrorMaskAt(xPx, -1.0));
}

void main(){
  vec2 uv = uViewCenterFrac + (vUV - vec2(0.5)) / max(uViewScale, vec2(1e-6));
  if(any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) {
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  vec2 psi = texture(uState, uv).rg;
  float rho = dot(psi, psi);

  float I = 1.0 - exp(-uVisGain * rho);
  I = pow(clamp(I, 0.0, 1.0), uVisGamma);
  float tailFade = max(uWaveTailFade, 0.0);
  if(tailFade > 0.0) {
    float tailAmount = 1.0 - exp(-0.7 * tailFade);
    float tailKnee = mix(0.04, 0.70, tailAmount);
    float tailPower = 1.0 + 1.4 * tailFade;
    float tailMask = smoothstep(0.0, tailKnee, I);
    I *= pow(tailMask, tailPower);
  }

  vec3 a = uShowPhase == 1 ? vec3(0.10,0.02,0.12) : vec3(0.22,0.32,0.28);
  vec3 b = uShowPhase == 1 ? vec3(0.75,0.15,0.90) : vec3(0.40,0.45,0.35);
  vec3 c = vec3(1.0);
  vec3 d = uShowPhase == 1 ? vec3(0.00,0.10,0.30) : vec3(0.15,0.55,0.75);

  vec3 col;
  if(uShowPhase==1){
    float ph = atan(psi.y, psi.x);
    float t = fract((ph + 3.14159265) / 6.2831853);
    col = colorMap(t, a,b,c,d) * I;
  } else {
    col = colorMap(I, a,b,c,d) * (0.15 + 0.85*I);
  }

  if(uShowWave == 0) {
    col = vec3(0.0);
  }

  vec2 xPx = uv * vec2(uSimRes);
  float splitter = plateMask(xPx);
  float mirrors = mirrorMask(xPx);
  float guideMirrors = guideMirrorMask(xPx);
  float detector = (uDetectorActive == 1) ? detectorMask(xPx) : 0.0;

  if(uDetectorActive == 1) {
    vec2 innerMin, innerMax, splitterCenter;
    cavityBounds(innerMin, innerMax, splitterCenter);
    float detectorX = mix(innerMin.x, innerMax.x, uDetectionXFrac);
    if(xPx.x > detectorX) {
      col = vec3(0.0);
    }
  }

  vec3 splitterCol = vec3(0.30, 0.78, 0.95);
  vec3 mirrorCol   = vec3(0.88, 0.93, 0.98);
  vec3 guideMirrorCol = vec3(1.00, 0.12, 0.10);
  vec3 detectorCol = vec3(0.65, 0.68, 0.72);

  col = mix(col, mirrorCol, 0.20 * mirrors);
  col = mix(col, guideMirrorCol, 0.65 * guideMirrors);
  col = mix(col, splitterCol, clamp(uSplitterOpacity, 0.0, 1.0) * splitter);
  col = mix(col, detectorCol, 0.35 * detector);

  fragColor = vec4(col, 1.0);
}
