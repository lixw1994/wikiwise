## Why

Electron's left-sidebar toolbar control still exposes the generic `Toggle left sidebar` help text. The native SwiftUI app's custom left-sidebar restore control uses `Show Sidebar`, so Electron should expose the native restore wording when the left sidebar is hidden.

## What Changes

- Add native-aware left-sidebar toolbar help text for the hidden-sidebar restore state.
- Keep the existing `sidebar.left` symbol semantics and hide/restore behavior unchanged.
- Expose the active help text through both `title` and `aria-label`.
- Add tests that compare the Electron label behavior with the SwiftUI `.help("Show Sidebar")` source.

## Success Criteria

- Electron left-sidebar control uses `Show Sidebar` for `title` and `aria-label` when the left sidebar is hidden.
- The generic `Toggle left sidebar` label is not used as the restore-state help text.
- Targeted Electron toolbar tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change left-sidebar hide/restore behavior, width preservation, or layout expansion.
- Do not change right-sidebar control labels.
- Do not redesign toolbar icons or toolbar layout.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-toolbar-icon-parity`: Require native `Show Sidebar` help for the left-sidebar restore control state.

## Impact

- Affected code: Electron renderer JavaScript, Electron toolbar tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
