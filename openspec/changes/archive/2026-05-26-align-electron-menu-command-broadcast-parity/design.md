## Context

Native Wikiwise defines Go Back, Go Forward, and Refresh Page in `WikiwiseApp.commands`. Each button posts a `NotificationCenter` notification with `object: nil`. Each `ContentView` registers `.onReceive` handlers for those notifications, so every live view instance receives the command.

Electron currently implements `sendAppCommand(command)` by choosing `BrowserWindow.getFocusedWindow()` or the first available window. That is appropriate for Electron-specific commands that open a dialog, but it does not match the native broadcast behavior for the custom navigation/refresh commands.

## Goals / Non-Goals

**Goals:**

- Match native multi-window dispatch for Go Back, Go Forward, and Refresh Page.
- Preserve existing renderer command handling and per-window history behavior.
- Keep Open Existing Folder targeted to one window.

**Non-Goals:**

- Do not change toolbar button behavior; toolbar actions remain local to their window.
- Do not change New Window creation, startup restore scope, or first-window restore behavior.
- Do not add cross-window shared navigation state.

## Decisions

- Add an explicit allowlist for native broadcast app commands: `goBack`, `goForward`, and `refreshWiki`.
  - Rationale: These are the commands with direct native `NotificationCenter` evidence.
  - Alternative considered: Broadcast every app command. Rejected because `openExisting` would open multiple dialogs and has no matching native menu command evidence.

- Keep renderer behavior unchanged and broadcast only from the main process.
  - Rationale: The native difference is command delivery scope, not how a view responds after receiving a command.

## Risks / Trade-offs

- Broadcast commands can affect background windows with their own histories.
  - Mitigation: This matches the native implementation; windows with no relevant state already no-op through existing renderer guards.

- Future menu commands might accidentally inherit the wrong dispatch behavior.
  - Mitigation: Use an allowlist and add tests that Open Existing Folder remains on the targeted path.
