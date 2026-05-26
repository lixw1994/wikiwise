## ADDED Requirements

### Requirement: Runtime App Icon Parity
The Electron app SHALL use the same bundled Wikiwise app icon for its running macOS application identity as the native SwiftUI app.

#### Scenario: Runtime app icon setup is inspected
- **WHEN** the native Swift app source and Electron main process source are inspected
- **THEN** the native app sets its application icon from bundled `Wikiwise.icns`
- **AND** the Electron main process resolves the same `Wikiwise.icns` native resource
- **AND** the Electron main process derives a native Electron image from that icon resource for runtime loading
- **AND** the Electron main process applies the derived icon through the macOS Dock icon API before normal windows or runtime audit work begin
- **AND** the Electron main window receives the derived icon where Electron supports a window icon option
