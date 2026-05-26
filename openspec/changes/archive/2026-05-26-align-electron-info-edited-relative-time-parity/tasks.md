## 1. Test Coverage

- [x] 1.1 Add failing renderer/native source coverage for INFO edited-time numeric relative formatting parity.
- [x] 1.2 Run the targeted right-sidebar test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Update the Electron renderer INFO edited-time formatter to use localized numeric relative formatting across week/month/year ranges and remove the absolute date fallback.
- [x] 2.2 Re-run the targeted right-sidebar test and confirm it passes.

## 3. Verification

- [x] 3.1 Run full verification: `npm test`, `swift build`, Electron runtime audit, packaging, OpenSpec validation, release-readiness preflight, and diff checks.
