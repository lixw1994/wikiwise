# electron-release-distribution Specification

## Purpose
Define the canonical signed and notarized Electron macOS release workflow.
## Requirements
### Requirement: Canonical Electron Release Command

The repository SHALL use `bash scripts/build-release.sh <version>` as the canonical Electron macOS release command.

#### Scenario: Electron release script is inspected

- **WHEN** the release script is inspected
- **THEN** it runs the Electron runtime parity audit before release packaging
- **AND** it packages the Electron app bundle through the checked-in Electron packaging command
- **AND** it produces a release DMG named `Wikiwise-macOS.dmg`

### Requirement: Signed And Notarized DMG Gate

The Electron release command SHALL preserve the native macOS release gate of signing, notarization, stapling, and final assessment.

#### Scenario: Release script is inspected

- **WHEN** the release script is inspected
- **THEN** it signs the Electron app with hardened runtime options
- **AND** it creates and signs the DMG
- **AND** it submits the DMG for Apple notarization
- **AND** it staples the notarization ticket
- **AND** it verifies the final DMG before reporting release success

### Requirement: Release Prerequisite Guardrails

The Electron release command SHALL fail instead of producing a release artifact when required local release prerequisites are unavailable.

#### Scenario: Release prerequisites are missing

- **WHEN** signing identity, notarization tooling, DMG tooling, or the packaged Electron app are unavailable
- **THEN** the release command exits non-zero
- **AND** it reports which prerequisite blocked the release
- **AND** it does not claim a signed or notarized release succeeded

### Requirement: Release Documentation

Release documentation SHALL describe the Electron release path and retain the requirement to use the canonical release command.

#### Scenario: Release docs are inspected

- **WHEN** release documentation is inspected
- **THEN** it directs production releases through `bash scripts/build-release.sh <version>`
- **AND** it identifies the output DMG
- **AND** it states that Developer ID signing and Apple notarization credentials are required

### Requirement: Electron Release Preflight Mode

The canonical Electron release script SHALL expose a preflight-only mode while preserving the production signed/notarized release command.

#### Scenario: Release script is inspected for preflight mode

- **WHEN** the release script and package manifests are inspected
- **THEN** the repository exposes a release preflight command
- **AND** the preflight command delegates to `bash scripts/build-release.sh --preflight <version>`
- **AND** `bash scripts/build-release.sh <version>` remains the canonical production release command

#### Scenario: Production release path is preserved

- **WHEN** the full Electron release command is inspected
- **THEN** it still runs the runtime parity audit before release packaging
- **AND** it still signs the Electron app with hardened runtime entitlements
- **AND** it still creates and signs `Wikiwise-macOS.dmg`
- **AND** it still submits Apple notarization, staples the ticket, assesses the DMG, and only then reports release success

### Requirement: Early Notarization Prerequisite Validation

The Electron release script SHALL validate notarization credentials before doing expensive release work.

#### Scenario: Notarization profile is unavailable

- **WHEN** the configured notary keychain profile is missing or unusable
- **THEN** the release script exits non-zero during preflight
- **AND** it reports the notary profile as the blocker
- **AND** it does not continue to runtime audit, packaging, signing, DMG creation, notarization submission, stapling, or assessment

### Requirement: Retained Signed Release Evidence

The canonical Electron release command SHALL support retained structured evidence for completed signed and notarized DMG releases.

#### Scenario: Full release report is requested

- **WHEN** `bash scripts/build-release.sh --release-report <path> <version>` completes successfully
- **THEN** it writes a JSON report at `<path>`
- **AND** the report records the release version, canonical release command, DMG artifact path, DMG SHA-256 checksum, completed runtime audit, package, app-signing, DMG-signing, notarization, stapling, and assessment gates
- **AND** the report records that a signed and notarized release artifact was produced
- **AND** the report records that the final Electron migration release requirement is satisfied by this release artifact

#### Scenario: Full release report cannot be produced before success

- **WHEN** any release prerequisite or production release gate fails
- **THEN** no success report claims that a signed or notarized release was produced
- **AND** preflight/readiness reports remain the only report mode available for no-artifact prerequisite checks

#### Scenario: Report modes are not interchangeable

- **WHEN** `--release-report` is combined with `--preflight`
- **THEN** the command exits non-zero before running release work
- **AND** it reports that release success evidence requires the full production release command

### Requirement: Native-Aligned Default Release Version
The canonical Electron release command SHALL default to the current native app bundle version metadata when no explicit release version is provided.

#### Scenario: Release script is inspected for default version resolution
- **WHEN** the release script is inspected
- **THEN** it reads the native app `CFBundleShortVersionString` from `Wikiwise.app/Contents/Info.plist`
- **AND** it uses that value as the release version when no positional `<version>` argument is supplied
- **AND** it still lets an explicit `<version>` argument override the native default

#### Scenario: Default release version is used in release evidence
- **WHEN** the release command writes readiness or release evidence without an explicit version argument
- **THEN** the evidence records the native app `CFBundleShortVersionString` as `version`
- **AND** generated release command strings include that native-aligned version

### Requirement: Automated Release Workflow Delegation
Any repository automation that produces Electron release artifacts SHALL delegate to the canonical Electron release script instead of duplicating release gates.

#### Scenario: Automated release workflow is inspected
- **WHEN** an Electron release workflow is inspected
- **THEN** it runs `bash scripts/build-release.sh --release-report <path>` or an npm script that delegates to that command
- **AND** signing, DMG creation, notarization, stapling, and assessment remain performed by `scripts/build-release.sh`
- **AND** the workflow retains the success report generated by the canonical script
