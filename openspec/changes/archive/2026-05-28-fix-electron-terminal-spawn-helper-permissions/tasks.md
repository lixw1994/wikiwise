## 1. Coverage

- [x] 1.1 Add targeted Electron main-process source coverage for resolving and correcting the `node-pty` spawn-helper executable bit before `pty.spawn`.
- [x] 1.2 Add targeted macOS packaging coverage for making the packaged `node-pty` spawn helper executable after dependency copy.
- [x] 1.3 Run the targeted tests and confirm they fail for the missing permission guard.

## 2. Implementation

- [x] 2.1 Implement the main-process `node-pty` spawn-helper permission guard without changing shell/session lifecycle behavior.
- [x] 2.2 Implement the package-script helper permission correction for the copied app bundle.

## 3. Verification

- [x] 3.1 Run targeted Electron terminal and packaging tests.
- [x] 3.2 Run `openspec validate --all --strict`, full `npm test`, `swift build`, and Electron package verification.
- [x] 3.3 Confirm the packaged helper has executable permissions and run runtime/release-readiness checks, preserving expected signing/notarization blockers.
