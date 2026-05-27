## Why

Native `ContentView.performUnpublish()` clears both the saved publish config and the in-memory publish-sheet draft state after a successful unpublish: `pendingSubdomain = ""` and `subdomainAvailability = .unknown`. Electron currently clears availability but leaves `publishSubdomain` untouched, which can keep the previously published subdomain as a stale first-publish draft after unpublishing.

## What Changes

- Update Electron unpublish success handling to clear the publish subdomain draft alongside publish config and availability state.
- Preserve existing confirmation dismissal timing, preload unpublish call, toolbar busy state, and publish config refresh behavior.
- Add source-backed regression coverage tying Electron's success path to native `performUnpublish()` state resets.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-publishing`: tighten unpublish success state reset to match native publish-sheet draft clearing.
- `electron-native-parity-roadmap`: record this unpublish draft reset correction as another completed migration slice after archive.

## Impact

- Affected Electron renderer: `apps/electron/src/renderer/renderer.js`.
- Affected tests: `apps/electron/test/publishing.test.js`.
- Affected specs: `electron-publishing`, `electron-native-parity-roadmap`.
- No new dependencies or IPC channels.
