## 1. Member Management Contract Tests

- [x] 1.1 Add failing owner API tests for listing wiki members with public profile fields and no private identity/session/invitation internals.
- [x] 1.2 Add failing access-control tests for anonymous, non-member, and non-owner member listing/removal attempts.
- [x] 1.3 Add failing owner removal tests for removing a `member`, preserving other wiki memberships, and blocking owner removal.
- [x] 1.4 Add failing runtime source assertions for owner-only member management controls.

## 2. API Implementation

- [x] 2.1 Implement member listing helpers using existing `users` and `wiki_members` data.
- [x] 2.2 Implement owner-only `GET /_wikiwise/admin/members` route.
- [x] 2.3 Implement owner-only `DELETE /_wikiwise/admin/members/<userId>` route that removes only `member` roles.
- [x] 2.4 Keep serialized member responses free of provider, session, email, and invitation token internals.

## 3. Reader Runtime and Docs

- [x] 3.1 Add owner-only member management UI to the Hub reader runtime.
- [x] 3.2 Refresh the member list after successful member removal.
- [x] 3.3 Document owner invitation and member management behavior in the Cloudflare Hub README section.

## 4. Validation

- [x] 4.1 Run `openspec validate add-cloudflare-hub-member-management --strict`.
- [x] 4.2 Run targeted Cloudflare Hub tests.
- [x] 4.3 Run full repository tests.
