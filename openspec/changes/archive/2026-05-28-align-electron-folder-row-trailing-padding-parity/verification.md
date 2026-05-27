# Verification

## 2026-05-28

- RED: `npm test -- --test-reporter=spec test/file-tree-expansion-parity.test.js` in `apps/electron` failed on the expected pre-fix assertion because `.tree-row` still used `padding: 5px 8px 5px ...`.
- GREEN targeted: `npm test -- --test-reporter=spec test/file-tree-expansion-parity.test.js` in `apps/electron` passed `16/16` tests after moving the trailing inset to file rows.
- `openspec validate --all --strict` passed `34/34` items before archive.
- `npm test` initially exposed one stale native-shell parity assertion that still treated shared row trailing padding as native; after updating that assertion to the source-backed folder-row baseline, `npm test` passed Electron `267/267` and core `42/42`.
- `swift build` completed successfully.
- `npm run electron:package:mac` produced `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime` passed all 7 scenarios: `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
- `npm run electron:release:readiness` wrote `apps/electron/out/release-readiness/report.json` with status `blocked`; prerequisite checks passed for macOS tooling and entitlements, while final release remains blocked by missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable notarization keychain profile `notarytool`.

## Parity Evidence

- Native folder-row evidence: SwiftUI folder rows apply `.padding(.leading, indent)` and `.padding(.vertical, 5)` without `.padding(.trailing, 8)`.
- Native file-row evidence: SwiftUI file rows apply `.padding(.leading, indent + 15)`, `.padding(.vertical, 5)`, and `.padding(.trailing, 8)`.
- Electron evidence: `.tree-row` now uses `padding: 5px 0 5px ...`, while `.tree-file-button` explicitly keeps `padding-right: 8px`.
- Preserved behavior: row leading indentation, vertical padding, typography, selected accent alignment, folder icon styling, expansion behavior, and existing runtime project scenarios remain covered by the targeted file-tree suite, full repo tests, and runtime audit.

## Residual Risk

- Final migration completion still requires actual signed/notarized release execution or an explicitly accepted OpenSpec deviation.
