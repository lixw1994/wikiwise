## Why

The native SwiftUI app keeps the standard macOS menu set and only appends Wikiwise navigation commands through `CommandGroup(after: .newItem)`. Electron currently replaces the whole menu bar with a minimal App/File/View template, so standard App, Edit, and Window menu roles are missing.

## What Changes

- Expand the Electron application menu to preserve standard macOS App menu roles such as Services, Hide, Hide Others, Show All, and Quit.
- Add a standard Edit menu with Undo/Redo, clipboard, delete, and select-all roles.
- Add a standard Window menu with minimize, zoom, and bring-all-to-front roles.
- Preserve the existing File menu project commands and View fullscreen behavior.
- Extend source-level tests to verify native SwiftUI command preservation and Electron standard role coverage.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: add standard macOS menu role parity requirements around the existing File command group.
- `electron-native-parity-roadmap`: record the archived standard menu parity phase and remaining final release evidence.

## Impact

- Affects `apps/electron/src/main/main.js` application menu construction.
- Affects Electron chrome/menu tests and OpenSpec chrome/roadmap specs.
- Does not change renderer command handling, IPC channel names, project state, packaging metadata, or release scripts.
