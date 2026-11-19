// Cinematic color grading presets, sunset overlays, halftone textures, and vector silhouettes.

export const COLOR_GRADES = [
  {
    id: 'vice-sunset',
    name: 'Vice Sunset',
    description: 'Iconic magenta-to-amber sunset wash with punchy saturation',
    topColor: 'rgba(52, 10, 84, 0.45)',
    midColor: 'rgba(235, 45, 120, 0.35)',
    bottomColor: 'rgba(255, 150, 40, 0.55)',
    blendMode: 'color-burn',
    tintAccent: '#ff2a85',
    contrast: 1.15,
    saturation: 1.35
  },
  {
    id: 'neon-night',
    name: 'Neon Night',
    description: 'Electric cyan and vivid purple duo-tone night grade',
    topColor: 'rgba(12, 5, 48, 0.65)',
    midColor: 'rgba(160, 20, 220, 0.40)',
    bottomColor: 'rgba(0, 225, 255, 0.50)',
    blendMode: 'screen',
    tintAccent: '#00e5ff',
    contrast: 1.25,
    saturation: 1.45
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm peach and radiant gold sunlight warmth',
    topColor: 'rgba(80, 25, 10, 0.35)',
    midColor: 'rgba(240, 110, 30, 0.45)',
    bottomColor: 'rgba(255, 205, 50, 0.50)',
    blendMode: 'overlay',
    tintAccent: '#ffb800',
    contrast: 1.10,
    saturation: 1.25
  },
  {
    id: 'pastel-tropic',
    name: 'Pastel Tropic',
    description: 'Soft turquoise, pastel mint, and bubblegum pink',
    topColor: 'rgba(20, 60, 70, 0.35)',
    midColor: 'rgba(40, 200, 190, 0.35)',
    bottomColor: 'rgba(255, 120, 180, 0.40)',
    blendMode: 'soft-light',
    tintAccent: '#2bf0d6',
    contrast: 1.05,
    saturation: 1.20
  }
];

/**
 * Applies full-canvas gradient color grading with blend modes.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 * @param {string} gradeId
 */
export function applyColorGrade(ctx, w, h, gradeId) {
  const grade = COLOR_GRADES.find((g) => g.id === gradeId) || COLOR_GRADES[0];
  ctx.save();

  // Multi-stop gradient wash
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, grade.topColor);
  grad.addColorStop(0.55, grade.midColor);
  grad.addColorStop(1, grade.bottomColor);

  ctx.globalCompositeOperation = grade.blendMode;
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Soft atmospheric rim tint at bottom
  ctx.globalCompositeOperation = 'source-over';
  const bottomRim = ctx.createLinearGradient(0, h * 0.7, 0, h);
  bottomRim.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomRim.addColorStop(1, 'rgba(10, 5, 20, 0.65)');
  ctx.fillStyle = bottomRim;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);

  ctx.restore();
}

/**
 * Renders atmospheric corner vignette and subtle warm sunburst.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 */
export function drawVignette(ctx, w, h) {
  ctx.save();
  const radius = Math.max(w, h) * 0.75;
  const vig = ctx.createRadialGradient(w / 2, h / 2, radius * 0.45, w / 2, h / 2, radius);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(1, 'rgba(5, 2, 10, 0.55)');

  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/**
 * Draws vintage comic book halftone printing dots overlay.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 * @param {number} [spacing]
 */
export function drawHalftonePattern(ctx, w, h, spacing = 8) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  const radius = spacing * 0.22;
  for (let y = spacing; y < h; y += spacing) {
    for (let x = spacing; x < w; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/**
 * Draws an original tropical palm tree vector silhouette on canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} scale
 * @param {string} [color]
 */
export function drawPalmSilhouette(ctx, x, y, scale = 1.0, color = 'rgba(15, 8, 25, 0.85)') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;

  // Curved trunk
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.bezierCurveTo(-15, -120, -50, -220, -35, -320);
  ctx.bezierCurveTo(-25, -220, 5, -120, 10, 0);
  ctx.closePath();
  ctx.fill();

  // Palm fronds branching outward
  const frondAngles = [-130, -100, -70, -45, -20, 10, 35, 60];
  ctx.translate(-35, -320);
  frondAngles.forEach((deg) => {
    ctx.save();
    ctx.rotate((deg * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(80, -30, 180, 40);
    ctx.quadraticCurveTo(70, 0, 0, 0);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
}
