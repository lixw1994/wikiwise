## 1. Regression Coverage

- [x] 1.1 Add Electron renderer tests proving native Markdown file selection preserves current detail mode and initial WIKI mode still holds.
- [x] 1.2 Run the targeted test before implementation and confirm it fails for the existing Markdown reset behavior.

## 2. Implementation

- [x] 2.1 Update the Electron renderer detail-mode selection logic to preserve FILE/WIKI mode for subsequent selected files.
- [x] 2.2 Confirm the targeted test passes after the renderer change.

## 3. Verification

- [x] 3.1 Run full Electron, Swift, OpenSpec, package, and release-readiness verification.
- [x] 3.2 Record retained verification evidence for archive.
