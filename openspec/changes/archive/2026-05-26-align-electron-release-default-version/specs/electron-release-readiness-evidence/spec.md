## ADDED Requirements

### Requirement: Native-Aligned Readiness Version Evidence
Electron release readiness evidence SHALL prove the no-argument release path resolves to the native app bundle version.

#### Scenario: No-argument readiness report is blocked by credentials
- **WHEN** the Electron release readiness command runs without an explicit release version and credential prerequisites are missing
- **THEN** it writes a blocked readiness report
- **AND** the report `version` matches the native app `CFBundleShortVersionString`
- **AND** the report still records that no release artifacts, signed app, or notarized DMG were produced
