#version 300 es
precision highp float;

out vec2 vUV;

void main() {
  
  vec2 pos = (gl_VertexID == 0) ? vec2(-1.0, -1.0)
           : (gl_VertexID == 1) ? vec2( 3.0, -1.0)
                                : vec2(-1.0,  3.0);

  vUV = 0.5 * (pos + 1.0);
  gl_Position = vec4(pos, 0.0, 1.0);
}