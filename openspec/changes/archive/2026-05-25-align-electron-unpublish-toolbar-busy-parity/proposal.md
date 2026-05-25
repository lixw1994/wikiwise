## Why

The native macOS app uses the same `isPublishing` busy state for publish and unpublish work, so the toolbar publish control becomes disabled and shows `PUBLISHING…` while an unpublish request is running. Electron currently tracks unpublish separately and does not immediately put the toolbar publish control into that native busy state.

## What Changes

- Treat an in-flight Electron unpublish as toolbar publish-control busy state.
- Show the native `PUBLISHING…` toolbar label and disable the toolbar publish control while unpublishing is in progress.
- Add parity coverage tying SwiftUI's shared `isPublishing` unpublish behavior to the Electron renderer state update.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-publishing`: tighten publish-control busy-state requirements to include the native unpublish lifecycle.

## Impact

- `apps/electron/src/renderer/renderer.js`
- `apps/electron/test/publishing.test.js`
- `openspec/specs/electron-publishing/spec.md`
