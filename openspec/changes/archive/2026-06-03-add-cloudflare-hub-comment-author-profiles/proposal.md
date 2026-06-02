## Why

The Hub reader UI can now show page comments, but comments still expose internal identity ids instead of reader-friendly author profiles. Published wikis need comments to feel like an account-backed product, especially when shared realm is selected across multiple wikis.

## What Changes

- Include a public `author` profile with each listed and created comment.
- Preserve existing `userId` values for compatibility while treating `author` as the reader-facing identity.
- Resolve shared-realm comments to the same author profile across Hub wikis.
- Resolve per-wiki comments to wiki-scoped author ids while keeping display name and avatar from the signed-in profile.
- Update the Hub reader runtime to display author name/avatar instead of internal comment ids.
- Keep provider tokens, session ids, and private account data out of comment responses.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cloudflare-wiki-hub`: Add reader-facing author profile behavior for page-level comments and the Hub reader comments surface.

## Impact

- Affected code: `apps/cloudflare-hub/src/worker.js`, `apps/cloudflare-hub/test/worker.test.js`, and Hub documentation if the public API contract needs clarification.
- Affected APIs: `GET /_wikiwise/comments` and `POST /_wikiwise/comments` will include an `author` object in serialized comment payloads.
- No database migration or new runtime dependency is expected because author details can be resolved from the existing `users` table.
