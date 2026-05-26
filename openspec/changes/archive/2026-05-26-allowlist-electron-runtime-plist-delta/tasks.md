## 1. Test Coverage

- [x] 1.1 Add a failing packaging test for the explicit Electron runtime `Info.plist` key allowlist and package-only key audit.
- [x] 1.2 Add a failing documentation/spec coverage test that keeps the allowlist audit visible to release reviewers.

## 2. Implementation

- [x] 2.1 Implement package-time top-level plist key delta validation in `scripts/package-electron-macos.mjs`.
- [x] 2.2 Document the package-only runtime plist delta without weakening the signed/notarized release gate.

## 3. Verification

- [x] 3.1 Run focused Electron packaging tests and inspect the packaged `Info.plist` evidence.
- [x] 3.2 Run full workspace verification, Swift build, OpenSpec validation, package, runtime audit, and archive the change.
