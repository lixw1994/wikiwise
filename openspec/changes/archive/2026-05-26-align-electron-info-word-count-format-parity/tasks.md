## 1. Test Coverage

- [x] 1.1 Add failing renderer/native source coverage for INFO word-count decimal formatting parity.
- [x] 1.2 Run the targeted right-sidebar test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Update the Electron renderer INFO metadata path to format word counts with locale-aware decimal grouping while preserving numeric IPC payloads.
- [x] 2.2 Re-run the targeted right-sidebar test and confirm it passes.

## 3. Verification

- [x] 3.1 Run full verification: `npm test`, `swift build`, Electron runtime audit, packaging, OpenSpec validation, release-readiness preflight, and diff checks.
