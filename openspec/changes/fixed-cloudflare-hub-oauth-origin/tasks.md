## 1. Worker OAuth Flow

- [x] 1.1 Add fixed auth origin resolution with validation and fallback to the current request origin.
- [x] 1.2 Use the resolved auth origin for OAuth authorization redirect URIs and token exchange redirect URIs.
- [x] 1.3 Add Worker tests for fixed-origin redirect generation, callback token exchange, session cookie sharing, and fallback behavior.

## 2. Deployment Configuration And Documentation

- [x] 2.1 Add `WIKIWISE_AUTH_ORIGIN` to the Hub Wrangler variables for the recommended Hub endpoint.
- [x] 2.2 Update README setup guidance with fixed provider callback URLs and App publish dialog usage.
- [x] 2.3 Update deployment documentation tests for the new auth origin guidance.

## 3. Verification

- [x] 3.1 Run targeted Cloudflare Hub tests.
- [x] 3.2 Run full repository tests, OpenSpec strict validation, and diff formatting checks.
