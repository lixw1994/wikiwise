## 1. Regression Coverage

- [x] 1.1 Add a publishing parity test that proves the native publish title uses 18px medium serif typography and Electron must match it on `.publish-dialog h2`.
- [x] 1.2 Run the targeted Electron publishing test and confirm the new test fails before implementation.

## 2. Renderer Styling

- [x] 2.1 Add a publish-dialog-scoped heading typography rule for serif family, 18px size, and medium weight.
- [x] 2.2 Run the targeted Electron publishing test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Archive the completed OpenSpec change after verification.
