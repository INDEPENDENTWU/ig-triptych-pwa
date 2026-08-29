import { APP_CONFIG } from './config.js';
let loaderPromise = null;
function loadScriptOnce(src) {
  const existing = [...document.scripts].find(script => script.src === src);
  if (existing && typeof window.heic2any === 'function') return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = existing || document.createElement('script');
    const cleanup = () => { script.removeEventListener('load', onLoad); script.removeEventListener('error', onError); };
    const onLoad = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error('HEIC 轉換元件載入失敗，請確認網路連線。')); };
    script.addEventListener('load', onLoad, { once: true }); script.addEventListener('error', onError, { once: true });
    if (!existing) { script.src = src; script.async = true; script.crossOrigin = 'anonymous'; document.head.appendChild(script); }
  });
}
export async function convertHeicToJpeg(blob) {
  if (typeof window.heic2any !== 'function') { loaderPromise ||= loadScriptOnce(APP_CONFIG.heic.libraryUrl); await loaderPromise; }
  if (typeof window.heic2any !== 'function') throw new Error('HEIC 轉換元件不可用。');
  const converted = await window.heic2any({ blob, toType: 'image/jpeg', quality: APP_CONFIG.export.quality }); return Array.isArray(converted) ? converted[0] : converted;
}
