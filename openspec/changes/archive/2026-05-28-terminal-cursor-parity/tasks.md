## 1. Regression Tests

- [x] 1.1 Add terminal renderer tests proving xterm uses a block cursor for focused and inactive states while preserving existing cursor colors.
- [x] 1.2 Add runtime audit tests requiring opened-project scenarios to record block cursor evidence.

## 2. Implementation

- [x] 2.1 Configure the Electron xterm instance to render a native-like block cursor in focused and inactive states.
- [x] 2.2 Extend runtime audit DOM evidence and failure assertions for terminal cursor parity.

## 3. Verification

- [x] 3.1 Run targeted terminal/runtime tests with RED/GREEN evidence.
- [x] 3.2 Run runtime audit and package/build validation for this UI parity slice.
- [x] 3.3 Archive the OpenSpec change after verification passes.
