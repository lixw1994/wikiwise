## ADDED Requirements

### Requirement: Welcome Toolbar Brand Parity
The Electron no-folder state SHALL include the native SwiftUI welcome toolbar brand chrome.

#### Scenario: Welcome toolbar is inspected
- **WHEN** the Electron welcome view is rendered
- **THEN** it includes a visible welcome toolbar before the centered welcome content
- **AND** the toolbar includes an italic `W` mark
- **AND** the toolbar includes the `WikiWise` label
- **AND** the toolbar uses native toolbar spacing, typography, and warm toolbar background
- **AND** the existing Create a New Wiki and Open Existing Folder actions remain available
