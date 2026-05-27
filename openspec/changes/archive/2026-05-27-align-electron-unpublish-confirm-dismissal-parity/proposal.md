## Why

Native SwiftUI presents unpublish through an `.alert("Unpublish wiki?")`; choosing the destructive `Unpublish` action dismisses the alert while `performUnpublish()` starts the async work. Electron currently leaves its app-owned unpublish confirmation visible while the async unpublish request is in progress and closes it only after success, which creates a visible interaction mismatch and a different failure path.

## What Changes

- Close the Electron unpublish confirmation immediately when the user confirms unpublish, before invoking preload.
- Keep the toolbar publishing busy state while unpublish is running.
- Preserve success cleanup, error modal behavior, native copy, destructive action label, and `window.confirm` avoidance.
- Add regression coverage tying the Electron confirmation dismissal order to the native SwiftUI alert action.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: clarify native unpublish confirmation dismissal timing.
- `electron-native-parity-roadmap`: record this unpublish confirmation dismissal correction as a native publishing polish phase.

## Impact

- Affected files: Electron renderer publishing flow, publishing parity tests, and OpenSpec artifacts.
- No core publishing helper, IPC contract, compiler, watcher, new-wiki, terminal, packaging, or Swift source changes.
