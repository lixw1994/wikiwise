## Why

Private Hub wikis currently rely on owner bootstrap, which lets an owner get in but does not give that owner a product-level way to add readers. Membership invitations make private and members-only wikis usable without manual database edits or Cloudflare Access.

## What Changes

- Add Hub-owned wiki membership invitations for the current wiki.
- Allow wiki owners to create, list, and revoke pending invitation links.
- Allow a signed-in visitor to accept a valid invitation and become a wiki member.
- Preserve invite return flow through Hub-owned OAuth sign-in.
- Add a lightweight owner-facing invitation entry point to the Hub reader runtime.
- Keep invitations scoped to one wiki; shared/per-wiki realms continue to control identity display, not membership scope.
- Do not send invitation emails or build a full admin dashboard in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cloudflare-wiki-hub`: Add owner-managed membership invitation behavior for private and members-only wiki access.

## Impact

- Affected code: `apps/cloudflare-hub/src/worker.js`, `apps/cloudflare-hub/test/worker.test.js`, Hub migration files, and Hub documentation.
- Affected APIs: new `/_wikiwise/admin/invitations` owner routes and new invitation accept routes under `/_wikiwise/invitations/*`.
- Data model: add a D1 table for wiki invitations.
- No new runtime dependency is expected.
