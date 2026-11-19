// Poster typography rendering: 3D extruded lettering, multi-stroke outlines, and decorative badges.

/**
 * Draws ultra-bold stylized title text with 3D shadow extrusion, thick black outer stroke, and vibrant gradient fill.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} cx
 * @param {number} cy
 * @param {number} maxWidth
 * @param {number} baseSize
 * @param {string} [themeAccent]
 */
export function drawExtrudedTitle(ctx, text, cx, cy, maxWidth, baseSize = 84, themeAccent = '#ff2a85') {
  if (!text) return;
  const clean = text.trim().toUpperCase();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Calculate fitting font size
  let fontSize = baseSize;
  ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
  while (ctx.measureText(clean).width > maxWidth && fontSize > 20) {
    fontSize -= 4;
    ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
  }

  const depth = Math.max(4, Math.round(fontSize * 0.08));

  // 1. Dark 3D Extrusion shadow
  ctx.fillStyle = '#0a0512';
  for (let d = depth; d >= 1; d--) {
    ctx.fillText(clean, cx + d * 1.5, cy + d * 1.5);
  }

  // 2. Thick dark outer stroke
  ctx.strokeStyle = '#050208';
  ctx.lineWidth = Math.max(6, Math.round(fontSize * 0.12));
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 2;
  ctx.strokeText(clean, cx, cy);

  // 3. Inner neon glow stroke
  ctx.strokeStyle = themeAccent;
  ctx.lineWidth = Math.max(2, Math.round(fontSize * 0.04));
  ctx.strokeText(clean, cx, cy);

  // 4. Vibrant gradient face fill
  const fillGrad = ctx.createLinearGradient(cx, cy - fontSize * 0.5, cx, cy + fontSize * 0.5);
  fillGrad.addColorStop(0, '#ffffff');
  fillGrad.addColorStop(0.35, '#fff6d6');
  fillGrad.addColorStop(0.75, themeAccent);
  fillGrad.addColorStop(1, '#ff6a3d');

  ctx.fillStyle = fillGrad;
  ctx.fillText(clean, cx, cy);

  ctx.restore();
}

/**
 * Draws tracked subtitle caption banner with background pill and crisp contrast.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} caption
 * @param {number} cx
 * @param {number} cy
 * @param {number} fontSize
 */
export function drawCaptionPill(ctx, caption, cx, cy, fontSize = 24) {
  if (!caption) return;
  const clean = caption.trim().toUpperCase();

  ctx.save();
  ctx.font = `800 ${fontSize}px "Segoe UI", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(clean);
  const padX = fontSize * 1.2;
  const padY = fontSize * 0.55;
  const pillW = metrics.width + padX * 2;
  const pillH = fontSize + padY * 2;

  // Background dark pill
  ctx.fillStyle = 'rgba(10, 5, 18, 0.88)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.rect(cx - pillW / 2, cy - pillH / 2, pillW, pillH);
  ctx.fill();
  ctx.stroke();

  // Caption text
  ctx.fillStyle = '#ffffff';
  ctx.fillText(clean, cx, cy + 1);

  ctx.restore();
}

/**
 * Draws iconic Roman numeral badge (e.g. VI) or star graphic badge.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} badgeText
 * @param {number} x
 * @param {number} y
 * @param {number} size
 * @param {string} [accentColor]
 */
export function drawNumeralBadge(ctx, badgeText, x, y, size = 110, accentColor = '#ff2a85') {
  if (!badgeText) return;

  ctx.save();
  ctx.translate(x, y);

  // Gradient badge background diamond / shield
  ctx.beginPath();
  const half = size / 2;
  ctx.moveTo(0, -half);
  ctx.lineTo(half * 1.15, 0);
  ctx.lineTo(0, half * 1.1);
  ctx.lineTo(-half * 1.15, 0);
  ctx.closePath();

  ctx.fillStyle = '#0a0514';
  ctx.fill();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Internal border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Roman numeral lettering
  ctx.font = `900 ${Math.round(size * 0.55)}px Impact, "Arial Black", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Gold/hot-pink gradient
  const grad = ctx.createLinearGradient(0, -half * 0.5, 0, half * 0.5);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.5, '#ffe57f');
  grad.addColorStop(1, accentColor);

  ctx.fillStyle = grad;
  ctx.fillText(badgeText.toUpperCase(), 0, 0);

  ctx.restore();
}

/**
 * Renders small aesthetic poster decals: release tagline, age/edition stamp, and edition badge.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} tagline
 * @param {number} width
 * @param {number} height
 */
export function drawTaglineFooter(ctx, tagline, width, height) {
  if (!tagline) return;
  const clean = tagline.trim().toUpperCase();

  ctx.save();
  ctx.font = '700 13px "Courier New", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.textAlign = 'right';
  ctx.letterSpacing = '2px';
  ctx.fillText(clean, width - 24, height - 20);

  // Left aesthetic stamp
  ctx.textAlign = 'left';
  ctx.font = '800 12px sans-serif';
  ctx.fillStyle = '#ff2a85';
  ctx.fillText('★ VICE POSTER STUDIO ORIGINAL ★', 24, height - 20);

  ctx.restore();
}
