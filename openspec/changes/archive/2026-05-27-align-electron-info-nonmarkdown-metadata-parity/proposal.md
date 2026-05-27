## Why

Native `RightSidebar` computes INFO tab metadata from any active `selectedFileURL`; it does not require the file to be Markdown. Electron currently skips document-info refresh for non-Markdown selections, so plain text, CSS, JSON, JS, HTML, and standalone text files show fallback metadata where native shows edited time, word count, directions, and wikilinks when present.

## What Changes

- Remove the renderer Markdown-only gate from document-info refresh.
- Refresh INFO metadata after saving any selected text/source file, not only Markdown files.
- Refresh INFO metadata after manual Refresh Page reloads a selected non-Markdown source file.
- Preserve existing Markdown document-info, fallback, tab, terminal, and sidebar behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-right-sidebar-terminal`: Selected-document INFO metadata now covers non-Markdown selected files and standalone text files like native.
- `electron-native-parity-roadmap`: Record this non-Markdown INFO metadata parity phase and its verification evidence.

## Impact

- Electron renderer document-info refresh and save/refresh call sites in `apps/electron/src/renderer/renderer.js`.
- Electron right-sidebar parity tests under `apps/electron/test/right-sidebar-terminal.test.js`.
- OpenSpec delta specs for right-sidebar metadata behavior and roadmap tracking.
