## 1. Parity Tests

- [x] 1.1 Add a failing Electron native-shell parity test for native Back/Forward toolbar help labels.
- [x] 1.2 Verify the targeted Electron native-shell parity test fails before implementation.

## 2. Toolbar Help Implementation

- [x] 2.1 Align Electron Back toolbar `title` and `aria-label` with native `Go Back (⌘[)`.
- [x] 2.2 Align Electron Forward toolbar `title` and `aria-label` with native `Go Forward (⌘])`.
- [x] 2.3 Verify the targeted Electron native-shell parity test passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `swift build` passes.
- [x] 3.3 Verify `openspec validate --all --strict` passes.
- [x] 3.4 Verify `git diff --check` passes.
- [x] 3.5 Verify `npm run electron:package:mac` passes.
- [x] 3.6 Archive the change and verify the archived specs remain valid.
