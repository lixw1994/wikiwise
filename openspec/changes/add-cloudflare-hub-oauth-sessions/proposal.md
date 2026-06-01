## Why

Cloudflare Hub currently exposes OIDC provider discovery and start boundaries, but it cannot complete a login, create an app-owned session, or turn OAuth identities into durable users. Private wikis and comment identity need a real Hub-owned account/session loop before the published wiki experience can be used by readers.

## What Changes

- Add OAuth/OIDC callback handling for configured Google, Feishu, and Lark providers.
- Exchange authorization codes for tokens, read provider profile claims, and map provider identities into Hub `users` and `oauth_accounts`.
- Create durable Hub sessions and set secure HTTP-only cookies that work across Hub wiki subdomains.
- Add logout behavior that clears the session cookie and invalidates the session record.
- Add minimal private-wiki membership bootstrap so a configured owner/admin can access a newly published private wiki.
- Keep provider secrets, token responses, and session internals out of static wiki files and public JSON responses.
- Preserve the existing publish, static serving, comment policy, and annotation behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `cloudflare-wiki-hub`: Extend Hub-owned OAuth/OIDC authentication from provider boundaries into callback, account, session, logout, and private-wiki membership bootstrap behavior.

## Impact

- `apps/cloudflare-hub/src/worker.js`: OAuth callback route, token/profile exchange helpers, session creation, logout, membership bootstrap, cookie handling.
- `apps/cloudflare-hub/test/worker.test.js`: Hub runtime tests for callback success/failure, session cookies, `/me`, logout, and private access bootstrap.
- `apps/cloudflare-hub/migrations/0001_initial.sql`: Any schema additions needed for OAuth state use, sessions, or membership metadata.
- `openspec/specs/cloudflare-wiki-hub/spec.md`: Auth requirements extended to cover completed sign-in and session lifecycle.
