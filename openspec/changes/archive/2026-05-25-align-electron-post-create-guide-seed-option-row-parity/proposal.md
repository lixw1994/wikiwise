## Why

The native post-create guide renders seed suggestions as compact rows with an accent SF Symbol, a medium title, and a muted monospaced command. Electron still renders the same copy as plain list items with bold labels and inline code, so the seed section remains visibly different from the macOS app.

## What Changes

- Align Electron seed suggestions with the native `seedOption(icon:title:command:)` row structure.
- Add visible icon slots carrying the native symbol identifiers for `book`, `link`, `folder`, and `text.bubble`.
- Match native row spacing, icon width/color/font size, title typography/color, and command typography/color.
- Preserve the four existing seed option titles and commands, guide copy, dividers, headings, command quick-start section, and dismiss behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds post-create guide seed option row parity.

## Impact

- Affects `apps/electron/src/renderer/index.html` and `apps/electron/src/renderer/styles.css` for seed option markup and scoped styling.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
