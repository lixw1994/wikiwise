## Context

The native `publishConfirmSheet` uses `HStack(spacing: 0)` for the editable URL row. Electron represents the same row with a CSS grid and currently sets `gap: 4px`, adding spacing that the native row does not apply.

## Goals / Non-Goals

**Goals:**

- Match the native zero-spacing URL row in Electron.
- Preserve existing grid tracks, input max width, row padding, rounded background, 13px monospaced text, and 16px availability indicator.

**Non-Goals:**

- Changing the publish dialog panel gap.
- Changing row padding or rounded background chrome.
- Changing the subdomain input width, font, or availability indicator behavior.

## Decisions

- Set `.publish-url-row { gap: 0; }`. The grid tracks already provide the input max width, flexible spacer, and fixed indicator width, so the extra CSS gap can be removed without changing layout structure.
- Cover the behavior with a source parity test that asserts native `HStack(spacing: 0)`, the Electron URL row `gap: 0`, and preserved grid columns.

## Risks / Trade-offs

- Prefix, input, and suffix sit tighter together than before. This is intentional because the native HStack supplies no inter-item spacing for this row.
