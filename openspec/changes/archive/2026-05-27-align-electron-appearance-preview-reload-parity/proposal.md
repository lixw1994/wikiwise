## Why

Native SwiftUI increments `webViewReloadToken` whenever `appearanceMode` changes so the active `WKWebView` reloads and compiled wiki CSS picks up the new `prefers-color-scheme`. Electron currently updates shell palette and terminal theme on appearance changes, but it does not explicitly reload the active compiled-preview or generated-page iframe.

## What Changes

- Reload the visible compiled-preview iframe after explicit Electron appearance-mode changes.
- Reload the visible generated-page iframe after explicit Electron appearance-mode changes.
- Preserve existing shell palette updates, terminal theme updates, selected-file state, generated-page state, and preview navigation behavior.
- Add source-backed regression coverage anchored to native `ContentView` and `WebView` reload-token behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-appearance-palette-parity`: Appearance changes now include active preview/generated iframe reload parity, not only shell palette and terminal theme updates.
- `electron-native-parity-roadmap`: Track this appearance WebView reload parity slice and retained verification evidence.

## Impact

- Electron renderer appearance handling in `apps/electron/src/renderer/renderer.js`.
- Electron appearance/menu parity tests under `apps/electron/test/chrome-menus-persistence.test.js`.
- OpenSpec delta specs for appearance palette parity and roadmap tracking.
