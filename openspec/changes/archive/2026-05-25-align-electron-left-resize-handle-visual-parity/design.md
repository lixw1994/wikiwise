## Overview

SwiftUI uses `NavigationSplitViewColumnWidth(min: 110, ideal: 200, max: 360)` for the file sidebar and overlays a 1px trailing divider with `Color.dividerGray`. The Electron shell already implements matching width constraints through a 5px absolute-positioned resize hit target, but its hover/focus-visible state currently paints `--color-resize-hover`.

## Decisions

- Keep `.left-sidebar-resize-handle` positioned on the sidebar trailing edge with `width: 5px`, transparent base background, `cursor: col-resize`, and `touch-action: none`.
- Change the hover/focus-visible rule to stay transparent instead of drawing `--color-resize-hover`.
- Preserve the existing `.sidebar` 1px right border as the visible native divider equivalent.
- Leave left-sidebar width state, hide/show behavior, toolbar-title offset, file-tree rendering, and right-sidebar behavior unchanged.

## Alternatives Considered

- Removing the hover/focus selector entirely. Keeping an explicit transparent rule gives the parity tests a stable contract and prevents generic resize-hover styling from reappearing on the left sidebar.

## Validation

- Add a targeted Node test that reads the native SwiftUI source and Electron CSS, then verifies the Electron left resize handle keeps its 5px hit target while hover/focus-visible remain transparent.
- Run the existing file-tree expansion parity test file as the red/green target.
- Run full repository verification and OpenSpec strict validation before committing.
