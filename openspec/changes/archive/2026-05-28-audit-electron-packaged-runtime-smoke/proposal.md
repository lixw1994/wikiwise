## Why

The release path currently runs the detailed Electron runtime parity audit before packaging, then creates `apps/electron/out/Wikiwise.app` afterward. That leaves a gap where the actual packaged app bundle can miss renderer, preload, dependency, or resource layout problems while pre-package audit evidence still passes.

## What Changes

- Add a packaged Electron runtime smoke audit command that launches `apps/electron/out/Wikiwise.app` and records retained JSON evidence.
- Teach the packaged app to run a minimal `--audit-packaged-runtime` mode that loads its packaged renderer through its packaged preload and verifies key bundled runtime files.
- Preserve Electron framework symlinks as relative in the packaged app so Chromium resources resolve from inside `Wikiwise.app`.
- Run the packaged smoke audit in the canonical release script after packaging and before signing.
- Record the packaged smoke audit as a release gate and in the migration roadmap evidence.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-runtime-parity-audit`: Add packaged-app runtime smoke evidence alongside the detailed pre-package renderer audit.
- `electron-release-distribution`: Require the full release command to run packaged runtime smoke after package creation and before signing, and record it as release evidence.
- `electron-macos-packaging`: Require Electron framework symlinks to remain bundle-relative during packaging.
- `electron-native-parity-roadmap`: Track packaged runtime smoke as retained final-app-bundle evidence.

## Impact

- Affected code: `apps/electron/src/main/main.js`, `scripts/package-electron-macos.mjs`, `scripts/build-release.sh`, and a new packaged runtime audit launcher script.
- Affected manifests/docs: root and Electron npm scripts, Electron README.
- Affected tests: runtime audit and macOS packaging/release tests.
- Affected release behavior: full releases gain an extra local packaged-app smoke gate before signing, notarization, stapling, and assessment.
