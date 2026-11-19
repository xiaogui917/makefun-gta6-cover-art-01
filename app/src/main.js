// Main application entry point for Vice Poster Studio:
// GTA 6 style cover art generator web application.

import { renderCover } from './cover_renderer.js';
import { setupEditorInterface } from './editor_ui.js';
import { initializeShotsHarness } from './shots_harness.js';
import { DEFAULT_STATE, SAMPLE_PHOTOS } from './preset_samples.js';
import { loadImage } from './photo_loader.js';

// Application reactive state
const state = { ...DEFAULT_STATE };
const photosMap = {
  primary: null,
  panel_0: null,
  panel_1: null,
  panel_2: null,
  panel_3: null
};

// DOM Elements
const elements = {
  canvas: document.getElementById('coverCanvas'),
  photoInput: document.getElementById('photoInput'),
  sampleButtons: document.querySelectorAll('[data-sample]'),
  titleInput: document.getElementById('titleInput'),
  subtitleInput: document.getElementById('subtitleInput'),
  taglineInput: document.getElementById('taglineInput'),
  badgeInput: document.getElementById('badgeInput'),
  layoutButtons: document.querySelectorAll('[data-layout]'),
  gradeButtons: document.querySelectorAll('[data-grade]'),
  sizeButtons: document.querySelectorAll('[data-size]'),
  contrastSlider: document.getElementById('contrastSlider'),
  saturationSlider: document.getElementById('saturationSlider'),
  borderSlider: document.getElementById('borderSlider'),
  halftoneCheck: document.getElementById('halftoneCheck'),
  presetCaptionButtons: document.querySelectorAll('.caption-preset-btn'),
  exportButton: document.getElementById('exportButton'),
  statusText: document.getElementById('statusText')
};

/** Redraws the cover art onto the canvas. */
function requestRender() {
  if (!elements.canvas) return;
  renderCover(elements.canvas, state, photosMap);
}

// Bootstrap application
async function bootstrap() {
  const query = new URLSearchParams(window.location.search);
  const isShot = await initializeShotsHarness(query, state, photosMap, requestRender);

  if (!isShot) {
    // Normal interactive browser session: setup editor and load default sample photos
    setupEditorInterface(elements, state, photosMap, requestRender);

    try {
      const [imgPier, imgBlvd] = await Promise.all([
        loadImage(SAMPLE_PHOTOS[0].path),
        loadImage(SAMPLE_PHOTOS[1].path)
      ]);
      photosMap.primary = imgPier;
      photosMap.panel_0 = imgPier;
      photosMap.panel_1 = imgBlvd;
      photosMap.panel_2 = imgPier;
      photosMap.panel_3 = imgBlvd;
    } catch (err) {
      console.warn('Initial sample photo load notice:', err);
    }

    requestRender();
  }
}

// Start app once DOM is parsed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
