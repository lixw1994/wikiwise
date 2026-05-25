## Why

The Electron toolbar icon-only controls now use plain chrome, but they still occupy fixed 34x31px boxes with extra padding. Native SwiftUI plain toolbar buttons in this area do not declare extra `.frame` or `.padding`; their visual spacing comes from the HStack spacing and symbol/text intrinsic size.

## What Changes

- Align Electron icon-only toolbar controls with native intrinsic plain-button sizing by removing fixed button boxes and extra padding.
- Preserve existing symbols, font sizes, color states, plain chrome, accessible labels, click behavior, group spacing, and project-title offset behavior.
- Keep segmented mode controls and the publish action on their existing explicit native padding and rounded-rectangle chrome.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-toolbar-icon-parity`: Add intrinsic sizing parity for icon-only Electron toolbar controls that mirror SwiftUI plain toolbar buttons.

## Impact

- Affected code: `apps/electron/src/renderer/styles.css`
- Affected tests: `apps/electron/test/chrome-menus-persistence.test.js`
- No API, dependency, persistence, packaging, or Swift runtime behavior changes.
