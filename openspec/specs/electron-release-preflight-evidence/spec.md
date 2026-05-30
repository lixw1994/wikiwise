# electron-release-preflight-evidence Specification

## Purpose
Define Electron release prerequisite preflight behavior and retained blocker evidence before final signed and notarized distribution.
## Requirements
### Requirement: Explicit Release Preflight

The repository SHALL provide an Electron release preflight path that checks local production-release prerequisites without creating release artifacts.

#### Scenario: Release preflight is run

- **WHEN** the Electron release preflight command is run
- **THEN** it checks required macOS release tooling, hardened runtime entitlements, Developer ID signing identity, and Apple notarization profile availability
- **AND** it exits before runtime audit, Electron packaging, app signing, DMG creation, notarization submission, stapling, or assessment
- **AND** it does not create or modify `apps/electron/out/Wikiwise.app` or `Wikiwise-macOS.dmg`

#### Scenario: Release preflight passes

- **WHEN** all local release prerequisites are available
- **THEN** preflight exits zero
- **AND** it reports that release prerequisites are available for the requested version
- **AND** it does not claim that a signed or notarized release was produced

#### Scenario: Release preflight is blocked

- **WHEN** any required release prerequisite is missing or unusable
- **THEN** preflight exits non-zero
- **AND** it reports the specific missing command, entitlement file, signing identity, or notarization profile
- **AND** it does not continue to audit, package, sign, create, notarize, staple, or assess release artifacts

### Requirement: Release Blocker Evidence

Release preflight verification SHALL retain evidence that distinguishes implementation completion from credential-dependent release execution.

#### Scenario: Preflight evidence is retained

- **WHEN** a release preflight phase is verified
- **THEN** verification records the exact preflight command
- **AND** it records whether preflight passed or which prerequisite blocked it
- **AND** it records that final Electron release completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation

### Requirement: Optional Release Preflight Report
The Electron release preflight path SHALL support writing retained prerequisite evidence to a caller-provided JSON report path.

#### Scenario: Preflight report path is provided
- **WHEN** the Electron release preflight command is run with a report path
- **THEN** it writes a JSON report containing the requested version, production release command, preflight command, prerequisite checks, blocker list, and artifact production status
- **AND** it creates the report parent directory if needed
- **AND** it exits before runtime audit, Electron packaging, app signing, DMG creation, notarization submission, stapling, or assessment

#### Scenario: Preflight report is generated while blocked
- **WHEN** release preflight is blocked and a report path was provided
- **THEN** the report is still written
- **AND** the report records `status` as `blocked`
- **AND** the command exits non-zero
- **AND** the report does not claim that a signed or notarized release was produced
