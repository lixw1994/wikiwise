## Why

Electron currently resets Markdown file selections to WIKI mode, while the native SwiftUI app preserves the current FILE/WIKI detail mode when navigating between Markdown files. This creates a visible interaction mismatch for users who read or edit multiple Markdown files in source mode.

## What Changes

- Preserve the current Electron FILE/WIKI detail mode when selecting a Markdown file after the app is already in a project/detail session.
- Keep the native initial WIKI mode for first project open, created wiki home selection, and standalone Markdown fallback behavior.
- Add regression coverage that cites the Swift `navigateTo(_:)` behavior and prevents future Markdown selection resets.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-compiler-preview`: Add a requirement that Markdown file selection preserves the current detail mode after initial app/project setup.
- `electron-native-parity-roadmap`: Track this parity correction as a final native interaction gap closure phase.

## Impact

- `apps/electron/src/renderer/renderer.js`
- Electron renderer tests covering compiler/preview mode behavior
- OpenSpec compiler-preview and native parity roadmap specs
