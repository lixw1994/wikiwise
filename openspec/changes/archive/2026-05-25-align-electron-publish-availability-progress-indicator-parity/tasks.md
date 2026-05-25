## 1. Regression Coverage

- [x] 1.1 Add a publishing parity test that proves native `checking` uses `ProgressView` and Electron uses a non-text progress indicator.
- [x] 1.2 Run the targeted Electron publishing test and confirm the new test fails before implementation.

## 2. Renderer Implementation

- [x] 2.1 Update the Electron renderer so `checking` leaves the indicator text empty.
- [x] 2.2 Add CSS for a 16x16-row spinner visual on the `checking` indicator state.
- [x] 2.3 Run the targeted Electron publishing test and confirm it passes.

## 3. Verification and Archive

- [x] 3.1 Run full repository verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.2 Prepare the completed OpenSpec change for archive after verification.
