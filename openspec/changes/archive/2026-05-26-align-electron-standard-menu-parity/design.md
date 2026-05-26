## Context

SwiftUI keeps the platform's default application menus unless an app explicitly replaces command groups. Wikiwise only adds Go Back, Go Forward, and Refresh Page after the default File/New command group. Electron builds a full custom menu template, so it must explicitly include standard macOS roles that SwiftUI retains automatically.

## Goals / Non-Goals

**Goals:**
- Restore standard macOS App menu roles around the existing About/Quit items.
- Add a standard Edit menu so clipboard and text-editing menu commands are present at the app shell level.
- Add a standard Window menu so minimize, zoom, and bring-all-to-front behavior is available from the menu bar.
- Preserve existing File menu Wikiwise commands and View fullscreen behavior.

**Non-Goals:**
- Add new renderer app commands or change existing command IPC.
- Change toolbar behavior, keyboard shortcuts, text editor internals, or terminal input handling.
- Remove the existing Open Existing Folder menu entry.
- Claim final release completion; signed/notarized release evidence remains credential-gated.

## Decisions

- Keep `createApplicationMenu()` as the only menu construction point in `apps/electron/src/main/main.js`.
- Expand the darwin app menu with Electron standard roles: `about`, `services`, `hide`, `hideOthers`, `unhide`, and `quit`.
- Add an Edit menu using Electron roles for undo/redo, cut/copy/paste, paste-and-match-style, delete, and select-all. These roles delegate to the focused native/web contents surface and do not require renderer IPC.
- Add a Window menu with `minimize`, `zoom`, and `front` roles to match standard macOS window affordances.
- Keep the File menu order and accelerators that route to Wikiwise renderer commands, because those are the custom commands the native SwiftUI app adds through `CommandGroup`.

## Risks / Trade-offs

- Static source tests cannot inspect the live macOS menu bar. Mitigation: assert native SwiftUI command behavior and Electron role coverage, then include package/build/runtime verification in the normal gate.
- Some Electron roles are macOS-oriented. Mitigation: the richer App menu remains darwin-only while Edit/Window roles are standard Electron menu roles and harmless in local packaging.
- Future menu customization may need more exact default SwiftUI mirroring. Mitigation: keep standard roles explicit and covered by tests so later changes have a clear baseline.
