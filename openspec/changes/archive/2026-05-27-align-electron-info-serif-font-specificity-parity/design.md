## Context

`Sources/Wikiwise/RightSidebar.swift` uses `Fraunces` for selected-document metadata values, directions text, and linked target rows. Electron previously styled those surfaces with a serif stand-in, but `.info-section p` has higher specificity than `.info-directions-callout`, so the directions paragraph can inherit monospaced paragraph typography at runtime even though the class rule contains the desired font declaration.

## Goals / Non-Goals

Goals:

- Ensure Electron INFO directions text uses the intended native serif styling after CSS cascade resolution.
- Keep INFO metadata values and linked rows aligned with the native serif intent by putting `Fraunces` first and `Georgia` as fallback.
- Cover the specificity relationship with a regression test so future CSS changes cannot silently reintroduce the mismatch.

Non-goals:

- Do not add remote font loading or new bundled font assets.
- Do not change INFO parsing, metadata formatting, linked target extraction, tab behavior, terminal behavior, or sidebar resizing.
- Do not change the native Swift app.

## Decisions

- Use a higher-specificity selector, `.info-section .info-directions-callout`, for directions text styling. This directly out-ranks `.info-section p` without removing the generic paragraph rule.
- Use `"Fraunces", Georgia, serif` for INFO serif surfaces. If Fraunces is unavailable in Electron, the existing Georgia fallback keeps the current robust rendering behavior.
- Keep the existing callout spacing, color, background, italic style, and leading accent strip unchanged.

## Risks / Trade-offs

- [Risk] Fraunces may not be installed on a user's machine. -> Mitigation: keep Georgia and generic serif fallbacks.
- [Risk] Increasing selector specificity could make later overrides harder. -> Mitigation: scope it only to the directions callout inside INFO sections.
- [Risk] Static CSS tests can miss actual cascade behavior. -> Mitigation: assert both the generic paragraph rule and the higher-specificity directions selector exist, and that the specific selector carries the native serif stack.
