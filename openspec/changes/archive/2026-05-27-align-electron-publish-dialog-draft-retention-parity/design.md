## Context

Native publish state is stored in SwiftUI `@State` values: `pendingSubdomain` and `subdomainAvailability`. For first publish (`publishConfig == nil`), the toolbar action only sets `showPublishConfirm = true`. The sheet then runs `onAppear`, generating `Publisher.randomSubdomain(wikiName:)` only if `pendingSubdomain.isEmpty`. Canceling the sheet only hides it, leaving the draft and availability state in memory for the next open.

Electron stores equivalent state in the renderer as `publishSubdomain` and `publishAvailability`, but `openPublishDialog()` currently assigns `state.publishSubdomain = config?.published ? config.subdomain : (config?.suggestedSubdomain ?? "")` and resets unpublished availability to `unknown` on every open. That makes first-publish reopen behavior diverge from native by discarding a user's canceled draft.

## Goals / Non-Goals

**Goals:**

- Preserve unpublished publish-dialog draft subdomain and availability state across Cancel/reopen.
- Generate an initial suggested subdomain when the draft is empty.
- Continue checking availability for newly inserted generated candidates.
- Continue resetting published-project dialog state from saved publish config.

**Non-Goals:**

- Changing the shared random subdomain generator.
- Changing publish/unpublish network behavior or saved `publish.json` semantics.
- Adding project-bound draft persistence beyond native in-memory renderer state.
- Changing publish dialog copy, visual styling, or keyboard shortcuts.

## Decisions

- Branch `openPublishDialog()` by published state.
  Published config should continue to override the draft with the saved subdomain and `owned` availability, matching native's already-published toolbar branch.

- Only seed unpublished drafts when empty.
  For unpublished projects, Electron should assign the suggested subdomain only when `state.publishSubdomain` is empty. Otherwise it should preserve the current draft and availability, matching native `onAppear`.

- Gate the automatic availability check to newly seeded drafts.
  Native schedules availability work when `pendingSubdomain` changes. Electron should continue to schedule the debounced check when it inserts a generated candidate, but reopening with an existing draft should not restart or reset availability solely because the dialog opened.

## Risks / Trade-offs

- Renderer draft state is not project-scoped, matching the current native `@State` lifetime but potentially preserving a canceled draft across project switches. Mitigation: this change intentionally follows native behavior instead of adding stronger scoping.
- Static source tests cannot simulate every dialog cadence. Mitigation: retain existing publishing runtime audit coverage and full package/runtime verification for the slice.
