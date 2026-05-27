## Context

`FolderIcon` computes `s = canvasSize.width / 14.0` and draws the native icon path with `context.stroke(..., lineWidth: 0.8 * s)`. The file tree renders `FolderIcon(size: 13, ...)`, so the native stroke width is `0.8 * 13 / 14 = 0.742857...` px.

Electron currently uses CSS `border: 1px solid ...` for both `.tree-folder-icon` and `.tree-folder-icon::before`. That keeps the right colors but is visually heavier than the native scaled stroke.

## Goals / Non-Goals

**Goals:**
- Match native folder body and tab stroke width at 0.74px.
- Preserve existing icon size, special dot geometry, colors, and row behavior.
- Keep special `raw` and `site` folders using the raw stroke color with the same stroke width.

**Non-Goals:**
- Replace the CSS folder icon with a Canvas or SVG path.
- Change folder icon width/height, dot geometry, row spacing, typography, selected file styling, or expansion behavior.
- Revisit broader file-tree rendering.

## Decisions

- Use `border: 0.74px solid ...` on `.tree-folder-icon` and `.tree-folder-icon::before`, matching the native scaled line width rounded to two decimal places.
- Keep `border-bottom: 0` on the tab pseudo-element so the CSS folder tab remains connected to the body.
- Add regression coverage that checks native `lineWidth: 0.8 * s` and the Electron CSS border width.

## Risks / Trade-offs

- Subpixel borders may render differently across display scales, but Chromium supports them and this is closer to SwiftUI's scaled drawing than a whole-pixel border.
- The CSS icon remains a geometric approximation of the native path; this slice only addresses stroke weight.

## Migration Plan

Patch only folder-icon border widths and keep the test in the file-tree visual parity suite. Rollback is limited to the two border declarations plus the associated test/spec delta.

## Open Questions

None.
