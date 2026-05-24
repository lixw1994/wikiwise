## Why

Electron can now edit, save, compile, and preview wiki pages, but it still requires explicit renderer actions to notice project changes. Native Wikiwise watches the project folder: CSS edits refresh styling, markdown edits rescan and recompile relevant pages, add/delete events refresh the tree, and a `.rebuild` trigger forces a broader rebuild. This phase migrates that live rebuild loop so Electron keeps pace with disk changes and saved source changes like the macOS app.

## What Changes

- Add native-compatible watcher event classification and coalescing helpers in `@wikiwise/core`.
- Add Electron main-process project watcher lifecycle IPC using `fs.watch` with debounce and output-directory filtering.
- Add preload APIs for starting/stopping project watching and subscribing to project-change events.
- Extend renderer project state to start watching opened folders and react to CSS, markdown, structure, and `.rebuild` events.
- Allow compiler IPC to reload CSS and invalidate compiled pages when watcher events require it.

## Success Criteria

- Core tests prove watcher events are classified with native priority: ignore output, `.rebuild` first, structure next, then CSS/markdown content changes.
- Electron tests prove watcher IPC/preload APIs, debounce event sending, renderer subscription, tree refresh, current-page reload, and compile refresh hooks exist without launching Electron.
- Root `npm test` passes.
- `openspec validate migrate-electron-live-rebuild-watching --strict` passes.
- Swift source files remain untouched.
- Retained verification records implemented watching behavior and remaining native watcher gaps.

## Non-Goals

- No background drip compilation timer parity.
- No scroll preservation while reloading.
- No in-preview wikilink navigation handling.
- No CodeMirror editor migration.
- No scaffold/new wiki, publishing, terminal, menus, or packaging changes.

## Capabilities

### New Capabilities

- `electron-live-rebuild-watching`: Project watching, live rebuild event classification, and renderer refresh behavior in the Electron app.

### Modified Capabilities

- `wikiwise-core-package`: Add watcher event classification/coalescing helpers matching native FileWatcher behavior.
- `cross-platform-electron-workspace`: Add project watcher IPC and preload event subscription APIs while preserving renderer sandboxing.
- `electron-compiler-preview`: Add watcher-driven CSS reload and markdown invalidation refresh behavior.

## Impact

- Modifies `packages/wikiwise-core`.
- Modifies `apps/electron` main, preload, renderer, and tests.
- Adds OpenSpec artifacts and retained verification for the live rebuild watching phase.
- Does not modify Swift source or native release scripts.
