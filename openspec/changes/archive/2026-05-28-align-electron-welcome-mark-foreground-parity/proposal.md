## Why

Native welcome view styles the large centered `W` mark with `Color.sidebarSelectedText`, while Electron currently uses the broader `--color-tab-active` token. The current palette values match, but tying the mark to the native semantic role prevents future palette drift from moving the welcome screen away from SwiftUI.

## What Changes

- Add source-backed coverage proving the native welcome mark uses `Color.sidebarSelectedText`.
- Update Electron's centered welcome mark color to use `--color-sidebar-selected-text`.
- Preserve welcome mark text, serif italic typography, size, weight, toolbar brand, copy, action buttons, and layout.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-native-shell-parity`: Adds native centered welcome mark foreground-role parity.
- `electron-native-parity-roadmap`: Records welcome mark foreground parity as an archived native shell visual correction phase.

## Impact

- Affects Electron renderer CSS for the centered welcome `W` mark only.
- Adds native shell parity regression coverage.
- No native Swift source, JavaScript behavior, API, dependency, packaging script, or release workflow changes.
