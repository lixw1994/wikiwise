## Why

Native SwiftUI disables the create-new-wiki `Create` action only when the trimmed wiki name is empty. It does not add a visible creating/busy disabled state to the name field, location chooser, cancel button, or create button, and the location label falls back to `~/wikis` when no location is selected. Electron currently disables several controls while its async create request is in progress and also disables `Create` when `state.newWikiLocation` is empty, leaving a visible dialog-state mismatch.

## What Changes

- Make Electron's visible create-new-wiki disabled behavior follow the native name-only rule.
- Preserve the existing internal async guard that prevents duplicate create submissions.
- Render the native `~/wikis` fallback for the location label when no selected location path is available.
- Add regression coverage that ties Electron's renderer behavior to the native SwiftUI sheet source.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-new-wiki-scaffold`: clarify native create-new-wiki disabled state and location fallback behavior.
- `electron-native-parity-roadmap`: record this visible new-wiki disabled-state correction as a native dialog polish phase.

## Impact

- Affected files: Electron renderer new-wiki dialog state, new-wiki parity tests, and OpenSpec artifacts.
- No scaffold output, IPC contract, compiler, watcher, terminal, publishing, packaging, or Swift source changes.
