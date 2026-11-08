#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uPrev;
uniform sampler2D uPrevRadial;
uniform float uFade;     

in vec2 vUV;
layout(location=0) out vec4 fragColor;
layout(location=1) out vec4 radialColor;

void main(){
  fragColor = texture(uPrev, vUV) * uFade;
  radialColor = texture(uPrevRadial, vUV) * uFade;
}
