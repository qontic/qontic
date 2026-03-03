/**
 * fft2d.js
 * 
 * Simple 2D FFT implementation using Cooley-Tukey radix-2 algorithm
 * Optimized for power-of-2 dimensions
 */

const FFT2D = (function() {
   'use strict';
   
   /**
    * 1D FFT using Cooley-Tukey algorithm (radix-2, decimation-in-time)
    * @param {Float32Array} re - Real parts (length must be power of 2)
    * @param {Float32Array} im - Imaginary parts
    * @param {boolean} inverse - If true, compute inverse FFT
    */
   function fft1D(re, im, inverse) {
      const n = re.length;
      if (n <= 1) return;
      
      // Bit-reversal permutation
      let j = 0;
      for (let i = 0; i < n; i++) {
         if (i < j) {
            [re[i], re[j]] = [re[j], re[i]];
            [im[i], im[j]] = [im[j], im[i]];
         }
         let k = n >> 1;
         while (k <= j) {
            j -= k;
            k >>= 1;
         }
         j += k;
      }
      
      // Cooley-Tukey FFT
      const sign = inverse ? 1 : -1;
      for (let len = 2; len <= n; len <<= 1) {
         const halfLen = len >> 1;
         const angle = sign * 2 * Math.PI / len;
         const wlenRe = Math.cos(angle);
         const wlenIm = Math.sin(angle);
         
         for (let i = 0; i < n; i += len) {
            let wRe = 1;
            let wIm = 0;
            for (let j = 0; j < halfLen; j++) {
               const idxEven = i + j;
               const idxOdd = i + j + halfLen;
               
               const tRe = re[idxOdd] * wRe - im[idxOdd] * wIm;
               const tIm = re[idxOdd] * wIm + im[idxOdd] * wRe;
               
               re[idxOdd] = re[idxEven] - tRe;
               im[idxOdd] = im[idxEven] - tIm;
               re[idxEven] += tRe;
               im[idxEven] += tIm;
               
               const tmpRe = wRe * wlenRe - wIm * wlenIm;
               wIm = wRe * wlenIm + wIm * wlenRe;
               wRe = tmpRe;
            }
         }
      }
      
      // Normalize inverse FFT
      if (inverse) {
         const scale = 1 / n;
         for (let i = 0; i < n; i++) {
            re[i] *= scale;
            im[i] *= scale;
         }
      }
   }
   
   /**
    * 2D FFT via separable row/column transforms
    * @param {Float32Array} re - Real parts (NX×NY, row-major)
    * @param {Float32Array} im - Imaginary parts
    * @param {number} nx - Width (must be power of 2)
    * @param {number} ny - Height (must be power of 2)
    * @param {boolean} inverse - If true, compute inverse FFT
    */
   function fft2D(re, im, nx, ny, inverse) {
      // Allocate temporary row/column buffers
      const rowRe = new Float32Array(nx);
      const rowIm = new Float32Array(nx);
      const colRe = new Float32Array(ny);
      const colIm = new Float32Array(ny);
      
      // FFT each row
      for (let iy = 0; iy < ny; iy++) {
         const offset = iy * nx;
         for (let ix = 0; ix < nx; ix++) {
            rowRe[ix] = re[offset + ix];
            rowIm[ix] = im[offset + ix];
         }
         fft1D(rowRe, rowIm, inverse);
         for (let ix = 0; ix < nx; ix++) {
            re[offset + ix] = rowRe[ix];
            im[offset + ix] = rowIm[ix];
         }
      }
      
      // FFT each column
      for (let ix = 0; ix < nx; ix++) {
         for (let iy = 0; iy < ny; iy++) {
            colRe[iy] = re[iy * nx + ix];
            colIm[iy] = im[iy * nx + ix];
         }
         fft1D(colRe, colIm, inverse);
         for (let iy = 0; iy < ny; iy++) {
            re[iy * nx + ix] = colRe[iy];
            im[iy * nx + ix] = colIm[iy];
         }
      }
   }
   
   return {
      fft1D,
      fft2D
   };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
   module.exports = FFT2D;
}
