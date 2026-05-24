## 1. Tests

- [x] 1.1 Add a failing Electron source test that requires native File command group placement.
- [x] 1.2 Verify the targeted test fails before implementation.

## 2. Implementation

- [x] 2.1 Move Go Back, Go Forward, and Refresh Page into the File menu in `createApplicationMenu()`.
- [x] 2.2 Remove the extra top-level Navigate menu while preserving accelerators and `sendAppCommand` command names.

## 3. Verification

- [x] 3.1 Run targeted Electron tests for menu parity.
- [x] 3.2 Run full Electron/core tests, Swift build, OpenSpec validation, diff check, and macOS Electron packaging.
- [x] 3.3 Archive the OpenSpec change after verification and commit the completed batch.
