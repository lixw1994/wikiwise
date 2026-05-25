## Why

The native post-create guide's final guidance paragraph uses 13px sidebar text with `.lineSpacing(2)`. Electron currently renders that paragraph through the shared guide copy rule, leaving it in linked-text color with the generic guide line height.

## What Changes

- Scope the post-create guide's direct final guidance paragraph to native 13px sidebar text.
- Match native `.lineSpacing(2)` with a scoped line-height rule.
- Preserve existing summary, intro copy, headings, dividers, lists, command rendering, and dismiss behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds post-create guide final guidance paragraph typography/color/line-spacing parity.

## Impact

- Affects `apps/electron/src/renderer/styles.css` for scoped final guidance paragraph styling.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
