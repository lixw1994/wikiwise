## Why

The native post-create guide summary under `Your wiki is ready` uses 14px sidebar text with 3pt line spacing, while Electron currently treats all guide paragraphs as linked-text copy with a generic line height. This makes the first explanatory paragraph read with the wrong visual hierarchy compared to the macOS app.

## What Changes

- Scope the post-create guide's first summary paragraph to native 14px text.
- Use the sidebar text color token that maps to `Color.sidebarText`.
- Match native `.lineSpacing(3)` with a scoped line-height rule.
- Preserve later guide paragraph/list styling and existing guide behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds post-create guide summary typography/color/line-spacing parity.

## Impact

- Affects `apps/electron/src/renderer/styles.css` for scoped post-create guide summary styling.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
