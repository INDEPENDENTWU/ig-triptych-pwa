import { APP_CONFIG } from './config.js';

function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function drawResized(source, width, height) {
  const canvas = makeCanvas(width, height);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('目前瀏覽器無法建立 Canvas 2D 環境。');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, width, height);
  return canvas;
}

export function getUpscaledDimensions(width, height, factor) {
  if (![width, height, factor].every(Number.isFinite) || width <= 0 || height <= 0 || factor < 1) throw new TypeError('Invalid upscale dimensions.');
  return { width: Math.round(width * factor), height: Math.round(height * factor) };
}

export function upscaleCanvas(source, factor) {
  if (factor === 1) return source;
  const target = getUpscaledDimensions(source.width, source.height, factor);
  let current = source;
  let ownsCurrent = false;
  while (current.width < target.width || current.height < target.height) {
    const ratio = Math.min(APP_CONFIG.upscale.step, target.width / current.width, target.height / current.height);
    const nextWidth = Math.min(target.width, Math.round(current.width * ratio));
    const nextHeight = Math.min(target.height, Math.round(current.height * ratio));
    const next = drawResized(current, nextWidth, nextHeight);
    if (ownsCurrent) { current.width = 1; current.height = 1; }
    current = next;
    ownsCurrent = true;
  }
  return current;
}
