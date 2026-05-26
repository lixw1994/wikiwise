## Why

The packaged Electron app still carries the inherited `Contents/Resources/electron.icns` template icon even though `CFBundleIconFile` points to `Wikiwise.icns` and the native Wikiwise bundle does not include an Electron-branded icon resource. Removing the unused template icon narrows another visible bundle-resource mismatch without touching runtime code.

## What Changes

- Remove unused `electron.icns` from the packaged Electron macOS app after copying the Electron template.
- Preserve the native `Wikiwise.icns` app icon resource and `CFBundleIconFile = Wikiwise` metadata.
- Preserve Electron runtime resources, embedded app layout, plist cleanup, version/minimum-macOS metadata, and release workflow behavior.
- Add regression coverage and retained package inspection evidence.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-macos-packaging`: Packaged app resources must remove the unused Electron template icon while retaining the Wikiwise icon.
- `electron-native-parity-roadmap`: Track unused template icon cleanup as a packaging/release gap closure phase.

## Impact

- `scripts/package-electron-macos.mjs` package resource cleanup logic.
- `apps/electron/test/macos-packaging.test.js` packaging resource coverage.
- Packaged local app output under `apps/electron/out/Wikiwise.app`.
- OpenSpec packaging and roadmap requirements plus retained verification evidence.
