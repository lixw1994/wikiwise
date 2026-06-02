## 1. Author Profile Tests

- [x] 1.1 Add failing Hub tests for created comments returning public `author` profiles.
- [x] 1.2 Add failing Hub tests for listed comments returning author profiles without private identity fields.
- [x] 1.3 Add failing Hub tests for shared-realm and per-wiki author identity behavior.
- [x] 1.4 Add failing runtime source assertion that comments render `comment.author` instead of internal ids.

## 2. Author Profile Implementation

- [x] 2.1 Resolve comment author profiles from existing Hub user records.
- [x] 2.2 Serialize `author` on created and listed comment responses while preserving `userId`.
- [x] 2.3 Keep comment author serialization limited to public fields.
- [x] 2.4 Update the reader runtime comment UI to display author name and avatar.

## 3. Validation

- [x] 3.1 Run `openspec validate add-cloudflare-hub-comment-author-profiles --strict`.
- [x] 3.2 Run targeted Cloudflare Hub tests.
- [x] 3.3 Run full repository tests.
