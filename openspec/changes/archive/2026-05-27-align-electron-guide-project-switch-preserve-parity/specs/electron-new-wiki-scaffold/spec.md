## ADDED Requirements

### Requirement: Post-Create Guide Project Result Persistence Parity

Electron post-create guide visibility SHALL mirror native SwiftUI by preserving an already-visible guide across ordinary project result application until an explicit show or hide path changes it.

#### Scenario: User opens another project while post-create guide is visible
- **WHEN** the Electron post-create guide is visible after creating a wiki
- **AND** the user opens an existing project folder
- **THEN** Electron applies the new project result
- **AND** Electron keeps the post-create guide visible for the current project
- **AND** this matches native `openURL(_:)`, whose folder branch does not clear `showPostCreateGuide`

#### Scenario: New-wiki creation explicitly shows the post-create guide
- **WHEN** Electron successfully creates a new wiki
- **THEN** Electron applies the created project result
- **AND** Electron explicitly shows the post-create guide

#### Scenario: Explicit hide paths remain authoritative
- **WHEN** the user activates `Got it — start reading` or new-wiki scaffold creation fails
- **THEN** Electron hides the post-create guide
- **AND** ordinary project result application does not become an additional guide dismissal path
