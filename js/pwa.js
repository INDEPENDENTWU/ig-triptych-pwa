export function setupInstallPrompt(button) {
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredPrompt = event; button.classList.add('show'); });
  button.addEventListener('click', async () => { if (!deferredPrompt) { window.alert('iPhone：點 Safari 分享按鈕 → 加入主畫面。'); return; } deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; button.classList.remove('show'); });
}
export function registerServiceWorker() { if (!('serviceWorker' in navigator)) return; window.addEventListener('load', async () => { try { const registration = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }); await registration.update(); } catch { /* PWA support is non-critical. */ } }); }
