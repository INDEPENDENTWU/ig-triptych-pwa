# Slice · 社群切片工具

Mobile-first、framework-free 的本機圖片切片 PWA，部署於 GitHub Pages。

正式網址保持不變：`https://independentwu.github.io/ig-triptych-pwa/`

## 功能

- 經典 IG 三聯：保留 3240×1440 主圖、左右各 36px bleed、3 張 1152×1440 的既有契約
- 九宮格：3×3 / 9 張 1080×1080
- 四宮格：2×2 / 4 張 1080×1080
- 六宮格：3×2 / 6 張 1080×1080
- 4:5 無縫輪播：3 張 1080×1350
- 高清輸出：原尺寸 / 2× / 3× 高品質重採樣
- HEIC/HEIF 本機轉換
- Web Share / 單張儲存
- PWA 離線核心資源快取

所有圖片處理都在瀏覽器本機執行，不會上傳到伺服器。

## 架構

- `js/layouts.js`：輸出玩法與切片規格
- `js/geometry.js`：純幾何運算與既有三聯契約
- `js/canvas.js`：母版、預覽、切片 Canvas
- `js/upscaler.js`：2× / 3× 分段高品質重採樣
- `js/exporter.js`：序列化生成、縮略圖、Blob/File、分享
- `js/ui.js`：純 UI 綁定與結果渲染
- `js/app.js`：狀態與流程協調

## 開發檢查

```bash
npm run check
npm test
```

生產站仍然是純靜態 HTML/CSS/ES modules，不需要 Node、bundler 或 build step。
