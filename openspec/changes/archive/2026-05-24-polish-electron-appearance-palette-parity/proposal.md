## Why

The native SwiftUI app uses adaptive light/dark colors for the full shell palette, but Electron currently stores and applies appearance mode while many visible panels remain hard-coded to light colors. This leaves dark-mode runtime screenshots too weak as final native parity evidence.

## What Changes

- Add an Electron renderer color-token layer matching the native SwiftUI `Color` palette.
- Replace key hard-coded light shell colors with tokens that switch under `data-appearance="Dark"`.
- Extend runtime audit evidence so dark welcome/project scenarios verify dark shell surfaces rather than only scenario names.
- Preserve existing appearance persistence, toolbar cycling, terminal theme, and content behavior.

## Capabilities

### New Capabilities

- `electron-appearance-palette-parity`: Covers native light/dark palette parity for Electron shell surfaces.

### Modified Capabilities

- `electron-chrome-menus-persistence`: Strengthens renderer appearance mode requirements from state reflection to visible shell palette changes.
- `electron-runtime-parity-audit`: Adds runtime evidence for dark appearance surface colors.
- `electron-native-parity-roadmap`: Records appearance palette parity as a visible native shell polish phase.

## Impact

- `apps/electron/src/renderer/styles.css`: Introduces native palette CSS custom properties and applies them to welcome, toolbar, sidebars, detail, dialogs, file tree, and publish surfaces.
- `scripts/audit-electron-runtime.mjs`: Captures and asserts dark appearance palette evidence.
- Electron tests and OpenSpec specs document and verify the visual parity layer.
