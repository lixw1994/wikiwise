## Commands Run

- `npm --workspace @wikiwise/electron-app test -- --test-reporter=spec test/file-tree-expansion-parity.test.js`
  - RED before implementation: failed on `.tree-folder-icon` using `height: 11px` instead of native `11.14px`.
  - GREEN after implementation: 14/14 Electron file-tree expansion/visual tests passed.
- `openspec validate --all --strict`
  - Before archive: 34/34 items passed, including `change/align-electron-folder-icon-aspect-parity`.
- `npm test`
  - Electron workspace: 265/265 tests passed.
  - Core workspace: 42/42 tests passed.
- `swift build`
  - Swift package build completed successfully.
- `npm run electron:package:mac`
  - Packaged local unsigned app at `apps/electron/out/Wikiwise.app`.
- `npm run electron:audit:runtime`
  - Runtime audit completed successfully.
  - Report: `apps/electron/out/runtime-audit/report.json`.
  - Screenshots: `apps/electron/out/runtime-audit/screenshots`.
  - Passed scenarios: welcome-light, welcome-dark, new-wiki-light, new-wiki-dark, standalone-file-light, project-light, project-dark.
- `npm run electron:release:readiness`
  - Expected blocked exit due to missing local release credentials.
  - Report: `apps/electron/out/release-readiness/report.json`.

## Parity Evidence

- Native evidence: `ContentView.fileTreeRow(_:)` calls `FolderIcon(size: 13, isSpecial: node.name == "raw" || node.name == "site")`.
- Native evidence: `FolderIcon` frames itself with `.frame(width: size, height: size * (12.0 / 14.0))`.
- Native evidence: special-folder dots are drawn at `(7.0 - 1.5) * s` with `3.0 * s` width and height, where `s = size / 14.0`.
- Electron evidence: `.tree-folder-icon` now uses `height: 11.14px` while preserving `width: 13px`.
- Electron evidence: `.tree-folder.special-folder .tree-folder-icon::after` now uses a `2.79px` dot centered at `6.5px, 6.5px`.

## Known Gaps / Residual Risks

- The Electron CSS folder shape is still an approximation of the native Canvas path; this change aligns the aspect and marker geometry, not exact path curves.
- Release readiness remains blocked until a Developer ID signing identity and usable `notarytool` keychain profile are available.
- No signed or notarized release artifact was produced in this local verification pass.
