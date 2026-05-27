## 1. Regression Coverage

- [x] 1.1 Add publishing renderer coverage proving native unpublish uses a SwiftUI alert destructive action.
- [x] 1.2 Add coverage proving Electron closes the unpublish confirmation before invoking preload.
- [x] 1.3 Add coverage proving the confirmation is not closed only after a successful unpublish response.
- [x] 1.4 Run targeted publishing tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update `confirmUnpublish()` to close and render the confirmation before awaiting `wikiwise.unpublishSite`.
- [x] 2.2 Preserve toolbar busy state, publish config cleanup, error modal behavior, copy, labels, and custom modal usage.

## 3. Verification and Archive

- [x] 3.1 Run targeted publishing tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
