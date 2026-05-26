## ADDED Requirements

### Requirement: Native Titlebar Chrome Parity
The Electron app SHALL mirror the native SwiftUI app's visible macOS titlebar chrome for welcome and project windows.

#### Scenario: Native titlebar chrome is inspected
- **WHEN** the native Swift app source and Electron shell sources are inspected
- **THEN** the native app clears the visible window title
- **AND** the native app removes the titlebar separator
- **AND** the Electron main window uses macOS hidden-inset titlebar chrome while retaining product-facing `Wikiwise` identity
- **AND** the Electron renderer reserves leading toolbar space for native macOS traffic-light controls
- **AND** the Electron welcome and project toolbars expose draggable titlebar regions without making toolbar controls draggable
