## 1. Regression Coverage

- [x] 1.1 Add a publishing parity test proving Electron uses native-like character counting for local subdomain minimum-length feedback.
- [x] 1.2 Run the targeted Electron publishing test and confirm the new test fails before implementation.

## 2. Renderer Input Handling

- [x] 2.1 Add a renderer character-count helper and use it for the local three-character publish subdomain check.
- [x] 2.2 Run the targeted Electron publishing test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Archive the completed OpenSpec change after verification.
