## Why

The native right sidebar still renders `ABOUT THIS DOCUMENT` for a selected file when metadata reads fail, using `—` for EDITED or WORDS and hiding optional sections. Electron currently blanks those values when document-info IPC returns no metadata, and surfaces the failure through the generic shell error message.

## What Changes

- Align Electron INFO metadata fallback behavior with native `RightSidebar` helper fallbacks.
- Render selected-file PATH while showing `—` for missing EDITED or WORDS metadata.
- Keep DIRECTIONS and LINKED optional sections hidden when metadata is unavailable.
- Treat document-info refresh failures as quiet metadata misses instead of visible generic shell errors.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-right-sidebar-terminal`: INFO metadata rows must use native em-dash fallback behavior when selected-document metadata is unavailable.
- `electron-native-parity-roadmap`: Record this right-sidebar metadata fallback parity slice when archived.

## Impact

- Affects `apps/electron/src/renderer/renderer.js` INFO rendering and document-info refresh error handling.
- Adds renderer source tests against native `RightSidebar` fallback behavior.
- Updates OpenSpec requirements and retained roadmap evidence.
