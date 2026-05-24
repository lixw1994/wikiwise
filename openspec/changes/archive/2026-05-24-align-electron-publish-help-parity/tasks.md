## 1. Tests

- [x] 1.1 Add a failing Electron publishing test for native publish help text.
- [x] 1.2 Verify the targeted publishing test fails before implementation.

## 2. Implementation

- [x] 2.1 Add renderer helper logic for unpublished and published publish help strings.
- [x] 2.2 Apply the help text to publish button `title` and `aria-label` from `renderPublishStatus()`.

## 3. Verification

- [x] 3.1 Run targeted Electron publishing tests.
- [x] 3.2 Run full Electron/core tests, Swift build, OpenSpec validation, diff check, and macOS Electron packaging.
- [x] 3.3 Archive the OpenSpec change and commit the completed batch.
