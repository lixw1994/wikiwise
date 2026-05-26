## Why

The native SwiftUI app explicitly starts as a regular macOS application and activates itself on launch. Electron currently creates the app window without mirroring that startup activation behavior, leaving a subtle shell-parity gap around Dock/menu identity and foreground launch semantics.

## What Changes

- Add Electron main-process startup activation setup that mirrors `NSApplication.shared.setActivationPolicy(.regular)`.
- Bring the Electron app to the foreground on macOS startup using Electron's app focus API, matching native `activate(ignoringOtherApps: true)` intent.
- Apply the activation setup before runtime audit mode and normal window creation so both launch paths share the same shell behavior.
- Add static parity tests that lock the Swift startup behavior and Electron main-process wiring.

## Capabilities

### New Capabilities

### Modified Capabilities

- `electron-native-shell-parity`: Runtime startup activation now mirrors the native app's regular application activation behavior.
- `electron-native-parity-roadmap`: Roadmap records runtime activation parity as a final shell-branding/launch gap closure while preserving release gates.

## Impact

- Affected files: Electron main process source, native shell parity tests, and OpenSpec native shell/roadmap specs.
- No dependency changes.
- No change to renderer UI, packaged app metadata, signing, notarization, or DMG release flow.
