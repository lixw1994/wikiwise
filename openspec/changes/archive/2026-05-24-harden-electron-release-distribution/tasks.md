## 1. Release Contract Tests

- [x] 1.1 Add failing structural tests for the canonical Electron release command, runtime audit gate, Electron packaging delegation, signing, DMG creation, notarization, stapling, and final assessment.
- [x] 1.2 Add failing structural tests for Electron hardened runtime entitlements and updated release documentation.
- [x] 1.3 Verify `npm --prefix apps/electron test` fails for the new release expectations before implementation.

## 2. Release Implementation

- [x] 2.1 Update `scripts/build-release.sh` to release the Electron app while preserving the canonical release command.
- [x] 2.2 Add Electron signing entitlements and release prerequisite guardrails.
- [x] 2.3 Update release documentation in root, Electron, and OpenSpec project docs.
- [x] 2.4 Verify `bash -n scripts/build-release.sh` passes.
- [x] 2.5 Verify `npm --prefix apps/electron test` passes.

## 3. Release Artifact Checks

- [x] 3.1 Verify `npm run electron:audit:runtime` passes.
- [x] 3.2 Verify `npm run electron:package:mac` produces the Electron app bundle.
- [x] 3.3 Inspect the packaged app bundle metadata and embedded Electron app layout.

## 4. Validation

- [x] 4.1 Verify `npm test` passes.
- [x] 4.2 Verify `openspec validate harden-electron-release-distribution --strict` passes.
- [x] 4.3 Verify Swift source files are untouched and `swift build` passes.
- [x] 4.4 Verify `git diff --check` passes.
- [x] 4.5 Record retained verification evidence and archive the change.
