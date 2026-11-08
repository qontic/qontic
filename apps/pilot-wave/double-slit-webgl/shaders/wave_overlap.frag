#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform sampler2D uGaussian;
uniform ivec2 uSourceSize;
uniform int uFirst;
out vec4 fragColor;
void main() {
  ivec2 base=2*ivec2(gl_FragCoord.xy);
  vec4 total=vec4(0.0);
  for(int y=0;y<2;y++) for(int x=0;x<2;x++) {
    ivec2 p=base+ivec2(x,y);
    if(any(greaterThanEqual(p,uSourceSize))) continue;
    vec4 a=texelFetch(uSource,p,0);
    if(uFirst==1) {
      vec2 b=texelFetch(uGaussian,p,0).rg;
      total+=vec4(dot(a.rg,a.rg),dot(b,b),dot(a.rg,b),a.r*b.y-a.g*b.x);
    } else total+=a;
  }
  fragColor=total;
}
