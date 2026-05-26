## Why

Native SwiftUI dismisses the create-new-wiki sheet when scaffold creation throws, logs the failure, and does not open a project or show the post-create guide. Electron currently keeps the create dialog open and surfaces a visible shell error, which makes the failure path visibly different from the macOS app even though the success path is aligned.

## What Changes

- Dismiss the Electron create-new-wiki dialog when scaffold creation fails.
- Keep the current project unchanged and avoid showing the post-create guide on scaffold failure.
- Keep failure reporting non-visible in the shell, matching the native catch path's logged-only behavior.
- Preserve all successful scaffold creation behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds scaffold failure dismissal parity for the create-new-wiki flow.
- `electron-native-parity-roadmap`: Records new-wiki failure parity as a scaffold/native sheet closure phase.

## Impact

- Affects Electron renderer create-new-wiki error handling.
- Adds renderer/source parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` and `electron-native-parity-roadmap` OpenSpec contracts.
