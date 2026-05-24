## 1. Contract Tests

- [x] 1.1 Add right-sidebar source tests for native conditional directions and linked sections.
- [x] 1.2 Add runtime-audit source tests for INFO tab optional-section evidence.
- [x] 1.3 Run focused tests and confirm the new assertions fail before implementation.

## 2. Implementation

- [x] 2.1 Add stable INFO section containers for directions and linked content.
- [x] 2.2 Update renderer INFO state to hide empty optional sections and show populated sections.
- [x] 2.3 Update runtime audit to activate INFO and assert scaffold empty optional sections are hidden.
- [x] 2.4 Run focused tests and runtime audit after implementation.

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
