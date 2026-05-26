## 1. Test Coverage

- [x] 1.1 Add failing source-level tests for native SwiftUI default menu preservation and Electron standard App/Edit/Window role coverage.
- [x] 1.2 Add failing coverage that existing Wikiwise File commands and View fullscreen behavior remain present.

## 2. Main Process Menu

- [x] 2.1 Expand the macOS app menu with standard Services, Hide, Hide Others, Show All, and Quit roles.
- [x] 2.2 Add standard Edit and Window menus without changing existing renderer app-command routing.

## 3. Verification

- [x] 3.1 Run targeted chrome/menu tests.
- [x] 3.2 Run full verification: `npm test`, `swift build`, Electron runtime audit, packaging, OpenSpec validation, and diff checks.
