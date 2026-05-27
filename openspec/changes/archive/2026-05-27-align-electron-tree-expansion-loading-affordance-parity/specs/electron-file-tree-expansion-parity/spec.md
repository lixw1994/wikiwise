## MODIFIED Requirements

### Requirement: Expandable Project Tree
The Electron app SHALL render project folders as expandable tree nodes using the same visible-file filtering, ordering, and folder-row expansion affordances as the native macOS app.

#### Scenario: Project opens with native default expansion
- **WHEN** a project folder is opened in the Electron app
- **THEN** top-level folders except `site` are expanded by default
- **AND** their immediate children are visible without requiring a second project open
- **AND** `site` remains collapsed until the user expands it

#### Scenario: User expands a nested folder
- **WHEN** the user expands a collapsed folder inside the project tree
- **THEN** the Electron app loads that folder's immediate children
- **AND** the folder row changes to the expanded `▾` disclosure state
- **AND** the folder row does not expose a non-native temporary loading disclosure or disabled button chrome
- **AND** nested children keep native ordering, filtering, and indentation

#### Scenario: User collapses a folder
- **WHEN** the user collapses an expanded folder
- **THEN** the Electron app hides that folder's descendants
- **AND** the loaded children remain available for later re-expansion during the same tree state
