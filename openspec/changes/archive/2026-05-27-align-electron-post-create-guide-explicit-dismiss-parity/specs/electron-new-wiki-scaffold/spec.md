## ADDED Requirements

### Requirement: Post-Create Guide Explicit Dismiss Parity

Electron post-create guide visibility SHALL mirror native SwiftUI by remaining visible until the user explicitly activates the guide dismissal action.

#### Scenario: User selects a file while post-create guide is visible
- **WHEN** the post-create guide is visible after creating a wiki
- **AND** the user selects a file from the sidebar
- **THEN** Electron may update selected-file state behind the guide
- **AND** Electron keeps the post-create guide visible
- **AND** this matches native `navigateTo(_:)`, which does not clear `showPostCreateGuide`

#### Scenario: User opens a generated page while post-create guide is visible
- **WHEN** the post-create guide is visible after creating a wiki
- **AND** the user activates generated-page navigation such as the 3D map toolbar action
- **THEN** Electron may update generated-page state behind the guide
- **AND** Electron keeps the post-create guide visible
- **AND** this matches the native generated-page toolbar path, which does not clear `showPostCreateGuide`

#### Scenario: User dismisses the post-create guide explicitly
- **WHEN** the user activates `Got it — start reading`
- **THEN** Electron hides the post-create guide
- **AND** Electron selects `wiki/home.md` when it exists
- **AND** no incidental navigation path becomes an additional guide dismissal path
