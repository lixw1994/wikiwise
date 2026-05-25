## Why

The native post-create guide renders the `OPEN YOUR AGENT` and `SEED YOUR WIKI` section labels as compact 10px semibold tracked headings. Electron currently inherits the shared `.eyebrow` treatment, which is larger and heavier than the native guide headings.

## What Changes

- Scope post-create guide section heading typography to native 10px semibold styling.
- Match native `.tracking(1.5)` and `Color.sidebarHeader` for the guide headings.
- Preserve existing guide copy, dividers, command rendering, seed option content, summary/title styling, and dismiss behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds post-create guide section heading typography and tracking parity.

## Impact

- Affects `apps/electron/src/renderer/styles.css` for scoped post-create guide heading styling.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
