## 1. Test Coverage

- [x] 1.1 Add targeted Electron main-process coverage requiring runtime helper discovery to include every `prebuilds/darwin-*` `spawn-helper`.
- [x] 1.2 Verify the targeted test fails before implementation.

## 2. Implementation

- [x] 2.1 Update runtime `node-pty` helper permission repair to chmod every discovered Darwin helper while preserving build helper candidates.
- [x] 2.2 Confirm the local workspace `darwin-x64` helper is repaired after the new guard runs.

## 3. Verification

- [x] 3.1 Run targeted Electron terminal tests.
- [x] 3.2 Run OpenSpec validation, full JS tests, `swift build`, macOS packaging, runtime audit, and release readiness gate.
