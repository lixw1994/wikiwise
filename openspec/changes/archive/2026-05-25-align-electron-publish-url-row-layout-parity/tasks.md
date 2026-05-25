## 1. Regression Coverage

- [x] 1.1 Add a publishing parity test that proves the native URL row uses a 200-wide subdomain field and spacer before the availability indicator.
- [x] 1.2 Run the targeted Electron publishing test and confirm the new test fails before implementation.

## 2. Renderer Styling

- [x] 2.1 Update the Electron publish URL row grid to cap the subdomain column at 200px and reserve a flexible spacer before the indicator.
- [x] 2.2 Pin the availability indicator to a fixed trailing grid column while keeping its 16x16 size.
- [x] 2.3 Run the targeted Electron publishing test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Prepare the completed OpenSpec change for archive after verification.
