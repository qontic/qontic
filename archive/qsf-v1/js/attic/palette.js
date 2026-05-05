// palette.js
window.paletteModule = (function () {
  const palettes = {
    Gray:   [ '#717171', '#8D8D8D', '#AAAAAA', '#C6C6C6', '#E2E2E2' ],
    Green: ['#5aa664', '#a6dba0', '#d9f0d3'],
    Blue:  ['#4292c6', '#6baed6', '#c6dbef'],
    Red:   ['#67000d', '#a50f15', '#cb181d', '#ef3b2c', '#fcbba1'],
    Yellow:['#8c510a', '#d8b365', '#f6e8c3', '#fee08b', '#ffffbf'],
    Inferno: ['#000004', '#420a68', '#932667', '#dd513a', '#fca50a'],
    Spectral: ['#9e0142', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
    RdYlBu: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4']
  };
  let currentPaletteName = null;

  function prepareRgbPalette(hexPalette) {
    return hexPalette.map(hex => {
      const bigint = parseInt(hex.slice(1), 16);
      return [bigint >> 16, (bigint >> 8) & 255, bigint & 255];
    });
  }

  function   getColorForValue(value, rgbPalette) {
    if (!Array.isArray(rgbPalette) || rgbPalette.length === 0) {
      console.warn('Invalid or empty palette');
      return [0, 0, 0]; // fallback to black
    }

    const t = Math.max(0, Math.min(1, value)); // clamp to [0, 1]
    const n = rgbPalette.length;
    const scaled = t * (n - 1);
    const i = Math.floor(scaled);
    const frac = scaled - i;

    const c1 = rgbPalette[i];
    const c2 = rgbPalette[Math.min(i + 1, n - 1)];

    return [
      Math.round(c1[0] + frac * (c2[0] - c1[0])),
      Math.round(c1[1] + frac * (c2[1] - c1[1])),
      Math.round(c1[2] + frac * (c2[2] - c1[2]))
    ];
  }
    

  function buildPalettePopup(containerId, onSelect) {
    const $container = $('#' + containerId);
    const $grid = $('<div class="palette-grid"></div>');

    $.each(palettes, function (name, colors) {
      const $wrapper = $('<div class="palette-wrapper"></div>');
      const $swatch = $('<div class="palette-option"></div>').css({
        background: `linear-gradient(to right, ${colors.join(',')})`
      });
      const $label = $('<div class="palette-label"></div>').text(name);

      $swatch.on('click', function () {
        const rgbPalette = prepareRgbPalette(colors);
        onSelect(name, rgbPalette);
        currentPaletteName = name; // Track selected name
        $container.hide();
      });

      $wrapper.append($swatch).append($label);
      $grid.append($wrapper);
    });

    $container.append($grid);
  }

  function setPaletteByName(name) {
     const palette = palettes[name];
     if (!palette) {
        console.warn(`Palette "${name}" not found.`);
        return;
     }
     currentPaletteName = name; // Track selected name
     graphPalette = window.paletteModule.prepareRgbPalette(palette);
     if (typeof drawPalette === 'function') {
        drawPalette(graphPalette);
     }
  }

  return {
     buildPalettePopup,
     getColorForValue,
     prepareRgbPalette, // expose this utility
     palettes,// expose the raw palette list
     setPaletteByName,
     getCurrentPaletteName: () => currentPaletteName
   };
  
})();
