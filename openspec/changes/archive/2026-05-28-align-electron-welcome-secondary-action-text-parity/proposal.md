## Why

Native welcome view styles the "Open Existing Folder" action with `Color.sidebarSelectedText`, while Electron inherits `--color-control-text` from the shared secondary button rule. This leaves the secondary welcome call-to-action slightly softer than the native no-folder screen.

## What Changes

- Add source-backed coverage for the native secondary welcome action foreground color.
- Override Electron's welcome secondary action text/icon color to use `--color-sidebar-selected-text`.
- Preserve the shared `.secondary-action` color for non-welcome controls.
- Preserve welcome action labels, native-symbol metadata, button width, padding, border, and click behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-native-shell-parity`: Adds native welcome secondary-action foreground parity.
- `electron-native-parity-roadmap`: Records welcome secondary-action text parity as an archived native shell visual correction phase.

## Impact

- Affects Electron renderer CSS for welcome-screen action buttons only.
- Adds native shell parity regression coverage.
- No native Swift source, JavaScript behavior, API, dependency, packaging script, or release workflow changes.
