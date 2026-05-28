# Verification

## 2026-05-28

- RED: `npm test -- --test-reporter=spec test/native-shell-parity.test.js` in `apps/electron` failed on the expected pre-fix assertion because the centered `W` mark and welcome summary were direct `.welcome-content` children instead of being grouped under `.welcome-intro`.
- GREEN targeted: `npm test -- --test-reporter=spec test/native-shell-parity.test.js` in `apps/electron` passed `21/21` tests after adding the `.welcome-intro` wrapper and 12px internal gap.
- `openspec validate --all --strict` passed `34/34` items before archive.
- `npm test` passed Electron `271/271` and core `42/42`.
- `swift build` completed successfully.
- `npm run electron:package:mac` produced `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime` passed all 7 scenarios: `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
- `npm run electron:release:readiness` wrote `apps/electron/out/release-readiness/report.json` with status `blocked`; prerequisite checks passed for macOS tooling and entitlements, while final release remains blocked by missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable notarization keychain profile `notarytool`.

## Parity Evidence

- Native Swift evidence: welcome content uses an outer `VStack(spacing: 32)` and groups the large `Text("W")` plus summary `Text(...)` in an inner `VStack(spacing: 12)`.
- Electron markup/CSS evidence: `.welcome-intro` now wraps `.welcome-mark` and the welcome summary, uses centered grid layout with `gap: 12px`, and `.welcome-content` keeps the native outer `gap: 32px`.
- Preserved behavior: welcome mark color/typography, summary text and line spacing, action group spacing, action labels/symbols, toolbar brand, and welcome entry buttons remain covered by native-shell parity tests and the full Electron suite.

## Residual Risk

- Final migration completion still requires actual signed/notarized release execution or an explicitly accepted OpenSpec deviation.
