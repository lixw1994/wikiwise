## 1. Contract Tests

- [x] 1.1 Add toolbar source tests for native SwiftUI icon-only toolbar controls and Electron symbol mappings.
- [x] 1.2 Add runtime-audit source tests for toolbar icon evidence and visible-label failures.
- [x] 1.3 Run focused tests and confirm the new assertions fail before implementation.

## 2. Implementation

- [x] 2.1 Replace Electron toolbar appearance/map/sidebar text contents with stable icon symbol spans.
- [x] 2.2 Update renderer toolbar rendering to cycle appearance symbols while preserving titles and ARIA labels.
- [x] 2.3 Update runtime audit to capture and assert toolbar icon evidence.
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
