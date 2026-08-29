import { APP_CONFIG } from './config.js';
import { imageDimensions, renderPreview } from './canvas.js';
import { decodeImageFile } from './image-decoder.js';
import { createOutputFiles, openBlob, tryShare } from './exporter.js';
import { getLayout } from './layouts.js';
import { clearResults, getUi, readSettings, readUpscale, renderLayoutRail, resetEditor, setSelectedLayout, setSourceName, setStatus, showPreview, showResults, updateControlLabels } from './ui.js';
import { registerServiceWorker, setupInstallPrompt } from './pwa.js';

const ui = getUi();
const state = { source: null, outputs: [], baseName: 'social-slice', renderTimer: null, layoutId: 'triptych', generating: false };

function safeBaseName(filename) { return (filename || 'social-slice').replace(/\.[^.]+$/, '').trim() || 'social-slice'; }
function currentLayout() { return getLayout(state.layoutId); }

function rebuildPreview() {
  if (!state.source) return;
  updateControlLabels(ui);
  showPreview(ui, renderPreview(state.source, readSettings(ui), currentLayout()));
}

function schedulePreview() {
  updateControlLabels(ui);
  if (!state.source || state.generating) return;
  window.clearTimeout(state.renderTimer);
  state.renderTimer = window.setTimeout(rebuildPreview, APP_CONFIG.editor.debounceMs);
}

function selectLayout(id) {
  state.layoutId = id;
  const layout = currentLayout();
  setSelectedLayout(ui, layout);
  clearResults(ui);
  state.outputs = [];
  schedulePreview();
}

async function onFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  state.baseName = safeBaseName(file.name);
  state.outputs = [];
  clearResults(ui);
  ui.generate.disabled = true;
  setSourceName(ui, file.name);
  setStatus(ui, '正在讀取照片…');
  try {
    state.source = await decodeImageFile(file, message => setStatus(ui, message));
    const { width, height } = imageDimensions(state.source);
    setStatus(ui, `${width} × ${height}px · 本機處理`, 'ok');
    rebuildPreview();
  } catch (error) {
    state.source = null;
    setSourceName(ui, '');
    setStatus(ui, `讀取失敗：${error instanceof Error ? error.message : String(error)}`, 'bad');
  }
}

async function onGenerate() {
  if (!state.source || state.generating) return;
  state.generating = true;
  const layout = currentLayout();
  const factor = readUpscale(ui);
  ui.generate.disabled = true;
  clearResults(ui);
  try {
    state.outputs = await createOutputFiles({
      image: state.source, settings: readSettings(ui), layout, baseName: state.baseName, upscaleFactor: factor,
      onProgress: (current, total) => setStatus(ui, `正在生成 ${current} / ${total}${factor > 1 ? ` · 高清 ${factor}×` : ''}…`),
    });
    showResults(ui, state.outputs, layout, factor, saveOne);
    setStatus(ui, `${state.outputs.length} 張已完成 · 全程未上傳`, 'ok');
  } catch (error) {
    setStatus(ui, error instanceof Error ? error.message : String(error), 'bad');
  } finally {
    state.generating = false;
    ui.generate.disabled = !state.source;
  }
}

async function shareOrFallback(items, fallbackMessage) {
  try { if (await tryShare(items, `${currentLayout().label}輸出`)) return true; }
  catch (error) { if (error instanceof DOMException && error.name === 'AbortError') return true; }
  if (fallbackMessage) setStatus(ui, fallbackMessage, 'warn');
  return false;
}

async function saveOne(index) {
  const output = state.outputs[index];
  if (!output) return;
  if (await shareOrFallback([output])) return;
  openBlob(output.blob, output.file.name);
}

ui.file.addEventListener('change', onFileChange);
[ui.mode, ui.x, ui.y, ui.zoom, ui.blur].forEach(control => control.addEventListener('input', schedulePreview));
ui.upscale.addEventListener('click', event => {
  const button = event.target.closest('[data-factor]');
  if (!button) return;
  for (const item of ui.upscale.querySelectorAll('[data-factor]')) item.setAttribute('aria-pressed', String(item === button));
  clearResults(ui);
});
ui.reset.addEventListener('click', () => { resetEditor(ui); clearResults(ui); schedulePreview(); });
ui.generate.addEventListener('click', onGenerate);
ui.shareAll.addEventListener('click', async () => {
  if (await shareOrFallback(state.outputs)) return;
  setStatus(ui, '瀏覽器不支援一次分享全部圖片，請逐張點「儲存」。', 'warn');
});

renderLayoutRail(ui, state.layoutId, selectLayout);
setSelectedLayout(ui, currentLayout());
resetEditor(ui);
setupInstallPrompt(ui.installBtn);
registerServiceWorker();
