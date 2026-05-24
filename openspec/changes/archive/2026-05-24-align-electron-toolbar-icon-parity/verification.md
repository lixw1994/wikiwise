## Commands

- `node --test apps/electron/test/chrome-menus-persistence.test.js` before implementation: failed because the Electron toolbar still rendered visible `Auto` text and lacked `toolbar-symbol` native symbol evidence.
- `node --test apps/electron/test/runtime-parity-audit.test.js` before implementation: failed because the runtime audit lacked toolbar icon evidence and visible-label failure assertions.
- `node --test apps/electron/test/chrome-menus-persistence.test.js`: 6 tests passed.
- `node --test apps/electron/test/runtime-parity-audit.test.js`: 8 tests passed.
- `npm run electron:audit:runtime`: passed `welcome-light`, `welcome-dark`, `project-light`, and `project-dark`.
- `node --check apps/electron/src/renderer/renderer.js`: passed.
- `node --check scripts/audit-electron-runtime.mjs`: passed.
- `npm test`: 75 Electron tests and 27 core tests passed.
- `swift build`: passed.
- `openspec validate align-electron-toolbar-icon-parity --strict`: passed.
- `openspec validate --all --strict`: 28 items passed.
- `git diff --check`: passed.
- `npm run electron:package:mac`: packaged `apps/electron/out/Wikiwise.app`.

## Parity Evidence

- Native reference:
  - `ContentView.swift` renders appearance with `circle.lefthalf.filled`, `sun.max.fill`, or `moon.fill`.
  - `ContentView.swift` renders 3D map with `map`.
  - `ContentView.swift` renders sidebar controls with `sidebar.left` and `sidebar.right`.
- Electron renderer:
  - Toolbar icon buttons now render `.toolbar-symbol` spans with `data-native-symbol` values matching the native symbols.
  - Appearance mode updates the native symbol and accessible label through `setToolbarButtonSymbol()`.
  - The map and sidebar icon buttons no longer expose `Auto` or `Map` as visible toolbar text.
- Runtime audit report:
  - `project-light` recorded `appearanceNativeSymbol = "sun.max.fill"`, `mapNativeSymbol = "map"`, `leftSidebarNativeSymbol = "sidebar.left"`, `rightSidebarNativeSymbol = "sidebar.right"`, and `toolbarIconTextVisible = false`.
  - `project-dark` recorded `appearanceNativeSymbol = "moon.fill"` with the same map/sidebar symbol evidence and `toolbarIconTextVisible = false`.

## Known Gaps / Residual Risks

- Electron still uses fallback glyphs rather than actual SF Symbol rendering inside Chromium; the stable semantic mapping is retained through `data-native-symbol`.
- This change does not alter left-sidebar toggle visibility. SwiftUI relies on a system split-view toolbar affordance while Electron still keeps its explicit hide/show control available.
- The local package smoke command creates an unsigned Electron app bundle. Final migration completion still requires an actual signed and notarized DMG release run or an explicitly accepted OpenSpec deviation.
