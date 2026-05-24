## Why

Runtime audit evidence shows the Electron project shell can grow far beyond the window viewport, which is unlike the native SwiftUI window frame. The Electron detail pane also shows an extra file/save header that the native macOS app does not display, creating a visible mismatch around the editor and preview surface.

## What Changes

- Constrain the Electron project shell to the app viewport instead of allowing page-height expansion.
- Ensure sidebar, detail, preview, editor, and right-sidebar panes scroll internally like native split panes.
- Hide the non-native detail header containing selected filename, save status, and Save button while keeping autosave/manual save behavior available through existing state and shortcuts.
- Extend runtime audit assertions to fail when project layout exceeds the viewport or non-native detail chrome is visible.

## Capabilities

### New Capabilities
- `electron-viewport-detail-chrome-parity`: Covers fixed viewport shell behavior and native detail-pane chrome parity for the Electron app.

### Modified Capabilities
- `electron-native-parity-roadmap`: Records this visible shell/detail polish phase and remaining final gates.
- `electron-runtime-parity-audit`: Adds runtime evidence for bounded project layout and absence of non-native detail chrome.

## Impact

- `apps/electron/src/renderer/index.html`: Marks detail save/header chrome as non-visible.
- `apps/electron/src/renderer/renderer.js`: Keeps detail state updates working with hidden chrome.
- `apps/electron/src/renderer/styles.css`: Constrains shell/project pane height and internal scrolling.
- `scripts/audit-electron-runtime.mjs`: Captures and asserts bounded project layout and hidden detail chrome.
- Electron tests and OpenSpec specs document the parity contract.
