## Context

The native post-create guide is rendered by `postCreateGuide(wikiURL:)` in `ContentView.swift`. Its main content column uses `.padding(40)`, `.frame(maxWidth: 560, alignment: .leading)`, and the full guide surface uses `.background(Color.contentBg)`. Electron currently renders the same guide copy with `.post-create-guide` using `36px 44px` padding, `--color-detail-bg`, and no scoped 560px content column.

## Goals / Non-Goals

**Goals:**
- Match the native guide surface background token.
- Match the native 40px content inset.
- Constrain direct guide content to the native 560px leading-aligned column.
- Preserve existing guide copy, generated command text, dismiss behavior, and new-wiki scaffold flow.

**Non-Goals:**
- Add native guide dividers, command-row chrome, seed option icons, or button styling in this slice.
- Change publish, preview, terminal, or non-guide surfaces.
- Introduce new runtime behavior or dependencies.

## Decisions

- Change `.post-create-guide` directly rather than introducing extra wrapper markup.
  - Rationale: The existing section already represents the full guide surface and can carry the native inset/background.
  - Alternative considered: adding a nested wrapper to model the SwiftUI `VStack`. That would touch HTML and layout structure for a style-only parity adjustment.
- Add a scoped direct-child max-width rule for guide blocks, final paragraph, and dismiss button.
  - Rationale: It approximates the native `VStack` max width without constraining nested code blocks more broadly than necessary.

## Risks / Trade-offs

- The HTML still lacks the native divider and richer row structures -> this slice intentionally covers only the container-level parity and leaves remaining guide polish for later OpenSpec changes.
- Source-level tests do not measure rendered pixels -> keep assertions tied to the native SwiftUI declarations and the scoped Electron CSS.
