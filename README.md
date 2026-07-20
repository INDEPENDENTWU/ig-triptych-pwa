# IG 三联 Business Suite 工具

移动端优先的 PWA 网页工具。

- 任意图片在浏览器本地处理为 3240×1440 主图
- 自动建立左右各 36px bleed
- 自动输出 3 张 1152×1440
- Business Suite 发布顺序：03_RIGHT → 02_MIDDLE → 01_LEFT
- 支持 iPhone / Android 浏览器相册选图与系统分享
- HEIC/HEIF 会尝试在浏览器本地转换为 JPG

所有图片处理都在用户设备本地完成，不会上传到服务器。

## GitHub Pages

1. 进入仓库 Settings → Pages。
2. Build and deployment 选择 Deploy from a branch。
3. Branch 选择 main，目录选择 /(root)。
4. 保存并等待 GitHub Pages 地址生成。

项目站点默认地址通常为：

`https://independentwu.github.io/ig-triptych-pwa/`
