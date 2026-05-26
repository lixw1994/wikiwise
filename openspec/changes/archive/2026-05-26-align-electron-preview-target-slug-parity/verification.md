## Verification

- `npm --workspace @wikiwise/electron-app test -- test/preview-navigation-map-graph.test.js` failed before implementation with 7 passing tests and the new target slug normalization regression failing because Electron still used `path.basename(targetPath, path.extname(targetPath)).toLowerCase()`.
- `npm --workspace @wikiwise/electron-app test -- test/preview-navigation-map-graph.test.js` passed after implementation with 8/8 tests passing.
- `npm test` passed with Electron 210/210 tests and core 31/31 tests passing.
- `swift build` passed.
- `openspec validate --all --strict` passed with 33/33 items.
- `git diff --check` passed.
- `npm run electron:package:mac` passed and produced `apps/electron/out/Wikiwise.app` with bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:release:readiness` exited 1 at the expected credential gate: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable notarization keychain profile `notarytool`.
