## Commands

- `node --test apps/electron/test/native-shell-parity.test.js` before implementation: failed on missing `nativeWindowDefaultSize` contract.
- `node --test apps/electron/test/runtime-parity-audit.test.js` before implementation: failed on missing `nativeDefaultWindowViewport` contract.
- `node --test apps/electron/test/native-shell-parity.test.js`: 7 tests passed.
- `node --test apps/electron/test/runtime-parity-audit.test.js`: 8 tests passed.
- `npm run electron:audit:runtime`: passed `welcome-light`, `welcome-dark`, `project-light`, and `project-dark`.
- `node --check apps/electron/src/main/main.js`: passed.
- `node --check scripts/audit-electron-runtime.mjs`: passed.
- `npm test`: 73 Electron tests and 27 core tests passed.
- `swift build`: passed.
- `openspec validate align-electron-window-geometry-parity --strict`: passed.
- `openspec validate --all --strict`: 26 items passed.
- `git diff --check`: passed.
- `npm run electron:package:mac`: packaged `apps/electron/out/Wikiwise.app`.

## Parity Evidence

- Native reference:
  - `WikiwiseApp.swift` declares `.defaultSize(width: 1500, height: 1000)`.
  - `ContentView.swift` declares `.frame(minWidth: 800, minHeight: 500)`.
- Electron app-window contract:
  - `nativeWindowDefaultSize` is `1500x1000`.
  - `nativeWindowMinimumSize` is `800x500`.
  - `createMainWindow()` uses those constants for `width`, `height`, `minWidth`, and `minHeight`.
- Runtime audit evidence:
  - `apps/electron/out/runtime-audit/report.json` records `viewport.width = 1500` and `viewport.height = 1000`.
  - All four audit scenarios passed.
  - Screenshots were captured at `3000x2000` on Retina output, which satisfies the native `1500x1000` viewport requirement.

## Known Gaps / Residual Risks

- This change aligns only default and minimum window geometry. It does not close the final signed/notarized DMG release gate.
- Runtime screenshots are retained for evidence, but detailed pixel-for-pixel review against the SwiftUI app remains part of the broader final parity audit.
