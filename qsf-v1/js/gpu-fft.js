/**
 * gpu-fft.js
 * 
 * WebGL 2D FFT implementation using Cooley-Tukey butterfly operations
 * All computation on GPU for maximum speed
 */

const GPUFFT = (function() {
   'use strict';
   
   let gl = null;
   let canvas = null;
   
   // Shader programs
   let progButterfly  = null;
   let progCopy       = null;
   let progScale      = null;
   let progBitReverse = null;

   // Cache of bit-reversal LUT textures keyed by N (1-D, Nx1)
   const bitRevLUTCache = {};
   
   // Vertex buffer for full-screen quad
   let quadBuffer = null;
   
   // Per-size cache of working textures/FBOs so fft2D() never allocates
   const fftWorkCache = {};
   
   // Precomputed twiddle factors texture
   let twiddleTexture = null;
   
   //==========================================================================
   // INITIALIZATION
   //==========================================================================
   
   function init() {
      // Idempotent: skip re-initialization if already set up
      if (gl !== null) return true;

      // Create hidden canvas
      canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
         console.error('GPU FFT: WebGL not available');
         return false;
      }
      
      // Enable float textures
      const floatExt = gl.getExtension('OES_texture_float');
      if (!floatExt) {
         console.error('GPU FFT: OES_texture_float not available');
         return false;
      }
      
      // Enable float linear filtering (optional but helpful)
      gl.getExtension('OES_texture_float_linear');
      
      // Enable float readback (needed for gl.readPixels with gl.FLOAT)
      gl.getExtension('WEBGL_color_buffer_float');
      
      // Compile shaders
      if (!compileShaders()) {
         console.error('GPU FFT: Shader compilation failed');
         return false;
      }
      
      // Create vertex buffer for full-screen quad
      createQuadBuffer();
      
      console.log('GPU FFT initialized');
      return true;
   }
   
   //==========================================================================
   // SHADER SOURCES
   //==========================================================================
   
   const VS_QUAD = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
         v_uv = a_position * 0.5 + 0.5;
         gl_Position = vec4(a_position, 0.0, 1.0);
      }
   `;
   
   // Bit-reversal permutation (CPU-based, not used in shader)
   function bitReverse(x, bits) {
      let result = 0;
      for (let i = 0; i < bits; i++) {
         if (x & (1 << i)) {
            result |= 1 << (bits - 1 - i);
         }
      }
      return result;
   }
   
   function applyBitReversalCPU(data, width, height, axis) {
      const N = axis === 0 ? width : height;
      const other = axis === 0 ? height : width;
      const bits = Math.log2(N);
      const temp = new Float32Array(4);
      
      if (axis === 0) {
         // Bit-reverse columns (for each row)
         for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
               const xRev = bitReverse(x, bits);
               if (xRev > x) {
                  const idx1 = (y * width + x) * 4;
                  const idx2 = (y * width + xRev) * 4;
                  
                  for (let k = 0; k < 4; k++) {
                     temp[k] = data[idx1 + k];
                     data[idx1 + k] = data[idx2 + k];
                     data[idx2 + k] = temp[k];
                  }
               }
            }
         }
      } else {
         // Bit-reverse rows (for each column)
         for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
               const yRev = bitReverse(y, bits);
               if (yRev > y) {
                  const idx1 = (y * width + x) * 4;
                  const idx2 = (yRev * width + x) * 4;
                  
                  for (let k = 0; k < 4; k++) {
                     temp[k] = data[idx1 + k];
                     data[idx1 + k] = data[idx2 + k];
                     data[idx2 + k] = temp[k];
                  }
               }
            }
         }
      }
   }
   
   // Butterfly operation for one FFT stage
   // Input/output: RG channels = Re/Im
   const FS_BUTTERFLY = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_input;  // RG = Re/Im
      uniform vec2 u_size;
      uniform int u_halfSpan;   // 2^stage      — passed from JS (exact integer)
      uniform int u_fullSpan;   // 2^(stage+1)  — passed from JS (exact integer)
      uniform int u_direction;  // 0=forward, 1=inverse
      uniform int u_axis;       // 0=horizontal, 1=vertical
      
      const float PI = 3.141592653589793;
      
      void main() {
         vec2 pos = v_uv * u_size;
         int coord = (u_axis == 0) ? int(pos.x) : int(pos.y);
         
         // Butterfly parameters — use uniforms (exact integers, no pow() rounding)
         int butterflySpan     = u_fullSpan;
         int butterflyHalfSpan = u_halfSpan;
         
         // Which butterfly group and position within group
         int blockIdx = coord / butterflySpan;
         int posInBlock = coord - blockIdx * butterflySpan;
         
         // Top or bottom element
         bool isTop = posInBlock < butterflyHalfSpan;
         int partner = isTop ? 
            (coord + butterflyHalfSpan) : 
            (coord - butterflyHalfSpan);
         
         // Read values
         vec2 thisVal = texture2D(u_input, v_uv).rg;
         
         // Get partner UV
         vec2 partnerUV;
         if (u_axis == 0) {
            partnerUV = vec2((float(partner) + 0.5) / u_size.x, v_uv.y);
         } else {
            partnerUV = vec2(v_uv.x, (float(partner) + 0.5) / u_size.y);
         }
         vec2 partnerVal = texture2D(u_input, partnerUV).rg;
         
         // Twiddle factor
         int k = posInBlock;
         if (!isTop) k = posInBlock - butterflyHalfSpan;
         
         // Standard Cooley-Tukey: angle = -2π*k/N for forward, +2π*k/N for inverse
         float angle = -2.0 * PI * float(k) / float(butterflySpan);
         if (u_direction == 1) angle = -angle;  // Inverse: negate angle
         
         float cosA = cos(angle);
         float sinA = sin(angle);
         
         // Standard DIT butterfly:
         //   top'    = A + twiddle * B   (thisVal=A, partnerVal=B when isTop)
         //   bottom' = A - twiddle * B   (thisVal=B, partnerVal=A when !isTop)
         vec2 result;
         if (isTop) {
            // top = thisVal + twiddle * partnerVal
            result.x = thisVal.x + (partnerVal.x * cosA - partnerVal.y * sinA);
            result.y = thisVal.y + (partnerVal.x * sinA + partnerVal.y * cosA);
         } else {
            // bottom = partnerVal - twiddle * thisVal
            // (partnerVal is A=top, thisVal is B=bottom)
            result.x = partnerVal.x - (thisVal.x * cosA - thisVal.y * sinA);
            result.y = partnerVal.y - (thisVal.x * sinA + thisVal.y * cosA);
         }
         
         gl_FragColor = vec4(result.xy, 0.0, 1.0);
      }
   `;
   
   // GPU bit-reversal via a CPU-precomputed LUT texture.
   // The LUT is a Nx1 float texture: LUT[i].r = (bitReverse(i) + 0.5) / N.
   // This avoids all GLSL float-emulated integer arithmetic.
   const FS_BIT_REVERSE = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_input;
      uniform sampler2D u_lut;   // 1-D bit-reversal LUT texture (Nx1)
      uniform int u_axis;        // 0 = horizontal (x), 1 = vertical (y)
      
      void main() {
         vec2 srcUV = v_uv;
         if (u_axis == 0) {
            // look up bit-reversed x: LUT is indexed by v_uv.x
            float revX = texture2D(u_lut, vec2(v_uv.x, 0.5)).r;
            srcUV.x = revX;
         } else {
            float revY = texture2D(u_lut, vec2(v_uv.y, 0.5)).r;
            srcUV.y = revY;
         }
         gl_FragColor = texture2D(u_input, srcUV);
      }
   `;
   
   // Simple copy shader
   const FS_COPY = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_input;
      void main() {
         gl_FragColor = texture2D(u_input, v_uv);
      }
   `;
   
   // Scale shader for IFFT normalization
   const FS_SCALE = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_input;
      uniform float u_scale;
      void main() {
         vec4 val = texture2D(u_input, v_uv);
         gl_FragColor = val * u_scale;
      }
   `;
   
   //==========================================================================
   // SHADER COMPILATION
   //==========================================================================
   
   function compileShader(src, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
         console.error('Shader compile error:', gl.getShaderInfoLog(shader));
         return null;
      }
      return shader;
   }
   
   function createProgram(vsSrc, fsSrc) {
      const vs = compileShader(vsSrc, gl.VERTEX_SHADER);
      const fs = compileShader(fsSrc, gl.FRAGMENT_SHADER);
      if (!vs || !fs) return null;
      
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
         console.error('Program link error:', gl.getProgramInfoLog(prog));
         return null;
      }
      
      return prog;
   }
   
   function compileShaders() {
      progButterfly  = createProgram(VS_QUAD, FS_BUTTERFLY);
      progCopy       = createProgram(VS_QUAD, FS_COPY);
      progScale      = createProgram(VS_QUAD, FS_SCALE);
      progBitReverse = createProgram(VS_QUAD, FS_BIT_REVERSE);
      
      return progButterfly && progCopy && progScale && progBitReverse;
   }
   
   // Return (and lazily create) cached ping-pong buffers for a given size.
   function getFFTWork(width, height) {
      const key = `${width}x${height}`;
      if (!fftWorkCache[key]) {
         const t1 = createFloatTexture(width, height);
         const t2 = createFloatTexture(width, height);
         fftWorkCache[key] = {
            temp1: t1,  temp2: t2,
            fbo1:  createFramebuffer(t1),
            fbo2:  createFramebuffer(t2)
         };
      }
      return fftWorkCache[key];
   }
   
   //==========================================================================
   // GEOMETRY
   //==========================================================================
   
   function createQuadBuffer() {
      const vertices = new Float32Array([
         -1, -1,
          1, -1,
         -1,  1,
          1,  1
      ]);
      
      quadBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
   }
   
   function drawQuad(prog) {
      gl.useProgram(prog);
      
      const posLoc = gl.getAttribLocation(prog, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
   }
   
   //==========================================================================
   // TEXTURE UTILITIES
   //==========================================================================
   
   function createFloatTexture(width, height) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
      return tex;
   }
   
   function createFramebuffer(texture) {
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
         console.error('FBO incomplete:', status);
      }
      
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return fbo;
   }
   
   //==========================================================================
   // FFT OPERATIONS
   //==========================================================================
   
   /**
    * Perform 2D FFT on combined Re/Im texture
    * @param {WebGLTexture} texComplex - RG channels = Re/Im
    * @param {number} width - Must be power of 2
    * @param {number} height - Must be power of 2
    * @param {boolean} inverse - If true, perform inverse FFT
    * @param {boolean} skipBitReverse - If true, skip bit-reversal on input (NOT TYPICALLY USED - bit-reversal needed for both forward and inverse)
    * @returns {WebGLTexture} - Output texture (RG = Re/Im)
    */
   function fft2D(texComplex, width, height, inverse, skipBitReverse = false) {
      if (!gl) {
         console.error('GPU FFT not initialized');
         return null;
      }
      
      const numStagesX = Math.log2(width);
      const numStagesY = Math.log2(height);
      
      if (numStagesX % 1 !== 0 || numStagesY % 1 !== 0) {
         console.error('GPU FFT: width and height must be powers of 2');
         return null;
      }
      
      // Get (or lazily create) cached ping-pong textures for this size
      const work = getFFTWork(width, height);
      let srcTex = work.temp1;
      let dstTex = work.temp2;
      let srcFBO = work.fbo1;
      let dstFBO = work.fbo2;
      
      gl.viewport(0, 0, width, height);
      
      // Copy input → srcTex (working copy; leave texComplex intact until final copy-back)
      gl.bindFramebuffer(gl.FRAMEBUFFER, srcFBO);
      drawTextureToFBO(texComplex);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      
      // ===== HORIZONTAL FFT (row-wise) =====
      // GPU bit-reversal permutation along X
      if (!skipBitReverse) {
         gpuBitReversePass(srcTex, dstFBO, width, height, 0 /*axis=X*/, numStagesX);
         [srcTex, dstTex] = [dstTex, srcTex];
         [srcFBO, dstFBO] = [dstFBO, srcFBO];
      }
      
      // Horizontal butterfly stages
      for (let stage = 0; stage < numStagesX; stage++) {
         butterflyPass(srcTex, dstFBO, width, height, stage, inverse ? 1 : 0, 0);
         [srcTex, dstTex] = [dstTex, srcTex];
         [srcFBO, dstFBO] = [dstFBO, srcFBO];
      }
      
      // ===== VERTICAL FFT (column-wise) =====
      // GPU bit-reversal permutation along Y
      if (!skipBitReverse) {
         gpuBitReversePass(srcTex, dstFBO, width, height, 1 /*axis=Y*/, numStagesY);
         [srcTex, dstTex] = [dstTex, srcTex];
         [srcFBO, dstFBO] = [dstFBO, srcFBO];
      }
      
      // Vertical butterfly stages
      for (let stage = 0; stage < numStagesY; stage++) {
         butterflyPass(srcTex, dstFBO, width, height, stage, inverse ? 1 : 0, 1);
         [srcTex, dstTex] = [dstTex, srcTex];
         [srcFBO, dstFBO] = [dstFBO, srcFBO];
      }
      
      // Normalize for inverse FFT
      if (inverse) {
         const scale = 1.0 / (width * height);
         scaleTexture(srcTex, dstFBO, width, height, scale);
         [srcTex, dstTex] = [dstTex, srcTex];
         [srcFBO, dstFBO] = [dstFBO, srcFBO];
      }
      
      // Copy result back to texComplex (in-place semantics)
      const fboOut = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboOut);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texComplex, 0);
      gl.viewport(0, 0, width, height);
      gl.useProgram(progCopy);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srcTex);
      gl.uniform1i(gl.getUniformLocation(progCopy, 'u_input'), 0);
      drawQuad(progCopy);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fboOut);  // temp FBO only; textures are cached
      
      return texComplex;
   }
   
   // GPU bit-reversal pass using CPU-precomputed LUT texture.
   function gpuBitReversePass(srcTex, dstFBO, width, height, axis, nBits) {
      const N   = (axis === 0) ? width : height;
      const lut = getBitRevLUT(N);

      gl.useProgram(progBitReverse);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dstFBO);
      gl.viewport(0, 0, width, height);

      const posLoc = gl.getAttribLocation(progBitReverse, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srcTex);
      gl.uniform1i(gl.getUniformLocation(progBitReverse, 'u_input'), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, lut);
      gl.uniform1i(gl.getUniformLocation(progBitReverse, 'u_lut'), 1);

      gl.uniform1i(gl.getUniformLocation(progBitReverse, 'u_axis'), axis);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   }
   
   function butterflyPass(srcTex, dstFBO, width, height, stage, direction, axis) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, dstFBO);
      gl.viewport(0, 0, width, height);
      gl.useProgram(progButterfly);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srcTex);
      gl.uniform1i(gl.getUniformLocation(progButterfly, 'u_input'), 0);

      gl.uniform2f(gl.getUniformLocation(progButterfly, 'u_size'), width, height);
      // Pass exact integer spans — avoids pow(2.0, ...) rounding in GLSL
      const halfSpan = 1 << stage;
      const fullSpan = halfSpan << 1;
      gl.uniform1i(gl.getUniformLocation(progButterfly, 'u_halfSpan'), halfSpan);
      gl.uniform1i(gl.getUniformLocation(progButterfly, 'u_fullSpan'), fullSpan);
      gl.uniform1i(gl.getUniformLocation(progButterfly, 'u_direction'), direction);
      gl.uniform1i(gl.getUniformLocation(progButterfly, 'u_axis'), axis);

      drawQuad(progButterfly);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   }

   // Build (or retrieve cached) CPU-precomputed bit-reversal LUT texture for size N.
   // Returns a Nx1 float RGBA texture where pixel i has R = (bitReverse(i,log2N)+0.5)/N.
   function getBitRevLUT(N) {
      if (bitRevLUTCache[N]) return bitRevLUTCache[N];
      const bits = Math.round(Math.log2(N));
      const data = new Float32Array(N * 4);
      for (let i = 0; i < N; i++) {
         const rev = bitReverse(i, bits);
         data[i * 4]     = (rev + 0.5) / N;  // normalised UV of bit-reversed pixel
         data[i * 4 + 1] = 0;
         data[i * 4 + 2] = 0;
         data[i * 4 + 3] = 1;
      }
      const tex = createFloatTexture(N, 1);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      // Use NEAREST so LUT lookups are exact
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, 1, 0, gl.RGBA, gl.FLOAT, data);
      bitRevLUTCache[N] = tex;
      return tex;
   }
   
   function copyTexture(src, dstFBO) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, dstFBO);
      drawTextureToFBO(src);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   }
   
   function drawTextureToFBO(tex) {
      gl.useProgram(progCopy);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(gl.getUniformLocation(progCopy, 'u_input'), 0);
      drawQuad(progCopy);
   }
   
   /**
    * Transpose a texture (width x height) -> (height x width)
    * Used for separable FFT to convert between row-wise and column-wise operations
    */
   function transposeTexture(srcTex, dstFBO, width, height) {
      // This just copies without actual transpose - we handle it in the butterfly shader
      // by swapping u_size and adjusting coordinate access
      gl.bindFramebuffer(gl.FRAMEBUFFER, dstFBO);
      gl.viewport(0, 0, height, width);
      drawTextureToFBO(srcTex);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   }
   
   function scaleTexture(srcTex, dstFBO, width, height, scale) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, dstFBO);
      gl.useProgram(progScale);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srcTex);
      gl.uniform1i(gl.getUniformLocation(progScale, 'u_input'), 0);
      gl.uniform1f(gl.getUniformLocation(progScale, 'u_scale'), scale);
      drawQuad(progScale);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   }

   
   //==========================================================================
   // SELF-TEST: FFT → IFFT roundtrip
   //==========================================================================

   /**
    * Run a forward + inverse FFT roundtrip test on an N×N cosine pattern.
    * Returns { maxError, passed } where passed iff maxError < 1e-3.
    * Call this once after init() to verify GPU FFT correctness.
    */
   function testRoundtrip(N) {
      N = N || 64;
      if (!gl) { return { maxError: Infinity, passed: false, error: 'not initialised' }; }

      // Build a real test signal: cos(2π·2·ix/N) * cos(2π·3·iy/N)
      const size  = N * N * 4;
      const input = new Float32Array(size);
      for (let iy = 0; iy < N; iy++) {
         for (let ix = 0; ix < N; ix++) {
            const re = Math.cos(2 * Math.PI * 2 * ix / N) *
                       Math.cos(2 * Math.PI * 3 * iy / N);
            const off = (iy * N + ix) * 4;
            input[off]   = re;
            input[off+1] = 0.0;   // Im = 0
            input[off+2] = 0.0;
            input[off+3] = 1.0;
         }
      }

      // Upload to a texture
      const tex = createFloatTexture(N, N);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.FLOAT, input);

      // Forward FFT
      fft2D(tex, N, N, false, false);
      // Inverse FFT
      fft2D(tex, N, N, true,  false);

      // Read back
      const result = new Float32Array(size);
      const fbo = createFramebuffer(tex);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.readPixels(0, 0, N, N, gl.RGBA, gl.FLOAT, result);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(tex);

      // Compute max absolute error
      let maxErr = 0;
      for (let i = 0; i < N * N; i++) {
         const errRe = Math.abs(result[i*4]   - input[i*4]);
         const errIm = Math.abs(result[i*4+1] - input[i*4+1]);
         if (errRe > maxErr) maxErr = errRe;
         if (errIm > maxErr) maxErr = errIm;
      }

      const passed = maxErr < 1e-3;
      console.log(`GPU FFT roundtrip test (${N}×${N}): maxError=${maxErr.toExponential(3)} — ${passed ? 'PASS' : 'FAIL'}`);
      return { maxError: maxErr, passed };
   }

   //==========================================================================
   // PUBLIC API
   //==========================================================================
   
   return {
      init,
      fft2D,
      testRoundtrip,
      createFloatTexture,
      createFramebuffer,
      getContext: () => gl
   };
   
})();

// Export
if (typeof module !== 'undefined' && module.exports) {
   module.exports = GPUFFT;
}
