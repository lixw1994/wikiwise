## Why

The Electron release workflow currently uploads the DMG and top-level release report, but it drops the detailed runtime audit report/screenshots and the packaged runtime smoke report produced by the canonical release script. Final migration evidence should retain those audit artifacts from the credential-backed release run, not only mention that gates passed.

## What Changes

- Upload detailed runtime audit JSON/screenshots and packaged runtime smoke JSON as GitHub Actions artifacts after a successful Electron release workflow run.
- Update release workflow documentation to describe all retained release evidence artifacts.
- Update release specs so retained workflow evidence includes the DMG, release report, detailed runtime audit evidence, and packaged runtime smoke evidence.

## Capabilities

### New Capabilities

### Modified Capabilities
- `electron-release-workflow`: Workflow artifact retention must include runtime audit evidence and packaged runtime smoke evidence.
- `electron-release-distribution`: Automated release workflow evidence must retain audit artifacts produced by the canonical release script.
- `electron-native-parity-roadmap`: Track release audit artifact retention as final migration evidence hardening.

## Impact

- Affected workflow: `.github/workflows/electron-release.yml`.
- Affected docs/tests: `apps/electron/README.md`, `apps/electron/test/release-workflow.test.js`.
- Affected specs: Electron release workflow, release distribution, and migration roadmap.
