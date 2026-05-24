# Change: Align Electron Toolbar Title Offset Parity

## Why
The SwiftUI macOS toolbar compensates the centered project title when the left sidebar is visible:

```swift
.offset(x: sidebarVisibility == .all ? -(leftSidebarWidth / 2) : 0)
```

Electron currently centers the project title across the full window regardless of left-sidebar visibility. With the sidebar open, this leaves the title visibly farther right than the native app.

## What Changes
- Add an Electron toolbar title offset that mirrors the native left-sidebar compensation.
- Update the renderer to measure the visible left sidebar and set a toolbar-title offset of `-(leftSidebarWidth / 2)`.
- Reset the offset to `0` when the left sidebar is hidden.
- Extend runtime parity audit evidence to record the toolbar title offset before hiding the left sidebar and after restoring it.

## Impact
- Moves Electron opened-project chrome closer to native pixel parity without changing project navigation or sidebar hide/show behavior.
- Uses existing layout state and CSS variables; no new dependency is needed.

## Out of Scope
- Changing left-sidebar toggle visibility or replacing Electron's explicit hide/show control with a native split-view toolbar control.
- Exact SF Symbol rendering or signed/notarized release completion.
