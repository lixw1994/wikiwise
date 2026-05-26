## Why

The packaged Electron app currently inherits Electron template `Info.plist` keys for Camera, Microphone, Bluetooth, and arbitrary App Transport Security loading, while the native Wikiwise app does not declare those permissions or ATS relaxation. Removing unused permission metadata reduces a visible macOS release-parity gap before signed/notarized distribution.

## What Changes

- Strip unused Electron template privacy usage description keys from the packaged `Wikiwise.app` `Info.plist`.
- Strip the Electron template `NSAppTransportSecurity` arbitrary-loads override from the packaged app when Wikiwise does not require it.
- Keep Wikiwise product metadata, icon metadata, Electron runtime-required keys, signing/notarization flow, and local unsigned packaging behavior unchanged.
- Add regression coverage and retained package verification evidence.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-macos-packaging`: Packaged app metadata must avoid unused permission and ATS template keys that the native app does not declare.
- `electron-native-parity-roadmap`: Track this `Info.plist` cleanup as a packaging/release parity gap closure.

## Impact

- `scripts/package-electron-macos.mjs` `Info.plist` rewrite behavior.
- `apps/electron/test/macos-packaging.test.js` package metadata coverage.
- Packaged local app output under `apps/electron/out/Wikiwise.app`.
- OpenSpec packaging and roadmap requirements plus retained verification evidence.
