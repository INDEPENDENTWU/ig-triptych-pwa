import { LAYOUT_ORDER, getLayout } from './layouts.js';

export function getUi() {
  const byId = id => { const element = document.getElementById(id); if (!element) throw new Error(`Missing UI element: #${id}`); return element; };
  return {
    file: byId('file'), sourceButton: byId('sourceButton'), sourceName: byId('sourceName'), status: byId('status'), preview: byId('preview'),
    layoutRail: byId('layoutRail'), layoutTitle: byId('layoutTitle'), layoutDescription: byId('layoutDescription'), publishHint: byId('publishHint'),
    mode: byId('mode'), x: byId('x'), y: byId('y'), zoom: byId('zoom'), blur: byId('blur'),
    modeText: byId('modeText'), xv: byId('xv'), yv: byId('yv'), zv: byId('zv'), bv: byId('bv'), upscale: byId('upscale'),
    generate: byId('generate'), generateMeta: byId('generateMeta'), resultCard: byId('resultCard'), resultTitle: byId('resultTitle'), resultHint: byId('resultHint'),
    results: byId('results'), shareAll: byId('shareAll'), installBtn: byId('installBtn'), reset: byId('reset'),
  };
}

export function renderLayoutRail(ui, selectedId, onSelect) {
  const fragment = document.createDocumentFragment();
  for (const id of LAYOUT_ORDER) {
    const layout = getLayout(id);
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'mode-chip'; button.dataset.layout = layout.id; button.setAttribute('aria-pressed', String(layout.id === selectedId));
    button.innerHTML = `<span class="mode-glyph">${layout.short}</span><span>${layout.label}</span>`;
    button.addEventListener('click', () => onSelect(layout.id));
    fragment.appendChild(button);
  }
  ui.layoutRail.replaceChildren(fragment);
}

export function setSelectedLayout(ui, layout) {
  for (const button of ui.layoutRail.querySelectorAll('[data-layout]')) button.setAttribute('aria-pressed', String(button.dataset.layout === layout.id));
  document.documentElement.style.setProperty('--accent', layout.accent);
  ui.layoutTitle.textContent = layout.label;
  ui.layoutDescription.textContent = layout.description;
  ui.publishHint.textContent = layout.publishHint;
  ui.generate.textContent = `生成 ${layout.outputCount} 張`;
  ui.generateMeta.textContent = `${layout.masterWidth} × ${layout.masterHeight}`;
}

export function setStatus(ui, text, state = '') { ui.status.textContent = text; ui.status.dataset.state = state; }
export function setSourceName(ui, text = '') { ui.sourceName.textContent = text || 'JPG、PNG、HEIC'; ui.sourceButton.classList.toggle('has-file', Boolean(text)); }
export function readSettings(ui) { return { mode: ui.mode.value, x: Number(ui.x.value), y: Number(ui.y.value), zoom: Number(ui.zoom.value), blur: Number(ui.blur.value) }; }
export function readUpscale(ui) { return Number(ui.upscale.querySelector('[aria-pressed="true"]')?.dataset.factor || 1); }
export function updateControlLabels(ui) { ui.xv.textContent = ui.x.value; ui.yv.textContent = ui.y.value; ui.zv.textContent = `${ui.zoom.value}%`; ui.bv.textContent = ui.blur.value; ui.modeText.textContent = ui.mode.value === 'cover' ? '鋪滿' : '完整'; }
export function showPreview(ui, canvas) { ui.preview.replaceChildren(canvas); ui.preview.classList.add('is-ready'); ui.generate.disabled = false; }
export function clearResults(ui) { ui.resultCard.hidden = true; ui.results.replaceChildren(); }

export function showResults(ui, outputs, layout, upscaleFactor, onSave) {
  const fragment = document.createDocumentFragment();
  outputs.forEach((output, index) => {
    const item = document.createElement('article'); item.className = 'result-item';
    const media = document.createElement('div'); media.className = 'result-media'; media.appendChild(output.previewCanvas); item.appendChild(media);
    const row = document.createElement('div'); row.className = 'result-row';
    const text = document.createElement('div'); text.className = 'result-copy';
    const name = document.createElement('strong'); name.textContent = String(index + 1).padStart(2, '0');
    const hint = document.createElement('span'); hint.textContent = `${output.width} × ${output.height}`;
    text.append(name, hint);
    const save = document.createElement('button'); save.type = 'button'; save.className = 'text-button'; save.textContent = '儲存'; save.addEventListener('click', () => onSave(index));
    row.append(text, save); item.appendChild(row); fragment.appendChild(item);
  });
  ui.results.replaceChildren(fragment);
  ui.resultTitle.textContent = `${outputs.length} 張已完成`;
  ui.resultHint.textContent = `${layout.publishHint}${upscaleFactor > 1 ? ` · 高清 ${upscaleFactor}×` : ''}`;
  ui.shareAll.textContent = `分享 / 儲存全部 ${outputs.length} 張`;
  ui.resultCard.hidden = false;
  ui.resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function resetEditor(ui) {
  ui.mode.value = 'edge'; ui.x.value = '0'; ui.y.value = '0'; ui.zoom.value = '100'; ui.blur.value = '18';
  for (const button of ui.upscale.querySelectorAll('[data-factor]')) button.setAttribute('aria-pressed', String(button.dataset.factor === '1'));
  updateControlLabels(ui);
}
