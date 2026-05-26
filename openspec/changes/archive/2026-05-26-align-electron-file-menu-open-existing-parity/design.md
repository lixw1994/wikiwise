## Context

The native SwiftUI app exposes the open-existing action on the welcome screen and implements the picker in `ContentView.openFolder()`. Its visible app command group in `WikiwiseApp.swift` adds Go Back, Go Forward, and Refresh Page after the native New Window command, but it does not add an Open Existing Folder File-menu command. Electron currently has both the welcome action and a File-menu Open Existing Folder command, which makes the menu surface broader than native.

## Goals / Non-Goals

**Goals:**

- Match the current native File-menu command surface by removing the extra Electron Open Existing Folder menu item.
- Keep the welcome screen open-existing action, picker IPC, and folder/file open behavior unchanged.
- Preserve New Window, Go Back, Go Forward, Refresh Page, and Close menu behavior.

**Non-Goals:**

- Do not remove the open-existing picker API used by the welcome screen.
- Do not add a new native Swift command.
- Do not change project lifecycle, startup restore, or picker filters.

## Decisions

- Remove only the application menu item and its menu-driven `openExisting` command path. This is the narrow visible parity correction.
- Keep `window.wikiwise.openExisting()` and renderer `openExisting()` because the welcome screen still uses them and native also exposes Open Existing Folder there.
- Update tests to inspect the Swift command source and assert that the Electron File menu mirrors the visible command group rather than relying on the older Open Existing menu requirement.

## Risks / Trade-offs

- [Risk] Users lose a convenient shortcut that Electron previously had. -> Mitigation: this migration is optimizing for exact native parity, and the native app currently exposes Open Existing Folder from the welcome screen, not as a File-menu command.
- [Risk] Dead app-command handling remains after removing the menu item. -> Mitigation: remove the renderer app-command branch only if tests prove no remaining sender needs it; keep the picker IPC for welcome.
