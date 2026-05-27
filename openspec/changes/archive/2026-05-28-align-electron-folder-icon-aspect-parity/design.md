## Context

`FolderIcon` draws the native sidebar folder icon from a 14-by-12 Paper SVG coordinate system. The file tree calls `FolderIcon(size: 13, ...)`, and the icon frame uses `.frame(width: size, height: size * (12.0 / 14.0))`. For special `raw` and `site` folders, the native center dot uses a `3.0 * s` diameter and is centered at `(7.0 * s, 7.0 * s)` where `s = size / 14.0`.

Electron already renders folder and special-folder markers, but `.tree-folder-icon` uses `height: 11px` instead of the native `11.14px` aspect, and the special marker uses a fixed 3px dot positioned from the CSS box center rather than the native scaled SVG coordinate center.

## Goals / Non-Goals

**Goals:**
- Match native folder icon frame aspect for the existing 13px file-tree icon.
- Match native special-folder dot diameter and center point for `raw` and `site`.
- Preserve existing colors, width, row layout, folder labels, and expansion behavior.

**Non-Goals:**
- Replace the CSS icon with an inline SVG.
- Change file-tree data loading, row indentation, selected-row styling, or folder tooltip copy.
- Add new special folder names.

## Decisions

- Use `height: 11.14px` for `.tree-folder-icon`, matching `13 * 12 / 14` rounded to two decimals.
- Use a `2.79px` special-folder dot diameter, matching `13 / 14 * 3`.
- Position the special-folder dot at `left: 6.5px; top: 6.5px` with a centered transform, matching `13 / 14 * 7` for both axes.
- Keep the current CSS implementation and colors because this change is narrowly about native geometry.

## Risks / Trade-offs

- Subpixel CSS values can render slightly differently by display scale, but Chromium and SwiftUI both support subpixel layout and this is closer to the native scaled geometry than whole-pixel approximations.
- The CSS shape is still an approximation of the native path. Exact path parity can remain a separate visual slice if needed.

## Migration Plan

Patch only folder-icon CSS geometry and keep the regression coverage in the existing file-tree parity test suite. Rollback is limited to the CSS values plus the associated test/spec delta.

## Open Questions

None.
