## Why

The native SwiftUI create-new-wiki sheet renders the selected location path with `Color.sidebarTextMuted`, but Electron still uses the broader `--color-muted-text` token for `.location-path`. This leaves a visible tone mismatch in the new-wiki flow while the rest of the sheet is being tightened toward native parity.

## What Changes

- Scope the Electron new-wiki location path color to the sidebar muted text token used by native sidebar-adjacent sheet copy.
- Preserve the existing location path font, spacing, middle truncation, and full-path metadata behavior.
- Keep shared muted text styling unchanged for publish and other non-new-wiki surfaces.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-new-wiki-scaffold`: Adds a new-wiki selected location path color parity requirement.

## Impact

- Affects `apps/electron/src/renderer/styles.css` for `.location-path` color.
- Updates `apps/electron/test/new-wiki-scaffold.test.js` with a SwiftUI-to-Electron color parity assertion.
- Updates and archives the `electron-new-wiki-scaffold` OpenSpec contract.
