import { APP_CONFIG, OUTPUT_SPECS } from './config.js';
import { getImagePlacement, getMasterWidth, validateTriptychGeometry } from './geometry.js';
import { getGuideLines } from './layouts.js';

const { contentWidth: WIDTH, height: HEIGHT, bleed: BLEED, outputWidth: OUTPUT_WIDTH, panelWidth: PANEL_WIDTH } = APP_CONFIG.canvas;

export function createCanvas(width, height) { const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; return canvas; }
export function imageDimensions(image) { return { width: image.naturalWidth || image.width, height: image.naturalHeight || image.height }; }

function prepareContext(canvas) {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('目前瀏覽器無法建立 Canvas 2D 環境。');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  return context;
}

function drawCover(context, image, width, height, blur) {
  const { width: imageWidth, height: imageHeight } = imageDimensions(image);
  const p = getImagePlacement({ imageWidth, imageHeight, targetWidth: width, targetHeight: height, mode: 'cover' });
  context.save();
  if (blur > 0) context.filter = `blur(${blur}px)`;
  context.drawImage(image, p.drawX, p.drawY, p.drawWidth, p.drawHeight);
  context.restore();
}

export function renderMaster(image, settings, layout) {
  const canvas = createCanvas(layout.masterWidth, layout.masterHeight);
  const context = prepareContext(canvas);
  const { width: imageWidth, height: imageHeight } = imageDimensions(image);
  if (settings.mode === 'edge') {
    drawCover(context, image, layout.masterWidth, layout.masterHeight, settings.blur);
    context.save(); context.globalAlpha = 0.08; context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); context.restore();
  } else {
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
  }
  const p = getImagePlacement({
    imageWidth, imageHeight,
    targetWidth: layout.masterWidth, targetHeight: layout.masterHeight,
    mode: settings.mode, zoom: settings.zoom, panX: settings.x, panY: settings.y,
  });
  context.drawImage(image, p.drawX, p.drawY, p.drawWidth, p.drawHeight);
  return canvas;
}

export function renderPreview(image, settings, layout) {
  const scale = Math.min(1, APP_CONFIG.editor.previewMax / Math.max(layout.masterWidth, layout.masterHeight));
  const width = Math.max(1, Math.round(layout.masterWidth * scale));
  const height = Math.max(1, Math.round(layout.masterHeight * scale));
  const previewLayout = { ...layout, masterWidth: width, masterHeight: height };
  const previewSettings = { ...settings, blur: settings.blur * scale };
  const canvas = renderMaster(image, previewSettings, previewLayout);
  const context = prepareContext(canvas);
  const guides = getGuideLines(layout);
  context.save();
  context.lineWidth = Math.max(1, Math.round(2 * devicePixelRatio));
  context.strokeStyle = 'rgba(255,255,255,.92)';
  for (const x of guides.vertical) { context.beginPath(); context.moveTo(x * scale, 0); context.lineTo(x * scale, height); context.stroke(); }
  for (const y of guides.horizontal) { context.beginPath(); context.moveTo(0, y * scale); context.lineTo(width, y * scale); context.stroke(); }
  context.lineWidth = 1;
  context.strokeStyle = 'rgba(18,18,24,.34)';
  for (const x of guides.vertical) { context.beginPath(); context.moveTo(x * scale, 0); context.lineTo(x * scale, height); context.stroke(); }
  for (const y of guides.horizontal) { context.beginPath(); context.moveTo(0, y * scale); context.lineTo(width, y * scale); context.stroke(); }
  context.restore();
  return canvas;
}

export function createBleedMaster(master) {
  const masterWidth = getMasterWidth(WIDTH, BLEED);
  const canvas = createCanvas(masterWidth, HEIGHT);
  const context = prepareContext(canvas);
  context.drawImage(master, 0, 0, WIDTH, HEIGHT, BLEED, 0, WIDTH, HEIGHT);
  context.save(); context.translate(BLEED, 0); context.scale(-1, 1); context.drawImage(master, 0, 0, BLEED, HEIGHT, 0, 0, BLEED, HEIGHT); context.restore();
  context.save(); context.translate(masterWidth, 0); context.scale(-1, 1); context.drawImage(master, WIDTH - BLEED, 0, BLEED, HEIGHT, 0, 0, BLEED, HEIGHT); context.restore();
  return canvas;
}

export function sliceTriptych(master) {
  const starts = OUTPUT_SPECS.map(spec => spec.startX);
  const valid = validateTriptychGeometry({ contentWidth: WIDTH, bleed: BLEED, panelWidth: PANEL_WIDTH, outputWidth: OUTPUT_WIDTH, starts });
  if (!valid) throw new Error('三聯尺寸設定不一致，已停止輸出以避免產生錯誤圖片。');
  const bleedMaster = createBleedMaster(master);
  const outputs = OUTPUT_SPECS.map(spec => {
    const canvas = createCanvas(OUTPUT_WIDTH, HEIGHT);
    const context = prepareContext(canvas);
    context.drawImage(bleedMaster, spec.startX, 0, OUTPUT_WIDTH, HEIGHT, 0, 0, OUTPUT_WIDTH, HEIGHT);
    return { ...spec, width: OUTPUT_WIDTH, height: HEIGHT, canvas };
  });
  bleedMaster.width = 1; bleedMaster.height = 1;
  return outputs;
}

export function sliceLayout(master, layout) {
  if (layout.kind === 'triptych') return sliceTriptych(master);
  return layout.slices.map(slice => {
    const canvas = createCanvas(slice.width, slice.height);
    const context = prepareContext(canvas);
    context.drawImage(master, slice.x, slice.y, slice.width, slice.height, 0, 0, slice.width, slice.height);
    return { ...slice, canvas };
  });
}
