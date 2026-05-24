## Why

The Electron publishing flow has the core IPC and service behavior, but its user feedback does not yet match the native SwiftUI app. Native publishing uses modal alerts for success, errors, and unpublish confirmation, while Electron currently uses inline status text and `window.confirm`.

## What Changes

- Replace inline publish success/error feedback with native-like modal result panels.
- Add an "Open in Browser" action for successful publish results using the existing safe external URL bridge.
- Replace `window.confirm` unpublish confirmation with an app-owned modal that includes the native destructive wording and "local files are not affected" message.
- Keep existing publish, unpublish, availability, and `publish.json` behavior unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-publishing`: Strengthens publish result, error, and unpublish confirmation requirements to match the native alert/sheet behavior.
- `electron-native-parity-roadmap`: Records publish alert parity as a visible native publishing polish phase.

## Impact

- `apps/electron/src/renderer/index.html`: Adds publish result, publish error, and unpublish confirmation modal markup.
- `apps/electron/src/renderer/renderer.js`: Manages modal state, Open in Browser action, OK dismissal, and destructive unpublish confirmation without using `window.confirm`.
- `apps/electron/src/renderer/styles.css`: Styles publish alert/confirmation panels consistently with existing dialogs.
- `apps/electron/test/publishing.test.js`: Adds static contracts for native-like publish alerts and removal of browser `confirm`.
- OpenSpec specs and verification retain the native parity evidence.
