## 1. Regression Coverage

- [x] 1.1 Add a right-sidebar parity test that verifies Swift uses a 0.15s ease-in-out tab animation and Electron declares the matching 150ms ease-in-out transition.
- [x] 1.2 Run the targeted right-sidebar test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Add the native-timed transition to Electron right-sidebar tab styling without changing tab logic or layout.
- [x] 2.2 Run the targeted right-sidebar test and confirm it passes.

## 3. Verification

- [x] 3.1 Run full Node test coverage, Swift build, OpenSpec validation, and whitespace checks.
- [x] 3.2 Package the macOS Electron app and run release readiness to record the current signed-release gate.
- [x] 3.3 Archive the OpenSpec change after implementation evidence is captured.
