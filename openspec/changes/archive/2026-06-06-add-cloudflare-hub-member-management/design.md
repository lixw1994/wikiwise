## Context

Cloudflare Hub already has users, sessions, wiki memberships, owner bootstrap, comments, and invitation links. Invitations let owners grant access, but membership remains opaque after acceptance: owners cannot see current members or remove a reader without editing D1 directly.

This change builds on the existing owner authorization and reader runtime patterns. It should stay scoped to the current wiki and avoid creating a full admin product surface.

## Goals / Non-Goals

**Goals:**

- Let signed-in wiki owners list members for the current wiki.
- Let signed-in wiki owners remove `member` access for the current wiki.
- Return public profile fields, role, and membership metadata without exposing emails, provider subjects, OAuth tokens, sessions, or invitation token material.
- Add a compact owner-only reader runtime surface for reviewing members and removing member access.
- Keep all member management scoped to a single wiki hostname.

**Non-Goals:**

- Editing owner roles or granting owner access through the UI.
- Removing the current owner from their own wiki.
- Building a full dashboard, audit log, moderation queue, or organization/team model.
- Sending emails or notifying removed members.
- Changing published wiki content, comment identity rules, or auth realm semantics.

## Decisions

1. Member management is owner-only and same-origin.

   Add `GET /_wikiwise/admin/members` and `DELETE /_wikiwise/admin/members/<userId>` as Hub APIs for the current wiki host. These reuse the existing session cookie and require the current user to have `owner` membership for that wiki.

2. Removal is limited to `member` users.

   The first implementation should not support owner demotion/removal. Removing an owner risks locking out the only operator, and role hierarchy needs a richer design. Owner rows may be listed, but only non-owner `member` rows are removable.

3. Member responses expose public identity only.

   List responses should join users to wiki memberships and serialize only user id, display name, avatar URL, membership role, and joined/created timestamp when available. Provider accounts, emails, session ids, token hashes, and invitation internals stay server-only.

4. The reader runtime stays lightweight.

   The owner account surface can expose a compact members action or panel. It should not become a dashboard; it only needs enough UI to list current members and remove a member with a clear action.

## Risks / Trade-offs

- Accidental owner lockout -> Do not allow owner removal in this change.
- Sensitive identity leakage -> Serialize only public profile fields and assert responses omit provider/session/invitation internals.
- Runtime clutter for normal readers -> Render member management only when `/_wikiwise/me` reports `membership.role === "owner"`.
- Race between membership list and removal -> Treat removal as idempotent for non-existing/non-member targets and keep server authorization authoritative.

## Migration Plan

No D1 migration is expected. The implementation uses existing `users` and `wiki_members` tables. Rollback is to deploy the previous worker; existing memberships remain unchanged and the new routes disappear.

## Open Questions

- None for this change. Owner role editing and richer audit/history can be handled in later changes.
