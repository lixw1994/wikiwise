## Why

Electron publishing parity is currently covered mostly by static source and style tests, while the runtime audit only verifies that publish dialogs stay hidden by default and that standalone-file opens cannot publish. Final native parity evidence should exercise the live renderer path that users actually hit when they open the publish sheet from an opened project.

## What Changes

- Add live Electron runtime audit evidence for the project publish dialog opening from the toolbar.
- Capture the native URL row shape, generated subdomain, token warning copy, inline availability indicator, disabled Publish state, and hidden Unpublish action for a first-publish project.
- Verify the dialog closes through the native cancel path and restores the existing `home.md` FILE/editor audit state.
- Fail the runtime audit if the publish dialog evidence is missing, incomplete, or leaves the final audit state altered.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-runtime-parity-audit`: Require retained runtime evidence for first-publish dialog behavior in opened project scenarios.
- `electron-publishing`: Require live runtime evidence for the first-publish dialog surface, availability state, and cancel behavior.
- `electron-native-parity-roadmap`: Track publish dialog runtime evidence as a native runtime parity evidence phase.

## Impact

- Runtime audit script: `scripts/audit-electron-runtime.mjs`
- Runtime audit static tests: `apps/electron/test/runtime-parity-audit.test.js`
- OpenSpec specs and archived verification records
- No product UI behavior, publishing network behavior, or release-signing behavior should change in this slice.
