## Verification

- `node --test apps/electron/test/preview-navigation-map-graph.test.js`
  - Passed: 5 tests.
- `npm test`
  - Passed: Electron app tests (207) and core tests (31).
- `swift build`
  - Passed.
- `openspec validate --all --strict`
  - Passed: 33 items while the change was active.
- `git diff --check`
  - Passed.
- `npm run electron:package:mac`
  - Passed; generated `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:release:readiness`
  - Expected local blocker: failed preflight because the machine does not have Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` or usable Apple notarization keychain profile `notarytool`.

## Parity Evidence

- Native evidence: `Sources/Wikiwise/ContentView.swift` watcher handling calls `recompileCurrentPage(_:)` only when `selectedFileURL` is present.
- Native evidence: generated pages use `compiledFileURL` while `selectedFileURL` is nil.
- Native evidence: `Sources/Wikiwise/WebView.swift` reloads only when `fileURL` changes or `reloadToken` changes.
- Electron evidence: `apps/electron/src/renderer/renderer.js` no longer calls `refreshGeneratedPage()` from watcher-driven `handleProjectChanged()` changes.
- Preservation evidence: generated pages still open through the main process when the user opens or navigates to them.
