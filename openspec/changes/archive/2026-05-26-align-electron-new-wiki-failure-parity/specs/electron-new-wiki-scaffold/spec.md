## ADDED Requirements

### Requirement: New Wiki Failure Dismissal Parity
The Electron new-wiki flow SHALL mirror native SwiftUI scaffold failure behavior by dismissing the create dialog without opening a project or showing the post-create guide.

#### Scenario: Scaffold creation fails
- **WHEN** the user submits a valid new-wiki name and location
- **AND** scaffold creation fails
- **THEN** the Electron create dialog is dismissed
- **AND** no project result is applied
- **AND** the post-create guide is not shown
- **AND** the renderer does not keep a visible create-failure error panel in the shell
