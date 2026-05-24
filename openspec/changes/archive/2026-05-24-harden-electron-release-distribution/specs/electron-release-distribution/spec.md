## ADDED Requirements

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
