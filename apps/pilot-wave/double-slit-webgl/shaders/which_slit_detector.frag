#version 300 es
precision highp float;
uniform vec2 uStageSize;
uniform float uDetectorX;
uniform float uSlitSeparation;
uniform float uSlitWidth;
uniform int uDetectedSlit;
uniform float uProgress;
in vec2 vUV;
out vec4 fragColor;
float segment(vec2 p,vec2 a,vec2 b){vec2 d=b-a;return length(p-a-d*clamp(dot(p-a,d)/dot(d,d),0.0,1.0));}
void main(){
  vec2 p=vUV*uStageSize;
  int slit=p.y>=uStageSize.y*0.5?1:-1;
  vec2 q=p-vec2(uDetectorX,uStageSize.y*0.5+float(slit)*uSlitSeparation*0.5);
  float h=max(4.0,uSlitWidth*0.5);
  float d=min(segment(q,vec2(0,-h),vec2(0,h)),min(segment(q,vec2(-3,-h),vec2(0,-h)),segment(q,vec2(-3,h),vec2(0,h))));
  bool selected=slit==uDetectedSlit;
  float aa=max(fwidth(p.x),0.2);
  float line=1.0-smoothstep(0.2,0.2+aa,d);
  float glow=selected?exp(-d*d/5.0)*(0.13+0.2*sin(3.14159265*uProgress)):0.0;
  float alpha=line*(selected?0.92:0.36)+glow;
  if(alpha<0.002)discard;
  fragColor=vec4(selected?vec3(1.0,0.87,0.59):vec3(0.57,0.77,0.84),alpha);
}
