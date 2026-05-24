## Why

The migration now has broad structural and workflow parity, but final acceptance still needs live runtime evidence instead of source-only checks. A repeatable Electron audit command will load the actual renderer/preload in Electron, capture visual artifacts, and record DOM evidence for the welcome and project states before final parity can be claimed.

## What Changes

- Add an Electron runtime audit command that launches an offscreen BrowserWindow with the current renderer and preload bridge.
- Capture light and dark screenshots for both the no-folder welcome state and an opened scaffold project state.
- Emit a machine-readable JSON report under `apps/electron/out/runtime-audit/`.
- Fail the audit when expected native shell text, project chrome, debug-panel removal, viewport dimensions, or screenshot nonblank checks are missing.
- Add structural tests for the audit command, script, report expectations, and README documentation.
- Update the Electron README to remove stale shared-resource wording and document the runtime audit workflow.

## Capabilities

### New Capabilities

- `electron-runtime-parity-audit`: Repeatable Electron runtime audit artifacts for live renderer/preload visual and DOM parity evidence.

### Modified Capabilities

- `electron-native-parity-roadmap`: Record runtime parity audit progress while leaving signed/notarized release hardening and any later accepted deviations open.

## Impact

- Affected code: root and Electron package scripts, `scripts/`, Electron tests, Electron README, and OpenSpec specs.
- The audit writes generated artifacts under ignored `apps/electron/out/runtime-audit/`.
- No Swift source changes are planned.
- No new npm dependencies are planned; the audit uses the installed Electron runtime.
- This phase does not claim final migration completion because release hardening and any screenshot review follow-up remain separate gates.
