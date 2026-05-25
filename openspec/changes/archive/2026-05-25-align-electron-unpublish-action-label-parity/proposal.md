## Why

The native macOS unpublish confirmation keeps its destructive action labeled `Unpublish`. The Electron confirmation currently changes that button to `Unpublishing` while the request is in flight, which creates a visible parity mismatch in the confirmation surface.

## What Changes

- Keep the Electron unpublish confirmation destructive action labeled `Unpublish` while unpublishing is in progress.
- Preserve the existing disabled state while the unpublish request is running.
- Add source-level parity coverage comparing the SwiftUI alert action with the Electron renderer.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-publishing`: tighten the unpublish confirmation action label requirement to match the native destructive action during the in-flight state.

## Impact

- `apps/electron/src/renderer/renderer.js`
- `apps/electron/test/publishing.test.js`
- `openspec/specs/electron-publishing/spec.md`
