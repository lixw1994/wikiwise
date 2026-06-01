## 1. Runtime Contract Tests

- [x] 1.1 Add failing Hub tests for `/_wikiwise/client.js` and `/_wikiwise/client.css` runtime asset responses.
- [x] 1.2 Add failing Hub tests for HTML runtime injection and non-HTML/API response preservation.
- [x] 1.3 Add failing Hub tests for private wiki sign-in and access-required HTML responses.

## 2. Runtime Implementation

- [x] 2.1 Implement Hub reader runtime asset routes without embedding secrets or session data.
- [x] 2.2 Implement HTML-only runtime injection for served wiki pages.
- [x] 2.3 Implement private wiki sign-in/access-required pages that list configured providers and safe return URLs.

## 3. Reader Experience

- [x] 3.1 Add failing tests or source assertions for account UI behavior in the reader runtime.
- [x] 3.2 Implement signed-out, signed-in, logout, and no-provider account states in the reader runtime.
- [x] 3.3 Add failing tests or source assertions for comments UI behavior in the reader runtime.
- [x] 3.4 Implement comment loading, parent-child rendering, composer submission, and policy-aware unavailable states.

## 4. Documentation and Validation

- [x] 4.1 Document Hub reader UI behavior and private sign-in expectations.
- [x] 4.2 Run `openspec validate add-cloudflare-hub-reader-ui --strict`.
- [x] 4.3 Run targeted Cloudflare Hub tests.
- [x] 4.4 Run full repository tests.
