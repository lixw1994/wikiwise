## Why

The native SwiftUI Back and Forward toolbar controls render as 16pt regular monospaced text arrows and use `toolbarDisabled` when unavailable. Electron currently inherits the generic 12px toolbar icon style and global disabled opacity, so the navigation arrows are visually smaller and fade differently from native.

## What Changes

- Align Electron Back and Forward toolbar arrow typography with native 16px regular monospaced text.
- Align disabled Back and Forward arrows with the native toolbar disabled color instead of relying on global opacity.
- Preserve existing navigation state, shortcuts, titles, aria labels, and click behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: Adds Back/Forward toolbar arrow typography and disabled color parity requirements.

## Impact

- Affected files are expected to stay within Electron renderer CSS, existing toolbar parity tests, and OpenSpec chrome/menu/persistence specs.
- No IPC, menu command, history behavior, project lifecycle, sidebar behavior, title offset, or native Swift code changes are intended.
