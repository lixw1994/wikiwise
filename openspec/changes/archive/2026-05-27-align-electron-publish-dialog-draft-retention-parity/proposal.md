## Why

Native `ContentView` preserves first-publish sheet draft state after Cancel. When no publish config exists, the toolbar action only shows the sheet; it does not overwrite `pendingSubdomain` or `subdomainAvailability`, and the sheet's `onAppear` generates a random subdomain only when the draft is empty. Electron currently replaces `publishSubdomain` from the stored suggested subdomain every time the publish dialog opens, so reopening after Cancel loses a user's typed draft.

## What Changes

- Update Electron first-publish dialog opening so an existing unpublished `publishSubdomain` draft and availability state survive cancel/reopen, matching native sheet state.
- Preserve published-project behavior: opening the dialog for a published wiki still uses the saved subdomain and marks availability as owned.
- Keep initial generated subdomain behavior for empty drafts and retain the existing debounced availability check when a new generated candidate is inserted.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-publishing`: tighten first-publish dialog state retention after Cancel to match native `pendingSubdomain` behavior.
- `electron-native-parity-roadmap`: record this publish-dialog draft retention correction as another completed migration slice after archive.

## Impact

- Affected Electron renderer: `apps/electron/src/renderer/renderer.js`.
- Affected tests: `apps/electron/test/publishing.test.js`.
- Affected specs: `electron-publishing`, `electron-native-parity-roadmap`.
- No new dependencies or IPC channels.
