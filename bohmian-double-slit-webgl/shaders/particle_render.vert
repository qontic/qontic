#version 300 es
precision highp float;

layout(location=0) in vec4 aState; 
uniform ivec2 uSimRes;
uniform float uPointSize;
uniform int uNumParticles;
uniform float uTrailWidth;
out float vAlive;
out float vParticleId;

void main(){
  vAlive = aState.z;
  vParticleId = float(gl_VertexID) / float(uNumParticles);
  vec2 uv  = aState.xy / vec2(uSimRes);
  vec2 ndc = uv * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  
  float size = uPointSize;
  if(uTrailWidth > 0.0) size = uTrailWidth;
  gl_PointSize = size;
}