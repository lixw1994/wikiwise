## 1. Electron Main Settings And Menu

- [x] 1.1 Add failing Electron structural tests for app settings persistence, appearance application, last-project restore, generated page IPC, menu template, and app command events.
- [x] 1.2 Implement main-process settings read/write, appearance application, last folder persistence, restore last project, generated page result, menu template, and command dispatch.
- [x] 1.3 Implement preload settings, restore, generated page, and app command APIs.
- [x] 1.4 Verify `npm --prefix apps/electron test` passes.

## 2. Renderer Toolbar, History, And Restore

- [x] 2.1 Add failing Electron structural tests for renderer toolbar state, history operations, startup restore, appearance cycling, map navigation, refresh command, and right-sidebar toggle.
- [x] 2.2 Implement renderer startup settings/restore, appearance state, app command listener, history stacks, generated page view state, map navigation, refresh, and sidebar toggle.
- [x] 2.3 Update renderer HTML/CSS for native-like project toolbar controls and generated page preview.
- [x] 2.4 Verify `npm --prefix apps/electron test` passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `openspec validate migrate-electron-chrome-menus-persistence --strict` passes.
- [x] 3.3 Verify Swift source files are untouched and `swift build` passes.
- [x] 3.4 Verify `git diff --check` passes.
- [x] 3.5 Record retained verification evidence.
