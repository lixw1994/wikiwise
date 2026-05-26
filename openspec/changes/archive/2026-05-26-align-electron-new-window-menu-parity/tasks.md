## 1. Regression Coverage

- [x] 1.1 Add a menu parity test proving native SwiftUI keeps the standard new-item command group and Electron exposes File > New Window before existing File commands.
- [x] 1.2 Add coverage proving the Electron New Window command uses the existing main-window creation path and preserves first-window restore gating.

## 2. Menu Implementation

- [x] 2.1 Add the Electron File > New Window menu item with the native accelerator.
- [x] 2.2 Preserve existing Open Existing Folder, navigation, refresh, close, standard Edit/View/Window roles, and renderer app-command routing.

## 3. Verification

- [x] 3.1 Run targeted menu parity tests.
- [x] 3.2 Run `npm test`, `swift build`, `openspec validate align-electron-new-window-menu-parity --strict`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.3 Record that final migration completion still requires actual signed/notarized release execution or an explicitly accepted OpenSpec deviation.
