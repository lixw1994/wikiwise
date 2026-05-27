## Verification

### RED

- `npm --workspace @wikiwise/core test -- test/document-info.test.js` failed as expected before implementation: the new bracket-target regression expected `["Alpha]Beta", "Gamma"]` but the old regex returned `["Gamma"]`.
- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js` failed as expected before implementation: the new source-alignment test did not find the native-compatible shortest-match wikilink pattern in shared core.

### GREEN

- `npm --workspace @wikiwise/core test -- test/document-info.test.js` passed 7/7.
- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js` passed 23/23.

### Full Checks

- `openspec validate --all --strict` passed 34/34 items, including `change/align-electron-info-wikilink-bracket-target-parity`.
- `git diff --check` exited 0 with no output.
- `npm test` passed 278/278 tests across workspaces: Electron 239/239 and core 39/39.
- `swift build` completed successfully.
- `npm run electron:package:mac` produced `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`; the local package remains unsigned as expected.
- `npm run electron:audit:runtime` exited 0 and reported PASS screenshots for 7/7 scenarios: welcome-light, welcome-dark, new-wiki-light, new-wiki-dark, standalone-file-light, project-light, and project-dark. The retained report is `apps/electron/out/runtime-audit/report.json`.
- `npm run electron:release:readiness` exited 1 as expected and wrote `apps/electron/out/release-readiness/report.json` with status `blocked`; blockers remain the missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.

## Remaining Final Migration Gate

Final Electron migration completion still requires an actual signed and notarized release run, or an explicitly accepted OpenSpec deviation.

## Post-Archive Checks

- `openspec archive align-electron-info-wikilink-bracket-target-parity --yes` synced 3 main specs and archived the change as `openspec/changes/archive/2026-05-27-align-electron-info-wikilink-bracket-target-parity`.
- `openspec validate --all --strict` passed 33/33 active spec items after archive.
- `openspec list --json` returned `{"changes":[]}`.
- `npm --workspace @wikiwise/core test -- test/document-info.test.js` passed 7/7 after archive.
- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js` passed 23/23 after archive.
- `git diff --check` exited 0 with no output after removing OpenSpec-generated EOF blank lines from synced main specs.
