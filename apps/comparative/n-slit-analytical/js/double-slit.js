// Active physics is implemented in packet-engine.js and source-packet-model.js.
// This file retains the application shell, controls, canvases, and compatibility
// hooks used by the packet engine; stationary-wave routines below are not the
// active simulation model.
// Display-only opacity values; separate from model and interpretation state.
var displayOpacities = {};
function elementOpacity(id, fallback = 1) {
   const value = displayOpacities[id];
   return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback;
}
function restoreDisplayOpacities(values) {
   if (!values || typeof values !== 'object') return;
   for (const id of ['plot_wave','plot_palette','hit_prob','plot_hits','plot_sensor','plot_trajectories','plot_particles','plot_screen','plot_detector','plot_scales']) {
      if (Number.isFinite(values[id])) displayOpacities[id] = Math.max(0, Math.min(1, values[id]));
   }
}
var amplitudes = [];
var yHits = [];
var detectorPsiCacheValid = false; // Flag to cache detector |ψ|² curve

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
// re-evaluating the wave field every frame and instead
// apply the known global time evolution analytically.
let basePsiReal = null;   // Float32Array
let basePsiImag = null;   // Float32Array
let basePsiPhase = null;  // Float32Array (phase at t=0)

var idebug=0;
var canvas;
var colorDetector="blue"
var colorHit="#2f6fd6" // blue: distinct from the green prediction curve also for red-green colour blindness (3.0-dev.21)
var colorPart="red"
var colorProb="green"
var colorPsi   ="white"
var colorTraj="red"
var colorScreen="#d4e6ef" // slit wall; matches the drawn wall
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
// (2.122: unused legacy sampleFromCDF removed; the packet engine samples detector pixels.)

//==================================================================================================
// Web Worker for off-main-thread precomputation
//==================================================================================================
var precomputeWorker = null;
var precomputeTimeout = null;
var precomputeSeq = 0; // sequence number to discard stale results

function initPrecomputeWorker() { /* Retired packet-incompatible renderer/precompute path. */ }

function recoverPrecompute() { /* Retired packet-incompatible renderer/precompute path. */ }

function runPrecomputeAsync() { /* Retired packet-incompatible renderer/precompute path. */ }

var detectorArrayFull;
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
var interpretation="copenhagen";
var precomputePending = false;
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
// N-slit generalization. Slit k (0-based, k = 0 at the top) has its centre at
// (2k - (N - 1)) · separation / 2, so neighbouring slits are one separation apart.
const MAX_SLITS = 16;
let numSlits = 2;
let slitOpen = Array(MAX_SLITS).fill(true);
let slit1Open = true;   // legacy aliases for the first two slits
let slit2Open = true;
function syncLegacySlits() { slit1Open = !!slitOpen[0]; slit2Open = numSlits > 1 && !!slitOpen[1]; }
function openSlitIds() { const ids = []; for (let k = 0; k < numSlits; k++) if (slitOpen[k]) ids.push(k); return ids; }
function slitCenterSign(k) { return 2 * k - (numSlits - 1); }
function slitName(k) {
   if (numSlits === 2) return k === 0 ? 'Upper' : 'Lower';
   return 'Slit ' + (k + 1);
}
// Which-slit detectors: any set of open slits may carry an ideal detector
// (slitDetector[k]). whichPathDetector is a derived summary: 'none' or
// 'slits:1,3' (1-based), kept for older code and shared links.
let slitDetector = Array(MAX_SLITS).fill(false);
let whichPathDetector = 'none';
function detectorSlitIds() { return openSlitIds().filter(k => slitDetector[k]); }
function syncWhichPathDetector() {
   for (let k = 0; k < MAX_SLITS; k++) if (k >= numSlits || !slitOpen[k]) slitDetector[k] = false;
   const ids = detectorSlitIds();
   whichPathDetector = ids.length && openSlitIds().length >= 2 ? 'slits:' + ids.map(k => k + 1).join(',') : 'none';
}
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

const c = 299792458; // Speed of light in nm/ns
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
function initWaveWebGL() { /* Retired packet-incompatible renderer/precompute path. */ }

function updateWavePaletteTexture() { /* Retired packet-incompatible renderer/precompute path. */ }

function updateWavePalette2Texture() { /* Retired packet-incompatible renderer/precompute path. */ }

function renderWaveWithWebGL() { /* Retired packet-incompatible renderer/precompute path. */ }

//==================================================================================================================
//
//==================================================================================================================
//==================================================================================================================
//
//==================================================================================================================
function drawPaletteScale() { /* Retired packet-incompatible renderer/precompute path. */ }
//==================================================================================================================
// Draw dual palette scale bars for which-path detector mode (two half-height bars)
//==================================================================================================================
function drawDualPaletteScale() { /* Retired packet-incompatible renderer/precompute path. */ }
//==================================================================================================================
// Draw the palette 2 preview canvas for slit 2 wave in detector mode
//==================================================================================================================
function drawPalette2Canvas() { /* Retired packet-incompatible renderer/precompute path. */ }
//==================================================================================================================
// Draw the palette 1 preview canvas for slit 1 wave in detector mode
//==================================================================================================================
function drawPalette1Canvas() { /* Retired packet-incompatible renderer/precompute path. */ }
//==================================================================================================================
// Update WebGL texture for wave 1 palette (slit 1)
//==================================================================================================================
function updateWavePalette1Texture() { /* Retired packet-incompatible renderer/precompute path. */ }
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
   if (window.qonticTemplateLayout) {
      window.qonticWaveRangeControl?.setState({min:waveRangeAutoMin,max:waveRangeAutoMax,lower:waveRangeUserMin ?? waveRangeAutoMin,upper:waveRangeUserMax ?? waveRangeAutoMax});
      return;
   }
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
   if (window.qonticTemplateLayout) return;
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
      'detector-distance' : 'Wall-to-screen Distance',
      'screen-height' : 'Screen Length',
      'det-pixels' : 'Detector Pixels',
      'wavelength' : 'Wavelength',
      'particleRate' : 'Number of particles injected per second in real time (your clock, not simulation time)',
      'MaxPart' : 'Particles or hits per packet',
      'animationStep' : 'Simulation Speed Multiplier',
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
         const liveIds = ['slit-separation','source-position','detector-distance','screen-height','wavelength'];
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
         const liveIds = ['slit-separation','source-position','detector-distance','screen-height','wavelength'];
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

      const liveIds = ['slit-separation','source-position','detector-distance','screen-height','wavelength'];
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
// Set a saved value, clamped to the control's existing range; never widens the range.
function restoreParameterValue(id, value) {
   const $range = $('#' + id);
   const v = parseFloat(value);
   if (!$range.length || !Number.isFinite(v)) return;
   const lo = parseFloat($range.attr('min')), hi = parseFloat($range.attr('max'));
   const clamped = Math.min(Number.isFinite(hi) ? hi : v, Math.max(Number.isFinite(lo) ? lo : v, v));
   $range.val(clamped);
   $('#' + id + '-input').val(clamped);
   $range.trigger('input');
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
// Shared saved-preference schema; retained independently of the retired physics engine.
const SIMULATION_STATE_VERSION = 18;

// The retired point-source (1/r) field and its trajectory/precompute helpers
// were removed in Version 2.86. The active model is the Gaussian packet engine.

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
    numSlits,
    slitOpen: slitOpen.slice(),
    slit1Open,
    slit2Open,
    displayOpacities: {...displayOpacities},
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
  try { localStorage.setItem('nSlitState', JSON.stringify(state)); } catch (_) {}
}
//==============================================================================================================
//
//==============================================================================================================
function restoreSimulationState() {
  let state;
  try {
    const saved = localStorage.getItem('nSlitState');
    if (!saved) return;
    state = JSON.parse(saved);
  } catch (_) { return; }
  if (!state || typeof state !== 'object') return;
  // Version 2.96 changes the former black default to a visible red. Preserve
  // every explicitly selected non-black color while migrating the old default.
  if(state.colors&&['black','#000','#000000','rgb(0, 0, 0)'].includes(String(state.colors.hit).toLowerCase()))state.colors.hit='#2f6fd6';
  // 3.0-dev.21: the old red default on the green curve was hard to tell apart for red-green colour blindness.
  if(state.colors&&['#ef4444','rgb(239, 68, 68)'].includes(String(state.colors.hit).toLowerCase()))state.colors.hit='#2f6fd6';
  // Version 2.122 draws the slit wall in its swatch color; migrate the old unused blue default.
  if(state.colors&&['blue','#0000ff','rgb(0, 0, 255)'].includes(String(state.colors.screen).toLowerCase()))state.colors.screen='#d4e6ef';
  restoreDisplayOpacities(state.displayOpacities);

  // Clear old state if version doesn't match (units changed from mm to nm)
  if (!state.version || state.version < SIMULATION_STATE_VERSION) {
    localStorage.removeItem('nSlitState');
    console.log('Cleared old simulation state (version mismatch)');
    return;
  }

  // Restore values only. The ranges set when the controls were created stay
  // authoritative (e.g. lambda <= 50 nm keeps the paraxial regime stated in Physics).
  restoreParameterValue('wavelength', state.wavelength);
  restoreParameterValue('slit-separation', state.slitSeparation);
  restoreParameterValue('source-position', state.sourcePosition);
  restoreParameterValue('detector-distance', state.detectorDistance);
  restoreParameterValue('det-pixels', state.nDetectorPixels);
  restoreParameterValue('screen-height', state.screenHeight);
  if (state.particleRate) {
    restoreParameterValue('particleRate', state.particleRate);
  }


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

  if (Number.isInteger(state.numSlits) && Array.isArray(state.slitOpen)) {
    numSlits = Math.max(1, Math.min(MAX_SLITS, state.numSlits));
    slitOpen = Array.from({ length: MAX_SLITS }, (_, k) => state.slitOpen[k] !== false);
  } else {
    numSlits = 2; slitOpen = Array(MAX_SLITS).fill(true);
    slitOpen[0] = state.slit1Open !== false; slitOpen[1] = state.slit2Open !== false;
  }
  if (!openSlitIds().length) slitOpen[0] = true;
  syncLegacySlits();
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
   window.qonticMWBranches?.cancel();

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
   // The readout is the packet (group) speed hbar*k/m = 2*omega/k, matching the
   // packet engine; waveSpeed (phase speed) is still used for legacy canvas motion.
   var packetSpeed = particleType === 'photon' ? waveSpeed : 2 * waveSpeed;
   // packetSpeed is in nm/ns which equals m/s (1 nm/ns = 1e-9 m / 1e-9 s = 1 m/s)
   if (packetSpeed >= 1e6) {
      $('#waveSpeed').text((packetSpeed / 1e6).toFixed(2) + " Mm/s");
   } else if (packetSpeed >= 1000) {
      $('#waveSpeed').text((packetSpeed / 1000).toFixed(2) + " km/s");
   } else {
      $('#waveSpeed').text(packetSpeed.toFixed(2) + " m/s");
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

   worldCanvasDx = window.qonticPacketEngine?.viewportWidth ?? (1.4 * (sourcePos + detectorDistance)+sensorWidth);
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
   let nStepsPerCycle = Math.round(cyclePeriod / deltaT);
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

   // Geometry only; packet probabilities are computed by packet-engine.js.


}
//===========================================================================================================
//
//===========================================================================================================
async function renderSetup() {
  window.qonticPacketEngine?.draw();
}
//==================================================================================================================
//
//==================================================================================================================

//==================================================================================================================
//
//==================================================================================================================

//==================================================================================================================
//
//==================================================================================================================

//==================================================================================================================
//
//==================================================================================================================


//==================================================================================================================
//
//==================================================================================================================
async function updateSimulationState() {
  if (reset !== 1) return;
  reset = 0;
  if (!window.qonticPacketEngine?.enabled) return;
  setupGeo(false);
  window.qonticPacketEngine.reset();
}
//==================================================================================================================
//
//==================================================================================================================

//==================================================================================================================
//
//==================================================================================================================

//==================================================================================================================
//
//==================================================================================================================




async function renderDetectorAndHistogram(options = {}) {
  window.qonticPacketEngine?.histogram(options);
}
//==================================================================================================================
//
//==================================================================================================================
function resampleHitsFromPsi() {
  window.qonticPacketEngine?.sampleBranch();
}
//==================================================================================================================
//
//==================================================================================================================
async function renderWaveFunction() {
  window.qonticPacketEngine?.drawWave();
}
//==================================================================================================================
//
//==================================================================================================================
async function drawSystem() {
  if (!window.qonticPacketEngine?.enabled) return;
  await updateSimulationState();
  window.qonticPacketEngine.draw();
}
//==================================================================================================================
//
//==================================================================================================================
async function evolveSystem() {
  if (!isAnimating || !window.qonticPacketEngine?.enabled) return;
  await updateSimulationState();
  window.qonticPacketEngine.frame();
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
   // The old "Both Slits" cycle button was replaced by the per-slit buttons.
   updateSlitCountControls();
}
// Number of slits and one open/closed button per slit (Core tab).
function updateSlitCountControls() {
   const range = document.getElementById('slit-count'), out = document.getElementById('slit-count-output'), host = document.getElementById('slit-open-buttons');
   if (!range || !host) return;
   range.value = numSlits; out.textContent = String(numSlits);
   // Each slit cycles open → closed → detector → open.
   const html = Array.from({ length: numSlits }, (_, k) => {
      const state = !slitOpen[k] ? 'closed' : slitDetector[k] ? 'detector' : 'open';
      const atWall = document.getElementById('slit-at-wall')?.checked;
      const next = state === 'open' ? 'close it' : state === 'closed' ? (atWall ? 'open it (no detector while “Apply at the wall” is ticked)' : 'open it with a which-slit detector') : 'remove the detector';
      return '<button type="button" class="qontic-app-toggle slit-open-button slit-' + state + (state !== 'closed' ? ' active' : '') + '" data-slit="' + k + '" data-state="' + state + '" aria-label="Slit ' + (k + 1) + ', ' + state + '" title="Slit ' + (k + 1) + ' ' + (state === 'detector' ? 'open, with a which-slit detector' : state) + ': click to ' + next + '">' + (k + 1) + '</button>';
   }).join('');
   if (host.dataset.html !== html) {
      // Rebuilding the buttons would drop keyboard focus: restore it to the same slit.
      const focused = host.contains(document.activeElement) ? document.activeElement.dataset.slit : null;
      host.innerHTML = html; host.dataset.html = html;
      if (focused !== null && focused !== undefined) host.querySelector('[data-slit="' + focused + '"]')?.focus();
   }
   document.getElementById('slit-open-row').hidden = numSlits < 2;
}
// live = true: a slit was only opened or closed. The packet engine then keeps
// the run and changes the mask from now on (switchMask); if it cannot (other
// settings changed, detector on, Many-Worlds slow motion) the run is reset.
function slitConfigurationChanged(live = false) {
   syncLegacySlits();
   syncWhichPathDetector(); updateWhichPathButton();
   updateSlitButton();
   // Live switch: the running animation redraws on its next frame, and the Physics
   // text does not depend on which slits are open.
   if (live && window.qonticPacketEngine?.switchMask?.()) return;
   updateMathFormulas();
   syncMathButtons();
   invalidateAllCaches();
   reset = 1;
   drawSystem(0);
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

// Lightweight simulation reset: clear particles/hits but skip precompute
function lightweightReset() {
   window.qonticMWBranches?.cancel();
   renderSetupFlag = 1;
   if (hits) hits.fill(0);
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
   $('#nhits, #shownParticles, #systemTime').text('0');
   updateBranchCountDisplay();
   $('#realTime').text('0.0 s');
   // Clear alt-branch ghost
   if (showAltBranch) { altBranchHits = null; }
}
//==================================================================================================================
//
//==================================================================================================================
function updateWhichPathButton() {
   let label;
   $('#detectorWaveControls').hide();
   const ids = whichPathDetector === 'none' ? [] : detectorSlitIds(), open = openSlitIds();
   if (!ids.length) label = 'No Detectors';
   else if (numSlits === 2 && ids.length === 1) label = 'Detector @ ' + (ids[0] + 1) + ' (' + slitName(ids[0]).toLowerCase() + ')';
   else if (ids.length === open.length) label = 'Detectors @ all open';
   else label = (ids.length === 1 ? 'Detector @ ' : 'Detectors @ ') + ids.map(k => k + 1).join(', ');
   $('#toggleWhichPath').text(label).attr('aria-pressed', ids.length > 0)
      .attr('data-tip', ids.length ? 'Remove all which-slit detectors. Each slit button cycles open → closed → detector.' : 'Put an ideal which-slit detector at every open slit (no interference left). Each slit button cycles open → closed → detector, for any other choice.');
}
//==================================================================================================================
//
//==================================================================================================================
function updateModeExplanation() {
   const descriptions = {
      copenhagen: 'Orthodox: the wave gives outcome probabilities; individual screen detections are sampled. No path between preparation and detection is assigned.',
      bohmian: 'Pilot-Wave: particles have definite positions guided by the wave. Positions are sampled at the Gaussian source and propagated forward; screen crossings generate hits.',
      manyworlds: 'Many-Worlds: the wave evolves without collapse. The curve represents outcome weights; the hit markers on the histogram are the record of one sampled branch. The finite display branches over screen pixels conditional on detection; absorption and missed-screen records are not expanded.'
   };
   $('#modeExplanation').text(descriptions[interpretation]);
   $('#recordMeaning').text(interpretation === 'manyworlds'
      ? 'Screen statistics: one sampled branch history; the curve gives sensor-outcome weights.'
      : 'Screen statistics: accumulated detections compared with the model probability curve.');
}

function updateBranchCountDisplay() {
   // Each detection multiplies the branch count by the number of detector pixels N,
   // so after m detections it is N^m. Show that exactly rather than rounding to 10^k.
   const $count = $('#infoBranchCount');
   if (!(logNBranches > 0)) { $count.text('1').attr('aria-label', '1'); return; }
   const n = Math.round(parseFloat($('#det-pixels-input').val()));
   const m = n > 1 ? Math.round(logNBranches / Math.log10(n)) : 0;
   if (m >= 1 && Math.abs(m * Math.log10(n) - logNBranches) < 1e-6) {
      if (m === 1 || logNBranches < 6) {
         const exact = Math.round(Math.pow(n, m)).toLocaleString('en-US');
         $count.html(m === 1 ? exact : `${n}<sup>${m}</sup> = ${exact}`).attr('aria-label', m === 1 ? exact : `${n} to the power of ${m}, ${exact}`);
      } else {
         $count.html(`${n}<sup>${m}</sup>`).attr('aria-label', `${n} to the power of ${m}`);
      }
      return;
   }
   // Pixel count changed during the record: fall back to a power of ten.
   const exponent = logNBranches.toFixed(1);
   $count.html(`10<sup>${exponent}</sup>`).attr('aria-label', `10 to the power of ${exponent}`);
}

function changeInterpretation(mode) {
   if (viewLocked || !['copenhagen', 'bohmian', 'manyworlds'].includes(mode)) return;
   // Interpretation is a display choice: retain the detector record, clocks,
   // emission progress and in-flight trajectories (hidden outside Pilot-Wave).
   window.qonticMWBranches?.cancel();
   interpretation = mode;
   updateBranchCountDisplay();
   updateViewButton();
   updateInterpretationDisplay();
   updateMathFormulas();
   syncMathButtons();
   invalidateWaveCache();
   if (!isAnimating) drawSystem(currentCycleIndex);
}

function updateViewButton() {
   const labels = { copenhagen: 'Orthodox', bohmian: 'Pilot-Wave', manyworlds: 'Many-Worlds' };
   var label = labels[interpretation] || 'Orthodox';
   $('#toggleView').text(label);
   $('#view-label').text(label);
   updateModeExplanation();
}
//==================================================================================================================
// Render KaTeX math formulas in the Math tab based on current state
//==================================================================================================================
function updateMathFormulas() {
   if (window.qonticPacketEngine?.enabled) { window.qonticPacketEngine.updateMath(); return; }
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

   const renderFormula = (id, latex) => {
      const element = document.getElementById(id);
      if (element) katex.render(latex, element, {displayMode:true, throwOnError:false});
   };
   renderFormula('mathDensity', hasDetector && bothSlits
      ? String.raw`\rho(y)=|\psi_1(x_D,y)|^2+|\psi_2(x_D,y)|^2`
      : String.raw`\rho(y)=|\Psi_{\mathrm{II}}(x_D,y)|^2`);
   renderFormula('mathProbability', String.raw`p(y)=\frac{\rho(y)}{\int_{\mathrm{screen}}\rho(y')\,dy'},\qquad P_j=\int_{\mathrm{bin}\ j}p(y)\,dy`);
   renderFormula('mathCounts', String.raw`\mathbb{E}[n_j]=M P_j,\qquad \sigma_{n_j}\approx\sqrt{n_j}`);
   const velocityNote = document.getElementById('mathVelocityNote');
   if (velocityNote) velocityNote.textContent = hasDetector && bothSlits
      ? 'This is the guidance law for the coherent field. In the current two-slit which-path visualization, post-slit paths instead use a simplified straight-line construction with sampled angles; the app does not solve the joint particle–detector dynamics.'
      : 'For electrons and neutrons, the local phase gradient gives the velocity. Post-slit starting positions are reconstructed by tracing sampled screen endpoints backward through this field, then propagating forward.';
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
   $('#toggleWhichPath, #toggleView, #niceFringesButton').on('mouseenter', function() {
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
    $("#manyBranchesInfo").hide();
    $("#basicsWaveFunctionOption").val($("#waveFunctionOption").val());

    
  } else if (interpretation === "bohmian") {
    $("#plot_trajectories").prop("checked", true);
    $("#plot_particles").prop("checked", true);
    $("#manyBranchesInfo").hide();
    $("#basicsWaveFunctionOption").val($("#waveFunctionOption").val());
  } 
  else if (interpretation === "manyworlds") {
    $("#plot_trajectories").prop("checked", false);
    $("#plot_particles").prop("checked", false);
    $("#basicsWaveFunctionOption").val($("#waveFunctionOption").val());
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
      slits: slitOpen.slice(0, numSlits).map((o, k) => (!o ? '0' : slitDetector[k] ? 'd' : '1')).join(''),
      opacity: JSON.stringify(displayOpacities)
   };
   var parts = [];
   for (var k in p) parts.push(k + '=' + encodeURIComponent(p[k]));
   return '#' + parts.join('&') + (window.qonticPacketEngine?.hash() || '');
}

function applyUrlHash() {
   var hash = window.location.hash;
   if (!hash || hash.length < 2) return;
   var params = {};
   hash.substring(1).split('&').forEach(function(pair) {
      var kv = pair.split('=');
      if (kv.length === 2) params[kv[0]] = decodeURIComponent(kv[1]);
   });
   if (params.opacity) { try { restoreDisplayOpacities(JSON.parse(params.opacity)); } catch (_) {} }
   // Apply physics parameters
   if (params.sep) $('#slit-separation-group')[0].setValueInFirstUnit(parseFloat(params.sep));
   if (params.src) $('#source-position-group')[0].setValueInFirstUnit(parseFloat(params.src));
   if (params.det) $('#detector-distance-group')[0].setValueInFirstUnit(parseFloat(params.det));
   if (params.scr) $('#screen-height-group')[0].setValueInFirstUnit(parseFloat(params.scr));
   if (params.wl)  $('#wavelength-group')[0].setValueInFirstUnit(parseFloat(params.wl));
   // Apply view
   // Accept common names for the views; ignore unknown ones (3.0-dev.22).
   const viewNames = { copenhagen: 'copenhagen', orthodox: 'copenhagen', o: 'copenhagen', bohmian: 'bohmian', pilotwave: 'bohmian', pw: 'bohmian', manyworlds: 'manyworlds', mw: 'manyworlds' };
   if (params.view) params.view = viewNames[String(params.view).toLowerCase().replace(/[-_ ]/g, '')];
   if (params.view) {
      interpretation = params.view;
      updateViewButton();
      updateInterpretationDisplay();
   }
   // Apply slit config
   if (params.slits && /^[01d]{1,16}$/.test(params.slits)) {
      numSlits = params.slits.length;
      slitOpen = Array.from({ length: MAX_SLITS }, (_, k) => k >= numSlits || params.slits[k] !== '0');
      slitDetector = Array.from({ length: MAX_SLITS }, (_, k) => k < numSlits && params.slits[k] === 'd');
      if (!openSlitIds().length) slitOpen[0] = true;
      syncLegacySlits();
      updateSlitButton();
   }
   // Apply which-path detector
   // Older links: wp=slitK puts one detector at slit K.
   if (params.wp && /^slit\d+$/.test(params.wp)) slitDetector[parseInt(params.wp.slice(4), 10) - 1] = true;
   syncWhichPathDetector();
   updateWhichPathButton();
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


      createParameterInput('detector', 'slit-separation', 'Slit Sep.', 0, 2000, 1, 300, [
         { value: 'nm', text: 'nm', scale:1 },
         { value: 'um', text: 'µm', scale:1.e3 },
         { value: 'mm', text: 'mm', scale:1.e6 }
         ], true);

      createParameterInput('detector', 'source-position', 'Src. Pos.', 50, 1000, 1, 225, [
         { value: 'nm', text: 'nm', scale:1 },
         { value: 'um', text: 'µm', scale:1.e3 },
         { value: 'mm', text: 'mm', scale:1.e6 }
         ], true);

      createParameterInput('detector', 'detector-distance', 'Screen dist.', 50, 3000, 1, 1000, [
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
      createParameterInput('detector', 'screen-height', 'Screen Length', 120, 5000, 10, 1200, [
            { value: 'nm', text: 'nm', scale:1 },
            { value: 'um', text: 'µm', scale:1.e3 },
            { value: 'mm', text: 'mm', scale:1.e6 }
            ], true);

      createParameterInput('detector', 'det-pixels', 'Det. Pixels', 10, 500, 1., 100., [
            { value: '', text: '', scale:1 },
            ], false);


      createParameterInput('particle', 'wavelength', 'λ', 1, 50, 1, 50, [
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
         // Clear only this app's saved settings; other Q-Ontic apps share the origin.
         try {
            const own = ['nSlitState', 'showAdvanced', 'leftPanelWidth', 'canvasWidth', 'canvasHeight',
                         'theme', 'controlsFontSize', 'infoFontSize'];
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
            keys.filter(k => own.includes(k) || /^qontic-(double-slit|pw)-/.test(k))
                .forEach(k => localStorage.removeItem(k));
         } catch (_) {}
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
      // 2.128: the Display-tab swatch was drawn before this default existed, so it
      // stayed blank until the palette changed. Record the name and redraw it now.
      window.paletteModule.setPaletteByName?.(paletteName);
      window.qonticUpdateWavePalettePreview?.();
      
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
      // Open in Orthodox unless a link or saved state asks for another view.
      let defaultMode = "copenhagen";
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
      // Move wavelength and slit separation into Core. Simulation speed is
      // already exposed by the template run controls, so keep the legacy input
      // available to that control without rendering a duplicate row.
      // (they were created by createParameterInput above)
      $('#basics-params').append($('#wavelength-group'));
      $('#basics-params').append($('#slit-separation-group'));
      $('#animationStep-group').hide();

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
      
      // The shared template owns responsive sizing; retain legacy sizing otherwise.
      if (!window.qonticTemplateLayout) {
      // Restore saved panel and canvas sizes from localStorage
      // (only on wide viewports — responsive mode uses CSS-driven sizing)
      (function restoreSavedSizes() {
          if (window.innerWidth <= 900) return;
          
          const savedLeftPanelWidth = localStorage.getItem('leftPanelWidth');
          const savedCanvasWidth = localStorage.getItem('canvasWidth');
          const savedCanvasHeight = localStorage.getItem('canvasHeight');
          
          if (savedLeftPanelWidth) {
              $("#leftPanel").css('width', savedLeftPanelWidth + 'px');
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
      
      // Keep controls content-sized vertically; allow horizontal resizing.
      $("#leftPanel").resizable({
          handles: "e",
          minWidth: 250,
          stop: function(event, ui) {
              localStorage.setItem('leftPanelWidth', ui.size.width);
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

      }
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
               window.qonticPacketEngine?.pause();
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

      $('#slit-count').on('input', function () {
         numSlits = Math.max(1, Math.min(MAX_SLITS, parseInt(this.value, 10) || 2));
         slitOpen.fill(true);
         slitDetector.fill(false);
         slitConfigurationChanged();
      });
      // Slit buttons: open → closed → detector → open. Closing or opening a slit
      // keeps the run (live mask switch, so one click closes a slit mid-packet);
      // adding or removing a detector restarts it.
      $('#slit-open-buttons').on('click', '[data-slit]', function () {
         const k = +this.dataset.slit, state = this.dataset.state;
         // "Apply at wall": during a run, an open/close waits until the packet centre
         // reaches the wall (the front of the packet then sees the old slits, the back the new).
         const atWall = document.getElementById('slit-at-wall')?.checked && isAnimating && window.qonticPacketEngine?.whenPacketAtWall;
         const live = apply => {
            if (!atWall) { apply(); return; }
            this.classList.add('slit-pending'); this.title = 'Waiting for the packet to reach the wall';
            window.qonticPacketEngine.whenPacketAtWall(apply);
         };
         if (state === 'open') {
            if (openSlitIds().length === 1) return; // keep one slit open
            live(() => { slitOpen[k] = false; slitConfigurationChanged(true); });
         } else if (state === 'closed') {
            // Another slit is always open, so reopening gives at least two: open it with a
            // detector. With "Apply at wall" during a run it reopens without one (adding a
            // detector restarts the run, which the demonstration should not do).
            if (atWall) live(() => { slitOpen[k] = true; slitConfigurationChanged(true); });
            else { slitOpen[k] = true; slitDetector[k] = true; slitConfigurationChanged(); }
         } else {
            slitDetector[k] = false;
            detectorsChanged();
         }
      });
      window.addEventListener('qontic-atwall-cancel', () => updateSlitCountControls());
      $(document).on('change', '#slit-at-wall', () => updateSlitCountControls());
      function detectorsChanged() {
         syncWhichPathDetector();
         updateWhichPathButton();
         updateSlitCountControls();
         updateMathFormulas();
         if (window.qonticPacketEngine?.enabled) {
            window.qonticPacketEngine.setWhichPath(whichPathDetector);
            syncMathButtons();
            return;
         }
         invalidateAllCaches();
         lightweightReset();
         setupGeo(false);
         runPrecomputeAsync();
         syncMathButtons();
         drawSystem(0);
      }
      // Detector button: remove all detectors, or put one at every open slit.
      $('#toggleWhichPath').on('click', function () {
         const open = openSlitIds();
         if (detectorSlitIds().length) slitDetector.fill(false);
         else if (open.length >= 2) open.forEach(k => { slitDetector[k] = true; });
         else return;
         detectorsChanged();
      });

      // View toggle: cycles Measure → Trajectory → Wave → Measure
      $('#toggleView').on('click', function () {
         if (viewLocked) return;
         const modes = ['copenhagen', 'bohmian', 'manyworlds'];
         const idx = modes.indexOf(interpretation);
         changeInterpretation(modes[(idx + 1) % 3]);
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
      $('#det-pixels-units').css('visibility','hidden');


      // Rationale view-links: switch to Simulation tab and activate the view
      $(document).on('click', '.view-link', function (e) {
         e.preventDefault();
         var mode = $(this).data('view');
         // Switch interpretation
         changeInterpretation(mode);
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
         if (window.qonticTemplateLayout) return;
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
         window.qonticMWBranches?.cancel();
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
         updateBranchCountDisplay();
      });

      $('#resampleHitsButton').on('click', function () {
        resampleHitsFromPsi() ;
      });


      

      //nHits=1000;
      //resampleHitsFromPsi();
});
