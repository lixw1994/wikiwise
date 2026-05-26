## Why

The Electron release path can fail safely and retain preflight blocker evidence, but a successful full release currently only prints console output. Final migration acceptance needs durable, machine-readable evidence that the Electron DMG was signed, notarized, stapled, assessed, and tied to the exact artifact that would replace the native macOS build.

## What Changes

- Add an optional retained full-release report path to the canonical Electron release script.
- Record successful release evidence after the signed/notarized/stapled/assessed DMG completes, including version, artifact path, checksum, release command, completed gate list, and final migration status.
- Document the difference between readiness/preflight reports and full-release success reports.
- Preserve the existing credential gate: no report may claim signed/notarized success unless the production release steps actually complete.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-release-distribution`: Require the canonical release command to support retained success evidence for completed signed/notarized Electron DMG releases.
- `electron-native-parity-roadmap`: Record release success evidence as the final distribution proof needed before migration completion can be claimed.

## Impact

- `scripts/build-release.sh`
- `package.json`
- `apps/electron/README.md`
- `apps/electron/test/macos-packaging.test.js`
- OpenSpec release distribution and native parity roadmap specs
