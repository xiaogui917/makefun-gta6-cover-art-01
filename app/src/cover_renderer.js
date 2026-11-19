// Master cover art orchestrator: synthesizes panel layout, photo filtering,
// color grading wash, decorative borders, and GTA-style poster typography.

import { drawCoverFittedPhoto, drawPlaceholderGraphic } from './photo_loader.js';
import { applyColorGrade, drawVignette, drawHalftonePattern, drawPalmSilhouette, COLOR_GRADES } from './color_grades.js';
import { getLayoutPanels, drawPanelBorders } from './panel_layouts.js';
import { drawExtrudedTitle, drawCaptionPill, drawNumeralBadge, drawTaglineFooter } from './typography_artist.js';
import { POST_SIZES } from './preset_samples.js';

/**
 * Renders the full cover art onto the provided canvas element based on the given state.
 * @param {HTMLCanvasElement} canvas
 * @param {Object} state
 * @param {Object.<string, HTMLImageElement>} photosMap
 */
export function renderCover(canvas, state, photosMap = {}) {
  const sizeConfig = POST_SIZES.find((s) => s.id === state.sizeId) || POST_SIZES[0];
  if (canvas.width !== sizeConfig.width || canvas.height !== sizeConfig.height) {
    canvas.width = sizeConfig.width;
    canvas.height = sizeConfig.height;
  }

  const { width: w, height: h } = canvas;
  const ctx = canvas.getContext('2d');

  // 1. Dark base fill
  ctx.fillStyle = '#0f081a';
  ctx.fillRect(0, 0, w, h);

  // 2. Render each panel photo
  const panels = getLayoutPanels(state.layoutId, w, h, state.borderWidth);
  const filterString = `contrast(${state.contrast ?? 1.15}) saturate(${state.saturation ?? 1.35}) brightness(${state.brightness ?? 1.0})`;

  const photoList = Object.values(photosMap).filter(Boolean);
  const defaultPhoto = photoList[0] || null;

  panels.forEach((panel, idx) => {
    ctx.save();
    panel.clip(ctx);
    ctx.clip();

    // Assign panel specific photo or cycle through loaded photos
    const img = (photosMap[`panel_${idx}`] || photoList[idx % photoList.length]) || defaultPhoto;

    if (img) {
      const zoom = 1.0 + (idx * 0.08); // Slight varied zoom per panel for dramatic depth
      const panX = 0.5 + (idx % 2 === 0 ? -0.05 : 0.05);
      drawCoverFittedPhoto(ctx, img, panel.bounds.x, panel.bounds.y, panel.bounds.w, panel.bounds.h, {
        filter: filterString,
        zoom,
        panX
      });
    } else {
      drawPlaceholderGraphic(ctx, panel.bounds.x, panel.bounds.y, panel.bounds.w, panel.bounds.h, `PANEL ${idx + 1}`);
    }

    ctx.restore();
  });

  // 3. Cinematic Color Grading Overlay
  applyColorGrade(ctx, w, h, state.colorGradeId);

  // 4. Subtle Vignette
  drawVignette(ctx, w, h);

  // 5. Halftone texture overlay if enabled
  if (state.showHalftone) {
    drawHalftonePattern(ctx, w, h, Math.round(w * 0.008));
  }

  // 6. Tropical Palm Silhouette Decal if enabled
  if (state.showPalmDecal) {
    const palmScale = Math.min(w, h) / 900;
    drawPalmSilhouette(ctx, w * 0.08, h * 0.98, palmScale, 'rgba(8, 4, 15, 0.75)');
  }

  // 7. Stylized Comic Panel Dividing Borders
  drawPanelBorders(ctx, state.layoutId, w, h, state.borderWidth, '#0b0614');

  // Active theme accent color
  const grade = COLOR_GRADES.find((g) => g.id === state.colorGradeId) || COLOR_GRADES[0];
  const accentColor = grade.tintAccent;

  // 8. Badge (e.g. "VI" Roman numeral at top right)
  if (state.showBadge && state.badge) {
    const badgeSize = Math.round(Math.min(w, h) * 0.12);
    drawNumeralBadge(ctx, state.badge, w - badgeSize * 0.85, badgeSize * 0.85, badgeSize, accentColor);
  }

  // 9. Main Title & Subtitle Banner
  const titleY = h * 0.80;
  const maxTitleW = w * 0.88;
  const baseTitleSize = Math.round(Math.min(w, h) * 0.11);
  drawExtrudedTitle(ctx, state.title, w / 2, titleY, maxTitleW, baseTitleSize, accentColor);

  const captionY = titleY + baseTitleSize * 0.65;
  const captionFontSize = Math.round(baseTitleSize * 0.28);
  drawCaptionPill(ctx, state.subtitle, w / 2, captionY, captionFontSize);

  // 10. Tagline & Footer Decal
  drawTaglineFooter(ctx, state.tagline, w, h);
}
