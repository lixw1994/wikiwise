## Why

The Electron runtime audit currently fails opened-project scenarios after the sidebar animation parity work. The app intentionally animates sidebar hide/show with a 200ms `grid-template-columns` transition, but the audit records hide/show layout evidence before the animation settles. The same global transition also applies during drag-resize, so synthetic resize measurements can read the old column width even after the renderer has updated the sidebar width state.

## What Changes

- Keep the native 200ms sidebar hide/show layout animation.
- Disable the project grid transition while a left or right sidebar drag-resize is active, matching the native immediate resize interaction.
- Update runtime audit evidence collection to wait for the intentional sidebar visibility animation before measuring hidden/restored layout and toolbar-title offset.
- Add regression coverage for both the resize transition bypass and the audit wait behavior.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-runtime-parity-audit`: runtime audit must collect animated sidebar layout evidence after the native animation settles.
- `electron-left-sidebar-width-parity`: active resize interactions must update without the hide/show layout animation delaying drag geometry.

## Impact

- Affected Electron renderer CSS: `apps/electron/src/renderer/styles.css`.
- Affected runtime audit script: `scripts/audit-electron-runtime.mjs`.
- Affected tests: `apps/electron/test/chrome-menus-persistence.test.js`, `apps/electron/test/runtime-parity-audit.test.js`.
- No IPC, file tree, editor, preview, publishing, packaging, or Swift runtime changes.
