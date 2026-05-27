# Verification

## 2026-05-28

- RED: `npm test -- --test-reporter=spec test/native-shell-parity.test.js` in `apps/electron` failed on the expected pre-fix assertion because `.welcome-mark` used `--color-tab-active` instead of `--color-sidebar-selected-text`.
- GREEN targeted: `npm test -- --test-reporter=spec test/native-shell-parity.test.js` in `apps/electron` passed `20/20` tests after switching `.welcome-mark` to the native sidebar-selected text token.
- `openspec validate --all --strict` passed `34/34` items before archive.
- `npm test` passed Electron `270/270` and core `42/42`.
- `swift build` completed successfully.
- `npm run electron:package:mac` produced `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime` passed all 7 scenarios: `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
- `npm run electron:release:readiness` wrote `apps/electron/out/release-readiness/report.json` with status `blocked`; prerequisite checks passed for macOS tooling and entitlements, while final release remains blocked by missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable notarization keychain profile `notarytool`.

## Parity Evidence

- Native Swift evidence: the centered welcome `Text("W")` uses `.font(.system(size: 48, weight: .light, design: .serif))`, `.italic()`, and `.foregroundStyle(Color.sidebarSelectedText)`.
- Electron CSS evidence: `.welcome-mark` now uses `--color-sidebar-selected-text` while preserving Georgia/Times serif fallback, 48px font size, italic style, 300 weight, and one-line layout.
- Preserved behavior: welcome content copy, action buttons, secondary action foreground, toolbar brand mark, and full-window shell layout remain covered by the native-shell parity test and full Electron suite.

## Residual Risk

- Final migration completion still requires actual signed/notarized release execution or an explicitly accepted OpenSpec deviation.
