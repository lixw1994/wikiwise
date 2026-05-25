## Why

The native macOS publish sheet uses a static `Publish` confirmation action. Electron still has a renderer branch that can change the hidden dialog action to `Publishing`, which conflicts with the native label contract and the newer lifecycle that closes the dialog before publishing starts.

## What Changes

- Keep the Electron publish dialog confirmation action labeled `Publish`.
- Remove the stale in-flight `Publishing` label branch from the publish dialog action.
- Add parity coverage that compares the SwiftUI static `Button("Publish")` action with the Electron renderer.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-publishing`: tighten publish dialog label requirements so both first-publish and existing-publish dialogs keep the confirmation action labeled `Publish`.

## Impact

- `apps/electron/src/renderer/renderer.js`
- `apps/electron/test/publishing.test.js`
- `openspec/specs/electron-publishing/spec.md`
