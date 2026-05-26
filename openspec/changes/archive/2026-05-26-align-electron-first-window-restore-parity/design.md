## Context

SwiftUI stores `ContentView.instanceCount` and sets `isFirstInstance` during `ContentView.init()`. `restoreLastFolder()` returns immediately for non-first instances, so only the first app window restores `lastFolderPath`. Electron has a renderer boot flow that always calls `window.wikiwise.restoreLastProject()`, and the main-process handler currently returns a restored project whenever settings contain a valid folder.

## Goals / Non-Goals

**Goals:**
- Mirror native restore scope: first Electron window may restore, later windows receive no project and keep welcome visible.
- Keep restore ownership in the main process where BrowserWindow/webContents identity is available.
- Preserve the existing renderer boot flow and settings storage.

**Non-Goals:**
- Add multi-window creation UI or a new Window menu.
- Change persisted settings, restore project shape, or open/create project behavior.
- Claim release completion; signed/notarized release evidence remains separately blocked by Apple credentials.

## Decisions

- Track a main-process `mainWindowCreationCount` and a `startupRestoreByWebContentsId` map. The first created window gets `true`; later windows get `false`.
- Route `wikiwise:restoreLastProject` through a sender-aware helper. If the sender is not authorized for startup restore, return `null` just like the missing-path welcome state.
- Delete each webContents restore entry on destruction to avoid stale state.
- Keep renderer code unchanged: it already treats a falsy restore result as “stay on welcome.”

## Risks / Trade-offs

- Static tests cannot create real second windows by themselves → require source-level coverage for the native Swift guard and Electron window-creation map, plus the existing runtime audit for first-window restore.
- A future explicit multi-window command could need richer startup context → the main-process map keeps the policy local and easy to extend.
