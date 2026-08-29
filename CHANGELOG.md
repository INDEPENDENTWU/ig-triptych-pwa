# Changelog

## 3.0.0 - 2026-08-29

### Changed

- Reorganized the single-file application into native ES modules with explicit responsibilities.
- Centralized product dimensions and output definitions.
- Added pure geometry tests for the production triptych contract.
- Reworked PWA caching to avoid indefinitely serving stale application code after upgrades.
- Lazy-load HEIC conversion only when a HEIC/HEIF file is selected.
- Improved semantic markup, Traditional Chinese UI copy, focus visibility and status announcements.
- Added architecture documentation and a lightweight GitHub Actions quality check.

### Preserved

- Existing GitHub Pages URL and static deployment model.
- 3240×1440 content master.
- 36px outside bleed, 3312×1440 internal master.
- Three 1152×1440 outputs and right → middle → left publishing order.
- Local-only image processing.
