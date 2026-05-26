## Why

The packaged Electron app still inherits non-runtime template metadata that the current native Wikiwise app bundle does not declare, including Xcode build provenance keys and an App Store category. Removing those extras tightens macOS bundle parity while preserving Electron runtime-required plist fields.

## What Changes

- Strip unused Electron template build-provenance keys from the packaged app `Info.plist`: `DTCompiler`, `DTSDKBuild`, `DTSDKName`, `DTXcode`, and `DTXcodeBuild`.
- Stop adding `LSApplicationCategoryType` during local Electron packaging because the native app bundle does not declare it.
- Preserve Wikiwise product metadata, native-aligned version/minimum-macOS metadata, privacy plist cleanup, and Electron runtime-required keys such as `NSPrincipalClass`, `NSMainNibFile`, and `LSEnvironment`.
- Add regression coverage and retained package inspection evidence.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-macos-packaging`: Packaged app plist cleanup must remove non-native, non-runtime Electron template build/category metadata.
- `electron-native-parity-roadmap`: Track template plist metadata cleanup as a packaging/release gap closure phase.

## Impact

- `scripts/package-electron-macos.mjs` plist rewrite and cleanup logic.
- `apps/electron/test/macos-packaging.test.js` packaging metadata coverage.
- Packaged local app output under `apps/electron/out/Wikiwise.app`.
- OpenSpec packaging and roadmap requirements plus retained verification evidence.
