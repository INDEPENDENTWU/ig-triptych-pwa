# Changelog

## 4.0.0 — Social Slice Studio

- 完整重設 mobile-first 原生極簡 UI；移除明顯卡片、厚邊框與舊工具頁視覺。
- 新增統一 Layout Engine，三聯不再是 UI 特例。
- 新增九宮格、四宮格、六宮格與 4:5 三頁無縫輪播。
- 新增原尺寸 / 2× / 3× 高品質重採樣輸出。
- 預覽改為低記憶體即時 Canvas；完整高解析母版只在生成階段建立。
- 輸出改為序列處理，高倍率輸出不在 DOM 長期保留完整 Canvas，只保留 Blob 與縮略圖。
- 動態結果與逐張儲存，支援任意輸出數量。
- Service Worker 升級至 v4 並快取新模組。
- CI 增加 syntax check 與 layout/upscale tests。

### Compatibility

- GitHub Pages 網址不變。
- 三聯 3240×1440 / 3312×1440 bleed / 3×1152×1440 契約不變。
- HEIC、本機處理、Web Share、PWA 能力保留。

## 3.0.0 — 2026-08-29

- 將單檔應用整理成原生 ES modules。
- 集中尺寸常數、加入三聯幾何測試與更新安全的 PWA cache 策略。
