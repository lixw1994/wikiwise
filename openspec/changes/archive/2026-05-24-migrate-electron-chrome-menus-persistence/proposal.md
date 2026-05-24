## Why

After publishing, the next native parity gap is the macOS app shell experience: menu commands, toolbar navigation controls, appearance persistence, and last-folder restoration. Electron currently loses those stateful app-chrome behaviors between sessions and relies mostly on page-local buttons.

## What Changes

- Add Electron settings persistence for `lastFolderPath` and `appearanceMode`, matching native `@AppStorage` behavior.
- Restore the last opened folder on app startup when it still exists.
- Add Electron menu commands for back, forward, and refresh, with native-compatible shortcuts.
- Add preload command events and settings APIs so the renderer can respond without Node access.
- Add renderer toolbar controls for back/forward, appearance cycling, 3D map navigation, publish, right-sidebar toggle, and project title display.
- Add renderer navigation history for selected markdown files and generated pages such as `map-3d.html`.

## Capabilities

### New Capabilities

- `electron-chrome-menus-persistence`: Electron app chrome, menu command, appearance, history, map, sidebar toggle, and startup persistence behavior.

### Modified Capabilities

- `cross-platform-electron-workspace`: Add settings, restore, generated-page, and app-command IPC/preload behavior.
- `electron-native-parity-roadmap`: Record app chrome, menus, and persistence as an implemented phase while leaving map polish, packaging, and final audit open.

## Impact

- Affected code: `apps/electron/src/main`, `apps/electron/src/preload`, `apps/electron/src/renderer`, Electron structural tests, and OpenSpec specs.
- No Swift source changes are planned.
- Verification includes Electron tests, root `npm test`, OpenSpec validation, untouched Swift source confirmation, `swift build`, and whitespace checks.
