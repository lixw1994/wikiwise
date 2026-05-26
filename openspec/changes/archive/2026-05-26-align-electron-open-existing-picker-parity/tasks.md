## 1. Regression Coverage

- [x] 1.1 Add a project-lifecycle test that compares the native SwiftUI open panel contract with the Electron open-existing dialog filter contract.
- [x] 1.2 Run the focused project-lifecycle test and confirm the new assertion fails against the current broad Electron filters.

## 2. Implementation

- [x] 2.1 Update the Electron main-process open-existing dialog to use markdown/plain-text file filters and remove broad code/web/all-file filters.
- [x] 2.2 Re-run the focused project-lifecycle test and confirm it passes.

## 3. Verification And Archive

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run `openspec validate align-electron-open-existing-picker-parity --strict`.
- [x] 3.4 Run `openspec validate --all --strict`.
- [x] 3.5 Run `git diff --check`.
- [x] 3.6 Run `npm run electron:package:mac`.
- [x] 3.7 Run `npm run electron:audit:runtime`.
- [x] 3.8 Archive the OpenSpec change with retained verification evidence.
