## Verification

Checked at 2026-05-28 04:05:31 CST.

## Source Evidence

- Native `Sources/Wikiwise/ContentView.swift` `performUnpublish()` clears `publishConfig`, `pendingSubdomain`, and `subdomainAvailability` after `Publisher.unpublish(projectRoot:)` succeeds.
- Electron `confirmUnpublish()` still closes the confirmation before calling preload and refreshes publish config after successful unpublish.
- Electron `confirmUnpublish()` now clears `state.publishSubdomain = ""` and resets `state.publishAvailability = "unknown"` after the successful unpublish path.

## RED

- `node --test apps/electron/test/publishing.test.js`
- Failed as expected before implementation:
  - `renderer mirrors native unpublish success draft reset`
  - Assertion rejected the missing `state.publishSubdomain = "";` reset in `confirmUnpublish()`.

## GREEN

- `node --test apps/electron/test/publishing.test.js`
  - 41 tests passed, 0 failed.

## Broader Checks

- `openspec validate align-electron-unpublish-draft-reset-parity --strict`
  - Change valid.
- `openspec validate --all --strict`
  - 34 passed, 0 failed.
- `npm test`
  - Electron app: 251 tests passed.
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

- `openspec archive align-electron-unpublish-draft-reset-parity --yes`
  - Archived as `openspec/changes/archive/2026-05-27-align-electron-unpublish-draft-reset-parity/`.
  - Synced `electron-publishing` and `electron-native-parity-roadmap`.
- `openspec validate --all --strict`
  - 33 passed, 0 failed.
- `npm test`
  - Electron app: 251 tests passed.
  - Core package: 42 tests passed.
