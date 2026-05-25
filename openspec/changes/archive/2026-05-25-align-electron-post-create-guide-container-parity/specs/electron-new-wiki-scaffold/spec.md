## ADDED Requirements

### Requirement: Post-Create Guide Container Layout Parity
The Electron post-create guide SHALL match the native SwiftUI guide surface background, inset, and leading content column width.

#### Scenario: Post-create guide container is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the guide surface uses the native content background color
- **AND** the guide content uses the native 40px inset
- **AND** direct guide content is constrained to the native 560px leading-aligned column
- **AND** existing guide copy, command rendering, and dismiss behavior are preserved
