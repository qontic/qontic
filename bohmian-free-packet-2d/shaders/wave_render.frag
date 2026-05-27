#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uState;
uniform ivec2 uSimRes;

uniform float uVisGain;
uniform float uVisGamma;
uniform float uShowPhase;

uniform int   uPaletteId;

in vec2 vUV;
out vec4 fragColor;

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d)
{
    return a + b*cos(6.283185*(c*t+d));
}

void getPaletteParams(int id, out vec3 a, out vec3 b, out vec3 c, out vec3 d)
{
  
  if(id==0){
    a=vec3(0.08,0.07,0.12); b=vec3(0.55,0.50,0.70); c=vec3(1.0); d=vec3(0.00,0.15,0.35);
  }
  
  else if(id==1){
    a=vec3(0.06,0.02,0.10); b=vec3(0.85,0.35,0.95); c=vec3(1.0); d=vec3(0.00,0.10,0.25);
  }
  
  else if(id==2){
    a=vec3(0.22,0.32,0.28); b=vec3(0.40,0.45,0.35); c=vec3(1.0); d=vec3(0.15,0.55,0.75);
  }
  
  else if(id==3){
    a=vec3(0.10,0.02,0.02); b=vec3(0.90,0.45,0.20); c=vec3(1.0); d=vec3(0.00,0.08,0.20);
  }
  
  else if(id==4){
    a=vec3(0.02,0.05,0.08); b=vec3(0.40,0.70,0.85); c=vec3(1.0); d=vec3(0.10,0.30,0.55);
  }
  
  else if(id==5){
    a=vec3(0.10,0.02,0.12); b=vec3(0.75,0.15,0.90); c=vec3(1.0); d=vec3(0.00,0.10,0.30);
  }
  
  else if(id==6){
    a=vec3(0.05,0.15,0.15); b=vec3(0.20,0.80,0.60); c=vec3(1.0); d=vec3(0.10,0.40,0.20);
  }
  
  else if(id==7){
    a=vec3(0.15,0.05,0.00); b=vec3(0.95,0.50,0.10); c=vec3(1.0); d=vec3(0.00,0.05,0.15);
  }
  
  else if(id==8){
    a=vec3(0.20,0.15,0.10); b=vec3(0.60,0.50,0.30); c=vec3(1.0); d=vec3(0.10,0.30,0.25);
  }
  
  else if(id==9){
    a=vec3(0.02,0.02,0.02); b=vec3(0.00,0.80,0.80); c=vec3(1.0); d=vec3(0.90,0.10,0.90);
  }
  
  else {
    a=vec3(0.75,0.70,0.80); b=vec3(0.60,0.85,0.70); c=vec3(1.0); d=vec3(0.10,0.20,0.30);
  }
}

void main(){
  vec2 uv = vUV;

  vec2 psi = texture(uState, uv).rg;
  float rho = dot(psi, psi);

  float I = 1.0 - exp(-uVisGain * rho);
  I = pow(clamp(I, 0.0, 1.0), uVisGamma);

  vec3 a,b,c,d;
  int useId = uPaletteId;
  
  if(uPaletteId == 5 && uShowPhase < 0.5) {
    useId = 2;
  }
  getPaletteParams(useId, a,b,c,d);

  vec3 col;
  if(uShowPhase > 0.5){
    float ph = atan(psi.y, psi.x);
    float t = fract((ph + 3.14159265) / 6.2831853);
    col = palette(t, a,b,c,d) * I;
  } else {
    col = palette(I, a,b,c,d) * I;
  }

  fragColor = vec4(col, 1.0);
}
