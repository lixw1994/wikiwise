## Context

SwiftUI owns the active compiler timer and file watcher inside `ContentView`; `onDisappear` invalidates the timer and stops the watcher, and opening a different folder repeats that teardown before starting new project services. Electron currently owns project watchers and PTY sessions per webContents, while background compilation jobs are keyed only by project root. That means a project root can keep compiling after the window that opened it is gone or after the same window switches to another project shape.

## Goals / Non-Goals

**Goals:**
- Mirror native view disappearance cleanup for Electron window-owned watcher, background compilation, and terminal resources.
- Stop background compilation for the previous directory-backed project when a window opens a different folder or standalone file.
- Keep cleanup in the main process, where BrowserWindow/webContents identity, filesystem watchers, timers, and PTY sessions are owned.
- Preserve existing renderer IPC names and project result payloads.

**Non-Goals:**
- Change compiler batching cadence, invalidation semantics, or watcher event coalescing.
- Add renderer-side resource ownership or Node filesystem access.
- Change terminal UI, xterm behavior, or project restore policy beyond cleaning stale per-window state.
- Claim release completion; signed/notarized release evidence remains blocked by Apple credentials.

## Decisions

- Add a `projectRootsByWebContents` map in `apps/electron/src/main/main.js`. This gives background compilation the same window ownership model already used by watchers and terminal sessions without changing project result payloads.
- Route all folder-backed project result creation through a sender-aware helper. When a webContents opens a new folder, the helper stops the previous root's background job if it differs; when it opens a standalone file, it clears the root and stops the previous job.
- Keep `startBackgroundCompilation(projectRoot)` project-root keyed. The scheduler still prevents duplicate jobs for the same root, while the new webContents map decides when a window no longer owns that root.
- Add a `closeWindowScopedResources(webContentsId)` helper called from `mainWindow.webContents.once("destroyed")`. It closes the watcher, stops background compilation for the remembered project root, stops the terminal, and then removes startup restore eligibility.
- Leave renderer `beforeunload` cleanup as best-effort UI cleanup only. Main-process destruction is the authoritative lifecycle boundary, matching native `onDisappear`.

## Risks / Trade-offs

- Static tests cannot observe real leaked timers or PTY processes. Mitigation: assert the native Swift cleanup source and Electron source wiring, then keep runtime audit/package validation in the verification set.
- Multiple windows can theoretically open the same project root. Stopping the root-scoped background job when one window leaves may stop work another window could still benefit from. Mitigation: this matches the existing root-scoped scheduler and native single-view ownership model; watcher events or project opens restart background work as needed.
- Future multi-window project sharing may need reference-counted background jobs. Mitigation: the new map centralizes ownership so it can be upgraded without changing renderer IPC.

