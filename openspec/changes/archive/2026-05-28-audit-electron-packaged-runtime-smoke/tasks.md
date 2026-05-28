## 1. Test Coverage

- [x] 1.1 Add targeted tests for packaged runtime smoke npm scripts, launcher, main-process audit mode, retained report expectations, and release gate ordering.
- [x] 1.2 Verify the targeted tests fail before implementation.

## 2. Implementation

- [x] 2.1 Add packaged runtime smoke mode in Electron main that loads the packaged renderer/preload and writes retained JSON evidence.
- [x] 2.2 Add a packaged runtime audit launcher script and npm commands.
- [x] 2.3 Preserve Electron framework symlinks as bundle-relative during packaging.
- [x] 2.4 Wire the canonical release script to run packaged smoke after packaging and before signing.
- [x] 2.5 Document the packaged runtime smoke workflow.

## 3. Verification

- [x] 3.1 Run targeted runtime audit and packaging/release tests.
- [x] 3.2 Run OpenSpec validation, full JS tests, `swift build`, macOS packaging, packaged runtime smoke audit, detailed runtime audit, and release readiness gate.
