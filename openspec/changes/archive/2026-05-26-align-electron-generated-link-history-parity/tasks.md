## 1. Regression Coverage

- [x] 1.1 Add Electron renderer tests proving generated-link history is only pushed from selected Markdown-backed views, while toolbar map history remains unchanged.
- [x] 1.2 Run the targeted test before implementation and confirm it fails for the current generated-to-generated history behavior.

## 2. Implementation

- [x] 2.1 Update generated preview-link navigation to mirror the native selected-file history guard.
- [x] 2.2 Confirm the targeted test passes after the renderer change.

## 3. Verification

- [x] 3.1 Run full Electron, Swift, OpenSpec, package, and release-readiness verification.
- [x] 3.2 Record retained verification evidence for archive.
