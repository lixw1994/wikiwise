## Verification

Date: 2026-05-27

### RED

- `npm --workspace @wikiwise/core test -- test/watch-events.test.js`
  - Failed before implementation because `site/output-note.md` produced a content summary instead of being ignored like native output-prefix filtering.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js`
  - Failed before implementation because the shared watcher source still used `isPathInside(eventPath, outputDir)` and had no native-like output-prefix helper.

### GREEN

- `npm --workspace @wikiwise/core test -- test/watch-events.test.js`
  - Passed 8/8 tests.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js`
  - Passed 8/8 tests.
- `openspec validate --all --strict`
  - Passed 34/34 items before archive.
- `git diff --check`
  - Passed before archive.
- `npm test`
  - Passed 268/268 workspace tests.
- `swift build`
  - Passed.
- `npm run electron:package:mac`
  - Passed and packaged `apps/electron/out/Wikiwise.app` as unsigned local build `0.1.9`.
- `npm run electron:audit:runtime`
  - Passed outside the sandbox.
  - Wrote `apps/electron/out/runtime-audit/report.json`.
  - Captured PASS screenshots for `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
- `npm run electron:release:readiness`
  - Expected exit 1.
  - Blockers retained: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.

### Post-Archive

- `openspec archive align-electron-watch-output-prefix-parity --yes`
  - Archived as `2026-05-27-align-electron-watch-output-prefix-parity`.
  - Updated `electron-live-rebuild-watching`, `electron-native-parity-roadmap`, and `wikiwise-core-package`.
- `openspec validate --all --strict`
  - Passed 33/33 items after archive.
- `openspec list --json`
  - Returned `{"changes":[]}`.
- `npm --workspace @wikiwise/core test -- test/watch-events.test.js`
  - Passed 8/8 tests after archive.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js test/openspec-purpose-hygiene.test.js`
  - Passed 9/9 tests after archive.
