## ADDED Requirements

### Requirement: Native Folder Icon Visuals
The Electron file tree SHALL render native-like folder icons for directory rows.

#### Scenario: Directory rows are displayed
- **WHEN** a project tree contains directory rows
- **THEN** each directory row displays a folder icon before the folder name
- **AND** the icon uses fixed dimensions aligned with the disclosure marker and label
- **AND** the folder label keeps native serif typography and ellipsis behavior

#### Scenario: Special folders are displayed
- **WHEN** the project tree contains `raw` or `site` folders
- **THEN** those directory rows use the special folder icon treatment
- **AND** the special icon includes a center dot marker

### Requirement: Native Selected File Accent
The Electron file tree SHALL render the native selected-file visual accent.

#### Scenario: File row is selected
- **WHEN** a file row is selected in the Electron tree
- **THEN** the row keeps the selected background and italic file label
- **AND** the row displays a 2px leading accent bar aligned to the row indentation
- **AND** the selected visual does not change file loading or navigation behavior

### Requirement: Runtime Audit Evidence
The Electron runtime audit SHALL verify file-tree visual markers.

#### Scenario: Runtime audit captures file tree visuals
- **WHEN** runtime audit captures an opened-project scenario
- **THEN** it records whether folder icons are present
- **AND** it records whether a special folder marker is present
- **AND** it records whether the selected file row has accent evidence
- **AND** it fails if any required marker is missing
