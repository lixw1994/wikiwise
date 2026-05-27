# Verification

## 2026-05-28

- RED: `npm test -- --test-reporter=spec test/file-tree-expansion-parity.test.js` in `apps/electron` failed on the expected pre-fix assertion because `renderNode` did not create an SVG folder icon or use the native path.
- GREEN targeted: `npm test -- --test-reporter=spec test/file-tree-expansion-parity.test.js` in `apps/electron` passed `17/17` tests after replacing the CSS box/pseudo-tab icon with inline SVG path markup.
- Runtime audit regression: `npm run electron:audit:runtime` initially failed `project-light` and `project-dark` because the audit still detected the old `::after` special-folder marker. Added source coverage in `test/runtime-parity-audit.test.js` and updated `scripts/audit-electron-runtime.mjs` to detect the SVG `.tree-folder-dot`; the runtime-audit source test then passed `20/20`.
- `openspec validate --all --strict` passed `34/34` items before archive.
- `npm test` passed Electron `268/268` and core `42/42`.
- `swift build` completed successfully.
- `npm run electron:package:mac` produced `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime` passed all 7 scenarios after the SVG marker detector update: `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
- `npm run electron:release:readiness` wrote `apps/electron/out/release-readiness/report.json` with status `blocked`; prerequisite checks passed for macOS tooling and entitlements, while final release remains blocked by missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable notarization keychain profile `notarytool`.

## Parity Evidence

- Native Swift evidence: `FolderIcon` uses a 14-by-12 Canvas path with `move`, `curve`, `line`, and `closeSubpath` commands, then fills and strokes it with native adaptive colors.
- Electron renderer evidence: folder rows now append an inline SVG with `viewBox="0 0 14 12"` and `FOLDER_ICON_PATH` matching the native path geometry.
- Electron CSS evidence: `.tree-folder-shape` carries native fill/stroke variables and `stroke-width: 0.8`; `.tree-folder-dot` is hidden by default and shown for `.tree-folder.special-folder`.
- Preserved behavior: icon dimensions, scaled stroke width, special-folder dot coordinates, row typography, indentation, selection, tooltips, expansion behavior, and runtime project scenarios remain covered by targeted tests, full repo tests, and runtime audit.

## Residual Risk

- Final migration completion still requires actual signed/notarized release execution or an explicitly accepted OpenSpec deviation.
