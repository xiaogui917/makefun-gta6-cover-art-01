// Interactive editor interface controls, input bindings, presets, and live preview updater.

import { readPhotoFromFile, loadImage } from './photo_loader.js';
import { exportCanvasAsPng, getSafeFilename } from './exporter.js';
import { PRESET_CAPTIONS, SAMPLE_PHOTOS, POST_SIZES } from './preset_samples.js';
import { COLOR_GRADES } from './color_grades.js';
import { PANEL_LAYOUTS } from './panel_layouts.js';

/**
 * Binds UI form controls to the application state and registers change listeners.
 * @param {Object} elements
 * @param {Object} state
 * @param {Object.<string, HTMLImageElement>} photosMap
 * @param {() => void} requestRender
 */
export function setupEditorInterface(elements, state, photosMap, requestRender) {
  // Sync state to inputs initially
  syncStateToInputs(elements, state);

  // 1. Photo File Upload
  if (elements.photoInput) {
    elements.photoInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        setEditorStatus(elements, 'Loading photo...');
        const img = await readPhotoFromFile(file);
        photosMap.primary = img;
        photosMap.panel_0 = img;
        setEditorStatus(elements, `Loaded ${file.name}`);
        requestRender();
      } catch (err) {
        setEditorStatus(elements, `Error: ${err.message}`, true);
      }
    });
  }

  // 2. Preset Sample Photos
  if (elements.sampleButtons) {
    elements.sampleButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const sampleId = btn.dataset.sample;
        const sample = SAMPLE_PHOTOS.find((s) => s.id === sampleId) || SAMPLE_PHOTOS[0];
        try {
          setEditorStatus(elements, `Loading sample ${sample.title}...`);
          const img = await loadImage(sample.path);
          photosMap.primary = img;
          photosMap.panel_0 = img;
          setEditorStatus(elements, `Loaded sample: ${sample.title}`);
          requestRender();
        } catch (err) {
          setEditorStatus(elements, `Failed loading sample: ${err.message}`, true);
        }
      });
    });
  }

  // 3. Text inputs (Title, Subtitle, Tagline, Badge)
  const textBindings = [
    { el: elements.titleInput, prop: 'title' },
    { el: elements.subtitleInput, prop: 'subtitle' },
    { el: elements.taglineInput, prop: 'tagline' },
    { el: elements.badgeInput, prop: 'badge' }
  ];
  textBindings.forEach(({ el, prop }) => {
    if (el) {
      el.addEventListener('input', () => {
        state[prop] = el.value;
        requestRender();
      });
    }
  });

  // 4. Layout selector buttons / radio
  if (elements.layoutButtons) {
    elements.layoutButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.layoutId = btn.dataset.layout;
        updateActiveButtonState(elements.layoutButtons, btn);
        requestRender();
      });
    });
  }

  // 5. Color Grade selector buttons
  if (elements.gradeButtons) {
    elements.gradeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.colorGradeId = btn.dataset.grade;
        updateActiveButtonState(elements.gradeButtons, btn);
        requestRender();
      });
    });
  }

  // 6. Post Size selector buttons
  if (elements.sizeButtons) {
    elements.sizeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.sizeId = btn.dataset.size;
        updateActiveButtonState(elements.sizeButtons, btn);
        requestRender();
      });
    });
  }

  // 7. Sliders & Checkbox controls
  const rangeBindings = [
    { el: elements.contrastSlider, prop: 'contrast', isFloat: true },
    { el: elements.saturationSlider, prop: 'saturation', isFloat: true },
    { el: elements.borderSlider, prop: 'borderWidth', isFloat: false }
  ];
  rangeBindings.forEach(({ el, prop, isFloat }) => {
    if (el) {
      el.addEventListener('input', () => {
        state[prop] = isFloat ? parseFloat(el.value) : parseInt(el.value, 10);
        requestRender();
      });
    }
  });

  if (elements.halftoneCheck) {
    elements.halftoneCheck.addEventListener('change', () => {
      state.showHalftone = elements.halftoneCheck.checked;
      requestRender();
    });
  }

  // 8. Preset caption quick picker buttons
  if (elements.presetCaptionButtons) {
    elements.presetCaptionButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const p = PRESET_CAPTIONS[idx % PRESET_CAPTIONS.length];
        state.title = p.title;
        state.subtitle = p.subtitle;
        state.tagline = p.tagline;
        syncStateToInputs(elements, state);
        requestRender();
      });
    });
  }

  // 9. Export Button
  if (elements.exportButton && elements.canvas) {
    elements.exportButton.addEventListener('click', async () => {
      try {
        setEditorStatus(elements, 'Exporting PNG cover...');
        const filename = getSafeFilename(state.title, elements.canvas.width, elements.canvas.height);
        await exportCanvasAsPng(elements.canvas, filename);
        setEditorStatus(elements, `Exported ${filename} successfully!`);
      } catch (err) {
        setEditorStatus(elements, `Export failed: ${err.message}`, true);
      }
    });
  }
}

export function syncStateToInputs(elements, state) {
  if (elements.titleInput) elements.titleInput.value = state.title || '';
  if (elements.subtitleInput) elements.subtitleInput.value = state.subtitle || '';
  if (elements.taglineInput) elements.taglineInput.value = state.tagline || '';
  if (elements.badgeInput) elements.badgeInput.value = state.badge || '';
  if (elements.contrastSlider) elements.contrastSlider.value = state.contrast;
  if (elements.saturationSlider) elements.saturationSlider.value = state.saturation;
  if (elements.borderSlider) elements.borderSlider.value = state.borderWidth;
  if (elements.halftoneCheck) elements.halftoneCheck.checked = !!state.showHalftone;
}

export function setEditorStatus(elements, message, isError = false) {
  if (!elements.statusText) return;
  elements.statusText.textContent = message;
  elements.statusText.style.color = isError ? '#ff4f70' : '#2bf0d6';
}

function updateActiveButtonState(buttons, targetBtn) {
  buttons.forEach((b) => b.classList.remove('active'));
  targetBtn.classList.add('active');
}
