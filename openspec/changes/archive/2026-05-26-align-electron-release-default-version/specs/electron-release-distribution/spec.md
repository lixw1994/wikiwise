## ADDED Requirements

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
