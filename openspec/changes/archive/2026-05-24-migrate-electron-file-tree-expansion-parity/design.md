## Context

The SwiftUI app renders `FileNode` values as a lazy project browser: project open scans one level, top-level folders except `site/` are expanded immediately, nested folders load children when disclosed, and selecting any visible nested file goes through the same editor, preview, history, right-sidebar info, and `.claude/active-file` path as top-level selection.

The Electron app already shares the core scanner and selection pipeline, but the renderer currently disables directory rows and only shows the first scan level. The gap is user-visible and blocks practical parity for normal Wikiwise projects where editable pages live under `wiki/` and source material often lives under nested directories.

## Goals / Non-Goals

**Goals:**
- Render an expandable nested tree in Electron with native ordering, filtering, and default expansion behavior.
- Keep scanning lazy and project-root constrained.
- Reuse existing file selection, save, preview, document-info, terminal, watcher, and history behavior for nested files.
- Add tests and runtime audit evidence proving default expansion and nested file selection.

**Non-Goals:**
- Add file creation, rename, drag/drop, context menus, or recursive eager scanning.
- Change the SwiftUI app.
- Change compiler output rules, publishing behavior, or release signing.

## Decisions

1. Add a core helper for expanding one directory node.

   The existing `scanOneLevel()` already matches native ordering and filtering. A small `expandTreeDirectory(rootPath, directoryPath)` helper can validate the requested directory is inside the project, scan only that directory, and return children. This keeps the sorting contract in one package instead of duplicating it in Electron main.

   Alternative considered: let the renderer call `scanProject(directoryPath)` directly. That would be simple, but it does not carry the project root and would make path containment weaker than the rest of the Electron bridge.

2. Add a dedicated Electron IPC for tree expansion.

   `wikiwise:expandTreeDirectory` will accept `{ projectRoot, directoryPath }`, validate both, and return children. This mirrors the native lazy expansion model while keeping renderer filesystem access closed.

   Alternative considered: return a fully recursive tree from `createProjectResult`. That would simplify renderer state but diverge from native lazy loading and could make large projects expensive to open.

3. Keep expansion state in renderer nodes.

   The renderer will maintain expanded folder paths and update a node's `children` when a folder is expanded. On project open, it will automatically expand top-level folders except `site/`, matching native behavior. Watcher structure refreshes will rescan the project and re-apply surviving expanded folders.

   Alternative considered: keep expansion state in main process. That would make multiple windows harder to reason about and would not match the SwiftUI per-window state model.

## Risks / Trade-offs

- [Risk] Expanded folders may become stale after file moves or deletes. → Re-apply expansion after structure watcher events and drop expansions for missing folders.
- [Risk] Concurrent expansion clicks can race. → Store per-folder loading state and ignore duplicate expansion requests while a folder is already loading.
- [Risk] Deep trees can create excessive DOM. → Continue lazy-loading only expanded branches.
- [Risk] Runtime audit might only prove a happy path. → Add static tests for API/renderer contracts and runtime evidence for expanded `wiki/` plus nested `home.md` selection.

## Migration Plan

1. Add the path-safe core expansion helper and unit tests.
2. Expose Electron main/preload expansion IPC.
3. Render expandable nested tree rows with default top-level expansion.
4. Re-apply expansion on structure watcher refreshes and project restore/open.
5. Extend runtime audit and specs, then archive the change after verification.

Rollback is contained: removing the new IPC and renderer expansion code returns the app to the current flat one-level tree without affecting saved projects or project files.

## Open Questions

None for this phase.
