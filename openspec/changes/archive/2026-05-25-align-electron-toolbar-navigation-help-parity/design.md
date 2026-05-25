## Context

The native SwiftUI project toolbar sets Back and Forward help text with shortcut hints:

- `Go Back (⌘[)`
- `Go Forward (⌘])`

Electron already has Back and Forward toolbar buttons and matching menu accelerators, but the static toolbar markup only exposes `Go Back` and `Go Forward`. That makes the hover/accessibility help less informative than the native app.

## Goals / Non-Goals

**Goals:**

- Match native Back and Forward toolbar help text exactly.
- Expose the same text through both browser tooltip (`title`) and accessibility label (`aria-label`).
- Preserve current disabled-state handling and navigation command wiring.

**Non-Goals:**

- No changes to menu accelerators or File menu order.
- No changes to history state transitions.
- No changes to toolbar visual layout.

## Decisions

- Update the static Back/Forward button markup because these labels are not state-dependent.
- Add `aria-label` attributes alongside `title` so icon-only controls retain the native help text for assistive technology.
- Add a source-level parity test that checks the SwiftUI `.help(...)` strings and the Electron markup together.

## Risks / Trade-offs

- This is a small markup-only parity slice; it improves visible and accessible toolbar help without exercising runtime navigation. Existing menu/history tests continue to cover behavior.

## State Model

No state changes. Existing `backHistory` and `forwardHistory` disabled-state rendering remains unchanged.

## Migration Plan

1. Add a failing native-shell parity test for Back/Forward toolbar help labels.
2. Update Electron toolbar markup.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
