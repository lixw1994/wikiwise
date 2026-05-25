## Why

The native macOS publish sheet closes immediately when the user submits `Publish`, then shows publish success or error feedback separately. Electron currently keeps the publish dialog open until success, which can leave the dialog visible during publishing and behind error feedback.

## What Changes

- Close the Electron publish dialog before the publish request begins, matching the native SwiftUI button action.
- Keep existing publish result and publish error modal feedback behavior.
- Add parity coverage tying the native `showPublishConfirm = false` publish action to Electron's publish request lifecycle.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-publishing`: tighten publish dialog submission behavior so native default publish submission dismisses the dialog before publishing starts.

## Impact

- `apps/electron/src/renderer/renderer.js`
- `apps/electron/test/publishing.test.js`
- `openspec/specs/electron-publishing/spec.md`
