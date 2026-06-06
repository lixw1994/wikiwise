## Context

Cloudflare Hub already stores page comments in D1, serializes public author profiles, renders threaded comments through the injected reader runtime, and has owner-only admin routes for invitations and member management. The `comments.status` column already accepts `hidden`, so moderation can be added without a schema migration.

The current reader comments endpoint returns every stored comment for a page. That is acceptable before moderation, but once owners can hide comments, normal reader-facing lists must stop returning hidden records. Owners still need a scoped way to review and restore hidden comments without leaving the wiki page.

## Goals / Non-Goals

**Goals:**

- Let signed-in owners hide and restore comments on the current wiki.
- Keep moderation scoped to the wiki hostname and existing comment ownership boundaries.
- Hide moderated comments from normal reader-facing comment lists.
- Provide an owner-only runtime path to review hidden comments and restore them.
- Preserve comment records and public author serialization without adding dependencies or D1 tables.

**Non-Goals:**

- Permanent comment deletion, audit history, reason codes, abuse reports, moderation queues, or bulk actions.
- Editing comment bodies or changing comment authors.
- Email or in-app notifications when a comment is hidden or restored.
- A standalone admin dashboard outside the injected Hub runtime.

## Decisions

1. Add owner-only admin comment routes.

   Use same-origin routes under `/_wikiwise/admin/comments` instead of expanding the public comments API. A `GET` route lists comments for a page with all moderation statuses for owners, and a targeted update route changes one comment to `hidden` or `visible`. These routes reuse `wikiFromRequestHost` and `authorizeWikiOwner` so the current wiki hostname remains the authorization boundary.

   Alternative considered: make `/_wikiwise/comments` return hidden comments when the requester is an owner. Keeping moderation on admin routes makes sensitive records easier to reason about and test.

2. Keep normal comment lists filtered.

   `/_wikiwise/comments` should return only reader-visible comments. Hidden comments are excluded for all normal readers, including owners using the normal endpoint. The owner runtime can call the admin endpoint when it needs moderation data.

   For threaded display, if a hidden parent is excluded, replies under that hidden parent should also be absent from the normal threaded list. This avoids rendering replies without their moderation context. The owner admin list can include the full thread with statuses.

3. Reuse `comments.status` for moderation.

   Hiding sets `status = 'hidden'`; restoring sets `status = 'visible'`. This intentionally does not preserve a pre-hide state such as `stale-anchor`, because the first moderation version is a simple visibility switch. Republish-time annotation reanchoring should not overwrite hidden comments; hidden records stay hidden until an owner restores them.

   Alternative considered: adding a separate moderation table or `moderation_status` column. That would support history and richer states, but it is unnecessary for the requested safety valve.

4. Keep the reader runtime lightweight.

   Owners see inline moderation actions near comments and a compact way to review hidden comments. Normal visitors and non-owner members do not receive moderation controls. After hide or restore, the runtime refreshes the comment surface so the current status is reflected without manual reload.

   The affected runtime lives inside `apps/cloudflare-hub/src/worker.js`; no Electron, scaffold, release, file watching, CodeMirror, or terminal surfaces are expected to change.

## Risks / Trade-offs

- Hidden parent hides visible replies in normal lists -> This is conservative and avoids orphaned replies; owners can still review the full thread through the admin view.
- Restoring a previously stale annotation as `visible` may temporarily lose stale-anchor state -> Accept for this change; future moderation history can preserve previous status if needed.
- Owner-only data leakage -> Keep hidden comment listing on admin routes and add tests that anonymous, non-member, and non-owner callers cannot access or mutate hidden comments.
- Runtime clutter for owners -> Keep controls compact and only render them when `/_wikiwise/me` reports `membership.role === "owner"`.

## Migration Plan

No D1 migration is expected. The existing `comments.status` check constraint already includes `hidden`. Deployment is a Worker-only change plus tests. Rollback is to deploy the previous Worker; hidden comment records remain in D1 and would be returned again by the old unfiltered list behavior, so rollback should be used only if that visibility regression is acceptable.

## Open Questions

- None for this change. Moderation history, reason codes, reporting, and permanent deletion can be designed separately.
