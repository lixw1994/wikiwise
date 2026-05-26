## Verification

### TDD Evidence

- RED: `node --test apps/electron/test/compiler-preview.test.js apps/electron/test/project-lifecycle.test.js`
  - Result: exit 1, 14 passed, 2 failed.
  - Expected failures: renderer tests required `detailModeForSelectedFile(file, options = {})` and subsequent Markdown selection preservation, while the existing renderer still used `initialDetailModeForFile(file)` to reset Markdown selections to WIKI.
- GREEN: `node --test apps/electron/test/compiler-preview.test.js apps/electron/test/project-lifecycle.test.js`
  - Result: exit 0, 16 passed.

### Full Verification

- `npm test`
  - Result: exit 0.
  - Electron app: 207 passed.
  - Core package: 31 passed.
- `swift build`
  - Result: exit 0.
- `openspec validate --all --strict`
  - Result: exit 0 while the change was active.
  - Totals: 33 passed, 0 failed.
- `git diff --check`
  - Result: exit 0.
- `npm run electron:package:mac`
  - Result: exit 0.
  - Packaged `apps/electron/out/Wikiwise.app`.
  - Bundle identifier: `com.readwise.wikiwise`.
  - Version: `0.1.9`.
  - Bundle version: `1`.
- `npm run electron:release:readiness`
  - Result: expected exit 1.
  - Blockers: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.
  - Report: `apps/electron/out/release-readiness/report.json` recorded `status: "blocked"` and no signed/notarized release artifacts produced.

### Native Parity Evidence

- `Sources/Wikiwise/ContentView.swift` initializes `detailMode` as `.compiled`, which maps to Electron's initial WIKI state.
- Native `navigateTo(_:)` updates `selectedFileURL`, calls `loadFile(url)`, and increments `webViewReloadToken` without assigning `detailMode`.
- Electron now preserves the current `state.detailMode` for subsequent file selections while keeping initial project/standalone selections in WIKI mode.

### Residual Risk

- Final migration completion still requires an actual signed and notarized Electron release run or an explicitly accepted OpenSpec deviation.
