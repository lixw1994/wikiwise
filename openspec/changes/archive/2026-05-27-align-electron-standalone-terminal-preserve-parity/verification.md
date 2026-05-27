## Commands Run

- `npm --workspace @wikiwise/electron-app test -- test/project-lifecycle.test.js`
  - RED before implementation: failed on `renderer should preserve an existing terminal output listener for standalone files`.
  - GREEN after implementation: 11/11 Electron project lifecycle tests passed.
- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js`
  - 26/26 Electron right-sidebar terminal tests passed.
- `openspec validate --all --strict`
  - Before archive: 34/34 items passed, including `change/align-electron-standalone-terminal-preserve-parity`.
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

- Native evidence: `ContentView.openURL(_:)` calls `terminalSession.startIfNeeded(workingDirectory: url)` only in the folder branch.
- Native standalone evidence: the standalone branch only updates `rootURL`, clears `tree`, assigns `selectedFileURL`, and calls `loadFile(url)`; it does not reference `terminalSession`.
- Electron evidence: standalone-file terminal service handling now returns after `renderTerminalTab()` without calling `wikiwise.stopTerminal()`, resetting `terminalSessionProjectRoot`, clearing the terminal instance, or removing the terminal output listener.

## Known Gaps / Residual Risks

- Release readiness remains blocked until a Developer ID signing identity and usable `notarytool` keychain profile are available.
- No signed or notarized release artifact was produced in this local verification pass.
