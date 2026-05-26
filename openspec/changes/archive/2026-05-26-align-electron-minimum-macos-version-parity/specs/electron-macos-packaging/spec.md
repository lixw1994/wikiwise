## ADDED Requirements

### Requirement: Native-Aligned Minimum macOS Metadata

The packaged Electron app SHALL declare the same minimum macOS version as the native Wikiwise app.

#### Scenario: Packaged Info.plist minimum system version is inspected

- **WHEN** the packaged Electron app's `Contents/Info.plist` is inspected
- **THEN** it declares `LSMinimumSystemVersion` as `14.0`
- **AND** this value matches the native SwiftPM macOS platform baseline
- **AND** this value matches the current native app bundle metadata
- **AND** Wikiwise product metadata and release packaging behavior remain unchanged
