## Verification

Date: 2026-05-27

### RED

- `node --test apps/electron/test/chrome-menus-persistence.test.js`
  - Failed before implementation: 29/30 passed, 1 failed.
  - Failure showed Electron had no `refreshVisiblePreviewForAppearanceChange()` helper or appearance-change preview reload call site.

### GREEN

- `node --test apps/electron/test/chrome-menus-persistence.test.js`
  - Passed 30/30 tests after implementation.
- `node --test apps/electron/test/preview-navigation-map-graph.test.js`
  - Passed 9/9 tests after implementation.
- `openspec validate --all --strict`
  - Passed 34/34 items before archive.
- `git diff --check`
  - Passed before archive.
- `npm test`
  - Passed Electron 254/254 tests and core 42/42 tests.
- `swift build`
  - Passed.
- `npm run electron:package:mac`
  - Passed and packaged `apps/electron/out/Wikiwise.app` as unsigned local build `0.1.9`.
- `npm run electron:audit:runtime`
  - Passed outside the sandbox.
  - Wrote `apps/electron/out/runtime-audit/report.json`.
  - Captured PASS screenshots for `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
- `npm run electron:release:readiness`
  - Expected exit 1.
  - Blockers retained: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.

### Residual Risks

- Final migration completion still requires actual signed and notarized release evidence, or an explicitly accepted OpenSpec deviation.

### Post-Archive

- `openspec archive align-electron-appearance-preview-reload-parity --yes`
  - Archived as `2026-05-27-align-electron-appearance-preview-reload-parity`.
  - Updated `electron-appearance-palette-parity` and `electron-native-parity-roadmap`.
- `openspec validate --all --strict`
  - Passed 33/33 items after archive.
- `openspec list --json`
  - Returned `{"changes":[]}`.
- `npm test`
  - Passed Electron 254/254 tests and core 42/42 tests after archive.
