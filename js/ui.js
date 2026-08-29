export function getUi() {
  const byId = id => { const element = document.getElementById(id); if (!element) throw new Error(`Missing UI element: #${id}`); return element; };
  return { file: byId('file'), status: byId('status'), preview: byId('preview'), mode: byId('mode'), x: byId('x'), y: byId('y'), zoom: byId('zoom'), blur: byId('blur'), modeText: byId('modeText'), xv: byId('xv'), yv: byId('yv'), zv: byId('zv'), bv: byId('bv'), generate: byId('generate'), resultCard: byId('resultCard'), results: byId('results'), shareAll: byId('shareAll'), saveLeft: byId('saveLeft'), saveMid: byId('saveMid'), saveRight: byId('saveRight'), installBtn: byId('installBtn') };
}
export function setStatus(ui, text, state = '') { ui.status.textContent = text; ui.status.className = `status${state ? ` ${state}` : ''}`; }
export function readSettings(ui) { return { mode: ui.mode.value, x: Number(ui.x.value), y: Number(ui.y.value), zoom: Number(ui.zoom.value), blur: Number(ui.blur.value) }; }
export function updateControlLabels(ui) { ui.xv.textContent = ui.x.value; ui.yv.textContent = ui.y.value; ui.zv.textContent = `${ui.zoom.value}%`; ui.bv.textContent = ui.blur.value; ui.modeText.textContent = ui.mode.value === 'cover' ? '鋪滿裁切' : '完整保留'; }
export function showPreview(ui, canvas) { ui.preview.replaceChildren(canvas); ui.generate.disabled = false; }
export function clearResults(ui) { ui.resultCard.hidden = true; ui.results.replaceChildren(); }
export function showResults(ui, outputs) {
  const fragment = document.createDocumentFragment();
  for (const output of outputs) { const tile = document.createElement('div'); tile.className = 'tile'; tile.appendChild(output.canvas); const name = document.createElement('div'); name.className = 'name'; name.textContent = output.label; tile.appendChild(name); const hint = document.createElement('div'); hint.className = 'hint'; hint.textContent = '1152×1440'; tile.appendChild(hint); fragment.appendChild(tile); }
  ui.results.replaceChildren(fragment); ui.resultCard.hidden = false; ui.resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
