## 1. Tests And Audit Contracts

- [x] 1.1 Add static Electron tests for bounded viewport CSS and hidden detail save/header chrome.
- [x] 1.2 Extend runtime audit evidence and assertions for project bounds and detail chrome visibility.

## 2. Renderer Shell Polish

- [x] 2.1 Constrain shell, project, detail, iframe, sidebar, and right-sidebar panes to the viewport with internal scrolling.
- [x] 2.2 Hide the non-native detail header while keeping save state, autosave, and keyboard save wiring intact.

## 3. Verification And Archive

- [x] 3.1 Run focused Electron tests and runtime audit.
- [x] 3.2 Run `npm test`, `swift build`, `openspec validate polish-electron-viewport-detail-chrome-parity --strict`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.3 Retain verification evidence, archive the OpenSpec change, and commit.
