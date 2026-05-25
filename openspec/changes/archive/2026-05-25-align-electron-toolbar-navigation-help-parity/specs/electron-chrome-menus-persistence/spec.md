## MODIFIED Requirements

### Requirement: Native-Like Toolbar Controls
The Electron renderer SHALL expose native-like toolbar controls for opened projects.

#### Scenario: Project toolbar is rendered
- **WHEN** a project is open
- **THEN** the toolbar includes File/Wiki mode, back, forward, appearance, 3D map, publish, right-sidebar toggle, and project title controls
- **AND** back and forward disabled states reflect renderer history
- **AND** Back exposes the native toolbar help text `Go Back (⌘[)` through `title` and `aria-label`
- **AND** Forward exposes the native toolbar help text `Go Forward (⌘])` through `title` and `aria-label`
- **AND** appearance, 3D map, and sidebar toolbar actions use icon-only native symbol semantics rather than visible text labels
- **AND** icon-only toolbar actions keep accessible labels through `title` and `aria-label`
- **AND** the project title is offset like the native toolbar when the left sidebar is visible
