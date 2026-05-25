## Why

The native post-create guide renders the agent and seed intro paragraphs as 13px sidebar text. Electron currently lets those two paragraphs inherit the shared guide copy rule, making them linked-text colored and visually less like the macOS guide.

## What Changes

- Scope the post-create guide's agent and seed intro paragraphs to native 13px sidebar text.
- Use a native default line-height approximation for those two intro paragraphs.
- Preserve existing summary, final guidance, list, command, divider, heading, and dismiss behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds post-create guide agent/seed intro paragraph typography and color parity.

## Impact

- Affects `apps/electron/src/renderer/styles.css` for scoped post-create guide intro paragraph styling.
- Adds renderer parity coverage in `apps/electron/test/new-wiki-scaffold.test.js`.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
