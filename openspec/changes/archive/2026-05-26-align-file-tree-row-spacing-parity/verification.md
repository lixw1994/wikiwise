## Verification

### RED

- `npm --workspace @wikiwise/electron-app test -- test/native-shell-parity.test.js` exited 1 before implementation, with the new test failing because `.file-tree` still used `gap: 1px` instead of native-derived `gap: 0`.

### GREEN

- `npm --workspace @wikiwise/electron-app test -- test/native-shell-parity.test.js` exited 0 after implementation, with 17/17 native shell parity tests passing.

### Full Checks

- `npm test` exited 0, with 215/215 Electron tests and 31/31 core tests passing.
- `swift build` exited 0.
- `openspec validate --all --strict` exited 0, with 33/33 items passing.
- `git diff --check` exited 0.

### Packaging / Release Gate

- `npm run electron:package:mac` exited 0 and packaged `apps/electron/out/Wikiwise.app`.
- `npm run electron:release:readiness` exited 1 at the expected release credential gate: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.

### Post-Archive Checks

- `openspec validate --all --strict` exited 0 after archive, with 32/32 specs passing.
- `git diff --check` exited 0 after trimming the synced spec EOF blank line.
