## Why

Electron now covers the user-visible app workflows and has retained runtime screenshot evidence, but the canonical release path still belongs to the original Swift app. The migration cannot be considered release-ready until `bash scripts/build-release.sh <version>` builds the Electron app and preserves the same signed, notarized DMG gate as the native macOS release.

## What Changes

- Switch the canonical release script to an Electron release flow.
- Require the Electron runtime parity audit before release packaging.
- Package the Electron app bundle, sign it with hardened runtime options, create a DMG, sign the DMG, submit notarization, staple the ticket, and verify the final artifact.
- Add Electron signing entitlements and structural tests for release-script guardrails.
- Update docs/specs so release instructions point at the Electron distribution path while keeping the same release command.

## Success Criteria

- `scripts/build-release.sh` packages Electron through the checked-in Electron package command.
- The release script includes the runtime audit, app signing, DMG creation/signing, notarization, stapling, and final assessment steps.
- The release script fails instead of silently producing an unsigned or unnotarized release artifact.
- Tests and OpenSpec evidence document the release gate and the remaining need for real Developer ID/notary credentials to execute a production release.

## Non-Goals

- Do not perform an actual notarization in local development without credentials.
- Do not change user-facing app behavior or Swift feature code in this phase.
- Do not introduce a third-party Electron builder dependency.
- Do not publish a GitHub release.

## Capabilities

### New Capabilities

- `electron-release-distribution`: Canonical signed/notarized Electron DMG release workflow.

### Modified Capabilities

- `electron-macos-packaging`: Distinguish local unsigned packaging from canonical signed Electron release distribution.
- `electron-native-parity-roadmap`: Record release hardening as the final distribution gate for migration completion.

## Impact

- Affected release files: `scripts/build-release.sh`, Electron packaging tests, Electron README, root release docs, and OpenSpec release specs.
- Affected app files: Electron signing entitlements under `apps/electron/`.
- No Swift source changes are intended.
