## Why

Native `Publisher.randomSubdomain(wikiName:)` builds first-publish subdomain candidates by lowercasing the wiki name, replacing spaces, filtering to letters/numbers/hyphens, and taking `prefix(20)` before appending a six-character suffix. The Electron shared core currently uses JavaScript string `.slice(0, 20)`, which counts UTF-16 code units and can shorten or split supplementary-plane Unicode letters that Swift keeps as characters.

## What Changes

- Align shared publish subdomain candidate generation with native character-prefix behavior for Unicode wiki names.
- Preserve existing ASCII output, suffix shape, empty-name behavior, publish availability checks, and renderer dialog flow.
- Add regression coverage anchored to `Sources/Wikiwise/Publisher.swift` so future truncation changes are deliberate.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wikiwise-core-package`: Require native-compatible random publish subdomain candidate generation for Unicode wiki names.
- `electron-publishing`: Require first-publish generated subdomain candidates to inherit native prefix behavior from shared core helpers.
- `electron-native-parity-roadmap`: Track random publish subdomain Unicode prefix parity as a native publishing gap closure phase.

## Impact

- Affected code: `packages/wikiwise-core/src/index.js`
- Affected tests: `packages/wikiwise-core/test/publisher.test.js`, `apps/electron/test/publishing.test.js`
- Affected specs: `openspec/specs/wikiwise-core-package`, `openspec/specs/electron-publishing`, `openspec/specs/electron-native-parity-roadmap`
- No network contract, release, dependency, or Electron IPC API changes.
