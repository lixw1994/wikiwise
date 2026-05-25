## Why

The native new-wiki sheet shows the selected parent directory on one line with middle truncation, preserving both the root context and final folder name. Electron currently relies on CSS end ellipsis for the location path, which can hide the most important trailing directory when paths are long.

## What Changes

- Add Electron renderer support for middle-truncated new-wiki location display.
- Preserve the full selected location as accessible/title text.
- Keep the existing default location lookup, choose-location IPC flow, labels, IDs, and create behavior unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-new-wiki-scaffold`: Add native middle-truncation parity for the new-wiki location path.

## Impact

- Affected code: `apps/electron/src/renderer/renderer.js`, `apps/electron/src/renderer/styles.css`
- Affected tests: `apps/electron/test/new-wiki-scaffold.test.js`
- No API, dependency, scaffold output, persistence, packaging, or Swift runtime behavior changes.
