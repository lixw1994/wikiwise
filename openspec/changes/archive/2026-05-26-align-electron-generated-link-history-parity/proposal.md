## Why

Native SwiftUI only adds back-history when a generated page link is opened from a selected Markdown-backed page. Electron currently routes all generated-page preview links through the same generated-page display helper, which also pushes history when the current view is already generated.

## What Changes

- Align Electron generated-page link navigation with native `handleWikilink(_:)` history behavior.
- Preserve back-history when navigating from a selected Markdown page to a generated page.
- Avoid adding redundant generated-page history entries when a generated page links to another generated page.
- Keep toolbar-driven 3D map navigation history unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-preview-navigation-map-graph`: Refine generated-page link history semantics to match native selected-file-only history insertion.
- `electron-native-parity-roadmap`: Track this parity correction as a generated-page navigation history gap closure phase.

## Impact

- `apps/electron/src/renderer/renderer.js`
- Electron preview navigation tests
- OpenSpec preview navigation and native parity roadmap specs
