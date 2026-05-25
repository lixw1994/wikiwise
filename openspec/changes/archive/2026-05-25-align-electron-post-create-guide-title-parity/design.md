## Context

The native post-create guide title `Text("Your wiki is ready")` uses `.font(.system(size: 20, weight: .medium, design: .serif))` and `.foregroundStyle(Color.sidebarSelectedText)`. Electron already has the right copy and container-level layout, but `.post-create-guide h2` still uses `22px` and has no scoped color override.

## Goals / Non-Goals

**Goals:**
- Match the native post-create guide title size, weight, serif family, and selected sidebar text color.
- Preserve the existing guide copy and container layout.
- Keep generic `h2` and non-guide title styling unchanged.

**Non-Goals:**
- Add native guide dividers, command-row chrome, seed option icons, or body typography in this slice.
- Change the new-wiki dialog, publish dialogs, or other non-guide surfaces.
- Introduce new runtime behavior.

## Decisions

- Update only `.post-create-guide h2`.
  - Rationale: The mismatch is scoped to the guide title and the existing selector already isolates this surface.
  - Alternative considered: changing global `h2` styling. That would risk changing dialogs and shell headings outside the post-create guide.
- Use `--color-sidebar-selected-text` for the title.
  - Rationale: It is the Electron token matching native `Color.sidebarSelectedText` in both light and dark appearances.

## Risks / Trade-offs

- The title still uses a web serif fallback rather than SwiftUI's exact system serif rendering -> keep the existing local serif-family approximation and focus this slice on the explicit size/color mismatch.
- Remaining guide body and command styling gaps stay open -> track those through later OpenSpec slices.
