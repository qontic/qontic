#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uPrev;
uniform float uFade;     

in vec2 vUV;
out vec4 fragColor;

void main(){
  fragColor = texture(uPrev, vUV) * uFade;
}