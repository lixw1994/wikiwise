## Commands

- `node --test apps/electron/test/file-tree-expansion-parity.test.js` before implementation: failed because Electron lacked `#left-sidebar-resize-handle` and native left-sidebar width wiring.
- `node --test apps/electron/test/runtime-parity-audit.test.js` before implementation: failed because runtime audit lacked left-sidebar resize evidence and failure messages.
- `node --test apps/electron/test/file-tree-expansion-parity.test.js`: 7 tests passed.
- `node --test apps/electron/test/runtime-parity-audit.test.js`: 8 tests passed.
- `npm run electron:audit:runtime`: passed `welcome-light`, `welcome-dark`, `project-light`, and `project-dark`.
- `node --check apps/electron/src/renderer/renderer.js`: passed.
- `node --check scripts/audit-electron-runtime.mjs`: passed.
- `npm test`: 77 Electron tests and 27 core tests passed.
- `swift build`: passed.
- `openspec validate align-electron-left-sidebar-width-parity --strict`: passed.
- `openspec validate --all --strict`: 30 items passed.
- `git diff --check`: passed.
- `npm run electron:package:mac`: packaged `apps/electron/out/Wikiwise.app`.

## Parity Evidence

- Native reference:
  - `ContentView.swift` sets `.navigationSplitViewColumnWidth(min: 110, ideal: 200, max: 360)`.
- Electron renderer:
  - `--left-sidebar-width` defaults to `200px`.
  - Project grid uses `var(--left-sidebar-width)` instead of a fixed `260px` column.
  - `#left-sidebar-resize-handle` resizes with native `110...360` constraints.
  - Hide/restore preserves `state.leftSidebarWidth`.
  - Toolbar title offset recalculates from the current resized left-sidebar width.
- Runtime audit report:
  - `project-light` recorded `leftSidebarInitialWidth = 200`, `leftSidebarResizedWidth = 260`, `leftSidebarNativeMinWidth = 110`, `leftSidebarNativeIdealWidth = 200`, `leftSidebarNativeMaxWidth = 360`, and `leftSidebarResizedTitleOffset = -130`.
  - `project-dark` recorded the same left-sidebar width and title-offset evidence.

## Known Gaps / Residual Risks

- The resize divider is web-rendered rather than the system `NavigationSplitView` divider, but the native constraints and interaction are now represented.
- Left-sidebar width is not persisted across app launches in this phase.
- The local package smoke command creates an unsigned Electron app bundle. Final migration completion still requires an actual signed and notarized DMG release run or an explicitly accepted OpenSpec deviation.
