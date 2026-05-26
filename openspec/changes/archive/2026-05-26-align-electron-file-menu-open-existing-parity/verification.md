## Verification

### RED

- `npm --workspace @wikiwise/electron-app test -- test/chrome-menus-persistence.test.js` exited 1 before implementation. The updated tests failed because the Electron File menu still exposed `Open Existing Folder`, still routed it through `sendAppCommand("openExisting")`, and still kept focused-window command routing for that non-native menu command.

### GREEN

- `npm --workspace @wikiwise/electron-app test -- test/chrome-menus-persistence.test.js` exited 0 after implementation, with 29/29 targeted menu tests passing.

### Full Checks

- `openspec validate --all --strict` exited 0 before archive, with 34/34 items passing.
- `npm test` exited 0, with 224/224 Electron tests and 31/31 core tests passing.
- `swift build` exited 0.
- `git diff --check` exited 0.
- `npm run electron:package:mac` exited 0 and packaged `apps/electron/out/Wikiwise.app` at version 0.1.9.

### Release Gate Evidence

- `npm run electron:release:readiness` exited 1 at the expected credential gate and wrote `apps/electron/out/release-readiness/report.json`.
- The readiness report recorded `version` as `0.1.9`, `status` as `blocked`, no release artifacts produced, no signed/notarized release produced, and blockers for the missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` plus missing or unusable Apple notarization keychain profile `notarytool`.

### Post-Archive Checks

- `openspec validate --all --strict` exited 0 after archive, with 33/33 specs passing.
- `git diff --check` exited 0 after trimming synced spec EOF blank lines.
- `npm --workspace @wikiwise/electron-app test -- test/chrome-menus-persistence.test.js test/openspec-purpose-hygiene.test.js` exited 0 after archive, with 30/30 targeted menu and OpenSpec hygiene tests passing.
