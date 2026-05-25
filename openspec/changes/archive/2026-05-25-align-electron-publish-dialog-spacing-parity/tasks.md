## 1. Regression Coverage

- [x] 1.1 Add a publishing parity test that proves the native publish sheet uses 16px content spacing and Electron must match it on `.publish-dialog`.
- [x] 1.2 Run the targeted Electron publishing test and confirm the new test fails before implementation.

## 2. Renderer Styling

- [x] 2.1 Add a publish-dialog-specific 16px gap override without changing shared modal panel spacing.
- [x] 2.2 Run the targeted Electron publishing test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Archive the completed OpenSpec change after verification.
