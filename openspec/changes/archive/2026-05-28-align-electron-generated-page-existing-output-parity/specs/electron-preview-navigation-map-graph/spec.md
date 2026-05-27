## ADDED Requirements

### Requirement: Generated Page Existing Output Parity

Electron generated-page navigation SHALL match native SwiftUI by opening generated map/graph HTML only when it already exists in the compiler output directory, without triggering a whole-site compile from the navigation action.

#### Scenario: Toolbar map opens existing output
- **WHEN** the user invokes the toolbar 3D map control after project-open scanning has produced `map-3d.html`
- **THEN** Electron displays the existing generated page from the compiler output directory
- **AND** the toolbar action does not trigger a whole-site compile

#### Scenario: Toolbar map output is absent
- **WHEN** the user invokes the toolbar 3D map control and `map-3d.html` is absent from the compiler output directory
- **THEN** Electron leaves the current view unchanged
- **AND** does not trigger a whole-site compile to create the missing generated page

#### Scenario: Generated preview link fallback uses existing output
- **WHEN** a local preview link has no markdown source match and resolves to generated output such as `graph.html` or `map-3d.html`
- **THEN** Electron displays the generated page only if that HTML already exists in the compiler output directory
- **AND** does not trigger a whole-site compile from preview-link navigation
