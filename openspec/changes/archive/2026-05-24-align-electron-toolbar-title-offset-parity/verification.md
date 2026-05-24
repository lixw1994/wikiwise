## Commands

- `node --test apps/electron/test/native-shell-parity.test.js` before implementation: failed because Electron lacked `--toolbar-title-offset` and `updateToolbarTitleOffset()` evidence.
- `node --test apps/electron/test/runtime-parity-audit.test.js` before implementation: failed because runtime audit lacked toolbar title offset evidence and failure messages.
- `node --test apps/electron/test/native-shell-parity.test.js`: 8 tests passed.
- `node --test apps/electron/test/runtime-parity-audit.test.js`: 8 tests passed.
- `npm run electron:audit:runtime`: passed `welcome-light`, `welcome-dark`, `project-light`, and `project-dark`.
- `node --check apps/electron/src/renderer/renderer.js`: passed.
- `node --check scripts/audit-electron-runtime.mjs`: passed.
- `npm test`: 76 Electron tests and 27 core tests passed.
- `swift build`: passed.
- `openspec validate align-electron-toolbar-title-offset-parity --strict`: passed.
- `openspec validate --all --strict`: 29 items passed.
- `git diff --check`: passed.
- `npm run electron:package:mac`: packaged `apps/electron/out/Wikiwise.app`.

## Parity Evidence

- Native reference:
  - `ContentView.swift` offsets the toolbar project title with `.offset(x: sidebarVisibility == .all ? -(leftSidebarWidth / 2) : 0)`.
- Electron renderer:
  - `.project-shell` defines `--toolbar-title-offset: 0px`.
  - `.toolbar-project-title` applies `transform: translateX(var(--toolbar-title-offset))`.
  - `updateToolbarTitleOffset()` measures `leftSidebar.getBoundingClientRect().width` and writes `--toolbar-title-offset` as negative half the visible left-sidebar width, or `0px` when hidden.
- Runtime audit report:
  - `project-light` recorded `leftSidebarTitleOffsetWidth = 260`, `toolbarTitleExpectedVisibleOffset = -130`, `toolbarTitleInitialOffset = -130`, `toolbarTitleHiddenOffset = 0`, and `toolbarTitleRestoredOffset = -130`.
  - `project-dark` recorded the same title-offset evidence.

## Known Gaps / Residual Risks

- This change preserves Electron's explicit left-sidebar hide/show control. SwiftUI still relies on a system split-view toolbar affordance when the sidebar is open.
- The local package smoke command creates an unsigned Electron app bundle. Final migration completion still requires an actual signed and notarized DMG release run or an explicitly accepted OpenSpec deviation.
