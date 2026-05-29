#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uState;
uniform ivec2 uSimRes;

uniform float uVisGain;
uniform float uVisGamma;
uniform int   uShowPhase;

uniform float uBarrierXFrac;
uniform float uBarrierThickPx;
uniform float uSlitWidthPx;
uniform float uSlitSepPx;
uniform float uV0;

uniform float uBarrierOpacity;
uniform int   uPaletteId;

in vec2 vUV;
out vec4 fragColor;

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

float band(float x, float c, float halfW, float feather){
  return smoothstep(c-halfW-feather, c-halfW, x) *
         (1.0 - smoothstep(c+halfW, c+halfW+feather, x));
}

float barrierWallMask(vec2 uv){
  vec2 xPx = uv * vec2(uSimRes);
  float bx = uBarrierXFrac * float(uSimRes.x);
  float slab = band(xPx.x, bx, 0.5*uBarrierThickPx, 1.0);

  float y0 = 0.5 * float(uSimRes.y);
  float s  = 0.5 * uSlitSepPx;
  float hw = 0.5 * uSlitWidthPx;

  float slit1 = band(xPx.y, y0 - s, hw, 1.0);
  float slit2 = band(xPx.y, y0 + s, hw, 1.0);
  float slits = clamp(slit1 + slit2, 0.0, 1.0);

  return slab * (1.0 - slits);
}

void main(){
  vec2 uv = vUV;

  vec2 psi = texture(uState, uv).rg;
  float rho = dot(psi, psi);

  float I = 1.0 - exp(-uVisGain * rho);
  I = pow(clamp(I, 0.0, 1.0), uVisGamma);

  vec3 a,b,c,d;
  getPaletteParams(uPaletteId, a,b,c,d);

  vec3 col;
  if(uShowPhase==1){
    float ph = atan(psi.y, psi.x);
    float t = fract((ph + 3.14159265) / 6.2831853);
    col = palette(t, a,b,c,d) * I;
  } else {
    col = palette(I, a,b,c,d) * I;
  }

  
  float wall = barrierWallMask(uv);
  float op = clamp(uBarrierOpacity, 0.0, 1.0);
  vec3 wallCol = vec3(0.20, 0.28, 0.35);
  float wallAlpha = wall * (0.10 + 0.80 * op);
  col = mix(col, wallCol, wallAlpha);

  fragColor = vec4(col, 1.0);
}
