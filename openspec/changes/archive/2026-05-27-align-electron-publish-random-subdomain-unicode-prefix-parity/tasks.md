## 1. Regression Coverage

- [x] 1.1 Add core publisher tests that assert native random subdomain Unicode prefix behavior for supplementary-plane letters.
- [x] 1.2 Add Electron publishing source coverage that anchors native `Publisher.randomSubdomain(wikiName:)` truncation to shared core implementation.
- [x] 1.3 Run targeted publisher tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update shared core random publish subdomain generation to truncate the sanitized slug by characters instead of UTF-16 code units.
- [x] 2.2 Preserve ASCII slug output, suffix shape, empty-name behavior, availability checks, and renderer publish flow.

## 3. Verification and Archive

- [x] 3.1 Run targeted publisher and Electron publishing tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
