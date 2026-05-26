## Why

The native SwiftUI app sets the running macOS application icon from bundled `Wikiwise.icns`, but the Electron main process only mirrors the icon in packaged bundle metadata. During development and runtime audit launches, the Electron app can still present Electron's default app icon, leaving a visible shell-branding gap.

## What Changes

- Resolve the native bundled `Wikiwise.icns` resource in the Electron main process.
- Derive an Electron `NativeImage` from the icon's embedded PNG payload so the macOS Dock API can load it reliably.
- Apply that icon to the macOS Dock/runtime app via Electron's native dock API before windows or runtime audit work begin.
- Use the same derived native image when creating the BrowserWindow where Electron supports a window icon option.
- Add static tests that lock the native Swift source reference and Electron runtime icon wiring.
- Preserve existing packaged `.app` icon behavior and release-signing gates.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-native-shell-parity`: Runtime app icon branding now matches the native SwiftUI app icon behavior.
- `electron-native-parity-roadmap`: Roadmap records runtime app icon parity as a final shell-branding gap closure while preserving release gates.

## Impact

- Affected files: Electron main process source, native shell parity tests, and OpenSpec native shell/roadmap specs.
- No dependency changes.
- No change to packaged `.app` metadata, signing, notarization, or DMG release flow.
