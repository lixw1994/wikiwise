## ADDED Requirements

### Requirement: Runtime App Activation Parity
The Electron app SHALL mirror the native SwiftUI app's macOS startup activation behavior.

#### Scenario: Runtime activation setup is inspected
- **WHEN** the native Swift app source and Electron main process source are inspected
- **THEN** the native app sets its activation policy to regular
- **AND** the native app activates itself while ignoring other apps
- **AND** the Electron main process applies a regular activation policy when Electron exposes the macOS API
- **AND** the Electron main process focuses the app with foreground-stealing startup semantics
- **AND** the Electron activation setup runs before normal windows or runtime audit work begin
