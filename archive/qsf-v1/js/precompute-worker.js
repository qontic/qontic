// ==========================================================================
// Web Worker: off-main-thread CDF precomputation
// Receives physics parameters and returns all CDF distributions.
// ==========================================================================

// Physics constants (same as main thread)
const hbar      = 1.054e-25;
const mElectron = 9.109e-31;
const mNeutron  = 1.67492749804e-27;
const c_light   = 300;
const epsilon   = 1;
const psiAmp    = 1;

// These are set per-message from the main thread
let k, omega, wallXWorld, sourceXWorld, sourceYWorld;
let slit1XWorld, slit1YWorld, slit2XWorld, slit2YWorld;
let slit1Open, slit2Open, whichPathDetector, particleType;
let worldCanvasDy, detectorXWorld, radiusPre;

// ============ Pure physics functions (mirrored from double-slit.js) ============

function psiPointFunction(x, y, t) {
   let r = Math.sqrt(x * x + y * y);
   r = Math.max(r, 10);
   const ph = k * r - omega * t;
   const re = psiAmp * Math.cos(ph) / r;
   const im = psiAmp * Math.sin(ph) / r;
   return { real: re, imag: im, phase: Math.atan2(im, re), psi2: re * re + im * im };
}

function psiPointFunctionDerivative(x, y, t) {
   const r2 = x * x + y * y;
   const r  = Math.sqrt(r2) || epsilon;
   const ph = k * r - omega * t;
   const re = psiAmp * Math.cos(ph) / r;
   const im = psiAmp * Math.sin(ph) / r;
   return {
      dxReal: -x * (k * r * im + re) / r2,
      dxImag: -x * (im - k * r * re) / r2,
      dyReal: -y * (k * r * im + re) / r2,
      dyImag: -y * (im - k * r * re) / r2
   };
}

function psiFunction(x, y, t) {
   if (x < wallXWorld) {
      return psiPointFunction(x - sourceXWorld, y - sourceYWorld, t);
   }
   let psi1 = 0, psi2 = 0;
   if (slit1Open) psi1 = psiPointFunction(x - slit1XWorld, y - slit1YWorld, t);
   if (slit2Open) psi2 = psiPointFunction(x - slit2XWorld, y - slit2YWorld, t);
   if (slit1Open && slit2Open) {
      const re = psi1.real + psi2.real;
      const im = psi1.imag + psi2.imag;
      return { real: re, imag: im, phase: Math.atan2(im, re), psi2: re * re + im * im };
   }
   if (slit1Open)  return psi1;
   if (slit2Open)  return psi2;
   return { real: 0, imag: 0, phase: 0, psi2: 0 };
}

function psiSingleSlit(x, y, t, slitNumber) {
   if (x < wallXWorld) return psiPointFunction(x - sourceXWorld, y - sourceYWorld, t);
   if (slitNumber === 1 && slit1Open) return psiPointFunction(x - slit1XWorld, y - slit1YWorld, t);
   if (slitNumber === 2 && slit2Open) return psiPointFunction(x - slit2XWorld, y - slit2YWorld, t);
   return { real: 0, imag: 0, phase: 0, psi2: 0 };
}

function psiFunctionDerivative(x, y, t) {
   if (x < wallXWorld) return psiPointFunctionDerivative(x - sourceXWorld, y - sourceYWorld, t);
   let d1 = 0, d2 = 0;
   if (slit1Open) d1 = psiPointFunctionDerivative(x - slit1XWorld, y - slit1YWorld, t);
   if (slit2Open) d2 = psiPointFunctionDerivative(x - slit2XWorld, y - slit2YWorld, t);
   if (slit1Open && slit2Open) {
      return { dxReal: d1.dxReal + d2.dxReal, dxImag: d1.dxImag + d2.dxImag,
               dyReal: d1.dyReal + d2.dyReal, dyImag: d1.dyImag + d2.dyImag };
   }
   if (slit1Open)  return d1;
   if (slit2Open)  return d2;
   return { dxReal: 0, dxImag: 0, dyReal: 0, dyImag: 0 };
}

function psiSingleSlitDerivative(x, y, t, slitNumber) {
   if (x < wallXWorld) return psiPointFunctionDerivative(x - sourceXWorld, y - sourceYWorld, t);
   if (slitNumber === 1 && slit1Open) return psiPointFunctionDerivative(x - slit1XWorld, y - slit1YWorld, t);
   if (slitNumber === 2 && slit2Open) return psiPointFunctionDerivative(x - slit2XWorld, y - slit2YWorld, t);
   return { dxReal: 0, dxImag: 0, dyReal: 0, dyImag: 0 };
}

function computeBohmianVelocity(x, y, t, slitNum) {
   var psi, psiDer;
   if (whichPathDetector !== 'none' && slitNum > 0 && x >= wallXWorld) {
      psi    = psiSingleSlit(x, y, t, slitNum);
      psiDer = psiSingleSlitDerivative(x, y, t, slitNum);
   } else {
      psi    = psiFunction(x, y, t);
      psiDer = psiFunctionDerivative(x, y, t);
   }
   var dirX = (psi.real * psiDer.dxImag - psi.imag * psiDer.dxReal) / psi.psi2;
   var dirY = (psi.real * psiDer.dyImag - psi.imag * psiDer.dyReal) / psi.psi2;
   let vX, vY;
   if (particleType === 'photon') {
      const mag = Math.sqrt(dirX * dirX + dirY * dirY) || epsilon;
      vX = c_light * dirX / mag;
      vY = c_light * dirY / mag;
   } else if (particleType === 'neutron') {
      vX = (hbar / mNeutron) * dirX;
      vY = (hbar / mNeutron) * dirY;
   } else {
      vX = (hbar / mElectron) * dirX;
      vY = (hbar / mElectron) * dirY;
   }
   return { vx: vX, vy: vY };
}

// ============ CDF builders ============

function buildCDF(bins, probabilities) {
   const n = bins.length;
   const total = probabilities.reduce((a, b) => a + b, 0);
   const cdf = new Float64Array(n);
   let cum = 0;
   for (let i = 0; i < n; i++) {
      cum += probabilities[i] / total;
      cdf[i] = cum;
   }
   cdf[n - 1] = 1.0;
   return { bins: bins, cdf: cdf };
}

function precomputeYArrayWithFixedX(xpos, slit, nY) {
   var yMin = 0, yMax = worldCanvasDy;
   if (slit === 1) yMax = worldCanvasDy / 2;
   else if (slit === 2) yMin = worldCanvasDy / 2;
   const dY = (yMax - yMin) / nY;
   const bins = [], probs = [];
   for (let i = 0; i < nY; i++) {
      const y = yMin + i * dY + dY / 2;
      bins.push(y);
      probs.push(psiFunction(xpos, y, 0).psi2);
   }
   return buildCDF(bins, probs);
}

function precomputeSingleSlitArray(xpos, slitNumber, nY) {
   const dY = worldCanvasDy / nY;
   const bins = [], probs = [];
   for (let i = 0; i < nY; i++) {
      const y = i * dY + dY / 2;
      bins.push(y);
      probs.push(psiSingleSlit(xpos, y, 0, slitNumber).psi2);
   }
   return buildCDF(bins, probs);
}

function precomputeXArrayWithFixedY(ypos, nX) {
   const xMin = wallXWorld, xMax = detectorXWorld;
   const dX = (xMax - xMin) / nX;
   const bins = [], probs = [];
   for (let i = 0; i < nX; i++) {
      const x = xMin + i * dX + dX / 2;
      bins.push(x);
      probs.push(psiFunction(x, ypos, 0).psi2);
   }
   return buildCDF(bins, probs);
}

function precomputePhiArrayWithFixedR(x0, y0, t, r, nPhi) {
   const phiMin = -Math.PI / 2, phiMax = Math.PI / 2;
   const dPhi = (phiMax - phiMin) / nPhi;
   const bins = [], fluxProbs = [], psi2Probs = [];
   let totalFlux = 0, totalPsi2 = 0;
   for (let i = 0; i < nPhi; i++) {
      const phi = phiMin + i * dPhi + dPhi / 2;
      bins.push(phi);
      const x = x0 + r * Math.cos(phi);
      const y = y0 + r * Math.sin(phi);
      const psi = psiFunction(x, y, t);
      const p2 = psi.psi2;
      psi2Probs.push(p2);
      totalPsi2 += p2;
      const v = computeBohmianVelocity(x, y, t);
      let fw = p2 * Math.abs(v.vx * Math.cos(phi) + v.vy * Math.sin(phi));
      if (!isFinite(fw) || fw < 0) fw = 0;
      fluxProbs.push(fw);
      totalFlux += fw;
   }
   let probs;
   if (totalFlux > 0 && isFinite(totalFlux)) probs = fluxProbs;
   else if (totalPsi2 > 0 && isFinite(totalPsi2)) probs = psi2Probs;
   else probs = new Array(nPhi).fill(1.0);
   return buildCDF(bins, probs);
}

// ============ Message handler ============

self.onmessage = function(e) {
   const p = e.data;

   // Set globals from message
   k               = p.k;
   omega           = p.omega;
   wallXWorld      = p.wallXWorld;
   sourceXWorld    = p.sourceXWorld;
   sourceYWorld    = p.sourceYWorld;
   slit1XWorld     = p.slit1XWorld;
   slit1YWorld     = p.slit1YWorld;
   slit2XWorld     = p.slit2XWorld;
   slit2YWorld     = p.slit2YWorld;
   slit1Open       = p.slit1Open;
   slit2Open       = p.slit2Open;
   whichPathDetector = p.whichPathDetector;
   particleType    = p.particleType;
   worldCanvasDy   = p.worldCanvasDy;
   detectorXWorld  = p.detectorXWorld;
   radiusPre       = p.radiusPre;

   // Run all precomputations
   const result = {
      phiArraySlit1:     precomputePhiArrayWithFixedR(slit1XWorld, slit1YWorld, 0, radiusPre, 5000),
      phiArraySlit2:     precomputePhiArrayWithFixedR(slit2XWorld, slit2YWorld, 0, radiusPre, 5000),
      detectorArray1:    precomputeYArrayWithFixedX(detectorXWorld, 1, 2000),
      detectorArray2:    precomputeYArrayWithFixedX(detectorXWorld, 2, 2000),
      singleSlitArray1:  precomputeSingleSlitArray(detectorXWorld, 1, 2000),
      singleSlitArray2:  precomputeSingleSlitArray(detectorXWorld, 2, 2000),
      boundaryDetArray1: precomputeYArrayWithFixedX(detectorXWorld, 1, 1000),
      boundaryDetArray2: precomputeYArrayWithFixedX(detectorXWorld, 2, 1000),
      boundaryTopArray:    precomputeXArrayWithFixedY(0, 1000),
      boundaryBottomArray: precomputeXArrayWithFixedY(worldCanvasDy, 1000)
   };

   // Convert Float64Arrays to regular arrays for structured clone
   for (const key in result) {
      result[key].cdf = Array.from(result[key].cdf);
   }

   self.postMessage(result);
};
