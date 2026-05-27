## Commands Run

- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js`
  - RED before implementation: failed on `Electron startTerminal should look up an existing terminal session`.
  - GREEN after implementation: 26/26 Electron right-sidebar terminal tests passed.
- `openspec validate --all --strict`
  - Before archive: 34/34 items passed, including `change/align-electron-terminal-start-once-parity`.
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

- Native evidence: `TerminalSession.startIfNeeded(workingDirectory:)` guards with `guard !isStarted else { return }` and sets `isStarted = true` before starting SwiftTerm.
- Native folder-open evidence: `ContentView.openURL(_:)` calls `terminalSession.startIfNeeded(workingDirectory: url)` for folder projects.
- Electron evidence: `startTerminal` now returns `{ started: false, reused: true }` when a window already owns a terminal session, and it keeps the original session `projectRoot`.
- Renderer evidence: terminal output filtering uses the tracked terminal-session root instead of `state.currentProject.projectRoot`, so output from a reused terminal remains visible after folder switches.

## Known Gaps / Residual Risks

- Release readiness remains blocked until a Developer ID signing identity and usable `notarytool` keychain profile are available.
- No signed or notarized release artifact was produced in this local verification pass.
