## Why

The native post-create guide separates the title, agent startup, seed options, and final guidance with `Divider()` rows. Electron currently renders the same guide copy without those separators, so the section rhythm and native visual grouping are still off.

## What Changes

- Add explicit Electron divider elements between the same post-create guide sections that native SwiftUI separates.
- Style those dividers with the native sidebar rule token and scoped guide width.
- Preserve existing guide copy, command rendering, seed option content, summary/title styling, and dismiss behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds post-create guide divider layout and rule-color parity.

## Impact

- Affects `apps/electron/src/renderer/index.html` and `apps/electron/src/renderer/styles.css` for post-create guide structure and scoped divider styling.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
