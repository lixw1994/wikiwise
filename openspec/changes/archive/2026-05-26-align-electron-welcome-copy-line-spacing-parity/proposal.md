## Why

The native SwiftUI welcome screen uses explicit `lineSpacing` values for the main welcome copy and the helper hint. Electron currently uses ratio-based line heights that make the no-folder welcome copy read looser than the native surface.

## What Changes

- Align Electron welcome summary copy line height with Swift's 15px text plus 4px line spacing.
- Align Electron welcome hint line height with Swift's 12px text plus 3px line spacing.
- Preserve existing welcome copy, actions, symbols, toolbar brand, colors, and layout spacing.
- Add parity coverage tying the Electron CSS values to the SwiftUI `.lineSpacing` source.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `electron-native-shell-parity`: no-folder welcome copy typography must match native SwiftUI line-spacing rhythm.

## Impact

- Affected Electron renderer CSS: `apps/electron/src/renderer/styles.css`.
- Affected parity tests: `apps/electron/test/native-shell-parity.test.js`.
- No IPC, project lifecycle, scaffold, packaging, or Swift runtime changes.
