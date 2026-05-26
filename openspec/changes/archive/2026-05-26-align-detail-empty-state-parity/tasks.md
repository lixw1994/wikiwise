## 1. Regression Coverage

- [x] 1.1 Add a native shell/detail parity test proving Electron includes and toggles the native empty detail state.
- [x] 1.2 Run the targeted Electron native shell parity test and confirm the new test fails before implementation.

## 2. Renderer Empty State

- [x] 2.1 Add the detail empty-state markup with native `doc.text` symbol metadata and `Select a file to read` copy.
- [x] 2.2 Add CSS for centered native spacing, muted color, 32px light icon, 13px copy, and content background.
- [x] 2.3 Toggle the empty state in `renderDetail()` only when no guide, generated page, or selected file is active.
- [x] 2.4 Run the targeted Electron native shell parity test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Record release readiness output before archiving the completed OpenSpec change.
