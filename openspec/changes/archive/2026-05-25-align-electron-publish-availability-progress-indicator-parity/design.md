## Context

The native SwiftUI publish sheet uses `ProgressView().controlSize(.small)` in the 16x16 availability indicator slot while a subdomain check is in flight. Electron currently reuses the same slot but renders a literal ellipsis for `checking`, so the user sees punctuation rather than a native-like activity indicator.

## Goals / Non-Goals

**Goals:**

- Render `checking` as a small spinner inside the existing fixed 16x16 indicator slot.
- Keep the current state machine, availability copy, colors, and non-checking indicator states unchanged.
- Add regression coverage proving Electron no longer uses visible text punctuation for the checking indicator.

**Non-Goals:**

- Replace the existing success, failure, or warning indicator glyphs.
- Change availability polling, validation, debounce timing, or IPC behavior.
- Change native SwiftUI code.

## Decisions

- Use CSS for the spinner rather than an image or SVG asset. This keeps the renderer lightweight and avoids adding a new resource pipeline for a single native-like progress affordance.
- Keep `availabilityIndicatorText()` as the renderer mapping for non-checking states, but return empty text for `checking`; CSS owns the visual activity indicator for that state.
- Use a `::before` pseudo-element for the spinner so the existing HTML slot remains stable and the 16x16 layout does not shift.

## Risks / Trade-offs

- CSS animation is not the exact AppKit `ProgressView` renderer. Mitigation: keep the size, non-text behavior, and muted native-style affordance aligned with the SwiftUI slot.
- A future text fallback could reintroduce the ellipsis. Mitigation: add source-level regression coverage rejecting `case "checking": return "…"` for the indicator.
