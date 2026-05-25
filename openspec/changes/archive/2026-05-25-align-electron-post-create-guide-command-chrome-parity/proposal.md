## Why

The native post-create guide renders agent commands as compact selectable text chips with sidebar-muted text, sidebar background, 10x6 padding, and a 4px corner radius. Electron still renders those commands with a heavier bordered code-block chrome, larger padding, and different color tokens, so the quick-start section does not yet match the macOS app.

## What Changes

- Align Electron post-create guide command blocks with native `agentCommand` command text chrome.
- Preserve the existing command labels, command IDs, command population behavior, guide copy, dividers, headings, and dismiss behavior.
- Add parity coverage that compares the SwiftUI `agentCommand` styling to Electron CSS.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds post-create guide command chrome parity for the quick-start agent commands.

## Impact

- Affects `apps/electron/src/renderer/styles.css` for the command block padding, background, text color, border, and radius.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
