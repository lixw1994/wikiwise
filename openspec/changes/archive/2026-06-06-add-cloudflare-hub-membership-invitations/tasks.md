## 1. Invitation Contract Tests

- [x] 1.1 Add failing migration test for the `wiki_invitations` table and indexes.
- [x] 1.2 Add failing owner API tests for creating, listing, and revoking invitations without exposing token hashes.
- [x] 1.3 Add failing access-control tests for anonymous, non-member, and non-owner invitation creation attempts.
- [x] 1.4 Add failing invitation acceptance tests for signed-out sign-in prompts, signed-in acceptance, single-wiki membership, and invalid tokens.
- [x] 1.5 Add failing runtime source assertion for owner-only invitation controls.

## 2. Data and API Implementation

- [x] 2.1 Add the D1 invitation migration.
- [x] 2.2 Implement invitation creation, lookup, listing, revocation, and token hashing helpers.
- [x] 2.3 Implement owner-only `/_wikiwise/admin/invitations` routes.
- [x] 2.4 Implement invitation page and accept routes under `/_wikiwise/invitations/*`.

## 3. Reader Runtime

- [x] 3.1 Add owner-only invitation UI to the Hub reader runtime.
- [x] 3.2 Keep invitation links visible only to the owner who created them and keep token hashes out of client-visible responses.

## 4. Validation

- [x] 4.1 Run `openspec validate add-cloudflare-hub-membership-invitations --strict`.
- [x] 4.2 Run targeted Cloudflare Hub tests.
- [x] 4.3 Run full repository tests.
