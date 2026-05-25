## Why

The native post-create guide title uses a 20px medium serif style with `Color.sidebarSelectedText`, while the Electron title currently renders at 22px and inherits a generic guide color. This keeps the first-run guide's visual hierarchy noticeably different from the macOS app.

## What Changes

- Align the Electron post-create guide title size to the native 20px value.
- Scope the title foreground color to the sidebar selected text token used by SwiftUI.
- Preserve the existing guide copy, container layout, and post-create behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds post-create guide title typography/color parity for the create-new-wiki completion flow.

## Impact

- Affects `apps/electron/src/renderer/styles.css` for post-create guide title styling.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
