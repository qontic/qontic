export const PALETTE_DEFINITIONS: Record<string, [number, number, number][]> = {
  // Phase: cyclic hue – used for wave-phase rendering; leave as-is.
  'phase': [ [128, 0, 128], [0, 0, 255], [0, 255, 255], [0, 255, 0], [255, 255, 0], [255, 0, 0], [128, 0, 128] ],
  // Detector palettes: light colour at low count → saturated/dark at high count.
  'blue':     [ [180, 220, 255], [100, 170, 240], [50, 100, 210], [0, 40, 180], [0, 0, 120] ],
  'inferno':  [ [240, 220, 160], [250, 175, 80],  [210, 80,  50], [140, 20, 80], [55, 5, 70] ],
  'viridis':  [ [200, 240, 160], [110, 205, 110], [34, 168, 132], [42, 110, 155], [50, 35, 110], [25, 0, 50] ],
  'plasma':   [ [240, 215, 155], [240, 160, 65],  [200, 70, 110], [115, 15, 150], [35, 0, 90] ],
  'grayscale':[ [210, 210, 210], [155, 155, 155], [90, 90, 90],   [25, 25, 25] ],
  'red':      [ [255, 200, 185], [240, 130, 90],  [200, 40, 20],  [110, 0, 0] ],
  'green':    [ [190, 240, 185], [110, 205, 100], [25, 150, 40],  [0, 65, 8] ],
  'orange':   [ [255, 225, 170], [245, 175, 70],  [210, 110, 15], [130, 50, 0] ],
  'teal':     [ [175, 235, 235], [75, 200, 195],  [15, 145, 155], [0, 60, 90] ],
};

// Helper to generate CSS gradients for the UI
export const getCssGradient = (name: string, direction = 'to right'): string => {
  const stops = PALETTE_DEFINITIONS[name];
  if (!stops) return '';
  const colors = stops.map(rgb => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`).join(', ');
  return `linear-gradient(${direction}, ${colors})`;
};