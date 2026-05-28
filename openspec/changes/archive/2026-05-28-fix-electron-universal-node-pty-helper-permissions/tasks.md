## 1. Coverage

- [x] 1.1 Add targeted packaging coverage proving helper permission repair discovers all packaged Darwin `spawn-helper` files.
- [x] 1.2 Add targeted packaging coverage proving the script no longer relies on `darwin-${process.arch}` for package repair.
- [x] 1.3 Run the targeted packaging test and confirm it fails before implementation.

## 2. Implementation

- [x] 2.1 Update packaging helper repair to traverse packaged `node-pty/prebuilds/darwin-*` helpers.
- [x] 2.2 Preserve tolerant behavior for absent optional helpers while repairing every present helper.

## 3. Verification

- [x] 3.1 Run targeted packaging tests.
- [x] 3.2 Run `openspec validate --all --strict`, full `npm test`, `swift build`, package verification, and runtime audit.
- [x] 3.3 Verify packaged `darwin-arm64` and `darwin-x64` helper modes when present.
- [x] 3.4 Run release-readiness evidence and preserve expected signing/notarization blockers.
