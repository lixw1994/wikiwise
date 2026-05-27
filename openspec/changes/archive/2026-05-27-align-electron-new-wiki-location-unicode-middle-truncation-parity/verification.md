## Verification

### RED

- `npm --workspace @wikiwise/electron-app test -- test/new-wiki-scaffold.test.js` failed before implementation on the source anchor requiring `Array.from(pathValue)` and character-safe head/tail slices in `middleTruncatePath`.
- The same targeted run failed on `renderer middle-truncates Unicode new-wiki locations without splitting characters`: current output was `𐐀\ud801…\udc00𐐀` instead of whole-character `𐐀𐐀𐐀…𐐀𐐀𐐀`.

### GREEN

- `npm --workspace @wikiwise/electron-app test -- test/new-wiki-scaffold.test.js` passed 28/28 tests after implementation.

### Broader Checks

- `openspec validate align-electron-new-wiki-location-unicode-middle-truncation-parity --strict` passed.
- `openspec validate --all --strict` passed 34/34 items.
- `git diff --check` passed.
- `npm test` passed 274/274 tests across Electron and shared core workspaces.
- `swift build` completed successfully.
- `npm run electron:package:mac` packaged `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime` passed and wrote `apps/electron/out/runtime-audit/report.json` plus seven PASS screenshots under `apps/electron/out/runtime-audit/screenshots`.
- `npm run electron:release:readiness` exited 1 as expected for local credentials, writing `apps/electron/out/release-readiness/report.json` with platform/tool/file checks passed and blockers for the missing Developer ID signing identity and `notarytool` profile.

### Parity Evidence

- Native evidence: `Sources/Wikiwise/ContentView.swift` keeps the new-wiki location `Text(newWikiLocation?.path ?? "~/wikis")` at `.lineLimit(1)` with `.truncationMode(.middle)`.
- Electron evidence: `apps/electron/src/renderer/renderer.js` now converts the display path with `Array.from(pathValue)`, compares the character count against the display limit, and joins whole-character head and tail slices around the middle ellipsis.
- Regression evidence: the new renderer behavior test executes the real extracted `middleTruncatePath` helper with retained supplementary-plane characters and asserts no unpaired surrogate code units are present.

### Known Gaps and Residual Risk

- Final Electron migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation.
- SwiftUI truncates based on rendered width; Electron still uses the existing fixed character budget because this slice is limited to preserving whole Unicode characters within the current middle-truncation approach.

### Post-Archive Evidence

- `openspec archive align-electron-new-wiki-location-unicode-middle-truncation-parity --yes` synced two requirements into main specs and archived the change at `openspec/changes/archive/2026-05-27-align-electron-new-wiki-location-unicode-middle-truncation-parity`.
- `openspec validate --all --strict` passed 33/33 items after archive.
- `openspec list --json` returned no active changes after archive.
- `npm --workspace @wikiwise/electron-app test -- test/new-wiki-scaffold.test.js` passed 28/28 tests after archive.
- `git diff --check` passed after removing sync-created EOF blank lines from the updated main specs.
