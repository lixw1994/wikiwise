## Verification

RED:
- `npm --workspace @wikiwise/electron-app test -- --test-reporter=spec test/release-workflow.test.js` failed before implementation because the workflow did not upload `Wikiwise-electron-runtime-audit`.

GREEN:
- `npm --workspace @wikiwise/electron-app test -- --test-reporter=spec test/release-workflow.test.js` passed: 6 tests.

Full validation:
- `openspec validate --all --strict` passed: 34 items.
- `npm test` passed: Electron 281 tests, core 42 tests.
- `swift build` passed.
- `npm run electron:package:mac` passed and rebuilt `apps/electron/out/Wikiwise.app`.
- `npm run electron:audit:packaged` passed and wrote `apps/electron/out/packaged-runtime-audit/report.json` with status `passed` and terminal echo evidence.
- `npm run electron:audit:runtime` passed all 7 scenarios and wrote `apps/electron/out/runtime-audit/report.json` plus 7 screenshots.
- `npm run electron:release:readiness` exited nonzero with expected local credential blockers: `signing-identity` and `notary-profile`; it wrote `apps/electron/out/release-readiness/report.json` with status `blocked`.
