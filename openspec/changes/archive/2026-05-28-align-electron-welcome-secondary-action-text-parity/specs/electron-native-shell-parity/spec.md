## ADDED Requirements

### Requirement: Welcome Secondary Action Foreground Parity

The Electron no-folder welcome secondary action SHALL use the same foreground color role as the native SwiftUI "Open Existing Folder" button.

#### Scenario: Welcome secondary action is inspected
- **WHEN** the Electron welcome view is rendered before a project is open
- **THEN** the Open Existing Folder action uses `--color-sidebar-selected-text` for its label and native-symbol foreground, matching SwiftUI `Color.sidebarSelectedText`
- **AND** the shared non-welcome `.secondary-action` color remains `--color-control-text`
- **AND** welcome action labels, native-symbol metadata, width, padding, border, background, and click behavior remain unchanged
