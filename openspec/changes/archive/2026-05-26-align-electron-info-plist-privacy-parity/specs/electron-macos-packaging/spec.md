## ADDED Requirements

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
