## 1. Regression Coverage

- [x] 1.1 Add a welcome typography parity test that verifies Swift's welcome summary and hint line spacing and Electron's matching welcome-specific line heights.
- [x] 1.2 Run the targeted native shell parity test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Update Electron welcome-specific CSS line heights to match native SwiftUI line-spacing rhythm without changing shared summary styling.
- [x] 2.2 Run the targeted native shell parity test and confirm it passes.

## 3. Verification

- [x] 3.1 Run full Node test coverage, Swift build, OpenSpec validation, and whitespace checks.
- [x] 3.2 Package the macOS Electron app and run release readiness to record the current signed-release gate.
- [x] 3.3 Archive the OpenSpec change after implementation evidence is captured.
