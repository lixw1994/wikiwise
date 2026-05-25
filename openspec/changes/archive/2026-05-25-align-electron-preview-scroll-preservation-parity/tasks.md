## 1. Regression Coverage

- [x] 1.1 Add targeted Electron renderer source tests proving native compiled-preview scroll capture and restore behavior.
- [x] 1.2 Run the targeted compiler preview test and confirm it fails before implementation.

## 2. Electron Renderer Implementation

- [x] 2.1 Add compiled preview iframe scroll capture and restore helpers.
- [x] 2.2 Capture preview scroll when leaving WIKI mode and before reloading the same preview file.
- [x] 2.3 Restore preview scroll after iframe load without changing editor scroll, generated preview, or navigation behavior.

## 3. Verification

- [x] 3.1 Run the targeted compiler preview regression test.
- [x] 3.2 Run `npm test`.
- [x] 3.3 Run `swift build`.
- [x] 3.4 Run `openspec validate --all --strict`.
- [x] 3.5 Run `git diff --check`.
- [x] 3.6 Run `npm run electron:package:mac`.
