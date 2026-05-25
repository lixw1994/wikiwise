## 1. Parity Coverage

- [x] 1.1 Add a renderer parity test proving the native new-wiki field labels use `Color.sidebarText` and Electron scopes the labels to `--color-sidebar-text`.
- [x] 1.2 Run the targeted new-wiki scaffold test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Scope the new-wiki field label color to the Electron sidebar text token while preserving existing new-wiki label typography.
- [x] 2.2 Re-run the targeted new-wiki scaffold test and confirm it passes.

## 3. Verification

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run `git diff --check`.
- [x] 3.5 Run `npm run electron:package:mac`.
