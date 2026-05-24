## Verification

- Red tests before implementation:
  - `node --test packages/wikiwise-core/test/compiler.test.js apps/electron/test/compiler-preview.test.js apps/electron/test/live-rebuild-watching.test.js apps/electron/test/runtime-parity-audit.test.js` failed on missing Electron background scheduler, watcher restart wiring, and runtime audit background evidence while the new core progressive compiler test passed.
- Focused green tests:
  - `node --check apps/electron/src/main/main.js` — passed.
  - `node --check scripts/audit-electron-runtime.mjs` — passed.
  - `node --test packages/wikiwise-core/test/compiler.test.js apps/electron/test/compiler-preview.test.js apps/electron/test/live-rebuild-watching.test.js apps/electron/test/runtime-parity-audit.test.js` — passed 20 tests.
- Runtime audit:
  - `npm run electron:audit:runtime` — passed all four runtime scenarios and exited with code 0.
  - `project-light` and `project-dark` recorded `backgroundCompilationComplete: true`.
  - Project scenarios recorded background compilation evidence with batch size `3`, observed remaining pages `[3, 0]`, and final remaining `0`.
- Full validation:
  - `npm test` — passed 71 Electron app tests and 27 core package tests.
  - `swift build` — passed.
  - `openspec validate add-electron-background-compilation-parity --strict` — passed.
  - `openspec validate --all --strict` — passed 25 items.
  - `git diff --check` — passed.
  - `npm run electron:package:mac` — packaged `apps/electron/out/Wikiwise.app` successfully as an unsigned local bundle.

## Remaining Release Gate

This phase does not complete the full migration goal. Final release parity still requires actual signed/notarized DMG execution through `bash scripts/build-release.sh <version>` or an explicitly accepted OpenSpec deviation.
