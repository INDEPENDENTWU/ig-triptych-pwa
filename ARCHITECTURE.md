# Architecture

## Product invariant

`triptych` 是受保護的 production contract：3240×1440 主內容、36px 雙側 bleed、3312×1440 內部母版、三張 1152×1440，切片起點 0/1080/2160。

正式網址保持 `https://independentwu.github.io/ig-triptych-pwa/`，部署仍為 repository root 的靜態 GitHub Pages；圖片處理仍只發生在使用者裝置。

## Pipeline

1. Decode：`image-decoder.js` / `heic.js`
2. Edit preview：`canvas.js` 使用縮小母版即時重畫
3. Layout：`layouts.js` 宣告輸出母版、行列與 slices
4. Full render：只有點擊生成時建立完整母版
5. Slice：triptych 走既有 bleed contract；其他玩法走 declarative slices
6. Upscale：`upscaler.js` 以 <=1.5× 多階段 high-quality Canvas resize 到 2×/3×
7. Export：逐張建立 Blob + 輕量縮略圖，釋放大型 Canvas
8. Share/save：`exporter.js`

## Modules

- `index.html`：語義化產品 shell
- `assets/styles.css`：UI engineering tokens、mobile-first responsive rules
- `js/config.js`：產品常數
- `js/layouts.js`：玩法與切片定義
- `js/geometry.js`：純幾何與受保護的三聯契約
- `js/canvas.js`：預覽、完整母版、bleed、切片
- `js/upscaler.js`：高清重採樣
- `js/exporter.js`：Blob/File、縮略圖、分享與儲存
- `js/ui.js`：DOM 與動態結果
- `js/app.js`：狀態、流程、互動協調

## UI engineering

- mobile-first，320px 起支援
- safe-area aware 固定底部 action dock
- 統一 spacing / corner / typography tokens
- 無明顯卡片與厚邊框，靠留白、surface、色彩與層級建立資訊結構
- active layout 透過單一 `--accent` token 驅動，不散落 patch styles

## Change policy

新增玩法應優先新增 declarative layout；不要複製整條圖片 pipeline。任何修改 triptych invariant 的變更都必須是明確產品版本變更並更新測試。
