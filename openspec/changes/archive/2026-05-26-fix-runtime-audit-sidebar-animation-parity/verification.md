## Verification

### RED

- `npm --workspace @wikiwise/electron-app test -- test/chrome-menus-persistence.test.js test/runtime-parity-audit.test.js` exited 1 before implementation, with the new tests failing because active resize did not bypass the project grid transition and runtime audit did not wait for sidebar visibility animation settlement.
- A later targeted run of `npm --workspace @wikiwise/electron-app test -- test/native-shell-parity.test.js test/chrome-menus-persistence.test.js test/runtime-parity-audit.test.js` exited 1 after the title-offset correction because the old toolbar-title test still required DOM geometry measurement instead of the stable renderer state width.

### GREEN

- `npm --workspace @wikiwise/electron-app test -- test/native-shell-parity.test.js test/chrome-menus-persistence.test.js test/runtime-parity-audit.test.js` exited 0 after implementation, with 66/66 targeted tests passing.
- `npm run electron:audit:runtime` exited 0 after implementation, with all scenarios passing: welcome light/dark, new-wiki light/dark, standalone-file light, project light, and project dark.

### Full Checks

- `npm test` exited 0, with 219/219 Electron tests and 31/31 core tests passing.
- `swift build` exited 0.
- `openspec validate --all --strict` exited 0, with 33/33 items passing before archive.
- `git diff --check` exited 0.

### Packaging / Release Gate

- `npm run electron:package:mac` exited 0 and packaged `apps/electron/out/Wikiwise.app`.
- `npm run electron:release:readiness` exited 1 at the expected release credential gate: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.

### Post-Archive Checks

- `openspec validate --all --strict` exited 0 after archive, with 32/32 specs passing.
- `git diff --check` exited 0 after trimming synced spec EOF blank lines.
