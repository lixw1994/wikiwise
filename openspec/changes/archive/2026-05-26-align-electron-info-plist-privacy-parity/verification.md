## Verification

Date: 2026-05-26

## Red / Green

- Red: `node --test apps/electron/test/macos-packaging.test.js` failed after adding the package metadata parity contract because `scripts/package-electron-macos.mjs` did not yet define `removeElectronTemplateInfoPlistKeys`, `removePlistEntry`, or remove the inherited template keys.
- Green: after adding a fixed inherited-key cleanup path in `rewriteInfoPlist()`, the same focused command passed with 12 tests, 0 failures.

## Native App Plist Evidence

Command:

```bash
plutil -p Wikiwise.app/Contents/Info.plist
```

Result:

- Native app metadata includes Wikiwise bundle identity, display name, executable, icon, version, minimum system version, and high-resolution capability.
- Native app metadata does not include `NSCameraUsageDescription`, `NSMicrophoneUsageDescription`, `NSBluetoothAlwaysUsageDescription`, `NSBluetoothPeripheralUsageDescription`, or `NSAppTransportSecurity`.

## Packaged Electron Plist Evidence

Commands:

```bash
npm run electron:package:mac
plutil -p apps/electron/out/Wikiwise.app/Contents/Info.plist
rg -n "NSCameraUsageDescription|NSMicrophoneUsageDescription|NSBluetoothAlwaysUsageDescription|NSBluetoothPeripheralUsageDescription|NSAppTransportSecurity|NSAllowsArbitraryLoads" apps/electron/out/Wikiwise.app/Contents/Info.plist
rg -n "CFBundleDisplayName|CFBundleName|CFBundleExecutable|CFBundleIdentifier|CFBundleIconFile|CFBundleShortVersionString|CFBundleVersion" apps/electron/out/Wikiwise.app/Contents/Info.plist
```

Result:

- Local unsigned Electron app bundle was packaged at `apps/electron/out/Wikiwise.app`.
- `plutil -p` shows Wikiwise product metadata remains present: display name, bundle name, executable, bundle identifier, icon, short version, and bundle version.
- `rg` found no unused Camera, Microphone, Bluetooth, ATS, or arbitrary-loads keys in the packaged Electron `Info.plist`.

## Runtime Evidence

Command:

```bash
npm run electron:audit:runtime
```

Result:

- Runtime audit captured and passed `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
- Report path: `apps/electron/out/runtime-audit/report.json`.
- Screenshot path: `apps/electron/out/runtime-audit/screenshots`.

## Full Verification Commands

```bash
node --test apps/electron/test/macos-packaging.test.js
npm run electron:package:mac
npm test
swift build
openspec validate align-electron-info-plist-privacy-parity --strict
openspec validate --all --strict
git diff --check
npm run electron:audit:runtime
```

Results:

- Focused macOS packaging test passed with 12 tests, 0 failures.
- `npm test` passed with 169 Electron tests and 28 core tests.
- `swift build` completed successfully.
- Change-specific and all-spec OpenSpec validation passed.
- `git diff --check` reported no whitespace errors.
- Runtime audit passed all 7 retained scenarios.

## Residual Migration Gate

This phase closes unused Electron template privacy and ATS metadata in the
local packaged app. It does not complete the Electron migration by itself;
final completion still requires a successful `bash scripts/build-release.sh
<version>` signed and notarized release run, or an explicitly accepted
OpenSpec deviation.
