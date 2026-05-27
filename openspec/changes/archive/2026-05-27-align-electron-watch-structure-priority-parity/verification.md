## Verification

Date: 2026-05-27

### RED

- `npm --workspace @wikiwise/core test -- test/watch-events.test.js`
  - Failed before implementation because a structure-priority summary still included `/tmp/wikiwise-project/wiki/home.md` in `changedMarkdownPaths`.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js`
  - Failed before implementation because the shared watcher source returned `createWatchSummary("structure", false, sortedMarkdownPaths, true)`.

### GREEN

- `npm --workspace @wikiwise/core test -- test/watch-events.test.js`
  - Passed 8/8 tests.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js`
  - Passed 9/9 tests.
- `openspec validate --all --strict`
  - Passed 34/34 items before archive.
- `git diff --check`
  - Passed before archive.
- `npm test`
  - Passed 269/269 workspace tests.
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

### POST-ARCHIVE

- `openspec archive align-electron-watch-structure-priority-parity --yes`
  - Archived the change to `openspec/changes/archive/2026-05-27-align-electron-watch-structure-priority-parity/`.
  - Synced specs into `electron-live-rebuild-watching`, `electron-native-parity-roadmap`, and `wikiwise-core-package`.
- `openspec validate --all --strict`
  - Passed 33/33 items after archive.
- `openspec list --json`
  - Returned `{"changes":[]}`.
- `npm --workspace @wikiwise/core test -- test/watch-events.test.js`
  - Passed 8/8 tests after archive.
- `npm --workspace @wikiwise/electron-app test -- test/live-rebuild-watching.test.js test/openspec-purpose-hygiene.test.js`
  - Passed 10/10 tests after archive.
