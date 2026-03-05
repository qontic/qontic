'use strict';
// ============================================================
//  GPU-accelerated split-operator quantum simulation
//  Uses WebGL2 fragment shaders + ping-pong textures
//
//  Wavefunction stored as RGBA32F textures:  R=Re(ψ), G=Im(ψ)
//  Physics: split-operator with Stockham out-of-place FFT
//  Absorbing BC: cos^8 ramp on all 4 edges (no reflections)
// ============================================================

const HB = 1.054571817e-34;
const ME = 9.10938356e-31;
const QE = 1.602176634e-19;

// ─── Vertex shader (full-screen quad, no uniforms needed) ────
const VS = `#version 300 es
layout(location=0) in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// ─── Pointwise complex multiply: out = A * B ─────────────────
const FS_CMUL = `#version 300 es
precision highp float;
uniform sampler2D uA, uB;
out vec4 oC;
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec2 a = texelFetch(uA, c, 0).rg;
  vec2 b = texelFetch(uB, c, 0).rg;
  oC = vec4(a.x*b.x - a.y*b.y,
            a.x*b.y + a.y*b.x, 0.0, 1.0);
}`;

// ─── Stockham out-of-place FFT – one butterfly pass ──────────
//
//  For pass p (0-indexed), stride s = 2^p, N2 = N/2:
//    output index `out_i` (along x for horiz, y for vert)
//    r       = out_i mod (2s)
//    q       = out_i div (2s)
//    k       = r mod s
//    isSecond = r >= s
//    aIdx = q*s + k          (first  input index)
//    bIdx = aIdx + N2        (second input index)
//    angle = dir * (-π) * k / s   (dir=+1 forward, -1 inverse)
//    out  = isSecond ? (a - w*b) : (a + w*b)
//
//  After log2(N) passes the FFT is complete, in natural order.
const FS_FFT = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform float uPass;
uniform float uN;
uniform float uHoriz;  // 1.0 = horizontal (x), 0.0 = vertical (y)
uniform float uDir;    // +1.0 = forward, -1.0 = inverse
out vec4 oC;
const float PI = 3.141592653589793;
void main() {
  ivec2 coord = ivec2(gl_FragCoord.xy);
  int out_i = (uHoriz > 0.5) ? coord.x : coord.y;

  int s  = 1 << int(uPass);
  int N2 = int(uN) >> 1;
  int r  = out_i - (out_i / (2*s)) * (2*s); // out_i % (2s)
  int q  = out_i / (2*s);
  int k  = r - (r / s) * s;                  // r % s
  bool isSecond = (r >= s);

  int aIdx = q * s + k;
  int bIdx = aIdx + N2;

  ivec2 ca = (uHoriz > 0.5) ? ivec2(aIdx, coord.y) : ivec2(coord.x, aIdx);
  ivec2 cb = (uHoriz > 0.5) ? ivec2(bIdx, coord.y) : ivec2(coord.x, bIdx);

  vec2 a  = texelFetch(uTex, ca, 0).rg;
  vec2 b  = texelFetch(uTex, cb, 0).rg;

  float ang = uDir * (-PI) * float(k) / float(s);
  vec2  w   = vec2(cos(ang), sin(ang));
  vec2  wb  = vec2(w.x*b.x - w.y*b.y,  w.x*b.y + w.y*b.x);

  oC = vec4(isSecond ? (a - wb) : (a + wb), 0.0, 1.0);
}`;

// ─── Divide by Nx*Ny, apply cosine absorbing mask ────────────
//  Mask: cos^8(π/2 * normalised_distance_from_edge) within the
//  absorption layer of thickness `uAbsThick` (fraction 0..1).
const FS_ABS = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform float uScale;    // 1 / (Nx * Ny)
uniform float uAbsThick; // absorption layer thickness (e.g. 0.10)
out vec4 oC;
const float PI2 = 1.5707963267948966;
void main() {
  ivec2 c  = ivec2(gl_FragCoord.xy);
  vec2  psi = texelFetch(uTex, c, 0).rg * uScale;

  vec2  uv = (vec2(c) + 0.5) / vec2(textureSize(uTex, 0));
  float x  = uv.x, y = uv.y, t = uAbsThick;

  float mx = 1.0, my = 1.0;
  if      (x < t)     mx = sin(x            / t * PI2);
  else if (x > 1.-t)  mx = sin((1.0 - x)    / t * PI2);
  if      (y < t)     my = sin(y            / t * PI2);
  else if (y > 1.-t)  my = sin((1.0 - y)    / t * PI2);

  // cos^8 envelope: (sin value)^8 gives very gradual onset + sharp cutoff
  float m = mx * my;
  m = m * m * m * m;  // ^4  (input is already sin, so this is sin^4 = cos^4 up to pi/2)

  oC = vec4(psi * m, 0.0, 1.0);
}`;

// ─── Compute |ψ|² → R channel ────────────────────────────────
const FS_RHO = `#version 300 es
precision highp float;
uniform sampler2D uTex;
out vec4 oC;
void main() {
  vec2 p = texelFetch(uTex, ivec2(gl_FragCoord.xy), 0).rg;
  oC = vec4(p.x*p.x + p.y*p.y, 0.0, 0.0, 1.0);
}`;

// ─── Barrier mask: multiply ψ by real mask (R channel) ───────
const FS_MASK = `#version 300 es
precision highp float;
uniform sampler2D uPsi;
uniform sampler2D uMask;
out vec4 oC;
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec2 psi = texelFetch(uPsi, c, 0).rg;
  float m   = texelFetch(uMask, c, 0).r;
  oC = vec4(psi * m, 0.0, 1.0);
}`;

// ─── Export class ─────────────────────────────────────────────
export class GPUSim {
  constructor() {
    // Create a hidden canvas solely for physics computation
    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    this._canvas = canvas;

    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('WebGL2 not available');
    if (!gl.getExtension('EXT_color_buffer_float'))
      throw new Error('EXT_color_buffer_float not supported');
    this.gl = gl;

    this._buildQuad();
    this._progs = {
      cmul : this._prog(VS, FS_CMUL),
      fft  : this._prog(VS, FS_FFT),
      abs  : this._prog(VS, FS_ABS),
      rho  : this._prog(VS, FS_RHO),
      mask : this._prog(VS, FS_MASK),
    };

    this.simTime = 0;
    this.Nx = 0; this.Ny = 0;
    this.rho = null;    // Float32Array (column-major, matches worker convention)
    this._psi = null;   // Float32Array (row-major GL readback, length Nx*Ny*2)
    this._tex = null;
    this._fbo = null;
  }

  // ── WebGL helpers ─────────────────────────────────────────
  _shader(type, src) {
    const gl = this.gl;
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw new Error('Shader compile error:\n' + gl.getShaderInfoLog(s) + '\n' + src.slice(0, 200));
    return s;
  }

  _prog(vs, fs) {
    const gl = this.gl;
    const p = gl.createProgram();
    gl.attachShader(p, this._shader(gl.VERTEX_SHADER,   vs));
    gl.attachShader(p, this._shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
      throw new Error('Program link error: ' + gl.getProgramInfoLog(p));
    return p;
  }

  _buildQuad() {
    const gl = this.gl;
    this._vao = gl.createVertexArray();
    gl.bindVertexArray(this._vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    this._quadBuf = buf;
    gl.bindVertexArray(null);
  }

  // Create an RGBA32F texture (Re=R, Im=G, BA ignored). Data optional.
  _mkTex(w, h, data) {
    const gl = this.gl;
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Use RGBA32F for maximum read-back compatibility
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0,
                  gl.RGBA, gl.FLOAT, data || null);
    return t;
  }

  _mkFbo(tex) {
    const gl = this.gl;
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                            gl.TEXTURE_2D, tex, 0);
    const st = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (st !== gl.FRAMEBUFFER_COMPLETE)
      throw new Error('Framebuffer incomplete: ' + st);
    return fb;
  }

  // Run one fullscreen shader pass: read srcTextures, write to dstFBO
  _pass(prog, dstFBO, w, h, uniforms) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, dstFBO);
    gl.viewport(0, 0, w, h);
    gl.useProgram(prog);

    gl.bindVertexArray(this._vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuf);
    const posLoc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    let unit = 0;
    for (const [name, val] of Object.entries(uniforms)) {
      const loc = gl.getUniformLocation(prog, name);
      if (loc === null) continue;
      if (val instanceof WebGLTexture) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, val);
        gl.uniform1i(loc, unit++);
      } else {
        gl.uniform1f(loc, val);
      }
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindVertexArray(null);
  }

  // ── Stockham 2D FFT ───────────────────────────────────────
  // Reads from srcTex, ping-pongs through ping/pong textures only.
  // Returns the WebGLTexture holding the result.
  // dir: +1.0 = forward, -1.0 = inverse
  _fft2d(srcTex, dir) {
    const { Nx, Ny } = this;
    const T = this._tex, F = this._fbo;
    const prog = this._progs.fft;

    let src = srcTex;

    // ── Horizontal passes (FFT along x, uHoriz=1, size=Nx) ──
    // Choose initial write target to avoid read/write to same texture
    let dstH = (src === T.ping) ? 1 : 0;
    for (let p = 0; p < this._Nx_log2; p++) {
      const dstTex = dstH === 0 ? T.ping : T.pong;
      const dstFBO = dstH === 0 ? F.ping : F.pong;
      this._pass(prog, dstFBO, Nx, Ny,
        { uTex: src, uPass: p, uN: Nx, uHoriz: 1, uDir: dir });
      src = dstTex;
      dstH ^= 1;
    }

    // ── Vertical passes (FFT along y, uHoriz=0, size=Ny) ────
    let dstV = (src === T.ping) ? 1 : 0;
    for (let p = 0; p < this._Ny_log2; p++) {
      const dstTex = dstV === 0 ? T.ping : T.pong;
      const dstFBO = dstV === 0 ? F.ping : F.pong;
      this._pass(prog, dstFBO, Nx, Ny,
        { uTex: src, uPass: p, uN: Ny, uHoriz: 0, uDir: dir });
      src = dstTex;
      dstV ^= 1;
    }

    return src; // ping or pong texture holding the result
  }

  // ── Accessors for current/next psi ────────────────────────
  _curTex() { return this._cur === 0 ? this._tex.psi0 : this._tex.psi1; }
  _nxtTex() { return this._cur === 0 ? this._tex.psi1 : this._tex.psi0; }
  _curFBO() { return this._cur === 0 ? this._fbo.psi0 : this._fbo.psi1; }
  _nxtFBO() { return this._cur === 0 ? this._fbo.psi1 : this._fbo.psi0; }

  // ── Initialise simulation ────────────────────────────────
  init(cfg) {
    const gl = this.gl;
    const {
      Nx = 128, Ny = 128, Lx = 200e-9, Ly = 100e-9, Dt = 0.05e-15,
      velox = 1e5, veloy = 0,
      sigmax = 6e-9, sigmay = 10e-9, xfrac = 0.20,
      slitX = 0.5, slitCenterY1 = 0.422, slitCenterY2 = 0.578,
      slitHalfWidth = 0.039, barrierThick = 6,
      absThick = 0.05,
    } = cfg;

    // Clean up old GL resources
    if (this._tex) {
      Object.values(this._tex).forEach(t => gl.deleteTexture(t));
      Object.values(this._fbo).forEach(f => gl.deleteFramebuffer(f));
    }

    this.Nx = Nx; this.Ny = Ny;
    this.Lx = Lx; this.Ly = Ly; this.Dt = Dt;
    this._Nx_log2 = Math.round(Math.log2(Nx));
    this._Ny_log2 = Math.round(Math.log2(Ny));
    this._absThick = absThick;
    this._canvas.width = Nx; this._canvas.height = Ny;

    const Dx = Lx / (Nx - 1), Dy = Ly / (Ny - 1);
    const dkx = 2 * Math.PI / Lx;
    const dky = 2 * Math.PI / Ly;

    // ── Initial wavefunction ────────────────────────────────
    // Layout: RGBA32F tex, pixel (ix, iy) = grid point (ix, iy)
    // texImage2D upload is row-major: data[iy*Nx+ix] → pixel (ix, iy=row)
    const psi0Data = new Float32Array(Nx * Ny * 4);
    const x0 = xfrac * Lx, y0 = Ly / 2;
    const noX = Math.pow(1 / (2 * Math.PI * sigmax * sigmax), 0.25) / Math.SQRT2;
    const noY = Math.pow(1 / (2 * Math.PI * sigmay * sigmay), 0.25) / Math.SQRT2;
    for (let ix = 0; ix < Nx; ix++) {
      const x   = ix * Dx;
      const gx  = noX * Math.exp(-((x - x0) ** 2) / (4 * sigmax ** 2));
      const phx = ME * velox * (x - x0) / HB;
      const pxR = gx * Math.cos(phx), pxI = gx * Math.sin(phx);
      for (let iy = 0; iy < Ny; iy++) {
        const y   = iy * Dy;
        const gy  = noY * Math.exp(-((y - y0) ** 2) / (4 * sigmay ** 2));
        const phy = ME * veloy * (y - y0) / HB;
        const pyR = gy * Math.cos(phy), pyI = gy * Math.sin(phy);
        const i4  = (iy * Nx + ix) * 4;           // row-major RGBA
        psi0Data[i4    ] = pxR * pyR - pxI * pyI; // Re
        psi0Data[i4 + 1] = pxR * pyI + pxI * pyR; // Im
        // B, A channels unused → 0, 1
        psi0Data[i4 + 3] = 1.0;
      }
    }
    // Normalise
    let norm2 = 0;
    for (let i = 0; i < Nx * Ny * 4; i += 4)
      norm2 += psi0Data[i] ** 2 + psi0Data[i + 1] ** 2;
    const invN = 1 / Math.sqrt(norm2 * Dx * Dy);
    for (let i = 0; i < Nx * Ny * 4; i += 4) {
      psi0Data[i    ] *= invN;
      psi0Data[i + 1] *= invN;
    }

    // ── V propagator (half-step: exp(-i V Δt / 2ℏ)) ────────
    const vpropData = new Float32Array(Nx * Ny * 4);
    // Hard-wall barrier using real potential V=10eV (matches MATLAB)
    // Reflections are fine — simulation auto-stops before they return, like MATLAB's Nt limit
    const QE_local = 1.602176634e-19;
    const barrierV = 10 * QE_local;
    const biX0 = Math.floor(slitX * (Nx - 1));
    const j1c  = Math.floor(slitCenterY1 * (Ny - 1));
    const j2c  = Math.floor(slitCenterY2 * (Ny - 1));
    const hw   = Math.floor(slitHalfWidth * (Ny - 1));
    for (let ix = 0; ix < Nx; ix++) {
      for (let iy = 0; iy < Ny; iy++) {
        const i4 = (iy * Nx + ix) * 4;
        let v = 0;
        if (ix >= biX0 && ix < biX0 + barrierThick) {
          const inSlit1 = Math.abs(iy - j1c) <= hw;
          const inSlit2 = Math.abs(iy - j2c) <= hw;
          if (!inSlit1 && !inSlit2) v = barrierV;
        }
        const ang = v * Dt / (2 * HB);
        vpropData[i4    ] =  Math.cos(ang);
        vpropData[i4 + 1] = -Math.sin(ang);
        vpropData[i4 + 3] = 1.0;
      }
    }

    // bmask = all ones (no barrier absorption mask needed; domain-edge absorber handles it)
    const bmaskData = new Float32Array(Nx * Ny * 4);
    for (let i = 0; i < Nx * Ny * 4; i += 4) {
      bmaskData[i    ] = 1.0;
      bmaskData[i + 3] = 1.0;
    }

    // ── T propagator (full-step in k-space, natural FFT order) ─
    const tpropData = new Float32Array(Nx * Ny * 4);
    for (let ix = 0; ix < Nx; ix++) {
      const kx = ix < Nx / 2 ? ix * dkx : (ix - Nx) * dkx;
      for (let iy = 0; iy < Ny; iy++) {
        const ky  = iy < Ny / 2 ? iy * dky : (iy - Ny) * dky;
        const ang = HB * (kx * kx + ky * ky) / (2 * ME) * Dt;
        const i4  = (iy * Nx + ix) * 4;
        tpropData[i4    ] =  Math.cos(ang);
        tpropData[i4 + 1] = -Math.sin(ang);
        tpropData[i4 + 3] = 1.0;
      }
    }

    // ── Allocate textures ───────────────────────────────────
    const T = {
      psi0  : this._mkTex(Nx, Ny, psi0Data),
      psi1  : this._mkTex(Nx, Ny, null),
      ping  : this._mkTex(Nx, Ny, null),
      pong  : this._mkTex(Nx, Ny, null),
      vprop : this._mkTex(Nx, Ny, vpropData),
      tprop : this._mkTex(Nx, Ny, tpropData),
      bmask : this._mkTex(Nx, Ny, bmaskData),
    };
    this._tex = T;

    // ── Allocate framebuffers ───────────────────────────────
    this._fbo = {
      psi0 : this._mkFbo(T.psi0),
      psi1 : this._mkFbo(T.psi1),
      ping : this._mkFbo(T.ping),
      pong : this._mkFbo(T.pong),
    };

    this._cur = 0;   // psi is in psi0
    this.simTime = 0;
    // Auto-stop time: packet travels full domain past the barrier
    // ~1200 fs at default velox=1e5 m/s
    this.stopTime = (Lx * (1 - xfrac) * 0.75) / velox;

    // CPU-side buffers
    this._pixBuf = new Float32Array(Nx * Ny * 4); // RGBA readback
    this.rho = new Float32Array(Nx * Ny);          // column-major output
    this._psi = null;                              // set after first readback

    // Read back initial state so rho is valid from frame 0
    this._readback();
  }

  // ── Single split-operator step ───────────────────────────
  //
  //  Step layout (cur=A, nxt=B throughout a single call):
  //    1. V-half:   cmul(psi[A], vprop)  → psi[B];  swap A↔B
  //    2. Fwd FFT:  fft(psi[A])          → kTex       (ping/pong, A unused after)
  //    3. T-step:   cmul(kTex, tprop)    → psi[B]    (B is free after step 1 swap)
  //    4. Inv FFT:  ifft(psi[B])         → kTex2      (ping/pong)
  //    5. Abs/scale: scale+mask(kTex2)   → psi[A]    (A is free after step 2)
  //    6. V-half:   cmul(psi[A], vprop)  → psi[B];  swap A↔B
  //  End: psi is in psi[A]  (same index as start after two swaps)
  _stepOnce() {
    const { Nx, Ny, Dt } = this;
    const p = this._progs, T = this._tex;

    // Split-operator: V/2 → FFT → T → IFFT → V/2  (matches MATLAB exactly)
    // Step 1: V half-step
    this._pass(p.cmul, this._nxtFBO(), Nx, Ny,
      { uA: this._curTex(), uB: T.vprop });
    this._cur ^= 1;

    // Step 2: Forward 2D FFT
    const kTex = this._fft2d(this._curTex(), 1.0);

    // Step 3: T full-step
    this._pass(p.cmul, this._nxtFBO(), Nx, Ny,
      { uA: kTex, uB: T.tprop });

    // Step 4: Inverse 2D FFT
    const kTex2 = this._fft2d(this._nxtTex(), -1.0);

    // Step 5: Normalise IFFT result + domain-edge absorbing mask
    this._pass(p.abs, this._curFBO(), Nx, Ny, {
      uTex     : kTex2,
      uScale   : 1.0 / (Nx * Ny),
      uAbsThick: this._absThick,
    });

    // Step 6: V half-step
    this._pass(p.cmul, this._nxtFBO(), Nx, Ny,
      { uA: this._curTex(), uB: T.vprop });
    this._cur ^= 1;

    this.simTime += Dt;
  }

  // ── Public: advance n steps then read back ───────────────
  step(n) {
    for (let i = 0; i < n; i++) this._stepOnce();
    this._readback();
  }

  // ── Read psi from GPU → CPU  (RGBA32F readPixels) ────────
  _readback() {
    const gl = this.gl;
    const { Nx, Ny } = this;

    // readPixels from the current psi framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._curFBO());
    gl.readPixels(0, 0, Nx, Ny, gl.RGBA, gl.FLOAT, this._pixBuf);

    // _pixBuf layout: pixel (ix, iy) → pixBuf[(iy*Nx+ix)*4]  (row-major, GL)
    // rho output:     rho[ix*Ny+iy]  (column-major, matches worker convention)
    const buf = this._pixBuf;
    const rho = this.rho;
    for (let ix = 0; ix < Nx; ix++) {
      for (let iy = 0; iy < Ny; iy++) {
        const glIdx  = (iy * Nx + ix) * 4;
        const simIdx = ix * Ny + iy;
        const re = buf[glIdx], im = buf[glIdx + 1];
        rho[simIdx] = re * re + im * im;
      }
    }

    // Also store psi in row-major layout for Bohmian gradient (re,im interleaved)
    // psi[ix][iy] accessible as: psi[(iy*Nx+ix)*2] = re, *2+1 = im
    if (!this._psi || this._psi.length !== Nx * Ny * 2) {
      this._psi = new Float32Array(Nx * Ny * 2);
    }
    for (let i = 0; i < Nx * Ny; i++) {
      this._psi[i * 2    ] = buf[i * 4    ]; // Re
      this._psi[i * 2 + 1] = buf[i * 4 + 1]; // Im
    }
    this.psi = this._psi;
  }

  // Compute norm integral (used for HUD display)
  get norm() {
    if (!this.rho) return 0;
    let s = 0;
    for (let i = 0; i < this.Nx * this.Ny; i++) s += this.rho[i];
    return s * (this.Lx / (this.Nx - 1)) * (this.Ly / (this.Ny - 1));
  }
}
