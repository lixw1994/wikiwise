# electron-release-workflow Specification

## Purpose
Define the credential-backed GitHub Actions workflow that prepares Apple release credentials and delegates Electron macOS release production to the canonical signed/notarized release script.
## Requirements
### Requirement: Manual Electron Release Workflow
The repository SHALL provide a manually dispatched macOS GitHub Actions workflow for producing credential-backed Electron release evidence.

#### Scenario: Release workflow is inspected
- **WHEN** the workflow definition is inspected
- **THEN** it is triggered by `workflow_dispatch`
- **AND** it runs on a macOS runner
- **AND** it installs repository dependencies before release execution
- **AND** it exposes an optional release-version input while allowing the release script to use its native-aligned default when the input is empty

### Requirement: Apple Release Credential Bootstrap
The Electron release workflow SHALL prepare Apple signing and notarization credentials from repository secrets without committing credentials.

#### Scenario: Credential bootstrap is inspected
- **WHEN** the workflow definition is inspected
- **THEN** it imports a base64-encoded Developer ID certificate into a temporary keychain
- **AND** it configures key partition access for non-interactive `codesign`
- **AND** it stores Apple notarization API key credentials into a keychain profile named `notarytool`
- **AND** it references required secrets for the certificate, certificate password, notarization key ID, notarization issuer ID, and notarization private key

### Requirement: Canonical Release Script Delegation
The Electron release workflow SHALL delegate release production to the canonical Electron release script.

#### Scenario: Workflow release step runs
- **WHEN** the workflow reaches the release step
- **THEN** it runs `bash scripts/build-release.sh --release-report apps/electron/out/release/report.json`
- **AND** it does not directly run the release signing, DMG creation, notarization submission, stapling, or assessment gates outside the canonical script
- **AND** it uploads `Wikiwise-macOS.dmg` and `apps/electron/out/release/report.json` as retained workflow artifacts after the release command succeeds

### Requirement: Release Workflow Documentation
The repository SHALL document how to run the credential-backed Electron release workflow.

#### Scenario: Developer reads release workflow documentation
- **WHEN** a developer reads the Electron release documentation
- **THEN** it lists the required GitHub secrets
- **AND** it explains that the workflow runs the canonical release script and retains the DMG plus release report
- **AND** it states that final migration completion still requires a successful signed and notarized release run or an explicitly accepted OpenSpec deviation
