## ADDED Requirements

### Requirement: Native-Aligned Default Bundle Version Metadata

The no-argument local Electron package command SHALL default to the current native app bundle version metadata while preserving explicit release-version overrides.

#### Scenario: Local package Info.plist version metadata is inspected

- **WHEN** the Electron macOS package command runs without an explicit version argument
- **THEN** the packaged app's `CFBundleShortVersionString` matches the current native app bundle's `CFBundleShortVersionString`
- **AND** the packaged app's `CFBundleVersion` matches the current native app bundle's `CFBundleVersion`
- **AND** Wikiwise product metadata, minimum macOS metadata, privacy metadata cleanup, and release packaging behavior remain unchanged

#### Scenario: Explicit release version is supplied

- **WHEN** the Electron macOS package command runs with an explicit release version
- **THEN** the packaged app's `CFBundleShortVersionString` uses that explicit release version
- **AND** the canonical release script continues to pass its `<version>` argument into the package command
