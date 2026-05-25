## Context

SwiftUI renders availability feedback in two places: an inline 16x16 indicator in the subdomain row and hint text below the row. Electron already matches the hint text and state names, but it does not render the inline indicator.

## Goals / Non-Goals

**Goals:**
- Add an inline Electron availability indicator next to `.wiki-wise.com` in the publish subdomain row.
- Preserve existing availability hint copy and state dataset behavior.
- Mirror the native state mapping: checking progress, available/owned success, taken failure, invalid warning, unknown empty.

**Non-Goals:**
- Change availability request timing, debouncing, or service behavior.
- Replace the existing hint text below the input row.
- Add a new icon dependency.

## Decisions

- Add a small renderer-owned `<span>` for the indicator instead of overloading the existing hint paragraph. This mirrors the native layout separation between the row indicator and the hint text.
- Use text glyphs and CSS state colors for the indicator. This keeps the implementation dependency-free and testable while preserving the native meaning of each indicator state.
- Keep the indicator `aria-hidden` because the existing hint text already communicates the state to assistive technology.

## Risks / Trade-offs

- The checking indicator is a lightweight text marker rather than a platform spinner. The mitigation is that it occupies the native 16x16 indicator slot and the state is still represented visibly; a richer animated spinner can be a later visual-polish pass if needed.
