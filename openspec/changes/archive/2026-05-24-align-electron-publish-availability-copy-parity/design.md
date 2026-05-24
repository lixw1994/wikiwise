## Context

SwiftUI maps publish availability hints through a `switch` in `publishConfirmSheet`:

- `taken`: `This name is already taken. Try another.`
- `invalid`: `3–48 characters, letters, numbers, and hyphens only.`
- `owned`: `You already own this name.`
- default, including available/checking/unknown: `Anyone with this link can view your wiki.`

Electron currently has the same state names, but its `availabilityMessage()` returns `Available` for `available`, `Checking...` for `checking`, and `3-48...` for `invalid`.

## Goals / Non-Goals

**Goals:**

- Match native hint copy for all Electron availability states.
- Preserve the current state machine and publish button enablement.
- Guard the mapping with a targeted structural test.

**Non-Goals:**

- No visual indicator/spinner parity.
- No publish API or service changes.
- No CSS/layout changes.

## Decisions

- Keep `availabilityMessage()` as the single renderer mapping point and update only returned strings.
- Return the native default hint for `available`, `checking`, `unknown`, and fallback states because SwiftUI's default switch branch covers those cases.
- Preserve `canPublish()` using `available` and `owned`, so changing visible text does not affect publish eligibility.

## Risks / Trade-offs

- Users no longer see the literal word `Available`, matching native behavior but relying on the publish button enabled state and current color styling for additional feedback.
- This remains a source-level parity test, not a rendered runtime check; existing runtime audit can continue to focus on broader publish/opened-project behavior.

## State Model

No state changes. Existing `publishAvailability` values remain `unknown`, `checking`, `available`, `owned`, `taken`, and `invalid`.

## Migration Plan

1. Add a failing publishing test for the native availability hint mapping.
2. Update `availabilityMessage()` return strings.
3. Run targeted and full validation.
4. Archive the change.

## Open Questions

None.
