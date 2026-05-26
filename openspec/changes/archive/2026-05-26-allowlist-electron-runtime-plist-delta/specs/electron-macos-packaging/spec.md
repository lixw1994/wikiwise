## ADDED Requirements

### Requirement: Package-Only Runtime Info.plist Delta Audit

The Electron package command SHALL reject unexpected package-only top-level `Info.plist` keys while allowing explicitly reviewed Electron runtime metadata that the native app bundle does not declare.

#### Scenario: Packaged Info.plist top-level key delta is inspected

- **WHEN** the Electron macOS package command rewrites the packaged app's `Contents/Info.plist`
- **THEN** it compares the packaged top-level plist keys against the current native app bundle's top-level plist keys
- **AND** package-only top-level keys are limited to `CFBundleInfoDictionaryVersion`, `ElectronAsarIntegrity`, `LSEnvironment`, `NSMainNibFile`, `NSPrefersDisplaySafeAreaCompatibilityMode`, `NSPrincipalClass`, `NSQuitAlwaysKeepsWindows`, `NSRequiresAquaSystemAppearance`, and `NSSupportsAutomaticGraphicsSwitching`
- **AND** it exits non-zero if any other package-only top-level plist key remains
- **AND** Wikiwise product metadata, native-aligned version metadata, minimum macOS metadata, template metadata cleanup, template resource cleanup, Electron runtime resources, and release packaging behavior remain unchanged
