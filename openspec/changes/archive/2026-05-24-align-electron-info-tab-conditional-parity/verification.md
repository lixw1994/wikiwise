## Commands

- `node --test apps/electron/test/right-sidebar-terminal.test.js` before implementation: failed on missing `info-directions-section` / `info-links-section` contract.
- `node --test apps/electron/test/runtime-parity-audit.test.js` before implementation: failed on missing optional INFO section runtime evidence.
- `node --test apps/electron/test/right-sidebar-terminal.test.js`: 7 tests passed.
- `node --test apps/electron/test/runtime-parity-audit.test.js`: 8 tests passed.
- `npm run electron:audit:runtime`: passed `welcome-light`, `welcome-dark`, `project-light`, and `project-dark`.
- `node --check apps/electron/src/renderer/renderer.js`: passed.
- `node --check scripts/audit-electron-runtime.mjs`: passed.
- `npm test`: 74 Electron tests and 27 core tests passed.
- `swift build`: passed.
- `openspec validate align-electron-info-tab-conditional-parity --strict`: passed.
- `openspec validate --all --strict`: 27 items passed.
- `git diff --check`: passed.
- `npm run electron:package:mac`: packaged `apps/electron/out/Wikiwise.app`.

## Parity Evidence

- Native reference:
  - `RightSidebar.swift` renders `DIRECTIONS` only under `if let file = selectedFileURL, let directions = parseDirections(from: file)`.
  - `RightSidebar.swift` renders `LINKED` only under `if let file = selectedFileURL, !wikilinkTargets(in: file).isEmpty`.
- Electron renderer:
  - `#info-directions-section` and `#info-links-section` are stable hidden containers.
  - `renderInfoTab()` sets `infoDirectionsSection.hidden = !hasDirections`.
  - `renderInfoTab()` sets `infoLinksSection.hidden = !hasLinks`.
  - Missing optional INFO data no longer renders `None` placeholder text.
- Runtime audit report:
  - `project-light` recorded `infoOptionalSectionEvidence = true`, `infoTabActivated = true`, `infoDirectionsSectionVisible = false`, `infoLinksSectionVisible = false`, and empty directions/links text.
  - `project-dark` recorded the same hidden optional-section evidence.

## Known Gaps / Residual Risks

- This change only closes INFO optional-section rendering for the right sidebar. It does not claim final pixel-perfect parity for every right-sidebar detail.
- The local package smoke command creates an unsigned Electron app bundle. Final migration completion still requires an actual signed and notarized DMG release run or an explicitly accepted OpenSpec deviation.
