## 1. Regression Coverage

- [x] 1.1 Add a publishing parity test that proves the native sheet has no duplicate URL detail row and Electron must not render or update one.
- [x] 1.2 Run the targeted Electron publishing test and confirm the new test fails before implementation.

## 2. Renderer Cleanup

- [x] 2.1 Remove the duplicate standalone publish URL paragraph from the Electron publish dialog markup.
- [x] 2.2 Remove renderer code that queries or updates the duplicate publish URL text node.
- [x] 2.3 Run the targeted Electron publishing test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Prepare the completed OpenSpec change for archive after verification.
