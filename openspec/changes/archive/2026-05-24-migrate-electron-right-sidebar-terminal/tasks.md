## 1. Core Document Info

- [x] 1.1 Add failing core tests for word count, directions frontmatter, unique wikilinks, modified timestamp, and missing-file rejection.
- [x] 1.2 Implement native-compatible document info helpers in `@wikiwise/core`.
- [x] 1.3 Verify `npm --prefix packages/wikiwise-core test` passes.

## 2. Electron Right Sidebar And Terminal

- [x] 2.1 Add failing Electron structural tests for document info IPC, terminal IPC, preload APIs, output subscription cleanup, right sidebar tabs, INFO rendering, terminal startup, and command input.
- [x] 2.2 Implement main-process document info IPC with project path validation.
- [x] 2.3 Implement main-process terminal lifecycle, input, output event sending, and cleanup.
- [x] 2.4 Implement preload document info and terminal APIs.
- [x] 2.5 Implement renderer right sidebar layout, INFO tab refresh, terminal tab transcript/input, and project service startup.
- [x] 2.6 Update renderer HTML/CSS for right sidebar, INFO, and TERMINAL surfaces.
- [x] 2.7 Verify `npm --prefix apps/electron test` passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `openspec validate migrate-electron-right-sidebar-terminal --strict` passes.
- [x] 3.3 Verify Swift source files are untouched and `swift build` passes.
- [x] 3.4 Verify `git diff --check` passes.
- [x] 3.5 Record retained verification evidence.
