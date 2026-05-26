## ADDED Requirements

### Requirement: Native-Aligned Template Build Metadata Cleanup

The packaged Electron app SHALL remove non-runtime Electron template build-provenance and category plist metadata that the current native app bundle does not declare.

#### Scenario: Packaged Info.plist template build metadata is inspected

- **WHEN** the packaged Electron app's `Contents/Info.plist` is inspected
- **THEN** it does not declare `DTCompiler`
- **AND** it does not declare `DTSDKBuild`
- **AND** it does not declare `DTSDKName`
- **AND** it does not declare `DTXcode`
- **AND** it does not declare `DTXcodeBuild`
- **AND** it does not declare `LSApplicationCategoryType`
- **AND** Wikiwise product metadata, Electron runtime-required metadata, native-aligned version metadata, minimum macOS metadata, privacy metadata cleanup, and release packaging behavior remain unchanged
