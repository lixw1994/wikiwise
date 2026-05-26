## Why

The packaged Electron app still carries the inherited `Contents/PkgInfo` file from the Electron template, while the current native `Wikiwise.app` bundle does not include `PkgInfo`. Removing this unused legacy template file narrows the packaged bundle layout mismatch without touching Electron runtime resources.

## What Changes

- Remove `Contents/PkgInfo` from the packaged Electron macOS app after copying the Electron template.
- Preserve the packaged `Contents/Info.plist`, `Contents/MacOS/Wikiwise`, `Contents/Resources/Wikiwise.icns`, embedded app layout, and Electron runtime resources.
- Add regression coverage and retained package inspection evidence proving `PkgInfo` is absent from the Electron package and absent from the native bundle.
- Keep signed/notarized release execution as the remaining final migration gate.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-macos-packaging`: Packaged app contents must remove the unused Electron template `PkgInfo` file while preserving required runtime and metadata files.
- `electron-native-parity-roadmap`: Track `PkgInfo` cleanup as a packaging/release gap closure phase.

## Impact

- `scripts/package-electron-macos.mjs` package cleanup logic.
- `apps/electron/test/macos-packaging.test.js` packaging coverage.
- Packaged local app output under `apps/electron/out/Wikiwise.app`.
- OpenSpec packaging and roadmap requirements plus retained verification evidence.
