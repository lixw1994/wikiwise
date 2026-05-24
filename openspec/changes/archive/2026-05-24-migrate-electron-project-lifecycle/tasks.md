## 1. Core Project Helpers

- [x] 1.1 Add failing core tests for native-compatible file tree scanning and text reading.
- [x] 1.2 Implement `scanOneLevel` and `readTextFile` in `@wikiwise/core`.
- [x] 1.3 Verify `npm --prefix packages/wikiwise-core test` passes.

## 2. Electron Project Lifecycle

- [x] 2.1 Add failing Electron structural tests for lifecycle IPC, preload APIs, and renderer state hooks.
- [x] 2.2 Implement main-process lifecycle IPC handlers.
- [x] 2.3 Implement preload lifecycle APIs.
- [x] 2.4 Implement renderer welcome, open-existing, file tree, file selection, content display, and deferred feature messaging.
- [x] 2.5 Verify `npm --prefix apps/electron test` passes.

## 3. Workspace Validation

- [x] 3.1 Commit or stage npm lockfile as part of the reproducible Electron workspace state.
- [x] 3.2 Verify `npm test` passes.
- [x] 3.3 Verify `openspec validate migrate-electron-project-lifecycle --strict` passes.
- [x] 3.4 Verify Swift source files are untouched.
- [x] 3.5 Record retained verification evidence.
