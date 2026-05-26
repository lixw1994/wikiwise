## 1. Regression Coverage

- [x] 1.1 Add a focused preview-navigation test proving Electron derives clicked HTML target slugs with Swift-style space-to-hyphen normalization.
- [x] 1.2 Run the targeted test and confirm the new regression fails before implementation.

## 2. Resolver Implementation

- [x] 2.1 Update Electron preview target slug derivation while preserving markdown lookup and generated fallback order.
- [x] 2.2 Run the targeted test and confirm the regression passes.

## 3. Verification

- [x] 3.1 Run the full JavaScript test suite.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run strict OpenSpec validation and update verification notes.
