## Why

The Electron package command already defaults to the native app bundle version, but the canonical release script still defaults to `0.1.0`. Release readiness and future signed release evidence should not drift from the native app metadata when no explicit release version is supplied.

## What Changes

- Make the no-argument Electron release script default to the native app `CFBundleShortVersionString`.
- Keep explicit release-version arguments as the production override used by signing, packaging, reports, and release notes.
- Record readiness-report evidence that the default release version matches native metadata even when credential prerequisites block the release.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-release-distribution`: add native-aligned default release version behavior for the canonical release command.
- `electron-release-readiness-evidence`: add retained readiness evidence for native-aligned default release version reports.
- `electron-native-parity-roadmap`: add phase completion tracking for release default version parity.

## Impact

- Affects `scripts/build-release.sh` version resolution and retained release/readiness report metadata.
- Adds focused Node test coverage for no-argument release readiness version parity.
- Does not bypass signing, notarization, stapling, assessment, or the explicit `<version>` production release path.
