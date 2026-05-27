## Verification

### RED

- `npm --workspace @wikiwise/core test -- test/publisher.test.js` failed before implementation on `randomPublishSubdomain truncates Unicode slug prefixes like native Publisher`: current output kept 10 supplementary-plane letters instead of the native-compatible 20-character prefix.
- `npm --workspace @wikiwise/electron-app test -- test/publishing.test.js` failed before implementation on the source anchor requiring `Array.from(sanitized).slice(0, 20).join("")` in shared core random subdomain generation.

### GREEN

- `npm --workspace @wikiwise/core test -- test/publisher.test.js` passed 8/8 tests after implementation.
- `npm --workspace @wikiwise/electron-app test -- test/publishing.test.js` passed 36/36 tests after implementation.

### Broader Checks

- `openspec validate align-electron-publish-random-subdomain-unicode-prefix-parity --strict` passed.
- `openspec validate --all --strict` passed 34/34 items.
- `git diff --check` passed.
- `npm test` passed 273/273 tests across Electron and shared core workspaces.
- `swift build` completed successfully.
- `npm run electron:package:mac` packaged `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime` passed and wrote `apps/electron/out/runtime-audit/report.json` plus seven PASS screenshots under `apps/electron/out/runtime-audit/screenshots`.
- `npm run electron:release:readiness` exited 1 as expected for local credentials, writing `apps/electron/out/release-readiness/report.json` with platform/tool/file checks passed and blockers for the missing Developer ID signing identity and `notarytool` profile.

### Parity Evidence

- Native evidence: `Sources/Wikiwise/Publisher.swift` still filters letters/numbers/hyphens and applies `.prefix(20)` before appending the six-character suffix.
- Shared core evidence: `packages/wikiwise-core/src/index.js` now stores the sanitized slug and truncates with `Array.from(sanitized).slice(0, 20).join("")`.
- Regression evidence: the new Unicode test uses 21 retained supplementary-plane letters and verifies a 20-character native-compatible lowercased prefix before the `-[a-z0-9]{6}` suffix.

### Known Gaps and Residual Risk

- Final Electron migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation.
- The implementation matches native behavior for retained supplementary-plane characters through JavaScript code point iteration. Swift `Character` can represent richer grapheme clusters, but the publish filter removes marks outside letters, numbers, and hyphen, so no new dependency was added for this slice.

### Post-Archive Evidence

- `openspec archive align-electron-publish-random-subdomain-unicode-prefix-parity --yes` synced three requirements into main specs and archived the change at `openspec/changes/archive/2026-05-27-align-electron-publish-random-subdomain-unicode-prefix-parity`.
- `openspec validate --all --strict` passed 33/33 items after archive.
- `openspec list --json` returned no active changes after archive.
- `npm --workspace @wikiwise/core test -- test/publisher.test.js` passed 8/8 tests after archive.
- `npm --workspace @wikiwise/electron-app test -- test/publishing.test.js` passed 36/36 tests after archive.
- `git diff --check` passed after removing sync-created EOF blank lines from the updated main specs.
