## Context

Cloudflare Hub can already publish and serve multi-tenant wiki sites, list configured OAuth providers, and redirect a user into a provider authorization flow. The missing piece is the return path: the Hub does not yet validate OAuth callbacks, exchange codes, create users, create sessions, or give a newly signed-in owner access to a private wiki.

The first production path should support the user's target hosting model, `https://<slug>.wiki.flybullet.net`, where a single Hub deployment serves many wiki subdomains and owns account identity, comments, and private access.

## Goals

- Complete the Hub-owned OAuth/OIDC sign-in loop for Google, Feishu, and Lark.
- Store durable Hub users and linked provider accounts from stable provider identities.
- Create secure Hub session cookies that work across wiki subdomains.
- Expose a reliable `/me` result after sign-in and a logout endpoint that invalidates the session.
- Bootstrap private-wiki access for configured owner/admin identities without adding a full invite or team-management system.
- Keep provider tokens, client secrets, session ids, and OAuth state internals out of public responses and static files.

## Non-Goals

- Building the full account-management UI, comment UI, invite flows, or role administration.
- Adding password auth, magic-link auth, SAML, Cloudflare Access, or passkeys.
- Persisting provider access tokens or refresh tokens beyond what is needed to complete the callback.
- Implementing cross-device session management or account unlinking.
- Supporting arbitrary custom OAuth providers in the first pass.

## Decisions

### OAuth Callback

The Hub will add `GET /_wikiwise/auth/:provider/callback`. The callback will require both `code` and `state`, load the matching `oauth_states` row, validate that it has not expired, verify the requested provider matches the stored provider, and reject invalid callbacks before contacting the provider.

OAuth state should be one-time use. The existing schema can either delete a state row after successful use or add a `consumed_at` column. Deleting is enough for the first implementation and avoids a migration solely for state consumption metadata.

### Provider Exchange and Profile Mapping

The callback will exchange the authorization code for tokens using provider-specific token endpoints, then fetch provider profile claims through the configured userinfo/profile endpoint to obtain:

- `provider_subject`: required stable provider user id.
- `display_name`: required best-effort display name.
- `avatar_url`: optional profile image.
- `email`: optional email, normalized for matching configured admin emails.

Provider access tokens will not be stored. The Hub stores only the durable `users` row and `oauth_accounts` link.

### Session Cookie

Sessions will remain server-side records in the existing `sessions` table. The browser cookie stores only an opaque random session id named `wwh_session`.

For `wiki.flybullet.net` deployments, the cookie should be scoped to `.wiki.flybullet.net` so a shared-realm user can move between wiki subdomains without signing in again. For local tests or custom hosts where a parent domain is not safe to infer, the cookie can omit `Domain` and stay host-only.

Cookies should be `HttpOnly`, `Secure`, `SameSite=Lax`, and `Path=/`. Session expiry should default to a conservative duration such as 30 days and be configurable by env when useful.

### Safe Redirects

The existing `returnTo` safety rule should carry through callback completion: users return only to the same wiki origin captured during auth start. Callback requests that attempt to override the stored return target should be ignored.

### Logout

The Hub will add `POST /_wikiwise/logout` and may also allow `GET` only if needed by static UI links. Logout deletes the current session record if present and sends an expired `wwh_session` cookie using the same cookie scope rules as sign-in.

### Private Wiki Bootstrap

The first private-wiki membership bootstrap will use configured owner/admin emails, for example `WIKIWISE_ADMIN_EMAILS`, parsed as a comma-separated allowlist. When an OAuth profile email matches the allowlist, the provider reports that email as verified, and the callback state belongs to an existing wiki, the Hub will ensure a `wiki_members` row with role `owner` for that wiki. If the provider profile omits verified-email information, owner bootstrap does not run.

This keeps private publishing usable without building invites. It is deliberately narrow: bootstrap applies only to the callback wiki, does not automatically grant membership to every wiki, and still respects shared vs per-wiki identity behavior for comments.

### Error Handling

OAuth failures should return small generic errors such as `invalid_oauth_state`, `oauth_exchange_failed`, or `oauth_profile_missing_subject`. Detailed provider responses should not be returned to the browser.

## Risks / Trade-offs

- Email-based owner bootstrap is simple but depends on trustworthy provider email claims. The implementation requires an explicit verified-email claim, which may prevent owner bootstrap for providers that cannot expose one until their profile mapping is extended.
- Subdomain-wide cookies make shared sessions ergonomic but require careful domain calculation. The implementation should avoid setting a broad cookie domain unless the request host is under the configured public domain.
- Feishu and Lark profile APIs are not perfectly identical to Google OIDC. Provider mapping should be isolated enough that provider-specific response shapes do not leak through the rest of the auth code.
- Without token persistence, the Hub cannot refresh provider data later. That is acceptable for initial account/session behavior.

## Migration Plan

- Reuse the existing `users`, `oauth_accounts`, `oauth_states`, `sessions`, and `wiki_members` tables.
- Add schema only if implementation discovers the current tables cannot represent one-time state use or owner bootstrap cleanly.
- Keep existing published wiki data compatible.

## Open Questions

- Should `GET /_wikiwise/logout` be supported for static links, or should the Hub require `POST` only and let the UI call it?
- Should admin bootstrap be global by email only, or should publishing settings eventually carry per-wiki owner emails?
