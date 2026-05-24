## 1. Contract Tests

- [x] 1.1 Add native shell source tests for Electron default and minimum window geometry.
- [x] 1.2 Add runtime audit source tests for the native default viewport and report evidence.
- [x] 1.3 Run focused tests and confirm the new geometry assertions fail before implementation.

## 2. Implementation

- [x] 2.1 Replace Electron main-window size literals with named native geometry constants.
- [x] 2.2 Update the runtime audit viewport to the native default window size.
- [x] 2.3 Run focused tests and runtime audit after implementation.

## 3. Verification

- [x] 3.1 Run JavaScript syntax checks for changed Electron/audit sources.
- [x] 3.2 Run full `npm test`.
- [x] 3.3 Run `swift build`.
- [x] 3.4 Run OpenSpec strict validation for the change and all specs.
- [x] 3.5 Run `git diff --check`.
- [x] 3.6 Run Electron mac packaging smoke verification.

## 4. Archive

- [x] 4.1 Record retained verification evidence and residual risks.
- [x] 4.2 Archive the OpenSpec change.
- [x] 4.3 Commit the completed change.
