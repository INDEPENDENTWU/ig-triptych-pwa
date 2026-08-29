export const APP_CONFIG = Object.freeze({
  canvas: Object.freeze({ contentWidth: 3240, height: 1440, bleed: 36, outputWidth: 1152, panelWidth: 1080 }),
  export: Object.freeze({ mimeType: 'image/jpeg', quality: 0.96, thumbnailMax: 520 }),
  editor: Object.freeze({ defaultBlur: 18, debounceMs: 90, previewMax: 1200 }),
  upscale: Object.freeze({ factors: [1, 2, 3], step: 1.5 }),
  heic: Object.freeze({ libraryUrl: 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js' }),
});

export const OUTPUT_SPECS = Object.freeze([
  Object.freeze({ key: 'left', label: '01_LEFT_左圖', startX: 0 }),
  Object.freeze({ key: 'middle', label: '02_MIDDLE_中圖', startX: 1080 }),
  Object.freeze({ key: 'right', label: '03_RIGHT_右圖', startX: 2160 }),
]);
