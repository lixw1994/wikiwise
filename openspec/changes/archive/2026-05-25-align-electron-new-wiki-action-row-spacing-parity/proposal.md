## Why

The native new-wiki sheet places the Cancel/Create action row as a normal child of `VStack(spacing: 20)`, so the row receives the same vertical spacing as the other sheet sections. Electron currently inherits the shared `.modal-actions` `margin-top: 8px`, adding extra spacing only above the action row.

## What Changes

- Scope the new-wiki action row so it does not add extra top margin beyond the native 20px sheet spacing.
- Preserve the existing Cancel/Create labels, IDs, keyboard behavior, disabled state, and create flow.
- Keep shared modal action spacing unchanged for publish, unpublish, and feedback dialogs.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-new-wiki-scaffold`: Add native action-row spacing parity for the create-new-wiki sheet.

## Impact

- Affected code: `apps/electron/src/renderer/index.html`, `apps/electron/src/renderer/styles.css`
- Affected tests: `apps/electron/test/new-wiki-scaffold.test.js`
- No API, dependency, scaffold output, persistence, packaging, or Swift runtime behavior changes.
