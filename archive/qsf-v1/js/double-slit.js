var amplitudes = [];
var yHits = [];
var detectorPsiCacheValid = false; // Flag to cache detector |ψ|² curve

// How often to recompute the full wave image while animating.
// Larger values mean fewer wave redraws (better performance)
// at the cost of slightly lower temporal resolution.
const WAVE_UPDATE_STRIDE = 2;
let waveRenderFrameCounter = 0;

// Number of cached wave frames per oscillation for dynamic
// displays (Phase / Real / Imag). After these frames have
// been computed once for a given parameter set, subsequent
// animation reuses them, so turning the wave on/off no longer
// changes simulation speed.
const WAVE_CACHE_FRAMES = 64;

// WebGL-based wave rendering (GPU path)
let useWebGLWave = false;
let waveGl = null;
let waveGlCanvas = null; // offscreen canvas used for WebGL rendering
let waveProgram = null;
let waveBuffer = null;
let waveAttribLoc = null;
let waveUniforms = {};
let wavePaletteTex = null;       // Normal mode palette texture
let wavePalette1Tex = null;      // Slit 1 wave palette texture (which-path mode)
let wavePalette2Tex = null;      // Slit 2 wave palette texture (which-path mode)
let wavePaletteSize = 0;

// Precomputed stationary wave field at t = 0 for dynamic
// visualizations (Phase, Real, Imag). This lets us avoid
// re-evaluating psiFunction(x, y, t) every frame and instead
// apply the known global time evolution analytically.
let basePsiReal = null;   // Float32Array
let basePsiImag = null;   // Float32Array
let basePsiPhase = null;  // Float32Array (phase at t=0)

var idebug=0;
var canvas;
var colorDetector="blue"
var colorHit="black"
var colorPart="red"
var colorProb="green"
var colorPsi   ="white"
var colorTraj="red"
var colorScreen="blue"
var colorSensor='#90ee90';
var colorScale="#000000"
var currentCycleIndex=10000;
var cyclePeriod=0;
var renderSetupFlag=1;
var setupCtx;
var waveCtx;
var partCtx;
var deltaTimeParticle;
var particleRate = 10; // particles per second (real time)
var lastRealTime = 0; // for tracking real elapsed time
var particleAccum = 0; // accumulated fractional particles to emit
var startRealTime = 0; // real time when simulation started (for elapsed display)

//==================================================================================================
// CDF-based sampling: replaces flat "digitized" arrays with compact
// {bins, cdf} objects.  Sampling is O(log n) via binary search instead
// of building million-entry arrays.
//==================================================================================================
function sampleFromCDF(dist) {
   const r = Math.random();
   const cdf = dist.cdf;
   const bins = dist.bins;
   // Binary search for the bin where cdf[i] >= r
   let lo = 0, hi = cdf.length - 1;
   while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1;
      else hi = mid;
   }
   // Linearly interpolate within the bin for smooth sampling
   const binWidth = bins.length > 1 ? (bins[1] - bins[0]) : 0;
   return bins[lo] + (Math.random() - 0.5) * binWidth;
}

//==================================================================================================
// Web Worker for off-main-thread precomputation
//==================================================================================================
var precomputeWorker = null;
var precomputeSeq = 0; // sequence number to discard stale results

function initPrecomputeWorker() {
   if (precomputeWorker) return;
   try {
      precomputeWorker = new Worker('js/precompute-worker.js');
   } catch(e) {
      console.warn('Web Worker not available, falling back to main thread precompute');
   }
}

function runPrecomputeAsync() {
   if (!precomputeWorker) {
      // Fallback: run on main thread
      setupGeo(true);
      return;
   }
   var seq = ++precomputeSeq;
   precomputeWorker.postMessage({
      k: k, omega: omega,
      wallXWorld: wallXWorld, sourceXWorld: sourceXWorld, sourceYWorld: sourceYWorld,
      slit1XWorld: slit1XWorld, slit1YWorld: slit1YWorld,
      slit2XWorld: slit2XWorld, slit2YWorld: slit2YWorld,
      slit1Open: slit1Open, slit2Open: slit2Open,
      whichPathDetector: whichPathDetector, particleType: particleType,
      worldCanvasDy: worldCanvasDy, detectorXWorld: detectorXWorld,
      radiusPre: radiusPre
   });
   precomputeWorker.onmessage = function(e) {
      if (seq !== precomputeSeq) return; // stale result, discard
      var r = e.data;
      // Restore Float64Arrays from transferred arrays
      phiArraySlit1     = { bins: r.phiArraySlit1.bins,     cdf: new Float64Array(r.phiArraySlit1.cdf) };
      phiArraySlit2     = { bins: r.phiArraySlit2.bins,     cdf: new Float64Array(r.phiArraySlit2.cdf) };
      detectorArray1    = { bins: r.detectorArray1.bins,    cdf: new Float64Array(r.detectorArray1.cdf) };
      detectorArray2    = { bins: r.detectorArray2.bins,    cdf: new Float64Array(r.detectorArray2.cdf) };
      singleSlitArray1  = { bins: r.singleSlitArray1.bins,  cdf: new Float64Array(r.singleSlitArray1.cdf) };
      singleSlitArray2  = { bins: r.singleSlitArray2.bins,  cdf: new Float64Array(r.singleSlitArray2.cdf) };
      boundaryDetArray1 = { bins: r.boundaryDetArray1.bins, cdf: new Float64Array(r.boundaryDetArray1.cdf) };
      boundaryDetArray2 = { bins: r.boundaryDetArray2.bins, cdf: new Float64Array(r.boundaryDetArray2.cdf) };
      boundaryTopArray    = { bins: r.boundaryTopArray.bins,    cdf: new Float64Array(r.boundaryTopArray.cdf) };
      boundaryBottomArray = { bins: r.boundaryBottomArray.bins, cdf: new Float64Array(r.boundaryBottomArray.cdf) };
   };
}

var detectorArray1;
var detectorArray2;
// Single-slit detector arrays (no interference) for which-path detector mode
var singleSlitArray1;  // Distribution from slit 1 only
var singleSlitArray2;  // Distribution from slit 2 only
// In extended backtracking mode (Only wall hits unchecked), we
// also sample endpoints on the top and bottom boundaries and
// backtrack from there toward the slits.
var boundaryDetArray1;  // y-positions along the detector line (upper half, for slit 1)
var boundaryDetArray2;  // y-positions along the detector line (lower half, for slit 2)
var boundaryTopArray;   // x-positions along the top edge (y = 0)
var boundaryBottomArray;// x-positions along the bottom edge (y = worldCanvasDy)
var detectorX;
var detectorDistance;
var detectorXWorld ;
var detectorYTop ;
var detectorYBottom ;
var detectorWidth;
var deltaT=1;
var graphPalette;
// Separate palettes for which-path detector mode (two independent waves)
var graphPaletteSlit1;  // Blue palette for slit 1 wave
var graphPaletteSlit2;  // Green palette for slit 2 wave
var hits;
var hitMax=0;
var hitWidth=0;
var altBranchHits = null;   // holds the alternative-branch hit histogram
var showAltBranch = false;  // whether to overlay the alt-branch ghost
var interpretation="Copenhagen";
var viewLocked = false; // true when URL ?mode= locks to a single view
var isAnimating = false; // Track the animation state
let sliderDragInProgress = false;     // true while a live slider is being dragged
let sliderPausedAnimation = false;    // whether animation was running when drag began
var nDetectorPixels=100;
let logNDetectorPixels;
var lastParticleTime=0;
var lastTime=0;
var lastCycleIndex=100;
var maxParticles=10000000;
var nHits=0;
var nParticles=0;
let logNBranches=0;
var maxSteps=500000;
var nSteps=0;
let logBranches = 0;
var radiusPre=5;
let r1SqMin=Infinity;
let r1SqMax=0;
let r2SqMin=Infinity;
let r2SqMax=0;
var reset=0;
var phiArraySlit1;
var phiArraySlit2;
var phiHist1;
var phiHist2;
var psiOption;
const psiAmplitude=1;
var screenHeight;
var shouldResetCache=false
var slitSeparation ;
let slit1Open = true;
let slit2Open = true;
// Which-path detector: 'none', 'slit1', or 'slit2'
// When active, interference is destroyed and waves are rendered separately
let whichPathDetector = 'none';
var slit1X ;
var slit2X ;
var slit1Y ;
var slit2Y ;
var slitWidth = 0.5;
var sourcePos ;
var sourceX ;
var sourceY ;
var sourceXWorld ;
var sourceYWorld ;
var trajectories=[];
const MAX_TRAJ_POINTS = 600; // cap stored points per trajectory to limit memory and draw cost
var time=0;
var toCanvasX;
var toCanvasY;
var toWorldX;
var toWorldY;
var wallX  ;
var wallXWorld;
var wallYTop = 0;
var wallYBottom ;
var waveDataCache={}; // Key: cycleIndex, Value: ImageData or dataURL
const MAX_WAVE_CACHE = 300; // Safety cap for cached wave images to reduce GC hiccups

// Timing averages for IT tab display
var calcTimeAccum = 0;
var stepTimeAccum = 0;
var timingSampleCount = 0;
var lastTimingUpdate = 0;
var stepsPerCycle = 0;      // Number of animation steps in one full wave period
var waveFrameIndex = 0;     // Integer frame index within the current period
var wavelength ;
var worldCanvasDx;
var worldCanvasDy;
var sensorWidth=30;
var xPre=10;
var yToBinWorld;
var yToBinCanvas;

const c = 300; // Speed of light in mm/ns
//const hbar = 1.054e-25; // Reduced Planck constant in mm^2*kg/ns
const hbar = 1.054e-25; // Reduced Planck constant in nm^2*kg/ns (1.054e-34 J*s converted to nm^2*kg/ns)
//const hbar = 6.582119e-13; // MeV*s
//const m = 9.109e-31; // Electron mass in kg (SI-compatible for hbar/m)
const mElectron = 9.109e-31; // Electron mass in kg (SI-compatible for hbar/m)
const mNeutron=1.67492749804e-27;
const epsilon = 1; // Small step to avoid division by zero
var   k ;
var   omega ;
var   particleType;

// ============ Wave mode: 'analytical' | 'numerical' (FDTD) | 'spectral' (GPU FFT) ============
let waveMode = 'analytical';
let fdtdInitialized = false;
const FDTD_NX = 256;           // FDTD grid resolution (x); NY computed for dx=dy
const FDTD_PRE_RUN_MIN = 600;   // minimum pre-run steps
const FDTD_CW_AMP = 0.05;      // CW source injection amplitude
const FDTD_CW_WIDTH = 3.0;     // CW source Gaussian width in grid cells
let fdtdStepsPerFrame = 200;   // FDTD substeps per animation frame
let spectralInitialized = false;
let spectralPreRunning  = false; // true while async pre-run is in progress
let _spectralInitGen    = 0;     // bumped each time initSpectral() starts; used to cancel stale runs
const SPECTRAL_NX = 256;        // Spectral solver grid (power of 2)
const SPECTRAL_CW_AMP = 0.05;  // CW injection amplitude
const SPECTRAL_CW_WIDTH = 3.0; // Gaussian injection width (grid cells)
const SPECTRAL_PRE_RUN_BATCH = 50; // GPU steps per async yield — keeps frame-jank < ~125 ms
let spectralStepsPerFrame = 5;    // steps per animation frame (5 = ~15 ms GPU, good fps)
let _packetStepCount  = 0;   // spectral steps taken since last packet reset
let _packetLoopSteps  = 0;   // steps for one full domain transit (computed in initSpectral)
let _packetParams     = null; // saved params for auto-loop re-injection
// 'doubleSlit'  — CW sources at each open slit, absorbing wall present
// 'pointSource' — single CW source at domain centre, free space (no wall)
let spectralScenario   = 'doubleSlit';
// 'hybrid'    — left of wall: analytical; right of wall: numerical (default)
// 'numerical' — whole domain rendered from solver buffer
// 'compare'   — left half: analytical, right half: numerical (split-screen)
// 'error'     — |ψ_num − ψ_analytic| amplitude map
let spectralRenderMode = 'hybrid';
// Source position used as analytical reference for compare/error render modes
let _spectralSrcX = 0, _spectralSrcY = 0;

//=====================================================================================================================
// Histogram class definition
//=====================================================================================================================
class Histogram {
   constructor(containerId) {
      this.containerId = containerId;
      this.bins = []; // Bin counts only
      this.minLimit = 0; // Minimum limit of histogram
      this.maxLimit = 100; // Maximum limit of histogram
      this.numBins = 10; // Default number of bins
      this.binWidth = 0; // Width of each bin
   }

   // Configure bins based on limits and number of bins
   configure(minLimit, maxLimit, numBins) {
      this.minLimit = minLimit;
      this.maxLimit = maxLimit;
      this.numBins = numBins;

      this.binWidth = (maxLimit - minLimit) / numBins; // Calculate bin width
      this.bins = Array(numBins).fill(0); // Initialize bins to zero
   }

   // Add a single data point and update the histogram
   addDataPoint(value) {
      if (value >= this.minLimit && value <= this.maxLimit) {
         const binIndex = Math.floor((value - this.minLimit) / this.binWidth);
         this.bins[binIndex]++;
      }
   }

   // Plot the histogram
   plot() {
      const $container = $(`#${this.containerId}`);
      $container.empty(); // Clear previous visualization

      const maxFrequency = Math.max(...this.bins); // Get the highest frequency for scaling

      this.bins.forEach((count, index) => {
            const binStart = this.minLimit + index * this.binWidth;
            const binEnd = binStart + this.binWidth;

            // Calculate bar height
            const barHeight = (count / maxFrequency) * 100;

            // Create bar element
            const $bar = $('<div>', {
              class: 'bar',
              style: `height: ${barHeight}%;`
             });

            // Add label to bar
            const $label = $('<div>', {
            class: 'bar-label',
             text: count
            });

            $bar.append($label);
            $container.append($bar);
      });
}
}

//==================================================================================================
// Minimal WebGL setup for GPU-based wave rendering on waveCanvas
//==================================================================================================
function initWaveWebGL() {
   const visibleCanvas = document.getElementById('waveCanvas');
   if (!visibleCanvas) return;

   // Use an offscreen canvas for WebGL so the visible canvas
   // can keep its 2D context for CPU rendering when needed.
   const glCanvas = document.createElement('canvas');
   glCanvas.width  = visibleCanvas.width;
   glCanvas.height = visibleCanvas.height;
   waveGlCanvas = glCanvas;

   const gl = glCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) || 
              glCanvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
   if (!gl) {
        console.warn('WebGL not available, keeping CPU wave rendering.');
        waveGlCanvas = null;
        return;
   }

    function compileShader(type, source) {
         const shader = gl.createShader(type);
         gl.shaderSource(shader, source);
         gl.compileShader(shader);
         if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
             console.warn('Wave shader compile error:', gl.getShaderInfoLog(shader));
             gl.deleteShader(shader);
             return null;
         }
         return shader;
    }

    const vsSource = `
         attribute vec2 a_position;
         void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
         }
    `;

   const fsSource = `
         precision mediump float;

         uniform vec2  u_canvasSize;
         uniform float u_sourceXCanvas;
         uniform float u_detectorXCanvas;
         uniform float u_toWorldX;
         uniform float u_toWorldY;

         uniform float u_sourceXWorld;
         uniform float u_sourceYWorld;
         uniform float u_wallXWorld;
         uniform float u_slit1YWorld;
         uniform float u_slit2YWorld;

         // Wave-packet style masking (CPU "continuous" option).
         // When disabled, the wave is only shown within a band of
         // radial distances around the particles, approximated by
         // r1Min/Max (from source) and r2Min/Max (from slits), with
         // additional width u_waveWidth.
         uniform int   u_waveContinuous; // 1 = always show wave
         uniform float u_r1Min;
         uniform float u_r1Max;
         uniform float u_r2Min;
         uniform float u_r2Max;
         uniform float u_waveWidth;

         uniform float u_k;
         uniform float u_omega;
         uniform float u_time;

         uniform float u_slit1Open;
         uniform float u_slit2Open;
         // 0: Phase, 1: Real, 2: Imag, 3: Psi2, 4: log(Psi2)
         uniform int   u_mode;

         // Which-path detector: 0 = none, 1 = detector at slit 1, 2 = detector at slit 2
         // When active, waves from each slit are rendered separately (no interference)
         uniform int   u_whichPathMode;
         
         // Wave visibility toggles for which-path mode
         uniform int   u_showWave1;
         uniform int   u_showWave2;
         
         // Per-wave opacity (0.0 to 1.0)
         uniform float u_wave1Opacity;
         uniform float u_wave2Opacity;

         // Alpha control from Psi^2 and UI
         // 0: flat, 1: Psi^2-based, 2: log(Psi^2)-based
         uniform int   u_alphaMode;
         uniform float u_alphaScale;

         // User-selected window on the scalar value used for
         // coloring (always interpreted in the normalized [0,1]
         // space for GPU-rendered modes).
         uniform float u_viewMin;
         uniform float u_viewMax;

         uniform sampler2D u_paletteTex;
         uniform sampler2D u_palette2Tex;  // Second palette for slit 2 wave

         const float PI = 3.14159265358979323846;

         void psiPoint(in float x, in float y, out float re, out float im) {
            float r = sqrt(x*x + y*y);
            r = max(r, 10.0); // avoid singularity near source/slits
            float phase = u_k * r - u_omega * u_time;
            re = cos(phase) / r;
            im = sin(phase) / r;
         }

         void main() {
            vec2 coord = gl_FragCoord.xy;

            // Only draw between source and detector; outside stays black
            if (coord.x < u_sourceXCanvas || coord.x > u_detectorXCanvas) {
               // Fully transparent so the page background (white)
               // shows through outside the wave region.
               gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
               return;
            }

            float xWorld = coord.x * u_toWorldX;
            // Flip Y: WebGL has origin at bottom-left, but canvas 2D has origin at top-left
            float yWorld = (u_canvasSize.y - coord.y) * u_toWorldY;

            float re = 0.0;
            float im = 0.0;

               // Optional masking based on current particle radii.
               // If waveContinuous == 0, we hide the wave except in the
               // band between the current min and max radii (plus a
               // small waveWidth margin), matching the CPU logic.
               // Skip wave packet masking in which-path mode for clearer visualization
               if (u_waveContinuous == 0 && u_whichPathMode == 0) {
                  float r; // distance from source or from the active slit

                  if (xWorld < u_wallXWorld) {
                     if (u_r1Max <= 0.0 || u_r1Min < 0.0) {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                        return;
                     }
                     float sx = xWorld - u_sourceXWorld;
                     float sy = yWorld - u_sourceYWorld;
                     r = length(vec2(sx, sy));

                     float bandMin = max(0.0, u_r1Min - u_waveWidth);
                     float bandMax = u_r1Max + u_waveWidth;
                     if (r < bandMin || r > bandMax) {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                        return;
                     }
                  } else {
                     if (u_r2Max <= 0.0 || u_r2Min < 0.0) {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                        return;
                     }

                     float ry1 = yWorld - u_slit1YWorld;
                     float ry2 = yWorld - u_slit2YWorld;
                     float rx  = xWorld - u_wallXWorld;

                     // Choose slit 1 vs slit 2 based on position and
                     // which slits are open, similar to the CPU logic.
                     if (u_slit1Open > 0.5 && (yWorld < (u_slit1YWorld + u_slit2YWorld) * 0.5 || u_slit2Open < 0.5)) {
                        r = length(vec2(rx, ry1));
                     } else {
                        r = length(vec2(rx, ry2));
                     }

                     float bandMin = max(0.0, u_r2Min - u_waveWidth);
                     float bandMax = u_r2Max + u_waveWidth;
                     if (r < bandMin || r > bandMax) {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                        return;
                     }
                  }
               }

            if (xWorld < u_wallXWorld) {
               float sx = xWorld - u_sourceXWorld;
               float sy = yWorld - u_sourceYWorld;
               psiPoint(sx, sy, re, im);
               
               // In which-path mode, show superposition of both waves before the wall too
               if (u_whichPathMode > 0) {
                  float psi2 = re*re + im*im;
                  float val = 0.0;
                  if (u_mode == 4) { // LogPsi2
                     float logv = log(psi2 + 1e-12);
                     val = (logv + 15.0) / 15.0;
                  } else if (u_mode == 3) { // Psi2
                     val = psi2 / (1.0 + psi2);
                  } else { // Phase (default)
                     float phase = atan(im, re);
                     val = (phase / PI + 1.0) * 0.5;
                  }
                  val = clamp(val, 0.0, 1.0);
                  
                  // Apply wave range slider
                  float vMin = u_viewMin;
                  float vMax = u_viewMax;
                  if (vMax <= vMin + 1e-6) { vMin = 0.0; vMax = 1.0; }
                  val = clamp((val - vMin) / (vMax - vMin), 0.0, 1.0);
                  
                  // Apply visibility toggles and user-controlled opacity
                  float opacity1 = (u_showWave1 == 1) ? u_wave1Opacity : 0.0;
                  float opacity2 = (u_showWave2 == 1) ? u_wave2Opacity : 0.0;
                  
                  // Show both colors before wall (superposition) with equal blend
                  vec3 color1 = texture2D(u_paletteTex, vec2(val, 0.5)).rgb * opacity1 * 0.5;
                  vec3 color2 = texture2D(u_palette2Tex, vec2(val, 0.5)).rgb * opacity2 * 0.5;
                  
                  vec3 color = color1 + color2;
                  gl_FragColor = vec4(color, 1.0);
                  return;
               }
            } else {
               float re1 = 0.0; float im1 = 0.0;
               float re2 = 0.0; float im2 = 0.0;
               if (u_slit1Open > 0.5) {
                  psiPoint(xWorld - u_wallXWorld, yWorld - u_slit1YWorld, re1, im1);
               }
               if (u_slit2Open > 0.5) {
                  psiPoint(xWorld - u_wallXWorld, yWorld - u_slit2YWorld, re2, im2);
               }
               
               // Which-path detector mode: render waves separately with different colors
               if (u_whichPathMode > 0) {
                  float psi2_1 = re1*re1 + im1*im1;
                  float psi2_2 = re2*re2 + im2*im2;
                  
                  // Compute palette value based on selected display mode
                  float val1 = 0.0;
                  float val2 = 0.0;
                  if (u_mode == 4) { // LogPsi2
                     val1 = (log(psi2_1 + 1e-12) + 15.0) / 15.0;
                     val2 = (log(psi2_2 + 1e-12) + 15.0) / 15.0;
                  } else if (u_mode == 3) { // Psi2
                     val1 = psi2_1 / (1.0 + psi2_1);
                     val2 = psi2_2 / (1.0 + psi2_2);
                  } else { // Phase (default)
                     float phase1 = atan(im1, re1);
                     float phase2 = atan(im2, re2);
                     val1 = (phase1 / PI + 1.0) * 0.5;
                     val2 = (phase2 / PI + 1.0) * 0.5;
                  }
                  val1 = clamp(val1, 0.0, 1.0);
                  val2 = clamp(val2, 0.0, 1.0);
                  
                  // Amplitude threshold: only show where wave is visible
                  float logVal1 = log(psi2_1 + 1e-10);
                  float logVal2 = log(psi2_2 + 1e-10);
                  float amp1 = step(-25.0, logVal1);
                  float amp2 = step(-25.0, logVal2);
                  
                  // Apply visibility toggles and user-controlled opacity
                  float opacity1 = (u_showWave1 == 1) ? u_wave1Opacity : 0.0;
                  float opacity2 = (u_showWave2 == 1) ? u_wave2Opacity : 0.0;
                  
                  // Apply wave range slider to palette lookup values
                  float vMin = u_viewMin;
                  float vMax = u_viewMax;
                  if (vMax <= vMin + 1e-6) { vMin = 0.0; vMax = 1.0; }
                  val1 = clamp((val1 - vMin) / (vMax - vMin), 0.0, 1.0);
                  val2 = clamp((val2 - vMin) / (vMax - vMin), 0.0, 1.0);
                  
                  // Use palette lookup for each wave - opacity fully controlled by slider
                  vec3 color1 = texture2D(u_paletteTex, vec2(val1, 0.5)).rgb * amp1 * opacity1;
                  vec3 color2 = texture2D(u_palette2Tex, vec2(val2, 0.5)).rgb * amp2 * opacity2;
                  
                  // Blend the two waves additively
                  vec3 color = color1 + color2;
                  
                  // Clamp color components
                  color = clamp(color, 0.0, 1.0);
                  
                  // Full opacity for which-path mode (opacity controlled via color intensity)
                  gl_FragColor = vec4(color, 1.0);
                  return;
               }
               
               re = re1 + re2;
               im = im1 + im2;
            }

            float psi2 = re*re + im*im;

            float val;
            if (u_mode == 3) { // Psi2
               val = psi2;
               val = val / (1.0 + val); // soft normalization
            } else if (u_mode == 4) { // log(Psi2)
               float logv = log(psi2 + 1e-12); // natural log
               // Map roughly [-15, 0] -> [0,1]
               val = (logv + 15.0) / 15.0;
            } else if (u_mode == 1) { // Real
               // Boost contrast so Real shows structure instead of
               // a nearly uniform value range.
               val = abs(re) * 10.0;
            } else if (u_mode == 2) { // Imag
               // Same contrast boost for Imaginary part.
               val = abs(im) * 10.0;
            } else { // Phase
               float phase = atan(im, re); // [-pi, pi]
               val = (phase / PI + 1.0) * 0.5; // -> [0,1]
            }

            // Clamp into the base [0,1] range, then apply the
            // user-selected viewing window [u_viewMin, u_viewMax]
            // and rescale that window back to [0,1] for the
            // palette lookup. This lets the UI "Wave Range"
            // slider zoom into any subrange of values.
            val = clamp(val, 0.0, 1.0);

            float vMin = u_viewMin;
            float vMax = u_viewMax;
            if (vMax <= vMin + 1e-6) {
               vMin = 0.0;
               vMax = 1.0;
            }
            float t = (val - vMin) / (vMax - vMin);
            t = clamp(t, 0.0, 1.0);

            vec4 col = texture2D(u_paletteTex, vec2(t, 0.5));

            // Simple global opacity: ignore Psi^2 and just scale by
            // the Wave Opacity slider; u_alphaMode is no longer used
            // for per-pixel modulation.
            float alpha = clamp(u_alphaScale, 0.0, 1.0);

            gl_FragColor = vec4(col.rgb, alpha);
         }
    `;

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
         console.warn('Wave program link error:', gl.getProgramInfoLog(program));
         useWebGLWave = false;
         return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Full-screen quad in clip space
    const vertices = new Float32Array([
         -1, -1,
          1, -1,
         -1,  1,
         -1,  1,
          1, -1,
          1,  1
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const attribLoc = gl.getAttribLocation(program, 'a_position');

   waveGl = gl;
   waveProgram = program;
   waveBuffer = buffer;
   waveAttribLoc = attribLoc;

    // Cache uniform locations
    const uni = name => gl.getUniformLocation(program, name);
   waveUniforms = {
         u_canvasSize:      uni('u_canvasSize'),
         u_sourceXCanvas:   uni('u_sourceXCanvas'),
         u_detectorXCanvas: uni('u_detectorXCanvas'),
         u_toWorldX:        uni('u_toWorldX'),
         u_toWorldY:        uni('u_toWorldY'),
         u_sourceXWorld:    uni('u_sourceXWorld'),
         u_sourceYWorld:    uni('u_sourceYWorld'),
         u_wallXWorld:      uni('u_wallXWorld'),
         u_slit1YWorld:     uni('u_slit1YWorld'),
         u_slit2YWorld:     uni('u_slit2YWorld'),
         u_waveContinuous:  uni('u_waveContinuous'),
         u_r1Min:           uni('u_r1Min'),
         u_r1Max:           uni('u_r1Max'),
         u_r2Min:           uni('u_r2Min'),
         u_r2Max:           uni('u_r2Max'),
         u_waveWidth:       uni('u_waveWidth'),
         u_k:               uni('u_k'),
         u_omega:           uni('u_omega'),
         u_time:            uni('u_time'),
         u_slit1Open:       uni('u_slit1Open'),
         u_slit2Open:       uni('u_slit2Open'),
         u_mode:            uni('u_mode'),
         u_whichPathMode:   uni('u_whichPathMode'),
         u_showWave1:       uni('u_showWave1'),
         u_showWave2:       uni('u_showWave2'),
         u_wave1Opacity:    uni('u_wave1Opacity'),
         u_wave2Opacity:    uni('u_wave2Opacity'),
         u_alphaMode:       uni('u_alphaMode'),
         u_alphaScale:      uni('u_alphaScale'),
         u_viewMin:         uni('u_viewMin'),
         u_viewMax:         uni('u_viewMax'),
         u_paletteTex:      uni('u_paletteTex'),
         u_palette2Tex:     uni('u_palette2Tex')
    };

   useWebGLWave = true;
   console.log('WebGL wave rendering enabled.');
}

function updateWavePaletteTexture() {
   if (!useWebGLWave || !waveGl || !graphPalette) return;

   const gl = waveGl;
   const size = graphPalette.length;
   if (size === 0) return;

   const data = new Uint8Array(size * 4);
   for (let i = 0; i < size; i++) {
      const [r, g, b] = graphPalette[i];
      const idx = i * 4;
      data[idx]   = r;
      data[idx+1] = g;
      data[idx+2] = b;
      data[idx+3] = 255;
   }

   if (!wavePaletteTex) {
      wavePaletteTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, wavePaletteTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   } else {
      gl.bindTexture(gl.TEXTURE_2D, wavePaletteTex);
   }

   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
   wavePaletteSize = size;
}

function updateWavePalette2Texture() {
   if (!useWebGLWave || !waveGl || !graphPaletteSlit2) return;

   const gl = waveGl;
   const size = graphPaletteSlit2.length;
   if (size === 0) return;

   const data = new Uint8Array(size * 4);
   for (let i = 0; i < size; i++) {
      const [r, g, b] = graphPaletteSlit2[i];
      const idx = i * 4;
      data[idx]   = r;
      data[idx+1] = g;
      data[idx+2] = b;
      data[idx+3] = 255;
   }

   if (!wavePalette2Tex) {
      wavePalette2Tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, wavePalette2Tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   } else {
      gl.bindTexture(gl.TEXTURE_2D, wavePalette2Tex);
   }

   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
}

function renderWaveWithWebGL(t, psiOptionLocal) {
    if (!useWebGLWave || !waveGl || !waveProgram) return;

   const gl = waveGl;
   if (!waveGlCanvas) return;

   gl.viewport(0, 0, waveGlCanvas.width, waveGlCanvas.height);
   gl.clearColor(0.0, 0.0, 0.0, 0.0); // transparent background
   gl.clear(gl.COLOR_BUFFER_BIT);
   
   // Enable blending for proper alpha compositing
   gl.enable(gl.BLEND);
   gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(waveProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, waveBuffer);
    gl.enableVertexAttribArray(waveAttribLoc);
    gl.vertexAttribPointer(waveAttribLoc, 2, gl.FLOAT, false, 0, 0);

   // Map current geometry & parameters into uniforms
   gl.uniform2f(waveUniforms.u_canvasSize, waveGlCanvas.width, waveGlCanvas.height);
    gl.uniform1f(waveUniforms.u_sourceXCanvas, sourceX);
    gl.uniform1f(waveUniforms.u_detectorXCanvas, detectorX);
    gl.uniform1f(waveUniforms.u_toWorldX, toWorldX);
    gl.uniform1f(waveUniforms.u_toWorldY, toWorldY);

    gl.uniform1f(waveUniforms.u_sourceXWorld, sourceXWorld);
    gl.uniform1f(waveUniforms.u_sourceYWorld, sourceYWorld);
    gl.uniform1f(waveUniforms.u_wallXWorld, wallXWorld);
    gl.uniform1f(waveUniforms.u_slit1YWorld, slit1YWorld);
    gl.uniform1f(waveUniforms.u_slit2YWorld, slit2YWorld);

   // Wave packet (continuous vs shell) controls
   const waveContinuous = $('#wave-continous').prop('checked') ? 1 : 0;
   const waveWidth = parseFloat($('#WaveWidth-input').val()) * toWorldX; // approximate in world units
   const r1Min = Math.sqrt(r1SqMin || 0);
   const r1Max = Math.sqrt(r1SqMax || 0);
   const r2Min = Math.sqrt(r2SqMin || 0);
   const r2Max = Math.sqrt(r2SqMax || 0);

   gl.uniform1i(waveUniforms.u_waveContinuous, waveContinuous);
   gl.uniform1f(waveUniforms.u_r1Min, r1Min);
   gl.uniform1f(waveUniforms.u_r1Max, r1Max);
   gl.uniform1f(waveUniforms.u_r2Min, r2Min);
   gl.uniform1f(waveUniforms.u_r2Max, r2Max);
   gl.uniform1f(waveUniforms.u_waveWidth, waveWidth);

    gl.uniform1f(waveUniforms.u_k, k);
    gl.uniform1f(waveUniforms.u_omega, omega);
    gl.uniform1f(waveUniforms.u_time, t);

    gl.uniform1f(waveUniforms.u_slit1Open, slit1Open ? 1.0 : 0.0);
   gl.uniform1f(waveUniforms.u_slit2Open, slit2Open ? 1.0 : 0.0);

   // Set which-path detector mode: 0 = none, 1 = slit1, 2 = slit2
   let whichPathModeInt = 0;
   if (whichPathDetector === 'slit1') whichPathModeInt = 1;
   else if (whichPathDetector === 'slit2') whichPathModeInt = 2;
   gl.uniform1i(waveUniforms.u_whichPathMode, whichPathModeInt);
   
   // Wave visibility toggles for which-path mode
   const showWave1 = $('#showWaveSlit1').is(':checked') ? 1 : 0;
   const showWave2 = $('#showWaveSlit2').is(':checked') ? 1 : 0;
   gl.uniform1i(waveUniforms.u_showWave1, showWave1);
   gl.uniform1i(waveUniforms.u_showWave2, showWave2);
   
   // Per-wave opacity from sliders (0-100 -> 0.0-1.0)
   const wave1OpacityRaw = parseFloat($('#wave1Opacity').val());
   const wave1Opacity = isNaN(wave1OpacityRaw) ? 0.5 : wave1OpacityRaw / 100.0;
   const wave2OpacityRaw = parseFloat($('#wave2Opacity').val());
   const wave2Opacity = isNaN(wave2OpacityRaw) ? 0.5 : wave2OpacityRaw / 100.0;
   gl.uniform1f(waveUniforms.u_wave1Opacity, wave1Opacity);
   gl.uniform1f(waveUniforms.u_wave2Opacity, wave2Opacity);

   // Choose what the palette encodes: Phase, |Psi|^2, or log(|Psi|^2).
   // QPotential is handled via the CPU path.
   let mode = 0; // 0 = Phase
   if (psiOptionLocal === 'Psi2') mode = 3;       // 3 = Psi^2
   else if (psiOptionLocal === 'LogPsi2') mode = 4; // 4 = log(Psi^2)
   gl.uniform1i(waveUniforms.u_mode, mode);

   // Map the current viewing window into [0,1] for the GPU
   // path. For all GPU modes, the scalar "val" is already
   // normalized into [0,1], so we simply window within that
   // interval.
   const gpuRange = getWaveRangeEffective();
   let gpuMin = gpuRange.min;
   let gpuMax = gpuRange.max;
   if (!isFinite(gpuMin) || !isFinite(gpuMax) || gpuMax <= gpuMin) {
      gpuMin = 0.0;
      gpuMax = 1.0;
   }
   gl.uniform1f(waveUniforms.u_viewMin, gpuMin);
   gl.uniform1f(waveUniforms.u_viewMax, gpuMax);

   let alphaScale = parseFloat($('#waveOpacity-input').val());
   if (isNaN(alphaScale)) alphaScale = 1.0;
   if (alphaScale < 0) alphaScale = 0;
   if (alphaScale > 1) alphaScale = 1;

   // Per-pixel alpha no longer depends on Psi^2; we just use the
   // global Wave Opacity slider.
   gl.uniform1i(waveUniforms.u_alphaMode, 0);
   gl.uniform1f(waveUniforms.u_alphaScale, alphaScale);

   // In which-path mode, use detector-specific palettes; otherwise use graphPalette
   if (whichPathDetector !== 'none') {
      // Update texture data first (before any unit binding)
      if (graphPaletteSlit1) updateWavePalette1Texture();
      if (graphPaletteSlit2) updateWavePalette2Texture();
      
      // Now bind textures to the correct units
      // Wave 1 palette → TEXTURE0 (u_paletteTex)
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, wavePalette1Tex);
      gl.uniform1i(gl.getUniformLocation(waveProgram, 'u_paletteTex'), 0);
      
      // Wave 2 palette → TEXTURE1 (u_palette2Tex)
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, wavePalette2Tex);
      gl.uniform1i(gl.getUniformLocation(waveProgram, 'u_palette2Tex'), 1);
   } else {
      // Normal mode: use graphPalette for texture 0
      if (wavePaletteTex) {
         const texUnit = 0;
         gl.activeTexture(gl.TEXTURE0 + texUnit);
         gl.bindTexture(gl.TEXTURE_2D, wavePaletteTex);
         const loc = gl.getUniformLocation(waveProgram, 'u_paletteTex');
         gl.uniform1i(loc, texUnit);
      }
   }

   gl.drawArrays(gl.TRIANGLES, 0, 6);

   // Blit the offscreen WebGL result into the visible 2D canvas.
   const visibleCanvas = document.getElementById('waveCanvas');
   if (visibleCanvas && waveCtx) {
      // Apply wave opacity via globalAlpha for reliable transparency
      const savedAlpha = waveCtx.globalAlpha;
      waveCtx.globalAlpha = alphaScale;
      waveCtx.drawImage(waveGlCanvas, 0, 0, visibleCanvas.width, visibleCanvas.height);
      waveCtx.globalAlpha = savedAlpha;
   }
}

//==================================================================================================================
//
//==================================================================================================================
function lcg(seed) {
   let state = seed;
   return function() {
      state = (1664525 * state + 1013904223) % 4294967296; // LCG formula
      return state / 4294967296; // Normalize to [0, 1)
   };
}

const random = lcg(55142);
//==================================================================================================================
//
//==================================================================================================================
function drawPaletteScale(palette, minValue, maxValue) {
   // Hide dual palette canvases when using single palette mode
   $('#paletteScaleCanvas1').hide();
   $('#paletteScaleCanvas2').hide();
   $('#paletteScaleCanvas').show();
   
   const canvasIds = ['paletteScaleCanvas', 'openPaletteBtn'];
   canvasIds.forEach(id => {
    const $canvasElem = $('#' + id);
    $canvasElem.empty?.(); // only if it's a jQuery canvas wrapper

    const canvas = document.getElementById(id);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if ( id == "paletteScaleCanvas" ) {
       for (let i = 0; i < height; i++) {
          const t = 1 - i / height;
          const [r, g, b] = window.paletteModule.getColorForValue(t, palette);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(0, i, width, 1);
       }

       ctx.fillStyle = 'black';
       ctx.font = '12px sans-serif';
       ctx.textAlign = 'left';
       ctx.textBaseline = 'top';
       ctx.fillText(maxValue.toFixed(2), 2, 2);
       ctx.textBaseline = 'bottom';
       ctx.fillText(minValue.toFixed(2), 2, height - 2);
    }
    else {
       for (let i = 0; i < width; i++) {
          const t = i / width; // left = min, right = max
          const [r, g, b] = window.paletteModule.getColorForValue(t, palette);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(i, 0, 1, height); // draw vertical strip
       }
    }
  });
}
//==================================================================================================================
// Draw dual palette scale bars for which-path detector mode (two half-height bars)
//==================================================================================================================
function drawDualPaletteScale(palette1, palette2, minValue, maxValue) {
   // Hide the single palette scale, show the dual ones
   $('#paletteScaleCanvas').hide();
   const canvas1 = document.getElementById('paletteScaleCanvas1');
   const canvas2 = document.getElementById('paletteScaleCanvas2');
   if (!canvas1 || !canvas2) return;
   $(canvas1).show();
   $(canvas2).show();

   // Wave 1 (top half) — palette for slit 1
   const ctx1 = canvas1.getContext('2d');
   const w1 = canvas1.width, h1 = canvas1.height;
   ctx1.clearRect(0, 0, w1, h1);
   for (let i = 0; i < h1; i++) {
      const t = 1 - i / h1;
      const [r, g, b] = window.paletteModule.getColorForValue(t, palette1);
      ctx1.fillStyle = `rgb(${r},${g},${b})`;
      ctx1.fillRect(0, i, w1, 1);
   }
   ctx1.fillStyle = 'black';
   ctx1.font = '11px sans-serif';
   ctx1.textAlign = 'left';
   ctx1.textBaseline = 'top';
   ctx1.fillText(maxValue.toFixed(2), 2, 2);
   ctx1.textBaseline = 'bottom';
   ctx1.fillText(minValue.toFixed(2), 2, h1 - 2);

   // Wave 2 (bottom half) — palette for slit 2
   const ctx2 = canvas2.getContext('2d');
   const w2 = canvas2.width, h2 = canvas2.height;
   ctx2.clearRect(0, 0, w2, h2);
   for (let i = 0; i < h2; i++) {
      const t = 1 - i / h2;
      const [r, g, b] = window.paletteModule.getColorForValue(t, palette2);
      ctx2.fillStyle = `rgb(${r},${g},${b})`;
      ctx2.fillRect(0, i, w2, 1);
   }
   ctx2.fillStyle = 'black';
   ctx2.font = '11px sans-serif';
   ctx2.textAlign = 'left';
   ctx2.textBaseline = 'top';
   ctx2.fillText(maxValue.toFixed(2), 2, 2);
   ctx2.textBaseline = 'bottom';
   ctx2.fillText(minValue.toFixed(2), 2, h2 - 2);
}
//==================================================================================================================
// Draw the palette 2 preview canvas for slit 2 wave in detector mode
//==================================================================================================================
function drawPalette2Canvas() {
   const canvas = document.getElementById('openPalette2Btn');
   if (!canvas || !graphPaletteSlit2) return;

   const ctx = canvas.getContext('2d');
   const width = canvas.width;
   const height = canvas.height;

   ctx.clearRect(0, 0, width, height);

   for (let i = 0; i < width; i++) {
      const t = i / width;
      const [r, g, b] = window.paletteModule.getColorForValue(t, graphPaletteSlit2);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(i, 0, 1, height);
   }
}
//==================================================================================================================
// Draw the palette 1 preview canvas for slit 1 wave in detector mode
//==================================================================================================================
function drawPalette1Canvas() {
   const canvas = document.getElementById('openPalette1Btn');
   if (!canvas || !graphPaletteSlit1) return;

   const ctx = canvas.getContext('2d');
   const width = canvas.width;
   const height = canvas.height;

   ctx.clearRect(0, 0, width, height);

   for (let i = 0; i < width; i++) {
      const t = i / width;
      const [r, g, b] = window.paletteModule.getColorForValue(t, graphPaletteSlit1);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(i, 0, 1, height);
   }
}
//==================================================================================================================
// Update WebGL texture for wave 1 palette (slit 1)
//==================================================================================================================
function updateWavePalette1Texture() {
   if (!useWebGLWave || !waveGl || !graphPaletteSlit1) return;

   const gl = waveGl;
   const size = graphPaletteSlit1.length;
   if (size === 0) return;

   const data = new Uint8Array(size * 4);
   for (let i = 0; i < size; i++) {
      const [r, g, b] = graphPaletteSlit1[i];
      const idx = i * 4;
      data[idx]   = r;
      data[idx+1] = g;
      data[idx+2] = b;
      data[idx+3] = 255;
   }

   if (!wavePalette1Tex) {
      wavePalette1Tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, wavePalette1Tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   } else {
      gl.bindTexture(gl.TEXTURE_2D, wavePalette1Tex);
   }

   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
}
//==================================================================================================================
// Wave value range: UI + mapping state
//==================================================================================================================
// The wave (both GPU and CPU paths) ultimately maps some scalar
// value into [0,1] for palette lookup. We keep track of the
// auto-detected full range for the current view and a user-
// selected subrange (via the double slider in the Graphics tab).

let waveRangeAutoMin = 0.0;
let waveRangeAutoMax = 1.0;
let waveRangeUserMin = null;
let waveRangeUserMax = null;
let waveRangeLockedByUser = false; // becomes true once the user moves the slider
const WAVE_RANGE_SLIDER_MAX = 1000;

function setWaveRangeAuto(min, max) {
   if (!isFinite(min) || !isFinite(max) || max <= min) {
      return;
   }

   waveRangeAutoMin = min;
   waveRangeAutoMax = max;

   if (!waveRangeLockedByUser) {
      waveRangeUserMin = min;
      waveRangeUserMax = max;
   } else {
      // Clamp existing user window into the new auto-range.
      waveRangeUserMin = Math.max(min, Math.min(max, waveRangeUserMin));
      waveRangeUserMax = Math.max(min, Math.min(max, waveRangeUserMax));
      if (waveRangeUserMax <= waveRangeUserMin) {
         waveRangeUserMin = min;
         waveRangeUserMax = max;
      }
   }

   updateWaveRangeSliderUI();
}

function getWaveRangeEffective() {
   const vMin = (waveRangeUserMin != null) ? waveRangeUserMin : waveRangeAutoMin;
   const vMax = (waveRangeUserMax != null) ? waveRangeUserMax : waveRangeAutoMax;
   return { min: vMin, max: vMax };
}

function formatWaveRangeValue(v) {
   if (!isFinite(v)) return '—';
   const av = Math.abs(v);
   if (av >= 1e3 || (av > 0 && av < 1e-2)) {
      return v.toExponential(2);
   }
   return v.toFixed(2);
}

function updateWaveRangeLabel() {
   let r = getWaveRangeEffective();

   // Present the slider limits in physically meaningful units
   // where possible, based on the current wave display mode.
   const mode = $('#waveFunctionOption').val();

   if (mode === 'Phase') {
      // Under the hood, Phase uses a normalized value in [0,1];
      // map this back to an effective phase range [0, 2π] for
      // display so the user sees familiar phase units.
      const twoPi = 2 * Math.PI;
      r = {
         min: r.min * twoPi,
         max: r.max * twoPi
      };
   } else if (mode === 'LogPsi2') {
      // The GPU path for log(|Psi|^2) uses a fixed mapping from
      // the natural log of Psi^2 (roughly [-15,0]) into [0,1].
      // Approximate a physical log10(|Psi|^2) scale for the
      // labels so the range is more interpretable than 0..1.
      const toLog10 = 1.0 / Math.log(10.0);
      r = {
         min: (r.min * 15.0 - 15.0) * toLog10,
         max: (r.max * 15.0 - 15.0) * toLog10
      };
   }

   const text = `${formatWaveRangeValue(r.min)} - ${formatWaveRangeValue(r.max)}`;
   $('#waveRangeLabel').text(text);
}

function updateWaveRangeSliderUI() {
   const $slider = $('#paletteRangeSlider');
   if (!$slider.length) return;

   const range = waveRangeAutoMax - waveRangeAutoMin;
   if (!isFinite(range) || range <= 0) return;

   const v0 = (waveRangeUserMin - waveRangeAutoMin) / range;
   const v1 = (waveRangeUserMax - waveRangeAutoMin) / range;
   const s0 = Math.round(Math.max(0, Math.min(1, v0)) * WAVE_RANGE_SLIDER_MAX);
   const s1 = Math.round(Math.max(0, Math.min(1, v1)) * WAVE_RANGE_SLIDER_MAX);

   $slider.slider('option', 'values', [s0, s1]);
   updateWaveRangeLabel();
}

function initWaveRangeSlider() {
   const $slider = $('#paletteRangeSlider');
   if (!$slider.length || $slider.data('qsf-range-init')) return;

   $slider.slider({
      orientation: 'vertical',
      range: true,
      min: 0,
      max: WAVE_RANGE_SLIDER_MAX,
      values: [0, WAVE_RANGE_SLIDER_MAX],
      slide: function (_event, ui) {
         const frac0 = ui.values[0] / WAVE_RANGE_SLIDER_MAX;
         const frac1 = ui.values[1] / WAVE_RANGE_SLIDER_MAX;
         const range = waveRangeAutoMax - waveRangeAutoMin;
         if (!isFinite(range) || range <= 0) return;

         waveRangeUserMin = waveRangeAutoMin + frac0 * range;
         waveRangeUserMax = waveRangeAutoMin + frac1 * range;
         waveRangeLockedByUser = true;

         updateWaveRangeLabel();

         // Re-render the wave using the existing cached scalar
         // data but with the new window; animation state is
         // preserved.
         if (!isAnimating) {
            renderWaveFunction(currentCycleIndex);
         }
      }
   });

   $slider.data('qsf-range-init', true);
   updateWaveRangeSliderUI();
}
//==================================================================================================================
//
//==================================================================================================================
function createParameterInput(containerId, id, label, min, max, step, value, units, updateCounter) {
   var container = $('<div>', { class: 'input-group', id: id + '-group' });
   var inputLabel = $('<label>', { for: id, text: label + ':' });
   var rangeInput = $('<input>', { type: 'range', id: id, min: min, max: max, step: step, value: value });
   var numberInput = $('<input>', { type: 'number', id: id + '-input', min: min, max: max, step: step, value: value });
   var unitSelect = $('<select>', { id: id + '-units' });

   units.forEach(function(unit) {
         unitSelect.append($('<option>', { value: unit.value, text: unit.text }));
         });

   // Support both standard containers (id-parameter-container) and direct IDs (opacity-box)
   var containerA = $('#'+containerId+"-parameter-container");
   if (containerA.length === 0) {
      containerA = $('#'+containerId);
   }

   // Provide richer tooltips for compact labels
   const labelTitles = {
      'slit-separation' : 'Slit Separation',
      'source-position' : 'Source Position',
      'detector-distance' : 'Detector Distance',
      'screen-height' : 'Screen Height',
      'det-pixels' : 'Detector Pixels',
      'wavelength' : 'Wavelength',
      'particleRate' : 'Number of particles injected per second in real time (your clock, not simulation time)',
      'MaxPart' : 'Maximum Number of Particles',
      'animationStep' : 'Simulation Speed Multiplier',
      'WaveWidth' : 'Wave Packet Width',
      'waveOpacity' : 'Wave Opacity',
      'trajOpacity' : 'Trajectory/Particle Opacity'
   };
   if (labelTitles[id]) {
      inputLabel.attr('data-tip', labelTitles[id]);
   }

   container.append(inputLabel, rangeInput, numberInput, unitSelect);
   //$('#detector-parameter-container').append(container);
   containerA.append(container);

   function scaleValue(value, unit) {
      var selectedUnit = units.find(u => u.value === unit);
      return value / selectedUnit.scale;
   }

   function unscaleValue(value, unit) {
      var selectedUnit = units.find(u => u.value === unit);
      return value * selectedUnit.scale;
   }

   function formatScientific(value) {
      return value.toExponential(2);
   }
   
   // Smart formatting: use 1% resolution to determine decimal places
   function formatSmart(value) {
      if (value === 0) return '0';
      const absValue = Math.abs(value);
      // 1% of value determines precision needed
      const resolution = absValue * 0.01;
      if (resolution >= 1) {
         return Math.round(value).toString();
      } else if (resolution >= 0.1) {
         return value.toFixed(1);
      } else if (resolution >= 0.01) {
         return value.toFixed(2);
      } else {
         return value.toFixed(3);
      }
   }

   function updateInputs() {
      var unit = $('#' + id + '-units').val();
      var value = parseFloat($('#' + id).val());
      var scaledValue = scaleValue(value, unit);
      var formattedValue = scaledValue;

      if (Math.abs(scaledValue) >= 1e5 || Math.abs(scaledValue) < 1e-2) {
         formattedValue = formatScientific(scaledValue);
      } else {
         formattedValue = formatSmart(scaledValue);
      }
      if ( id=="MaxPart" ) formattedValue=scaledValue.toFixed(0);// fix for maxpart
      if ( id=="WaveWidth" ) formattedValue=scaledValue.toFixed(0);// fix for maxpart
      if ( id=="det-pixels" ) formattedValue=scaledValue.toFixed(0);// fix for det-pixels

      $('#' + id + '-input').val(formattedValue);
      $('#' + id + '-input').attr('step', (1 / scaleValue(step, unit)).toFixed(6));

      // Update the counter if needed
      //if (updateCounter ) {
      //   reset = 1; 
      //}
   }

   function getValueInFirstUnit() {
      var firstUnit = units[0].value;
      var value = parseFloat($('#' + id).val());
      return scaleValue(value, firstUnit);
   }

   function setValueInFirstUnit(val) {
      var firstUnit = units[0].value;
      var rawVal = unscaleValue(val, firstUnit);
      $('#' + id).val(rawVal);
      $('#' + id + '-input').val(rawVal);
   }

   // Attach the getValueInFirstUnit function to the container element
   container[0].getValueInFirstUnit = getValueInFirstUnit;
   container[0].setValueInFirstUnit = setValueInFirstUnit;

   $('#' + id + '-units').on('change', function() {
         updateInputs();
         const liveIds = ['slit-separation','source-position','detector-distance','screen-height','wavelength','WaveWidth'];
         if (liveIds.includes(id)) {
            // Treat unit changes like a small geometry edit.
            if (!sliderDragInProgress) {
               // Do not auto-resume animation here; this is a
               // one-shot adjustment.
                  setupGeo(false); // cheap geometry update
                  hits = new Array(nDetectorPixels).fill(0);
                  nHits = 0;
                  hitMax = 0;
                  // Recompute only detector probability & related visuals
                  renderDetectorAndHistogram();
            }
         }
         });

      // Update value and, for selected sliders, redraw continuously while dragging
   $('#' + id).on('input', async function() {
         updateInputs();
         const liveIds = ['slit-separation','source-position','detector-distance','screen-height','wavelength','WaveWidth'];
         if (liveIds.includes(id)) {
            // On first movement, pause animation if it was running.
            if (!sliderDragInProgress) {
               sliderDragInProgress = true;
               sliderPausedAnimation = isAnimating;
               if (isAnimating) {
                  $('#startButton').trigger('click'); // stops animation
               }
            }

            // For clarity, always clear hits, particles, and the
            // existing wave image while the slider is being adjusted,
            // regardless of whether this is the first input event.
            hits = new Array(nDetectorPixels).fill(0);
            nHits = 0;
            hitMax = 0;
            trajectories.length = 0;
            nParticles = 0;
            if (partCtx && canvas) {
               partCtx.clearRect(0, 0, canvas.width, canvas.height);
            }
            waveDataCache = {};
            if (waveCtx && canvas) {
               waveCtx.clearRect(0, 0, canvas.width, canvas.height);
            }

            // While dragging, cheaply update geometry and redraw the
            // setup (including detector position) plus the detector
            // probability curve and wave so geometry and wave stay
            // visually in sync.
            setupGeo(false);
            await renderSetup();
            await renderDetectorAndHistogram();

            // Re-render wave for the new geometry if enabled.
            if ($("#plot_wave").is(':checked')) {
               await renderWaveFunction(currentCycleIndex);
            }
         }
         });

   $('#' + id).on('change', function() {
      if (updateCounter ) {
        reset=1;
      }

      const liveIds = ['slit-separation','source-position','detector-distance','screen-height','wavelength','WaveWidth'];
      if (liveIds.includes(id)) {
         // Slider released: redraw immediately with cheap geometry,
         // then run the expensive precomputation in the background.
         setupGeo(false); // fast: geometry only, no precompute
         hits = new Array(nDetectorPixels).fill(0);
         nHits = 0;
         hitMax = 0;
         
         (async function() {
            await drawSystem(0);
            // Resume animation right away so the user sees motion
            if (sliderDragInProgress && sliderPausedAnimation) {
               isAnimating = true;
               $('#startButton').text('Stop');
               evolveSystem();
            }
            sliderDragInProgress = false;
            sliderPausedAnimation = false;
            // Now do the heavy precomputation off the main thread
            runPrecomputeAsync();
         })();
      }
   });


   $('#' + id + '-input').on('input', function() {
         var unit = $('#' + id + '-units').val();
         var unscaledValue = unscaleValue(parseFloat($(this).val()), unit);
         $('#' + id).val(unscaledValue).trigger('input');
         });
   
   $('#' + id + '-input').on('change', function() {
         var unit = $('#' + id + '-units').val();
         var unscaledValue = unscaleValue(parseFloat($(this).val()), unit);
         $('#' + id).val(unscaledValue).trigger('change');
         });

   updateInputs();
}
//==================================================================================================================
// Create a mirror slider that stays in sync with an existing parameter input
//==================================================================================================================
function createMirrorSlider(containerId, originalId, label) {
   const mirId = 'mirror-' + originalId;
   const $orig  = $('#' + originalId);
   const $origNum = $('#' + originalId + '-input');
   const $origUnit = $('#' + originalId + '-units');
   if (!$orig.length) return;       // original doesn't exist yet

   const min  = $orig.attr('min');
   const max  = $orig.attr('max');
   const step = $orig.attr('step');
   const val  = $orig.val();

   const $container = $('<div>', { class: 'input-group mirror-slider' });
   const $label   = $('<label>', { for: mirId, text: label + ':' });
   const $range   = $('<input>', { type: 'range', id: mirId, min: min, max: max, step: step, value: val });
   const $number  = $('<input>', { type: 'number', id: mirId + '-input', min: min, max: max, step: step });
   // Clone unit select
   const $unit = $origUnit.clone().attr('id', mirId + '-units');

   $container.append($label, $range, $number, $unit);
   $('#' + containerId).append($container);

   // Copy tooltip from original
   const origTip = $('#' + originalId + '-group label').attr('data-tip');
   if (origTip) $label.attr('data-tip', origTip);

   // --- Sync logic ---
   function origToMirror() {
      const rawVal = $orig.val();
      $range.val(rawVal);
      // Format number the same way the original does
      $number.val($origNum.val());
      $unit.val($origUnit.val());
   }

   function mirrorToOrig() {
      const rawVal = $range.val();
      $orig.val(rawVal).trigger('input');
   }

   // Mirror → original
   $range.on('input', mirrorToOrig);
   $range.on('change', function () {
      $orig.val($range.val()).trigger('change');
   });
   $number.on('change', function () {
      // Push value through the original's number input path
      const unit = $unit.val();
      $origUnit.val(unit);
      $origNum.val($number.val()).trigger('change');
   });
   $unit.on('change', function () {
      $origUnit.val($unit.val()).trigger('change');
      origToMirror();
   });

   // Original → mirror (listen on both input and change)
   $orig.on('input.mirror change.mirror', origToMirror);
   $origUnit.on('change.mirror', origToMirror);

   // Initial sync
   origToMirror();
}
//==================================================================================================================
//
//==================================================================================================================
function updateParameter(id, newMin, newMax, newStep, newValue) {
   // Update range input
   $('#' + id)
      .attr('min', newMin)
      .attr('max', newMax)
      .attr('step', newStep)
      .val(newValue);

   // Update number input
   $('#' + id + '-input')
      .attr('min', newMin)
      .attr('max', newMax)
      .attr('step', newStep)
      .val(newValue);

   // Trigger update to ensure formatting & scaling refreshes
   $('#' + id).trigger('input');
}
//==================================================================================================================
// Native color chooser using a hidden <input type="color">
//==================================================================================================================
function chooseColor(callback) {
   let $input = $('#_qsfColorPicker');
   if (!$input.length) {
      $input = $('<input>', {
         type: 'color',
         id: '_qsfColorPicker',
         // Keep it in the middle of the viewport but invisible
         style: 'position:fixed; left:50%; top:50%; transform:translate(-50%, -50%); width:1px; height:1px; opacity:0; z-index:2000; border:none; padding:0; margin:0;'
      });
      $('body').append($input);
   }

   // Remove any previous handlers so each open uses a fresh callback
   $input.off('input change');

   $input.on('input change', function () {
      const color = $(this).val();
      if (color) {
         callback(color);
      }
   });

   const inputEl = $input[0];
   if (inputEl.showPicker) {
      inputEl.showPicker();
   } else {
      // Fallback for browsers without showPicker
      $input.trigger('click');
   }
}
//=============================================================================================           
//
//=============================================================================================           
function getRGBComponents(color) {
   const dummy = $('<div></div>').css('color', color).appendTo('body');
   const computedColor = dummy.css('color');
   dummy.remove();

   // Expected format: "rgb(r, g, b)"
   const matches = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
   if (matches) {
      return {
red: parseInt(matches[1]),
        green: parseInt(matches[2]),
        blue: parseInt(matches[3])
      };
   } else {
      return null; // fallback for non-RGB formats
   }
}
//====================================================================================================
//
//====================================================================================================
function psiPointFunction(x, y, t) {
   let r = Math.sqrt(x ** 2 + y ** 2 )  ; // Avoid r=0
   r = Math.max(r,10);
   const phaseLocal = k * r - omega * t;
   const psiReal = psiAmplitude * Math.cos(phaseLocal) / r;
   const psiImag = psiAmplitude * Math.sin(phaseLocal) / r;

   return {
         real: psiReal,
         imag: psiImag,
         phase: Math.atan2(psiImag, psiReal),
         psi2:  psiReal ** 2 + psiImag ** 2
   };
}
//====================================================================================================
//
//====================================================================================================
function psiPointFunctionDerivative(x, y, t) {
   const r2 = x ** 2 + y ** 2 ; 
   const r  = Math.sqrt(r2) || epsilon ; // Avoid r=0
   const phaseLocal = k * r - omega * t;

   const psiReal = psiAmplitude * Math.cos(phaseLocal) / r;
   const psiImag = psiAmplitude * Math.sin(phaseLocal) / r;

   var dxReal = -x * ( k * r * psiImag + psiReal)/r2; 
   var dxImag = -x * ( psiImag - k * r * psiReal)/r2; 

   var dyReal = -y * ( k * r * psiImag + psiReal)/r2; 
   var dyImag = -y * ( psiImag - k * r * psiReal)/r2; 


   return {
           dxReal: dxReal,
           dxImag: dxImag,
           dyReal: dyReal,
           dyImag: dyImag
   };
}
//============================================================================================================
//
//============================================================================================================
function psiFunctionDerivative(x, y, t) {
   // In numerical mode, read gradient from the FDTD grid (detector side)
   if (waveMode === 'numerical' && fdtdInitialized && x >= wallXWorld) {
      return FDTD.readPsiGradient(x, y);
   }
   // In spectral mode, approximate gradient via finite differences
   if (waveMode === 'spectral' && spectralInitialized && x >= wallXWorld) {
      const eps = SpectralSolver.getGridInfo().dx;
      const px = SpectralSolver.readPsi(x + eps, y);
      const mx = SpectralSolver.readPsi(x - eps, y);
      const py = SpectralSolver.readPsi(x, y + eps);
      const my = SpectralSolver.readPsi(x, y - eps);
      return {
         dxReal: (px.real - mx.real) / (2 * eps),
         dxImag: (px.imag - mx.imag) / (2 * eps),
         dyReal: (py.real - my.real) / (2 * eps),
         dyImag: (py.imag - my.imag) / (2 * eps)
      };
   }

   // Analytical Huygens-Fresnel model
   if (x < wallXWorld) {
      var xx = x - sourceXWorld;
      var yy = y - sourceYWorld;
      return psiPointFunctionDerivative(xx, yy, t) ;
   } else {
      // Double slit calculation

      let dpsi1 = 0;
      if ( slit1Open ) {
         let x1 = (x-slit1XWorld)
         let y1 = (y-slit1YWorld)
         dpsi1 = psiPointFunctionDerivative(x1, y1, t) ;
      }

      let dpsi2= 0;
      if ( slit2Open ) {
         let x2 = (x-slit2XWorld)
         let y2 = (y-slit2YWorld)
         dpsi2= psiPointFunctionDerivative(x2, y2, t) ;
      }

      if ( slit1Open & slit2Open ) {
         return {
              dxReal: dpsi1.dxReal + dpsi2.dxReal,
              dxImag: dpsi1.dxImag + dpsi2.dxImag,
              dyReal: dpsi1.dyReal + dpsi2.dyReal,
              dyImag: dpsi1.dyImag + dpsi2.dyImag
         };
      }
      else if (  slit1Open & !slit2Open ) return dpsi1;
      else if ( !slit1Open &  slit2Open ) return dpsi2;
      else return { dxReal: 0., dxImag: 0., dyReal: 0., dyImag: 0.  };

   }
}
//============================================================================================================
//
//============================================================================================================
function psiFunction(x, y, t) {
   // In numerical mode, read from the FDTD grid (detector side)
   if (waveMode === 'numerical' && fdtdInitialized && x >= wallXWorld) {
      return FDTD.readPsi(x, y);
   }
   // In spectral mode, read from the spectral solver
   if (waveMode === 'spectral' && spectralInitialized && x >= wallXWorld) {
      const p = SpectralSolver.readPsi(x, y);
      return { real: p.real, imag: p.imag, phase: Math.atan2(p.imag, p.real), psi2: p.psi2 };
   }

   // Analytical Huygens-Fresnel model
   if (x < wallXWorld) {
      // Source point calculation
      var xx = x - sourceXWorld;
      var yy = y - sourceYWorld;
      return psiPointFunction(xx, yy, t) ;
   } else {
      // Double slit calculation

      let psi1 = 0;
      if ( slit1Open ) {
         let x1 = (x-slit1XWorld)
         let y1 = (y-slit1YWorld)
         psi1   = psiPointFunction(x1, y1, t) ;
      }

      let psi2= 0;
      if ( slit2Open ) {
         let x2 = (x-slit2XWorld)
         let y2 = (y-slit2YWorld)
         psi2   = psiPointFunction(x2, y2, t) ;
      }

      // Combine contributions
      if ( slit1Open & slit2Open ) {
         const psiReal    = psi1.real + psi2.real;
         const psiImag    = psi1.imag + psi2.imag;
         const phaseFinal = Math.atan2(psiImag, psiReal);

         return {
            real: psiReal,
            imag: psiImag,
            phase: phaseFinal,
            psi2: psiReal ** 2 + psiImag ** 2
         };
      }
      else if (  slit1Open & !slit2Open ) return psi1;
      else if ( !slit1Open &  slit2Open ) return psi2;
      else return { real: 0., imag: 0., phase: 0., psi2: 0.  };

   }
}

//============================================================================================================
// Compute wave function for a single slit only (no interference)
// Used when which-path detector is active
//============================================================================================================
function psiSingleSlit(x, y, t, slitNumber) {
   if (x < wallXWorld) {
      var xx = x - sourceXWorld;
      var yy = y - sourceYWorld;
      return psiPointFunction(xx, yy, t);
   } else {
      if (slitNumber === 1 && slit1Open) {
         let x1 = (x - slit1XWorld);
         let y1 = (y - slit1YWorld);
         return psiPointFunction(x1, y1, t);
      } else if (slitNumber === 2 && slit2Open) {
         let x2 = (x - slit2XWorld);
         let y2 = (y - slit2YWorld);
         return psiPointFunction(x2, y2, t);
      } else {
         return { real: 0., imag: 0., phase: 0., psi2: 0. };
      }
   }
}

//============================================================================================================
// Compute wave function derivative for a single slit only (no interference)
// Used when which-path detector is active
//============================================================================================================
function psiSingleSlitDerivative(x, y, t, slitNumber) {
   if (x < wallXWorld) {
      var xx = x - sourceXWorld;
      var yy = y - sourceYWorld;
      return psiPointFunctionDerivative(xx, yy, t);
   } else {
      if (slitNumber === 1 && slit1Open) {
         let x1 = (x - slit1XWorld);
         let y1 = (y - slit1YWorld);
         return psiPointFunctionDerivative(x1, y1, t);
      } else if (slitNumber === 2 && slit2Open) {
         let x2 = (x - slit2XWorld);
         let y2 = (y - slit2YWorld);
         return psiPointFunctionDerivative(x2, y2, t);
      } else {
         return { dxReal: 0., dxImag: 0., dyReal: 0., dyImag: 0. };
      }
   }
}

//===============================================================================================================
//
//===============================================================================================================
function computeBohmianVelocity(x, y, t, slitNum ) {

   var psi, psiDer;
   
   // In which-path detector mode, particles are guided by single-slit wave function
   // Only when slitNum is explicitly set (> 0) and particle has crossed the wall
   if (whichPathDetector !== 'none' && slitNum > 0 && x >= wallXWorld) {
      psi    = psiSingleSlit(x, y, t, slitNum);
      psiDer = psiSingleSlitDerivative(x, y, t, slitNum);
   } else {
      psi    = psiFunction(x, y, t);
      psiDer = psiFunctionDerivative(x, y, t);
   }

   var directionX = (psi.real*psiDer.dxImag-psi.imag*psiDer.dxReal)/psi.psi2;
   var directionY = (psi.real*psiDer.dyImag-psi.imag*psiDer.dyReal)/psi.psi2;

   let vX, vY;

   if (particleType === 'photon') {
      // Normalize velocity to speed of light (c)
      const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2) || epsilon; // Avoid division by zero
      vX = (c * directionX) / magnitude; 
      vY = (c * directionY) / magnitude;
   } else if (particleType === 'electron') {
      // Electrons: Bohmian velocity v = - (hbar / m) * grad(phase)
      vX = (hbar / mElectron) * directionX;
      vY = (hbar / mElectron) * directionY;
   } else if (particleType === 'neutron') {
      // Electrons: Bohmian velocity v = - (hbar / m) * grad(phase)
      vX = (hbar / mNeutron) * directionX;
      vY = (hbar / mNeutron) * directionY;
   }


   return { vx: vX, vy: vY };
} 
//===============================================================================================================
//
//===============================================================================================================
function computeQuantumPotential(x, y, t) {
   const dx = 0.001;
   const dy = 0.001;

   const rMin=10;
   rSource = Math.sqrt(Math.pow(x-sourceXWorld,2)+ Math.pow(y-sourceYWorld,2));  
   if ( rSource < rMin ) {
      x = sourceXWorld+rMin;
      y = sourceYWorld+rMin;
   }

   rSlit1 = Math.sqrt(Math.pow(x-wallXWorld,2)+ Math.pow(y-slit1YWorld,2));  
   if ( rSlit1 < rMin ) {
      if ( x < wallXWorld ) x = wallXWorld-rMin;
      else                  x = wallXWorld+rMin;
      y = slit1YWorld+rMin;
   }

   rSlit2 = Math.sqrt(Math.pow(x-wallXWorld,2)+ Math.pow(y-slit2YWorld,2));  
   if ( rSlit2 < rMin ) {
      if ( x < wallXWorld ) x = wallXWorld-rMin;
      else                  x = wallXWorld+rMin;
      y = slit2YWorld+rMin;
   }

   const psiCenter = psiFunction(x, y, t);
   const R = Math.sqrt(psiCenter.psi2);

   const psiLeft   = psiFunction(x - dx, y, t);
   const psiRight  = psiFunction(x + dx, y, t);
   const psiUp     = psiFunction(x, y + dy, t);
   const psiDown   = psiFunction(x, y - dy, t);

   const Rxx = (Math.sqrt(psiLeft.psi2) - 2 * R + Math.sqrt(psiRight.psi2)) / (dx * dx);
   const Ryy = (Math.sqrt(psiDown.psi2) - 2 * R + Math.sqrt(psiUp.psi2)) / (dy * dy);

   const laplacianR = Rxx + Ryy;

   const Q = - (hbar * hbar / (2 * mElectron)) * (laplacianR / (R + epsilon));


   if ( Q > 0 ) return  Math.log10(Q);
   else         return -Math.log10(-Q);

}
//===============================================================================================================
//
//===============================================================================================================
function getSlitPosition(traj, detectorArray, slitNum) {
   xn = detectorXWorld; 
   yn = sampleFromCDF(detectorArray);
   traj.del=2;  
   // Set the slit number for the trajectory
   if (slitNum) traj.slitNum = slitNum;
   stepSize=1;
   var nSubSteps=1000;

   var tl = time;
   for ( var iss = 0 ; iss < nSubSteps ; iss++ ) {
      var bv = computeBohmianVelocity( xn, yn, tl, slitNum ) ;
      var bv2 = Math.sqrt(bv.vx*bv.vx+bv.vy*bv.vy) || epsilon ;
      var dtl = stepSize/bv2;
      xn = xn - bv.vx * dtl;
      yn = yn - bv.vy * dtl;
      tl = tl -dtl;
      if ( xn < wallXWorld + xPre  ) {
         break;
      }
   }
   return { x: xn, y: yn };
}
//===============================================================================================================
// Generic helper: backtrack from an arbitrary boundary point (xStart,yStart)
// toward the slits by integrating the Bohmian velocity field backwards in
// time until we are just behind the wall.
//===============================================================================================================
function backtrackFromPoint(xStart, yStart, slitNum) {
   let xn = xStart;
   let yn = yStart;
   let tl = time;
   const stepSize = 1;
   const nSubSteps = 1000;

   for (let iss = 0; iss < nSubSteps; iss++) {
      const bv = computeBohmianVelocity(xn, yn, tl, slitNum);
      const bv2 = Math.sqrt(bv.vx * bv.vx + bv.vy * bv.vy) || epsilon;
      const dtl = stepSize / bv2;
      xn = xn - bv.vx * dtl;
      yn = yn - bv.vy * dtl;
      tl = tl - dtl;
      if (xn < wallXWorld + xPre) {
         break;
      }
   }
   return { x: xn, y: yn };
}
//==============================================================================================================
//
//==============================================================================================================
function precomputeYArrayWithFixedX( xpos, slit, nY) {
   const yBins = [];
   const probabilities = [];

   // slit == 0  -> full vertical range [0, worldCanvasDy]
   // slit == 1  -> upper half    [0, worldCanvasDy/2]
   // slit == 2  -> lower half    [worldCanvasDy/2, worldCanvasDy]
   var yMin = 0;
   var yMax = worldCanvasDy;
   if ( slit == 1 ) {
      yMax = worldCanvasDy/2;
   } else if ( slit == 2 ) {
      yMin = worldCanvasDy/2;
   }
   const dY   = (yMax-yMin) / nY;
   const x    = xpos;

   // Step 1: Calculate |ψ|² for each bin
   let totalProbability = 0;
   for (let i = 0; i < nY; i++) {
      const y = yMin + i * dY + dY / 2;
      yBins.push(y);

      const psi = psiFunction(x, y, 0);
      const amplitude = psi.psi2;

      probabilities.push(amplitude);
      totalProbability += amplitude;
   }

   // Step 2: Build cumulative distribution function
   const cdf = new Float64Array(nY);
   let cumulative = 0;
   for (let i = 0; i < nY; i++) {
      cumulative += probabilities[i] / totalProbability;
      cdf[i] = cumulative;
   }
   cdf[nY - 1] = 1.0; // ensure no floating-point undershoot

   return { bins: yBins, cdf: cdf };
}
//==============================================================================================================
// Precompute single-slit |Psi|^2-weighted samples (no interference)
// Used for which-path detector mode
//==============================================================================================================
function precomputeSingleSlitArray(xpos, slitNumber, nY) {
   const yBins = [];
   const probabilities = [];

   var yMin = 0;
   var yMax = worldCanvasDy;
   const dY = (yMax - yMin) / nY;
   const x = xpos;

   let totalProbability = 0;
   for (let i = 0; i < nY; i++) {
      const y = yMin + i * dY + dY / 2;
      yBins.push(y);

      const psi = psiSingleSlit(x, y, 0, slitNumber);
      const amplitude = psi.psi2;

      probabilities.push(amplitude);
      totalProbability += amplitude;
   }

   const cdf = new Float64Array(nY);
   let cumulative = 0;
   for (let i = 0; i < nY; i++) {
      cumulative += probabilities[i] / totalProbability;
      cdf[i] = cumulative;
   }
   cdf[nY - 1] = 1.0;

   return { bins: yBins, cdf: cdf };
}
//==============================================================================================================
// Precompute |Psi|^2-weighted samples along a horizontal line y = const
// between the wall and detector. This mirrors precomputeYArrayWithFixedX
// but for the top/bottom boundaries.
//==============================================================================================================
function precomputeXArrayWithFixedY( ypos, nX) {
   const xBins = [];
   const probabilities = [];

   const y = ypos;
   const xMin = wallXWorld;
   const xMax = detectorXWorld;
   const dX   = (xMax - xMin) / nX;

   let totalProbability = 0;
   for (let i = 0; i < nX; i++) {
      const x = xMin + i * dX + dX / 2;
      xBins.push(x);

      const psi = psiFunction(x, y, 0);
      const amplitude = psi.psi2;

      probabilities.push(amplitude);
      totalProbability += amplitude;
   }

   const cdf = new Float64Array(nX);
   let cumulative = 0;
   for (let i = 0; i < nX; i++) {
      cumulative += probabilities[i] / totalProbability;
      cdf[i] = cumulative;
   }
   cdf[nX - 1] = 1.0;

   return { bins: xBins, cdf: cdf };
}
//==============================================================================================================
//
//==============================================================================================================
function precomputePhiArrayWithFixedR( x0, y0, t, r, nPhi) {
   const phiBins = [];
   const fluxProbabilities = [];
   const psi2Probabilities = [];

   var phiEdge=0;
   const phiMin = -Math.PI / 2+phiEdge ;
   const phiMax =  Math.PI / 2-phiEdge ;
   const dPhi = (phiMax-phiMin) / nPhi;

   // Step 1: Calculate amplitudes and probabilities for each phi bin
   let totalFluxProb = 0;
   let totalPsi2Prob = 0;
   for (let i = 0; i < nPhi; i++) {
      const phi = phiMin + i * dPhi + dPhi / 2;
      phiBins.push(phi);

      const x = x0 + r * Math.cos(phi);
      const y = y0 + r * Math.sin(phi);

      const psi = psiFunction(x, y, t);
      const psi2 = psi.psi2;
      psi2Probabilities.push(psi2);
      totalPsi2Prob += psi2;

      const v = computeBohmianVelocity(x, y, t);
      const vRadial = v.vx * Math.cos(phi) + v.vy * Math.sin(phi);
      let fluxWeight = psi2 * Math.abs(vRadial);
      if (!isFinite(fluxWeight) || fluxWeight < 0) fluxWeight = 0;

      fluxProbabilities.push(fluxWeight);
      totalFluxProb += fluxWeight;
   }

   // Step 2: Choose flux-based or |psi|^2 probabilities
   let probabilities;
   if (totalFluxProb > 0 && isFinite(totalFluxProb)) {
      probabilities = fluxProbabilities;
   } else if (totalPsi2Prob > 0 && isFinite(totalPsi2Prob)) {
      probabilities = psi2Probabilities;
   } else {
      probabilities = new Array(nPhi).fill(1.0);
   }
   const totalProb = probabilities.reduce((a, b) => a + b, 0);

   // Step 3: Build CDF
   const cdf = new Float64Array(nPhi);
   let cumulative = 0;
   for (let i = 0; i < nPhi; i++) {
      cumulative += probabilities[i] / totalProb;
      cdf[i] = cumulative;
   }
   cdf[nPhi - 1] = 1.0;

   return { bins: phiBins, cdf: cdf };
}
//==============================================================================================================
//
//==============================================================================================================
// State version: increment when defaults/units change to clear old saved state
const SIMULATION_STATE_VERSION = 13;

function getSimulationState() {
  paletteName = window.paletteModule.getCurrentPaletteName();
  return {
    version: SIMULATION_STATE_VERSION,
    nDetectorPixels: nDetectorPixels,
    wavelength: $('#wavelength-group')[0].getValueInFirstUnit(),
    slitSeparation: $('#slit-separation-group')[0].getValueInFirstUnit(),
    sourcePosition: $('#source-position-group')[0].getValueInFirstUnit(),
    detectorDistance: $('#detector-distance-group')[0].getValueInFirstUnit(),
    screenHeight: $('#screen-height-group')[0].getValueInFirstUnit(),
    particleRate: $('#particleRate-input').val(),
    particleType: $('#particleType').val(),
    waveFunctionOption: $('#waveFunctionOption').val(),
    waveWidth: $('#WaveWidth').val(),
    waveContinous: $('#wave-continous').prop('checked'),
    paletteName: paletteName,
    interpretation: interpretation,
    colors: {
      hit: colorHit,
      prob: colorProb,
      part: colorPart,
      traj: colorTraj,
      scale: colorScale,
      detector: colorDetector,
      screen: colorScreen,
      sensor: colorSensor,
      psi: colorPsi
    },
    slit1Open,
    slit2Open,
    displayOptions: {
      hits: $("#plot_hits").is(":checked"),
      particles: $("#plot_particles").is(":checked"),
      trajectories: $("#plot_trajectories").is(":checked"),
      screen: $("#plot_screen").is(":checked"),
      detector: $("#plot_detector").is(":checked"),
      scales: $("#plot_scales").is(":checked"),
      wave: $("#plot_wave").is(":checked"),
      sensor: $("#plot_sensor").is(":checked"),
      palette: $("#plot_palette").is(":checked"),
      probCurve: $("#hit_prob").is(":checked")
    }
  };
}
//==============================================================================================================
//
//==============================================================================================================
function saveSimulationState() {
  const state = getSimulationState();
  localStorage.setItem('doubleSlitState', JSON.stringify(state));
}
//==============================================================================================================
//
//==============================================================================================================
function restoreSimulationState() {
  const saved = localStorage.getItem('doubleSlitState');

  if (!saved) return;

  const state = JSON.parse(saved);

  // Clear old state if version doesn't match (units changed from mm to nm)
  if (!state.version || state.version < SIMULATION_STATE_VERSION) {
    localStorage.removeItem('doubleSlitState');
    console.log('Cleared old simulation state (version mismatch)');
    return;
  }

  updateParameter('wavelength', 1, 500, 1, state.wavelength);
  updateParameter('slit-separation', 0, 2000, 1, state.slitSeparation);
  updateParameter('source-position', 0, 1000, 1, state.sourcePosition);
  updateParameter('detector-distance', 0, 1000, 1, state.detectorDistance);
  updateParameter('det-pixels', 10, 500, 1, state.nDetectorPixels);
  updateParameter('screen-height', 100, 5000, 10, state.screenHeight);
  updateParameter('WaveWidth', 1, 200, 1, state.waveWidth);
  if (state.particleRate) {
    updateParameter('particleRate', 1, 100, 1, state.particleRate);
  }

  $('#wave-continous').prop('checked', state.waveContinous);

  $('#particleType').val(state.particleType).trigger('change');
  $('#waveFunctionOption').val(state.waveFunctionOption).trigger('change');

  if (state.paletteName && window.paletteModule.setPaletteByName) {
    window.paletteModule.setPaletteByName(state.paletteName);
      // Ensure the GPU palette texture matches the restored palette
      // so the wave colors and the palette swatch stay consistent
      // after a page refresh.
      if (useWebGLWave) {
         updateWavePaletteTexture();
      }
  }

  Object.entries(state.colors).forEach(([key, value]) => {
    const id = `#${key}-color`;
    $(id).css('background-color', value);
    window[`color${key.charAt(0).toUpperCase() + key.slice(1)}`] = value;
  });

  slit1Open = state.slit1Open;
  slit2Open = state.slit2Open;
  updateSlitButton();

  if (state.displayOptions) {
    Object.entries(state.displayOptions).forEach(([key, value]) => {
      $(`#plot_${key}`).prop("checked", value);
    });
    $("#hit_prob").prop("checked", state.displayOptions.probCurve);
  }

  if (state.interpretation) {
    interpretation = state.interpretation;
    updateViewButton();
  }
}
//==============================================================================================================
//
//==============================================================================================================
function setupGeo(doPrecompute) {

   // Invalidate detector |ψ|² cache when geometry changes
   detectorPsiCacheValid = false;

   wavelength        = parseFloat($('#wavelength-group')[0].getValueInFirstUnit());
   screenHeight      = parseFloat($('#screen-height-group')[0].getValueInFirstUnit());
   nDetectorPixels   = parseFloat($('#det-pixels-group')[0].getValueInFirstUnit());
   wallWidth   = 5;

   particleType = $("#particleType").val();

   // Get parameter values
   sourcePos      = parseFloat($('#source-position-group')[0].getValueInFirstUnit());
   slitSeparation = parseFloat($('#slit-separation-group')[0].getValueInFirstUnit());
   detectorDistance = parseFloat($('#detector-distance-group')[0].getValueInFirstUnit());

   // Wavelength in mm
   k = 2 * Math.PI / wavelength; // Wave number in mm^-1
   // Angular frequency (omega)

   let mass=mElectron;
   if ( particleType == "neutron" )  mass=mNeutron

   omega = particleType === 'photon' ? k * c : 0.5 * hbar * k * k / mass;

   var waveSpeed = omega/k;
   // waveSpeed is in nm/ns which equals m/s (1 nm/ns = 1e-9 m / 1e-9 s = 1 m/s)
   if (waveSpeed >= 1e6) {
      $('#waveSpeed').text((waveSpeed / 1e6).toFixed(2) + " Mm/s");
   } else if (waveSpeed >= 1000) {
      $('#waveSpeed').text((waveSpeed / 1000).toFixed(2) + " km/s");
   } else {
      $('#waveSpeed').text(waveSpeed.toFixed(2) + " m/s");
   }

   // Calculate and display particle energy in eV
   // E = h²/(2mλ²) where h = 6.626e-34 J·s, λ in meters
   // For λ in nm: E(eV) = 1.505/λ² for electrons, 8.18e-4/λ² for neutrons
   var energyEV = 0;
   if (wavelength > 0) {
      if (particleType === 'photon') {
         // E = hc/λ, with λ in nm: E(eV) = 1239.8/λ
         energyEV = 1239.8 / wavelength;
      } else if (particleType === 'neutron') {
         // E(eV) = h²/(2m_n λ²) = 8.18e-4 / λ² (λ in nm)
         energyEV = 8.18e-4 / (wavelength * wavelength);
      } else {
         // Electron: E(eV) = 1.505 / λ² (λ in nm)
         energyEV = 1.505 / (wavelength * wavelength);
      }
   }
   
   // Format energy display with appropriate units
   var energyText;
   if (!isFinite(energyEV) || energyEV <= 0) {
      energyText = "0 eV";
   } else if (energyEV >= 1000) {
      energyText = (energyEV / 1000).toFixed(2) + " keV";
   } else if (energyEV >= 1) {
      energyText = energyEV.toFixed(2) + " eV";
   } else if (energyEV >= 0.001) {
      energyText = (energyEV * 1000).toFixed(2) + " meV";
   } else {
      energyText = energyEV.toExponential(2) + " eV";
   }
   $('#particleEnergy').text(energyText);

   // Transform world coordinates to canvas coordinates
   var canvasWidth = canvas.width;
   var canvasHeight = canvas.height;

   if ( $("#plot_sensor").is(':checked') > 0 ) sensorWidth=30;
   else                                        sensorWidth=0;

   worldCanvasDx = 1.4 * (sourcePos + detectorDistance)+sensorWidth;
   worldCanvasDy = screenHeight;

   slitWidth = 0.01 * screenHeight;

   yToBinWorld  = nDetectorPixels / worldCanvasDy; 
   yToBinCanvas = nDetectorPixels / canvas.height; 

   toCanvasX = canvasWidth/worldCanvasDx;
   toCanvasY = canvasHeight/worldCanvasDy;

   canvasSpeedX = waveSpeed*toCanvasX;
   canvasSpeedY = waveSpeed*toCanvasY;
   canvasSpeed = Math.max(canvasSpeedX,canvasSpeedY);

   cyclePeriod=2.*Math.PI/omega;
   // Initial estimate
   deltaT = 2./canvasSpeed;
   // Adjust deltaT so cyclePeriod / deltaT is an integer
   // Guard against nStepsPerCycle=0 when the wave period is shorter than deltaT
   // (can happen at very short λ), which would make deltaT = cyclePeriod/0 = Infinity.
   let nStepsPerCycle = Math.round(cyclePeriod / deltaT);
   if (nStepsPerCycle < 1) nStepsPerCycle = 1;
   deltaT = cyclePeriod / nStepsPerCycle;

   // Store globally so the animation loop can use a clean
   // integer frame index per cycle (avoids float modulo glitches).
   stepsPerCycle = nStepsPerCycle;
   waveFrameIndex = 0;


   toWorldX = 1./toCanvasX;
   toWorldY = 1./toCanvasY;

   sourceX = canvasWidth * 0.1;
   sourceY = canvasHeight / 2;

   sourceXWorld = sourceX * toWorldX;
   sourceYWorld = sourceY * toWorldY;

   wallX      = sourceX + sourcePos * toCanvasX;
   wallXWorld = wallX*toWorldX;
   wallYBottom = canvasHeight;

   detectorXWorld = wallXWorld + detectorDistance ;
   detectorX      = detectorXWorld * toCanvasX;

   slit1Y = (canvasHeight / 2) - (slitSeparation * toCanvasY / 2);
   slit2Y = (canvasHeight / 2) + (slitSeparation * toCanvasY / 2);

   slit1YWorld = slit1Y*toWorldY;
   slit2YWorld = slit2Y*toWorldY;

   slit1XWorld = wallXWorld;
   slit2XWorld = wallXWorld;

   detectorYTop = 0;
   detectorYBottom = canvasHeight;

   // Heavy precomputations used for hit resampling and some
   // optimizations. Skip these when doPrecompute === false so
   // slider drags can update geometry cheaply.
   if (doPrecompute !== false) {
      phiArraySlit1 = precomputePhiArrayWithFixedR(slit1XWorld, slit1YWorld, 0, radiusPre, 5000) ;
      phiArraySlit2 = precomputePhiArrayWithFixedR(slit2XWorld, slit2YWorld, 0, radiusPre, 5000) ;

      detectorArray1 = precomputeYArrayWithFixedX(detectorXWorld, 1, 2000) ;
      detectorArray2 = precomputeYArrayWithFixedX(detectorXWorld, 2, 2000) ;

      // Single-slit distributions for which-path detector mode (no interference)
      singleSlitArray1 = precomputeSingleSlitArray(detectorXWorld, 1, 2000);
      singleSlitArray2 = precomputeSingleSlitArray(detectorXWorld, 2, 2000);

      // Extended endpoint distributions for the non-only-wall
      // backtracking mode. We split by slit so that slit 1 uses
      // upper detector half + top edge, and slit 2 uses lower
      // detector half + bottom edge.
      boundaryDetArray1   = precomputeYArrayWithFixedX(detectorXWorld, 1, 1000);
      boundaryDetArray2   = precomputeYArrayWithFixedX(detectorXWorld, 2, 1000);
      boundaryTopArray    = precomputeXArrayWithFixedY(0,              1000);
      boundaryBottomArray = precomputeXArrayWithFixedY(worldCanvasDy,  1000);
   }

   // When in numerical mode, rebuild the FDTD grid to match
   // the new geometry (slit positions, wavelength, etc.).
   if (waveMode === 'numerical' && fdtdInitialized && doPrecompute !== false) {
      restartFDTD();
   }
   // When in spectral mode, re-initialize to match new geometry.
   if (waveMode === 'spectral' && spectralInitialized && doPrecompute !== false) {
      initSpectral();
   }

}
//===========================================================================================================
//
//===========================================================================================================
async function renderSetup() {
   setupCtx.clearRect(0, 0, canvas.width, canvas.height);

   setupCtx.strokeStyle = 'black';
   setupCtx.fillStyle = 'black';
   // Draw point source dot — use actual spectral source position in pointSource mode
   const _dotX = (waveMode === 'spectral' && spectralScenario === 'pointSource')
      ? _spectralSrcX * toCanvasX
      : sourceX;
   const _dotY = (waveMode === 'spectral' && spectralScenario === 'pointSource')
      ? _spectralSrcY * toCanvasY
      : sourceY;
   setupCtx.beginPath();
   setupCtx.arc(_dotX, _dotY, 5, 0, 2 * Math.PI);
   setupCtx.fill();

   // Get particle injection rate (particles per second in real time)
   particleRate = parseFloat($('#particleRate-input').val()) || 10;

   var slitWidthCanvas = slitWidth*toCanvasY;

   // In free-space point-source mode there is no wall — skip the screen entirely
   const _showWall = !(waveMode === 'spectral' && spectralScenario === 'pointSource');
   if ( $("#plot_screen").is(':checked') > 0 && _showWall ) {
      // Draw wall with slits
      setupCtx.strokeStyle = colorScreen; // Set the color of the line
      setupCtx.beginPath();
      setupCtx.lineWidth = wallWidth;
      setupCtx.moveTo(wallX, wallYTop);
      if ( slit1Open ) {
         setupCtx.lineTo(wallX, slit1Y-slitWidthCanvas);
         setupCtx.moveTo(wallX, slit1Y+slitWidthCanvas);
      } 
      if ( slit2Open ) {
         setupCtx.lineTo(wallX, slit2Y-slitWidthCanvas);
         setupCtx.moveTo(wallX, slit2Y+slitWidthCanvas);
      }
      setupCtx.lineTo(wallX, wallYBottom);
      setupCtx.stroke();

      // Draw which-path detector box if active
      if (whichPathDetector !== 'none') {
         const detBoxWidth = 24;
         const detBoxHeight = slitWidthCanvas * 5;
         // Position to the right of the wall but not overlapping the slit
         const detBoxX = wallX + 6;
         // Limit how far right it can go (don't overlap screen)
         const maxDetBoxX = detectorX - detBoxWidth - 10;
         const finalDetBoxX = Math.min(detBoxX, maxDetBoxX);
         let detBoxY;
         if (whichPathDetector === 'slit1') {
            // Position above slit 1 (not blocking it)
            detBoxY = slit1Y - slitWidthCanvas - detBoxHeight - 2;
         } else {
            // Position below slit 2 (not blocking it)
            detBoxY = slit2Y + slitWidthCanvas + 2;
         }
         setupCtx.strokeStyle = colorDetector;
         setupCtx.lineWidth = 2;
         setupCtx.strokeRect(finalDetBoxX, detBoxY, detBoxWidth, detBoxHeight);
         // Fill with semi-transparent version of detector color
         const detRgb = getRGBComponents(colorDetector);
         setupCtx.fillStyle = `rgba(${detRgb.red}, ${detRgb.green}, ${detRgb.blue}, 0.3)`;
         setupCtx.fillRect(finalDetBoxX, detBoxY, detBoxWidth, detBoxHeight);
      }
   }


   if ( $("#plot_detector").is(':checked') > 0 ) {
      // Draw detector
      setupCtx.lineWidth = wallWidth;
      setupCtx.strokeStyle = colorDetector; // Set the color of the line
      detectorX = detectorXWorld * toCanvasX;
      detectorWidth = canvas.width - detectorX - sensorWidth;
      setupCtx.beginPath();
      setupCtx.moveTo(detectorX, detectorYTop);
      setupCtx.lineTo(detectorX, detectorYBottom);
      setupCtx.stroke();
   }


   setupCtx.lineWidth = 1;
   if ( $("#plot_scales").is(':checked') > 0 ) {
      // Draw X and Y scale indicators in top-left corner
      const scaleOriginX = 10;
      const scaleOriginY = 10;
      scaleLengthX = worldCanvasDx/10; // Reduced by half for smaller scale

      magnitude = Math.pow(10, Math.floor(Math.log10(scaleLengthX)));
      scaleLengthX = Math.round(scaleLengthX / magnitude) * magnitude;

      scaleLengthY = worldCanvasDy/5; 
      let magnitudeY = Math.pow(10, Math.floor(Math.log10(scaleLengthY)));
      scaleLengthY = Math.round(scaleLengthY / magnitudeY) * magnitudeY;

      // Calculate the background box dimensions
      const bgPadding = 6;
      // Width: max of horizontal scale or vertical label text width (~60px for "200 nm")
      const bgWidth = Math.max(scaleLengthX * toCanvasX, 55) + bgPadding + 8;
      const bgHeight = scaleLengthY * toCanvasY + 28;
      
      // Draw semi-transparent background for scale visibility
      // Use light bg for dark theme (white text), dark bg for light theme (black text)
      const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
      setupCtx.fillStyle = isDarkTheme ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)';
      setupCtx.beginPath();
      const bgX = scaleOriginX - bgPadding;
      const bgY = scaleOriginY - bgPadding;
      const bgR = 5; // border radius
      setupCtx.moveTo(bgX + bgR, bgY);
      setupCtx.lineTo(bgX + bgWidth - bgR, bgY);
      setupCtx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + bgR);
      setupCtx.lineTo(bgX + bgWidth, bgY + bgHeight - bgR);
      setupCtx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - bgR, bgY + bgHeight);
      setupCtx.lineTo(bgX + bgR, bgY + bgHeight);
      setupCtx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - bgR);
      setupCtx.lineTo(bgX, bgY + bgR);
      setupCtx.quadraticCurveTo(bgX, bgY, bgX + bgR, bgY);
      setupCtx.closePath();
      setupCtx.fill();

      // Helper to format length with appropriate units (nm base)
      function formatLength(val) {
         if (val >= 1e6) return (val / 1e6).toFixed(0) + ' mm';
         if (val >= 1e3) return (val / 1e3).toFixed(0) + ' µm';
         return val.toFixed(0) + ' nm';
      }

      // Determine scale color based on current theme
      const scaleColor = isDarkTheme ? '#ffffff' : '#000000';
      setupCtx.strokeStyle = scaleColor;
      setupCtx.fillStyle = scaleColor;
      setupCtx.lineWidth = 1;
      setupCtx.font = '11px sans-serif';
      setupCtx.textAlign = 'left';
      setupCtx.textBaseline = 'top';

      // X-axis scale (horizontal)
      setupCtx.beginPath();
      setupCtx.moveTo(scaleOriginX, scaleOriginY);
      setupCtx.lineTo(scaleOriginX + scaleLengthX*toCanvasX, scaleOriginY);
      setupCtx.stroke();
      setupCtx.moveTo(scaleOriginX, scaleOriginY+3);
      setupCtx.lineTo(scaleOriginX, scaleOriginY-3);
      setupCtx.stroke();
      setupCtx.moveTo(scaleOriginX+scaleLengthX*toCanvasX, scaleOriginY+3);
      setupCtx.lineTo(scaleOriginX+scaleLengthX*toCanvasX, scaleOriginY-3);
      setupCtx.stroke();

      // X label centered below the line
      setupCtx.textAlign = 'center';
      setupCtx.fillText(formatLength(scaleLengthX), scaleOriginX + 0.5 * scaleLengthX * toCanvasX, scaleOriginY + 6);

      // Y-axis scale (vertical)
      setupCtx.beginPath();
      var yshift = 18;
      setupCtx.moveTo(scaleOriginX, scaleOriginY + yshift);
      setupCtx.lineTo(scaleOriginX, scaleOriginY + yshift + scaleLengthY * toCanvasY);
      setupCtx.stroke();
      setupCtx.moveTo(scaleOriginX + 3, scaleOriginY + yshift);
      setupCtx.lineTo(scaleOriginX - 3, scaleOriginY + yshift);
      setupCtx.stroke();
      setupCtx.moveTo(scaleOriginX - 3, scaleOriginY + yshift + scaleLengthY * toCanvasY);
      setupCtx.lineTo(scaleOriginX + 3, scaleOriginY + yshift + scaleLengthY * toCanvasY);
      setupCtx.stroke();

      // Y label to the right of the line so it doesn't overlap
      setupCtx.textAlign = 'left';
      setupCtx.fillText(formatLength(scaleLengthY), scaleOriginX + 8, scaleOriginY + yshift + 0.5 * scaleLengthY * toCanvasY - 6);
      }


      if (phiHist1 && typeof phiHist1.plot === 'function') {
         phiHist1.plot();
      }
      if (phiHist2 && typeof phiHist2.plot === 'function') {
         phiHist2.plot();
      }
}
//==================================================================================================================
//
//==================================================================================================================
async function renderTrajectoriesAndParticles() {

   partCtx.clearRect(0, 0, canvas.width, canvas.height);
   const showTrajectories = $("#plot_trajectories").is(":checked");
   const showParticles    = $("#plot_particles").is(":checked");

   // Global opacity for trajectories and particles
   let trajAlphaScale = parseFloat($('#trajOpacity-input').val());
   if (isNaN(trajAlphaScale)) trajAlphaScale = 1.0;
   trajAlphaScale = Math.max(0, Math.min(1, trajAlphaScale));

   // If neither trajectories nor particles are visible, skip all work.
   if (!showTrajectories && !showParticles) {
      return;
   }

   partCtx.save();
   partCtx.globalAlpha = trajAlphaScale;

   for (var iPart = 0; iPart < trajectories.length ; iPart++) {
      traj = trajectories[iPart];
      if ( traj.del == 1 ) continue;

      if ( traj.timeDirection > 0 ) {
         partCtx.strokeStyle = colorTraj; // Set the color of the line
         partCtx.fillStyle   = colorPart;
      }
      else {
         partCtx.strokeStyle = 'green'; // Set the color of the line
         partCtx.fillStyle   = 'green';
      }

      partCtx.lineWidth = 1;
      let trajDelay=1;
      if ( traj.nPoints > trajDelay ) {
         if ( showTrajectories ) {
            partCtx.beginPath();
            partCtx.moveTo(toCanvasX*traj.points[0].x, toCanvasY*traj.points[0].y);

            for (var iPoint = 1; iPoint < traj.nPoints-trajDelay+1 ; iPoint++) {
               var pnt = traj.points[iPoint];
               partCtx.lineTo(toCanvasX*pnt.x, toCanvasY*pnt.y);
            }
            partCtx.stroke();
         }

         if ( showParticles ) {
            partCtx.beginPath();
            var xLast = toCanvasX*traj.points[traj.nPoints-trajDelay].x;
            var yLast = toCanvasY*traj.points[traj.nPoints-trajDelay].y;
            // Only draw if the particle is on-screen
            if (xLast >= 0 && xLast <= canvas.width && yLast >= 0 && yLast <= canvas.height) {
               partCtx.arc(xLast, yLast, 3, 0, 2 * Math.PI);
               partCtx.fill();
            }
         }
      }
   }

   partCtx.restore();

}
//==================================================================================================================
//
//==================================================================================================================
async function generateWaveInfo(tOverride) {
   const psiOption = $('#waveFunctionOption').val();

   var width     = canvas.width;
   var height    = canvas.height;
   var usedWidth = parseInt(detectorX)-parseInt(sourceX);

   var storageLength = usedWidth*canvas.height;
   var waveInfoF     = new Float32Array(storageLength);

   // Store Psi² at each point so we can later drive opacity from
   // Psi² (or log Psi²) regardless of which wave view is shown.
   var wavePsi2F     = new Float32Array(storageLength);

   let minF= Infinity;
   let maxF=-Infinity;
   let psi2Min = Infinity;
   let psi2Max = -Infinity;
   let psi2LogMin = Infinity;
   let psi2LogMax = -Infinity;
   const tLocal = (typeof tOverride === 'number') ? tOverride : time;

   for (var x =parseInt(sourceX) ; x < parseInt(detectorX); x++) {
      var xWorld = x*toWorldX;
      for (var y = 0; y < canvas.height; y++) {
         var yWorld=y*toWorldY;

         // Always compute Psi and Psi² so we can support Psi²-based
         // scalar views (e.g., Q-potential uses Psi internally and
         // LogPsi2 may fall back to this CPU path if WebGL is off).
         var psiA = psiFunction(xWorld, yWorld, tLocal);
         const psi2Val = psiA.psi2;

         var index = (y * usedWidth + x - parseInt(sourceX) );
         wavePsi2F[index] = psi2Val;

         if (psi2Val < psi2Min) psi2Min = psi2Val;
         if (psi2Val > psi2Max) psi2Max = psi2Val;
         const psi2Log = Math.log10(psi2Val + 1e-20);
         if (psi2Log < psi2LogMin) psi2LogMin = psi2Log;
         if (psi2Log > psi2LogMax) psi2LogMax = psi2Log;

         let intensity;
         if (psiOption == "QPotential") {
            intensity = computeQuantumPotential(xWorld, yWorld, tLocal);
         } else if (psiOption == "Psi2") {
            // Probability density |ψ|²
            intensity = psi2Val;
         } else if (psiOption == "LogPsi2") {
            // Log probability view
            intensity = Math.log10(psi2Val + 1e-20);
         } else {
            // Phase view: use absolute phase as before
            intensity = Math.abs(psiA.phase);
         }

         if ( intensity < minF ) minF=intensity;
         if ( intensity > maxF ) maxF=intensity;
         waveInfoF[index]=intensity;
      }
   }

   var topValue=255;
   let scale =  topValue/(maxF-minF);

   var waveInfo = new Uint8Array(width * height);
   for (var index = 0 ; index < storageLength; index++) {
      let lInfo0  =(waveInfoF[index]-minF)*scale;
      const lInfo = Math.max(0, Math.min(topValue, lInfo0)); // clamp to [0, topValue]
      waveInfo[index]=lInfo;
   }
   return {
      info: waveInfo,
      min: minF,
      max: maxF,
      psi2: wavePsi2F,
      psi2Min,
      psi2Max,
      psi2LogMin,
      psi2LogMax
   };
   
}
//==================================================================================================================
//
//==================================================================================================================
async function drawWaveImage0(waveData) {
   // Draw the wave function
   var imageData = waveCtx.createImageData(canvas.width, canvas.height);
   var data = imageData.data;
   var usedWidth = parseInt(detectorX)-parseInt(sourceX);

   for (var x =0 ; x < usedWidth; x++) {
      for (let y = 0; y < canvas.height; y++) {
         var index2 = (y * usedWidth + x ); 
         const value = waveData.info[index2]/255;
         const [r, g, b] = window.paletteModule.getColorForValue(value, graphPalette); 

         const index = (y * canvas.width + x + parseInt(sourceX)) * 4;
         data[index]     = r;   // Red
         data[index + 1] = g;   // Green
         data[index + 2] = b;   // Blue
         data[index + 3] = 255; // Alpha (fully opaque)
      }
   }
   waveCtx.putImageData(imageData, 0, 0);
}
//==================================================================================================================
//
//==================================================================================================================
async function drawWaveImage(waveData) {
   // Draw the wave function
   var imageData = waveCtx.createImageData(canvas.width, canvas.height);
   var data = imageData.data;
   let waveOpacityScale = parseFloat($('#waveOpacity-input').val());
   if (isNaN(waveOpacityScale)) waveOpacityScale = 1.0;
   waveOpacityScale = Math.max(0, Math.min(1, waveOpacityScale));

   slit1XWorld    = wallXWorld;
   let usedWidth  = parseInt(detectorX)-parseInt(sourceX);
   let usedWidth1 = parseInt(wallX)-parseInt(sourceX);
   let usedWidth2 = parseInt(detectorX)-parseInt(wallX);
   let toWorldX2  = toWorldX * toWorldX;
   let toWorldY2  = toWorldY * toWorldY;
   let r1Min      = Math.sqrt(r1SqMin);
   let r1Max      = Math.sqrt(r1SqMax);
   let r2Min      = Math.sqrt(r2SqMin);
   let r2Max      = Math.sqrt(r2SqMax);

   let waveWidth     = parseFloat($('#WaveWidth-input').val());
   let waveContinous = $('#wave-continous').prop('checked');

   // Configure the current viewing window based on the scalar
   // range in this waveData; this also keeps the UI slider and
   // palette scale in sync for the CPU path.
   setWaveRangeAuto(waveData.min, waveData.max);
   const range = getWaveRangeEffective();
   const vMin = range.min;
   const vMax = range.max;
   const autoMin = waveData.min;
   const autoMax = waveData.max;
   const autoRange = autoMax - autoMin || 1e-6;
   const viewRange = vMax - vMin || 1e-6;

   if ( r1Max > 0 || waveContinous ) {
      for (var x =0 ; x < usedWidth1; x++) {
         let xSq = Math.pow(x,2) * toWorldX2 ;
         for (let y = 0; y < canvas.height; y++) {
            if ( !waveContinous ) {
               let ySq = Math.pow(y-sourceY,2)*toWorldY2;
               let rr   = Math.sqrt(xSq + ySq);
               if ( rr < r1Min - waveWidth ) continue;
               if ( rr > r1Max + waveWidth  ) continue;
            }

            var index2 = (y * usedWidth + x ); 
            // Recover the underlying scalar from the stored
            // 8-bit intensity and then apply the user-selected
            // viewing window before mapping into [0,1] for the
            // palette.
            const rawScalar = autoMin + (waveData.info[index2] / 255) * autoRange;
            let mapped = (rawScalar - vMin) / viewRange;
            mapped = Math.max(0, Math.min(1, mapped));
            const [r, g, b] = window.paletteModule.getColorForValue(mapped, graphPalette); 

            const index = (y * canvas.width + x + parseInt(sourceX)) * 4;
            data[index]     = r;   // Red
            data[index + 1] = g;   // Green
            data[index + 2] = b;   // Blue
            data[index + 3] = Math.round(255 * waveOpacityScale); // Flat alpha
         }
      }
   }

   if ( r2Max > 0 || waveContinous ) {
      for (var x =usedWidth1 ; x < usedWidth; x++) {
         let x1Sq = 0 ;
         let x2Sq = 0 ;
         if ( !waveContinous ) {
            x1Sq = Math.pow(x-wallX+sourceX,2) * toWorldX2 ;
            x2Sq = Math.pow(x-wallX+sourceX,2) * toWorldX2 ;
         }
         for (let y = 0; y < canvas.height; y++) {
            if ( !waveContinous ) {
               if ( slit1Open && slit2Open ) {
                  if ( y < 0.5* canvas.height ) {
                     let y1Sq = Math.pow(y-slit1Y,2)*toWorldY2;
                     let rr1  = Math.sqrt(x1Sq + y1Sq);
                     if ( rr1 < r2Min - waveWidth ) continue;
                     if ( rr1 > r2Max + waveWidth ) continue;
                  }
                  else {
                     if ( slit2Open ) {
                        let y2Sq = Math.pow(y-slit2Y,2)*toWorldY2;
                        let rr2  = Math.sqrt(x2Sq + y2Sq);
                        if ( rr2 < r2Min - waveWidth ) continue;
                        if ( rr2 > r2Max + waveWidth ) continue;
                     }
                  }
               }
               else if ( slit1Open ) {
                  let y1Sq = Math.pow(y-slit1Y,2)*toWorldY2;
                  let rr1  = Math.sqrt(x1Sq + y1Sq);
                  if ( rr1 < r2Min - waveWidth ) continue;
                  if ( rr1 > r2Max + waveWidth ) continue;
               }
               else if ( slit2Open ) {
                  let y2Sq = Math.pow(y-slit2Y,2)*toWorldY2;
                  let rr2  = Math.sqrt(x2Sq + y2Sq);
                  if ( rr2 < r2Min - waveWidth ) continue;
                  if ( rr2 > r2Max + waveWidth ) continue;
               }
            }
            var index2 = (y * usedWidth + x ); 
            const rawScalar = autoMin + (waveData.info[index2] / 255) * autoRange;
            let mapped = (rawScalar - vMin) / viewRange;
            mapped = Math.max(0, Math.min(1, mapped));
            const [r, g, b] = window.paletteModule.getColorForValue(mapped, graphPalette); 

            const index = (y * canvas.width + x + parseInt(sourceX)) * 4;
            data[index]     = r;   // Red
            data[index + 1] = g;   // Green
            data[index + 2] = b;   // Blue
            data[index + 3] = Math.round(255 * waveOpacityScale); // Flat alpha
         }
      }
   }
   waveCtx.putImageData(imageData, 0, 0);
}

//==================================================================================================================
//
//==================================================================================================================
async function updateSimulationState() {

   if (reset === 1) {
      renderSetupFlag =1;
      hits.fill(0);
      waveDataCache = {}; // Key: cycle index, Value: Image object or data URL
      detectorPsiCacheValid = false; // Invalidate detector curve cache
      trajectories.length = 0;
      nParticles = 0;
      logNBranches=0;
      nHits = 0;
      reset = 0;
      setupGeo(false);
      runPrecomputeAsync();
      // Restart the FDTD solver when the simulation is reset
      if (waveMode === 'numerical' && fdtdInitialized) {
         restartFDTD();
      }
      // Restart the spectral solver when the simulation is reset
      if (waveMode === 'spectral' && (spectralInitialized || spectralPreRunning)) {
         initSpectral();
      }
      hitMax = 0;
      time = 0;
      lastParticleTime = 0;
      lastRealTime = 0;
      particleAccum = 0;
      startRealTime = performance.now() / 1000;
      lastCycleIndex   = 100000;
      $("#infoBranchCount").text("1");
      $('#realTime').text('0.0 s');
   }
}
//==================================================================================================================
//
//==================================================================================================================
async function evolveParticles() {

   // In Gaussian-packet mode the wave is an evolving time-domain field with no analytical
   // CW reference. The Bohmian guidance law needs ∇S of the *numerical* field everywhere,
   // but the left-of-wall branch of psiFunction() still uses the analytical formula which
   // doesn't represent a localised packet → trajectories would be completely wrong.
   // Just skip particle evolution so the display shows only the clean wave packet.
   if (waveMode === 'spectral' && spectralScenario === 'gaussianPacket') return;

   var trajectoriesToBeDeleted = [];
   const waveContinous = $('#wave-continous').prop('checked');
   const onlyWallMode = $('#onlyWallMode').prop('checked');

   if ( !waveContinous ) {
      r1SqMin=Infinity;
      r1SqMax=0;
      r2SqMin=Infinity;
      r2SqMax=0;
   }

   for (var iPart = 0; iPart < trajectories.length ; iPart++) {
      traj = trajectories[iPart];
      if (traj.del == 1) continue;
      lastPointN = traj.nPoints;
      lastPoint=traj.points[lastPointN-1];

      var xn=0;
      var yn=0;
      if ( lastPoint.x < wallXWorld ) {
         var bv = computeBohmianVelocity( lastPoint.x, lastPoint.y, time, traj.slitNum ) ;
         xn = lastPoint.x + traj.timeDirection * bv.vx * deltaT;
         yn = lastPoint.y + traj.timeDirection * bv.vy * deltaT;
         
         // Determine which slit the particle will go through (based on Y position relative to slits)
         if (traj.slitNum === 0 && xn >= wallXWorld) {
            // Crossing the wall now - determine slit based on which slit Y is closer to
            const midY = (slit1YWorld + slit2YWorld) / 2;
            if (yn < midY) {
               traj.slitNum = 1;  // Closer to slit 1
            } else {
               traj.slitNum = 2;  // Closer to slit 2
            }
         }

         if ( !waveContinous ) {
            r1sq = Math.pow(xn-sourceXWorld,2)+Math.pow(yn-sourceYWorld,2);
            if ( r1sq > r1SqMax ) r1SqMax=r1sq;
            if ( r1sq < r1SqMin ) r1SqMin=r1sq;
         }

      }
      else {
         // After the wall: either Bohmian sub-stepping or straight-line for which-path mode
         if (whichPathDetector !== 'none' && traj.phi !== undefined) {
            // Which-path mode: straight-line trajectory using stored angle
            // Match the Bohmian velocity magnitude for each particle type:
            //   photon:   v = c  (normalized in computeBohmianVelocity)
            //   electron: v = hbar*k/m  (group velocity = 2 * phase velocity)
            //   neutron:  v = hbar*k/m
            let speed;
            if (particleType === 'photon') {
               speed = c;
            } else {
               const mass = particleType === 'neutron' ? mNeutron : mElectron;
               speed = hbar * k / mass;
            }
            xn = lastPoint.x + Math.cos(traj.phi) * speed * deltaT;
            yn = lastPoint.y + Math.sin(traj.phi) * speed * deltaT;
         } else {
            // Original sub-stepping scheme with an upper cap; preserves total deltaT
            var nSubSteps=10000;
            var xl = lastPoint.x;
            var yl = lastPoint.y;
            var tl = time;
            var dtl=deltaT/parseFloat(nSubSteps);
            var stepSize = wavelength/1000;
            
            // Determine slit number if not already set
         if (traj.slitNum === 0) {
            const midY = (slit1YWorld + slit2YWorld) / 2;
            if (yl < midY) {
               traj.slitNum = 1;
            } else {
               traj.slitNum = 2;
            }
         }

         dtlSum = 0 ;
         stop = 0 ;
         for ( var iss = 0 ; iss < nSubSteps ; iss++ ) {
            var bv = computeBohmianVelocity( xl, yl, tl, traj.slitNum ) ;
            var bv2 = Math.sqrt(bv.vx*bv.vx+bv.vy*bv.vy) || epsilon;
            var dtl = stepSize/bv2;
            dtlSum = dtlSum + dtl;
            if ( dtlSum > deltaT ) {
               dtl = dtl - (dtlSum-deltaT);
               stop=1;
            }
            xl = xl + traj.timeDirection * bv.vx * dtl;
            yl = yl + traj.timeDirection * bv.vy * dtl;
            tl = tl + dtl;
            if ( stop ) {
               break;
            }
         }
         var dtt = tl-time;
         if ( Math.abs(dtt-deltaT) > 0.001 * deltaT ) {
            console.log("Problem deltaT ", deltaT, " dtt ", dtt);
         }

         xn=xl;
         yn=yl;


         if ( !waveContinous ) {
            rrSq = 0;
            if ( slit1Open && slit2Open ) {
               if ( yn < 0.5 * worldCanvasDy )  rrSq = Math.pow(xn-slit1XWorld,2)+Math.pow(yn-slit1YWorld,2); 
               else                             rrSq = Math.pow(xn-slit2XWorld,2)+Math.pow(yn-slit2YWorld,2); 
            }
            else if ( slit1Open ) rrSq = Math.pow(xn-slit1XWorld,2)+Math.pow(yn-slit1YWorld,2); 
            else if ( slit2Open ) rrSq = Math.pow(xn-slit2XWorld,2)+Math.pow(yn-slit2YWorld,2); 

            if ( rrSq < r2SqMin ) r2SqMin=rrSq;
            if ( rrSq > r2SqMax ) r2SqMax=rrSq;
         }
      }
      }

      if ( xn < 0 ) {
         traj.del=1;
      }
      if ( yn < 0 ||  yn > worldCanvasDy ) {
         traj.del=1;
      }

      if (onlyWallMode) {
         if ( xn < wallXWorld && traj.del==2 ) {
            // In wall-forced mode, trajectories that were
            // back-propagated from detector hits (del==2)
            // are terminated once they have crossed back
            // behind the wall into the source side.
            traj.del=1;
         }
         if ( xn > wallXWorld && traj.del==0 ) {

            // Original behavior: stop particles at the wall
            // and re-sample from detector hits so that all
            // visible trajectories ultimately terminate on
            // the detector.
            traj.del=1 ;

            nnn=5000;
            var stepFraction = (wallXWorld-lastPoint.x)/(xn-lastPoint.x);
            var yWall = lastPoint.y + (yn-lastPoint.y) * stepFraction

               if ( yWall < slit1YWorld + slitWidth &&  yWall > slit1YWorld - slitWidth ) {
                  if ( slit1Open && slit2Open ) {
                     if (whichPathDetector !== 'none') {
                        // Which-path mode with straight-line trajectories:
                        // Compute phi range that hits the detector wall (geometry-based)
                        const dx = detectorXWorld - wallXWorld;
                        const phiTop = Math.atan2(0 - slit1YWorld, dx);          // angle to top of detector
                        const phiBottom = Math.atan2(worldCanvasDy - slit1YWorld, dx);  // angle to bottom of detector
                        const phiMin = Math.min(phiTop, phiBottom);
                        const phiMax = Math.max(phiTop, phiBottom);
                        const phi = phiMin + Math.random() * (phiMax - phiMin);
                        traj.phi = phi;  // Store for straight-line propagation
                        var xn = wallXWorld + xPre;
                        var yn = slit1YWorld;
                        traj.slitNum = 1;
                     } else {
                        // Normal Bohmian mode: use detector distribution
                        slitPos = getSlitPosition(traj, detectorArray1, 1);
                        var xn = slitPos.x;
                        var yn = slitPos.y;
                     }
                  }
                  else {
                     // Symmetric phi range covering the right side of screen (-π/2 to π/2)
                     var phiMin = -Math.PI/2;
                     var phiMax = Math.PI/2;
                     var phi = phiMin+Math.random()*(phiMax-phiMin);
                     var xn  = slit1XWorld + 1 * Math.cos(phi);
                     var yn  = slit1YWorld + 1 * Math.sin(phi);
                  }
                  traj.del=2;  
               }
               else if ( yWall < slit2YWorld + slitWidth &&  yWall > slit2YWorld - slitWidth ) {
                  if ( slit1Open && slit2Open ) {
                     if (whichPathDetector !== 'none') {
                        // Which-path mode with straight-line trajectories:
                        // Compute phi range that hits the detector wall (geometry-based)
                        const dx = detectorXWorld - wallXWorld;
                        const phiTop = Math.atan2(0 - slit2YWorld, dx);          // angle to top of detector
                        const phiBottom = Math.atan2(worldCanvasDy - slit2YWorld, dx);  // angle to bottom of detector
                        const phiMin = Math.min(phiTop, phiBottom);
                        const phiMax = Math.max(phiTop, phiBottom);
                        const phi = phiMin + Math.random() * (phiMax - phiMin);
                        traj.phi = phi;  // Store for straight-line propagation
                        var xn = wallXWorld + xPre;
                        var yn = slit2YWorld;
                        traj.slitNum = 2;
                     } else {
                        // Normal Bohmian mode: use detector distribution
                        slitPos = getSlitPosition(traj, detectorArray2, 2);
                        var xn = slitPos.x;
                        var yn = slitPos.y;
                     }
                  }
                  else {
                     // Symmetric phi range covering the right side of screen (-π/2 to π/2)
                     var phiMin = -Math.PI/2;
                     var phiMax = Math.PI/2;
                     var phi = phiMin+Math.random()*(phiMax-phiMin);
                     var xn = slit2XWorld + 1. * Math.cos(phi);
                     var yn = slit2YWorld + 1. * Math.sin(phi);
                  }
                 traj.del=2;  
               }
         }
      } else {
         // Case A (non-only-wall-hits): absorb at the wall outside
         // the slits; if we cross the wall within a slit window,
         // choose an endpoint on detector/top/bottom, backtrack to
         // just behind the wall, and continue forward from there.
         // We use slit-specific boundary arrays so backtracking
         // lands near the same slit that was hit.
         if ( xn > wallXWorld && traj.del==0 ) {
            var stepFractionA = (wallXWorld-lastPoint.x)/(xn-lastPoint.x);
            var yWallA = lastPoint.y + (yn-lastPoint.y) * stepFractionA;

            var atSlit1 = ( yWallA < slit1YWorld + slitWidth &&  yWallA > slit1YWorld - slitWidth );
            var atSlit2 = ( yWallA < slit2YWorld + slitWidth &&  yWallA > slit2YWorld - slitWidth );

            if (!atSlit1 && !atSlit2) {
               // Hit the opaque wall: absorb.
               traj.del = 1;
            } else if (atSlit1) {
               if (whichPathDetector !== 'none') {
                  // Which-path mode: use full 180° phi range (straight-line trajectories)
                  const phi = -Math.PI/2 + Math.random() * Math.PI;
                  traj.phi = phi;  // Store for straight-line propagation
                  xn = wallXWorld + xPre;
                  yn = slit1YWorld;
                  traj.slitNum = 1;
               } else if (boundaryDetArray1 && boundaryTopArray &&
                          boundaryDetArray1.bins.length > 0 && boundaryTopArray.bins.length > 0) {
                  // Normal Bohmian mode: sample from upper detector half + top edge
                  const lenDet = boundaryDetArray1.bins.length;
                  const lenTop = boundaryTopArray.bins.length;
                  const totalLen = lenDet + lenTop;

                  let r = Math.random() * totalLen;
                  let xStart, yStart;
                  if (r < lenDet) {
                     yStart = sampleFromCDF(boundaryDetArray1);
                     xStart = detectorXWorld;
                  } else {
                     xStart = sampleFromCDF(boundaryTopArray);
                     yStart = 0;
                  }

                  const slitPosA = backtrackFromPoint(xStart, yStart, 1);
                  xn = slitPosA.x;
                  yn = slitPosA.y;
                  traj.slitNum = 1;
               }
               traj.del = 2;
            } else if (atSlit2) {
               if (whichPathDetector !== 'none') {
                  // Which-path mode: use full 180° phi range (straight-line trajectories)
                  const phi = -Math.PI/2 + Math.random() * Math.PI;
                  traj.phi = phi;  // Store for straight-line propagation
                  xn = wallXWorld + xPre;
                  yn = slit2YWorld;
                  traj.slitNum = 2;
               } else if (boundaryDetArray2 && boundaryBottomArray &&
                          boundaryDetArray2.bins.length > 0 && boundaryBottomArray.bins.length > 0) {
                  // Normal Bohmian mode: sample from lower detector half + bottom edge
                  const lenDet = boundaryDetArray2.bins.length;
                  const lenBottom = boundaryBottomArray.bins.length;
                  const totalLen = lenDet + lenBottom;

                  let r = Math.random() * totalLen;
                  let xStart, yStart;
                  if (r < lenDet) {
                     yStart = sampleFromCDF(boundaryDetArray2);
                     xStart = detectorXWorld;
                  } else {
                     xStart = sampleFromCDF(boundaryBottomArray);
                     yStart = worldCanvasDy;
                  }

                  const slitPosA = backtrackFromPoint(xStart, yStart, 2);
                  xn = slitPosA.x;
                  yn = slitPosA.y;
                  traj.slitNum = 2;
               }
               traj.del = 2;
            }
         }
      }

      // For case A, if a del==2 trajectory somehow crosses back
      // behind the wall, terminate it (mirrors case B logic).
      if (!onlyWallMode && xn < wallXWorld && traj.del == 2) {
         traj.del = 1;
      }

      // After handling wall interactions (or free propagation in
      // non-wall mode), record detector hits for any trajectories
      // that have now crossed the detector plane and are still
      // active.
      if ( xn > detectorXWorld && traj.del != 1 ) {
         traj.del=1;

         var stepFraction = (detectorXWorld-lastPoint.x)/(xn-lastPoint.x);
         var yHit = lastPoint.y + (yn-lastPoint.y) * stepFraction
         // Use floor() so all bins cover equal ranges:
         // bin i covers y in [i/yToBinWorld, (i+1)/yToBinWorld)
         var iBin = Math.floor(yHit * yToBinWorld);
         // Clamp to valid detector range to avoid tiny numerical
         // leaks putting hits just outside the histogram.
         if (iBin < 0) iBin = 0;
         if (iBin >= nDetectorPixels) iBin = nDetectorPixels - 1;

         nHits++;
         logNBranches=logNBranches+logNDetectorPixels;
         // Update branch display approximately every second (handled by timestamp in evolveSystem)

         hits[iBin]++;;
         if ( hits[iBin] > hitMax ) hitMax = hits[iBin];
      }
      if ( traj.del == 1 ) {
         //if ( traj.hit == 0 ) 
         //else
         traj.points=[];
         traj.nPoints = 0;
         //trajectoriesToBeDeleted.push(iPart);

      }
      else {
         traj.points.push({x:xn,y:yn});
         if (traj.points.length > MAX_TRAJ_POINTS) {
            // Drop the oldest point to cap history length
            traj.points.shift();
         }
         traj.nPoints = traj.points.length;
      }
   }

   // Compact trajectories array in-place to avoid reallocating each frame
   let writeIndex = 0;
   for (let readIndex = 0; readIndex < trajectories.length; readIndex++) {
      if (trajectories[readIndex].del !== 1) {
         trajectories[writeIndex++] = trajectories[readIndex];
      }
   }
   trajectories.length = writeIndex;

   //
   //     Inject new particles (based on real-time rate)
   //
   maxSimulPart = parseFloat($('#MaxPart-input').val());

   // Calculate how many particles to emit this frame based on real elapsed time
   const currentRealTime = performance.now() / 1000; // in seconds
   if (lastRealTime === 0) lastRealTime = currentRealTime;
   const realDt = currentRealTime - lastRealTime;
   lastRealTime = currentRealTime;
   
   // Accumulate fractional particles
   particleAccum += particleRate * realDt;
   const particlesToEmit = Math.floor(particleAccum);
   particleAccum -= particlesToEmit;

   for (let pIdx = 0; pIdx < particlesToEmit && nParticles < maxParticles && trajectories.length < maxSimulPart; pIdx++) {
      // In non-Pilot-Wave modes particles are invisible, so skip
      // trajectory creation and sample detector hits directly from
      // the precomputed CDF.  This gives immediate visual feedback
      // instead of a dead period while hidden particles traverse.
      if (interpretation !== 'bohmian') {
         // Pick the right CDF (which-path vs interference)
         let detectorArray;
         if (whichPathDetector !== 'none') {
            detectorArray = (Math.random() < 0.5) ? singleSlitArray1 : singleSlitArray2;
         } else {
            detectorArray = (Math.random() < 0.5) ? detectorArray1 : detectorArray2;
         }
         if (detectorArray && detectorArray.cdf) {
            var yn = sampleFromCDF(detectorArray);
            var iBin = Math.floor(yn * yToBinWorld);
            if (iBin < 0) iBin = 0;
            if (iBin >= nDetectorPixels) iBin = nDetectorPixels - 1;
            nHits++;
            hits[iBin]++;
            if (hits[iBin] > hitMax) hitMax = hits[iBin];
            if (interpretation === 'manyworlds') {
               logNBranches += logNDetectorPixels;
            }
         }
         nParticles++;
         continue;
      }
      // For both cases A and B, new trajectories are injected
      // from the source. The difference between the modes is
      // handled at the wall when they reach a slit.
      let x0 = 0;
      let y0 = 0;
      const sourceOptionLocal = $('#sourceOption').val();
      const offset = 5;
      if ( sourceOptionLocal == "isotropic" ) {
         const delta1 = (slit1YWorld-slitWidth-sourceYWorld)/(slit1XWorld-sourceXWorld);
         const delta  = -1. * delta1 + 2. * Math.random() * delta1;
         x0 = sourceXWorld + offset ;
         y0 = sourceYWorld + delta*offset;
      }
      else if ( sourceOptionLocal == "slits" ) {
         let slitChoice  = 0. ;
         if ( slit1Open && slit2Open ) {
            slitChoice  = Math.random() ;
         }
         else if (  slit1Open && !slit2Open ) slitChoice=0.0;
         else if ( !slit1Open &&  slit2Open ) slitChoice=0.7;

         let tanDelta1 = 0;
         let tanDelta2 = 0;
         if ( slitChoice < 0.5 ) {
            tanDelta1 = (slit1YWorld+0.5*slitWidth-sourceYWorld)/(slit1XWorld-sourceXWorld);
            tanDelta2 = (slit1YWorld-0.5*slitWidth-sourceYWorld)/(slit1XWorld-sourceXWorld);

         }
         else {
            tanDelta1 = (slit2YWorld+0.5*slitWidth-sourceYWorld)/(slit2XWorld-sourceXWorld);
            tanDelta2 = (slit2YWorld-0.5*slitWidth-sourceYWorld)/(slit2XWorld-sourceXWorld);
         }
         const delta1 = Math.atan(tanDelta1);
         const delta2 = Math.atan(tanDelta2);
         const delta  = delta1 + Math.random() * (delta2-delta1);
         x0 = sourceXWorld + offset ;
         y0 = sourceYWorld + offset * Math.tan(delta);
      }

      const pos = { x: x0, y: y0 };
      const trajectory = { id:nParticles, nPoints:1, points:[pos], del:0, hit:0, timeDirection:1, slitNum:0};
      trajectories.push(trajectory);
      nParticles = nParticles+1;
   }
}
//==================================================================================================================
//
//==================================================================================================================
async function renderDetectorAndHistogram() {
   // First loop: Calculate the maximum amplitude (cached for performance)

   histoX=detectorX+sensorWidth;
   // Fill histogram area with white background
   setupCtx.fillStyle = '#ffffff';
   setupCtx.fillRect(histoX, 0, canvas.width-histoX, canvas.height);
   
   let maxAmplitude = 0;
   const showHitProb = $("#hit_prob").is(":checked");
   const showHits    = $("#plot_hits").is(":checked");
   const showSensor  = $("#plot_sensor").is(":checked");

   // Only recompute detector |ψ|² when cache is invalid
   if (!detectorPsiCacheValid) {
      amplitudes.length=0;
      yHits.length=0;

      // Sample finely for smooth probability curve display
      // Use canvas pixel resolution for smoothness
      for (let i = 0; i < canvas.height; i++) {
         const yHit = (i + 0.5) * toWorldY; // center of each canvas pixel in world coords
         
         let amplitude;
         if (whichPathDetector !== 'none') {
            // Which-path mode: sum of independent single-slit probabilities (no interference)
            const psi1 = psiSingleSlit(detectorXWorld, yHit, time, 1);
            const psi2 = psiSingleSlit(detectorXWorld, yHit, time, 2);
            amplitude = psi1.psi2 + psi2.psi2;
         } else {
            // Normal mode: interfering wave
            const psi = psiFunction(detectorXWorld, yHit, time);
            amplitude = psi.psi2;
         }

         amplitudes.push(amplitude);
         yHits.push(yHit);
      }
      detectorPsiCacheValid = true;
   }

   // Find max amplitude from cached data
   for (let i = 0; i < amplitudes.length; i++) {
      if (amplitudes[i] > maxAmplitude) {
         maxAmplitude = amplitudes[i];
      }
   }

   // Second loop: Scale amplitudes and plot
   setupCtx.beginPath();
   var oldStyle = setupCtx.strokeStyle;
   setupCtx.strokeStyle = colorProb; // Set the color of the line

   detectorWidth = canvas.width - detectorX - sensorWidth;

   // Compute area under probability curve (each sample is one canvas pixel = toWorldY world units)
   var totalArea = 0;
   for (let i = 0; i < amplitudes.length; i++) {
      const normalizedAmplitude = 0.9* (amplitudes[i] / maxAmplitude) * detectorWidth; // Scale amplitude
      totalArea  += normalizedAmplitude * toWorldY;
      const yHitCanvas = i + 0.5; // canvas pixel center

      if  ( showHitProb ) {
         if (i === 0) {
            setupCtx.moveTo(histoX + normalizedAmplitude, yHitCanvas);
         } else {
            setupCtx.lineTo(histoX + normalizedAmplitude, yHitCanvas);
         }
      }
   }
   setupCtx.stroke();

   // Draw histogram with statistical uncertainties
   setupCtx.fillStyle = colorHit;
   setupCtx.strokeStyle = colorHit; // Color for error bars
   setupCtx.lineWidth = 1;         // Line width for error bars

   // Draw histogram with statistical uncertainties
   setupCtx.fillStyle = colorHit;
   setupCtx.strokeStyle = colorHit; // Color for error bars
   setupCtx.lineWidth = 1;         // Line width for error bars


   var rgbSensor ;
   if ( showSensor ) {
      rgbSensor = getRGBComponents(colorSensor);
      setupCtx.fillStyle = "black";
      setupCtx.fillRect(detectorX, 0, sensorWidth, canvas.height);  // color 
   }
   if ( nHits > 0 && ( showHits || showSensor ) ) {
      var histoArea = nHits * worldCanvasDy / parseFloat(nDetectorPixels);
      var norma = totalArea / histoArea;
      for (var i = 0; i < hits.length; i++) {
         // Draw at bin center: bin i covers [(i)/yToBin, (i+1)/yToBin)
         // so its center is at (i + 0.5) / yToBinCanvas
         var yHit = (i + 0.5) / yToBinCanvas; // Position on the canvas (bin center)
         if (hits[i] > 0) {
            var dY = canvas.height / parseFloat(nDetectorPixels); // Height of the bin
            var binValue = hits[i];
            var uncertainty = Math.sqrt(binValue); // Statistical uncertainty = sqrt(nEntries)

            var normalizedBinValue = norma * binValue ; // Normalize bin value
            var normalizedUncertainty = norma * uncertainty ; // Normalize uncertainty

            if ( showHits ) {
               // Plot the point
               setupCtx.fillStyle = colorHit;
               setupCtx.beginPath();
               //setupCtx.arc(histoX + normalizedBinValue, canvas.height - yHit, 3, 0, 2 * Math.PI); // Small circle for the point
               setupCtx.arc(histoX + normalizedBinValue, yHit, 3, 0, 2 * Math.PI); // Small circle for the point
               setupCtx.fill();

               // Draw error bar
               setupCtx.beginPath();
               setupCtx.moveTo(histoX + normalizedBinValue + normalizedUncertainty, yHit ); // Top of error bar
               //setupCtx.moveTo(histoX + normalizedBinValue + normalizedUncertainty, canvas.height - yHit ); // Top of error bar
               setupCtx.lineTo(histoX + normalizedBinValue - normalizedUncertainty, yHit ); // Bottom of error bar
               //setupCtx.lineTo(histoX + normalizedBinValue - normalizedUncertainty, canvas.height - yHit ); // Bottom of error bar
               setupCtx.stroke();
            }
            if ( showSensor ) {
               intensity = (hits[i] / hitMax);
               const color = `rgb(${parseInt(rgbSensor['red'])*intensity}, ${parseInt(rgbSensor['green'])*intensity}, ${parseInt(rgbSensor['blue'])*intensity})`;  
               setupCtx.fillStyle = color;
               // Sensor rect starts at bin edge, not center
               var yBinEdge = i / yToBinCanvas;
               setupCtx.fillRect(detectorX, yBinEdge, sensorWidth, dY);  // color 
            }
         }
      }
   }
}
//==================================================================================================================
//
//==================================================================================================================
function resampleHitsFromPsi() {
  hits.fill(0);

  for (let i = 0; i < nHits; i++) {
    let detectorArray;
    
    // When which-path detector is active, use single-slit distributions (no interference)
    if (whichPathDetector !== 'none') {
       // Randomly choose which slit the particle goes through (50/50)
       if (Math.random() < 0.5) {
          detectorArray = singleSlitArray1;
       } else {
          detectorArray = singleSlitArray2;
       }
    } else {
       // Normal mode: use interference pattern distributions
       if (Math.random() < 0.5) {
          detectorArray = detectorArray1;
       } else {
          detectorArray = detectorArray2;
       }
    }

    yn = sampleFromCDF(detectorArray);
    var iBin = Math.floor(yn * yToBinWorld);
    if ( iBin < 0 ) iBin = 0;
    if ( iBin >= nDetectorPixels ) iBin = nDetectorPixels - 1;
    hits[iBin]++;
  }
  renderDetectorAndHistogram() ;
}
//==================================================================================================================
//
//==================================================================================================================
async function renderWaveFunction(cycleIndex) {
   if (!$("#plot_wave").is(':checked')) return;

   const psiOptionLocal = $('#waveFunctionOption').val();

   // ── FDTD GPU rendering path ──────────────────────────────────
   // When in numerical mode, use the FDTD solver's own
   // visualization shader for Phase / Psi² / log(Psi²).
   if (waveMode === 'numerical' && fdtdInitialized &&
       (psiOptionLocal === 'Phase' || psiOptionLocal === 'Psi2' || psiOptionLocal === 'LogPsi2')) {
      waveCtx.clearRect(0, 0, canvas.width, canvas.height);
      setWaveRangeAuto(0.0, 1.0);
      const eff = getWaveRangeEffective();

      let alphaScaleVal = parseFloat($('#waveOpacity-input').val());
      if (isNaN(alphaScaleVal)) alphaScaleVal = 1.0;
      alphaScaleVal = Math.max(0, Math.min(1, alphaScaleVal));

      FDTD.renderToCanvas(waveCtx, graphPalette, {
         mode:        psiOptionLocal,
         viewMin:     eff.min,
         viewMax:     eff.max,
         alphaScale:  alphaScaleVal,
         canvasWidth: canvas.width,
         canvasHeight:canvas.height,
         destX: 0, destY: 0,
         destW: canvas.width,
         destH: canvas.height,
         wallXWorld:  wallXWorld
      });

      let labelMin = eff.min;
      let labelMax = eff.max;
      if (psiOptionLocal === 'Phase') {
         const twoPi = 2 * Math.PI;
         labelMin = eff.min * twoPi;
         labelMax = eff.max * twoPi;
      } else if (psiOptionLocal === 'LogPsi2') {
         const toLog10 = 1.0 / Math.log(10.0);
         labelMin = (eff.min * 15.0 - 15.0) * toLog10;
         labelMax = (eff.max * 15.0 - 15.0) * toLog10;
      }

      if (whichPathDetector !== 'none') {
         drawDualPaletteScale(graphPaletteSlit1, graphPaletteSlit2, labelMin, labelMax);
      } else {
         drawPaletteScale(graphPalette, labelMin, labelMax);
      }
      return;
   }

   // ── Spectral CPU rendering path ─────────────────────────────
   // When in spectral mode, render the simulation field from the
   // CPU buffer using the colour palette (Phase / Psi² / log(Psi²)).
   // Left of wall → analytical CW; right of wall → spectral solver.
   if (waveMode === 'spectral' && spectralInitialized &&
       (psiOptionLocal === 'Phase' || psiOptionLocal === 'Psi2' || psiOptionLocal === 'LogPsi2')) {
      waveCtx.clearRect(0, 0, canvas.width, canvas.height);
      setWaveRangeAuto(0.0, 1.0);
      const eff = getWaveRangeEffective();

      let alphaScaleVal = parseFloat($('#waveOpacity-input').val());
      if (isNaN(alphaScaleVal)) alphaScaleVal = 1.0;
      alphaScaleVal = Math.max(0, Math.min(1, alphaScaleVal));

      // Gaussian packet has no analytical reference → always use 'numerical' renderMode
      const _effectiveRenderMode = (spectralScenario === 'gaussianPacket')
         ? 'numerical'
         : spectralRenderMode;

      SpectralSolver.renderToCanvas(waveCtx, graphPalette, {
         mode:         psiOptionLocal,
         renderMode:   _effectiveRenderMode,
         viewMin:      eff.min,
         viewMax:      eff.max,
         alphaScale:   alphaScaleVal,
         wallXWorld:   wallXWorld,
         sourceXWorld: _spectralSrcX,
         sourceYWorld: _spectralSrcY,
         k:     k,
         omega: omega,
         time:  time,
         destX: 0, destY: 0,
         destW: canvas.width,
         destH: canvas.height
      });

      // ── Resolution warning ─────────────────────────────────────────
      // Warn when λ < 4 * spectral grid spacing (results are aliased / meaningless).
      const _gridDx = SpectralSolver.getGridInfo().dx;
      if (wavelength < 4 * _gridDx) {
         const _msg = `\u26a0 Spectral grid cannot resolve \u03bb=${wavelength.toFixed(1)} nm  (grid dx\u2248${_gridDx.toFixed(1)} nm \u2014 need \u03bb > ${(4*_gridDx).toFixed(0)} nm)`;
         waveCtx.save();
         waveCtx.fillStyle    = 'rgba(0,0,0,0.65)';
         waveCtx.fillRect(0, 0, canvas.width, 44);
         waveCtx.font         = 'bold 13px monospace';
         waveCtx.fillStyle    = '#ffcc00';
         waveCtx.textBaseline = 'middle';
         waveCtx.fillText(_msg, 10, 22);
         waveCtx.restore();
      }

      let labelMin = eff.min;
      let labelMax = eff.max;
      if (psiOptionLocal === 'Phase') {
         const twoPi = 2 * Math.PI;
         labelMin = eff.min * twoPi;
         labelMax = eff.max * twoPi;
      } else if (psiOptionLocal === 'LogPsi2') {
         const toLog10 = 1.0 / Math.log(10.0);
         labelMin = (eff.min * 15.0 - 15.0) * toLog10;
         labelMax = (eff.max * 15.0 - 15.0) * toLog10;
      }
      drawPaletteScale(graphPalette, labelMin, labelMax);
      return;
   }

   // GPU fast path: use WebGL-based wave rendering for the
   // dynamic Phase, Psi^2, and log(Psi^2) views. QPotential uses
   // the CPU path so we can reuse the existing scalar computation
   // and caching.
   if (useWebGLWave && (psiOptionLocal === 'Phase' || psiOptionLocal === 'Psi2' || psiOptionLocal === 'LogPsi2')) {
      waveCtx.clearRect(0, 0, canvas.width, canvas.height);
      // For GPU modes, the scalar fed to the palette is always
      // in [0,1]; initialize the auto-range accordingly so the
      // Wave Range slider starts with the full interval.
      setWaveRangeAuto(0.0, 1.0);
      renderWaveWithWebGL(time, psiOptionLocal);
      const eff = getWaveRangeEffective();
      // For GPU modes, draw the palette scale in more physical
      // units when possible:
      // - Phase: 0 .. 2π for the full window.
      // - LogPsi2: approximate log10(|Psi|^2) using the same
      //   fixed log mapping as in the shader.
      let labelMin = eff.min;
      let labelMax = eff.max;
      if (psiOptionLocal === 'Phase') {
         const twoPi = 2 * Math.PI;
         labelMin = eff.min * twoPi;
         labelMax = eff.max * twoPi;
      } else if (psiOptionLocal === 'LogPsi2') {
         const toLog10 = 1.0 / Math.log(10.0);
         labelMin = (eff.min * 15.0 - 15.0) * toLog10;
         labelMax = (eff.max * 15.0 - 15.0) * toLog10;
      }

      if (whichPathDetector !== 'none') {
         drawDualPaletteScale(graphPaletteSlit1, graphPaletteSlit2, labelMin, labelMax);
      } else {
         drawPaletteScale(graphPalette, labelMin, labelMax);
      }
      return;
   }

   // CPU path: clear the wave canvas and use the existing
   // palette-based implementation with caching.
   waveCtx.clearRect(0, 0, canvas.width, canvas.height);

   // For time-independent views (QPotential in this setup),
   // always reuse a single cached wave image across frames.
   // For dynamic views (Phase / Psi^2 / log(Psi^2)), reuse a fixed
   // number of phase samples per oscillation, indexed by frame.
   let cacheKey;
   let tSample;

   if (psiOptionLocal === 'QPotential') {
      cacheKey = `static_${psiOptionLocal}`;
      tSample = 0; // any time is equivalent for these displays
   } else {
      const frameIndex = cycleIndex % WAVE_CACHE_FRAMES;
      cacheKey = `dyn_${psiOptionLocal}_${frameIndex}`;
      // Sample equally spaced phases over one period
      tSample = (cyclePeriod / WAVE_CACHE_FRAMES) * frameIndex;
   }

   let waveData;
   if (waveDataCache[cacheKey]) {
      waveData = waveDataCache[cacheKey];
   } else {
      waveData = await generateWaveInfo(tSample);
      waveDataCache[cacheKey] = waveData;

      const cacheKeys = Object.keys(waveDataCache);
      if (cacheKeys.length > MAX_WAVE_CACHE) {
         // Drop the oldest cached entry to keep memory bounded
         delete waveDataCache[cacheKeys[0]];
      }
   }
   await drawWaveImage(waveData);
   const eff = getWaveRangeEffective();
   if (whichPathDetector !== 'none') {
      drawDualPaletteScale(graphPaletteSlit1, graphPaletteSlit2, eff.min, eff.max);
   } else {
      drawPaletteScale(graphPalette, eff.min, eff.max);
   }
}
//==================================================================================================================
//
//==================================================================================================================
async function drawSystem(cycleIndex) {
   await updateSimulationState();
   if ( renderSetupFlag ) await renderSetup();


   let waveContinous = $('#wave-continous').prop('checked');
   const needsNewWave = (lastCycleIndex != cycleIndex) || !waveContinous;
   if (needsNewWave) {
      const psiOptionLocal = $('#waveFunctionOption').val();
      const isStaticView = (psiOptionLocal === 'QPotential');

      if (!isAnimating || !isStaticView) {
         await renderWaveFunction(cycleIndex);
         lastCycleIndex = cycleIndex;
      } else {
         waveRenderFrameCounter++;
         if (waveRenderFrameCounter % WAVE_UPDATE_STRIDE === 0) {
            await renderWaveFunction(cycleIndex);
            lastCycleIndex = cycleIndex;
         }
      }
   }

   //await plotWaveFunction2D(time) ;
   await renderTrajectoriesAndParticles();
   await renderDetectorAndHistogram();
   lastCycleIndex=cycleIndex;
}
//==================================================================================================================
//
//==================================================================================================================
async function evolveSystem() {
   // Interpret the UI control as a simulation speed multiplier
   // (1x = normal, >1x faster, <1x slower) instead of a raw
   // frame delay. Base step time is 30 ms.
   const speedFactorRaw = parseFloat($('#animationStep-group')[0].getValueInFirstUnit());
   const speedFactor = isNaN(speedFactorRaw) || speedFactorRaw <= 0 ? 1.0 : speedFactorRaw;
   const baseStepTime = 30.0; // ms at 1x
   var targetStepTime = baseStepTime / speedFactor;
   const startTime = performance.now(); // high-resolution timestamp

   if (shouldResetCache) {
      waveDataCache = {};
      shouldResetCache = false;
   }

   psiOption=$('#waveFunctionOption').val();
   // Use a monotonically increasing frame index as the cache key so
   // each time step has its own wave image. This avoids visual
   // discontinuities between the end and start of a period at the
   // cost of more wave recomputation.
   const cycleIndex = nSteps;
   currentCycleIndex = cycleIndex;

   // Advance the FDTD solver when in numerical mode
   if (waveMode === 'numerical' && fdtdInitialized) {
      FDTD.step(fdtdStepsPerFrame);
      FDTD.syncCPU();
      // Invalidate caches that depend on ψ values
      detectorPsiCacheValid = false;
   }

   // Advance the spectral solver when in spectral mode
   if (waveMode === 'spectral' && spectralInitialized) {
      // Gaussian-packet mode uses more steps/frame so the packet visibly crosses the domain
      // in a few seconds rather than tens of seconds. CW modes keep the lower rate for fps.
      const _stepsThisFrame = (spectralScenario === 'gaussianPacket')
         ? spectralStepsPerFrame * 3
         : spectralStepsPerFrame;
      SpectralSolver.step(_stepsThisFrame);
      // For Gaussian-packet mode we don't run particles, so we don't need the CPU buffer
      // ready before evolveParticles().  renderToCanvas() will lazily sync inside draw.
      // For CW modes (doubleSlit / pointSource) we sync now so that readPsi() calls in
      // evolveParticles() don't each pay the readPixels cost individually.
      if (spectralScenario !== 'gaussianPacket') {
         SpectralSolver.syncCPU();
      }
      // Auto-loop Gaussian packet: once the packet has traversed the domain,
      // reset the field to a fresh packet (wall stays intact — only ψ is reset).
      if (spectralScenario === 'gaussianPacket' && _packetLoopSteps > 0 && _packetParams) {
         _packetStepCount += _stepsThisFrame;
         if (_packetStepCount >= _packetLoopSteps) {
            SpectralSolver.setGaussianPacket(_packetParams);
            _packetStepCount = 0;
         }
      }
      detectorPsiCacheValid = false;
   }

   await evolveParticles();
   await drawSystem(cycleIndex);
   
   const cacheSize = Object.keys(waveDataCache).length;

   time += deltaT;
   nSteps++;

   const elapsed = performance.now() - startTime;
   const remaining = targetStepTime - elapsed;

   if (isAnimating) {
      if (remaining > 0) {
         setTimeout(() => {
            animationId = requestAnimationFrame(evolveSystem);
         }, remaining);
      } else {
         animationId = requestAnimationFrame(evolveSystem);
      }
   }

   if ( particleType == "electron" ) {
      $('#systemTime').text(time.toFixed(2)+" ns");
   }
   if ( particleType == "neutron" ) {
      $('#systemTime').text((time/1000).toFixed(2)+" us");
   }
   
   // Update real time display
   const elapsedRealTime = performance.now() / 1000 - startRealTime;
   if (elapsedRealTime < 60) {
      $('#realTime').text(elapsedRealTime.toFixed(1) + ' s');
   } else {
      $('#realTime').text((elapsedRealTime / 60).toFixed(1) + ' min');
   }
   
   $('#shownParticles').text(trajectories.length);
   $('#maxParticlesDisplay').text(Math.floor(parseFloat($('#MaxPart-input').val())));
   $('#nhits').text(nHits);
   $('#nSteps').text(nSteps);

   // Accumulate timing samples and update display once per second
   const elapsed2Final = performance.now() - startTime;
   calcTimeAccum += elapsed;
   stepTimeAccum += elapsed2Final;
   timingSampleCount++;
   const now = performance.now();
   if (now - lastTimingUpdate >= 1000 && timingSampleCount > 0) {
      const avgStep = stepTimeAccum / timingSampleCount;
      $('#stepTime').text(avgStep.toFixed(1));
      // Update branch count display
      if (logNBranches > 0) {
         $("#infoBranchCount").text(`10^${logNBranches.toFixed(0)}`);
      }
      calcTimeAccum = 0;
      stepTimeAccum = 0;
      timingSampleCount = 0;
      lastTimingUpdate = now;
   }


}
   //==================================================================================================================
   //
   //==================================================================================================================
   function updateAmplitudeVisibility() {
      const mode = $('#waveFunctionOption').val();
      if (mode === 'Phase') {
         $('#amplitude-container').show();
      } else {
         $('#amplitude-container').hide();
      }
   }
//==================================================================================================================
//
//==================================================================================================================
function updateSlitButton() {
   let label;
   if (slit1Open && slit2Open) {
      label = 'Both Slits';
   } else if (slit1Open) {
      label = 'Slit 1 Only';
   } else {
      label = 'Slit 2 Only';
   }
   $('#toggleSlits').text(label);
}
//==================================================================================================================
// Cache invalidation helpers — reduce copy-paste across event handlers
//==================================================================================================================
// Light: invalidate wave render cache only (palette/opacity/show-mode changes)
function invalidateWaveCache() {
   waveDataCache = {};
   shouldResetCache = true;
   lastCycleIndex = 100000;
}

// Full: also clear computed psi arrays (slit/detector/geometry changes)
function invalidateAllCaches() {
   invalidateWaveCache();
   basePsiReal = null;
   basePsiImag = null;
   basePsiPhase = null;
   detectorPsiCacheValid = false;
}

// ============ FDTD integration helpers ============

/**
 * Initialize (or re-initialize) the FDTD solver with the current
 * simulation geometry, then set up CW slit sources and pre-run
 * to establish the steady-state wave pattern.
 */
function initFDTD() {
   if (typeof FDTD === 'undefined') {
      console.error('FDTD solver not loaded');
      return false;
   }

   // Destroy previous instance if any
   if (fdtdInitialized) {
      FDTD.destroy();
      fdtdInitialized = false;
   }

   const mass = (particleType === 'neutron') ? mNeutron : mElectron;

   // Compute NY so that dx = dy (isotropic grid).
   // This prevents anisotropic numerical dispersion that
   // would distort circular wavefronts into ovals.
   const aspect = worldCanvasDy / worldCanvasDx;
   const fdtdNY = Math.round(FDTD_NX * aspect);

   const ok = FDTD.init({
      nx: FDTD_NX,
      ny: fdtdNY,
      worldBounds: {
         xMin: 0,
         xMax: worldCanvasDx,
         yMin: 0,
         yMax: worldCanvasDy
      },
      particleMass: mass,
      hbar: hbar
   });

   if (!ok) {
      console.error('FDTD init failed');
      return false;
   }
   fdtdInitialized = true;

   // Build the potential barrier (wall + slits)
   FDTD.buildPotential({
      wallX: wallXWorld,
      wallWidth: 5,
      slit1Y: slit1YWorld,
      slit2Y: slit2YWorld,
      slitWidth: slitWidth,
      slit1Open: slit1Open,
      slit2Open: slit2Open
   });

   // Configure CW slit sources
   FDTD.clearField();
   FDTD.setCWSlitSources({
      sourceX: sourceXWorld,
      sourceY: sourceYWorld,
      slit1X: slit1XWorld,
      slit1Y: slit1YWorld,
      slit2X: slit2XWorld,
      slit2Y: slit2YWorld,
      slit1Open: slit1Open,
      slit2Open: slit2Open,
      amplitude: FDTD_CW_AMP,
      omega: omega,
      width: FDTD_CW_WIDTH
   });

   // Pre-run: compute enough steps for the wavefront to reach the
   // detector and for the interference pattern to stabilise.
   const gridInfo = FDTD.getGridInfo();
   const vPhase = omega / k;                       // phase velocity (nm/ns)
   const tTravel = detectorDistance / vPhase;       // time to reach detector
   const stepsToDetector = Math.ceil(tTravel / gridInfo.dt);
   const preRunSteps = Math.max(FDTD_PRE_RUN_MIN, stepsToDetector * 3);
   FDTD.step(preRunSteps);
   FDTD.syncCPU();

   // ── Diagnostic: verify spherical wavefront ──────────────────
   // Sample |ψ|² at 8 directions from slit-1 source at a fixed
   // world-space radius. For a free-space CW source this must be
   // isotropic (max/min ratio ≈ 1).
   const srcXWorld = (gridInfo.worldXMin + (gridInfo.wallRightIx + 2) * gridInfo.dx);
   const srcYWorld = slit1Open ? slit1YWorld : slit2YWorld;
   const testR = 40 * gridInfo.dx;                 // test radius ≈ 40 cells
   const angles = [0, 45, 90, 135, 180, 225, 270, 315];
   let diagPsi2 = [];
   for (const a of angles) {
      const rad = a * Math.PI / 180;
      const tx = srcXWorld + testR * Math.cos(rad);
      const ty = srcYWorld + testR * Math.sin(rad);
      const p = FDTD.readPsi(tx, ty);
      diagPsi2.push(p.psi2);
   }
   const maxP = Math.max(...diagPsi2);
   const minP = Math.min(...diagPsi2.filter(v => v > 0));
   const ratio = minP > 0 ? (maxP / minP) : Infinity;

   console.log('──── FDTD Spherical-wave diagnostic ────');
   console.log('  Grid: ' + gridInfo.nx + '×' + gridInfo.ny +
               ', dx=' + gridInfo.dx.toFixed(3) + ', dy=' + gridInfo.dy.toFixed(3) +
               ', dt=' + gridInfo.dt.toExponential(3));
   console.log('  Physics: k=' + k.toFixed(4) + ' /nm, λ=' + wavelength.toFixed(1) +
               ' nm, ω=' + omega.toExponential(3) + ' rad/ns');
   console.log('  Numerics: k·dx=' + (k * gridInfo.dx).toFixed(4) +
               ', ω·dt=' + (omega * gridInfo.dt).toExponential(3) +
               ', cells/λ=' + (wavelength / gridInfo.dx).toFixed(1));
   console.log('  Source grid pos: ix=' + (gridInfo.wallRightIx + 2) +
               ', iy=' + ((gridInfo.worldYMax - srcYWorld) / gridInfo.dy).toFixed(1));
   console.log('  pre-run steps=' + preRunSteps +
               ' (' + (preRunSteps * gridInfo.dt * omega / (2*Math.PI)).toFixed(1) + ' wave periods)');
   console.log('  |ψ|² at r=' + testR.toFixed(1) + ' nm, 8 angles:');
   for (let i = 0; i < angles.length; i++) {
      console.log('    ' + angles[i] + '° : ' + diagPsi2[i].toExponential(4));
   }
   console.log('  Isotropy ratio (max/min): ' + ratio.toFixed(2) +
               (ratio < 3 ? ' ✓ OK' : ' ✗ ANISOTROPIC — problem in FDTD computation'));
   console.log('────────────────────────────────────────');

   console.log('FDTD ready: grid=' + FDTD_NX + 'x' + fdtdNY +
               ', dx=dy=' + gridInfo.dx.toFixed(2) + ' nm' +
               ', pre-ran ' + preRunSteps + ' steps (stepsToDetector=' + stepsToDetector + ')');
   return true;
}

/**
 * Lightweight FDTD restart: rebuild potential + sources without
 * recreating the WebGL context. Much faster than full init.
 */
function restartFDTD() {
   if (!fdtdInitialized || typeof FDTD === 'undefined') {
      initFDTD();
      return;
   }

   // Compute dynamic pre-run based on slit-to-detector travel time
   const gridInfo = FDTD.getGridInfo();
   const vPhase = omega / k;
   const tTravel = detectorDistance / vPhase;
   const stepsToDetector = Math.ceil(tTravel / gridInfo.dt);
   const preRunSteps = Math.max(FDTD_PRE_RUN_MIN, stepsToDetector * 3);

   FDTD.restartCW(
      {
         wallX: wallXWorld,
         wallWidth: 5,
         slit1Y: slit1YWorld,
         slit2Y: slit2YWorld,
         slitWidth: slitWidth,
         slit1Open: slit1Open,
         slit2Open: slit2Open
      },
      {
         sourceX: sourceXWorld,
         sourceY: sourceYWorld,
         slit1X: slit1XWorld,
         slit1Y: slit1YWorld,
         slit2X: slit2XWorld,
         slit2Y: slit2YWorld,
         slit1Open: slit1Open,
         slit2Open: slit2Open,
         amplitude: FDTD_CW_AMP,
         omega: omega,
         width: FDTD_CW_WIDTH
      },
      preRunSteps
   );
}

/**
 * Initialize the Spectral (split-step GPU-FFT) solver.
 * Mirrors initFDTD() in structure; safe to call multiple times.
 * Respects `spectralScenario`: 'doubleSlit' (default), 'pointSource', or 'gaussianPacket'.
 * Returns a Promise<boolean>; sets spectralInitialized=true when ready.
 */
async function initSpectral() {
   const myGen = ++_spectralInitGen;   // mark this as the active init; stale ones will abort
   spectralInitialized = false;         // hide old field while re-initialising
   if (typeof SpectralSolver === 'undefined') {
      console.error('SpectralSolver not loaded — add js/spectral-solver.js to the page');
      return false;
   }

   const mass = (particleType === 'neutron') ? mNeutron : mElectron;

   const ok = SpectralSolver.init({
      nx: SPECTRAL_NX,
      ny: SPECTRAL_NX,   // square grid; aspect handled by world bounds
      worldBounds: {
         xMin: 0,
         xMax: worldCanvasDx,
         yMin: 0,
         yMax: worldCanvasDy
      },
      particleMass: mass,
      hbar: hbar,
      // Wider sponge for free-space (no wall): needs to absorb from all 4 sides cleanly.
      // Double-slit uses a thinner border since the wall handles the main boundary.
      abcWidth: (spectralScenario === 'pointSource') ? 40 : 20
   });

   if (!ok) {
      console.error('SpectralSolver.init() failed');
      return false;
   }

   if (spectralScenario === 'pointSource') {
      // ── Free-space single point source ─────────────────────────
      // No wall; single CW injector at the domain centre.
      SpectralSolver.setFreeSpaceMode();
      SpectralSolver.clearField();

      _spectralSrcX = worldCanvasDx * 0.5;
      _spectralSrcY = worldCanvasDy * 0.5;

      SpectralSolver.setPointSource({
         xWorld:    _spectralSrcX,
         yWorld:    _spectralSrcY,
         amplitude: SPECTRAL_CW_AMP,
         omega:     omega,
         width:     SPECTRAL_CW_WIDTH
      });

      console.log(`SpectralSolver [pointSource]: src=(${_spectralSrcX.toFixed(1)}, ${_spectralSrcY.toFixed(1)}) nm`);

   } else if (spectralScenario === 'gaussianPacket') {
      // ── Gaussian wave packet (split-operator, no pre-run) ──────
      // Mirrors the MATLAB split-operator simulation exactly.
      // Start with a localized packet on the left; it propagates into the wall.
      SpectralSolver.buildPotential({
         wallX:     wallXWorld,
         wallWidth: 5,
         slit1Y:    slit1YWorld,
         slit2Y:    slit2YWorld,
         slitWidth: slitWidth,
         slit1Open: slit1Open,
         slit2Open: slit2Open
      });

      // Packet parameters — tuned for MATLAB-style visual:
      //   σx: tight localized blob in x — at most 30% of source-to-wall gap
      //   σy: wide enough to illuminate both slits (amplitude ≥ 0.5 at slit positions)
      //       but visually localized — at most 30% of domain height
      const sigmaX = Math.min(worldCanvasDx * 0.10,
                              (wallXWorld - sourceXWorld) * 0.35);
      const sigmaY = Math.min(slitSeparation * 0.5, worldCanvasDy * 0.30);

      _spectralSrcX = sourceXWorld;
      _spectralSrcY = worldCanvasDy * 0.5;

      _packetParams = {
         x0: _spectralSrcX, y0: _spectralSrcY,
         sigmaX, sigmaY, kx: k, ky: 0
      };
      SpectralSolver.setGaussianPacket(_packetParams);

      // Compute auto-loop period: 1 domain transit + 50% settling time
      const _gi = SpectralSolver.getGridInfo();
      const vGroup = hbar * k / mass;          // ħk/m — group velocity (nm/ns)
      _packetLoopSteps = Math.max(500,
         Math.round(worldCanvasDx * 1.5 / (vGroup * _gi.dt)));
      _packetStepCount = 0;

      // No pre-run needed: let the animation propagate the packet
      spectralInitialized = true;
      console.log(`SpectralSolver [gaussianPacket] ready — σx=${sigmaX.toFixed(1)} nm, σy=${sigmaY.toFixed(1)} nm, kx=${k.toFixed(3)} 1/nm, loop every ${_packetLoopSteps} solver-steps`);
      return true;

   } else {
      // ── Double-slit scenario (default) ─────────────────────────
      SpectralSolver.buildPotential({
         wallX:     wallXWorld,
         wallWidth: 5,
         slit1Y:    slit1YWorld,
         slit2Y:    slit2YWorld,
         slitWidth: slitWidth,
         slit1Open: slit1Open,
         slit2Open: slit2Open
      });

      SpectralSolver.clearField();
      SpectralSolver.setCWSlitSources({
         sourceX:   sourceXWorld,
         sourceY:   sourceYWorld,
         slit1X:    slit1XWorld,
         slit1Y:    slit1YWorld,
         slit2X:    slit2XWorld,
         slit2Y:    slit2YWorld,
         slit1Open: slit1Open,
         slit2Open: slit2Open,
         amplitude: SPECTRAL_CW_AMP,
         omega:     omega,
         width:     SPECTRAL_CW_WIDTH
      });

      _spectralSrcX = sourceXWorld;
      _spectralSrcY = sourceYWorld;

      console.log(`SpectralSolver [doubleSlit]: wall x=${wallXWorld.toFixed(1)} nm`);
   }

   // Pre-run to establish the CW steady-state wave pattern.
   // We cap at stepsToTarget (one crossing time) to limit startup cost; the wave
   // builds to full steady-state during the first few seconds of normal animation.
   const gridInfo = SpectralSolver.getGridInfo();
   const vPhase  = omega / k;
   const tTravel = (spectralScenario === 'pointSource')
      ? Math.max(worldCanvasDx, worldCanvasDy) * 0.5 / vPhase
      : detectorDistance / vPhase;
   const stepsToTarget = Math.ceil(tTravel / gridInfo.dt);
   // Cap pre-run: just enough for the wave-front to reach mid-domain.
   // Any remaining build-up happens live so the UI stays responsive.
   const preRunSteps = Math.min(stepsToTarget, 500);

   console.log(`SpectralSolver: async pre-run ${preRunSteps} / ${stepsToTarget} steps …`);

   // --- async chunked pre-run so the browser stays responsive ---------------
   spectralPreRunning = true;
   for (let done = 0; done < preRunSteps; done += SPECTRAL_PRE_RUN_BATCH) {
      if (_spectralInitGen !== myGen) {
         // A newer initSpectral() call has started — abort this one.
         spectralPreRunning = false;
         return false;
      }
      const batch = Math.min(SPECTRAL_PRE_RUN_BATCH, preRunSteps - done);
      SpectralSolver.step(batch);
      await new Promise(r => setTimeout(r, 0)); // yield to browser between batches
   }
   if (_spectralInitGen !== myGen) { spectralPreRunning = false; return false; }
   // --------------------------------------------------------------------------

   SpectralSolver.syncCPU();
   spectralInitialized = true;
   spectralPreRunning  = false;
   renderSetupFlag = true;
   console.log('SpectralSolver ready.');
   return true;
}

// Lightweight simulation reset: clear particles/hits but skip precompute
function lightweightReset() {
   renderSetupFlag = 1;
   hits.fill(0);
   trajectories.length = 0;
   nParticles = 0;
   logNBranches = 0;
   nHits = 0;
   hitMax = 0;
   time = 0;
   lastParticleTime = 0;
   lastRealTime = 0;
   particleAccum = 0;
   startRealTime = performance.now() / 1000;
   // Clear alt-branch ghost
   if (showAltBranch) { altBranchHits = null; }
}
//==================================================================================================================
//
//==================================================================================================================
function updateWhichPathButton() {
   let label;
   if (whichPathDetector === 'none') {
      label = 'No Detector';
      $('#detectorWaveControls').hide();
   } else if (whichPathDetector === 'slit1') {
      label = 'Detector @ Slit 1';
      $('#detectorWaveControls').show();
   } else {
      label = 'Detector @ Slit 2';
      $('#detectorWaveControls').show();
   }
   $('#toggleWhichPath').text(label);
}
//==================================================================================================================
//
//==================================================================================================================
function updateViewButton() {
   const labels = { copenhagen: 'Collapse', bohmian: 'Pilot-Wave', manyworlds: 'Many-Worlds' };
   var label = labels[interpretation] || 'Collapse';
   $('#toggleView').text(label);
   $('#view-label').text(label);
}
//==================================================================================================================
// Render KaTeX math formulas in the Math tab based on current state
//==================================================================================================================
function updateMathFormulas() {
   if (typeof katex === 'undefined') return;

   const hasDetector = (whichPathDetector !== 'none');
   const bothSlits = slit1Open && slit2Open;

   // Domain 1: before the wall — always a single spherical wave from the source
   const d1El = document.getElementById('mathDomain1');
   if (d1El) {
      katex.render(
         String.raw`\Psi_{\text{I}}(\mathbf{r},t) = \frac{e^{i(k\,r_s - \omega t)}}{r_s}`,
         d1El, { displayMode: true, throwOnError: false }
      );
   }

   // Domain 2: after the wall
   const d2El = document.getElementById('mathDomain2');
   if (d2El) {
      let d2Latex;
      if (!bothSlits) {
         // Single slit open
         const slitLabel = slit1Open ? '1' : '2';
         d2Latex = String.raw`\Psi_{\text{II}}(\mathbf{r},t) = \frac{e^{i(k\,r_{` + slitLabel + String.raw`} - \omega t)}}{r_{` + slitLabel + `}}`;
      } else if (!hasDetector) {
         // Two slits, no detector — coherent superposition (interference)
         d2Latex = String.raw`\Psi_{\text{II}}(\mathbf{r},t) = \frac{e^{i(k\,r_1 - \omega t)}}{r_1} + \frac{e^{i(k\,r_2 - \omega t)}}{r_2}`;
      } else {
         // Two slits with detector — entangled with detector state (no interference)
         d2Latex = String.raw`\Psi_{\text{II}}(\mathbf{r},t) = \frac{e^{i(k\,r_1 - \omega t)}}{r_1}\,|d_1\rangle + \frac{e^{i(k\,r_2 - \omega t)}}{r_2}\,|d_2\rangle`;
      }
      katex.render(d2Latex, d2El, { displayMode: true, throwOnError: false });
   }

   // Detector explanation
   const noteEl = document.getElementById('mathDetectorNote');
   const explainEl = document.getElementById('mathDetectorExplain');
   if (noteEl && explainEl) {
      if (hasDetector && bothSlits) {
         noteEl.style.display = '';
         explainEl.innerHTML = '';
         const p = document.createElement('span');
         katex.render(
            String.raw`\langle d_1 | d_2 \rangle = 0`,
            p, { displayMode: false, throwOnError: false }
         );
         explainEl.appendChild(document.createTextNode(
            'The which-path detector entangles each slit path with an orthogonal detector state: '
         ));
         explainEl.appendChild(p);
         explainEl.appendChild(document.createTextNode(
            '. Because the detector states are orthogonal, the cross terms vanish and the interference pattern disappears.'
         ));
      } else {
         noteEl.style.display = 'none';
      }
   }

   // Particle velocity — only shown in Trajectory-Based view
   const bvSection = document.getElementById('mathBohmSection');
   const bvEl = document.getElementById('mathBohmV');
   if (bvSection) {
      bvSection.style.display = (interpretation === 'bohmian') ? '' : 'none';
   }
   if (bvEl && interpretation === 'bohmian') {
      let bvLatex;
      if (particleType === 'photon') {
         bvLatex = String.raw`\mathbf{v} = c\,\frac{\mathbf{J}}{|\mathbf{J}|}, \quad \mathbf{J} = \text{Im}\!\left(\Psi^*\nabla\Psi\right)`;
      } else {
         bvLatex = String.raw`\mathbf{v} = \frac{\hbar}{m}\,\text{Im}\!\left(\frac{\nabla\Psi}{\Psi}\right)`;
      }
      katex.render(bvLatex, bvEl, { displayMode: true, throwOnError: false });
   }

   // Legend
   const legendEl = document.getElementById('mathLegend');
   if (legendEl) {
      legendEl.innerHTML = '';
      const items = [
         [String.raw`r_s`, 'distance from source'],
         [String.raw`r_1, r_2`, 'distance from slit 1, 2'],
         [String.raw`k = 2\pi/\lambda`, 'wave number'],
         [String.raw`\omega`, 'angular frequency']
      ];
      if (hasDetector && bothSlits) {
         items.push([String.raw`|d_1\rangle,|d_2\rangle`, 'orthogonal detector states']);
      }
      items.forEach(([sym, desc]) => {
         const span = document.createElement('span');
         katex.render(sym, span, { displayMode: false, throwOnError: false });
         const line = document.createElement('div');
         line.appendChild(span);
         line.appendChild(document.createTextNode(' — ' + desc));
         legendEl.appendChild(line);
      });
   }
}
//==================================================================================================================
// Sync the math-tab replica buttons with the setup-tab buttons
//==================================================================================================================
function syncMathButtons() {}

// Wire up button hover → status-line help text
function initButtonStatusLines() {
   var $status = $('#setupBtnStatus');
   $('#toggleSlits, #toggleWhichPath, #toggleView').on('mouseenter', function() {
      var tip = $(this).attr('data-tip') || $(this).attr('data-help');
      if (tip) $status.text(tip);
   }).on('mouseleave', function() {
      $status.html('&nbsp;');
   });
}
//==================================================================================================================
//
//==================================================================================================================
function updateInterpretationDisplay() {
  if (interpretation === "copenhagen") {
    $("#plot_trajectories").prop("checked", false);
    $("#plot_particles").prop("checked", false);
   if ( $("#waveFunctionOption").val() == "QPotential" ) $("#waveFunctionOption").val("Phase");
   $("#waveFunctionOption").val("Phase");
    $("#manyBranchesInfo").hide();

    $("#waveFunctionOption option[value='QPotential']").remove();
    $("#basicsWaveFunctionOption option[value='QPotential']").remove();

  // Force fallback to Phase if needed
    const currentVal = $("#waveFunctionOption").val();
    if (currentVal === "QPotential") {
       $("#waveFunctionOption").val("Phase").trigger("change");
    }
    $("#basicsWaveFunctionOption").val($("#waveFunctionOption").val());

    
  } else if (interpretation === "bohmian") {
    $("#plot_trajectories").prop("checked", true);
    $("#plot_particles").prop("checked", true);
    $("#manyBranchesInfo").hide();
  // Re-add QPotential if missing
    if ($("#waveFunctionOption option[value='QPotential']").length === 0) {
      $("#waveFunctionOption").append(
            $("<option>", { value: "QPotential", text: "sgn(Q)log(|Q|)" })
      );
      $("#basicsWaveFunctionOption").append(
            $("<option>", { value: "QPotential", text: "sgn(Q)log(|Q|)" })
      );
    }
    $("#basicsWaveFunctionOption").val($("#waveFunctionOption").val());
  } 
  else if (interpretation === "manyworlds") {
    $("#plot_trajectories").prop("checked", false);
    $("#plot_particles").prop("checked", false);
    $("#waveFunctionOption").val("Phase");
    $("#basicsWaveFunctionOption").val("Phase");
    $("#manyBranchesInfo").show();
	
  }
   // Show trajectory/particle controls only in Pilot-Wave mode
   if (interpretation === 'bohmian') {
      $('.bohmian-only').show();
      $('#trajOpacity-group').show();
   } else {
      $('.bohmian-only').hide();
      $('#trajOpacity-group').hide();
   }

   // Show Many-Worlds-only info rows
   if (interpretation === 'manyworlds') {
      $('.manyworlds-only').show();
   } else {
      $('.manyworlds-only').hide();
   }

   // Ensure the Amplitude control visibility matches the current
   // Show selection after any programmatic changes.
   updateAmplitudeVisibility();
  if (!isAnimating) drawSystem(currentCycleIndex); 
}
//==================================================================================================================
// URL hash: encode/decode simulation config for shareable links
//==================================================================================================================
function buildUrlHash() {
   var p = {
      sep: $('#slit-separation-group')[0].getValueInFirstUnit(),
      src: $('#source-position-group')[0].getValueInFirstUnit(),
      det: $('#detector-distance-group')[0].getValueInFirstUnit(),
      scr: $('#screen-height-group')[0].getValueInFirstUnit(),
      wl:  $('#wavelength-group')[0].getValueInFirstUnit(),
      view: interpretation,
      slits: (slit1Open ? '1' : '0') + (slit2Open ? '1' : '0'),
      wp: whichPathDetector
   };
   var parts = [];
   for (var k in p) parts.push(k + '=' + encodeURIComponent(p[k]));
   return '#' + parts.join('&');
}

function applyUrlHash() {
   var hash = window.location.hash;
   if (!hash || hash.length < 2) return;
   var params = {};
   hash.substring(1).split('&').forEach(function(pair) {
      var kv = pair.split('=');
      if (kv.length === 2) params[kv[0]] = decodeURIComponent(kv[1]);
   });
   // Apply physics parameters
   if (params.sep) $('#slit-separation-group')[0].setValueInFirstUnit(parseFloat(params.sep));
   if (params.src) $('#source-position-group')[0].setValueInFirstUnit(parseFloat(params.src));
   if (params.det) $('#detector-distance-group')[0].setValueInFirstUnit(parseFloat(params.det));
   if (params.scr) $('#screen-height-group')[0].setValueInFirstUnit(parseFloat(params.scr));
   if (params.wl)  $('#wavelength-group')[0].setValueInFirstUnit(parseFloat(params.wl));
   // Apply view
   if (params.view) {
      interpretation = params.view;
      updateViewButton();
      updateInterpretationDisplay();
   }
   // Apply slit config
   if (params.slits && params.slits.length === 2) {
      slit1Open = params.slits[0] === '1';
      slit2Open = params.slits[1] === '1';
      updateSlitButton();
   }
   // Apply which-path detector
   if (params.wp) {
      whichPathDetector = params.wp;
      updateWhichPathButton();
   }
   // Recalc geometry with new parameters
   setupGeo(false);
   runPrecomputeAsync();
   updateMathFormulas();
   syncMathButtons();
}

function copyShareLink() {
   var url = window.location.href.split('#')[0] + buildUrlHash();
   navigator.clipboard.writeText(url).then(function() {
      $('#shareButton').text('Copied!');
      setTimeout(function() { $('#shareButton').text('\uD83D\uDD17 Share Link'); }, 1500);
   });
}
//==================================================================================================================
//
//==================================================================================================================
$(document).ready(function() {
      //canvas = document.getElementById('canvas');
      //ctx    = canvas.getContext('2d');

      initPrecomputeWorker();

      canvas = document.getElementById('setupCanvas');
      setupCtx = $('#setupCanvas')[0].getContext('2d');
      partCtx =  $('#partCanvas')[0].getContext('2d');
      waveCtx  = $('#waveCanvas')[0].getContext('2d');

	  // Try to enable GPU-based wave rendering. This uses an
	  // offscreen WebGL canvas and keeps the visible waveCanvas
	  // available for 2D drawing.
	  initWaveWebGL();


      createParameterInput('detector', 'slit-separation', 'Slit Sep.', 0, 2000, 1, 500, [
         { value: 'nm', text: 'nm', scale:1 },
         { value: 'um', text: 'µm', scale:1.e3 },
         { value: 'mm', text: 'mm', scale:1.e6 }
         ], true);

      createParameterInput('detector', 'source-position', 'Src. Pos.', 0, 1000, 1, 225, [
         { value: 'nm', text: 'nm', scale:1 },
         { value: 'um', text: 'µm', scale:1.e3 },
         { value: 'mm', text: 'mm', scale:1.e6 }
         ], true);

      createParameterInput('detector', 'detector-distance', 'Detector Distance', 0, 1000, 1, 400, [
            { value: 'nm', text: 'nm', scale:1 },
            { value: 'um', text: 'µm', scale:1.e3 },
            { value: 'mm', text: 'mm', scale:1.e6 }
            ], true);
      /*
         createParameterInput('wall-width', 'Wall Width', 1, 10, 0.1, 5, [
         { value: 'mm', text: 'mm', scale:1 },
         { value: 'um', text: 'um', scale:1.e-3 },
         { value: 'nm', text: 'nm', scale:1.e-6 }
         ], true);
         */
      createParameterInput('detector', 'screen-height', 'Screen Height', 100, 5000, 10, 1200, [
            { value: 'nm', text: 'nm', scale:1 },
            { value: 'um', text: 'µm', scale:1.e3 },
            { value: 'mm', text: 'mm', scale:1.e6 }
            ], true);

      createParameterInput('detector', 'det-pixels', 'Det. Pixels', 10, 500, 1., 100., [
            { value: '', text: '', scale:1 },
            ], false);


      createParameterInput('particle', 'wavelength', 'λ', 1, 500, 1, 100, [
            { value: 'nm', text: 'nm', scale:1 },
            { value: 'um', text: 'µm', scale:1.e3 },
            { value: 'mm', text: 'mm', scale:1.e6 }
            ], true);

      createParameterInput('particle', 'particleRate', 'Particles/s', 1, 100, 1, 10, [
            { value: '', text: '', scale:1 }
            ], false);

      createParameterInput('particle', 'MaxPart', 'Max. Particles', 1, 1000, 1., 400., [
            { value: '', text: '', scale:1 },
            ], false);

      // Simulation speed multiplier: 1.0x = normal, >1x faster, <1x slower
      createParameterInput('particle', 'animationStep', 'Sim. Speed', 0.25, 10.0, 0.05, 1.0, [
       { value: '', text: 'x', scale:1. },
       ], false);

      createParameterInput('graphics', 'WaveWidth', 'Wave Width', 1, 200, 1., 10., [
            { value: '', text: '', scale:1 },
            ], false);
      $('#WaveWidth-group').addClass('bohmian-only');

      // Create opacity box container
      var opacityBox = $('<div>', { class: 'opacity-box', id: 'opacity-box' });
      opacityBox.append($('<div>', { class: 'opacity-box-title', text: 'Opacity' }));
      $('#graphics-parameter-container').append(opacityBox);

      // Opacity controls for wave and trajectories/particles (0..1)
      createParameterInput('opacity-box', 'waveOpacity', 'Wave', 0.0, 1.0, 0.05, 1.0, [
         { value: '', text: '', scale:1 },
         ], false);

      createParameterInput('opacity-box', 'trajOpacity', 'Traj/Part', 0.0, 1.0, 0.05, 1.0, [
         { value: '', text: '', scale:1 },
         ], false);

      // Add Reset Defaults button
      var resetDefaultsBtn = $('<button>', { 
         id: 'resetDefaultsButton', 
         text: 'Reset Defaults',
         title: 'Reset all settings (canvas size, colors, fonts) to defaults'
      });
      resetDefaultsBtn.css({ marginTop: '10px', width: '100%' });
      $('#graphics-parameter-container').append(resetDefaultsBtn);
      
      $('#resetDefaultsButton').on('click', function() {
         // Remove the beforeunload listener so we don't re-save state
         window.removeEventListener('beforeunload', saveSimulationState);
         // Clear all localStorage
         localStorage.clear();
         // Reload the page to apply defaults
         location.reload();
      });

      // Screenshot + Share Link buttons on one row
      var btnRow = $('<div>').css({ display: 'flex', gap: '6px', marginTop: '6px' });
      var screenshotBtn = $('<button>', {
         id: 'screenshotButton',
         text: '\u{1F4F7} Screenshot',
         title: 'Save the current simulation view as a PNG image'
      }).css({ flex: '1' });
      var shareBtn = $('<button>', {
         id: 'shareButton',
         text: '\uD83D\uDD17 Share Link',
         title: 'Copy a shareable URL with current simulation parameters'
      }).css({ flex: '1' });
      btnRow.append(screenshotBtn, shareBtn);
      $('#graphics-parameter-container').append(btnRow);

      $('#screenshotButton').on('click', function() {
         var w = canvas.width, h = canvas.height;
         var tmpCanvas = document.createElement('canvas');
         tmpCanvas.width = w;
         tmpCanvas.height = h;
         var tmpCtx = tmpCanvas.getContext('2d');
         // Fill with solid background so no transparent regions
         var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
         tmpCtx.fillStyle = isDark ? '#0f172a' : '#ffffff';
         tmpCtx.fillRect(0, 0, w, h);
         // Layer order: setup (background, walls, detector) → wave → particles
         tmpCtx.drawImage(document.getElementById('setupCanvas'), 0, 0);
         tmpCtx.drawImage(document.getElementById('waveCanvas'), 0, 0);
         tmpCtx.drawImage(document.getElementById('partCanvas'), 0, 0);
         // Download
         var link = document.createElement('a');
         link.download = 'quantum-sim-' + Date.now() + '.png';
         link.href = tmpCanvas.toDataURL('image/png');
         link.click();
      });

      $('#shareButton').on('click', function() {
         copyShareLink();
      });


      $('#waveFunctionOption').change(function() {
            var selectedOption = $(this).val();
            });
      reset=0;

      // Set scale color based on theme (white for dark, black for light)
      const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDarkTheme) {
         colorScale = '#ffffff'; // White for dark theme
      } else {
         colorScale = '#000000'; // Black for light theme
      }

      $('#hit-color').css('background-color', colorHit);
      $('#prob-color').css('background-color', colorProb);
      $('#part-color').css('background-color', colorPart);
      $('#traj-color').css('background-color', colorTraj);
      $('#scale-color').css('background-color', colorScale);
      $('#detector-color').css('background-color', colorDetector);
      $('#screen-color').css('background-color', colorScreen);
      $('#sensor-color').css('background-color', colorSensor);
      $('#psi-color').css('background-color', colorPsi);


      const paletteEntries = Object.entries(window.paletteModule.palettes);
      const paletteIndex = 2; // Gray 
      const [paletteName, hexPalette] = paletteEntries[paletteIndex];
      graphPalette = window.paletteModule.prepareRgbPalette(hexPalette);
      
      // Initialize which-path detector palettes (blue and green)
      graphPaletteSlit1 = window.paletteModule.prepareRgbPalette(window.paletteModule.palettes.Blue);
      graphPaletteSlit2 = window.paletteModule.prepareRgbPalette(window.paletteModule.palettes.Green);
      
	  if (useWebGLWave) {
	     updateWavePaletteTexture();
	     updateWavePalette2Texture();
	     updateWavePalette1Texture();
	  }
	  
	  // Draw the palette canvas previews for detector mode
	  drawPalette1Canvas();
	  drawPalette2Canvas();
 
      restoreSimulationState()
      setupGeo(false);
      runPrecomputeAsync();
      const $popup = $('#palettePopup');
     
      
      var xMin=-0.5*Math.PI;
      var xMax= 0.5*Math.PI;
      var nBins = 50;
      phiHist1 = new Histogram('Phi1');
      phiHist1.configure(xMin, xMax, nBins);
      phiHist2 = new Histogram('Phi2');
      phiHist2.configure(xMin, xMax, nBins);

// Initial styling
      updateSlitButton();
      updateWhichPathButton();
      updateViewButton();
      updateMathFormulas();
      syncMathButtons();
      initButtonStatusLines();



      time = 0 ;
      var slitPositionY = canvas.height / 2; // Y position of slits
      var screenDistance = canvas.width * 0.8; // Distance to the detection screen

      var animationId; // Store the animation frame ID
      isAnimating = false; // Track the animation state

      const particlesOn = $("#plot_particles").is(":checked");
      const trajectoriesOn = $("#plot_trajectories").is(":checked");
      let defaultMode = (particlesOn || trajectoriesOn) ? "bohmian" : "copenhagen";
      // Set interpretation variable and update display
      interpretation = defaultMode;
      updateInterpretationDisplay();
      updateViewButton();
      logNDetectorPixels=Math.log10(nDetectorPixels);
      if (interpretation === "manyworlds") $("#manyBranchesInfo").show();
      else $("#manyBranchesInfo").hide();
      $("#psiTabs").tabs();
      $("#superContainer").tabs();

      // ========== BASICS TAB WIRING ==========
      // Move wavelength, slit-separation, and speed sliders into the Basics tab
      // (they were created by createParameterInput above)
      $('#basics-params').append($('#wavelength-group'));
      $('#basics-params').append($('#slit-separation-group'));
      $('#basics-params').append($('#animationStep-group'));

      // ========== MIRROR SLIDERS ==========
      // Physics tab: wavelength and sim speed mirrors
      createMirrorSlider('physics-mirror-sliders', 'wavelength', 'λ');
      createMirrorSlider('physics-mirror-sliders', 'animationStep', 'Sim. Speed');
      // Setup tab: slit separation mirror
      createMirrorSlider('setup-mirror-sliders', 'slit-separation', 'Slit Sep.');

      // Advanced toggle button: show/hide advanced tabs
      var advancedSaved = localStorage.getItem('showAdvanced') === 'true';
      if (advancedSaved) {
         $('#psiTabs').addClass('show-advanced');
         $('body').addClass('show-advanced');
         $('#advancedToggle').addClass('active');
      }
      $('#advancedToggle').on('click', function () {
         var isOn = $(this).hasClass('active');
         if (!isOn) {
            $(this).addClass('active');
            $('#psiTabs').addClass('show-advanced');
            $('body').addClass('show-advanced');
            localStorage.setItem('showAdvanced', 'true');
         } else {
            $(this).removeClass('active');
            $('#psiTabs').removeClass('show-advanced');
            $('body').removeClass('show-advanced');
            // If an advanced tab was active, switch back to Basics
            var activeIndex = $('#psiTabs').tabs('option', 'active');
            var activePanel = $('#psiTabs .ui-tabs-nav li').eq(activeIndex);
            if (activePanel.hasClass('advanced-tab')) {
               $('#psiTabs').tabs('option', 'active', 0);
            }
            localStorage.setItem('showAdvanced', 'false');
         }
      });

      // Initial sync of all button labels
      updateViewButton();

      // Sync Basics Show dropdown ↔ Physics Show dropdown
      $('#basicsWaveFunctionOption').val($('#waveFunctionOption').val());
      $('#basicsWaveFunctionOption').on('change', function () {
         $('#waveFunctionOption').val($(this).val()).trigger('change');
      });
      $('#waveFunctionOption').on('change.basicsSync', function () {
         $('#basicsWaveFunctionOption').val($(this).val());
      });

      // ── Wave-mode toggle (Analytical ↔ Numerical FDTD) ────────
      // Sync Basics Wave Mode ↔ Physics Wave Mode selectors
      $('#basicsWaveMode').val(waveMode);
      $('#waveMode').val(waveMode);

      function applyWaveMode(newMode) {
         if (newMode === waveMode) return;
         waveMode = newMode;
         $('#basicsWaveMode').val(newMode);
         $('#waveMode').val(newMode);

         invalidateAllCaches();

         if (waveMode === 'numerical') {
            if (!fdtdInitialized) {
               initFDTD();
            } else {
               restartFDTD();
            }
         } else if (waveMode === 'spectral') {
            initSpectral();   // async — returns immediately; pre-run runs in background
         }
         // Show/hide spectral sub-controls
         const showSpectral = (newMode === 'spectral');
         $('.spectralSubControls').toggle(showSpectral);
         // Force a full redraw in all modes
         renderSetupFlag = true;
      }

      // Initialise visibility of spectral sub-controls on page load
      $('.spectralSubControls').toggle(waveMode === 'spectral');

      // ── Spectral scenario / render-mode selectors ─────────────
      function applySpectralScenario(val) {
         if (val === spectralScenario) return;
         spectralScenario = val;
         // Sync both copies of the selector
         $('#spectralScenario').val(val);
         $('#spectralScenario2').val(val);
         // Gaussian-packet mode has no CW guidance field — clear any stale trajectories
         // so the display starts clean rather than showing analytically-driven paths.
         if (val === 'gaussianPacket') {
            trajectories.length = 0;
            nParticles = 0;
         }
         // Reinitialise the solver with the new scenario (async — won't block UI)
         if (spectralInitialized || spectralPreRunning) initSpectral();
         renderSetupFlag = true;
      }

      function applySpectralRenderMode(val) {
         spectralRenderMode = val;
         $('#spectralRenderMode').val(val);
         $('#spectralRenderMode2').val(val);
         renderSetupFlag = true;
      }

      $('#spectralScenario, #spectralScenario2').on('change', function () {
         applySpectralScenario($(this).val());
      });
      $('#spectralRenderMode, #spectralRenderMode2').on('change', function () {
         applySpectralRenderMode($(this).val());
      });

      $('#basicsWaveMode').on('change', function () {
         applyWaveMode($(this).val());
      });
      $('#waveMode').on('change', function () {
         applyWaveMode($(this).val());
      });
      
      // Restore saved panel and canvas sizes from localStorage
      // (only on wide viewports — responsive mode uses CSS-driven sizing)
      (function restoreSavedSizes() {
          if (window.innerWidth <= 900) return;
          
          const savedLeftPanelWidth = localStorage.getItem('leftPanelWidth');
          const savedLeftPanelHeight = localStorage.getItem('leftPanelHeight');
          const savedCanvasWidth = localStorage.getItem('canvasWidth');
          const savedCanvasHeight = localStorage.getItem('canvasHeight');
          
          if (savedLeftPanelWidth) {
              $("#leftPanel").css('width', savedLeftPanelWidth + 'px');
          }
          if (savedLeftPanelHeight) {
              $("#leftPanel").css('height', savedLeftPanelHeight + 'px');
          }
          if (savedCanvasWidth && savedCanvasHeight) {
              const w = parseInt(savedCanvasWidth);
              const h = parseInt(savedCanvasHeight);
              $("#canvas-container").css({width: w + 'px', height: h + 'px'});
              const canvasIds = ['setupCanvas', 'waveCanvas', 'partCanvas'];
              canvasIds.forEach(function(id) {
                  const c = document.getElementById(id);
                  if (c) {
                      c.width = w;
                      c.height = h;
                  }
              });
              canvas = document.getElementById('setupCanvas');
              setupCtx = canvas.getContext('2d');
              partCtx = document.getElementById('partCanvas').getContext('2d');
              waveCtx = document.getElementById('waveCanvas').getContext('2d');
              
              // Reinitialize WebGL so the offscreen GL canvas
              // matches the restored dimensions
              useWebGLWave = false;
              waveGl = null; waveGlCanvas = null; waveProgram = null;
              waveBuffer = null; waveAttribLoc = null; waveUniforms = {};
              wavePaletteTex = null; wavePalette1Tex = null; wavePalette2Tex = null;
              initWaveWebGL();
              updateWavePaletteTexture();
              if (typeof updateWavePalette1Texture === 'function') updateWavePalette1Texture();
              if (typeof updateWavePalette2Texture === 'function') updateWavePalette2Texture();
              
              setupGeo(false);
              runPrecomputeAsync();
          }
      })();
      
      // Make left panel resizable (width and height) - no max width limit
      $("#leftPanel").resizable({
          handles: "e, s, se",
          minWidth: 250,
          minHeight: 400,
          maxHeight: 900,
          stop: function(event, ui) {
              localStorage.setItem('leftPanelWidth', ui.size.width);
              localStorage.setItem('leftPanelHeight', ui.size.height);
          }
      });
      
      // Make canvas container resizable
      $("#canvas-container").resizable({
          handles: "e, s, se",
          minWidth: 400,
          minHeight: 300,
          maxWidth: 1200,
          maxHeight: 900,
          stop: function(event, ui) {
              // Called when resize is complete
              const w = ui.size.width;
              const h = ui.size.height;
              
              // Pause animation if running (will resume after)
              const wasAnimating = isAnimating;
              if (isAnimating) {
                  isAnimating = false;
                  cancelAnimationFrame(animationId);
              }
              
              // Resize all visible canvases to match container
              const canvasIds = ['setupCanvas', 'waveCanvas', 'partCanvas'];
              canvasIds.forEach(function(id) {
                  const c = document.getElementById(id);
                  if (c) {
                      c.width = w;
                      c.height = h;
                  }
              });
              
              // Update global canvas reference
              canvas = document.getElementById('setupCanvas');
              
              // Get fresh 2D contexts
              setupCtx = document.getElementById('setupCanvas').getContext('2d');
              partCtx = document.getElementById('partCanvas').getContext('2d');
              waveCtx = document.getElementById('waveCanvas').getContext('2d');
              
              // Disable WebGL temporarily - use CPU rendering
              useWebGLWave = false;
              waveGl = null;
              waveGlCanvas = null;
              waveProgram = null;
              waveBuffer = null;
              waveAttribLoc = null;
              waveUniforms = {};
              wavePaletteTex = null;
              wavePalette1Tex = null;
              wavePalette2Tex = null;
              
              // Invalidate caches but preserve simulation state
              invalidateAllCaches();
              
              // Recalculate geometry for new canvas size
              setupGeo(false);
              runPrecomputeAsync();
              
              // Force redraw
              renderSetupFlag = 1;
              drawSystem(currentCycleIndex);
              
              // Reinitialize WebGL after delay, then resume if was animating
              setTimeout(function() {
                  initWaveWebGL();
                  updateWavePaletteTexture();
                  if (wasAnimating) {
                      isAnimating = true;
                      $('#startButton').text('Stop');
                      evolveSystem();
                  } else {
                      drawSystem(currentCycleIndex);
                  }
                  // Save canvas size to localStorage
                  localStorage.setItem('canvasWidth', w);
                  localStorage.setItem('canvasHeight', h);
              }, 200);
          }
      });
      
      // ========== Responsive canvas resize on window change ==========
      (function() {
        var resizeTimer;
        window.addEventListener('resize', function() {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function() {
            // Only act in responsive mode (narrow viewport)
            if (window.innerWidth > 900) return;
            
            var container = document.getElementById('canvas-container');
            if (!container) return;
            
            var w = container.clientWidth;
            var h = container.clientHeight;
            if (w < 100 || h < 100) return;  // safeguard
            
            var wasAnimating = isAnimating;
            if (isAnimating) {
              isAnimating = false;
              cancelAnimationFrame(animationId);
            }
            
            ['setupCanvas', 'waveCanvas', 'partCanvas'].forEach(function(id) {
              var c = document.getElementById(id);
              if (c) { c.width = w; c.height = h; }
            });
            
            canvas = document.getElementById('setupCanvas');
            setupCtx = canvas.getContext('2d');
            partCtx  = document.getElementById('partCanvas').getContext('2d');
            waveCtx  = document.getElementById('waveCanvas').getContext('2d');
            
            useWebGLWave = false;
            waveGl = null; waveGlCanvas = null; waveProgram = null;
            waveBuffer = null; waveAttribLoc = null; waveUniforms = {};
            wavePaletteTex = null; wavePalette1Tex = null; wavePalette2Tex = null;
            
            invalidateAllCaches();
            setupGeo(false);
            runPrecomputeAsync();
            renderSetupFlag = 1;
            drawSystem(currentCycleIndex);
            
            setTimeout(function() {
              initWaveWebGL();
              updateWavePaletteTexture();
              if (wasAnimating) {
                isAnimating = true;
                $('#startButton').text('Stop');
                evolveSystem();
              } else {
                drawSystem(currentCycleIndex);
              }
            }, 200);
          }, 250);  // debounce 250ms
        });
      })();

      hits = new Array(nDetectorPixels).fill(0); // Histogram array

      drawSystem(0);

      // Dismiss loading overlay now that everything is rendered
      var overlay = document.getElementById('loadingOverlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(function() { overlay.remove(); }, 400);
      }

      // Initialize the Wave Range double slider UI now that the
      // DOM is ready; its numeric range will be updated the first
      // time a wave image is rendered.
      initWaveRangeSlider();


      $('.pick-color').on('click', function () {
            const elementId = $(this).attr('id');
            chooseColor(function (selectedColor) {
               if ( elementId == "hit-color" ) {
                  colorHit=selectedColor;
               $('#hit-color').css('background-color', colorHit);
               }
               if ( elementId == "prob-color" ) {
                  colorProb=selectedColor;
               $('#prob-color').css('background-color', colorProb);
               }
               else if ( elementId == "part-color" ) {
                  colorPart=selectedColor;
               $('#part-color').css('background-color', colorPart);
               }
               else if ( elementId == "traj-color" ) {
                  colorTraj=selectedColor;
               $('#traj-color').css('background-color', colorTraj);
               }
               else if ( elementId == "scale-color" ) {
                  colorScale=selectedColor;
               $('#scale-color').css('background-color', colorScale);
               }
               else if ( elementId == "detector-color" ) {
                  colorDetector=selectedColor;
                  $('#detector-color').css('background-color', colorDetector);
               }
               else if ( elementId == "screen-color" ) {
                  colorScreen=selectedColor;
                  $('#screen-color').css('background-color', colorScreen);
               }
               else if ( elementId == "sensor-color" ) {
                  colorSensor=selectedColor;
                  $('#sensor-color').css('background-color', colorSensor);
               }
               else if ( elementId == "psi-color" ) {
                  colorPsi=selectedColor;
                  $('#psi-color').css('background-color', colorPsi);
               }
               if (!isAnimating) drawSystem(0); 
            });
      });

      //=================================================================================
      //
      //=================================================================================


      $('#startButton').click(function() {
            if (isAnimating) {
               isAnimating = false;
               cancelAnimationFrame(animationId); // Stop the animation
               $(this).text('Start'); // Change button label to "Start"
            } else {
               isAnimating = true;
               // Initialize real time tracking if not set
               if (startRealTime === 0) {
                  startRealTime = performance.now() / 1000;
                  lastRealTime = 0;
                  particleAccum = 0;
               }
               evolveSystem(); // Start the animation
               $(this).text('Stop'); // Change button label to "Stop"
            }
      });
      $('#particleType').on('change', function () {
            const selectedValue = $(this).val();
            // particleRate (particles/s) doesn't need to change based on particle type
            reset=1;
            drawSystem(0);
      });

      // Delegate wavelength number/unit edits to the unified slider
      // handler by triggering the range input's "input" event. We
      // must NOT re-trigger from the range input itself, or we'd
      // create an infinite recursion.
      $('#wavelength-input, #wavelength-units').on('input change', function () {
         $('#wavelength').trigger('input');
      });


      $('#det-pixels, #det-pixels-input').on('input change', function () {
         yToBinWorld  = nDetectorPixels / worldCanvasDy; 
         yToBinCanvas = nDetectorPixels / canvas.height; 
         nDetectorPixels = parseFloat($('#det-pixels').val());
         nHits=0;
         hits = new Array(nDetectorPixels).fill(0); // Histogram array
         logNDetectorPixels=Math.log10(nDetectorPixels);
         renderDetectorAndHistogram() ;
      });


      $('#waveFunctionOption').on('change', function () {
         invalidateWaveCache();
      });

      $('#psi-color').on('click', function () {
         chooseColor(function (selectedColor) {
          // ? Reset cache only for wave function
             colorPsi=selectedColor;
             $('#psi-color').css('background-color', selectedColor);
             invalidateWaveCache();
         });
      });


      $('#plot_sensor').on('change', function () {
            if ( $("#plot_sensor").is(':checked') > 0 ) sensorWidth=30;
            else                                        sensorWidth=0;
            });
      $('#plot_screen, #plot_detector, #plot_scales').on('change', function () {
            renderSetupFlag = 1;
            });

      $('#plot_wave').on('change', function () {
         if ($("#plot_wave").is(':checked')) {
             $('#waveCanvas').show();
         }
         else {
             $('#waveCanvas').hide();
         }
      });

      $('#plot_palette').on('change', function () {
         if ($(this).is(':checked')) {
            $('#paletteScaleCanvas').show();
          } else {
            $('#paletteScaleCanvas').hide();
          }
      });
      

     $("#plot_particles, #plot_trajectories").on("change", function() {
      const particlesOn = $("#plot_particles").is(":checked");
      const trajectoriesOn = $("#plot_trajectories").is(":checked");

      const shouldBeBohmian = particlesOn || trajectoriesOn;

      if (shouldBeBohmian && interpretation !== "bohmian") {
        interpretation = "bohmian";
        updateInterpretationDisplay();
        updateViewButton();
        updateMathFormulas();
        syncMathButtons();
      } else if (!shouldBeBohmian && interpretation !== "copenhagen") {
        interpretation = "copenhagen";
        updateInterpretationDisplay();
        updateViewButton();
        updateMathFormulas();
        syncMathButtons();
      }
     });
      
      $('.replot').on('change', function () {
        if (!isAnimating) drawSystem(0); 
      });

      $('#waveFunctionOption').on('change', function () {
         invalidateWaveCache();
         updateAmplitudeVisibility();
         if (!isAnimating) drawSystem(currentCycleIndex); 
      });

      $('#waveOpacityMode').on('change', function () {
         // Opacity mode only affects how we map Psi² to alpha;
         // reuse cached intensity data and just redraw.
         if (!isAnimating) drawSystem(currentCycleIndex);
      });

      $('#waveOpacity, #waveOpacity-input, #trajOpacity, #trajOpacity-input').on('input change', function () {
         // Opacity sliders: force wave re-render by invalidating cache
         lastCycleIndex = -1;
         invalidateWaveCache();
         if (!isAnimating) drawSystem(currentCycleIndex);
      });

      
      $('#resetButton').click(function() {
         // Remember whether we were animating before reset
         const wasAnimating = isAnimating;

         // Stop any running animation while we reset state
         if (isAnimating) {
            isAnimating = false;
            cancelAnimationFrame(animationId);
         }

         // Signal a full simulation reset (particles, hits, time)
         reset = 1;

         // Immediately redraw so particles and detector counts clear
         drawSystem(0);

         // If the sim was running before reset, resume it
         if (wasAnimating) {
            isAnimating = true;
            $('#startButton').text('Stop');
            evolveSystem();
         } else {
            $('#startButton').text('Start');
         }
      });

      // Slit toggle: cycles Both → Slit 1 → Slit 2 → Both
      $('#toggleSlits').on('click', function () {
         if (slit1Open && slit2Open) {
            // Both → Slit 1 only
            slit2Open = false;
         } else if (slit1Open && !slit2Open) {
            // Slit 1 → Slit 2 only
            slit1Open = false;
            slit2Open = true;
         } else {
            // Slit 2 → Both
            slit1Open = true;
         }
         updateSlitButton();
         updateMathFormulas();
         syncMathButtons();
         invalidateAllCaches();
         reset = 1;
         drawSystem(0);
      });

      // Which-path detector toggle: cycles through 'none' -> 'slit1' -> 'slit2' -> 'none'
      $('#toggleWhichPath').on('click', function () {
         if (whichPathDetector === 'none') {
            whichPathDetector = 'slit1';
         } else if (whichPathDetector === 'slit1') {
            whichPathDetector = 'slit2';
         } else {
            whichPathDetector = 'none';
         }
         updateWhichPathButton();
         updateMathFormulas();
         invalidateAllCaches();
         lightweightReset();
         setupGeo(false);  // recalc canvas coords without precompute
         runPrecomputeAsync();
         syncMathButtons();
         drawSystem(0);
      });

      // View toggle: cycles Measure → Trajectory → Wave → Measure
      $('#toggleView').on('click', function () {
         if (viewLocked) return;
         const modes = ['copenhagen', 'bohmian', 'manyworlds'];
         const idx = modes.indexOf(interpretation);
         interpretation = modes[(idx + 1) % 3];
         updateViewButton();
         updateInterpretationDisplay();
         updateMathFormulas();
         syncMathButtons();
         if (!isAnimating) drawSystem(0);
      });
      
      $('#openPaletteBtn').on('click', function () {
        $popup.show();
      });

      $('#closePopupBtn').on('click', function () {
        $popup.hide();
      });
      
      // Wave visibility checkboxes for which-path mode
      $('#showWaveSlit1, #showWaveSlit2').on('change', function() {
         if (!isAnimating) drawSystem(currentCycleIndex);
      });
      
      // Opacity sliders for which-path mode waves
      $('#wave1Opacity').on('input', function() {
         $('#wave1OpacityVal').text($(this).val() + '%');
         if (!isAnimating) drawSystem(currentCycleIndex);
      });
      $('#wave2Opacity').on('input', function() {
         $('#wave2OpacityVal').text($(this).val() + '%');
         if (!isAnimating) drawSystem(currentCycleIndex);
      });
      
      // Palette 1 selector for slit 1 wave (in detector mode)
      $('#openPalette1Btn').on('click', function () {
         window.paletteModule.buildPalettePopup('palettePopup1', function (name, rgbPalette) {
            graphPaletteSlit1 = rgbPalette;
            drawPalette1Canvas();
            if (useWebGLWave) {
               updateWavePalette1Texture();
            }
            if (!isAnimating) drawSystem(currentCycleIndex);
            lastCycleIndex = 100000;
         });
         $('#palettePopup1').show();
      });
      
      // Palette 2 selector for slit 2 wave
      $('#openPalette2Btn').on('click', function () {
         // Build and show a palette popup for selecting slit 2 palette
         window.paletteModule.buildPalettePopup('palettePopup2', function (name, rgbPalette) {
            graphPaletteSlit2 = rgbPalette;
            drawPalette2Canvas();
            if (useWebGLWave) {
               updateWavePalette2Texture();
            }
            if (!isAnimating) drawSystem(currentCycleIndex);
            lastCycleIndex = 100000;
         });
         $('#palettePopup2').show();
      });

      $('#MaxPart-units').css('visibility','hidden');
      $('#WaveWidth-units').css('visibility','hidden');
      $('#det-pixels-units').css('visibility','hidden');


      // Rationale view-links: switch to Simulation tab and activate the view
      $(document).on('click', '.view-link', function (e) {
         e.preventDefault();
         var mode = $(this).data('view');
         // Switch interpretation
         interpretation = mode;
         updateInterpretationDisplay();
         updateViewButton();
         updateMathFormulas();
         syncMathButtons();
         if (!isAnimating) drawSystem(0);
         // Switch to Simulation tab (index 0)
         $('#superContainer').tabs('option', 'active', 0);
      });

      window.paletteModule.buildPalettePopup('palettePopup', function (name, rgbPalette) {
         graphPalette = rgbPalette; // already in RGB format
         invalidateWaveCache();
         if (useWebGLWave) {
            updateWavePaletteTexture();
         }
         if (!isAnimating) drawSystem(currentCycleIndex); 
      });

      window.addEventListener('beforeunload', saveSimulationState);

      // ============ Keyboard shortcuts ============
      $(document).on('keydown', function(e) {
         // Ignore when user is typing in an input/select/textarea
         var tag = e.target.tagName;
         if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

         if (e.code === 'Space') {
            e.preventDefault();
            $('#startButton').trigger('click');
         } else if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            $('#resetButton').trigger('click');
         } else if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            $('#screenshotButton').trigger('click');
         } else if (e.code === 'KeyV' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (!viewLocked) $('#toggleView').trigger('click');
         } else if (e.code === 'KeyW' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            var opts = $('#waveFunctionOption option').map(function() { return $(this).val(); }).get();
            var cur = $('#waveFunctionOption').val();
            var idx = opts.indexOf(cur);
            var next = opts[(idx + 1) % opts.length];
            $('#waveFunctionOption').val(next).trigger('change');
         }
      });

      // ============ URL hash state sharing ============
      applyUrlHash();

      // ============ View-lock via ?mode= query parameter ============
      // Usage: qsf-v1.html?mode=pilot-wave  (or collapse, manyworlds)
      // Locks the simulation to a single view and hides all view-switching UI.
      (function applyViewLock() {
         var urlParams = new URLSearchParams(window.location.search);
         var modeParam = urlParams.get('mode');
         if (!modeParam) return;

         // Normalize aliases
         var modeMap = {
            'pilot-wave': 'bohmian', 'pilotwave': 'bohmian', 'bohmian': 'bohmian', 'bohm': 'bohmian',
            'collapse': 'copenhagen', 'copenhagen': 'copenhagen', 'standard': 'copenhagen',
            'many-worlds': 'manyworlds', 'manyworlds': 'manyworlds', 'mwi': 'manyworlds', 'everett': 'manyworlds'
         };
         var mode = modeMap[modeParam.toLowerCase()];
         if (!mode) return;

         viewLocked = true;
         interpretation = mode;

         // Set active buttons (they'll be hidden, but keep state consistent)
         updateViewButton();
         updateInterpretationDisplay();
         updateMathFormulas();
         syncMathButtons();

         // Hide all view-switching UI
         $('body').addClass('view-locked');
      })();

      $('#resetBranches').on('click', function () {
         logNBranches=0;
         $("#infoBranchCount").text("1");
      });

      $('#resampleHitsButton').on('click', function () {
        resampleHitsFromPsi() ;
      });

      $('#wave-continous').change(function() {
         lastCycleIndex=1000000;
         if (!isAnimating) drawSystem(currentCycleIndex); 
      });

      

      //nHits=1000;
      //resampleHitsFromPsi();
});

