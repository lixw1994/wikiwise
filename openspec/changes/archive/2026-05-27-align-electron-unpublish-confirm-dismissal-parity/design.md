## Context

Native unpublish is defined as a SwiftUI alert:

- `Button("Cancel", role: .cancel) { }`
- `Button("Unpublish", role: .destructive) { performUnpublish() }`

SwiftUI alerts dismiss when an action is chosen. `performUnpublish()` then sets the toolbar busy state through `isPublishing = true` and later clears publish config or surfaces `publishError`.

Electron uses an app-owned modal because browser `window.confirm` is not native-like enough. That modal currently stays visible while `state.isUnpublishing` is true and closes only after a successful preload response.

## Decision

Update `confirmUnpublish()` to set `state.isUnpublishConfirmOpen = false` before rendering feedback and before awaiting `window.wikiwise.unpublishSite(...)`. The request still sets `state.isUnpublishing = true` so the publish toolbar remains disabled and shows the existing busy label.

On success, keep clearing local publish config and availability state. On failure, keep setting `state.publishError`, so the native-like `Publish Error` modal appears without the stale confirmation still visible behind it.

## Alternatives Considered

- Leave the confirmation visible but disabled while unpublishing. Rejected because it does not match the native alert lifecycle.
- Remove the custom confirmation and use `window.confirm`. Rejected because the published parity spec already requires an app-owned modal surface rather than a browser confirmation.

## Risks

- If unpublish fails, the user must reopen publish controls after dismissing the error. This matches native behavior: the original destructive confirmation has already been acted on and dismissed.
