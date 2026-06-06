## Why

Hub comments can already be created and listed, but owners have no way to hide abusive, off-topic, or stale discussion once a wiki is public. Comment moderation gives published wikis a basic owner-controlled safety valve without turning the Hub reader runtime into a full admin dashboard.

## What Changes

- Add owner-only moderation APIs for updating a comment's visibility status on the current wiki.
- Let owners hide and restore comments from the injected reader runtime.
- Keep moderation scoped to the current wiki and page comment data model.
- Keep hidden comments out of normal reader-facing comment lists while preserving them in D1 for future audit or restoration.
- Do not add email notifications, moderation queues, bulk actions, reporting flows, or destructive comment deletion in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cloudflare-wiki-hub`: Add owner-managed comment moderation for published Hub wiki comments.

## Impact

- Affected code: `apps/cloudflare-hub/src/worker.js` and `apps/cloudflare-hub/test/worker.test.js`.
- Affected APIs: new owner route or route behavior under `/_wikiwise/admin/` for comment moderation.
- Affected runtime: Hub reader client source and styles for owner-only comment moderation actions.
- Data model: no new table is expected; the change should use the existing `comments.status` field.
- No new runtime dependency is expected.
