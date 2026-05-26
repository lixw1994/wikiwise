## 1. Regression Coverage

- [x] 1.1 Add a renderer history parity test proving native SwiftUI only mutates history when the selected file changes.
- [x] 1.2 Add coverage proving Electron same-file reselects preserve back and forward history while still allowing file reload work to continue.
- [x] 1.3 Add coverage proving different-file and generated-page navigations keep the existing history behavior.

## 2. Renderer Implementation

- [x] 2.1 Update Electron file selection history gating to skip back-history pushes and forward-history clearing for active-file reselects.
- [x] 2.2 Preserve file reads, active-file writes, document info refresh, detail-mode handling, generated-page clearing, and existing history restoration behavior.

## 3. Verification

- [x] 3.1 Run targeted renderer/menu parity tests.
- [x] 3.2 Run `npm test`, `swift build`, `openspec validate align-electron-reselect-file-history-parity --strict`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.3 Record that final migration completion still requires actual signed/notarized release execution or an explicitly accepted OpenSpec deviation.
