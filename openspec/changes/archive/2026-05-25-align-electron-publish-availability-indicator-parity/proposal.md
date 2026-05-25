## Why

The native macOS publish sheet shows a compact 16x16 availability indicator in the subdomain input row: progress while checking, success icons for available/owned, failure for taken, warning for invalid, and empty for unknown. Electron currently only updates the hint text below the row, leaving out a visible native feedback surface.

## What Changes

- Add an Electron publish availability indicator inside the subdomain row.
- Map availability states to native-like visual markers while preserving the existing hint copy below the row.
- Add parity coverage comparing the SwiftUI indicator states and fixed 16x16 frame with Electron markup, renderer state updates, and styling.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-publishing`: extend availability feedback requirements to include the native inline availability indicator.

## Impact

- `apps/electron/src/renderer/index.html`
- `apps/electron/src/renderer/renderer.js`
- `apps/electron/src/renderer/styles.css`
- `apps/electron/test/publishing.test.js`
- `openspec/specs/electron-publishing/spec.md`
