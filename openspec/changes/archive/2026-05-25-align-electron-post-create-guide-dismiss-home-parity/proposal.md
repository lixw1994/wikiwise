## Why

The native post-create guide dismiss button does more than hide the guide: it selects and loads `wiki/home.md` when that file exists. Electron currently keeps this behavior implicit through project-opening defaults, so dismissing the guide does not directly mirror the native button action.

## What Changes

- Make Electron dismissing `Got it — start reading` explicitly select the created wiki's `wiki/home.md` when it is present in the project tree.
- Preserve the existing guide text, dismiss label, command rows, seed rows, and fallback behavior when home.md is unavailable.
- Add parity coverage comparing the SwiftUI button action with Electron renderer behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds explicit post-create guide dismiss-to-home behavior parity.

## Impact

- Affects `apps/electron/src/renderer/renderer.js` for dismiss behavior.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
