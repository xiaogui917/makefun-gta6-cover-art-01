// Preset photo sources, sample captions, and default theme presets
// for Vice Poster Studio cover art generation.

export const SAMPLE_PHOTOS = [
  {
    id: 'pier',
    title: 'Sunset Pier',
    path: 'samples/pier.jpg',
    description: 'Vibrant coastal pier during tropical twilight'
  },
  {
    id: 'boulevard',
    title: 'Neon Boulevard',
    path: 'samples/boulevard.jpg',
    description: 'Palm-lined boulevard with glowing twilight skies'
  }
];

export const PRESET_CAPTIONS = [
  {
    title: 'VICE HORIZON',
    subtitle: 'WELCOME TO LEONIDA',
    tagline: 'OCTOBER 2026'
  },
  {
    title: 'SUNSET HEIST',
    subtitle: 'COASTLINE SYNDICATE',
    tagline: 'HIGH TIDE ROYALE'
  },
  {
    title: 'NEON DRIFT',
    subtitle: 'PALMETTO CITY LIGHTS',
    tagline: 'LIMITED EDITION'
  },
  {
    title: 'TROPIC RUN',
    subtitle: 'SOUTH BEACH PURSUIT',
    tagline: 'OFFICIAL POSTER'
  }
];

export const POST_SIZES = [
  { id: 'square', name: '1:1 Square (1080 × 1080)', width: 1080, height: 1080 },
  { id: 'portrait', name: '4:5 Portrait (1080 × 1350)', width: 1080, height: 1350 },
  { id: 'landscape', name: '16:9 Banner (1920 × 1080)', width: 1920, height: 1080 }
];

export const DEFAULT_STATE = {
  title: 'VICE HORIZON',
  subtitle: 'WELCOME TO LEONIDA',
  tagline: 'OCTOBER 2026',
  badge: 'VI',
  layoutId: 'quad-mosaic',
  colorGradeId: 'vice-sunset',
  sizeId: 'landscape',
  contrast: 1.15,
  saturation: 1.35,
  brightness: 1.05,
  borderWidth: 10,
  showHalftone: true,
  showPalmDecal: true,
  showBadge: true
};
