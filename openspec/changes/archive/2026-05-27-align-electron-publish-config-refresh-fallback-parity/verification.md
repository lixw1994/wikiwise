# Verification

## RED

- `npm --workspace @wikiwise/electron-app test -- test/publishing.test.js`
  - Expected failure: the new `main process mirrors native publish config refresh fallback` test did not find a refresh-time `try`/`catch` around `loadPublishConfig(projectRoot)`.

## GREEN

- `npm --workspace @wikiwise/electron-app test -- test/publishing.test.js`
  - Passed: 38 tests, 38 pass.

## Full Checks

- `openspec validate --all --strict`
  - Passed: 34 items, 34 passed, 0 failed.
- `git diff --check`
  - Passed with no whitespace errors.
- `npm test`
  - Passed: Electron 243 tests and core 42 tests, 285 total.
- `swift build`
  - Passed.
- `npm run electron:package:mac`
  - Passed. Packaged `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime`
  - Passed. Runtime audit report written to `apps/electron/out/runtime-audit/report.json`.
  - Passed scenarios: `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, `project-dark`.
- `npm run electron:release:readiness`
  - Expected blocked result. Report written to `apps/electron/out/release-readiness/report.json`.
  - Passed prerequisite checks: macOS platform; required commands `npm`, `hdiutil`, `codesign`, `xcrun`, `security`, `spctl`; hardened runtime entitlements file.
  - Blockers: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.

Final Electron migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation.

## Post-Archive

- `openspec archive align-electron-publish-config-refresh-fallback-parity --yes`
  - Archived as `openspec/changes/archive/2026-05-27-align-electron-publish-config-refresh-fallback-parity`.
  - Synced requirements into `openspec/specs/electron-publishing/spec.md` and `openspec/specs/electron-native-parity-roadmap/spec.md`.
- `openspec validate --all --strict`
  - Passed: 33 items, 33 passed, 0 failed.
- `openspec list --json`
  - Passed with no active changes: `{"changes":[]}`.
- `npm --workspace @wikiwise/electron-app test -- test/publishing.test.js`
  - Passed: 38 tests, 38 pass.
- `git diff --check`
  - Passed with no whitespace errors after removing generated EOF blank lines.
