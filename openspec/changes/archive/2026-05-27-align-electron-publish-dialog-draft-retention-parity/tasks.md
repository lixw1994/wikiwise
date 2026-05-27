## 1. Regression Coverage

- [x] 1.1 Add publishing coverage proving native first-publish open does not overwrite a non-empty `pendingSubdomain` draft.
- [x] 1.2 Add renderer coverage proving Electron preserves unpublished `publishSubdomain` and `publishAvailability` across cancel/reopen while still seeding empty drafts.
- [x] 1.3 Run targeted publishing tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update `openPublishDialog()` to seed unpublished suggested subdomains only when the renderer draft is empty.
- [x] 2.2 Preserve published-project saved-subdomain behavior, availability checks for newly seeded drafts, publish/unpublish behavior, and dialog rendering.

## 3. Verification and Archive

- [x] 3.1 Run targeted publishing tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
