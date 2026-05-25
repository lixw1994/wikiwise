## Why

SwiftUI renders the create-new-wiki sheet as a compact native form with a 400pt frame, 24pt padding, 20pt vertical spacing, a 16pt semibold title, and 12pt medium field labels. Electron currently reuses the generic modal panel, leaving the new-wiki form visibly different from the native sheet.

## What Changes

- Add a new-wiki-specific panel style for native frame width, padding, vertical spacing, and title typography.
- Scope field label weight and name/location field spacing to the new-wiki dialog.
- Keep existing dialog copy, IDs, keyboard behavior, create/open flow, and post-create guide behavior unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-new-wiki-scaffold`: Add native create-new-wiki sheet layout and typography parity.

## Impact

- Affected code: `apps/electron/src/renderer/index.html`, `apps/electron/src/renderer/styles.css`
- Affected tests: `apps/electron/test/new-wiki-scaffold.test.js`
- No API, dependency, scaffold output, persistence, packaging, or Swift runtime behavior changes.
