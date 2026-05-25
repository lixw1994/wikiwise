## Why

The Electron project toolbar still applies a shared 12px size to icon-only controls, while the native SwiftUI toolbar uses distinct symbol sizes for appearance, map, and sidebar controls. Matching these sizes is another small visual parity step toward making the Electron app indistinguishable from the macOS native version.

## What Changes

- Align Electron icon-only project toolbar symbol font sizes with the native SwiftUI toolbar.
- Preserve existing symbols, labels, click behavior, navigation arrow styling, toolbar spacing, and sidebar toggle color behavior.
- Add a regression test that checks the native SwiftUI sizes and Electron CSS mappings together.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-toolbar-icon-parity`: Add native symbol size parity for icon-only Electron project toolbar controls.

## Impact

- Affected code: `apps/electron/src/renderer/styles.css`
- Affected tests: `apps/electron/test/chrome-menus-persistence.test.js`
- No API, dependency, persistence, packaging, or Swift runtime behavior changes.
