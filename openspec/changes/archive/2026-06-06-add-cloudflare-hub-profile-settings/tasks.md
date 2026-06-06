## 1. Profile Contract Tests

- [x] 1.1 Add failing API tests for signed-in `PATCH /_wikiwise/me` profile updates and follow-up `GET /_wikiwise/me` reads.
- [x] 1.2 Add failing API tests for signed-out profile updates and invalid display name/avatar URL payloads.
- [x] 1.3 Add failing privacy tests that profile responses do not expose emails, provider subjects, provider tokens, OAuth state ids, session ids, invitation tokens, or invitation token hashes.
- [x] 1.4 Add failing shared-realm tests showing profile updates across shared wiki hosts, comments, and owner member lists.
- [x] 1.5 Add failing per-wiki realm tests showing profile updates are scoped to the current wiki identity and do not change other per-wiki or shared profiles.
- [x] 1.6 Add failing OAuth callback tests showing provider profile refreshes do not overwrite user-edited public profile settings.
- [x] 1.7 Add failing reader runtime source assertions for signed-in-only profile edit controls and profile save behavior.

## 2. Data and API Implementation

- [x] 2.1 Add the minimal D1 migration or persistence helpers needed for realm-scoped profile overrides.
- [x] 2.2 Implement public profile input validation and normalization.
- [x] 2.3 Implement profile resolution helpers that combine user-edited profile values with provider-derived fallback values.
- [x] 2.4 Implement signed-in-only profile update handling for the current wiki realm.
- [x] 2.5 Update `/_wikiwise/me` to return the resolved public profile for the current wiki realm.
- [x] 2.6 Update comment author and owner member serialization to use resolved public profile data without exposing private identity internals.
- [x] 2.7 Ensure OAuth callback user upserts keep provider data as fallback without overriding user-edited public profiles.

## 3. Reader Runtime

- [x] 3.1 Add a compact profile edit action to the signed-in account surface.
- [x] 3.2 Add profile edit fields for display name and avatar URL using the current public profile values.
- [x] 3.3 Submit profile updates through the Hub profile API and handle validation errors without logging secrets.
- [x] 3.4 Refresh or rerender the account surface, comments, and visible owner member list after a successful profile save.
- [x] 3.5 Keep profile edit controls hidden for signed-out visitors.

## 4. Validation

- [x] 4.1 Run `openspec validate add-cloudflare-hub-profile-settings --strict`.
- [x] 4.2 Run targeted Cloudflare Hub tests.
- [x] 4.3 Run full repository tests.
