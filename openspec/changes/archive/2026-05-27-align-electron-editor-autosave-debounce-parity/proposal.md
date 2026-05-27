## Why

The shared CodeMirror editor resource already debounces `contentChanged` messages before they reach either app. Native `EditorWebView` writes the received non-empty payload immediately, but Electron currently adds a second renderer debounce before saving, so edits persist later than the native macOS app.

## What Changes

- Update Electron editor content-change handling so the renderer saves after the shared editor bridge payload arrives instead of waiting through a second debounce window.
- Preserve the native empty-content guard, dirty-state tracking, save IPC path, markdown recompilation, and follow-up save behavior when a newer edit arrives during an in-flight save.
- Add source-backed regression coverage that proves native writes immediately on `contentChanged` and Electron no longer schedules an extra autosave from that handler.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-file-editing-save`: tighten editor autosave timing to match native `EditorWebView` after the shared editor bridge debounce.
- `electron-native-parity-roadmap`: record this autosave debounce parity correction as another completed migration slice after archive.

## Impact

- Affected Electron renderer: `apps/electron/src/renderer/renderer.js`.
- Affected tests: `apps/electron/test/file-editing-save.test.js`.
- Affected specs: `electron-file-editing-save`, `electron-native-parity-roadmap`.
- No new dependencies or IPC channels.
