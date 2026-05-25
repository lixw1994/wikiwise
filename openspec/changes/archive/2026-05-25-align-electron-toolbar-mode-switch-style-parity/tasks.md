## 1. Regression Coverage

- [x] 1.1 Add a toolbar parity test proving the File/Wiki mode switch uses native compact segmented styling.
- [x] 1.2 Run the targeted Electron toolbar test and confirm the new test fails before implementation.

## 2. Renderer Styling

- [x] 2.1 Align the scoped mode switch CSS with the native segmented styling without changing other toolbar controls.
- [x] 2.2 Run the targeted Electron toolbar test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Archive the completed OpenSpec change after verification.
