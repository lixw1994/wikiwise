## Verification

Checked at 2026-05-28 03:56:22 CST.

## Source Evidence

- Native `Sources/Wikiwise/ContentView.swift` first-publish toolbar branch only sets `showPublishConfirm = true` when `publishConfig == nil`.
- Native published-project branch still assigns `pendingSubdomain = publishConfig?.subdomain ?? ""` and `subdomainAvailability = .owned`.
- Native publish sheet `onAppear` only assigns `pendingSubdomain = Publisher.randomSubdomain(wikiName:)` when `pendingSubdomain.isEmpty`.
- Electron `openPublishDialog()` now mirrors that split: published projects still use the saved config subdomain and `owned` availability, while unpublished projects seed the suggested subdomain only when `state.publishSubdomain` is empty.

## RED

- `node --test apps/electron/test/publishing.test.js`
- Failed as expected before implementation:
  - `renderer preserves first-publish subdomain draft across cancel like native sheet state`
  - Assertion rejected the old unconditional `state.publishSubdomain = config?.published ? ...` and `state.publishAvailability = config?.published ? ...` assignments.

## GREEN

- `node --test apps/electron/test/publishing.test.js`
  - 40 tests passed, 0 failed.

## Broader Checks

- `openspec validate align-electron-publish-dialog-draft-retention-parity --strict`
  - Change valid.
- `openspec validate --all --strict`
  - 34 passed, 0 failed.
- `npm test`
  - Electron app: 250 tests passed.
  - Core package: 42 tests passed.
- `swift build`
  - Build complete.
- `npm run electron:package:mac`
  - Packaged `apps/electron/out/Wikiwise.app`.
  - Bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime`
  - PASS `welcome-light`
  - PASS `welcome-dark`
  - PASS `new-wiki-light`
  - PASS `new-wiki-dark`
  - PASS `standalone-file-light`
  - PASS `project-light`
  - PASS `project-dark`
  - Runtime report: `apps/electron/out/runtime-audit/report.json`.
- `npm run electron:release:readiness`
  - Exited non-zero with retained blocked readiness evidence.
  - Report path: `apps/electron/out/release-readiness/report.json`.
  - Blockers: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.
  - No signed or notarized release artifacts were produced.

## Post-Archive Checks

- `openspec archive align-electron-publish-dialog-draft-retention-parity --yes`
  - Archived as `openspec/changes/archive/2026-05-27-align-electron-publish-dialog-draft-retention-parity/`.
  - Synced `electron-publishing` and `electron-native-parity-roadmap`.
- `openspec validate --all --strict`
  - 33 passed, 0 failed.
- `npm test`
  - Electron app: 250 tests passed.
  - Core package: 42 tests passed.
