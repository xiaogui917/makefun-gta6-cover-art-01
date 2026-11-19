// PNG canvas blob export and download trigger utilities.

/**
 * Exports the given canvas as a PNG blob and triggers browser download.
 * @param {HTMLCanvasElement} canvas
 * @param {string} [filename]
 * @returns {Promise<string>} resolves with the generated filename
 */
export function exportCanvasAsPng(canvas, filename) {
  return new Promise((resolve, reject) => {
    try {
      const targetName = filename || `vice-cover-${canvas.width}x${canvas.height}.png`;
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG blob from canvas.'));
          return;
        }
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = targetName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke after small delay
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
        resolve(targetName);
      }, 'image/png');
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Constructs a safe filename based on title and resolution.
 * @param {string} title
 * @param {number} width
 * @param {number} height
 * @returns {string}
 */
export function getSafeFilename(title, width, height) {
  const safeTitle = (title || 'cover')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${safeTitle || 'cover'}-${width}x${height}.png`;
}
