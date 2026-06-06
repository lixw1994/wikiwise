## Why

Private Hub wikis can now add readers through invitations, but owners still have no product-level way to see who has access or remove access later. Member management closes that loop so a self-hosted wiki can stay maintainable without direct D1 edits.

## What Changes

- Add owner-only member listing for the current wiki.
- Add owner-only member removal for `member` users on the current wiki.
- Return only reader-facing public profile fields and membership role/status metadata.
- Add a small owner-facing reader runtime entry point for reviewing members.
- Keep membership management scoped to one wiki; shared/per-wiki realms continue to control displayed identity, not access scope.
- Do not add owner role editing, team/organization abstractions, email notifications, billing, or a full admin dashboard in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cloudflare-wiki-hub`: Add owner-managed member listing and member access removal for published Hub wikis.

## Impact

- Affected code: `apps/cloudflare-hub/src/worker.js`, `apps/cloudflare-hub/test/worker.test.js`, Hub reader runtime assets, and Hub documentation if setup/user-facing behavior changes.
- Affected APIs: new owner routes under `/_wikiwise/admin/members`.
- Data model: no new table is expected; the change should use existing users and wiki_members data.
- No new runtime dependency is expected.
