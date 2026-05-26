## Why

The current native Wikiwise app bundle declares `CFBundleShortVersionString` as `0.1.9` and `CFBundleVersion` as `1`, while the local Electron package defaults to `0.0.0` for both fields when no release version is supplied. Aligning local package defaults with the native app removes another visible macOS bundle metadata mismatch during parity review.

## What Changes

- Make `npm run electron:package:mac` default to the current native app bundle version metadata when no explicit version argument is provided.
- Preserve the canonical release behavior where `bash scripts/build-release.sh <version>` passes an explicit release version into the Electron package step.
- Keep bundle identity, icon, minimum macOS metadata, privacy plist cleanup, local unsigned packaging, and signed/notarized release workflow unchanged.
- Add regression coverage and retained package inspection evidence.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-macos-packaging`: Packaged app version metadata must mirror the native app by default while preserving explicit release-version overrides.
- `electron-native-parity-roadmap`: Track bundle version metadata parity as a packaging/release gap closure.

## Impact

- `scripts/package-electron-macos.mjs` version metadata resolution.
- `apps/electron/test/macos-packaging.test.js` packaging metadata coverage.
- Packaged local app output under `apps/electron/out/Wikiwise.app`.
- OpenSpec packaging and roadmap requirements plus retained verification evidence.
