## Why

The native post-create guide shows each suggested agent command with a visible agent label (`Claude Code`, `Codex`, `Cursor`) above the command. Electron currently renders only command code blocks, so the quick-start section loses native structure and scannability.

## What Changes

- Add visible agent labels above each Electron post-create guide command.
- Scope label typography to native 12px semibold sidebar text.
- Preserve existing command IDs, command population behavior, guide copy, dividers, headings, and dismiss behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds post-create guide agent command label structure and typography parity.

## Impact

- Affects `apps/electron/src/renderer/index.html` and `apps/electron/src/renderer/styles.css` for command row structure and scoped label styling.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
