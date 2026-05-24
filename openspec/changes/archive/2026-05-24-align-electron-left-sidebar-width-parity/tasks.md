## 1. Contract Tests

- [x] 1.1 Add source tests for native left-sidebar min/ideal/max constraints and Electron CSS/renderer width wiring.
- [x] 1.2 Add runtime-audit source tests for left-sidebar resize evidence and failure messages.
- [x] 1.3 Run focused tests and confirm the new assertions fail before implementation.

## 2. Implementation

- [x] 2.1 Add left-sidebar CSS width variable, resize handle, and resize cursor styling.
- [x] 2.2 Add renderer state and handlers for clamped left-sidebar resizing.
- [x] 2.3 Update runtime audit to simulate left-sidebar dragging and assert width/title-offset evidence.
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
