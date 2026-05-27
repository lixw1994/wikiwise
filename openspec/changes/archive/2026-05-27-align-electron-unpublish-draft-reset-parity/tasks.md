## 1. Regression Coverage

- [x] 1.1 Add publishing coverage proving native `performUnpublish()` clears `pendingSubdomain` and resets `subdomainAvailability`.
- [x] 1.2 Add renderer coverage proving Electron clears `publishSubdomain` and resets `publishAvailability` after successful unpublish.
- [x] 1.3 Run targeted publishing tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update `confirmUnpublish()` success handling to clear the renderer publish subdomain draft after successful unpublish.
- [x] 2.2 Preserve confirmation dismissal timing, preload unpublish call, config refresh, toolbar busy state, and failure behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted publishing tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
