## Context

The native SwiftUI new-wiki sheet renders the location `Choose…` control as a default sheet button inside the location row. The Electron renderer still uses `secondary-action compact`, which is a shared branded modal style also used outside the native sheet.

## Goals / Non-Goals

**Goals:**
- Move the Electron new-wiki `Choose…` control onto scoped native sheet button classes.
- Preserve the existing `choose-new-wiki-location` ID, label, and location chooser IPC behavior.
- Keep shared `secondary-action` styling untouched for welcome, publish, unpublish, feedback, and other non-new-wiki controls.

**Non-Goals:**
- Change the location selection flow, default wiki location, or scaffold creation behavior.
- Rebuild the modal system or change release/signing/package scripts.

## Decisions

- Reuse the scoped `.new-wiki-button` sheet button chrome and add a small `.new-wiki-choose-button` hook for location-row placement.
  - Rationale: The chooser is visually part of the same native sheet surface as Cancel/Create, but a dedicated hook keeps future row-specific alignment changes localized.
  - Alternative considered: Leave `secondary-action compact` in place; rejected because it keeps the chooser visually tied to non-sheet modal actions.
- Keep the element ID and text unchanged.
  - Rationale: Existing renderer handlers bind to the ID, and the native label already matches.

## Risks / Trade-offs

- Static CSS cannot exactly reproduce OS-level default button rendering. Mitigation: scope the control to native sheet chrome and preserve behavior rather than claiming pixel-perfect AppKit drawing.
- Reusing `.new-wiki-button` could affect row width if the class changes later. Mitigation: the dedicated `.new-wiki-choose-button` class gives the row an explicit override point.
