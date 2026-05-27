## Commands Run

- `npm --workspace @wikiwise/electron-app test -- test/project-lifecycle.test.js`
  - RED before implementation: failed on standalone service preservation assertions for main-process project ownership and renderer watcher listener cleanup.
  - GREEN after implementation: 11/11 Electron project lifecycle tests passed.
- `openspec validate --all --strict`
  - Before archive: 34/34 items passed, including `change/align-electron-standalone-services-preserve-parity`.
  - After archive: 33/33 specs passed.
- `npm test`
  - Electron workspace: 260/260 tests passed.
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

- Native evidence: `ContentView.openURL(_:)` invalidates `backgroundTimer`, stops `fileWatcher`, assigns `compiler`, starts background compilation, and starts the file watcher only in the folder branch.
- Native standalone evidence: the standalone branch only updates `rootURL`, clears `tree`, assigns `selectedFileURL`, and calls `loadFile(url)`; it does not reference `backgroundTimer`, `fileWatcher`, or `compiler`.
- Electron main-process evidence: file project results no longer call `setWebContentsProjectRoot(webContents, null)`, so existing window-owned folder background compilation remains owned until another folder replaces it or the window closes.
- Electron renderer evidence: standalone-file project results no longer call `stopProjectWatcher()` or remove the project-change listener from `startProjectWatcher()`.

## Known Gaps / Residual Risks

- Release readiness remains blocked until a Developer ID signing identity and usable `notarytool` keychain profile are available.
- No signed or notarized release artifact was produced in this local verification pass.
