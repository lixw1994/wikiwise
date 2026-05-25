## 1. Parity Tests

- [x] 1.1 Add a failing Electron publishing test for native cancel/default keyboard shortcuts.
- [x] 1.2 Verify the targeted Electron publishing test fails before implementation.

## 2. Keyboard Implementation

- [x] 2.1 Add scoped Electron publish dialog keydown handling for Escape and Enter.
- [x] 2.2 Verify the targeted Electron publishing test passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `swift build` passes.
- [x] 3.3 Verify `openspec validate --all --strict` passes.
- [x] 3.4 Verify `git diff --check` passes.
- [x] 3.5 Verify `npm run electron:package:mac` passes.
- [x] 3.6 Archive the change and verify the archived specs remain valid.
