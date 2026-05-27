## ADDED Requirements

### Requirement: Welcome Mark Foreground Parity

The Electron no-folder welcome mark SHALL use the same foreground color role as the native SwiftUI centered `W` mark.

#### Scenario: Welcome mark is inspected
- **WHEN** the Electron welcome view is rendered before a project is open
- **THEN** the centered `W` mark uses `--color-sidebar-selected-text`, matching SwiftUI `Color.sidebarSelectedText`
- **AND** the mark preserves native-like 48px light italic serif typography
- **AND** toolbar brand styling, welcome copy, action buttons, and overall welcome layout remain unchanged
