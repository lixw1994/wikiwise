## 1. Core Watch Event Summary

- [x] 1.1 Add failing core tests for output filtering, rebuild priority, structure priority, and CSS/markdown content summaries.
- [x] 1.2 Implement watcher classification/coalescing helpers in `@wikiwise/core`.
- [x] 1.3 Verify `npm --prefix packages/wikiwise-core test` passes.

## 2. Electron Watcher Flow

- [x] 2.1 Add failing Electron structural tests for watcher IPC, preload APIs, event subscription cleanup, debounce sending, compile refresh flags, renderer watcher startup, tree refresh, and current-page refresh.
- [x] 2.2 Implement main-process watcher lifecycle, debounce, `.rebuild` cleanup, and project-change event sending.
- [x] 2.3 Implement compile refresh flags for invalidation and CSS reload.
- [x] 2.4 Implement preload watcher APIs and project-change subscription.
- [x] 2.5 Implement renderer watcher startup and project-change refresh handling.
- [x] 2.6 Verify `npm --prefix apps/electron test` passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `openspec validate migrate-electron-live-rebuild-watching --strict` passes.
- [x] 3.3 Verify Swift source files are untouched.
- [x] 3.4 Record retained verification evidence.
