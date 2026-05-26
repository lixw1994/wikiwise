## Verification

### RED

- `npm --workspace @wikiwise/electron-app test -- test/native-shell-parity.test.js` exited 1 before implementation, with the new test failing because `#detail-empty-state` was missing from the renderer HTML.

### GREEN

- `npm --workspace @wikiwise/electron-app test -- test/native-shell-parity.test.js` exited 0 after implementation, with 18/18 native shell parity tests passing.

### Full Checks

- `npm test` exited 0, with 216/216 Electron tests and 31/31 core tests passing.
- `swift build` exited 0.
- `openspec validate --all --strict` exited 0, with 33/33 items passing.
- `git diff --check` exited 0.

### Packaging / Release Gate

- `npm run electron:package:mac` exited 0 and packaged `apps/electron/out/Wikiwise.app`.
- `npm run electron:release:readiness` exited 1 at the expected release credential gate: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.

### Post-Archive Checks

- `openspec validate --all --strict` exited 0 after archive, with 32/32 specs passing.
- `git diff --check` exited 0 after trimming the synced spec EOF blank line.

### Additional Runtime Audit Attempt

- `npm run electron:audit:runtime` exited 1 after this slice. Welcome, new-wiki, and standalone-file scenarios passed, while project light/dark failed existing resize and toolbar-title-offset runtime assertions. The report showed the selected project detail still rendered `home.md`, the empty-state copy was not visible in the selected-file scenario, and the failure did not point at the new empty-detail placeholder.
