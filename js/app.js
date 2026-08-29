import { APP_CONFIG } from './config.js';
import { imageDimensions, renderMaster, renderPreview } from './canvas.js';
import { decodeImageFile } from './image-decoder.js';
import { createOutputFiles, openBlob, tryShare } from './exporter.js';
import { clearResults, getUi, readSettings, setStatus, showPreview, showResults, updateControlLabels } from './ui.js';
import { registerServiceWorker, setupInstallPrompt } from './pwa.js';
const ui = getUi();
const state = { source: null, master: null, outputs: [], baseName: 'IG三聯', renderTimer: null };
function safeBaseName(filename) { return (filename || 'IG三聯').replace(/\.[^.]+$/, '').trim() || 'IG三聯'; }
function rebuildPreview() { if (!state.source) return; updateControlLabels(ui); state.master = renderMaster(state.source, readSettings(ui)); showPreview(ui, renderPreview(state.master)); }
function schedulePreview() { updateControlLabels(ui); if (!state.source) return; window.clearTimeout(state.renderTimer); state.renderTimer = window.setTimeout(rebuildPreview, APP_CONFIG.editor.debounceMs); }
async function onFileChange(event) {
  const file = event.target.files?.[0]; if (!file) return; state.baseName = safeBaseName(file.name); state.outputs = []; clearResults(ui); ui.generate.disabled = true; setStatus(ui, '正在讀取照片…');
  try { state.source = await decodeImageFile(file, message => setStatus(ui, message)); const { width, height } = imageDimensions(state.source); setStatus(ui, `讀取成功：${width} × ${height}px`, 'ok'); rebuildPreview(); }
  catch (error) { state.source = null; state.master = null; setStatus(ui, `讀取失敗：${error instanceof Error ? error.message : String(error)}`, 'bad'); }
}
async function onGenerate() {
  if (!state.master) return; ui.generate.disabled = true; setStatus(ui, '正在產生三張圖片…');
  try { state.outputs = await createOutputFiles(state.master, state.baseName); showResults(ui, state.outputs); setStatus(ui, '已產生三張圖片。', 'ok'); }
  catch (error) { setStatus(ui, error instanceof Error ? error.message : String(error), 'bad'); }
  finally { ui.generate.disabled = !state.master; }
}
async function shareOrFallback(items, fallbackMessage) { try { if (await tryShare(items)) return true; } catch (error) { if (error instanceof DOMException && error.name === 'AbortError') return true; } if (fallbackMessage) setStatus(ui, fallbackMessage, 'warn'); return false; }
async function saveOne(index) { const output = state.outputs[index]; if (!output) return; if (await shareOrFallback([output])) return; openBlob(output.blob); }
ui.file.addEventListener('change', onFileChange);
[ui.mode, ui.x, ui.y, ui.zoom, ui.blur].forEach(control => control.addEventListener('input', schedulePreview));
ui.generate.addEventListener('click', onGenerate);
ui.shareAll.addEventListener('click', () => shareOrFallback(state.outputs, '目前瀏覽器不支援一次分享三張，請使用下方單張儲存按鈕。'));
ui.saveLeft.addEventListener('click', () => saveOne(0)); ui.saveMid.addEventListener('click', () => saveOne(1)); ui.saveRight.addEventListener('click', () => saveOne(2));
updateControlLabels(ui); setupInstallPrompt(ui.installBtn); registerServiceWorker();
