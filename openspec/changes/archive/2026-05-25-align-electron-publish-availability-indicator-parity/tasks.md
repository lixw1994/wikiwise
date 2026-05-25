## 1. Regression Test

- [x] 1.1 Add publishing parity coverage for the native inline availability indicator states and 16x16 sizing.
- [x] 1.2 Run the targeted publishing test and confirm the new assertion fails for the current Electron renderer.

## 2. Electron Implementation

- [x] 2.1 Add the publish availability indicator markup to the subdomain row.
- [x] 2.2 Render availability indicator state and glyphs from the existing availability state.
- [x] 2.3 Add native-like indicator sizing and state colors in renderer styles.
- [x] 2.4 Re-run the targeted publishing test and confirm it passes.

## 3. Verification And Archive

- [x] 3.1 Run the full Electron test suite with `npm test`.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run `git diff --check`.
- [x] 3.5 Package the Electron macOS app with `npm run electron:package:mac`.
- [x] 3.6 Archive the OpenSpec change and re-run OpenSpec/diff validation.
