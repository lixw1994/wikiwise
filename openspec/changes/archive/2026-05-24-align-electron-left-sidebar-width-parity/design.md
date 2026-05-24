# Design: Electron Left Sidebar Width Parity

## Native Reference
The native sidebar uses:

```swift
.navigationSplitViewColumnWidth(min: 110, ideal: 200, max: 360)
```

The Electron left sidebar should use the same constraints:

- default/ideal: `200px`
- minimum: `110px`
- maximum: `360px`

## Electron Layout
Introduce a `--left-sidebar-width` CSS variable on `.project-shell`:

```css
--left-sidebar-width: 200px;
grid-template-columns: var(--left-sidebar-width) minmax(0, 1fr) var(--right-sidebar-width);
```

The hidden-left-sidebar layouts continue to remove the left column. When the sidebar is restored, the CSS variable still holds the previous width.

## Renderer State
Add left sidebar width state:

```js
leftSidebarWidth: 200,
leftSidebarResizeDrag: null
```

Add helpers:

- `clampLeftSidebarWidth(width)` -> `110...360`
- `applyLeftSidebarWidth(width)` -> writes `--left-sidebar-width`, updates toolbar title offset, and refits the terminal
- `startLeftSidebarResize(event)`
- `updateLeftSidebarResize(event)`
- `endLeftSidebarResize(event)`

The resize gesture mirrors the right-sidebar implementation but grows as the pointer moves right.

## Runtime Audit
The audit will simulate a drag on `#left-sidebar-resize-handle`, record:

- handle presence
- native min/ideal/max constraints
- initial default width
- resized width
- title offset after resize

Project scenarios fail if:

- default width is not `200`
- handle is missing
- drag does not change the width
- resized width falls outside `110...360`
- title offset after resize is not negative half of the resized width

## Risks
- The handle is web-rendered rather than the system split-view divider, but the constraints and interaction match the native behavior more closely than the fixed column.
- Persistence is intentionally deferred; SwiftUI does not currently persist `leftSidebarWidth` explicitly in app settings.
