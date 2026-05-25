## Why

Native SwiftUI sidebar toolbar controls use plain icon buttons whose visible state is communicated through `toolbarText` and `toolbarDisabled` foreground colors. Electron currently gives selected sidebar toolbar toggles a selected fill and selected text color, making those controls look like active segmented buttons instead of native toolbar icons.

## What Changes

- Keep the existing Electron sidebar toggle controls, symbol names, click behavior, and accessible labels.
- Align visible sidebar toggles with native toolbar text color and no selected fill.
- Align hidden sidebar toggles with native disabled toolbar color.
- Add regression coverage that ties the Electron CSS to the SwiftUI foreground-style behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-toolbar-icon-parity`: Adds sidebar toolbar toggle color-state requirements.

## Impact

- Affected files are expected to stay within Electron renderer CSS, toolbar parity tests, and OpenSpec toolbar icon parity specs.
- No IPC, menu command, sidebar layout, title offset, file tree, terminal, publishing, or native Swift code changes are intended.
