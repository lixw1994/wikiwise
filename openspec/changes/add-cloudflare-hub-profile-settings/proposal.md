## Why

Hub users currently inherit their public display name and avatar from OAuth provider profiles, but they cannot correct or intentionally present that identity inside published wikis. Profile settings let readers control the public identity used by account surfaces, comments, and member lists, which is the next natural step after shared realms, memberships, and comments.

## What Changes

- Add a signed-in user profile settings API for updating public display name and avatar URL.
- Add reader runtime controls for editing the signed-in user's public profile from a published wiki page.
- Make profile updates respect the wiki auth realm: shared realm updates carry across shared-realm wikis, while per-wiki realm updates stay scoped to the current wiki.
- Ensure profile updates are reflected in `/me`, comment author serialization, and owner member lists without exposing emails, provider subjects, provider tokens, session ids, or OAuth internals.
- Validate profile input and reject signed-out or malformed updates without changing stored profile data.
- Do not add avatar file uploads, account deletion, email editing, provider account linking, notifications, or a full account dashboard in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cloudflare-wiki-hub`: Add signed-in user profile settings for Hub reader identity and comment/member display.

## Impact

- Affected code: `apps/cloudflare-hub/src/worker.js` and `apps/cloudflare-hub/test/worker.test.js`.
- Affected runtime: injected Hub reader account surface and styles.
- Affected APIs: profile update behavior under `/_wikiwise/me` or a nearby same-origin profile endpoint.
- Affected data model: may require D1 migration or helper changes to preserve user-edited profile values and realm-scoped display data.
- No Electron desktop, core publishing, scaffold, release, or official hosting behavior is expected to change.
