## Context

Cloudflare Hub stores users with display names and avatars, and comments already reference a comment identity through `userId`. The reader runtime currently renders that internal id in the comments surface, which leaks implementation detail and makes shared-realm accounts feel unfinished.

The change should stay inside the Hub worker and tests. No schema migration is needed because author details can be resolved from existing `users` records, including the per-wiki identities created for comment display.

## Goals / Non-Goals

**Goals:**

- Add a public `author` object to serialized comment payloads.
- Keep `userId` in responses for compatibility with existing comment data and tests.
- Resolve author display name and avatar from the existing `users` table.
- Preserve shared-realm author identity across wikis.
- Preserve per-wiki author id scoping while using the signed-in profile's display name and avatar.
- Update the reader runtime comments surface to render author names and avatars.

**Non-Goals:**

- Add profile editing, account settings, moderation, reactions, notifications, or member invitation flows.
- Change the comment database schema.
- Remove `userId` from API responses.
- Expose emails, provider subjects, provider tokens, sessions, or membership internals in comment payloads.

## Decisions

1. Serialize comments with both `userId` and `author`.

   `userId` remains available for compatibility and thread logic, while `author` becomes the public reader-facing contract. This avoids a breaking API change and lets the reader runtime stop showing internal ids immediately.

2. Resolve authors server-side in comment list and create responses.

   The Hub API already owns auth realm rules and can produce consistent results for shared and per-wiki realms. Resolving server-side also avoids extra browser calls and prevents the runtime from inferring identity details.

3. Use existing per-wiki identity rows.

   `ensureCommentIdentityUser` already creates scoped user records for per-wiki comment identities. The serializer can read those rows so `author.id` stays scoped while `displayName` and `avatarUrl` remain reader-friendly.

## Risks / Trade-offs

- Existing comments might reference a user row that no longer exists. Mitigation: fall back to a minimal author object with the comment `userId` and a neutral display name.
- Adding author data could accidentally expose private profile fields if the serializer is too broad. Mitigation: explicitly serialize only `id`, `displayName`, and `avatarUrl`.
- Reader runtime tests can only assert source behavior, not full browser rendering. Mitigation: keep server API tests behavior-focused and assert runtime source uses `comment.author`.

## Migration Plan

Deploying the worker is sufficient. Existing comments continue to work because author profiles are resolved dynamically from current user rows. Rollback is the previous worker version; comments still contain `userId`.

## Open Questions

- None for this change. Rich profiles and moderation can be handled by later changes.
