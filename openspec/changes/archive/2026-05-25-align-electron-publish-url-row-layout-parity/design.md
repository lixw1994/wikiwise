## Context

The SwiftUI publish sheet lays out the URL row as `https://`, a plain monospaced `TextField` capped at `maxWidth: 200`, `.wiki-wise.com`, then a `Spacer()` before the fixed 16x16 availability indicator. Electron already renders the same pieces, but its grid lets the input stretch and does not reserve a spacer before the indicator.

## Goals / Non-Goals

**Goals:**

- Match the native URL row structure: prefix, capped subdomain field, suffix, flexible spacer, trailing 16x16 indicator.
- Keep the existing markup and publish state behavior stable.
- Add regression coverage that detects loss of the native max-width/spacer layout.

**Non-Goals:**

- Change availability state semantics or hint copy.
- Change publish dialog actions, IPC calls, or subdomain sanitization.
- Change native SwiftUI code.

## Decisions

- Use CSS grid columns to mirror the SwiftUI row instead of adding extra DOM. The existing four semantic children can stay in place while CSS reserves an empty flexible spacer column.
- Set the indicator to a fixed trailing grid column so it stays at the row edge while the subdomain input remains capped at 200px.
- Keep the row typography and colors unchanged for this slice.

## Risks / Trade-offs

- CSS grid is not SwiftUI layout, so pixel output can still vary slightly by platform font metrics. Mitigation: lock the structural constraints that matter for parity: capped subdomain width, flexible spacer, and fixed trailing indicator.
