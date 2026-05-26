## 1. Regression Coverage

- [x] 1.1 Add macOS packaging coverage for native absence of template build-provenance/category plist metadata.
- [x] 1.2 Run the focused macOS packaging test and confirm the new assertion fails against the current package script.

## 2. Implementation

- [x] 2.1 Update the Electron macOS package script to strip non-runtime template build-provenance/category plist metadata.
- [x] 2.2 Re-run the focused macOS packaging test and confirm it passes.

## 3. Package Inspection

- [x] 3.1 Run `npm run electron:package:mac`.
- [x] 3.2 Inspect `apps/electron/out/Wikiwise.app/Contents/Info.plist` and confirm stripped keys are absent while runtime-required keys remain.

## 4. Verification And Archive

- [x] 4.1 Run `npm test`.
- [x] 4.2 Run `swift build`.
- [x] 4.3 Run `openspec validate strip-electron-template-build-plist-metadata --strict`.
- [x] 4.4 Run `openspec validate --all --strict`.
- [x] 4.5 Run `git diff --check`.
- [x] 4.6 Run `npm run electron:audit:runtime`.
- [x] 4.7 Archive the OpenSpec change with retained verification evidence.
