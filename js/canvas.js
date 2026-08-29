import { APP_CONFIG, OUTPUT_SPECS } from './config.js';
import { getImagePlacement, getMasterWidth, validateTriptychGeometry } from './geometry.js';
const { contentWidth: WIDTH, height: HEIGHT, bleed: BLEED, outputWidth: OUTPUT_WIDTH, panelWidth: PANEL_WIDTH } = APP_CONFIG.canvas;
export function createCanvas(width, height) { const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; return canvas; }
export function imageDimensions(image) { return { width: image.naturalWidth || image.width, height: image.naturalHeight || image.height }; }
function prepareContext(canvas) { const context = canvas.getContext('2d'); if (!context) throw new Error('目前瀏覽器無法建立 Canvas 2D 環境。'); context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high'; return context; }
function drawCover(context, image, width, height, blur) { const { width: imageWidth, height: imageHeight } = imageDimensions(image); const p = getImagePlacement({ imageWidth, imageHeight, targetWidth: width, targetHeight: height, mode: 'cover' }); context.save(); if (blur > 0) context.filter = `blur(${blur}px)`; context.drawImage(image, p.drawX, p.drawY, p.drawWidth, p.drawHeight); context.restore(); }
export function renderMaster(image, settings) {
  const canvas = createCanvas(WIDTH, HEIGHT); const context = prepareContext(canvas); const { width: imageWidth, height: imageHeight } = imageDimensions(image);
  if (settings.mode === 'edge') { drawCover(context, image, WIDTH, HEIGHT, settings.blur); context.save(); context.globalAlpha = 0.08; context.fillStyle = '#fff'; context.fillRect(0, 0, WIDTH, HEIGHT); context.restore(); } else { context.fillStyle = '#fff'; context.fillRect(0, 0, WIDTH, HEIGHT); }
  const p = getImagePlacement({ imageWidth, imageHeight, targetWidth: WIDTH, targetHeight: HEIGHT, mode: settings.mode, zoom: settings.zoom, panX: settings.x, panY: settings.y });
  context.drawImage(image, p.drawX, p.drawY, p.drawWidth, p.drawHeight); return canvas;
}
export function renderPreview(master) {
  const preview = createCanvas(WIDTH, HEIGHT); const context = prepareContext(preview); context.drawImage(master, 0, 0);
  for (const lineX of [PANEL_WIDTH, PANEL_WIDTH * 2]) { context.save(); context.strokeStyle = 'rgba(255,255,255,.9)'; context.lineWidth = 8; context.beginPath(); context.moveTo(lineX, 0); context.lineTo(lineX, HEIGHT); context.stroke(); context.strokeStyle = 'rgba(0,0,0,.35)'; context.lineWidth = 2; context.beginPath(); context.moveTo(lineX, 0); context.lineTo(lineX, HEIGHT); context.stroke(); context.restore(); }
  return preview;
}
export function createBleedMaster(master) {
  const masterWidth = getMasterWidth(WIDTH, BLEED); const canvas = createCanvas(masterWidth, HEIGHT); const context = prepareContext(canvas); context.drawImage(master, 0, 0, WIDTH, HEIGHT, BLEED, 0, WIDTH, HEIGHT);
  context.save(); context.translate(BLEED, 0); context.scale(-1, 1); context.drawImage(master, 0, 0, BLEED, HEIGHT, 0, 0, BLEED, HEIGHT); context.restore();
  context.save(); context.translate(masterWidth, 0); context.scale(-1, 1); context.drawImage(master, WIDTH - BLEED, 0, BLEED, HEIGHT, 0, 0, BLEED, HEIGHT); context.restore(); return canvas;
}
export function sliceTriptych(master) {
  const starts = OUTPUT_SPECS.map(spec => spec.startX); const valid = validateTriptychGeometry({ contentWidth: WIDTH, bleed: BLEED, panelWidth: PANEL_WIDTH, outputWidth: OUTPUT_WIDTH, starts });
  if (!valid) throw new Error('三聯尺寸設定不一致，已停止輸出以避免產生錯誤圖片。');
  const bleedMaster = createBleedMaster(master); return OUTPUT_SPECS.map(spec => { const canvas = createCanvas(OUTPUT_WIDTH, HEIGHT); const context = prepareContext(canvas); context.drawImage(bleedMaster, spec.startX, 0, OUTPUT_WIDTH, HEIGHT, 0, 0, OUTPUT_WIDTH, HEIGHT); return { ...spec, canvas }; });
}
