## Why

Published Hub wikis already have server-side auth, sessions, and comments, but readers do not yet get a first-class in-page account or comment experience. The next step is to make self-hosted wikis feel usable after publishing, including private sign-in and shared-realm comment identity.

## What Changes

- Add a Hub-owned reader runtime that is injected into served wiki HTML pages.
- Serve Hub reader JavaScript and CSS from `/_wikiwise/client.js` and `/_wikiwise/client.css`.
- Show an account surface that reflects the current visitor's Hub session and configured OAuth providers.
- Show a page-level comment surface that reads and writes comments through Hub APIs according to the wiki comment policy.
- Return a Hub sign-in page for private wiki requests that cannot serve protected static content.
- Keep Hub-specific reader UI out of the static wiki compiler output so local and official static exports remain portable.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cloudflare-wiki-hub`: Add reader-facing Hub runtime behavior for account UI, comments UI, runtime asset serving, HTML injection, and private sign-in pages.

## Impact

- Affected code: `apps/cloudflare-hub/src/worker.js`, `apps/cloudflare-hub/test/worker.test.js`, and Hub documentation.
- Affected APIs: existing `/_wikiwise/me`, `/_wikiwise/auth/providers`, `/_wikiwise/logout`, and `/_wikiwise/comments` endpoints will be consumed by the new reader runtime.
- No new runtime dependencies are expected.
