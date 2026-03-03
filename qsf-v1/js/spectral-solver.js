/**
 * spectral-solver.js
 *
 * Split-Step Fourier Method for the 2D Schrödinger equation.
 * Uses GPUFFT (gpu-fft.js) for GPU-accelerated FFT / IFFT.
 *
 * Requires gpu-fft.js to be loaded first.
 *
 * Texture format throughout: RGBA float, R = Re(ψ), G = Im(ψ), B/A unused.
 *
 * Algorithm per time step (Strang splitting):
 *   1. Inject CW source(s)  [additive]
 *   2. Potential half-step:  ψ → ψ · exp(-i V dt/2ℏ)
 *   3. Forward FFT:          ψ → ψ̃(k)
 *   4. Kinetic full-step:    ψ̃ → ψ̃ · exp(-i ℏk²dt/2m)
 *   5. Inverse FFT:          ψ̃ → ψ
 *   6. Potential half-step:  ψ → ψ · exp(-i V dt/2ℏ)
 *   7. ABC damping:          ψ → ψ · d(x,y)
 *
 * Public API mirrors FDTD solver for drop-in use in double-slit.js:
 *   init(opts), clearField(), buildPotential(opts), setCWSlitSources(opts),
 *   step(n), syncCPU(), readPsi(xWorld, yWorld), getGridInfo()
 */

const SpectralSolver = (function () {
   'use strict';

   // WebGL context (shared with GPUFFT)
   let gl = null;

   // Grid
   let NX = 256, NY = 256;
   let dx = 1.0, dy = 1.0;
   let worldXMin = 0, worldXMax = 1;
   let worldYMin = 0, worldYMax = 1;

   // Physics
   let hbar = 1.054e-25;   // nm²·kg/ns
   let mass = 9.109e-31;   // kg (electron)
   let dt   = 1e-5;        // ns (CFL-set in init)

   // Wave-function ping-pong textures
   let psiTex  = null, psiTex2  = null;
   let psiFBO  = null, psiFBO2  = null;

   // Precomputed phase / damping textures
   let potPhaseTex     = null;   // R=cos(θ), G=sin(θ),  θ = -V·dt/(2ℏ), null when V=0
   let kineticPhaseTex = null;   // R=cos(φ), G=sin(φ),  φ = -ℏk²dt/(2m)
   let dampingTex      = null;   // R = combined damping factor (ABC + wall)

   // Saved geometry for rebuilding dampingTex after buildPotential
   let _abcWidth   = 20;
   let _wallGeom   = null;   // last buildPotential opts

   // CW sources (up to 2 for double slit)
   let cwSources = [];   // [{ix, iy, amp, phaseOffset, width}]
   let cwOmega   = 0;
   let cwPhase   = 0;    // running phase ωt

   // CPU readback buffer
   let cpuBuf   = null;  // Float32Array(NX * NY * 4)
   let cpuDirty = true;
   let _peakPsi2 = 1.0;  // rolling max for auto-normalization in renderToCanvas

   // Offscreen canvas for CPU-based rendering
   let _offscreenCanvas = null;
   let _offscreenCtx    = null;

   // Shader programs
   let progComplexMult = null;
   let progDamp        = null;
   let progInjectCW    = null;
   let quadBuf         = null;

   let initialized = false;
   let stepCount   = 0;

   // ═══════════════════════════════════════════════════════════════════════
   // GLSL SOURCES
   // ═══════════════════════════════════════════════════════════════════════

   const VS = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
         v_uv = a_pos * 0.5 + 0.5;
         gl_Position = vec4(a_pos, 0.0, 1.0);
      }
   `;

   // Complex multiply: (Re+iIm) · (cosP+i·sinP)
   const FS_COMPLEX_MULT = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_psi;    // .r=Re, .g=Im
      uniform sampler2D u_phase;  // .r=cos, .g=sin
      void main() {
         vec2 psi = texture2D(u_psi,   v_uv).rg;
         vec2 ph  = texture2D(u_phase, v_uv).rg;
         float newRe = psi.x * ph.x - psi.y * ph.y;
         float newIm = psi.x * ph.y + psi.y * ph.x;
         gl_FragColor = vec4(newRe, newIm, 0.0, 1.0);
      }
   `;

   // ABC damping: ψ ← ψ · d
   const FS_DAMP = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_psi;
      uniform sampler2D u_damp;
      void main() {
         vec2  psi = texture2D(u_psi,  v_uv).rg;
         float d   = texture2D(u_damp, v_uv).r;
         gl_FragColor = vec4(psi * d, 0.0, 1.0);
      }
   `;

   // Inject up to 2 Gaussian CW sources
   const FS_INJECT_CW = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_psi;
      uniform vec2  u_gridSize;
      uniform int   u_nSrc;
      uniform vec2  u_src0_pos;
      uniform float u_src0_amp;
      uniform float u_src0_phase;
      uniform vec2  u_src1_pos;
      uniform float u_src1_amp;
      uniform float u_src1_phase;
      uniform float u_srcWidth;
      void main() {
         vec2 psi = texture2D(u_psi, v_uv).rg;
         vec2 pos = v_uv * u_gridSize;
         if (u_nSrc >= 1 && u_src0_amp > 0.0) {
            vec2  d   = pos - u_src0_pos;
            float env = exp(-dot(d, d) / (2.0 * u_srcWidth * u_srcWidth));
            psi.x += u_src0_amp * env * cos(u_src0_phase);
            psi.y += u_src0_amp * env * sin(u_src0_phase);
         }
         if (u_nSrc >= 2 && u_src1_amp > 0.0) {
            vec2  d   = pos - u_src1_pos;
            float env = exp(-dot(d, d) / (2.0 * u_srcWidth * u_srcWidth));
            psi.x += u_src1_amp * env * cos(u_src1_phase);
            psi.y += u_src1_amp * env * sin(u_src1_phase);
         }
         gl_FragColor = vec4(psi, 0.0, 1.0);
      }
   `;

   // ═══════════════════════════════════════════════════════════════════════
   // INITIALIZATION
   // ═══════════════════════════════════════════════════════════════════════

   function init(opts) {
      console.log('=== SpectralSolver init ===');

      if (!GPUFFT.init()) {
         console.error('SpectralSolver: GPUFFT init failed');
         return false;
      }
      gl = GPUFFT.getContext();
      gl.getExtension('WEBGL_color_buffer_float');

      // Validate FFT roundtrip quality immediately after init
      const rtTest = GPUFFT.testRoundtrip(64);
      if (!rtTest.passed) {
         console.warn(`SpectralSolver: GPU FFT roundtrip test FAILED (maxError=${rtTest.maxError.toExponential(3)}). Results may be inaccurate.`);
      }

      NX = nextPow2(opts.nx || 256);
      NY = nextPow2(opts.ny || 256);

      worldXMin = opts.worldBounds.xMin;
      worldXMax = opts.worldBounds.xMax;
      worldYMin = opts.worldBounds.yMin;
      worldYMax = opts.worldBounds.yMax;

      dx = (worldXMax - worldXMin) / NX;
      dy = (worldYMax - worldYMin) / NY;

      mass = opts.particleMass || 9.109e-31;
      hbar = opts.hbar         || 1.054e-25;

      const abcWidth = opts.abcWidth || 20;
      _abcWidth = abcWidth;

      // CFL-limited time step
      dt = 0.4 * mass * Math.min(dx * dx, dy * dy) / (2.0 * hbar);

      console.log(`  Grid : ${NX}x${NY}, dx=${dx.toFixed(3)} nm, dy=${dy.toFixed(3)} nm`);
      console.log(`  dt   : ${dt.toExponential(3)} ns`);

      psiTex  = GPUFFT.createFloatTexture(NX, NY);
      psiTex2 = GPUFFT.createFloatTexture(NX, NY);
      psiFBO  = GPUFFT.createFramebuffer(psiTex);
      psiFBO2 = GPUFFT.createFramebuffer(psiTex2);

      dampingTex = buildDampingTex(_abcWidth, null);  // wall geometry not yet known

      quadBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(gl.ARRAY_BUFFER,
         new Float32Array([-1, -1,  1, -1,  -1, 1,  1, 1]),
         gl.STATIC_DRAW);

      progComplexMult = makeProg(VS, FS_COMPLEX_MULT);
      progDamp        = makeProg(VS, FS_DAMP);
      progInjectCW    = makeProg(VS, FS_INJECT_CW);

      if (!progComplexMult || !progDamp || !progInjectCW) {
         console.error('SpectralSolver: shader compilation failed');
         return false;
      }

      cpuBuf = new Float32Array(NX * NY * 4);
      cwSources = [];
      clearField();

      initialized = true;
      console.log('SpectralSolver ready.');
      return true;
   }

   function nextPow2(n) { let p = 1; while (p < n) p <<= 1; return p; }

   // ═══════════════════════════════════════════════════════════════════════
   // TEXTURE BUILDERS
   // ═══════════════════════════════════════════════════════════════════════

   // Build combined ABC-boundary + wall-absorption damping texture.
   // wallGeom (optional): { wallX, wallWidth, slit1Y, slit2Y, slitWidth, slit1Open, slit2Open }
   function buildDampingTex(abcWidth, wallGeom) {
      const data = new Float32Array(NX * NY * 4);
      for (let iy = 0; iy < NY; iy++) {
         const yWorld = worldYMax - iy * dy;   // Y-flip
         for (let ix = 0; ix < NX; ix++) {
            const xWorld = worldXMin + ix * dx;

            // ABC boundary — Hann-window (raised cosine) absorber.
            // d = sin²(π·f/2), where f=0 at the outermost pixel, f=1 at the inner edge.
            // • Goes exactly to 0 at the boundary → no steady-state energy buildup.
            // • Smooth at the inner edge (zero derivative) → no impedance mismatch / reflection.
            // • One-way product across N cells ≈ exp(−N·ln2) = exp(−28) for N=40 (machine zero).
            // In split-step damping is pointwise multiplication, so d=0 at boundary
            // does NOT create a hard-wall reflection (unlike FD methods).
            const dm = Math.min(
               Math.min(ix, NX - 1 - ix),
               Math.min(iy, NY - 1 - iy)
            );
            let d = 1.0;
            if (dm < abcWidth) {
               const f = dm / abcWidth;             // 0 at boundary, 1 at inner edge
               const s = Math.sin(0.5 * Math.PI * f);
               d = s * s;                           // Hann window: 0→1 smoothly
            }

            // Wall absorption: cells inside the barrier but not in a slit → zero
            if (wallGeom) {
               const inWallX = Math.abs(xWorld - wallGeom.wallX) <= wallGeom.wallWidth * 0.5;
               if (inWallX) {
                  let inSlit = false;
                  if (wallGeom.slit1Open && Math.abs(yWorld - wallGeom.slit1Y) <= wallGeom.slitWidth * 0.5) inSlit = true;
                  if (wallGeom.slit2Open && Math.abs(yWorld - wallGeom.slit2Y) <= wallGeom.slitWidth * 0.5) inSlit = true;
                  if (!inSlit) d = 0.0;   // fully absorb at wall
               }
            }

            const off = (iy * NX + ix) * 4;
            data[off] = d;  data[off+1] = 0;  data[off+2] = 0;  data[off+3] = 1;
         }
      }
      return uploadTex(data, NX, NY);
   }

   function buildPotentialPhaseTex(potData) {
      const data = new Float32Array(NX * NY * 4);
      const arg  = -dt / (2.0 * hbar);
      for (let i = 0; i < NX * NY; i++) {
         const phase  = arg * potData[i];
         data[i*4]   = Math.cos(phase);
         data[i*4+1] = Math.sin(phase);
         data[i*4+2] = 0;
         data[i*4+3] = 1;
      }
      return uploadTex(data, NX, NY);
   }

   function buildKineticPhaseTex() {
      const data   = new Float32Array(NX * NY * 4);
      const dkx    = 2.0 * Math.PI / (NX * dx);
      const dky    = 2.0 * Math.PI / (NY * dy);
      const factor = -hbar * dt / (2.0 * mass);
      for (let iy = 0; iy < NY; iy++) {
         const ky = (iy < NY / 2) ? iy * dky : (iy - NY) * dky;
         for (let ix = 0; ix < NX; ix++) {
            const kx    = (ix < NX / 2) ? ix * dkx : (ix - NX) * dkx;
            const phase = factor * (kx * kx + ky * ky);
            const off   = (iy * NX + ix) * 4;
            data[off]   = Math.cos(phase);
            data[off+1] = Math.sin(phase);
            data[off+2] = 0;
            data[off+3] = 1;
         }
      }
      return uploadTex(data, NX, NY);
   }

   function uploadTex(data, w, h) {
      const tex = GPUFFT.createFloatTexture(w, h);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.FLOAT, data);
      return tex;
   }

   // ═══════════════════════════════════════════════════════════════════════
   // SHADER UTILITIES
   // ═══════════════════════════════════════════════════════════════════════

   function compileShader(src, type) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
         console.error('SpectralSolver shader error:', gl.getShaderInfoLog(s));
         return null;
      }
      return s;
   }

   function makeProg(vsSrc, fsSrc) {
      const vs = compileShader(vsSrc, gl.VERTEX_SHADER);
      const fs = compileShader(fsSrc, gl.FRAGMENT_SHADER);
      if (!vs || !fs) return null;
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
         console.error('SpectralSolver link error:', gl.getProgramInfoLog(prog));
         return null;
      }
      return prog;
   }

   function drawQuad(prog, fbo, tex0, tex1) {
      gl.useProgram(prog);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, NX, NY);

      const posLoc = gl.getAttribLocation(prog, 'a_pos');
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex0);
      gl.uniform1i(gl.getUniformLocation(prog, 'u_psi'), 0);

      if (tex1 !== undefined) {
         gl.activeTexture(gl.TEXTURE1);
         gl.bindTexture(gl.TEXTURE_2D, tex1);
         // Try both uniform names - one program uses u_phase, another uses u_damp
         const phLoc = gl.getUniformLocation(prog, 'u_phase');
         if (phLoc !== null) gl.uniform1i(phLoc, 1);
         const dLoc  = gl.getUniformLocation(prog, 'u_damp');
         if (dLoc  !== null) gl.uniform1i(dLoc,  1);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   }

   function swapPsi() {
      [psiTex,  psiTex2] = [psiTex2,  psiTex];
      [psiFBO,  psiFBO2] = [psiFBO2,  psiFBO];
      cpuDirty = true;
   }

   // ═══════════════════════════════════════════════════════════════════════
   // SPLIT-STEP TIME EVOLUTION
   // ═══════════════════════════════════════════════════════════════════════

   function stepOnce() {
      // 1. Inject CW sources
      if (cwSources.length > 0) injectCW();

      // 2. Potential half-step
      if (potPhaseTex) {
         drawQuad(progComplexMult, psiFBO2, psiTex, potPhaseTex);
         swapPsi();
      }

      // 3. Forward FFT (in-place on psiTex)
      GPUFFT.fft2D(psiTex, NX, NY, false, false);

      // 4. Kinetic full-step in k-space
      if (kineticPhaseTex) {
         drawQuad(progComplexMult, psiFBO2, psiTex, kineticPhaseTex);
         swapPsi();
      }

      // 5. Inverse FFT (in-place on psiTex)
      GPUFFT.fft2D(psiTex, NX, NY, true, false);

      // 6. Potential half-step
      if (potPhaseTex) {
         drawQuad(progComplexMult, psiFBO2, psiTex, potPhaseTex);
         swapPsi();
      }

      // 7. ABC damping
      drawQuad(progDamp, psiFBO2, psiTex, dampingTex);
      swapPsi();

      cwPhase += cwOmega * dt;
      stepCount++;
   }

   function injectCW() {
      gl.useProgram(progInjectCW);
      gl.bindFramebuffer(gl.FRAMEBUFFER, psiFBO2);
      gl.viewport(0, 0, NX, NY);

      const posLoc = gl.getAttribLocation(progInjectCW, 'a_pos');
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, psiTex);
      const U = name => gl.getUniformLocation(progInjectCW, name);
      gl.uniform1i(U('u_psi'), 0);
      gl.uniform2f(U('u_gridSize'), NX, NY);
      gl.uniform1i(U('u_nSrc'), cwSources.length);
      gl.uniform1f(U('u_srcWidth'), (cwSources[0] && cwSources[0].width) || 2.5);

      const s0 = cwSources[0];
      if (s0) {
         gl.uniform2f(U('u_src0_pos'), s0.ix, s0.iy);
         gl.uniform1f(U('u_src0_amp'), s0.amp);
         gl.uniform1f(U('u_src0_phase'), cwPhase + (s0.phaseOffset || 0));
      } else {
         gl.uniform1f(U('u_src0_amp'), 0);
      }

      const s1 = cwSources[1];
      if (s1) {
         gl.uniform2f(U('u_src1_pos'), s1.ix, s1.iy);
         gl.uniform1f(U('u_src1_amp'), s1.amp);
         gl.uniform1f(U('u_src1_phase'), cwPhase + (s1.phaseOffset || 0));
      } else {
         gl.uniform1f(U('u_src1_amp'), 0);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      swapPsi();
   }

   // ═══════════════════════════════════════════════════════════════════════
   // PUBLIC: FIELD SETUP
   // ═══════════════════════════════════════════════════════════════════════

   function clearField() {
      const zeros = new Float32Array(NX * NY * 4);
      gl.bindTexture(gl.TEXTURE_2D, psiTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NX, NY, 0, gl.RGBA, gl.FLOAT, zeros);
      gl.bindTexture(gl.TEXTURE_2D, psiTex2);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NX, NY, 0, gl.RGBA, gl.FLOAT, zeros);
      stepCount = 0;
      cwPhase   = 0;
      cpuDirty  = true;
   }

   function buildPotential(opts) {
      _wallGeom = {
         wallX:     opts.wallX,
         wallWidth: opts.wallWidth  || 5,
         slit1Y:    opts.slit1Y,
         slit2Y:    opts.slit2Y,
         slitWidth: opts.slitWidth  || 30,
         slit1Open: opts.slit1Open  !== false,
         slit2Open: opts.slit2Open  !== false
      };

      // Wall is handled via absorption in the damping texture (V=0 everywhere).
      // This avoids the huge-phase-wrapping problem of a large barrier potential.
      if (potPhaseTex)     { gl.deleteTexture(potPhaseTex);     potPhaseTex = null; }
      if (kineticPhaseTex) { gl.deleteTexture(kineticPhaseTex); }
      if (dampingTex)      { gl.deleteTexture(dampingTex);      }

      // No barrier potential → potPhaseTex stays null (2 draw calls saved per step)
      kineticPhaseTex = buildKineticPhaseTex();
      dampingTex      = buildDampingTex(_abcWidth, _wallGeom);

      console.log(`SpectralSolver: potential built (wall absorption) — ` +
                  `wall x=${opts.wallX} nm, slits y=${opts.slit1Y}, ${opts.slit2Y} nm`);
   }

   function setCWSlitSources(opts) {
      cwSources = [];
      cwOmega   = opts.omega || 0;
      cwPhase   = 0;

      const amp   = (opts.amplitude !== undefined) ? opts.amplitude : 0.5;
      const width = opts.width || 2.5;

      if (opts.slit1Open) {
         cwSources.push({
            ix: (opts.slit1X - worldXMin) / dx,
            iy: (worldYMax - opts.slit1Y) / dy,
            amp, phaseOffset: 0, width
         });
      }
      if (opts.slit2Open) {
         cwSources.push({
            ix: (opts.slit2X - worldXMin) / dx,
            iy: (worldYMax - opts.slit2Y) / dy,
            amp, phaseOffset: 0, width
         });
      }

      console.log(`SpectralSolver: ${cwSources.length} CW source(s), ` +
                  `omega=${cwOmega.toExponential(3)} rad/ns`);
   }

   /**
    * Set a single CW point source anywhere in the domain (free-space scenario).
    * opts: { xWorld, yWorld, amplitude, omega, width }
    */
   function setPointSource(opts) {
      cwSources = [];
      cwOmega   = opts.omega || 0;
      cwPhase   = 0;

      const amp   = (opts.amplitude !== undefined) ? opts.amplitude : 0.5;
      const width = opts.width || 3.0;
      const ix    = (opts.xWorld - worldXMin) / dx;
      const iy    = (worldYMax  - opts.yWorld)  / dy;

      cwSources.push({ ix, iy, amp, phaseOffset: 0, width });

      console.log(`SpectralSolver: point source at grid (${ix.toFixed(1)}, ${iy.toFixed(1)}), ` +
                  `omega=${cwOmega.toExponential(3)} rad/ns`);
   }

   /**
    * Initialise the wave function as a 2-D Gaussian wave packet (like MATLAB split-operator).
    *   ψ(x,y) = A · exp(-(x-x0)²/4σx²) · exp(-(y-y0)²/4σy²) · exp(i·kx·(x-x0)+i·ky·(y-y0))
    * Replaces any previous field; clears CW sources (no injection during propagation).
    * opts: { x0, y0, sigmaX, sigmaY, kx, ky }
    *   positions / sigmas in nm,  k in 1/nm.
    */
   function setGaussianPacket(opts) {
      cwSources = [];
      cwOmega   = 0;
      cwPhase   = 0;

      const x0     = opts.x0     !== undefined ? opts.x0     : worldXMin + (worldXMax - worldXMin) * 0.2;
      const y0     = opts.y0     !== undefined ? opts.y0     : (worldYMin + worldYMax) * 0.5;
      const sigmaX = opts.sigmaX || (worldXMax - worldXMin) * 0.08;
      const sigmaY = opts.sigmaY || (worldYMax - worldYMin) * 0.18;
      const kx     = opts.kx    || 0;
      const ky     = opts.ky    || 0;

      const data = new Float32Array(NX * NY * 4);
      let maxAmp2 = 0;

      for (let iy = 0; iy < NY; iy++) {
         const yW = worldYMax - iy * dy;          // Y-flip: iy=0 → top
         const ey = (yW - y0) / (2.0 * sigmaY);
         const envY = Math.exp(-ey * ey);
         for (let ix = 0; ix < NX; ix++) {
            const xW   = worldXMin + ix * dx;
            const ex   = (xW - x0) / (2.0 * sigmaX);
            const envX = Math.exp(-ex * ex);
            const env  = envX * envY;
            const ph   = kx * (xW - x0) + ky * (yW - y0);
            const re   = env * Math.cos(ph);
            const im   = env * Math.sin(ph);
            const off  = (iy * NX + ix) * 4;
            data[off]   = re;
            data[off+1] = im;
            data[off+2] = 0;
            data[off+3] = 1;
            const a2 = re * re + im * im;
            if (a2 > maxAmp2) maxAmp2 = a2;
         }
      }

      // Normalise so peak amplitude = 1 (good for visualisation; matches _peakPsi2=1 start)
      if (maxAmp2 > 0) {
         const norm = 1.0 / Math.sqrt(maxAmp2);
         for (let i = 0; i < NX * NY; i++) {
            data[i * 4]     *= norm;
            data[i * 4 + 1] *= norm;
         }
      }

      gl.bindTexture(gl.TEXTURE_2D, psiTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NX, NY, 0, gl.RGBA, gl.FLOAT, data);
      // psiTex2 starts zeroed (ping-pong target)
      gl.bindTexture(gl.TEXTURE_2D, psiTex2);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NX, NY, 0, gl.RGBA, gl.FLOAT, new Float32Array(NX * NY * 4));

      stepCount  = 0;
      cpuDirty   = true;
      _peakPsi2  = 1.0;

      console.log(`SpectralSolver: Gaussian packet at (${x0.toFixed(1)}, ${y0.toFixed(1)}) nm, ` +
                  `σ=(${sigmaX.toFixed(1)}, ${sigmaY.toFixed(1)}) nm, kx=${kx.toFixed(3)} 1/nm`);
   }

   /**
    * Switch to free-space mode: no wall absorption, only boundary ABC.
    * Must be called after init() in place of buildPotential().
    */
   function setFreeSpaceMode() {
      _wallGeom = null;

      if (potPhaseTex)     { gl.deleteTexture(potPhaseTex);     potPhaseTex = null; }
      if (kineticPhaseTex) { gl.deleteTexture(kineticPhaseTex); }
      if (dampingTex)      { gl.deleteTexture(dampingTex); }

      kineticPhaseTex = buildKineticPhaseTex();
      dampingTex      = buildDampingTex(_abcWidth, null);   // no wall

      console.log('SpectralSolver: free-space mode (ABC boundary only, no wall)');
   }

   // ═══════════════════════════════════════════════════════════════════════
   // PUBLIC: TIME STEPPING
   // ═══════════════════════════════════════════════════════════════════════

   function step(nSteps) {
      nSteps = nSteps || 1;
      for (let i = 0; i < nSteps; i++) stepOnce();
   }

   // ═══════════════════════════════════════════════════════════════════════
   // PUBLIC: CPU READBACK
   // ═══════════════════════════════════════════════════════════════════════

   function syncCPU() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, psiFBO);
      gl.readPixels(0, 0, NX, NY, gl.RGBA, gl.FLOAT, cpuBuf);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      cpuDirty = false;

      // Update peak psi2 for auto-normalization
      let peak = 0;
      for (let i = 0; i < NX * NY; i++) {
         const re = cpuBuf[i * 4];
         const im = cpuBuf[i * 4 + 1];
         const p2 = re * re + im * im;
         if (p2 > peak) peak = p2;
      }
      // Smooth update: take max of 90% of old peak and new peak (prevents sudden dim flashes)
      _peakPsi2 = Math.max(_peakPsi2 * 0.9, peak > 0 ? peak : 1e-30);
   }

   function readPsi(xWorld, yWorld) {
      if (cpuDirty) syncCPU();

      const ix = Math.round((xWorld - worldXMin) / dx);
      const iy = Math.round((worldYMax - yWorld)  / dy);

      if (ix < 0 || ix >= NX || iy < 0 || iy >= NY) {
         return { real: 0, imag: 0, psi2: 0 };
      }

      const off = (iy * NX + ix) * 4;
      const re  = cpuBuf[off];
      const im  = cpuBuf[off + 1];
      return { real: re, imag: im, psi2: re * re + im * im };
   }

   // ═══════════════════════════════════════════════════════════════════════
   // CPU RENDERING
   // ═══════════════════════════════════════════════════════════════════════

   /**
    * Compute the analytical CW spherical-wave amplitude at (xWorld, yWorld).
    * Returns { re, im }.
    */
   function _analyticalPsi(xWorld, yWorld, srcXW, srcYW, kVal, oT) {
      const ddx = xWorld - srcXW;
      const ddy = yWorld - srcYW;
      const r   = Math.sqrt(ddx * ddx + ddy * ddy);
      if (r < 0.01) return { re: 0, im: 0 };
      const amp = 1.0 / Math.max(Math.sqrt(r / dx), 1.0);
      const ph  = kVal * r - oT;
      return { re: amp * Math.cos(ph), im: amp * Math.sin(ph) };
   }

   /**
    * Render the spectral wave field to a 2D canvas context.
    * Uses the CPU buffer (cpuBuf) — call syncCPU() first.
    *
    * opts.renderMode controls what is displayed:
    *   'hybrid'    (default) — left of wallXWorld: analytical, right: numerical
    *   'numerical' — entire domain from numerical cpuBuf only
    *   'compare'   — left half (ix < NX/2): analytical, right half: numerical
    *   'error'     — |ψ_num − ψ_analytic| normalized to analytical peak
    *
    * opts: { renderMode, mode, viewMin, viewMax, alphaScale, wallXWorld,
    *         sourceXWorld, sourceYWorld, k, omega, time,
    *         destX, destY, destW, destH }
    * paletteData: Array of [r,g,b] (0-255) entries.
    */
   function renderToCanvas(targetCtx, paletteData, opts) {
      if (!initialized) return;
      if (cpuDirty) syncCPU();

      const mode       = opts.mode       || 'Phase';
      const renderMode = opts.renderMode || 'hybrid';
      const viewMin    = opts.viewMin    !== undefined ? opts.viewMin    : 0;
      const viewMax    = opts.viewMax    !== undefined ? opts.viewMax    : 1;
      const alphaScl   = opts.alphaScale !== undefined ? opts.alphaScale : 1.0;
      const peak       = _peakPsi2 > 0 ? _peakPsi2 : 1e-30;
      const PI         = Math.PI;
      const halfNX     = NX / 2;

      const wallXW = opts.wallXWorld   !== undefined ? opts.wallXWorld   : worldXMax;
      const srcXW  = opts.sourceXWorld !== undefined ? opts.sourceXWorld : (worldXMin + worldXMax) * 0.5;
      const srcYW  = opts.sourceYWorld !== undefined ? opts.sourceYWorld : (worldYMin + worldYMax) * 0.5;
      const kVal   = opts.k    || 0;
      const oT     = (opts.omega || 0) * (opts.time || 0);

      // For error mode, pre-scan to find analytical peak so relative error is meaningful
      let peakA2 = 1e-30;
      if (renderMode === 'error' && kVal > 0) {
         for (let iy = 0; iy < NY; iy++) {
            const yW = worldYMax - iy * dy;
            for (let ix = 0; ix < NX; ix++) {
               const xW = worldXMin + ix * dx;
               const { re: rA, im: iA } = _analyticalPsi(xW, yW, srcXW, srcYW, kVal, oT);
               const a2 = rA * rA + iA * iA;
               if (a2 > peakA2) peakA2 = a2;
            }
         }
      }

      // Lazy-create offscreen canvas at grid resolution
      if (!_offscreenCanvas || _offscreenCanvas.width !== NX || _offscreenCanvas.height !== NY) {
         _offscreenCanvas = document.createElement('canvas');
         _offscreenCanvas.width  = NX;
         _offscreenCanvas.height = NY;
         _offscreenCtx = _offscreenCanvas.getContext('2d');
      }

      const imgData = _offscreenCtx.createImageData(NX, NY);
      const pixels  = imgData.data;  // Uint8ClampedArray, RGBA
      const palLen  = paletteData ? paletteData.length : 0;

      for (let iy = 0; iy < NY; iy++) {
         const yWorld = worldYMax - iy * dy;  // iy=0 → top of world
         for (let ix = 0; ix < NX; ix++) {
            const xWorld = worldXMin + ix * dx;
            const bufOff = (iy * NX + ix) * 4;

            let re, im;

            // Compute analytical ψ once (used in hybrid/compare/error)
            let reA = 0, imA = 0;
            if (renderMode !== 'numerical' && kVal > 0) {
               const a = _analyticalPsi(xWorld, yWorld, srcXW, srcYW, kVal, oT);
               reA = a.re; imA = a.im;
            }

            if (renderMode === 'numerical') {
               // Pure numerical: whole domain from cpuBuf
               re = cpuBuf[bufOff];
               im = cpuBuf[bufOff + 1];

            } else if (renderMode === 'compare') {
               // Left half: analytical; right half: numerical
               // A thin column at ix === halfNX is drawn as a neutral separator
               if (ix === halfNX) {
                  re = 0; im = 0;  // separator (will appear dark)
               } else if (ix < halfNX) {
                  re = reA; im = imA;
               } else {
                  re = cpuBuf[bufOff]; im = cpuBuf[bufOff + 1];
               }

            } else if (renderMode === 'error') {
               // |ψ_num − ψ_analytic|, normalised so analytic peak → 1
               const rNum = cpuBuf[bufOff];
               const iNum = cpuBuf[bufOff + 1];
               re = rNum - reA;
               im = iNum - imA;

            } else {
               // 'hybrid' (default): left of wall → analytical, right → numerical
               if (xWorld < wallXW && kVal > 0) {
                  re = reA; im = imA;
               } else {
                  re = cpuBuf[bufOff]; im = cpuBuf[bufOff + 1];
               }
            }

            // Normalisation peak: for error mode use analytical peak; otherwise numerical
            const normPeak = (renderMode === 'error') ? peakA2 : peak;
            const psi2   = re * re + im * im;
            const relAmp = psi2 / normPeak;

            let val, alpha;
            // Error mode always shows amplitude (Psi2-style), not phase
            const dispMode = (renderMode === 'error') ? 'Psi2' : mode;

            if (dispMode === 'Psi2') {
               val   = Math.sqrt(Math.min(relAmp, 1.0));
               alpha = Math.min(val * 3.0, 1.0);
            } else if (dispMode === 'LogPsi2') {
               const logv = Math.log(Math.max(relAmp, 1e-15));
               val   = (logv + 15.0) / 15.0;
               alpha = Math.min(val * 2.0, 1.0);
            } else {
               // Phase
               val   = (Math.atan2(im, re) / PI + 1.0) * 0.5;
               alpha = psi2 > 1e-12 ? 1.0 : 0.0;
            }

            val = Math.max(0, Math.min(1, val));
            const vRange = viewMax - viewMin;
            if (vRange > 1e-6) val = Math.max(0, Math.min(1, (val - viewMin) / vRange));

            let pr = 0, pg = 0, pb = 0;
            if (palLen > 0) {
               const pidx = Math.min(Math.floor(val * (palLen - 1)), palLen - 1);
               const pc   = paletteData[pidx];
               pr = pc[0]; pg = pc[1]; pb = pc[2];
            }

            // Separator column in compare mode: draw as white line
            if (renderMode === 'compare' && ix === halfNX) {
               pr = 220; pg = 220; pb = 220; alpha = 1.0;
            }

            const canvOff     = bufOff;
            pixels[canvOff]   = pr;
            pixels[canvOff+1] = pg;
            pixels[canvOff+2] = pb;
            pixels[canvOff+3] = Math.round(Math.max(0, Math.min(1, alpha * alphaScl)) * 255);
         }
      }

      _offscreenCtx.putImageData(imgData, 0, 0);

      // In compare mode, draw text labels on each half
      if (renderMode === 'compare') {
         const dw = opts.destW || targetCtx.canvas.width;
         const dh = opts.destH || targetCtx.canvas.height;
         targetCtx.drawImage(_offscreenCanvas,
            opts.destX || 0, opts.destY || 0, dw, dh);
         // Overlay labels
         targetCtx.save();
         targetCtx.font = 'bold 12px sans-serif';
         targetCtx.fillStyle = 'rgba(255,255,255,0.85)';
         const dx0 = opts.destX || 0;
         const dy0 = opts.destY || 0;
         targetCtx.fillText('Analytical', dx0 + 6, dy0 + 16);
         targetCtx.fillText('Numerical',  dx0 + dw / 2 + 6, dy0 + 16);
         targetCtx.restore();
      } else {
         targetCtx.drawImage(
            _offscreenCanvas,
            opts.destX || 0, opts.destY || 0,
            opts.destW || targetCtx.canvas.width,
            opts.destH || targetCtx.canvas.height
         );
      }
   }

   // ═══════════════════════════════════════════════════════════════════════
   // PUBLIC API
   // ═══════════════════════════════════════════════════════════════════════

   return {
      init,
      clearField,
      buildPotential,
      setCWSlitSources,
      setPointSource,
      setFreeSpaceMode,
      setGaussianPacket,
      step,
      syncCPU,
      readPsi,
      renderToCanvas,
      getGridInfo() {
         return {
            nx: NX, ny: NY, dx, dy, dt,
            worldXMin, worldXMax, worldYMin, worldYMax
         };
      }
   };

})();

if (typeof module !== 'undefined' && module.exports) {
   module.exports = SpectralSolver;
}
