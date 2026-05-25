## Why

The native SwiftUI opened-project toolbar renders icon-only controls with `.buttonStyle(.plain)`, while Electron still draws those controls as bordered rounded buttons. Removing that extra chrome brings the Electron toolbar closer to the macOS native split-view toolbar affordance.

## What Changes

- Align Electron icon-only toolbar button chrome with SwiftUI plain buttons by removing the bordered rounded button treatment.
- Preserve existing toolbar symbols, icon sizes, color states, accessible labels, click behavior, group spacing, and project-title offset behavior.
- Add a regression test that ties the native `.buttonStyle(.plain)` source to the Electron CSS chrome mapping.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-toolbar-icon-parity`: Add plain icon-only toolbar chrome parity for Electron controls that mirror SwiftUI `.buttonStyle(.plain)`.

## Impact

- Affected code: `apps/electron/src/renderer/styles.css`
- Affected tests: `apps/electron/test/chrome-menus-persistence.test.js`
- No API, dependency, persistence, packaging, or Swift runtime behavior changes.
