## Why

The Electron packaging script currently fixes the `node-pty` `spawn-helper` permission only for the current build architecture. A packaged app built on Apple Silicon can therefore leave the `darwin-x64` helper non-executable, preserving the same terminal startup failure on Intel Macs.

## What Changes

- Ensure macOS packaging repairs every packaged Darwin `node-pty` `spawn-helper`, not only `darwin-${process.arch}`.
- Retain verification that the package output contains executable helpers for both `darwin-arm64` and `darwin-x64` when both prebuilds are present.
- Preserve runtime startup's existing helper permission guard for the active architecture.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-macos-packaging`: Packaged terminal helper permission repair must cover every Darwin prebuild helper included in the app bundle.
- `electron-native-parity-roadmap`: Roadmap must track universal packaged terminal helper permission evidence as a native terminal reliability closure phase.

## Impact

- `scripts/package-electron-macos.mjs` packaged helper permission repair.
- `apps/electron/test/macos-packaging.test.js` package script coverage.
- Packaging verification of `apps/electron/out/Wikiwise.app`.
- OpenSpec packaging and roadmap specs.
