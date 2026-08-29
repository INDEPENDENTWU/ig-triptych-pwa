export function getImagePlacement({ imageWidth, imageHeight, targetWidth, targetHeight, mode, zoom = 100, panX = 0, panY = 0 }) {
  const values = [imageWidth, imageHeight, targetWidth, targetHeight];
  if (values.some(value => !Number.isFinite(value) || value <= 0)) throw new TypeError('Image and target dimensions must be positive finite numbers.');
  if (mode !== 'edge' && mode !== 'cover') throw new TypeError(`Unsupported fit mode: ${mode}`);
  const fitScale = mode === 'cover' ? Math.max(targetWidth / imageWidth, targetHeight / imageHeight) : Math.min(targetWidth / imageWidth, targetHeight / imageHeight);
  const scale = fitScale * (zoom / 100);
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  const offsetRangeX = Math.abs(targetWidth - drawWidth) / 2;
  const offsetRangeY = Math.abs(targetHeight - drawHeight) / 2;
  const drawX = ((targetWidth - drawWidth) / 2) + ((panX / 100) * offsetRangeX);
  const drawY = ((targetHeight - drawHeight) / 2) + ((panY / 100) * offsetRangeY);
  return { scale, drawWidth, drawHeight, drawX, drawY };
}
export function getMasterWidth(contentWidth, bleed) {
  if (![contentWidth, bleed].every(Number.isFinite) || contentWidth <= 0 || bleed < 0) throw new TypeError('Invalid master dimensions.');
  return contentWidth + (bleed * 2);
}
export function validateTriptychGeometry({ contentWidth, bleed, panelWidth, outputWidth, starts }) {
  const masterWidth = getMasterWidth(contentWidth, bleed);
  if (outputWidth !== panelWidth + (bleed * 2)) return false;
  if (!Array.isArray(starts) || starts.length !== 3) return false;
  if (starts[1] - starts[0] !== panelWidth || starts[2] - starts[1] !== panelWidth) return false;
  return starts[2] + outputWidth === masterWidth;
}
