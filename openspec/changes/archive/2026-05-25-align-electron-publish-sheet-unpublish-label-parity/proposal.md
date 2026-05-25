## Why

The native macOS publish sheet keeps the sheet-level `Unpublish…` action label static. The Electron renderer still has a transient `Unpublishing` label for the same sheet action, leaving a small visible publishing parity gap.

## What Changes

- Keep the Electron publish sheet's `Unpublish…` action label static, matching the native SwiftUI sheet.
- Preserve the existing disabled state while publish or unpublish work is in progress.
- Add regression coverage that compares the native sheet label behavior with the Electron renderer.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: require the publish sheet's unpublish action to remain labeled `Unpublish…` whenever it is shown.

## Impact

- `apps/electron/src/renderer/renderer.js`
- `apps/electron/test/publishing.test.js`
- `openspec/specs/electron-publishing/spec.md`
