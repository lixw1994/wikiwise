## Context

The SwiftUI welcome view applies a window toolbar background and places a navigation toolbar item containing an italic `W` mark and `WikiWise` label. Electron already uses an in-renderer toolbar for opened projects, but the no-folder welcome state starts directly at the centered welcome content. Runtime screenshots therefore cannot prove parity for the native welcome toolbar chrome.

## Goals / Non-Goals

**Goals:**

- Render a welcome toolbar brand row before the centered no-folder content.
- Match the native `W` + `WikiWise` labels, spacing, color roles, and toolbar background.
- Add static and runtime audit coverage so missing toolbar chrome fails verification.

**Non-Goals:**

- Do not change opened-project toolbar controls, menu commands, or window packaging.
- Do not introduce a native Electron `BrowserWindow` toolbar; the existing renderer chrome pattern remains the migration surface.
- Do not change welcome create/open behaviors.

## Decisions

- Add a dedicated `#welcome-toolbar` inside the existing `#welcome` section.
  This keeps welcome chrome scoped to the no-folder state and avoids touching project toolbar state.
- Wrap the existing welcome body in `.welcome-content`.
  The toolbar gets a fixed first row while the body remains centered in the remaining viewport, mirroring SwiftUI's toolbar plus centered content.
- Extend `readDomEvidence` and welcome assertions in `scripts/audit-electron-runtime.mjs`.
  Runtime evidence should record the toolbar text, mark text, visibility, and bounding rectangles for `welcome-light` and `welcome-dark`.

## Risks / Trade-offs

- [Risk] Adding a toolbar row could shift the centered welcome content too far down. -> Mitigation: center the content in the remaining grid row and verify screenshots via runtime audit.
- [Risk] Project toolbar tests could accidentally match welcome toolbar selectors. -> Mitigation: use `welcome-toolbar-*` class names and keep project toolbar selectors unchanged.
