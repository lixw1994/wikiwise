## Why

Electron already implements compiled-preview local link routing, but the runtime parity audit still stubs the navigation IPC and cannot prove that a real preview click selects the matching markdown file through app history. This leaves one of the explicit native-preview parity gaps recorded as deferred even after the renderer and main-process code paths exist.

## What Changes

- Extend the Electron runtime audit with a deterministic compiled-preview local link that targets another scaffold markdown page.
- Replace the runtime audit's null preview-navigation IPC stub with audit-only resolution that mirrors the production markdown and generated-page routing behavior.
- Capture and assert evidence that clicking a local preview link selects the target markdown file and that app Back restores the original `home.md` preview.
- Update compiler-preview gap wording so phase verification no longer records in-preview navigation, live rebuild, or map toolbar parity as deferred once their archived evidence exists.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-runtime-parity-audit`: add runtime evidence for compiled-preview local link navigation through the preload bridge.
- `electron-preview-navigation-map-graph`: add audit-backed evidence that local preview navigation parity is covered by runtime scenarios.
- `electron-compiler-preview`: update the deferred preview gap requirement to point to the later archived parity evidence instead of listing completed preview work as still deferred.

## Impact

- Affected Electron audit surfaces: `scripts/audit-electron-runtime.mjs`, `apps/electron/test/runtime-parity-audit.test.js`.
- Affected OpenSpec surfaces: runtime parity audit, preview navigation/map/graph, and compiler preview specifications.
- No production IPC API shape, dependencies, scaffold output, signing, notarization, or release packaging changes are expected.
