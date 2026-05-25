## Context

The native SwiftUI new-wiki sheet renders Cancel and Create as default sheet buttons with only keyboard shortcuts and disabled state applied. The Electron renderer currently reuses the shared `secondary-action` and `primary-action` classes, which are also used by custom publish and feedback dialogs and carry app-branded modal chrome.

## Goals / Non-Goals

**Goals:**
- Give the Electron create-new-wiki sheet its own scoped action button styles that better match native sheet controls.
- Preserve the existing button IDs, labels, Escape/Enter behavior, and Create disabled behavior.
- Keep shared modal action classes available for the non-new-wiki dialogs that already depend on them.

**Non-Goals:**
- Rebuild the dialog system or change modal lifecycle behavior.
- Change scaffold creation, filesystem IPC, native SwiftUI behavior, signing, packaging, or release workflow.

## Decisions

- Use new scoped renderer classes for the new-wiki Cancel/Create buttons instead of `primary-action` and `secondary-action`.
  - Rationale: The native sheet's action row is a different surface from branded publish/feedback modals, and scoped classes let parity continue without changing unrelated dialogs.
  - Alternative considered: globally change `primary-action` and `secondary-action`; rejected because it would alter non-new-wiki dialogs.
- Keep IDs and event wiring unchanged.
  - Rationale: The renderer behavior is already keyed by `cancel-create-new` and `confirm-create-new`, and the parity gap is visual chrome rather than flow logic.

## Risks / Trade-offs

- Native AppKit button rendering is OS/accent dependent, while Electron CSS is static. Mitigation: match the structural behavior and neutral/default sheet treatment without claiming pixel-perfect system control rendering.
- Styling scope could accidentally regress shared modals. Mitigation: add regression assertions that publish actions still use the shared primary/secondary classes.
