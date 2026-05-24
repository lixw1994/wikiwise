## 1. Core And IPC

- [x] 1.1 Add a path-safe core helper for expanding one project directory with native filtering and ordering.
- [x] 1.2 Expose Electron main/preload IPC for expanding a directory inside the current project root.
- [x] 1.3 Add tests for core expansion and Electron IPC/preload contracts.

## 2. Renderer Tree Parity

- [x] 2.1 Replace the flat disabled-folder renderer tree with expandable nested rows, disclosure state, indentation, and folder metadata.
- [x] 2.2 Auto-expand top-level folders except `site` when opening, restoring, creating, or refreshing a project.
- [x] 2.3 Preserve compatible expanded folders across structure watcher refreshes.

## 3. Selection And Runtime Evidence

- [x] 3.1 Ensure nested file selection reuses existing read, compile, info, active-file, save, and history behavior.
- [x] 3.2 Extend the runtime audit to assert expanded folder evidence and nested file selection.
- [x] 3.3 Update OpenSpec roadmap tracking and retain verification evidence.

## 4. Verification

- [x] 4.1 Run focused Electron/core tests for file tree expansion.
- [x] 4.2 Run `npm test`, `npm run electron:audit:runtime`, `swift build`, `openspec validate migrate-electron-file-tree-expansion-parity --strict`, and `git diff --check`.
