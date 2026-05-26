## Why

Wikiwise's native SwiftPM target and current native app bundle require macOS 14+, but the packaged Electron app inherits Electron's `LSMinimumSystemVersion` of `11.0`. Aligning this metadata removes a visible release-parity mismatch and prevents the Electron package from advertising support below the native app baseline.

## What Changes

- Set the packaged Electron app's `LSMinimumSystemVersion` to `14.0`.
- Add regression coverage tying the Electron package script to the native app bundle and SwiftPM platform baseline.
- Keep product identity, icon, version rewriting, privacy plist cleanup, local unsigned packaging, and canonical signed/notarized release workflow unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-macos-packaging`: Packaged app metadata must declare the same minimum macOS version as the native app.
- `electron-native-parity-roadmap`: Track this minimum-version metadata cleanup as a packaging/release parity gap closure.

## Impact

- `scripts/package-electron-macos.mjs` `Info.plist` rewrite behavior.
- `apps/electron/test/macos-packaging.test.js` packaging metadata coverage.
- Packaged local app output under `apps/electron/out/Wikiwise.app`.
- OpenSpec packaging and roadmap requirements plus retained verification evidence.
