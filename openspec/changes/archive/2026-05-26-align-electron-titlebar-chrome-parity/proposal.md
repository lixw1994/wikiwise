## Why

The native SwiftUI app clears the visible window title and removes the titlebar separator after launch, making the toolbar read as the top app chrome. The Electron shell still uses default BrowserWindow titlebar behavior, leaving a native-parity gap in the most visible window surface.

## What Changes

- Add Electron main-window titlebar chrome configuration that hides the visible titlebar title while preserving the product-facing `Wikiwise` window/document identity.
- Configure macOS traffic-light placement and draggable toolbar regions so the Electron welcome and project toolbars behave like native titlebar toolbar surfaces.
- Add toolbar leading inset styling so controls and welcome branding do not sit under the macOS window controls.
- Extend static parity coverage for Swift titlebar separator/title behavior and Electron BrowserWindow/CSS equivalents.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-native-shell-parity`: add native titlebar chrome parity requirements for visible title suppression, separator removal, draggable toolbar regions, and traffic-light-safe toolbar layout.
- `electron-native-parity-roadmap`: record the archived titlebar chrome parity phase and remaining final release evidence.

## Impact

- Affects `apps/electron/src/main/main.js` BrowserWindow creation.
- Affects `apps/electron/src/renderer/styles.css` toolbar drag/inset behavior.
- Affects native shell parity tests and OpenSpec native shell/roadmap specs.
