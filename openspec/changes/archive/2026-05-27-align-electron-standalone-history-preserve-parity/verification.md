## Commands Run

- `npm --workspace @wikiwise/electron-app test -- test/project-lifecycle.test.js`
  - RED before implementation: failed on unconditional `applyProjectResult` history reset after `state.generatedPage = null`.
  - GREEN after implementation: 12/12 Electron project lifecycle tests passed.
- `openspec validate --all --strict`
  - Before archive: 34/34 items passed, including `change/align-electron-standalone-history-preserve-parity`.
  - After archive: 33/33 specs passed.
- `npm test`
  - Electron workspace: 262/262 tests passed.
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

- Native evidence: `ContentView.openURL(_:)` assigns `backHistory = []` and `forwardHistory = []` only in the folder branch.
- Native standalone evidence: the standalone-file branch assigns `rootURL`, clears `tree`, assigns `selectedFileURL`, and calls `loadFile(url)` without referencing `backHistory` or `forwardHistory`.
- Electron evidence: `applyProjectResult` now resets `state.backHistory` and `state.forwardHistory` only when `isProjectFolder()` is true.
- Electron preservation evidence: standalone-file project results still clear generated-page display state, apply the selected file, skip folder-only services, preserve terminal/watcher boundaries, and record active file best-effort like the existing lifecycle coverage requires.

## Known Gaps / Residual Risks

- Release readiness remains blocked until a Developer ID signing identity and usable `notarytool` keychain profile are available.
- No signed or notarized release artifact was produced in this local verification pass.
