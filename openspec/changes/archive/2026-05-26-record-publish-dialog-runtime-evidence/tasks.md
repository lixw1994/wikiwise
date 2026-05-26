## 1. Test Coverage

- [x] 1.1 Add a failing runtime-audit static test for first-publish dialog fixture, capture, report fields, and failure assertions.

## 2. Runtime Audit Implementation

- [x] 2.1 Capture first-publish dialog evidence through the real renderer in opened-project scenarios.
- [x] 2.2 Restore the publish dialog capture to the selected `home.md` FILE/editor audit state.
- [x] 2.3 Fail runtime audit assertions when publish dialog evidence, disabled publish state, hidden unpublish action, cancel closure, or restore-state evidence is missing.

## 3. Verification

- [x] 3.1 Run focused runtime-audit tests and the Electron runtime audit command.
- [x] 3.2 Run full workspace verification, Swift build, OpenSpec validation, package, runtime audit, and archive the change.
