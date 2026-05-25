## 1. Regression Coverage

- [x] 1.1 Add right sidebar parity coverage proving the Electron right tab header has native top and bottom dividers.
- [x] 1.2 Run the targeted Electron right sidebar test and confirm the new coverage fails before implementation.

## 2. Renderer Tab Header Divider

- [x] 2.1 Add the scoped top divider to the right tab header without changing tab switcher behavior or styling.
- [x] 2.2 Run the targeted Electron right sidebar test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Archive the completed OpenSpec change after verification.
