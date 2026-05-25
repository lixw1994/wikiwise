## Context

The native SwiftUI new-wiki sheet renders `Text(newWikiLocation?.path ?? "~/wikis")` with `.font(.system(size: 12))` and muted sidebar text color. Electron currently applies the correct 12px size and middle truncation, but forces `ui-monospace, "SFMono-Regular", Menlo, monospace`, making the path stand out unlike the native sheet.

## Goals / Non-Goals

**Goals:**
- Make the Electron new-wiki location path inherit the sheet's system text font while keeping the native 12px size.
- Preserve one-line middle truncation, muted color, title/aria full-path metadata, and creation behavior.

**Non-Goals:**
- Change path truncation logic, location chooser behavior, scaffold creation, or IPC.
- Change unrelated publish, terminal, editor, or file tree typography.

## Decisions

- Remove the monospace font stack from `.location-path` instead of introducing a new class.
  - Rationale: `.location-path` is already scoped to the new-wiki dialog and carries the relevant path display behavior.
  - Alternative considered: Add a separate `.new-wiki-location-path` class; rejected because the existing selector is already narrowly named and only used by this surface.
- Keep the explicit `font-size: 12px`.
  - Rationale: The native SwiftUI view explicitly uses system size 12 for the path.

## Risks / Trade-offs

- System font rendering still depends on Electron/Chromium rather than AppKit. Mitigation: remove the incorrect monospace stack and keep size/color/truncation aligned with the native source.
