## Verification

### TDD Evidence

- RED: `node --test apps/electron/test/preview-navigation-map-graph.test.js`
  - Result: exit 1, 5 passed, 1 failed.
  - Expected failure: generated preview link history test required `showGeneratedPage(result, { pushHistory: Boolean(state.selectedFile) })`, while the existing renderer still called `showGeneratedPage(result)`.
- GREEN: `node --test apps/electron/test/preview-navigation-map-graph.test.js`
  - Result: exit 0, 6 passed.

### Full Verification

- `npm test`
  - Result: exit 0.
  - Electron app: 208 passed.
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

- `Sources/Wikiwise/ContentView.swift` generated-page link handling appends to `backHistory` only under `if let current = selectedFileURL`.
- The native generated-page branch does not append `compiledFileURL` when `selectedFileURL` is nil, so generated-to-generated preview navigation does not add app-level back history.
- Electron now uses `Boolean(state.selectedFile)` for generated preview-link history, while toolbar map opening still calls `showGeneratedPage(generatedPage)` with existing default history behavior.

### Residual Risk

- Final migration completion still requires an actual signed and notarized Electron release run or an explicitly accepted OpenSpec deviation.
