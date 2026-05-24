## Why

The native SwiftUI app lets users resize the right sidebar by dragging a 5px transparent handle on its left edge. The Electron app currently uses a fixed 360px right sidebar, so terminal/info space cannot be adjusted like the macOS version.

## What Changes

- Add a draggable right-sidebar resize handle to the Electron project shell.
- Match the native width rules: default 360px, minimum 200px, and maximum half of the project viewport.
- Update the project grid dynamically while the right sidebar is visible.
- Refit xterm and send terminal resize evidence after width changes.
- Extend runtime audit evidence to prove the sidebar can be resized and remains clamped.

## Capabilities

### New Capabilities
- `electron-right-sidebar-resize-parity`: Covers Electron right-sidebar drag resizing behavior and native width constraints.

### Modified Capabilities
- `electron-native-parity-roadmap`: Records right-sidebar resize parity as a native interaction gap closure phase.
- `electron-runtime-parity-audit`: Adds runtime evidence that the right sidebar can resize and the terminal responds.
- `electron-right-sidebar-terminal`: Extends the right-sidebar surface to include native resize behavior.

## Impact

- `apps/electron/src/renderer/index.html`: Adds the resize handle to the right sidebar.
- `apps/electron/src/renderer/renderer.js`: Tracks sidebar width, pointer drag state, width clamps, and terminal refit after resize.
- `apps/electron/src/renderer/styles.css`: Adds dynamic grid width and cursor/handle styling.
- `scripts/audit-electron-runtime.mjs`: Captures resize evidence.
- Electron tests and OpenSpec specs document and verify the interaction.
