#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uDensity;  
uniform float uGain;
uniform float uGamma;
uniform int   uPaletteId;
uniform int   uBlendMode;  

in vec2 vUV;
out vec4 fragColor;

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d)
{
    return a + b*cos(6.283185*(c*t+d));
}

void getPaletteParams(int id, out vec3 a, out vec3 b, out vec3 c, out vec3 d)
{
  
  

  if(id==0){ 
    a=vec3(0.04,0.05,0.08); b=vec3(0.60,0.55,0.75); c=vec3(1.0); d=vec3(0.10,0.25,0.50);
  } else if(id==1){ 
    a=vec3(0.05,0.02,0.08); b=vec3(0.95,0.45,0.95); c=vec3(1.0); d=vec3(0.05,0.20,0.55);
  } else if(id==2){ 
    a=vec3(0.10,0.20,0.18); b=vec3(0.55,0.65,0.45); c=vec3(1.0); d=vec3(0.15,0.45,0.70);
  } else if(id==3){ 
    a=vec3(0.08,0.02,0.01); b=vec3(0.95,0.55,0.25); c=vec3(1.0); d=vec3(0.05,0.15,0.30);
  } else { 
    a=vec3(0.02,0.06,0.10); b=vec3(0.50,0.85,1.00); c=vec3(1.0); d=vec3(0.10,0.30,0.60);
  }
}

void main(){
  vec4 dacc = max(texture(uDensity, vUV), vec4(0.0));

  
  float v = max(max(dacc.r, dacc.g), dacc.b);
  v = 1.0 - exp(-uGain * v);
  v = pow(clamp(v, 0.0, 1.0), uGamma);

  vec3 a,b,c,d;
  getPaletteParams(uPaletteId, a,b,c,d);

  
  
  vec3 col = vec3(1.0, 1.0, 0.0);

  if (uBlendMode == 0) {
    
    fragColor = vec4(col, v);
  } else if (uBlendMode == 1) {
    
    fragColor = vec4(col * v, 1.0 - v);
  } else if (uBlendMode == 2) {
    
    fragColor = vec4(col * v, 1.0);
  } else {
    
    fragColor = vec4(col, v);
  }
}