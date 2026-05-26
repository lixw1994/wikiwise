## 1. Test Coverage

- [x] 1.1 Add failing source-level coverage that Auto appearance preserves the stored mode while resolving renderer palette state from `prefers-color-scheme`.
- [x] 1.2 Add failing coverage that Auto system color-scheme changes refresh renderer and terminal theme state without changing the stored mode.

## 2. Renderer Appearance

- [x] 2.1 Add a resolved renderer appearance state and CSS selector path for Auto light/dark palettes.
- [x] 2.2 Add a system color-scheme change listener that only affects Auto mode and preserves explicit Light/Dark behavior.

## 3. Verification

- [x] 3.1 Run targeted Electron appearance/chrome tests.
- [x] 3.2 Run full verification: `npm test`, `swift build`, Electron runtime audit, packaging, OpenSpec validation, release-readiness preflight, and diff checks.
