## 1. Core File Writes

- [x] 1.1 Add failing core tests for UTF-8 text writes and `.claude/active-file` tracking.
- [x] 1.2 Implement `writeTextFile` and `writeActiveFile` in `@wikiwise/core`.
- [x] 1.3 Verify `npm --prefix packages/wikiwise-core test` passes.

## 2. Electron Save Flow

- [x] 2.1 Add failing Electron structural tests for save IPC, preload API, path safety, editable source mode, dirty state, save controls, keyboard save, debounce save, and preview refresh hooks.
- [x] 2.2 Implement main-process save IPC, project-root path validation, active-file tracking, and markdown save recompilation.
- [x] 2.3 Implement preload save API.
- [x] 2.4 Implement renderer editable source mode, dirty/saving state, save button, `Mod-S`, debounce save, and compiled preview refresh.
- [x] 2.5 Verify `npm --prefix apps/electron test` passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `openspec validate migrate-electron-file-editing-save --strict` passes.
- [x] 3.3 Verify Swift source files are untouched.
- [x] 3.4 Record retained verification evidence.
