## Why

The SwiftUI macOS app declares a 1500x1000 default window and an 800x500 minimum content frame, while the Electron shell currently opens at 1180x780 with a larger minimum. This creates a visible first-launch and resizing mismatch in a migration whose acceptance standard is native parity.

## What Changes

- Align the Electron `BrowserWindow` default size to the native SwiftUI `.defaultSize(width: 1500, height: 1000)`.
- Align the Electron minimum window size to the native `ContentView` `.frame(minWidth: 800, minHeight: 500)`.
- Update the runtime parity audit to capture the app at the native default viewport size and retain viewport evidence in its report.
- Add source-level tests that guard the native geometry constants and audit viewport from drifting.

## Capabilities

### New Capabilities
- `electron-window-geometry-parity`: Tracks Electron app-window default and minimum geometry parity with the current SwiftUI macOS app.

### Modified Capabilities
- `electron-runtime-parity-audit`: Require runtime audit screenshots and report evidence to use the native default viewport.
- `electron-native-parity-roadmap`: Record this geometry alignment as a visible native parity phase with retained verification evidence.

## Impact

- Affected Electron main-process code: `apps/electron/src/main/main.js`.
- Affected runtime audit: `scripts/audit-electron-runtime.mjs`.
- Affected tests: Electron source inspection tests for native shell and runtime audit parity.
- No new dependencies or IPC API changes.
