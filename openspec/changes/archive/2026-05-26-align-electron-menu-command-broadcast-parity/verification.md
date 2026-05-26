## Verification

- `node --test apps/electron/test/chrome-menus-persistence.test.js`
  - Passed: 26 tests.
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

- Native evidence: `Sources/Wikiwise/WikiwiseApp.swift` posts `.goBack`, `.goForward`, and `.refreshWiki` through `NotificationCenter.default.post(..., object: nil)`.
- Native evidence: `Sources/Wikiwise/ContentView.swift` registers `.onReceive` handlers for those notifications in every `ContentView` instance.
- Electron evidence: `apps/electron/src/main/main.js` broadcasts `goBack`, `goForward`, and `refreshWiki` to all live `BrowserWindow` instances.
- Preservation evidence: `openExisting` is not in the broadcast allowlist, so the Electron-specific file chooser command remains targeted to a single renderer.
