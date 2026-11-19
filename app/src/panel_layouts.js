// Comic strip collage layout geometries, panel clipping, and stylized panel borders.

export const PANEL_LAYOUTS = [
  {
    id: 'quad-mosaic',
    name: 'Quad Mosaic (4 Panels)',
    description: 'Top panoramic hero panel over three vertical narrative slices'
  },
  {
    id: 'classic-triptych',
    name: 'Classic Triptych (3 Panels)',
    description: 'Left vertical hero portrait with two stacked right panels'
  },
  {
    id: 'duo-diagonal',
    name: 'Duo Diagonal (2 Panels)',
    description: 'Two dynamic comic panels divided by an angled action seam'
  },
  {
    id: 'hero-spotlight',
    name: 'Hero Spotlight (Single)',
    description: 'Full-bleed cinematic portrait with heavy poster framing'
  }
];

/**
 * Returns panel bounding boxes and clipping paths for a given layout and canvas dimensions.
 * @param {string} layoutId
 * @param {number} width
 * @param {number} height
 * @param {number} gap
 * @returns {Array<{ id: number, clip: (ctx: CanvasRenderingContext2D) => void, bounds: { x: number, y: number, w: number, h: number } }>}
 */
export function getLayoutPanels(layoutId, width, height, gap = 8) {
  const halfGap = gap / 2;
  const panels = [];

  if (layoutId === 'quad-mosaic') {
    const splitY = height * 0.52;
    // Top hero panel
    panels.push({
      id: 0,
      bounds: { x: 0, y: 0, w: width, h: splitY - halfGap },
      clip: (ctx) => {
        ctx.beginPath();
        ctx.rect(0, 0, width, splitY - halfGap);
      }
    });
    // Bottom 3 slices
    const sliceW = (width - gap * 2) / 3;
    for (let i = 0; i < 3; i++) {
      const sx = i * (sliceW + gap);
      const sy = splitY + halfGap;
      const sh = height - sy;
      panels.push({
        id: i + 1,
        bounds: { x: sx, y: sy, w: sliceW, h: sh },
        clip: (ctx) => {
          ctx.beginPath();
          ctx.rect(sx, sy, sliceW, sh);
        }
      });
    }
  } else if (layoutId === 'classic-triptych') {
    const splitX = width * 0.55;
    const splitY = height * 0.5;
    // Left tall hero
    panels.push({
      id: 0,
      bounds: { x: 0, y: 0, w: splitX - halfGap, h: height },
      clip: (ctx) => {
        ctx.beginPath();
        ctx.rect(0, 0, splitX - halfGap, height);
      }
    });
    // Right top
    panels.push({
      id: 1,
      bounds: { x: splitX + halfGap, y: 0, w: width - splitX - halfGap, h: splitY - halfGap },
      clip: (ctx) => {
        ctx.beginPath();
        ctx.rect(splitX + halfGap, 0, width - splitX - halfGap, splitY - halfGap);
      }
    });
    // Right bottom
    panels.push({
      id: 2,
      bounds: { x: splitX + halfGap, y: splitY + halfGap, w: width - splitX - halfGap, h: height - splitY - halfGap },
      clip: (ctx) => {
        ctx.beginPath();
        ctx.rect(splitX + halfGap, splitY + halfGap, width - splitX - halfGap, height - splitY - halfGap);
      }
    });
  } else if (layoutId === 'duo-diagonal') {
    const slant = width * 0.15;
    const midX = width * 0.5;
    // Panel 0 (left-bottom dominant)
    panels.push({
      id: 0,
      bounds: { x: 0, y: 0, w: width, h: height },
      clip: (ctx) => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(midX + slant - halfGap, 0);
        ctx.lineTo(midX - slant - halfGap, height);
        ctx.lineTo(0, height);
        ctx.closePath();
      }
    });
    // Panel 1 (right-top dominant)
    panels.push({
      id: 1,
      bounds: { x: 0, y: 0, w: width, h: height },
      clip: (ctx) => {
        ctx.beginPath();
        ctx.moveTo(midX + slant + halfGap, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(midX - slant + halfGap, height);
        ctx.closePath();
      }
    });
  } else {
    // Default hero spotlight (single panel)
    panels.push({
      id: 0,
      bounds: { x: 0, y: 0, w: width, h: height },
      clip: (ctx) => {
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
      }
    });
  }

  return panels;
}

/**
 * Renders stylized comic panel borders and dividing seams.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} layoutId
 * @param {number} width
 * @param {number} height
 * @param {number} borderWidth
 * @param {string} [borderColor]
 */
export function drawPanelBorders(ctx, layoutId, width, height, borderWidth = 8, borderColor = '#120d1c') {
  if (borderWidth <= 0) return;

  ctx.save();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const halfGap = borderWidth / 2;

  if (layoutId === 'quad-mosaic') {
    const splitY = height * 0.52;
    // Horizontal dividing gutter
    ctx.beginPath();
    ctx.moveTo(0, splitY);
    ctx.lineTo(width, splitY);
    ctx.stroke();

    // Two vertical dividing gutters
    const sliceW = (width - borderWidth * 2) / 3;
    for (let i = 1; i <= 2; i++) {
      const sx = i * sliceW + (i - 0.5) * borderWidth;
      ctx.beginPath();
      ctx.moveTo(sx, splitY);
      ctx.lineTo(sx, height);
      ctx.stroke();
    }
  } else if (layoutId === 'classic-triptych') {
    const splitX = width * 0.55;
    const splitY = height * 0.5;
    // Main vertical dividing line
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, height);
    ctx.stroke();

    // Right horizontal dividing line
    ctx.beginPath();
    ctx.moveTo(splitX, splitY);
    ctx.lineTo(width, splitY);
    ctx.stroke();
  } else if (layoutId === 'duo-diagonal') {
    const slant = width * 0.15;
    const midX = width * 0.5;
    ctx.beginPath();
    ctx.moveTo(midX + slant, 0);
    ctx.lineTo(midX - slant, height);
    ctx.stroke();
  }

  // Outer enclosing poster border
  ctx.strokeRect(halfGap, halfGap, width - borderWidth, height - borderWidth);
  ctx.restore();
}
