## 1. Regression Coverage

- [x] 1.1 Add shared publish tests proving the default first-publish candidate uses the project-name prefix while a `409` retry uses a suffix-only candidate.
- [x] 1.2 Add Electron publishing source coverage anchoring native `Publisher.publish` retry call sites to shared core behavior.
- [x] 1.3 Run targeted publish tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update shared `publishSite` candidate generation so only the initial first-publish candidate receives the project basename.
- [x] 2.2 Preserve explicit subdomains, existing config behavior, retry limit, upload payload shape, publish error copy, renderer publish dialog behavior, and unpublish behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted core publishing and Electron publishing tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
