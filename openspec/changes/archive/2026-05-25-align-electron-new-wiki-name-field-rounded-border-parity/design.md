## Context

The native SwiftUI new-wiki sheet renders the wiki name entry as `TextField("My Wiki", text: $newWikiName).textFieldStyle(.roundedBorder)`. The Electron renderer currently uses only the shared `.text-input` class, whose padding and inherited font are tuned for broader form usage rather than the denser native sheet field.

## Goals / Non-Goals

**Goals:**
- Add a scoped Electron class for the new-wiki name input that mirrors the native rounded-border text field density.
- Preserve the existing `new-wiki-name` ID, `My Wiki` placeholder, input state handling, and Create enablement behavior.
- Leave shared `.text-input` styling intact for publish and other non-new-wiki fields.

**Non-Goals:**
- Change wiki name validation, slug generation, scaffold creation, or IPC behavior.
- Change Swift native code, release scripts, signing, or packaging behavior.

## Decisions

- Keep `.text-input` as the base class and add `.new-wiki-name-input` as a scoped override.
  - Rationale: The field still behaves like a normal text input, but the new-wiki sheet needs its own visual density.
  - Alternative considered: Change `.text-input` globally; rejected because publish subdomain and other fields already rely on the shared styling.
- Use fixed control density tokens in CSS rather than JavaScript.
  - Rationale: This is static chrome parity and should not add runtime behavior.

## Risks / Trade-offs

- Native AppKit text field metrics vary by OS and accessibility settings. Mitigation: match the visible rounded-border treatment and compact density without claiming exact system drawing.
- A scoped class can drift from `.text-input` future fixes. Mitigation: keep `.text-input` as the base and override only the native-sheet-specific dimensions and font.
