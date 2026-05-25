## Why

Electron's opened-project Back and Forward toolbar buttons do not yet mirror the native SwiftUI help text. The native app exposes `Go Back (⌘[)` and `Go Forward (⌘])`, while Electron currently shows the shorter labels without shortcuts.

## What Changes

- Align Electron Back toolbar help and accessible label with native `Go Back (⌘[)`.
- Align Electron Forward toolbar help and accessible label with native `Go Forward (⌘])`.
- Keep menu accelerators, navigation history behavior, and disabled-state logic unchanged.
- Add a native-source parity test for the toolbar navigation help text.

## Success Criteria

- Electron Back toolbar control exposes `Go Back (⌘[)` through `title` and `aria-label`.
- Electron Forward toolbar control exposes `Go Forward (⌘])` through `title` and `aria-label`.
- Targeted Electron native-shell parity tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change File menu command labels or accelerators.
- Do not change renderer history state or navigation behavior.
- Do not redesign toolbar layout or icon rendering.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-chrome-menus-persistence`: Require native Back/Forward toolbar help labels with shortcut hints.

## Impact

- Affected code: Electron renderer markup, Electron native shell parity tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
