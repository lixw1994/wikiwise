## Why

Electron now has the project toolbar and a 3D map entry point, but compiled wiki pages and generated map/graph pages still navigate inside plain iframes. The SwiftUI app routes local preview links back through app state, maps generated pages into history, and opens external links in the system browser, so this phase closes that WebView parity gap.

## What Changes

- Add main-process preview navigation resolution for local HTML URLs, including source markdown lookup by slug and generated page lookup inside the compiler output directory.
- Add a safe external-link opener so http/https links from compiled previews and map/graph pages leave the Electron app like the native WKWebView behavior.
- Add preload APIs for preview navigation resolution and external URL opening.
- Intercept preview and generated iframe link clicks in the renderer, allowing same-page anchors while routing local wiki links, generated map/graph links, and external links through Electron state.
- Refresh generated map/graph pages when project changes affect compiled output.
- Extend generated-page support to `graph.html` alongside `map.html`, `map-3d.html`, `index.html`, and `catalog.html`.

## Capabilities

### New Capabilities

- `electron-preview-navigation-map-graph`: Electron preview, map, and graph navigation parity with native WebView behavior.

### Modified Capabilities

- `cross-platform-electron-workspace`: Add preview navigation resolution and external URL opening IPC/preload behavior.
- `electron-native-parity-roadmap`: Record preview navigation and map/graph polish as an implemented migration phase while leaving packaging/release and final parity audit open.

## Impact

- Affected code: `apps/electron/src/main`, `apps/electron/src/preload`, `apps/electron/src/renderer`, Electron structural tests, and OpenSpec specs.
- No Swift source changes are planned.
- Verification includes Electron tests, root `npm test`, OpenSpec validation, untouched Swift source confirmation, `swift build`, and whitespace checks.
