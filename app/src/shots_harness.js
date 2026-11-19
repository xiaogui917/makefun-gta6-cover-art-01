// Headless automation and screenshot harness for deterministic rendering.
// Handles ?shot=cover and ?shot=editor query parameters.

import { loadImage } from './photo_loader.js';

/**
 * Parses query parameters and configures the application state for screenshot capture.
 * @param {URLSearchParams} query
 * @param {Object} state
 * @param {Object.<string, HTMLImageElement>} photosMap
 * @param {() => void} renderCallback
 * @returns {Promise<boolean>} returns true if a screenshot mode was active
 */
export async function initializeShotsHarness(query, state, photosMap, renderCallback) {
  const shotMode = query.get('shot');
  if (!shotMode) return false;

  if (shotMode === 'cover') {
    document.body.classList.add('shot-cover');
  } else if (shotMode === 'editor') {
    document.body.classList.add('shot-editor');
  }

  // Override state properties from query string if provided
  if (query.get('layout')) state.layoutId = query.get('layout');
  if (query.get('grade') || query.get('preset')) {
    const p = query.get('grade') || query.get('preset');
    if (p === 'neon') state.colorGradeId = 'neon-night';
    else if (p === 'sunset') state.colorGradeId = 'vice-sunset';
    else if (p === 'golden') state.colorGradeId = 'golden-hour';
    else state.colorGradeId = p;
  }
  if (query.get('title')) state.title = query.get('title');
  if (query.get('subtitle') || query.get('caption')) {
    state.subtitle = query.get('subtitle') || query.get('caption');
  }
  if (query.get('tagline')) state.tagline = query.get('tagline');
  if (query.get('badge')) state.badge = query.get('badge');
  if (query.get('size')) state.sizeId = query.get('size');

  // Load sample photos
  const photoName = query.get('photo') || 'pier';
  const primaryPath = `samples/${photoName}.jpg`;
  const secondaryPath = photoName === 'pier' ? 'samples/boulevard.jpg' : 'samples/pier.jpg';

  try {
    const [primaryImg, secondaryImg] = await Promise.all([
      loadImage(primaryPath),
      loadImage(secondaryPath)
    ]);
    photosMap.primary = primaryImg;
    photosMap.panel_0 = primaryImg;
    photosMap.panel_1 = secondaryImg;
    photosMap.panel_2 = primaryImg;
    photosMap.panel_3 = secondaryImg;
  } catch (err) {
    console.warn('Shot photo loading notice:', err);
  }

  // Trigger render
  renderCallback();

  // Signal completion to screenshot runner
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.__shotReady = true;
    });
  });

  return true;
}
