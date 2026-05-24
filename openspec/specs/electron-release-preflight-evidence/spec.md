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
- **AND** it records that final migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation
