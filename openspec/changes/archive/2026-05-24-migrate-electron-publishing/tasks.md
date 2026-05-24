## 1. Core Publishing Helpers

- [x] 1.1 Add failing core tests for publish config loading, malformed config rejection, random subdomains, availability mapping, upload payload rewrites, error mapping, and unpublish cleanup.
- [x] 1.2 Implement native-compatible publishing helpers in `@wikiwise/core`.
- [x] 1.3 Verify `npm --prefix packages/wikiwise-core test` passes.

## 2. Electron Publishing IPC

- [x] 2.1 Add failing Electron structural tests for publish config IPC, availability IPC, publish IPC, unpublish IPC, preload APIs, and renderer publish state.
- [x] 2.2 Implement main-process publish config, availability, publish, and unpublish handlers.
- [x] 2.3 Implement preload publishing APIs.
- [x] 2.4 Verify `npm --prefix apps/electron test` passes.

## 3. Electron Publishing UI

- [x] 3.1 Add failing Electron structural tests for publish button, dialog, availability states, publish result/error display, unpublish confirmation, and disabled/busy states.
- [x] 3.2 Implement renderer publish state, dialog flow, availability debounce, publish/update, unpublish, and config refresh.
- [x] 3.3 Update renderer HTML/CSS for publish controls and dialog.
- [x] 3.4 Verify `npm --prefix apps/electron test` passes.

## 4. Validation

- [x] 4.1 Verify `npm test` passes.
- [x] 4.2 Verify `openspec validate migrate-electron-publishing --strict` passes.
- [x] 4.3 Verify Swift source files are untouched and `swift build` passes.
- [x] 4.4 Verify `git diff --check` passes.
- [x] 4.5 Record retained verification evidence.
