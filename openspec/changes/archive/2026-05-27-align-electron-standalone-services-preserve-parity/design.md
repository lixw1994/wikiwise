## Context

Native folder opens explicitly invalidate `backgroundTimer`, stop `fileWatcher`, replace `rootURL`, create a new `Compiler`, start background compilation, and start a file watcher. The standalone-file branch does only `rootURL = url.deletingLastPathComponent()`, `tree = []`, `selectedFileURL = url`, and `loadFile(url)`. It does not stop the previous watcher, invalidate the background timer, or clear `compiler`.

Electron currently clears window project-root ownership for standalone files in the main process and stops the watcher from the renderer standalone branch. That makes standalone file opens a stronger teardown boundary than native.

## Goals / Non-Goals

**Goals:**
- Preserve an already running folder watcher and background compilation job when opening a standalone file after a folder.
- Avoid starting watcher/background services for the standalone file's parent directory.
- Preserve folder-open replacement behavior and window-destroyed cleanup for watchers/background jobs.

**Non-Goals:**
- Change standalone file tree, selected-file display, detail mode, publishing availability, terminal preservation, or active-file behavior.
- Route old watcher events into the standalone file view.
- Add a user-visible project-close/reset action.

## Decisions

- Only register `projectRootsByWebContents` and start background compilation for directory project results. For file project results, leave existing window project-root ownership untouched so the previous folder background job remains owned by the window until another folder replaces it or the window closes.
- Move renderer watcher cleanup/stop behavior behind the folder-project branch. Standalone project results return without removing the existing project-change listener or asking the main process to stop the watcher.
- Keep `handleProjectChanged` filtering by `change.projectRoot !== state.currentProject.projectRoot`. If an old folder watcher emits while a standalone file is active, the renderer ignores it because the active standalone parent path differs from the old folder root.

## Risks / Trade-offs

- Old folder services can continue briefly while a standalone file is selected -> This mirrors the current SwiftUI behavior and remains window-scoped for cleanup.
- Preserved old watcher events may arrive while standalone state is active -> Existing project-root filtering prevents UI changes for mismatched roots.
- If a user expects opening a standalone file to close the old project, this keeps native behavior instead of introducing a new close-project concept.
