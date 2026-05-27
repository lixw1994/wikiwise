## Verification

Date: 2026-05-27

## RED

- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js`
  - Expected failure retained before implementation.
  - Failing test: `main process starts right sidebar terminal as native login shell without changing lifecycle`.
  - Failure reason: missing `loginShellArgs()` and missing `pty.spawn(shellPath, shellArgs, ...)`.
  - Result: 20 passed, 1 failed.

## GREEN

- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js`
  - Result: 21 passed, 0 failed.

## Phase Checks

- `openspec validate --all --strict`
  - Result: 34 passed, 0 failed.
- `git diff --check`
  - Result: passed.
- `npm test`
  - Result: Electron 226 passed, core 31 passed.
- `swift build`
  - Result: build complete.
- `npm run electron:package:mac`
  - Result: packaged `apps/electron/out/Wikiwise.app`.
  - Bundle identifier: `com.readwise.wikiwise`.
  - Version: `0.1.9`.
  - Bundle version: `1`.
- `npm run electron:audit:runtime`
  - Sandbox run exited with SIGABRT, then the GUI audit was rerun outside the sandbox with approval.
  - Report: `apps/electron/out/runtime-audit/report.json`.
  - Generated at: `2026-05-27T03:00:20.640Z`.
  - Scenarios: `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, `project-dark`.
  - Result: all scenarios passed with no assertion failures.
- `npm run electron:release:readiness`
  - Expected credential gate.
  - Report: `apps/electron/out/release-readiness/report.json`.
  - Version: `0.1.9`.
  - Status: `blocked`.
  - Blockers: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)`; missing or unusable Apple notarization keychain profile `notarytool`.
  - Artifacts: none.

## Post-Archive Checks

- `openspec archive align-electron-terminal-login-shell-parity --yes`
  - Result: archived as `2026-05-27-align-electron-terminal-login-shell-parity`.
  - Main specs updated: `electron-native-parity-roadmap`, `electron-right-sidebar-terminal`.
- `openspec validate --all --strict`
  - Result: 33 passed, 0 failed.
- `openspec list --json`
  - Result: `{"changes":[]}`.
- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js test/openspec-purpose-hygiene.test.js`
  - Result: 22 passed, 0 failed.
- `git diff --check`
  - Result: passed after trimming archive-synced EOF blank lines in the two updated specs.
