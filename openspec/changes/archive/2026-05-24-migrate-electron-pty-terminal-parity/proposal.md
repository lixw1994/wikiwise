## Why

Electron currently exposes the right sidebar terminal as a basic spawned shell with text transcript output and a separate line-input control. The native macOS app uses SwiftTerm's `LocalProcessTerminalView`, so PTY behavior, ANSI rendering, direct keyboard input, resizing, and full-screen terminal programs remain a blocker for "same as native" parity.

## What Changes

- Replace the Electron terminal backend with a PTY-backed session rooted at the opened project.
- Replace the renderer `<pre>` transcript plus command input with an embedded terminal emulator surface that supports ANSI output, cursor movement, selection, direct keyboard input, and resize events.
- Preserve the narrow preload IPC bridge while adding resize and lifecycle contracts needed by a PTY.
- Update runtime audit/tests/specs to prove Electron no longer defers PTY-grade terminal parity.
- Keep the native SwiftTerm implementation unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-right-sidebar-terminal`: Upgrade the Terminal tab requirement from basic shell exchange to PTY-grade terminal parity.
- `electron-native-parity-roadmap`: Record terminal parity as a final gap closure phase while leaving signed/notarized release execution as the remaining distribution gate.

## Impact

- Affected code: Electron main/preload/renderer terminal lifecycle, terminal markup/styles, Electron tests, runtime audit script, package manifests, and OpenSpec specs.
- New Electron dependencies are expected for PTY and terminal emulation.
- Packaging/release scripts may need to include native Electron modules if the PTY dependency ships native binaries.
