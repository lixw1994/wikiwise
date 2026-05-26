## ADDED Requirements

### Requirement: Native-Aligned Template Icon Resource Cleanup

The packaged Electron app SHALL remove the unused inherited Electron template icon resource while preserving the Wikiwise app icon.

#### Scenario: Packaged app icon resources are inspected

- **WHEN** the packaged Electron app's `Contents/Resources` directory is inspected
- **THEN** it contains `Wikiwise.icns`
- **AND** it does not contain `electron.icns`
- **AND** the packaged app's `Contents/Info.plist` still declares `CFBundleIconFile` as `Wikiwise`
- **AND** Electron runtime resources, embedded app layout, native-aligned plist metadata, and release packaging behavior remain unchanged
