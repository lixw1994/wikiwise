## Context

Native publish dialog state lives in `pendingSubdomain` and `subdomainAvailability`. After `Publisher.unpublish(projectRoot:)` succeeds, `performUnpublish()` sets `publishConfig = nil`, clears `pendingSubdomain`, and resets `subdomainAvailability` to `.unknown`. That means the next first-publish sheet starts from an empty draft and lets `onAppear` generate a fresh candidate.

Electron now preserves unpublished first-publish drafts across Cancel/reopen for native parity. That makes the unpublish success reset important: if Electron does not clear `state.publishSubdomain`, opening the publish dialog after unpublishing can reuse the old published subdomain as if it were an intentional unpublished draft.

## Goals / Non-Goals

**Goals:**

- Clear `state.publishSubdomain` after successful unpublish.
- Keep `state.publishAvailability = "unknown"` after successful unpublish.
- Preserve native-like confirmation dismissal before the unpublish request.
- Preserve the existing publish config refresh and toolbar busy behavior.

**Non-Goals:**

- Changing failed unpublish behavior.
- Changing first-publish draft retention after ordinary Cancel.
- Changing publish config loading, publish result feedback, or unpublish service behavior.

## Decisions

- Reset the draft only after successful unpublish.
  Native clears `pendingSubdomain` in the success branch, not when opening or canceling the unpublish confirmation.

- Keep the reset in the renderer success path.
  The stale draft is renderer state, so the smallest parity fix is to clear it next to the existing `publishAvailability = "unknown"` assignment after `refreshPublishConfig()`.

## Risks / Trade-offs

- A user who intentionally wants to republish to the same subdomain after unpublishing will receive a fresh generated candidate instead of the previous one. That is the native behavior and is therefore desired for this migration.
- Static source tests prove the native/Electron state-reset contract, while runtime audit continues to cover the broader unpublish feedback flow.
