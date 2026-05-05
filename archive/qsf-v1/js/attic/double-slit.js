var amplitudes = [];
var yHits = [];

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
var colorScale="darkblue"
var currentCycleIndex=10000;
var cyclePeriod=0;
var renderSetupFlag=1;
var setupCtx;
var waveCtx;
var partCtx;
var deltaTimeParticle;
var detectorArray1;
var detectorArray2;
var detectorX;
var detectorDistance;
var detectorXWorld ;
var detectorYTop ;
var detectorYBottom ;
var detectorWidth;
var deltaT=1;
var graphPalette;
var hits;
var hitMax=0;
var hitWidth=0;
var isAnimating = false; // Track the animation state
var nDetectorBins=100;
var lastParticleTime=0;
var lastTime=0;
var lastCycleIndex=100;
var maxParticles=10000000;
var nHits=0;
var nParticles=0;
var maxSteps=500000;
var nSteps=0;
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
let slit1Open = true;
let slit2Open = true;
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
var wavelength ;
var worldCanvasDx;
var worldCanvasDy;
var sensorWidth=30;
var xPre=10;
var yToBinWorld;
var yToBinCanvas;

const c = 300; // Speed of light in mm/ns
//const hbar = 1.054e-25; // Reduced Planck constant in mm^2*kg/ns
const hbar = 1.054e-28; // Reduced Planck constant in mm^2*kg/ns
//const hbar = 6.582119e-13; // MeV*s
//const m = 9.109e-31; // Electron mass in kg (SI-compatible for hbar/m)
const mElectron = 9.109e-31; // Electron mass in kg (SI-compatible for hbar/m)
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

   var containerA = $('#'+containerId+"-parameter-container");

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

   function updateInputs() {
      var unit = $('#' + id + '-units').val();
      var value = parseFloat($('#' + id).val());
      var scaledValue = scaleValue(value, unit);
      var formattedValue = scaledValue;

      if (Math.abs(scaledValue) >= 1e5 || Math.abs(scaledValue) < 1e-2) {
         formattedValue = formatScientific(scaledValue);
      } else {
         formattedValue = scaledValue.toFixed(2);
      }
      if ( id=="MaxPart" ) formattedValue=scaledValue.toFixed(0);// fix for maxpart

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

   // Attach the getValueInFirstUnit function to the container element
   container[0].getValueInFirstUnit = getValueInFirstUnit;

   $('#' + id + '-units').on('change', function() {
         updateInputs();
         });

   //$('#' + id).on('input', function() {
   $('#' + id).on('input', function() {
         updateInputs();
         });

   $('#' + id).on('change', function() {
      if (updateCounter ) {
        reset=1;
      }
   });


   $('#' + id + '-input').on('input', function() {
         var unit = $('#' + id + '-units').val();
         var unscaledValue = unscaleValue(parseFloat($(this).val()), unit);
         $('#' + id).val(unscaledValue);

         // Update the counter if needed
     //    if (updateCounter ) {
     //    reset=1;
     //    }
         });

   updateInputs();
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
//
//==================================================================================================================
function chooseColor(callback) {
   const $modal = $('#colorPickerModal');
   const $overlay = $('#overlay');
   const $palette = $('#palette');

   // Clear previous colors if re-called
   $palette.empty();

   // Generate 256 HSL colors (vivid spectrum)
   const totalColors = 256;
   for (let i = 0; i < totalColors; i++) {
      const hue = (i * 360 / totalColors) % 360;
      const color = `hsl(${hue}, 80%, 50%)`;
      const $box = $('<div></div>')
         .addClass('colorOption')
         .css('background-color', color)
         .attr('title', color)
         .on('click', function () {
               callback(color);
               $modal.hide();
               $overlay.hide();
               });
      $palette.append($box);
   }

   // Add 32 shades of grey from white to black
   const greyscaleSteps = 32;
   for (let j = 0; j < greyscaleSteps; j++) {
      const lightness = 100 - (j * 100 / (greyscaleSteps - 1)); // 100% to 0%
      const grey = `hsl(0, 0%, ${lightness}%)`;
      const $greyBox = $('<div></div>')
         .addClass('colorOption')
         .css('background-color', grey)
         .attr('title', grey)
         .on('click', function () {
               callback(grey);
               $modal.hide();
               $overlay.hide();
               });
      $palette.append($greyBox);
   }

   $modal.show();
   $overlay.show().on('click', function () {
         $modal.hide();
         $overlay.hide();
         });
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
   // Conversion factors and constants in mm/ns units

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
   // Conversion factors and constants in mm/ns units

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

//===============================================================================================================
//
//===============================================================================================================
function computeBohmianVelocity(x, y, t ) {

   var psi    = psiFunction(x, y, t);
   var psiDer = psiFunctionDerivative(x, y, t);

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
function getSlitPosition(traj,detectorArray) {
   xn = detectorXWorld; 
   var randomIndex = Math.floor(Math.random() * detectorArray.length);
   yn = detectorArray[randomIndex];
   traj.del=2;  
   stepSize=1;
   var nSubSteps=1000;

   var tl = time;
   for ( var iss = 0 ; iss < nSubSteps ; iss++ ) {
      var bv = computeBohmianVelocity( xn, yn, tl ) ;
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
//==============================================================================================================
//
//==============================================================================================================
function precomputeYArrayWithFixedX( xpos, slit, nY, nProb) {
   const yBins = [];
   const probabilities = [];

   var yMin = 0;
   var yMax = worldCanvasDy/2;
   if ( slit == 2 ) {
      var yMin = worldCanvasDy/2;
      var yMax = worldCanvasDy;
   }
   const dY   = (yMax-yMin) / nY; // 
   const x    = xpos;

   // Step 1: Calculate amplitudes and probabilities for each phi bin
   let totalProbability = 0;
   for (let i = 0; i < nY; i++) {
      const y = yMin + i * dY + dY / 2; // Center of each bin
      yBins.push(y);

      const psi = psiFunction(x, y, 0);
      const amplitude = psi.psi2;

      probabilities.push(amplitude);
      totalProbability += amplitude;
   }

   // Step 2: Normalize probabilities
   const normalizedProbabilities = probabilities.map(prob => prob / totalProbability);

   // Step 3: Digitize probabilities into an array
   const yArray = [];
   for (let i = 0; i < nY; i++) {
      const count = Math.round(normalizedProbabilities[i] * nProb); // Distribute probabilities
      for (let j = 0; j < count; j++) {
         yArray.push(yBins[i]);
      }
   }
   return yArray;
}
//==============================================================================================================
//
//==============================================================================================================
function precomputePhiArrayWithFixedR( x0, y0, t, r, nPhi, nProb) {
   const phiBins = [];
   const probabilities = [];

   //var phiEdge=Math.PI/10;
   var phiEdge=0;
   const phiMin = -Math.PI / 2+phiEdge ;
   const phiMax =  Math.PI / 2-phiEdge ;
   const dPhi = (phiMax-phiMin) / nPhi; // Bin size for phi

   // Step 1: Calculate amplitudes and probabilities for each phi bin
   let totalProbability = 0;
   for (let i = 0; i < nPhi; i++) {
      const phi = phiMin + i * dPhi + dPhi / 2; // Center of each bin
      phiBins.push(phi);

      const x = x0 + r * Math.cos(phi);
      const y = y0 + r * Math.sin(phi);

      const psi = psiFunction(x, y, t);
      const amplitude = psi.psi2;

      probabilities.push(amplitude);
      totalProbability += amplitude;
   }

   // Step 2: Normalize probabilities
   const normalizedProbabilities = probabilities.map(prob => prob / totalProbability);

   // Step 3: Digitize probabilities into an array
   const phiArray = [];
   for (let i = 0; i < nPhi; i++) {
      const count = Math.round(normalizedProbabilities[i] * nProb); // Distribute probabilities
      for (let j = 0; j < count; j++) {
         phiArray.push(phiBins[i]);
      }
   }

   return phiArray;
}
//==============================================================================================================
//
//==============================================================================================================
function getSimulationState() {
  paletteName= window.paletteModule.getCurrentPaletteName(); 
  console.log("AAAA getSimulationState paletteName ", paletteName );
  return {
    wavelength: $('#wavelength-group')[0].getValueInFirstUnit(),
    slitSeparation: $('#slit-separation-group')[0].getValueInFirstUnit(),
    sourcePosition: $('#source-position-group')[0].getValueInFirstUnit(),
    detectorDistance: $('#detector-distance-group')[0].getValueInFirstUnit(),
    screenHeight: $('#screen-height-group')[0].getValueInFirstUnit(),
    particleType: $('#particleType').val(),
    waveFunctionOption: $('#waveFunctionOption').val(),
    paletteName: window.paletteModule.getCurrentPaletteName?.(), // optional helper
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
    slit2Open
  };
}
//==============================================================================================================
//
//==============================================================================================================
function saveSimulationState() {
  const state = getSimulationState();
  console.log("saveSimulationState state ", state );
  localStorage.setItem('doubleSlitState', JSON.stringify(state));
}
//==============================================================================================================
//
//==============================================================================================================
function restoreSimulationState() {
  const saved = localStorage.getItem('doubleSlitState');
  if (!saved) return;

  const state = JSON.parse(saved);

  updateParameter('wavelength', 1, 200, 0.1, state.wavelength);
  updateParameter('slit-separation', 0, 1000, 0.1, state.slitSeparation);
  updateParameter('source-position', 0, 1000, 0.1, state.sourcePosition);
  updateParameter('detector-distance', 0, 1000, 0.1, state.detectorDistance);
  updateParameter('screen-height', 100, 5000, 1, state.screenHeight);

  $('#particleType').val(state.particleType).trigger('change');
  $('#waveFunctionOption').val(state.waveFunctionOption).trigger('change');

  console.log("state.paletteName ", state.paletteName);
  if (state.paletteName && window.paletteModule.setPaletteByName) {
    console.log("SetPaletteByName ");
    window.paletteModule.setPaletteByName(state.paletteName);
  }

  Object.entries(state.colors).forEach(([key, value]) => {
    const id = `#${key}-color`;
    $(id).css('background-color', value);
    window[`color${key.charAt(0).toUpperCase() + key.slice(1)}`] = value;
  });

  slit1Open = state.slit1Open;
  slit2Open = state.slit2Open;
  updateButton('#toggleSlit1', slit1Open);
  updateButton('#toggleSlit2', slit2Open);
}

//==============================================================================================================
//
//==============================================================================================================
function setupGeo() {

   wavelength        = parseFloat($('#wavelength-group')[0].getValueInFirstUnit());
   screenHeight      = parseFloat($('#screen-height-group')[0].getValueInFirstUnit());
   wallWidth   = 5;

   particleType = $("#particleType").val();

   // Get parameter values
   sourcePos      = parseFloat($('#source-position-group')[0].getValueInFirstUnit());
   slitSeparation = parseFloat($('#slit-separation-group')[0].getValueInFirstUnit());
   detectorDistance = parseFloat($('#detector-distance-group')[0].getValueInFirstUnit());

   // Wavelength in mm
   k = 2 * Math.PI / wavelength; // Wave number in mm^-1
   // Angular frequency (omega)
   omega = particleType === 'photon' ? k * c : 0.5 * hbar * k * k / mElectron;

   var waveSpeed = omega/k;
   $('#waveSpeed').text(parseFloat(waveSpeed.toFixed(3)));

   // Transform world coordinates to canvas coordinates
   var canvasWidth = canvas.width;
   var canvasHeight = canvas.height;

   if ( $("#plot_sensor").is(':checked') > 0 ) sensorWidth=30;
   else                                        sensorWidth=0;

   worldCanvasDx = 1.4 * (sourcePos + detectorDistance)+sensorWidth;
   worldCanvasDy = screenHeight;

   slitWidth = 0.01 * screenHeight;

   yToBinWorld  = nDetectorBins / worldCanvasDy; 
   yToBinCanvas = nDetectorBins / canvas.height; 

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

   phiArraySlit1 = precomputePhiArrayWithFixedR(slit1XWorld, slit1YWorld, 0, radiusPre, 100000, nProb=1000000) ;
   phiArraySlit2 = precomputePhiArrayWithFixedR(slit2XWorld, slit2YWorld, 0, radiusPre, 100000, nProb=1000000) ;

   detectorArray1 = precomputeYArrayWithFixedX(detectorXWorld, 1, nY=10000, nProb=10000000) ;
   detectorArray2 = precomputeYArrayWithFixedX(detectorXWorld, 2, nY=10000, nProb=10000000) ;

}
//===========================================================================================================
//
//===========================================================================================================
async function renderSetup() {
   setupCtx.clearRect(0, 0, canvas.width, canvas.height);

   setupCtx.strokeStyle = 'red'; // Set the color of the line
   setupCtx.fillStyle = 'black';
   //Draw point source
   setupCtx.strokeStyle = 'black'; // Set the color of the line
   setupCtx.beginPath();
   setupCtx.arc(sourceX, sourceY, 5, 0, 2 * Math.PI);
   setupCtx.fill();

   deltaTimeParticle = 0.001 * parseFloat($('#particleDt-group')[0].getValueInFirstUnit()); // from ps to ns

   var slitWidthCanvas = slitWidth*toCanvasY;

   if ( $("#plot_screen").is(':checked') > 0 ) {
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
      const scaleOriginX = canvas.width/20;
      const scaleOriginY = canvas.height/20;
      scaleLengthX = worldCanvasDx/5; 

      magnitude = Math.pow(10, Math.floor(Math.log10(scaleLengthX)));
      scaleLengthX = Math.round(scaleLengthX / magnitude) * magnitude;


      setupCtx.strokeStyle = colorScale;
      setupCtx.fillStyle = colorScale;
      setupCtx.lineWidth = 1;
      setupCtx.font = '12px sans-serif';
      setupCtx.textAlign = 'left';
      setupCtx.textBaseline = 'top';

      // X-axis scale
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

      setupCtx.fillText(`${(scaleLengthX).toFixed(1)} mm`, scaleOriginX + 0.3* scaleLengthX*toCanvasX, scaleOriginY + 12);

      scaleLengthY = worldCanvasDy/5; 
      magnitude = Math.pow(10, Math.floor(Math.log10(scaleLengthY)));
      scaleLengthY = Math.round(scaleLengthY / magnitude) * magnitude;

      setupCtx.beginPath();
      var yshift=5;
      setupCtx.moveTo(scaleOriginX, scaleOriginY+yshift);
      setupCtx.lineTo(scaleOriginX, scaleOriginY+yshift+scaleLengthY*toCanvasY);
      setupCtx.stroke();
      setupCtx.moveTo(scaleOriginX+3, scaleOriginY+yshift);
      setupCtx.lineTo(scaleOriginX-3, scaleOriginY+yshift);
      setupCtx.stroke();
      setupCtx.moveTo(scaleOriginX-3, scaleOriginY+yshift+scaleLengthY*toCanvasY);
      setupCtx.lineTo(scaleOriginX+3, scaleOriginY+yshift+scaleLengthY*toCanvasY);
      setupCtx.stroke();

      setupCtx.fillText(`${(scaleLengthY).toFixed(1)} mm`, scaleOriginX, scaleOriginY + 0.5*scaleLengthY*toCanvasY);
   }


   phiHist1.plot();
   phiHist2.plot();
}
//==================================================================================================================
//
//==================================================================================================================
async function renderTrajectoriesAndParticles() {

   partCtx.clearRect(0, 0, canvas.width, canvas.height);
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
      if ( $("#plot_trajectories").is(':checked') > 0 ) {
         partCtx.beginPath();
         partCtx.moveTo(toCanvasX*traj.points[0].x, toCanvasY*traj.points[0].y);

         for (var iPoint = 1; iPoint < traj.nPoints ; iPoint++) {
            var pnt = traj.points[iPoint];
            partCtx.lineTo(toCanvasX*pnt.x, toCanvasY*pnt.y);
         }
         partCtx.stroke();
      }

      if ( $("#plot_particles").is(':checked') > 0 ) {
         partCtx.beginPath();
         var xLast = toCanvasX*traj.points[traj.nPoints-1].x;
         var yLast = toCanvasY*traj.points[traj.nPoints-1].y;
         partCtx.arc(xLast, yLast, 3, 0, 2 * Math.PI);
         partCtx.fill();
      }
   }


}
//==================================================================================================================
//
//==================================================================================================================
async function generateWaveInfo() {
   psiOption=$('#waveFunctionOption').val();

   var width     = canvas.width;
   var height    = canvas.height;
   var usedWidth = parseInt(detectorX)-parseInt(sourceX);

   var storageLength = usedWidth*canvas.height;
   var waveInfoF     = new Float32Array(storageLength);

   let minF= Infinity;
   let maxF=-Infinity;
   for (var x =parseInt(sourceX) ; x < parseInt(detectorX); x++) {
      var xWorld = x*toWorldX;
      for (var y = 0; y < canvas.height; y++) {
         var yWorld=y*toWorldY;

         if (psiOption == "QPotential") {
            intensity = computeQuantumPotential(xWorld, yWorld, time);
            //if      ( Math.abs(intensity) > Infinity ) intensity=0;
            //else if ( intensity > 0 ) intensity=Math.log(intensity);
            //else                      intensity=-Math.log(-intensity);
         }
         else {
            var psiA = psiFunction(xWorld, yWorld, time ) ;
            if      ( psiOption == "Psi2" ) intensity=psiA.psi2;
            else if ( psiOption == "Imag" ) intensity=Math.abs(psiA.imag);
            else if ( psiOption == "Real" ) intensity=Math.abs(psiA.real);
            else if ( psiOption == "Phase") intensity=Math.abs(psiA.phase);
         }

         if ( intensity < minF ) minF=intensity;
         if ( intensity > maxF ) maxF=intensity;
         var index = (y * usedWidth + x - parseInt(sourceX) ); 
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
   //console.log("end of GenerateWaveInfo minF ", minF," maxF ", maxF); 
   return { info: waveInfo, min: minF, max: maxF };
   
}
//==================================================================================================================
//
//==================================================================================================================
async function drawWaveImage(waveData) {
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
async function updateSimulationState() {

   if (reset === 1) {
      renderSetupFlag =1;
      hits.fill(0);
      waveDataCache = {}; // Key: cycle index, Value: Image object or data URL
      trajectories.length = 0;
      nParticles = 0;
      nHits = 0;
      reset = 0;
      setupGeo();
      hitMax = 0;
      time = 0;
      lastParticleTime = 0;
      lastCycleIndex   = 100000;
   }
}
//==================================================================================================================
//
//==================================================================================================================
async function evolveParticles() {

   var trajectoriesToBeDeleted = [];
   for (var iPart = 0; iPart < trajectories.length ; iPart++) {
      traj = trajectories[iPart];
      if (traj.del == 1) continue;
      lastPointN = traj.nPoints;
      lastPoint=traj.points[lastPointN-1];

      var xn=0;
      var yn=0;
      if ( lastPoint.x < wallXWorld ) {
         var bv = computeBohmianVelocity( lastPoint.x, lastPoint.y, time ) ;
         xn = lastPoint.x + traj.timeDirection * bv.vx * deltaT;
         yn = lastPoint.y + traj.timeDirection * bv.vy * deltaT;
      }
      else {
         var nSubSteps=100000;
         var xl = lastPoint.x;
         var yl = lastPoint.y;
         var tl = time;
         var dtl=deltaT/parseFloat(nSubSteps);
         var stepSize = wavelength/1000;

         dtlSum = 0 ;
         stop = 0 ;
         for ( var iss = 0 ; iss < nSubSteps ; iss++ ) {
            var bv = computeBohmianVelocity( xl, yl, tl ) ;
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
      }

      if ( xn < 0 ) {
         traj.del=1;
      }
      if ( xn > detectorXWorld ) {
         traj.del=1;

         var stepFraction = (detectorXWorld-lastPoint.x)/(xn-lastPoint.x);
         var yHit = lastPoint.y + (yn-lastPoint.y) * stepFraction
            var iBin = parseInt(yHit * yToBinWorld + 0.5);
         if ( iBin < 0 || iBin >= nDetectorBins ) {
            console.log("PPPPRRROBLEM out of range iBin ", iBin);
         }
         nHits++;
         hits[iBin]++;
         if ( hits[iBin] > hitMax ) hitMax = hits[iBin];
         if ( iBin == -1 ) {
            console.log("detectorXWorld ",detectorXWorld," xn yn ", xn, yn );
            console.log(" traj.phiSlit ", traj.phiSlit );
            var nPoints=traj.nPoints;
            for ( var iHit = 0 ; iHit < nPoints ; iHit++ ) {
               console.log(iHit, " x y ", traj.points[iHit].x, traj.points[iHit].y);
            }	
         }
      }
      if ( yn < 0 ||  yn > worldCanvasDy ) {
         traj.del=1;
      }

      if ( xn < wallXWorld && traj.del==2 ) {
         traj.del=1;
      }
      if ( xn > wallXWorld && traj.del==0 ) {

         traj.del=1 ; //Stop particles at the wall

         nnn=5000;
         var stepFraction = (wallXWorld-lastPoint.x)/(xn-lastPoint.x);
         var yWall = lastPoint.y + (yn-lastPoint.y) * stepFraction

            if ( yWall < slit1YWorld + slitWidth/2 &&  yWall > slit1YWorld - slitWidth/2. ) {
               if ( slit1Open && slit2Open ) {
                  slitPos = getSlitPosition(traj, detectorArray1) ;
                  var xn = slitPos.x;
                  var yn = slitPos.y;
               }
               else {
                  var phiMin = Math.atan2(-slit1YWorld,detectorXWorld-slit1XWorld);
                  var phiMax = Math.atan2(canvas.height*toWorldY-slit1YWorld,detectorXWorld-slit1XWorld);
                  var phi = phiMin+Math.random()*(phiMax-phiMin);
                  var xn  = slit1XWorld + 1 * Math.cos(phi);
                  var yn  = slit1YWorld + 1 * Math.sin(phi);
               }
               traj.del=2;  
            }
            else if ( yWall < slit2YWorld + slitWidth &&  yWall > slit2YWorld - slitWidth ) {
               if ( slit1Open && slit2Open ) {
                  slitPos = getSlitPosition(traj, detectorArray2) ;
                  var xn = slitPos.x;
                  var yn = slitPos.y;
               }
               else {
                  var phiMin = Math.atan2(-slit2YWorld,detectorXWorld-slit2XWorld);
                  var phiMax = Math.atan2(canvas.height*toWorldY-slit2YWorld,detectorXWorld-slit2XWorld);
                  var phi = phiMin+Math.random()*(phiMax-phiMin);
                  var xn = slit2XWorld + 1. * Math.cos(phi);
                  var yn = slit2YWorld + 1. * Math.sin(phi);
               }
              traj.del=2;  
            }
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
         traj.nPoints = traj.nPoints+1;
      }
   }


   maxSimulPart = parseFloat($('#MaxPart-input').val());

   if ( nParticles < maxParticles && time-lastParticleTime > deltaTimeParticle 
         && trajectories.length < maxSimulPart ) {

      sourceOption=$('#sourceOption').val();
      var x0=0;
      var y0=0;
      var offset = 5;
      if ( sourceOption == "isotropic" ) {
         var delta1 = (slit1YWorld-slitWidth-sourceYWorld)/(slit1XWorld-sourceXWorld);
         var delta  = -1. * delta1 + 2. * Math.random() * delta1;
         x0 = sourceXWorld + offset ;
         y0 = sourceYWorld + delta*offset;
      }
      else if ( sourceOption == "slits" ) {
         var slitChoice  = 0. ;
         if ( slit1Open && slit2Open ) {
            slitChoice  = Math.random() ;
         }
         else if (  slit1Open && !slit2Open ) slitChoice=0.0;
         else if ( !slit1Open &&  slit2Open ) slitChoice=0.7;

         var tanDelta1 = 0;
         var tanDelta2 = 0;
         if ( slitChoice < 0.5 ) { // CCCCCCCCCCCCCCCCCCCC
            tanDelta1 = (slit1YWorld+0.5*slitWidth-sourceYWorld)/(slit1XWorld-sourceXWorld);
            tanDelta2 = (slit1YWorld-0.5*slitWidth-sourceYWorld)/(slit1XWorld-sourceXWorld);

         }
         else {
            tanDelta1 = (slit2YWorld-slitWidth-sourceYWorld)/(slit2XWorld-sourceXWorld);
            tanDelta2 = (slit2YWorld+slitWidth-sourceYWorld)/(slit2XWorld-sourceXWorld);
         }
         var delta1 = Math.atan(tanDelta1);
         var delta2 = Math.atan(tanDelta2);
         var delta  = delta1 + Math.random() * (delta2-delta1);
         x0 = sourceXWorld + offset ;
         y0 = sourceYWorld + offset * Math.tan(delta);
      }

      pos = { x: x0, y: y0 }; 

      //var trajectory = { id:nParticles, nPoints:1, points:[pos], del:2, hit:0, timeDirection:-1};
      var trajectory = { id:nParticles, nPoints:1, points:[pos], del:0, hit:0, timeDirection:1}; 
      trajectories.push(trajectory);
      nParticles = nParticles+1;
      lastParticleTime=time;
   }
   trajectories = trajectories.filter(traj => traj.del !== 1);

   //console.log("trajectories length ", trajectories.length) ;
}
//==================================================================================================================
//
//==================================================================================================================
async function renderDetectorAndHistogram() {

   // First loop: Calculate the maximum amplitude

   histoX=detectorX+sensorWidth;
   setupCtx.clearRect(histoX, 0, canvas.width-histoX, canvas.height);
   let maxAmplitude = 0;
   let maxAmplitude2 = 0;
   //const amplitudes = [];
   //const yHits = [];
   amplitudes.length=0;
   yHits.length=0;

   for (let i = 0; i < canvas.height * toWorldY; i++) {
      const yHit = i;
      const psi = psiFunction(detectorXWorld, yHit, time);
      const amplitude = psi.psi2;

      amplitudes.push(amplitude); // Store amplitude for later use
      yHits.push(yHit);           // Store yHit for later use

      if (amplitude > maxAmplitude) {
         maxAmplitude = amplitude; // Track the maximum amplitude
      }
   }

   // Second loop: Scale amplitudes and plot
   setupCtx.beginPath();
   var oldStyle = setupCtx.strokeStyle;
   setupCtx.strokeStyle = colorProb; // Set the color of the line

   detectorWidth = canvas.width - detectorX - sensorWidth;

   var totalArea = 0;
   for (let i = 0; i < amplitudes.length; i++) {
      const normalizedAmplitude = 0.9* (amplitudes[i] / maxAmplitude) * detectorWidth; // Scale amplitude
      totalArea  += normalizedAmplitude;
      const yHitCanvas = yHits[i] * toCanvasY;

      if  ( $("#hit_prob").is(':checked') > 0 ) {
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
   if ( $("#plot_sensor").is(':checked') > 0 ) {
      rgbSensor = getRGBComponents(colorSensor);
      setupCtx.fillStyle = "black";
      setupCtx.fillRect(detectorX, 0, sensorWidth, canvas.height);  // color 
   }
   if ( nHits > 0 && ( $("#plot_hits").is(':checked') > 0 || $("#plot_sensor").is(':checked') > 0 ) ) {
      var histoArea = nHits * worldCanvasDy / parseFloat(nDetectorBins);
      var norma = totalArea / histoArea;
      for (var i = 0; i < hits.length; i++) {
         //var yHit = (nDetectorBins - i) / yToBinCanvas; // Position on the canvas
         var yHit = i / yToBinCanvas; // Position on the canvas
         if (hits[i] > 0) {
            var dY = canvas.height / parseFloat(nDetectorBins); // Height of the bin
            var binValue = hits[i];
            var uncertainty = Math.sqrt(binValue); // Statistical uncertainty = sqrt(nEntries)

            var normalizedBinValue = norma * binValue ; // Normalize bin value
            var normalizedUncertainty = norma * uncertainty ; // Normalize uncertainty


            if ( $("#plot_hits").is(':checked') > 0 ) {
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

            if ( $("#plot_sensor").is(':checked') > 0 ) {
               intensity = (hits[i] / hitMax);
               const color = `rgb(${parseInt(rgbSensor['red'])*intensity}, ${parseInt(rgbSensor['green'])*intensity}, ${parseInt(rgbSensor['blue'])*intensity})`;  
               setupCtx.fillStyle = color;
               setupCtx.fillRect(detectorX, yHit, sensorWidth, dY);  // color 
            }
         }
      }
   }

}
//==================================================================================================================
//
//==================================================================================================================
async function renderWaveFunction(cycleIndex) {
  waveCtx.clearRect(0, 0, canvas.width, canvas.height);
  if (!$("#plot_wave").is(':checked')) return;

  let waveData;
  if (waveDataCache[cycleIndex]) {
    //console.log("Using prev.  image index ", cycleIndex );
    waveData = waveDataCache[cycleIndex]; 
  }
  else {
    //console.log("Generate new image index ", cycleIndex );
    waveData = await generateWaveInfo() ;
    waveDataCache[cycleIndex] = waveData;
  }
  await drawWaveImage(waveData);
  drawPaletteScale(graphPalette, waveData.min, waveData.max);
}
//==================================================================================================================
//
//==================================================================================================================
async function drawSystem(cycleIndex) {
   await updateSimulationState();
   if ( renderSetupFlag ) await renderSetup();

   if ( lastCycleIndex != cycleIndex ) await renderWaveFunction(cycleIndex);

   //await plotWaveFunction2D(time) ;
   await renderTrajectoriesAndParticles();
   await renderDetectorAndHistogram();
   lastCycleIndex=cycleIndex;
}
//==================================================================================================================
//
//==================================================================================================================
async function evolveSystem() {

   var targetStepTime = parseFloat($('#animationStep-group')[0].getValueInFirstUnit()); // from ps to ns
   const startTime = performance.now(); // high-resolution timestamp

   if (shouldResetCache) {
      waveDataCache = {};
      shouldResetCache = false;
   }

   psiOption=$('#waveFunctionOption').val();
   var cycleIndex=0;
   if (psiOption != "QPotential" && psiOption != "Psi2" ) {
      intraTime = time % cyclePeriod;
      cycleIndex = parseInt(intraTime / deltaT);
   }
   currentCycleIndex=cycleIndex;

   await evolveParticles();
   await drawSystem(cycleIndex);
   
   const cacheSize = Object.keys(waveDataCache).length;

   time += deltaT;
   nSteps++;

   const elapsed = performance.now() - startTime;
   const remaining = targetStepTime - elapsed;
   //console.log("elapsed ", elapsed, " remaining ", remaining );

   if (isAnimating) {
      if (remaining > 0) {
         setTimeout(() => {
            const elapsed2 = performance.now() - startTime;
            $('#stepTime').text(elapsed2.toFixed(0));
            animationId = requestAnimationFrame(evolveSystem);
         }, remaining);
      } else {
         const elapsed2 = performance.now() - startTime;
         $('#stepTime').text(elapsed2.toFixed(0));
         animationId = requestAnimationFrame(evolveSystem);
      }
   }

   $('#systemTime').text(time.toFixed(2));
   $('#nparticles').text(nParticles);
   $('#shownParticles').text(trajectories.length);
   $('#nhits').text(nHits);
   $('#nSteps').text(nSteps);
   $('#cachedImages').text(cacheSize);
   $('#calcTime').text(elapsed.toFixed(0));


}
//==================================================================================================================
//
//==================================================================================================================
function updateButton(id, isOpen) {
   const label = isOpen ? 'Open' : 'Closed';
   const color = isOpen ? '#4CAF50' : '#F44336';
   $(id).text(`Slit ${id === '#toggleSlit1' ? '1' : '2'}: ${label}`);
   $(id).css('background-color', color);
}
//==================================================================================================================
//
//==================================================================================================================
$(document).ready(function() {
      //canvas = document.getElementById('canvas');
      //ctx    = canvas.getContext('2d');

      canvas = document.getElementById('setupCanvas');
      setupCtx = $('#setupCanvas')[0].getContext('2d');
      waveCtx  = $('#waveCanvas')[0].getContext('2d');
      partCtx =  $('#partCanvas')[0].getContext('2d');


      $("#psiTabs").tabs();
      hits = new Array(nDetectorBins).fill(0); // Histogram array

      createParameterInput('detector', 'slit-separation', 'Slit Separation', 0, 1000, 0.1, 200, [
         { value: 'mm', text: 'mm', scale:1 },
         { value: 'um', text: 'um', scale:1.e-3 },
         { value: 'nm', text: 'nm', scale:1.e-6 }
         ], true);

      createParameterInput('detector', 'source-position', 'Source Position', 0, 1000, 0.1, 100, [
         { value: 'mm', text: 'mm', scale:1 },
         { value: 'um', text: 'um', scale:1.e-3 },
         { value: 'nm', text: 'nm', scale:1.e-6 }
         ], true);

      createParameterInput('detector', 'detector-distance', 'Detector Distance', 0, 1000, 0.1, 200, [
            { value: 'mm', text: 'mm', scale:1 },
            { value: 'um', text: 'um', scale:1.e-3 },
            { value: 'nm', text: 'nm', scale:1.e-6 }
            ], true);
      /*
         createParameterInput('wall-width', 'Wall Width', 1, 10, 0.1, 5, [
         { value: 'mm', text: 'mm', scale:1 },
         { value: 'um', text: 'um', scale:1.e-3 },
         { value: 'nm', text: 'nm', scale:1.e-6 }
         ], true);
         */
      createParameterInput('detector', 'screen-height', 'Screen Height', 100, 5000, 1, 500, [
            { value: 'mm', text: 'mm', scale:1 },
            { value: 'um', text: 'um', scale:1.e-3 },
            { value: 'nm', text: 'nm', scale:1.e-6 }
            ], true);

      createParameterInput('particle', 'wavelength', 'Wavelength', 1., 200, 0.1, 100, [
            { value: 'mm', text: 'mm', scale:1 },
            { value: 'um', text: 'um', scale:1.e-3 },
            { value: 'nm', text: 'nm', scale:1.e-6 }
            ], true);

      createParameterInput('particle', 'particleDt', 'Particle Interval', 1., 5000, 1., 500., [
            { value: 'ps', text: 'ps', scale:1. },
            { value: 'ns', text: 'ns', scale:1.e3 },
            { value: 'us', text: 'us', scale:1.e6 },
            { value: 'ms', text: 'ms', scale:1.e9 },
            { value: 's', text: 's', scale:1.e12 }
            ], false);

      createParameterInput('particle', 'MaxPart', 'Max. Particles', 1, 200, 1., 100., [
            { value: '', text: '', scale:1 },
            ], false);

      createParameterInput('particle', 'animationStep', 'Animation Step', 0, 100, 1, 30., [
            { value: 'ms', text: 'ms', scale:1. },
            ], false);


      $('#waveFunctionOption').change(function() {
            var selectedOption = $(this).val();
            });
      reset=0;

      $('#hit-color').css('background-color', colorHit);
      $('#prob-color').css('background-color', colorProb);
      $('#part-color').css('background-color', colorPart);
      $('#traj-color').css('background-color', colorTraj);
      $('#scale-color').css('background-color', colorScale);
      $('#detector-color').css('background-color', colorDetector);
      $('#screen-color').css('background-color', colorScreen);
      $('#sensor-color').css('background-color', colorSensor);
      $('#psi-color').css('background-color', colorPsi);


      setupGeo();
      const $popup = $('#palettePopup');


      const paletteEntries = Object.entries(window.paletteModule.palettes);
      const paletteIndex = 2; // Gray 
      const [paletteName, hexPalette] = paletteEntries[paletteIndex];
      graphPalette = window.paletteModule.prepareRgbPalette(hexPalette);
      console.log(`Using palette: ${paletteName}`);
      //console.log('AAAAA hexPalette:', hexPalette);
      
      
      var xMin=-0.5*Math.PI;
      var xMax= 0.5*Math.PI;
      var nBins = 50;
      phiHist1 = new Histogram('Phi1');
      phiHist1.configure(xMin, xMax, nBins);
      phiHist2 = new Histogram('Phi2');
      phiHist2.configure(xMin, xMax, nBins);

// Initial styling
      updateButton('#toggleSlit1', slit1Open);
      updateButton('#toggleSlit2', slit2Open);



      time = 0 ;
      var slitPositionY = canvas.height / 2; // Y position of slits
      var screenDistance = canvas.width * 0.8; // Distance to the detection screen

      var animationId; // Store the animation frame ID
      isAnimating = false; // Track the animation state
      restoreSimulationState()

      drawSystem(0);

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
               evolveSystem(); // Start the animation
               $(this).text('Stop'); // Change button label to "Stop"
            }
      });
      $('#particleType').on('change', function () {
            const selectedValue = $(this).val();
            if ( selectedValue == "electron" ) {
               //updateParameter('dt', 50, 500, 0.5, 100);
               updateParameter('particleDt', 1, 5000, 1, 50);
            }
            else if ( selectedValue == "photon" ) {
              //updateParameter('dt', 0.5, 50, 0.05, 5);
              updateParameter('particleDt', 0.1, 500, 0.05, 5);
            }
            reset=1;
            drawSystem(0);
      });

      $('#wavelength, #wavelength-input, #wavelength-units').on('input change', function () {
            // Get updated value and unit
            var wl = parseFloat($('#wavelength').val());
            const unitVal = $('#wavelength-units').val();
            //console.log('Slit separation changed:', wl, 'unit:', unitVal);
            drawSystem(0);
      });


      $('#waveFunctionOption').on('change', function () {
         waveDataCache = {};
         shouldResetCache=true; 
      });

      $('#psi-color').on('click', function () {
         chooseColor(function (selectedColor) {
             console.log("Wave function color selected:", selectedColor);
          // ? Reset cache only for wave function
             colorPsi=selectedColor;
             $('#psi-color').css('background-color', selectedColor);
             lastCycleIndex   = 100000;
             waveDataCache = {};
             shouldResetCache = true; // optional flag for animation loop
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
         console.log("plot_palette was changed ");
         if ($(this).is(':checked')) {
            console.log("show");
            $('#paletteScaleCanvas').show();
          } else {
            console.log("hide");
            $('#paletteScaleCanvas').hide();
          }
      });
      

      $('.replot').on('change', function () {
        console.log("replot now ");
        if (!isAnimating) drawSystem(0); 
      });

      $('#waveFunctionOption').on('change', function () {
         console.log("replot now ");
         waveDataCache = {}; 
         lastCycleIndex   = 100000;
         shouldResetCache = true; // Optional: flag for animation loop
        if (!isAnimating) drawSystem(currentCycleIndex); 
      });

      
      $('#resetButton').click(function() {
         reset=1;
      });

      $('#toggleSlit1').on('click', function () {
         if (!slit2Open && slit1Open) {
         // Prevent both slits from being closed
            console.warn("At least one slit must remain open.");
            return;
         }
         slit1Open = !slit1Open;
         updateButton('#toggleSlit1', slit1Open);
         waveDataCache = {}; 
         lastCycleIndex   = 100000;
         shouldResetCache = true;
         reset = 1;
         drawSystem(0);
      });

      $('#toggleSlit2').on('click', function () {
         if (!slit1Open && slit2Open) {
      // Prevent both slits from being closed
            console.warn("At least one slit must remain open.");
            return;
         }

         slit2Open = !slit2Open;
         updateButton('#toggleSlit2', slit2Open);
         shouldResetCache = true;
         waveDataCache = {}; 
         lastCycleIndex   = 100000;
         reset = 1;
         drawSystem(0);
      });
      
      $('#openPaletteBtn').on('click', function () {
        console.log("openPaletteBtn");
        $popup.show();
      });

      $('#closePopupBtn').on('click', function () {
        $popup.hide();
      });
      $('#MaxPart-units').hide();


      window.paletteModule.buildPalettePopup('palettePopup', function (name, rgbPalette) {
         console.log('Selected palette:', name);
         graphPalette = rgbPalette; // already in RGB format
         waveDataCache = {}; 
         shouldResetCache = true; // Optional: flag for animation loop
         if (!isAnimating) drawSystem(currentCycleIndex); 
         lastCycleIndex=100000;
      });

      window.addEventListener('beforeunload', saveSimulationState);
      

});

