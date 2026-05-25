## 1. Regression Coverage

- [x] 1.1 Add a right sidebar parity test proving the INFO/TERMINAL tabs use native compact pill styling.
- [x] 1.2 Run the targeted Electron right sidebar test and confirm the new test fails before implementation.

## 2. Renderer Styling

- [x] 2.1 Align the scoped right sidebar tab switch markup and CSS with the native pill switcher without changing tab behavior.
- [x] 2.2 Run the targeted Electron right sidebar test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Archive the completed OpenSpec change after verification.
