## 1. Parity Tests

- [x] 1.1 Add a failing Electron publishing test for native toolbar busy and dialog confirmation publish labels.
- [x] 1.2 Verify the targeted Electron publishing test fails before implementation.

## 2. Publish Label Implementation

- [x] 2.1 Align Electron toolbar publish busy label with native `PUBLISHING…`.
- [x] 2.2 Keep Electron publish dialog confirmation label as `Publish` for published projects.
- [x] 2.3 Verify the targeted Electron publishing test passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `swift build` passes.
- [x] 3.3 Verify `openspec validate --all --strict` passes.
- [x] 3.4 Verify `git diff --check` passes.
- [x] 3.5 Verify `npm run electron:package:mac` passes.
- [x] 3.6 Archive the change and verify the archived specs remain valid.
