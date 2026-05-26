## Verification

- `node --test apps/electron/test/preview-navigation-map-graph.test.js`
  - Passed: 5 tests.
- `npm test`
  - Passed: Electron app tests (206) and core tests (31).
- `swift build`
  - Passed.
- `openspec validate --all --strict`
  - Passed: 33 items.
- `git diff --check`
  - Passed.
- `npm run electron:package:mac`
  - Passed; generated `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:release:readiness`
  - Expected local blocker: failed preflight because the machine does not have Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` or usable Apple notarization keychain profile `notarytool`.

## Parity Evidence

- Native evidence: `Sources/Wikiwise/WikiwiseApp.swift` routes Refresh Page to `.refreshWiki`, and `Sources/Wikiwise/ContentView.swift` returns from `recompileCurrentPage(_:)` when `selectedFileURL` is nil.
- Electron evidence: `apps/electron/src/renderer/renderer.js` keeps manual `refreshCurrentView()` scoped to selected Markdown files.
- Preservation evidence: `handleProjectChanged()` still refreshes active generated pages for rebuild, CSS, or Markdown output changes.
