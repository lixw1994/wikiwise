## Verification - 2026-05-27

### RED Evidence

- `npm --workspace @wikiwise/core test -- test/watch-events.test.js` failed before implementation.
  - Expected failure: upper-case `.CSS` and `.MD` events produced a content summary instead of `null`.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js` failed before implementation.
  - Expected failure: the shared watcher summary still used `/\.css$/i` and `/\.md$/i` instead of native case-sensitive suffix checks.

### GREEN Evidence

- `npm --workspace @wikiwise/core test -- test/watch-events.test.js`
  - 6 tests passed, 0 failed.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js`
  - 6 tests passed, 0 failed.

### Full Checks

- `openspec validate --all --strict`
  - 34 items passed, 0 failed.
- `git diff --check`
  - Passed with no whitespace errors.
- `npm test`
  - `@wikiwise/electron-app`: 230 tests passed, 0 failed.
  - `@wikiwise/core`: 33 tests passed, 0 failed.
- `swift build`
  - Build complete.
- `npm run electron:package:mac`
  - Packaged unsigned app at `apps/electron/out/Wikiwise.app`.
  - Bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime`
  - Sandbox run failed with Electron `SIGABRT`.
  - Re-run outside sandbox passed.
  - Runtime report written to `apps/electron/out/runtime-audit/report.json`.
  - Screenshots written to `apps/electron/out/runtime-audit/screenshots`.
  - PASS scenarios: `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, `project-dark`.
- `npm run electron:release:readiness`
  - Expected exit 1 with blocked release readiness.
  - Report written to `apps/electron/out/release-readiness/report.json`.
  - Passed checks: macOS platform, `npm`, `hdiutil`, `codesign`, `xcrun`, `security`, `spctl`, and `apps/electron/build/entitlements.mac.plist`.
  - Blockers: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.

### Parity Evidence

- Native `Sources/Wikiwise/FileWatcher.swift` classifies watched CSS and markdown paths with case-sensitive `path.hasSuffix(".css")` and `path.hasSuffix(".md")`.
- Shared core `summarizeWatchEvents()` now uses case-sensitive `eventPath.endsWith(".css")` and `eventPath.endsWith(".md")`.
- Lower-case `.css` and `.md` watcher content summaries remain covered.
- Electron main process continues to route project watcher batches through `summarizeWatchEvents()`.

### Known Gaps / Residual Risks

- Final migration completion still requires an actual signed and notarized Electron release run or an explicitly accepted OpenSpec deviation.
- Matching native watcher behavior means upper-case `.MD` and `.CSS` edits are ignored by live rebuild classification, even if those files are visible or compilable elsewhere.

### Post-Archive Checks

- `openspec archive align-electron-watch-extension-case-parity --yes`
  - Updated `wikiwise-core-package`, `electron-live-rebuild-watching`, and `electron-native-parity-roadmap`.
  - Archived as `2026-05-27-align-electron-watch-extension-case-parity`.
- `openspec validate --all --strict`
  - 33 specs passed, 0 failed.
- `openspec list --json`
  - `{"changes":[]}`
- `git diff --check`
  - Passed after removing OpenSpec EOF blank lines.
- `npm --workspace @wikiwise/core test -- test/watch-events.test.js`
  - 6 tests passed, 0 failed.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js test/openspec-purpose-hygiene.test.js`
  - 7 tests passed, 0 failed.
- Initial post-archive `git diff --check` found OpenSpec EOF blank lines; they were removed before final verification.
