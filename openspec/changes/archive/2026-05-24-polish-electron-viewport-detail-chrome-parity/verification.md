## Verification

### Commands

- `node --test apps/electron/test/native-shell-parity.test.js apps/electron/test/runtime-parity-audit.test.js`
  - Passed: 13/13 tests.
- `node --check apps/electron/src/renderer/renderer.js`
  - Passed.
- `node --check scripts/audit-electron-runtime.mjs`
  - Passed.
- `npm test`
  - Passed: Electron 65/65, core 26/26.
- `swift build`
  - Passed.
- `openspec validate polish-electron-viewport-detail-chrome-parity --strict`
  - Passed.
- `openspec validate --all --strict`
  - Passed before archive: 19/19 items.
  - Passed after archive: 19/19 specs.
- `git diff --check`
  - Passed.
- `npm run electron:package:mac`
  - Passed and produced `apps/electron/out/Wikiwise.app`.
- `npm run electron:audit:runtime`
  - Passed outside the command sandbox: welcome-light, welcome-dark, project-light, and project-dark.
- `node -e "const r=require('./apps/electron/out/runtime-audit/report.json'); for (const s of r.scenarios.filter(s=>s.kind==='project')) console.log(s.name, s.dom.projectRect.height, s.dom.projectViewportBounded, s.dom.detailHeaderVisible, s.dom.detailSaveChromeTextVisible);"`
  - Passed evidence check:
    - `project-light 780 true false false`
    - `project-dark 780 true false false`

### Parity Evidence

- Electron project shell now stays bounded to the 1180x780 runtime audit viewport instead of expanding to a document-height surface.
- Sidebar, detail, editor/preview, post-create guide, and right sidebar panes use internal scrolling or clipping under the fixed app frame.
- The non-native detail header remains in DOM as state plumbing but is hidden from visual layout and runtime body text.
- Existing save wiring remains in renderer code: click handler, keyboard save path, autosave scheduling, and save state updates still exist.
- Runtime audit now records `projectViewportBounded`, `detailHeaderVisible`, and `detailSaveChromeTextVisible`, and fails project scenarios if these regress.

### Known Gaps And Risks

- This phase does not replace the custom Electron toolbar with a fully native titlebar toolbar.
- This phase does not run the signed/notarized release flow. Final migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation.
