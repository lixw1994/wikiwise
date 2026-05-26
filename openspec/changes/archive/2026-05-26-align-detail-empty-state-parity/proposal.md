## Why

The native macOS detail pane shows a centered empty state when there is no selected file and no generated page: a `doc.text` symbol above `Select a file to read`. Electron currently hides the editor, preview, generated preview, and post-create guide in that state without rendering the native placeholder, leaving the detail pane visually blank.

## What Changes

- Add an Electron detail empty-state surface that mirrors the native `doc.text` placeholder and copy.
- Toggle the empty state only when no guide, generated page, or selected file is active.
- Preserve existing editor, preview, generated-page, post-create guide, save wiring, toolbar, and right-sidebar behavior.
- Add source parity coverage tying the Electron markup, CSS, and renderer toggle to the SwiftUI detail empty-state source.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-viewport-detail-chrome-parity`: require the Electron detail pane to render the native empty-state placeholder when no detail content is selected.

## Impact

- Affected Electron renderer HTML/CSS/JS: `apps/electron/src/renderer/index.html`, `apps/electron/src/renderer/styles.css`, `apps/electron/src/renderer/renderer.js`.
- Affected parity tests: `apps/electron/test/native-shell-parity.test.js`.
- No IPC, compiler, file tree, save, packaging, or Swift runtime changes.
