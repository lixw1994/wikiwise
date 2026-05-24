## Why

The native SwiftUI app lets users collapse the left file sidebar and restore it from the toolbar. The Electron app currently keeps the file tree fixed at 260px, so the editing/preview area cannot reclaim that space like the macOS version.

## What Changes

- Add an Electron toolbar control for hiding and showing the left file sidebar.
- Preserve the open project, selected file, expanded tree state, detail mode, right sidebar state, and terminal session while the left sidebar is hidden.
- Update the project grid dynamically so the detail area expands when the left sidebar is hidden.
- Extend runtime audit evidence to prove left-sidebar hide/show behavior without viewport overflow.

## Capabilities

### New Capabilities

- `electron-left-sidebar-visibility-parity`: Covers Electron left file sidebar hide/show behavior and layout parity with the native macOS NavigationSplitView sidebar.

### Modified Capabilities

- `electron-native-parity-roadmap`: Records left-sidebar visibility parity as a native interaction gap closure phase.
- `electron-file-tree-expansion-parity`: Extends the file tree surface to remain stateful across sidebar visibility changes.
- `electron-runtime-parity-audit`: Adds runtime evidence that the left sidebar can hide and restore while project detail remains usable.

## Impact

- `apps/electron/src/renderer/index.html`: Adds a toolbar control for left-sidebar visibility.
- `apps/electron/src/renderer/renderer.js`: Tracks left-sidebar visibility and preserves file tree/detail state across toggles.
- `apps/electron/src/renderer/styles.css`: Adds project grid states for hidden left sidebar.
- `scripts/audit-electron-runtime.mjs`: Captures left-sidebar hide/show evidence.
- Electron tests and OpenSpec specs document and verify the interaction.
