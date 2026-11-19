// Asynchronous photo loading, file reader bindings, and canvas photo fitting utilities.

/**
 * Loads an HTMLImageElement from a URL or object URL.
 * @param {string} sourceUrl
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(sourceUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load image at ${sourceUrl}: ${err?.message || 'unknown'}`));
    img.src = sourceUrl;
  });
}

/**
 * Reads a user-uploaded File object as an HTMLImageElement.
 * @param {File} file
 * @returns {Promise<HTMLImageElement>}
 */
export function readPhotoFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid file type. Please select an image file.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      loadImage(dataUrl).then(resolve).catch(reject);
    };
    reader.onerror = () => reject(new Error('Failed reading file contents.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Draws an image into a rectangular target area with cover aspect ratio and optional zoom/pan offset.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} img
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {Object} [options]
 */
export function drawCoverFittedPhoto(ctx, img, x, y, w, h, options = {}) {
  if (!img || !img.naturalWidth || !img.naturalHeight) return;

  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * (options.zoom || 1.0);
  const drawW = img.naturalWidth * scale;
  const drawH = img.naturalHeight * scale;

  const offsetX = (options.panX ?? 0.5) * (w - drawW);
  const offsetY = (options.panY ?? 0.5) * (h - drawH);

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  if (options.filter) {
    ctx.filter = options.filter;
  }

  ctx.drawImage(img, x + offsetX, y + offsetY, drawW, drawH);
  ctx.restore();
}

/**
 * Renders a stylized placeholder graphic when no image is loaded yet.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {string} label
 */
export function drawPlaceholderGraphic(ctx, x, y, w, h, label = 'SELECT PHOTO') {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#2c124d');
  grad.addColorStop(0.5, '#791e6b');
  grad.addColorStop(1, '#ff6a3d');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.max(16, Math.min(w * 0.08, 32))}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2);

  ctx.restore();
}
