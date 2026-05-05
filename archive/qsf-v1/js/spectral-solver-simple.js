/**
 * spectral-solver-simple.js
 * 
 * Split-Step Fourier Method for 2D Schrödinger equation
 * Pure CPU implementation using fft2d.js
 * 
 * Algorithm: ψ(t+dt) = exp(-iV·dt/2ℏ) · IFFT[exp(-iℏk²·dt/2m) · FFT[exp(-iV·dt/2ℏ)·ψ(t)]]
 */

const SpectralSimple = (function() {
   'use strict';
   
   // Grid parameters  
   let NX = 256, NY = 256;
   let dx = 1.0, dy = 1.0;
   let worldXMin = 0, worldXMax = 100;
   let worldYMin = 0, worldYMax = 100;
   
   // Physics
   let hbar = 1.054e-25;  // nm²·kg/ns
   let mass = 9.109e-31;  // kg
   let dt = 1e-5;  // ns
   
   // Wave function (real and imaginary parts, flat arrays)
   let psiRe = null;
   let psiIm = null;
   
   // Potential and ABC damping
   let potential = null;  // V(x,y)
   let abcDamping = null;  // gamma(x,y) for absorbing boundaries
   let abcWidth = 20;
   
   // K-space grid (precomputed)
   let kx = null, ky = null;  // Wave vectors
   let kineticPhaseRe = null, kineticPhaseIm = null;  // exp(-iℏk²·dt/2m)
   
   // CW source
   let cwSourceActive = false;
   let cwSourceIx = 0, cwSourceIy = 0;
   let cwSourceAmp = 0, cwSourceOmega = 0;
   let cwSourceWidth = 2.5;
   let cwPhase = 0;
   
   // Statistics
   let totalSteps = 0;
   
   //==========================================================================
   // INITIALIZATION
   //==========================================================================
   
   function init(opts) {
      console.log('=== Initializing Spectral Solver (Split-Step FFT, CPU) ===');
      
      // Grid parameters
      NX = opts.nx || 256;
      NY = opts.ny || 256;
      
      // Enforce power-of-2
      if (!isPowerOf2(NX)) {
         NX = nextPowerOf2(NX);
         console.warn(`Spectral: NX must be power of 2, using ${NX}`);
      }
      if (!isPowerOf2(NY)) {
         NY = nextPowerOf2(NY);
         console.warn(`Spectral: NY must be power of 2, using ${NY}`);
      }
      
      worldXMin = opts.worldBounds.xMin;
      worldXMax = opts.worldBounds.xMax;
      worldYMin = opts.worldBounds.yMin;
      worldYMax = opts.worldBounds.yMax;
      
      dx = (worldXMax - worldXMin) / NX;
      dy = (worldYMax - worldYMin) / NY;
      
      mass = opts.particleMass || 9.109e-31;
      hbar = opts.hbar || 1.054e-25;
      abcWidth = opts.abcWidth || 20;
      
      // Time step from CFL
      const dx2 = dx * dx;
      const dy2 = dy * dy;
      dt = 0.4 * mass * Math.min(dx2, dy2) / (2 * hbar);
      
      console.log(`Spectral grid: ${NX}×${NY}, dx=${dx.toFixed(3)} nm, dy=${dy.toFixed(3)} nm`);
      console.log(`Spectral: dt=${dt.toExponential(3)} ns`);
      
      // Allocate arrays
      const size = NX * NY;
      psiRe = new Float32Array(size);
      psiIm = new Float32Array(size);
      potential = new Float32Array(size);
      abcDamping = new Float32Array(size);
      
      // Precompute k-space grid
      precomputeKSpace();
      
      // Clear field
      clearField();
      
      totalSteps = 0;
      
      console.log('Spectral solver initialized');
      return true;
   }
   
   function isPowerOf2(n) {
      return n > 0 && (n & (n - 1)) === 0;
   }
   
   function nextPowerOf2(n) {
      let p = 1;
      while (p < n) p *= 2;
      return p;
   }
   
   function precomputeKSpace() {
      console.log('Precomputing k-space grid and kinetic phases...');
      
      const dkx = 2 * Math.PI / (NX * dx);
      const dky = 2 * Math.PI / (NY * dy);
      
      kx = new Float32Array(NX);
      ky = new Float32Array(NY);
      
      // Wave vectors with FFT frequency ordering (0, 1, ..., N/2-1, -N/2, ..., -1)
      for (let ix = 0; ix < NX; ix++) {
         kx[ix] = (ix < NX/2) ? ix * dkx : (ix - NX) * dkx;
      }
      for (let iy = 0; iy < NY; iy++) {
         ky[iy] = (iy < NY/2) ? iy * dky : (iy - NY) * dky;
      }
      
      // Precompute kinetic phase factors: exp(-iℏk²·dt/2m)
      kineticPhaseRe = new Float32Array(NX * NY);
      kineticPhaseIm = new Float32Array(NX * NY);
      
      const factor = -hbar * dt / (2 * mass);
      for (let iy = 0; iy < NY; iy++) {
         for (let ix = 0; ix < NX; ix++) {
            const k2 = kx[ix]*kx[ix] + ky[iy]*ky[iy];
            const phase = factor * k2;
            const idx = iy * NX + ix;
            kineticPhaseRe[idx] = Math.cos(phase);
            kineticPhaseIm[idx] = Math.sin(phase);
         }
      }
      
      console.log(`k-space range: kx=[${kx[0].toFixed(4)}, ${kx[NX-1].toFixed(4)}], ky=[${ky[0].toFixed(4)}, ${ky[NY-1].toFixed(4)}]`);
   }
   
   //==========================================================================
   // FIELD OPERATIONS
   //==========================================================================
   
   function clearField() {
      psiRe.fill(0);
      psiIm.fill(0);
      totalSteps = 0;
      cwPhase = 0;
      console.log('Spectral: field cleared');
   }
   
   function buildPotential(opts) {
      // Build potential and ABC damping
      potential.fill(0);
      abcDamping.fill(0);
      
      // ABC profile at boundaries (f^8)
      for (let iy = 0; iy < NY; iy++) {
         for (let ix = 0; ix < NX; ix++) {
            const dLeft = ix;
            const dRight = NX - 1 - ix;
            const dBottom = iy;
            const dTop = NY - 1 - iy;
            const dMin = Math.min(dLeft, dRight, dBottom, dTop);
            
            if (dMin < abcWidth) {
               const f = dMin / abcWidth;
               abcDamping[iy * NX + ix] = 0.5 * (1.0 - Math.pow(f, 8));
            }
         }
      }
      
      console.log(`Spectral: potential built (ABC width=${abcWidth})`);
   }
   
   //==========================================================================
   // CW SOURCE
   //==========================================================================
   
   function setCWSource(opts) {
      cwSourceActive = true;
      const x = opts.x;
      const y = opts.y;
      cwSourceIx = Math.round((x - worldXMin) / dx);
      cwSourceIy = Math.round((worldYMax - y) / dy);  // Y-flip
      cwSourceAmp = (opts.amplitude !== undefined) ? opts.amplitude : 0.5;
      cwSourceOmega = opts.omega || 0.0;
      cwSourceWidth = opts.width || 2.5;
      cwPhase = 0;
      
      console.log(`Spectral CW source: grid=(${cwSourceIx}, ${cwSourceIy}), amp=${cwSourceAmp}, ω=${cwSourceOmega.toExponential(3)}`);
   }
   
   //==========================================================================
   // TIME STEPPING
   //==========================================================================
   
   function step(nSteps = 1) {
      for (let i = 0; i < nSteps; i++) {
         stepOnce();
      }
   }
   
   function stepOnce() {
      // Split-Step Fourier:
      // 1. Half-step potential + inject CW source
      // 2. FFT to k-space
      // 3. Full kinetic step in k-space
      // 4. IFFT to real space
      // 5. Half-step potential
      // 6. Apply ABC damping
      
      // Step 1: Potential half-step + CW injection
      applyPotentialPhase(0.5, true);
      
      // Step 2: FFT
      FFT2D.fft2D(psiRe, psiIm, NX, NY, false);
      
      // Step 3: Kinetic step
      applyKineticPhase();
      
      // Step 4: IFFT
      FFT2D.fft2D(psiRe, psiIm, NX, NY, true);
      
      // Step 5: Potential half-step
      applyPotentialPhase(0.5, false);
      
      // Step 6: ABC damping
      applyABCDamping();
      
      totalSteps++;
      cwPhase += cwSourceOmega * dt;
   }
   
   function applyPotentialPhase(factor, injectCW) {
      // Apply exp(-iV·factor·dt/ℏ) to (psiRe, psiIm)
      // If injectCW, also add CW source
      
      const phaseCoeff = -factor * dt / hbar;
      
      for (let iy = 0; iy < NY; iy++) {
         for (let ix = 0; ix < NX; ix++) {
            const idx = iy * NX + ix;
            
            let re = psiRe[idx];
            let im = psiIm[idx];
            
            // Inject CW source
            if (injectCW && cwSourceActive && cwSourceAmp > 0) {
               const dx2 = (ix - cwSourceIx);
               const dy2 = (iy - cwSourceIy);
               const r2 = dx2*dx2 + dy2*dy2;
               if (r2 < cwSourceWidth * cwSourceWidth * 50) {  // ~5 sigma cutoff
                  const env = Math.exp(-r2 / (2 * cwSourceWidth * cwSourceWidth));
                  re += cwSourceAmp * env * Math.cos(cwPhase);
                  im += cwSourceAmp * env * Math.sin(cwPhase);
               }
            }
            
            // Apply potential phase
            const V = potential[idx];
            if (V !== 0) {
               const phase = phaseCoeff * V;
               const cosP = Math.cos(phase);
               const sinP = Math.sin(phase);
               const newRe = re * cosP + im * sinP;
               const newIm = im * cosP - re * sinP;
               psiRe[idx] = newRe;
               psiIm[idx] = newIm;
            } else {
               psiRe[idx] = re;
               psiIm[idx] = im;
            }
         }
      }
   }
   
   function applyKineticPhase() {
      // Apply exp(-iℏk²·dt/2m) in k-space
      // Complex multiplication: ψ̃ *= exp(iφ)
      
      for (let idx = 0; idx < NX * NY; idx++) {
         const re = psiRe[idx];
         const im = psiIm[idx];
         const cosP = kineticPhaseRe[idx];
         const sinP = kineticPhaseIm[idx];
         
         psiRe[idx] = re * cosP - im * sinP;
         psiIm[idx] = re * sinP + im * cosP;
      }
   }
   
   function applyABCDamping() {
      // Apply damping: ψ *= (1 - gamma)
      for (let idx = 0; idx < NX * NY; idx++) {
         const gamma = abcDamping[idx];
         if (gamma > 0) {
            const scale = 1.0 - gamma;
            psiRe[idx] *= scale;
            psiIm[idx] *= scale;
         }
      }
   }
   
   //==========================================================================
   // READBACK
   //==========================================================================
   
   function readPsi(x, y) {
      // Bilinear interpolation
      const fx = (x - worldXMin) / dx;
      const fy = (worldYMax - y) / dy;  // Y-flip
      
      const ix0 = Math.floor(fx);
      const iy0 = Math.floor(fy);
      const ix1 = Math.min(ix0 + 1, NX - 1);
      const iy1 = Math.min(iy0 + 1, NY - 1);
      
      if (ix0 < 0 || ix0 >= NX || iy0 < 0 || iy0 >= NY) {
         return { real: 0, imag: 0, psi2: 0 };
      }
      
      const tx = fx - ix0;
      const ty = fy - iy0;
      
      // Bilinear weights
      const w00 = (1 - tx) * (1 - ty);
      const w10 = tx * (1 - ty);
      const w01 = (1 - tx) * ty;
      const w11 = tx * ty;
      
      const idx00 = iy0 * NX + ix0;
      const idx10 = iy0 * NX + ix1;
      const idx01 = iy1 * NX + ix0;
      const idx11 = iy1 * NX + ix1;
      
      const re = psiRe[idx00] * w00 + psiRe[idx10] * w10 + psiRe[idx01] * w01 + psiRe[idx11] * w11;
      const im = psiIm[idx00] * w00 + psiIm[idx10] * w10 + psiIm[idx01] * w01 + psiIm[idx11] * w11;
      
      return {
         real: re,
         imag: im,
         psi2: re * re + im * im
      };
   }
   
   function syncCPU() {
      // No-op (data already on CPU)
   }
   
   function getGridInfo() {
      return {
         nx: NX,
         ny: NY,
         dx: dx,
         dy: dy,
         dt: dt,
         worldXMin: worldXMin,
         worldXMax: worldXMax,
         worldYMin: worldYMin,
         worldYMax: worldYMax,
         totalSteps: totalSteps
      };
   }
   
   //==========================================================================
   // PUBLIC API
   //==========================================================================
   
   return {
      init,
      clearField,
      buildPotential,
      setCWSource,
      step,
      readPsi,
      syncCPU,
      getGridInfo
   };
   
})();

// Export
if (typeof module !== 'undefined' && module.exports) {
   module.exports = SpectralSimple;
}
