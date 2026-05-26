## Why

The Electron release script can already produce signed/notarized release evidence, but this local machine does not have the Developer ID identity or Apple notarization profile needed to execute the final gate. A repository workflow gives the migration a repeatable credential-backed lane for producing the actual release artifact once the required GitHub secrets are configured.

## What Changes

- Add a manually dispatched macOS GitHub Actions workflow for Electron release execution.
- Have the workflow install dependencies, import the Developer ID certificate into a temporary keychain, configure the `notarytool` profile, and run the canonical Electron release command with retained release evidence.
- Upload the signed/notarized DMG and JSON release report as workflow artifacts.
- Document the required secrets and the fact that migration completion still requires a successful workflow run or local release run.

## Capabilities

### New Capabilities

- `electron-release-workflow`: Credential-backed GitHub Actions release workflow for running the canonical signed/notarized Electron release command.

### Modified Capabilities

- `electron-release-distribution`: Require any automated Electron release workflow to delegate to the canonical release script and retain success evidence.
- `electron-native-parity-roadmap`: Track the release workflow as a final distribution support phase while preserving the actual signed/notarized release success gate.

## Impact

- Adds `.github/workflows/electron-release.yml`.
- Updates Electron release documentation.
- Adds static workflow tests under `apps/electron/test/`.
- Updates OpenSpec release distribution and roadmap specs.
