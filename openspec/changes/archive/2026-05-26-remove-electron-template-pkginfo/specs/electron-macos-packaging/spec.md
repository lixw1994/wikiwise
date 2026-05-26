## ADDED Requirements

### Requirement: Native-Aligned Template PkgInfo Cleanup

The packaged Electron app SHALL remove the unused inherited Electron template `PkgInfo` file while preserving required app metadata and runtime resources.

#### Scenario: Packaged app bundle contents are inspected

- **WHEN** the packaged Electron app's `Contents` directory is inspected
- **THEN** it contains `Info.plist`
- **AND** it contains `MacOS/Wikiwise`
- **AND** it contains `Resources/Wikiwise.icns`
- **AND** it contains `Resources/default_app.asar`
- **AND** it does not contain `PkgInfo`
- **AND** the native `Wikiwise.app` bundle also does not contain `Contents/PkgInfo`
- **AND** Electron runtime resources, embedded app layout, native-aligned plist metadata, template icon cleanup, and release packaging behavior remain unchanged
