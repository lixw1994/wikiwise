## Verification

Date: 2026-05-27

### RED

- `npm --workspace @wikiwise/core test -- test/watch-events.test.js`
  - Failed before implementation because `notes/wiki/assets/diagram.png` returned `null` instead of a structure summary.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js`
  - Failed before implementation because the shared watcher source still used `relativePath.startsWith("wiki/assets/")` directly and had no native-like helper.
- `npm --workspace @wikiwise/electron-app test -- test/runtime-parity-audit.test.js`
  - Failed before implementation because the runtime audit script did not call `closeAuditWindow(window)` and still forced `window.destroy()`.
- `npm run electron:audit:runtime`
  - Failed outside the sandbox before the shutdown fix with `SIGTRAP` after writing 7/7 PASS scenario evidence, confirming the failure was at the audit shutdown boundary.

### GREEN

- `npm --workspace @wikiwise/core test -- test/watch-events.test.js`
  - Passed 7/7 tests.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js`
  - Passed 7/7 tests.
- `npm --workspace @wikiwise/electron-app test -- test/runtime-parity-audit.test.js`
  - Passed 20/20 tests.
- `openspec validate --all --strict`
  - Passed 34/34 items before archive.
- `git diff --check`
  - Passed before archive.
- `npm test`
  - Passed 266/266 workspace tests.
- `swift build`
  - Passed.
- `npm run electron:package:mac`
  - Passed and packaged `apps/electron/out/Wikiwise.app` as unsigned local build `0.1.9`.
- `npm run electron:audit:runtime`
  - Passed outside the sandbox after replacing forced window destruction with graceful close-and-wait.
  - Wrote `apps/electron/out/runtime-audit/report.json`.
  - Captured PASS screenshots for `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
- `npm run electron:release:readiness`
  - Expected exit 1.
  - Blockers retained: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.

### Post-Archive

- `openspec archive align-electron-watch-assets-path-parity --yes`
  - Archived as `2026-05-27-align-electron-watch-assets-path-parity`.
  - Updated `electron-live-rebuild-watching`, `electron-native-parity-roadmap`, `electron-runtime-parity-audit`, and `wikiwise-core-package`.
- `openspec validate --all --strict`
  - Passed 33/33 items after archive.
- `openspec list --json`
  - Returned `{"changes":[]}`.
- `npm --workspace @wikiwise/core test -- test/watch-events.test.js`
  - Passed 7/7 tests after archive.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js test/runtime-parity-audit.test.js test/openspec-purpose-hygiene.test.js`
  - Passed 28/28 tests after archive.
