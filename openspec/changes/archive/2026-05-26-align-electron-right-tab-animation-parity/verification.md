## Verification

- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js` failed before implementation with the expected missing `.right-tab` transition assertion.
- `npm --workspace @wikiwise/electron-app test -- test/right-sidebar-terminal.test.js` passed after implementation: 20/20 Electron right-sidebar tests.
- `npm test` passed: Electron app 211/211 tests and core 31/31 tests.
- `swift build` passed.
- `openspec validate --all --strict` passed: 33/33 items while this change was active.
- `git diff --check` passed.
- `npm run electron:package:mac` passed and packaged `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:release:readiness` reached the expected credential gate: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.
