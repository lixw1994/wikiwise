## 1. Parity Tests

- [x] 1.1 Add failing Electron structural tests for native new-wiki chooser and post-creation guide copy.
- [x] 1.2 Add failing Electron structural tests for native publish warning and `Unpublish…` action copy.
- [x] 1.3 Verify the targeted Electron tests fail before implementation.

## 2. Copy Parity Implementation

- [x] 2.1 Update Electron new-wiki chooser and post-creation guide static copy.
- [x] 2.2 Update Electron publish dialog warning and static unpublish action copy.
- [x] 2.3 Update Electron dynamic unpublish label copy.
- [x] 2.4 Verify the targeted Electron tests pass.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `swift build` passes.
- [x] 3.3 Verify `openspec validate --all --strict` passes.
- [x] 3.4 Verify `git diff --check` passes.
- [x] 3.5 Verify `npm run electron:package:mac` passes.
- [x] 3.6 Archive the change and verify the archived specs remain valid.
