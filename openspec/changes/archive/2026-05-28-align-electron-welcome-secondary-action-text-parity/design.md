## Context

SwiftUI renders the no-folder "Open Existing Folder" welcome button as a plain bordered action whose label stack uses `Color.sidebarSelectedText`. Electron reuses the shared `.secondary-action` rule for that button, so the welcome action inherits `--color-control-text`, which is appropriate for generic controls but softer than the native welcome foreground.

## Goals / Non-Goals

**Goals:**
- Match the native welcome secondary action text/icon foreground with `--color-sidebar-selected-text`.
- Keep the shared `.secondary-action` color unchanged for non-welcome controls.
- Preserve welcome action symbol metadata, labels, width, padding, border, background, and existing click behavior.
- Add source-backed regression coverage that ties the Electron override to the SwiftUI welcome button styling.

**Non-Goals:**
- Change native SwiftUI source.
- Change the primary welcome action, other secondary dialog buttons, or project toolbar controls.
- Change welcome layout, line spacing, native-symbol drawing, window chrome, packaging, or release workflows.

## Decisions

- Add a narrow `.welcome-action.secondary-action` CSS override after the base welcome action layout rule. This keeps specificity local to the no-folder welcome screen while preserving the shared secondary button rule for other UI.
- Assert that `.secondary-action` still uses `--color-control-text`, so future fixes do not silently broaden the welcome-specific change.
- Keep the existing custom native-symbol CSS untouched because icon geometry and layout already have dedicated coverage.

## Risks / Trade-offs

- Source assertions do not prove final pixel colors in a live window. Mitigation: keep the change token-based, retain runtime audit coverage, and verify the full Electron test suite and runtime audit after implementation.
