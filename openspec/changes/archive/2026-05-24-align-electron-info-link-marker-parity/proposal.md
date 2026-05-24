## Why

The native macOS INFO sidebar renders linked wikilink targets with a north-east arrow marker (`↗ target`). Electron currently renders linked targets with ASCII `-> target`, creating a small but visible mismatch in the right sidebar.

## What Changes

- Change Electron INFO linked target rows to use the native `↗` marker.
- Add a source test tying Electron's marker to the SwiftUI `RightSidebar` implementation.
- Preserve existing LINKED section visibility, ordering, and wikilink target data.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: INFO tab linked targets must use the native linked marker.

## Impact

- Affects `apps/electron/src/renderer/renderer.js`.
- Updates right sidebar Electron tests and OpenSpec right-sidebar requirements.
- No IPC, main process, preload, or package changes are required.
