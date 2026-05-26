## ADDED Requirements

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
