## 1. Regression Coverage

- [x] 1.1 Add a publishing parity test that proves the native sheet-level `Unpublish…` label is static and Electron does not compute `Unpublishing` for that sheet action.
- [x] 1.2 Run the targeted Electron publishing test and confirm the new test fails before implementation.

## 2. Renderer Implementation

- [x] 2.1 Update the Electron renderer so the publish sheet's unpublish action text remains `Unpublish…` whenever it is rendered.
- [x] 2.2 Run the targeted Electron publishing test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Prepare the completed OpenSpec change for archive after verification.
