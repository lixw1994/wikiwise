## Why

The Electron app now covers the major native workflows, but the final audit found visible shell differences from the SwiftUI app: product naming still says "Electron", the welcome screen uses migration copy, and a shared-resources debug panel is exposed to users. These should be removed before any claim of native-like parity.

## What Changes

- Align Electron window and renderer branding with the product-facing `Wikiwise` / `WikiWise` language used by the native app.
- Replace the Electron welcome panel copy with the native welcome content, actions, and creation hint.
- Remove the shared-resources debug panel from the renderer UI.
- Remove the `listResources` IPC/preload/renderer debug API because it is no longer part of the production app contract.
- Make the welcome and project shells occupy the app window without an outer debug-card layout.
- Add structural tests that guard against reintroducing the Electron-branded/debug shell.

## Capabilities

### New Capabilities

- `electron-native-shell-parity`: Product-facing Electron shell branding, welcome-state layout, and debug-panel removal needed for native visual parity.

### Modified Capabilities

- `cross-platform-electron-workspace`: Update the renderer bridge and state-shell requirements so the app exposes only production APIs and no resource debug metadata.
- `electron-native-parity-roadmap`: Record this final shell polish as progress in the final parity audit while keeping remaining release/runtime parity evidence open.

## Impact

- Affected code: Electron main process, preload bridge, renderer HTML/CSS/JavaScript, Electron structural tests, and OpenSpec specs.
- No Swift source changes are planned.
- No new dependencies are planned.
- This phase does not claim the whole migration is complete; it removes an obvious user-visible mismatch and preserves later runtime/signing parity gates.
