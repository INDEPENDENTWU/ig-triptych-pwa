# Architecture

## Product invariants

- Public URL remains `https://independentwu.github.io/ig-triptych-pwa/`.
- Deployment remains static GitHub Pages from the repository root.
- Image processing happens on the user's device.
- Content master is 3240×1440.
- Internal bleed master is 3312×1440 with 36px mirrored bleed on each outer edge.
- Outputs are three 1152×1440 JPEG files.
- Slice starts are 0, 1080, 2160.
- Business Suite publishing order is right → middle → left.

## Modules

- `index.html`: semantic application shell only.
- `assets/styles.css`: presentation rules.
- `js/config.js`: product constants and output definitions.
- `js/geometry.js`: pure image/layout math; covered by Node tests.
- `js/canvas.js`: Canvas rendering, preview, bleed and slicing.
- `js/heic.js`: HEIC compatibility adapter.
- `js/image-decoder.js`: file decoding boundary.
- `js/exporter.js`: JPEG export, Web Share and blob fallback.
- `js/ui.js`: DOM reads and rendering.
- `js/pwa.js`: install and Service Worker registration.
- `js/app.js`: application state and orchestration.
- `sw.js`: offline shell and update-safe cache strategy.

## Change policy

Extend the relevant module or add a focused module. Avoid inline script/style patches, duplicated dimensions, global mutable state, or deployment-specific forks. Geometry changes require test updates. A change that modifies an invariant is a deliberate product version change, not a bug fix.
