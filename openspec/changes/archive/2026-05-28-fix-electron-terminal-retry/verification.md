## Verification

RED:
- `npm --workspace @wikiwise/electron-app test -- --test-reporter=spec test/right-sidebar-terminal.test.js` failed on missing `terminalStartPromise`, `startTerminalSession`, and `sendTerminalData` recovery behavior.
- `npm --workspace @wikiwise/electron-app test -- --test-reporter=spec test/runtime-parity-audit.test.js` failed on missing packaged terminal echo audit evidence.

GREEN:
- `npm --workspace @wikiwise/electron-app test -- --test-reporter=spec test/right-sidebar-terminal.test.js` passed: 30 tests.
- `npm --workspace @wikiwise/electron-app test -- --test-reporter=spec test/runtime-parity-audit.test.js` passed: 23 tests.

Full validation:
- `npm run electron:package:mac` passed and rebuilt `apps/electron/out/Wikiwise.app`.
- `npm run electron:audit:packaged` passed; report status is `passed`, terminal `spawned` is `true`, and `terminalEchoObserved` is `true`.
- `npm run electron:audit:runtime` passed all 7 scenarios and retained report/screenshots.
- `openspec validate --all --strict` passed: 35 items.
- `npm test` passed: Electron 281 tests, core 42 tests.
- `swift build` passed.
