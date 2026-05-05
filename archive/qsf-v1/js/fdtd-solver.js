// ============================================================================
// fdtd-solver.js — Leapfrog FDTD Schrödinger solver on WebGL
//
// Solves the 2D time-dependent Schrödinger equation:
//   iℏ ∂ψ/∂t = -ℏ²/(2m) ∇²ψ + V(x,y) ψ
//
// using the explicit leapfrog (Askar-Cakmak) scheme:
//   Re(ψ)^{n+1} = Re(ψ)^{n-1} + (2Δt/ℏ) H Im(ψ)^n
//   Im(ψ)^{n+1} = Im(ψ)^{n-1} - (2Δt/ℏ) H Re(ψ)^n
//
// All computation runs on the GPU via WebGL 1.0 ping-pong textures.
// Provides readback of ψ(x,y) for Bohmian mechanics on the CPU.
// ============================================================================

'use strict';

const FDTD = (function () {

   // ---- State ----
   let gl = null;
   let canvas = null;        // offscreen canvas for FDTD computation
   let NX = 256;             // grid points in x
   let NY = 256;             // grid points in y
   let dx = 1.0;             // spatial step (nm)
   let dy = 1.0;
   let dt = 0.0;             // time step (ns) — computed from stability
   let simTime = 0.0;        // accumulated simulation time
   let stepsPerFrame = 1;    // substeps per animation frame
   let initialized = false;

   // Physics (in nm, ns, kg units consistent with main sim)
   let hbar_fdtd = 1.054e-25;   // ℏ in nm²·kg/ns
   let mass_fdtd = 9.109e-31;   // electron mass
   let k0 = 0.0;                // initial wave vector
   let omega0 = 0.0;

   // World-space geometry (nm)
   let worldXMin = 0, worldXMax = 1;
   let worldYMin = 0, worldYMax = 1;

   // Potential texture (barrier geometry)
   let potentialTex = null;
   let potentialData = null;  // Float32Array NX*NY for CPU access

   // Wave function ping-pong textures
   // We store Re(ψ) and Im(ψ) each in an RGBA float texture
   // using the R channel. We need current and previous for leapfrog.
   let texReA = null, texReB = null;   // Re ping-pong
   let texImA = null, texImB = null;   // Im ping-pong
   let pingA = true;  // if true, A is "current", B is "previous"

   // Framebuffers
   let fbReA = null, fbReB = null;
   let fbImA = null, fbImB = null;

   // Shaders & programs
   let stepProgram = null;     // FDTD time-step shader
   let initProgram = null;     // Initial condition shader
   let copyProgram = null;     // Copy/readback shader
   let quadBuffer = null;

   // Readback — full-frame CPU copies (updated once per frame via syncCPU)
   let cpuRe = null;           // Float32Array[NX*NY] — Re(ψ) on CPU
   let cpuIm = null;           // Float32Array[NX*NY] — Im(ψ) on CPU
   let cpuDirty = true;        // Set true after step(); cleared by syncCPU
   let canReadFloat = false;   // Whether gl.readPixels with FLOAT works
   let readbackBuf = null;     // Float32Array for GPU→CPU readback
   let readbackFB = null;      // Framebuffer for readback via UNSIGNED_BYTE
   let readbackTex = null;

   // Extension
   let extFloat = null;
   let extFloatLinear = null;
   let extColorBufferFloat = null;
   let extHalfFloat = null;
   let extColorBufferHalf = null;
   let useHalfFloat = false;
   let floatTexType = 0;  // gl.FLOAT or HALF_FLOAT_OES

   // First syncCPU flag for diagnostics
   let firstSync = true;

   // CW point source
   let cwSourceActive = false;
   let cwSourceIx = 0;          // slit 1 cell x-index
   let cwSourceIy = 0;          // slit 1 cell y-index
   let cwSourceAmp = 0.0;       // slit 1 injection amplitude
   let cwSourceOmega = 0.0;     // angular frequency ω = ℏk²/(2m)
   let cwSourceWidth = 2.5;     // Gaussian envelope width in cells
   let cwSrc1Phase0 = 0.0;      // slit 1 base phase (k*r1)
   // Original source position in grid coords (for vis shader overlay)
   let origSourceIx = 0;
   let origSourceIy = 0;
   // Second CW source (slit 2)
   let cwSrc2Active = false;
   let cwSrc2Ix = 0;
   let cwSrc2Iy = 0;
   let cwSrc2Amp = 0.0;
   let cwSrc2PhaseOffset = 0.0; // phase offset relative to slit 1

   // Auto-normalization: track peak |ψ|² for visualization
   let peakPsi2 = 1e-20;       // smoothed peak amplitude

   // Wall geometry (set by buildPotential, used by setCWSlitSources)
   let wallRightIx = 0;        // right edge of wall in grid-cell index

   // Absorbing boundary width (in grid cells)
   // Must be small enough that slit sources stay inside the free zone.
   // With f^8 profile, 20 cells is enough to absorb outgoing waves.
   let abcWidth = 20;
   const ABC_STRENGTH = 0.05;  // imaginary potential strength

   // ---- Helpers ----

   function compileShader(type, source) {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
         console.error('FDTD shader error:', gl.getShaderInfoLog(s));
         gl.deleteShader(s);
         return null;
      }
      return s;
   }

   function linkProgram(vs, fs) {
      const p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
         console.error('FDTD program link error:', gl.getProgramInfoLog(p));
         return null;
      }
      return p;
   }

   function createFloatTexture(width, height, data) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      // Use the appropriate float type (FLOAT or HALF_FLOAT_OES)
      const texType = floatTexType || gl.FLOAT;

      if (data) {
         // Expand single-channel data to RGBA
         const rgba = new Float32Array(width * height * 4);
         for (let i = 0; i < width * height; i++) {
            rgba[i * 4] = data[i];
            rgba[i * 4 + 1] = 0;
            rgba[i * 4 + 2] = 0;
            rgba[i * 4 + 3] = 1;
         }
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
                       gl.RGBA, texType, texType === gl.FLOAT ? rgba : null);
         // For half-float, upload as float then let the GPU convert
         if (texType !== gl.FLOAT) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
                          gl.RGBA, texType, null);
         }
      } else {
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
                       gl.RGBA, texType, null);
      }
      return tex;
   }

   /**
    * Test whether gl.readPixels with gl.FLOAT works.
    */
   function testFloatReadback() {
      try {
         const testTex = createFloatTexture(1, 1, new Float32Array([42.0]));
         const testFb = createFramebuffer(testTex);
         const buf = new Float32Array(4);
         gl.bindFramebuffer(gl.FRAMEBUFFER, testFb);
         gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, buf);
         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
         gl.deleteFramebuffer(testFb);
         gl.deleteTexture(testTex);
         return Math.abs(buf[0] - 42.0) < 0.01;
      } catch (e) {
         return false;
      }
   }

   /**
    * Sync GPU textures to CPU arrays. Call once per frame after step().
    * Uses float readback if available, otherwise renders to UNSIGNED_BYTE.
    */
   function syncCPU() {
      if (!initialized || !cpuDirty) return;

      const reFb = pingA ? fbReA : fbReB;
      const imFb = pingA ? fbImA : fbImB;

      // Always try float readback with gl.finish() to force GPU completion.
      try {
         gl.finish();  // ensure all GPU rendering is complete before readback

         gl.bindFramebuffer(gl.FRAMEBUFFER, reFb);
         const glErr1 = gl.getError();  // clear any pre-existing errors
         gl.readPixels(0, 0, NX, NY, gl.RGBA, gl.FLOAT, readbackBuf);
         const glErr2 = gl.getError();
         if (glErr2 !== gl.NO_ERROR) {
            console.warn('FDTD: readPixels FLOAT error:', glErr2);
         }
         for (let i = 0; i < NX * NY; i++) cpuRe[i] = readbackBuf[i * 4];

         gl.bindFramebuffer(gl.FRAMEBUFFER, imFb);
         gl.readPixels(0, 0, NX, NY, gl.RGBA, gl.FLOAT, readbackBuf);
         for (let i = 0; i < NX * NY; i++) cpuIm[i] = readbackBuf[i * 4];
         canReadFloat = true;
      } catch (e) {
         console.warn('FDTD: float readback failed:', e.message);
         cpuRe.fill(0);
         cpuIm.fill(0);
      }

      // First-time diagnostic: check if readback is producing zeros
      if (firstSync) {
         firstSync = false;
         let anyNonZero = false;
         for (let i = 0; i < NX * NY; i++) {
            if (cpuRe[i] !== 0 || cpuIm[i] !== 0) { anyNonZero = true; break; }
         }
         console.log('FDTD first sync: readback has data:', anyNonZero);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      cpuDirty = false;

      // Always compute peak |ψ|² for auto-normalization of visualization
      let maxPsi2 = 0;
      for (let i = 0; i < NX * NY; i++) {
         const p2 = cpuRe[i] * cpuRe[i] + cpuIm[i] * cpuIm[i];
         if (p2 > maxPsi2) maxPsi2 = p2;
      }
      // Smooth the peak to avoid flickering (exponential moving average)
      if (maxPsi2 > peakPsi2) {
         peakPsi2 = maxPsi2;  // ramp up immediately
      } else {
         peakPsi2 = peakPsi2 * 0.95 + maxPsi2 * 0.05;  // decay slowly
      }
      // Floor: if readback fails or data is too small, use a safe minimum.
      // This prevents the vis shader from saturating everything to one color.
      peakPsi2 = Math.max(peakPsi2, 1e-6);

      // Diagnostic: log periodically
      if (Math.random() < 0.03) {
         // Report source sample
         const srcIdx = Math.floor(NY / 2) * NX + Math.floor(NX / 4);
         const srcRe = cpuRe[srcIdx] || 0;
         const srcIm = cpuIm[srcIdx] || 0;
         // Also sample behind wall: at wallX + 50nm, center Y
         // wallIx is roughly at 35% of NX; sample at 45% of NX
         const behindIdx = Math.floor(NY / 2) * NX + Math.floor(NX * 0.45);
         const behindRe = cpuRe[behindIdx] || 0;
         const behindIm = cpuIm[behindIdx] || 0;
         const behindPsi2 = behindRe * behindRe + behindIm * behindIm;
         console.log(`FDTD sync: t=${simTime.toExponential(3)} ns, peak|ψ|²=${peakPsi2.toExponential(3)}, ` +
                     `srcSample=(${srcRe.toExponential(2)},${srcIm.toExponential(2)}), ` +
                     `behindWall|ψ|²=${behindPsi2.toExponential(3)}, steps/frame=${stepsPerFrame}`);
      }
   }

   function createFramebuffer(tex) {
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                              gl.TEXTURE_2D, tex, 0);
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
         const statusName = {
            [gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT]: 'INCOMPLETE_ATTACHMENT',
            [gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT]: 'MISSING_ATTACHMENT',
            [gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS]: 'INCOMPLETE_DIMENSIONS',
            [gl.FRAMEBUFFER_UNSUPPORTED]: 'UNSUPPORTED'
         };
         console.error('FDTD framebuffer incomplete:', statusName[status] || status);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return fb;
   }

   /**
    * Verify that rendering to a float FBO actually works.
    * Creates a test texture, renders a known value, reads back, checks.
    */
   function verifyFBORendering() {
      try {
         // Create a 4×4 test texture and FBO
         const testTex = createFloatTexture(4, 4, null);
         const testFb = createFramebuffer(testTex);

         // Check FBO completeness
         gl.bindFramebuffer(gl.FRAMEBUFFER, testFb);
         const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
         if (status !== gl.FRAMEBUFFER_COMPLETE) {
            console.error('FDTD: Test FBO incomplete:', status);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.deleteFramebuffer(testFb);
            gl.deleteTexture(testTex);
            return false;
         }

         // Render a constant value using the copy shader writing 0.5
         // Actually, use the init shader with known parameters
         gl.viewport(0, 0, 4, 4);
         gl.useProgram(initProgram);
         gl.uniform2f(gl.getUniformLocation(initProgram, 'u_gridSize'), 4, 4);
         gl.uniform2f(gl.getUniformLocation(initProgram, 'u_center'), 2, 2);
         gl.uniform1f(gl.getUniformLocation(initProgram, 'u_sigmaX'), 2);
         gl.uniform1f(gl.getUniformLocation(initProgram, 'u_sigmaY'), 2);
         gl.uniform1f(gl.getUniformLocation(initProgram, 'u_k0x'), 0);
         gl.uniform1f(gl.getUniformLocation(initProgram, 'u_k0y'), 0);
         gl.uniform1i(gl.getUniformLocation(initProgram, 'u_component'), 0);
         drawFullscreenQuad();

         gl.finish();  // force GPU to complete

         // Read back
         const buf = new Float32Array(4 * 4 * 4);
         gl.readPixels(0, 0, 4, 4, gl.RGBA, gl.FLOAT, buf);
         gl.bindFramebuffer(gl.FRAMEBUFFER, null);

         // Check center pixel (2,2) → index = 2*4+2 = 10, buf offset = 40
         const centerVal = buf[10 * 4];  // R channel
         console.log('FDTD FBO test: center pixel R =', centerVal);

         gl.deleteFramebuffer(testFb);
         gl.deleteTexture(testTex);

         // If the float value is non-zero, rendering works
         // Also accept UINT8 non-zero as evidence
         return (Math.abs(centerVal) > 1e-10) || (byteBuf[10*4] > 0);
      } catch (e) {
         console.error('FDTD FBO verify failed:', e);
         return false;
      }
   }

   function drawFullscreenQuad() {
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      const loc = 0; // a_position is always at location 0
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
   }

   // ---- Vertex Shader (shared) ----
   const VS_SOURCE = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
         v_uv = a_position * 0.5 + 0.5;
         gl_Position = vec4(a_position, 0.0, 1.0);
      }
   `;

   // ---- FDTD Step Fragment Shader ----
   // Symplectic Euler (staggered leapfrog) — avoids texture feedback loops.
   // Each pass reads u_psiSelf (the component being updated) and
   // u_psiOther (the component H acts on), writes to a DIFFERENT buffer.
   const FS_STEP = `
      precision highp float;
      varying vec2 v_uv;

      uniform sampler2D u_psiSelf;     // current value of the component being updated
      uniform sampler2D u_psiOther;    // the OTHER component (H acts on this)
      uniform sampler2D u_potential;   // V(x,y) encoded in R channel
      uniform vec2 u_gridSize;         // (NX, NY)
      uniform float u_dtOverHbar;      // dt/hbar  (positive)
      uniform float u_hbar2Over2m;     // hbar^2/(2m)
      uniform vec2 u_dxdy;             // (dx, dy)
      uniform float u_sign;            // +1 for Re update, -1 for Im update
      uniform float u_abcWidth;        // absorbing boundary width in grid cells
      uniform float u_abcStrength;     // absorbing boundary strength

      // CW slit source injection (two sources, one per slit)
      uniform vec2  u_srcPos;          // slit 1 position in grid cells
      uniform float u_srcAmp;          // injection amplitude (0 = off)
      uniform float u_srcPhase;        // ω·t - k·r1 current phase for slit 1
      uniform float u_srcWidth;        // Gaussian envelope width in cells
      uniform vec2  u_src2Pos;         // slit 2 position in grid cells
      uniform float u_src2Amp;         // slit 2 amplitude (0 = off/closed)
      uniform float u_src2PhaseOffset; // phase offset of slit 2 relative to slit 1

      void main() {
         vec2 texel = 1.0 / u_gridSize;

         // Read neighbors of the OTHER component for Laplacian (9-point stencil for isotropy)
         float psiC = texture2D(u_psiOther, v_uv).r;
         
         // Cardinal neighbors (N, S, E, W)
         float psiL = texture2D(u_psiOther, v_uv + vec2(-texel.x, 0.0)).r;
         float psiR = texture2D(u_psiOther, v_uv + vec2( texel.x, 0.0)).r;
         float psiD = texture2D(u_psiOther, v_uv + vec2(0.0, -texel.y)).r;
         float psiU = texture2D(u_psiOther, v_uv + vec2(0.0,  texel.y)).r;
         
         // Diagonal neighbors (NE, NW, SE, SW)
         float psiNE = texture2D(u_psiOther, v_uv + vec2( texel.x,  texel.y)).r;
         float psiNW = texture2D(u_psiOther, v_uv + vec2(-texel.x,  texel.y)).r;
         float psiSE = texture2D(u_psiOther, v_uv + vec2( texel.x, -texel.y)).r;
         float psiSW = texture2D(u_psiOther, v_uv + vec2(-texel.x, -texel.y)).r;

         // 9-point isotropic Laplacian (for uniform grid with dx=dy):
         // ∇²ψ ≈ (1/6h²) * [  1   4   1  ]
         //                 [  4  -20  4  ]
         //                 [  1   4   1  ]
         // This gives equal weight to all directions, reducing anisotropy
         float dx2 = u_dxdy.x * u_dxdy.x;
         float laplacian = (psiNW + 4.0*psiU + psiNE + 
                           4.0*psiL - 20.0*psiC + 4.0*psiR + 
                           psiSW + 4.0*psiD + psiSE) / (6.0 * dx2);

         // Hψ = -ℏ²/(2m) ∇²ψ + V·ψ
         float V = texture2D(u_potential, v_uv).r;
         float Hpsi = -u_hbar2Over2m * laplacian + V * psiC;

         // Read current value of the component being updated
         float psiSelf = texture2D(u_psiSelf, v_uv).r;

         // Symplectic Euler: self^{new} = self + sign * (dt/ℏ) * H(other)
         float psiNew = psiSelf + u_sign * u_dtOverHbar * Hpsi;

         // CW slit source injection: inject from slit openings
         // (applied BEFORE wall damping so that wall cells fully
         //  absorb any leaked Gaussian tail from the sources)
         vec2 pos_grid = v_uv * u_gridSize;
         // Slit 1
         if (u_srcAmp > 0.0) {
            vec2 d = pos_grid - u_srcPos;
            float r2 = d.x*d.x + d.y*d.y;
            float env = exp(-r2 / (2.0 * u_srcWidth * u_srcWidth));
            float srcVal = u_srcAmp * env;
            if (u_sign > 0.0) {
               srcVal *= cos(u_srcPhase);
            } else {
               srcVal *= -sin(u_srcPhase);
            }
            psiNew += srcVal;
         }
         // Slit 2
         if (u_src2Amp > 0.0) {
            vec2 d2 = pos_grid - u_src2Pos;
            float r2b = d2.x*d2.x + d2.y*d2.y;
            float env2 = exp(-r2b / (2.0 * u_srcWidth * u_srcWidth));
            float srcVal2 = u_src2Amp * env2;
            float phase2 = u_srcPhase + u_src2PhaseOffset;
            if (u_sign > 0.0) {
               srcVal2 *= cos(phase2);
            } else {
               srcVal2 *= -sin(phase2);
            }
            psiNew += srcVal2;
         }

         // Wall absorption: γ is stored in the G channel of the
         // potential texture. Applied after CW injection so the
         // wall fully blocks any source leakage into non-slit cells.
         float gamma = texture2D(u_potential, v_uv).g;
         if (gamma > 0.0) {
            psiNew *= (1.0 - gamma);
         }

         // Absorbing boundary condition: damp near edges.
         // Use steep profile (f^8) for extremely strong absorption at detector and boundaries.
         vec2 pos = v_uv * u_gridSize;
         float dampX = 1.0;
         float dampY = 1.0;
         if (pos.x < u_abcWidth) {
            float f = pos.x / u_abcWidth;  // 0 at edge, 1 at interior
            float f2 = f * f;
            float f4 = f2 * f2;
            dampX = f4 * f4;               // f^8: very steep near edges
         } else if (pos.x > u_gridSize.x - u_abcWidth) {
            float f = (u_gridSize.x - pos.x) / u_abcWidth;
            float f2 = f * f;
            float f4 = f2 * f2;
            dampX = f4 * f4;
         }
         if (pos.y < u_abcWidth) {
            float f = pos.y / u_abcWidth;
            float f2 = f * f;
            float f4 = f2 * f2;
            dampY = f4 * f4;
         } else if (pos.y > u_gridSize.y - u_abcWidth) {
            float f = (u_gridSize.y - pos.y) / u_abcWidth;
            float f2 = f * f;
            float f4 = f2 * f2;
            dampY = f4 * f4;
         }
         psiNew *= dampX * dampY;

         gl_FragColor = vec4(psiNew, 0.0, 0.0, 1.0);
      }
   `;

   // ---- Initial condition shader ----
   // Generates a 2D Gaussian wave packet: ψ₀ = exp(-α(r²)) exp(ik₀·x)
   const FS_INIT = `
      precision highp float;
      varying vec2 v_uv;

      uniform vec2 u_gridSize;
      uniform vec2 u_center;       // center of packet in grid coords (0..NX, 0..NY)
      uniform float u_sigmaX;      // width in grid cells
      uniform float u_sigmaY;
      uniform float u_k0x;         // wave vector * dx (dimensionless phase per cell)
      uniform float u_k0y;
      uniform int u_component;     // 0 = Re, 1 = Im

      void main() {
         vec2 pos = v_uv * u_gridSize;
         float ex = (pos.x - u_center.x) / u_sigmaX;
         float ey = (pos.y - u_center.y) / u_sigmaY;
         float envelope = exp(-0.5 * (ex*ex + ey*ey));

         float phase = u_k0x * pos.x + u_k0y * pos.y;

         float val;
         if (u_component == 0) {
            val = envelope * cos(phase);
         } else {
            val = envelope * sin(phase);
         }

         gl_FragColor = vec4(val, 0.0, 0.0, 1.0);
      }
   `;

   // ---- Copy shader (for readback encoding) ----
   const FS_COPY = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_tex;

      void main() {
         float val = texture2D(u_tex, v_uv).r;
         gl_FragColor = vec4(val, 0.0, 0.0, 1.0);
      }
   `;

   // ---- Visualization shader ----
   // Hybrid analytical/FDTD rendering:
   // - Source side (x < wall): analytical CW point source → perfect spherical wavefronts
   // - Detector side (x ≥ wall): FDTD Re/Im → true diffraction/interference
   // Particles also use analytical velocity on source side, FDTD behind wall.
   const FS_VIS = `
      precision highp float;
      varying vec2 v_uv;

      uniform sampler2D u_psiRe;
      uniform sampler2D u_psiIm;
      uniform sampler2D u_paletteTex;
      uniform int u_mode;          // 0=Phase, 3=Psi2, 4=LogPsi2
      uniform float u_viewMin;
      uniform float u_viewMax;
      uniform float u_alphaScale;
      uniform float u_peakPsi2;     // auto-normalization: peak |ψ|² across grid

      // Hybrid uniforms for analytical source-side rendering
      uniform vec2  u_gridSize;     // (NX, NY)
      uniform float u_wallUV;       // wall X position in UV coords (0..1)
      uniform vec2  u_sourceGrid;   // CW source position in FDTD grid coords
      uniform vec2  u_kDxDy;        // (k*dx, k*dy) — phase per grid cell
      uniform float u_omegaT;       // ω × t — accumulated source phase

      const float PI = 3.14159265358979323846;

      void main() {
         // Flip Y to match main canvas convention (Y=0 at top)
         vec2 uv_flipped = vec2(v_uv.x, 1.0 - v_uv.y);

         float re, im;

         // Source side: analytical CW point source (perfect spherical wavefronts)
         if (v_uv.x < u_wallUV && u_kDxDy.x > 0.0) {
            vec2 pos_grid = uv_flipped * u_gridSize;
            vec2 d = pos_grid - u_sourceGrid;
            float kr = sqrt(d.x*d.x * u_kDxDy.x*u_kDxDy.x
                          + d.y*d.y * u_kDxDy.y*u_kDxDy.y);
            float r_grid = sqrt(d.x*d.x + d.y*d.y);
            float amp = 1.0 / max(sqrt(r_grid), 1.0);
            float phase = kr - u_omegaT;
            re = amp * cos(phase);
            im = amp * sin(phase);
         } else {
            // Detector side: read FDTD simulation data
            re = texture2D(u_psiRe, uv_flipped).r;
            im = texture2D(u_psiIm, uv_flipped).r;
         }

         float psi2 = re*re + im*im;

         // Auto-normalized relative amplitude (0 = zero, 1 = peak)
         float relAmp = psi2 / u_peakPsi2;

         float val;
         float ampAlpha;
         if (u_mode == 3) {  // Psi2: sqrt relative amplitude
            val = sqrt(clamp(relAmp, 0.0, 1.0));
            ampAlpha = clamp(val * 3.0, 0.0, 1.0);
         } else if (u_mode == 4) {  // log(Psi2): log of relative amplitude
            float logv = log(clamp(relAmp, 1e-15, 1.0));
            val = (logv + 15.0) / 15.0;
            ampAlpha = clamp(val * 2.0, 0.0, 1.0);
         } else {  // Phase: show wavefront pattern
            float phase = atan(im, re);
            val = (phase / PI + 1.0) * 0.5;
            ampAlpha = psi2 > 1e-12 ? 1.0 : 0.0;
         }

         val = clamp(val, 0.0, 1.0);

         float vMin = u_viewMin;
         float vMax = u_viewMax;
         if (vMax <= vMin + 1e-6) { vMin = 0.0; vMax = 1.0; }
         float t = clamp((val - vMin) / (vMax - vMin), 0.0, 1.0);

         vec4 col = texture2D(u_paletteTex, vec2(t, 0.5));
         gl_FragColor = vec4(col.rgb, u_alphaScale * ampAlpha);
      }
   `;

   let visProgram = null;

   // ---- Public API ----

   /**
    * Initialize the FDTD solver.
    * @param {Object} opts
    *   nx, ny:         grid resolution
    *   worldBounds:    { xMin, xMax, yMin, yMax } in nm
    *   particleMass:   in kg
    *   hbar:           in nm²·kg/ns
    */
   function init(opts) {
      NX = opts.nx || 256;
      NY = opts.ny || 256;
      mass_fdtd = opts.particleMass || 9.109e-31;
      hbar_fdtd = opts.hbar || 1.054e-25;

      worldXMin = opts.worldBounds.xMin;
      worldXMax = opts.worldBounds.xMax;
      worldYMin = opts.worldBounds.yMin;
      worldYMax = opts.worldBounds.yMax;

      // Allow caller to override absorbing-boundary width
      if (opts.abcWidth !== undefined) abcWidth = opts.abcWidth;

      dx = (worldXMax - worldXMin) / NX;
      dy = (worldYMax - worldYMin) / NY;

      // Stability condition: dt ≤ m·dx²/(ℏ·d) where d=2
      // Use a safety factor of 0.4
      const dtMax = mass_fdtd * Math.min(dx * dx, dy * dy) / (hbar_fdtd * 2);
      dt = dtMax * 0.4;

      // Create offscreen WebGL canvas
      canvas = document.createElement('canvas');
      canvas.width = NX;
      canvas.height = NY;

      gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true }) ||
           canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true });

      if (!gl) {
         console.error('FDTD: WebGL not available');
         return false;
      }

      // Check for float texture support
      extFloat = gl.getExtension('OES_texture_float');
      if (!extFloat) {
         console.error('FDTD: OES_texture_float not available');
         return false;
      }
      extFloatLinear = gl.getExtension('OES_texture_float_linear');

      // CRITICAL: Request color_buffer_float to allow rendering TO float textures.
      // Without this, float framebuffers may be incomplete and produce zero output.
      extColorBufferFloat = gl.getExtension('WEBGL_color_buffer_float') ||
                            gl.getExtension('EXT_color_buffer_float');
      console.log('FDTD: WEBGL_color_buffer_float:', extColorBufferFloat ? 'available' : 'NOT available');

      // Also get half-float support as potential fallback
      extHalfFloat = gl.getExtension('OES_texture_half_float');
      extColorBufferHalf = gl.getExtension('EXT_color_buffer_half_float');
      console.log('FDTD: half_float:', extHalfFloat ? 'available' : 'no',
                  ', color_buffer_half:', extColorBufferHalf ? 'available' : 'no');

      floatTexType = gl.FLOAT;

      // Quad buffer
      quadBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
         -1, -1,  1, -1, -1, 1,
         -1,  1,  1, -1,  1, 1
      ]), gl.STATIC_DRAW);

      // Compile shaders
      const vs = compileShader(gl.VERTEX_SHADER, VS_SOURCE);
      if (!vs) return false;

      const fsStep = compileShader(gl.FRAGMENT_SHADER, FS_STEP);
      const fsInit = compileShader(gl.FRAGMENT_SHADER, FS_INIT);
      const fsCopy = compileShader(gl.FRAGMENT_SHADER, FS_COPY);
      const fsVis  = compileShader(gl.FRAGMENT_SHADER, FS_VIS);

      if (!fsStep || !fsInit || !fsCopy || !fsVis) return false;

      // We need separate VS instances because WebGL shares shader objects
      const vs2 = compileShader(gl.VERTEX_SHADER, VS_SOURCE);
      const vs3 = compileShader(gl.VERTEX_SHADER, VS_SOURCE);
      const vs4 = compileShader(gl.VERTEX_SHADER, VS_SOURCE);

      stepProgram = linkProgram(vs, fsStep);
      initProgram = linkProgram(vs2, fsInit);
      copyProgram = linkProgram(vs3, fsCopy);
      visProgram  = linkProgram(vs4, fsVis);

      if (!stepProgram || !initProgram || !copyProgram || !visProgram) return false;

      // Bind a_position at location 0 for all programs
      gl.bindAttribLocation(stepProgram, 0, 'a_position');
      gl.bindAttribLocation(initProgram, 0, 'a_position');
      gl.bindAttribLocation(copyProgram, 0, 'a_position');
      gl.bindAttribLocation(visProgram, 0, 'a_position');
      // Re-link after bindAttribLocation
      gl.linkProgram(stepProgram);
      gl.linkProgram(initProgram);
      gl.linkProgram(copyProgram);
      gl.linkProgram(visProgram);

      // Create textures
      texReA = createFloatTexture(NX, NY, null);
      texReB = createFloatTexture(NX, NY, null);
      texImA = createFloatTexture(NX, NY, null);
      texImB = createFloatTexture(NX, NY, null);
      potentialTex = createFloatTexture(NX, NY, null);

      // Create framebuffers and verify they're complete
      fbReA = createFramebuffer(texReA);
      fbReB = createFramebuffer(texReB);
      fbImA = createFramebuffer(texImA);
      fbImB = createFramebuffer(texImB);

      // Verify float FBO rendering actually works
      const fboOK = verifyFBORendering();
      if (!fboOK && extHalfFloat) {
         console.warn('FDTD: Float FBOs broken, trying half-float...');
         useHalfFloat = true;
         floatTexType = extHalfFloat.HALF_FLOAT_OES;
         // Recreate textures as half-float
         texReA = createFloatTexture(NX, NY, null);
         texReB = createFloatTexture(NX, NY, null);
         texImA = createFloatTexture(NX, NY, null);
         texImB = createFloatTexture(NX, NY, null);
         potentialTex = createFloatTexture(NX, NY, null);
         // Recreate framebuffers
         fbReA = createFramebuffer(texReA);
         fbReB = createFramebuffer(texReB);
         fbImA = createFramebuffer(texImA);
         fbImB = createFramebuffer(texImB);
         const fboOK2 = verifyFBORendering();
         console.log('FDTD: Half-float FBO:', fboOK2 ? 'WORKS' : 'ALSO BROKEN');
      } else {
         console.log('FDTD: Float FBO rendering:', fboOK ? 'WORKS' : 'BROKEN (no half-float fallback)');
      }

      // Readback buffers
      readbackBuf = new Float32Array(NX * NY * 4);
      cpuRe = new Float32Array(NX * NY);
      cpuIm = new Float32Array(NX * NY);
      cpuDirty = true;

      // Test whether gl.readPixels with gl.FLOAT works on this browser
      canReadFloat = testFloatReadback();
      console.log('FDTD: float readback supported:', canReadFloat);

      // Log grid info for debugging
      console.log(`FDTD grid: dx=${dx.toFixed(3)}, dy=${dy.toFixed(3)}, world=${worldXMax-worldXMin}x${worldYMax-worldYMin} nm`);

      simTime = 0.0;
      pingA = true;
      initialized = true;

      console.log(`FDTD initialized: ${NX}x${NY}, dx=${dx.toFixed(2)} nm, dt=${dt.toExponential(3)} ns (9-point stencil)`);
      return true;
   }

   /**
    * Build the potential texture from geometry.
    * @param {Object} geo
    *   wallX:          wall x position in world coords (nm)
    *   wallWidth:      wall thickness in nm
    *   slit1Y, slit2Y: slit center positions in world coords (nm)
    *   slitWidth:      slit half-width in nm
    *   slit1Open, slit2Open: booleans
    */
   function buildPotential(geo) {
      if (!initialized) return;

      potentialData = new Float32Array(NX * NY);

      // Diagnostic logging
      console.log('FDTD buildPotential: wallX=', geo.wallX, 'wallWidth=', geo.wallWidth,
                  'slit1Y=', geo.slit1Y, 'slit2Y=', geo.slit2Y, 'slitWidth=', geo.slitWidth,
                  'slit1Open=', geo.slit1Open, 'slit2Open=', geo.slit2Open);
      console.log('FDTD grid: worldX=[', worldXMin, ',', worldXMax, '], worldY=[', worldYMin, ',', worldYMax, ']');

      let nWall = 0, nSlit = 0;
      const dampingData = new Float32Array(NX * NY);

      // ---- Pure free space: no potential, no wall ----
      // The CW slit sources handle the physics of diffraction by
      // injecting only at slit positions. The wall is rendered
      // visually by the main canvas but does not exist in the FDTD
      // domain. This guarantees perfectly spherical wavefronts.
      // We still compute wallRightIx for CW source placement.
      const wallHalf = Math.max(geo.wallWidth * 0.5, 3 * dx);
      const wallXRight = geo.wallX + wallHalf;
      wallRightIx = Math.ceil((wallXRight - worldXMin) / dx);

      // V=0, gamma=0 everywhere → free particle propagation
      // potentialData and dampingData are already zero-initialized

      // Upload to GPU: R=potential, G=damping
      const rgba = new Float32Array(NX * NY * 4);
      for (let i = 0; i < NX * NY; i++) {
         rgba[i * 4] = potentialData[i];     // R: real potential V(x,y)
         rgba[i * 4 + 1] = dampingData[i];   // G: wall absorption coefficient γ
         rgba[i * 4 + 2] = 0;
         rgba[i * 4 + 3] = 1;
      }
      gl.bindTexture(gl.TEXTURE_2D, potentialTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NX, NY, 0,
                    gl.RGBA, floatTexType || gl.FLOAT, (floatTexType === gl.FLOAT) ? rgba : null);
      // For half-float, re-upload through a temporary float texture approach
      if (floatTexType !== gl.FLOAT && floatTexType) {
         // Half-float can't take Float32Array; use a CPU-side approach
         // Create as FLOAT first, then we'll rely on the shader to read it
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NX, NY, 0,
                       gl.RGBA, gl.FLOAT, rgba);
      }
   }

   /**
    * Set initial Gaussian wave packet.
    * @param {Object} packet
    *   x0, y0:     center in world coords (nm)
    *   sigmaX, sigmaY: widths in nm
    *   kx, ky:     wave vector components (1/nm)
    */
   function setInitialPacket(packet) {
      if (!initialized) return;

      k0 = Math.sqrt(packet.kx * packet.kx + packet.ky * packet.ky);
      omega0 = hbar_fdtd * k0 * k0 / (2 * mass_fdtd);

      // Convert to grid coordinates
      // Y is flipped: main sim has Y=0 at top, FDTD has Y=0 at bottom
      const cx = (packet.x0 - worldXMin) / dx;
      const cy = (worldYMax - packet.y0) / dy;
      const sx = packet.sigmaX / dx;
      const sy = packet.sigmaY / dy;
      const k0xGrid = packet.kx * dx;   // dimensionless phase per cell
      const k0yGrid = packet.ky * dy;

      gl.viewport(0, 0, NX, NY);

      // Generate Re(ψ₀)
      gl.useProgram(initProgram);
      gl.uniform2f(gl.getUniformLocation(initProgram, 'u_gridSize'), NX, NY);
      gl.uniform2f(gl.getUniformLocation(initProgram, 'u_center'), cx, cy);
      gl.uniform1f(gl.getUniformLocation(initProgram, 'u_sigmaX'), sx);
      gl.uniform1f(gl.getUniformLocation(initProgram, 'u_sigmaY'), sy);
      gl.uniform1f(gl.getUniformLocation(initProgram, 'u_k0x'), k0xGrid);
      gl.uniform1f(gl.getUniformLocation(initProgram, 'u_k0y'), k0yGrid);

      // Re(ψ₀) → texReA and texReB (both start the same for leapfrog)
      gl.uniform1i(gl.getUniformLocation(initProgram, 'u_component'), 0);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbReA);
      drawFullscreenQuad();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbReB);
      drawFullscreenQuad();

      // Im(ψ₀) → texImA and texImB
      gl.uniform1i(gl.getUniformLocation(initProgram, 'u_component'), 1);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbImA);
      drawFullscreenQuad();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbImB);
      drawFullscreenQuad();

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      simTime = 0.0;
      pingA = true;

      // Calculate recommended substeps per animation frame
      // Target: evolve ~0.5 nm per frame at wave speed
      const vPhase = hbar_fdtd * k0 / mass_fdtd;  // phase velocity
      const frameTime = 1.0 / 60.0;  // seconds
      // We want to advance the wave noticeably per frame
      const desiredDt = frameTime * 1e-9 * 0.001; // very small for quantum
      stepsPerFrame = Math.max(1, Math.round(desiredDt / dt));
      // Cap to prevent freezing
      stepsPerFrame = Math.min(stepsPerFrame, 200);

      console.log(`FDTD packet: center=(${packet.x0.toFixed(1)}, ${packet.y0.toFixed(1)}) nm, ` +
                  `σ=(${packet.sigmaX.toFixed(1)}, ${packet.sigmaY.toFixed(1)}) nm, ` +
                  `k=(${packet.kx.toExponential(2)}, ${packet.ky.toExponential(2)}) /nm, ` +
                  `steps/frame=${stepsPerFrame}`);
   }

   /**
    * Configure CW (continuous wave) point source.
    * Source injects e^{-iωt} at the given world position every timestep.
    * @param {Object} opts
    *   x, y:        source position in world coords (nm)
    *   amplitude:   injection amplitude per step
    *   omega:       angular frequency ω (rad/ns)
    *   width:       spatial width in grid cells (default 2.5)
    */
   function setCWSource(opts) {
      cwSourceActive = true;
      // Convert world coords to grid coords (Y-flipped)
      cwSourceIx = (opts.x - worldXMin) / dx;
      cwSourceIy = (worldYMax - opts.y) / dy;  // Y-flip
      origSourceIx = cwSourceIx;  // for vis shader overlay
      origSourceIy = cwSourceIy;
      cwSourceAmp = (opts.amplitude !== undefined) ? opts.amplitude : 0.5;
      cwSourceOmega = opts.omega || 0.0;
      cwSourceWidth = opts.width || 2.5;
      // Compute k0 from ω = ℏk²/(2m) → k = √(2mω/ℏ)
      k0 = Math.sqrt(2 * mass_fdtd * cwSourceOmega / hbar_fdtd);
      // Disable second source in single-source mode
      cwSrc2Active = false;
      cwSrc2Ix = 0; cwSrc2Iy = 0; cwSrc2Amp = 0; cwSrc2PhaseOffset = 0;
      console.log(`FDTD CW source: grid=(${cwSourceIx.toFixed(1)}, ${cwSourceIy.toFixed(1)}), ` +
                  `amp=${cwSourceAmp}, ω=${cwSourceOmega.toExponential(3)}, k0=${k0.toFixed(4)}, width=${cwSourceWidth}`);
   }

   /**
    * Configure CW sources at slit openings.
    * Each slit radiates as a coherent secondary source with phase
    * determined by the path length from the original source.
    * @param {Object} opts
    *   sourceX, sourceY:   original point source position (nm)
    *   slit1X, slit1Y:     slit 1 center position (nm)
    *   slit2X, slit2Y:     slit 2 center position (nm)
    *   slit1Open, slit2Open: booleans
    *   amplitude:          injection amplitude per step
    *   omega:              angular frequency ω (rad/ns)
    *   width:              spatial width in grid cells (default 3.0)
    */
   function setCWSlitSources(opts) {
      cwSourceOmega = opts.omega || 0.0;
      k0 = Math.sqrt(2 * mass_fdtd * cwSourceOmega / hbar_fdtd);
      cwSourceWidth = opts.width || 3.0;

      // Store original source position for vis shader analytical overlay
      origSourceIx = (opts.sourceX - worldXMin) / dx;
      origSourceIy = (worldYMax - opts.sourceY) / dy;

      // Distance from original source to each slit
      const r1 = Math.sqrt((opts.slit1X - opts.sourceX)**2 + (opts.slit1Y - opts.sourceY)**2);
      const r2 = Math.sqrt((opts.slit2X - opts.sourceX)**2 + (opts.slit2Y - opts.sourceY)**2);

      // Slit 1 — inject 2 cells past wall right edge (detector side)
      if (opts.slit1Open) {
         cwSourceActive = true;
         cwSourceIx = wallRightIx + 2;
         cwSourceIy = (worldYMax - opts.slit1Y) / dy;
         // Amplitude ~ 1/√r (2D cylindrical spreading)
         cwSourceAmp = (opts.amplitude || 0.05) / Math.max(Math.sqrt(r1), 1.0);
         cwSrc1Phase0 = k0 * r1;  // phase accumulated from source to slit 1
      } else {
         cwSourceActive = false;
         cwSourceAmp = 0;
         cwSrc1Phase0 = 0;
      }

      // Slit 2 — inject 2 cells past wall right edge (detector side)
      if (opts.slit2Open) {
         cwSrc2Active = true;
         cwSrc2Ix = wallRightIx + 2;
         cwSrc2Iy = (worldYMax - opts.slit2Y) / dy;
         cwSrc2Amp = (opts.amplitude || 0.05) / Math.max(Math.sqrt(r2), 1.0);
         cwSrc2PhaseOffset = k0 * (r2 - r1);  // phase difference between slits
      } else {
         cwSrc2Active = false;
         cwSrc2Amp = 0;
         cwSrc2PhaseOffset = 0;
      }

      console.log(`FDTD CW slit sources: slit1=(${cwSourceIx?.toFixed(1)}, ${cwSourceIy?.toFixed(1)}) amp=${cwSourceAmp?.toFixed(4)}, ` +
                  `slit2=(${cwSrc2Ix?.toFixed(1)}, ${cwSrc2Iy?.toFixed(1)}) amp=${cwSrc2Amp?.toFixed(4)}, ` +
                  `phaseOffset=${cwSrc2PhaseOffset?.toFixed(4)}, k0=${k0.toFixed(4)}, width=${cwSourceWidth}`);
   }

   /**
    * Clear the wave function to zero (for CW source startup).
    */
   function clearField() {
      if (!initialized) return;
      const texType = floatTexType || gl.FLOAT;
      // For half-float, we can't upload Float32Array directly
      // Instead, create the texture with null data (cleared to 0)
      [texReA, texReB, texImA, texImB].forEach(tex => {
         gl.bindTexture(gl.TEXTURE_2D, tex);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NX, NY, 0, gl.RGBA, texType, null);
      });
      simTime = 0.0;
      pingA = true;
      cpuDirty = true;
      peakPsi2 = 1e-20;
      firstSync = true;
      console.log('FDTD: field cleared to zero');
   }

   /**
    * Advance the simulation by n time steps.
    */
   function step(nSteps) {
      if (!initialized) return;

      nSteps = nSteps || stepsPerFrame;

      gl.viewport(0, 0, NX, NY);
      gl.useProgram(stepProgram);

      // Symplectic Euler (staggered leapfrog) — avoids feedback loops:
      //   Im^{n+1/2} = Im^{n-1/2} - (dt/ℏ) H Re^n          [pass 1]
      //   Re^{n+1}   = Re^n       + (dt/ℏ) H Im^{n+1/2}    [pass 2]
      // Each pass reads two textures and writes to a third — no overlap.
      const dtOverHbar = dt / hbar_fdtd;
      const hbar2Over2m = hbar_fdtd * hbar_fdtd / (2.0 * mass_fdtd);

      gl.uniform2f(gl.getUniformLocation(stepProgram, 'u_gridSize'), NX, NY);
      gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_dtOverHbar'), dtOverHbar);
      gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_hbar2Over2m'), hbar2Over2m);
      gl.uniform2f(gl.getUniformLocation(stepProgram, 'u_dxdy'), dx, dy);
      gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_abcWidth'), abcWidth);
      gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_abcStrength'), ABC_STRENGTH);

      // CW slit source uniforms
      gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_srcWidth'), cwSourceWidth);
      if (cwSourceActive) {
         gl.uniform2f(gl.getUniformLocation(stepProgram, 'u_srcPos'), cwSourceIx, cwSourceIy);
         gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_srcAmp'), cwSourceAmp);
      } else {
         gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_srcAmp'), 0.0);
      }
      if (cwSrc2Active) {
         gl.uniform2f(gl.getUniformLocation(stepProgram, 'u_src2Pos'), cwSrc2Ix, cwSrc2Iy);
         gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_src2Amp'), cwSrc2Amp);
         gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_src2PhaseOffset'), cwSrc2PhaseOffset);
      } else {
         gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_src2Amp'), 0.0);
      }

      // Potential texture on unit 2
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, potentialTex);
      gl.uniform1i(gl.getUniformLocation(stepProgram, 'u_potential'), 2);

      for (let s = 0; s < nSteps; s++) {
         // Update source phase for this substep (includes base phase from source-to-slit path)
         if (cwSourceActive || cwSrc2Active) {
            gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_srcPhase'), cwSourceOmega * simTime - cwSrc1Phase0);
         }

         // Current textures and "next" (opposite) framebuffers
         const reCur    = pingA ? texReA : texReB;
         const imCur    = pingA ? texImA : texImB;
         const fbImNew  = pingA ? fbImB  : fbImA;
         const fbReNew  = pingA ? fbReB  : fbReA;
         const imNewTex = pingA ? texImB : texImA;  // texture attached to fbImNew

         // Pass 1: Update Im  (sign = -1)
         // Reads imCur (self) & reCur (other) → writes fbImNew
         // No feedback: imCur ≠ imNewTex, reCur ≠ imNewTex
         gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_sign'), -1.0);

         gl.activeTexture(gl.TEXTURE0);
         gl.bindTexture(gl.TEXTURE_2D, imCur);     // self (being updated)
         gl.uniform1i(gl.getUniformLocation(stepProgram, 'u_psiSelf'), 0);

         gl.activeTexture(gl.TEXTURE1);
         gl.bindTexture(gl.TEXTURE_2D, reCur);      // other (H acts on Re)
         gl.uniform1i(gl.getUniformLocation(stepProgram, 'u_psiOther'), 1);

         gl.bindFramebuffer(gl.FRAMEBUFFER, fbImNew);
         drawFullscreenQuad();

         // Pass 2: Update Re  (sign = +1)
         // Uses the FRESHLY written Im (imNewTex) as input for H.
         // Reads reCur (self) & imNewTex (other) → writes fbReNew
         // No feedback: reCur ≠ reNewTex, imNewTex ≠ reNewTex
         gl.uniform1f(gl.getUniformLocation(stepProgram, 'u_sign'), 1.0);

         gl.activeTexture(gl.TEXTURE0);
         gl.bindTexture(gl.TEXTURE_2D, reCur);      // self (being updated)
         gl.uniform1i(gl.getUniformLocation(stepProgram, 'u_psiSelf'), 0);

         gl.activeTexture(gl.TEXTURE1);
         gl.bindTexture(gl.TEXTURE_2D, imNewTex);   // other (just-updated Im)
         gl.uniform1i(gl.getUniformLocation(stepProgram, 'u_psiOther'), 1);

         gl.bindFramebuffer(gl.FRAMEBUFFER, fbReNew);
         drawFullscreenQuad();

         // Flip ping-pong: the "next" buffers are now current
         pingA = !pingA;
         simTime += dt;
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      cpuDirty = true;
   }

   /**
    * Read ψ(x,y) at a world coordinate.
    * Returns {real, imag, phase, psi2}.
    * Uses pre-synced CPU arrays (call syncCPU once per frame).
    */
   function readPsi(xWorld, yWorld) {
      if (!initialized) return { real: 0, imag: 0, phase: 0, psi2: 0 };
      if (cpuDirty) syncCPU();

      const ix = Math.floor((xWorld - worldXMin) / dx);
      // Y-flip: main sim Y=0 is top, FDTD iy=0 is bottom
      const iy = Math.floor((worldYMax - yWorld) / dy);

      if (ix < 0 || ix >= NX || iy < 0 || iy >= NY) {
         return { real: 0, imag: 0, phase: 0, psi2: 0 };
      }

      const idx = iy * NX + ix;
      const re = cpuRe[idx];
      const im = cpuIm[idx];

      return {
         real: re,
         imag: im,
         phase: Math.atan2(im, re),
         psi2: re * re + im * im
      };
   }

   /**
    * Read ψ gradient at a world coordinate via finite differences on the grid.
    * Returns {dxReal, dxImag, dyReal, dyImag}.
    * Uses smoothed 5-point stencil to reduce numerical phase noise.
    */
   function readPsiGradient(xWorld, yWorld) {
      if (!initialized) return { dxReal: 0, dxImag: 0, dyReal: 0, dyImag: 0 };
      if (cpuDirty) syncCPU();

      const ix = Math.floor((xWorld - worldXMin) / dx);
      // Y-flip: main sim Y=0 is top, FDTD iy=0 is bottom
      const iy = Math.floor((worldYMax - yWorld) / dy);

      if (ix < 2 || ix >= NX - 2 || iy < 2 || iy >= NY - 2) {
         return { dxReal: 0, dxImag: 0, dyReal: 0, dyImag: 0 };
      }

      // Use 5-point stencil for better accuracy and noise reduction
      // d/dx ≈ (-f(i+2) + 8f(i+1) - 8f(i-1) + f(i-2)) / 12h
      const reXm2 = cpuRe[iy * NX + ix - 2];
      const reXm1 = cpuRe[iy * NX + ix - 1];
      const reXp1 = cpuRe[iy * NX + ix + 1];
      const reXp2 = cpuRe[iy * NX + ix + 2];
      
      const imXm2 = cpuIm[iy * NX + ix - 2];
      const imXm1 = cpuIm[iy * NX + ix - 1];
      const imXp1 = cpuIm[iy * NX + ix + 1];
      const imXp2 = cpuIm[iy * NX + ix + 2];

      const reYm2 = cpuRe[(iy - 2) * NX + ix];
      const reYm1 = cpuRe[(iy - 1) * NX + ix];
      const reYp1 = cpuRe[(iy + 1) * NX + ix];
      const reYp2 = cpuRe[(iy + 2) * NX + ix];
      
      const imYm2 = cpuIm[(iy - 2) * NX + ix];
      const imYm1 = cpuIm[(iy - 1) * NX + ix];
      const imYp1 = cpuIm[(iy + 1) * NX + ix];
      const imYp2 = cpuIm[(iy + 2) * NX + ix];

      // 5-point central difference: more accurate, less noisy
      const dxReal = (-reXp2 + 8*reXp1 - 8*reXm1 + reXm2) / (12 * dx);
      const dxImag = (-imXp2 + 8*imXp1 - 8*imXm1 + imXm2) / (12 * dx);
      
      // Note: dy gradient is negated due to Y-flip
      const dyReal = -(-reYp2 + 8*reYp1 - 8*reYm1 + reYm2) / (12 * dy);
      const dyImag = -(-imYp2 + 8*imYp1 - 8*imYm1 + imYm2) / (12 * dy);

      return { dxReal, dxImag, dyReal, dyImag };
   }

   /**
    * Render the current wave function to a target 2D canvas context.
    * Uses the visualization shader with palette mapping.
    * @param {CanvasRenderingContext2D} targetCtx — the visible wave canvas context
    * @param {WebGLTexture} paletteTex — palette texture from main renderer (or null)
    * @param {Object} opts — { mode, viewMin, viewMax, alphaScale, canvasWidth, canvasHeight,
    *                          sourceXCanvas, detectorXCanvas }
    */
   function renderToCanvas(targetCtx, paletteTexData, opts) {
      if (!initialized) return;

      gl.viewport(0, 0, NX, NY);
      gl.useProgram(visProgram);

      // Bind Re and Im textures
      const reTex = pingA ? texReA : texReB;
      const imTex = pingA ? texImA : texImB;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, reTex);
      gl.uniform1i(gl.getUniformLocation(visProgram, 'u_psiRe'), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, imTex);
      gl.uniform1i(gl.getUniformLocation(visProgram, 'u_psiIm'), 1);

      // Create/update a palette texture for this GL context
      if (paletteTexData && paletteTexData.length > 0) {
         if (!FDTD._palTex) {
            FDTD._palTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, FDTD._palTex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
         } else {
            gl.bindTexture(gl.TEXTURE_2D, FDTD._palTex);
         }
         const size = paletteTexData.length;
         const data = new Uint8Array(size * 4);
         for (let i = 0; i < size; i++) {
            const [r, g, b] = paletteTexData[i];
            data[i * 4] = r;
            data[i * 4 + 1] = g;
            data[i * 4 + 2] = b;
            data[i * 4 + 3] = 255;
         }
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      }

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, FDTD._palTex);
      gl.uniform1i(gl.getUniformLocation(visProgram, 'u_paletteTex'), 2);

      let mode = 0;
      if (opts.mode === 'Psi2') mode = 3;
      else if (opts.mode === 'LogPsi2') mode = 4;
      gl.uniform1i(gl.getUniformLocation(visProgram, 'u_mode'), mode);

      gl.uniform1f(gl.getUniformLocation(visProgram, 'u_viewMin'), opts.viewMin || 0);
      gl.uniform1f(gl.getUniformLocation(visProgram, 'u_viewMax'), opts.viewMax || 1);
      gl.uniform1f(gl.getUniformLocation(visProgram, 'u_alphaScale'), opts.alphaScale || 1.0);
      gl.uniform1f(gl.getUniformLocation(visProgram, 'u_peakPsi2'), peakPsi2 > 0 ? peakPsi2 : 1.0);

      // Analytical CW overlay uniforms for source-side rendering
      const wallUV = (opts.wallXWorld !== undefined)
         ? (opts.wallXWorld - worldXMin) / (worldXMax - worldXMin)
         : 1.0;  // default: no wall override (all FDTD)
      gl.uniform2f(gl.getUniformLocation(visProgram, 'u_gridSize'), NX, NY);
      gl.uniform1f(gl.getUniformLocation(visProgram, 'u_wallUV'), wallUV);
      gl.uniform2f(gl.getUniformLocation(visProgram, 'u_sourceGrid'), origSourceIx, origSourceIy);
      gl.uniform2f(gl.getUniformLocation(visProgram, 'u_kDxDy'),
                   cwSourceActive ? k0 * dx : 0.0,
                   cwSourceActive ? k0 * dy : 0.0);
      gl.uniform1f(gl.getUniformLocation(visProgram, 'u_omegaT'), cwSourceOmega * simTime);

      // Render to the FDTD canvas
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      drawFullscreenQuad();
      gl.disable(gl.BLEND);

      // Blit to the target canvas with proper scaling
      // The FDTD grid covers the full world domain; we need to map it
      // to the correct portion of the visible canvas
      const cw = opts.canvasWidth || targetCtx.canvas.width;
      const ch = opts.canvasHeight || targetCtx.canvas.height;

      targetCtx.drawImage(canvas, 0, 0, NX, NY,
                          opts.destX || 0, opts.destY || 0,
                          opts.destW || cw, opts.destH || ch);
   }

   /**
    * Get current simulation time.
    */
   function getTime() { return simTime; }

   /**
    * Set the number of substeps per animation frame.
    */
   function setStepsPerFrame(n) {
      stepsPerFrame = Math.max(1, Math.min(n, 500));
   }

   function getStepsPerFrame() { return stepsPerFrame; }

   /**
    * Get grid info for coordinate mapping.
    */
   function getGridInfo() {
      return {
         nx: NX, ny: NY,
         dx: dx, dy: dy, dt: dt,
         worldXMin, worldXMax, worldYMin, worldYMax,
         wallRightIx,
         stepsPerFrame,
         peakPsi2: peakPsi2
      };
   }

   /**
    * Check if initialized.
    */
   function isReady() { return initialized; }

   /**
    * Destroy solver and free resources.
    */
   function destroy() {
      if (gl) {
         [texReA, texReB, texImA, texImB, potentialTex, FDTD._palTex].forEach(t => {
            if (t) gl.deleteTexture(t);
         });
         [fbReA, fbReB, fbImA, fbImB].forEach(fb => {
            if (fb) gl.deleteFramebuffer(fb);
         });
         if (stepProgram) gl.deleteProgram(stepProgram);
         if (initProgram) gl.deleteProgram(initProgram);
         if (copyProgram) gl.deleteProgram(copyProgram);
         if (visProgram)  gl.deleteProgram(visProgram);
         if (quadBuffer) gl.deleteBuffer(quadBuffer);
      }
      gl = null;
      initialized = false;
      FDTD._palTex = null;
   }

   /**
    * Reset the simulation (re-initialize packet without rebuilding solver).
    */
   function reset(packet) {
      if (!initialized) return;
      setInitialPacket(packet);
   }

   /**
    * Lightweight CW restart: rebuild potential + restart CW source
    * without destroying/recreating the WebGL context or recompiling shaders.
    * This is MUCH faster than destroy() + init() for slit switching.
    * @param {Object} geo - geometry for buildPotential
    * @param {Object} cwOpts - options for setCWSource (x, y, amplitude, omega, width)
    * @param {number} preRunSteps - number of pre-run steps to establish the wave
    */
   function restartCW(geo, cwOpts, preRunSteps) {
      if (!initialized) return;
      buildPotential(geo);
      clearField();
      if (cwOpts.slit1X !== undefined) {
         setCWSlitSources(cwOpts);
      } else {
         setCWSource(cwOpts);
      }
      if (preRunSteps > 0) {
         step(preRunSteps);
         syncCPU();
      }
      console.log(`FDTD restartCW: pre-ran ${preRunSteps} steps`);
   }

   // Expose public API
   return {
      init,
      buildPotential,
      setInitialPacket,
      setCWSource,
      setCWSlitSources,
      clearField,
      step,
      syncCPU,
      readPsi,
      readPsiGradient,
      renderToCanvas,
      getTime,
      setStepsPerFrame,
      getStepsPerFrame,
      getGridInfo,
      isReady,
      destroy,
      reset,
      restartCW,
      _palTex: null
   };

})();
