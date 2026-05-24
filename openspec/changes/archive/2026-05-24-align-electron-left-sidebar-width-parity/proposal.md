# Change: Align Electron Left Sidebar Width Parity

## Why
SwiftUI configures the file sidebar through `NavigationSplitView` with native width constraints:

```swift
.navigationSplitViewColumnWidth(min: 110, ideal: 200, max: 360)
```

Electron currently uses a fixed `260px` left column and does not expose native-like resizing. This diverges from the native project browser width, the split-view interaction, and toolbar-title offset behavior after user resizing.

## What Changes
- Replace the fixed Electron left sidebar width with a CSS variable using the native ideal width of `200px`.
- Add a left-sidebar resize handle with native min/ideal/max constraints of `110/200/360`.
- Preserve the current left-sidebar width while hiding and restoring the sidebar.
- Extend runtime parity audit evidence to simulate a left-sidebar drag and verify default width, resized width, constraints, and title offset consistency.

## Impact
- Brings the Electron file sidebar closer to native `NavigationSplitView` sizing and interaction.
- Reuses the existing toolbar-title offset behavior so the title tracks the resized sidebar width.
- Does not alter file tree ordering, selection, expansion, or project lifecycle behavior.

## Out of Scope
- Replacing Electron's explicit left-sidebar toolbar control with the system split-view toolbar affordance.
- Persisting sidebar width across app launches.
- Signed/notarized release completion.
