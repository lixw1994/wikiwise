## Why

Electron has source-level coverage for generated map and graph navigation, but the runtime parity audit does not prove the native toolbar map flow through the real renderer. The macOS app's toolbar map button opens `map-3d.html` as a generated page and preserves back navigation to the current markdown page, so the Electron migration needs repeatable runtime evidence for that behavior.

## What Changes

- Extend the Electron runtime parity audit to activate the opened-project map toolbar control.
- Record evidence that Electron displays the generated `map-3d.html` page in the generated preview frame.
- Record evidence that app back navigation returns from the generated map page to the selected markdown page before the rest of the project audit continues.
- Fail project audit scenarios when generated map evidence is absent, the generated frame is not visible, or back navigation does not restore `home.md`.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-runtime-parity-audit`: add runtime evidence and assertions for the native toolbar generated map flow.
- `wikiwise-core-package`: ensure full compiler generation remains valid after progressive scan/cache usage.

## Impact

- Affected code: `scripts/audit-electron-runtime.mjs`, `apps/electron/test/runtime-parity-audit.test.js`, `Sources/Wikiwise/Resources/build.js`, `packages/wikiwise-core/test/compiler.test.js`.
- Affected specs: `openspec/specs/electron-runtime-parity-audit/spec.md`, `openspec/specs/wikiwise-core-package/spec.md`.
- No Swift, dependency, release signing, or packaging contract changes are expected.
