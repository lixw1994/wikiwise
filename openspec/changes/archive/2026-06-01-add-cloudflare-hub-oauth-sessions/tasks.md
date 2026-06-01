## 1. Test Coverage

- [x] 1.1 Add Cloudflare Hub tests for successful OAuth callback, user/account upsert, session cookie creation, and safe redirect.
- [x] 1.2 Add callback rejection tests for missing, unknown, expired, mismatched, and reused OAuth state.
- [x] 1.3 Add tests for provider exchange/profile failures that verify no sensitive provider response details are exposed.
- [x] 1.4 Add session lifecycle tests for `/_wikiwise/me`, expired or unknown sessions, and logout invalidation plus cookie clearing.
- [x] 1.5 Add private wiki owner bootstrap tests for configured owner email, non-owner sign-in, and callback-wiki-only membership.

## 2. Hub Auth Implementation

- [x] 2.1 Add callback and logout routes to the Cloudflare Hub worker.
- [x] 2.2 Add provider token endpoint and profile endpoint configuration for Google, Feishu, and Lark.
- [x] 2.3 Implement OAuth state lookup, expiry validation, provider matching, and one-time consumption.
- [x] 2.4 Implement authorization code exchange and provider profile normalization without persisting provider tokens.
- [x] 2.5 Implement user and OAuth account upsert behavior from provider identities.
- [x] 2.6 Implement session creation, session deletion, and secure session cookie helpers with configured public-domain scoping.
- [x] 2.7 Implement owner/admin email allowlist parsing and private wiki membership bootstrap.
- [x] 2.8 Keep callback, logout, `/me`, private read, and comment authorization behavior coherent across public, private, shared-realm, and per-wiki wikis.

## 3. Validation and Documentation

- [x] 3.1 Document the new Cloudflare Hub OAuth/session environment variables.
- [x] 3.2 Run targeted Cloudflare Hub tests.
- [x] 3.3 Run the repository test suite.
- [x] 3.4 Run OpenSpec validation/status checks for `add-cloudflare-hub-oauth-sessions`.
