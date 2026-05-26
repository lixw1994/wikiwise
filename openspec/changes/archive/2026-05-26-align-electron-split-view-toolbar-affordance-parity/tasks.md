## 1. OpenSpec

- [x] 1.1 Validate the split-view toolbar affordance change artifacts with strict OpenSpec validation.

## 2. Test Coverage

- [x] 2.1 Add failing source tests for left-sidebar toolbar affordance metadata and runtime audit evidence.

## 3. Implementation

- [x] 3.1 Add state-specific native affordance and sidebar action metadata to the Electron left-sidebar toolbar control.
- [x] 3.2 Extend runtime audit evidence for visible and hidden left-sidebar toolbar affordance states.
- [x] 3.3 Update runtime assertions to fail on missing or mismatched split-view affordance metadata.

## 4. Verification And Archive

- [x] 4.1 Run focused source tests and Electron runtime audit.
- [x] 4.2 Archive the OpenSpec change after tasks and validation pass.
- [x] 4.3 Run full verification: focused tests, `npm test`, `swift build`, runtime audit, `openspec validate --all --strict`, `git diff --check`, and Electron mac packaging.
