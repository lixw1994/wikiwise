## Why

The native macOS publish toolbar button exposes stateful help text: unpublished projects show the publish destination, while published projects show the last publish time, URL, and URL-change hint. Electron currently updates only the visible button label, so users lose this native contextual affordance.

## What Changes

- Add Electron publish button title/accessible label text that mirrors the native SwiftUI `.help(...)` strings.
- Show `Publish wiki to wiki-wise.com` before a project is published.
- Show last-published time, URL, and the URL-change hint after a project has publish config.
- Preserve existing publish dialog, result, and unpublish behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-publishing`: Publish toolbar control must expose native-equivalent help text for unpublished and published states.

## Impact

- Affects `apps/electron/src/renderer/renderer.js` publish toolbar rendering.
- Adds Electron publishing source tests.
- No new IPC channels, native Swift changes, or dependencies are required.
