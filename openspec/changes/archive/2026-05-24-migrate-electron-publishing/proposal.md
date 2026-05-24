## Why

Publishing is the next roadmap phase after the right sidebar. The Electron app cannot reach native parity until it can publish, update, and unpublish a compiled wiki using the same `publish.json` contract as the SwiftUI macOS app.

## What Changes

- Add native-compatible publishing helpers to `@wikiwise/core` for config loading, random subdomain generation, availability checks, publish payload creation/upload, URL rewrite behavior, and unpublish cleanup.
- Add Electron main-process IPC for loading publish config, checking subdomain availability, publishing the compiled site, and unpublishing.
- Expose publishing APIs through preload without giving the renderer filesystem or network primitives.
- Add a renderer publish control and dialog with subdomain entry, availability status, publish/update behavior, unpublish confirmation, result/error display, and disabled/busy states.
- Preserve existing Swift sources and the native app behavior as the source of truth.

## Capabilities

### New Capabilities

- `electron-publishing`: Electron renderer publishing UX for publish/update/unpublish parity with the native toolbar flow.

### Modified Capabilities

- `wikiwise-core-package`: Add native-compatible publishing helpers shared by Electron.
- `cross-platform-electron-workspace`: Add publishing IPC and preload APIs owned by Electron main.
- `electron-native-parity-roadmap`: Record publishing as an implemented phase while leaving later chrome, map, packaging, and final audit phases open.

## Impact

- Affected code: `packages/wikiwise-core`, `apps/electron/src/main`, `apps/electron/src/preload`, `apps/electron/src/renderer`, Electron tests, and OpenSpec specs.
- No new native dependency is planned; tests use injected request/upload behavior rather than real network publishing.
- Verification includes core tests, Electron structural tests, root `npm test`, OpenSpec validation, untouched Swift source confirmation, `swift build`, and whitespace checks.
