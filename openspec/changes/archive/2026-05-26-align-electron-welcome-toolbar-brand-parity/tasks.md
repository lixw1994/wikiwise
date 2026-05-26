## 1. Contracts

- [x] 1.1 Add failing static tests for the Electron welcome toolbar brand markup and styles.
- [x] 1.2 Add failing runtime audit contract tests for welcome toolbar evidence and failure messages.

## 2. Implementation

- [x] 2.1 Add the welcome toolbar brand row to the Electron no-folder renderer markup.
- [x] 2.2 Style the welcome toolbar and centered welcome content to match the native SwiftUI toolbar/content layout.
- [x] 2.3 Extend runtime audit DOM evidence and assertions for welcome toolbar brand parity.

## 3. Verification

- [x] 3.1 Run red/green focused native shell and runtime audit tests.
- [x] 3.2 Run `npm test`, `swift build`, `npm run electron:audit:runtime`, `openspec validate align-electron-welcome-toolbar-brand-parity --strict`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.3 Archive the OpenSpec change and commit.
