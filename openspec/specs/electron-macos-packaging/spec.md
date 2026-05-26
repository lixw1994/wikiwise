# electron-macos-packaging Specification

## Purpose
TBD - created by archiving change package-electron-macos-app. Update Purpose after archive.
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
