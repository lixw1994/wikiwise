## 1. Contracts

- [x] 1.1 Add failing native shell tests for Swift runtime icon behavior and Electron main-process icon wiring.

## 2. Implementation

- [x] 2.1 Add Electron main-process runtime icon resolution and macOS Dock icon setup.
- [x] 2.2 Pass the derived native icon image into the Electron main BrowserWindow configuration.

## 3. Verification

- [x] 3.1 Run the focused native shell test red/green.
- [x] 3.2 Run `npm test`, `swift build`, `npm run electron:audit:runtime`, `npm run electron:package:mac`, `openspec validate align-electron-runtime-app-icon --strict`, `openspec validate --all --strict`, and `git diff --check`.
- [x] 3.3 Archive the OpenSpec change and commit.
