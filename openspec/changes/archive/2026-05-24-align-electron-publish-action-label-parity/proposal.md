## Why

Electron still has two visible publish-action label mismatches from the native SwiftUI app. The native toolbar busy state says `PUBLISHING…`, while Electron says `PUBLISHING...`. The native publish sheet confirmation button is always `Publish`, even for an already published wiki, while Electron changes that button to `Update`.

## What Changes

- Align the Electron toolbar publish busy label with native `PUBLISHING…`.
- Keep the Electron publish dialog confirmation action labeled `Publish` for both first publish and republish/update flows.
- Keep existing publish eligibility, IPC, and published-project behavior unchanged.
- Add publishing tests that compare these labels with the SwiftUI source.

## Success Criteria

- Electron toolbar publish action displays `PUBLISHING…` while publishing.
- Electron publish dialog confirmation displays `Publish` for existing published projects as well as first publish.
- The renderer no longer uses `Update` for the publish confirmation button.
- Targeted Electron publishing tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change publish result copy, publish service behavior, availability checks, or unpublish behavior.
- Do not rework publish dialog layout or loading spinner behavior.
- Do not claim full publishing parity beyond this action-label slice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require native publish action labels for toolbar busy state and dialog confirmation.

## Impact

- Affected code: Electron renderer JavaScript, Electron publishing tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
