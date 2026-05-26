## Context

SwiftUI `WindowGroup` provides the standard New Window command in the File menu. Wikiwise adds Go Back, Go Forward, and Refresh Page after `.newItem`, so the native menu keeps New Window before those custom navigation commands. Electron already has `createMainWindow()` and first-window-only restore tracking, but the File menu has no New Window item.

## Goals / Non-Goals

**Goals:**

- Add a File > New Window command that creates a new Electron BrowserWindow.
- Use the existing `createMainWindow()` path so window geometry, titlebar chrome, preload, app icon, and first-window restore tracking remain consistent.
- Keep the existing first-window restore rule: the new window is a later window and therefore opens to welcome unless the user explicitly opens a project.
- Preserve existing File, Edit, View, and Window menu roles and commands.

**Non-Goals:**

- Change native SwiftUI code.
- Add new renderer IPC for window creation.
- Change startup restore persistence, project opening, release packaging, signing, or notarization.

## Decisions

- Wire the menu item directly to `createMainWindow()`.
  - Rationale: New Window is a main-process window command and does not need to round-trip through renderer app-command IPC.
  - Alternative considered: send a renderer command and let the focused renderer ask for a new window. That adds needless IPC and would not match Electron's main-process ownership of windows.
- Place New Window at the top of the File menu with `CommandOrControl+N`.
  - Rationale: This mirrors the standard native File menu new-item group before Wikiwise-specific open/navigation commands.
  - Alternative considered: put New Window in the Window menu. Native SwiftUI `WindowGroup` exposes this through the File new-item group, so Window menu placement would be weaker parity.
- Reuse existing first-window restore tests.
  - Rationale: `createMainWindow()` already increments `mainWindowCreationCount`, so adding a menu caller should preserve later-window welcome behavior without new state.

## Risks / Trade-offs

- [Risk] The File menu now has both New Window and Open Existing Folder commands. -> Mitigation: existing Open Existing behavior is preserved; this change only restores the missing native standard new-window command.
- [Risk] A future refactor could route New Window through renderer IPC and accidentally restore persisted projects in later windows. -> Mitigation: source tests will assert the File menu calls `createMainWindow()` and retains startup restore gating.
