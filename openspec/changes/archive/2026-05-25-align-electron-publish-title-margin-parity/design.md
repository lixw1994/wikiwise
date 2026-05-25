## Context

The native `publishConfirmSheet` uses `VStack(alignment: .leading, spacing: 16)` to separate its direct content groups. Electron's `.publish-dialog` now matches that with `gap: 16px`, but `.modal-panel h2 { margin-bottom: 4px; }` still applies to the publish title and adds extra spacing after the heading.

## Goals / Non-Goals

**Goals:**

- Let the publish dialog title rely on the native 16px panel gap without extra title margin.
- Scope the margin override to `.publish-dialog h2`.
- Keep the shared `.modal-panel h2` margin for other dialogs.

**Non-Goals:**

- Changing publish title typography, which is already covered separately.
- Changing global heading styles.
- Changing publish dialog markup or behavior.

## Decisions

- Add `margin-bottom: 0` to `.publish-dialog h2`. This keeps the existing shared dialog heading spacing intact while removing the extra margin only for the native publish sheet equivalent.
- Cover the behavior with a source parity test that asserts the native `VStack` spacing, the publish dialog's 16px gap, the publish title's zero bottom margin, and the shared modal heading's 4px margin.

## Risks / Trade-offs

- The publish title-to-subtitle spacing becomes slightly tighter than the previous Electron rendering. This is intentional because the panel gap already provides the native spacing.
