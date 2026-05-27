## Why

The native `RightSidebar` renders INFO metadata values, directions, and linked rows with its serif document font, but Electron's directions callout can still inherit the generic `.info-section p` monospaced paragraph rule because that selector is more specific than `.info-directions-callout`. This leaves a subtle but visible INFO tab typography mismatch after the earlier right-sidebar polish slices.

## What Changes

- Make the Electron INFO serif styles explicit enough to win over generic INFO paragraph styling.
- Put the native serif family first for INFO values, directions, and linked rows while retaining the existing web-safe fallback.
- Add regression coverage proving the directions callout's effective selector has higher specificity than the generic `.info-section p` rule.
- Preserve INFO visibility, parsed metadata, linked rows, directions callout chrome, tab switching, terminal behavior, and sidebar resizing.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: clarify that native INFO serif typography must be the effective rendered typography, not only a lower-specificity fallback declaration.
- `electron-native-parity-roadmap`: record this serif specificity parity correction as a right-sidebar visual polish phase.

## Impact

- Affected files: Electron renderer CSS and right-sidebar parity tests.
- No IPC, core compiler, terminal lifecycle, Swift source, packaging, or release command changes.
