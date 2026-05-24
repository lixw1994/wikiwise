## Verification

### Commands

- `node --test apps/electron/test/right-sidebar-terminal.test.js apps/electron/test/runtime-parity-audit.test.js`
  - Red evidence before implementation: 10 pass, 3 fail. Failures covered missing renderer sidebar width state, missing resize handle/CSS, and missing runtime audit resize evidence.
  - Green evidence after implementation: 13 pass, 0 fail.
- `npm run electron:audit:runtime`
  - Passed outside the command sandbox: welcome-light, welcome-dark, project-light, and project-dark.
- Runtime report inspection
  - `project-light`: handle present, width `360 -> 440`, max `590`, resize observed, terminal resize after drag observed.
  - `project-dark`: handle present, width `360 -> 440`, max `590`, resize observed, terminal resize after drag observed.
- `node --check apps/electron/src/renderer/renderer.js`
  - Passed.
- `node --check scripts/audit-electron-runtime.mjs`
  - Passed.
- `npm test`
  - Passed: Electron 65/65, core 26/26.
- `swift build`
  - Passed.
- `openspec validate migrate-electron-right-sidebar-resize-parity --strict`
  - Passed.
- `openspec validate --all --strict`
  - Passed after archive: 20/20 items.
- `git diff --check`
  - Passed.
- `npm run electron:package:mac`
  - Passed and produced `apps/electron/out/Wikiwise.app`.

### Parity Evidence

- Electron right sidebar now has a left-edge `#right-sidebar-resize-handle` matching the native transparent 5px drag target.
- Renderer state starts at `360px`, clamps to minimum `200px`, and clamps maximum width to half of the project viewport.
- Dragging left increases width using the native `startWidth - deltaX` behavior.
- The project grid uses `--right-sidebar-width`, so the detail pane gives up width as the right sidebar grows.
- xterm refits after width changes and sends terminal resize IPC evidence after the simulated runtime drag.

### Known Gaps And Risks

- This phase does not run the signed/notarized release flow. Final migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation.
- This phase does not persist the right-sidebar width across launches; the native implementation keeps this as window state, not persistent app settings.
