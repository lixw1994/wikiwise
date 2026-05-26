## 1. Regression Coverage

- [x] 1.1 Add a native shell/file-tree parity test proving root and nested Electron file-tree rows use native zero inter-row spacing.
- [x] 1.2 Run the targeted Electron native shell parity test and confirm the new test fails before implementation.

## 2. Renderer Styling

- [x] 2.1 Remove the root and nested file-tree CSS grid gaps while preserving row padding and existing tree affordances.
- [x] 2.2 Run the targeted Electron native shell parity test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Record release readiness output before archiving the completed OpenSpec change.
