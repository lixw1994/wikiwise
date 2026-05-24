## ADDED Requirements

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
