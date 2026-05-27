## Verification

### RED

- `npm --workspace @wikiwise/core test -- test/document-info.test.js` failed before implementation on `summarizeDocumentInfo ignores CRLF frontmatter directions like native RightSidebar`: current output returned `Native ignores CRLF markers` instead of `null`.
- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js` failed before implementation on the source anchor requiring shared core directions parsing to split with `text.split("\n")` instead of `/\r?\n/`.

### GREEN

- `npm --workspace @wikiwise/core test -- test/document-info.test.js` passed 6/6 tests after implementation.
- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js` passed 22/22 tests after implementation.

### Broader Checks

- `openspec validate align-electron-info-directions-crlf-parity --strict` passed.
- `openspec validate --all --strict` passed 34/34 items.
- `git diff --check` passed.
- `npm test` passed 276/276 tests across Electron and shared core workspaces.
- `swift build` completed successfully.
- `npm run electron:package:mac` packaged `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime` passed and wrote `apps/electron/out/runtime-audit/report.json` plus seven PASS screenshots under `apps/electron/out/runtime-audit/screenshots`.
- `npm run electron:release:readiness` exited 1 as expected for local credentials, writing `apps/electron/out/release-readiness/report.json` with platform/tool/file checks passed and blockers for the missing Developer ID signing identity and `notarytool` profile.

### Parity Evidence

- Native evidence: `Sources/Wikiwise/RightSidebar.swift` still parses directions with `text.split(separator: "\n", omittingEmptySubsequences: false)` and only enters frontmatter when `line == "---"`.
- Shared core evidence: `packages/wikiwise-core/src/index.js` now uses `text.split("\n")`, preserving `\r` on CRLF marker lines so exact marker comparison matches native behavior.
- Regression evidence: the new document-info test writes CRLF frontmatter with `directions:` and verifies `directions` is `null` while word count and other metadata remain available.

### Known Gaps and Residual Risk

- Final Electron migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation.
- CRLF markdown files that Electron previously treated as having INFO directions now hide the directions callout to match the current native parser.

### Post-Archive Evidence

- `openspec archive align-electron-info-directions-crlf-parity --yes` synced three requirements into main specs and archived the change at `openspec/changes/archive/2026-05-27-align-electron-info-directions-crlf-parity`.
- `openspec validate --all --strict` passed 33/33 items after archive.
- `openspec list --json` returned no active changes after archive.
- `npm --workspace @wikiwise/core test -- test/document-info.test.js` passed 6/6 tests after archive.
- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js` passed 22/22 tests after archive.
- `git diff --check` passed after removing sync-created EOF blank lines from the updated main specs.
