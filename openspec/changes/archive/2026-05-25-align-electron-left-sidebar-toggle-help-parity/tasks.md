## 1. Parity Tests

- [x] 1.1 Add a failing Electron toolbar test for native left-sidebar restore help text.
- [x] 1.2 Verify the targeted Electron toolbar test fails before implementation.

## 2. Toolbar Help Implementation

- [x] 2.1 Add left-sidebar help text logic driven by `state.isLeftSidebarVisible`.
- [x] 2.2 Expose the native restore help through `title` and `aria-label`.
- [x] 2.3 Verify the targeted Electron toolbar test passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `swift build` passes.
- [x] 3.3 Verify `openspec validate --all --strict` passes.
- [x] 3.4 Verify `git diff --check` passes.
- [x] 3.5 Verify `npm run electron:package:mac` passes.
- [x] 3.6 Archive the change and verify the archived specs remain valid.
