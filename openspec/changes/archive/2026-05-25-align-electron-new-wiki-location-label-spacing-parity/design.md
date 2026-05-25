## Context

The native SwiftUI new-wiki sheet places the `Location` label and its following `HStack` in a `VStack(alignment: .leading, spacing: 6)`. Electron represents the same grouping with a label and path inside the grid's left column, but `.location-path` currently uses `margin: 4px 0 0`, making the label-to-path gap tighter than native.

## Goals / Non-Goals

**Goals:**
- Align the Electron `Location` label-to-path gap with the native 6px sheet spacing.
- Preserve the location path's system font, muted color, one-line middle truncation, full-path metadata, and chooser behavior.

**Non-Goals:**
- Change the new-wiki panel's 20px section spacing, action row spacing, location chooser button chrome, path truncation logic, or scaffold behavior.
- Change publish dialog or unrelated form spacing.

## Decisions

- Adjust `.location-path` margin from `4px 0 0` to `6px 0 0`.
  - Rationale: `.location-path` is already scoped to the new-wiki location display, and its top margin is the Electron equivalent of the native label-to-row spacing.
  - Alternative considered: Rewrite the location markup into separate label and row siblings; rejected because it would increase churn for a spacing-only parity correction.

## Risks / Trade-offs

- Browser line-height and SwiftUI layout are not pixel-identical. Mitigation: use the explicit native spacing token and keep the existing row structure and behavior unchanged.
