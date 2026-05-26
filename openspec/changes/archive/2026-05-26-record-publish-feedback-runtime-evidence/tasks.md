## 1. Test Coverage

- [x] 1.1 Add a failing runtime-audit static test for publish feedback fixture state, capture hooks, report fields, and failure assertions.

## 2. Runtime Audit Implementation

- [x] 2.1 Add deterministic audit-only publish state, availability, publish, external-open, and unpublish IPC behavior.
- [x] 2.2 Capture first-publish success feedback and external browser routing through the real renderer.
- [x] 2.3 Capture publish error feedback and dismissal through the real renderer.
- [x] 2.4 Capture already-published unpublish confirmation and successful cleanup through the real renderer.
- [x] 2.5 Restore the final audit state to selected `home.md` FILE/editor mode and fail runtime assertions when publish feedback evidence is missing.

## 3. Verification

- [x] 3.1 Run focused runtime-audit tests and the Electron runtime audit command.
- [x] 3.2 Run full workspace verification, Swift build, OpenSpec validation, package, runtime audit, and archive the change.
