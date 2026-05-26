## 1. Test Coverage

- [x] 1.1 Add failing renderer/native source coverage for scaffold failure dismissal parity.
- [x] 1.2 Run the targeted new-wiki scaffold test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Update the Electron renderer create-new-wiki failure path to dismiss the dialog without applying a project, showing the post-create guide, or keeping a visible shell error.
- [x] 2.2 Re-run the targeted new-wiki scaffold test and confirm it passes.

## 3. Verification

- [x] 3.1 Run full verification: `npm test`, `swift build`, Electron runtime audit, packaging, OpenSpec validation, release-readiness preflight, and diff checks.
