## 1. Comment Moderation Contract Tests

- [x] 1.1 Add failing owner API tests for listing all page comments, including hidden comments, without exposing private identity internals.
- [x] 1.2 Add failing owner API tests for hiding and restoring comments while preserving comment records.
- [x] 1.3 Add failing access-control tests for anonymous, non-member, and non-owner moderation attempts.
- [x] 1.4 Add failing scope tests that moderation only affects comments belonging to the current wiki.
- [x] 1.5 Add failing reader comment list tests that hidden comments and hidden-parent replies are excluded from normal lists.
- [x] 1.6 Add failing runtime source assertions for owner-only moderation controls.

## 2. API and Comment Visibility Implementation

- [x] 2.1 Add owner-only admin comment routes for listing and updating comment status.
- [x] 2.2 Implement helpers for owner comment listing and scoped comment status updates.
- [x] 2.3 Filter normal reader comment lists to visible thread branches only.
- [x] 2.4 Keep republish annotation reanchoring from changing hidden comment status.
- [x] 2.5 Keep serialized owner moderation responses free of provider, session, email, and token internals.

## 3. Reader Runtime

- [x] 3.1 Add owner-only moderation controls to rendered comments.
- [x] 3.2 Add a compact owner view for reviewing hidden comments.
- [x] 3.3 Refresh comments after successful hide or restore actions.

## 4. Validation

- [x] 4.1 Run `openspec validate add-cloudflare-hub-comment-moderation --strict`.
- [x] 4.2 Run targeted Cloudflare Hub tests.
- [x] 4.3 Run full repository tests.
