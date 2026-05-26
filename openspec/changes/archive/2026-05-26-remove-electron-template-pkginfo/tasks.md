## 1. Regression Coverage

- [x] 1.1 Add macOS packaging coverage for removing the unused Electron template `PkgInfo` while retaining required package files.
- [x] 1.2 Run the focused macOS packaging test and confirm the new assertion fails against the current package script.

## 2. Implementation

- [x] 2.1 Update the Electron macOS package script to remove the inherited `Contents/PkgInfo` file after copying the Electron template.
- [x] 2.2 Re-run the focused macOS packaging test and confirm it passes.

## 3. Package Inspection

- [x] 3.1 Run `npm run electron:package:mac`.
- [x] 3.2 Inspect native and packaged app contents to confirm `Contents/PkgInfo` is absent while `Info.plist`, `MacOS/Wikiwise`, `Resources/Wikiwise.icns`, and `Resources/default_app.asar` remain where expected.

## 4. Verification And Archive

- [x] 4.1 Run `npm test`.
- [x] 4.2 Run `swift build`.
- [x] 4.3 Run `openspec validate remove-electron-template-pkginfo --strict`.
- [x] 4.4 Run `openspec validate --all --strict`.
- [x] 4.5 Run `git diff --check`.
- [x] 4.6 Run `npm run electron:audit:runtime`.
- [x] 4.7 Archive the OpenSpec change with retained verification evidence.
