## 1. Contracts

- [x] 1.1 Add static tests for left-sidebar toolbar control markup, renderer visibility state, and CSS grid hidden state.
- [x] 1.2 Extend runtime audit contract tests for left-sidebar visibility evidence.

## 2. Renderer Implementation

- [x] 2.1 Add a left-sidebar toolbar control and accessible state.
- [x] 2.2 Implement renderer left-sidebar visibility state, class toggling, and layout updates.
- [x] 2.3 Preserve selected file, expanded tree, detail mode, right-sidebar state, and terminal mount across hide/show.

## 3. Runtime Evidence

- [x] 3.1 Extend runtime audit to hide and restore the left sidebar in opened-project scenarios.
- [x] 3.2 Retain report evidence for sidebar initial/hidden/restored visibility, detail width expansion, and tree selection after restore.

## 4. Verification

- [x] 4.1 Run focused Electron tests and runtime audit.
- [x] 4.2 Run `npm test`, `swift build`, `openspec validate migrate-electron-left-sidebar-visibility-parity --strict`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 4.3 Archive the OpenSpec change and commit.
