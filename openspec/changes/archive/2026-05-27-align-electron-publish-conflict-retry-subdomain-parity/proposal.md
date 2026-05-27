## Why

Native `Publisher.publish` creates the first publish subdomain with `randomSubdomain(wikiName: projectRoot.lastPathComponent)`, but on an automatic first-publish `409` retry it calls `randomSubdomain()` with no wiki name. That means the retry candidate is only the six-character random suffix. The Electron shared core currently uses one default closure that keeps the project-name prefix on retries, so a collision recovery path can diverge from native publishing behavior.

## What Changes

- Split shared publish candidate generation so the first generated subdomain uses the project basename, while automatic `409` retry candidates use the native suffix-only fallback.
- Preserve explicit user-provided subdomains, existing-config updates, upload payload shape, first-publish retry limits, publish error copy, and publish dialog rendering.
- Add regression coverage for the default shared-core first-publish conflict path and Electron publishing source alignment with `Publisher.swift`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wikiwise-core-package`: Require native-compatible first-publish conflict retry subdomain generation.
- `electron-publishing`: Require Electron publishing to inherit the shared-core native conflict retry behavior.
- `electron-native-parity-roadmap`: Track publish conflict retry subdomain parity as a native publishing correction phase.

## Impact

- Affected code: `packages/wikiwise-core/src/index.js`
- Affected tests: `packages/wikiwise-core/test/publisher.test.js`, `apps/electron/test/publishing.test.js`
- Affected specs: `openspec/specs/wikiwise-core-package`, `openspec/specs/electron-publishing`, `openspec/specs/electron-native-parity-roadmap`
- No renderer layout, IPC contract, publish dialog copy, packaging, release, dependency, or network endpoint changes.
