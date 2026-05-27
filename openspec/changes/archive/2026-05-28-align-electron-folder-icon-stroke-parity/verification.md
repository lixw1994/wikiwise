# Verification

## 2026-05-28

- RED: `npm test -- --test-reporter=spec test/file-tree-expansion-parity.test.js` in `apps/electron` failed on the expected pre-fix assertion because `.tree-folder-icon` still used `border: 1px solid var(--color-folder-stroke)`.
- GREEN targeted: `npm test -- --test-reporter=spec test/file-tree-expansion-parity.test.js` in `apps/electron` passed `15/15` tests after the stroke-width fix.
- `openspec validate --all --strict` passed `34/34` items before archive.
- `npm test` passed Electron `266/266` and core `42/42`.
- `swift build` completed successfully.
- `npm run electron:package:mac` produced `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime` passed all 7 scenarios: `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
- `npm run electron:release:readiness` wrote `apps/electron/out/release-readiness/report.json` with status `blocked`; prerequisite checks passed for macOS tooling and entitlements, while final release remains blocked by missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable notarization keychain profile `notarytool`.

## Parity Evidence

- Native Swift evidence: `FolderIcon` uses `FolderIcon(size: 13, ...)`, computes `s = canvasSize.width / 14.0`, and strokes with `lineWidth: 0.8 * s`.
- Electron evidence: `.tree-folder-icon` and `.tree-folder-icon::before` now use `0.74px` borders, matching `0.8 * 13 / 14` after CSS rounding.
- Preserved behavior: folder icon aspect, special marker geometry, special folder stroke color, row typography, indentation, disclosure behavior, selected-row styling, and file-tree expansion tests remain covered by the targeted file-tree suite and full repo tests.

## Residual Risk

- Final migration completion still requires actual signed/notarized release execution or an explicitly accepted OpenSpec deviation.
