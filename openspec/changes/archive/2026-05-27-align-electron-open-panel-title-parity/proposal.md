## Why

The native SwiftUI app configures its `NSOpenPanel` picker copy through `message` only for both Open Existing and new-wiki location selection. Electron currently duplicates that copy into `title`, which adds non-native visible dialog chrome and keeps the migration short of exact macOS parity.

## What Changes

- Remove Electron `title` overrides from the Open Existing picker and the new-wiki location picker.
- Keep the native-equivalent `message` copy, single-selection behavior, folder/file constraints, default new-wiki location, and directory-creation behavior unchanged.
- Add source-level tests that compare the Swift `NSOpenPanel` configuration against the Electron `showOpenDialog` configuration.
- Record this as another final parity correction phase while keeping the signed/notarized release gate open.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-project-lifecycle`: Open Existing picker requirements now include native message-only dialog chrome with no explicit title override.
- `electron-new-wiki-scaffold`: New-wiki location picker requirements now include native message-only dialog chrome with no explicit title override.
- `electron-native-parity-roadmap`: Track this picker chrome correction as an archived parity phase.

## Impact

- Affects Electron main-process dialog configuration in `apps/electron/src/main/main.js`.
- Affects Electron lifecycle and new-wiki tests.
- Affects OpenSpec specs and retained verification evidence.
