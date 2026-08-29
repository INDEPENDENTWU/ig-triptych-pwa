import { APP_CONFIG } from './config.js';
import { createCanvas, renderMaster, sliceLayout } from './canvas.js';
import { upscaleCanvas } from './upscaler.js';

export function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('圖片輸出失敗。')), APP_CONFIG.export.mimeType, APP_CONFIG.export.quality);
  });
}

function createThumbnail(source) {
  const scale = Math.min(1, APP_CONFIG.export.thumbnailMax / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, width, height);
  return canvas;
}

function cleanName(value) { return value.replace(/[^\p{L}\p{N}._-]+/gu, '-'); }

export async function createOutputFiles({ image, settings, layout, baseName, upscaleFactor = 1, onProgress = () => {} }) {
  const master = renderMaster(image, settings, layout);
  const slices = sliceLayout(master, layout);
  master.width = 1; master.height = 1;
  const outputs = [];
  for (let index = 0; index < slices.length; index += 1) {
    const slice = slices[index];
    onProgress(index + 1, slices.length);
    const finalCanvas = upscaleCanvas(slice.canvas, upscaleFactor);
    const previewCanvas = createThumbnail(finalCanvas);
    const blob = await canvasToBlob(finalCanvas);
    const width = finalCanvas.width;
    const height = finalCanvas.height;
    const suffix = upscaleFactor > 1 ? `_${upscaleFactor}x` : '';
    const filename = `${cleanName(baseName)}_${layout.id}_${slice.label}_${width}x${height}${suffix}.jpg`;
    outputs.push({ ...slice, width, height, blob, previewCanvas, file: new File([blob], filename, { type: APP_CONFIG.export.mimeType }) });
    if (finalCanvas !== slice.canvas) { finalCanvas.width = 1; finalCanvas.height = 1; }
    slice.canvas.width = 1; slice.canvas.height = 1;
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  return outputs;
}

export async function tryShare(items, title = '社群切片圖片') {
  const files = items.map(item => item.file);
  if (!navigator.canShare || !navigator.canShare({ files })) return false;
  await navigator.share({ files, title });
  return true;
}

export function openBlob(blob, filename = 'image.jpg') {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
