## Context

SwiftUI `FolderIcon` draws the native project-browser folder glyph with a Canvas path in 14-by-12 coordinates, including curved corners, tab geometry, adaptive fill/stroke colors, native scaled stroke width, and an optional special-folder center dot. Electron currently uses CSS borders and pseudo-elements to approximate the same icon, which preserves the rough dimensions but not the actual Paper SVG path.

## Goals / Non-Goals

**Goals:**
- Render Electron folder icons with the same 14-by-12 path commands as native `FolderIcon`.
- Keep the existing 13px rendered width, 12/14 height ratio, native scaled stroke width, special folder colors, and special center dot geometry.
- Preserve folder row layout, accessibility-hidden icon semantics, row typography, indentation, selection, and expansion behavior.
- Keep the implementation dependency-free inside the existing renderer/CSS files.

**Non-Goals:**
- Change native SwiftUI source.
- Change file-tree behavior, sorting, expansion, selection, or tooltips.
- Replace other icons or introduce a reusable icon framework.
- Change packaging, release, watcher, or compiler behavior.

## Decisions

- Use inline SVG inside the existing `.tree-folder-icon` span. SVG preserves exact path commands without introducing external assets, and keeps the icon accessible as a decorative child of the hidden span.
- Use `viewBox="0 0 14 12"` and render the SVG at 13px by 11.14px. This lets `stroke-width="0.8"` scale to the same `0.8 * 13 / 14` rendered stroke width as native Canvas.
- Style `.tree-folder-shape` and `.tree-folder-dot` through CSS variables so existing light/dark and special-folder colors continue to flow from the palette.
- Replace the visible CSS pseudo-tab approximation with SVG shape/dot rules. The wrapper keeps fixed dimensions and flex sizing so row layout stays unchanged.

## Risks / Trade-offs

- SVG source assertions do not prove browser rasterization pixel-perfectly. Mitigation: retain runtime audit coverage and source-backed geometry/stroke/path tests.
- Changing icon markup could affect runtime audit selectors. Mitigation: preserve the `.tree-folder-icon` wrapper class and special-folder classes.
