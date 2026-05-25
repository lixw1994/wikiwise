## ADDED Requirements

### Requirement: Post-Create Guide Title Parity
The Electron post-create guide SHALL render its title with the same native SwiftUI typography and selected text color.

#### Scenario: Post-create guide title is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the `Your wiki is ready` title uses native 20px medium serif typography
- **AND** the title uses the native selected sidebar text color
- **AND** existing guide copy, container layout, command rendering, and dismiss behavior are preserved
