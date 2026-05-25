## Why

SwiftUI renders the opened-project FILE/WIKI toolbar mode buttons without disabled gating; changing modes updates state, and the detail view decides whether to show the compiled preview or fall back to the editor. Electron currently disables those buttons when a generated page is shown, no file is selected, or compiled preview is unavailable, which is a visible toolbar interaction difference.

## What Changes

- Keep Electron FILE/WIKI mode switch controls enabled like the native toolbar.
- Preserve compiled-preview fallback behavior by showing the source editor when Wiki mode is selected but no compiled preview exists.
- Align mode selected state with the chosen mode even when Wiki falls back to source editing.
- Preserve mode labels, segmented styling, click handlers, and generated page rendering.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: Add native enabled-state parity for FILE/WIKI toolbar mode controls.

## Impact

- Affected code: `apps/electron/src/renderer/index.html`, `apps/electron/src/renderer/renderer.js`
- Affected tests: `apps/electron/test/chrome-menus-persistence.test.js`
- No API, dependency, persistence, packaging, or Swift runtime behavior changes.
