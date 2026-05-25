## 1. Regression Coverage

- [x] 1.1 Add right sidebar Info parity coverage proving optional sections use native top divider and spacing.
- [x] 1.2 Run the targeted Electron right sidebar test and confirm the new coverage fails before implementation.

## 2. Renderer Optional Sections

- [x] 2.1 Align optional section markup and CSS with the native divider/spacing without changing Info data behavior.
- [x] 2.2 Run the targeted Electron right sidebar test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Archive the completed OpenSpec change after verification.
