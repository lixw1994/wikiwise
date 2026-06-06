## Context

Cloudflare Hub already has users, sessions, wiki memberships, owner bootstrap, private read gates, comments, and a reader runtime. The missing piece is a product-level way for an owner to grant another signed-in user membership for a specific wiki.

This change should keep membership scoped to the wiki. Shared and per-wiki realms continue to affect profile/comment identity, not whether membership on one wiki grants access to another wiki.

## Goals / Non-Goals

**Goals:**

- Add a D1-backed invitation model for one wiki at a time.
- Let wiki owners create, list, and revoke invitation links.
- Let a signed-in visitor accept a valid invitation and become a `member`.
- Preserve OAuth return flow so signed-out invitees can sign in and return to the invite page.
- Show a small owner-only invitation control in the Hub reader runtime.
- Avoid exposing token hashes, session ids, provider tokens, or membership internals.

**Non-Goals:**

- Sending email, verifying invitee email, or integrating notification providers.
- Building a full admin dashboard, member list editor, role hierarchy, or moderation console.
- Supporting cross-wiki invitations or organization/team abstractions.
- Granting owner role through invites.

## Decisions

1. Invitations are bearer links scoped to one wiki.

   The invite token is a secret URL. Whoever signs in and accepts a valid unused token becomes a member of that wiki. This is intentionally simple and avoids email delivery and verified-email matching in this change.

2. Store token hashes, not raw tokens.

   The create response returns the raw invitation URL once. The database stores only a token hash, so list responses and accidental database reads do not expose active invite links.

3. Owner APIs are same-origin Hub APIs.

   `POST /_wikiwise/admin/invitations` creates an invite, `GET /_wikiwise/admin/invitations` lists invites without raw tokens, and `DELETE /_wikiwise/admin/invitations/<id>` revokes a pending invite. Every route requires the current user to be an owner member of the request wiki.

4. Invitation acceptance is separated from invitation viewing.

   `GET /_wikiwise/invitations/<token>` renders a safe invitation page or sign-in prompt without protected wiki content. `POST /_wikiwise/invitations/<token>/accept` grants membership for signed-in users when the token is valid, pending, and unexpired.

5. The reader runtime only adds a lightweight owner surface.

   If `/_wikiwise/me` reports `membership.role === "owner"`, the account surface can show a compact invite action and the generated link. This keeps the first admin experience usable without making a full dashboard.

## Risks / Trade-offs

- Bearer links can be forwarded. Mitigation: tokens are random, revocable, single-use, and scoped to one wiki.
- Owner UI in the reader runtime could clutter normal readers. Mitigation: show it only for signed-in owners.
- Token hashing introduces async crypto in the worker. Mitigation: use Web Crypto APIs available in Workers and Node tests.
- Existing deployments need a migration. Mitigation: add a small additive D1 migration and keep rollback as removing the new routes/table usage.

## Migration Plan

Add a new D1 migration creating `wiki_invitations` and indexes. Existing wikis, users, sessions, memberships, comments, and static files are unchanged. Rollback is to deploy the previous worker; pending invitations remain in D1 but are unused by older code.

## Open Questions

- None for this change. Email-bound invitations and a richer member dashboard can be handled later.
