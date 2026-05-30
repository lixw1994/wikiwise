# electron-release-readiness-evidence Specification

## Purpose
Define retained Electron release readiness evidence for credential-dependent signing and notarization prerequisites without producing release artifacts.

## Requirements
### Requirement: Structured Release Readiness Report
The repository SHALL provide a command that records Electron release readiness evidence without creating signed, notarized, or packaged release artifacts.

#### Scenario: Readiness report command is run
- **WHEN** the Electron release readiness command is run
- **THEN** it delegates to the canonical release script in preflight mode
- **AND** it writes a JSON report under `apps/electron/out/release-readiness/report.json`
- **AND** it does not run runtime audit, package the app, sign the app, create a DMG, notarize, staple, or assess release artifacts

#### Scenario: Readiness report is blocked by prerequisites
- **WHEN** any release prerequisite is missing or unusable
- **THEN** the readiness report records `status` as `blocked`
- **AND** it records the specific prerequisite blocker names and messages
- **AND** it records that no signed or notarized release was produced

#### Scenario: Readiness report passes prerequisites
- **WHEN** all local release prerequisites are available
- **THEN** the readiness report records `status` as `ready`
- **AND** it records that the machine is ready to run the canonical production release command
- **AND** it still does not claim that a signed or notarized release was produced

### Requirement: Release Readiness Documentation
Release documentation SHALL distinguish retained readiness evidence from actual production release execution.

#### Scenario: Developer reads release readiness docs
- **WHEN** a developer reads the Electron release documentation
- **THEN** the docs identify the release readiness command and report path
- **AND** the docs state that final Electron release completion still requires `bash scripts/build-release.sh <version>` to complete signing and notarization, or an explicitly accepted OpenSpec deviation

### Requirement: Electron Package Readiness Version Evidence
Electron release readiness evidence SHALL prove the no-argument release path resolves to the Electron package version.

#### Scenario: No-argument readiness report is blocked by credentials
- **WHEN** the Electron release readiness command runs without an explicit release version and credential prerequisites are missing
- **THEN** it writes a blocked readiness report
- **AND** the report `version` matches `apps/electron/package.json` `version`
- **AND** the report still records that no release artifacts, signed app, or notarized DMG were produced
