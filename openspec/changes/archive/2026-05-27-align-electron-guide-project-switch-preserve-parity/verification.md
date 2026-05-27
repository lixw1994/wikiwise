## Commands Run

- `npm --workspace @wikiwise/electron-app test -- test/new-wiki-scaffold.test.js`
  - RED before implementation: failed on `applyProjectResult` assigning `state.showPostCreateGuide = Boolean(options.showPostCreateGuide)`.
  - GREEN after implementation: 32/32 Electron new-wiki scaffold tests passed.
- `openspec validate --all --strict`
  - Before archive: 34/34 items passed, including `change/align-electron-guide-project-switch-preserve-parity`.
  - After archive: 33/33 specs passed.
- `npm test`
  - Electron workspace: 261/261 tests passed.
  - Core workspace: 42/42 tests passed.
- `swift build`
  - Swift package build completed successfully.
- `npm run electron:package:mac`
  - Packaged local unsigned app at `apps/electron/out/Wikiwise.app`.
- `npm run electron:audit:runtime`
  - Runtime audit completed successfully.
  - Report: `apps/electron/out/runtime-audit/report.json`.
  - Screenshots: `apps/electron/out/runtime-audit/screenshots`.
  - Passed scenarios: welcome-light, welcome-dark, new-wiki-light, new-wiki-dark, standalone-file-light, project-light, project-dark.
- `npm run electron:release:readiness`
  - Expected blocked exit due to missing local release credentials.
  - Report: `apps/electron/out/release-readiness/report.json`.

## Parity Evidence

- Native evidence: `ContentView.openURL(_:)` resets folder project state, starts project services, loads `wiki/home.md` when present, and does not assign `showPostCreateGuide`.
- Native explicit-hide evidence: the post-create guide button assigns `showPostCreateGuide = false`; scaffold failure also does not show the guide.
- Electron evidence: `applyProjectResult` now treats `showPostCreateGuide: true` as an explicit show request and no longer converts missing options into a guide hide.
- Electron explicit-hide evidence: `dismissPostCreateGuide` and scaffold failure handling still assign `state.showPostCreateGuide = false`.

## Known Gaps / Residual Risks

- Release readiness remains blocked until a Developer ID signing identity and usable `notarytool` keychain profile are available.
- No signed or notarized release artifact was produced in this local verification pass.
