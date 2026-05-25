## Why

Electron's publish success modal still differs from the native SwiftUI alert. The native app shows the published URL inline with the success sentence and, on first publish, includes the `publish.json` safety reminder; Electron currently shows short label text plus a separate URL row, so the most important post-publish guidance is missing.

## What Changes

- Align Electron first-publish success copy with the native `Published!` alert, including the URL and `publish.json` key reminder.
- Align Electron update success copy with the native `Updated <url>` message.
- Avoid showing a duplicate standalone URL line when the URL is already part of the native result message.
- Keep the existing `Open in Browser` and `OK` actions and publish-config refresh behavior unchanged.
- Add publishing tests that compare the Electron result copy against the SwiftUI source.

## Success Criteria

- First publish success shows `Your wiki is live at <url>` followed by the native `publish.json` safety reminder.
- Republish/update success shows `Updated <url>`.
- The modal does not render the older `Your wiki is live at:` or `Updated:` label-only messages.
- Targeted Electron publishing tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change publish service behavior, availability checks, unpublish behavior, or external URL opening.
- Do not rework the publish dialog layout beyond removing duplicate URL display from the success modal.
- Do not claim full publishing parity beyond this result-copy slice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Require native publish success result copy for first-publish and update flows.

## Impact

- Affected code: Electron renderer JavaScript, Electron publishing tests, OpenSpec specs.
- No Swift source changes are planned.
- No dependency changes are planned.
