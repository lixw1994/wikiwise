## 1. Contracts

- [x] 1.1 Add static tests for right-sidebar resize handle markup, CSS variable layout, renderer drag state, and native clamps.
- [x] 1.2 Extend runtime audit contract tests for right-sidebar resize evidence.

## 2. Renderer Implementation

- [x] 2.1 Add a right-sidebar resize handle and native cursor styling.
- [x] 2.2 Implement renderer right-sidebar width state, pointer drag handling, min/max clamping, and CSS variable updates.
- [x] 2.3 Refit xterm and send terminal resize after sidebar width changes.

## 3. Runtime Evidence

- [x] 3.1 Extend runtime audit to simulate dragging the handle and assert width changes within native constraints.
- [x] 3.2 Retain report evidence for initial width, resized width, handle presence, and terminal resize after drag.

## 4. Verification

- [x] 4.1 Run focused Electron tests and runtime audit.
- [x] 4.2 Run `npm test`, `swift build`, `openspec validate migrate-electron-right-sidebar-resize-parity --strict`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 4.3 Archive the OpenSpec change and commit.
