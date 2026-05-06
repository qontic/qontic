/**
 * bm2d_gpu.jsx — 2D Split-Operator Quantum Measurement, raw WebGL2
 * Physics: matlab2D_measurement_transmitted_charge.m
 *
 * All compute runs with raw WebGL2 draw calls (no Three.js scene graph).
 * React is used only for the sidebar overlay.
 *
 * Split-operator per step (Dt = 0.04 fs):
 *   V-half → W-half → FFT2D → T-full → IFFT2D → W-half → V-half
 */

import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

// ── Physical constants ────────────────────────────────────────────────────────
const HB = 1.054571817e-34;
const M  = 9.10938356e-31;
const QC = 1.602176634e-19;

// ── Grid ──────────────────────────────────────────────────────────────────────
const N     = 128;
const LOG2N = Math.log2(N) | 0;  // 7
const LX    = 100e-9, LY = 100e-9;
const DX    = LX / (N - 1), DY = LY / (N - 1);
const DT    = 0.04e-15;

// ── Physics ───────────────────────────────────────────────────────────────────
const LAMBDA2   = 1e5;
const LAMBDA_FD = LAMBDA2 * DT / (4.0 * DY);

const _QINI0      = Math.round(155 * N / 256);
const _QFIN0      = Math.round(219 * N / 256);
const _QCTR       = Math.round((_QINI0 + _QFIN0) / 2);
const _QHALF      = Math.round((_QFIN0 - _QINI0) / 3);  // half of 2/3 original width
const QINI        = _QCTR - _QHALF;
const QFIN        = _QCTR + _QHALF;
const BARRIER_IX0 = Math.floor(N / 2);
const V0_DEFAULT  = 0.030;  // eV
const WIDTH_DEFAULT = 1;    // pixels

// ── Initial wave-packet ───────────────────────────────────────────────────────
const VX = 0.8e5;
const SX = 6e-9, SY = 6e-9;
const XC = 30e-9, YC = (2 / 3) * LY;

// ── Bohmian trajectories ──────────────────────────────────────────────────────
const NP_MAX = 120;
const NP     = 60;  // default
const HIST = 200;

// ── Simulation pacing ─────────────────────────────────────────────────────────
const SKIP_BASE    = 32;
const NT_MAX       = 20000;
const READBACK_EVERY = 4;

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

// ─────────────────────────────────────────────────────────────────────────────
// JS data builders
// ─────────────────────────────────────────────────────────────────────────────
function buildVpropData(barrierOn, v0eV=V0_DEFAULT, widthPx=WIDTH_DEFAULT) {
  const d = new Float32Array(N * N * 4);
  const bx1 = BARRIER_IX0 + widthPx - 1;
  const v0J = v0eV * QC;
  for (let iy = 0; iy < N; iy++)
    for (let ix = 0; ix < N; ix++) {
      const v  = barrierOn && ix >= BARRIER_IX0 && ix <= bx1 ? v0J : 0;
      const ph = -v * DT / (2 * HB);
      const k  = (ix + iy * N) * 4;
      d[k] = Math.cos(ph); d[k+1] = Math.sin(ph); d[k+3] = 1;
    }
  return d;
}

function buildTpropData() {
  const d = new Float32Array(N * N * 4);
  for (let iy = 0; iy < N; iy++) {
    const ky = (iy < N/2 ? iy : iy - N) * 2 * Math.PI / LY;
    for (let ix = 0; ix < N; ix++) {
      const kx = (ix < N/2 ? ix : ix - N) * 2 * Math.PI / LX;
      const ph = -(HB * (kx*kx + ky*ky) / (2*M)) * DT;
      const k  = (ix + iy * N) * 4;
      d[k] = Math.cos(ph); d[k+1] = Math.sin(ph); d[k+3] = 1;
    }
  }
  return d;
}

function buildQmaskData() {
  const d = new Float32Array(N * N * 4);
  for (let iy = 0; iy < N; iy++)
    for (let ix = 0; ix < N; ix++) {
      const k = (ix + iy * N) * 4;
      d[k] = (ix >= QINI && ix <= QFIN) ? 1.0 : 0.0; d[k+3] = 1;
    }
  return d;
}

function buildInitialPsi(sx=SX, sy=SY) {
  const d = new Float32Array(N * N * 4);
  let norm2 = 0;
  for (let iy = 0; iy < N; iy++) {
    const dy = iy * DY - YC;
    const gy = Math.exp(-dy*dy / (4*sy*sy));
    for (let ix = 0; ix < N; ix++) {
      const dx = ix * DX - XC;
      const gx = Math.exp(-dx*dx / (4*sx*sx));
      const ph = M * VX * dx / HB;
      const re = gx * gy * Math.cos(ph);
      const im = gx * gy * Math.sin(ph);
      const k  = (ix + iy * N) * 4;
      d[k] = re; d[k+1] = im;
      norm2 += re*re + im*im;
    }
  }
  const inv = 1 / Math.sqrt(norm2 * DX * DY);
  for (let k = 0; k < N*N; k++) { d[k*4] *= inv; d[k*4+1] *= inv; }
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// GLSL shaders (WebGL2 / GLSL ES 3.00)
// ─────────────────────────────────────────────────────────────────────────────

const VS_TRI = `#version 300 es
void main() {
  vec2 v[3]; v[0]=vec2(-1,-1); v[1]=vec2(3,-1); v[2]=vec2(-1,3);
  gl_Position = vec4(v[gl_VertexID], 0.0, 1.0);
}`;

const FS_VPROP = `#version 300 es
precision highp float;
uniform sampler2D uPsi, uVprop;
out vec4 o;
void main() {
  ivec2 p  = ivec2(gl_FragCoord.xy);
  vec2 psi = texelFetch(uPsi,   p,0).rg;
  vec2 pr  = texelFetch(uVprop, p,0).rg;
  o = vec4(psi.r*pr.r - psi.g*pr.g, psi.r*pr.g + psi.g*pr.r, 0,1);
}`;

const FS_WSTEP = `#version 300 es
precision highp float;
uniform sampler2D uPsi, uQmask;
uniform float uLambda;
out vec4 o;
void main() {
  ivec2 p  = ivec2(gl_FragCoord.xy);
  vec2 psi = texelFetch(uPsi, p,0).rg;
  float q  = texelFetch(uQmask, p,0).r;
  if (q > 0.5 && p.y >= 1 && p.y <= ${N-2}) {
    vec2 pp = texelFetch(uPsi, ivec2(p.x, p.y+1),0).rg;
    vec2 pm = texelFetch(uPsi, ivec2(p.x, p.y-1),0).rg;
    psi += uLambda * (pp - pm);
  }
  o = vec4(psi, 0,1);
}`;

const FS_TPROP = `#version 300 es
precision highp float;
uniform sampler2D uPsi, uTprop;
out vec4 o;
void main() {
  ivec2 p  = ivec2(gl_FragCoord.xy);
  vec2 psi = texelFetch(uPsi,   p,0).rg;
  vec2 pr  = texelFetch(uTprop, p,0).rg;
  o = vec4(psi.r*pr.r - psi.g*pr.g, psi.r*pr.g + psi.g*pr.r, 0,1);
}`;

const FS_FFT = `#version 300 es
precision highp float;
uniform sampler2D uPsi;
uniform int  uPassIndex;
uniform bool uHorizontal, uInverse, uFinalScale;
const float PI = 3.141592653589793;
out vec4 o;
vec2 cmul(vec2 a, vec2 b){ return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x); }
void main() {
  float pos   = uHorizontal ? gl_FragCoord.x-0.5 : gl_FragCoord.y-0.5;
  float other = uHorizontal ? gl_FragCoord.y-0.5 : gl_FragCoord.x-0.5;
  float half_s = pow(2.0, float(uPassIndex));
  float span   = 2.0*half_s;
  float pis    = mod(pos, span);
  float group  = floor(pos/span);
  float j      = mod(pis, half_s);
  float bot    = floor(pis/half_s);
  float s0 = group*half_s + j;
  float s1 = s0 + ${N}.0*0.5;
  ivec2 u0 = uHorizontal ? ivec2(int(s0),int(other)) : ivec2(int(other),int(s0));
  ivec2 u1 = uHorizontal ? ivec2(int(s1),int(other)) : ivec2(int(other),int(s1));
  vec2 a = texelFetch(uPsi, u0,0).rg;
  vec2 b = texelFetch(uPsi, u1,0).rg;
  float ang = (uInverse?1.0:-1.0)*2.0*PI*j/span;
  vec2 tw = vec2(cos(ang),sin(ang));
  vec2 res = (bot<0.5) ? (a+cmul(tw,b)) : (a-cmul(tw,b));
  if (uFinalScale) res /= ${N}.0;
  o = vec4(res, 0,1);
}`;

// Color scale: normalize so initial peak = 1, then sqrt to compress dynamic range
// so the wave stays visible as it spreads (linear scale goes black after 2x spread)
const RHO_SCALE = (3.0 * 2.0 * Math.PI * SX * SY).toExponential(5);

const FS_DISPLAY = `#version 300 es
precision highp float;
uniform sampler2D uPsi;
uniform vec2 uRes;
uniform bool uShowBarrier, uShowQ;
uniform float uBarX0, uBarX1, uQX0, uQX1;
uniform float uBrightness;
out vec4 o;
vec3 inferno(float t){
  t=clamp(t,0.,1.);
  vec3 c0=vec3(.000,.000,.016),c1=vec3(.227,.031,.384),
       c2=vec3(.698,.165,.322),c3=vec3(.937,.490,.129),c4=vec3(.988,1.,.643);
  if(t<.25)return mix(c0,c1,t*4.);
  if(t<.50)return mix(c1,c2,(t-.25)*4.);
  if(t<.75)return mix(c2,c3,(t-.50)*4.);
  return mix(c3,c4,(t-.75)*4.);
}
void main(){
  vec2 uv = vec2(gl_FragCoord.x/uRes.x, 1.0-gl_FragCoord.y/uRes.y);
  vec2 psi = texture(uPsi, uv).rg;
  float rho = psi.r*psi.r + psi.g*psi.g;
  float t = sqrt(clamp(rho * ${RHO_SCALE} * uBrightness, 0.0, 1.0));
  vec3 col = inferno(t);
  float px = uv.x * ${N}.0;
  if(uShowBarrier && px >= uBarX0-0.5 && px <= uBarX1+0.5)
    col=mix(col,vec3(1.,.87,.1),.8);
  if(uShowQ&&(abs(px-uQX0)<0.75||abs(px-uQX1)<0.75))
    col=mix(col,vec3(1.,.3,.3),.7);
  o=vec4(col,1.);
}`;

// ─────────────────────────────────────────────────────────────────────────────
// WebGL2 engine
// ─────────────────────────────────────────────────────────────────────────────
function buildGPUEngine(gl) {
  if (!gl.getExtension('EXT_color_buffer_float'))
    throw new Error('EXT_color_buffer_float not supported');

  function mkShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(s) + '\n' + src.slice(0,400));
    return s;
  }
  function mkProg(fs) {
    const p = gl.createProgram();
    gl.attachShader(p, mkShader(gl.VERTEX_SHADER, VS_TRI));
    gl.attachShader(p, mkShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  const pV = mkProg(FS_VPROP), pW = mkProg(FS_WSTEP), pT = mkProg(FS_TPROP);
  const pF = mkProg(FS_FFT),   pD = mkProg(FS_DISPLAY);

  // Cache all uniform locations upfront
  const u = {
    v: { psi: gl.getUniformLocation(pV,'uPsi'), vp: gl.getUniformLocation(pV,'uVprop') },
    w: { psi: gl.getUniformLocation(pW,'uPsi'), qm: gl.getUniformLocation(pW,'uQmask'),
         lam: gl.getUniformLocation(pW,'uLambda') },
    t: { psi: gl.getUniformLocation(pT,'uPsi'), tp: gl.getUniformLocation(pT,'uTprop') },
    f: { psi: gl.getUniformLocation(pF,'uPsi'), pi: gl.getUniformLocation(pF,'uPassIndex'),
         hz: gl.getUniformLocation(pF,'uHorizontal'), iv: gl.getUniformLocation(pF,'uInverse'),
         fs: gl.getUniformLocation(pF,'uFinalScale') },
    d: { psi: gl.getUniformLocation(pD,'uPsi'), res: gl.getUniformLocation(pD,'uRes'),
         sb: gl.getUniformLocation(pD,'uShowBarrier'), sq: gl.getUniformLocation(pD,'uShowQ'),
         bx0: gl.getUniformLocation(pD,'uBarX0'), bx1: gl.getUniformLocation(pD,'uBarX1'),
         qx0: gl.getUniformLocation(pD,'uQX0'),  qx1: gl.getUniformLocation(pD,'uQX1'),
         br: gl.getUniformLocation(pD,'uBrightness') },
  };

  // Bind texture units once
  [pV,pW,pT,pF,pD].forEach(p => {
    gl.useProgram(p); gl.uniform1i(gl.getUniformLocation(p,'uPsi'), 0);
  });
  gl.useProgram(pV); gl.uniform1i(u.v.vp, 1);
  gl.useProgram(pW); gl.uniform1i(u.w.qm, 1); gl.uniform1f(u.w.lam, LAMBDA_FD);
  gl.useProgram(pT); gl.uniform1i(u.t.tp, 1);

  function mkTarget() {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, N, N);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return {tex, fbo};
  }

  function mkStaticTex(data) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, N, N);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, N,N, gl.RGBA, gl.FLOAT, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  }

  function upload(tgt, data) {
    gl.bindTexture(gl.TEXTURE_2D, tgt.tex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, N,N, gl.RGBA, gl.FLOAT, data);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  const tA = mkTarget(), tB = mkTarget();
  let pA = tA, pB = tB;
  let vpTex = mkStaticTex(buildVpropData(true));
  const tpTex = mkStaticTex(buildTpropData());
  const qmTex = mkStaticTex(buildQmaskData());
  upload(pA, buildInitialPsi());

  const rbuf = new Float32Array(N*N*4);

  function bind(unit, tex) {
    gl.activeTexture(gl.TEXTURE0+unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
  }
  function draw(fbo, w, h) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo||null);
    gl.viewport(0,0, w||N, h||N);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function vStep() {
    gl.useProgram(pV); bind(0,pA.tex); bind(1,vpTex);
    draw(pB.fbo); [pA,pB]=[pB,pA];
  }
  function wStep() {
    gl.useProgram(pW); bind(0,pA.tex); bind(1,qmTex);
    draw(pB.fbo); [pA,pB]=[pB,pA];
  }
  function tStep() {
    gl.useProgram(pT); bind(0,pA.tex); bind(1,tpTex);
    draw(pB.fbo); [pA,pB]=[pB,pA];
  }
  function fftPass(pi, hz, iv, fs) {
    gl.useProgram(pF); bind(0,pA.tex);
    gl.uniform1i(u.f.pi,pi); gl.uniform1i(u.f.hz,hz?1:0);
    gl.uniform1i(u.f.iv,iv?1:0); gl.uniform1i(u.f.fs,fs?1:0);
    draw(pB.fbo); [pA,pB]=[pB,pA];
  }
  function fft2d(inv) {
    for (let p=0;p<LOG2N;p++) fftPass(p, true,  inv, inv && p===LOG2N-1);
    for (let p=0;p<LOG2N;p++) fftPass(p, false, inv, inv && p===LOG2N-1);
  }

  function splitStep(det) {
    vStep(); if(det) wStep();
    fft2d(false); tStep(); fft2d(true);
    if(det) wStep(); vStep();
  }

  function display(W, H, sb, sq, barX0, barX1, qX0, qX1, brightness=1.0) {
    gl.useProgram(pD); bind(0, pA.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform2f(u.d.res, W,H);
    gl.uniform1i(u.d.sb, sb?1:0); gl.uniform1i(u.d.sq, sq?1:0);
    gl.uniform1f(u.d.bx0, barX0); gl.uniform1f(u.d.bx1, barX1);
    gl.uniform1f(u.d.qx0, qX0);   gl.uniform1f(u.d.qx1, qX1);
    gl.uniform1f(u.d.br, brightness);
    draw(null, W, H);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }

  function readback() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, pA.fbo);
    gl.readPixels(0,0,N,N, gl.RGBA, gl.FLOAT, rbuf);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return rbuf;
  }

  function reset(barrierOn, v0eV=V0_DEFAULT, widthPx=WIDTH_DEFAULT, sx=SX) {
    upload(pA, buildInitialPsi(sx, sx));
    gl.deleteTexture(vpTex);
    vpTex = mkStaticTex(buildVpropData(barrierOn, v0eV, widthPx));
  }

  return { splitStep, display, readback, reset };
}

// ─────────────────────────────────────────────────────────────────────────────
// React App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const mountRef = useRef(null);
  const cmdRef   = useRef({
    running:true, detectorOn:true, barrierOn:true,
    showTraj:true, speed:2.0, barrierChanged:false,
    barrierV0eV:V0_DEFAULT, barrierWidthPx:WIDTH_DEFAULT, np:NP,
    brightness:1.0, waveSize:6.0
  });

  const [running,       setRunning]       = useState(true);
  const [detectorOn,    setDetectorOn]    = useState(true);
  const [barrierOn,     setBarrierOn]     = useState(true);
  const [showTraj,      setShowTraj]      = useState(true);
  const [speed,         setSpeed]         = useState(2.0);
  const [barrierV0eV,   setBarrierV0eV]   = useState(V0_DEFAULT);
  const [barrierWidthPx,setBarrierWidthPx]= useState(WIDTH_DEFAULT);
  const [np,            setNp]            = useState(NP);
  const [brightness,    setBrightness]    = useState(1.0);
  const [waveSize,      setWaveSize]      = useState(6.0);
  const [timeFs,        setTimeFs]        = useState(0);
  const [norm,          setNorm]          = useState(1);
  const [activeTab,     setActiveTab]     = useState('canvas');
  const [panelFontSize, setPanelFontSize] = useState(13);

  useEffect(() => { cmdRef.current.running    = running;    }, [running]);
  useEffect(() => { cmdRef.current.detectorOn = detectorOn; }, [detectorOn]);
  useEffect(() => { cmdRef.current.showTraj   = showTraj;   }, [showTraj]);
  useEffect(() => { cmdRef.current.speed      = speed;      }, [speed]);
  useEffect(() => {
    cmdRef.current.barrierOn      = barrierOn;
    cmdRef.current.barrierChanged = true;
  }, [barrierOn]);
  useEffect(() => {
    cmdRef.current.barrierV0eV    = barrierV0eV;
    cmdRef.current.barrierChanged = true;
  }, [barrierV0eV]);
  useEffect(() => {
    cmdRef.current.barrierWidthPx = barrierWidthPx;
    cmdRef.current.barrierChanged = true;
  }, [barrierWidthPx]);
  useEffect(() => { cmdRef.current.np = np; }, [np]);
  useEffect(() => { cmdRef.current.brightness = brightness; }, [brightness]);
  useEffect(() => {
    cmdRef.current.waveSize = waveSize;
    cmdRef.current.barrierChanged = true;
  }, [waveSize]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    el.appendChild(canvas);

    // Size the canvas backing buffer.
    // Guard: skip when the div is collapsed to height:0 (non-canvas tab active),
    // and skip when nothing actually changed (avoids clearing the drawing buffer).
    function resize() {
      if (!el.clientWidth || !el.clientHeight) return;
      if (canvas.width === el.clientWidth && canvas.height === el.clientHeight) return;
      canvas.width  = el.clientWidth;
      canvas.height = el.clientHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const gl = canvas.getContext('webgl2');
    if (!gl) { el.textContent='WebGL2 not available'; return; }

    let eng;
    try { eng = buildGPUEngine(gl); }
    catch(e) { console.error(e); el.textContent=String(e); return; }

    // Trajectory overlay canvas
    const tc = document.createElement('canvas');
    tc.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    el.appendChild(tc);

    const bPx = new Float64Array(NP_MAX), bPy = new Float64Array(NP_MAX);
    const bTx = new Uint8Array(NP_MAX);  // 1 = transmitted (crossed barrier)
    const tX  = Array.from({length:NP_MAX},()=>new Float64Array(HIST));
    const tY  = Array.from({length:NP_MAX},()=>new Float64Array(HIST));
    const tHead = new Int32Array(NP_MAX), tLen = new Int32Array(NP_MAX);

    function initTraj(rho) {
      const np = cmdRef.current.np;
      let tot=0; const pdf=new Float32Array(N*N);
      for(let k=0;k<N*N;k++){const r=rho[k*4],i=rho[k*4+1];pdf[k]=r*r+i*i;tot+=pdf[k];}
      const inv=1/(tot||1);
      const tgts=Array.from({length:np},()=>Math.random()).sort((a,b)=>a-b);
      let cum=0,ti=0;
      for(let k=0;k<N*N&&ti<np;k++){
        cum+=pdf[k]*inv;
        while(ti<np&&tgts[ti]<=cum){
          bPx[ti]=(k%N+Math.random())*DX;
          bPy[ti]=(Math.floor(k/N)+Math.random())*DY;
          ti++;
        }
      }
      for(let ip=0;ip<np;ip++){
        tX[ip].fill(0);tY[ip].fill(0);
        tX[ip][0]=bPx[ip];tY[ip][0]=bPy[ip];
        tHead[ip]=0;tLen[ip]=1;bTx[ip]=0;
      }
    }

    function advTraj(rho, det, spd) {
      const np = cmdRef.current.np;
      const dt = DT * Math.max(1, Math.round(spd*SKIP_BASE));
      for(let ip=0;ip<np;ip++){
        let px=bPx[ip], py=bPy[ip];
        const ix=clamp(Math.floor(px/DX),1,N-2);
        const iy=clamp(Math.floor(py/DY),1,N-2);
        const k=(ix+iy*N)*4;
        const pR=rho[k],pI=rho[k+1],rho2=pR*pR+pI*pI;
        if(rho2>1e-40){
          const xp=(ix+1+iy*N)*4,xm=(ix-1+iy*N)*4;
          const yp=(ix+(iy+1)*N)*4,ym=(ix+(iy-1)*N)*4;
          const dxR=(rho[xp]-rho[xm])/(2*DX), dxI=(rho[xp+1]-rho[xm+1])/(2*DX);
          const dyR=(rho[yp]-rho[ym])/(2*DY), dyI=(rho[yp+1]-rho[ym+1])/(2*DY);
          const vx =(HB/M)*(pR*dxI-pI*dxR)/rho2;
          const vyp=(HB/M)*(pR*dyI-pI*dyR)/rho2;
          const q  =(ix>=QINI&&ix<=QFIN)?1:0;
          const vy =vyp-(det?LAMBDA2*q:0);
          px=clamp(px+vx*dt,0,LX-DX);
          py=clamp(py+vy*dt,0,LY-DY);
        }
        bPx[ip]=px;bPy[ip]=py;
        if(px > (BARRIER_IX0+cmdRef.current.barrierWidthPx)*DX) bTx[ip]=1;
        const h=(tHead[ip]+1)%HIST;
        tX[ip][h]=px;tY[ip][h]=py;
        tHead[ip]=h; if(tLen[ip]<HIST)tLen[ip]++;
      }
    }

    function drawTraj() {
      const W=canvas.width,H=canvas.height;
      if(tc.width!==W||tc.height!==H){tc.width=W;tc.height=H;}
      const ctx=tc.getContext('2d');
      ctx.clearRect(0,0,W,H);
      if(!cmdRef.current.showTraj) return;
      const sx=W/LX, sy=H/LY;
      const wx=px=>px*sx, wy=py=>py*sy;
      // Draw all trajectories in one pass
      const np = cmdRef.current.np;
      ctx.strokeStyle='rgba(100,200,255,.55)';
      ctx.lineWidth=1; ctx.beginPath();
      for(let ip=0;ip<np;ip++){
        const len=tLen[ip],h=tHead[ip];
        if(len<2)continue;
        for(let j=0;j<len;j++){
          const idx=(h-(len-1-j)+HIST)%HIST;
          const cx=wx(tX[ip][idx]),cy=wy(tY[ip][idx]);
          j===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);
        }
      }
      ctx.stroke();
      ctx.fillStyle='#7addff';
      ctx.beginPath();
      for(let ip=0;ip<NP;ip++){
        ctx.moveTo(wx(bPx[ip])+3,wy(bPy[ip]));
        ctx.arc(wx(bPx[ip]),wy(bPy[ip]),3,0,2*Math.PI);
      }
      ctx.fill();
      // Overlay labels
      const c2 = cmdRef.current;
      ctx.save();
      ctx.font = 'bold 22px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      const barLeftPx = BARRIER_IX0 / N * W;
      ctx.fillStyle = 'rgba(255,220,60,.9)';
      ctx.fillText('Barrier', barLeftPx - 6, 24);
      ctx.textAlign = 'center';
      const detXc = (QINI + QFIN) * 0.5 / N * W;
      ctx.fillStyle = 'rgba(255,110,110,.9)';
      ctx.fillText('Detector', detXc, 24);
      ctx.restore();
    }

    let rho = eng.readback();
    initTraj(rho);

    let raf, steps=0, frames=0, lastUI=0;

    function loop() {
      raf = requestAnimationFrame(loop);
      const c = cmdRef.current;

      if (c.barrierChanged) {
        c.barrierChanged = false;
        eng.reset(c.barrierOn, c.barrierV0eV, c.barrierWidthPx, c.waveSize * 1e-9);
        steps=0; rho=eng.readback(); initTraj(rho);
        return;
      }
      if (steps >= NT_MAX) {
        eng.reset(c.barrierOn, c.barrierV0eV, c.barrierWidthPx, c.waveSize * 1e-9);
        steps=0; rho=eng.readback(); initTraj(rho);
        return;
      }

      const n = c.running ? Math.max(1, Math.round(c.speed*SKIP_BASE)) : 0;
      for(let s=0;s<n;s++){eng.splitStep(c.detectorOn);steps++;if(steps>=NT_MAX)break;}

      frames++;
      if(frames%READBACK_EVERY===0) rho=eng.readback();
      if(c.running) advTraj(rho, c.detectorOn, c.speed);

      const _barX1 = BARRIER_IX0 + c.barrierWidthPx - 1;
      eng.display(canvas.width, canvas.height, c.barrierOn, c.detectorOn,
                  BARRIER_IX0, _barX1, QINI, QFIN, c.brightness);
      drawTraj();

      const now=performance.now();
      if(now-lastUI>120){
        lastUI=now;
        setTimeFs(steps*DT/1e-15);
        let p2=0;
        for(let k=0;k<N*N;k++){const r=rho[k*4],i=rho[k*4+1];p2+=r*r+i*i;}
        setNorm(p2*DX*DY);
      }
    }
    loop();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      if(el.contains(canvas)) el.removeChild(canvas);
      if(el.contains(tc))     el.removeChild(tc);
    };
  }, []);

  return (
    <div style={{display:'flex',width:'100vw',height:'100vh',background:'#040a1c',
      overflow:'hidden',fontFamily:"'JetBrains Mono','Courier New',monospace",color:'#e0ecff'}}>

      {/* Left column: tabbed area */}
      <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>

        {/* Tab bar */}
        <div style={{display:'flex',alignItems:'center',borderBottom:'1px solid rgba(40,80,180,.4)',
          background:'rgba(4,10,30,.98)',flexShrink:0}}>
          {[['canvas','Simulation'],['math','Math'],['physics','Physics']].map(([t,label])=>(
            <button key={t} onClick={()=>setActiveTab(t)} style={{
              padding:'8px 22px',cursor:'pointer',fontSize:12,fontWeight:700,
              fontFamily:"'JetBrains Mono','Courier New',monospace",
              textTransform:'uppercase',letterSpacing:'0.06em',
              background:activeTab===t?'rgba(30,60,150,.55)':'transparent',
              border:'none',borderBottom:activeTab===t?'2px solid #5599ff':'2px solid transparent',
              color:activeTab===t?'#c8e8ff':'#445577',transition:'color .15s',
            }}>{label}</button>
          ))}
          {/* Font-size control — shown only for text tabs */}
          {(activeTab==='math'||activeTab==='physics') && (
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6,
              paddingRight:12,userSelect:'none'}}>
              <span style={{fontSize:10,color:'#445577',letterSpacing:'0.04em'}}>FONT</span>
              <button onClick={()=>setPanelFontSize(s=>Math.max(10,s-1))} style={{
                width:22,height:22,cursor:'pointer',background:'rgba(40,80,180,.2)',
                border:'1px solid rgba(40,80,180,.4)',borderRadius:3,
                color:'#7ab8ff',fontSize:14,lineHeight:1,display:'flex',alignItems:'center',
                justifyContent:'center',padding:0,
              }}>−</button>
              <span style={{fontSize:11,color:'#c8e8ff',minWidth:22,textAlign:'center'}}>{panelFontSize}</span>
              <button onClick={()=>setPanelFontSize(s=>Math.min(22,s+1))} style={{
                width:22,height:22,cursor:'pointer',background:'rgba(40,80,180,.2)',
                border:'1px solid rgba(40,80,180,.4)',borderRadius:3,
                color:'#7ab8ff',fontSize:14,lineHeight:1,display:'flex',alignItems:'center',
                justifyContent:'center',padding:0,
              }}>+</button>
            </div>
          )}
        </div>

        {/* Canvas — always in DOM.  When another tab is active we collapse to
            height:0 (NOT display:none) so el.clientWidth stays non-zero and
            the WebGL context / FBO textures are never disturbed. */}
        <div ref={mountRef} style={{
          flex:    activeTab==='canvas' ? 1 : 'none',
          height:  activeTab==='canvas' ? undefined : 0,
          minHeight: 0,
          position:'relative', minWidth:0, overflow:'hidden',
        }}/>

        {/* Math panel */}
        {activeTab==='math' && (
          <div style={{flex:1,overflowY:'auto',padding:'20px 28px',
            display:'flex',flexDirection:'column',gap:18,
            fontSize:panelFontSize,color:'#c8d8f0',lineHeight:1.8,
            fontFamily:"'JetBrains Mono','Courier New',monospace"}}>
            <div style={{fontSize:14,color:'#5599ff',fontWeight:700,
              borderBottom:'1px solid rgba(40,80,180,.35)',paddingBottom:6}}>Mathematics</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px 40px'}}>
              <MathSection title="Schrödinger Equation">
                The full 2D system (particle x + pointer y) evolves under:
                <Eq>iℏ ∂ψ/∂t = Ĥ ψ</Eq>
                <Eq>Ĥ = −ℏ²∇²/2m + V(x,y) + λ₂ Q̂(x) p̂_y</Eq>
                V(x,y) is the barrier potential. Q̂(x) = 1 inside the
                detector window, 0 elsewhere. The last term couples particle
                position to pointer momentum — this is the measurement
                interaction.
              </MathSection>

              <MathSection title="Split-Operator Method (Trotter–Suzuki)">
                Each time step Δt is factored to 2nd order:
                <Eq>{"e^{−iĤΔt/ℏ} ≈ e^{−iV̂Δt/2ℏ} · e^{−iŴΔt/2ℏ} · e^{−iT̂Δt/ℏ} · e^{−iŴΔt/2ℏ} · e^{−iV̂Δt/2ℏ}"}</Eq>
                Error is O(Δt³) per step, O(Δt²) globally.
                Δt = {(DT/1e-15).toFixed(2)} fs, N = {N}×{N} grid,
                L_x = L_y = {(LX/1e-9).toFixed(0)} nm.
              </MathSection>

              <MathSection title="Kinetic Propagator (FFT)">
                The kinetic step T̂ is diagonal in momentum space:
                <Eq>T̃(k_x,k_y) = exp(−iℏ(k_x²+k_y²)Δt / 2m)</Eq>
                Applied as: FFT2D → pointwise × T̃ → IFFT2D.
                Uses a 2D Stockham DIT FFT in GLSL ES 3.0, running
                entirely on the GPU via WebGL2 framebuffer ping-pong.
              </MathSection>

              <MathSection title="Measurement Coupling (Ŵ step)">
                Ĥ_meas = λ₂ Q̂(x) p̂_y shifts the pointer in position space:
                <Eq>ψ(x,y) → ψ(x, y − λ₂ Q(x) Δt/2)</Eq>
                Equivalently, in k_y space it is a pure phase:
                <Eq>{"ψ̃(x,k_y) → e^{−iλ₂ Q(x) k_y Δt/2} ψ̃(x,k_y)"}</Eq>
                λ₂ = 10⁵ m/s is the measurement coupling strength.
              </MathSection>

              <MathSection title="Bohmian Guiding Equations">
                Particle positions follow the de Broglie–Bohm velocity field:
                <Eq>ẋ = (ℏ/m) Im(∂_x ψ / ψ)</Eq>
                <Eq>ẏ = (ℏ/m) Im(∂_y ψ / ψ) − λ₂ Q(x)</Eq>
                The −λ₂ Q(x) term is the direct back-action: while the
                particle is inside the detector, the pointer coordinate is
                dragged downward at speed λ₂. Spatial gradients are computed
                with centred finite differences on the GPU readback buffer.
              </MathSection>

              <MathSection title="Color Scale">
                The inferno colormap is applied to:
                <Eq>c = √(ρ · S),   S ≈ {RHO_SCALE}</Eq>
                where ρ = |ψ|². The square-root compresses dynamic range
                so both the dense initial packet and the dilute
                transmitted/reflected tails remain visible simultaneously.
              </MathSection>
            </div>
          </div>
        )}

        {/* Physics panel */}
        {activeTab==='physics' && (
          <div style={{flex:1,overflowY:'auto',padding:'20px 28px',
            display:'flex',flexDirection:'column',gap:18,
            fontSize:panelFontSize,color:'#c8d8f0',lineHeight:1.8,
            fontFamily:"'JetBrains Mono','Courier New',monospace"}}>
            <div style={{fontSize:14,color:'#5599ff',fontWeight:700,
              borderBottom:'1px solid rgba(40,80,180,.35)',paddingBottom:6}}>Physics & Interest</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px 40px'}}>
              <MathSection title="What Is Being Simulated">
                A <Hi>2D quantum system</Hi> where x is the particle
                coordinate and y is a measurement pointer (ancilla degree
                of freedom). The two are coupled: the pointer accumulates
                a momentum kick proportional to the time the particle
                spends inside the detector region. Reading the final
                y-displacement tells us where the particle was — without
                any explicit wavefunction collapse.
              </MathSection>

              <MathSection title="Tunneling Through the Barrier">
                The wavepacket has kinetic energy KE ≈ 18 meV along x.
                The barrier V₀ (default 30 meV) is above the classical
                threshold, yet a fraction of the wave penetrates via the
                evanescent tail — this is <Hi>quantum tunneling</Hi>.
                Raise V₀ above ~50 meV to nearly suppress transmission;
                lower it below ~10 meV for a nearly transparent barrier.
              </MathSection>

              <MathSection title="Quantum Measurement">
                With the <Hi>Detector on</Hi>, the wavefunction shears
                in y over time: one lobe = "particle transmitted through
                detector region"; the other = "particle reflected".
                This is a <Hi>continuous weak measurement</Hi> — the
                pointer shifts gradually, not via a sudden collapse.
                The integrated charge Q is exactly the observable measured
                in single-electron counting experiments.
              </MathSection>

              <MathSection title="Bohmian (Pilot-Wave) Mechanics">
                Cyan dots are <Hi>Bohmian trajectories</Hi>: each particle
                has a definite position at all times, guided deterministically
                by the wavefunction. No collapse postulate is needed —
                trajectories that reach the far side are "detected"; those
                that turn back are not. Trajectories never cross (the
                velocity field is single-valued) and their ensemble
                distribution reproduces |ψ|² exactly.
              </MathSection>

              <MathSection title="Wave–Particle Duality">
                Both aspects are shown simultaneously:
                <br/>• The <Hi>wave</Hi> (inferno heatmap) diffracts,
                interferes, and tunnels — classically impossible.
                <br/>• The <Hi>particle</Hi> (Bohmian dot) follows a
                smooth, continuous trajectory guided by the wave.
                <br/>In the Bohmian picture this is not a paradox: the
                wave is real and physical, and the particle rides it.
              </MathSection>

              <MathSection title="Parameters to Explore">
                <Hi>Barrier V₀</Hi>: 10 meV → mostly transmitted;
                80 meV → mostly reflected. Watch the transmitted fraction
                change in real time.
                <br/><Hi>Detector on/off</Hi>: off = y stays Gaussian;
                on = wavepacket shears, pointer encodes which-path info.
                <br/><Hi>Speed ×n</Hi>: each frame advances n×{32}
                steps = n×{(32*DT/1e-15).toFixed(1)} fs of physics time.
              </MathSection>
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar: simulation controls */}
      <div style={{width:220,flexShrink:0,borderLeft:'1px solid rgba(40,80,180,.35)',
        background:'rgba(4,10,30,.95)',overflowY:'auto',padding:'12px 10px',
        display:'flex',flexDirection:'column',gap:10}}>
        <div style={{fontSize:13,color:'#5599ff',fontWeight:700,
          borderBottom:'1px solid rgba(40,80,180,.3)',paddingBottom:6}}>
          2D Quantum Measurement
        </div>
        <div style={{fontSize:10,color:'#6080a0',lineHeight:1.6}}>
          GPU split-operator.<br/>x = particle, y = pointer.<br/>Physics from MATLAB.
        </div>
        <div style={{fontSize:11,color:'#88aacc',lineHeight:1.8}}>
          <div>t = {timeFs.toFixed(1)} fs</div>
          <div>step {Math.min(Math.round(timeFs/(DT/1e-15)),NT_MAX)} / {NT_MAX}</div>
          <div style={{color:Math.abs(norm-1)>0.03?'#ff8844':'#44cc88'}}>
            ∫|ψ|² = {norm.toFixed(4)}
          </div>
        </div>
        <Btn on={running}    click={()=>setRunning(r=>!r)}    label={running?'Pause':'Run'} />
        <Btn on={detectorOn} click={()=>setDetectorOn(d=>!d)} label="Detector Q" />
        <Btn on={barrierOn}  click={()=>setBarrierOn(b=>!b)}  label="Barrier V₀" />
        <Btn on={showTraj}   click={()=>setShowTraj(t=>!t)}   label="Trajectories" />
        <div>
          <div style={{fontSize:11,color:'#7ab8ff',marginBottom:4}}>Speed ×{speed.toFixed(1)}</div>
          <input type="range" min={1} max={5} step={0.5} value={speed}
            onChange={e=>setSpeed(+e.target.value)}
            style={{width:'100%',accentColor:'#ffcc44'}}/>
        </div>
        <div>
          <div style={{fontSize:11,color:'#ffcc44',marginBottom:4}}>Barrier V₀ = {(barrierV0eV*1000).toFixed(0)} meV</div>
          <input type="range" min={0.01} max={0.15} step={0.005} value={barrierV0eV}
            onChange={e=>setBarrierV0eV(+e.target.value)}
            style={{width:'100%',accentColor:'#ffcc44'}}/>
        </div>
        <div>
          <div style={{fontSize:11,color:'#ffcc44',marginBottom:4}}>Barrier width = {barrierWidthPx} px ({(barrierWidthPx*DX/1e-9).toFixed(2)} nm)</div>
          <input type="range" min={1} max={8} step={1} value={barrierWidthPx}
            onChange={e=>setBarrierWidthPx(+e.target.value)}
            style={{width:'100%',accentColor:'#ffcc44'}}/>
        </div>
        <div>
          <div style={{fontSize:11,color:'#7ab8ff',marginBottom:4}}>Particles = {np}</div>
          <input type="range" min={10} max={120} step={10} value={np}
            onChange={e=>setNp(+e.target.value)}
            style={{width:'100%',accentColor:'#7addff'}}/>
        </div>
        <div>
          <div style={{fontSize:11,color:'#cc88ff',marginBottom:4}}>Brightness ×{brightness.toFixed(1)}</div>
          <input type="range" min={0.2} max={6} step={0.2} value={brightness}
            onChange={e=>setBrightness(+e.target.value)}
            style={{width:'100%',accentColor:'#cc88ff'}}/>
        </div>
        <div>
          <div style={{fontSize:11,color:'#88ddcc',marginBottom:4}}>Wave σ = {waveSize.toFixed(0)} nm (resets)</div>
          <input type="range" min={2} max={14} step={1} value={waveSize}
            onChange={e=>setWaveSize(+e.target.value)}
            style={{width:'100%',accentColor:'#88ddcc'}}/>
        </div>
        <div style={{fontSize:10,color:'#405060',lineHeight:1.65,
          borderTop:'1px solid rgba(40,80,180,.15)',paddingTop:8}}>
          <b style={{color:'#6080a0'}}>Barrier</b> ix=[{BARRIER_IX0},{BARRIER_IX0+barrierWidthPx-1}]<br/>
          V₀={(barrierV0eV*1000).toFixed(0)}meV, KE≈18meV<br/>
          <b style={{color:'#6080a0'}}>Detector</b> ix=[{QINI},{QFIN}]<br/>
          λ₂=10⁵ m/s, N={N}<br/>
          Np={np} trajectories
        </div>
        <div style={{fontSize:10,color:'#445566',lineHeight:1.5}}>
          <span style={{color:'#ffcc44'}}>—</span> barrier&nbsp;
          <span style={{color:'#ff6060'}}>—</span> detector<br/>
          <span style={{color:'#7addff'}}>●</span> Bohmian trajectories
        </div>
      </div>
    </div>
  );
}

function Btn({on,click,label}){
  return <button onClick={click} style={{
    padding:'6px 10px',borderRadius:5,cursor:'pointer',fontSize:12,
    fontFamily:"'JetBrains Mono','Courier New',monospace",
    background:on?'rgba(40,80,180,.5)':'rgba(15,30,70,.5)',
    border:'1px solid '+(on?'#5588cc':'#334466'),
    color:on?'#c8e8ff':'#7090b8',textAlign:'left',
  }}>{on?'◉':'○'} {label}</button>;
}

function MathSection({title,children}){
  return (
    <div>
      <div style={{color:'#7ab8ff',fontWeight:700,marginBottom:4}}>{title}</div>
      <div style={{color:'#a8c4e0',lineHeight:1.8}}>{children}</div>
    </div>
  );
}

function Eq({children}){
  return (
    <div style={{margin:'5px 0',padding:'4px 8px',background:'rgba(20,40,100,.5)',
      borderLeft:'2px solid #3355aa',borderRadius:2,color:'#d0e8ff',
      fontFamily:"'JetBrains Mono','Courier New',monospace",
      letterSpacing:'0.02em',whiteSpace:'pre-wrap'}}>
      {children}
    </div>
  );
}

function Hi({children}){
  return <span style={{color:'#7addff',fontWeight:700}}>{children}</span>;
}

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);
