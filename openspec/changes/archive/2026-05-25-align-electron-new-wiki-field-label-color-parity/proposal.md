## Why

The Electron create-new-wiki sheet still renders its `Name` and `Location` labels with the shared toolbar label color, while the native SwiftUI sheet explicitly uses `Color.sidebarText` for those labels. This keeps a visible color mismatch in a high-frequency creation flow that is being tightened toward native parity.

## What Changes

- Scope the Electron new-wiki sheet field labels to the sidebar text color used by the native sheet.
- Preserve the existing 12px medium label typography already aligned with SwiftUI.
- Keep the shared `.field-label` color available for other dialogs that still use toolbar-oriented modal styling.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds a new-wiki field label color parity requirement for the create-new-wiki sheet.

## Impact

- Affects `apps/electron/src/renderer/styles.css` for scoped new-wiki sheet label styling.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates the `electron-new-wiki-scaffold` OpenSpec contract.
