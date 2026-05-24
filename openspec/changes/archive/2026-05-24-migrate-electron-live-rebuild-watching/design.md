## Context

Native Wikiwise uses `FileWatcher` backed by macOS FSEvents. It ignores generated output, coalesces rapid events, prioritizes `.rebuild`, then structure changes, then CSS/markdown content changes. `ContentView` reacts by rescanning compiler metadata, reloading CSS, recompiling the current page when affected, refreshing the file tree for structure changes, and deleting `.rebuild` after a rebuild trigger.

Electron already has compiler IPC, editable source saving, file tree scanning, and compiled preview rendering. This phase adds the filesystem event loop around those capabilities.

## Goals / Non-Goals

**Goals:**

- Keep filesystem watching in main process, not renderer.
- Match native event filtering and priority for `.rebuild`, structure, CSS, markdown, assets, and generated output.
- Debounce/coalesce rapid events before notifying renderer.
- Refresh file tree on structure/rebuild events.
- Refresh selected markdown content and/or compiled preview when watcher events affect it.

**Non-Goals:**

- No background drip compile timer parity yet.
- No scroll preservation during watcher refresh.
- No Playwright/runtime watcher QA in this phase.
- No CodeMirror parity.

## Decisions

- Implement pure event summary helpers in `@wikiwise/core` so native-like filtering is unit-testable without launching Electron.
- Use `fs.watch(projectRoot, { recursive: true })` in Electron main for the current macOS-focused development host, with retained verification noting deeper cross-platform watcher QA remains later.
- Store one watcher per renderer `webContents.id`; starting a new watcher closes the old one.
- Send watcher summaries over a preload event subscription named `onProjectChanged`.
- Extend `compilePage` payloads with `invalidate` and `reloadCSS` flags so renderer refresh requests can reuse the existing compiler IPC safely.

## Risks / Trade-offs

- Node `fs.watch` is not identical to FSEvents; unit tests cover classification and wiring, while deeper runtime/macOS QA remains later.
- Recursive watch behavior differs by platform; packaging/final parity phases need broader validation.
- Renderer must avoid overwriting unsaved drafts when an external markdown change arrives.
- CSS reload must refresh bundled CSS in the compiler context before recompiling.

## State Model

- **watching:** main process has an active watcher for the renderer/project root.
- **pending-events:** watcher has collected paths and debounce timer is active.
- **content-refresh:** CSS or markdown changes require selected-page refresh.
- **structure-refresh:** tree should be rescanned, compiler metadata refreshed later on demand.
- **rebuild-refresh:** `.rebuild` was triggered; current markdown preview and tree should refresh.

## Migration Plan

1. Write failing core tests for watcher classification and coalescing.
2. Implement `summarizeWatchEvents` and helpers in `@wikiwise/core`.
3. Write failing Electron structural tests for watcher IPC, preload subscription, main debounce sending, renderer start/refresh hooks, and compile refresh flags.
4. Implement main watcher lifecycle, debounce, summary sending, `.rebuild` deletion, and compile refresh flags.
5. Implement preload watcher APIs and project-change subscription cleanup.
6. Implement renderer watcher startup and event handling for content/structure/rebuild refresh.
7. Verify tests, OpenSpec, Swift source untouched, and retained evidence.

## Open Questions

- A later phase should add runtime watcher QA using a launched Electron app.
- Background drip compilation should be added after watcher refresh semantics are stable.
