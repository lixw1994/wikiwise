## Why

SwiftUI `Auto` appearance follows the current macOS system appearance, but the Electron renderer currently treats `Auto` as its light default even though the main process uses Electron's system theme source. This leaves a visible native parity gap whenever the app is set to Auto on a dark system.

## What Changes

- Make Electron renderer shell palettes resolve `Auto` through the system color scheme instead of leaving Auto on light-only tokens.
- Keep explicit `Light` and `Dark` modes unchanged.
- Add tests that prove Auto has system-following light and dark renderer states while preserving the stored `Auto` setting.
- Retain OpenSpec roadmap evidence for this final appearance parity closure.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-appearance-palette-parity`: Add Auto/system appearance behavior to the renderer palette contract.
- `electron-native-parity-roadmap`: Record Auto appearance parity as a native shell gap closure phase.

## Impact

- Affects Electron renderer appearance state resolution and CSS palette selectors.
- Affects Electron appearance/source tests and runtime audit expectations if they inspect root appearance evidence.
- No SwiftUI behavior, release packaging, scaffold output, or external dependency changes.
