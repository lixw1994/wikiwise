## Why

Electron publishing result and unpublish feedback are already implemented and statically compared against native SwiftUI behavior, but runtime audit evidence currently stops at the first-publish dialog opening and cancel path. Final native parity needs live BrowserWindow evidence that publish success, publish error, external browser action, and unpublish confirmation flows behave like the native app.

## What Changes

- Add runtime audit evidence for first-publish success feedback, including native result copy and `Open in Browser` preload routing.
- Add runtime audit evidence for publish error feedback, including native `Publish Error` modal copy and dismissal behavior.
- Add runtime audit evidence for an already-published project's `Unpublish...` confirmation and successful unpublish cleanup.
- Keep all publish/unpublish work mocked inside the runtime audit IPC layer; no real publishing network calls are made.
- Fail the runtime audit if any feedback modal evidence is missing or if the audit does not restore the `home.md` FILE/editor state afterward.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-runtime-parity-audit`: Require retained runtime evidence for publish success, publish error, external open, and unpublish feedback flows.
- `electron-publishing`: Require live runtime evidence for publish feedback and unpublish confirmation behavior.
- `electron-native-parity-roadmap`: Track publish feedback runtime evidence as a native runtime parity evidence phase, closing the gap left by first-publish dialog-only evidence.

## Impact

- Runtime audit script: `scripts/audit-electron-runtime.mjs`
- Runtime audit static tests: `apps/electron/test/runtime-parity-audit.test.js`
- OpenSpec specs and archived verification records
- No product UI behavior, real publishing service behavior, or release-signing behavior should change in this slice.
