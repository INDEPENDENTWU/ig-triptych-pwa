# IG 三聯 Business Suite 工具

Mobile-first, framework-free PWA for producing Instagram triptych images entirely in the browser.

## Current behavior

- Any supported image → 3240×1440 content master.
- 36px mirrored bleed on both outside edges → 3312×1440 internal master.
- Three 1152×1440 JPEG files.
- Business Suite publishing order: `03_RIGHT → 02_MIDDLE → 01_LEFT`.
- iPhone / Android photo picker and system share where supported.
- HEIC/HEIF conversion is loaded only when required.
- User images are processed locally and are not uploaded by this app.

## Architecture

Production code is plain HTML, CSS and ES modules. There is no framework, bundler or production build step. See [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Quality checks

Requires Node.js 20+ only for development tests:

```bash
npm test
```

The production site itself does not require Node.js or npm.

## GitHub Pages

Stable production URL:

`https://independentwu.github.io/ig-triptych-pwa/`

Keep the repository name `ig-triptych-pwa` and Pages deployment at the repository root to preserve that URL.

## Development rule

Prefer complete module-level changes over inline patches. Geometry changes must update tests, and product invariants should not change accidentally.
