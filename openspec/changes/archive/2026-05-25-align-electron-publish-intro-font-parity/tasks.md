## 1. Regression Coverage

- [x] 1.1 Add a publishing parity test proving the Electron publish URL intro uses native 13px text while compact warning text remains 12px.
- [x] 1.2 Run the targeted Electron publishing test and confirm the new test fails before implementation.

## 2. Renderer Styling

- [x] 2.1 Add a scoped renderer hook for the publish URL intro and set its font size to 13px without changing shared compact summary text.
- [x] 2.2 Run the targeted Electron publishing test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Archive the completed OpenSpec change after verification.
