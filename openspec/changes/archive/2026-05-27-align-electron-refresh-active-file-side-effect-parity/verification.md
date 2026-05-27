## Verification

### OpenSpec

- `openspec validate align-electron-refresh-active-file-side-effect-parity --strict`
  - PASS: change is valid.

### RED Evidence

- `node --test apps/electron/test/preview-navigation-map-graph.test.js apps/electron/test/live-rebuild-watching.test.js`
  - Expected failure before renderer implementation.
  - Failing assertions:
    - `manual Refresh Page rewrites active-file marker like native loadFile` missing `await setActiveSelectedFile(refreshedPath)`.
    - `watcher selected-source refreshes rewrite active-file marker like native loadFile` missing `await setActiveSelectedFile(refreshedPath)`.

### GREEN Evidence

- `node --test apps/electron/test/preview-navigation-map-graph.test.js apps/electron/test/live-rebuild-watching.test.js`
  - PASS: 21/21 tests.

- `node --test apps/electron/test/chrome-menus-persistence.test.js apps/electron/test/preview-navigation-map-graph.test.js apps/electron/test/live-rebuild-watching.test.js apps/electron/test/project-lifecycle.test.js apps/electron/test/file-editing-save.test.js`
  - PASS: 70/70 tests.

### Full Verification

- `openspec validate --all --strict`
  - PASS: 34/34 items.

- `git diff --check`
  - PASS: no whitespace errors.

- `npm test`
  - PASS: Electron 256/256 tests.
  - PASS: core 42/42 tests.

- `swift build`
  - PASS: build complete.

- `npm run electron:package:mac`
  - PASS: packaged unsigned local Electron app at `apps/electron/out/Wikiwise.app`.
  - Bundle identifier: `com.readwise.wikiwise`.
  - Version: `0.1.9`; bundle version: `1`.

- `npm run electron:audit:runtime`
  - PASS: 7/7 runtime audit scenarios.
  - Report: `apps/electron/out/runtime-audit/report.json`.
  - Screenshots: `apps/electron/out/runtime-audit/screenshots`.
  - Expected audit-only mocked publish failures were logged while publish-error UI was verified.

- `npm run electron:release:readiness`
  - Expected exit 1.
  - Blockers:
    - Missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)`.
    - Missing or unusable Apple notarization keychain profile `notarytool`.

### Residual Risks

- Final migration completion still requires actual signed/notarized release execution or an explicitly accepted OpenSpec deviation.

### Post-Archive Verification

- `openspec archive align-electron-refresh-active-file-side-effect-parity --yes`
  - PASS: synced `electron-chrome-menus-persistence`, `electron-live-rebuild-watching`, and `electron-native-parity-roadmap`.
  - Archived as `openspec/changes/archive/2026-05-27-align-electron-refresh-active-file-side-effect-parity`.

- `openspec list --json`
  - PASS: no active changes.

- `openspec validate --all --strict`
  - PASS: 33/33 specs.

- `git diff --check`
  - PASS after trimming the synced live-rebuild spec EOF whitespace.

- `npm test`
  - PASS: Electron 256/256 tests.
  - PASS: core 42/42 tests.
