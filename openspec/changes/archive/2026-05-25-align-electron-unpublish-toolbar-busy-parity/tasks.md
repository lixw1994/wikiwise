## 1. Regression Test

- [x] 1.1 Add a publishing parity test for toolbar busy state during unpublish.
- [x] 1.2 Run the targeted publishing test and confirm the new assertion fails for the current Electron renderer.

## 2. Electron Implementation

- [x] 2.1 Update the Electron toolbar publish control to treat `isUnpublishing` as native busy state.
- [x] 2.2 Refresh toolbar publish status immediately when unpublish starts.
- [x] 2.3 Re-run the targeted publishing test and confirm it passes.

## 3. Verification And Archive

- [x] 3.1 Run the full Electron test suite with `npm test`.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run `git diff --check`.
- [x] 3.5 Package the Electron macOS app with `npm run electron:package:mac`.
- [x] 3.6 Archive the OpenSpec change and re-run OpenSpec/diff validation.
