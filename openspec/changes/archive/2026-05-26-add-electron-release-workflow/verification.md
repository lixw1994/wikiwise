## Verification

### RED

- `npm --workspace @wikiwise/electron-app test -- test/release-workflow.test.js` exited 1 before implementation. The new workflow tests failed because `.github/workflows/electron-release.yml` did not exist and the Electron README did not document the credential-backed workflow.

### GREEN

- `npm --workspace @wikiwise/electron-app test -- test/release-workflow.test.js` exited 0 after implementation, with 5/5 workflow tests passing.
- `npm --workspace @wikiwise/electron-app test -- test/release-workflow.test.js test/macos-packaging.test.js` exited 0, with 28/28 release/package tests passing.

### Full Checks

- `openspec validate --all --strict` exited 0 before archive, with 33/33 items passing.
- `npm test` exited 0, with 224/224 Electron tests and 31/31 core tests passing.
- `swift build` exited 0.
- `git diff --check` exited 0.
- `npm run electron:package:mac` exited 0 and packaged `apps/electron/out/Wikiwise.app` at version 0.1.9.

### Release Gate Evidence

- `npm run electron:release:readiness` exited 1 at the expected credential gate and wrote `apps/electron/out/release-readiness/report.json`.
- The readiness report recorded `version` as `0.1.9`, `status` as `blocked`, no release artifacts produced, no signed/notarized release produced, and blockers for the missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` plus missing or unusable Apple notarization keychain profile `notarytool`.
- The new `Electron Release` GitHub Actions workflow is static coverage only in this environment. Final migration completion still requires a successful signed/notarized workflow or local release run, or an explicitly accepted OpenSpec deviation.

### Post-Archive Checks

- `npm test` initially exposed the generated Purpose placeholder in the newly archived `electron-release-workflow` main spec; the Purpose was replaced with a concrete statement.
- `npm test` exited 0 after the Purpose fix, with 224/224 Electron tests and 31/31 core tests passing.
- `openspec validate --all --strict` exited 0 after archive, with 33/33 items passing.
- `git diff --check` exited 0 after archive.
