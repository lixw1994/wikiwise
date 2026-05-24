## Verification

### Commands

- `node --test apps/electron/test/chrome-menus-persistence.test.js apps/electron/test/file-tree-expansion-parity.test.js apps/electron/test/runtime-parity-audit.test.js`
  - Red evidence before implementation: 12 pass, 4 fail. Failures covered missing left-sidebar visibility state, missing toolbar control/CSS grid state, missing file-tree preservation contract, and missing runtime audit evidence.
  - Green evidence after implementation: 16 pass, 0 fail.
- `npm run electron:audit:runtime`
  - Passed outside the command sandbox: welcome-light, welcome-dark, project-light, and project-dark.
- Runtime report inspection
  - `project-light`: toggle present, initial visible, hidden after toggle, restored visible, detail width `480 -> 740`, selection preserved, expansion preserved.
  - `project-dark`: toggle present, initial visible, hidden after toggle, restored visible, detail width `480 -> 740`, selection preserved, expansion preserved.
- `node --check apps/electron/src/renderer/renderer.js`
  - Passed.
- `node --check scripts/audit-electron-runtime.mjs`
  - Passed.
- `npm test`
  - Passed: Electron 66/66, core 26/26.
- `swift build`
  - Passed.
- `openspec validate migrate-electron-left-sidebar-visibility-parity --strict`
  - Passed.
- `openspec validate --all --strict`
  - Passed after archive: 21/21 items.
- `git diff --check`
  - Passed.
- `npm run electron:package:mac`
  - Passed and produced `apps/electron/out/Wikiwise.app`.

### Parity Evidence

- Electron project toolbar now exposes a left-sidebar visibility control.
- Renderer state tracks `isLeftSidebarVisible` without resetting the selected file, expanded tree paths, detail mode, right-sidebar state, or terminal session.
- The project grid removes the left sidebar column while hidden, allowing the detail area to expand.
- Runtime audit hides and restores the left sidebar in both light and dark project scenarios and records detail width expansion plus tree state preservation.

### Known Gaps And Risks

- This phase does not add manual left-sidebar drag resizing; native SwiftUI uses the system `NavigationSplitView` sidebar sizing rather than a custom left resize handle.
- This phase does not run the signed/notarized release flow. Final migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation.
