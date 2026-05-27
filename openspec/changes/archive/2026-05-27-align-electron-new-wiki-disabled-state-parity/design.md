## Context

The native new-wiki sheet builds its action row with `Button("Cancel")`, `Button("Create")`, `.keyboardShortcut(.defaultAction)`, and one disabled rule: `newWikiName.trimmingCharacters(in: .whitespaces).isEmpty`. The native location text is `Text(newWikiLocation?.path ?? "~/wikis")`.

Electron added `state.isCreatingWiki` for async request safety, then reflected that state directly into disabled controls. That prevents duplicate submissions, but it also changes the visible dialog behavior compared with the native synchronous SwiftUI flow.

## Decision

Keep `state.isCreatingWiki` as an internal guard inside `createNewWiki()` and `closeNewWikiDialog()`, but stop using it to visibly disable the dialog controls during render. `renderNewWikiDialog()` will:

- use `state.newWikiLocation || "~/wikis"` for the location label display and metadata;
- keep the name field, choose button, and cancel button enabled in the visible sheet state;
- disable `Create` only when `state.newWikiName.trim().length === 0`;
- keep the `Create` label unchanged.

The create action will still require a real `state.newWikiLocation` before invoking main-process scaffold creation, matching the native `guard let location = newWikiLocation else { return }` safety guard.

## Alternatives Considered

- Remove `state.isCreatingWiki` entirely. Rejected because Electron's create flow is asynchronous and can receive duplicate events before the first request resolves.
- Keep the visible busy-disabled controls as a web safety improvement. Rejected because the migration goal requires native parity unless a later OpenSpec change explicitly accepts a deviation.

## Risks

- If the default location IPC fails, the dialog can show the native fallback label and enable `Create` once the name is non-empty, but the create action remains a guarded no-op until a real location is selected. This mirrors the native optional-location guard and is preferable to exposing a non-native disabled rule.
