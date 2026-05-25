## Why

The native SwiftUI project toolbar uses different horizontal spacing for its navigation group and primary action group: 14pt on the left and 10pt on the right. Electron currently uses a uniform 8px gap for both groups, making the toolbar feel tighter and less native.

## What Changes

- Align the Electron left toolbar group spacing with native `HStack(spacing: 14)`.
- Align the Electron right toolbar group spacing with native `HStack(spacing: 10)`.
- Preserve toolbar controls, symbols, state, labels, title offset, and command behavior.
- Add regression coverage that ties Electron CSS spacing back to SwiftUI toolbar source.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: Adds native toolbar group spacing parity requirements.

## Impact

- Affected files are expected to stay within Electron renderer CSS, existing toolbar parity tests, and OpenSpec chrome/menu/persistence specs.
- No IPC, menu command, persistence, project lifecycle, sidebar layout, editor, preview, terminal, or native Swift code changes are intended.
