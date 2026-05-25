## 1. Regression Coverage

- [x] 1.1 Add right sidebar terminal parity coverage proving the Electron terminal panel uses the native top/leading inset.
- [x] 1.2 Run the targeted Electron right sidebar test and confirm the new coverage fails before implementation.

## 2. Renderer Terminal Inset

- [x] 2.1 Align terminal panel and xterm padding with the native terminal tab inset without changing terminal behavior.
- [x] 2.2 Run the targeted Electron right sidebar test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Archive the completed OpenSpec change after verification.
