## Why

The native SwiftUI welcome screen presents both first-step actions with SF Symbols, while Electron currently renders those actions as text-only buttons. This leaves the no-folder state short of the native first-run visual affordance.

## What Changes

- Add native-symbol evidence to the Electron welcome Create and Open actions for `plus.circle` and `folder`.
- Keep the existing welcome labels, action IDs, click handlers, and create/open flows unchanged.
- Preserve the native action sizing and spacing already used by the welcome action column.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-native-shell-parity`: Add welcome action symbol parity for the native SwiftUI no-folder state.

## Impact

- Affected code: `apps/electron/src/renderer/index.html`, `apps/electron/src/renderer/styles.css`
- Affected tests: `apps/electron/test/native-shell-parity.test.js`
- No API, dependency, persistence, packaging, or Swift runtime behavior changes.
