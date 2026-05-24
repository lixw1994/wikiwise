## ADDED Requirements

### Requirement: Native Window Geometry
The Electron app window SHALL match the current SwiftUI macOS app's default and minimum window geometry.

#### Scenario: Main app window is created
- **WHEN** the Electron main process creates the primary app window
- **THEN** the default window width is 1500
- **AND** the default window height is 1000
- **AND** the minimum window width is 800
- **AND** the minimum window height is 500

#### Scenario: Native source geometry is used as the reference
- **WHEN** the Electron window geometry contract is inspected
- **THEN** the default geometry matches `WikiwiseApp` `.defaultSize(width: 1500, height: 1000)`
- **AND** the minimum geometry matches `ContentView` `.frame(minWidth: 800, minHeight: 500)`
