## 1. Regression Coverage

- [x] 1.1 Add a focused preview-navigation test proving source lookup uses native lowercase `.md` candidate filtering while direct markdown handling remains case-insensitive.
- [x] 1.2 Run the targeted test and confirm the new regression fails before implementation.

## 2. Resolver Implementation

- [x] 2.1 Update Electron preview markdown lookup to use a resolver-local lowercase `.md` candidate check.
- [x] 2.2 Run the targeted test and confirm the regression passes.

## 3. Verification

- [x] 3.1 Run the full JavaScript test suite.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run strict OpenSpec validation and update verification notes.
