#version 300 es
precision highp float;

in float vAlive;
out vec4 fragColor;

uniform float uDotSigma;
uniform float uDotGain;
uniform int   uPaletteId;

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d)
{
    return a + b*cos(6.283185*(c*t+d));
}

void getPaletteParams(int id, out vec3 a, out vec3 b, out vec3 c, out vec3 d)
{
  
  if(id==0){ a=vec3(0.05,0.03,0.08); b=vec3(0.85,0.65,0.95); c=vec3(1.0); d=vec3(0.00,0.20,0.55); } 
  else if(id==1){ a=vec3(0.02,0.01,0.05); b=vec3(1.00,0.35,1.00); c=vec3(1.0); d=vec3(0.05,0.10,0.75); } 
  else if(id==2){ a=vec3(0.10,0.18,0.14); b=vec3(0.70,0.90,0.55); c=vec3(1.0); d=vec3(0.15,0.45,0.75); } 
  else if(id==3){ a=vec3(0.08,0.02,0.01); b=vec3(1.00,0.65,0.25); c=vec3(1.0); d=vec3(0.05,0.15,0.30); } 
  else if(id==4){ a=vec3(0.02,0.06,0.10); b=vec3(0.65,0.95,1.00); c=vec3(1.0); d=vec3(0.10,0.30,0.60); } 
  else if(id==5){ a=vec3(0.08,0.06,0.02); b=vec3(1.00,0.90,0.40); c=vec3(1.0); d=vec3(0.08,0.18,0.28); } 
  else if(id==6){ a=vec3(0.03,0.07,0.03); b=vec3(0.50,1.00,0.65); c=vec3(1.0); d=vec3(0.10,0.35,0.55); } 
  else if(id==7){ a=vec3(0.07,0.05,0.02); b=vec3(1.00,0.85,0.20); c=vec3(1.0); d=vec3(0.00,0.10,0.20); } 
  else if(id==8){ a=vec3(0.07,0.02,0.04); b=vec3(1.00,0.55,0.30); c=vec3(1.0); d=vec3(0.05,0.25,0.45); } 
  else { a=vec3(0.02,0.03,0.08); b=vec3(0.35,1.00,1.00); c=vec3(1.0); d=vec3(0.05,0.35,0.55); } 
}

void main(){
  if(vAlive < 0.5) discard;

  
  vec2 p = gl_PointCoord - vec2(0.5);
  float r = length(p);           

  
  if(r > 0.5) discard;

  
  float edge = smoothstep(0.5, 0.42, r);

  
  float s = max(uDotSigma, 1e-4);
  float blur = exp(-(r*r) / s);

  float a = uDotGain * blur * edge;
  a = clamp(a, 0.0, 0.85);

  vec3 A,B,C,D;
  getPaletteParams(uPaletteId, A,B,C,D);
  vec3 col = palette(0.85, A,B,C,D);

  fragColor = vec4(col, a);
}