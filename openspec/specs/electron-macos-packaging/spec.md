# electron-macos-packaging Specification

## Purpose
Define local Electron macOS packaging behavior, app bundle metadata parity, reviewed Electron runtime plist deltas, and the separation between unsigned local packages and signed release distribution.
## Requirements
### Requirement: Electron macOS Package Command

The repository SHALL provide an npm command that assembles a local macOS Electron app bundle.

#### Scenario: Developer packages Electron app

- **WHEN** a developer runs the Electron macOS package command
- **THEN** the command creates `apps/electron/out/Wikiwise.app`
- **AND** the command exits non-zero when the installed Electron runtime is missing

### Requirement: App Bundle Metadata

The packaged Electron app SHALL use Wikiwise product metadata.

#### Scenario: Bundle metadata is inspected

- **WHEN** the packaged app's `Contents/Info.plist` is inspected
- **THEN** it declares Wikiwise display name, bundle name, executable name, bundle identifier, short version, and icon file metadata

### Requirement: Embedded Electron App Layout

The packaged Electron app SHALL embed the current Electron workspace app and shared core package.

#### Scenario: App resources are inspected

- **WHEN** `Contents/Resources/app` is inspected
- **THEN** it contains the Electron package manifest
- **AND** it contains main, preload, and renderer source files
- **AND** it contains `node_modules/@wikiwise/core` with its package manifest and source entrypoint

### Requirement: Local Package Guardrail

The Electron packaging phase SHALL preserve the distinction between local unsigned app packaging and canonical signed release distribution.

#### Scenario: Local package command is documented

- **WHEN** a developer reads the Electron packaging documentation
- **THEN** it states that the local Electron app bundle is unsigned
- **AND** it states that production release distribution uses `bash scripts/build-release.sh <version>`
- **AND** it states that the production release path signs the app, creates a DMG, submits notarization, and staples the ticket

### Requirement: Native-Aligned Info.plist Privacy Metadata

The packaged Electron app SHALL remove unused Electron template permission and arbitrary-load transport metadata that the native Wikiwise app does not declare.

#### Scenario: Packaged Info.plist privacy metadata is inspected

- **WHEN** the packaged Electron app's `Contents/Info.plist` is inspected
- **THEN** it does not declare `NSCameraUsageDescription`
- **AND** it does not declare `NSMicrophoneUsageDescription`
- **AND** it does not declare `NSBluetoothAlwaysUsageDescription`
- **AND** it does not declare `NSBluetoothPeripheralUsageDescription`
- **AND** it does not declare `NSAppTransportSecurity` with arbitrary-loads relaxation
- **AND** Wikiwise display name, bundle name, executable name, bundle identifier, version, and icon metadata remain present

### Requirement: Native-Aligned Minimum macOS Metadata

The packaged Electron app SHALL declare the same minimum macOS version as the native Wikiwise app.

#### Scenario: Packaged Info.plist minimum system version is inspected

- **WHEN** the packaged Electron app's `Contents/Info.plist` is inspected
- **THEN** it declares `LSMinimumSystemVersion` as `14.0`
- **AND** this value matches the native SwiftPM macOS platform baseline
- **AND** this value matches the current native app bundle metadata
- **AND** Wikiwise product metadata and release packaging behavior remain unchanged

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

### Requirement: Native-Aligned Template Icon Resource Cleanup

The packaged Electron app SHALL remove the unused inherited Electron template icon resource while preserving the Wikiwise app icon.

#### Scenario: Packaged app icon resources are inspected

- **WHEN** the packaged Electron app's `Contents/Resources` directory is inspected
- **THEN** it contains `Wikiwise.icns`
- **AND** it does not contain `electron.icns`
- **AND** the packaged app's `Contents/Info.plist` still declares `CFBundleIconFile` as `Wikiwise`
- **AND** Electron runtime resources, embedded app layout, native-aligned plist metadata, and release packaging behavior remain unchanged

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

### Requirement: Package-Only Runtime Info.plist Delta Audit

The Electron package command SHALL reject unexpected package-only top-level `Info.plist` keys while allowing explicitly reviewed Electron runtime metadata that the native app bundle does not declare.

#### Scenario: Packaged Info.plist top-level key delta is inspected

- **WHEN** the Electron macOS package command rewrites the packaged app's `Contents/Info.plist`
- **THEN** it compares the packaged top-level plist keys against the current native app bundle's top-level plist keys
- **AND** package-only top-level keys are limited to `CFBundleInfoDictionaryVersion`, `ElectronAsarIntegrity`, `LSEnvironment`, `NSMainNibFile`, `NSPrefersDisplaySafeAreaCompatibilityMode`, `NSPrincipalClass`, `NSQuitAlwaysKeepsWindows`, `NSRequiresAquaSystemAppearance`, and `NSSupportsAutomaticGraphicsSwitching`
- **AND** it exits non-zero if any other package-only top-level plist key remains
- **AND** Wikiwise product metadata, native-aligned version metadata, minimum macOS metadata, template metadata cleanup, template resource cleanup, Electron runtime resources, and release packaging behavior remain unchanged

### Requirement: Packaged Node PTY Spawn Helper Permissions
The Electron macOS package command SHALL preserve an executable `node-pty` spawn helper inside the packaged app bundle.

#### Scenario: Packaged app runtime dependencies are assembled
- **WHEN** the Electron macOS package command copies runtime dependencies into `apps/electron/out/Wikiwise.app/Contents/Resources/app`
- **THEN** the packaged `node-pty` spawn helper is made executable before package verification and later release signing steps
- **AND** app bundle metadata, embedded app layout, native resource copying, and local unsigned packaging behavior remain unchanged

### Requirement: Universal Node PTY Helper Permissions
The Electron macOS packaging command SHALL repair executable permissions for every packaged Darwin `node-pty` `spawn-helper` included in the app bundle.

#### Scenario: Package contains multiple Darwin prebuild helpers
- **WHEN** `npm run electron:package:mac` packages `node-pty` with both `darwin-arm64` and `darwin-x64` prebuild helpers
- **THEN** each packaged `prebuilds/darwin-*/spawn-helper` has at least one executable permission bit
- **AND** the packaging script does not limit helper repair to the current `process.arch`

#### Scenario: Optional Darwin helper is absent
- **WHEN** a packaged `node-pty` dependency omits a Darwin prebuild helper
- **THEN** packaging continues without failing solely because that optional helper is absent
- **AND** any Darwin helpers that are present are still repaired
