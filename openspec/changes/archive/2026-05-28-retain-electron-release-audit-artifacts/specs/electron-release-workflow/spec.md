## MODIFIED Requirements

### Requirement: Canonical Release Script Delegation
The Electron release workflow SHALL delegate release production to the canonical Electron release script.

#### Scenario: Workflow release step runs
- **WHEN** the workflow reaches the release step
- **THEN** it runs `bash scripts/build-release.sh --release-report apps/electron/out/release/report.json`
- **AND** it does not directly run the release signing, DMG creation, notarization submission, stapling, or assessment gates outside the canonical script
- **AND** it uploads `Wikiwise-macOS.dmg`, `apps/electron/out/release/report.json`, `apps/electron/out/runtime-audit/report.json`, `apps/electron/out/runtime-audit/screenshots/`, and `apps/electron/out/packaged-runtime-audit/report.json` as retained workflow artifacts after the release command succeeds

### Requirement: Release Workflow Documentation
The repository SHALL document how to run the credential-backed Electron release workflow.

#### Scenario: Developer reads release workflow documentation
- **WHEN** a developer reads the Electron release documentation
- **THEN** it lists the required GitHub secrets
- **AND** it explains that the workflow runs the canonical release script and retains the DMG, release report, detailed runtime audit evidence, and packaged runtime smoke evidence
- **AND** it states that final migration completion still requires a successful signed and notarized release run or an explicitly accepted OpenSpec deviation
