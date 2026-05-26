## Why

The Electron migration has repeatable release preflight checks, but the final gate still depends on machine-specific Developer ID and Apple notarization credentials. We need retained, structured readiness evidence so each verification run can prove which prerequisites passed or blocked without pretending a signed/notarized release was produced.

## What Changes

- Add a release preflight report mode that records the requested version, release command, prerequisite status, blockers, and final signed/notarized release requirement.
- Expose an npm command for generating the retained Electron release readiness report.
- Document where the readiness report is written and how it differs from the canonical production release command.
- Preserve `bash scripts/build-release.sh <version>` as the only production signed/notarized release path.

## Capabilities

### New Capabilities

- `electron-release-readiness-evidence`: Structured release readiness evidence for credential-dependent Electron migration gates.

### Modified Capabilities

- `electron-release-preflight-evidence`: Preflight evidence now includes an optional retained JSON report path.
- `electron-native-parity-roadmap`: Roadmap records release readiness evidence as support for the final distribution gate while preserving the actual signed/notarized release requirement.

## Impact

- Affected code: `scripts/build-release.sh`, root `package.json`, Electron packaging tests, Electron README, and OpenSpec release specs.
- No dependency changes.
- No change to the canonical signed/notarized release command.
