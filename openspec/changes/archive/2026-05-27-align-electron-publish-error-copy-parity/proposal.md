## Why

Native `Publisher.PublishError.errorDescription` gives users actionable publish failure text, but the Electron shared core currently shortens several mapped publish errors before they reach the publish error dialog. This leaves Electron visibly less helpful than the macOS app for failed publish, unpublish, or malformed `publish.json` flows.

## What Changes

- Align Electron/shared publish error messages for corrupt config, token mismatch, subdomain taken, and rate limiting with the native Swift `Publisher` descriptions.
- Preserve existing stable error codes, HTTP status handling, retry behavior, upload payloads, and dialog presentation.
- Add regression coverage anchored to `Sources/Wikiwise/Publisher.swift` so future copy changes are deliberate.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wikiwise-core-package`: Require native publish error descriptions for shared publish helpers while preserving stable error codes.
- `electron-publishing`: Require the Electron publish error dialog to surface native publish failure copy from shared core helpers.
- `electron-native-parity-roadmap`: Track publish error copy parity as a native publishing gap closure phase.

## Impact

- Affected code: `packages/wikiwise-core/src/index.js`
- Affected tests: `packages/wikiwise-core/test/publisher.test.js`, `apps/electron/test/publishing.test.js`
- Affected specs: `openspec/specs/wikiwise-core-package`, `openspec/specs/electron-publishing`, `openspec/specs/electron-native-parity-roadmap`
- No network contract, release, dependency, or Electron IPC API changes.
