## Why

The Electron create-new-wiki sheet still uses the shared branded modal action button styles, while the native SwiftUI sheet uses default sheet buttons for Cancel and Create. Matching this chrome is another small but visible step toward Electron parity with the macOS app.

## What Changes

- Scope the Electron create-new-wiki Cancel/Create button styles to the native sheet instead of reusing shared `primary-action` and `secondary-action` modal chrome.
- Preserve existing button IDs, labels, disabled behavior, and keyboard shortcut behavior.
- Keep shared modal action styles available for publish, unpublish, feedback, and other non-new-wiki dialogs.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-new-wiki-scaffold`: Add native action button chrome parity for the create-new-wiki sheet.

## Impact

- Affects Electron renderer markup/styles and regression tests for the create-new-wiki dialog.
- Does not change Swift native behavior, Electron IPC, scaffold creation, or release packaging.
