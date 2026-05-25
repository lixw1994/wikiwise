## Context

The native `newWikiSheet` declares its default action as `Button("Create")`, with disabled behavior based only on an empty trimmed name. Electron already tracks an `isCreatingWiki` state to disable inputs during asynchronous scaffold creation, but it also changes the confirm button text to `Creating`.

The disabled state is useful for Electron's async main-process IPC path, but the label change is not native-identical.

## Goals / Non-Goals

**Goals:**

- Match the native `Create` action label exactly.
- Preserve the existing Electron duplicate-submit guard while creation is running.
- Add test coverage that compares SwiftUI source with Electron renderer source.

**Non-Goals:**

- No changes to scaffold helpers, IPC payloads, project loading, or watcher behavior.
- No modal styling changes.
- No changes to native Swift source.

## Decisions

- Keep `isCreatingWiki` in the disabled expression, but set `confirmCreateNewButton.textContent` to the static native `Create` label.
- Extend the existing new-wiki scaffold test file so dialog-copy parity remains beside other new-wiki assertions.
- Assert absence of `Creating` to catch regressions.

## Risks / Trade-offs

- Users will no longer see a textual progress label during the short create operation. This is the intended native parity trade-off; the disabled state still prevents repeated clicks.

## State Model

No state changes.

## Migration Plan

1. Add a failing new-wiki scaffold test for the native create action label.
2. Update the Electron renderer button label rendering.
3. Run targeted and full verification.
4. Archive the change.

## Open Questions

None.
