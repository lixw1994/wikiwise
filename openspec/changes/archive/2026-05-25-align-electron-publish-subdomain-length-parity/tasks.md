## 1. Regression Coverage

- [x] 1.1 Add a publishing parity test proving Electron preserves native sanitized subdomain length behavior.
- [x] 1.2 Run the targeted Electron publishing test and confirm the new test fails before implementation.

## 2. Renderer Input Handling

- [x] 2.1 Remove Electron renderer-only 48-character truncation while preserving lowercase and unsupported-character filtering.
- [x] 2.2 Run the targeted Electron publishing test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Archive the completed OpenSpec change after verification.
