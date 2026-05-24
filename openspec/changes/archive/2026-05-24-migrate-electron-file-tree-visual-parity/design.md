## Context

SwiftUI renders each directory row with `FolderIcon`, a custom 14x12 path using olive tones for ordinary folders and brown tones plus a center dot for `raw` and `site`. Selected file rows use the existing selected background and italic text plus a leading 2px accent bar inset to the row indentation. Electron already has expandable tree behavior, but directory rows currently lack folder icons and selected file rows lack the accent bar.

## Goals / Non-Goals

**Goals:**
- Add native-like folder icon markup and CSS to Electron directory rows.
- Render special `raw` and `site` folders with a distinct icon tone and center dot.
- Add the selected-file leading accent bar without changing tree selection, expansion, or file loading behavior.
- Add runtime audit evidence for folder icons, special-folder marker, and selected accent presence.

**Non-Goals:**
- Change scan ordering, expansion semantics, lazy loading, or IPC.
- Add per-file document icons; the Swift tree only defines the custom folder icon and text treatment for files.
- Convert the tree to SVG assets on disk; CSS pseudo-elements are sufficient and keep packaging simple.

## Decisions

1. Use DOM spans for folder icon structure.

   Renderer directory rows will append `<span class="tree-folder-icon">` before the label. Special folders will add a class on the row/item, and CSS will draw the center dot with `::after`. This keeps the icon discoverable for static and runtime tests without adding external assets.

2. Use CSS border and pseudo-elements rather than inline SVG.

   The Swift icon path has rounded folder contours, but an exact path SVG in every row would add noisy markup. A small CSS folder glyph can match the native color, size, visual weight, and special dot while keeping tree rendering lightweight.

3. Render selected-file accent through CSS.

   `.tree-file-button.selected::before` will create the native 2px leading bar. The button already owns indentation through `--tree-depth`, so the pseudo-element can inset to `calc(22px + depth * 16px)` and stay aligned with nested rows.

4. Runtime audit captures presence, not pixel-perfect path geometry.

   The audit will verify that opened-project scenarios include folder icons, a special-folder marker, and a selected row accent marker. Screenshot artifacts remain the visual review evidence for exact appearance.

## Risks / Trade-offs

- [Risk] CSS-only folder icons may not be mathematically identical to Swift's Canvas path. -> Match native dimensions, colors, and special marker; retain screenshots for visual review.
- [Risk] A pseudo-element selected accent is hard to inspect directly. -> Add a stable `data-selected="true"` marker and runtime evidence based on selected row class plus computed pseudo-element content/width where possible.
- [Risk] Extra spans could disturb text overflow. -> Keep icon and disclosure fixed-width, and keep label in the existing ellipsis span.

## Migration Plan

1. Add static tests for folder icon markup, special-folder classes, selected accent CSS, and runtime audit fields.
2. Update tree rendering and CSS visual affordances.
3. Extend runtime audit evidence.
4. Run focused and full verification, archive the OpenSpec change, and commit.

Rollback removes the icon spans, CSS visual rules, and audit fields; existing tree behavior remains intact.

## Open Questions

None for this phase.
