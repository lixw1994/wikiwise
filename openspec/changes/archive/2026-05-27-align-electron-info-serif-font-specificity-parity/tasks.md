## 1. Regression Coverage

- [x] 1.1 Add right-sidebar tests proving INFO values, directions, and linked rows use the native serif stack.
- [x] 1.2 Add coverage proving the directions callout selector is specific enough to override `.info-section p`.
- [x] 1.3 Run targeted right-sidebar tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update Electron INFO value, directions, and linked-row font stacks to prefer the native serif family with the existing fallback.
- [x] 2.2 Increase only the directions callout selector specificity needed to beat the generic INFO paragraph rule.
- [x] 2.3 Preserve directions callout spacing, colors, italic style, linked row spacing, metadata layout, tab behavior, terminal behavior, and sidebar resizing.

## 3. Verification and Archive

- [x] 3.1 Run targeted right-sidebar tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
