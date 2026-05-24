## Why

Several Electron dialog and guide strings still diverge from the macOS SwiftUI app. The visible differences are small but sharp: native buttons use `Choose…`, `Unpublish…`, and `Got it — start reading`, while Electron currently uses ASCII fallbacks. The publish dialog also omits the native publish-token safety warning, and the post-creation guide shortens native copy.

## What Changes

- Align the Electron new-wiki location chooser button with native `Choose…`.
- Align the Electron publish dialog warning with the native `publish.json` token/password copy.
- Align the Electron unpublish action label with native `Unpublish…` in both static markup and dynamic render state.
- Align the Electron post-creation guide capitalization and final guidance copy with the native SwiftUI guide.
- Align the Electron post-creation dismiss button with native `Got it — start reading`.
- Add structural parity tests that compare these visible strings against the SwiftUI source.

## Success Criteria

- Electron user-visible modal and post-creation guide strings match the native SwiftUI strings covered by this change.
- The Electron renderer keeps the same create, publish, unpublish, and guide-dismiss behavior.
- Targeted Electron tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change publishing IPC, availability logic, or unpublish confirmation behavior.
- Do not change new-wiki scaffold creation behavior.
- Do not rework post-creation guide layout or styling beyond the covered copy.
- Do not claim full Electron/native parity beyond this copy slice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-new-wiki-scaffold`: Require native-aligned new-wiki chooser and post-creation guide copy.
- `electron-publishing`: Require native-aligned publish token warning and `Unpublish…` action label.

## Impact

- Affected code: Electron renderer HTML/JavaScript, Electron structural tests, and OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
