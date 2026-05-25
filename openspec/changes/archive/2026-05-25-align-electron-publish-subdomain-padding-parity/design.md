## Context

The native publish sheet's subdomain field is a SwiftUI `TextField` with `.textFieldStyle(.plain)` inside the URL row. Electron's `.publish-subdomain` already removes border, radius, and background, but it still applies `padding: 2px 0`, adding internal input inset on top of the row's native 8px padding.

## Goals / Non-Goals

**Goals:**

- Match the native plain text field by removing the Electron subdomain input's own padding.
- Preserve the URL row's 8px padding, zero item gap, 13px monospaced font, inherited input font, width constraints, and transparent borderless input chrome.

**Non-Goals:**

- Changing row padding or row chrome.
- Changing URL row font, spacing, or columns.
- Changing input behavior or availability validation.

## Decisions

- Set `.publish-subdomain { padding: 0; }`. The row itself supplies the native inset, so the input does not need additional internal padding.
- Cover the behavior with a source parity test that asserts native `.textFieldStyle(.plain)` and Electron zero input padding while preserving inherited font and transparent chrome.

## Risks / Trade-offs

- The input's text sits slightly tighter vertically than before. This is intentional because the row padding, not the plain text field, should provide the visual inset.
