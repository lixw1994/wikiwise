## Verification

### Commands

- `node --test packages/wikiwise-core/test/file-tree.test.js`
  - Passed: 4/4 tests.
- `node --test apps/electron/test/file-tree-expansion-parity.test.js apps/electron/test/runtime-parity-audit.test.js`
  - Passed: 11/11 tests.
- `node --check apps/electron/src/main/main.js`
  - Passed.
- `node --check apps/electron/src/renderer/renderer.js`
  - Passed.
- `node --check scripts/audit-electron-runtime.mjs`
  - Passed.
- `npm run electron:audit:runtime`
  - Passed outside the command sandbox: welcome-light, welcome-dark, project-light, and project-dark.
- `node -e "const r=require('./apps/electron/out/runtime-audit/report.json'); for (const s of r.scenarios.filter(s=>s.kind==='project')) console.log(s.name, s.dom.expandedTreeEvidence, s.dom.nestedSelectionEvidence, s.dom.activeFileObserved, s.dom.selectedFileLabel);"`
  - Passed evidence check:
    - `project-light true true true home.md`
    - `project-dark true true true home.md`
- `npm test`
  - Passed: Electron 64/64, core 26/26.
- `swift build`
  - Passed.
- `openspec validate migrate-electron-file-tree-expansion-parity --strict`
  - Passed.
- `openspec validate --all --strict`
  - Passed after archive: 18/18 specs.
- `git diff --check`
  - Passed.
- `npm run electron:package:mac`
  - Passed and produced `apps/electron/out/Wikiwise.app`.

### Parity Evidence

- Core `expandTreeDirectory()` reuses native-compatible `scanOneLevel()` sorting and filtering.
- Electron main/preload expose a narrow `wikiwise:expandTreeDirectory` bridge that validates expansion paths against the current project root.
- Electron renderer now renders folder disclosure rows, nested indentation, default top-level expansion except `site`, and preserved compatible expansion after watcher structure refreshes.
- Selecting nested `wiki/home.md` in runtime audit updates selected tree state and reaches active-file IPC evidence before switching to File mode.

### Known Gaps And Risks

- This phase does not run the signed/notarized release flow. Final migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation.
- This phase does not add file creation, rename, drag/drop, or context menus; those are not present in the native file tree surface being closed here.
