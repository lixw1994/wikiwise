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
