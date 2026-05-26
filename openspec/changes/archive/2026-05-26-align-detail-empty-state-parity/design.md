## Context

Native `ContentView.detail` renders a dedicated empty state when `selectedFileURL == nil && compiledFileURL == nil`. The view is centered in the detail pane, uses `VStack(spacing: 8)`, a light 32px `doc.text` symbol, 13px copy, muted sidebar text color, full available frame, and `Color.contentBg` background.

Electron's `renderDetail()` already computes the mutually exclusive detail surfaces: source editor, compiled preview, generated preview, and post-create guide. When none of those surfaces is active and there is no selected file, all detail surfaces are hidden, so the user sees a blank detail pane instead of the native empty placeholder.

## Goals / Non-Goals

**Goals:**

- Add static empty-state markup in the detail pane with native symbol metadata and copy.
- Add CSS that centers the empty state and mirrors native spacing, muted color, 32px light icon, 13px text, and content background.
- Update `renderDetail()` so the empty state is visible only when no guide, generated page, or selected file is active.
- Preserve existing editor, preview, generated preview, guide, save, toolbar, and right sidebar behavior.

**Non-Goals:**

- Changing open-project selection behavior or auto-selecting files.
- Changing editor/preview fallback rules.
- Changing hidden detail-header save chrome.
- Adding runtime audit coverage in this slice.

## Decisions

- Use a `<section id="detail-empty-state" class="detail-empty-state" hidden>` inside `.detail` so the placeholder participates in the same mutually exclusive renderer flow as the existing detail surfaces.
- Use a text symbol with `data-native-symbol="doc.text"` for parity evidence, matching the existing renderer pattern for native symbol metadata without introducing a new asset.
- Compute `shouldShowEmptyState = !showGuide && !hasGeneratedPage && !hasFile` in `renderDetail()` and toggle the section alongside the other surfaces.

## Risks / Trade-offs

- The symbol is an approximation in Electron text rendering rather than SF Symbols. The native-symbol metadata preserves the semantic mapping, and the visual surface still restores the missing placeholder state.
