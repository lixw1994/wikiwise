## 1. Test Coverage

- [x] 1.1 Add failing release-distribution tests for `--release-report`, npm convenience script wiring, success-report schema fields, report/preflight mode separation, and documentation.

## 2. Release Script Implementation

- [x] 2.1 Add `--release-report <path>` parsing and reject it for `--preflight`.
- [x] 2.2 Track completed production release gates without changing their order or bypassing signing/notarization.
- [x] 2.3 Write the success report only after notarization stapling and Gatekeeper assessment pass.
- [x] 2.4 Add DMG SHA-256 checksum evidence using required local tooling.

## 3. Documentation And Workflow

- [x] 3.1 Add a root npm convenience script for retained full-release evidence.
- [x] 3.2 Document release success reports separately from readiness/preflight blocker reports.

## 4. Verification

- [x] 4.1 Run focused release packaging tests and shell syntax checks.
- [x] 4.2 Run full workspace verification, Swift build, OpenSpec validation, package, runtime audit, archive the change, commit, and push.
